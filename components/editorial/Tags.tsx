import Link from 'next/link'
import type { Tag } from '@/lib/editorial'
import { C, FONT } from '@/lib/ds'

interface TagsProps {
  tags: Tag[]
  size?: 'sm' | 'md'
}

export function Tags({ tags, size = 'sm' }: TagsProps) {
  const fs = size === 'md' ? 9 : 8

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
      {tags.map(tag => (
        <Link
          key={tag.slug}
          href={`/intelligence?tag=${tag.slug}`}
          className="ed-tag"
          style={{
            fontFamily: FONT.mono,
            fontSize: fs,
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: C.textSecondary,
            background: C.bgTertiary,
            border: `1px solid ${C.border}`,
            borderRadius: 4,
            padding: '3px 8px',
            textDecoration: 'none',
            lineHeight: 1,
          }}
        >
          {tag.label}
        </Link>
      ))}
    </div>
  )
}
