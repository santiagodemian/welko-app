import type { CSSProperties, ReactNode } from 'react'
import { C, FONT, SECTION } from '@/lib/ds'

interface ReportSectionProps {
  id:       string
  num:      string    // "01", "02" etc.
  title:    string
  children: ReactNode
  bg?:      string
  style?:   CSSProperties
}

export function ReportSection({ id, num, title, children, bg = '#FFFFFF', style }: ReportSectionProps) {
  const PH = SECTION.padH

  return (
    <section id={id} className="rp-section" style={{ background: bg, scrollMarginTop: 90, ...style }}>
      {/* Section header */}
      <div style={{
        paddingTop:    'clamp(24px,3vw,36px)',
        paddingBottom: 'clamp(14px,1.8vw,20px)',
        paddingLeft:   PH, paddingRight: PH,
        borderBottom:  `1px solid ${C.border}`,
        display: 'flex', alignItems: 'baseline', gap: 14,
      }}>
        <span style={{ fontFamily: FONT.mono, fontSize: 10, fontWeight: 700, color: C.border, letterSpacing: '-0.02em', flexShrink: 0 }}>
          {num}
        </span>
        <div style={{ width: 18, height: 1.5, background: C.blue, flexShrink: 0, marginBottom: 2 }} />
        <h2 style={{ fontFamily: FONT.display, fontSize: 11, fontWeight: 700, color: C.blue, margin: 0, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          {title}
        </h2>
      </div>

      {/* Section body */}
      <div style={{ paddingTop: 'clamp(20px,2.5vw,30px)', paddingBottom: 'clamp(24px,3vw,36px)', paddingLeft: PH, paddingRight: PH }}>
        {children}
      </div>
    </section>
  )
}
