import type { Club }         from '@/lib/domain/types'
import { getCountry, getCompetition } from '@/lib/domain/seed'
import { EntityBadge } from './EntityBadge'
import { C, FONT } from '@/lib/ds'

const TIER_LABEL: Record<number, string> = {
  1: 'Tier 1 · Top Flight', 2: 'Tier 2 · Secondary League',
  3: 'Tier 3', 4: 'Tier 4', 5: 'Tier 5',
}

interface Props { club: Club }

export function ClubCard({ club }: Props) {
  const country     = getCountry(club.countryId)
  const competition = getCompetition(club.primaryCompetitionId)
  const style       = club.recruitmentPhilosophy?.style ?? []
  const openCount   = club.openRequestIds.length

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
        <EntityBadge type="club" />
        {openCount > 0 && (
          <span style={{
            fontFamily: FONT.mono, fontSize: 8, fontWeight: 700, letterSpacing: '0.08em',
            textTransform: 'uppercase', color: '#D97706', background: '#D9770612',
            border: '1px solid #D9770630', borderRadius: 4, padding: '2px 7px',
          }}>
            {openCount} Open {openCount === 1 ? 'Mandate' : 'Mandates'}
          </span>
        )}
      </div>

      {/* Name */}
      <div>
        <div style={{
          fontFamily: FONT.display, fontSize: 'clamp(16px,1.8vw,20px)', fontWeight: 700,
          color: '#111827', letterSpacing: '-0.03em', textTransform: 'uppercase',
          lineHeight: 0.95, marginBottom: 6,
        }}>
          {club.name}
        </div>
        <div style={{ fontFamily: FONT.mono, fontSize: 9, color: C.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
          {country?.name ?? '—'} · {club.city} · {TIER_LABEL[club.tier] ?? `Tier ${club.tier}`}
        </div>
        {competition && (
          <div style={{
            fontFamily: FONT.sans, fontSize: 11, fontWeight: 600,
            color: competition.color ?? C.blue,
          }}>
            {competition.name}
          </div>
        )}
      </div>

      {/* Philosophy */}
      {style.length > 0 && (
        <div>
          <div style={{ fontFamily: FONT.mono, fontSize: 8, color: C.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
            Playing Style
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {style.map(s => (
              <span key={s} style={{
                fontFamily: FONT.sans, fontSize: 9, color: '#059669',
                background: '#05966912', border: '1px solid #05966930',
                borderRadius: 4, padding: '2px 7px', textTransform: 'capitalize',
              }}>
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recruitment budget */}
      {club.recruitmentPhilosophy?.budgetTransfer && (
        <div style={{
          fontFamily: FONT.mono, fontSize: 9, color: C.textSecondary,
          letterSpacing: '0.04em', borderTop: `1px solid ${C.border}`, paddingTop: 10,
        }}>
          Transfer budget ≤ €{(club.recruitmentPhilosophy.budgetTransfer.amount / 1_000_000).toFixed(1)}M
          {club.recruitmentPhilosophy.passportPreference === 'EU' && ' · EU passport required'}
        </div>
      )}
    </div>
  )
}
