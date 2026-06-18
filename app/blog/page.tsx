import type { CSSProperties } from 'react'
import Link from 'next/link'
import { Navbar }       from '@/components/layout/Navbar'
import { Footer }       from '@/components/layout/Footer'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { C, FONT }      from '@/lib/ds'

const N = C.dark
const G = C.blue

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main style={{ fontFamily: FONT.sans, background: '#fff' }}>

        {/* ━━━ HERO — same split technique as homepage/services ━━━
            diseño11.jpeg is 768×512 with ~38% white text panel on left,
            stadium photo on right. White coded panel covers the text area. */}
        <section style={{ position: 'relative', overflow: 'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/diseño11.jpeg"
            alt=""
            aria-hidden="true"
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center top',
            }}
          />
          {/* White coded panel (38%) */}
          <div style={{
            position: 'relative', zIndex: 1,
            width: '38%', background: '#fff',
            padding: 'clamp(72px,9vw,112px) clamp(44px,5vw,84px)',
            minHeight: 480,
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
          }}>
            <SectionLabel marginBottom={32}>Blog</SectionLabel>
            <h1 style={{
              fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif',
              fontSize: 'clamp(38px,4.8vw,60px)',
              fontWeight: 700, lineHeight: 0.92,
              letterSpacing: '-0.035em', textTransform: 'uppercase',
              color: '#0A0A0A', margin: '0 0 4px',
            }}>
              Insights. Stories.
            </h1>
            <h1 style={{
              fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif',
              fontSize: 'clamp(38px,4.8vw,60px)',
              fontWeight: 700, lineHeight: 0.92,
              letterSpacing: '-0.035em', textTransform: 'uppercase',
              color: G, margin: '0 0 28px',
            }}>
              Football.
            </h1>
            <p style={{ fontSize: 14, color: '#4B5563', lineHeight: 1.8, maxWidth: 340, margin: 0, fontFamily: FONT.sans }}>
              News, tips and stories from the world of football. Inspiration, knowledge and everything that drives the game forward.
            </p>
          </div>
        </section>

        {/* Coming Soon */}
        <section style={{
          padding: 'clamp(64px,8vw,96px) clamp(24px,5vw,80px)',
          maxWidth: 1200, margin: '0 auto',
        }}>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24,
          }}>
            {[
              {
                category: 'Transfer Analysis',
                title: 'How the summer window is reshaping La Liga squads',
                excerpt: 'A breakdown of the most significant moves, the clubs that over-performed their budget, and where the real value was found.',
                color: '#3B82F6',
              },
              {
                category: 'Scouting',
                title: 'The data behind discovering a €10M player before anyone else',
                excerpt: 'We trace the methodology behind identifying high-potential players in lower leagues before they price out of reach.',
                color: '#7C3AED',
              },
              {
                category: 'Market Intelligence',
                title: 'Contract expiry windows: the calendar agents live by',
                excerpt: 'Why the 18-month countdown is the most important signal in football representation, and how to act on it.',
                color: '#059669',
              },
              {
                category: 'Career Paths',
                title: 'From B team to first division: tracking real development arcs',
                excerpt: 'What the data actually shows about young players who made the jump — and the paths that tend to lead nowhere.',
                color: '#D97706',
              },
              {
                category: 'Mandates',
                title: 'Understanding what clubs really want vs. what they say they want',
                excerpt: "The gap between a club's stated mandate and what they actually sign reveals patterns that experienced agents exploit.",
                color: '#DC2626',
              },
              {
                category: 'Network',
                title: 'Why trust travels faster than reputation in football',
                excerpt: "In a business built on relationships, what you actually deliver matters more than your agency's name on paper.",
                color: '#2563EB',
              },
            ].map((post) => (
              <div key={post.title} style={{
                background: 'white', border: '1.5px solid #E5E7EB', borderRadius: 14,
                overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                display: 'flex', flexDirection: 'column',
              }}>
                {/* Placeholder image area */}
                <div style={{
                  height: 160, background: `${post.color}0A`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderBottom: '1px solid #F3F4F6', position: 'relative',
                }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: post.color, background: `${post.color}18`, padding: '5px 12px', borderRadius: 4,
                  }}>
                    {post.category}
                  </span>
                  {/* "Coming soon" pill */}
                  <span style={{
                    position: 'absolute', top: 12, right: 12,
                    fontSize: 9, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: '#9CA3AF', background: '#F3F4F6', padding: '4px 8px', borderRadius: 4,
                  }}>
                    Coming Soon
                  </span>
                </div>
                <div style={{ padding: '20px 22px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h2 style={{
                    fontSize: 16, fontWeight: 700, color: N, margin: '0 0 10px',
                    lineHeight: 1.3, letterSpacing: '-0.01em',
                    fontFamily: 'var(--font-space-grotesk), sans-serif',
                  }}>
                    {post.title}
                  </h2>
                  <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 20px', lineHeight: 1.6, flex: 1 }}>
                    {post.excerpt}
                  </p>
                  <span style={{
                    fontSize: 12, fontWeight: 600, color: '#C1C8D4',
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                  }}>
                    Article publishing soon
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Subscriber CTA */}
          <div style={{
            marginTop: 64, background: N, borderRadius: 20,
            padding: 'clamp(40px,5vw,60px) clamp(24px,5vw,60px)',
            display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'center',
          }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: G, margin: '0 0 12px' }}>
                Early Access
              </p>
              <h2 style={{
                fontSize: 'clamp(22px,3vw,30px)', fontWeight: 800, color: '#fff',
                margin: '0 0 10px', letterSpacing: '-0.03em',
                fontFamily: 'var(--font-space-grotesk), sans-serif',
              }}>
                Get Polaris Intelligence first
              </h2>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', margin: 0, lineHeight: 1.6 }}>
                Transfer window analysis, market signals, and network intelligence — delivered directly to you when we launch.
              </p>
            </div>
            <Link href="/contact" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: G, color: 'white', padding: '13px 28px', borderRadius: 10,
              textDecoration: 'none', fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap',
              flexShrink: 0,
            }}>
              Get notified →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
