import { C, FONT } from '@/lib/ds'

export interface ToCEntry {
  id:    string
  num:   string
  title: string
}

interface ReportToCProps {
  entries:      ToCEntry[]
  reportNumber: string
  analyst:      string
  publishedAt:  string
  readTime:     number
}

export function ReportToC({ entries, reportNumber, analyst, publishedAt, readTime }: ReportToCProps) {
  const MONO = FONT.mono

  return (
    <div className="rp-sidebar-sticky" style={{ padding: 'clamp(18px,2.2vw,26px)' }}>

      {/* ToC header */}
      <div style={{ marginBottom: 14, paddingBottom: 12, borderBottom: `1.5px solid #111827` }}>
        <span style={{ fontFamily: FONT.sans, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#111827' }}>
          Contents
        </span>
      </div>

      {/* ToC items */}
      <nav>
        {entries.map(entry => (
          <a key={entry.id} href={`#${entry.id}`} className="rp-toc-link">
            <span style={{ fontFamily: MONO, fontSize: 9, color: C.border, letterSpacing: '-0.02em', flexShrink: 0, minWidth: 20 }}>
              {entry.num}
            </span>
            <span>{entry.title}</span>
          </a>
        ))}
      </nav>

      {/* Report meta */}
      <div style={{ marginTop: 24, paddingTop: 18, borderTop: `1px solid ${C.border}` }}>
        <div style={{ fontFamily: MONO, fontSize: 9, fontWeight: 700, color: C.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
          Report Details
        </div>
        {[
          { label: 'Report No.',  value: reportNumber   },
          { label: 'Analyst',     value: analyst        },
          { label: 'Published',   value: publishedAt    },
          { label: 'Read time',   value: `${readTime} min` },
          { label: 'Source',      value: 'Polaris Intelligence' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 7 }}>
            <span style={{ fontFamily: MONO, fontSize: 8, color: C.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{item.label}</span>
            <span style={{ fontFamily: FONT.sans, fontSize: 11, color: C.textSecondary, fontWeight: 600, textAlign: 'right' }}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
