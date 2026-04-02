/**
 * POST /api/voice/activate
 *
 * Creates (or updates) a Vapi assistant for the clinic using their AI config,
 * then buys a phone number and assigns it to the assistant.
 *
 * PATCH /api/voice/activate
 *
 * Re-syncs the assistant prompt if the clinic updated their AI config.
 */

import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { buildSystemPrompt } from '@/lib/system_prompts'

const VAPI = 'https://api.vapi.ai'
const KEY  = () => process.env.VAPI_PRIVATE_KEY!

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function vapiRequest(method: string, path: string, body?: object) {
  const res = await fetch(`${VAPI}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${KEY()}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json()
  return { ok: res.ok, status: res.status, data }
}

function buildAssistantPayload(clinic: {
  name: string
  aiAgentName: string | null
  aiTone: string | null
  phone: string | null
  address: string | null
  website: string | null
  specialties: unknown
  workingHours: unknown
  services: { name: string; priceMin: number | null; priceMax: number | null; durationMins: number | null }[]
  paymentMethods: unknown
  insurancesAccepted: unknown
  cancellationPolicy: string | null
  hasParking: boolean
  hasInvoicing: boolean
  faqs: unknown
  id: string
}) {
  const agentName = clinic.aiAgentName || 'Sofía'

  const systemPrompt = buildSystemPrompt({
    name:               clinic.name,
    agentName:          clinic.aiAgentName ?? undefined,
    tone:               clinic.aiTone ?? undefined,
    phone:              clinic.phone ?? undefined,
    address:            clinic.address ?? undefined,
    website:            clinic.website ?? undefined,
    specialties:        (clinic.specialties as string[]) ?? [],
    workingHours:       clinic.workingHours as Record<string, { open: string; close: string; active: boolean }> | undefined,
    services:           clinic.services.map(s => ({
      name:         s.name,
      priceMin:     s.priceMin ?? undefined,
      priceMax:     s.priceMax ?? undefined,
      durationMins: s.durationMins ?? undefined,
    })),
    paymentMethods:     (clinic.paymentMethods as string[]) ?? [],
    insurancesAccepted: (clinic.insurancesAccepted as string[]) ?? [],
    cancellationPolicy: clinic.cancellationPolicy ?? undefined,
    hasParking:         clinic.hasParking,
    hasInvoicing:       clinic.hasInvoicing,
    faqs:               (clinic.faqs as { question: string; answer: string }[]) ?? [],
  })

  // Voice-specific addendum: short, conversational, no markdown
  const voiceAddendum = `

## CANAL: LLAMADA DE VOZ
- Responde en frases CORTAS (máx 2-3 oraciones por turno).
- NO uses listas, viñetas ni markdown — hablas, no escribes.
- Deletrea números y precios con palabras: "mil novecientos noventa y nueve pesos".
- Si el paciente no se escucha claro, di: "Disculpe, ¿me puede repetir eso?".
- Al despedirte di siempre: "Que tenga excelente día. Hasta luego."
`

  return {
    name: `Welko — ${clinic.name}`,
    model: {
      provider: 'openai',
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: systemPrompt + voiceAddendum }],
      temperature: 0.35,
    },
    voice: {
      provider: 'azure',
      voiceId: 'es-MX-DaliaNeural',
    },
    transcriber: {
      provider: 'deepgram',
      model: 'nova-2',
      language: 'es',
    },
    firstMessage: `Hola, bienvenido a ${clinic.name}. Soy ${agentName}, ¿en qué puedo ayudarle?`,
    serverUrl: 'https://welko.agency/api/webhook/voice',
    serverUrlSecret: process.env.VAPI_WEBHOOK_SECRET ?? undefined,
    metadata: { clinic_id: clinic.id },
    endCallMessage: 'Fue un placer atenderle. Que tenga excelente día.',
    endCallPhrases: ['adiós', 'hasta luego', 'muchas gracias adiós', 'bye'],
    maxDurationSeconds: 600,
    silenceTimeoutSeconds: 20,
    responseDelaySeconds: 0.4,
  }
}

// ─── POST — create assistant + buy number ─────────────────────────────────────

export async function POST() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const clinic = await db.clinic.findUnique({
    where: { clerkUserId: userId },
    include: { services: { where: { active: true } } },
  })
  if (!clinic) return NextResponse.json({ error: 'Clinic not found' }, { status: 404 })

  const payload = buildAssistantPayload(clinic)

  // ── Create or update Vapi assistant ─────────────────────────────────────────
  let assistantId = clinic.vapiAssistantId

  if (assistantId) {
    await vapiRequest('PATCH', `/assistant/${assistantId}`, payload)
  } else {
    const { ok, data } = await vapiRequest('POST', '/assistant', payload)
    if (!ok) return NextResponse.json({ error: data?.message ?? 'Error creating assistant' }, { status: 500 })
    assistantId = data.id as string
    await db.clinic.update({ where: { id: clinic.id }, data: { vapiAssistantId: assistantId } })
  }

  // ── Buy phone number if not already assigned ─────────────────────────────────
  let phoneNumber = clinic.voicePhoneNumber
  let phoneNumberId = clinic.vapiPhoneNumberId

  if (!phoneNumber) {
    const { ok: pOk, data: pData } = await vapiRequest('POST', '/phone-number', {
      provider: 'vapi',
      assistantId,
      name: `Welko — ${clinic.name}`,
    })

    if (pOk && pData?.number) {
      phoneNumber   = pData.number  as string
      phoneNumberId = pData.id      as string
      await db.clinic.update({
        where: { id: clinic.id },
        data: { voicePhoneNumber: phoneNumber, vapiPhoneNumberId: phoneNumberId },
      })
    }
    // If number purchase fails, still return success — clinic has the assistant
  }

  return NextResponse.json({ ok: true, assistantId, phoneNumber, phoneNumberId })
}

// ─── PATCH — re-sync assistant prompt only ───────────────────────────────────

export async function PATCH() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const clinic = await db.clinic.findUnique({
    where: { clerkUserId: userId },
    include: { services: { where: { active: true } } },
  })
  if (!clinic?.vapiAssistantId) {
    return NextResponse.json({ error: 'No assistant configured' }, { status: 400 })
  }

  const payload = buildAssistantPayload(clinic)
  const { ok, data } = await vapiRequest('PATCH', `/assistant/${clinic.vapiAssistantId}`, payload)

  if (!ok) return NextResponse.json({ error: data?.message ?? 'Vapi error' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
