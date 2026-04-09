/**
 * GET  /api/webhooks/meta  — Meta webhook verification (hub.challenge)
 * POST /api/webhooks/meta  — Incoming Facebook Messenger & Instagram DMs
 *
 * Meta sends messages for both channels in the same format:
 *   entry[].id          — Page ID (Messenger) or IG account ID (Instagram)
 *   entry[].messaging[] — array of message events
 *     .sender.id        — PSID / IGSID of the person who sent the message
 *     .recipient.id     — Page ID / IG account ID that received it
 *     .message.text     — message text
 */

import * as Sentry from '@sentry/nextjs'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { buildSystemPrompt, buildExtractionPrompt } from '@/lib/system_prompts'
import { encrypt, decrypt } from '@/lib/encryption'
import { sendMetaMessage } from '@/lib/meta'

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
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error?.message ?? 'OpenAI error')
  return data.choices[0]?.message?.content?.trim() ?? ''
}

// ── GET — Webhook verification ────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const mode      = searchParams.get('hub.mode')
  const token     = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === process.env.META_WEBHOOK_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 })
  }
  return new NextResponse('Forbidden', { status: 403 })
}

const MAX_HISTORY = 10

// ── POST — Incoming messages ──────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body) return new NextResponse('OK', { status: 200 })

  const object: string = body.object ?? ''  // "page" or "instagram"
  const channel = object === 'instagram' ? 'instagram' : 'messenger'

  for (const entry of (body.entry ?? [])) {
    const pageId    = entry.id as string
    const messaging = (entry.messaging ?? entry.messages ?? []) as any[]

    for (const event of messaging) {
      // Ignore echo / delivery / read events
      if (!event.message?.text || event.message?.is_echo) continue

      const senderId = event.sender?.id as string
      const text     = (event.message.text as string).trim()

      if (!senderId || !text) continue

      // ── Find clinic ────────────────────────────────────────────────────────
      const clinic = await db.clinic.findFirst({
        where: channel === 'instagram'
          ? { instagramAccountId: pageId }
          : { facebookPageId: pageId },
        include: { services: { where: { active: true } } },
      })

      if (!clinic || !clinic.facebookPageToken) continue

      let pageToken: string
      try { pageToken = decrypt(clinic.facebookPageToken) }
      catch { continue }

      // ── Load conversation history ────────────────────────────────────────
      const history = await db.metaConversation.findMany({
        where: { clinicId: clinic.id, senderId, channel },
        orderBy: { createdAt: 'asc' },
        take: MAX_HISTORY,
      })

      const chatMessages = history.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }))

      await db.metaConversation.create({
        data: { clinicId: clinic.id, senderId, channel, role: 'user', content: text },
      })
      chatMessages.push({ role: 'user', content: text })

      // ── Build clinic context ───────────────────────────────────────────────
      let specialty: string | undefined
      if (clinic.specialties) {
        const specs = clinic.specialties as string[]
        if (specs.length > 0) {
          specialty = specs[0].toLowerCase()
            .replace(/á/g,'a').replace(/é/g,'e').replace(/í/g,'i').replace(/ó/g,'o').replace(/ú/g,'u')
        }
      }

      const clinicContext = {
        name:               clinic.name,
        agentName:          clinic.aiAgentName ?? 'Sofía',
        tone:               clinic.aiTone ?? 'profesional',
        phone:              clinic.phone ?? undefined,
        address:            clinic.address ?? undefined,
        website:            clinic.website ?? undefined,
        specialties:        (clinic.specialties as string[] | null) ?? [],
        workingHours:       (clinic.workingHours as Record<string, { open: string; close: string; active: boolean }> | null) ?? undefined,
        services:           (clinic as any).services.map((s: any) => ({
          name: s.name, priceMin: s.priceMin ?? undefined,
          priceMax: s.priceMax ?? undefined, durationMins: s.durationMins ?? undefined,
        })),
        paymentMethods:     (clinic.paymentMethods as string[] | null) ?? [],
        insurancesAccepted: (clinic.insurancesAccepted as string[] | null) ?? [],
        cancellationPolicy: clinic.cancellationPolicy ?? undefined,
        hasParking:         clinic.hasParking,
        hasInvoicing:       clinic.hasInvoicing,
        faqs:               (clinic.faqs as { question: string; answer: string }[] | null) ?? [],
      }

      const systemPrompt = buildSystemPrompt(clinicContext, specialty)

      // ── AI reply ───────────────────────────────────────────────────────────
      let reply: string
      try {
        reply = await openaiChat(
          [{ role: 'system', content: systemPrompt }, ...chatMessages],
          { max_tokens: 300, temperature: 0.7 }
        )
      } catch (err) {
        console.error('[Meta] AI error:', err)
        Sentry.captureException(err, { tags: { webhook: 'meta', step: 'openai_reply' }, extra: { clinicId: clinic.id, channel } })
        continue
      }

      await db.metaConversation.create({
        data: { clinicId: clinic.id, senderId, channel, role: 'assistant', content: reply },
      })

      // ── Lead extraction ────────────────────────────────────────────────────
      const userMsgs = chatMessages.filter(m => m.role === 'user')
      if (userMsgs.length >= 2) {
        try {
          const convText = chatMessages
            .map(m => `${m.role === 'user' ? 'Paciente' : 'Recepcionista'}: ${m.content}`)
            .join('\n')
          const raw  = await openaiChat(
            [{ role: 'system', content: buildExtractionPrompt() }, { role: 'user', content: convText }],
            { max_tokens: 150, temperature: 0, json: true }
          )
          const lead = JSON.parse(raw)
          if (lead.listo_para_agendar) {
            const appointmentAt = lead.fecha_iso ? new Date(lead.fecha_iso) : null
            await db.lead.create({
              data: {
                clinicId:    clinic.id,
                patientName:  lead.nombre    ? encrypt(lead.nombre)    : null,
                patientPhone: lead.telefono  ? encrypt(lead.telefono)  : null,
                notes: lead.procedimiento
                  ? encrypt(`Procedimiento: ${lead.procedimiento}${lead.fecha ? ` | Fecha: ${lead.fecha}` : ''}`)
                  : null,
                appointmentAt: appointmentAt && !isNaN(appointmentAt.getTime()) ? appointmentAt : null,
                status:  'NUEVO',
                channel: channel === 'instagram' ? 'INSTAGRAM' : 'FACEBOOK',
              },
            }).catch(() => {})
          }
        } catch { /* non-blocking */ }
      }

      // ── Send reply ─────────────────────────────────────────────────────────
      try {
        await sendMetaMessage(senderId, reply, pageToken)
      } catch (err) {
        console.error('[Meta] Send error:', err)
        Sentry.captureException(err, { tags: { webhook: 'meta', step: 'send_message' }, extra: { clinicId: clinic.id, senderId } })
      }
    }
  }

  return new NextResponse('EVENT_RECEIVED', { status: 200 })
}
