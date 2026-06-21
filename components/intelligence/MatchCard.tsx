import Link from 'next/link'
import type { MatchResult } from '@/lib/intelligence/matchers'
import { getClub }          from '@/lib/domain/seed'
import { PositionBadge }    from '@/components/domain/PositionBadge'
import { MatchScore }       from './MatchScore'
import { C, FONT } from '@/lib/ds'

interface Props {
  result: MatchResult
  rank?:  number
}

export function MatchCard({ result, rank }: Props) {
  const { player, score } = result
  const club = player.currentClubId ? getClub(player.currentClubId) : undefined

  const statusColor =
    player.status === 'free-agent' ? '#059669' :
    player.status === 'active'     ? '#2563EB' :
    player.status === 'injured'    ? '#DC2626' :
    '#6B7280'

  return (
    <div style={{
      background: '#FFFFFF', border: `1px solid ${C.border}`, borderRadius: 10,
      padding: 20, display: 'flex', flexDirection: 'column', gap: 16,
    }}>

      {/* Header: rank + player identity */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        {rank !== undefined && (
          <div style={{
            width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
            background: rank === 1 ? '#0A0A0A' : '#F3F4F6',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: FONT.mono, fontSize: 10, fontWeight: 700,
            color: rank === 1 ? '#FFFFFF' : '#6B7280',
          }}>
            {rank}
          </div>
        )}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
            <span style={{
              fontFamily: FONT.display, fontSize: 16, fontWeight: 700,
              color: '#111827', letterSpacing: '-0.02em',
            }}>
              {player.firstName}{' '}
              <span style={{ color: C.blue }}>{player.lastName}</span>
            </span>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            {player.positions.map(p => (
              <PositionBadge key={p} position={p} group={player.positionGroup} />
            ))}
            <span style={{
              fontFamily: FONT.mono, fontSize: 8, fontWeight: 700, letterSpacing: '0.06em',
              textTransform: 'uppercase', color: statusColor,
              background: `${statusColor}12`, border: `1px solid ${statusColor}30`,
              borderRadius: 4, padding: '2px 7px',
            }}>
              {player.status}
            </span>
          </div>
        </div>
      </div>

      {/* Club + basic info */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {club && (
          <div>
            <div style={{ fontFamily: FONT.mono, fontSize: 7, color: C.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 2 }}>Club</div>
            <div style={{ fontFamily: FONT.sans, fontSize: 12, color: '#374151', fontWeight: 600 }}>{club.name}</div>
          </div>
        )}
        <div>
          <div style={{ fontFamily: FONT.mono, fontSize: 7, color: C.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 2 }}>Age</div>
          <div style={{ fontFamily: FONT.sans, fontSize: 12, color: '#374151', fontWeight: 600 }}>{player.age}</div>
        </div>
        <div>
          <div style={{ fontFamily: FONT.mono, fontSize: 7, color: C.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 2 }}>Foot</div>
          <div style={{ fontFamily: FONT.sans, fontSize: 12, color: '#374151', fontWeight: 600 }}>{player.preferredFoot}</div>
        </div>
        {player.marketValue && (
          <div>
            <div style={{ fontFamily: FONT.mono, fontSize: 7, color: C.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 2 }}>Market Value</div>
            <div style={{ fontFamily: FONT.sans, fontSize: 12, color: '#374151', fontWeight: 600 }}>
              €{(player.marketValue.amount / 1000).toFixed(0)}K
            </div>
          </div>
        )}
        {player.currentContract && (
          <div>
            <div style={{ fontFamily: FONT.mono, fontSize: 7, color: C.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 2 }}>Contract Until</div>
            <div style={{ fontFamily: FONT.sans, fontSize: 12, color: '#374151', fontWeight: 600 }}>
              {player.currentContract.endDate.substring(0, 7)}
            </div>
          </div>
        )}
      </div>

      {/* Match score */}
      <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
        <MatchScore result={result} compact={false} />
      </div>

      {/* CTA */}
      {player.reportIds.length > 0 && (
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
          <Link
            href={`/reports/player/${player.reportIds[0]}`}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontFamily: FONT.sans, fontSize: 11, fontWeight: 700,
              color: C.blue, letterSpacing: '0.04em', textTransform: 'uppercase',
              textDecoration: 'none',
            }}
          >
            View Full Report →
          </Link>
        </div>
      )}
    </div>
  )
}
