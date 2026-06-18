'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { CSSProperties, ReactNode, ButtonHTMLAttributes } from 'react'
import { C, R, FONT, EASE } from '@/lib/ds'

type Variant = 'primary' | 'secondary' | 'outline' | 'outlineDark' | 'ghost' | 'danger'
type Size    = 'sm' | 'md' | 'lg'

interface ButtonProps {
  variant?:  Variant
  size?:     Size
  href?:     string
  onClick?:  () => void
  children:  ReactNode
  arrow?:    boolean
  type?:     ButtonHTMLAttributes<HTMLButtonElement>['type']
  disabled?: boolean
  fullWidth?: boolean
  style?:    CSSProperties
  external?: boolean
}

const BASE: CSSProperties = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  fontFamily: FONT.sans, fontWeight: 600,
  letterSpacing: '0.06em', textTransform: 'uppercase',
  borderRadius: R.button,
  border: 'none', cursor: 'pointer', textDecoration: 'none',
  transition: EASE.base,
  whiteSpace: 'nowrap',
}

const VARIANTS: Record<Variant, CSSProperties> = {
  primary: {
    background: C.blue, color: C.blueFg,
  },
  secondary: {
    background: C.bgTertiary, color: C.textPrimary,
    border: `1.5px solid ${C.border}`,
  },
  outline: {
    background: 'transparent', color: C.textPrimary,
    border: `1.5px solid ${C.border}`,
  },
  outlineDark: {
    background: 'transparent', color: 'rgba(255,255,255,0.65)',
    border: '1.5px solid rgba(255,255,255,0.18)',
  },
  ghost: {
    background: 'transparent', color: C.blue,
    padding: '0 !important',
    borderBottom: `1.5px solid ${C.blue}`,
    borderRadius: 0,
  },
  danger: {
    background: C.danger, color: C.bgPrimary,
  },
}

const SIZES: Record<Size, CSSProperties> = {
  sm: { fontSize: 11, padding: '9px 18px',  gap: 6  },
  md: { fontSize: 12, padding: '13px 28px', gap: 8  },
  lg: { fontSize: 13, padding: '16px 36px', gap: 10 },
}

export function Button({
  variant  = 'primary',
  size     = 'md',
  href,
  onClick,
  children,
  arrow    = false,
  type     = 'button',
  disabled = false,
  fullWidth= false,
  style,
  external = false,
}: ButtonProps) {
  const composed: CSSProperties = {
    ...BASE,
    ...VARIANTS[variant],
    ...SIZES[size],
    ...(fullWidth ? { width: '100%' } : {}),
    ...(disabled ? { opacity: 0.5, pointerEvents: 'none' } : {}),
    ...style,
  }

  const content = (
    <>
      {children}
      {arrow && <ArrowRight size={size === 'sm' ? 11 : size === 'lg' ? 14 : 13} />}
    </>
  )

  if (href) {
    return external
      ? <a href={href} target="_blank" rel="noopener noreferrer" style={composed}>{content}</a>
      : <Link href={href} style={composed}>{content}</Link>
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} style={composed}>
      {content}
    </button>
  )
}
