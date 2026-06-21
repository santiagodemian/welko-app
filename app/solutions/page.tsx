import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { C, BTN, FONT, T, SECTION } from '@/lib/ds'

export const metadata = {
  title: 'Solutions — Polaris Football',
  description: 'Consulting solutions for clubs, agents, and football professionals from Polaris Football.',
}

const SOLUTIONS = [
  {
    num: '01',
    label: 'For Clubs',
    desc: 'Recruitment intelligence, scouting reports, shortlists, and squad analysis to help clubs make better signing decisions.',
  },
  {
    num: '02',
    label: 'For Agents',
    desc: 'Market intelligence, mandate support, and international network access for licensed football agents.',
  },
  {
    num: '03',
    label: 'For Players',
    desc: 'Career assessment, market positioning, and professional consulting for professional and semi-professional players.',
  },
]

export default function SolutionsPage() {
  const PH = SECTION.padH
  return (
    <div style={{ fontFamily: FONT.sans, background: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        .sol-row:hover { background: #FAFAFA; }
      `}</style>
      <Navbar />
      <main style={{ flex: 1 }}>
        {/* Header */}
        <section style={{ background: C.dark, padding: `clamp(72px, 9vw, 112px) ${PH}` }}>
          <div style={{ maxWidth: SECTION.maxW, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 36 }}>
              <div style={{ width: 20, height: 1.5, background: C.blue, flexShrink: 0 }} />
              <span style={{ ...T.label, color: C.blue }}>Polaris Consulting</span>
            </div>
            <h1 style={{ fontFamily: FONT.display, fontSize: 'clamp(52px, 7.5vw, 96px)', fontWeight: 700, color: '#fff', margin: '0 0 20px', letterSpacing: '-0.04em', textTransform: 'uppercase', lineHeight: 0.9 }}>
              Solutions
            </h1>
            <p style={{ ...T.bodyLg, color: 'rgba(255,255,255,0.45)', maxWidth: 480, margin: 0, lineHeight: 1.8 }}>
              Professional consulting for clubs, agents, and football professionals who need better intelligence and strategic support.
            </p>
          </div>
        </section>

        {/* Solutions list */}
        <section style={{ borderBottom: `1px solid ${C.border}` }}>
          {SOLUTIONS.map((s, i) => (
            <div key={s.num} className="sol-row" style={{
              display: 'grid', gridTemplateColumns: '72px 1fr auto',
              alignItems: 'center', gap: 32,
              padding: `clamp(36px, 4.5vw, 52px) ${PH}`,
              borderTop: `1px solid ${C.border}`,
              transition: 'background 0.15s', cursor: 'default',
            }}>
              <span style={{ fontFamily: FONT.display, fontSize: 11, fontWeight: 700, color: C.border, letterSpacing: '0.1em' }}>
                {s.num}
              </span>
              <div>
                <h2 style={{ fontFamily: FONT.display, fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 700, color: C.dark, margin: '0 0 10px', letterSpacing: '-0.025em', textTransform: 'uppercase' }}>
                  {s.label}
                </h2>
                <p style={{ ...T.body, color: C.textSecondary, margin: 0, maxWidth: 560, lineHeight: 1.8 }}>
                  {s.desc}
                </p>
              </div>
              <Link href="/contact" style={{ ...BTN.outline, whiteSpace: 'nowrap' }}>
                Enquire <ArrowRight size={13} />
              </Link>
            </div>
          ))}
        </section>

        {/* CTA */}
        <section style={{ padding: `clamp(64px, 8vw, 96px) ${PH}` }}>
          <div style={{ maxWidth: 560 }}>
            <h2 style={{ fontFamily: FONT.display, fontSize: 'clamp(32px, 4.5vw, 56px)', fontWeight: 700, color: C.dark, margin: '0 0 20px', letterSpacing: '-0.035em', textTransform: 'uppercase', lineHeight: 0.92 }}>
              Not sure where to start?
            </h2>
            <p style={{ ...T.bodyLg, color: C.textSecondary, margin: '0 0 36px', lineHeight: 1.8 }}>
              Contact the Polaris team and we&apos;ll help you understand which solution fits your situation.
            </p>
            <Link href="/contact" style={{ ...BTN.primary }}>
              Get in Touch <ArrowRight size={13} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
