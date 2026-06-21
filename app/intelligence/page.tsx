import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { C, BTN, FONT, T, SECTION } from '@/lib/ds'

export const metadata = {
  title: 'Intelligence — Polaris Football',
  description: 'Scouting reports, player analysis, and recruitment intelligence from Polaris Football.',
}

export default function IntelligencePage() {
  const PH = SECTION.padH
  return (
    <div style={{ fontFamily: FONT.sans, background: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ padding: `clamp(80px, 10vw, 120px) ${PH}`, maxWidth: SECTION.maxW, margin: '0 auto', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40 }}>
            <div style={{ width: 20, height: 1.5, background: C.blue, flexShrink: 0 }} />
            <span style={{ ...T.label, color: C.blue }}>Polaris Intelligence</span>
          </div>
          <h1 style={{ fontFamily: FONT.display, fontSize: 'clamp(48px, 7vw, 96px)', fontWeight: 700, color: C.dark, margin: '0 0 24px', letterSpacing: '-0.04em', textTransform: 'uppercase', lineHeight: 0.9 }}>
            Intelligence<br /><span style={{ color: C.blue }}>Coming Soon.</span>
          </h1>
          <p style={{ ...T.bodyLg, color: C.textSecondary, maxWidth: 480, margin: '0 0 48px', lineHeight: 1.85 }}>
            Scouting reports, player analysis, recruitment insights, and football business coverage — launching shortly.
          </p>
          <Link href="/contact" style={{ ...BTN.primary }}>
            Get notified <ArrowRight size={13} />
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
