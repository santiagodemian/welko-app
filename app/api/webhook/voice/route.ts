/**
 * POST /api/webhook/voice
 *
 * Receives call-ended events from Retell AI or Vapi and:
 *   1. Validates the request with a per-clinic webhook secret
 *   2. Upserts a Lead record (idempotent on callId)
 *   3. Encrypts sensitive fields before storing
 *
 * Retell event shape:
 *   { event: "call_ended", call: { call_id, from_number, duration_ms,
 *     transcript, metadata: { clinic_id, patient_name, appointment_value } } }
 *
 * Vapi event shape:
 *   { type: "end-of-call-report", call: { id, customer: { number },
 *     durationSeconds, transcript,
 *     metadata: { clinic_id, patient_name, appointment_value } } }
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { encrypt } from '@/lib/encryption'
import { LeadChannel, LeadStatus } from '@prisma/client'

/* ─── Helpers ─── */

/** Extract a unified payload regardless of provider */
function normalise(body: Record<string, unknown>): {
  callId: string
  clinicId: string
  fromNumber?: string
  patientName?: string
  durationMs?: number
  transcript?: string
  appointmentValue?: number
  channel: LeadChannel
} | null {
  // ── Retell ──────────────────────────────────────────────────────────────────
  if (body.event === 'call_ended' && body.call) {
    const call = body.call as Record<string, unknown>
    const meta = (call.metadata ?? {}) as Record<string, unknown>
    if (!call.call_id || !meta.clinic_id) return null
    return {
      callId:           String(call.call_id),
      clinicId:         String(meta.clinic_id),
      fromNumber:       call.from_number ? String(call.from_number) : undefined,
      patientName:      meta.patient_name ? String(meta.patient_name) : undefined,
      durationMs:       call.duration_ms  ? Number(call.duration_ms)  : undefined,
      transcript:       call.transcript   ? String(call.transcript)   : undefined,
      appointmentValue: meta.appointment_value ? Number(meta.appointment_value) : undefined,
      channel:          LeadChannel.LLAMADA,
    }
  }

  // ── Vapi ────────────────────────────────────────────────────────────────────
  if (body.type === 'end-of-call-report' && body.call) {
    const call = body.call as Record<string, unknown>
    const meta = (call.metadata ?? {}) as Record<string, unknown>
    const customer = (call.customer ?? {}) as Record<string, unknown>
    if (!call.id || !meta.clinic_id) return null
    return {
      callId:           String(call.id),
      clinicId:         String(meta.clinic_id),
      fromNumber:       customer.number ? String(customer.number) : undefined,
      patientName:      meta.patient_name ? String(meta.patient_name) : undefined,
      durationMs:       call.durationSeconds ? Number(call.durationSeconds) * 1000 : undefined,
      transcript:       call.transcript  ? String(call.transcript)  : undefined,
      appointmentValue: meta.appointment_value ? Number(meta.appointment_value) : undefined,
      channel:          LeadChannel.LLAMADA,
    }
  }

  return null
}

/** Timing-safe string comparison to prevent timing attacks on secrets */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

/* ─── Route handler ─── */

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const payload = normalise(body)
  if (!payload) {
    return NextResponse.json({ error: 'Unrecognised event format' }, { status: 400 })
  }

  // ── Validate webhook secret ────────────────────────────────────────────────
  const clinic = await db.clinic.findUnique({
    where: { id: payload.clinicId },
    select: { id: true, webhookSecret: true },
  })

  if (!clinic) {
    return NextResponse.json({ error: 'Clinic not found' }, { status: 404 })
  }

  if (clinic.webhookSecret) {
    const authHeader = req.headers.get('authorization') ?? ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : ''
    if (!safeEqual(token, clinic.webhookSecret)) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }
  }

  // ── Upsert Lead (idempotent on callId) ────────────────────────────────────
  const lead = await db.lead.upsert({
    where: { callId: payload.callId },
    create: {
      clinicId:        payload.clinicId,
      callId:          payload.callId,
      callDurationMs:  payload.durationMs,
      callTranscript:  payload.transcript ? encrypt(payload.transcript) : undefined,
      callEndedAt:     new Date(),
      patientName:     payload.patientName  ? encrypt(payload.patientName)  : undefined,
      patientPhone:    payload.fromNumber   ? encrypt(payload.fromNumber)   : undefined,
      appointmentValue: payload.appointmentValue,
      channel:         payload.channel,
      status:          payload.appointmentValue
        ? LeadStatus.CITA_CONFIRMADA
        : LeadStatus.NUEVO,
    },
    update: {
      callDurationMs:  payload.durationMs,
      callTranscript:  payload.transcript ? encrypt(payload.transcript) : undefined,
      callEndedAt:     new Date(),
      patientName:     payload.patientName  ? encrypt(payload.patientName)  : undefined,
      patientPhone:    payload.fromNumber   ? encrypt(payload.fromNumber)   : undefined,
      appointmentValue: payload.appointmentValue ?? undefined,
      // Only upgrade status, never downgrade
      ...(payload.appointmentValue
        ? { status: LeadStatus.CITA_CONFIRMADA }
        : {}),
    },
    select: { id: true, status: true },
  })

  return NextResponse.json({ ok: true, leadId: lead.id, status: lead.status })
}
