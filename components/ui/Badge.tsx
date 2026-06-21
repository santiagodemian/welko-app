import type { CSSProperties, ReactNode } from 'react'
import { C, FONT } from '@/lib/ds'

type Variant = 'outline' | 'filled' | 'subtle' | 'ghost'

interface BadgeProps {
  children: ReactNode
  variant?: Variant
  /** Accent color — defaults to Polaris blue */
  color?: string
  style?: CSSProperties
}

const BASE: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  fontFamily: FONT.mono,
  fontSize: 9,
  fontWeight: 700,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
  padding: '3px 8px',
  borderRadius: 4,
  lineHeight: 1,
}

export function Badge({ children, variant = 'outline', color = C.blue, style }: BadgeProps) {
  const variants: Record<Variant, CSSProperties> = {
    outline: { color, background: `${color}0D`, border: `1px solid ${color}2E` },
    filled:  { color: '#fff', background: color, border: 'none' },
    subtle:  { color: C.textSecondary, background: C.bgTertiary, border: `1px solid ${C.border}` },
    ghost:   { color: C.textMuted,     background: 'transparent', border: `1px solid ${C.border}` },
  }

  return (
    <span style={{ ...BASE, ...variants[variant], ...style }}>
      {children}
    </span>
  )
}
