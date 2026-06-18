'use client'

import { useState, useEffect } from 'react'
import { CalendarDays, Clock, ExternalLink, Info } from 'lucide-react'
import Link from 'next/link'

const N = '#0A0A0A'
const G = '#2563EB'

interface CalendarPlayer {
  id:             string
  fullName:       string
  position:       string | null
  currentClub:    string | null
  photoUrl:       string | null
  storedPhotoUrl: string | null
  contractExpiry: string
  category:       string
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const MONTH_FULL = ['January','February','March','April','May','June','July','August','September','October','November','December']

function isWinterWindow(m: number) { return m === 0 }
function isSummerWindow(m: number) { return m >= 5 && m <= 7 }

function windowLabel(m: number): string | null {
  if (m === 0) return 'Winter Window'
  if (m === 5 || m === 6 || m === 7) return 'Summer Window'
  return null
}

function daysUntil(iso: string): number {
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000)
}

function urgencyColor(days: number) {
  if (days <= 60)  return { bg: 'rgba(239,68,68,0.1)',  text: '#EF4444', border: 'rgba(239,68,68,0.25)'  }
  if (days <= 120) return { bg: 'rgba(245,158,11,0.1)', text: '#F59E0B', border: 'rgba(245,158,11,0.25)' }
  return               { bg: `${G}12`,                 text: G,         border: `${G}30`               }
}

function photoSrc(p: CalendarPlayer) {
  return p.storedPhotoUrl || p.photoUrl || null
}

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

export default function CalendarPage() {
  const [players, setPlayers] = useState<CalendarPlayer[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<{ year: number; month: number } | null>(null)

  useEffect(() => {
    fetch('/api/dashboard/calendar')
      .then(r => r.json())
      .then(d => setPlayers(d.players ?? []))
      .finally(() => setLoading(false))
  }, [])

  const now   = new Date()
  const cells: { year: number; month: number }[] = []
  for (let i = 0; i < 18; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1)
    cells.push({ year: d.getFullYear(), month: d.getMonth() })
  }

  function playersInMonth(year: number, month: number) {
    return players.filter(p => {
      const d = new Date(p.contractExpiry)
      return d.getFullYear() === year && d.getMonth() === month
    })
  }

  const selectedPlayers = selected ? playersInMonth(selected.year, selected.month) : []

  return (
    <div style={{ padding: '40px 40px 80px', fontFamily: 'var(--font-montserrat), sans-serif', maxWidth: 1000 }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `${G}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CalendarDays size={18} color={G} />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: N, margin: 0, letterSpacing: '-0.03em' }}>Market Window Calendar</h1>
        </div>
        <p style={{ color: '#9CA3AF', margin: 0, fontSize: 14 }}>
          Player contract expiries overlaid on FIFA transfer windows. Click a month to see details.
        </p>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{ width: 12, height: 12, borderRadius: 3, background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.4)' }} />
          <span style={{ fontSize: 12, color: '#6B7280' }}>Transfer window</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#EF4444' }} />
          <span style={{ fontSize: 12, color: '#6B7280' }}>Expiring &lt;60 days</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#F59E0B' }} />
          <span style={{ fontSize: 12, color: '#6B7280' }}>Expiring 60–120 days</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: G }} />
          <span style={{ fontSize: 12, color: '#6B7280' }}>Expiring &gt;120 days</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
          <Info size={13} color="#9CA3AF" />
          <span style={{ fontSize: 11, color: '#9CA3AF' }}>Winter: Jan · Summer: Jun–Aug (typical European windows)</span>
        </div>
      </div>

      {/* Calendar grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 64, color: '#9CA3AF', fontSize: 14 }}>Loading calendar…</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {cells.map(({ year, month }) => {
            const monthPlayers = playersInMonth(year, month)
            const isWindow = isWinterWindow(month) || isSummerWindow(month)
            const label    = windowLabel(month)
            const isSelected = selected?.year === year && selected?.month === month

            return (
              <button
                key={`${year}-${month}`}
                onClick={() => setSelected(isSelected ? null : { year, month })}
                style={{
                  textAlign: 'left',
                  background: isSelected ? `${N}` : isWindow ? `${G}08` : 'white',
                  border: `1px solid ${isSelected ? N : isWindow ? `${G}35` : '#E5E7EB'}`,
                  borderRadius: 14,
                  padding: '16px 18px',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  minHeight: 100,
                }}
              >
                {/* Month label */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div>
                    <span style={{ fontSize: 15, fontWeight: 800, color: isSelected ? 'white' : N }}>
                      {MONTH_FULL[month]}
                    </span>
                    <span style={{ fontSize: 12, color: isSelected ? 'rgba(255,255,255,0.5)' : '#9CA3AF', marginLeft: 6 }}>{year}</span>
                  </div>
                  {label && (
                    <span style={{
                      fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 5,
                      background: isSelected ? 'rgba(255,255,255,0.15)' : `${G}15`,
                      color: isSelected ? 'white' : G,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                    }}>
                      {label}
                    </span>
                  )}
                </div>

                {/* Player dots */}
                {monthPlayers.length === 0 ? (
                  <p style={{ fontSize: 12, color: isSelected ? 'rgba(255,255,255,0.4)' : '#D1D5DB', margin: 0 }}>No expirations</p>
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {monthPlayers.slice(0, 6).map(p => {
                      const days = daysUntil(p.contractExpiry)
                      const col  = urgencyColor(days)
                      return (
                        <div key={p.id} style={{
                          display: 'flex', alignItems: 'center', gap: 5,
                          background: isSelected ? 'rgba(255,255,255,0.12)' : col.bg,
                          border: `1px solid ${isSelected ? 'rgba(255,255,255,0.2)' : col.border}`,
                          borderRadius: 20, padding: '3px 8px 3px 4px',
                        }}>
                          <div style={{ width: 18, height: 18, borderRadius: '50%', overflow: 'hidden', background: '#F3F4F6', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {photoSrc(p) ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={photoSrc(p)!} alt={p.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
                            ) : (
                              <span style={{ fontSize: 7, fontWeight: 900, color: isSelected ? '#9CA3AF' : '#9CA3AF' }}>{initials(p.fullName)}</span>
                            )}
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 600, color: isSelected ? 'white' : col.text, whiteSpace: 'nowrap' }}>
                            {p.fullName.split(' ').slice(-1)[0]}
                          </span>
                        </div>
                      )
                    })}
                    {monthPlayers.length > 6 && (
                      <span style={{ fontSize: 11, color: isSelected ? 'rgba(255,255,255,0.6)' : '#9CA3AF', display: 'flex', alignItems: 'center' }}>
                        +{monthPlayers.length - 6} more
                      </span>
                    )}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* Detail panel */}
      {selected && selectedPlayers.length > 0 && (
        <div style={{ marginTop: 24, background: 'white', border: '1px solid #E5E7EB', borderRadius: 16, padding: '20px 24px' }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: N, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
            {MONTH_FULL[selected.month]} {selected.year} — {selectedPlayers.length} expiration{selectedPlayers.length !== 1 ? 's' : ''}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {selectedPlayers.map(p => {
              const days = daysUntil(p.contractExpiry)
              const col  = urgencyColor(days)
              const date = new Date(p.contractExpiry)
              return (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderRadius: 12, background: col.bg, border: `1px solid ${col.border}` }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', overflow: 'hidden', background: '#F3F4F6', flexShrink: 0, border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {photoSrc(p) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={photoSrc(p)!} alt={p.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
                    ) : (
                      <span style={{ fontSize: 13, fontWeight: 900, color: '#D1D5DB' }}>{initials(p.fullName)}</span>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: N, margin: '0 0 2px' }}>{p.fullName}</p>
                    <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>
                      {p.currentClub ?? '—'}{p.position ? ` · ${p.position}` : ''}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'flex-end', marginBottom: 3 }}>
                      <Clock size={12} color={col.text} />
                      <span style={{ fontSize: 12, fontWeight: 700, color: col.text }}>
                        {days <= 0 ? 'Expired' : `${days}d left`}
                      </span>
                    </div>
                    <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0 }}>
                      {date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <Link href={`/dashboard/players/${p.id}`}
                    style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: N, textDecoration: 'none', padding: '6px 12px', borderRadius: 8, border: '1px solid #E5E7EB', background: 'white', flexShrink: 0 }}
                    onClick={e => e.stopPropagation()}
                  >
                    View <ExternalLink size={11} />
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {!loading && players.length === 0 && (
        <div style={{ marginTop: 24, background: 'white', border: '1px solid #E5E7EB', borderRadius: 14, padding: 48, textAlign: 'center' }}>
          <CalendarDays size={36} color="#E5E7EB" style={{ margin: '0 auto 12px', display: 'block' }} />
          <p style={{ fontSize: 15, fontWeight: 700, color: N, margin: '0 0 6px' }}>No contract expiries set</p>
          <p style={{ fontSize: 13, color: '#9CA3AF', margin: '0 auto', maxWidth: 340, lineHeight: 1.6 }}>
            Add contract expiry dates to your players to see them plotted against transfer windows.
          </p>
        </div>
      )}
    </div>
  )
}
