import type { CSSProperties } from 'react'
import { C, T } from '@/lib/ds'

interface SectionLabelProps {
  children: string
  color?: string
  style?: CSSProperties
  marginBottom?: number
}

/**
 * Standardized eyebrow label: [line] [ALL CAPS TEXT]
 * Used above every section heading across the site.
 */
export function SectionLabel({ children, color = C.blue, style, marginBottom = 24 }: SectionLabelProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom, ...style }}>
      <div style={{ width: 24, height: 1.5, background: color, flexShrink: 0 }} />
      <span style={{ ...T.label, color }}>{children}</span>
    </div>
  )
}
