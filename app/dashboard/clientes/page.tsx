'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  MessageCircle, Phone, AtSign, Globe,
  Search, TrendingUp, Users, Calendar, DollarSign,
  ChevronRight, Sparkles, ArrowUpRight,
} from 'lucide-react'

const SURF  = 'var(--surface)'
const BORD  = 'var(--border)'
const TEXT  = 'var(--text-primary)'
const MUTED = 'var(--text-secondary)'
const NAVY  = '#13244A'
const GREEN = '#22C55E'
const BLUE  = '#3B82F6'
const PURPLE= '#A78BFA'
const AMBER = '#F59E0B'

// ── Types ─────────────────────────────────────────────────────────────────────

interface PatientLead {
  id: string; status: string; channel: string
  appointmentAt: string | null; appointmentValue: number | null
  notes: string | null; createdAt: string
}

interface Patient {
  id: string; name: string; phone: string | null; channel: string
  totalLeads: number; totalSpent: number; totalBooked: number
  lastContact: string; lastStatus: string; noShowRate: number
  leads: PatientLead[]
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const CH_ICON: Record<string, React.ElementType> = {
  WHATSAPP: MessageCircle, INSTAGRAM: AtSign, FACEBOOK: AtSign, LLAMADA: Phone, WEB: Globe,
}
const CH_COLOR: Record<string, string> = {
  WHATSAPP: '#22C55E', INSTAGRAM: '#E1306C', FACEBOOK: '#1877F2', LLAMADA: BLUE, WEB: PURPLE,
}
const CH_LABEL: Record<string, string> = {
  WHATSAPP: 'WhatsApp', INSTAGRAM: 'Instagram', FACEBOOK: 'Facebook', LLAMADA: 'Llamada', WEB: 'Web',
}
const STATUS_COLOR: Record<string, string> = {
  NUEVO: BLUE, EN_SEGUIMIENTO_IA: AMBER, CITA_CONFIRMADA: '#2563EB',
  REVENUE_CERRADO: GREEN, PERDIDO: '#EF4444',
}
const STATUS_LABEL: Record<string, string> = {
  NUEVO: 'Nuevo', EN_SEGUIMIENTO_IA: 'Seguimiento', CITA_CONFIRMADA: 'Confirmado',
  REVENUE_CERRADO: 'Atendido', PERDIDO: 'Perdido',
}

function relTime(iso: string): string {
  const diff  = Date.now() - new Date(iso).getTime()
  const mins  = Math.floor(diff / 60_000)
  if (mins < 60)  return `hace ${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)   return `hace ${hrs}h`
  const days = Math.floor(hrs / 24)
  if (days === 1) return 'ayer'
  if (days < 7)   return `hace ${days}d`
  return new Date(iso).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-MX', {
    weekday: 'short', day: 'numeric', month: 'short',
    hour: '2-digit', minute: '2-digit', hour12: true,
  })
}

// ── Detail Panel ──────────────────────────────────────────────────────────────

function PatientDetail({ patient, onClose }: { patient: Patient; onClose: () => void }) {
  const ChIcon  = CH_ICON[patient.channel] ?? Globe
  const chColor = CH_COLOR[patient.channel] ?? PURPLE
  const attended = patient.leads.filter(l => l.status === 'REVENUE_CERRADO').length
  const showRate = patient.totalLeads > 0 ? Math.round((attended / patient.totalLeads) * 100) : 0

  return (
    <div style={{
      width: 360, flexShrink: 0, background: SURF, borderLeft: `1px solid ${BORD}`,
      display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ padding: '18px 20px', borderBottom: `1px solid ${BORD}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: `${chColor}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: chColor }}>{patient.name.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: TEXT, margin: 0 }}>{patient.name}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
              <ChIcon size={11} color={chColor} />
              <span style={{ fontSize: 11, color: MUTED }}>{CH_LABEL[patient.channel] ?? patient.channel}</span>
              {patient.phone && <span style={{ fontSize: 11, color: MUTED }}>· {patient.phone}</span>}
            </div>
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: MUTED, fontSize: 16, padding: 4 }}>✕</button>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderBottom: `1px solid ${BORD}` }}>
        {[
          { label: 'Total gastado', value: patient.totalSpent > 0 ? `$${Intl.NumberFormat('es-MX').format(patient.totalSpent)}` : '—', color: GREEN },
          { label: 'Contactos',     value: String(patient.totalLeads), color: BLUE },
          { label: 'Asistencia',    value: `${showRate}%`, color: showRate >= 70 ? GREEN : showRate >= 40 ? AMBER : '#EF4444' },
        ].map((s, i) => (
          <div key={s.label} style={{ padding: '14px 0', borderRight: i < 2 ? `1px solid ${BORD}` : 'none', textAlign: 'center' }}>
            <p style={{ fontSize: 18, fontWeight: 800, color: s.color, margin: 0 }}>{s.value}</p>
            <p style={{ fontSize: 10, color: MUTED, margin: '3px 0 0' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* AI insight */}
      <div style={{ margin: '12px 16px 0', padding: '10px 13px', borderRadius: 10, background: 'rgba(167,139,250,0.08)', border: `1px solid ${PURPLE}22`, display: 'flex', gap: 8 }}>
        <Sparkles size={12} color={PURPLE} style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ fontSize: 11, color: PURPLE, margin: 0, lineHeight: 1.5 }}>
          {patient.totalSpent > 5000
            ? `Paciente de alto valor · $${Intl.NumberFormat('es-MX').format(patient.totalSpent)} MXN acumulados. Candidato a campaña de retención.`
            : patient.noShowRate > 50
            ? `No-show frecuente (${patient.noShowRate}%). Welko enviará doble recordatorio en próximas citas.`
            : patient.totalLeads === 1
            ? 'Primer contacto. Welko hace seguimiento activo para agendar cita.'
            : `Paciente recurrente · ${patient.totalLeads} contactos. Canal preferido: ${CH_LABEL[patient.channel] ?? patient.channel}.`
          }
        </p>
      </div>

      {/* Timeline */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '4px 0 8px' }}>Historial</p>
        {patient.leads.map((lead) => {
          const Icon  = CH_ICON[lead.channel] ?? Globe
          const color = STATUS_COLOR[lead.status] ?? MUTED
          return (
            <div key={lead.id} style={{ padding: '11px 13px', borderRadius: 10, background: 'var(--bg)', border: `1px solid ${BORD}`, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Icon size={11} color={CH_COLOR[lead.channel] ?? MUTED} />
                  <span style={{ fontSize: 11, color: MUTED }}>{relTime(lead.createdAt)}</span>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 99, background: `${color}15`, color }}>
                  {STATUS_LABEL[lead.status] ?? lead.status}
                </span>
              </div>
              {lead.appointmentAt && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Calendar size={10} color={MUTED} />
                  <span style={{ fontSize: 11, color: TEXT }}>{fmtDate(lead.appointmentAt)}</span>
                  {lead.appointmentValue && (
                    <span style={{ fontSize: 11, fontWeight: 700, color: GREEN, marginLeft: 'auto' }}>
                      ${Intl.NumberFormat('es-MX').format(lead.appointmentValue)}
                    </span>
                  )}
                </div>
              )}
              {lead.notes && (
                <p style={{ fontSize: 11, color: MUTED, margin: 0, lineHeight: 1.45, fontStyle: 'italic' }}>"{lead.notes}"</p>
              )}
            </div>
          )
        })}
        {patient.leads.length === 0 && (
          <p style={{ fontSize: 12, color: MUTED, textAlign: 'center', padding: 20 }}>Sin historial disponible</p>
        )}
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ClientesPage() {
  const [patients, setPatients]     = useState<Patient[]>([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [sortBy, setSortBy]         = useState<'lastContact' | 'totalSpent' | 'totalLeads'>('lastContact')
  const [selected, setSelected]     = useState<Patient | null>(null)
  const [filterChannel, setChannel] = useState('todos')

  useEffect(() => {
    fetch('/api/patients')
      .then(r => r.json())
      .then(({ patients: p }: { patients: Patient[] }) => setPatients(p))
      .catch(() => null)
      .finally(() => setLoading(false))
  }, [])

  const channels = useMemo(() => {
    const set = new Set(patients.map(p => p.channel))
    return ['todos', ...Array.from(set)]
  }, [patients])

  const filtered = useMemo(() => {
    let list = patients
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.phone?.includes(q))
    }
    if (filterChannel !== 'todos') list = list.filter(p => p.channel === filterChannel)
    return [...list].sort((a, b) => {
      if (sortBy === 'totalSpent') return b.totalSpent  - a.totalSpent
      if (sortBy === 'totalLeads') return b.totalLeads  - a.totalLeads
      return new Date(b.lastContact).getTime() - new Date(a.lastContact).getTime()
    })
  }, [patients, search, sortBy, filterChannel])

  const totalPatients  = patients.length
  const activePatients = patients.filter(p => ['NUEVO', 'EN_SEGUIMIENTO_IA', 'CITA_CONFIRMADA'].includes(p.lastStatus)).length
  const totalRevenue   = patients.reduce((s, p) => s + p.totalSpent, 0)
  const patientsWithSpend = patients.filter(p => p.totalSpent > 0).length
  const avgTicket      = patientsWithSpend > 0 ? Math.round(totalRevenue / patientsWithSpend) : 0

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>

      {/* Header + KPIs */}
      <div style={{ padding: '24px 28px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <h1 style={{ color: TEXT, fontSize: 18, fontWeight: 700, margin: 0 }}>Clientes</h1>
          <p style={{ color: MUTED, fontSize: 12, margin: '3px 0 0' }}>Historial y ficha de cada paciente de la clínica</p>
        </div>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
          {[
            { Icon: Users,        color: BLUE,   label: 'Total pacientes',   value: loading ? '…' : String(totalPatients) },
            { Icon: TrendingUp,   color: GREEN,  label: 'Pacientes activos',  value: loading ? '…' : String(activePatients) },
            { Icon: DollarSign,   color: PURPLE, label: 'Revenue total',      value: loading ? '…' : `$${Intl.NumberFormat('es-MX').format(totalRevenue)}` },
            { Icon: ArrowUpRight, color: AMBER,  label: 'Ticket promedio',    value: loading ? '…' : avgTicket > 0 ? `$${Intl.NumberFormat('es-MX').format(avgTicket)}` : '—' },
          ].map(k => (
            <div key={k.label} style={{ background: SURF, border: `1px solid ${BORD}`, borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <span style={{ fontSize: 11, color: MUTED }}>{k.label}</span>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: `${k.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <k.Icon size={13} color={k.color} />
                </div>
              </div>
              <span style={{ fontSize: 24, fontWeight: 800, color: k.color }}>{k.value}</span>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 200, padding: '8px 13px', borderRadius: 10, background: SURF, border: `1px solid ${BORD}` }}>
            <Search size={13} color={MUTED} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nombre o teléfono…"
              style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: 13, color: TEXT }}
            />
          </div>
          {channels.map(ch => (
            <button key={ch} onClick={() => setChannel(ch)}
              style={{
                padding: '6px 13px', borderRadius: 99, fontSize: 12, fontWeight: 500, cursor: 'pointer',
                border: `1px solid ${filterChannel === ch ? NAVY : BORD}`,
                background: filterChannel === ch ? NAVY : SURF,
                color: filterChannel === ch ? '#fff' : MUTED,
              }}>
              {ch === 'todos' ? 'Todos' : CH_LABEL[ch] ?? ch}
            </button>
          ))}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as typeof sortBy)}
            style={{ padding: '6px 12px', borderRadius: 9, border: `1px solid ${BORD}`, background: SURF, color: TEXT, fontSize: 12, cursor: 'pointer', outline: 'none' }}>
            <option value="lastContact">Último contacto</option>
            <option value="totalSpent">Mayor gasto</option>
            <option value="totalLeads">Más contactos</option>
          </select>
        </div>
      </div>

      {/* Main area: table + detail panel */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0, marginTop: 16, overflow: 'hidden' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 28px 24px' }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', fontSize: 13, color: MUTED }}>Cargando pacientes…</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', fontSize: 13, color: MUTED }}>
              {search ? 'Sin resultados para tu búsqueda.' : 'Aún no hay pacientes. Las conversaciones de WhatsApp crearán registros automáticamente.'}
            </div>
          ) : (
            <div style={{ background: SURF, border: `1px solid ${BORD}`, borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${BORD}` }}>
                    {['Paciente', 'Canal', 'Último contacto', 'Contactos', 'Total gastado', 'Último estado', ''].map(h => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p, i) => {
                    const ChIcon  = CH_ICON[p.channel] ?? Globe
                    const chColor = CH_COLOR[p.channel] ?? PURPLE
                    const stColor = STATUS_COLOR[p.lastStatus] ?? MUTED
                    const isSel   = selected?.id === p.id

                    return (
                      <tr
                        key={p.id}
                        onClick={() => setSelected(isSel ? null : p)}
                        style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${BORD}` : 'none', background: isSel ? `${NAVY}08` : 'transparent', cursor: 'pointer' }}
                        onMouseEnter={e => { if (!isSel) (e.currentTarget as HTMLElement).style.background = 'var(--accent-ghost)' }}
                        onMouseLeave={e => { if (!isSel) (e.currentTarget as HTMLElement).style.background = isSel ? `${NAVY}08` : 'transparent' }}
                      >
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 32, height: 32, borderRadius: 9, background: `${chColor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <span style={{ fontSize: 12, fontWeight: 800, color: chColor }}>{p.name.charAt(0).toUpperCase()}</span>
                            </div>
                            <div>
                              <p style={{ fontSize: 13, fontWeight: 600, color: TEXT, margin: 0 }}>{p.name}</p>
                              {p.phone && <p style={{ fontSize: 11, color: MUTED, margin: 0 }}>{p.phone}</p>}
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <ChIcon size={12} color={chColor} />
                            <span style={{ fontSize: 12, color: MUTED }}>{CH_LABEL[p.channel] ?? p.channel}</span>
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: 12, color: MUTED }}>{relTime(p.lastContact)}</td>
                        <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 600, color: TEXT }}>{p.totalLeads}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: p.totalSpent > 0 ? GREEN : MUTED }}>
                            {p.totalSpent > 0 ? `$${Intl.NumberFormat('es-MX').format(p.totalSpent)}` : '—'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 99, background: `${stColor}15`, color: stColor }}>
                            {STATUS_LABEL[p.lastStatus] ?? p.lastStatus}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <ChevronRight size={14} color={isSel ? NAVY : MUTED} style={{ transform: isSel ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }} />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table></div>
            </div>
          )}
        </div>

        {/* Detail panel */}
        {selected && (
          <PatientDetail patient={selected} onClose={() => setSelected(null)} />
        )}
      </div>
    </div>
  )
}
