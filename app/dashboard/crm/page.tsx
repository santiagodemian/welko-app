'use client'

import { useState } from 'react'
import {
  Phone, MessageCircle, AtSign, Share2, Globe,
  Sparkles, Brain, Bell, Zap, Users, TrendingUp,
  CheckCircle2, Clock, Calendar, PhoneCall,
} from 'lucide-react'

/* ── Design tokens ── */
const SURF   = 'var(--surface)'
const SURF2  = 'var(--surface-hover)'
const BORD   = 'var(--border)'
const TEXT   = 'var(--text-primary)'
const MUTED  = 'var(--text-secondary)'
const NAVY   = '#1A2A56'
const NAVY2  = '#2B3F7A'
const BLUE   = '#3B82F6'
const AMBER  = '#F59E0B'
const PURPLE = '#A78BFA'
const RED    = '#EF4444'

/* ── Pipeline definition (Nuevo → Agendado → Confirmado → Atendido) ── */
type PatientStatus = 'NUEVO' | 'AGENDADO' | 'CONFIRMADO' | 'ATENDIDO'
type Channel = 'WHATSAPP' | 'INSTAGRAM' | 'LLAMADA' | 'WEB'

interface Patient {
  id: string
  status: PatientStatus
  name: string
  initial: string
  channel: Channel
  time: string
  value?: number
  aiNote?: string
  pendingConfirm?: boolean
}

const PIPELINE: { key: PatientStatus; label: string; color: string; sublabel: string }[] = [
  { key: 'NUEVO',      label: 'Nuevo',      color: BLUE,   sublabel: 'Contacto inicial' },
  { key: 'AGENDADO',   label: 'Agendado',   color: PURPLE, sublabel: 'Cita programada' },
  { key: 'CONFIRMADO', label: 'Confirmado', color: NAVY2,  sublabel: 'Asistencia confirmada' },
  { key: 'ATENDIDO',   label: 'Atendido',   color: NAVY,   sublabel: 'Consulta completada' },
]

const PATIENTS: Patient[] = [
  { id:'1',  status:'NUEVO',      name:'Valentina Cruz',   initial:'V', channel:'WHATSAPP', time:'12 min', aiNote:'Interesada en blanqueamiento' },
  { id:'2',  status:'NUEVO',      name:'Roberto Herrera',  initial:'R', channel:'INSTAGRAM',time:'45 min' },
  { id:'3',  status:'NUEVO',      name:'Fernanda López',   initial:'F', channel:'LLAMADA',  time:'2h',     aiNote:'Preguntó por implantes' },
  { id:'4',  status:'AGENDADO',   name:'Miguel Sánchez',   initial:'M', channel:'WHATSAPP', time:'Mañana 10am', value:1800, pendingConfirm:true },
  { id:'5',  status:'AGENDADO',   name:'Ana Martínez',     initial:'A', channel:'WHATSAPP', time:'Mañana 11am', value:2500, pendingConfirm:true },
  { id:'6',  status:'AGENDADO',   name:'Carlos Ruiz',      initial:'C', channel:'WEB',      time:'Mañana 2pm',  value:3200, pendingConfirm:false },
  { id:'7',  status:'CONFIRMADO', name:'Isabel Torres',    initial:'I', channel:'WHATSAPP', time:'Hoy 4pm',     value:1800 },
  { id:'8',  status:'CONFIRMADO', name:'Diego Morales',    initial:'D', channel:'LLAMADA',  time:'Mañana 9am',  value:3500 },
  { id:'9',  status:'CONFIRMADO', name:'Patricia Vega',    initial:'P', channel:'INSTAGRAM',time:'Mañana 3pm',  value:2200 },
  { id:'10', status:'ATENDIDO',   name:'Luis Hernández',   initial:'L', channel:'WHATSAPP', time:'Hoy',         value:4500 },
  { id:'11', status:'ATENDIDO',   name:'Sofía Ramírez',    initial:'S', channel:'LLAMADA',  time:'Ayer',        value:8000 },
  { id:'12', status:'ATENDIDO',   name:'Marco Jiménez',    initial:'M', channel:'WEB',      time:'Ayer',        value:2800 },
]

/* ── Smart reminders (patients with pendingConfirm) ── */
const PENDING_REMINDERS = PATIENTS.filter(p => p.pendingConfirm)

/* ── AI task data ── */
const AI_TASKS = [
  { Icon:Phone,    color:AMBER,  type:'Follow-up',    name:'Carlos Ruiz',           detail:'Sin respuesta en 72h. Welko enviará mensaje de reactivación a las 10am.', urgent:true },
  { Icon:Bell,     color:NAVY2,  type:'Recordatorio', name:'Isabel Torres',         detail:'Cita hoy 4pm. Recordatorio enviado y confirmado por WhatsApp ✓', urgent:false },
  { Icon:Bell,     color:NAVY2,  type:'Recordatorio', name:'Diego Morales',         detail:'Cita mañana 9am. Recordatorio enviado ✓', urgent:false },
  { Icon:Bell,     color:AMBER,  type:'Recordatorio', name:'Patricia Vega',         detail:'Cita mañana 3pm. Pendiente de confirmación del paciente.', urgent:true },
  { Icon:Zap,      color:BLUE,   type:'Reactivación', name:'8 pacientes inactivos', detail:'Última visita hace +60 días. Campaña de reenganche iniciará mañana 9am.', urgent:false },
]

/* ── Stats data (Pro) ── */
const RESCUED_CALLS = [
  { day: 'L', rescued: 8, missed: 3 },
  { day: 'M', rescued: 12, missed: 2 },
  { day: 'X', rescued: 9, missed: 4 },
  { day: 'J', rescued: 15, missed: 1 },
  { day: 'V', rescued: 11, missed: 5 },
  { day: 'S', rescued: 6, missed: 2 },
]

const CONVERSION_FUNNEL = [
  { label: 'Contactos recibidos',  value: 324, pct: 100, color: BLUE },
  { label: 'Respondidos < 2 seg',  value: 298, pct: 92,  color: NAVY2 },
  { label: 'Cita agendada',        value: 201, pct: 67,  color: NAVY },
  { label: 'Cita confirmada',      value: 179, pct: 89,  color: '#0D1C3D' },
]

/* ── Channel icons ── */
const CHANNEL_META: Record<Channel, { Icon: React.ElementType; color: string }> = {
  WHATSAPP:  { Icon: MessageCircle, color: '#25D366' },
  INSTAGRAM: { Icon: AtSign,        color: '#E1306C' },
  LLAMADA:   { Icon: Phone,         color: PURPLE },
  WEB:       { Icon: Globe,         color: BLUE },
}

function fmt(n: number) { return n.toLocaleString('es-MX') }

/* ── AI reminder message template ── */
function reminderMessage(name: string, time: string) {
  return `Hola ${name} 👋 te recordamos que tienes una cita agendada ${time}. ¿Confirmas tu asistencia? Responde "SÍ" para confirmar o "CAMBIAR" si necesitas reagendar. — Equipo de tu clínica`
}

/* ── Page ── */
export default function CRMPage() {
  const [tab, setTab] = useState<'pipeline' | 'reminders' | 'stats' | 'autonomo'>('pipeline')
  const [sentReminders, setSentReminders] = useState<string[]>([])

  const totalRevenue = PATIENTS.filter(p => p.status === 'ATENDIDO').reduce((s, p) => s + (p.value ?? 0), 0)
  const confirmed = PATIENTS.filter(p => p.status === 'CONFIRMADO').length
  const total = PATIENTS.length

  const KPI = [
    { label: 'Revenue atendido',    value: `$${fmt(totalRevenue)}`, sub: 'MXN esta semana',        color: NAVY,   Icon: TrendingUp },
    { label: 'Tasa de conversión',  value: `${Math.round(confirmed / total * 100)}%`, sub: 'citas confirmadas', color: BLUE,   Icon: Users },
    { label: 'Tareas IA hoy',       value: '5',                      sub: 'ejecutadas sin humanos', color: AMBER,  Icon: Zap },
  ]

  const TABS: { key: typeof tab; label: string }[] = [
    { key: 'pipeline',   label: 'Pipeline' },
    { key: 'reminders',  label: `Recordatorios IA${PENDING_REMINDERS.length ? ` (${PENDING_REMINDERS.length})` : ''}` },
    { key: 'stats',      label: 'Estadísticas' },
    { key: 'autonomo',   label: 'Cerebro IA' },
  ]

  return (
    <div style={{ padding: '24px 28px', minHeight: '100vh', background: 'var(--bg)' }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <Brain size={20} color={NAVY} />
          <h1 style={{ color: TEXT, fontSize: 20, fontWeight: 700, margin: 0 }}>CRM Médico · Cerebro IA</h1>
        </div>
        <p style={{ color: MUTED, fontSize: 13, margin: 0 }}>
          Pipeline de pacientes · Recordatorios inteligentes · Seguimientos autónomos
        </p>
      </div>

      {/* ── KPIs ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 22 }}>
        {KPI.map((k) => (
          <div
            key={k.label}
            style={{
              background: SURF, border: `1px solid ${BORD}`, borderRadius: 14,
              padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14,
            }}
          >
            <div
              style={{
                width: 40, height: 40, borderRadius: 11, flexShrink: 0,
                background: k.color === NAVY ? `${NAVY}12` : k.color === BLUE ? '#3B82F612' : '#F59E0B12',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <k.Icon size={17} color={k.color} />
            </div>
            <div>
              <p style={{ color: TEXT, fontSize: 20, fontWeight: 800, margin: 0, lineHeight: 1 }}>{k.value}</p>
              <p style={{ color: MUTED, fontSize: 11, margin: '3px 0 1px' }}>{k.label}</p>
              <p style={{ color: k.color, fontSize: 10, margin: 0, fontWeight: 600 }}>{k.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div
        style={{
          display: 'flex', gap: 4, marginBottom: 20,
          background: SURF2, borderRadius: 10, padding: 4, width: 'fit-content',
          flexWrap: 'wrap',
        }}
      >
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            style={{
              padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
              border: 'none', cursor: 'pointer', transition: 'all 0.15s',
              background: tab === key ? SURF : 'transparent',
              color: tab === key ? TEXT : MUTED,
              boxShadow: tab === key ? '0 1px 4px rgba(0,0,0,0.12)' : 'none',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ════════════════════════
          TAB: PIPELINE KANBAN
      ════════════════════════ */}
      {tab === 'pipeline' && (
        <div style={{ overflowX: 'auto', paddingBottom: 16 }}>
          <div style={{ display: 'flex', gap: 14, minWidth: 800 }}>
            {PIPELINE.map((col) => {
              const patients = PATIENTS.filter(p => p.status === col.key)
              const colTotal = patients.reduce((s, p) => s + (p.value ?? 0), 0)
              return (
                <div key={col.key} style={{ flex: 1, minWidth: 170 }}>
                  {/* Column header */}
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 2 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: col.color, flexShrink: 0 }} />
                      <span style={{ color: TEXT, fontSize: 12, fontWeight: 700 }}>{col.label}</span>
                      <span style={{
                        marginLeft: 'auto', background: SURF2, color: MUTED,
                        fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 99,
                      }}>
                        {patients.length}
                      </span>
                    </div>
                    <p style={{ color: MUTED, fontSize: 10, margin: '0 0 2px', paddingLeft: 15 }}>{col.sublabel}</p>
                    {colTotal > 0 && (
                      <p style={{ color: col.color, fontSize: 10, margin: 0, paddingLeft: 15, fontWeight: 700 }}>
                        ${fmt(colTotal)} MXN
                      </p>
                    )}
                  </div>
                  <div style={{ height: 2, borderRadius: 99, background: col.color + '30', marginBottom: 10 }} />

                  {/* Patient cards */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {patients.map((p) => {
                      const ch = CHANNEL_META[p.channel]
                      return (
                        <div
                          key={p.id}
                          style={{
                            background: SURF, border: `1px solid ${BORD}`,
                            borderRadius: 10, padding: '10px 12px',
                            borderLeft: `3px solid ${col.color}`, cursor: 'pointer',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                            <div style={{
                              width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                              background: col.color + '18',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                              <span style={{ color: col.color, fontSize: 9, fontWeight: 800 }}>{p.initial}</span>
                            </div>
                            <span style={{
                              color: TEXT, fontSize: 11, fontWeight: 600,
                              flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            }}>
                              {p.name}
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <ch.Icon size={10} color={ch.color} />
                            <span style={{ color: MUTED, fontSize: 9 }}>{p.channel}</span>
                            <span style={{ marginLeft: 'auto', color: MUTED, fontSize: 9 }}>{p.time}</span>
                          </div>
                          {p.value && (
                            <div style={{ marginTop: 5, color: NAVY, fontSize: 11, fontWeight: 700 }}>
                              ${fmt(p.value)} MXN
                            </div>
                          )}
                          {p.pendingConfirm && (
                            <div style={{
                              marginTop: 5, display: 'inline-flex', alignItems: 'center', gap: 4,
                              background: AMBER + '18', borderRadius: 6, padding: '2px 7px',
                            }}>
                              <Clock size={9} color={AMBER} />
                              <span style={{ color: AMBER, fontSize: 9, fontWeight: 700 }}>Sin confirmar</span>
                            </div>
                          )}
                          {p.aiNote && (
                            <div style={{ marginTop: 5, display: 'flex', alignItems: 'flex-start', gap: 5 }}>
                              <Sparkles size={9} color={PURPLE} style={{ flexShrink: 0, marginTop: 1 }} />
                              <span style={{ color: PURPLE + 'BB', fontSize: 9, lineHeight: 1.5 }}>{p.aiNote}</span>
                            </div>
                          )}
                        </div>
                      )
                    })}
                    {patients.length === 0 && (
                      <div style={{
                        border: `1px dashed ${col.color}30`, borderRadius: 10,
                        padding: '16px 12px', textAlign: 'center', color: MUTED, fontSize: 10,
                      }}>
                        Sin pacientes
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ════════════════════════
          TAB: RECORDATORIOS IA
      ════════════════════════ */}
      {tab === 'reminders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Banner */}
          <div style={{
            background: NAVY + '08', border: `1px solid ${NAVY}20`,
            borderRadius: 14, padding: '14px 20px',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: NAVY + '14',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Bell size={16} color={NAVY} />
            </div>
            <div>
              <p style={{ color: TEXT, fontSize: 13, fontWeight: 700, margin: 0 }}>
                {PENDING_REMINDERS.length} pacientes no han confirmado su cita
              </p>
              <p style={{ color: MUTED, fontSize: 12, margin: '3px 0 0' }}>
                Welko generó mensajes de WhatsApp personalizados basados en el historial de cada paciente.
              </p>
            </div>
          </div>

          <p style={{ color: MUTED, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
            Mensajes listos para enviar
          </p>

          {PENDING_REMINDERS.map((p) => {
            const isSent = sentReminders.includes(p.id)
            return (
              <div
                key={p.id}
                style={{
                  background: SURF, border: `1px solid ${isSent ? NAVY + '30' : BORD}`,
                  borderRadius: 14, padding: '18px 20px',
                  opacity: isSent ? 0.65 : 1,
                  transition: 'opacity 0.2s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                    background: NAVY + '12',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ color: NAVY, fontSize: 13, fontWeight: 800 }}>{p.initial}</span>
                  </div>
                  <div>
                    <p style={{ color: TEXT, fontSize: 14, fontWeight: 700, margin: 0 }}>{p.name}</p>
                    <p style={{ color: MUTED, fontSize: 12, margin: 0 }}>
                      Cita: {p.time} · ${fmt(p.value ?? 0)} MXN
                    </p>
                  </div>
                  {isSent && (
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5, color: NAVY }}>
                      <CheckCircle2 size={14} />
                      <span style={{ fontSize: 12, fontWeight: 700 }}>Enviado</span>
                    </div>
                  )}
                </div>

                {/* Message preview */}
                <div style={{
                  background: SURF2, borderRadius: 12,
                  padding: '12px 14px', marginBottom: 14,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <Sparkles size={11} color={NAVY} />
                    <span style={{ color: MUTED, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Mensaje generado por Welko IA
                    </span>
                  </div>
                  <p style={{ color: TEXT, fontSize: 13, margin: 0, lineHeight: 1.6 }}>
                    {reminderMessage(p.name.split(' ')[0], `${p.time}`)}
                  </p>
                </div>

                {!isSent && (
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                      onClick={() => setSentReminders(prev => [...prev, p.id])}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '9px 16px', borderRadius: 9, fontSize: 13, fontWeight: 600,
                        border: 'none', cursor: 'pointer',
                        background: NAVY, color: '#FFFFFF',
                        transition: 'opacity 0.15s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
                      onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                    >
                      <MessageCircle size={14} />
                      Enviar por WhatsApp
                    </button>
                    <button
                      style={{
                        padding: '9px 14px', borderRadius: 9, fontSize: 13,
                        border: `1px solid ${BORD}`, cursor: 'pointer',
                        background: 'transparent', color: MUTED,
                      }}
                    >
                      Editar mensaje
                    </button>
                  </div>
                )}
              </div>
            )
          })}

          {PENDING_REMINDERS.length === 0 && (
            <div style={{
              background: SURF, border: `1px solid ${BORD}`, borderRadius: 14,
              padding: '32px', textAlign: 'center',
            }}>
              <CheckCircle2 size={28} color={NAVY} style={{ margin: '0 auto 10px' }} />
              <p style={{ color: TEXT, fontWeight: 700, fontSize: 14, margin: '0 0 4px' }}>Todo confirmado</p>
              <p style={{ color: MUTED, fontSize: 13, margin: 0 }}>Todos los pacientes han confirmado su cita.</p>
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════
          TAB: ESTADÍSTICAS (Pro)
      ════════════════════════ */}
      {tab === 'stats' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Rescued calls chart */}
          <div style={{ background: SURF, border: `1px solid ${BORD}`, borderRadius: 16, padding: '20px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <PhoneCall size={16} color={NAVY} />
              <h3 style={{ color: TEXT, fontSize: 14, fontWeight: 700, margin: 0 }}>Llamadas Rescatadas por Welko</h3>
            </div>
            <p style={{ color: MUTED, fontSize: 12, margin: '0 0 20px' }}>
              Esta semana · Sin intervención humana
            </p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 120 }}>
              {RESCUED_CALLS.map((d) => {
                const maxVal = 18
                const rh = Math.round((d.rescued / maxVal) * 100)
                const mh = Math.round((d.missed / maxVal) * 100)
                return (
                  <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 100 }}>
                      <div style={{
                        width: 16, background: NAVY, borderRadius: '4px 4px 0 0',
                        height: `${rh}%`, transition: 'height 0.4s ease',
                      }} />
                      <div style={{
                        width: 16, background: AMBER + '80', borderRadius: '4px 4px 0 0',
                        height: `${mh}%`, transition: 'height 0.4s ease',
                      }} />
                    </div>
                    <span style={{ color: MUTED, fontSize: 10 }}>{d.day}</span>
                  </div>
                )
              })}
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: NAVY }} />
                <span style={{ color: MUTED, fontSize: 11 }}>Rescatadas por IA</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: AMBER + '80' }} />
                <span style={{ color: MUTED, fontSize: 11 }}>Perdidas</span>
              </div>
            </div>
          </div>

          {/* Conversion funnel */}
          <div style={{ background: SURF, border: `1px solid ${BORD}`, borderRadius: 16, padding: '20px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <TrendingUp size={16} color={NAVY} />
              <h3 style={{ color: TEXT, fontSize: 14, fontWeight: 700, margin: 0 }}>Conversión de Citas</h3>
            </div>
            <p style={{ color: MUTED, fontSize: 12, margin: '0 0 20px' }}>
              Embudo de este mes · Marzo 2026
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {CONVERSION_FUNNEL.map((row) => (
                <div key={row.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ color: TEXT, fontSize: 13, fontWeight: 500 }}>{row.label}</span>
                    <span style={{ color: TEXT, fontSize: 13, fontWeight: 700 }}>{row.value}</span>
                  </div>
                  <div style={{ height: 8, background: BORD, borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', background: row.color,
                      width: `${row.pct}%`, borderRadius: 99,
                      transition: 'width 0.5s ease',
                    }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 18, padding: '12px 16px', background: NAVY + '08', borderRadius: 10 }}>
              <p style={{ color: NAVY, fontSize: 13, fontWeight: 700, margin: 0 }}>
                67% tasa de conversión contacto → cita agendada
              </p>
              <p style={{ color: MUTED, fontSize: 12, margin: '3px 0 0' }}>
                Promedio de la industria: 32% · Welko lo más que duplica.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* ════════════════════════
          TAB: CEREBRO IA
      ════════════════════════ */}
      {tab === 'autonomo' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Status banner */}
          <div style={{
            background: NAVY + '08', border: `1px solid ${NAVY}20`,
            borderRadius: 14, padding: '14px 20px',
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: NAVY + '14',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Sparkles size={16} color={NAVY} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ color: TEXT, fontSize: 13, fontWeight: 700, margin: 0 }}>
                Welko ejecutó 5 tareas autónomas hoy
              </p>
              <p style={{ color: MUTED, fontSize: 11, margin: '3px 0 0' }}>
                1 follow-up enviado · 3 recordatorios de cita · 1 campaña de reactivación — sin intervención humana
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, color: NAVY, fontSize: 11, fontWeight: 700 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: NAVY, display: 'inline-block' }} />
              IA Activa
            </div>
          </div>

          <p style={{ color: MUTED, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
            Tareas programadas
          </p>

          {AI_TASKS.map((task, i) => (
            <div
              key={i}
              style={{
                background: SURF,
                border: `1px solid ${task.urgent ? AMBER + '40' : BORD}`,
                borderRadius: 12, padding: '14px 18px',
                display: 'flex', alignItems: 'flex-start', gap: 14,
              }}
            >
              <div style={{
                width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                background: task.color + '15',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <task.Icon size={16} color={task.color} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                  <span style={{
                    color: task.color, fontSize: 10, fontWeight: 700,
                    background: task.color + '14',
                    padding: '2px 8px', borderRadius: 99,
                  }}>
                    {task.type.toUpperCase()}
                  </span>
                  <span style={{ color: TEXT, fontSize: 13, fontWeight: 600 }}>{task.name}</span>
                  {task.urgent && (
                    <span style={{
                      color: AMBER, fontSize: 10, fontWeight: 700,
                      background: AMBER + '14', padding: '1px 8px', borderRadius: 99,
                    }}>
                      PENDIENTE
                    </span>
                  )}
                </div>
                <p style={{ color: MUTED, fontSize: 12, margin: 0, lineHeight: 1.65 }}>{task.detail}</p>
              </div>
            </div>
          ))}

          {/* Learning */}
          <div style={{
            background: SURF, border: `1px solid ${BORD}`,
            borderRadius: 14, padding: '18px 22px', marginTop: 4,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14 }}>
              <Brain size={16} color={NAVY} />
              <span style={{ color: TEXT, fontSize: 14, fontWeight: 700 }}>Lo que Welko aprendió esta semana</span>
            </div>
            {[
              { insight: 'Los martes 10–12am son tu hora pico. Welko priorizó respuesta inmediata en ese bloque.', color: NAVY },
              { insight: '"Blanqueamiento dental" fue el servicio más consultado: 43% de los leads. Considera destacarlo en campañas.', color: BLUE },
              { insight: '3 pacientes cancelaron mencionando precio. Welko sugiere ofrecer plan de pagos en el siguiente seguimiento.', color: AMBER },
              { insight: 'WhatsApp convierte 71% vs Instagram 38%. Welko priorizará ese canal para reactivaciones.', color: PURPLE },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: item.color, marginTop: 5, flexShrink: 0 }} />
                <p style={{ color: MUTED, fontSize: 12, margin: 0, lineHeight: 1.65 }}>{item.insight}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
