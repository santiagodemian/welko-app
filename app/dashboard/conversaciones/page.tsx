'use client'

import { useState, useEffect } from 'react'
import {
  MessageCircle, Phone, AtSign, Globe,
  Bell, Zap, AlertTriangle, CheckCircle2, Clock,
  Sparkles, Send, UserCheck,
} from 'lucide-react'
import { getCRMConfig } from '@/lib/industry-crm'

const SURF  = 'var(--surface)'
const BORD  = 'var(--border)'
const TEXT  = 'var(--text-primary)'
const MUTED = 'var(--text-secondary)'
const NAVY  = '#13244A'
const BLUE  = '#3B82F6'
const AMBER = '#F59E0B'
const PURPLE= '#A78BFA'
const GREEN = '#22C55E'

type UiStatus = 'NUEVO' | 'AGENDADO' | 'CONFIRMADO' | 'ATENDIDO'
type Channel  = 'WHATSAPP' | 'INSTAGRAM' | 'LLAMADA' | 'WEB'
type Risk     = 'ALTO' | 'MEDIO' | 'BAJO' | undefined

interface Patient {
  id: string; status: UiStatus; name: string; initial: string
  channel: Channel; time: string; service?: string
  value?: number; aiNote?: string; pendingConfirm?: boolean; risk?: Risk
}

// ── API lead shape ────────────────────────────────────────────────────────────
interface ApiLead {
  id: string
  patientName: string
  status: string
  channel: string
  appointmentAt: string | null
  appointmentValue: number | null
  reminderSentAt: string | null
  notes: string | null
  relativeTime: string
}

// ── Map DB status → kanban column ─────────────────────────────────────────────
function toUiStatus(lead: ApiLead): UiStatus {
  if (lead.status === 'REVENUE_CERRADO') return 'ATENDIDO'
  if (lead.status === 'CITA_CONFIRMADA') return 'CONFIRMADO'
  if (lead.appointmentAt && lead.status === 'EN_SEGUIMIENTO_IA') return 'AGENDADO'
  return 'NUEVO'
}

// ── No-show risk from confirmation state ──────────────────────────────────────
function calcRisk(lead: ApiLead): Risk {
  if (!lead.appointmentAt) return undefined
  if (lead.status === 'CITA_CONFIRMADA' && lead.reminderSentAt) return 'BAJO'
  if (lead.status === 'CITA_CONFIRMADA') return 'MEDIO'
  return 'ALTO' // has appointment but unconfirmed
}

function toPatient(lead: ApiLead): Patient {
  const uiStatus = toUiStatus(lead)
  const risk     = calcRisk(lead)

  // Show appointment time for scheduled leads, otherwise relative creation time
  let timeLabel = lead.relativeTime
  if (lead.appointmentAt) {
    const d = new Date(lead.appointmentAt)
    const now = new Date()
    const isToday    = d.toDateString() === now.toDateString()
    const isTomorrow = d.toDateString() === new Date(now.getTime() + 86_400_000).toDateString()
    const hhmm = d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: true })
    timeLabel = isToday ? `Hoy ${hhmm}` : isTomorrow ? `Mañana ${hhmm}` : d.toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric' }) + ' ' + hhmm
  }

  return {
    id:             lead.id,
    status:         uiStatus,
    name:           lead.patientName,
    initial:        lead.patientName.charAt(0).toUpperCase(),
    channel:        lead.channel as Channel,
    time:           timeLabel,
    value:          lead.appointmentValue ?? undefined,
    aiNote:         lead.notes ?? undefined,
    pendingConfirm: uiStatus === 'AGENDADO' && risk === 'ALTO',
    risk,
  }
}

const CH_ICON: Record<Channel, React.ElementType> = {
  WHATSAPP: MessageCircle, INSTAGRAM: AtSign, LLAMADA: Phone, WEB: Globe,
}
const CH_COLOR: Record<Channel, string> = {
  WHATSAPP: '#22C55E', INSTAGRAM: '#E1306C', LLAMADA: BLUE, WEB: PURPLE,
}

// PIPELINE is built dynamically from CRM config inside the component
const PIPELINE_COLORS: Record<UiStatus, string> = {
  NUEVO:      BLUE,
  AGENDADO:   PURPLE,
  CONFIRMADO: '#2563EB',
  ATENDIDO:   NAVY,
}

const RISK_BADGE: Record<string, { bg: string; color: string }> = {
  ALTO:  { bg: '#FEF2F2', color: '#EF4444' },
  MEDIO: { bg: '#FFFBEB', color: '#F59E0B' },
  BAJO:  { bg: '#F0FDF4', color: '#22C55E' },
}

export default function ConversacionesPage() {
  const [patients, setPatients]  = useState<Patient[]>([])
  const [loading, setLoading]    = useState(true)
  const [selected, setSelected]  = useState<Patient | null>(null)
  const [industry, setIndustry]  = useState<string>('dental')

  useEffect(() => {
    // Read preview industry from dashboard selector
    const previewInd = localStorage.getItem('welko_preview_industry')
    if (previewInd) setIndustry(previewInd)

    fetch('/api/leads')
      .then(r => r.json())
      .then(({ leads, industry: ind }: { leads: ApiLead[]; industry?: string }) => {
        if (ind) setIndustry(ind)
        setPatients(leads.map(toPatient))
      })
      .catch(() => null)
      .finally(() => setLoading(false))
  }, [])

  const crm = getCRMConfig(industry)

  // Move a card to a new status and persist to API
  async function moveStatus(patient: Patient, newUiStatus: UiStatus) {
    const dbStatusMap: Record<UiStatus, string> = {
      NUEVO:      'NUEVO',
      AGENDADO:   'EN_SEGUIMIENTO_IA',
      CONFIRMADO: 'CITA_CONFIRMADA',
      ATENDIDO:   'REVENUE_CERRADO',
    }
    await fetch(`/api/leads/${patient.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: dbStatusMap[newUiStatus] }),
    })
    setPatients(prev =>
      prev.map(p => p.id === patient.id ? { ...p, status: newUiStatus } : p)
    )
  }

  const colCount = (key: UiStatus) => patients.filter(p => p.status === key).length
  const colValue = (key: UiStatus) => patients.filter(p => p.status === key && p.value).reduce((s, p) => s + (p.value ?? 0), 0)

  // Dynamic pipeline based on industry CRM config
  const PIPELINE: { key: UiStatus; label: string; color: string }[] = [
    { key: 'NUEVO',      label: crm.kanban.NUEVO.es,             color: crm.kanban.NUEVO.color             },
    { key: 'AGENDADO',   label: crm.kanban.EN_SEGUIMIENTO_IA.es, color: crm.kanban.EN_SEGUIMIENTO_IA.color },
    { key: 'CONFIRMADO', label: crm.kanban.CITA_CONFIRMADA.es,   color: crm.kanban.CITA_CONFIRMADA.color   },
    { key: 'ATENDIDO',   label: crm.kanban.REVENUE_CERRADO.es,   color: crm.kanban.REVENUE_CERRADO.color   },
  ]

  // AI tasks: pending confirmations + follow-ups
  const pendingConfirm = patients.filter(p => p.pendingConfirm)
  const eventLabelEs = crm.eventLabel.es
  const clientLabelEs = crm.clientLabel.es
  const aiTasks = [
    ...pendingConfirm.map(p => ({
      Icon: Bell, color: AMBER, name: p.name,
      detail: `Sin confirmar ${eventLabelEs.toLowerCase()} ${p.time}. Welko enviará recordatorio automáticamente.`, urgent: true,
    })),
    {
      Icon: Zap, color: BLUE,
      name: `${patients.filter(p => p.status === 'NUEVO').length} ${clientLabelEs.toLowerCase()}s nuevos`,
      detail: 'En seguimiento activo por IA. Respondidos en < 2 seg.', urgent: false,
    },
    {
      Icon: CheckCircle2, color: GREEN,
      name: `${patients.filter(p => p.status === 'ATENDIDO').length} completados`,
      detail: `${crm.kanban.REVENUE_CERRADO.es} este mes.`, urgent: false,
    },
  ].slice(0, 4)

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ padding: '20px 28px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ color: TEXT, fontSize: 18, fontWeight: 700, margin: 0 }}>Conversaciones</h1>
          <p style={{ color: MUTED, fontSize: 12, margin: '3px 0 0' }}>
            Pipeline de {crm.clientLabel.es.toLowerCase()}s · gestionado por IA en tiempo real
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {loading ? (
            <span style={{ fontSize: 10, color: MUTED }}>Cargando…</span>
          ) : (
            <span style={{ fontSize: 10, color: GREEN, fontWeight: 700, background: '#F0FDF4', padding: '4px 10px', borderRadius: 99, display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: GREEN }} />
              IA activa · {colCount('NUEVO')} nuevos hoy
            </span>
          )}
        </div>
      </div>

      {/* Kanban — horizontally scrollable on mobile */}
      <div style={{ overflowX: 'auto', padding: '16px 16px', flex: 1, minHeight: 0 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(220px, 1fr))', gap: 12, minWidth: 900 }}>
        {PIPELINE.map((col) => {
          const patientsInCol = patients.filter(p => p.status === col.key)
          const total         = colValue(col.key)

          return (
            <div key={col.key} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {/* Column header */}
              <div style={{
                background: SURF, border: `1px solid ${BORD}`,
                borderRadius: 12, padding: '10px 14px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: col.color }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: TEXT }}>{col.label}</span>
                  <span style={{ fontSize: 11, color: MUTED, background: 'var(--bg-secondary)', padding: '1px 7px', borderRadius: 99 }}>
                    {colCount(col.key)}
                  </span>
                </div>
                {total > 0 && (
                  <span style={{ fontSize: 10, color: col.color, fontWeight: 700 }}>
                    ${Intl.NumberFormat('es-MX').format(total)}
                  </span>
                )}
              </div>

              {/* Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {patientsInCol.map((p) => {
                  const ChIcon = CH_ICON[p.channel] ?? Globe
                  const risk   = p.risk ? RISK_BADGE[p.risk] : null

                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelected(p.id === selected?.id ? null : p)}
                      style={{
                        background: SURF, border: `1px solid ${p.id === selected?.id ? col.color : BORD}`,
                        borderRadius: 10, padding: '12px 13px',
                        cursor: 'pointer', transition: 'all 0.15s',
                        boxShadow: p.id === selected?.id ? `0 0 0 1px ${col.color}` : 'none',
                      }}
                      onMouseEnter={e => { if (p.id !== selected?.id) (e.currentTarget as HTMLElement).style.borderColor = col.color + '66' }}
                      onMouseLeave={e => { if (p.id !== selected?.id) (e.currentTarget as HTMLElement).style.borderColor = BORD }}
                    >
                      {/* Top row */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: `${col.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ fontSize: 11, fontWeight: 800, color: col.color }}>{p.initial}</span>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 12, fontWeight: 600, color: TEXT, margin: 0 }}>{p.name}</p>
                        </div>
                        {risk && (
                          <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 99, background: risk.bg, color: risk.color, flexShrink: 0 }}>
                            {p.risk}
                          </span>
                        )}
                      </div>

                      {/* Bottom row */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <ChIcon size={11} color={CH_COLOR[p.channel] ?? MUTED} />
                          <span style={{ fontSize: 10, color: MUTED }}>{p.time}</span>
                        </div>
                        {p.value && (
                          <span style={{ fontSize: 10, fontWeight: 700, color: col.color }}>
                            ${Intl.NumberFormat('es-MX').format(p.value)}
                          </span>
                        )}
                        {p.pendingConfirm && (
                          <span style={{ fontSize: 9, color: AMBER, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
                            <Clock size={9} /> Pendiente
                          </span>
                        )}
                      </div>

                      {/* AI note */}
                      {p.aiNote && (
                        <div style={{ marginTop: 8, padding: '6px 9px', borderRadius: 7, background: 'rgba(167,139,250,0.1)', display: 'flex', gap: 5, alignItems: 'flex-start' }}>
                          <Sparkles size={10} color={PURPLE} style={{ marginTop: 1, flexShrink: 0 }} />
                          <p style={{ fontSize: 10, color: PURPLE, margin: 0, lineHeight: 1.4 }}>{p.aiNote}</p>
                        </div>
                      )}

                      {/* Quick move buttons (shown when selected) */}
                      {p.id === selected?.id && (
                        <div style={{ marginTop: 10, display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                          {PIPELINE.filter(c => c.key !== col.key).map(c => (
                            <button
                              key={c.key}
                              onClick={(e) => { e.stopPropagation(); moveStatus(p, c.key) }}
                              style={{
                                fontSize: 9, fontWeight: 600, padding: '3px 8px', borderRadius: 99,
                                border: `1px solid ${c.color}40`, background: `${c.color}12`,
                                color: c.color, cursor: 'pointer',
                              }}
                            >
                              → {c.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}

                {/* Empty state */}
                {patientsInCol.length === 0 && !loading && (
                  <div style={{ padding: '20px 14px', textAlign: 'center', fontSize: 11, color: MUTED }}>
                    Sin pacientes en esta etapa
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
      </div>

      {/* AI Tasks panel */}
      <div style={{ margin: '0 28px 24px', background: SURF, border: `1px solid ${BORD}`, borderRadius: 14, padding: '14px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
          <Sparkles size={13} color={PURPLE} />
          <p style={{ color: TEXT, fontSize: 13, fontWeight: 600, margin: 0 }}>Tareas autónomas de IA</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
          {aiTasks.map((t, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 12px', borderRadius: 10, background: 'var(--bg)' }}>
              <div style={{ width: 26, height: 26, borderRadius: 7, background: `${t.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <t.Icon size={13} color={t.color} />
              </div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 600, color: TEXT, margin: '0 0 2px' }}>{t.name}</p>
                <p style={{ fontSize: 10.5, color: MUTED, margin: 0, lineHeight: 1.45 }}>{t.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
