import Link from 'next/link'
import { ArrowRight, Globe, Star, Shield, Users, TrendingUp } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { C } from '@/lib/ds'

const N = C.dark
const G = C.blue

const APPROACH = [
  {
    icon: Shield,
    title: 'We Protect You',
    desc: "Every contract, every clause, every conversation — we handle it so you can focus on what matters: performing on the pitch.",
  },
  {
    icon: Globe,
    title: 'Global Reach',
    desc: "Our network covers 50+ countries and 200+ club partnerships. Wherever your talent can shine, we have the connections to get you there.",
  },
  {
    icon: TrendingUp,
    title: 'We Build Careers',
    desc: "We don't just find you a club. We map out your entire career trajectory and make strategic moves at every critical moment.",
  },
  {
    icon: Star,
    title: 'Your Brand Matters',
    desc: "Off the pitch, we grow your personal brand — media, sponsorships, and content strategy that builds your legacy.",
  },
]

const POSITIONS = [
  'Goalkeepers',
  'Centre Backs',
  'Full Backs',
  'Defensive Midfielders',
  'Central Midfielders',
  'Attacking Midfielders',
  'Wingers',
  'Strikers',
]

const STATS = [
  { value: '300+', label: 'Players Represented' },
  { value: '50+',  label: 'Countries' },
  { value: '200+', label: 'Clubs' },
  { value: '15+',  label: 'Years' },
]

export default function PlayersPage() {
  return (
    <div style={{ fontFamily: 'var(--font-montserrat), sans-serif', background: '#fff', minHeight: '100vh' }}>
      <style>{`
        .players-hero { display: grid; grid-template-columns: 50fr 50fr; min-height: 82vh; }
        @media (max-width: 900px) {
          .players-hero { display: flex !important; flex-direction: column !important; }
          .players-hero-photo { min-height: 380px !important; }
        }
        @media (max-width: 600px) {
          .players-hero-photo { min-height: 260px !important; }
        }
        .approach-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1px; background: #E5E7EB; }
        @media (max-width: 640px) { .approach-grid { grid-template-columns: 1fr !important; } }
        .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); }
        @media (max-width: 640px) { .stats-row { grid-template-columns: repeat(2, 1fr) !important; } }
        .positions-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
        @media (max-width: 768px) { .positions-grid { grid-template-columns: repeat(2, 1fr) !important; } }
      `}</style>

      <Navbar />

      {/* ── HERO ── */}
      <section className="players-hero">
        {/* Left — dark content */}
        <div style={{ background: N, padding: 'clamp(72px,8vw,112px) clamp(32px,5vw,80px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <div style={{ width: 24, height: 1.5, background: G }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: G, letterSpacing: '0.16em', textTransform: 'uppercase' }}>Our Players</span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 700, color: '#fff', margin: '0 0 24px', letterSpacing: '-0.03em', textTransform: 'uppercase', lineHeight: 1.02 }}>
            Elite Talent.<br /><span style={{ color: G }}>Global Stage.</span>
          </h1>

          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, maxWidth: 400, margin: '0 0 44px' }}>
            We represent players from grassroots to the elite level — every nationality, every position, every ambition. If you have the talent, we have the roadmap.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/contact" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: G, color: '#fff', padding: '13px 26px',
              borderRadius: 8, fontWeight: 600, fontSize: 12,
              textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>
              Start Your Journey <ArrowRight size={13} />
            </Link>
            <Link href="/services" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'transparent', color: 'rgba(255,255,255,0.65)',
              padding: '13px 26px', borderRadius: 8, fontWeight: 600, fontSize: 12,
              textDecoration: 'none', border: '1.5px solid rgba(255,255,255,0.15)',
              letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>
              Our Services <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Right — photo */}
        <div className="players-hero-photo" style={{ position: 'relative', overflow: 'hidden', background: '#0A0A0A', minHeight: 480 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/diseño4.jpeg"
            alt=""
            aria-hidden="true"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(10,10,10,0.2) 0%, transparent 40%)' }} />
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section style={{ background: '#FAFAFA', borderBottom: '1px solid #E5E7EB' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="stats-row">
            {STATS.map((s, i) => (
              <div key={s.label} style={{
                padding: '32px 40px',
                borderRight: i < STATS.length - 1 ? '1px solid #E5E7EB' : 'none',
                textAlign: 'center',
              }}>
                <p style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 700, color: N, margin: '0 0 4px', letterSpacing: '-0.025em', lineHeight: 1 }}>
                  {s.value}
                </p>
                <p style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0 }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW WE REPRESENT YOU ── */}
      <section style={{ padding: 'clamp(64px,8vw,100px) clamp(24px,5vw,80px)', borderBottom: '1px solid #E5E7EB' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 24, height: 1.5, background: G }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: G, letterSpacing: '0.14em', textTransform: 'uppercase' }}>How We Work</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: 'clamp(26px, 3.2vw, 38px)', fontWeight: 700, color: N, margin: '0 0 48px', letterSpacing: '-0.025em', textTransform: 'uppercase', lineHeight: 1.05 }}>
            The Polaris Approach
          </h2>

          <div className="approach-grid">
            {APPROACH.map(a => (
              <div key={a.title} style={{ background: '#fff', padding: '40px 36px' }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: `${G}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <a.icon size={16} color={G} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: 14, fontWeight: 700, color: N, margin: '0 0 10px', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                  {a.title}
                </h3>
                <p style={{ fontSize: 13, color: '#6B7280', margin: 0, lineHeight: 1.7 }}>
                  {a.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── POSITIONS WE REPRESENT ── */}
      <section style={{ padding: 'clamp(64px,8vw,100px) clamp(24px,5vw,80px)', background: '#FAFAFA', borderBottom: '1px solid #E5E7EB' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 80, flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <div style={{ flex: '0 0 280px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ width: 24, height: 1.5, background: G }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: G, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Who We Represent</span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: 'clamp(24px, 3vw, 34px)', fontWeight: 700, color: N, margin: '0 0 20px', letterSpacing: '-0.025em', textTransform: 'uppercase', lineHeight: 1.08 }}>
                Every<br />Position.<br />Every Level.
              </h2>
              <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.75, margin: '0 0 32px' }}>
                From youth academies to senior professionals, we represent players across all positions and all levels of the game.
              </p>
              <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: N, textDecoration: 'none', letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: '1.5px solid #0A0A0A', paddingBottom: 2 }}>
                Apply Now <ArrowRight size={12} />
              </Link>
            </div>

            <div style={{ flex: 1 }}>
              <div className="positions-grid">
                {POSITIONS.map(pos => (
                  <div key={pos} style={{
                    background: '#fff', border: '1.5px solid #E5E7EB', borderRadius: 10,
                    padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 10,
                  }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: G, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: N }}>
                      {pos}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── JOIN CTA ── */}
      <section style={{ background: N, padding: 'clamp(64px,8vw,96px) 40px', position: 'relative', overflow: 'hidden' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/diseño10.jpeg" alt="" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', opacity: 0.07 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 80% at 50% 50%, transparent 0%, rgba(5,5,5,0.9) 100%)' }} />
        <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, color: '#fff', margin: '0 0 20px', letterSpacing: '-0.025em', textTransform: 'uppercase', lineHeight: 1.05 }}>
            {"You're"} one step<br />from <span style={{ color: G }}>everything.</span>
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, margin: '0 auto 40px', maxWidth: 340 }}>
            Whether you are 16 or 30, just starting out or ready for the next big move — we want to hear your story.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: G, color: '#fff', padding: '13px 28px', borderRadius: 8, fontWeight: 600, fontSize: 12, textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Get in Touch <ArrowRight size={13} />
            </Link>
            <Link href="/about" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent', color: 'rgba(255,255,255,0.65)', padding: '13px 28px', borderRadius: 8, fontWeight: 600, fontSize: 12, textDecoration: 'none', border: '1.5px solid rgba(255,255,255,0.15)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              About Us <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
