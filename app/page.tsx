import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Navbar }     from '@/components/layout/Navbar'
import { Footer }     from '@/components/layout/Footer'
import { AppPreview } from '@/components/ui/AppPreview'
import { C, BTN, FONT, T, SECTION } from '@/lib/ds'

// ─── Data ────────────────────────────────────────────────────────────────────

const PILLARS = [
  {
    tag:   'Intelligence',
    title: 'Polaris Intelligence',
    body:  'Scouting reports, player analysis, recruitment insights, and football business coverage. Our editorial intelligence informs better decisions.',
    href:  '/intelligence',
    cta:   'Read Intelligence',
    badge: null as string | null,
  },
  {
    tag:   'Consulting',
    title: 'Polaris Consulting',
    body:  'Professional consulting for clubs, agents, and football professionals. We help you make better decisions across recruitment and career management.',
    href:  '/solutions',
    cta:   'Explore Solutions',
    badge: null as string | null,
  },
  {
    tag:   'Platform',
    title: 'Polaris OS',
    body:  'Our proprietary football operating system — CRM, scouting pipeline, player and club databases, AI assistant, and workflow tools. Currently in development.',
    href:  '/login',
    cta:   'Access Platform',
    badge: 'In Development' as string | null,
  },
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
    title:    'The Modern Football Recruitment Landscape: How Clubs Are Rebuilding Their Scouting Infrastructure',
    excerpt:  'How the most progressive clubs are restructuring their entire recruitment apparatus around data, network, and intelligence.',
  },
  {
    category: 'Transfer Market',
    title:    'Free Agent Windows: The Opportunity Most Clubs Consistently Overlook',
    excerpt:  'A structured look at where value hides in the market between windows.',
  },
  {
    category: 'Emerging Talents',
    title:    'Profiles to Watch: Five Under-23 Midfielders Poised for the Next Level',
    excerpt:  'Our intelligence team identifies five midfielders from secondary markets likely to move upward in 12 months.',
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const PH = SECTION.padH

  return (
    <div style={{ fontFamily: FONT.sans, background: '#fff', minHeight: '100vh' }}>
      <style>{`
        /* ── Hero ── */
        .hp-hed {
          font-family: var(--font-space-grotesk), system-ui, sans-serif;
          font-size: clamp(64px, 9vw, 124px);
          font-weight: 700; line-height: 0.88;
          letter-spacing: -0.045em; text-transform: uppercase;
          color: #0A0A0A; margin: 0 0 36px;
        }

        /* ── Three pillars ── */
        .hp-pillars { display: grid; grid-template-columns: repeat(3, 1fr); }

        /* ── Solutions rows ── */
        .hp-sol-row {
          display: grid;
          grid-template-columns: 72px 1fr 1fr;
          gap: 24px; align-items: start;
          padding: clamp(28px, 3.5vw, 44px) ${PH};
          border-top: 1px solid ${C.border};
        }

        /* ── Platform (AppPreview) ── */
        .hp-platform { display: grid; grid-template-columns: 56fr 44fr; }
        .hp-platform-dark {
          background: #0A0A0A; overflow: hidden;
          padding: clamp(40px, 5.5vw, 64px) clamp(28px, 3.5vw, 48px) 0;
          min-height: 540px;
        }
        .hp-platform-text {
          background: #F9FAFB;
          padding: clamp(56px, 7.5vw, 96px) clamp(40px, 5vw, 68px);
          display: flex; flex-direction: column; justify-content: center;
        }

        /* ── Network ── */
        .hp-network { display: grid; grid-template-columns: 44fr 56fr; }

        /* ── Hover states ── */
        .hp-btn-p:hover  { background: ${C.blueHover} !important; }
        .hp-btn-o:hover  { background: ${C.bgSecondary} !important; }
        .hp-art:hover    { background: #FAFAFA !important; }
        .hp-pcta:hover   { color: ${C.dark} !important; }
        .hp-scta:hover   { color: ${C.blue} !important; }
        .hp-gcta:hover   { opacity: 0.7; }

        /* ── Coming Soon badge ── */
        .hp-badge {
          display: inline-block;
          font-size: 9px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
          color: ${C.blue}; background: rgba(37,99,235,0.07);
          border: 1px solid rgba(37,99,235,0.18);
          padding: 2px 8px; border-radius: 4px;
        }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .hp-pillars      { grid-template-columns: 1fr !important; }
          .hp-sol-row      { grid-template-columns: 1fr !important; }
          .hp-platform     { display: flex !important; flex-direction: column !important; }
          .hp-platform-dark { min-height: 280px !important; }
          .hp-network      { display: flex !important; flex-direction: column !important; }
          .hp-intel-cards  { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <Navbar />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ HERO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section style={{ minHeight: '100svh', display: 'flex', alignItems: 'center', borderBottom: `1px solid ${C.border}` }}>
        <div style={{
          padding: `clamp(80px, 10vw, 140px) ${PH} clamp(64px, 8vw, 96px)`,
          maxWidth: SECTION.maxW, margin: '0 auto', width: '100%',
        }}>

          {/* Eyebrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 44 }}>
            <div style={{ width: 20, height: 1.5, background: C.blue, flexShrink: 0 }} />
            <span style={{ ...T.label, color: C.blue }}>Football Intelligence Platform</span>
          </div>

          {/* Headline */}
          <h1 className="hp-hed">
            Football<br />
            <span style={{ color: C.blue }}>Intelligence</span><br />
            For the<br />
            Modern Game.
          </h1>

          {/* Sub */}
          <p style={{ ...T.bodyLg, color: C.textSecondary, maxWidth: 480, margin: '0 0 48px', lineHeight: 1.85 }}>
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
          <div key={p.tag} style={{
            padding: `clamp(48px, 6vw, 72px) clamp(36px, 4.5vw, 56px)`,
            borderRight: i < PILLARS.length - 1 ? `1px solid ${C.border}` : 'none',
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
              <span style={{ ...T.label, color: C.blue }}>{p.tag}</span>
              {p.badge && <span className="hp-badge">{p.badge}</span>}
            </div>
            <h2 style={{ fontFamily: FONT.display, fontSize: 'clamp(20px, 2.5vw, 26px)', fontWeight: 700, color: C.dark, margin: '0 0 16px', letterSpacing: '-0.025em', textTransform: 'uppercase', lineHeight: 1.1 }}>
              {p.title}
            </h2>
            <p style={{ ...T.small, color: C.textSecondary, margin: '0 0 32px', flex: 1, lineHeight: 1.85 }}>
              {p.body}
            </p>
            <Link href={p.href} className="hp-pcta" style={{ ...T.label, color: C.textMuted, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 7, transition: 'color 0.15s' }}>
              {p.cta} <ArrowRight size={10} />
            </Link>
          </div>
        ))}
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━ SOLUTIONS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section style={{ borderBottom: `1px solid ${C.border}` }}>

        {/* Header */}
        <div style={{
          padding: `clamp(48px, 6vw, 64px) ${PH} clamp(28px, 3.5vw, 36px)`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 20, height: 1.5, background: C.blue, flexShrink: 0 }} />
            <span style={{ ...T.label, color: C.blue }}>Solutions</span>
          </div>
          <Link href="/solutions" style={{ ...T.label, color: C.textMuted, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
            View all solutions <ArrowRight size={10} />
          </Link>
        </div>

        {/* Numbered rows */}
        {SOLUTIONS.map(s => (
          <div key={s.audience} className="hp-sol-row">
            {/* Number */}
            <div style={{ paddingTop: 4 }}>
              <span style={{ fontFamily: FONT.display, fontSize: 11, fontWeight: 700, color: C.border, letterSpacing: '0.1em' }}>
                {s.num}
              </span>
            </div>
            {/* Audience + service tags */}
            <div>
              <h3 style={{ fontFamily: FONT.display, fontSize: 'clamp(18px, 2.5vw, 24px)', fontWeight: 700, color: C.dark, margin: '0 0 14px', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
                {s.audience}
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', rowGap: 4 }}>
                {s.services.map((svc, j) => (
                  <span key={svc} style={{ display: 'inline-flex', alignItems: 'center' }}>
                    <span style={{ ...T.small, color: C.textSecondary }}>{svc}</span>
                    {j < s.services.length - 1 && (
                      <span style={{ color: C.border, margin: '0 10px', fontSize: 13 }}>·</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
            {/* Description + CTA */}
            <div style={{ paddingLeft: 'clamp(0px, 2vw, 20px)' }}>
              <p style={{ ...T.small, color: C.textSecondary, margin: '0 0 20px', lineHeight: 1.85 }}>
                {s.desc}
              </p>
              <Link href="/solutions" className="hp-scta" style={{ ...T.label, color: C.textMuted, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'color 0.15s' }}>
                Learn more <ArrowRight size={10} />
              </Link>
            </div>
          </div>
        ))}

        <div style={{ height: 'clamp(28px, 3.5vw, 44px)' }} />
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━ LATEST INTELLIGENCE ━━━━━━━━━━━━━━━━━━━━━ */}
      <section style={{ borderBottom: `1px solid ${C.border}` }}>

        {/* Header */}
        <div style={{
          padding: `clamp(48px, 6vw, 64px) ${PH} clamp(28px, 3.5vw, 36px)`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 20, height: 1.5, background: C.blue, flexShrink: 0 }} />
            <span style={{ ...T.label, color: C.blue }}>Intelligence</span>
          </div>
          <Link href="/intelligence" style={{ ...T.label, color: C.textMuted, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
            View all <ArrowRight size={10} />
          </Link>
        </div>

        {/* Featured article — full width strip */}
        <Link href="/intelligence" className="hp-art" style={{
          display: 'block', textDecoration: 'none',
          padding: `clamp(32px, 4vw, 52px) ${PH}`,
          borderTop: `1px solid ${C.border}`,
          background: '#fff', transition: 'background 0.15s',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <span style={{ ...T.label, color: C.blue }}>{ARTICLES[0].category}</span>
            <span className="hp-badge">Coming Soon</span>
          </div>
          <h3 style={{ fontFamily: FONT.display, fontSize: 'clamp(20px, 2.8vw, 30px)', fontWeight: 700, color: C.dark, margin: '0 0 14px', letterSpacing: '-0.025em', textTransform: 'uppercase', lineHeight: 1.1, maxWidth: 680 }}>
            {ARTICLES[0].title}
          </h3>
          <p style={{ ...T.body, color: C.textSecondary, margin: 0, maxWidth: 520, lineHeight: 1.8 }}>
            {ARTICLES[0].excerpt}
          </p>
        </Link>

        {/* Two cards */}
        <div className="hp-intel-cards" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderTop: `1px solid ${C.border}` }}>
          {ARTICLES.slice(1).map((a, i) => (
            <Link key={a.title} href="/intelligence" className="hp-art" style={{
              display: 'block', textDecoration: 'none',
              padding: `clamp(28px, 3.5vw, 44px) ${PH}`,
              background: '#fff', transition: 'background 0.15s',
              borderLeft: i === 1 ? `1px solid ${C.border}` : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <span style={{ ...T.label, color: C.blue }}>{a.category}</span>
                <span className="hp-badge">Coming Soon</span>
              </div>
              <h3 style={{ ...T.h3, color: C.dark, margin: '0 0 10px' }}>
                {a.title}
              </h3>
              <p style={{ ...T.small, color: C.textSecondary, margin: 0, lineHeight: 1.8 }}>
                {a.excerpt}
              </p>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div style={{ padding: `clamp(24px, 3vw, 36px) ${PH}`, borderTop: `1px solid ${C.border}` }}>
          <Link href="/intelligence" className="hp-gcta" style={{ ...BTN.ghost }}>
            Explore all Intelligence <ArrowRight size={11} />
          </Link>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━ POLARIS OS ━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="hp-platform" style={{ borderBottom: `1px solid ${C.border}` }}>

        {/* AppPreview — dark left panel */}
        <div className="hp-platform-dark">
          <AppPreview />
        </div>

        {/* Text — light right panel */}
        <div className="hp-platform-text">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
            <div style={{ width: 20, height: 1.5, background: C.blue, flexShrink: 0 }} />
            <span style={{ ...T.label, color: C.blue }}>Polaris OS</span>
            <span className="hp-badge">In Development</span>
          </div>
          <h2 style={{ fontFamily: FONT.display, fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, color: C.dark, margin: '0 0 20px', letterSpacing: '-0.035em', textTransform: 'uppercase', lineHeight: 1.05 }}>
            Our Tools.<br />Built for<br />Football.
          </h2>
          <p style={{ ...T.body, color: C.textSecondary, maxWidth: 320, margin: '0 0 40px', lineHeight: 1.85 }}>
            Polaris OS is our proprietary football operating system — CRM, scouting pipeline, player and club databases, AI assistant, and workflow automation. Built for the way modern football professionals actually work.
          </p>
          <Link href="/login" className="hp-btn-p" style={{ ...BTN.primary, width: 'fit-content' }}>
            Access Platform <ArrowRight size={13} />
          </Link>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ NETWORK ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="hp-network" style={{ borderBottom: `1px solid ${C.border}` }}>

        {/* Headline — left column */}
        <div style={{ padding: `clamp(64px, 8vw, 96px) ${PH}`, borderRight: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 36 }}>
            <div style={{ width: 20, height: 1.5, background: C.blue, flexShrink: 0 }} />
            <span style={{ ...T.label, color: C.blue }}>Network</span>
          </div>
          <h2 style={{ fontFamily: FONT.display, fontSize: 'clamp(32px, 4.5vw, 56px)', fontWeight: 700, color: C.dark, margin: 0, letterSpacing: '-0.04em', textTransform: 'uppercase', lineHeight: 0.9 }}>
            Inside the<br />Absolut<br />Football<br />Network.
          </h2>
        </div>

        {/* Body — right column */}
        <div style={{ padding: `clamp(64px, 8vw, 96px) ${PH}`, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p style={{ ...T.bodyLg, color: C.textSecondary, margin: '0 0 24px', lineHeight: 1.85 }}>
            Polaris operates within a global network of scouts, analysts, recruiters, and football professionals. Our collaboration with the Absolut Football Network gives clients access to intelligence and relationships that span clubs, academies, and sporting organizations across Europe and beyond.
          </p>
          <p style={{ ...T.bodyLg, color: C.textSecondary, margin: '0 0 40px', lineHeight: 1.85 }}>
            We don&apos;t promise transfers. We provide the intelligence and professional network that makes better decisions possible.
          </p>
          <Link href="/network" className="hp-gcta" style={{ ...BTN.ghost }}>
            About the Network <ArrowRight size={11} />
          </Link>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ CTA ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section style={{ background: C.dark, padding: `clamp(80px, 10vw, 120px) ${PH}` }}>
        <div style={{ maxWidth: 640 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40 }}>
            <div style={{ width: 20, height: 1.5, background: C.blue, flexShrink: 0 }} />
            <span style={{ ...T.label, color: C.blue }}>Work With Polaris</span>
          </div>
          <h2 style={{ fontFamily: FONT.display, fontSize: 'clamp(40px, 6vw, 76px)', fontWeight: 700, color: '#fff', margin: '0 0 24px', letterSpacing: '-0.04em', textTransform: 'uppercase', lineHeight: 0.9 }}>
            Ready to make<br />better football<br /><span style={{ color: C.blue }}>decisions?</span>
          </h2>
          <p style={{ ...T.body, color: C.textInverseDim, margin: '0 0 44px', maxWidth: 380, lineHeight: 1.85 }}>
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
