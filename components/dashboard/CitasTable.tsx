'use client'

import { useState } from 'react'
import { MessageCircle, Phone, Search, Download } from 'lucide-react'

/* ─── Types ─── */
type Status  = 'confirmed' | 'pending' | 'cancelled'
type Channel = 'whatsapp' | 'phone'
type Period  = 'today' | 'week' | 'month' | 'all'

interface Appointment {
  id: number
  patient: string
  initial: string
  color: string
  date: string        // YYYY-MM-DD
  dateLabel: string   // display
  time: string
  duration: string
  treatment: string
  channel: Channel
  status: Status
  notes: string
}

/* ─── Mock data ─── */
const ALL: Appointment[] = [
  { id:  1, patient: 'María González',   initial: 'MG', color: '#7C3AED', date: '2026-03-26', dateLabel: 'Hoy',       time: '09:00', duration: '45 min', treatment: 'Ortodoncia',     channel: 'whatsapp', status: 'confirmed', notes: 'Ajuste mensual' },
  { id:  2, patient: 'Carlos Ramírez',   initial: 'CR', color: '#0EA5E9', date: '2026-03-26', dateLabel: 'Hoy',       time: '10:30', duration: '30 min', treatment: 'Blanqueamiento', channel: 'whatsapp', status: 'pending',   notes: 'Primera sesión' },
  { id:  3, patient: 'Ana Martínez',     initial: 'AM', color: '#F59E0B', date: '2026-03-26', dateLabel: 'Hoy',       time: '11:00', duration: '60 min', treatment: 'Limpieza',       channel: 'phone',    status: 'confirmed', notes: '—' },
  { id:  4, patient: 'Jorge Hernández',  initial: 'JH', color: '#22C55E', date: '2026-03-26', dateLabel: 'Hoy',       time: '12:00', duration: '45 min', treatment: 'Ortodoncia',     channel: 'whatsapp', status: 'confirmed', notes: 'Brackets metálicos' },
  { id:  5, patient: 'Sofía López',      initial: 'SL', color: '#EC4899', date: '2026-03-26', dateLabel: 'Hoy',       time: '14:00', duration: '30 min', treatment: 'Extracción',     channel: 'whatsapp', status: 'cancelled', notes: 'Reagendar' },
  { id:  6, patient: 'Roberto Vega',     initial: 'RV', color: '#14B8A6', date: '2026-03-27', dateLabel: 'Mañana',    time: '09:30', duration: '60 min', treatment: 'Consulta',       channel: 'whatsapp', status: 'confirmed', notes: 'Nuevo paciente' },
  { id:  7, patient: 'Elena Morales',    initial: 'EM', color: '#F97316', date: '2026-03-27', dateLabel: 'Mañana',    time: '10:00', duration: '90 min', treatment: 'Carillas',       channel: 'phone',    status: 'pending',   notes: '6 carillas sup.' },
  { id:  8, patient: 'Luis García',      initial: 'LG', color: '#8B5CF6', date: '2026-03-27', dateLabel: 'Mañana',    time: '11:30', duration: '30 min', treatment: 'Blanqueamiento', channel: 'whatsapp', status: 'confirmed', notes: 'Sesión 2 de 3' },
  { id:  9, patient: 'Patricia Ruiz',    initial: 'PR', color: '#06B6D4', date: '2026-03-28', dateLabel: 'Pasado',    time: '10:00', duration: '60 min', treatment: 'Limpieza',       channel: 'whatsapp', status: 'confirmed', notes: '—' },
  { id: 10, patient: 'Miguel Torres',    initial: 'MT', color: '#EAB308', date: '2026-03-28', dateLabel: 'Pasado',    time: '12:00', duration: '45 min', treatment: 'Ortodoncia',     channel: 'whatsapp', status: 'pending',   notes: 'Alineadores fase 2' },
]

const TODAY = '2026-03-26'

function filterData(data: Appointment[], period: Period): Appointment[] {
  if (period === 'all') return data
  if (period === 'today') return data.filter((a) => a.date === TODAY)
  if (period === 'week') return data.filter((a) => a.date >= TODAY && a.date <= '2026-04-01')
  if (period === 'month') return data.filter((a) => a.date.startsWith('2026-03'))
  return data
}

const STATUS_STYLE: Record<Status, React.CSSProperties> = {
  confirmed: { background: 'rgba(34,197,94,0.12)',  color: '#22C55E' },
  pending:   { background: 'rgba(245,158,11,0.12)', color: '#F59E0B' },
  cancelled: { background: 'rgba(239,68,68,0.12)',  color: '#EF4444' },
}
const STATUS_LABEL: Record<Status, string> = {
  confirmed: 'Confirmada', pending: 'Pendiente', cancelled: 'Cancelada',
}

const PERIODS: { key: Period; label: string }[] = [
  { key: 'today', label: 'Hoy'     },
  { key: 'week',  label: 'Semana'  },
  { key: 'month', label: 'Mes'     },
  { key: 'all',   label: 'Todos'   },
]

export function CitasTable() {
  const [period, setPeriod]   = useState<Period>('today')
  const [search,  setSearch]  = useState('')

  const filtered = filterData(ALL, period).filter((a) =>
    search ? a.patient.toLowerCase().includes(search.toLowerCase()) || a.treatment.toLowerCase().includes(search.toLowerCase()) : true,
  )

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* Period tabs */}
        <div
          className="flex items-center gap-1 p-1 rounded-xl"
          style={{ background: 'var(--surface-hover)', border: '1px solid var(--border)' }}
        >
          {PERIODS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setPeriod(key)}
              className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-150"
              style={
                period === key
                  ? { background: 'var(--accent)', color: 'var(--accent-fg)' }
                  : { background: 'transparent', color: 'var(--text-secondary)' }
              }
            >
              {label}
            </button>
          ))}
        </div>

        {/* Right: Search + export */}
        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <Search size={14} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Buscar paciente…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none text-sm w-40"
              style={{ color: 'var(--text-primary)' }}
            />
          </div>
          <button
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
          >
            <Download size={14} />
            Exportar
          </button>
        </div>
      </div>

      {/* Count */}
      <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>
        {filtered.length} cita{filtered.length !== 1 ? 's' : ''}
      </p>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        <div className="overflow-x-auto">
          <table style={{ width: '100%', minWidth: 720, background: 'var(--surface)', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Paciente', 'Fecha', 'Hora', 'Tratamiento', 'Canal', 'Duración', 'Estado', 'Notas'].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontSize: 11,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: 'var(--text-muted)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
                    Sin citas para este período
                  </td>
                </tr>
              ) : (
                filtered.map((apt, i) => (
                  <tr
                    key={apt.id}
                    style={{
                      borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.background = 'var(--surface-hover)')
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.background = 'transparent')
                    }
                  >
                    {/* Paciente */}
                    <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            background: `${apt.color}22`,
                            border: `1px solid ${apt.color}44`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 11,
                            fontWeight: 700,
                            color: apt.color,
                            flexShrink: 0,
                          }}
                        >
                          {apt.initial}
                        </div>
                        <span style={{ color: 'var(--text-primary)', fontSize: 14, fontWeight: 500 }}>
                          {apt.patient}
                        </span>
                      </div>
                    </td>

                    {/* Fecha */}
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: 13, whiteSpace: 'nowrap' }}>
                      {apt.dateLabel}
                    </td>

                    {/* Hora */}
                    <td style={{ padding: '14px 16px', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {apt.time}
                    </td>

                    {/* Tratamiento */}
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: 13 }}>
                      {apt.treatment}
                    </td>

                    {/* Canal */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {apt.channel === 'whatsapp' ? (
                          <MessageCircle size={14} color="#22C55E" />
                        ) : (
                          <Phone size={14} color="#3B82F6" />
                        )}
                        <span style={{ fontSize: 12, color: apt.channel === 'whatsapp' ? '#22C55E' : '#3B82F6' }}>
                          {apt.channel === 'whatsapp' ? 'WhatsApp' : 'Llamada'}
                        </span>
                      </div>
                    </td>

                    {/* Duración */}
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: 12, whiteSpace: 'nowrap' }}>
                      {apt.duration}
                    </td>

                    {/* Estado */}
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          ...STATUS_STYLE[apt.status],
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '3px 10px',
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {STATUS_LABEL[apt.status]}
                      </span>
                    </td>

                    {/* Notas */}
                    <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontSize: 12 }}>
                      {apt.notes}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
