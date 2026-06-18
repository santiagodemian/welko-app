'use client'

/**
 * Shared plan-gate upsell screen for dashboard pages.
 * Usage:
 *   if (plan && !['pro','business'].includes(plan)) return <PlanGate ... />
 */

import Link from 'next/link'
import { Zap } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const TEXT  = 'var(--text-primary)'
const MUTED = 'var(--text-secondary)'
const SURF  = 'var(--surface)'
const BORD  = 'var(--border)'
const NAVY  = '#13244A'

export type PlanTier = 'essential' | 'pro' | 'business'

interface FeatureTeaser { title: string; desc: string }

interface PlanGateProps {
  icon: LucideIcon
  iconColor: string
  title: string
  description: string
  features: FeatureTeaser[]
  requiredPlan: PlanTier
  /** Optional custom CTA label — defaults to "Ver planes" */
  ctaLabel?: string
}

const PLAN_LABELS: Record<PlanTier, string> = {
  essential: 'Plan Essential',
  pro:       'Plan Pro o Business',
  business:  'Plan Business',
}

export function PlanGate({
  icon: Icon,
  iconColor,
  title,
  description,
  features,
  requiredPlan,
  ctaLabel = 'Ver planes',
}: PlanGateProps) {
  return (
    <div style={{
      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '60px 28px',
    }}>
      <div style={{
        maxWidth: 480, textAlign: 'center', display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 20,
      }}>
        {/* Icon */}
        <div style={{
          width: 64, height: 64, borderRadius: 18,
          background: `${iconColor}18`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={28} color={iconColor} />
        </div>

        {/* Copy */}
        <div>
          <p style={{ fontSize: 18, fontWeight: 700, color: TEXT, margin: '0 0 8px' }}>
            {title}
          </p>
          <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.6, margin: 0 }}>
            {description}
          </p>
        </div>

        {/* Feature teasers */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
          width: '100%', textAlign: 'left',
        }}>
          {features.map((f) => (
            <div key={f.title} style={{
              padding: '12px 14px', borderRadius: 10,
              background: SURF, border: `1px solid ${BORD}`,
            }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: TEXT, margin: 0 }}>{f.title}</p>
              <p style={{ fontSize: 11, color: MUTED, margin: '2px 0 0' }}>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Plan badge + CTA */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 99,
            background: `${iconColor}18`, color: iconColor,
          }}>
            {PLAN_LABELS[requiredPlan]}
          </span>
          <Link
            href="/precios"
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '10px 22px', borderRadius: 12,
              background: NAVY, color: '#fff',
              fontSize: 13, fontWeight: 600, textDecoration: 'none',
            }}
          >
            <Zap size={14} />
            {ctaLabel}
          </Link>
          <p style={{ fontSize: 11, color: MUTED, margin: 0 }}>14 días de prueba · Cancela cuando quieras</p>
        </div>
      </div>
    </div>
  )
}
