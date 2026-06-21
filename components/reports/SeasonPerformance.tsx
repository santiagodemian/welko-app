import type { PlayerReport } from '@/lib/reports/types'
import { C, FONT } from '@/lib/ds'

type Props = { season: PlayerReport['season'] }

export function SeasonPerformance({ season }: Props) {
  const MONO = FONT.mono

  return (
    <div>
      <p style={{ fontFamily: FONT.display, fontSize: 14, fontWeight: 700, color: '#111827', margin: '0 0 22px', letterSpacing: '-0.02em', lineHeight: 1.3 }}>
        {season.headline}
      </p>

      {season.entries.map((entry, ei) => (
        <div key={ei} style={{ marginBottom: ei < season.entries.length - 1 ? 28 : 0 }}>
          {/* Competition label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ fontFamily: MONO, fontSize: 9, fontWeight: 700, color: C.blue, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {entry.competition}
            </span>
            <span style={{ fontFamily: MONO, fontSize: 8, color: C.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {entry.season}
            </span>
          </div>

          {/* Core stat cards */}
          <div className="rp-stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 10 }}>
            {[
              { label: 'Apps',    value: String(entry.apps),               sub: `${entry.started} started` },
              { label: 'Goals',   value: String(entry.goals ?? '—'),       sub: 'scored' },
              { label: 'Assists', value: String(entry.assists ?? '—'),     sub: 'created' },
              { label: 'Minutes', value: entry.minutesPlayed ? `${entry.minutesPlayed.toLocaleString()}` : '—', sub: 'played' },
            ].map(s => (
              <div key={s.label} className="rp-stat-card" style={{ padding: 'clamp(10px,1.3vw,16px) 10px' }}>
                <div style={{ fontFamily: FONT.display, fontSize: 'clamp(18px,2.2vw,24px)', fontWeight: 700, color: '#111827', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 4 }}>
                  {s.value}
                </div>
                <div style={{ fontFamily: MONO, fontSize: 7, fontWeight: 700, color: C.blue, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 2 }}>
                  {s.label}
                </div>
                <div style={{ fontFamily: MONO, fontSize: 7, color: C.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  {s.sub}
                </div>
              </div>
            ))}
          </div>

          {/* Additional stats row */}
          {(entry.passAccuracy !== undefined || entry.keyPassesPer90 !== undefined || entry.extraStats?.length) && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 0, border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden' }}>
              {entry.passAccuracy !== undefined && (
                <div style={{ flex: '1 1 100px', padding: '10px 14px', borderRight: `1px solid ${C.border}`, background: C.bgLight }}>
                  <div style={{ fontFamily: MONO, fontSize: 7, color: C.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 3 }}>Pass Accuracy</div>
                  <div style={{ fontFamily: FONT.display, fontSize: 14, fontWeight: 700, color: '#111827', letterSpacing: '-0.02em' }}>{entry.passAccuracy}%</div>
                </div>
              )}
              {entry.keyPassesPer90 !== undefined && (
                <div style={{ flex: '1 1 100px', padding: '10px 14px', borderRight: entry.extraStats?.length ? `1px solid ${C.border}` : 'none', background: C.bgLight }}>
                  <div style={{ fontFamily: MONO, fontSize: 7, color: C.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 3 }}>Key Passes / 90</div>
                  <div style={{ fontFamily: FONT.display, fontSize: 14, fontWeight: 700, color: '#111827', letterSpacing: '-0.02em' }}>{entry.keyPassesPer90}</div>
                </div>
              )}
              {entry.extraStats?.map((es, i) => (
                <div key={i} style={{ flex: '1 1 100px', padding: '10px 14px', borderRight: i < (entry.extraStats?.length ?? 0) - 1 ? `1px solid ${C.border}` : 'none', background: C.bgLight }}>
                  <div style={{ fontFamily: MONO, fontSize: 7, color: C.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 3 }}>{es.label}</div>
                  <div style={{ fontFamily: FONT.display, fontSize: 14, fontWeight: 700, color: '#111827', letterSpacing: '-0.02em' }}>{es.value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Narrative */}
      <div style={{ marginTop: 26, paddingTop: 20, borderTop: `1px solid ${C.border}` }}>
        <p style={{ fontFamily: FONT.sans, fontSize: 13, color: C.textSecondary, margin: 0, lineHeight: 1.9 }}>
          {season.narrative}
        </p>
      </div>
    </div>
  )
}
