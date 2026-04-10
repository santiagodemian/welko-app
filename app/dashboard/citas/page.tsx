'use client'

import { useState, useEffect } from 'react'
import { CalendarCheck, List, AlertTriangle, MessageCircle, Phone, AtSign, Globe, ChevronLeft, ChevronRight } from 'lucide-react'

const SURF  = 'var(--surface)'
const BORD  = 'var(--border)'
const TEXT  = 'var(--text-primary)'
const MUTED = 'var(--text-secondary)'
const NAVY  = '#13244A'

type Risk    = 'ALTO' | 'MEDIO' | 'BAJO'
type Channel = 'WhatsApp' | 'Instagram' | 'Llamada' | 'Web'

interface Cita {
  id: string; name: string; initial: string
  date: string; time: string; isoDate: string
  service: string; channel: Channel; value: number
  risk: Risk; status: 'CONFIRMADA' | 'PENDIENTE' | 'CANCELADA'
}

// ── API lead shape ─────────────────────────────────────────────────────────────
interface ApiLead {
  id: string
  patientName: string
  status: string
  channel: string
  appointmentAt: string
  appointmentValue: number | null
  reminderSentAt: string | null
  notes: string | null
}

const CHANNEL_MAP: Record<string, Channel> = {
  WHATSAPP: 'WhatsApp', INSTAGRAM: 'Instagram', LLAMADA: 'Llamada', WEB: 'Web',
}

function calcRisk(lead: ApiLead): Risk {
  if (lead.status === 'CITA_CONFIRMADA' && lead.reminderSentAt) return 'BAJO'
  if (lead.status === 'CITA_CONFIRMADA') return 'MEDIO'
  return 'ALTO'
}

function calcStatus(lead: ApiLead): 'CONFIRMADA' | 'PENDIENTE' | 'CANCELADA' {
  if (lead.status === 'CITA_CONFIRMADA' || lead.status === 'REVENUE_CERRADO') return 'CONFIRMADA'
  if (lead.status === 'PERDIDO') return 'CANCELADA'
  return 'PENDIENTE'
}

function formatDate(isoString: string): { date: string; time: string } {
  const d   = new Date(isoString)
  const now = new Date()
  const isToday    = d.toDateString() === now.toDateString()
  const isTomorrow = d.toDateString() === new Date(now.getTime() + 86_400_000).toDateString()

  const hhmm = d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: true })
  const dateLabel = isToday ? 'Hoy'
    : isTomorrow ? 'Mañana'
    : d.toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' })

  return { date: dateLabel, time: hhmm }
}

function toCita(lead: ApiLead): Cita {
  const { date, time } = formatDate(lead.appointmentAt)
  return {
    id:      lead.id,
    name:    lead.patientName,
    initial: lead.patientName.charAt(0).toUpperCase(),
    date,
    time,
    isoDate: lead.appointmentAt,
    service: lead.notes ?? '',
    channel: CHANNEL_MAP[lead.channel] ?? 'Web',
    value:   lead.appointmentValue ?? 0,
    risk:    calcRisk(lead),
    status:  calcStatus(lead),
  }
}

const CH_COLOR: Record<Channel, string> = { WhatsApp: '#22C55E', Instagram: '#E1306C', Llamada: '#3B82F6', Web: '#A78BFA' }
const CH_ICON: Record<Channel, React.ElementType> = { WhatsApp: MessageCircle, Instagram: AtSign, Llamada: Phone, Web: Globe }

const RISK_STYLE: Record<Risk, { bg: string; color: string }> = {
  ALTO:  { bg: '#FEF2F2', color: '#EF4444' },
  MEDIO: { bg: '#FFFBEB', color: '#F59E0B' },
  BAJO:  { bg: '#F0FDF4', color: '#22C55E' },
}
const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  CONFIRMADA: { bg: '#F0FDF4', color: '#22C55E' },
  PENDIENTE:  { bg: '#FFFBEB', color: '#F59E0B' },
  CANCELADA:  { bg: '#FEF2F2', color: '#EF4444' },
}
const RISK_REASONS: Record<Risk, string> = {
  ALTO:  'Sin confirmar · contactado 1 vez',
  MEDIO: 'Confirmado · sin recordatorio enviado',
  BAJO:  'Confirmado · recordatorio enviado ✓',
}

const DAYS  = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom']
const HOURS = ['8:00','9:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00']

/** Returns the ISO week start (Monday) for a given date. */
function weekStart(d: Date): Date {
  const day = d.getDay() === 0 ? 6 : d.getDay() - 1 // 0=Mon
  const start = new Date(d)
  start.setDate(d.getDate() - day)
  start.setHours(0, 0, 0, 0)
  return start
}

// Industry event label for the page title
const INDUSTRY_EVENT: Record<string, string> = {
  salud: 'Cita', restaurante: 'Reservación', barberia: 'Turno',
  hotel: 'Reserva', fitness: 'Clase', legal: 'Consulta',
  spa: 'Sesión', retail: 'Pedido',
}

export default function CitasPage() {
  const [citas, setCitas]       = useState<Cita[]>([])
  const [loading, setLoading]   = useState(true)
  const [view, setView]         = useState<'lista' | 'calendario'>('lista')
  const [filter, setFilter]     = useState('todos')
  const [weekOffset, setWeek]   = useState(0) // weeks relative to today
  const [industrySlug, setIndustrySlug] = useState('salud')

  useEffect(() => {
    const stored = localStorage.getItem('welko_preview_industry')
    if (stored) setIndustrySlug(stored)
  }, [])

  useEffect(() => {
    fetch('/api/leads?withAppointment=true')
      .then(r => r.json())
      .then(({ leads }: { leads: ApiLead[] }) => {
        // Only show upcoming or recent (past 7 days) appointments
        const cutoff = new Date(Date.now() - 7 * 86_400_000)
        setCitas(
          leads
            .filter(l => l.appointmentAt && new Date(l.appointmentAt) >= cutoff)
            .map(toCita)
            .sort((a, b) => new Date(a.isoDate).getTime() - new Date(b.isoDate).getTime())
        )
      })
      .catch(() => null)
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'todos'       ? citas
    : filter === 'alto'      ? citas.filter(c => c.risk === 'ALTO')
    : filter === 'confirmada'? citas.filter(c => c.status === 'CONFIRMADA')
    : citas.filter(c => c.status === 'PENDIENTE')

  const alto = citas.filter(c => c.risk === 'ALTO').length

  // Calendar week grid
  const monday = weekStart(new Date(Date.now() + weekOffset * 7 * 86_400_000))
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
  const weekLabel = `${monday.getDate()} – ${weekDays[6].getDate()} ${monday.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })}`

  function getCitaForCell(dayDate: Date, hour: number): Cita | undefined {
    return citas.find(c => {
      const d = new Date(c.isoDate)
      return d.toDateString() === dayDate.toDateString() && d.getHours() === hour
    })
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100%', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 18 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ color: TEXT, fontSize: 18, fontWeight: 700, margin: 0 }}>
            {INDUSTRY_EVENT[industrySlug] ?? 'Cita'}s
          </h1>
          <p style={{ color: MUTED, fontSize: 12, margin: '3px 0 0' }}>
            {`Próximos ${(INDUSTRY_EVENT[industrySlug] ?? 'Cita').toLowerCase()}s con análisis de riesgo IA`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => setView('lista')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 9, fontSize: 12, fontWeight: 500, border: `1px solid ${BORD}`, cursor: 'pointer', background: view === 'lista' ? NAVY : SURF, color: view === 'lista' ? '#fff' : MUTED }}>
            <List size={13} /> Lista
          </button>
          <button onClick={() => setView('calendario')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 9, fontSize: 12, fontWeight: 500, border: `1px solid ${BORD}`, cursor: 'pointer', background: view === 'calendario' ? NAVY : SURF, color: view === 'calendario' ? '#fff' : MUTED }}>
            <CalendarCheck size={13} /> Semana
          </button>
        </div>
      </div>

      {/* Alert riesgo alto */}
      {!loading && alto > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderRadius: 10, background: '#FEF2F2', border: '1px solid #FECACA' }}>
          <AlertTriangle size={14} color="#EF4444" />
          <p style={{ fontSize: 12, color: '#EF4444', margin: 0 }}>
            <strong>{alto} cita{alto > 1 ? 's' : ''} con riesgo alto de no-show</strong> — Welko enviará recordatorio adicional automáticamente
          </p>
        </div>
      )}

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
        {[
          { label: 'Total próximas',  value: loading ? '…' : String(citas.length),                                           color: '#60A5FA' },
          { label: 'Confirmadas',     value: loading ? '…' : String(citas.filter(c=>c.status==='CONFIRMADA').length),         color: '#22C55E' },
          { label: 'Riesgo alto',     value: loading ? '…' : String(citas.filter(c=>c.risk==='ALTO').length),                 color: '#EF4444' },
          { label: 'Valor pipeline',  value: loading ? '…' : `$${Intl.NumberFormat('es-MX').format(citas.reduce((s,c)=>s+c.value,0))}`, color: '#A78BFA' },
        ].map((k) => (
          <div key={k.label} style={{ background: SURF, border: `1px solid ${BORD}`, borderRadius: 12, padding: '14px 16px' }}>
            <p style={{ fontSize: 11, color: MUTED, margin: '0 0 6px' }}>{k.label}</p>
            <span style={{ fontSize: 22, fontWeight: 800, color: k.color }}>{k.value}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { key: 'todos',      label: 'Todas' },
          { key: 'alto',       label: 'Riesgo alto' },
          { key: 'confirmada', label: 'Confirmadas' },
          { key: 'pendiente',  label: 'Pendientes' },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            style={{ padding: '5px 12px', borderRadius: 99, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: `1px solid ${filter === f.key ? NAVY : BORD}`, background: filter === f.key ? NAVY : SURF, color: filter === f.key ? '#fff' : MUTED }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Lista */}
      {view === 'lista' && (
        <div style={{ background: SURF, border: `1px solid ${BORD}`, borderRadius: 14, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 32, textAlign: 'center', fontSize: 13, color: MUTED }}>Cargando citas…</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center', fontSize: 13, color: MUTED }}>No hay citas en este período</div>
          ) : (
            <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${BORD}` }}>
                  {['Paciente','Fecha / Hora','Canal','Valor','Estado','Riesgo IA'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => {
                  const CIcon = CH_ICON[c.channel]
                  return (
                    <tr key={c.id}
                      style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${BORD}` : 'none' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--accent-ghost)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: TEXT }}>{c.initial}</span>
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>{c.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <p style={{ fontSize: 12, fontWeight: 600, color: TEXT, margin: 0 }}>{c.date}</p>
                        <p style={{ fontSize: 11, color: MUTED, margin: 0 }}>{c.time}</p>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <CIcon size={12} color={CH_COLOR[c.channel]} />
                          <span style={{ fontSize: 12, color: MUTED }}>{c.channel}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 700, color: TEXT }}>
                        {c.value > 0 ? `$${Intl.NumberFormat('es-MX').format(c.value)}` : '—'}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 99, ...STATUS_STYLE[c.status] }}>{c.status}</span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 99, ...RISK_STYLE[c.risk] }}>{c.risk}</span>
                        <p style={{ fontSize: 10, color: MUTED, margin: '3px 0 0', maxWidth: 180, lineHeight: 1.4 }}>{RISK_REASONS[c.risk]}</p>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table></div>
          )}
        </div>
      )}

      {/* Calendario semanal */}
      {view === 'calendario' && (
        <div style={{ background: SURF, border: `1px solid ${BORD}`, borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: `1px solid ${BORD}` }}>
            <button onClick={() => setWeek(w => w - 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: MUTED, display: 'flex' }}><ChevronLeft size={16} /></button>
            <span style={{ fontSize: 13, fontWeight: 600, color: TEXT, flex: 1, textAlign: 'center', textTransform: 'capitalize' }}>{weekLabel}</span>
            <button onClick={() => setWeek(w => w + 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: MUTED, display: 'flex' }}><ChevronRight size={16} /></button>
          </div>
          <div style={{ overflowX: 'auto' }}><div style={{ display: 'grid', gridTemplateColumns: '52px repeat(7,1fr)', minWidth: 560 }}>
            <div style={{ borderBottom: `1px solid ${BORD}` }} />
            {weekDays.map((d, i) => {
              const isToday = d.toDateString() === new Date().toDateString()
              return (
                <div key={i} style={{ textAlign: 'center', padding: '8px 4px', borderBottom: `1px solid ${BORD}`, borderLeft: `1px solid ${BORD}` }}>
                  <p style={{ fontSize: 10, fontWeight: 600, color: MUTED, margin: 0 }}>{DAYS[i]}</p>
                  <p style={{ fontSize: 15, fontWeight: 700, color: isToday ? NAVY : TEXT, margin: '2px 0 0' }}>{d.getDate()}</p>
                </div>
              )
            })}
            {HOURS.map(h => {
              const hour = parseInt(h)
              return (
                <>
                  <div key={`h-${h}`} style={{ padding: '6px', borderBottom: `1px solid ${BORD}`, display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: 9, color: MUTED }}>{h}</span>
                  </div>
                  {weekDays.map((dayDate, di) => {
                    const appt = getCitaForCell(dayDate, hour)
                    return (
                      <div key={`${di}-${h}`} style={{ borderBottom: `1px solid ${BORD}`, borderLeft: `1px solid ${BORD}`, padding: '3px', minHeight: 36 }}>
                        {appt && (
                          <div style={{ background: `${RISK_STYLE[appt.risk].color}18`, border: `1px solid ${RISK_STYLE[appt.risk].color}40`, borderRadius: 4, padding: '3px 5px' }}>
                            <p style={{ fontSize: 10, fontWeight: 600, color: TEXT, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{appt.name.split(' ')[0]}</p>
                            <p style={{ fontSize: 9, color: MUTED, margin: 0 }}>{appt.time}</p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </>
              )
            })}
          </div></div>
        </div>
      )}
    </div>
  )
}
