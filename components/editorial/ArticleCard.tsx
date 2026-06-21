import Link from 'next/link'
import type { Article } from '@/lib/editorial'
import { C, FONT } from '@/lib/ds'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { ArticleMeta } from './ArticleMeta'

export type CardVariant = 'standard' | 'compact' | 'mini'

interface ArticleCardProps {
  article: Article
  variant?: CardVariant
  padding?: string
}

export function ArticleCard({ article, variant = 'standard', padding }: ArticleCardProps) {
  const isStandard = variant === 'standard'
  const isMini     = variant === 'mini'
  const pad        = padding ?? 'clamp(16px,2vw,22px) clamp(18px,2.2vw,24px)'

  return (
    <Link href={article.href} className="ed-card" style={{ padding: pad }}>

      {/* Category row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        <span style={{
          width: 5, height: 5, borderRadius: '50%',
          background: article.category.color, display: 'inline-block', flexShrink: 0,
        }} />
        <span style={{
          fontFamily: FONT.mono, fontSize: 8, fontWeight: 700,
          color: article.category.color, letterSpacing: '0.1em', textTransform: 'uppercase',
        }}>
          {article.category.name}
        </span>
        {!isMini && <StatusBadge status={article.status} />}
      </div>

      {/* Title */}
      <h3 className="ed-card-title" style={{
        fontFamily: FONT.display,
        fontSize: isMini ? 12 : isStandard ? 14 : 13,
        fontWeight: 700,
        color: '#111827',
        margin: 0,
        letterSpacing: '-0.02em',
        lineHeight: 1.2,
        transition: 'color 0.15s',
      }}>
        {article.title}
      </h3>

      {/* Excerpt — standard only */}
      {isStandard && (
        <p style={{
          fontFamily: FONT.sans, fontSize: 11.5,
          color: C.textSecondary, margin: 0, lineHeight: 1.75,
        }}>
          {article.excerpt}
        </p>
      )}

      {/* Meta */}
      {!isMini && <ArticleMeta article={article} />}

      {/* Mini: just read time */}
      {isMini && (
        <span style={{ fontFamily: FONT.mono, fontSize: 8, color: C.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {article.readTime} min
        </span>
      )}
    </Link>
  )
}
