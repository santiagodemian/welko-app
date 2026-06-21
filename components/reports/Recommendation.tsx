import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { PlayerReport } from '@/lib/reports/types'
import { C, FONT, BTN } from '@/lib/ds'

type Props = { recommendation: PlayerReport['recommendation'] }

const PRIORITY_COLORS: Record<string, string> = {
  High:   '#059669',
  Medium: '#D97706',
  Low:    '#6B7280',
}

export function Recommendation({ recommendation }: Props) {
  const priColor = PRIORITY_COLORS[recommendation.priority] ?? C.textMuted

  return (
    <div>
      {/* Verdict block */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        gap: 20, flexWrap: 'wrap',
        padding: 'clamp(18px,2.2vw,26px)',
        border: '1.5px solid',
        borderRadius: 12, marginBottom: 24,
      }}
        className={`rp-verdict-${recommendation.verdict.toLowerCase().replace(/\s+/g, '-')}`}
      >
        <div>
          <div style={{ fontFamily: FONT.mono, fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.7, marginBottom: 6 }}>
            Polaris Verdict
          </div>
          <div style={{ fontFamily: FONT.display, fontSize: 'clamp(20px,2.5vw,30px)', fontWeight: 700, letterSpacing: '-0.03em', textTransform: 'uppercase', lineHeight: 0.95 }}>
            {recommendation.verdict}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: FONT.mono, fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.7, marginBottom: 6 }}>
            Priority
          </div>
          <div style={{ fontFamily: FONT.display, fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', color: priColor }}>
            {recommendation.priority}
          </div>
        </div>
      </div>

      {/* Summary */}
      <p style={{ fontFamily: FONT.sans, fontSize: 13, color: C.textSecondary, margin: '0 0 24px', lineHeight: 1.9 }}>
        {recommendation.summary}
      </p>

      {/* Suitable For */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: FONT.mono, fontSize: 9, fontWeight: 700, color: C.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
          Suitable For
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {recommendation.suitableFor.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <div style={{ width: 2, height: 12, background: C.blue, opacity: 0.5, flexShrink: 0, marginTop: 3 }} />
              <span style={{ fontFamily: FONT.sans, fontSize: 12.5, color: C.textSecondary, lineHeight: 1.7 }}>
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      {recommendation.notes && (
        <div style={{ padding: 'clamp(12px,1.5vw,16px)', background: C.bgAlt, border: `1px solid ${C.border}`, borderRadius: 8, borderLeft: `3px solid ${C.blue}`, marginBottom: 24 }}>
          <p style={{ fontFamily: FONT.sans, fontSize: 12, color: C.textSecondary, margin: 0, lineHeight: 1.85, fontStyle: 'italic' }}>
            {recommendation.notes}
          </p>
        </div>
      )}

      {/* CTA */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <Link href="/contact" className="rp-dl-btn" style={{ ...BTN.primary }}>
          Discuss this report <ArrowRight size={12} />
        </Link>
        <Link href="/solutions" className="rp-contact-btn" style={{ ...BTN.outline }}>
          Consulting services
        </Link>
      </div>
    </div>
  )
}
