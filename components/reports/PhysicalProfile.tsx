import type { PlayerReport } from '@/lib/reports/types'
import { C, FONT } from '@/lib/ds'

type Props = { physical: PlayerReport['physical'] }

function scoreColor(value: number): string {
  if (value >= 80) return '#059669'
  if (value >= 65) return '#2563EB'
  if (value >= 50) return '#D97706'
  return '#6B7280'
}

function scoreLabel(value: number): string {
  if (value >= 85) return 'Elite'
  if (value >= 75) return 'High'
  if (value >= 60) return 'Good'
  if (value >= 45) return 'Average'
  return 'Low'
}

export function PhysicalProfile({ physical }: Props) {
  return (
    <div>
      <p style={{ fontFamily: FONT.display, fontSize: 14, fontWeight: 700, color: '#111827', margin: '0 0 26px', letterSpacing: '-0.02em', lineHeight: 1.3 }}>
        {physical.headline}
      </p>

      {/* Attribute bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 26 }}>
        {physical.attributes.map(attr => {
          const color = scoreColor(attr.value)
          return (
            <div key={attr.label}>
              {/* Row header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontFamily: FONT.sans, fontSize: 12, color: '#111827', fontWeight: 600 }}>
                    {attr.label}
                  </span>
                  {attr.context && (
                    <span style={{ fontFamily: FONT.mono, fontSize: 8, color: C.textMuted, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                      {attr.context}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: FONT.mono, fontSize: 8, color, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    {scoreLabel(attr.value)}
                  </span>
                  <span style={{ fontFamily: FONT.display, fontSize: 13, fontWeight: 700, color, letterSpacing: '-0.02em', minWidth: 28, textAlign: 'right' }}>
                    {attr.value}
                  </span>
                </div>
              </div>
              {/* Bar */}
              <div className="rp-bar-track">
                <div
                  className="rp-bar-fill"
                  style={{ width: `${attr.value}%`, background: color }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Notes */}
      <div style={{ padding: 'clamp(12px,1.5vw,16px)', background: C.bgAlt, border: `1px solid ${C.border}`, borderRadius: 8 }}>
        <p style={{ fontFamily: FONT.sans, fontSize: 12, color: C.textSecondary, margin: 0, lineHeight: 1.85 }}>
          {physical.notes}
        </p>
      </div>
    </div>
  )
}
