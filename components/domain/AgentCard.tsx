import type { Agent }    from '@/lib/domain/types'
import { getPlayer, getCountry } from '@/lib/domain/seed'
import { EntityBadge } from './EntityBadge'
import { C, FONT } from '@/lib/ds'

interface Props { agent: Agent }

export function AgentCard({ agent }: Props) {
  const players  = agent.playerIds.map(id => getPlayer(id)).filter(Boolean)
  const country  = getCountry(agent.countryId)

  return (
    <div style={{
      background:    '#FFFFFF',
      border:        `1px solid ${C.border}`,
      borderRadius:  10,
      padding:       'clamp(16px,1.8vw,22px)',
      display:       'flex',
      flexDirection: 'column',
      gap:           14,
    }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <EntityBadge type="agent" />
        {agent.licensed && (
          <span style={{
            fontFamily: FONT.mono, fontSize: 8, fontWeight: 700, letterSpacing: '0.08em',
            textTransform: 'uppercase', color: '#7C3AED',
            background: '#7C3AED12', border: '1px solid #7C3AED30',
            borderRadius: 4, padding: '2px 7px',
          }}>
            Licensed · {agent.licenseBody}
          </span>
        )}
      </div>

      {/* Name */}
      <div>
        <div style={{
          fontFamily: FONT.display, fontSize: 'clamp(16px,1.8vw,20px)', fontWeight: 700,
          color: '#111827', letterSpacing: '-0.03em', textTransform: 'uppercase',
          lineHeight: 0.95, marginBottom: 4,
        }}>
          {agent.name}
        </div>
        <div style={{ fontFamily: FONT.sans, fontSize: 11, color: C.textSecondary, fontWeight: 500 }}>
          {agent.company ?? '—'} · {country?.name ?? '—'}
        </div>
      </div>

      {/* Players on roster */}
      {players.length > 0 && (
        <div>
          <div style={{ fontFamily: FONT.mono, fontSize: 8, color: C.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
            {players.length} {players.length === 1 ? 'Player' : 'Players'} on Roster
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {players.map(p => p && (
              <div key={p.id} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                fontFamily: FONT.sans, fontSize: 11, color: '#374151',
              }}>
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#7C3AED', flexShrink: 0 }} />
                <span style={{ fontWeight: 600 }}>{p.name}</span>
                <span style={{ color: C.textMuted }}>{p.position} · {p.age} yrs</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
