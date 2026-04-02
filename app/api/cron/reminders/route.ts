/**
 * GET /api/cron/reminders
 *
 * Vercel Cron Job — runs every hour.
 * Finds appointments in the next 24-25 h that haven't been reminded yet,
 * sends a WhatsApp confirmation message to the patient, and marks the lead.
 *
 * Secured with CRON_SECRET (Vercel sets Authorization: Bearer <secret> automatically).
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { decrypt } from '@/lib/encryption'
import { sendWhatsApp } from '@/lib/twilio'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  // Verify Vercel cron secret
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now   = new Date()
  // Window: appointments between 23 h and 25 h from now
  const from  = new Date(now.getTime() + 23 * 60 * 60 * 1000)
  const until = new Date(now.getTime() + 25 * 60 * 60 * 1000)

  const leads = await db.lead.findMany({
    where: {
      appointmentAt:    { gte: from, lte: until },
      reminderSentAt:   null,
      patientPhone:     { not: null },
      status:           { in: ['NUEVO', 'EN_SEGUIMIENTO_IA', 'CITA_CONFIRMADA'] },
    },
    include: { clinic: { select: { name: true, whatsappPhone: true, aiAgentName: true } } },
    take: 100,
  })

  let sent = 0
  let failed = 0

  for (const lead of leads) {
    // Skip if clinic has no WhatsApp number configured
    if (!lead.clinic.whatsappPhone) continue

    let phone: string | null = null
    try {
      phone = lead.patientPhone ? decrypt(lead.patientPhone) : null
    } catch {
      continue
    }
    if (!phone) continue

    // Format appointment time in Mexico City timezone
    const apptTime = lead.appointmentAt!.toLocaleString('es-MX', {
      weekday: 'long',
      day:     'numeric',
      month:   'long',
      hour:    '2-digit',
      minute:  '2-digit',
      timeZone: 'America/Mexico_City',
    })

    const agentName  = lead.clinic.aiAgentName ?? 'Sofía'
    const clinicName = lead.clinic.name

    const message = [
      `¡Hola! Le contacta ${agentName} de ${clinicName}.`,
      ``,
      `Le recordamos que tiene una cita agendada para mañana ${apptTime}.`,
      ``,
      `Si necesita reagendar o tiene alguna duda, responda este mensaje y con gusto le ayudamos.`,
      ``,
      `¡Hasta pronto!`,
    ].join('\n')

    try {
      await sendWhatsApp(phone, message)
      await db.lead.update({
        where: { id: lead.id },
        data:  { reminderSentAt: new Date() },
      })
      sent++
    } catch (err) {
      console.error(`[Reminder] Failed for lead ${lead.id}:`, err)
      failed++
    }
  }

  return NextResponse.json({ ok: true, sent, failed, checked: leads.length })
}
