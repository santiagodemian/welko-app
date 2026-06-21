import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Navbar }       from '@/components/layout/Navbar'
import { Footer }       from '@/components/layout/Footer'
import { Eyebrow }      from '@/components/ui/Eyebrow'
import { StatusBadge }  from '@/components/ui/StatusBadge'
import { C, FONT, SECTION, BTN } from '@/lib/ds'
import { getAllPlayerReports }    from '@/lib/reports'
import { ReportStyles }           from '@/components/reports/ReportStyles'

export const metadata = {
  title:       'Player Reports — Polaris Intelligence',
  description: 'Professional player scouting reports from the Polaris Intelligence desk. Built for clubs, agents, and scouts.',
}

export default function PlayerReportsPage() {
  const reports = getAllPlayerReports()
  const PH      = SECTION.padH
  const MONO    = FONT.mono

  const POSITION_COLORS: Record<string, string> = {
    goalkeeper: '#374151',
    defender:   '#059669',
    midfielder: '#2563EB',
    forward:    '#DC2626',
  }

  return (
    <div style={{ fontFamily: FONT.sans, background: C.bgLight, minHeight: '100vh' }}>
      <ReportStyles />
      <Navbar />

      {/* Header */}
      <div style={{ background: '#FFFFFF', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ paddingTop: 'clamp(32px,4vw,52px)', paddingBottom: 'clamp(24px,3vw,36px)', paddingLeft: PH, paddingRight: PH }}>
          <Eyebrow meta={`${reports.length} reports`} mb={14}>Player Reports</Eyebrow>
          <h1 style={{ fontFamily: FONT.display, fontSize: 'clamp(28px,4vw,48px)', fontWeight: 700, color: '#111827', margin: '0 0 12px', letterSpacing: '-0.04em', textTransform: 'uppercase', lineHeight: 0.92 }}>
            Player<br />Intelligence
          </h1>
          <p style={{ fontFamily: FONT.sans, fontSize: 13, color: C.textSecondary, margin: 0, maxWidth: 440, lineHeight: 1.8 }}>
            Professional scouting reports built for clubs, agents, and scouts. Each report covers tactical profile, season data, physical attributes, and a Polaris recruitment recommendation.
          </p>
        </div>
      </div>

      {/* Report list */}
      <div style={{ borderBottom: `1px solid ${C.border}` }}>
        {reports.map((report, i) => {
          const posColor = POSITION_COLORS[report.player.positionGroup] ?? C.blue
          return (
            <Link
              key={report.slug}
              href={`/reports/player/${report.slug}`}
              className="rp-related-card"
              style={{
                display: 'block', textDecoration: 'none',
                padding: `clamp(18px,2.2vw,28px) ${PH}`,
                background: i % 2 === 0 ? '#FFFFFF' : C.bgLight,
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              <div style={{ maxWidth: SECTION.maxW, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, alignItems: 'center' }}>
                <div>
                  {/* Meta row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: MONO, fontSize: 8, fontWeight: 700, color: C.blue, letterSpacing: '0.1em', textTransform: 'uppercase', background: C.blueLight, padding: '2px 7px', borderRadius: 4, border: `1px solid ${C.blueMid}` }}>
                      {report.reportNumber}
                    </span>
                    <StatusBadge status={report.status} />
                    <span style={{ fontFamily: MONO, fontSize: 8, color: C.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      {report.publishedAt}
                    </span>
                    <span style={{ color: C.border }}>·</span>
                    <span style={{ fontFamily: MONO, fontSize: 8, color: C.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      {report.readTime} min
                    </span>
                  </div>

                  {/* Player name */}
                  <div className="rp-related-name" style={{ fontFamily: FONT.display, fontSize: 'clamp(18px,2.2vw,26px)', fontWeight: 700, color: '#111827', letterSpacing: '-0.03em', textTransform: 'uppercase', lineHeight: 0.95, marginBottom: 8, transition: 'color 0.14s' }}>
                    {report.player.name}
                  </div>

                  {/* Position + Club + League */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: MONO, fontSize: 9, fontWeight: 700, color: posColor, letterSpacing: '0.06em', textTransform: 'uppercase', background: `${posColor}0D`, padding: '2px 8px', borderRadius: 4, border: `1px solid ${posColor}2E` }}>
                      {report.player.positionCode}
                    </span>
                    <span style={{ fontFamily: FONT.sans, fontSize: 12, color: C.textSecondary }}>{report.player.club}</span>
                    <span style={{ color: C.border }}>·</span>
                    <span style={{ fontFamily: FONT.sans, fontSize: 12, color: C.textSecondary }}>{report.player.league}</span>
                    <span style={{ color: C.border }}>·</span>
                    <span style={{ fontFamily: FONT.sans, fontSize: 12, color: C.textSecondary }}>{report.player.nationality}</span>
                  </div>
                </div>

                {/* Arrow */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: FONT.sans, fontSize: 10, fontWeight: 700, color: C.blue, letterSpacing: '0.08em', textTransform: 'uppercase', flexShrink: 0 }}>
                  Read Report <ArrowRight size={11} />
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Commission CTA */}
      <section style={{ background: C.bgAlt, paddingTop: 'clamp(36px,4.5vw,56px)', paddingBottom: 'clamp(36px,4.5vw,56px)', paddingLeft: PH, paddingRight: PH }}>
        <div style={{ maxWidth: SECTION.maxW, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
          <div>
            <Eyebrow mb={8}>Commission a Report</Eyebrow>
            <p style={{ fontFamily: FONT.sans, fontSize: 13, color: C.textSecondary, margin: 0, maxWidth: 400, lineHeight: 1.8 }}>
              Need a report on a specific player? Our scouting desk produces commissioned player reports for clubs, agents, and scouts.
            </p>
          </div>
          <Link href="/contact" style={{ ...BTN.primary }}>
            Commission a Player Report <ArrowRight size={12} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
