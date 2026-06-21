import { notFound }           from 'next/navigation'
import type { Metadata }       from 'next'
import Link                    from 'next/link'
import { ArrowRight, Download } from 'lucide-react'
import { Navbar }              from '@/components/layout/Navbar'
import { Footer }              from '@/components/layout/Footer'
import { ReportStyles }        from '@/components/reports/ReportStyles'
import { PlayerHero }          from '@/components/reports/PlayerHero'
import { ReportSection }       from '@/components/reports/ReportSection'
import { SeasonPerformance }   from '@/components/reports/SeasonPerformance'
import { TacticalProfile }     from '@/components/reports/TacticalProfile'
import { StrengthsWeaknesses } from '@/components/reports/StrengthsWeaknesses'
import { PhysicalProfile }     from '@/components/reports/PhysicalProfile'
import { Recommendation }      from '@/components/reports/Recommendation'
import { ReportToC }           from '@/components/reports/ReportToC'
import { RelatedReports }      from '@/components/reports/RelatedReports'
import { Tags }                from '@/components/editorial/Tags'
import { C, FONT, SECTION, BTN } from '@/lib/ds'
import {
  getPlayerReport,
  getAllPlayerSlugs,
  getRelatedReports,
} from '@/lib/reports'

// ─── Static generation ────────────────────────────────────────────────────────

export async function generateStaticParams() {
  return getAllPlayerSlugs()
}

// ─── SEO metadata ─────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const report   = getPlayerReport(slug)
  if (!report) return { title: 'Report Not Found — Polaris' }

  const { player } = report
  const title       = `${player.name} — Player Report · Polaris Intelligence`
  const description = report.summary.split('\n\n')[0].substring(0, 155)
  const canonical   = `https://welko.agency/reports/player/${slug}`

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      type:     'article',
      url:      canonical,
      siteName: 'Polaris Football Intelligence',
    },
    twitter: {
      card:        'summary_large_image',
      title,
      description,
    },
  }
}

// ─── TOC entries ─────────────────────────────────────────────────────────────

const TOC = [
  { id: 'executive-summary',        num: '01', title: 'Executive Summary'         },
  { id: 'season-performance',       num: '02', title: 'Season Performance'        },
  { id: 'tactical-profile',         num: '03', title: 'Tactical Profile'          },
  { id: 'strengths',                num: '04', title: 'Strengths'                 },
  { id: 'weaknesses',               num: '05', title: 'Weaknesses'               },
  { id: 'physical-profile',         num: '06', title: 'Physical Profile'          },
  { id: 'recommendation',           num: '07', title: 'Recommendation'            },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function PlayerReportPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const report   = getPlayerReport(slug)
  if (!report) notFound()

  const related = getRelatedReports(report.relatedSlugs)
  const PH      = SECTION.padH
  const MONO    = FONT.mono

  // JSON-LD structured data
  const jsonLd = {
    '@context':    'https://schema.org',
    '@type':       'Article',
    headline:      `${report.player.name} — Player Scouting Report`,
    author:        { '@type': 'Organization', name: report.analyst },
    publisher:     { '@type': 'Organization', name: 'Polaris Football Intelligence', url: 'https://welko.agency' },
    datePublished: report.publishedAt,
    dateModified:  report.updatedAt ?? report.publishedAt,
    description:   report.summary.split('\n\n')[0].substring(0, 200),
    about: {
      '@type': 'Person',
      name:    report.player.name,
      jobTitle: report.player.position,
      worksFor: { '@type': 'Organization', name: report.player.club },
      nationality: report.player.nationality,
    },
  }

  return (
    <div style={{ fontFamily: FONT.sans, background: C.bgLight, minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ReportStyles />

      <Navbar />

      {/* Hero */}
      <PlayerHero report={report} />

      {/* Two-column layout */}
      <div className="rp-layout" style={{ background: C.bgLight, borderBottom: `1px solid ${C.border}` }}>

        {/* ── Main content ───────────────────────────────────────────────── */}
        <div>

          {/* 01 — Executive Summary */}
          <ReportSection id="executive-summary" num="01" title="Executive Summary" bg="#FFFFFF">
            {report.summary.split('\n\n').map((para, i) => (
              <p key={i} style={{ fontFamily: FONT.sans, fontSize: 13, color: C.textSecondary, margin: i < report.summary.split('\n\n').length - 1 ? '0 0 18px' : '0', lineHeight: 1.9 }}>
                {para}
              </p>
            ))}
          </ReportSection>

          {/* 02 — Season Performance */}
          <ReportSection id="season-performance" num="02" title="Season Performance" bg={C.bgAlt}>
            <SeasonPerformance season={report.season} />
          </ReportSection>

          {/* 03 — Tactical Profile */}
          <ReportSection id="tactical-profile" num="03" title="Tactical Profile" bg="#FFFFFF">
            <TacticalProfile tactical={report.tactical} />
          </ReportSection>

          {/* 04 — Strengths */}
          <ReportSection id="strengths" num="04" title="Strengths" bg={C.bgAlt}>
            <p style={{ fontFamily: FONT.sans, fontSize: 12, color: C.textSecondary, margin: '0 0 16px', lineHeight: 1.75, fontStyle: 'italic' }}>
              Attributes with clear translation value to European secondary league environments.
            </p>
            <div style={{ marginLeft: `calc(-1 * ${PH})`, marginRight: `calc(-1 * ${PH})` }}>
              <StrengthsWeaknesses items={report.strengths} variant="strengths" />
            </div>
          </ReportSection>

          {/* 05 — Weaknesses */}
          <ReportSection id="weaknesses" num="05" title="Weaknesses" bg="#FFFFFF">
            <p style={{ fontFamily: FONT.sans, fontSize: 12, color: C.textSecondary, margin: '0 0 16px', lineHeight: 1.75, fontStyle: 'italic' }}>
              Limitations and risk factors to weigh against the profile&apos;s upside.
            </p>
            <div style={{ marginLeft: `calc(-1 * ${PH})`, marginRight: `calc(-1 * ${PH})` }}>
              <StrengthsWeaknesses items={report.weaknesses} variant="weaknesses" />
            </div>
          </ReportSection>

          {/* 06 — Physical Profile */}
          <ReportSection id="physical-profile" num="06" title="Physical Profile" bg={C.bgAlt}>
            <PhysicalProfile physical={report.physical} />
          </ReportSection>

          {/* 07 — Recommendation */}
          <ReportSection id="recommendation" num="07" title="Recruitment Recommendation" bg="#FFFFFF">
            <Recommendation recommendation={report.recommendation} />
          </ReportSection>

          {/* Tags */}
          <div style={{ padding: `clamp(18px,2.2vw,26px) ${PH}`, borderTop: `1px solid ${C.border}`, background: C.bgAlt }}>
            <div style={{ fontFamily: MONO, fontSize: 8, color: C.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
              Tags
            </div>
            <Tags tags={report.tags.map(t => ({ label: t, slug: t.toLowerCase().replace(/\s+/g, '-') }))} />
          </div>
        </div>

        {/* ── Sidebar ─────────────────────────────────────────────────────── */}
        <div className="rp-sidebar" style={{ background: '#FFFFFF', borderLeft: `1px solid ${C.border}` }}>
          <ReportToC
            entries={TOC}
            reportNumber={report.reportNumber}
            analyst={report.analyst}
            publishedAt={report.publishedAt}
            readTime={report.readTime}
          />
          <RelatedReports reports={related} />
        </div>
      </div>

      {/* ── Download PDF CTA ────────────────────────────────────────────── */}
      <section style={{ background: '#111827', paddingTop: 'clamp(36px,4.5vw,56px)', paddingBottom: 'clamp(36px,4.5vw,56px)', paddingLeft: PH, paddingRight: PH }}>
        <div style={{ maxWidth: SECTION.maxW, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
          <div>
            <div style={{ fontFamily: MONO, fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
              Polaris Intelligence · {report.reportNumber}
            </div>
            <h2 style={{ fontFamily: FONT.display, fontSize: 'clamp(18px,2.5vw,30px)', fontWeight: 700, color: '#fff', margin: '0 0 6px', letterSpacing: '-0.03em', textTransform: 'uppercase' }}>
              {report.player.name}
            </h2>
            <p style={{ fontFamily: FONT.sans, fontSize: 12, color: 'rgba(255,255,255,0.5)', margin: 0 }}>
              Full report available in PDF format upon request · {report.confidentiality}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link href="/contact" className="rp-dl-btn" style={{ ...BTN.primary, background: '#fff', color: '#111827', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Download size={12} /> Request PDF
            </Link>
            <Link href="/reports/player" className="rp-contact-btn" style={{ ...BTN.primary, background: 'transparent', color: 'rgba(255,255,255,0.7)', border: '1.5px solid rgba(255,255,255,0.2)' }}>
              All Reports <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
