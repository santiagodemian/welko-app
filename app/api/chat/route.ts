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
import OpenAI from 'openai'
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

function getOpenAI(): OpenAI {
  const key = process.env.OPENAI_API_KEY
  if (!key) throw new Error('[Welko] OPENAI_API_KEY is not set.')
  return new OpenAI({ apiKey: key })
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
        // Infer specialty from clinic specialties if not provided
        if (!specialty && clinic.specialties) {
          const specs = clinic.specialties as string[]
          if (specs.length > 0) specialty = specs[0].toLowerCase().replace(/[áéíóú]/g, (c) => ({á:'a',é:'e',í:'i',ó:'o',ú:'u'}[c] ?? c))
        }
      }
    } catch {
      // proceed with defaults if DB fails
    }
  }

  const systemPrompt = buildSystemPrompt(clinicContext, specialty)
  const openai = getOpenAI()

  // ── 1. Generate AI reply ─────────────────────────────────────────────────────
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
    ],
    max_tokens: 300,
    temperature: 0.7,
  })

  const reply = completion.choices[0]?.message?.content?.trim() ?? 'Un momento, ¿en qué le puedo ayudar?'

  // ── 2. Extract scheduling data (only when conversation has ≥3 user messages) ─
  const userMessages = messages.filter(m => m.role === 'user')
  let extractedLead: ExtractedLead | null = null

  if (userMessages.length >= 2) {
    try {
      const conversationText = messages
        .map(m => `${m.role === 'user' ? 'Paciente' : 'Recepcionista'}: ${m.content}`)
        .join('\n')

      const extraction = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: EXTRACTION_SYSTEM_PROMPT },
          { role: 'user', content: conversationText },
        ],
        max_tokens: 150,
        temperature: 0,
        response_format: { type: 'json_object' },
      })

      const raw = extraction.choices[0]?.message?.content
      if (raw) {
        extractedLead = JSON.parse(raw) as ExtractedLead

        // ── 3. Save lead to CRM if ready ─────────────────────────────────────────
        if (extractedLead.listo_para_agendar && clinicId) {
          try {
            const clinic = await db.clinic.findUnique({
              where: { id: clinicId },
              select: { id: true },
            })
            if (clinic) {
              await db.lead.create({
                data: {
                  clinicId: clinic.id,
                  patientName:  extractedLead.nombre  ? encrypt(extractedLead.nombre)  : null,
                  patientPhone: extractedLead.telefono ? encrypt(extractedLead.telefono) : null,
                  notes: extractedLead.procedimiento
                    ? encrypt(`Procedimiento: ${extractedLead.procedimiento}${extractedLead.fecha ? ` | Fecha: ${extractedLead.fecha}` : ''}`)
                    : null,
                  status:  'NUEVO',
                  channel: 'WEB',
                },
              })
            }
          } catch {
            // CRM save is non-blocking — don't fail the chat
          }
        }
      }
    } catch {
      // Extraction is non-blocking
    }
  }

  return NextResponse.json({
    reply,
    ...(extractedLead ? { lead: extractedLead } : {}),
  })
}
