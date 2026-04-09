/**
 * POST /api/webhooks/whatsapp
 *
 * Twilio WhatsApp webhook — receives incoming patient messages,
 * routes to the correct clinic via the Twilio `To` phone number,
 * calls the AI engine, and sends the reply back via WhatsApp.
 *
 * Twilio sends form-encoded POST with at minimum:
 *   From    — patient's phone, e.g. "whatsapp:+521234567890"
 *   To      — clinic's Twilio number, e.g. "whatsapp:+14155238886"
 *   Body    — message text
 *   MessageSid — unique message ID
 */

import * as Sentry from '@sentry/nextjs'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { buildSystemPrompt, buildExtractionPrompt } from '@/lib/system_prompts'
import { encrypt } from '@/lib/encryption'
import { sendWhatsApp } from '@/lib/twilio'

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

// Keep last 10 messages per session (WhatsApp = stateful)
const MAX_HISTORY = 10

export async function POST(req: NextRequest) {
  // Parse Twilio's form-encoded body
  const text = await req.text()
  const params = new URLSearchParams(text)

  const rawFrom = params.get('From') ?? ''           // "whatsapp:+521234567890"
  const rawTo   = params.get('To')   ?? ''           // "whatsapp:+14155238886"
  const body    = (params.get('Body') ?? '').trim()

  // Strip the "whatsapp:" prefix
  const fromPhone = rawFrom.replace('whatsapp:', '')
  const toPhone   = rawTo.replace('whatsapp:', '')

  if (!fromPhone || !toPhone || !body) {
    return new NextResponse('OK', { status: 200 }) // ignore malformed
  }

  // ── Find clinic by assigned WhatsApp number ──────────────────────────────────
  let clinic: Awaited<ReturnType<typeof db.clinic.findUnique>> = null
  try {
    clinic = await db.clinic.findUnique({
      where: { whatsappPhone: toPhone },
      include: { services: { where: { active: true } } },
    })
  } catch {
    return new NextResponse('OK', { status: 200 })
  }

  if (!clinic) {
    // Number not linked to any clinic — silently ignore
    return new NextResponse('OK', { status: 200 })
  }

  // ── Load conversation history (last MAX_HISTORY messages) ───────────────────
  const history = await db.whatsAppConversation.findMany({
    where: { clinicId: clinic.id, fromPhone },
    orderBy: { createdAt: 'asc' },
    take: MAX_HISTORY,
  })

  const chatMessages = history.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }))

  // Save the new user message
  await db.whatsAppConversation.create({
    data: { clinicId: clinic.id, fromPhone, role: 'user', content: body },
  })
  chatMessages.push({ role: 'user', content: body })

  // ── Build clinic context for system prompt ───────────────────────────────────
  let specialty: string | undefined
  if (clinic.specialties) {
    const specs = clinic.specialties as string[]
    if (specs.length > 0) {
      specialty = specs[0].toLowerCase()
        .replace(/á/g,'a').replace(/é/g,'e').replace(/í/g,'i').replace(/ó/g,'o').replace(/ú/g,'u')
    }
  }

  const clinicContext = {
    name:                clinic.name,
    agentName:           clinic.aiAgentName ?? 'Sofía',
    tone:                clinic.aiTone ?? 'profesional',
    phone:               clinic.phone ?? undefined,
    address:             clinic.address ?? undefined,
    website:             clinic.website ?? undefined,
    specialties:         (clinic.specialties as string[] | null) ?? [],
    workingHours:        (clinic.workingHours as Record<string, { open: string; close: string; active: boolean }> | null) ?? undefined,
    services:            (clinic as any).services.map((s: any) => ({
      name: s.name,
      priceMin: s.priceMin ?? undefined,
      priceMax: s.priceMax ?? undefined,
      durationMins: s.durationMins ?? undefined,
    })),
    paymentMethods:      (clinic.paymentMethods as string[] | null) ?? [],
    insurancesAccepted:  (clinic.insurancesAccepted as string[] | null) ?? [],
    cancellationPolicy:  clinic.cancellationPolicy ?? undefined,
    hasParking:          clinic.hasParking,
    hasInvoicing:        clinic.hasInvoicing,
    faqs:                (clinic.faqs as { question: string; answer: string }[] | null) ?? [],
  }

  const systemPrompt = buildSystemPrompt(clinicContext, specialty)

  // ── Call AI ──────────────────────────────────────────────────────────────────
  let reply: string
  try {
    reply = await openaiChat(
      [{ role: 'system', content: systemPrompt }, ...chatMessages],
      { max_tokens: 300, temperature: 0.7 }
    )
  } catch (err) {
    console.error('[WA] AI error:', err)
    Sentry.captureException(err, { tags: { webhook: 'whatsapp', step: 'openai_reply' }, extra: { clinicId: clinic.id } })
    return new NextResponse('OK', { status: 200 })
  }

  // Save assistant reply
  await db.whatsAppConversation.create({
    data: { clinicId: clinic.id, fromPhone, role: 'assistant', content: reply },
  })

  // ── Extract lead & save to CRM (after ≥2 user messages) ─────────────────────
  const userMessages = chatMessages.filter(m => m.role === 'user')

  if (userMessages.length >= 2) {
    try {
      const conversationText = chatMessages
        .map(m => `${m.role === 'user' ? 'Paciente' : 'Recepcionista'}: ${m.content}`)
        .join('\n')

      const raw = await openaiChat(
        [
          { role: 'system', content: buildExtractionPrompt() },
          { role: 'user', content: conversationText },
        ],
        { max_tokens: 150, temperature: 0, json: true }
      )

      const lead = JSON.parse(raw)

      if (lead.listo_para_agendar) {
        // Check if a lead for this patient already exists (avoid duplicates)
        const encPhone = fromPhone ? encrypt(fromPhone) : null
        const existing = encPhone
          ? await db.lead.findFirst({ where: { clinicId: clinic.id, patientPhone: encPhone } })
          : null

        if (!existing) {
          const appointmentAt = lead.fecha_iso
            ? new Date(lead.fecha_iso)
            : null
          await db.lead.create({
            data: {
              clinicId:    clinic.id,
              patientName:  lead.nombre   ? encrypt(lead.nombre)   : null,
              patientPhone: fromPhone     ? encrypt(fromPhone)     : null,
              notes: lead.procedimiento
                ? encrypt(`Procedimiento: ${lead.procedimiento}${lead.fecha ? ` | Fecha: ${lead.fecha}` : ''}`)
                : null,
              appointmentAt: appointmentAt && !isNaN(appointmentAt.getTime()) ? appointmentAt : null,
              status:  'NUEVO',
              channel: 'WHATSAPP',
            },
          })
        }
      }
    } catch {
      // non-blocking
    }
  }

  // ── Send WhatsApp reply ──────────────────────────────────────────────────────
  try {
    await sendWhatsApp(fromPhone, reply)
  } catch (err) {
    console.error('[WA] Send error:', err)
    Sentry.captureException(err, { tags: { webhook: 'whatsapp', step: 'send_message' }, extra: { clinicId: clinic.id } })
  }

  // Twilio expects a 200 response (can be empty or TwiML — we handle via REST)
  return new NextResponse('OK', { status: 200 })
}
