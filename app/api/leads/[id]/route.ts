/**
 * PATCH /api/leads/[id]  — update status, appointment info, or notes
 * DELETE /api/leads/[id] — mark lead as PERDIDO (soft delete)
 *
 * When appointmentAt is set or updated, automatically syncs with Google Calendar
 * if the clinic has it connected.
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { encrypt, isEncrypted, decrypt } from '@/lib/encryption'
import { LeadStatus } from '@prisma/client'
import {
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
} from '@/lib/google-calendar'

type Params = { params: Promise<{ id: string }> }

function safeDecrypt(value: string | null | undefined): string | null {
  if (!value) return null
  try { return isEncrypted(value) ? decrypt(value) : value } catch { return null }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { id } = await params

  const clinic = await db.clinic.findUnique({
    where: { clerkUserId: userId },
    select: { id: true, name: true, address: true, googleRefreshToken: true },
  })
  if (!clinic) return NextResponse.json({ error: 'Clinic not found' }, { status: 404 })

  const lead = await db.lead.findFirst({
    where: { id, clinicId: clinic.id },
    select: {
      id: true, patientName: true, appointmentAt: true,
      appointmentValue: true, notes: true, googleCalendarEventId: true,
    },
  })
  if (!lead) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json()
  const { status, appointmentAt, appointmentValue, notes, patientName, patientPhone } = body

  const update: Record<string, unknown> = {}

  if (status !== undefined) {
    if (!Object.values(LeadStatus).includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }
    update.status = status
  }
  if (appointmentAt !== undefined) update.appointmentAt = appointmentAt ? new Date(appointmentAt) : null
  if (appointmentValue !== undefined) update.appointmentValue = appointmentValue
  if (notes !== undefined) update.notes = notes ? (isEncrypted(notes) ? notes : encrypt(notes)) : null
  if (patientName !== undefined) update.patientName = patientName ? encrypt(patientName) : null
  if (patientPhone !== undefined) update.patientPhone = patientPhone ? encrypt(patientPhone) : null

  await db.lead.update({ where: { id }, data: update })

  // ── Google Calendar sync (non-blocking, best-effort) ─────────────────────────
  if (clinic.googleRefreshToken && appointmentAt !== undefined) {
    try {
      const resolvedPatientName  = safeDecrypt(patientName ?? lead.patientName) ?? 'Paciente'
      const resolvedNotes        = safeDecrypt(notes ?? lead.notes)
      const resolvedValue        = appointmentValue ?? lead.appointmentValue
      const resolvedAppointmentAt = appointmentAt ? new Date(appointmentAt) : null

      const payload = {
        patientName:      resolvedPatientName,
        service:          resolvedNotes,
        clinicName:       clinic.name,
        clinicAddress:    clinic.address,
        appointmentValue: resolvedValue,
        durationMins:     60,
        appointmentAt:    resolvedAppointmentAt!,
      }

      if (!resolvedAppointmentAt) {
        // Appointment removed — delete the calendar event if one exists
        if (lead.googleCalendarEventId) {
          await deleteCalendarEvent(clinic.id, lead.googleCalendarEventId)
          await db.lead.update({ where: { id }, data: { googleCalendarEventId: null } })
        }
      } else if (lead.googleCalendarEventId) {
        // Update existing event
        await updateCalendarEvent(clinic.id, lead.googleCalendarEventId, payload)
      } else {
        // Create new event
        const eventId = await createCalendarEvent(clinic.id, payload)
        if (eventId) {
          await db.lead.update({ where: { id }, data: { googleCalendarEventId: eventId } })
        }
      }
    } catch (err) {
      // Calendar sync is non-critical — log and continue
      console.error('[Welko] Calendar sync error:', err)
    }
  }

  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { id } = await params

  const clinic = await db.clinic.findUnique({
    where: { clerkUserId: userId },
    select: { id: true, googleRefreshToken: true },
  })
  if (!clinic) return NextResponse.json({ error: 'Clinic not found' }, { status: 404 })

  const lead = await db.lead.findFirst({
    where: { id, clinicId: clinic.id },
    select: { id: true, googleCalendarEventId: true },
  })
  if (!lead) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Delete associated calendar event if connected
  if (clinic.googleRefreshToken && lead.googleCalendarEventId) {
    deleteCalendarEvent(clinic.id, lead.googleCalendarEventId).catch(() => null)
  }

  await db.lead.update({ where: { id }, data: { status: LeadStatus.PERDIDO } })
  return NextResponse.json({ ok: true })
}
