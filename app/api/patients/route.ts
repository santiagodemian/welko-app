/**
 * GET /api/patients
 *
 * Returns the patient list for the authenticated clinic.
 * Patients are derived by grouping leads by decrypted patientPhone.
 * Leads without a phone are grouped by name as fallback.
 *
 * Each patient entry includes:
 *   - id           unique key (hashed phone or lead id for anonymous)
 *   - name         most recent name seen
 *   - phone        masked phone (last 4 digits visible)
 *   - channel      preferred channel (most frequent)
 *   - totalLeads   how many leads/contacts
 *   - totalSpent   sum of appointmentValue for REVENUE_CERRADO leads
 *   - totalBooked  sum of appointmentValue across all leads
 *   - lastContact  most recent createdAt
 *   - lastStatus   status of most recent lead
 *   - noShowRate   % of appointments that ended up PERDIDO
 *   - leads[]      raw lead array for the detail panel
 */

import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { decrypt, isEncrypted } from '@/lib/encryption'
import { createHash } from 'crypto'

function safeDecrypt(v: string | null | undefined): string | null {
  if (!v) return null
  try { return isEncrypted(v) ? decrypt(v) : v } catch { return null }
}

function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length < 4) return phone
  return `••• ••• ••${digits.slice(-4, -2)} ${digits.slice(-2)}`
}

function phoneKey(phone: string): string {
  return createHash('sha256').update(phone.replace(/\D/g, '')).digest('hex').slice(0, 16)
}

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const clinic = await db.clinic.findUnique({
    where: { clerkUserId: userId },
    select: { id: true },
  })
  if (!clinic) return NextResponse.json({ patients: [] })

  const leads = await db.lead.findMany({
    where:   { clinicId: clinic.id },
    orderBy: { createdAt: 'desc' },
  })

  // Group by decrypted phone → map of groupKey → leads[]
  const groups = new Map<string, typeof leads>()

  for (const lead of leads) {
    const phone = safeDecrypt(lead.patientPhone)
    const key   = phone ? phoneKey(phone) : `anon_${lead.id}`
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(lead)
  }

  const patients = Array.from(groups.entries()).map(([key, group]) => {
    const latest  = group[0] // already ordered by createdAt desc
    const name    = safeDecrypt(latest.patientName) ?? 'Paciente'
    const rawPhone = safeDecrypt(latest.patientPhone)

    // Channel frequency
    const channelCount: Record<string, number> = {}
    for (const l of group) channelCount[l.channel] = (channelCount[l.channel] ?? 0) + 1
    const preferredChannel = Object.entries(channelCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'WEB'

    const totalSpent  = group
      .filter(l => l.status === 'REVENUE_CERRADO' && l.appointmentValue)
      .reduce((s, l) => s + (l.appointmentValue ?? 0), 0)

    const totalBooked = group
      .filter(l => l.appointmentValue)
      .reduce((s, l) => s + (l.appointmentValue ?? 0), 0)

    const withAppointment = group.filter(l => l.appointmentAt).length
    const lost            = group.filter(l => l.status === 'PERDIDO').length
    const noShowRate      = withAppointment > 0 ? Math.round((lost / group.length) * 100) : 0

    return {
      id:               key,
      name,
      phone:            rawPhone ? maskPhone(rawPhone) : null,
      channel:          preferredChannel,
      totalLeads:       group.length,
      totalSpent,
      totalBooked,
      lastContact:      latest.createdAt.toISOString(),
      lastStatus:       latest.status,
      noShowRate,
      leads: group.map(l => ({
        id:               l.id,
        status:           l.status,
        channel:          l.channel,
        appointmentAt:    l.appointmentAt?.toISOString() ?? null,
        appointmentValue: l.appointmentValue,
        notes:            safeDecrypt(l.notes),
        createdAt:        l.createdAt.toISOString(),
      })),
    }
  })

  // Sort by lastContact desc
  patients.sort((a, b) => new Date(b.lastContact).getTime() - new Date(a.lastContact).getTime())

  return NextResponse.json({ patients })
}
