import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { INTELLIGENCE_QUERIES, runQuery } from '@/lib/intelligence'
import type { MatchResult } from '@/lib/intelligence/matchers'
import type { Player }      from '@/lib/domain/types'
import type { DomainReport } from '@/lib/domain/types/report'
import { getCountry, getClub } from '@/lib/domain/seed'
import { MatchCard }    from '@/components/intelligence/MatchCard'
import { MatchScore }   from '@/components/intelligence/MatchScore'
import { WorkflowStyles, WORKFLOW_CSS } from '@/components/workflow'
import { EntityBadge }  from '@/components/domain/EntityBadge'
import { PositionBadge } from '@/components/domain/PositionBadge'
import { C, FONT } from '@/lib/ds'

export const metadata: Metadata = {
  title: 'Intelligence Engine — Polaris OS',
  description: 'Pre-built scouting queries powered by the Polaris intelligence graph.',
}

const CATEGORY_LABELS: Record<string, string> = {
  matching:    'Mandate Matching',
  opportunity: 'Market Opportunity',
  market:      'Market Intelligence',
  network:     'Network Queries',
}

function PlayerRow({ player, monthsLeft }: { player: Player & { monthsLeft?: number }; monthsLeft?: number }) {
  const club = player.currentClubId ? getClub(player.currentClubId) : undefined
  const country = getCountry(player.nationalityId)

  return (
    <div style={{
      background: '#FFFFFF', border: `1px solid ${C.border}`, borderRadius: 10,
      padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14,
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontFamily: FONT.display, fontSize: 14, fontWeight: 700, color: '#111827', letterSpacing: '-0.01em' }}>
            {player.firstName} <span style={{ color: C.blue }}>{player.lastName}</span>
          </span>
          {player.status === 'free-agent' && (
            <span style={{
              fontFamily: FONT.mono, fontSize: 7, fontWeight: 700, letterSpacing: '0.07em',
              textTransform: 'uppercase', color: '#059669',
              background: '#ECFDF5', border: '1px solid #A7F3D0',
              borderRadius: 4, padding: '1px 6px',
            }}>
              Free Agent
            </span>
          )}
          {monthsLeft !== undefined && monthsLeft > 0 && (
            <span style={{
              fontFamily: FONT.mono, fontSize: 7, fontWeight: 700, letterSpacing: '0.07em',
              textTransform: 'uppercase', color: '#D97706',
              background: '#FFFBEB', border: '1px solid #FDE68A',
              borderRadius: 4, padding: '1px 6px',
            }}>
              {monthsLeft}mo left
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          {player.positions.map(p => (
            <PositionBadge key={p} position={p} group={player.positionGroup} />
          ))}
          <span style={{ fontFamily: FONT.sans, fontSize: 10, color: C.textMuted }}>
            {player.age}y · {country?.name ?? player.nationalityId} · {player.preferredFoot} foot
          </span>
          {club && (
            <span style={{ fontFamily: FONT.sans, fontSize: 10, color: C.textSecondary, fontWeight: 600 }}>
              {club.name}
            </span>
          )}
        </div>
      </div>
      {player.marketValue && (
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontFamily: FONT.mono, fontSize: 7, color: C.textMuted, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 2 }}>Value</div>
          <div style={{ fontFamily: FONT.mono, fontSize: 12, fontWeight: 700, color: '#374151' }}>
            €{(player.marketValue.amount / 1000).toFixed(0)}K
          </div>
        </div>
      )}
      {player.reportIds.length > 0 && (
        <Link href={`/reports/player/${player.reportIds[0]}`} style={{
          fontFamily: FONT.sans, fontSize: 10, fontWeight: 700, color: C.blue,
          textDecoration: 'none', whiteSpace: 'nowrap',
          letterSpacing: '0.04em', textTransform: 'uppercase',
        }}>
          Report →
        </Link>
      )}
    </div>
  )
}

function ReportRow({ report }: { report: DomainReport }) {
  return (
    <div style={{
      background: '#FFFFFF', border: `1px solid ${C.border}`, borderRadius: 10,
      padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14,
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <EntityBadge type="report" />
          <span style={{ fontFamily: FONT.mono, fontSize: 8, color: C.textMuted, letterSpacing: '0.06em' }}>
            {report.reportNumber}
          </span>
        </div>
        <div style={{ fontFamily: FONT.sans, fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 4 }}>
          {report.title}
        </div>
        <div style={{ fontFamily: FONT.mono, fontSize: 8, color: C.textMuted }}>
          {report.analyst} · {report.publishedAt}
        </div>
      </div>
      <Link href={report.href} style={{
        fontFamily: FONT.sans, fontSize: 10, fontWeight: 700, color: C.blue,
        textDecoration: 'none', whiteSpace: 'nowrap',
        letterSpacing: '0.04em', textTransform: 'uppercase',
      }}>
        Read →
      </Link>
    </div>
  )
}

export default async function IntelligencePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const activeQueryId = q ?? INTELLIGENCE_QUERIES[0].id
  const activeQuery   = INTELLIGENCE_QUERIES.find(iq => iq.id === activeQueryId) ?? INTELLIGENCE_QUERIES[0]
  const result        = runQuery(activeQuery.id)

  const grouped = INTELLIGENCE_QUERIES.reduce<Record<string, typeof INTELLIGENCE_QUERIES>>((acc, iq) => {
    if (!acc[iq.category]) acc[iq.category] = []
    acc[iq.category].push(iq)
    return acc
  }, {})

  return (
    <>
      <WorkflowStyles />
      <style>{WORKFLOW_CSS}</style>

      <div style={{ minHeight: '100vh', background: '#F9FAFB', display: 'grid', gridTemplateColumns: '260px 1fr' }}>

        {/* ── Left: Query selector ── */}
        <aside style={{ background: '#FFFFFF', borderRight: `1px solid ${C.border}`, padding: '24px 0' }}>
          <div style={{ padding: '0 20px 16px' }}>
            <Link href="/os" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontFamily: FONT.sans, fontSize: 10, fontWeight: 600, color: C.textSecondary,
              textDecoration: 'none', marginBottom: 14,
            }}>
              <ArrowLeft size={10} /> Polaris OS
            </Link>
            <div style={{ fontFamily: FONT.mono, fontSize: 8, color: C.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>
              Intelligence Engine
            </div>
            <h1 style={{ fontFamily: FONT.display, fontSize: 18, fontWeight: 700, color: '#0A0A0A', letterSpacing: '-0.02em', textTransform: 'uppercase', lineHeight: 1 }}>
              Queries
            </h1>
          </div>

          {Object.entries(grouped).map(([cat, queries]) => (
            <div key={cat} style={{ marginBottom: 8 }}>
              <div style={{ fontFamily: FONT.mono, fontSize: 7, color: C.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '8px 20px 4px' }}>
                {CATEGORY_LABELS[cat] ?? cat}
              </div>
              {queries.map(iq => (
                <Link
                  key={iq.id}
                  href={`/os/intelligence?q=${iq.id}`}
                  style={{ textDecoration: 'none', display: 'block' }}
                >
                  <div
                    className={`iq-card${iq.id === activeQueryId ? ' active' : ''}`}
                    style={{
                      padding: '10px 20px',
                      border: '1px solid transparent',
                      borderLeft: iq.id === activeQueryId ? `3px solid ${iq.color}` : '3px solid transparent',
                      background: iq.id === activeQueryId ? '#F0F9FF' : 'transparent',
                      marginBottom: 1,
                    }}
                  >
                    <div style={{
                      fontFamily: FONT.sans, fontSize: 11, fontWeight: iq.id === activeQueryId ? 700 : 500,
                      color: iq.id === activeQueryId ? '#111827' : '#374151',
                      marginBottom: 2,
                    }}>
                      {iq.title}
                    </div>
                    <div style={{ fontFamily: FONT.sans, fontSize: 9, color: C.textMuted, lineHeight: 1.5 }}>
                      {iq.description.substring(0, 60)}…
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ))}
        </aside>

        {/* ── Right: Query result ── */}
        <main style={{ padding: 'clamp(24px,3vw,36px)', display: 'flex', flexDirection: 'column', gap: 22 }}>

          {/* Query header */}
          <div style={{ background: '#FFFFFF', border: `1px solid ${C.border}`, borderRadius: 10, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                background: activeQuery.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 8L6 12L14 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <div style={{ fontFamily: FONT.mono, fontSize: 7, color: C.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 3 }}>
                  {CATEGORY_LABELS[activeQuery.category] ?? activeQuery.category}
                </div>
                <h2 style={{ fontFamily: FONT.display, fontSize: 20, fontWeight: 700, color: '#0A0A0A', letterSpacing: '-0.02em', textTransform: 'uppercase', lineHeight: 1 }}>
                  {activeQuery.title}
                </h2>
              </div>
            </div>
            <p style={{ fontFamily: FONT.sans, fontSize: 12, color: C.textSecondary, lineHeight: 1.7, marginBottom: 10, maxWidth: 580 }}>
              {activeQuery.description}
            </p>
            <div style={{
              fontFamily: FONT.mono, fontSize: 10, color: '#374151',
              background: '#F9FAFB', border: `1px solid ${C.border}`, borderRadius: 6, padding: '8px 12px',
              maxWidth: 480,
            }}>
              {activeQuery.example}
            </div>
          </div>

          {/* Result summary */}
          {result && (
            <div style={{
              fontFamily: FONT.sans, fontSize: 12, color: result.isEmpty ? C.textMuted : '#111827',
              background: result.isEmpty ? '#F9FAFB' : '#ECFDF5',
              border: `1px solid ${result.isEmpty ? C.border : '#A7F3D0'}`,
              borderRadius: 8, padding: '10px 16px',
            }}>
              {result.summary}
            </div>
          )}

          {/* Results */}
          {result && !result.isEmpty && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ fontFamily: FONT.mono, fontSize: 8, color: C.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                {result.items.length} Result{result.items.length > 1 ? 's' : ''}
              </div>
              {result.items.map((item, i) => {
                if (item.kind === 'player-match') {
                  return <MatchCard key={i} result={item.data as MatchResult} rank={i + 1} />
                }
                if (item.kind === 'player') {
                  const p = item.data as (Player & { monthsLeft?: number })
                  return <PlayerRow key={i} player={p} monthsLeft={p.monthsLeft} />
                }
                if (item.kind === 'report') {
                  return <ReportRow key={i} report={item.data as DomainReport} />
                }
                return null
              })}
            </div>
          )}

          {/* Other queries suggestion */}
          {result && !result.isEmpty && (
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 20 }}>
              <div style={{ fontFamily: FONT.mono, fontSize: 8, color: C.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
                Related Queries
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {INTELLIGENCE_QUERIES
                  .filter(iq => iq.id !== activeQueryId)
                  .slice(0, 4)
                  .map(iq => (
                    <Link key={iq.id} href={`/os/intelligence?q=${iq.id}`} style={{ textDecoration: 'none' }}>
                      <div style={{
                        fontFamily: FONT.sans, fontSize: 11, fontWeight: 600,
                        color: '#374151', background: '#FFFFFF',
                        border: `1px solid ${C.border}`, borderRadius: 7,
                        padding: '7px 14px', display: 'flex', alignItems: 'center', gap: 5,
                      }}>
                        <span style={{ width: 6, height: 6, borderRadius: 2, background: iq.color, display: 'inline-block' }} />
                        {iq.title}
                        <ArrowRight size={9} />
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          )}

        </main>
      </div>
    </>
  )
}
