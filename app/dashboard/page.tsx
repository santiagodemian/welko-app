'use client'

import { useState, useEffect } from 'react'
import {
  MessageCircle,
  Calendar,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Zap,
  ChevronRight,
} from 'lucide-react'

/* ─── Design tokens (CSS vars — responds to light/dark mode) ─── */
const BG     = 'var(--bg)'
const SURF   = 'var(--surface)'
const SURF2  = 'var(--surface-hover)'
const BORDER = 'var(--border)'
const TEXT   = 'var(--text-primary)'
const MUTED  = 'var(--text-secondary)'
const GREEN  = '#22C55E'
const NAVY   = 'var(--accent)'

/* ─── Data ─── */
const KPIS = [
  {
    Icon: MessageCircle,
    value: '303',
    suffix: '',
    label: 'Pacientes Interesados',
    sub: '+18 nuevos esta semana',
    color: '#60A5FA',
    highlight: false,
  },
  {
    Icon: Calendar,
    value: '$53,315',
    suffix: ' MXN',
    label: 'Pipeline Predictivo',
    sub: 'Proyección próximos 30 días',
    color: '#A78BFA',
    highlight: false,
  },
  {
    Icon: TrendingUp,
    value: '$47,173.5',
    suffix: ' MXN',
    label: 'Revenue Asegurado IA',
    sub: '+22% vs mes anterior',
    color: GREEN,
    highlight: true,
  },
]

const AI_INSIGHTS = [
  { done: true,  text: '4 huecos detectados en la agenda. Campaña de reactivación aprobada y en ejecución.' },
  { done: true,  text: 'Paciente preguntó por Botox. Marcado automáticamente para seguimiento de Revenue.' },
  { done: false, text: 'Recomendación IA: Descuento «Martes de Salud» para recuperar 3 huecos esta semana.' },
]

const RECENT = [
  { name: 'Ana García',     ch: 'WhatsApp',  time: '09:14', status: 'confirmed' },
  { name: 'Luis Mendoza',   ch: 'Instagram', time: '09:31', status: 'confirmed' },
  { name: 'Carla Ruiz',     ch: 'Llamada',   time: '09:47', status: 'pending'   },
  { name: 'Jorge Herrera',  ch: 'WhatsApp',  time: '10:05', status: 'confirmed' },
  { name: 'Sofía Torres',   ch: 'Facebook',  time: '10:22', status: 'cancelled' },
]

const STATUS_COLOR: Record<string, string> = {
  confirmed: GREEN,
  pending:   '#F59E0B',
  cancelled: '#EF4444',
}
const STATUS_LABEL: Record<string, string> = {
  confirmed: 'Confirmada',
  pending:   'Pendiente',
  cancelled: 'Cancelada',
}

const FLOW_STAGES = [
  { label: 'Nuevos Leads',        count: 47, pct: 100, color: '#60A5FA' },
  { label: 'Confirmar Cita',      count: 31, pct: 66,  color: '#A78BFA' },
  { label: 'Advanced Lead',       count: 18, pct: 38,  color: '#F59E0B' },
  { label: 'Closed Opportunity',  count: 12, pct: 25,  color: GREEN     },
]

const TABS = ['Resumen Ejecutivo', 'Flujos de Calificación']

/* ─── Sparkline heights (deterministic) ─── */
const SPARK = [28, 42, 34, 58, 48, 72, 63, 78, 68, 88, 82, 100]

/* ─── Types ─── */
type StatsResponse = {
  pacientesInteresados: number
  pipelinePredictivo: number
  revenueAsegurado: number
  recentLeads: {
    id: string
    patientName: string
    channel: string
    status: string
    appointmentValue: number | null
    createdAt: string
  }[]
  pipelineByStage: Record<string, number>
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  NUEVO:             { label: 'Nuevo',        color: '#60A5FA' },
  EN_SEGUIMIENTO_IA: { label: 'En seguimiento', color: '#A78BFA' },
  CITA_CONFIRMADA:   { label: 'Confirmada',   color: GREEN     },
  REVENUE_CERRADO:   { label: 'Cerrado',      color: '#22D3EE' },
  PERDIDO:           { label: 'Perdido',      color: '#EF4444' },
}

function fmt(n: number) {
  return new Intl.NumberFormat('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 1 }).format(n)
}

export default function DashboardPage() {
  const [tab, setTab] = useState(0)
  const [stats, setStats] = useState<StatsResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then((r) => r.json())
      .then((data) => { setStats(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const today = new Date().toLocaleDateString('es-MX', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  // Merge real stats into KPI definitions
  const kpis = [
    { ...KPIS[0], value: stats ? String(stats.pacientesInteresados) : KPIS[0].value },
    { ...KPIS[1], value: stats ? `$${fmt(stats.pipelinePredictivo)}`  : KPIS[1].value },
    { ...KPIS[2], value: stats ? `$${fmt(stats.revenueAsegurado)}`    : KPIS[2].value },
  ]

  // Build funnel from real data if available
  const stages = stats
    ? [
        { label: 'Nuevos Leads',       count: stats.pipelineByStage.NUEVO             ?? 0, color: '#60A5FA' },
        { label: 'En Seguimiento IA',  count: stats.pipelineByStage.EN_SEGUIMIENTO_IA ?? 0, color: '#A78BFA' },
        { label: 'Cita Confirmada',    count: stats.pipelineByStage.CITA_CONFIRMADA   ?? 0, color: '#F59E0B' },
        { label: 'Revenue Cerrado',    count: stats.pipelineByStage.REVENUE_CERRADO   ?? 0, color: GREEN     },
      ]
    : FLOW_STAGES

  const total = stages.reduce((s, st) => s + st.count, 0) || 1
  const stagesWithPct = stages.map((st) => ({ ...st, pct: Math.round((st.count / total) * 100) }))

  return (
    <div style={{ background: BG, minHeight: '100%', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 18 }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 11, flexShrink: 0,
            background: NAVY,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 0 1px rgba(19,36,74,0.15)',
          }}>
            <span style={{ color: '#fff', fontSize: 17, fontWeight: 800, lineHeight: 1 }}>W</span>
          </div>
          <div>
            <h1 style={{ color: TEXT, fontSize: 17, fontWeight: 700, margin: 0, lineHeight: 1 }}>
              Dashboard de Inteligencia
            </h1>
            <p style={{ color: MUTED, fontSize: 12, margin: '3px 0 0', textTransform: 'capitalize' }}>
              {today}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6,
          background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.22)',
          borderRadius: 99, padding: '5px 13px',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: GREEN, display: 'inline-block' }} />
          <span style={{ color: GREEN, fontSize: 11, fontWeight: 700, letterSpacing: '0.05em' }}>IA ACTIVA</span>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: 'flex', gap: 2, borderBottom: `1px solid ${BORDER}` }}>
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '8px 16px', fontSize: 13,
              fontWeight: tab === i ? 600 : 400,
              color: tab === i ? TEXT : MUTED,
              borderBottom: tab === i ? `2px solid ${NAVY}` : '2px solid transparent',
              marginBottom: -1, transition: 'color 0.15s',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ══════════ TAB 0 — Resumen Ejecutivo ══════════ */}
      {tab === 0 && (
        <>
          {/* KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
            {kpis.map((kpi) => (
              <div
                key={kpi.label}
                style={{
                  background: kpi.highlight ? 'rgba(34,197,94,0.06)' : SURF,
                  border: kpi.highlight ? '1px solid rgba(34,197,94,0.18)' : `1px solid ${BORDER}`,
                  borderRadius: 14, padding: '18px 20px',
                  display: 'flex', flexDirection: 'column', gap: 14,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: MUTED, fontWeight: 500 }}>{kpi.label}</span>
                  <div style={{
                    width: 32, height: 32, borderRadius: 9, flexShrink: 0,
                    background: `${kpi.color}1A`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <kpi.Icon size={15} color={kpi.color} strokeWidth={2} />
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                    <span style={{ fontSize: 30, fontWeight: 800, color: kpi.color, lineHeight: 1 }}>
                      {kpi.value}
                    </span>
                    {kpi.suffix && (
                      <span style={{ fontSize: 12, fontWeight: 600, color: kpi.color, opacity: 0.65 }}>
                        {kpi.suffix}
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: 11, color: MUTED, marginTop: 4, display: 'block' }}>
                    {kpi.sub}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Main 2-col grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 12 }}>

            {/* Left — Interacciones recientes */}
            <div style={{
              background: SURF, border: `1px solid ${BORDER}`,
              borderRadius: 14, overflow: 'hidden',
              display: 'flex', flexDirection: 'column',
            }}>
              <div style={{
                padding: '14px 20px',
                borderBottom: `1px solid ${BORDER}`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div>
                  <p style={{ color: TEXT, fontSize: 13, fontWeight: 600, margin: 0 }}>
                    Interacciones Recientes
                  </p>
                  <p style={{ color: MUTED, fontSize: 11, margin: '2px 0 0' }}>
                    Últimas 24 horas · gestionadas por IA
                  </p>
                </div>
                <span style={{ fontSize: 11, color: GREEN, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2 }}>
                  Ver todas <ChevronRight size={12} />
                </span>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                    {['Paciente', 'Canal', 'Hora', 'Estado'].map((h) => (
                      <th key={h} style={{
                        padding: '10px 20px', textAlign: 'left',
                        fontSize: 10, fontWeight: 600, color: MUTED,
                        textTransform: 'uppercase', letterSpacing: '0.06em',
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(stats?.recentLeads.length ? stats.recentLeads : RECENT.map(r => ({
                    id: r.name, patientName: r.name, channel: r.ch,
                    status: r.status === 'confirmed' ? 'CITA_CONFIRMADA' : r.status === 'pending' ? 'EN_SEGUIMIENTO_IA' : 'PERDIDO',
                    appointmentValue: null,
                    createdAt: new Date().toISOString(),
                  }))).map((r, i, arr) => {
                    const st = STATUS_MAP[r.status] ?? { label: r.status, color: MUTED }
                    const hour = new Date(r.createdAt).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
                    return (
                      <tr key={r.id} style={{ borderBottom: i < arr.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
                        <td style={{ padding: '12px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                            <div style={{
                              width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                              background: 'var(--accent-subtle)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                              <span style={{ fontSize: 10, fontWeight: 700, color: TEXT }}>
                                {r.patientName.charAt(0)}
                              </span>
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 500, color: TEXT }}>{r.patientName}</span>
                          </div>
                        </td>
                        <td style={{ padding: '12px 20px', fontSize: 12, color: MUTED }}>{r.channel}</td>
                        <td style={{ padding: '12px 20px', fontSize: 12, color: MUTED }}>{hour}</td>
                        <td style={{ padding: '12px 20px' }}>
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: 5,
                            fontSize: 10, fontWeight: 600,
                            padding: '3px 9px', borderRadius: 99,
                            background: `${st.color}1A`, color: st.color,
                          }}>
                            <span style={{ width: 4, height: 4, borderRadius: '50%', background: st.color, flexShrink: 0 }} />
                            {st.label}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Right column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

              {/* Crecimiento card */}
              <div style={{
                background: SURF, border: `1px solid ${BORDER}`,
                borderRadius: 14, padding: '16px 18px',
                display: 'flex', flexDirection: 'column', gap: 12,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 9,
                    background: 'rgba(34,197,94,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Zap size={14} color={GREEN} />
                  </div>
                  <div>
                    <p style={{ color: TEXT, fontSize: 12, fontWeight: 600, margin: 0 }}>
                      Crecimiento de Ingresos
                    </p>
                    <p style={{ color: GREEN, fontSize: 11, fontWeight: 700, margin: '1px 0 0' }}>
                      Tendencia +22% este mes
                    </p>
                  </div>
                </div>
                {/* Sparkline */}
                <div style={{ height: 44, display: 'flex', alignItems: 'flex-end', gap: 3 }}>
                  {SPARK.map((h, i) => (
                    <div key={i} style={{
                      flex: 1, borderRadius: 3,
                      background: i === SPARK.length - 1
                        ? GREEN
                        : `rgba(34,197,94,${0.12 + (i / SPARK.length) * 0.45})`,
                      height: `${h}%`,
                      transition: 'height 0.3s ease',
                    }} />
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 10, color: MUTED }}>Mar 1</span>
                  <span style={{ fontSize: 10, color: GREEN, fontWeight: 600 }}>Hoy</span>
                </div>
              </div>

              {/* AI Insights */}
              <div style={{
                background: SURF, border: `1px solid ${BORDER}`,
                borderRadius: 14, padding: '16px 18px',
                display: 'flex', flexDirection: 'column', gap: 12, flex: 1,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <Sparkles size={13} color={GREEN} />
                  <p style={{ color: TEXT, fontSize: 12, fontWeight: 600, margin: 0 }}>
                    Tareas Autónomas IA
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {AI_INSIGHTS.map((ins, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <div style={{
                        width: 18, height: 18, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                        background: ins.done ? 'rgba(34,197,94,0.14)' : 'rgba(245,158,11,0.14)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {ins.done
                          ? <CheckCircle2 size={11} color={GREEN} />
                          : <ArrowRight size={10} color="#F59E0B" />
                        }
                      </div>
                      <p style={{
                        fontSize: 11.5, lineHeight: 1.55, margin: 0,
                        color: ins.done ? MUTED : TEXT,
                      }}>
                        {ins.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ══════════ TAB 1 — Flujos de Calificación ══════════ */}
      {tab === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <h2 style={{ color: TEXT, fontSize: 15, fontWeight: 600, margin: '0 0 4px' }}>
              Flujo de Calificación de Leads
            </h2>
            <p style={{ color: MUTED, fontSize: 12, margin: 0 }}>Pipeline activo · últimos 30 días</p>
          </div>

          {/* Horizontal funnel */}
          <div style={{ display: 'flex', alignItems: 'stretch', gap: 0 }}>
            {stagesWithPct.map((stage, i) => (
              <div key={stage.label} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <div style={{
                  flex: 1,
                  background: SURF, border: `1px solid ${BORDER}`,
                  borderRadius: 14, padding: '20px 18px',
                  display: 'flex', flexDirection: 'column', gap: 10,
                  position: 'relative', overflow: 'hidden',
                }}>
                  {/* Subtle fill */}
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    height: `${Math.min(stage.pct * 0.55, 55)}%`,
                    background: `${stage.color}0C`,
                    borderTop: `1px solid ${stage.color}20`,
                  }} />
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <span style={{
                      fontSize: 9, fontWeight: 700, color: stage.color,
                      textTransform: 'uppercase', letterSpacing: '0.07em',
                    }}>
                      Etapa {i + 1}
                    </span>
                    <p style={{ color: TEXT, fontSize: 13, fontWeight: 600, margin: '5px 0 0', lineHeight: 1.3 }}>
                      {stage.label}
                    </p>
                  </div>
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <span style={{ fontSize: 32, fontWeight: 800, color: stage.color, lineHeight: 1 }}>
                      {stage.count}
                    </span>
                    <span style={{ fontSize: 11, color: MUTED, display: 'block', marginTop: 3 }}>
                      {stage.pct}% del total
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div style={{ position: 'relative', zIndex: 1, height: 3, background: 'var(--border)', borderRadius: 99 }}>
                    <div style={{
                      height: '100%', width: `${stage.pct}%`,
                      background: stage.color, borderRadius: 99,
                    }} />
                  </div>
                </div>
                {i < stagesWithPct.length - 1 && (
                  <div style={{ padding: '0 10px', flexShrink: 0 }}>
                    <ArrowRight size={16} color={MUTED} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Conversion rates */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
            {[
              { label: 'Leads → Cita confirmada', pct: '66%', delta: '+4%', color: '#A78BFA' },
              { label: 'Cita → Advanced Lead',    pct: '58%', delta: '+9%', color: '#F59E0B' },
              { label: 'Advanced → Cerrado',       pct: '67%', delta: '+2%', color: GREEN     },
            ].map((c) => (
              <div key={c.label} style={{
                background: SURF, border: `1px solid ${BORDER}`,
                borderRadius: 12, padding: '14px 16px',
                display: 'flex', flexDirection: 'column', gap: 5,
              }}>
                <span style={{ fontSize: 11, color: MUTED }}>{c.label}</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontSize: 26, fontWeight: 800, color: c.color, lineHeight: 1 }}>{c.pct}</span>
                  <span style={{ fontSize: 11, color: GREEN, fontWeight: 600 }}>{c.delta} vs mes ant.</span>
                </div>
                <span style={{ fontSize: 10, color: MUTED }}>tasa de conversión</span>
              </div>
            ))}
          </div>

          {/* AI recommendation */}
          <div style={{
            background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.15)',
            borderRadius: 12, padding: '14px 18px',
            display: 'flex', alignItems: 'flex-start', gap: 10,
          }}>
            <Sparkles size={14} color={GREEN} style={{ marginTop: 2, flexShrink: 0 }} />
            <div>
              <p style={{ color: TEXT, fontSize: 12, fontWeight: 600, margin: '0 0 4px' }}>
                Recomendación IA · Optimizar Pipeline
              </p>
              <p style={{ color: MUTED, fontSize: 12, margin: 0, lineHeight: 1.6 }}>
                La etapa <strong style={{ color: TEXT }}>«Confirmar Cita»</strong> tiene la mayor caída (34%).
                Activar recordatorio automático a las 2h reduciría el abandono en un estimado del 18%.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
