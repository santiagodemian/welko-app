import type { MatchResult } from '@/lib/intelligence/matchers'
import { C, FONT } from '@/lib/ds'

function scoreColor(score: number): string {
  if (score >= 85) return '#059669'
  if (score >= 65) return '#2563EB'
  if (score >= 45) return '#D97706'
  return '#DC2626'
}

function scoreLabel(score: number): string {
  if (score >= 85) return 'Strong Match'
  if (score >= 65) return 'Good Fit'
  if (score >= 45) return 'Partial Fit'
  return 'Weak Fit'
}

interface Props {
  result:   MatchResult
  compact?: boolean
}

export function MatchScore({ result, compact = false }: Props) {
  const { score, reasons, player } = result
  const color = scoreColor(score)
  const label = scoreLabel(score)

  if (compact) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ position: 'relative', width: 36, height: 36, flexShrink: 0 }}>
          <svg viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="18" cy="18" r="14" fill="none" stroke="#E5E7EB" strokeWidth="3" />
            <circle
              cx="18" cy="18" r="14" fill="none"
              stroke={color} strokeWidth="3"
              strokeDasharray={`${(score / 100) * 87.96} 87.96`}
              strokeLinecap="round"
            />
          </svg>
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: FONT.mono, fontSize: 9, fontWeight: 700, color,
          }}>
            {score}
          </div>
        </div>
        <div>
          <div style={{ fontFamily: FONT.mono, fontSize: 8, fontWeight: 700, color, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {label}
          </div>
          <div style={{ fontFamily: FONT.sans, fontSize: 10, color: C.textMuted }}>
            {reasons.filter(r => r.points > 0).length} matching factors
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Score header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <div style={{
          fontFamily: FONT.display, fontSize: 36, fontWeight: 700,
          color, letterSpacing: '-0.04em', lineHeight: 1,
        }}>
          {score}
        </div>
        <div>
          <div style={{ fontFamily: FONT.mono, fontSize: 10, fontWeight: 700, color, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {label}
          </div>
          <div style={{ fontFamily: FONT.sans, fontSize: 11, color: C.textSecondary }}>
            Match score out of 100
          </div>
        </div>
      </div>

      {/* Score bar */}
      <div className="wf-score-bar" style={{ marginBottom: 16 }}>
        <div className="wf-score-fill" style={{ width: `${score}%`, background: color }} />
      </div>

      {/* Reason breakdown */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {reasons.map((r, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 24, flexShrink: 0,
              fontFamily: FONT.mono, fontSize: 9, fontWeight: 700,
              color: r.points > 0 ? '#059669' : r.points < 0 ? '#DC2626' : '#6B7280',
              textAlign: 'right',
            }}>
              {r.points > 0 ? `+${r.points}` : r.points}
            </div>
            <div style={{ fontFamily: FONT.mono, fontSize: 8, color: '#374151', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', width: 80, flexShrink: 0 }}>
              {r.factor}
            </div>
            <div style={{ fontFamily: FONT.sans, fontSize: 10, color: C.textSecondary, lineHeight: 1.4 }}>
              {r.detail}
            </div>
          </div>
        ))}
      </div>

      {/* Blocked factors */}
      {result.blocked.length > 0 && (
        <div style={{ marginTop: 10, padding: '8px 10px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 6 }}>
          {result.blocked.map((b, i) => (
            <div key={i} style={{ fontFamily: FONT.sans, fontSize: 10, color: '#DC2626', lineHeight: 1.6 }}>
              ✕ {b}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
