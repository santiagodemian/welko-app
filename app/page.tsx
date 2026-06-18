import Link from 'next/link'
import { Suspense } from 'react'
import { ArrowRight, Shield, Users, FileText, Star, BarChart3, Globe2, Handshake, Zap } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { RefTracker } from '@/components/layout/RefTracker'
import { C, R, S, T, BTN, SECTION, FONT } from '@/lib/ds'

const CLUBS = ['BVB', 'Ajax', 'Monaco', 'Barcelona', 'Sporting CP', 'Wolves', 'FC Dallas', 'Porto', 'Benfica', 'Atlético', 'PSV', 'Juventus']

const STATS = [
  { value: '50+',  label: 'Countries'           },
  { value: '300+', label: 'Players Represented'  },
  { value: '200+', label: 'Club Partnerships'    },
  { value: '15+',  label: 'Years Experience'     },
]

const SERVICES = [
  { icon: Shield,   title: 'Career Management',   desc: 'Strategic planning for long-term success. From emerging talent to elite professional.' },
  { icon: FileText, title: 'Contract Negotiation', desc: 'Maximising value. Protecting your future. Expert representation at every table.' },
  { icon: Users,    title: 'Club Connections',     desc: 'A global network spanning 50+ countries. Opening the right doors at the right time.' },
  { icon: Star,     title: 'Personal Branding',    desc: 'Premium partnerships, media strategy and athlete brand development.' },
]

const PLATFORM_FEATURES = [
  { icon: BarChart3, label: 'Pipeline Management',  desc: 'Track every negotiation from first contact to signed contract.' },
  { icon: Globe2,    label: 'Global Network',        desc: 'Club and scout database spanning 50+ countries.' },
  { icon: Handshake, label: 'Contract Intelligence', desc: 'Monitor expirations and act before the window closes.' },
  { icon: Zap,       label: 'AI Insights',           desc: 'Smart alerts keep your agency one step ahead.' },
]

const CONTACT_TYPES = [
  { label: 'Players',           desc: 'Start your journey with us.'   },
  { label: 'Clubs',             desc: 'Build winning partnerships.'    },
  { label: 'Partnerships',      desc: 'Create opportunities together.' },
  { label: 'General Inquiries', desc: "We're here to help."           },
]

export default function HomePage() {
  return (
    <div style={{ fontFamily: FONT.sans, background: C.bgPrimary, minHeight: '100vh' }}>
      <style>{`
        .hero-grid  { display: grid; grid-template-columns: 55fr 45fr; min-height: 100vh; }
        .hero-left  { padding: clamp(80px,10vw,120px) ${SECTION.padH}; display: flex; flex-direction: column; justify-content: center; }
        @media (max-width: 1024px) {
          .hero-grid { display: flex !important; flex-direction: column !important; }
          .hero-left { padding: 72px 32px !important; }
          .hero-right { min-height: 55vw !important; }
        }
        @media (max-width: 600px) {
          .hero-left  { padding: 56px 20px !important; }
          .hero-right { min-height: 260px !important; }
        }
        .stats-grid { grid-template-columns: repeat(4, 1fr) !important; }
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .stat-cell:nth-child(even) { border-right: none !important; }
        }
        .svc-split { display: grid; grid-template-columns: 42fr 58fr; min-height: 560px; }
        @media (max-width: 900px) {
          .svc-split { display: flex !important; flex-direction: column !important; }
          .svc-right { min-height: 380px !important; }
        }
        .platform-split { display: grid; grid-template-columns: 54fr 46fr; min-height: 560px; }
        @media (max-width: 900px) {
          .platform-split { display: flex !important; flex-direction: column-reverse !important; }
          .platform-left  { padding: 56px 28px !important; }
          .platform-photo { min-height: 360px !important; }
        }
        @media (max-width: 600px) {
          .platform-left  { padding: 48px 20px !important; }
          .platform-photo { min-height: 260px !important; }
        }
        .platform-features { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        @media (max-width: 480px) { .platform-features { grid-template-columns: 1fr !important; } }
        .cta-split { display: grid; grid-template-columns: 42fr 58fr; min-height: 520px; }
        @media (max-width: 900px) {
          .cta-split { display: flex !important; flex-direction: column-reverse !important; }
          .cta-left  { padding: 56px 28px !important; }
          .cta-photo { min-height: 300px !important; }
        }
        @media (max-width: 600px) {
          .cta-left  { padding: 48px 20px !important; }
          .cta-photo { min-height: 240px !important; }
        }
        .btn-ph:hover { background: ${C.blueHover} !important; }
        .btn-oh:hover { background: ${C.bgTertiary} !important; }
        .platform-card { transition: border-color 0.18s, box-shadow 0.18s; }
        .platform-card:hover { border-color: ${C.blue} !important; box-shadow: ${S.blue} !important; }
      `}</style>

      <Navbar />
      <Suspense fallback={null}><RefTracker /></Suspense>

      {/* ── HERO ── */}
      <section className="hero-grid">
        <div className="hero-left" style={{ background: C.bgPrimary }}>
          <SectionLabel marginBottom={44}>Guiding Football Careers</SectionLabel>
          <h1 style={{ ...T.hero, color: C.dark, margin: 0 }}>Talent.</h1>
          <h1 style={{ ...T.hero, color: C.dark, margin: '6px 0' }}>Opportunity.</h1>
          <h1 style={{ ...T.hero, color: C.blue, margin: '6px 0 52px' }}>Worldwide.</h1>
          <p style={{ ...T.bodyLg, color: '#4B5563', maxWidth: 380, margin: '0 0 48px' }}>
            We represent football players worldwide and connect them with the right opportunities to achieve their dreams.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/services" className="btn-ph" style={{ ...BTN.primary }}>Our Services <ArrowRight size={13} /></Link>
            <Link href="/about"    className="btn-oh" style={{ ...BTN.outline }}>About Polaris <ArrowRight size={13} /></Link>
          </div>
        </div>
        <div className="hero-right" style={{ position: 'relative', overflow: 'hidden', background: C.dark, minHeight: '100%' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/hero-home.jpeg" alt="" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'right center' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(255,255,255,0.08) 0%, transparent 35%)' }} />
        </div>
      </section>

      {/* ── TRUSTED BY ── */}
      <section style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: `22px ${SECTION.padH}`, background: C.bgSecondary, overflow: 'hidden' }}>
        <div style={{ maxWidth: SECTION.maxW, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 36, flexWrap: 'nowrap' }}>
          <p style={{ ...T.label, color: C.textMuted, margin: 0, flexShrink: 0, lineHeight: 1.6 }}>
            Trusted by clubs<br />worldwide
          </p>
          <div style={{ width: 1, height: 28, background: C.border, flexShrink: 0 }} />
          <div style={{ flex: 1, overflow: 'hidden', minWidth: 0 }}>
            <div className="polaris-marquee-track" style={{ display: 'flex', gap: 52, alignItems: 'center', whiteSpace: 'nowrap', width: 'max-content' }}>
              {[...CLUBS, ...CLUBS].map((club, i) => (
                <span key={i} style={{ ...T.label, color: '#C1C8D0' }}>{club}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background: C.dark }}>
        <div style={{ maxWidth: SECTION.maxW, margin: '0 auto' }}>
          <div className="stats-grid" style={{ display: 'grid' }}>
            {STATS.map((s, i) => (
              <div key={s.label} className="stat-cell" style={{
                padding: 'clamp(32px,4vw,56px) 40px',
                borderRight: i < STATS.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
              }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.blue, marginBottom: 10 }} />
                <p style={{ ...T.hero, color: C.textInverse, margin: '0 0 6px', fontSize: 'clamp(34px,4vw,54px)' }}>{s.value}</p>
                <p style={{ ...T.label, color: 'rgba(255,255,255,0.35)', margin: 0 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES SPLIT ── */}
      <section className="svc-split" style={{ borderTop: `1px solid ${C.border}` }}>
        <div style={{ padding: `${SECTION.padV} ${SECTION.padH}`, display: 'flex', flexDirection: 'column', justifyContent: 'center', background: C.bgPrimary }}>
          <SectionLabel marginBottom={28}>What We Do</SectionLabel>
          <h2 style={{ ...T.h1, color: C.dark, margin: '0 0 20px' }}>
            Full-Service<br /><span style={{ color: C.blue }}>Representation</span>
          </h2>
          <p style={{ ...T.body, color: C.textSecondary, margin: '0 0 36px', maxWidth: 360 }}>
            From career planning to contract negotiation, we are with our players every step of the way.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22, marginBottom: 40 }}>
            {SERVICES.map(s => (
              <div key={s.title} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{ width: 34, height: 34, borderRadius: R.button, background: C.blueDim, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                  <s.icon size={14} color={C.blue} />
                </div>
                <div>
                  <p style={{ ...T.label, color: C.dark, margin: '0 0 3px' }}>{s.title}</p>
                  <p style={{ ...T.small, color: C.textSecondary, margin: 0 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <Link href="/services" style={{ ...BTN.ghost, width: 'fit-content' }}>
            View All Services <ArrowRight size={12} />
          </Link>
        </div>
        <div className="svc-right" style={{ position: 'relative', overflow: 'hidden', background: C.dark, minHeight: 460 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/diseño2.jpeg" alt="" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(255,255,255,0.06) 0%, transparent 30%)' }} />
        </div>
      </section>

      {/* ── PLATFORM ── */}
      <section className="platform-split" style={{ borderTop: `1px solid ${C.border}`, background: C.bgSecondary }}>
        <div className="platform-photo" style={{ position: 'relative', overflow: 'hidden', background: C.darkDeep, minHeight: 460 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/polariscrmdesign.jpeg" alt="" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(5,5,5,0.15)' }} />
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '28%', background: `linear-gradient(to right, transparent, ${C.bgSecondary})` }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '22%', background: `linear-gradient(to top, ${C.bgSecondary}, transparent)` }} />
          <div style={{ position: 'absolute', top: 24, left: 24, zIndex: 1 }}>
            <span style={{ ...T.label, background: C.blue, color: C.blueFg, padding: '5px 12px', borderRadius: R.badge }}>Agent CRM</span>
          </div>
        </div>
        <div className="platform-left" style={{ padding: `${SECTION.padV} ${SECTION.padH}`, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <SectionLabel marginBottom={28}>Our Platform</SectionLabel>
          <h2 style={{ ...T.h1, color: C.dark, margin: '0 0 20px' }}>
            Built for<br /><span style={{ color: C.blue }}>Football Agents</span>
          </h2>
          <p style={{ ...T.body, color: C.textSecondary, margin: '0 0 32px', maxWidth: 360 }}>
            Polaris agents operate with a purpose-built CRM designed for the complexity of modern football representation.
          </p>
          <div className="platform-features" style={{ marginBottom: 40 }}>
            {PLATFORM_FEATURES.map(f => (
              <div key={f.label} className="platform-card" style={{
                background: C.bgPrimary, border: `1.5px solid ${C.border}`,
                borderRadius: R.card, padding: '15px 17px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
                  <div style={{ width: 28, height: 28, borderRadius: R.button, background: C.blueDim, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <f.icon size={13} color={C.blue} />
                  </div>
                  <span style={{ ...T.small, fontWeight: 700, color: C.dark }}>{f.label}</span>
                </div>
                <p style={{ ...T.caption, color: C.textMuted, margin: 0, paddingLeft: 38 }}>{f.desc}</p>
              </div>
            ))}
          </div>
          <Link href="/login" className="btn-ph" style={{ ...BTN.primary, width: 'fit-content' }}>
            Access the Platform <ArrowRight size={13} />
          </Link>
        </div>
      </section>

      {/* ── CONTACT CTA ── */}
      <section className="cta-split" style={{ borderTop: `1px solid ${C.border}` }}>
        <div className="cta-photo" style={{ position: 'relative', overflow: 'hidden', background: C.dark, minHeight: 440 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/diseño7.jpeg" alt="" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'right center' }} />
        </div>
        <div className="cta-left" style={{
          padding: `${SECTION.padV} ${SECTION.padH}`,
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          background: C.bgPrimary, borderLeft: `1px solid ${C.border}`,
        }}>
          <SectionLabel marginBottom={28}>Get in Touch</SectionLabel>
          <h2 style={{ ...T.h1, color: C.dark, margin: '0 0 20px' }}>
            {"Let's Build"}<br /><span style={{ color: C.blue }}>Your Future.</span><br />Together.
          </h2>
          <p style={{ ...T.body, color: C.textSecondary, margin: '0 0 32px', maxWidth: 340 }}>
            Whether you are a player, club or partner, we are here to connect and create extraordinary opportunities.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 36 }}>
            {CONTACT_TYPES.map(t => (
              <div key={t.label} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.border, flexShrink: 0 }} />
                <div>
                  <span style={{ ...T.label, color: C.dark }}>{t.label}</span>
                  <span style={{ ...T.small, color: C.textMuted, marginLeft: 8 }}>— {t.desc}</span>
                </div>
              </div>
            ))}
          </div>
          <Link href="/contact" className="btn-ph" style={{ ...BTN.primary, width: 'fit-content' }}>
            Contact Us <ArrowRight size={13} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
