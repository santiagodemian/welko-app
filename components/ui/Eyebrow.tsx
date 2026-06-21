import type { CSSProperties, ReactNode } from 'react'
import { C, T, FONT } from '@/lib/ds'

interface EyebrowProps {
  children: ReactNode
  /** Small monospace metadata (issue number, section number, date) */
  meta?: string
  /** Accent color for line + label text */
  color?: string
  /** marginBottom — number = px, string = raw CSS */
  mb?: string | number
  /** Optional node aligned to the right (e.g. "View all →" link) */
  right?: ReactNode
  style?: CSSProperties
}

export function Eyebrow({
  children,
  meta,
  color = C.blue,
  mb = 24,
  right,
  style,
}: EyebrowProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: right ? 'space-between' : 'flex-start',
        flexWrap: 'wrap',
        rowGap: 8,
        columnGap: 16,
        marginBottom: mb,
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 18, height: 1.5, background: color, flexShrink: 0 }} />
        <span style={{ ...T.label, color }}>{children}</span>
        {meta && (
          <span
            style={{
              fontFamily: FONT.mono,
              fontSize: 9,
              color: C.textMuted,
              letterSpacing: '0.06em',
            }}
          >
            {meta}
          </span>
        )}
      </div>
      {right && <div style={{ flexShrink: 0 }}>{right}</div>}
    </div>
  )
}
