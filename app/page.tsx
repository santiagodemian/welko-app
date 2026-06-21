import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Navbar }     from '@/components/layout/Navbar'
import { Footer }     from '@/components/layout/Footer'
import { AppPreview } from '@/components/ui/AppPreview'
import { Eyebrow }    from '@/components/ui/Eyebrow'
import { Badge }      from '@/components/ui/Badge'
import { C, BTN, FONT, T, SECTION } from '@/lib/ds'

// ─── Decorative SVGs ─────────────────────────────────────────────────────────

function RadarSVG() {
  const rings = [178, 138, 98, 60, 24]
  const ticks = Array.from({ length: 36 }, (_, i) => i)
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      aria-hidden={true}
      style={{
        position: 'absolute', right: 0, top: '50%',
        transform: 'translateY(-50%)',
        width: 'clamp(180px, 28vw, 400px)', height: 'auto',
        opacity: 0.045, pointerEvents: 'none',
      }}
    >
      {rings.map(r => (
        <circle key={r} cx="200" cy="200" r={r} stroke={C.blue} strokeWidth={r === 178 ? 0.8 : 0.5} />
      ))}
      <line x1="200" y1="20"  x2="200" y2="380" stroke={C.blue} strokeWidth="0.7" />
      <line x1="20"  y1="200" x2="380" y2="200" stroke={C.blue} strokeWidth="0.7" />
      <line x1="73"  y1="73"  x2="327" y2="327" stroke={C.blue} strokeWidth="0.4" strokeDasharray="3 5" />
      <line x1="327" y1="73"  x2="73"  y2="327" stroke={C.blue} strokeWidth="0.4" strokeDasharray="3 5" />
      {ticks.map(i => {
        const a = (i * 10 * Math.PI) / 180
        return (
          <line
            key={i}
            x1={200 + 176 * Math.cos(a)} y1={200 + 176 * Math.sin(a)}
            x2={200 + 185 * Math.cos(a)} y2={200 + 185 * Math.sin(a)}
            stroke={C.blue} strokeWidth="0.8"
          />
        )
      })}
      <circle cx="200" cy="200" r="3.5" fill={C.blue} />
    </svg>
  )
}

function NetworkSVG() {
  const nodes = [
    { x: 290, y: 140, r: 4.5 }, { x: 140, y: 70,  r: 3   },
    { x: 430, y: 80,  r: 3   }, { x: 90,  y: 190, r: 2.5 },
    { x: 470, y: 200, r: 2.5 }, { x: 180, y: 270, r: 2.5 },
    { x: 390, y: 280, r: 2   }, { x: 290, y: 330, r: 2   },
    { x: 60,  y: 310, r: 1.8 }, { x: 510, y: 150, r: 1.8 },
    { x: 350, y: 40,  r: 1.5 }, { x: 200, y: 160, r: 1.5 },
  ]
  const edges = [
    [0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,11],
    [1,2],[1,3],[2,4],[2,9],[3,8],[4,6],[5,7],[6,7],[9,10],[1,11],[11,5],
  ]
  return (
    <svg viewBox="0 0 580 380" fill="none" aria-hidden={true}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06, pointerEvents: 'none' }}>
      {edges.map(([a, b], i) => (
        <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y} stroke={C.blue} strokeWidth="0.8" />
      ))}
      {nodes.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r={n.r} fill={C.blue} />
      ))}
    </svg>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PILLARS = [
  {
    tag:   'Intelligence',
    title: 'Polaris Intelligence',
    body:  'Scouting reports, player analysis, transfer market intelligence, and editorial coverage that informs better decisions.',
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
    body:  'Professional consulting for clubs, agents, and football professionals across recruitment, mandates, and career management.',
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
    body:  'Our proprietary football operating system — CRM, pipeline, databases, and AI tools built for recruitment professionals.',
    href:  '/login',
    cta:   'Request Access',
    badge: 'In Development' as string | null,
    links: [
      { label: 'Pipeline Manager', href: '/login'   },
      { label: 'Player Database',  href: '/login'   },
      { label: 'Request Access',   href: '/contact' },
    ],
  },
]

const STATS = [
  { value: '48+',  label: 'Scouting Reports', sub: 'In database'   },
  { value: '12',   label: 'Countries',         sub: 'Covered'       },
  { value: '200+', label: 'Network Members',   sub: 'Professionals' },
  { value: '150+', label: 'Player Profiles',   sub: 'On file'       },
  { value: '100%', label: 'Independent',       sub: 'No club ties'  },
]

const SOLUTIONS = [
  {
    num:      '01',
    audience: 'For Clubs',
    services: ['Recruitment Intelligence', 'Scouting Reports', 'Shortlists', 'Squad Analysis'],
    desc:     'Data-driven recruitment consulting to help clubs identify and secure talent aligned with their sporting project and budget.',
  },
  {
    num:      '02',
    audience: 'For Agents',
    services: ['Market Intelligence', 'Mandate Support', 'International Network', 'Regulatory Advisory'],
    desc:     'Market intelligence and network access so licensed agents can operate with better information across markets.',
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
    catColor: C.blue,
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

const OS_FEATURES = [
  'CRM & Scouting Pipeline',
  'Player & Club Database',
  'AI-Assisted Analysis',
  'Mandate & Transfer Tracking',
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const PH   = SECTION.padH
  const MONO = FONT.mono

  return (
    <div style={{ fontFamily: FONT.sans, background: C.bgLight, minHeight: '100vh' }}>
      <style>{`
        /* ─── Hero headline ─── */
        .hp-hed {
          font-family: var(--font-space-grotesk), system-ui, sans-serif;
          font-size: clamp(42px, 5.8vw, 82px);
          font-weight: 700; line-height: 0.9;
          letter-spacing: -0.045em; text-transform: uppercase;
          color: #111827; margin: 0 0 20px;
        }

        /* ─── Badge pulse ─── */
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.7); }
        }
        .hp-pulse { animation: pulse-dot 2.4s ease-in-out infinite; }

        /* ─── Three pillars ─── */
        .hp-pillars { display: grid; grid-template-columns: repeat(3, 1fr); }
        .hp-pillar  { transition: background 0.2s ease, box-shadow 0.22s ease, transform 0.22s ease; }
        .hp-pillar:hover {
          background: #FFFFFF !important;
          box-shadow: 0 10px 36px rgba(0,0,0,0.07), 0 2px 6px rgba(0,0,0,0.04);
          transform: translateY(-3px);
          position: relative; z-index: 1;
        }

        /* ─── Stats ─── */
        .hp-stats { display: grid; grid-template-columns: repeat(5, 1fr); }
        .hp-stat  { transition: background 0.15s ease; }
        .hp-stat:hover { background: #FFFFFF; }
        .hp-stat:hover .hp-stat-val { color: ${C.blue} !important; }

        /* ─── Solutions ─── */
        .hp-sol-row {
          display: grid; grid-template-columns: 52px 1fr 1fr;
          gap: 20px; align-items: start;
          padding: clamp(18px, 2.2vw, 26px) ${PH};
          border-top: 1px solid ${C.border};
          transition: background 0.15s ease;
        }
        .hp-sol-row:hover { background: #fff; }
        .hp-sol-row:hover .hp-sol-cta { color: ${C.blue} !important; }

        /* ─── Platform layout ─── */
        .hp-platform { display: grid; grid-template-columns: 58fr 42fr; align-items: center; }

        /* ─── Network ─── */
        .hp-network { display: grid; grid-template-columns: 42fr 58fr; }

        /* ─── Article cards ─── */
        .hp-art { transition: background 0.15s ease, box-shadow 0.15s ease; }
        .hp-art:hover { background: #FFFFFF !important; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
        .hp-art:hover .hp-art-title { color: ${C.blue} !important; }

        /* ─── Buttons ─── */
        .hp-btn-p:hover   { background: ${C.blueHover} !important; }
        .hp-btn-o:hover   { background: #F3F4F6 !important; }
        .hp-gcta:hover    { opacity: 0.6; }
        .hp-pcta:hover    { color: #111827 !important; }
        .hp-sublink:hover { color: ${C.blue} !important; }
        .hp-sol-cta       { transition: color 0.15s ease; }

        /* ─── Blue CTA section ─── */
        .hp-cta-w:hover { background: rgba(255,255,255,0.9) !important; }
        .hp-cta-g:hover { background: rgba(255,255,255,0.08) !important; }

        /* ─── Responsive ─── */
        @media (max-width: 1024px) { .hp-stats { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 900px)  {
          .hp-pillars     { grid-template-columns: 1fr !important; }
          .hp-sol-row     { grid-template-columns: 1fr !important; }
          .hp-platform    { display: flex !important; flex-direction: column-reverse !important; }
          .hp-network     { display: flex !important; flex-direction: column !important; }
          .hp-intel-cards { grid-template-columns: 1fr !important; }
          .hp-stats       { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px)  { .hp-stats { grid-template-columns: 1fr !important; } }
      `}</style>

      <Navbar />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ HERO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section style={{
        position: 'relative', overflow: 'hidden',
        minHeight: '72svh', display: 'flex', alignItems: 'center',
        background: C.bgLight, borderBottom: `1px solid ${C.border}`,
        backgroundImage: 'radial-gradient(circle, rgba(37,99,235,0.04) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }}>
        <RadarSVG />
        <div style={{
          position: 'relative', zIndex: 1,
          paddingTop:    'clamp(52px, 6.5vw, 92px)',
          paddingBottom: 'clamp(44px, 5.5vw, 68px)',
          paddingLeft: PH, paddingRight: PH,
          maxWidth: SECTION.maxW, margin: '0 auto', width: '100%',
        }}>

          {/* Badge pill */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 26,
            background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.18)',
            borderRadius: 24, padding: '5px 14px 5px 10px',
          }}>
            <span className="hp-pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: C.blue, display: 'inline-block', flexShrink: 0 }} />
            <span style={{ fontFamily: MONO, fontSize: 9, color: C.blue, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}>
              Football Intelligence Platform · Est. 2024
            </span>
          </div>

          {/* Headline */}
          <h1 className="hp-hed">
            Football<br />
            <span style={{ color: C.blue }}>Intelligence</span><br />
            For the<br />
            Modern Game.
          </h1>

          {/* Description — 2 lines max */}
          <p style={{ ...T.body, color: C.textSecondary, maxWidth: 400, margin: '0 0 30px', lineHeight: 1.85, fontSize: 14 }}>
            Scouting intelligence, recruitment consulting, and proprietary tools for clubs, agents, and football professionals.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
            <Link href="/solutions" className="hp-btn-p" style={{ ...BTN.primary }}>
              Explore Solutions <ArrowRight size={13} />
            </Link>
            <Link href="/intelligence" className="hp-btn-o" style={{ ...BTN.outline }}>
              Read Intelligence <ArrowRight size={13} />
            </Link>
          </div>

          {/* Trust indicators */}
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', rowGap: 4 }}>
            {['200+ Network Members', '12 Countries', '48+ Scouting Reports'].map((item, i) => (
              <span key={item} style={{ display: 'inline-flex', alignItems: 'center' }}>
                <span style={{ fontFamily: MONO, fontSize: 9, color: C.textMuted, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{item}</span>
                {i < 2 && <span style={{ color: C.border, margin: '0 10px', userSelect: 'none' }}>·</span>}
              </span>
            ))}
          </div>

        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━ THREE PILLARS ━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="hp-pillars" style={{ background: '#FFFFFF', borderBottom: `1px solid ${C.border}` }}>
        {PILLARS.map((p, i) => (
          <div key={p.tag} className="hp-pillar" style={{
            paddingTop:    'clamp(28px, 3.5vw, 44px)',
            paddingBottom: 'clamp(28px, 3.5vw, 44px)',
            paddingLeft:   'clamp(22px, 2.8vw, 40px)',
            paddingRight:  'clamp(22px, 2.8vw, 40px)',
            borderRight: i < PILLARS.length - 1 ? `1px solid ${C.border}` : 'none',
            display: 'flex', flexDirection: 'column', position: 'relative',
            background: '#FFFFFF',
          }}>
            <span style={{ position: 'absolute', top: 18, right: 18, fontFamily: MONO, fontSize: 9, color: C.border, letterSpacing: '0.06em' }}>
              {String(i + 1).padStart(2, '0')}
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <Eyebrow mb={0}>{p.tag}</Eyebrow>
              {p.badge && <Badge variant="outline">{p.badge}</Badge>}
            </div>

            <h2 style={{ fontFamily: FONT.display, fontSize: 'clamp(15px, 1.7vw, 19px)', fontWeight: 700, color: '#111827', margin: '0 0 9px', letterSpacing: '-0.02em', textTransform: 'uppercase', lineHeight: 1.1 }}>
              {p.title}
            </h2>
            <p style={{ fontFamily: FONT.sans, fontSize: 12, color: C.textSecondary, margin: '0 0 18px', flex: 1, lineHeight: 1.85 }}>
              {p.body}
            </p>

            <Link href={p.href} className="hp-pcta" style={{ fontFamily: FONT.sans, fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.textMuted, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 5, transition: 'color 0.15s', marginBottom: 16 }}>
              {p.cta} <ArrowRight size={9} />
            </Link>

            <div style={{ paddingTop: 14, borderTop: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: 7 }}>
              {p.links.map(l => (
                <Link key={l.label} href={l.href} className="hp-sublink" style={{ fontFamily: MONO, fontSize: 9, color: C.textMuted, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, letterSpacing: '0.04em', transition: 'color 0.15s' }}>
                  → {l.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━ CREDIBILITY ━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="hp-stats" style={{ background: C.bgAlt, borderBottom: `1px solid ${C.border}` }}>
        {STATS.map((s, i) => (
          <div key={s.label} className="hp-stat" style={{
            paddingTop:    'clamp(18px, 2.2vw, 28px)',
            paddingBottom: 'clamp(18px, 2.2vw, 28px)',
            paddingLeft:   'clamp(14px, 1.8vw, 22px)',
            paddingRight:  'clamp(14px, 1.8vw, 22px)',
            borderRight: i < STATS.length - 1 ? `1px solid ${C.border}` : 'none',
            textAlign: 'center',
          }}>
            <div className="hp-stat-val" style={{ fontFamily: FONT.display, fontSize: 'clamp(20px, 2.4vw, 32px)', fontWeight: 700, color: '#111827', lineHeight: 1, letterSpacing: '-0.03em', marginBottom: 4, transition: 'color 0.15s' }}>
              {s.value}
            </div>
            <div style={{ fontFamily: FONT.sans, fontSize: 8, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.blue, marginBottom: 2 }}>{s.label}</div>
            <div style={{ fontFamily: MONO, fontSize: 8, color: C.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{s.sub}</div>
          </div>
        ))}
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ SOLUTIONS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section style={{ background: '#FFFFFF', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ paddingTop: 'clamp(28px, 3.5vw, 44px)', paddingBottom: 'clamp(16px, 2vw, 22px)', paddingLeft: PH, paddingRight: PH }}>
          <Eyebrow meta="§02" mb={0}
            right={
              <Link href="/solutions" style={{ fontFamily: FONT.sans, fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.textMuted, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}>
                View all <ArrowRight size={9} />
              </Link>
            }
          >
            Solutions
          </Eyebrow>
        </div>

        {SOLUTIONS.map(s => (
          <div key={s.audience} className="hp-sol-row">
            <div style={{ paddingTop: 2 }}>
              <span style={{ fontFamily: FONT.display, fontSize: 15, fontWeight: 700, color: C.blue, opacity: 0.22, lineHeight: 1, letterSpacing: '-0.02em' }}>
                {s.num}
              </span>
            </div>
            <div>
              <h3 style={{ fontFamily: FONT.display, fontSize: 'clamp(14px, 1.6vw, 17px)', fontWeight: 700, color: '#111827', margin: '0 0 7px', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
                {s.audience}
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', rowGap: 2 }}>
                {s.services.map((svc, j) => (
                  <span key={svc} style={{ display: 'inline-flex', alignItems: 'center' }}>
                    <span style={{ fontFamily: MONO, fontSize: 9, color: C.textSecondary, letterSpacing: '0.02em' }}>{svc}</span>
                    {j < s.services.length - 1 && <span style={{ color: C.border, margin: '0 6px', userSelect: 'none' }}>·</span>}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p style={{ fontFamily: FONT.sans, fontSize: 12, color: C.textSecondary, margin: '0 0 10px', lineHeight: 1.8 }}>
                {s.desc}
              </p>
              <span className="hp-sol-cta" style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.07em', textTransform: 'uppercase', color: C.textMuted, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                Enquire →
              </span>
            </div>
          </div>
        ))}
        <div style={{ height: 'clamp(16px, 2vw, 24px)' }} />
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━ LATEST INTELLIGENCE ━━━━━━━━━━━━━━━━━━━━━━ */}
      <section style={{ background: C.bgLight, borderBottom: `1px solid ${C.border}` }}>

        <div style={{ paddingTop: 'clamp(26px, 3.2vw, 38px)', paddingBottom: 'clamp(14px, 1.8vw, 20px)', paddingLeft: PH, paddingRight: PH, borderBottom: `1px solid ${C.border}` }}>
          <Eyebrow meta="Issue 001 · Q3 2026"
            right={
              <Link href="/intelligence" style={{ fontFamily: FONT.sans, fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.textMuted, textDecoration: 'none' }}>
                View all →
              </Link>
            }
          >
            Intelligence
          </Eyebrow>
        </div>

        {/* Featured */}
        <Link href="/intelligence" className="hp-art" style={{
          display: 'block', textDecoration: 'none',
          paddingTop: 'clamp(18px, 2.2vw, 28px)', paddingBottom: 'clamp(18px, 2.2vw, 28px)',
          paddingLeft: PH, paddingRight: PH,
          borderBottom: `1px solid ${C.border}`,
          background: C.bgLight, position: 'relative',
        }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: C.blue }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 9, flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: ARTICLES[0].catColor, display: 'inline-block', flexShrink: 0 }} />
              <span style={{ fontFamily: MONO, fontSize: 8, color: ARTICLES[0].catColor, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{ARTICLES[0].category}</span>
            </span>
            <Badge variant="filled">Featured</Badge>
            <Badge variant="subtle">Coming Soon</Badge>
          </div>
          <h3 className="hp-art-title" style={{ fontFamily: FONT.display, fontSize: 'clamp(15px, 2vw, 22px)', fontWeight: 700, color: '#111827', margin: '0 0 8px', letterSpacing: '-0.02em', textTransform: 'uppercase', lineHeight: 1.12, maxWidth: 620, transition: 'color 0.15s' }}>
            {ARTICLES[0].title}
          </h3>
          <p style={{ fontFamily: FONT.sans, fontSize: 12, color: C.textSecondary, margin: '0 0 12px', maxWidth: 460, lineHeight: 1.8 }}>
            {ARTICLES[0].excerpt}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: MONO, fontSize: 8, color: C.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{ARTICLES[0].readTime} min read</span>
            <span style={{ color: C.border }}>·</span>
            <span style={{ fontFamily: MONO, fontSize: 8, color: C.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Polaris Intelligence</span>
          </div>
        </Link>

        {/* Two briefs */}
        <div className="hp-intel-cards" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          {ARTICLES.slice(1).map((a, i) => (
            <Link key={a.title} href="/intelligence" className="hp-art" style={{
              display: 'block', textDecoration: 'none',
              paddingTop: 'clamp(16px, 2vw, 24px)', paddingBottom: 'clamp(16px, 2vw, 24px)',
              paddingLeft: PH, paddingRight: PH,
              background: C.bgLight,
              borderLeft: i === 1 ? `1px solid ${C.border}` : 'none',
              borderBottom: `1px solid ${C.border}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 7 }}>
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: a.catColor, display: 'inline-block', flexShrink: 0 }} />
                <span style={{ fontFamily: MONO, fontSize: 8, color: a.catColor, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{a.category}</span>
                <Badge variant="subtle">Coming Soon</Badge>
              </div>
              <h3 className="hp-art-title" style={{ fontFamily: FONT.display, fontSize: 15, fontWeight: 700, color: '#111827', margin: '0 0 7px', letterSpacing: '-0.01em', lineHeight: 1.2, transition: 'color 0.15s' }}>
                {a.title}
              </h3>
              <p style={{ fontFamily: FONT.sans, fontSize: 12, color: C.textSecondary, margin: '0 0 8px', lineHeight: 1.75 }}>
                {a.excerpt}
              </p>
              <span style={{ fontFamily: MONO, fontSize: 8, color: C.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {a.readTime} min read
              </span>
            </Link>
          ))}
        </div>

        <div style={{ paddingTop: 'clamp(12px, 1.5vw, 18px)', paddingBottom: 'clamp(12px, 1.5vw, 18px)', paddingLeft: PH, paddingRight: PH }}>
          <Link href="/intelligence" className="hp-gcta" style={{ ...BTN.ghost }}>
            Explore all Intelligence <ArrowRight size={11} />
          </Link>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ POLARIS OS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section style={{ background: C.bgAlt, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: SECTION.maxW + 160, margin: '0 auto', paddingLeft: PH, paddingRight: PH }}>
          <div className="hp-platform" style={{ paddingTop: 'clamp(36px, 4.5vw, 60px)', paddingBottom: 'clamp(36px, 4.5vw, 60px)' }}>

            {/* Left: floating product card */}
            <div style={{ paddingRight: 'clamp(16px, 2.5vw, 44px)' }}>
              <div style={{ borderRadius: 14, overflow: 'hidden', boxShadow: '0 20px 52px rgba(0,0,0,0.13), 0 5px 14px rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.06)' }}>
                <AppPreview />
              </div>
            </div>

            {/* Right: text */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: 'clamp(0px, 1.5vw, 20px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <Eyebrow mb={0}>Polaris OS</Eyebrow>
                <Badge variant="outline">In Development</Badge>
              </div>

              <h2 style={{ fontFamily: FONT.display, fontSize: 'clamp(20px, 2.8vw, 36px)', fontWeight: 700, color: '#111827', margin: '0 0 12px', letterSpacing: '-0.035em', textTransform: 'uppercase', lineHeight: 1.05 }}>
                Your Football<br />Operating<br />System.
              </h2>
              <p style={{ fontFamily: FONT.sans, fontSize: 12, color: C.textSecondary, margin: '0 0 20px', lineHeight: 1.85, maxWidth: 280 }}>
                Proprietary tools built for football intelligence professionals — CRM, pipeline, databases, and AI analysis in one platform.
              </p>

              <div style={{ marginBottom: 24 }}>
                {OS_FEATURES.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: C.blue, flexShrink: 0 }} />
                    <span style={{ fontFamily: MONO, fontSize: 10, color: C.textSecondary, letterSpacing: '0.02em' }}>{f}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Link href="/contact" className="hp-btn-p" style={{ ...BTN.primary }}>
                  Request Early Access <ArrowRight size={12} />
                </Link>
                <Link href="/login" className="hp-btn-o" style={{ ...BTN.outline }}>
                  Sign In <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ NETWORK ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="hp-network" style={{ background: '#FFFFFF', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ paddingTop: 'clamp(40px, 5vw, 64px)', paddingBottom: 'clamp(40px, 5vw, 64px)', paddingLeft: PH, paddingRight: PH, borderRight: `1px solid ${C.border}` }}>
          <Eyebrow mb={22}>Network</Eyebrow>
          <h2 style={{ fontFamily: FONT.display, fontSize: 'clamp(22px, 3.2vw, 42px)', fontWeight: 700, color: '#111827', margin: 0, letterSpacing: '-0.04em', textTransform: 'uppercase', lineHeight: 0.92 }}>
            Inside the<br />Absolut<br />Football<br />Network.
          </h2>
        </div>
        <div style={{ paddingTop: 'clamp(40px, 5vw, 64px)', paddingBottom: 'clamp(40px, 5vw, 64px)', paddingLeft: PH, paddingRight: PH, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
          <NetworkSVG />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontFamily: FONT.sans, fontSize: 13, color: C.textSecondary, margin: '0 0 12px', lineHeight: 1.85 }}>
              Polaris operates within a global network of scouts, analysts, recruiters, and football professionals across Europe and beyond.
            </p>
            <p style={{ fontFamily: FONT.sans, fontSize: 13, color: C.textSecondary, margin: '0 0 26px', lineHeight: 1.85 }}>
              We don&apos;t promise transfers. We provide the intelligence and professional network that makes better decisions possible.
            </p>
            <Link href="/network" className="hp-gcta" style={{ ...BTN.ghost }}>
              About the Network <ArrowRight size={11} />
            </Link>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ CTA ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section style={{ background: C.blue, paddingTop: 'clamp(52px, 6.5vw, 80px)', paddingBottom: 'clamp(52px, 6.5vw, 80px)', paddingLeft: PH, paddingRight: PH }}>
        <div style={{ maxWidth: SECTION.maxW, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ width: 18, height: 1.5, background: 'rgba(255,255,255,0.45)', flexShrink: 0 }} />
            <span style={{ fontFamily: FONT.sans, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>Work With Polaris</span>
          </div>
          <h2 style={{ fontFamily: FONT.display, fontSize: 'clamp(30px, 4.2vw, 60px)', fontWeight: 700, color: '#fff', margin: '0 0 14px', letterSpacing: '-0.04em', textTransform: 'uppercase', lineHeight: 0.92 }}>
            Ready to make<br />better football<br />decisions?
          </h2>
          <p style={{ fontFamily: FONT.sans, fontSize: 13, color: 'rgba(255,255,255,0.65)', margin: '0 0 28px', maxWidth: 340, lineHeight: 1.85 }}>
            Contact the Polaris team. We work with clubs, agents, and professionals who take intelligence seriously.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link href="/contact" className="hp-cta-w" style={{ ...BTN.primary, background: '#fff', color: C.blue }}>
              Get in Touch <ArrowRight size={12} />
            </Link>
            <Link href="/solutions" className="hp-cta-g" style={{ ...BTN.primary, background: 'transparent', color: 'rgba(255,255,255,0.85)', border: '1.5px solid rgba(255,255,255,0.3)' }}>
              Explore Solutions <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
