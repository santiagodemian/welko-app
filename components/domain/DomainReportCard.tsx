import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { DomainReport } from '@/lib/domain/types'
import { StatusBadge }       from '@/components/ui/StatusBadge'
import { EntityBadge }       from './EntityBadge'
import { C, FONT } from '@/lib/ds'

const VERDICT_COLORS: Record<string, string> = {
  'Recommended':      '#059669',
  'Monitor':          '#D97706',
  'Under Review':     '#7C3AED',
  'Not Recommended':  '#DC2626',
}

const PRIORITY_COLORS: Record<string, string> = {
  High: '#059669', Medium: '#D97706', Low: '#6B7280',
}

interface Props { report: DomainReport }

export function DomainReportCard({ report }: Props) {
  const verdictColor  = report.verdict  ? VERDICT_COLORS[report.verdict]   : '#6B7280'
  const priorityColor = report.priority ? PRIORITY_COLORS[report.priority] : '#6B7280'

  return (
    <div style={{
      background:    '#FFFFFF',
      border:        `1px solid ${C.border}`,
      borderRadius:  10,
      padding:       'clamp(16px,1.8vw,22px)',
      display:       'flex',
      flexDirection: 'column',
      gap:           14,
    }}>

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          <EntityBadge type="report" />
          <span style={{
            fontFamily: FONT.mono, fontSize: 8, fontWeight: 700, color: C.blue,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            background: C.blueLight, border: `1px solid ${C.blueMid}`,
            borderRadius: 4, padding: '2px 7px',
          }}>
            {report.reportNumber}
          </span>
        </div>
        <StatusBadge status={report.status} />
      </div>

      {/* Title */}
      <div>
        <div style={{
          fontFamily: FONT.display, fontSize: 'clamp(14px,1.6vw,17px)', fontWeight: 700,
          color: '#111827', letterSpacing: '-0.02em', textTransform: 'uppercase',
          lineHeight: 1.1, marginBottom: 4,
        }}>
          {report.title}
        </div>
        <div style={{ fontFamily: FONT.mono, fontSize: 9, color: C.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {report.analyst} · {report.publishedAt} · {report.readTime} min
        </div>
      </div>

      {/* Verdict + Priority */}
      {(report.verdict || report.priority) && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {report.verdict && (
            <span style={{
              fontFamily: FONT.mono, fontSize: 8, fontWeight: 700, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: verdictColor,
              background: `${verdictColor}12`, border: `1px solid ${verdictColor}30`,
              borderRadius: 4, padding: '2px 8px',
            }}>
              {report.verdict}
            </span>
          )}
          {report.priority && (
            <span style={{
              fontFamily: FONT.mono, fontSize: 8, fontWeight: 700, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: priorityColor,
              background: `${priorityColor}12`, border: `1px solid ${priorityColor}30`,
              borderRadius: 4, padding: '2px 8px',
            }}>
              {report.priority} Priority
            </span>
          )}
          <span style={{
            fontFamily: FONT.mono, fontSize: 8, fontWeight: 600, letterSpacing: '0.06em',
            textTransform: 'uppercase', color: '#374151',
            background: '#37415112', border: '1px solid #37415130',
            borderRadius: 4, padding: '2px 8px',
          }}>
            {report.confidentiality}
          </span>
        </div>
      )}

      {/* Tags */}
      {report.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {report.tags.slice(0, 4).map(t => (
            <span key={t} style={{
              fontFamily: FONT.sans, fontSize: 9, color: C.textSecondary,
              background: C.bgAlt, border: `1px solid ${C.border}`,
              borderRadius: 4, padding: '2px 6px',
            }}>{t}</span>
          ))}
        </div>
      )}

      {/* CTA */}
      <div style={{ marginTop: 'auto', paddingTop: 10, borderTop: `1px solid ${C.border}` }}>
        <Link href={report.href} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          textDecoration: 'none', fontFamily: FONT.sans, fontSize: 10,
          fontWeight: 700, color: C.blue, letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>
          Read Full Report <ArrowRight size={11} />
        </Link>
      </div>
    </div>
  )
}
