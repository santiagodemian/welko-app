import type { Article } from '@/lib/editorial'
import { C, FONT } from '@/lib/ds'

interface ArticleMetaProps {
  article: Pick<Article, 'author' | 'publishedAt' | 'readTime'>
  size?: 'sm' | 'md'
}

export function ArticleMeta({ article, size = 'sm' }: ArticleMetaProps) {
  const avatarSize = size === 'md' ? 22 : 18
  const nameSize   = size === 'md' ? 11 : 10
  const metaSize   = size === 'md' ? 9  : 8

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
      <div style={{
        width: avatarSize, height: avatarSize, borderRadius: '50%',
        background: C.bgAlt, border: `1px solid ${C.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <span style={{ fontFamily: FONT.mono, fontSize: 6, fontWeight: 700, color: C.textSecondary, letterSpacing: '0.02em' }}>
          {article.author.initials}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: FONT.sans, fontSize: nameSize, color: C.textSecondary, fontWeight: 600 }}>
          {article.author.name}
        </span>
        <span style={{ color: C.border, userSelect: 'none' }}>·</span>
        <span style={{ fontFamily: FONT.mono, fontSize: metaSize, color: C.textMuted, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          {article.publishedAt}
        </span>
        <span style={{ color: C.border, userSelect: 'none' }}>·</span>
        <span style={{ fontFamily: FONT.mono, fontSize: metaSize, color: C.textMuted, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          {article.readTime} min read
        </span>
      </div>
    </div>
  )
}
