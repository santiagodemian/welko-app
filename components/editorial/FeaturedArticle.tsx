import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Article } from '@/lib/editorial'
import { C, FONT, BTN } from '@/lib/ds'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Badge } from '@/components/ui/Badge'
import { ArticleMeta } from './ArticleMeta'

interface FeaturedArticleProps {
  article: Article
  label?: string
  layout?: 'split' | 'full'
}

export function FeaturedArticle({ article, label = 'Featured', layout = 'split' }: FeaturedArticleProps) {
  if (layout === 'full') {
    return (
      <Link href={article.href} className="ed-featured" style={{ display: 'block', textDecoration: 'none' }}>
        <div style={{ padding: 'clamp(24px,3.2vw,44px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
            <Badge variant="filled">{label}</Badge>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: article.category.color, display: 'inline-block' }} />
            <span style={{ fontFamily: FONT.mono, fontSize: 9, color: article.category.color, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}>
              {article.category.name}
            </span>
            <StatusBadge status={article.status} />
          </div>

          <h2 className="ed-featured-title" style={{
            fontFamily: FONT.display,
            fontSize: 'clamp(20px,2.8vw,34px)',
            fontWeight: 700, color: '#111827',
            margin: '0 0 14px', letterSpacing: '-0.04em', lineHeight: 0.95,
            textTransform: 'uppercase', transition: 'color 0.15s',
          }}>
            {article.title}
          </h2>

          <p style={{ fontFamily: FONT.sans, fontSize: 13, color: C.textSecondary, margin: '0 0 22px', lineHeight: 1.85, maxWidth: 640 }}>
            {article.excerpt}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: `1px solid ${C.border}`, paddingTop: 18, flexWrap: 'wrap', gap: 12 }}>
            <ArticleMeta article={article} size="md" />
            <span style={{ fontFamily: FONT.sans, fontSize: 10, fontWeight: 700, color: C.blue, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 5 }}>
              Read report <ArrowRight size={10} />
            </span>
          </div>
        </div>
      </Link>
    )
  }

  // ── Split layout (default) ──────────────────────────────────────────────
  return (
    <Link href={article.href} className="ed-featured ed-featured-split" style={{ display: 'block', textDecoration: 'none' }}>
      <div className="ed-featured-split-inner" style={{ display: 'grid', gridTemplateColumns: '3fr 2fr' }}>

        {/* Left — headline */}
        <div style={{ padding: 'clamp(24px,3.2vw,44px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            <Badge variant="filled">{label}</Badge>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: article.category.color, display: 'inline-block' }} />
            <span style={{ fontFamily: FONT.mono, fontSize: 9, color: article.category.color, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}>
              {article.category.name}
            </span>
            <StatusBadge status={article.status} />
          </div>

          <h2 className="ed-featured-title" style={{
            fontFamily: FONT.display,
            fontSize: 'clamp(22px,3.2vw,40px)',
            fontWeight: 700, color: '#111827',
            margin: '0 0 20px', letterSpacing: '-0.04em', lineHeight: 0.92,
            textTransform: 'uppercase', transition: 'color 0.15s',
          }}>
            {article.title}
          </h2>

          <ArticleMeta article={article} size="md" />
        </div>

        {/* Right — excerpt + CTA */}
        <div className="ed-featured-right" style={{ padding: 'clamp(24px,3.2vw,44px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 20 }}>
          <p style={{ fontFamily: FONT.sans, fontSize: 13, color: C.textSecondary, margin: 0, lineHeight: 1.9, fontStyle: 'italic' }}>
            &ldquo;{article.excerpt}&rdquo;
          </p>
          <div style={{ ...BTN.ghost, fontFamily: FONT.sans, fontSize: 10, display: 'inline-flex', alignItems: 'center', gap: 6, padding: 0, textDecoration: 'none', color: C.blue, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Read this report <ArrowRight size={10} />
          </div>
        </div>
      </div>
    </Link>
  )
}
