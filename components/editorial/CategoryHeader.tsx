import Link from 'next/link'
import type { Category } from '@/lib/editorial'
import { C, FONT, SECTION } from '@/lib/ds'
import { StatusBadge } from '@/components/ui/StatusBadge'
import type { Status } from '@/components/ui/StatusBadge'
import { Eyebrow } from '@/components/ui/Eyebrow'

interface CategoryHeaderProps {
  category: Category
  description?: string
  status?: Status
  articleCount?: number
  lastUpdated?: string
  parent?: { label: string; href: string }
  compact?: boolean
}

export function CategoryHeader({
  category,
  description,
  status,
  articleCount,
  lastUpdated,
  parent,
  compact = false,
}: CategoryHeaderProps) {
  const PH = SECTION.padH

  return (
    <div style={{
      borderBottom: `1px solid ${C.border}`,
      paddingTop:    compact ? 'clamp(18px,2.2vw,26px)' : 'clamp(32px,4vw,52px)',
      paddingBottom: compact ? 'clamp(14px,1.8vw,20px)' : 'clamp(24px,3vw,36px)',
      paddingLeft: PH, paddingRight: PH,
    }}>

      {/* Breadcrumb */}
      {parent && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
          <Link href={parent.href} className="ed-cat-link" style={{ fontFamily: FONT.mono, fontSize: 8, color: C.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none' }}>
            {parent.label}
          </Link>
          <span style={{ color: C.border, fontSize: 10 }}>/</span>
          <span style={{ fontFamily: FONT.mono, fontSize: 8, color: C.textSecondary, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {category.name}
          </span>
        </div>
      )}

      {/* Eyebrow */}
      {!compact && (
        <Eyebrow color={category.color} mb={12}>Intelligence</Eyebrow>
      )}

      {/* Category name + status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', marginBottom: description ? 10 : 0 }}>
        <h1 style={{
          fontFamily: FONT.display,
          fontSize:  compact ? 'clamp(15px,2vw,20px)' : 'clamp(24px,3.5vw,44px)',
          fontWeight: 700, color: '#111827',
          margin: 0, letterSpacing: '-0.04em', lineHeight: 0.95,
          textTransform: 'uppercase',
        }}>
          {category.name}
        </h1>
        {status && <StatusBadge status={status} />}
      </div>

      {/* Description + meta */}
      {description && (
        <p style={{ fontFamily: FONT.sans, fontSize: compact ? 12 : 13, color: C.textSecondary, margin: '0 0 12px', maxWidth: 560, lineHeight: 1.8 }}>
          {description}
        </p>
      )}

      {/* Meta row */}
      {(articleCount !== undefined || lastUpdated) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {articleCount !== undefined && (
            <span style={{ fontFamily: FONT.mono, fontSize: 8, color: C.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {articleCount} {articleCount === 1 ? 'report' : 'reports'}
            </span>
          )}
          {articleCount !== undefined && lastUpdated && (
            <span style={{ color: C.border, userSelect: 'none' }}>·</span>
          )}
          {lastUpdated && (
            <span style={{ fontFamily: FONT.mono, fontSize: 8, color: C.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Updated {lastUpdated}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
