import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Article } from '@/lib/editorial'
import { C, FONT } from '@/lib/ds'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { ArticleMeta } from './ArticleMeta'

interface EditorsPickProps {
  article: Article
  note?: string
}

export function EditorsPick({ article, note }: EditorsPickProps) {
  return (
    <Link href={article.href} className="ed-pick" style={{ padding: 'clamp(18px,2.2vw,26px)' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, paddingBottom: 12, borderBottom: `1.5px solid #111827` }}>
        <span style={{ fontFamily: FONT.sans, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#111827' }}>
          Editor&apos;s Pick
        </span>
      </div>

      {/* Editor note */}
      {note && (
        <p style={{ fontFamily: FONT.sans, fontSize: 11.5, color: C.textSecondary, margin: '0 0 16px', lineHeight: 1.85, fontStyle: 'italic' }}>
          &ldquo;{note}&rdquo;
        </p>
      )}

      {/* Category */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <span style={{ width: 4, height: 4, borderRadius: '50%', background: article.category.color, display: 'inline-block', flexShrink: 0 }} />
        <span style={{ fontFamily: FONT.mono, fontSize: 8, color: article.category.color, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}>
          {article.category.name}
        </span>
        <StatusBadge status={article.status} />
      </div>

      {/* Title */}
      <h3 className="ed-pick-title" style={{
        fontFamily: FONT.display, fontSize: 'clamp(13px,1.5vw,16px)',
        fontWeight: 700, color: '#111827',
        margin: '0 0 14px', letterSpacing: '-0.02em', lineHeight: 1.15,
        transition: 'color 0.15s',
      }}>
        {article.title}
      </h3>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: `1px solid ${C.border}`, flexWrap: 'wrap', gap: 10 }}>
        <ArticleMeta article={article} />
        <span style={{ fontFamily: FONT.sans, fontSize: 9, fontWeight: 700, color: C.blue, display: 'flex', alignItems: 'center', gap: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Read <ArrowRight size={9} />
        </span>
      </div>
    </Link>
  )
}
