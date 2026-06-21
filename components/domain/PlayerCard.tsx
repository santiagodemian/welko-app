import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Player }     from '@/lib/domain/types'
import { getClub, getAgent, getCountry, getDomainReport } from '@/lib/domain/seed'
import { EntityBadge }   from './EntityBadge'
import { PositionBadge } from './PositionBadge'
import { RelationChip }  from './RelationChip'
import { C, FONT } from '@/lib/ds'

const STATUS_COLORS: Record<string, string> = {
  active:     '#059669',
  'free-agent': '#D97706',
  injured:    '#DC2626',
  suspended:  '#7C3AED',
  retired:    '#6B7280',
  unknown:    '#6B7280',
}

const STATUS_LABELS: Record<string, string> = {
  active:     'Active',
  'free-agent': 'Free Agent',
  injured:    'Injured',
  suspended:  'Suspended',
  retired:    'Retired',
  unknown:    'Unknown',
}

interface Props {
  player:    Player
  variant?:  'default' | 'compact'
}

export function PlayerCard({ player, variant = 'default' }: Props) {
  const club    = player.currentClubId ? getClub(player.currentClubId)   : undefined
  const agent   = player.agentId       ? getAgent(player.agentId)         : undefined
  const country = getCountry(player.nationalityId)
  const report  = player.reportIds[0]  ? getDomainReport(player.reportIds[0]) : undefined

  const statusColor = STATUS_COLORS[player.status] ?? '#6B7280'
  const statusLabel = STATUS_LABELS[player.status] ?? player.status

  return (
    <div className="dm-player-card" style={{
      background:   '#FFFFFF',
      border:       `1px solid ${C.border}`,
      borderRadius: 10,
      padding:      'clamp(16px,1.8vw,22px)',
      display:      'flex',
      flexDirection:'column',
      gap:          14,
      transition:   'box-shadow 0.16s, border-color 0.16s',
    }}>

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <div>
          <EntityBadge type="player" />
        </div>
        <span style={{
          fontFamily: FONT.mono, fontSize: 8, fontWeight: 700,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          color: statusColor, background: `${statusColor}12`,
          border: `1px solid ${statusColor}30`, borderRadius: 4,
          padding: '2px 7px',
        }}>
          {statusLabel}
        </span>
      </div>

      {/* Player name + positions */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <PositionBadge position={player.position} group={player.positionGroup} size="md" />
          {player.positions.slice(1).map(p => (
            <PositionBadge key={p} position={p} group={player.positionGroup} />
          ))}
        </div>
        <div style={{
          fontFamily:    FONT.display, fontSize: 'clamp(16px,1.8vw,20px)', fontWeight: 700,
          color:         '#111827', letterSpacing: '-0.03em', textTransform: 'uppercase',
          lineHeight:    0.95, marginBottom: 4,
        }}>
          {player.firstName}{' '}
          <span style={{ color: C.blue }}>{player.lastName}</span>
        </div>
        <div style={{ fontFamily: FONT.mono, fontSize: 9, color: C.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {player.age} yrs · {country?.name ?? '—'}{player.nationality2Id ? ` / ${getCountry(player.nationality2Id)?.name}` : ''} · {player.preferredFoot} foot
        </div>
      </div>

      {/* Relations */}
      {variant === 'default' && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {club  && <RelationChip label="plays for"  target={club.shortName}  color="#059669" />}
          {agent && <RelationChip label="represented by" target={agent.name}  color="#7C3AED" />}
          {player.marketValue && (
            <RelationChip label="value" target={`€${(player.marketValue.amount / 1000).toFixed(0)}K`} color="#D97706" />
          )}
          {player.currentContract && (
            <RelationChip label="contract" target={`until ${player.currentContract.endDate.substring(0, 7)}`} color="#374151" />
          )}
        </div>
      )}

      {/* Tags */}
      {player.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {player.tags.slice(0, 4).map(tag => (
            <span key={tag} style={{
              fontFamily: FONT.sans, fontSize: 9, color: C.textSecondary,
              background: C.bgAlt, border: `1px solid ${C.border}`,
              borderRadius: 4, padding: '2px 6px',
            }}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Report CTA */}
      {report && (
        <div style={{ marginTop: 'auto', paddingTop: 10, borderTop: `1px solid ${C.border}` }}>
          <Link href={report.href} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            textDecoration: 'none',
            fontFamily: FONT.sans, fontSize: 10, fontWeight: 700,
            color: C.blue, letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>
            <span>{report.reportNumber} · {report.verdict}</span>
            <ArrowRight size={11} />
          </Link>
        </div>
      )}
    </div>
  )
}
