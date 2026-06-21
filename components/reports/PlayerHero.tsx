import Link from 'next/link'
import { ArrowRight, Download } from 'lucide-react'
import type { PlayerReport } from '@/lib/reports/types'
import { C, FONT, SECTION, BTN } from '@/lib/ds'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Badge } from '@/components/ui/Badge'

interface PlayerHeroProps {
  report: PlayerReport
}

const VERDICT_COLORS: Record<string, string> = {
  'Recommended':     '#059669',
  'Monitor':         '#D97706',
  'Under Review':    '#7C3AED',
  'Not Recommended': '#DC2626',
}

export function PlayerHero({ report }: PlayerHeroProps) {
  const { player, recommendation, reportNumber, publishedAt, readTime, status } = report
  const PH   = SECTION.padH
  const MONO = FONT.mono

  return (
    <div style={{ background: '#FFFFFF', borderBottom: `1px solid ${C.border}` }}>

      {/* Breadcrumb */}
      <div style={{ paddingTop: 'clamp(12px,1.5vw,18px)', paddingBottom: 'clamp(10px,1.2vw,14px)', paddingLeft: PH, paddingRight: PH, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
        {[
          { label: 'Polaris',          href: '/'             },
          { label: 'Intelligence',     href: '/intelligence' },
          { label: 'Player Reports',   href: '/intelligence#player-reports' },
          { label: player.name,        href: null            },
        ].map((crumb, i, arr) => (
          <span key={crumb.label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            {crumb.href ? (
              <Link href={crumb.href} className="rp-bc-link" style={{ fontFamily: MONO, fontSize: 9, color: C.textMuted, textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {crumb.label}
              </Link>
            ) : (
              <span style={{ fontFamily: MONO, fontSize: 9, color: C.textSecondary, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 700 }}>
                {crumb.label}
              </span>
            )}
            {i < arr.length - 1 && <span style={{ color: C.border, fontSize: 10 }}>/</span>}
          </span>
        ))}
      </div>

      {/* Main hero */}
      <div style={{ paddingTop: 'clamp(28px,3.5vw,44px)', paddingBottom: 'clamp(24px,3vw,36px)', paddingLeft: PH, paddingRight: PH }}>

        {/* Report metadata row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: MONO, fontSize: 9, fontWeight: 700, color: C.blue, letterSpacing: '0.1em', textTransform: 'uppercase', background: C.blueLight, padding: '3px 8px', borderRadius: 4, border: `1px solid ${C.blueMid}` }}>
            {reportNumber}
          </span>
          <Badge variant="subtle">Player Report</Badge>
          <StatusBadge status={status} />
          <span style={{ color: C.border }}>·</span>
          <span style={{ fontFamily: MONO, fontSize: 9, color: C.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{publishedAt}</span>
          <span style={{ color: C.border }}>·</span>
          <span style={{ fontFamily: MONO, fontSize: 9, color: C.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{readTime} min read</span>
        </div>

        {/* Player name */}
        <h1 style={{
          fontFamily: FONT.display,
          fontSize: 'clamp(32px,5vw,64px)',
          fontWeight: 700,
          color: '#111827',
          margin: '0 0 4px',
          letterSpacing: '-0.045em',
          lineHeight: 0.9,
          textTransform: 'uppercase',
        }}>
          {player.firstName}<br />
          <span style={{ color: C.blue }}>{player.lastName}</span>
        </h1>

        {/* Position + Club */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, flexWrap: 'wrap', marginTop: 12 }}>
          <span style={{ fontFamily: FONT.display, fontSize: 'clamp(13px,1.6vw,17px)', fontWeight: 700, color: '#111827', letterSpacing: '-0.01em', textTransform: 'uppercase' }}>
            {player.positionCode}
          </span>
          <span style={{ color: C.border }}>·</span>
          <span style={{ fontFamily: FONT.sans, fontSize: 13, color: C.textSecondary }}>
            {player.club}
          </span>
          <span style={{ color: C.border }}>·</span>
          <span style={{ fontFamily: FONT.sans, fontSize: 13, color: C.textSecondary }}>
            {player.league}, {player.leagueCountry}
          </span>
        </div>

        {/* Key attributes grid */}
        <div className="rp-hero-meta" style={{ display: 'flex', alignItems: 'center', gap: 0, flexWrap: 'wrap', marginBottom: 24, border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden', background: C.bgLight }}>
          {[
            { label: 'Nationality',   value: `${player.nationality}${player.nationality2 ? ` / ${player.nationality2}` : ''}` },
            { label: 'Age',           value: `${player.age}` },
            { label: 'Height',        value: player.height },
            { label: 'Pref. Foot',    value: player.preferredFoot },
            { label: 'Contract',      value: `Until ${player.contractUntil}` },
            { label: 'Market Value',  value: player.marketValue },
          ].map((item, i, arr) => (
            <div key={item.label} style={{
              flex: '1 1 120px',
              padding: 'clamp(10px,1.3vw,16px) clamp(12px,1.5vw,18px)',
              borderRight: i < arr.length - 1 ? `1px solid ${C.border}` : 'none',
              textAlign: 'center',
            }}>
              <div style={{ fontFamily: MONO, fontSize: 7, color: C.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>
                {item.label}
              </div>
              <div style={{ fontFamily: FONT.display, fontSize: 13, fontWeight: 700, color: '#111827', letterSpacing: '-0.01em', lineHeight: 1.1 }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {/* Verdict + CTA row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 14px', borderRadius: 6,
              border: '1.5px solid',
              fontFamily: MONO, fontSize: 10, fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase',
            }}
              className={`rp-verdict-${recommendation.verdict.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {recommendation.verdict}
            </div>
            <div style={{ fontFamily: MONO, fontSize: 9, color: C.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Priority: <span style={{ color: recommendation.priority === 'High' ? '#059669' : recommendation.priority === 'Medium' ? '#D97706' : C.textMuted, fontWeight: 700 }}>{recommendation.priority}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <Link href="/contact" className="rp-dl-btn" style={{ ...BTN.primary, fontSize: 11, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Download size={11} /> Download PDF
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
