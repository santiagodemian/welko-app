/**
 * Polaris Design System v1.0
 * Single source of truth for every visual decision.
 * Import from here — never hardcode values in components or pages.
 */

import type { CSSProperties } from 'react'

// ─── Colors ─────────────────────────────────────────────────────────────────

export const C = {
  // Backgrounds
  bgPrimary:    '#FFFFFF',
  bgLight:      '#F8FAFC',   // main page background
  bgAlt:        '#F1F5F9',   // alternate sections
  bgSecondary:  '#F9FAFB',
  bgTertiary:   '#F3F4F6',

  // Text
  textPrimary:   '#0A0A0A',
  textSecondary: '#6B7280',
  textMuted:     '#9CA3AF',
  textInverse:   '#FFFFFF',
  textInverseDim:'rgba(255,255,255,0.45)',

  // Borders
  border:        '#E5E7EB',
  borderSubtle:  '#F3F4F6',

  // Blue — primary accent
  blue:          '#2563EB',
  blueHover:     '#1D4ED8',
  blueLight:     '#EFF6FF',
  blueMid:       '#DBEAFE',
  blueDim:       'rgba(37,99,235,0.12)',
  blueStr:       'rgba(37,99,235,0.18)',
  blueFg:        '#FFFFFF',

  // Semantic
  success:       '#059669',
  successLight:  '#ECFDF5',
  warning:       '#D97706',
  warningLight:  '#FFFBEB',
  danger:        '#EF4444',
  dangerLight:   '#FEF2F2',
  purple:        '#7C3AED',
  purpleLight:   '#F5F3FF',

  // Dark surfaces — unified
  dark:          '#0A0A0A',   // all dark section backgrounds
  darkDeep:      '#050505',   // photo overlays, splash
  darkSurface:   '#141414',   // dark card surfaces (future dark mode)
} as const

// ─── Border Radius ───────────────────────────────────────────────────────────

export const R = {
  badge:  6,   // chips, tags, small pills
  button: 8,   // buttons, inputs, small cards
  card:   12,  // standard cards
  panel:  16,  // large panels, modals, hero sections
} as const

// ─── Shadows ─────────────────────────────────────────────────────────────────

export const S = {
  sm:   '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
  md:   '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
  lg:   '0 8px 32px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.06)',
  blue: '0 4px 16px rgba(37,99,235,0.18)',
  none: 'none',
} as const

// ─── Spacing (8-point system) ─────────────────────────────────────────────────

export const SP = {
  1:  8,
  2:  16,
  3:  24,
  4:  32,
  5:  40,
  6:  48,
  7:  56,
  8:  64,
  10: 80,
  12: 96,
  14: 112,
} as const

// ─── Section Layout ───────────────────────────────────────────────────────────

export const SECTION = {
  padV:       'clamp(64px, 8vw, 96px)',   // standard section vertical padding
  padVHero:   'clamp(80px, 10vw, 120px)', // hero/feature vertical padding
  padVCompact:'clamp(40px, 5vw, 56px)',   // compact sections
  padH:       'clamp(24px, 5vw, 80px)',   // horizontal padding
  maxW:       1200,                        // max content width
} as const

// ─── Typography ──────────────────────────────────────────────────────────────

export const FONT = {
  sans:    'var(--font-montserrat), Inter, system-ui, sans-serif',
  display: 'var(--font-space-grotesk), system-ui, sans-serif',
  mono:    'var(--font-geist-mono), monospace',
} as const

// Full text style presets (spread into style prop)
export const T: Record<string, CSSProperties> = {
  hero:    { fontFamily: FONT.display, fontSize: 'clamp(52px, 7.5vw, 96px)', fontWeight: 700, lineHeight: 0.92, letterSpacing: '-0.035em', textTransform: 'uppercase' },
  display: { fontFamily: FONT.display, fontSize: 'clamp(36px, 5vw, 68px)',   fontWeight: 700, lineHeight: 1.02, letterSpacing: '-0.03em',  textTransform: 'uppercase' },
  h1:      { fontFamily: FONT.display, fontSize: 'clamp(28px, 4vw, 48px)',   fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.025em', textTransform: 'uppercase' },
  h2:      { fontFamily: FONT.display, fontSize: 'clamp(22px, 3vw, 36px)',   fontWeight: 700, lineHeight: 1.08, letterSpacing: '-0.02em',  textTransform: 'uppercase' },
  h3:      { fontFamily: FONT.display, fontSize: 18,                          fontWeight: 700, lineHeight: 1.2,  letterSpacing: '-0.01em' },
  bodyLg:  { fontFamily: FONT.sans,    fontSize: 16,                          fontWeight: 400, lineHeight: 1.8  },
  body:    { fontFamily: FONT.sans,    fontSize: 14,                          fontWeight: 400, lineHeight: 1.75 },
  small:   { fontFamily: FONT.sans,    fontSize: 13,                          fontWeight: 400, lineHeight: 1.65 },
  caption: { fontFamily: FONT.sans,    fontSize: 11,                          fontWeight: 500, lineHeight: 1.5,  letterSpacing: '0.04em' },
  label:   { fontFamily: FONT.sans,    fontSize: 10,                          fontWeight: 700, lineHeight: 1.5,  letterSpacing: '0.15em', textTransform: 'uppercase' },
  mono:    { fontFamily: 'var(--font-geist-mono), monospace', fontSize: 13,   fontWeight: 400, lineHeight: 1.6 },
}

// ─── Transitions ──────────────────────────────────────────────────────────────

export const EASE = {
  fast:   'all 0.12s ease',
  base:   'all 0.18s ease',
  slow:   'all 0.3s ease',
  spring: 'all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)',
  color:  'color 0.15s ease, background-color 0.15s ease, border-color 0.15s ease',
} as const

// ─── Breakpoints ─────────────────────────────────────────────────────────────

export const BP = {
  mobile:  640,
  tablet:  900,
  desktop: 1200,
} as const

// ─── Button Style Presets ─────────────────────────────────────────────────────
// Use as: style={BTN.primary} — override individual props as needed

export const BTN: Record<string, CSSProperties> = {
  primary: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    background: C.blue, color: C.blueFg,
    padding: '13px 28px', borderRadius: R.button,
    fontFamily: FONT.sans, fontSize: 12, fontWeight: 600,
    letterSpacing: '0.06em', textTransform: 'uppercase',
    border: 'none', cursor: 'pointer', textDecoration: 'none',
    transition: EASE.color,
  },
  secondary: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    background: C.bgTertiary, color: C.textPrimary,
    padding: '13px 28px', borderRadius: R.button,
    fontFamily: FONT.sans, fontSize: 12, fontWeight: 600,
    letterSpacing: '0.06em', textTransform: 'uppercase',
    border: `1.5px solid ${C.border}`, cursor: 'pointer', textDecoration: 'none',
    transition: EASE.base,
  },
  outline: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    background: 'transparent', color: C.textPrimary,
    padding: '13px 28px', borderRadius: R.button,
    fontFamily: FONT.sans, fontSize: 12, fontWeight: 600,
    letterSpacing: '0.06em', textTransform: 'uppercase',
    border: `1.5px solid ${C.border}`, cursor: 'pointer', textDecoration: 'none',
    transition: EASE.base,
  },
  outlineDark: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    background: 'transparent', color: 'rgba(255,255,255,0.65)',
    padding: '13px 28px', borderRadius: R.button,
    fontFamily: FONT.sans, fontSize: 12, fontWeight: 600,
    letterSpacing: '0.06em', textTransform: 'uppercase',
    border: '1.5px solid rgba(255,255,255,0.15)', cursor: 'pointer', textDecoration: 'none',
    transition: EASE.base,
  },
  ghost: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: 'transparent', color: C.textPrimary,
    padding: '0', border: 'none', cursor: 'pointer', textDecoration: 'none',
    fontFamily: FONT.sans, fontSize: 11, fontWeight: 700,
    letterSpacing: '0.08em', textTransform: 'uppercase',
    borderBottom: `1.5px solid ${C.textPrimary}`, paddingBottom: 2,
    transition: EASE.color,
  },
  sm: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: C.blue, color: C.blueFg,
    padding: '9px 18px', borderRadius: R.button,
    fontFamily: FONT.sans, fontSize: 11, fontWeight: 600,
    letterSpacing: '0.06em', textTransform: 'uppercase',
    border: 'none', cursor: 'pointer', textDecoration: 'none',
    transition: EASE.color,
  },
}

// ─── Card Style Presets ───────────────────────────────────────────────────────

export const CARD: Record<string, CSSProperties> = {
  base: {
    background: C.bgPrimary,
    border: `1.5px solid ${C.border}`,
    borderRadius: R.card,
    boxShadow: S.sm,
  },
  elevated: {
    background: C.bgPrimary,
    border: `1.5px solid ${C.border}`,
    borderRadius: R.card,
    boxShadow: S.md,
  },
  panel: {
    background: C.bgPrimary,
    border: `1.5px solid ${C.border}`,
    borderRadius: R.panel,
    boxShadow: S.sm,
  },
  dark: {
    background: C.dark,
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: R.panel,
  },
  subtle: {
    background: C.bgSecondary,
    border: `1px solid ${C.border}`,
    borderRadius: R.card,
  },
}
