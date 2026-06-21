import Link     from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Navbar }  from '@/components/layout/Navbar'
import { Footer }  from '@/components/layout/Footer'
import { Eyebrow } from '@/components/ui/Eyebrow'
import {
  PlayerCard, ClubCard, AgentCard, RequestCard, DomainReportCard,
  EntityBadge,
} from '@/components/domain'
import { ENTITY_GRAPH, ENTITY_META } from '@/lib/domain/graph/relations'
import {
  PLAYERS, CLUBS, AGENTS, REQUESTS, DOMAIN_REPORTS, CONTACTS,
} from '@/lib/domain/seed'
import { C, FONT, SECTION, BTN } from '@/lib/ds'

export const metadata = {
  title:       'Platform Architecture — Polaris Football Intelligence',
  description: 'The domain model and intelligence graph powering Polaris OS. Nine entity types. Unlimited connections.',
}

const PLATFORM_CSS = `
  .plt-entity-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; }
  .plt-entity-item:hover .plt-entity-name { color: #2563EB; }
  .plt-card-grid   { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .plt-card-grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
  .plt-edge-row:hover { background: #F9FAFB; }
  .plt-stat { font-variant-numeric: tabular-nums; }
  @media (max-width: 1024px) {
    .plt-card-grid   { grid-template-columns: repeat(2, 1fr); }
    .plt-entity-grid { grid-template-columns: repeat(3, 1fr); }
  }
  @media (max-width: 680px) {
    .plt-card-grid   { grid-template-columns: 1fr; }
    .plt-card-grid-2 { grid-template-columns: 1fr; }
    .plt-entity-grid { grid-template-columns: repeat(2, 1fr); }
  }
`

const ENTITY_ORDER = [
  'player', 'club', 'agent', 'competition',
  'request', 'report', 'organization', 'country', 'contact',
] as const

export default function PlatformPage() {
  const PH   = SECTION.padH
  const MONO = FONT.mono

  const totalEdges   = ENTITY_GRAPH.length
  const entityCount  = ENTITY_ORDER.length
  const playerCount  = PLAYERS.length
  const clubCount    = CLUBS.length
  const requestCount = REQUESTS.length

  return (
    <div style={{ fontFamily: FONT.sans, background: C.bgLight, minHeight: '100vh' }}>
      <style>{PLATFORM_CSS}</style>
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <div style={{ background: '#111827', borderBottom: `1px solid #1F2937` }}>
        <div style={{ paddingTop: 'clamp(36px,5vw,68px)', paddingBottom: 'clamp(28px,4vw,52px)', paddingLeft: PH, paddingRight: PH, maxWidth: SECTION.maxW, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: MONO, fontSize: 8, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.blue, background: '#1E3A5F', border: `1px solid ${C.blueMid}`, borderRadius: 4, padding: '3px 8px' }}>
              Domain Model v1.0
            </span>
            <span style={{ fontFamily: MONO, fontSize: 8, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {entityCount} entity types · {totalEdges} relationship edges
            </span>
          </div>

          <h1 style={{ fontFamily: FONT.display, fontSize: 'clamp(28px,5.5vw,68px)', fontWeight: 700, color: '#FFFFFF', margin: '0 0 16px', letterSpacing: '-0.04em', textTransform: 'uppercase', lineHeight: 0.88 }}>
            Football<br />Intelligence<br /><span style={{ color: C.blue }}>Graph</span>
          </h1>

          <p style={{ fontFamily: FONT.sans, fontSize: 13, color: 'rgba(255,255,255,0.55)', margin: '0 0 28px', maxWidth: 460, lineHeight: 1.85 }}>
            The domain model that powers the entire Polaris OS ecosystem — from CRM to AI matching, recruitment intelligence to opportunity detection. Nine entities. Unlimited connections.
          </p>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
            {[
              { label: 'Entity Types',    value: entityCount  },
              { label: 'Relationship Edges', value: totalEdges },
              { label: 'Players Tracked', value: playerCount  },
              { label: 'Club Mandates',   value: requestCount },
            ].map(s => (
              <div key={s.label}>
                <div className="plt-stat" style={{ fontFamily: FONT.display, fontSize: 'clamp(20px,3vw,36px)', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.04em', lineHeight: 1 }}>
                  {s.value}
                </div>
                <div style={{ fontFamily: MONO, fontSize: 8, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 3 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Entity Schema ─────────────────────────────────────────────────────── */}
      <div style={{ background: '#FFFFFF', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ paddingTop: 'clamp(28px,3.5vw,44px)', paddingBottom: 'clamp(28px,3.5vw,44px)', paddingLeft: PH, paddingRight: PH, maxWidth: SECTION.maxW, margin: '0 auto' }}>
          <Eyebrow mb={20}>Entity Schema</Eyebrow>

          <div className="plt-entity-grid" style={{ border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden' }}>
            {ENTITY_ORDER.map((key, i) => {
              const meta = ENTITY_META[key]
              return (
                <div key={key} className="plt-entity-item" style={{
                  padding: 'clamp(14px,1.6vw,20px)',
                  borderRight:  (i + 1) % 3 === 0 ? 'none' : `1px solid ${C.border}`,
                  borderBottom: i < 6 ? `1px solid ${C.border}` : 'none',
                  background:   '#FFFFFF',
                }}>
                  <EntityBadge type={key} size="md" />
                  <div className="plt-entity-name" style={{ fontFamily: FONT.display, fontSize: 12, fontWeight: 700, color: '#111827', letterSpacing: '-0.01em', textTransform: 'uppercase', margin: '10px 0 5px', transition: 'color 0.14s' }}>
                    {meta.plural}
                  </div>
                  <div style={{ fontFamily: FONT.sans, fontSize: 10, color: C.textSecondary, lineHeight: 1.7 }}>
                    {meta.description}
                  </div>
                  <div style={{ fontFamily: MONO, fontSize: 8, color: C.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 8 }}>
                    {meta.outDegree} outbound {meta.outDegree === 1 ? 'edge' : 'edges'}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Relationship Map ──────────────────────────────────────────────────── */}
      <div style={{ background: C.bgAlt, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ paddingTop: 'clamp(28px,3.5vw,44px)', paddingBottom: 'clamp(28px,3.5vw,44px)', paddingLeft: PH, paddingRight: PH, maxWidth: SECTION.maxW, margin: '0 auto' }}>
          <Eyebrow mb={20}>Relationship Map — {totalEdges} Edges</Eyebrow>

          <div style={{ border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden', background: '#FFFFFF' }}>
            {ENTITY_GRAPH.map((edge, i) => (
              <div key={i} className="plt-edge-row" style={{
                display:       'grid',
                gridTemplateColumns: '1fr 160px 1fr 2fr',
                gap:           12,
                alignItems:    'center',
                padding:       '10px 18px',
                borderBottom:  i < ENTITY_GRAPH.length - 1 ? `1px solid ${C.border}` : 'none',
                transition:    'background 0.12s',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <EntityBadge type={edge.from} />
                </div>
                <div style={{ fontFamily: MONO, fontSize: 8, fontWeight: 700, color: C.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: 'center' }}>
                  ──── {edge.label} ────
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <EntityBadge type={edge.to} />
                  <span style={{ fontFamily: MONO, fontSize: 7, color: C.textMuted, letterSpacing: '0.04em' }}>
                    ({edge.cardinality})
                  </span>
                </div>
                <div style={{ fontFamily: FONT.sans, fontSize: 10, color: C.textSecondary, lineHeight: 1.5, display: 'none' }} className="plt-edge-desc">
                  {edge.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Intelligence Layer: Players ────────────────────────────────────────── */}
      <div style={{ background: '#FFFFFF', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ paddingTop: 'clamp(28px,3.5vw,44px)', paddingBottom: 'clamp(28px,3.5vw,44px)', paddingLeft: PH, paddingRight: PH, maxWidth: SECTION.maxW, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20, gap: 12, flexWrap: 'wrap' }}>
            <Eyebrow mb={0}>Player Intelligence — {PLAYERS.length} Profiles</Eyebrow>
            <Link href="/reports/player" style={{ fontFamily: FONT.sans, fontSize: 10, fontWeight: 700, color: C.blue, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              All Reports <ArrowRight size={10} />
            </Link>
          </div>
          <div className="plt-card-grid">
            {PLAYERS.map(p => <PlayerCard key={p.id} player={p} />)}
          </div>
        </div>
      </div>

      {/* ── Intelligence Layer: Clubs ─────────────────────────────────────────── */}
      <div style={{ background: C.bgAlt, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ paddingTop: 'clamp(28px,3.5vw,44px)', paddingBottom: 'clamp(28px,3.5vw,44px)', paddingLeft: PH, paddingRight: PH, maxWidth: SECTION.maxW, margin: '0 auto' }}>
          <Eyebrow mb={20}>Club Intelligence — {CLUBS.length} Clubs</Eyebrow>
          <div className="plt-card-grid">
            {CLUBS.map(c => <ClubCard key={c.id} club={c} />)}
          </div>
        </div>
      </div>

      {/* ── Intelligence Layer: Active Mandates ───────────────────────────────── */}
      <div style={{ background: '#FFFFFF', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ paddingTop: 'clamp(28px,3.5vw,44px)', paddingBottom: 'clamp(28px,3.5vw,44px)', paddingLeft: PH, paddingRight: PH, maxWidth: SECTION.maxW, margin: '0 auto' }}>
          <Eyebrow mb={20}>Recruitment Mandates — {REQUESTS.length} Open</Eyebrow>
          <div className="plt-card-grid">
            {REQUESTS.map(r => <RequestCard key={r.id} request={r} />)}
          </div>
        </div>
      </div>

      {/* ── Intelligence Layer: Reports + Agents ──────────────────────────────── */}
      <div style={{ background: C.bgAlt, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ paddingTop: 'clamp(28px,3.5vw,44px)', paddingBottom: 'clamp(28px,3.5vw,44px)', paddingLeft: PH, paddingRight: PH, maxWidth: SECTION.maxW, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
            {/* Reports */}
            <div>
              <Eyebrow mb={16}>Scouting Reports — {DOMAIN_REPORTS.length} Published</Eyebrow>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {DOMAIN_REPORTS.map(r => <DomainReportCard key={r.id} report={r} />)}
              </div>
            </div>
            {/* Agents */}
            <div>
              <Eyebrow mb={16}>Agent Network — {AGENTS.length} Agents</Eyebrow>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {AGENTS.map(a => <AgentCard key={a.id} agent={a} />)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Network Contacts ──────────────────────────────────────────────────── */}
      <div style={{ background: '#FFFFFF', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ paddingTop: 'clamp(28px,3.5vw,44px)', paddingBottom: 'clamp(28px,3.5vw,44px)', paddingLeft: PH, paddingRight: PH, maxWidth: SECTION.maxW, margin: '0 auto' }}>
          <Eyebrow mb={20}>Network Contacts — {CONTACTS.length} Connections</Eyebrow>

          <div style={{ border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden', background: '#FFFFFF' }}>
            {CONTACTS.map((contact, i) => {
              const STRENGTH_COLORS: Record<string, string> = {
                strong: '#059669', medium: '#D97706', weak: '#6B7280', cold: '#374151',
              }
              const strengthColor = STRENGTH_COLORS[contact.relationshipStrength] ?? '#6B7280'
              return (
                <div key={contact.id} style={{
                  display: 'grid', gridTemplateColumns: '180px 160px 1fr auto',
                  gap: 12, alignItems: 'center', padding: '14px 20px',
                  borderBottom: i < CONTACTS.length - 1 ? `1px solid ${C.border}` : 'none',
                }}>
                  <div>
                    <div style={{ fontFamily: FONT.display, fontSize: 12, fontWeight: 700, color: '#111827', letterSpacing: '-0.01em', textTransform: 'uppercase' }}>
                      {contact.name}
                    </div>
                    <div style={{ fontFamily: MONO, fontSize: 8, color: C.textMuted, letterSpacing: '0.05em', textTransform: 'uppercase', marginTop: 2 }}>
                      {contact.role}
                    </div>
                  </div>
                  <div style={{ fontFamily: FONT.sans, fontSize: 11, color: C.textSecondary }}>
                    {contact.clubId ? `Club affiliate` : `Organization`}
                  </div>
                  <div style={{ fontFamily: FONT.sans, fontSize: 10, color: C.textSecondary, lineHeight: 1.6 }}>
                    {contact.notes?.substring(0, 80)}
                    {(contact.notes?.length ?? 0) > 80 ? '…' : ''}
                  </div>
                  <div style={{
                    fontFamily: MONO, fontSize: 8, fontWeight: 700, letterSpacing: '0.08em',
                    textTransform: 'uppercase', color: strengthColor,
                    background: `${strengthColor}12`, border: `1px solid ${strengthColor}30`,
                    borderRadius: 4, padding: '2px 7px', whiteSpace: 'nowrap',
                  }}>
                    {contact.relationshipStrength}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── CTA: Polaris OS ──────────────────────────────────────────────────── */}
      <section style={{ background: '#111827', paddingTop: 'clamp(40px,5vw,64px)', paddingBottom: 'clamp(40px,5vw,64px)', paddingLeft: PH, paddingRight: PH }}>
        <div style={{ maxWidth: SECTION.maxW, margin: '0 auto' }}>
          <div style={{ fontFamily: MONO, fontSize: 8, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14 }}>
            Coming Next — Polaris OS
          </div>
          <h2 style={{ fontFamily: FONT.display, fontSize: 'clamp(22px,3.5vw,42px)', fontWeight: 700, color: '#FFFFFF', margin: '0 0 16px', letterSpacing: '-0.04em', textTransform: 'uppercase', lineHeight: 0.92 }}>
            The Domain Model<br />
            <span style={{ color: C.blue }}>Powers Everything</span>
          </h2>
          <p style={{ fontFamily: FONT.sans, fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: '0 0 32px', maxWidth: 480, lineHeight: 1.85 }}>
            CRM · AI Assistant · Recruitment Matching · Player Recommendations · Club Recommendations · Opportunity Detection · Market Intelligence
          </p>
          <Link href="/contact" style={{ ...BTN.primary }}>
            Build with Polaris <ArrowRight size={12} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
