/**
 * GET /api/dashboard/stats
 *
 * Returns real-time BI stats for the authenticated clinic:
 *   - pacientesInteresados: total active leads (non-PERDIDO)
 *   - pipelinePredictivo:   sum of appointmentValue for non-closed leads
 *   - revenueAsegurado:     sum of appointmentValue for CITA_CONFIRMADA + REVENUE_CERRADO
 *   - recentLeads:          last 10 leads (patient name decrypted)
 *   - pipelineByStage:      count per LeadStatus
 */

import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { decrypt, isEncrypted } from '@/lib/encryption'
import { LeadStatus } from '@prisma/client'

function safeDecrypt(value: string | null | undefined): string | null {
  if (!value) return null
  try {
    return isEncrypted(value) ? decrypt(value) : value
  } catch {
    return null
  }
}

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const clinic = await db.clinic.findUnique({
    where: { clerkUserId: userId },
    select: { id: true },
  })

  if (!clinic) {
    // Clinic row not yet provisioned — return zeroed stats
    return NextResponse.json({
      pacientesInteresados: 0,
      pipelinePredictivo: 0,
      revenueAsegurado: 0,
      recentLeads: [],
      pipelineByStage: {},
    })
  }

  // Run all aggregations in parallel
  const [interesados, pipelineAgg, revenueAgg, recent, byStage] = await Promise.all([
    // Total active leads (any status except PERDIDO)
    db.lead.count({
      where: { clinicId: clinic.id, status: { not: LeadStatus.PERDIDO } },
    }),

    // Pipeline predictivo: sum of value for leads not yet closed
    db.lead.aggregate({
      where: {
        clinicId: clinic.id,
        status: { in: [LeadStatus.NUEVO, LeadStatus.EN_SEGUIMIENTO_IA, LeadStatus.CITA_CONFIRMADA] },
        appointmentValue: { gt: 0 },
      },
      _sum: { appointmentValue: true },
    }),

    // Revenue asegurado: confirmed + closed appointments
    db.lead.aggregate({
      where: {
        clinicId: clinic.id,
        status: { in: [LeadStatus.CITA_CONFIRMADA, LeadStatus.REVENUE_CERRADO] },
        appointmentValue: { gt: 0 },
      },
      _sum: { appointmentValue: true },
    }),

    // Last 10 leads for the activity table
    db.lead.findMany({
      where: { clinicId: clinic.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        patientName: true,
        channel: true,
        status: true,
        appointmentValue: true,
        createdAt: true,
      },
    }),

    // Count by stage for funnel chart
    db.lead.groupBy({
      by: ['status'],
      where: { clinicId: clinic.id },
      _count: { id: true },
    }),
  ])

  // Decrypt patient names for the activity table
  const recentLeads = recent.map((l) => ({
    ...l,
    patientName: safeDecrypt(l.patientName) ?? 'Paciente',
  }))

  // Shape byStage into a plain object
  const pipelineByStage = Object.fromEntries(
    byStage.map((g) => [g.status, g._count.id])
  )

  return NextResponse.json({
    pacientesInteresados: interesados,
    pipelinePredictivo:   pipelineAgg._sum.appointmentValue ?? 0,
    revenueAsegurado:     revenueAgg._sum.appointmentValue  ?? 0,
    recentLeads,
    pipelineByStage,
  })
}
