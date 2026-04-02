/**
 * POST /api/chat
 *
 * Motor de Inteligencia Médica — Recepcionista Senior Welko
 *
 * Body:
 *   messages     ChatMessage[]   — historial de la conversación
 *   clinicId?    string          — ID de la clínica (para cargar su contexto)
 *   specialty?   string          — slug de especialidad (dental, psicologia, etc.)
 *
 * Returns:
 *   { reply: string, lead?: ExtractedLead }
 */

import { NextRequest, NextResponse } from 'next/server'
import { buildSystemPrompt, EXTRACTION_SYSTEM_PROMPT } from '@/lib/system_prompts'
import { db } from '@/lib/db'
import { encrypt } from '@/lib/encryption'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ExtractedLead {
  nombre: string | null
  procedimiento: string | null
  fecha: string | null
  telefono: string | null
  listo_para_agendar: boolean
}

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions'

async function openaiChat(
  messages: { role: string; content: string }[],
  opts: { max_tokens?: number; temperature?: number; json?: boolean } = {}
): Promise<string> {
  const key = process.env.OPENAI_API_KEY
  if (!key) throw new Error('[Welko] OPENAI_API_KEY is not set.')

  const body: Record<string, unknown> = {
    model: 'gpt-4o-mini',
    messages,
    max_tokens: opts.max_tokens ?? 300,
    temperature: opts.temperature ?? 0.7,
  }
  if (opts.json) body.response_format = { type: 'json_object' }

  const res = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify(body),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data?.error?.message ?? 'OpenAI error')
  return data.choices[0]?.message?.content?.trim() ?? ''
}

export async function POST(req: NextRequest) {
  let messages: ChatMessage[]
  let clinicId: string | undefined
  let specialty: string | undefined

  try {
    const body = await req.json()
    messages  = body.messages
    clinicId  = body.clinicId
    specialty = body.specialty
    if (!Array.isArray(messages) || messages.length === 0) throw new Error('invalid messages')
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  // ── Load clinic context from DB ──────────────────────────────────────────────
  let clinicContext = {
    name: 'la clínica',
    agentName: 'Sofía',
    tone: 'profesional',
    phone: undefined as string | undefined,
    address: undefined as string | undefined,
    website: undefined as string | undefined,
    specialties: [] as string[],
    workingHours: undefined as Record<string, { open: string; close: string; active: boolean }> | undefined,
    services: [] as { name: string; priceMin?: number; priceMax?: number; durationMins?: number }[],
    paymentMethods: [] as string[],
    insurancesAccepted: [] as string[],
    cancellationPolicy: undefined as string | undefined,
    hasParking: false,
    hasInvoicing: false,
    faqs: [] as { question: string; answer: string }[],
  }

  if (clinicId) {
    try {
      const clinic = await db.clinic.findUnique({
        where: { id: clinicId },
        include: { services: { where: { active: true } } },
      })
      if (clinic) {
        clinicContext = {
          name: clinic.name,
          agentName: clinic.aiAgentName ?? 'Sofía',
          tone: clinic.aiTone ?? 'profesional',
          phone: clinic.phone ?? undefined,
          address: clinic.address ?? undefined,
          website: clinic.website ?? undefined,
          specialties: (clinic.specialties as string[] | null) ?? [],
          workingHours: (clinic.workingHours as Record<string, { open: string; close: string; active: boolean }> | null) ?? undefined,
          services: clinic.services.map(s => ({
            name: s.name,
            priceMin: s.priceMin ?? undefined,
            priceMax: s.priceMax ?? undefined,
            durationMins: s.durationMins ?? undefined,
          })),
          paymentMethods: (clinic.paymentMethods as string[] | null) ?? [],
          insurancesAccepted: (clinic.insurancesAccepted as string[] | null) ?? [],
          cancellationPolicy: clinic.cancellationPolicy ?? undefined,
          hasParking: clinic.hasParking,
          hasInvoicing: clinic.hasInvoicing,
          faqs: (clinic.faqs as { question: string; answer: string }[] | null) ?? [],
        }
        if (!specialty && clinic.specialties) {
          const specs = clinic.specialties as string[]
          if (specs.length > 0) {
            specialty = specs[0].toLowerCase()
              .replace(/á/g,'a').replace(/é/g,'e').replace(/í/g,'i').replace(/ó/g,'o').replace(/ú/g,'u')
          }
        }
      }
    } catch {
      // proceed with defaults
    }
  }

  const systemPrompt = buildSystemPrompt(clinicContext, specialty)

  // ── 1. Generate AI reply ─────────────────────────────────────────────────────
  let reply: string
  try {
    reply = await openaiChat(
      [{ role: 'system', content: systemPrompt }, ...messages],
      { max_tokens: 300, temperature: 0.7 }
    )
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }

  // ── 2. Extract scheduling data (after ≥2 user messages) ─────────────────────
  const userMessages = messages.filter(m => m.role === 'user')
  let extractedLead: ExtractedLead | null = null

  if (userMessages.length >= 2) {
    try {
      const conversationText = messages
        .map(m => `${m.role === 'user' ? 'Paciente' : 'Recepcionista'}: ${m.content}`)
        .join('\n')

      const raw = await openaiChat(
        [
          { role: 'system', content: EXTRACTION_SYSTEM_PROMPT },
          { role: 'user', content: conversationText },
        ],
        { max_tokens: 150, temperature: 0, json: true }
      )

      extractedLead = JSON.parse(raw) as ExtractedLead

      // ── 3. Save lead to CRM if ready ───────────────────────────────────────────
      if (extractedLead.listo_para_agendar && clinicId) {
        try {
          await db.lead.create({
            data: {
              clinicId,
              patientName:  extractedLead.nombre   ? encrypt(extractedLead.nombre)   : null,
              patientPhone: extractedLead.telefono  ? encrypt(extractedLead.telefono) : null,
              notes: extractedLead.procedimiento
                ? encrypt(`Procedimiento: ${extractedLead.procedimiento}${extractedLead.fecha ? ` | Fecha: ${extractedLead.fecha}` : ''}`)
                : null,
              status:  'NUEVO',
              channel: 'WEB',
            },
          })
        } catch {
          // non-blocking
        }
      }
    } catch {
      // non-blocking
    }
  }

  return NextResponse.json({
    reply,
    ...(extractedLead ? { lead: extractedLead } : {}),
  })
}
