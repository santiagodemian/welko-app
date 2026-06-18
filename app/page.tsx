import Link from 'next/link'
import { Suspense } from 'react'
import { ArrowRight, Shield, Users, FileText, Star } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { RefTracker } from '@/components/layout/RefTracker'

const N = '#0A0A0A'
const G = '#2563EB'

const CLUBS = ['BVB', 'Ajax', 'Monaco', 'Barcelona', 'Sporting CP', 'Wolves', 'FC Dallas', 'Porto', 'Benfica', 'Atlético', 'PSV', 'Juventus']

const STATS = [
  { value: '50+',  label: 'Countries'          },
  { value: '300+', label: 'Players Represented' },
  { value: '200+', label: 'Club Partnerships'   },
  { value: '15+',  label: 'Years Experience'    },
]

const SERVICES = [
  {
    icon: Shield,
    title: 'Career Management',
    desc: 'Strategic planning for long-term success. We guide players at every stage of their career, from emerging talent to elite professional.',
  },
  {
    icon: FileText,
    title: 'Contract Negotiation',
    desc: 'Maximising value. Protecting your future. Expert legal and commercial representation at every negotiating table.',
  },
  {
    icon: Users,
    title: 'Club Connections',
    desc: 'A global network spanning 50+ countries. We open the right doors at the right time, matching talent with clubs that fit.',
  },
  {
    icon: Star,
    title: 'Personal Branding',
    desc: 'Building your identity on and off the pitch. Premium partnerships, media strategy, and athlete brand development.',
  },
]

const CONTACT_TYPES = [
  { label: 'Players',          desc: 'Start your journey with us.' },
  { label: 'Clubs',            desc: 'Build winning partnerships.' },
  { label: 'Partnerships',     desc: 'Create opportunities together.' },
  { label: 'General Inquiries', desc: 'We\'re here to help.' },
]

export default function HomePage() {
  return (
    <div style={{ fontFamily: 'var(--font-montserrat), sans-serif', background: '#fff', minHeight: '100vh' }}>
      <style>{`
        /* ── Hero ── */
        .hero-grid { display: grid; grid-template-columns: 55fr 45fr; min-height: 100vh; }
        .hero-left  { padding: 100px 72px 80px; display: flex; flex-direction: column; justify-content: center; }
        @media (max-width: 1024px) {
          .hero-grid { display: flex !important; flex-direction: column !important; }
          .hero-left { padding: 72px 32px !important; }
          .hero-right { min-height: 55vw !important; }
        }
        @media (max-width: 600px) {
          .hero-left  { padding: 56px 20px !important; }
          .hero-right { min-height: 260px !important; }
        }

        /* ── Stats ── */
        .stats-grid { grid-template-columns: repeat(4, 1fr) !important; }
        @media (max-width: 768px)  { .stats-grid { grid-template-columns: repeat(2, 1fr) !important; } }

        /* ── Services split ── */
        .svc-split { display: grid; grid-template-columns: 42fr 58fr; min-height: 600px; }
        @media (max-width: 900px) {
          .svc-split { display: flex !important; flex-direction: column !important; }
          .svc-right { min-height: 420px !important; }
        }

        /* ── Contact CTA split ── */
        .cta-split { display: grid; grid-template-columns: 42fr 58fr; min-height: 560px; }
        @media (max-width: 900px) {
          .cta-split { display: flex !important; flex-direction: column-reverse !important; }
          .cta-left  { padding: 56px 28px !important; }
          .cta-photo { min-height: 360px !important; }
        }
        @media (max-width: 600px) {
          .cta-left  { padding: 48px 20px !important; }
          .cta-photo { min-height: 260px !important; }
        }

        /* ── Footer ── */
        .footer-link { transition: color 0.15s; }
        .footer-link:hover { color: rgba(255,255,255,0.7) !important; }

        /* ── Buttons ── */
        .btn-primary { transition: background 0.15s, transform 0.1s; }
        .btn-primary:hover { background: #1D4ED8 !important; }
        .btn-outline { transition: background 0.15s, color 0.15s; }
        .btn-outline:hover { background: rgba(0,0,0,0.05) !important; }
      `}</style>

      <Navbar />
      <Suspense fallback={null}><RefTracker /></Suspense>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="hero-grid">
        {/* Left — content */}
        <div className="hero-left">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 44 }}>
            <div style={{ width: 28, height: 1.5, background: G, flexShrink: 0 }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.16em', textTransform: 'uppercase' }}>
              Guiding Football Careers
            </span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: 'clamp(52px, 7.5vw, 96px)', fontWeight: 700, color: N, margin: 0, lineHeight: 0.92, letterSpacing: '-0.035em', textTransform: 'uppercase' }}>
            Talent.
          </h1>
          <h1 style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: 'clamp(52px, 7.5vw, 96px)', fontWeight: 700, color: N, margin: '4px 0', lineHeight: 0.92, letterSpacing: '-0.035em', textTransform: 'uppercase' }}>
            Opportunity.
          </h1>
          <h1 style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: 'clamp(52px, 7.5vw, 96px)', fontWeight: 700, color: G, margin: '4px 0 48px', lineHeight: 0.92, letterSpacing: '-0.035em', textTransform: 'uppercase' }}>
            Worldwide.
          </h1>

          <p style={{ fontSize: 16, color: '#4B5563', lineHeight: 1.75, maxWidth: 380, margin: '0 0 44px', fontWeight: 400 }}>
            We represent football players worldwide and connect them with the right opportunities to achieve their dreams.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/services" className="btn-primary" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: G, color: '#fff', padding: '14px 28px',
              borderRadius: 8, fontWeight: 600, fontSize: 12,
              textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>
              Our Services <ArrowRight size={13} />
            </Link>
            <Link href="/about" className="btn-outline" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'transparent', color: N, padding: '14px 28px',
              borderRadius: 8, fontWeight: 600, fontSize: 12,
              textDecoration: 'none', border: '1.5px solid #D1D5DB',
              letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>
              About Polaris <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Right — cinematic hero photo */}
        <div className="hero-right" style={{
          position: 'relative', overflow: 'hidden',
          background: '#0A0A0A', minHeight: '100%',
        }}>
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
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(255,255,255,0.12) 0%, transparent 40%)' }} />
        </div>
      </section>

      {/* ── TRUSTED BY ─────────────────────────────────────────────── */}
      <section style={{ borderTop: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB', padding: '22px 40px', background: '#FAFAFA', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 36, flexWrap: 'nowrap' }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.14em', textTransform: 'uppercase', margin: 0, flexShrink: 0, whiteSpace: 'nowrap', lineHeight: 1.5 }}>
            Trusted by clubs<br />worldwide
          </p>
          <div style={{ width: 1, height: 28, background: '#E5E7EB', flexShrink: 0 }} />
          <div style={{ flex: 1, overflow: 'hidden', minWidth: 0 }}>
            <div className="polaris-marquee-track" style={{ display: 'flex', gap: 52, alignItems: 'center', whiteSpace: 'nowrap', width: 'max-content' }}>
              {[...CLUBS, ...CLUBS].map((club, i) => (
                <span key={i} style={{ fontSize: 11, fontWeight: 700, color: '#C1C8D0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {club}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────── */}
      <section style={{ background: N, padding: 'clamp(48px,6vw,80px) 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="stats-grid" style={{ display: 'grid', gap: 0 }}>
            {STATS.map((s, i) => (
              <div key={s.label} style={{
                padding: '36px 40px',
                borderRight: i < STATS.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: G, flexShrink: 0 }} />
                </div>
                <p style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: 'clamp(38px, 5vw, 58px)', fontWeight: 700, color: '#fff', margin: '0 0 6px', letterSpacing: '-0.03em', lineHeight: 1 }}>
                  {s.value}
                </p>
                <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.14em', textTransform: 'uppercase', margin: 0 }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FULL-SERVICE REPRESENTATION ───────────────────────────── */}
      <section className="svc-split">
        {/* Left — services content */}
        <div style={{ padding: 'clamp(56px,7vw,96px) clamp(32px,5vw,80px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
            <div style={{ width: 24, height: 1.5, background: G }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: G, letterSpacing: '0.14em', textTransform: 'uppercase' }}>What We Do</span>
          </div>

          <h2 style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: 'clamp(30px, 3.8vw, 46px)', fontWeight: 700, color: N, margin: '0 0 20px', letterSpacing: '-0.025em', textTransform: 'uppercase', lineHeight: 1.05 }}>
            Full-Service<br /><span style={{ color: G }}>Representation</span>
          </h2>

          <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.75, margin: '0 0 36px', maxWidth: 360 }}>
            From career planning to contract negotiation, we are with our players every step of the way.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 36 }}>
            {SERVICES.map(s => (
              <div key={s.title} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: `${G}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                  <s.icon size={14} color={G} />
                </div>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: N, margin: '0 0 3px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    {s.title}
                  </p>
                  <p style={{ fontSize: 13, color: '#6B7280', margin: 0, lineHeight: 1.65 }}>
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Link href="/services" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: N, textDecoration: 'none', letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: '1.5px solid #0A0A0A', paddingBottom: 2, width: 'fit-content' }}>
            View All Services <ArrowRight size={12} />
          </Link>
        </div>

        {/* Right — photo */}
        <div className="svc-right" style={{ position: 'relative', overflow: 'hidden', background: '#0A0A0A', minHeight: 500 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/diseño2.jpeg"
            alt=""
            aria-hidden="true"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(255,255,255,0.06) 0%, transparent 30%)' }} />
        </div>
      </section>

      {/* ── CONTACT CTA ──────────────────────────────────────────── */}
      <section className="cta-split">
        {/* Left — photo */}
        <div className="cta-photo" style={{ position: 'relative', overflow: 'hidden', background: '#0A0A0A', minHeight: 480 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/diseño7.jpeg"
            alt=""
            aria-hidden="true"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'right center' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to left, rgba(255,255,255,0.04) 0%, transparent 40%)' }} />
        </div>

        {/* Right — CTA content */}
        <div className="cta-left" style={{ padding: 'clamp(56px,7vw,96px) clamp(32px,5vw,80px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: '#fff', borderLeft: '1px solid #E5E7EB' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
            <div style={{ width: 24, height: 1.5, background: G }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: G, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Get in Touch</span>
          </div>

          <h2 style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 700, color: N, margin: '0 0 20px', letterSpacing: '-0.025em', textTransform: 'uppercase', lineHeight: 1.05 }}>
            {"Let's Build"}<br /><span style={{ color: G }}>Your Future.</span><br />Together.
          </h2>

          <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.75, margin: '0 0 36px', maxWidth: 340 }}>
            Whether you are a player, club or partner, we are here to connect and create extraordinary opportunities.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 36 }}>
            {CONTACT_TYPES.map(t => (
              <div key={t.label} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#D1D5DB', flexShrink: 0 }} />
                <div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: N, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    {t.label}
                  </span>
                  <span style={{ fontSize: 13, color: '#9CA3AF', marginLeft: 8 }}>
                    — {t.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <Link href="/contact" className="btn-primary" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: G, color: '#fff', padding: '13px 26px',
            borderRadius: 8, fontWeight: 600, fontSize: 12,
            textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase',
            width: 'fit-content',
          }}>
            Contact Us <ArrowRight size={13} />
          </Link>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer style={{ background: '#050505', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '60px 40px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 40, marginBottom: 56 }}>

            <div style={{ maxWidth: 240 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/polariswhitelogo.jpeg" alt="Polaris Football" style={{ height: 44, objectFit: 'contain', marginBottom: 20 }} />
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.28)', lineHeight: 1.7, margin: 0 }}>
                Elite football representation connecting talent with opportunity across five continents.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 56, flexWrap: 'wrap' }}>
              {[
                {
                  heading: 'Agency',
                  links: [
                    { label: 'About',    href: '/about'    },
                    { label: 'Services', href: '/services' },
                    { label: 'Players',  href: '/players'  },
                    { label: 'Blog',     href: '/blog'     },
                    { label: 'Contact',  href: '/contact'  },
                  ],
                },
                {
                  heading: 'Client',
                  links: [
                    { label: 'Client Login', href: '/login'      },
                    { label: 'Agent CRM',    href: '/dashboard'  },
                  ],
                },
                {
                  heading: 'Legal',
                  links: [
                    { label: 'Privacy', href: '/privacidad' },
                    { label: 'Terms',   href: '/terminos'   },
                    { label: 'Refunds', href: '/reembolsos' },
                  ],
                },
              ].map(col => (
                <div key={col.heading}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 16px' }}>
                    {col.heading}
                  </p>
                  {col.links.map(l => (
                    <Link key={l.href + l.label} href={l.href} className="footer-link" style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.38)', textDecoration: 'none', margin: '0 0 10px', letterSpacing: '0.01em' }}>
                      {l.label}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.18)', margin: 0 }}>
              © {new Date().getFullYear()} Polaris Football. All rights reserved.
            </p>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.12)', margin: 0, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              Talent. Opportunity. Worldwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
