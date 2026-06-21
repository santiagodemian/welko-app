import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { PlayerReport } from '@/lib/reports/types'
import { C, FONT } from '@/lib/ds'
import { StatusBadge } from '@/components/ui/StatusBadge'

interface RelatedReportsProps {
  reports: PlayerReport[]
}

export function RelatedReports({ reports }: RelatedReportsProps) {
  if (reports.length === 0) return null

  return (
    <div style={{ padding: 'clamp(18px,2.2vw,26px)', borderTop: `1px solid ${C.border}` }}>
      <div style={{ marginBottom: 14, paddingBottom: 12, borderBottom: `1.5px solid #111827` }}>
        <span style={{ fontFamily: FONT.sans, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#111827' }}>
          Related Reports
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {reports.map(report => (
          <Link
            key={report.slug}
            href={`/reports/player/${report.slug}`}
            className="rp-related-card"
            style={{
              display: 'block', textDecoration: 'none',
              padding: 'clamp(12px,1.5vw,16px)',
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              background: '#FFFFFF',
            }}
          >
            {/* Report number + status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <span style={{ fontFamily: FONT.mono, fontSize: 8, fontWeight: 700, color: C.blue, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {report.reportNumber}
              </span>
              <StatusBadge status={report.status} />
            </div>

            {/* Player name */}
            <div className="rp-related-name" style={{ fontFamily: FONT.display, fontSize: 13, fontWeight: 700, color: '#111827', letterSpacing: '-0.02em', marginBottom: 4, transition: 'color 0.14s' }}>
              {report.player.name}
            </div>

            {/* Position + Club */}
            <div style={{ fontFamily: FONT.sans, fontSize: 11, color: C.textSecondary, marginBottom: 8, lineHeight: 1.4 }}>
              {report.player.positionCode} · {report.player.club}
            </div>

            {/* Meta */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: FONT.mono, fontSize: 8, color: C.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {report.readTime} min
              </span>
              <span style={{ fontFamily: FONT.sans, fontSize: 9, color: C.blue, display: 'flex', alignItems: 'center', gap: 3, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Read <ArrowRight size={8} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
