import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Navbar }     from '@/components/layout/Navbar'
import { Footer }     from '@/components/layout/Footer'
import { AppPreview } from '@/components/ui/AppPreview'
import { C, BTN, FONT, T, SECTION } from '@/lib/ds'

// ─── Decorative SVGs (pure geometry, no photography) ─────────────────────────

function RadarSVG() {
  const rings = [178, 138, 98, 60, 24]
  const ticks = Array.from({ length: 36 }, (_, i) => i)
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      aria-hidden={true}
      style={{
        position: 'absolute', right: '-1%', top: '50%',
        transform: 'translateY(-50%)',
        width: 'clamp(200px, 30vw, 440px)', height: 'auto',
        opacity: 0.055, pointerEvents: 'none',
      }}
    >
      {rings.map(r => (
        <circle key={r} cx="200" cy="200" r={r} stroke="#2563EB" strokeWidth={r === 178 ? 0.8 : 0.5} />
      ))}
      <line x1="200" y1="20"  x2="200" y2="380" stroke="#2563EB" strokeWidth="0.7" />
      <line x1="20"  y1="200" x2="380" y2="200" stroke="#2563EB" strokeWidth="0.7" />
      <line x1="73"  y1="73"  x2="327" y2="327" stroke="#2563EB" strokeWidth="0.4" strokeDasharray="3 5" />
      <line x1="327" y1="73"  x2="73"  y2="327" stroke="#2563EB" strokeWidth="0.4" strokeDasharray="3 5" />
      {ticks.map(i => {
        const a = (i * 10 * Math.PI) / 180
        return (
          <line
            key={i}
            x1={200 + 176 * Math.cos(a)} y1={200 + 176 * Math.sin(a)}
            x2={200 + 185 * Math.cos(a)} y2={200 + 185 * Math.sin(a)}
            stroke="#2563EB" strokeWidth="0.8"
          />
        )
      })}
      <circle cx="200" cy="200" r="3.5" fill="#2563EB" />
    </svg>
  )
}

function NetworkSVG() {
  const nodes = [
    { x: 290, y: 140, r: 4.5 },
    { x: 140, y: 70,  r: 3   },
    { x: 430, y: 80,  r: 3   },
    { x: 90,  y: 190, r: 2.5 },
    { x: 470, y: 200, r: 2.5 },
    { x: 180, y: 270, r: 2.5 },
    { x: 390, y: 280, r: 2   },
    { x: 290, y: 330, r: 2   },
    { x: 60,  y: 310, r: 1.8 },
    { x: 510, y: 150, r: 1.8 },
    { x: 350, y: 40,  r: 1.5 },
    { x: 200, y: 160, r: 1.5 },
  ]
  const edges = [
    [0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,11],
    [1,2],[1,3],[2,4],[2,9],[3,8],[4,6],[5,7],[6,7],[9,10],[1,11],[11,5],
  ]
  return (
    <svg viewBox="0 0 580 380" fill="none" aria-hidden={true} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.075, pointerEvents: 'none' }}>
      {edges.map(([a, b], i) => (
        <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y} stroke="#2563EB" strokeWidth="0.8" />
      ))}
      {nodes.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r={n.r} fill="#2563EB" />
      ))}
    </svg>
  )
}

// ─── Data ────────────────────────────────────────────────────────────────────

const PILLARS = [
  {
    tag:   'Intelligence',
    title: 'Polaris Intelligence',
    body:  'Scouting reports, player analysis, recruitment insights, and football business coverage that informs better decisions.',
    href:  '/intelligence',
    cta:   'Read Intelligence',
    badge: null as string | null,
    links: [
      { label: 'Scouting Reports',  href: '/intelligence' },
      { label: 'Transfer Analysis', href: '/intelligence' },
      { label: 'Player Profiles',   href: '/intelligence' },
    ],
  },
  {
    tag:   'Consulting',
    title: 'Polaris Consulting',
    body:  'Professional consulting for clubs, agents, and football professionals across recruitment and career management.',
    href:  '/solutions',
    cta:   'Explore Solutions',
    badge: null as string | null,
    links: [
      { label: 'For Clubs',   href: '/solutions' },
      { label: 'For Agents',  href: '/solutions' },
      { label: 'For Players', href: '/solutions' },
    ],
  },
  {
    tag:   'Platform',
    title: 'Polaris OS',
    body:  'Our proprietary football operating system — CRM, scouting pipeline, databases, AI assistant. Currently in development.',
    href:  '/login',
    cta:   'Access Platform',
    badge: 'In Development' as string | null,
    links: [
      { label: 'Pipeline Manager', href: '/login'    },
      { label: 'Player Database',  href: '/login'    },
      { label: 'Request Access',   href: '/contact'  },
    ],
  },
]

const STATS = [
  { value: '48+',  label: 'Scouting Reports', sub: 'In database'    },
  { value: '12',   label: 'Countries',         sub: 'Covered'        },
  { value: '200+', label: 'Network Members',   sub: 'Professionals'  },
  { value: '150+', label: 'Player Profiles',   sub: 'On file'        },
  { value: '100%', label: 'Independent',       sub: 'No club ties'   },
]

const SOLUTIONS = [
  {
    num:      '01',
    audience: 'For Clubs',
    services: ['Recruitment Intelligence', 'Scouting Reports', 'Shortlists', 'Squad Analysis', 'Market Intelligence'],
    desc:     'Data-driven recruitment consulting to help clubs identify, evaluate, and secure talent aligned with their sporting project and budget.',
  },
  {
    num:      '02',
    audience: 'For Agents',
    services: ['Market Intelligence', 'Mandate Support', 'International Network', 'Regulatory Consulting'],
    desc:     'Market intelligence and network access so licensed agents can operate with better information and broader reach across markets.',
  },
  {
    num:      '03',
    audience: 'For Players',
    services: ['Career Assessment', 'Market Positioning', 'Professional Consulting', 'International Guidance'],
    desc:     'Honest career consulting for professional and semi-professional players — without the promises of representation.',
  },
]

const ARTICLES = [
  {
    category: 'Scouting Reports',
    catColor: '#2563EB',
    readTime: '12',
    title:    'The Modern Football Recruitment Landscape: How Clubs Are Rebuilding Their Scouting Infrastructure',
    excerpt:  'How the most progressive clubs are restructuring their entire recruitment apparatus around data, network, and intelligence.',
  },
  {
    category: 'Transfer Market',
    catColor: '#D97706',
    readTime: '5',
    title:    'Free Agent Windows: The Opportunity Most Clubs Consistently Overlook',
    excerpt:  'A structured look at where value hides in the market between windows.',
  },
  {
    category: 'Emerging Talents',
    catColor: '#059669',
    readTime: '8',
    title:    'Profiles to Watch: Five Under-23 Midfielders Poised for the Next Level',
    excerpt:  'Our intelligence team identifies five midfielders from secondary markets likely to move upward in 12 months.',
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const PH   = SECTION.padH
  const MONO = 'var(--font-geist-mono), monospace'

  return (
    <div style={{ fontFamily: FONT.sans, background: '#fff', minHeight: '100vh' }}>
      <style>{`
        /* ─── Hero ─── */
        .hp-hed {
          font-family: var(--font-space-grotesk), system-ui, sans-serif;
          font-size: clamp(44px, 6vw, 86px);
          font-weight: 700; line-height: 0.88;
          letter-spacing: -0.045em; text-transform: uppercase;
          color: #0A0A0A; margin: 0 0 24px;
        }

        /* ─── Pillars ─── */
        .hp-pillars { display: grid; grid-template-columns: repeat(3, 1fr); }
        .hp-pillar  { transition: background 0.2s ease; }
        .hp-pillar:hover { background: #FAFAFA; }

        /* ─── Stats ─── */
        .hp-stats { display: grid; grid-template-columns: repeat(5, 1fr); }
        .hp-stat  { transition: background 0.18s ease; cursor: default; }
        .hp-stat:hover { background: rgba(255,255,255,0.04); }
        .hp-stat:hover .hp-stat-val { color: ${C.blue} !important; }

        /* ─── Solutions ─── */
        .hp-sol-row {
          display: grid; grid-template-columns: 52px 1fr 1fr;
          gap: 20px; align-items: start;
          padding: clamp(20px, 2.5vw, 32px) ${PH};
          border-top: 1px solid ${C.border};
          transition: background 0.15s ease;
        }
        .hp-sol-row:hover { background: #FAFAFA; }
        .hp-sol-row:hover .hp-sol-cta { color: ${C.blue} !important; }

        /* ─── Platform panel ─── */
        .hp-platform { display: grid; grid-template-columns: 56fr 44fr; }
        .hp-platform-dark {
          background: #0A0A0A; overflow: hidden;
          padding: clamp(36px, 5vw, 56px) clamp(24px, 3vw, 44px) 0;
          min-height: 520px;
        }
        .hp-platform-text {
          background: #F9FAFB;
          padding: clamp(48px, 6.5vw, 84px) clamp(36px, 4.5vw, 64px);
          display: flex; flex-direction: column; justify-content: center;
        }

        /* ─── Network ─── */
        .hp-network { display: grid; grid-template-columns: 44fr 56fr; }

        /* ─── Article cards ─── */
        .hp-art { transition: background 0.15s ease; }
        .hp-art:hover { background: #FAFAFA !important; }
        .hp-art:hover .hp-art-title { color: ${C.blue} !important; }

        /* ─── CTA buttons ─── */
        .hp-btn-p:hover  { background: ${C.blueHover} !important; }
        .hp-btn-o:hover  { background: #F3F4F6 !important; }
        .hp-gcta:hover   { opacity: 0.65; }
        .hp-pcta:hover   { color: ${C.dark} !important; }
        .hp-sublink:hover { color: ${C.blue} !important; }
        .hp-sol-cta      { transition: color 0.15s ease; }

        /* ─── Badges ─── */
        .hp-badge {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 9px; font-weight: 700; letter-spacing: 0.14em;
          text-transform: uppercase; white-space: nowrap;
          color: ${C.blue}; background: rgba(37,99,235,0.07);
          border: 1px solid rgba(37,99,235,0.18);
          padding: 2px 7px; border-radius: 4px;
        }
        .hp-badge-filled {
          display: inline-flex; align-items: center;
          font-size: 9px; font-weight: 700; letter-spacing: 0.14em;
          text-transform: uppercase; white-space: nowrap;
          color: #fff; background: ${C.blue};
          padding: 2px 7px; border-radius: 4px;
        }

        /* ─── Responsive ─── */
        @media (max-width: 1024px) { .hp-stats { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 900px)  {
          .hp-pillars     { grid-template-columns: 1fr !important; }
          .hp-sol-row     { grid-template-columns: 1fr !important; }
          .hp-platform    { display: flex !important; flex-direction: column !important; }
          .hp-platform-dark { min-height: 260px !important; }
          .hp-network     { display: flex !important; flex-direction: column !important; }
          .hp-intel-cards { grid-template-columns: 1fr !important; }
          .hp-stats { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px)  { .hp-stats { grid-template-columns: 1fr !important; } }
      `}</style>

      <Navbar />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ HERO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section style={{
        position: 'relative', overflow: 'hidden',
        minHeight: '72svh', display: 'flex', alignItems: 'center',
        borderBottom: `1px solid ${C.border}`,
        backgroundImage: 'radial-gradient(circle, rgba(37,99,235,0.045) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }}>
        <RadarSVG />

        <div style={{
          position: 'relative', zIndex: 1,
          paddingTop: 'clamp(64px, 8vw, 108px)',
          paddingBottom: 'clamp(52px, 6.5vw, 80px)',
          paddingLeft: PH, paddingRight: PH,
          maxWidth: SECTION.maxW, margin: '0 auto', width: '100%',
        }}>

          {/* Eyebrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <div style={{ width: 20, height: 1.5, background: C.blue, flexShrink: 0 }} />
            <span style={{ ...T.label, color: C.blue }}>Football Intelligence Platform</span>
            <span style={{ fontFamily: MONO, fontSize: 9, color: C.textMuted, marginLeft: 4, letterSpacing: '0.06em' }}>EST. 2024</span>
          </div>

          {/* Headline */}
          <h1 className="hp-hed">
            Football<br />
            <span style={{ color: C.blue }}>Intelligence</span><br />
            For the<br />
            Modern Game.
          </h1>

          {/* Metadata strip */}
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
            {['Madrid, Spain', '12 Countries', 'Absolut Football Network'].map((item, i) => (
              <span key={item} style={{ display: 'inline-flex', alignItems: 'center' }}>
                <span style={{ fontFamily: MONO, fontSize: 10, color: C.textMuted, letterSpacing: '0.05em' }}>{item}</span>
                {i < 2 && <span style={{ color: C.border, margin: '0 10px', fontSize: 11 }}>·</span>}
              </span>
            ))}
          </div>

          {/* Sub */}
          <p style={{ ...T.body, color: C.textSecondary, maxWidth: 440, margin: '0 0 36px', lineHeight: 1.85 }}>
            Polaris provides scouting intelligence, recruitment consulting, and proprietary tools for clubs, agents, and football professionals.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/solutions" className="hp-btn-p" style={{ ...BTN.primary }}>
              Explore Solutions <ArrowRight size={13} />
            </Link>
            <Link href="/intelligence" className="hp-btn-o" style={{ ...BTN.outline }}>
              Read Intelligence <ArrowRight size={13} />
            </Link>
          </div>

        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━ THREE PILLARS ━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="hp-pillars" style={{ borderBottom: `1px solid ${C.border}` }}>
        {PILLARS.map((p, i) => (
          <div key={p.tag} className="hp-pillar" style={{
            paddingTop:    'clamp(36px, 4.5vw, 56px)',
            paddingBottom: 'clamp(36px, 4.5vw, 56px)',
            paddingLeft:   'clamp(28px, 3.5vw, 48px)',
            paddingRight:  'clamp(28px, 3.5vw, 48px)',
            borderRight: i < PILLARS.length - 1 ? `1px solid ${C.border}` : 'none',
            display: 'flex', flexDirection: 'column', position: 'relative',
          }}>
            {/* Section number */}
            <span style={{ position: 'absolute', top: 'clamp(18px, 2.2vw, 24px)', right: 'clamp(14px, 1.8vw, 20px)', fontFamily: MONO, fontSize: 9, color: C.border, letterSpacing: '0.06em' }}>
              {String(i + 1).padStart(2, '0')}
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <span style={{ ...T.label, color: C.blue }}>{p.tag}</span>
              {p.badge && <span className="hp-badge">{p.badge}</span>}
            </div>

            <h2 style={{ fontFamily: FONT.display, fontSize: 'clamp(17px, 2vw, 22px)', fontWeight: 700, color: C.dark, margin: '0 0 12px', letterSpacing: '-0.025em', textTransform: 'uppercase', lineHeight: 1.12 }}>
              {p.title}
            </h2>
            <p style={{ ...T.small, color: C.textSecondary, margin: '0 0 24px', flex: 1, lineHeight: 1.85 }}>
              {p.body}
            </p>

            <Link href={p.href} className="hp-pcta" style={{ ...T.label, color: C.textMuted, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 7, transition: 'color 0.15s', marginBottom: 20 }}>
              {p.cta} <ArrowRight size={10} />
            </Link>

            {/* Secondary nav links */}
            <div style={{ paddingTop: 18, borderTop: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: 9 }}>
              {p.links.map(l => (
                <Link key={l.label} href={l.href} className="hp-sublink" style={{ fontFamily: MONO, fontSize: 9, color: C.textMuted, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 5, letterSpacing: '0.04em', transition: 'color 0.15s' }}>
                  → {l.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━ CREDIBILITY ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="hp-stats" style={{ background: C.dark, borderBottom: `1px solid rgba(255,255,255,0.06)` }}>
        {STATS.map((s, i) => (
          <div key={s.label} className="hp-stat" style={{
            paddingTop:    'clamp(24px, 3vw, 36px)',
            paddingBottom: 'clamp(24px, 3vw, 36px)',
            paddingLeft:   'clamp(16px, 2vw, 28px)',
            paddingRight:  'clamp(16px, 2vw, 28px)',
            borderRight: i < STATS.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
            textAlign: 'center',
          }}>
            <div className="hp-stat-val" style={{ fontFamily: FONT.display, fontSize: 'clamp(22px, 2.8vw, 36px)', fontWeight: 700, color: '#fff', lineHeight: 1, letterSpacing: '-0.03em', marginBottom: 6, transition: 'color 0.18s' }}>
              {s.value}
            </div>
            <div style={{ ...T.label, color: C.blue, marginBottom: 3, fontSize: 9 }}>{s.label}</div>
            <div style={{ fontFamily: MONO, fontSize: 8, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{s.sub}</div>
          </div>
        ))}
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━ SOLUTIONS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section style={{ borderBottom: `1px solid ${C.border}` }}>

        <div style={{
          paddingTop:    'clamp(36px, 4.5vw, 52px)',
          paddingBottom: 'clamp(20px, 2.5vw, 28px)',
          paddingLeft: PH, paddingRight: PH,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 20, height: 1.5, background: C.blue, flexShrink: 0 }} />
              <span style={{ ...T.label, color: C.blue }}>Solutions</span>
            </div>
            <span style={{ fontFamily: MONO, fontSize: 9, color: C.border, letterSpacing: '0.06em' }}>§02</span>
          </div>
          <Link href="/solutions" style={{ ...T.label, color: C.textMuted, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, transition: 'color 0.15s' }}>
            View all <ArrowRight size={10} />
          </Link>
        </div>

        {SOLUTIONS.map(s => (
          <div key={s.audience} className="hp-sol-row">
            {/* Number */}
            <div style={{ paddingTop: 2 }}>
              <span style={{ fontFamily: FONT.display, fontSize: 17, fontWeight: 700, color: C.blue, lineHeight: 1, opacity: 0.28, letterSpacing: '-0.02em' }}>
                {s.num}
              </span>
            </div>
            {/* Audience + services */}
            <div>
              <h3 style={{ fontFamily: FONT.display, fontSize: 'clamp(15px, 1.8vw, 19px)', fontWeight: 700, color: C.dark, margin: '0 0 10px', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
                {s.audience}
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', rowGap: 3 }}>
                {s.services.map((svc, j) => (
                  <span key={svc} style={{ display: 'inline-flex', alignItems: 'center' }}>
                    <span style={{ fontFamily: MONO, fontSize: 9, color: C.textSecondary, letterSpacing: '0.03em' }}>{svc}</span>
                    {j < s.services.length - 1 && <span style={{ color: C.border, margin: '0 7px', fontSize: 11 }}>·</span>}
                  </span>
                ))}
              </div>
            </div>
            {/* Description + CTA */}
            <div style={{ paddingLeft: 'clamp(0px, 1vw, 12px)' }}>
              <p style={{ ...T.small, color: C.textSecondary, margin: '0 0 14px', lineHeight: 1.85, fontSize: 12 }}>
                {s.desc}
              </p>
              <span className="hp-sol-cta" style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.07em', textTransform: 'uppercase', color: C.textMuted, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                Enquire →
              </span>
            </div>
          </div>
        ))}

        <div style={{ height: 'clamp(20px, 2.5vw, 32px)' }} />
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━ LATEST INTELLIGENCE ━━━━━━━━━━━━━━━━━━━━━━ */}
      <section style={{ borderBottom: `1px solid ${C.border}` }}>

        {/* Editorial header */}
        <div style={{
          paddingTop:    'clamp(32px, 4vw, 48px)',
          paddingBottom: 'clamp(16px, 2vw, 22px)',
          paddingLeft: PH, paddingRight: PH,
          display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 12,
          borderBottom: `1px solid ${C.border}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 20, height: 1.5, background: C.blue, flexShrink: 0 }} />
              <span style={{ ...T.label, color: C.blue }}>Intelligence</span>
            </div>
            <span style={{ fontFamily: MONO, fontSize: 9, color: C.textMuted, letterSpacing: '0.06em' }}>Issue 001 · Q3 2026</span>
          </div>
          <Link href="/intelligence" style={{ ...T.label, color: C.textMuted, textDecoration: 'none', transition: 'color 0.15s' }}>
            View all →
          </Link>
        </div>

        {/* Featured article */}
        <Link href="/intelligence" className="hp-art" style={{
          display: 'block', textDecoration: 'none',
          paddingTop: 'clamp(24px, 3vw, 36px)', paddingBottom: 'clamp(24px, 3vw, 36px)',
          paddingLeft: PH, paddingRight: PH,
          borderBottom: `1px solid ${C.border}`,
          background: '#fff', transition: 'background 0.15s',
          position: 'relative',
        }}>
          {/* Blue left accent */}
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: C.blue }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12, flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: ARTICLES[0].catColor, display: 'inline-block', flexShrink: 0 }} />
              <span style={{ fontFamily: MONO, fontSize: 9, color: ARTICLES[0].catColor, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{ARTICLES[0].category}</span>
            </span>
            <span className="hp-badge-filled">Featured</span>
            <span className="hp-badge">Coming Soon</span>
          </div>

          <h3 className="hp-art-title" style={{ fontFamily: FONT.display, fontSize: 'clamp(18px, 2.4vw, 26px)', fontWeight: 700, color: C.dark, margin: '0 0 10px', letterSpacing: '-0.025em', textTransform: 'uppercase', lineHeight: 1.12, maxWidth: 660, transition: 'color 0.15s' }}>
            {ARTICLES[0].title}
          </h3>
          <p style={{ ...T.small, color: C.textSecondary, margin: '0 0 14px', maxWidth: 500, lineHeight: 1.8 }}>
            {ARTICLES[0].excerpt}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontFamily: MONO, fontSize: 9, color: C.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{ARTICLES[0].readTime} min read</span>
            <span style={{ color: C.border, fontSize: 10 }}>·</span>
            <span style={{ fontFamily: MONO, fontSize: 9, color: C.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Polaris Intelligence</span>
          </div>
        </Link>

        {/* Two secondary articles */}
        <div className="hp-intel-cards" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          {ARTICLES.slice(1).map((a, i) => (
            <Link key={a.title} href="/intelligence" className="hp-art" style={{
              display: 'block', textDecoration: 'none',
              paddingTop: 'clamp(20px, 2.5vw, 32px)', paddingBottom: 'clamp(20px, 2.5vw, 32px)',
              paddingLeft: PH, paddingRight: PH,
              background: '#fff', transition: 'background 0.15s',
              borderLeft: i === 1 ? `1px solid ${C.border}` : 'none',
              borderBottom: `1px solid ${C.border}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: a.catColor, display: 'inline-block', flexShrink: 0 }} />
                  <span style={{ fontFamily: MONO, fontSize: 9, color: a.catColor, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{a.category}</span>
                </span>
                <span className="hp-badge">Coming Soon</span>
              </div>
              <h3 className="hp-art-title" style={{ ...T.h3, color: C.dark, margin: '0 0 8px', transition: 'color 0.15s' }}>
                {a.title}
              </h3>
              <p style={{ ...T.small, color: C.textSecondary, margin: '0 0 12px', lineHeight: 1.8, fontSize: 12 }}>
                {a.excerpt}
              </p>
              <span style={{ fontFamily: MONO, fontSize: 9, color: C.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {a.readTime} min read
              </span>
            </Link>
          ))}
        </div>

        <div style={{ paddingTop: 'clamp(16px, 2vw, 24px)', paddingBottom: 'clamp(16px, 2vw, 24px)', paddingLeft: PH, paddingRight: PH }}>
          <Link href="/intelligence" className="hp-gcta" style={{ ...BTN.ghost }}>
            Explore all Intelligence <ArrowRight size={11} />
          </Link>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━ POLARIS OS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="hp-platform" style={{ borderBottom: `1px solid ${C.border}` }}>
        <div className="hp-platform-dark">
          <AppPreview />
        </div>
        <div className="hp-platform-text">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <div style={{ width: 20, height: 1.5, background: C.blue, flexShrink: 0 }} />
            <span style={{ ...T.label, color: C.blue }}>Polaris OS</span>
            <span className="hp-badge">In Development</span>
          </div>
          <h2 style={{ fontFamily: FONT.display, fontSize: 'clamp(22px, 3.2vw, 40px)', fontWeight: 700, color: C.dark, margin: '0 0 16px', letterSpacing: '-0.035em', textTransform: 'uppercase', lineHeight: 1.05 }}>
            Our Tools.<br />Built for<br />Football.
          </h2>
          <p style={{ ...T.small, color: C.textSecondary, maxWidth: 300, margin: '0 0 30px', lineHeight: 1.85 }}>
            Polaris OS is our proprietary football operating system — CRM, scouting pipeline, player and club databases, AI assistant, and workflow automation.
          </p>
          <Link href="/login" className="hp-btn-p" style={{ ...BTN.primary, width: 'fit-content' }}>
            Access Platform <ArrowRight size={13} />
          </Link>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ NETWORK ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="hp-network" style={{ borderBottom: `1px solid ${C.border}` }}>
        <div style={{
          paddingTop: 'clamp(52px, 6.5vw, 80px)', paddingBottom: 'clamp(52px, 6.5vw, 80px)',
          paddingLeft: PH, paddingRight: PH,
          borderRight: `1px solid ${C.border}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
            <div style={{ width: 20, height: 1.5, background: C.blue, flexShrink: 0 }} />
            <span style={{ ...T.label, color: C.blue }}>Network</span>
          </div>
          <h2 style={{ fontFamily: FONT.display, fontSize: 'clamp(26px, 3.8vw, 48px)', fontWeight: 700, color: C.dark, margin: 0, letterSpacing: '-0.04em', textTransform: 'uppercase', lineHeight: 0.9 }}>
            Inside the<br />Absolut<br />Football<br />Network.
          </h2>
        </div>
        <div style={{
          paddingTop: 'clamp(52px, 6.5vw, 80px)', paddingBottom: 'clamp(52px, 6.5vw, 80px)',
          paddingLeft: PH, paddingRight: PH,
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          <NetworkSVG />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ ...T.body, color: C.textSecondary, margin: '0 0 18px', lineHeight: 1.85 }}>
              Polaris operates within a global network of scouts, analysts, recruiters, and football professionals. Our collaboration with the Absolut Football Network gives clients access to intelligence and relationships spanning clubs, academies, and sporting organizations across Europe and beyond.
            </p>
            <p style={{ ...T.body, color: C.textSecondary, margin: '0 0 32px', lineHeight: 1.85 }}>
              We don&apos;t promise transfers. We provide the intelligence and professional network that makes better decisions possible.
            </p>
            <Link href="/network" className="hp-gcta" style={{ ...BTN.ghost }}>
              About the Network <ArrowRight size={11} />
            </Link>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ CTA ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section style={{ background: C.dark, paddingTop: 'clamp(64px, 8vw, 100px)', paddingBottom: 'clamp(64px, 8vw, 100px)', paddingLeft: PH, paddingRight: PH }}>
        <div style={{ maxWidth: 580 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <div style={{ width: 20, height: 1.5, background: C.blue, flexShrink: 0 }} />
            <span style={{ ...T.label, color: C.blue }}>Work With Polaris</span>
          </div>
          <h2 style={{ fontFamily: FONT.display, fontSize: 'clamp(34px, 5vw, 68px)', fontWeight: 700, color: '#fff', margin: '0 0 18px', letterSpacing: '-0.04em', textTransform: 'uppercase', lineHeight: 0.9 }}>
            Ready to make<br />better football<br /><span style={{ color: C.blue }}>decisions?</span>
          </h2>
          <p style={{ ...T.body, color: C.textInverseDim, margin: '0 0 36px', maxWidth: 360, lineHeight: 1.85 }}>
            Contact the Polaris team. We work with clubs, agents, and football professionals who take intelligence seriously.
          </p>
          <Link href="/contact" className="hp-btn-p" style={{ ...BTN.primary }}>
            Get in Touch <ArrowRight size={13} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
