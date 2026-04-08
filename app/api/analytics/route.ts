/**
 * GET /api/analytics?period=30d|90d|12m
 *
 * Returns aggregated analytics for the authenticated clinic:
 *   - revenueTrend   weekly/monthly revenue buckets
 *   - pipeline       count + value per LeadStatus
 *   - byChannel      leads total + converted per channel
 *   - kpis           summary numbers
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

type Period = '30d' | '90d' | '12m'

function bucketKey(date: Date, period: Period): string {
  if (period === '12m') {
    return date.toLocaleDateString('es-MX', { month: 'short', year: '2-digit' })
  }
  // Weekly bucket: "Apr 7"
  const monday = new Date(date)
  const day = monday.getDay() === 0 ? 6 : monday.getDay() - 1
  monday.setDate(monday.getDate() - day)
  return monday.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })
}

function bucketOrder(date: Date, period: Period): number {
  if (period === '12m') {
    return new Date(date.getFullYear(), date.getMonth(), 1).getTime()
  }
  const monday = new Date(date)
  const day = monday.getDay() === 0 ? 6 : monday.getDay() - 1
  monday.setDate(monday.getDate() - day)
  monday.setHours(0, 0, 0, 0)
  return monday.getTime()
}

export async function GET(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const clinic = await db.clinic.findUnique({
    where: { clerkUserId: userId },
    select: { id: true },
  })
  if (!clinic) {
    return NextResponse.json({ revenueTrend: [], pipeline: [], byChannel: [], kpis: {} })
  }

  const { searchParams } = new URL(req.url)
  const period = (searchParams.get('period') ?? '30d') as Period

  const daysBack = period === '12m' ? 365 : period === '90d' ? 90 : 30
  const since = new Date(Date.now() - daysBack * 86_400_000)

  // Fetch all leads in window
  const leads = await db.lead.findMany({
    where:   { clinicId: clinic.id, createdAt: { gte: since } },
    select:  { status: true, channel: true, appointmentValue: true, createdAt: true },
  })

  // ── Revenue trend ─────────────────────────────────────────────────────────────
  // Buckets based on revenue-closed leads
  const trendMap = new Map<string, { ts: number; revenue: number; citas: number }>()

  // Fill empty buckets so the chart has a continuous line
  const numBuckets = period === '12m' ? 12 : period === '90d' ? 13 : 5
  for (let i = numBuckets - 1; i >= 0; i--) {
    const d = new Date()
    if (period === '12m') d.setMonth(d.getMonth() - i)
    else d.setDate(d.getDate() - i * 7)
    const key = bucketKey(d, period)
    if (!trendMap.has(key)) {
      trendMap.set(key, { ts: bucketOrder(d, period), revenue: 0, citas: 0 })
    }
  }

  for (const l of leads) {
    const key = bucketKey(l.createdAt, period)
    if (!trendMap.has(key)) {
      trendMap.set(key, { ts: bucketOrder(l.createdAt, period), revenue: 0, citas: 0 })
    }
    const bucket = trendMap.get(key)!
    bucket.citas += 1
    if (l.status === 'REVENUE_CERRADO' && l.appointmentValue) {
      bucket.revenue += l.appointmentValue
    }
  }

  const revenueTrend = Array.from(trendMap.entries())
    .sort((a, b) => a[1].ts - b[1].ts)
    .map(([label, { revenue, citas }]) => ({ label, revenue, citas }))

  // ── Pipeline funnel ───────────────────────────────────────────────────────────
  const pipelineOrder = ['NUEVO', 'EN_SEGUIMIENTO_IA', 'CITA_CONFIRMADA', 'REVENUE_CERRADO', 'PERDIDO']
  const pipelineMap   = new Map<string, { count: number; value: number }>()
  for (const s of pipelineOrder) pipelineMap.set(s, { count: 0, value: 0 })
  for (const l of leads) {
    const p = pipelineMap.get(l.status) ?? { count: 0, value: 0 }
    p.count += 1
    if (l.appointmentValue) p.value += l.appointmentValue
    pipelineMap.set(l.status, p)
  }
  const STAGE_LABEL: Record<string, string> = {
    NUEVO: 'Nuevo', EN_SEGUIMIENTO_IA: 'Seguimiento', CITA_CONFIRMADA: 'Confirmado',
    REVENUE_CERRADO: 'Atendido', PERDIDO: 'Perdido',
  }
  const pipeline = pipelineOrder.map(s => ({
    stage: s, label: STAGE_LABEL[s], ...pipelineMap.get(s)!,
  }))

  // ── By channel ────────────────────────────────────────────────────────────────
  const channelMap = new Map<string, { total: number; converted: number }>()
  for (const l of leads) {
    if (!channelMap.has(l.channel)) channelMap.set(l.channel, { total: 0, converted: 0 })
    const c = channelMap.get(l.channel)!
    c.total += 1
    if (l.status === 'REVENUE_CERRADO') c.converted += 1
  }
  const CH_LABEL: Record<string, string> = {
    WHATSAPP: 'WhatsApp', INSTAGRAM: 'Instagram', FACEBOOK: 'Facebook',
    LLAMADA: 'Llamada', WEB: 'Web',
  }
  const byChannel = Array.from(channelMap.entries()).map(([channel, { total, converted }]) => ({
    channel, label: CH_LABEL[channel] ?? channel, total, converted,
    convRate: total > 0 ? Math.round((converted / total) * 100) : 0,
  }))

  // ── KPIs ─────────────────────────────────────────────────────────────────────
  const totalLeads      = leads.length
  const closedLeads     = leads.filter(l => l.status === 'REVENUE_CERRADO')
  const revenueAsegurado = closedLeads.reduce((s, l) => s + (l.appointmentValue ?? 0), 0)
  const conversionRate  = totalLeads > 0 ? Math.round((closedLeads.length / totalLeads) * 100) : 0
  const avgTicket       = closedLeads.length > 0 ? Math.round(revenueAsegurado / closedLeads.length) : 0
  const lostLeads       = leads.filter(l => l.status === 'PERDIDO').length
  const noShowRate      = totalLeads > 0 ? Math.round((lostLeads / totalLeads) * 100) : 0

  return NextResponse.json({
    revenueTrend,
    pipeline,
    byChannel,
    kpis: { totalLeads, revenueAsegurado, conversionRate, avgTicket, noShowRate },
  })
}
