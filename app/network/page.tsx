import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { C, BTN, FONT, T, SECTION } from '@/lib/ds'

export const metadata = {
  title: 'Network — Polaris Football',
  description: 'Polaris Football — part of the Absolut Football Network.',
}

export default function NetworkPage() {
  const PH = SECTION.padH
  return (
    <div style={{ fontFamily: FONT.sans, background: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        {/* Header */}
        <section style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ padding: `clamp(80px, 10vw, 120px) ${PH}`, maxWidth: SECTION.maxW, margin: '0 auto', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40 }}>
              <div style={{ width: 20, height: 1.5, background: C.blue, flexShrink: 0 }} />
              <span style={{ ...T.label, color: C.blue }}>Network</span>
            </div>
            <h1 style={{ fontFamily: FONT.display, fontSize: 'clamp(52px, 7.5vw, 96px)', fontWeight: 700, color: C.dark, margin: '0 0 28px', letterSpacing: '-0.04em', textTransform: 'uppercase', lineHeight: 0.9 }}>
              Inside the<br />Absolut Football<br /><span style={{ color: C.blue }}>Network.</span>
            </h1>
            <p style={{ ...T.bodyLg, color: C.textSecondary, maxWidth: 520, margin: '0 0 48px', lineHeight: 1.85 }}>
              Polaris operates within a global network of scouts, analysts, recruiters, and football professionals spanning clubs, academies, and sporting organizations across Europe and beyond.
            </p>
            <Link href="/contact" style={{ ...BTN.primary }}>
              Work With Us <ArrowRight size={13} />
            </Link>
          </div>
        </section>

        {/* Body */}
        <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ padding: `clamp(56px, 7vw, 80px) ${PH}`, borderRight: `1px solid ${C.border}` }}>
            <h2 style={{ fontFamily: FONT.display, fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 700, color: C.dark, margin: '0 0 16px', letterSpacing: '-0.025em', textTransform: 'uppercase', lineHeight: 1.1 }}>
              Who We Are
            </h2>
            <p style={{ ...T.body, color: C.textSecondary, margin: 0, lineHeight: 1.85 }}>
              Polaris Football is a football intelligence platform founded within the Absolut Football Network — an international collaboration of football professionals committed to raising the standard of intelligence, analysis, and consulting in the game.
            </p>
          </div>
          <div style={{ padding: `clamp(56px, 7vw, 80px) ${PH}` }}>
            <h2 style={{ fontFamily: FONT.display, fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 700, color: C.dark, margin: '0 0 16px', letterSpacing: '-0.025em', textTransform: 'uppercase', lineHeight: 1.1 }}>
              How We Work
            </h2>
            <p style={{ ...T.body, color: C.textSecondary, margin: 0, lineHeight: 1.85 }}>
              We don&apos;t promise transfers. We provide the intelligence, professional network, and consulting expertise that helps clubs, agents, and players make better decisions. Every engagement is grounded in real data and honest analysis.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
