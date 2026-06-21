import type { PlayerReport } from '@/lib/reports/types'
import { C, FONT } from '@/lib/ds'

interface Props {
  items:   PlayerReport['strengths']
  variant: 'strengths' | 'weaknesses'
}

const CONFIG = {
  strengths: { color: '#059669', bg: '#F0FDF4', label: 'Strength', borderClass: 'rp-strength' },
  weaknesses: { color: '#D97706', bg: '#FFFBEB', label: 'Risk',     borderClass: 'rp-weakness' },
}

export function StrengthsWeaknesses({ items, variant }: Props) {
  const cfg = CONFIG[variant]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {items.map((item, i) => (
        <div
          key={i}
          className={`rp-sw-item ${cfg.borderClass}`}
          style={{
            padding: 'clamp(16px,2vw,22px) clamp(18px,2.2vw,24px)',
            borderBottom: i < items.length - 1 ? `1px solid ${C.border}` : 'none',
            paddingLeft: 20,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
            <span style={{ width: 3, height: 14, background: cfg.color, borderRadius: 2, flexShrink: 0 }} />
            <h3 style={{ fontFamily: FONT.display, fontSize: 13, fontWeight: 700, color: '#111827', margin: 0, letterSpacing: '-0.01em' }}>
              {item.title}
            </h3>
          </div>
          <p style={{ fontFamily: FONT.sans, fontSize: 12.5, color: C.textSecondary, margin: 0, lineHeight: 1.85, paddingLeft: 11 }}>
            {item.body}
          </p>
        </div>
      ))}
    </div>
  )
}
