import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'
import { C, R, S, T, FONT, EASE } from '@/lib/ds'

// ─── Base Card ───────────────────────────────────────────────────────────────

interface CardProps {
  children:  ReactNode
  href?:     string
  style?:    CSSProperties
  padding?:  number | string
  hoverable?:boolean
}

export function Card({ children, href, style, padding = 20, hoverable = false }: CardProps) {
  const base: CSSProperties = {
    background:   C.bgPrimary,
    border:       `1.5px solid ${C.border}`,
    borderRadius: R.card,
    boxShadow:    S.sm,
    overflow:     'hidden',
    padding,
    ...style,
  }
  const hover: CSSProperties = hoverable ? {
    transition: `box-shadow ${EASE.base}, transform ${EASE.base}, border-color ${EASE.base}`,
  } : {}

  if (href) {
    return (
      <Link href={href} style={{ textDecoration: 'none', display: 'block' }}>
        <div style={{ ...base, ...hover }}>{children}</div>
      </Link>
    )
  }
  return <div style={{ ...base, ...hover }}>{children}</div>
}

// ─── Stat Card ───────────────────────────────────────────────────────────────

interface StatCardProps {
  label:      string
  value:      string | number
  icon?:      ReactNode
  href?:      string
  valueColor?:string
  style?:     CSSProperties
}

export function StatCard({ label, value, icon, href, valueColor, style }: StatCardProps) {
  const inner = (
    <div
      style={{
        background:   C.bgPrimary,
        border:       `1.5px solid ${C.border}`,
        borderRadius: R.card,
        boxShadow:    S.sm,
        padding:      '18px 20px',
        transition:   `box-shadow ${EASE.base}, border-color ${EASE.base}`,
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>{icon}</div>
      </div>
      <p style={{
        ...T.h1,
        color: valueColor ?? C.textPrimary,
        margin: '0 0 4px',
        lineHeight: 1,
      }}>
        {value}
      </p>
      <p style={{ ...T.label, color: C.textMuted, margin: 0 }}>{label}</p>
    </div>
  )

  if (href) {
    return (
      <Link href={href} style={{ textDecoration: 'none', display: 'block' }}>
        {inner}
      </Link>
    )
  }
  return inner
}

// ─── Dashboard Card (titled panel) ───────────────────────────────────────────

interface DashboardCardProps {
  title:      string
  icon?:      ReactNode
  action?:    ReactNode
  badge?:     ReactNode
  children:   ReactNode
  style?:     CSSProperties
}

export function DashboardCard({ title, icon, action, badge, children, style }: DashboardCardProps) {
  return (
    <div style={{
      background:   C.bgPrimary,
      border:       `1.5px solid ${C.border}`,
      borderRadius: R.card,
      boxShadow:    S.sm,
      overflow:     'hidden',
      ...style,
    }}>
      {/* Header */}
      <div style={{
        padding:      '14px 20px',
        borderBottom: `1px solid ${C.borderSubtle}`,
        background:   C.bgSecondary,
        display:      'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {icon}
          <h2 style={{ ...T.small, fontWeight: 700, color: C.textPrimary, margin: 0 }}>{title}</h2>
          {badge}
        </div>
        {action}
      </div>
      {/* Body */}
      {children}
    </div>
  )
}

// ─── Article Card ─────────────────────────────────────────────────────────────

interface ArticleCardProps {
  title:    string
  excerpt:  string
  date:     string
  author:   string
  readTime: number
  category: string
  image?:   string
  href:     string
  featured?:boolean
  badgeColor?: string
  style?:   CSSProperties
}

export function ArticleCard({
  title, excerpt, date, author, readTime, category, image, href,
  featured = false, badgeColor = C.blue, style,
}: ArticleCardProps) {
  const imgHeight = featured ? 280 : 168

  return (
    <Link href={href} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
      <div style={{
        background:   C.bgPrimary,
        border:       `1.5px solid ${C.border}`,
        borderRadius: R.card,
        boxShadow:    S.sm,
        overflow:     'hidden',
        display:      'flex', flexDirection: 'column',
        height:       '100%',
        transition:   `box-shadow ${EASE.base}, transform ${EASE.base}`,
        ...style,
      }}>
        {/* Photo */}
        <div style={{ height: imgHeight, position: 'relative', background: C.dark, overflow: 'hidden', flexShrink: 0 }}>
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="" aria-hidden="true"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', opacity: 0.75 }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/polariswhitelogo.jpeg" alt="" style={{ height: 40, opacity: 0.2, objectFit: 'contain' }} />
            </div>
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)' }} />

          {featured && (
            <div style={{ position: 'absolute', top: 16, left: 16 }}>
              <span style={{ ...T.label, background: C.blue, color: C.blueFg, padding: '5px 12px', borderRadius: R.badge }}>
                Featured
              </span>
            </div>
          )}

          <div style={{ position: 'absolute', ...(featured ? { bottom: 16, top: 'auto' } : { top: 12 }), left: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{
              ...T.label, padding: '3px 8px', borderRadius: R.badge,
              background: featured ? `${badgeColor}CC` : `${badgeColor}22`,
              color:      featured ? C.bgPrimary : badgeColor,
            }}>
              {category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: featured ? '24px 28px' : '16px 18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
            <span style={{ ...T.caption, color: C.textMuted }}>{date}</span>
            <span style={{ fontSize: 10, color: C.borderSubtle }}>·</span>
            <span style={{ ...T.caption, color: C.textMuted }}>{readTime} min</span>
          </div>

          <h3 style={{
            ...T.h3,
            color:     C.textPrimary,
            margin:    `0 0 ${featured ? 14 : 8}px`,
            fontSize:  featured ? 20 : 15,
            flex:      1,
          }}>
            {title}
          </h3>

          <p style={{
            ...T.small, color: C.textSecondary,
            margin: `0 0 ${featured ? 20 : 14}px`,
            display: '-webkit-box', WebkitLineClamp: featured ? 3 : 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {excerpt}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
            <span style={{ ...T.caption, color: C.textMuted }}>{author}</span>
            <span style={{ ...T.label, color: C.blue, fontSize: 10 }}>Read →</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────

interface EmptyStateProps {
  icon:      ReactNode
  title:     string
  message:   string
  action?:   ReactNode
  style?:    CSSProperties
}

export function EmptyState({ icon, title, message, action, style }: EmptyStateProps) {
  return (
    <div style={{
      padding:    '36px 20px',
      textAlign:  'center',
      display:    'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
      ...style,
    }}>
      <div style={{ color: C.border, marginBottom: 4 }}>{icon}</div>
      <p style={{ ...T.small, fontWeight: 600, color: C.textSecondary, margin: 0 }}>{title}</p>
      <p style={{ ...T.caption, color: C.textMuted, margin: 0, maxWidth: 240, lineHeight: 1.6 }}>{message}</p>
      {action && <div style={{ marginTop: 8 }}>{action}</div>}
    </div>
  )
}

// ─── Icon Chip (reusable icon+bg circle/square) ───────────────────────────────

interface IconChipProps {
  icon:     ReactNode
  bg?:      string
  size?:    number
  radius?:  number
}

export function IconChip({ icon, bg = C.blueDim, size = 34, radius = R.button }: IconChipProps) {
  return (
    <div style={{
      width: size, height: size, borderRadius: radius,
      background: bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      {icon}
    </div>
  )
}
