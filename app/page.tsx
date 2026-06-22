import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Navbar }       from '@/components/layout/Navbar'
import { Footer }       from '@/components/layout/Footer'
import { AppPreview }   from '@/components/ui/AppPreview'
import { Eyebrow }      from '@/components/ui/Eyebrow'
import { Badge }        from '@/components/ui/Badge'
import { StatusBadge }  from '@/components/ui/StatusBadge'
import type { Status }  from '@/components/ui/StatusBadge'
import { C, BTN, FONT, T, SECTION } from '@/lib/ds'
import { EditorialStyles, ArticleGrid } from '@/components/editorial'
import { latestArticles } from '@/lib/editorial-data'

// ─── Decorative SVGs ─────────────────────────────────────────────────────────

function PitchIllustration() {
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 320, margin: '0 auto' }}>
      {/* Main pitch SVG */}
      <svg
        viewBox="0 0 260 364"
        fill="none"
        aria-hidden="true"
        style={{ width: '100%', height: 'auto', filter: 'drop-shadow(0 12px 32px rgba(37,99,235,0.14))' }}
      >
        {/* Field background */}
        <rect width="260" height="364" rx="8" fill="#EFF4FF" />

        {/* Subtle alternating stripe bands */}
        <rect x="0"  y="0"   width="260" height="52" rx="0" fill="rgba(37,99,235,0.025)" />
        <rect x="0"  y="104" width="260" height="52" rx="0" fill="rgba(37,99,235,0.025)" />
        <rect x="0"  y="208" width="260" height="52" rx="0" fill="rgba(37,99,235,0.025)" />
        <rect x="0"  y="312" width="260" height="52" rx="0" fill="rgba(37,99,235,0.025)" />

        {/* Pitch outline */}
        <rect x="14" y="14" width="232" height="336" rx="2" stroke="#2563EB" strokeWidth="1.5" strokeOpacity="0.28" fill="none" />

        {/* Center line */}
        <line x1="14" y1="182" x2="246" y2="182" stroke="#2563EB" strokeWidth="1" strokeOpacity="0.2" />

        {/* Center circle */}
        <circle cx="130" cy="182" r="42" stroke="#2563EB" strokeWidth="1" strokeOpacity="0.2" fill="none" />
        <circle cx="130" cy="182" r="2.5" fill="#2563EB" fillOpacity="0.45" />

        {/* Top penalty box */}
        <rect x="68" y="14" width="124" height="66" stroke="#2563EB" strokeWidth="1" strokeOpacity="0.2" fill="none" />
        {/* Top 6-yard box */}
        <rect x="98" y="14" width="64" height="28" stroke="#2563EB" strokeWidth="1" strokeOpacity="0.15" fill="none" />
        {/* Top goal */}
        <rect x="102" y="6" width="56" height="10" rx="1" stroke="#2563EB" strokeWidth="1.5" strokeOpacity="0.35" fill="#2563EB" fillOpacity="0.07" />
        {/* Top penalty spot */}
        <circle cx="130" cy="62" r="2" fill="#2563EB" fillOpacity="0.3" />

        {/* Bottom penalty box */}
        <rect x="68" y="284" width="124" height="66" stroke="#2563EB" strokeWidth="1" strokeOpacity="0.2" fill="none" />
        {/* Bottom 6-yard box */}
        <rect x="98" y="322" width="64" height="28" stroke="#2563EB" strokeWidth="1" strokeOpacity="0.15" fill="none" />
        {/* Bottom goal */}
        <rect x="102" y="348" width="56" height="10" rx="1" stroke="#2563EB" strokeWidth="1.5" strokeOpacity="0.35" fill="#2563EB" fillOpacity="0.07" />
        {/* Bottom penalty spot */}
        <circle cx="130" cy="302" r="2" fill="#2563EB" fillOpacity="0.3" />

        {/* Corner arcs */}
        <path d="M14 24 A 10 10 0 0 0 24 14"  stroke="#2563EB" strokeWidth="1" strokeOpacity="0.18" fill="none" />
        <path d="M246 24 A 10 10 0 0 1 236 14" stroke="#2563EB" strokeWidth="1" strokeOpacity="0.18" fill="none" />
        <path d="M14 350 A 10 10 0 0 1 24 360" stroke="#2563EB" strokeWidth="1" strokeOpacity="0.18" fill="none" />
        <path d="M246 350 A 10 10 0 0 0 236 360" stroke="#2563EB" strokeWidth="1" strokeOpacity="0.18" fill="none" />

        {/* Tactical lines (formation connections) */}
        {/* GK → DEF */}
        <line x1="130" y1="328" x2="54"  y2="272" stroke="#2563EB" strokeWidth="0.7" strokeOpacity="0.1" strokeDasharray="3 5" />
        <line x1="130" y1="328" x2="100" y2="282" stroke="#2563EB" strokeWidth="0.7" strokeOpacity="0.1" strokeDasharray="3 5" />
        <line x1="130" y1="328" x2="160" y2="282" stroke="#2563EB" strokeWidth="0.7" strokeOpacity="0.1" strokeDasharray="3 5" />
        <line x1="130" y1="328" x2="206" y2="272" stroke="#2563EB" strokeWidth="0.7" strokeOpacity="0.1" strokeDasharray="3 5" />
        {/* DEF → MID */}
        <line x1="54"  y1="272" x2="68"  y2="210" stroke="#2563EB" strokeWidth="0.7" strokeOpacity="0.1" strokeDasharray="3 5" />
        <line x1="130" y1="280" x2="130" y2="220" stroke="#2563EB" strokeWidth="0.7" strokeOpacity="0.1" strokeDasharray="3 5" />
        <line x1="206" y1="272" x2="192" y2="210" stroke="#2563EB" strokeWidth="0.7" strokeOpacity="0.1" strokeDasharray="3 5" />
        {/* MID → FWD */}
        <line x1="68"  y1="210" x2="54"  y2="142" stroke="#2563EB" strokeWidth="0.7" strokeOpacity="0.1" strokeDasharray="3 5" />
        <line x1="130" y1="220" x2="130" y2="120" stroke="#2563EB" strokeWidth="0.7" strokeOpacity="0.1" strokeDasharray="3 5" />
        <line x1="192" y1="210" x2="206" y2="142" stroke="#2563EB" strokeWidth="0.7" strokeOpacity="0.1" strokeDasharray="3 5" />

        {/* GK */}
        <circle cx="130" cy="328" r="5" fill="#2563EB" fillOpacity="0.55" />

        {/* Defenders */}
        <circle cx="54"  cy="272" r="4.5" fill="#2563EB" fillOpacity="0.5" />
        <circle cx="100" cy="282" r="4.5" fill="#2563EB" fillOpacity="0.5" />
        <circle cx="160" cy="282" r="4.5" fill="#2563EB" fillOpacity="0.5" />
        <circle cx="206" cy="272" r="4.5" fill="#2563EB" fillOpacity="0.5" />

        {/* Midfielders */}
        <circle cx="68"  cy="210" r="4.5" fill="#2563EB" fillOpacity="0.65" />
        {/* Highlighted CM (scouting target) */}
        <circle cx="130" cy="220" r="11"  stroke="#2563EB" strokeWidth="1.5" strokeOpacity="0.35" fill="#2563EB" fillOpacity="0.08" />
        <circle cx="130" cy="220" r="5.5" fill="#2563EB" />
        <circle cx="192" cy="210" r="4.5" fill="#2563EB" fillOpacity="0.65" />

        {/* Forwards */}
        <circle cx="54"  cy="142" r="4.5" fill="#2563EB" fillOpacity="0.5" />
        {/* Highlighted ST (main target) */}
        <circle cx="130" cy="120" r="12"  stroke="#2563EB" strokeWidth="1.5" strokeOpacity="0.3" fill="#2563EB" fillOpacity="0.08" />
        <circle cx="130" cy="120" r="6"   fill="#2563EB" />
        <circle cx="206" cy="142" r="4.5" fill="#2563EB" fillOpacity="0.5" />
      </svg>

      {/* Floating: match score card */}
      <div style={{
        position: 'absolute', top: '24%', right: '-14px',
        background: '#FFFFFF', border: '1px solid rgba(37,99,235,0.15)',
        borderRadius: 9, padding: '9px 12px', boxShadow: '0 6px 20px rgba(37,99,235,0.12)',
        minWidth: 108,
      }}>
        <div style={{ fontFamily: FONT.mono, fontSize: 7, color: '#6B7280', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
          Match Score
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, marginBottom: 5 }}>
          <span style={{ fontFamily: FONT.display, fontSize: 22, fontWeight: 700, color: '#2563EB', letterSpacing: '-0.04em', lineHeight: 1 }}>92</span>
          <span style={{ fontFamily: FONT.mono, fontSize: 9, color: '#9CA3AF' }}>/100</span>
        </div>
        <div style={{ height: 3, background: '#E5E7EB', borderRadius: 2, overflow: 'hidden', marginBottom: 4 }}>
          <div style={{ width: '92%', height: '100%', background: '#2563EB', borderRadius: 2 }} />
        </div>
        <div style={{ fontFamily: FONT.sans, fontSize: 8, color: '#059669', fontWeight: 700 }}>Strong Match</div>
      </div>

      {/* Floating: player tag */}
      <div style={{
        position: 'absolute', top: '29%', left: '-12px',
        background: '#FFFFFF', border: '1px solid rgba(37,99,235,0.18)',
        borderRadius: 8, padding: '7px 11px', boxShadow: '0 4px 14px rgba(37,99,235,0.1)',
      }}>
        <div style={{ fontFamily: FONT.mono, fontSize: 7, color: '#6B7280', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
          CM · Age 24
        </div>
        <div style={{ fontFamily: FONT.sans, fontSize: 11, fontWeight: 700, color: '#111827', marginTop: 2 }}>
          S. Benjdida
        </div>
        <div style={{ fontFamily: FONT.mono, fontSize: 7, color: '#2563EB', marginTop: 2, letterSpacing: '0.03em' }}>
          EU Passport · Free Agent
        </div>
      </div>
    </div>
  )
}

function NetworkSVG() {
  const nodes = [
    { x: 290, y: 140, r: 4.5 }, { x: 140, y: 70,  r: 3   }, { x: 430, y: 80,  r: 3   },
    { x: 90,  y: 190, r: 2.5 }, { x: 470, y: 200, r: 2.5 }, { x: 180, y: 270, r: 2.5 },
    { x: 390, y: 280, r: 2   }, { x: 290, y: 330, r: 2   }, { x: 60,  y: 310, r: 1.8 },
    { x: 510, y: 150, r: 1.8 }, { x: 350, y: 40,  r: 1.5 }, { x: 200, y: 160, r: 1.5 },
  ]
  const edges = [[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,11],[1,2],[1,3],[2,4],[2,9],[3,8],[4,6],[5,7],[6,7],[9,10],[1,11],[11,5]]
  return (
    <svg viewBox="0 0 580 380" fill="none" aria-hidden={true}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06, pointerEvents: 'none' }}>
      {edges.map(([a, b], i) => (
        <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y} stroke={C.blue} strokeWidth="0.8" />
      ))}
      {nodes.map((n, i) => <circle key={i} cx={n.x} cy={n.y} r={n.r} fill={C.blue} />)}
    </svg>
  )
}

// ─── Content Data ─────────────────────────────────────────────────────────────

const STATS = [
  { value: '48+',  label: 'Reports',       sub: 'Published'    },
  { value: '12',   label: 'Countries',      sub: 'Covered'      },
  { value: '200+', label: 'Network',        sub: 'Professionals'},
  { value: '150+', label: 'Player Files',   sub: 'On record'    },
  { value: '100%', label: 'Independent',    sub: 'No club ties' },
]

const INTEL_CATEGORIES: { name: string; desc: string; status: Status }[] = [
  { name: 'Player Reports',      status: 'research',     desc: 'Individual performance, contract status, market value, and development trajectory.' },
  { name: 'Recruitment Reports', status: 'development',  desc: 'End-to-end analysis combining scouting data, network intelligence, and market context.' },
  { name: 'Club Intelligence',   status: 'beta',         desc: 'Squad composition, coaching philosophy, ownership structure, and strategic direction.' },
  { name: 'Transfer Market',     status: 'available',    desc: 'Market movements, deal valuations, contract windows, and transfer analysis.' },
  { name: 'Emerging Talents',    status: 'available',    desc: 'High-potential players in secondary markets — identified before they price out of reach.' },
  { name: 'Free Agents',         status: 'development',  desc: 'Available players by position, league, and contract expiry. Updated each window.' },
  { name: 'League Analysis',     status: 'research',     desc: 'Structural and tactical breakdown of leagues, conferences, and divisions.' },
  { name: 'Football Business',   status: 'available',    desc: 'Ownership structures, financial analysis, governance, and football as an industry.' },
  { name: 'Tactical Analysis',   status: 'research',     desc: 'Playing systems, pressing structures, set pieces, and positional profiles.' },
]

const CONSULTING: { num: string; title: string; status: Status; desc: string; services: string[] }[] = [
  {
    num:     '01',
    title:   'For Clubs',
    status:  'live',
    desc:    'Recruitment consulting for clubs at every level of the professional game — from emerging leagues to elite divisions.',
    services: [
      'Recruitment Strategy & Planning',
      'Scouting Report Development',
      'Squad Composition Analysis',
      'Transfer Market Intelligence',
      'Player Identification & Shortlisting',
      'Technical & Positional Reports',
    ],
  },
  {
    num:     '02',
    title:   'For Agents',
    status:  'live',
    desc:    'Market intelligence and international network access for licensed agents operating across multiple markets.',
    services: [
      'Player Market Positioning',
      'Player Profile Documentation',
      'Mandate Research & Support',
      'International Network Access',
      'Regulatory & Contract Advisory',
      'Career Transition Consulting',
    ],
  },
  {
    num:     '03',
    title:   'For Players',
    status:  'available',
    desc:    'Professional career consulting for players seeking honest intelligence — without the conflicts of representation.',
    services: [
      'Career Path Assessment',
      'Market Position Report',
      'International Exposure Planning',
      'Contract Context Briefing',
      'Transfer Window Guidance',
      'Professional Development Advice',
    ],
  },
]

const OS_MODULES: { name: string; status: Status; desc: string }[] = [
  { name: 'CRM',               status: 'development', desc: 'Contacts, clubs, agents, and relationships across your network.'         },
  { name: 'Player Database',   status: 'development', desc: 'Searchable player records with performance, contract, and scouting data.' },
  { name: 'Club Database',     status: 'research',    desc: 'Institutional intelligence on clubs, ownership, and recruitment targets.' },
  { name: 'AI Assistant',      status: 'beta',        desc: 'Query your data in natural language. Generate intelligence reports.'      },
  { name: 'Pipeline',          status: 'development', desc: 'Track mandates, shortlists, negotiations, and placements end-to-end.'    },
  { name: 'Reports',           status: 'beta',        desc: 'Generate, customize, and share professional scouting reports.'           },
  { name: 'Tasks',             status: 'development', desc: 'Assign and track work across your scouting and recruitment team.'        },
  { name: 'Calendar',          status: 'research',    desc: 'Games, meetings, deadlines, and transfer window timelines in one view.'  },
  { name: 'Documents',         status: 'research',    desc: 'Contracts, scouting reports, and client files in a secure workspace.'   },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const PH   = SECTION.padH
  const MONO = FONT.mono

  return (
    <div style={{ fontFamily: FONT.sans, background: C.bgLight, minHeight: '100vh' }}>
      <style>{`
        /* ─── Typography ─── */
        .hp-hed {
          font-family: var(--font-space-grotesk), system-ui, sans-serif;
          font-size: clamp(36px, 5.5vw, 78px);
          font-weight: 700; line-height: 0.9;
          letter-spacing: -0.045em; text-transform: uppercase;
          color: #111827; margin: 0 0 18px;
        }

        /* ─── Hero grid ─── */
        .hp-hero-grid { display: grid; grid-template-columns: 54fr 46fr; gap: clamp(32px,5vw,64px); align-items: center; }
        .hp-hero-illustration { display: flex; align-items: center; justify-content: center; padding: 20px 10px 20px 0; }

        /* ─── Hero pulse ─── */
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.7); }
        }
        .hp-pulse { animation: pulse-dot 2.4s ease-in-out infinite; }

        /* ─── Three-pillar overview ─── */
        .hp-overview { display: grid; grid-template-columns: repeat(3, 1fr); }

        /* ─── Intelligence categories ─── */
        .hp-cat-grid { display: grid; grid-template-columns: repeat(3, 1fr); }
        .hp-cat-card {
          padding: clamp(16px,2.2vw,26px) ${PH};
          border-top: 1px solid ${C.border};
          border-left: 3px solid transparent;
          transition: background 0.15s ease, border-left-color 0.18s ease;
          cursor: default;
        }
        .hp-cat-card:hover { background: #FFFFFF; border-left-color: ${C.blue}; }
        .hp-cat-card:hover .hp-cat-name { color: ${C.blue}; }

        /* ─── Consulting grid ─── */
        .hp-consult-grid { display: grid; grid-template-columns: repeat(3, 1fr); }

        /* ─── OS module grid ─── */
        .hp-mod-grid { display: grid; grid-template-columns: repeat(3, 1fr); }
        .hp-mod-card {
          padding: clamp(16px,2.2vw,26px) clamp(16px,2.5vw,32px);
          border-top: 1px solid ${C.border};
          transition: background 0.15s ease, box-shadow 0.15s ease;
        }
        .hp-mod-card:hover { background: #FFFFFF; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
        .hp-mod-card:hover .hp-mod-name { color: ${C.blue}; }

        /* ─── Stats ─── */
        .hp-stats { display: grid; grid-template-columns: repeat(5, 1fr); }
        .hp-stat  { transition: background 0.15s; }
        .hp-stat:hover { background: #FFFFFF; }
        .hp-stat:hover .hp-stat-val { color: ${C.blue} !important; }

        /* ─── Solutions ─── */
        .hp-sol-row { display: grid; grid-template-columns: 48px 1fr 1fr; gap: 20px; align-items: start; padding: clamp(14px,2vw,24px) ${PH}; border-top: 1px solid ${C.border}; transition: background 0.15s; }
        .hp-sol-row:hover { background: #FFFFFF; }

        /* ─── Pillar / Platform ─── */
        .hp-platform { display: grid; grid-template-columns: 56fr 44fr; align-items: center; }
        .hp-network  { display: grid; grid-template-columns: 42fr 58fr; }

        /* ─── Buttons ─── */
        .hp-btn-p:hover  { background: ${C.blueHover} !important; }
        .hp-btn-o:hover  { background: #F3F4F6 !important; }
        .hp-gcta:hover   { opacity: 0.6; }
        .hp-pcta:hover   { color: #111827 !important; }
        .hp-sublink:hover { color: ${C.blue} !important; }
        .hp-cta-w:hover  { background: rgba(255,255,255,0.9) !important; }
        .hp-cta-g:hover  { background: rgba(255,255,255,0.08) !important; }

        /* ─── Responsive ─── */
        @media (max-width: 1024px) {
          .hp-stats { grid-template-columns: repeat(3,1fr) !important; }
          .hp-hero-grid { grid-template-columns: 58fr 42fr !important; }
        }
        @media (max-width: 900px) {
          .hp-hero-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
          .hp-hero-illustration { padding: 0 !important; max-width: 260px !important; }
          .hp-overview { grid-template-columns: 1fr !important; }
          .hp-cat-grid { grid-template-columns: repeat(2,1fr) !important; }
          .hp-consult-grid { grid-template-columns: 1fr !important; }
          .hp-mod-grid { grid-template-columns: repeat(2,1fr) !important; }
          .hp-platform { display: flex !important; flex-direction: column-reverse !important; }
          .hp-network  { display: flex !important; flex-direction: column !important; }
          .hp-intel-cards { grid-template-columns: 1fr !important; }
          .hp-stats { grid-template-columns: repeat(2,1fr) !important; }
          .hp-sol-row { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .hp-hed { font-size: clamp(32px,9vw,44px) !important; }
          .hp-hero-illustration { max-width: 220px !important; }
          .hp-stats { grid-template-columns: repeat(2,1fr) !important; }
          .hp-cat-grid { grid-template-columns: 1fr !important; }
          .hp-mod-grid { grid-template-columns: 1fr !important; }
          .hp-consult-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 420px) {
          .hp-hero-illustration { display: none !important; }
          .hp-stats { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
      <EditorialStyles />

      <Navbar />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ HERO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section style={{
        position: 'relative', overflow: 'hidden',
        background: C.bgLight, borderBottom: `1px solid ${C.border}`,
        backgroundImage: 'radial-gradient(circle, rgba(37,99,235,0.035) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }}>
        <div style={{ position: 'relative', zIndex: 1, paddingTop: 'clamp(48px,6vw,84px)', paddingBottom: 'clamp(40px,5vw,64px)', paddingLeft: PH, paddingRight: PH, maxWidth: SECTION.maxW, margin: '0 auto', width: '100%' }}>

          <div className="hp-hero-grid">

            {/* ── Left: text content ── */}
            <div>
              {/* Live badge */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 24, background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.18)', borderRadius: 24, padding: '5px 14px 5px 10px' }}>
                <span className="hp-pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: C.blue, display: 'inline-block', flexShrink: 0 }} />
                <span style={{ fontFamily: MONO, fontSize: 9, color: C.blue, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}>
                  Football Intelligence Platform · Est. 2024
                </span>
              </div>

              <h1 className="hp-hed">
                Football<br />
                <span style={{ color: C.blue }}>Intelligence</span><br />
                For the<br />
                Modern Game.
              </h1>

              <p style={{ fontFamily: FONT.sans, fontSize: 14, color: C.textSecondary, maxWidth: 380, margin: '0 0 28px', lineHeight: 1.85 }}>
                Scouting intelligence, recruitment consulting, and proprietary tools for clubs, agents, and football professionals who take decisions seriously.
              </p>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
                <Link href="/solutions" className="hp-btn-p" style={{ ...BTN.primary }}>
                  Explore Solutions <ArrowRight size={13} />
                </Link>
                <Link href="/intelligence" className="hp-btn-o" style={{ ...BTN.outline }}>
                  Read Intelligence <ArrowRight size={13} />
                </Link>
              </div>

              {/* Trust strip */}
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', rowGap: 6, columnGap: 0 }}>
                {['200+ Network Members', '12 Countries', '48+ Reports', 'Fully Independent'].map((t, i, arr) => (
                  <span key={t} style={{ display: 'inline-flex', alignItems: 'center' }}>
                    <span style={{ fontFamily: MONO, fontSize: 9, color: C.textMuted, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{t}</span>
                    {i < arr.length - 1 && <span style={{ color: C.border, margin: '0 9px', userSelect: 'none' }}>·</span>}
                  </span>
                ))}
              </div>
            </div>

            {/* ── Right: pitch illustration ── */}
            <div className="hp-hero-illustration">
              <PitchIllustration />
            </div>

          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ OVERVIEW ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="hp-overview" style={{ background: '#FFFFFF', borderBottom: `1px solid ${C.border}` }}>
        {[
          { label: 'Intelligence', meta: '§01', href: '#intelligence', desc: 'Scouting, transfer, tactical, and football business research and editorial.' },
          { label: 'Consulting',   meta: '§02', href: '#consulting',   desc: 'Professional services for clubs, agents, and players across global markets.' },
          { label: 'Platform',     meta: '§03', href: '#platform',     desc: 'Polaris OS — CRM, databases, AI analysis, and pipeline management tools.' },
        ].map((col, i) => (
          <Link key={col.label} href={col.href} style={{ textDecoration: 'none', display: 'block', padding: 'clamp(22px,2.8vw,36px) clamp(20px,2.5vw,36px)', borderRight: i < 2 ? `1px solid ${C.border}` : 'none', borderBottom: 'none', transition: 'background 0.15s', background: '#FFFFFF' }}
            className="hp-stat">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <Eyebrow mb={0}>{col.label}</Eyebrow>
              <span style={{ fontFamily: MONO, fontSize: 9, color: C.border, letterSpacing: '0.06em' }}>{col.meta}</span>
            </div>
            <p style={{ fontFamily: FONT.sans, fontSize: 12, color: C.textSecondary, margin: 0, lineHeight: 1.75 }}>{col.desc}</p>
          </Link>
        ))}
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ STATS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="hp-stats" style={{ background: C.bgAlt, borderBottom: `1px solid ${C.border}` }}>
        {STATS.map((s, i) => (
          <div key={s.label} className="hp-stat" style={{ paddingTop: 'clamp(16px,2vw,24px)', paddingBottom: 'clamp(16px,2vw,24px)', paddingLeft: 'clamp(12px,1.5vw,20px)', paddingRight: 'clamp(12px,1.5vw,20px)', borderRight: i < STATS.length - 1 ? `1px solid ${C.border}` : 'none', textAlign: 'center' }}>
            <div className="hp-stat-val" style={{ fontFamily: FONT.display, fontSize: 'clamp(18px,2.2vw,28px)', fontWeight: 700, color: '#111827', lineHeight: 1, letterSpacing: '-0.03em', marginBottom: 3, transition: 'color 0.15s' }}>
              {s.value}
            </div>
            <div style={{ fontFamily: FONT.sans, fontSize: 8, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.blue, marginBottom: 1 }}>{s.label}</div>
            <div style={{ fontFamily: MONO, fontSize: 8, color: C.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{s.sub}</div>
          </div>
        ))}
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━ INTELLIGENCE HUB ━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="intelligence" style={{ background: '#FFFFFF', borderBottom: `1px solid ${C.border}` }}>

        {/* Section header */}
        <div style={{ paddingTop: 'clamp(28px,3.5vw,44px)', paddingBottom: 'clamp(18px,2.2vw,26px)', paddingLeft: PH, paddingRight: PH, borderBottom: `1px solid ${C.border}` }}>
          <Eyebrow meta="§01 · Nine coverage areas"
            right={
              <Link href="/intelligence" style={{ fontFamily: FONT.sans, fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.textMuted, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}>
                Intelligence hub <ArrowRight size={9} />
              </Link>
            }
          >
            Intelligence
          </Eyebrow>
          <p style={{ fontFamily: FONT.sans, fontSize: 13, color: C.textSecondary, margin: 0, maxWidth: 540, lineHeight: 1.75 }}>
            Football intelligence covering recruitment, transfers, players, clubs, and the business of the game — built for professionals who need more than headlines.
          </p>
        </div>

        {/* 9-category grid */}
        <div className="hp-cat-grid">
          {INTEL_CATEGORIES.map((cat, i) => (
            <Link key={cat.name} href="/intelligence" className="hp-cat-card" style={{ textDecoration: 'none', borderRight: (i + 1) % 3 !== 0 ? `1px solid ${C.border}` : 'none', display: 'block' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, flexWrap: 'wrap', gap: 6 }}>
                <h3 className="hp-cat-name" style={{ fontFamily: FONT.display, fontSize: 13, fontWeight: 700, color: '#111827', margin: 0, letterSpacing: '-0.01em', textTransform: 'uppercase', transition: 'color 0.15s' }}>
                  {cat.name}
                </h3>
                <StatusBadge status={cat.status} />
              </div>
              <p style={{ fontFamily: FONT.sans, fontSize: 11, color: C.textSecondary, margin: 0, lineHeight: 1.7 }}>
                {cat.desc}
              </p>
            </Link>
          ))}
        </div>

        {/* Latest articles — editorial card grid */}
        <div style={{ borderTop: `1px solid ${C.border}` }}>
          <div style={{ paddingTop: 'clamp(14px,1.8vw,20px)', paddingBottom: 'clamp(10px,1.2vw,14px)', paddingLeft: PH, paddingRight: PH, borderBottom: `1px solid ${C.border}` }}>
            <span style={{ fontFamily: MONO, fontSize: 9, color: C.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Latest from Intelligence
            </span>
          </div>
          <div style={{ padding: `clamp(18px,2.2vw,26px) ${PH}` }}>
            <ArticleGrid articles={latestArticles.slice(0, 3)} columns={3} variant="compact" gap={14} />
          </div>
        </div>

        <div style={{ paddingTop: 'clamp(12px,1.5vw,18px)', paddingBottom: 'clamp(12px,1.5vw,18px)', paddingLeft: PH, paddingRight: PH }}>
          <Link href="/intelligence" className="hp-gcta" style={{ ...BTN.ghost }}>
            Explore full Intelligence hub <ArrowRight size={11} />
          </Link>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━ CONSULTING ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="consulting" style={{ background: C.bgAlt, borderBottom: `1px solid ${C.border}` }}>

        <div style={{ paddingTop: 'clamp(28px,3.5vw,44px)', paddingBottom: 'clamp(18px,2.2vw,26px)', paddingLeft: PH, paddingRight: PH, borderBottom: `1px solid ${C.border}` }}>
          <Eyebrow meta="§02 · Three service areas"
            right={
              <Link href="/solutions" style={{ fontFamily: FONT.sans, fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.textMuted, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}>
                All services <ArrowRight size={9} />
              </Link>
            }
          >
            Consulting
          </Eyebrow>
          <p style={{ fontFamily: FONT.sans, fontSize: 13, color: C.textSecondary, margin: 0, maxWidth: 480, lineHeight: 1.75 }}>
            Professional services for clubs, agents, and football professionals across recruitment, mandates, and career management.
          </p>
        </div>

        <div className="hp-consult-grid" style={{ background: C.bgAlt }}>
          {CONSULTING.map((c, i) => (
            <div key={c.title} style={{ padding: 'clamp(24px,3vw,40px) clamp(20px,2.5vw,36px)', borderRight: i < CONSULTING.length - 1 ? `1px solid ${C.border}` : 'none', background: C.bgAlt }}>

              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                  <span style={{ fontFamily: FONT.display, fontSize: 14, fontWeight: 700, color: C.blue, opacity: 0.3, letterSpacing: '-0.02em' }}>{c.num}</span>
                  <h2 style={{ fontFamily: FONT.display, fontSize: 'clamp(14px,1.6vw,17px)', fontWeight: 700, color: '#111827', margin: 0, letterSpacing: '-0.02em', textTransform: 'uppercase' }}>{c.title}</h2>
                </div>
                <StatusBadge status={c.status} />
              </div>

              <p style={{ fontFamily: FONT.sans, fontSize: 12, color: C.textSecondary, margin: '0 0 20px', lineHeight: 1.8 }}>
                {c.desc}
              </p>

              <div style={{ marginBottom: 20 }}>
                {c.services.map(sv => (
                  <div key={sv} style={{ display: 'flex', alignItems: 'baseline', gap: 9, marginBottom: 7 }}>
                    <div style={{ width: 2, height: 10, background: C.blue, flexShrink: 0, opacity: 0.4, marginTop: 2 }} />
                    <span style={{ fontFamily: MONO, fontSize: 9, color: C.textSecondary, letterSpacing: '0.02em', lineHeight: 1.5 }}>{sv}</span>
                  </div>
                ))}
              </div>

              <Link href="/contact" className="hp-gcta" style={{ ...BTN.ghost, fontSize: 9 }}>
                Enquire <ArrowRight size={9} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━ POLARIS OS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="platform" style={{ background: '#FFFFFF', borderBottom: `1px solid ${C.border}` }}>

        <div style={{ paddingTop: 'clamp(28px,3.5vw,44px)', paddingBottom: 'clamp(18px,2.2vw,26px)', paddingLeft: PH, paddingRight: PH, borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
            <Eyebrow meta="§03 · Nine modules" mb={0}>Polaris OS</Eyebrow>
            <StatusBadge status="beta" />
          </div>
          <p style={{ fontFamily: FONT.sans, fontSize: 13, color: C.textSecondary, margin: 0, maxWidth: 520, lineHeight: 1.75 }}>
            A football operating system built for intelligence professionals — CRM, databases, AI analysis, and pipeline management in one integrated platform.
          </p>
        </div>

        {/* Product preview — large floating card */}
        <div style={{ paddingTop: 'clamp(24px,3vw,40px)', paddingBottom: 'clamp(24px,3vw,40px)', paddingLeft: PH, paddingRight: PH, borderBottom: `1px solid ${C.border}` }}>
          <div style={{ borderRadius: 14, overflow: 'hidden', boxShadow: '0 20px 52px rgba(0,0,0,0.12), 0 5px 14px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.06)', maxWidth: 960, margin: '0 auto' }}>
            <AppPreview />
          </div>
        </div>

        {/* 9-module grid */}
        <div className="hp-mod-grid">
          {OS_MODULES.map((m, i) => (
            <div key={m.name} className="hp-mod-card" style={{ borderRight: (i + 1) % 3 !== 0 ? `1px solid ${C.border}` : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7, flexWrap: 'wrap', gap: 6 }}>
                <h3 className="hp-mod-name" style={{ fontFamily: FONT.display, fontSize: 12, fontWeight: 700, color: '#111827', margin: 0, letterSpacing: '-0.01em', textTransform: 'uppercase', transition: 'color 0.15s' }}>
                  {m.name}
                </h3>
                <StatusBadge status={m.status} />
              </div>
              <p style={{ fontFamily: FONT.sans, fontSize: 11, color: C.textSecondary, margin: 0, lineHeight: 1.65 }}>
                {m.desc}
              </p>
            </div>
          ))}
        </div>

        <div style={{ paddingTop: 'clamp(16px,2vw,22px)', paddingBottom: 'clamp(16px,2vw,22px)', paddingLeft: PH, paddingRight: PH, borderTop: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontFamily: MONO, fontSize: 9, color: C.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Private Beta · Request access to join the early programme
          </span>
          <Link href="/contact" className="hp-btn-p" style={{ ...BTN.primary }}>
            Request Early Access <ArrowRight size={12} />
          </Link>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ NETWORK ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="hp-network" style={{ background: C.bgAlt, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ paddingTop: 'clamp(36px,4.5vw,56px)', paddingBottom: 'clamp(36px,4.5vw,56px)', paddingLeft: PH, paddingRight: PH, borderRight: `1px solid ${C.border}` }}>
          <Eyebrow mb={20}>Network</Eyebrow>
          <h2 style={{ fontFamily: FONT.display, fontSize: 'clamp(20px,3vw,38px)', fontWeight: 700, color: '#111827', margin: 0, letterSpacing: '-0.04em', textTransform: 'uppercase', lineHeight: 0.92 }}>
            Inside the<br />Absolut<br />Football<br />Network.
          </h2>
        </div>
        <div style={{ paddingTop: 'clamp(36px,4.5vw,56px)', paddingBottom: 'clamp(36px,4.5vw,56px)', paddingLeft: PH, paddingRight: PH, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
          <NetworkSVG />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontFamily: FONT.sans, fontSize: 13, color: C.textSecondary, margin: '0 0 12px', lineHeight: 1.85 }}>
              Polaris operates within a global network of scouts, analysts, agents, and football professionals spanning Europe, South America, and Africa.
            </p>
            <p style={{ fontFamily: FONT.sans, fontSize: 13, color: C.textSecondary, margin: '0 0 24px', lineHeight: 1.85 }}>
              We don&apos;t promise transfers. We provide the intelligence and professional connections that make better decisions possible.
            </p>
            <Link href="/network" className="hp-gcta" style={{ ...BTN.ghost }}>
              About the Network <ArrowRight size={11} />
            </Link>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ CTA ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section style={{ background: C.blue, paddingTop: 'clamp(48px,6vw,76px)', paddingBottom: 'clamp(48px,6vw,76px)', paddingLeft: PH, paddingRight: PH }}>
        <div style={{ maxWidth: SECTION.maxW, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
            <div style={{ width: 18, height: 1.5, background: 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
            <span style={{ fontFamily: FONT.sans, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>Work With Polaris</span>
          </div>
          <h2 style={{ fontFamily: FONT.display, fontSize: 'clamp(28px,4vw,56px)', fontWeight: 700, color: '#fff', margin: '0 0 14px', letterSpacing: '-0.04em', textTransform: 'uppercase', lineHeight: 0.92 }}>
            Ready to make<br />better football<br />decisions?
          </h2>
          <p style={{ fontFamily: FONT.sans, fontSize: 13, color: 'rgba(255,255,255,0.65)', margin: '0 0 26px', maxWidth: 320, lineHeight: 1.85 }}>
            Contact the Polaris team. We work with clubs, agents, and professionals who take intelligence seriously.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link href="/contact" className="hp-cta-w" style={{ ...BTN.primary, background: '#fff', color: C.blue }}>
              Get in Touch <ArrowRight size={12} />
            </Link>
            <Link href="/solutions" className="hp-cta-g" style={{ ...BTN.primary, background: 'transparent', color: 'rgba(255,255,255,0.85)', border: '1.5px solid rgba(255,255,255,0.28)' }}>
              Explore Solutions <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
