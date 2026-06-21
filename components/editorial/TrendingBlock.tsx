import Link from 'next/link'
import type { Article } from '@/lib/editorial'
import { C, FONT } from '@/lib/ds'

interface TrendingBlockProps {
  articles: Article[]
  title?: string
  limit?: number
}

export function TrendingBlock({ articles, title = 'Trending', limit = 5 }: TrendingBlockProps) {
  const items = articles.slice(0, limit)

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, paddingBottom: 12, borderBottom: `1.5px solid #111827` }}>
        <span style={{ fontFamily: FONT.sans, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#111827' }}>
          {title}
        </span>
      </div>

      {/* Items */}
      {items.map((article, i) => (
        <Link key={article.id} href={article.href} className="ed-ranked-item" style={{ textDecoration: 'none' }}>
          {/* Number */}
          <span style={{ fontFamily: FONT.mono, fontSize: 11, fontWeight: 700, color: C.border, letterSpacing: '-0.02em', flexShrink: 0, minWidth: 22, lineHeight: 1.3 }}>
            {String(i + 1).padStart(2, '0')}
          </span>

          {/* Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Category */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: article.category.color, display: 'inline-block', flexShrink: 0 }} />
              <span style={{ fontFamily: FONT.mono, fontSize: 7, color: article.category.color, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}>
                {article.category.name}
              </span>
            </div>
            <p className="ed-ranked-title" style={{
              fontFamily: FONT.display, fontSize: 12, fontWeight: 700, color: '#111827',
              margin: 0, lineHeight: 1.2, letterSpacing: '-0.01em', transition: 'color 0.14s',
              overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            }}>
              {article.title}
            </p>
          </div>

          {/* Read time */}
          <span style={{ fontFamily: FONT.mono, fontSize: 8, color: C.textMuted, letterSpacing: '0.04em', textTransform: 'uppercase', flexShrink: 0, paddingTop: 2 }}>
            {article.readTime}m
          </span>
        </Link>
      ))}
    </div>
  )
}
