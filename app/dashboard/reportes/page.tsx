'use client'

import { useState, useEffect } from 'react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { TrendingUp, Users, DollarSign, Target, XCircle, Zap } from 'lucide-react'

const SURF  = 'var(--surface)'
const BORD  = 'var(--border)'
const TEXT  = 'var(--text-primary)'
const MUTED = 'var(--text-secondary)'
const NAVY  = '#13244A'
const GREEN = '#22C55E'
const BLUE  = '#3B82F6'
const PURPLE= '#A78BFA'
const AMBER = '#F59E0B'
const RED   = '#EF4444'

const CH_COLOR: Record<string, string> = {
  WHATSAPP: '#22C55E', INSTAGRAM: '#E1306C', FACEBOOK: '#1877F2', LLAMADA: BLUE, WEB: PURPLE,
}
const STAGE_COLOR: Record<string, string> = {
  NUEVO: BLUE, EN_SEGUIMIENTO_IA: AMBER, CITA_CONFIRMADA: '#2563EB',
  REVENUE_CERRADO: GREEN, PERDIDO: RED,
}

type Period = '30d' | '90d' | '12m'

interface TrendPoint  { label: string; revenue: number; citas: number }
interface PipelineRow { stage: string; label: string; count: number; value: number }
interface ChannelRow  { channel: string; label: string; total: number; converted: number; convRate: number }
interface Kpis        { totalLeads: number; revenueAsegurado: number; conversionRate: number; avgTicket: number; noShowRate: number }

interface AnalyticsData {
  revenueTrend: TrendPoint[]
  pipeline:     PipelineRow[]
  byChannel:    ChannelRow[]
  kpis:         Kpis
}

function fmt(n: number) { return Intl.NumberFormat('es-MX').format(n) }
function fmtMXN(n: number) { return `$${fmt(Math.round(n))}` }

// ── Custom tooltip ─────────────────────────────────────────────────────────────
function RevenueTooltip({ active, payload, label }: { active?: boolean; payload?: {value: number}[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: SURF, border: `1px solid ${BORD}`, borderRadius: 10, padding: '10px 14px' }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: MUTED, margin: '0 0 6px' }}>{label}</p>
      <p style={{ fontSize: 13, fontWeight: 800, color: GREEN, margin: '0 0 2px' }}>{fmtMXN(payload[0]?.value ?? 0)}</p>
      {payload[1] && <p style={{ fontSize: 11, color: MUTED, margin: 0 }}>{payload[1].value} citas</p>}
    </div>
  )
}

function ChannelTooltip({ active, payload, label }: { active?: boolean; payload?: {name: string; value: number}[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: SURF, border: `1px solid ${BORD}`, borderRadius: 10, padding: '10px 14px' }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: MUTED, margin: '0 0 6px' }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ fontSize: 12, color: TEXT, margin: '2px 0', fontWeight: 600 }}>
          {p.name}: <span style={{ color: GREEN }}>{p.value}</span>
        </p>
      ))}
    </div>
  )
}

export default function ReportesPage() {
  const [data, setData]       = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod]   = useState<Period>('30d')

  useEffect(() => {
    setLoading(true)
    fetch(`/api/analytics?period=${period}`)
      .then(r => r.json())
      .then(setData)
      .catch(() => null)
      .finally(() => setLoading(false))
  }, [period])

  const kpis = data?.kpis
  const PERIOD_LABEL: Record<Period, string> = { '30d': 'Últimos 30 días', '90d': 'Últimos 90 días', '12m': 'Últimos 12 meses' }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100%', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h1 style={{ color: TEXT, fontSize: 18, fontWeight: 700, margin: 0 }}>Reportes</h1>
          <p style={{ color: MUTED, fontSize: 12, margin: '3px 0 0' }}>Analítica en tiempo real · {PERIOD_LABEL[period]}</p>
        </div>
        {/* Period selector */}
        <div style={{ display: 'flex', gap: 4 }}>
          {(['30d', '90d', '12m'] as Period[]).map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              style={{
                padding: '6px 14px', borderRadius: 9, fontSize: 12, fontWeight: 500, cursor: 'pointer',
                border: `1px solid ${period === p ? NAVY : BORD}`,
                background: period === p ? NAVY : SURF,
                color: period === p ? '#fff' : MUTED,
              }}>
              {p === '30d' ? '30 días' : p === '90d' ? '90 días' : '12 meses'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
        {[
          { Icon: Users,     color: BLUE,   label: 'Leads totales',    value: loading ? '…' : String(kpis?.totalLeads ?? 0) },
          { Icon: DollarSign,color: GREEN,  label: 'Revenue cerrado',  value: loading ? '…' : fmtMXN(kpis?.revenueAsegurado ?? 0) },
          { Icon: Target,    color: PURPLE, label: 'Conversión',       value: loading ? '…' : `${kpis?.conversionRate ?? 0}%` },
          { Icon: TrendingUp,color: AMBER,  label: 'Ticket promedio',  value: loading ? '…' : kpis?.avgTicket ? fmtMXN(kpis.avgTicket) : '—' },
          { Icon: XCircle,   color: RED,    label: 'Tasa perdidos',    value: loading ? '…' : `${kpis?.noShowRate ?? 0}%` },
        ].map(k => (
          <div key={k.label} style={{ background: SURF, border: `1px solid ${BORD}`, borderRadius: 12, padding: '14px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <span style={{ fontSize: 11, color: MUTED, lineHeight: 1.3 }}>{k.label}</span>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: `${k.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <k.Icon size={13} color={k.color} />
              </div>
            </div>
            <span style={{ fontSize: 22, fontWeight: 800, color: k.color }}>{k.value}</span>
          </div>
        ))}
      </div>

      {/* Revenue trend */}
      <div style={{ background: SURF, border: `1px solid ${BORD}`, borderRadius: 16, padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
          <Zap size={14} color={GREEN} />
          <p style={{ color: TEXT, fontSize: 13, fontWeight: 600, margin: 0 }}>Revenue Asegurado IA</p>
          <span style={{ fontSize: 11, color: MUTED, marginLeft: 4 }}>— ingresos cerrados por período</span>
        </div>
        {loading ? (
          <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: MUTED, fontSize: 13 }}>Cargando…</div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={data?.revenueTrend ?? []} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={GREEN} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={GREEN} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: MUTED }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={v => v >= 1000 ? `$${(v/1000).toFixed(0)}k` : `$${v}`} tick={{ fontSize: 10, fill: MUTED }} axisLine={false} tickLine={false} width={48} />
              <Tooltip content={<RevenueTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke={GREEN} strokeWidth={2.5} fill="url(#revenueGrad)" dot={false} activeDot={{ r: 4, fill: GREEN }} />
              <Area type="monotone" dataKey="citas" stroke={BLUE} strokeWidth={1.5} fill="none" strokeDasharray="4 4" dot={false} activeDot={{ r: 3, fill: BLUE }} />
            </AreaChart>
          </ResponsiveContainer>
        )}
        <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 20, height: 2.5, borderRadius: 99, background: GREEN }} />
            <span style={{ fontSize: 11, color: MUTED }}>Revenue MXN</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 20, height: 2, borderRadius: 99, background: BLUE, borderTop: `1px dashed ${BLUE}` }} />
            <span style={{ fontSize: 11, color: MUTED }}>Citas totales</span>
          </div>
        </div>
      </div>

      {/* Row: Pipeline funnel + Channel conversion */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* Pipeline funnel */}
        <div style={{ background: SURF, border: `1px solid ${BORD}`, borderRadius: 16, padding: '18px 20px' }}>
          <p style={{ color: TEXT, fontSize: 13, fontWeight: 600, margin: '0 0 16px' }}>Funnel de conversión</p>
          {loading ? (
            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: MUTED, fontSize: 13 }}>Cargando…</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={data?.pipeline.filter(p => p.stage !== 'PERDIDO') ?? []}
                  layout="vertical"
                  margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: MUTED }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="label" tick={{ fontSize: 11, fill: TEXT }} axisLine={false} tickLine={false} width={80} />
                  <Tooltip
                    formatter={(value, name) => [
                      name === 'count' ? `${value} leads` : fmtMXN(Number(value ?? 0)),
                      name === 'count' ? 'Leads' : 'Valor',
                    ]}
                    contentStyle={{ background: SURF, border: `1px solid ${BORD}`, borderRadius: 10, fontSize: 12 }}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {(data?.pipeline.filter(p => p.stage !== 'PERDIDO') ?? []).map((entry) => (
                      <Cell key={entry.stage} fill={STAGE_COLOR[entry.stage] ?? PURPLE} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              {/* Conversion rate between stages */}
              {data && (() => {
                const stages  = data.pipeline.filter(p => p.stage !== 'PERDIDO')
                const entrada = stages[0]?.count ?? 1
                const cerrado = stages.find(s => s.stage === 'REVENUE_CERRADO')?.count ?? 0
                return (
                  <p style={{ fontSize: 11, color: MUTED, margin: '10px 0 0', textAlign: 'center' }}>
                    {entrada} leads → {cerrado} cerrados ·{' '}
                    <span style={{ color: GREEN, fontWeight: 700 }}>
                      {entrada > 0 ? Math.round((cerrado / entrada) * 100) : 0}% conversión total
                    </span>
                  </p>
                )
              })()}
            </>
          )}
        </div>

        {/* Channel performance */}
        <div style={{ background: SURF, border: `1px solid ${BORD}`, borderRadius: 16, padding: '18px 20px' }}>
          <p style={{ color: TEXT, fontSize: 13, fontWeight: 600, margin: '0 0 16px' }}>Leads por canal</p>
          {loading ? (
            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: MUTED, fontSize: 13 }}>Cargando…</div>
          ) : !data?.byChannel.length ? (
            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: MUTED, fontSize: 13 }}>Sin datos para este período</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.byChannel} margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: MUTED }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: MUTED }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChannelTooltip />} />
                <Bar dataKey="total" name="Total" radius={[4, 4, 0, 0]}>
                  {data.byChannel.map(entry => (
                    <Cell key={entry.channel} fill={CH_COLOR[entry.channel] ?? PURPLE} fillOpacity={0.7} />
                  ))}
                </Bar>
                <Bar dataKey="converted" name="Cerrados" radius={[4, 4, 0, 0]}>
                  {data.byChannel.map(entry => (
                    <Cell key={entry.channel} fill={CH_COLOR[entry.channel] ?? PURPLE} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
          {/* Conversion rate per channel */}
          {!loading && data?.byChannel.length ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
              {data.byChannel.map(c => (
                <div key={c.channel} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: CH_COLOR[c.channel] ?? PURPLE }} />
                  <span style={{ fontSize: 10, color: MUTED }}>{c.label}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: TEXT }}>{c.convRate}%</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {/* Pipeline value table */}
      <div style={{ background: SURF, border: `1px solid ${BORD}`, borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: `1px solid ${BORD}` }}>
          <p style={{ color: TEXT, fontSize: 13, fontWeight: 600, margin: 0 }}>Desglose por etapa</p>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${BORD}` }}>
              {['Etapa', 'Leads', 'Valor en pipeline', '% del total', 'Acción'].map(h => (
                <th key={h} style={{ padding: '9px 20px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding: '24px', textAlign: 'center', fontSize: 13, color: MUTED }}>Cargando…</td></tr>
            ) : (data?.pipeline ?? []).map((row, i) => {
              const totalLeads = data?.pipeline.reduce((s, r) => s + r.count, 0) ?? 1
              const pct = totalLeads > 0 ? Math.round((row.count / totalLeads) * 100) : 0
              const color = STAGE_COLOR[row.stage] ?? MUTED
              const ACTION: Record<string, string> = {
                NUEVO: 'Responder en < 2 seg', EN_SEGUIMIENTO_IA: 'Agendar cita',
                CITA_CONFIRMADA: 'Enviar recordatorio', REVENUE_CERRADO: 'Solicitar reseña', PERDIDO: 'Campaña reactivación',
              }
              return (
                <tr key={row.stage} style={{ borderBottom: i < (data?.pipeline.length ?? 0) - 1 ? `1px solid ${BORD}` : 'none' }}>
                  <td style={{ padding: '12px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>{row.label}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 20px', fontSize: 22, fontWeight: 800, color }}>{row.count}</td>
                  <td style={{ padding: '12px 20px', fontSize: 13, fontWeight: 700, color: TEXT }}>
                    {row.value > 0 ? fmtMXN(row.value) : '—'}
                  </td>
                  <td style={{ padding: '12px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, maxWidth: 80, height: 5, borderRadius: 99, background: 'var(--border)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 99 }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, color }}>{pct}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 20px', fontSize: 11, color: MUTED, fontStyle: 'italic' }}>
                    {ACTION[row.stage]}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
