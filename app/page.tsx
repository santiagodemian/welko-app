import type { CSSProperties } from 'react'
import Link from 'next/link'
import { Suspense } from 'react'
import {
  ArrowRight, Globe2, Users, Building2, Trophy,
  BarChart3, Handshake, Zap, Shield, FileText,
} from 'lucide-react'
import { Navbar }        from '@/components/layout/Navbar'
import { Footer }        from '@/components/layout/Footer'
import { SectionLabel }  from '@/components/ui/SectionLabel'
import { AppPreview }    from '@/components/ui/AppPreview'
import { RefTracker }    from '@/components/layout/RefTracker'
import { C, BTN, FONT } from '@/lib/ds'

const CLUBS = [
  'BVB', 'Ajax', 'Monaco', 'Barcelona', 'Sporting CP',
  'Wolves', 'FC Dallas', 'Porto', 'Benfica', 'Atlético',
]

const STATS = [
  { Icon: Globe2,    value: '50+',  label: 'Countries'        },
  { Icon: Users,     value: '300+', label: 'Players'          },
  { Icon: Building2, value: '200+', label: 'Clubs'            },
  { Icon: Trophy,    value: '15+',  label: 'Years Experience' },
]

const SERVICES = [
  { Icon: Shield,   title: 'Career Management',    desc: 'Strategic planning for long-term success. From emerging talent to elite professional.' },
  { Icon: FileText, title: 'Contract Negotiation', desc: 'Maximising value. Protecting your future. Expert representation at every table.'      },
  { Icon: Globe2,   title: 'Club Connections',     desc: 'A global network spanning 50+ countries. Opening the right doors at the right time.'   },
  { Icon: Trophy,   title: 'Personal Branding',    desc: 'Premium partnerships, media strategy and athlete brand development.'                   },
]

const CRM_FEATURES = [
  { Icon: BarChart3, label: 'Pipeline Management',  desc: 'Track every negotiation from first contact to signed contract.' },
  { Icon: Globe2,    label: 'Global Network',        desc: 'Club and scout database spanning 50+ countries.'              },
  { Icon: Handshake, label: 'Contract Intelligence', desc: 'Monitor expirations and act before the window closes.'        },
  { Icon: Zap,       label: 'AI Insights',           desc: 'Smart alerts keep your agency one step ahead.'               },
]

const CONTACT_TYPES = [
  { label: 'Players',           desc: 'Start your journey with us.'   },
  { label: 'Clubs',             desc: 'Build winning partnerships.'    },
  { label: 'Partnerships',      desc: 'Create opportunities together.' },
  { label: 'General Inquiries', desc: "We're here to help."           },
]

/* Heading style used in every split section */
const SH: CSSProperties = {
  fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif',
  fontSize:   'clamp(38px, 4.8vw, 60px)',
  fontWeight: 700,
  lineHeight: 0.92,
  letterSpacing: '-0.035em',
  textTransform: 'uppercase',
  margin: 0,
}

export default function HomePage() {
  return (
    <div style={{ fontFamily: FONT.sans, background: '#fff', minHeight: '100vh' }}>
      <style>{`
        /* ─── Hero ─── */
        .hero-grid { display: grid; grid-template-columns: 45fr 55fr; min-height: 100svh; }
        .hero-text {
          padding: clamp(100px,12vw,160px) clamp(44px,5.5vw,88px) clamp(80px,8vw,120px);
          display: flex; flex-direction: column; justify-content: center; background: #fff;
        }
        .hero-hed {
          font-family: var(--font-space-grotesk), system-ui, sans-serif;
          font-size: clamp(62px, 8.5vw, 106px);
          font-weight: 700; line-height: 0.88;
          letter-spacing: -0.04em; text-transform: uppercase; margin: 0;
        }

        /* ─── Stats grid ─── */
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); }
        .stat-cell  { border-right: 1px solid rgba(255,255,255,0.07); }
        .stat-cell:last-child { border-right: none !important; }

        /* ─── Split sections (services / contact) ─── */
        /* Full-width section: absolute photo behind, white coded panel on left (38%).
           The photo fills 100% × 100% of the section. The white panel covers the
           left 38% — exactly matching the text-panel proportion in every mockup image,
           so the photo crop always shows the right (photography) portion. */
        .split-wrap  { position: relative; overflow: hidden; }
        .split-photo {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover; object-position: center top;
        }
        .split-panel {
          position: relative; z-index: 1;
          width: 38%; background: #fff;
          padding: clamp(72px,9vw,112px) clamp(44px,5vw,84px);
          min-height: 620px;
          display: flex; flex-direction: column; justify-content: center;
        }

        /* ─── CRM section ─── */
        .crm-grid  { display: grid; grid-template-columns: 56fr 44fr; }
        .crm-dark  {
          background: #0A0A0A; overflow: hidden; position: relative;
          padding: clamp(40px,5vw,64px) clamp(36px,4vw,56px) 0;
          min-height: 620px;
        }
        .crm-text  {
          background: #F9FAFB;
          padding: clamp(72px,9vw,112px) clamp(44px,5vw,80px);
          display: flex; flex-direction: column; justify-content: center;
        }

        /* ─── Responsive ─── */
        @media (max-width: 1024px) {
          .hero-grid { display: flex !important; flex-direction: column !important; }
          .hero-text { padding: 80px 32px 56px !important; }
          .hero-img  { min-height: 56vw !important; order: -1; }
          .hero-hed  { font-size: clamp(52px,12vw,80px) !important; }
        }
        @media (max-width: 600px) {
          .hero-text { padding: 64px 20px 48px !important; }
          .hero-img  { min-height: 260px !important; }
        }
        @media (max-width: 900px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .stat-cell:nth-child(2n) { border-right: none !important; }
          .split-wrap  { display: flex !important; flex-direction: column !important; }
          .split-photo { position: relative !important; inset: unset !important; height: 300px !important; width: 100% !important; }
          .split-panel { width: 100% !important; min-height: 0 !important; }
          .crm-grid { display: flex !important; flex-direction: column !important; }
          .crm-dark { min-height: 280px !important; }
          .crm-text { padding: 56px 24px !important; }
        }
        @media (max-width: 600px) {
          .split-panel { padding: 48px 20px !important; }
        }

        /* ─── Marquee ─── */
        @keyframes ticker { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        .ticker { animation: ticker 32s linear infinite; }
        .ticker:hover { animation-play-state: paused; }

        /* ─── Hover ─── */
        .btn-primary:hover { background: #1D4ED8 !important; }
        .btn-outline:hover  { background: #F9FAFB  !important; }
        .ghost-link:hover   { opacity: .65; }
      `}</style>

      <Navbar />
      <Suspense fallback={null}><RefTracker /></Suspense>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━ HERO ━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="hero-grid">

        {/* Left — coded text */}
        <div className="hero-text">
          <SectionLabel marginBottom={44}>Guiding Football Careers</SectionLabel>

          <h1 className="hero-hed" style={{ color: '#0A0A0A' }}>Talent.</h1>
          <h1 className="hero-hed" style={{ color: '#0A0A0A', marginTop: 8 }}>Opportunity.</h1>
          <h1 className="hero-hed" style={{ color: C.blue,    marginTop: 8, marginBottom: 44 }}>Worldwide.</h1>

          <p style={{ fontSize: 16, lineHeight: 1.75, color: '#4B5563', maxWidth: 360, margin: '0 0 44px', fontFamily: FONT.sans }}>
            We represent football players worldwide and connect them with the right
            opportunities to achieve their dreams.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/services" className="btn-primary" style={{ ...BTN.primary }}>
              Our Services <ArrowRight size={13} />
            </Link>
            <Link href="/about" className="btn-outline" style={{ ...BTN.outline }}>
              About Polaris <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Right — hero photograph
            At 100svh height the image scales tall enough that objectPosition:right
            clips to the player+compass area (the right ~58% of the composite image). */}
        <div className="hero-img" style={{ position: 'relative', overflow: 'hidden', minHeight: '100svh' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero-home.jpeg"
            alt=""
            aria-hidden="true"
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'right center',
            }}
          />
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━ TRUSTED BY ━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, background: '#fff', overflow: 'hidden', padding: '20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>

          <div style={{ padding: '0 clamp(24px,4vw,64px)', flexShrink: 0 }}>
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9CA3AF', fontFamily: FONT.sans, margin: 0, lineHeight: 1.8 }}>
              Trusted by clubs<br />around the world
            </p>
          </div>

          <div style={{ width: 1, height: 32, background: C.border, flexShrink: 0 }} />

          <div style={{ flex: 1, overflow: 'hidden', minWidth: 0 }}>
            <div className="ticker" style={{ display: 'flex', gap: 64, width: 'max-content', padding: '0 32px' }}>
              {[...CLUBS, ...CLUBS].map((c, i) => (
                <span key={i} style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C8CDD3', fontFamily: FONT.sans, whiteSpace: 'nowrap' }}>
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div style={{ width: 1, height: 32, background: C.border, flexShrink: 0 }} />

          <div style={{ padding: '0 clamp(20px,3vw,48px)', flexShrink: 0 }}>
            <Link href="/about" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.blue, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, fontFamily: FONT.sans, whiteSpace: 'nowrap' }}>
              View Partners <ArrowRight size={10} />
            </Link>
          </div>

        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━ STATS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section style={{ background: '#0A0A0A' }}>
        <div className="stats-grid">
          {STATS.map(({ Icon, value, label }, i) => (
            <div key={label} className="stat-cell" style={{ padding: 'clamp(48px,6vw,80px) clamp(32px,3.5vw,56px)', display: 'flex', flexDirection: 'column', gap: 22 }}>
              <Icon size={22} color="rgba(255,255,255,0.22)" strokeWidth={1.5} />
              <div>
                <p style={{ fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif', fontSize: 'clamp(44px,5.5vw,72px)', fontWeight: 700, lineHeight: 1, letterSpacing: '-0.04em', color: '#fff', margin: '0 0 10px' }}>
                  {value}
                </p>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', margin: 0, fontFamily: FONT.sans }}>
                  {label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━ FULL-SERVICE REPRESENTATION ━━━━━━━━━━━━ */}
      {/* The composite mockup image fills 100% of the section.
          The white panel (38% width) covers the image's left text portion.
          Because it's the same 38% ratio as the mockup, the crop is always correct. */}
      <section className="split-wrap" style={{ borderTop: `1px solid ${C.border}` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="split-photo" src="/diseño2.jpeg" alt="" aria-hidden="true" />

        <div className="split-panel">
          <SectionLabel marginBottom={32}>What We Do</SectionLabel>

          <h2 style={{ ...SH, color: '#0A0A0A', marginBottom: 4 }}>Full-Service</h2>
          <h2 style={{ ...SH, color: C.blue,    marginBottom: 28 }}>Representation</h2>

          <p style={{ fontSize: 14, color: '#4B5563', lineHeight: 1.8, maxWidth: 360, margin: '0 0 40px', fontFamily: FONT.sans }}>
            From career planning to contract negotiation, we are with our players every step of the way.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
            {SERVICES.map(({ Icon, title, desc }) => (
              <div key={title} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <span style={{ flexShrink: 0, display: 'flex', marginTop: 1 }}>
                  <Icon size={15} color={C.blue} />
                </span>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#0A0A0A', margin: '0 0 4px', fontFamily: FONT.sans }}>{title}</p>
                  <p style={{ fontSize: 13, color: '#6B7280', margin: 0, lineHeight: 1.65, fontFamily: FONT.sans }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 44 }}>
            <Link href="/services" className="ghost-link" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#0A0A0A', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 7, borderBottom: '1.5px solid #0A0A0A', paddingBottom: 2, fontFamily: FONT.sans }}>
              View All Services <ArrowRight size={11} />
            </Link>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━ PLATFORM (CRM) ━━━━━━━━━━━━━━━━━━━━ */}
      {/* CRM screenshot shown as a contained product preview — not cropped.
          The image starts from the top of the dark panel, overflow clips the bottom. */}
      <section className="crm-grid" style={{ borderTop: `1px solid ${C.border}` }}>

        {/* Left — dark panel + real dashboard component (never a screenshot) */}
        <div className="crm-dark">
          <div style={{ padding: 'clamp(32px,4vw,48px) clamp(24px,3vw,40px) 0' }}>
            <AppPreview />
          </div>
        </div>

        {/* Right — text */}
        <div className="crm-text">
          <SectionLabel marginBottom={32}>Our Platform</SectionLabel>

          <h2 style={{ ...SH, color: '#0A0A0A', marginBottom: 4 }}>Built for</h2>
          <h2 style={{ ...SH, color: C.blue,    marginBottom: 28 }}>Football Agents</h2>

          <p style={{ fontSize: 14, color: '#4B5563', lineHeight: 1.8, maxWidth: 340, margin: '0 0 40px', fontFamily: FONT.sans }}>
            Polaris agents operate with a purpose-built CRM designed for the complexity of modern football representation.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 44 }}>
            {CRM_FEATURES.map(({ Icon, label, desc }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <span style={{ flexShrink: 0, display: 'flex', marginTop: 1 }}>
                  <Icon size={15} color={C.blue} />
                </span>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#0A0A0A', margin: '0 0 3px', fontFamily: FONT.sans }}>{label}</p>
                  <p style={{ fontSize: 13, color: '#6B7280', margin: 0, lineHeight: 1.65, fontFamily: FONT.sans }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <Link href="/login" className="btn-primary" style={{ ...BTN.primary, width: 'fit-content' }}>
            Access the Platform <ArrowRight size={13} />
          </Link>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━ CONTACT CTA ━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="split-wrap" style={{ borderTop: `1px solid ${C.border}` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="split-photo" src="/diseño7.jpeg" alt="" aria-hidden="true" />

        <div className="split-panel">
          <SectionLabel marginBottom={32}>Get in Touch</SectionLabel>

          <h2 style={{ ...SH, color: '#0A0A0A', marginBottom: 4 }}>{"Let's Build"}</h2>
          <h2 style={{ ...SH, color: C.blue,    marginBottom: 4 }}>Your Future.</h2>
          <h2 style={{ ...SH, color: '#0A0A0A', marginBottom: 28 }}>Together.</h2>

          <p style={{ fontSize: 14, color: '#4B5563', lineHeight: 1.8, maxWidth: 340, margin: '0 0 40px', fontFamily: FONT.sans }}>
            Whether you are a player, club or partner, we are here to connect and create extraordinary opportunities.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 22, marginBottom: 44 }}>
            {CONTACT_TYPES.map(t => (
              <div key={t.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <span style={{ flexShrink: 0, width: 5, height: 5, borderRadius: '50%', background: '#D1D5DB', marginTop: 7, display: 'block' }} />
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#0A0A0A', margin: '0 0 3px', fontFamily: FONT.sans }}>{t.label}</p>
                  <p style={{ fontSize: 13, color: '#6B7280', margin: 0, fontFamily: FONT.sans }}>{t.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <Link href="/contact" className="btn-primary" style={{ ...BTN.primary, width: 'fit-content' }}>
            Contact Us <ArrowRight size={13} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
