import Link from 'next/link'
import { ArrowRight, Globe, Shield, Star, Users } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { C, R, T, BTN, SECTION, FONT } from '@/lib/ds'

const N = C.dark
const G = C.blue

const VALUES = [
  {
    icon: Shield,
    title: 'Integrity',
    desc: 'We represent every player with total transparency and honesty. No hidden agendas — only the best outcomes for our clients.',
  },
  {
    icon: Star,
    title: 'Excellence',
    desc: 'We hold ourselves to the highest standard, from the first conversation to the final signature on every contract.',
  },
  {
    icon: Globe,
    title: 'Global Vision',
    desc: 'Football is a global game. Our network spans 50+ countries, opening doors others cannot reach.',
  },
  {
    icon: Users,
    title: 'Long-Term Partnership',
    desc: 'We build careers, not just deals. Our relationship with every player is a lifelong commitment.',
  },
]

const MILESTONES = [
  { year: '2010', event: 'Polaris Football founded in Madrid' },
  { year: '2013', event: 'First player transfer to a top-5 European league' },
  { year: '2016', event: 'Expanded network to South America and Africa' },
  { year: '2019', event: 'Surpassed 100 represented players globally' },
  { year: '2022', event: 'Opened offices in London and Dubai' },
  { year: '2024', event: '300+ players, 200+ club partnerships, 50+ countries' },
]

export default function AboutPage() {
  return (
    <div style={{ fontFamily: 'var(--font-montserrat), sans-serif', background: '#fff', minHeight: '100vh' }}>
      <style>{`
        .about-hero { display: grid; grid-template-columns: 52fr 48fr; min-height: 80vh; }
        .about-story { display: grid; grid-template-columns: 55fr 45fr; gap: 0; }
        @media (max-width: 900px) {
          .about-hero  { display: flex !important; flex-direction: column !important; }
          .about-hero-photo { min-height: 400px !important; }
          .about-story { display: flex !important; flex-direction: column !important; }
          .about-story-photo { min-height: 360px !important; }
        }
        @media (max-width: 600px) {
          .about-hero-photo { min-height: 260px !important; }
        }
        .values-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: #E5E7EB; }
        @media (max-width: 900px) { .values-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 500px) { .values-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      <Navbar />

      {/* ── HERO ── */}
      <section className="about-hero">
        {/* Left — content */}
        <div style={{ background: N, padding: 'clamp(72px,8vw,112px) clamp(32px,5vw,80px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <div style={{ width: 24, height: 1.5, background: G }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: G, letterSpacing: '0.16em', textTransform: 'uppercase' }}>About Polaris</span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 700, color: '#fff', margin: '0 0 24px', letterSpacing: '-0.03em', textTransform: 'uppercase', lineHeight: 1.02 }}>
            Guiding<br />Football<br /><span style={{ color: G }}>Careers.</span>
          </h1>

          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, maxWidth: 420, margin: '0 0 44px' }}>
            Founded in 2010, Polaris Football has grown from a boutique Madrid agency into a global powerhouse representing players across five continents and 50+ countries.
          </p>

          <Link href="/contact" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: G, color: '#fff', padding: '13px 26px',
            borderRadius: 8, fontWeight: 600, fontSize: 12,
            textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase',
            width: 'fit-content',
          }}>
            Work With Us <ArrowRight size={13} />
          </Link>
        </div>

        {/* Right — photo */}
        <div className="about-hero-photo" style={{ position: 'relative', overflow: 'hidden', background: '#0D0D0D', minHeight: 480 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/diseño6.jpeg"
            alt=""
            aria-hidden="true"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'right center' }}
          />
        </div>
      </section>

      {/* ── MISSION ── */}
      <section style={{ padding: 'clamp(64px,8vw,100px) clamp(24px,5vw,80px)', borderBottom: '1px solid #E5E7EB' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 80, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div style={{ flex: '0 0 300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 24, height: 1.5, background: G }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: G, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Our Mission</span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: 'clamp(26px, 3.2vw, 38px)', fontWeight: 700, color: N, margin: 0, letterSpacing: '-0.025em', textTransform: 'uppercase', lineHeight: 1.05 }}>
              Connecting<br />Talent with<br />Opportunity
            </h2>
          </div>
          <div style={{ flex: 1, minWidth: 280 }}>
            <p style={{ fontSize: 15, color: '#4B5563', lineHeight: 1.85, margin: '0 0 24px' }}>
              At Polaris Football, our mission is simple: to give every player the representation they deserve. We believe that talent alone is not enough — it takes the right guidance, the right network, and the right timing to unlock a player&apos;s true potential.
            </p>
            <p style={{ fontSize: 15, color: '#4B5563', lineHeight: 1.85, margin: 0 }}>
              From the first professional contract to a move to Europe&apos;s elite leagues, we are with our players at every step. We don&apos;t just negotiate deals — we build careers, protect futures, and create legacies in the beautiful game.
            </p>
          </div>
        </div>
      </section>

      {/* ── STORY + PHOTO ── */}
      <section className="about-story">
        {/* Left — content */}
        <div style={{ padding: 'clamp(56px,7vw,96px) clamp(28px,5vw,80px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderRight: '1px solid #E5E7EB' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
            <div style={{ width: 24, height: 1.5, background: G }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: G, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Our Journey</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: 'clamp(26px, 3.2vw, 38px)', fontWeight: 700, color: N, margin: '0 0 40px', letterSpacing: '-0.025em', textTransform: 'uppercase', lineHeight: 1.05 }}>
            15+ Years<br />of Expertise
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {MILESTONES.map((m, i) => (
              <div key={m.year} style={{ display: 'flex', gap: 24, paddingBottom: i < MILESTONES.length - 1 ? 24 : 0, marginBottom: i < MILESTONES.length - 1 ? 0 : 0 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: G, flexShrink: 0 }} />
                  {i < MILESTONES.length - 1 && <div style={{ width: 1, flex: 1, background: '#E5E7EB', minHeight: 28 }} />}
                </div>
                <div style={{ paddingBottom: i < MILESTONES.length - 1 ? 20 : 0 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: G, letterSpacing: '0.06em', margin: '0 0 4px', lineHeight: 1 }}>
                    {m.year}
                  </p>
                  <p style={{ fontSize: 14, color: '#374151', margin: 0, lineHeight: 1.5 }}>
                    {m.event}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — photo */}
        <div className="about-story-photo" style={{ position: 'relative', overflow: 'hidden', background: '#0A0A0A', minHeight: 500 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/diseño3.jpeg"
            alt=""
            aria-hidden="true"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'right center' }}
          />
        </div>
      </section>

      {/* ── VALUES ── */}
      <section style={{ padding: 'clamp(64px,8vw,100px) clamp(24px,5vw,80px)', borderTop: '1px solid #E5E7EB' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 24, height: 1.5, background: G }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: G, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Our Values</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: 'clamp(26px, 3.2vw, 38px)', fontWeight: 700, color: N, margin: '0 0 48px', letterSpacing: '-0.025em', textTransform: 'uppercase', lineHeight: 1.05 }}>
            What Drives Us
          </h2>

          <div className="values-grid">
            {VALUES.map(v => (
              <div key={v.title} style={{ background: '#fff', padding: '40px 32px' }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: `${G}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <v.icon size={16} color={G} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: 14, fontWeight: 700, color: N, margin: '0 0 10px', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                  {v.title}
                </h3>
                <p style={{ fontSize: 13, color: '#6B7280', margin: 0, lineHeight: 1.7 }}>
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: N, padding: 'clamp(64px,8vw,96px) 40px' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, color: '#fff', margin: '0 0 20px', letterSpacing: '-0.025em', textTransform: 'uppercase', lineHeight: 1.05 }}>
            Ready to<br /><span style={{ color: G }}>Get Started?</span>
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, margin: '0 auto 40px', maxWidth: 360 }}>
            Join the growing roster of players we represent worldwide.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: G, color: '#fff', padding: '13px 28px', borderRadius: 8, fontWeight: 600, fontSize: 12, textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Contact Us <ArrowRight size={13} />
            </Link>
            <Link href="/services" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent', color: 'rgba(255,255,255,0.65)', padding: '13px 28px', borderRadius: 8, fontWeight: 600, fontSize: 12, textDecoration: 'none', border: '1.5px solid rgba(255,255,255,0.15)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Our Services <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
