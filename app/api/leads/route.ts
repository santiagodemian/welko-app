/**
 * GET  /api/leads  — list leads for the authenticated clinic
 * POST /api/leads  — manually create a lead
 *
 * GET query params:
 *   withAppointment=true  → only leads that have appointmentAt set
 *   status=NUEVO,EN_SEGUIMIENTO_IA,...  → comma-separated filter
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { decrypt, isEncrypted, encrypt } from '@/lib/encryption'
import { LeadStatus, LeadChannel } from '@prisma/client'

function safeDecrypt(value: string | null | undefined): string | null {
  if (!value) return null
  try { return isEncrypted(value) ? decrypt(value) : value } catch { return null }
}

function relativeTime(date: Date): string {
  const diff = Date.now() - date.getTime()
  const mins  = Math.floor(diff / 60_000)
  if (mins < 1)   return 'ahora'
  if (mins < 60)  return `hace ${mins} min`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)   return `hace ${hrs}h`
  const days = Math.floor(hrs / 24)
  return days === 1 ? 'ayer' : `hace ${days} días`
}

export async function GET(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const clinic = await db.clinic.findUnique({
    where: { clerkUserId: userId },
    select: { id: true },
  })
  if (!clinic) return NextResponse.json({ leads: [] })

  const { searchParams } = new URL(req.url)
  const withAppointment  = searchParams.get('withAppointment') === 'true'
  const rawStatuses      = searchParams.get('status')

  const statusFilter = rawStatuses
    ? rawStatuses.split(',').filter((s): s is LeadStatus => Object.values(LeadStatus).includes(s as LeadStatus))
    : undefined

  const leads = await db.lead.findMany({
    where: {
      clinicId:      clinic.id,
      ...(statusFilter     ? { status: { in: statusFilter } } : {}),
      ...(withAppointment  ? { appointmentAt: { not: null } } : {}),
      // Exclude permanently lost unless explicitly requested
      ...(!statusFilter    ? { status: { not: LeadStatus.PERDIDO } } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: 200,
  })

  const result = leads.map((l) => ({
    id:               l.id,
    patientName:      safeDecrypt(l.patientName) ?? 'Paciente',
    patientPhone:     safeDecrypt(l.patientPhone),
    status:           l.status,
    channel:          l.channel,
    appointmentAt:    l.appointmentAt?.toISOString() ?? null,
    appointmentValue: l.appointmentValue,
    reminderSentAt:   l.reminderSentAt?.toISOString() ?? null,
    notes:            safeDecrypt(l.notes),
    createdAt:        l.createdAt.toISOString(),
    relativeTime:     relativeTime(l.createdAt),
  }))

  return NextResponse.json({ leads: result })
}

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const clinic = await db.clinic.findUnique({
    where: { clerkUserId: userId },
    select: { id: true },
  })
  if (!clinic) return NextResponse.json({ error: 'Clinic not found' }, { status: 404 })

  const body = await req.json()
  const { patientName, patientPhone, channel, status, appointmentAt, appointmentValue, notes } = body

  const lead = await db.lead.create({
    data: {
      clinicId:         clinic.id,
      patientName:      patientName  ? encrypt(patientName)  : null,
      patientPhone:     patientPhone ? encrypt(patientPhone) : null,
      channel:          (channel as LeadChannel) ?? LeadChannel.WEB,
      status:           (status as LeadStatus)   ?? LeadStatus.NUEVO,
      appointmentAt:    appointmentAt ? new Date(appointmentAt) : null,
      appointmentValue: appointmentValue ?? null,
      notes:            notes ? encrypt(notes) : null,
    },
  })

  return NextResponse.json({ id: lead.id }, { status: 201 })
}
