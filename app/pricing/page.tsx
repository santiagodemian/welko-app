'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Check, X, Zap, Users, Building2, Shield } from 'lucide-react'

const N = '#0A1628'
const G = '#1E6FEB'

// ─── Plan definitions ─────────────────────────────────────────────────────────

const PLANS = [
  {
    id: 'scout',
    name: 'Scout',
    tagline: 'For independent agents exploring their first players',
    icon: Shield,
    price: { monthly: 0, annual: 0, annualTotal: 0 },
    cta: 'Get started free',
    ctaHref: '/registro',
    highlight: false,
    badge: null,
    accentColor: '#6B7280',
    seats: '1 seat',
    features: [
      { label: 'Player profiles',               value: '5 max' },
      { label: 'Transfer pipeline (Kanban)',     value: true   },
      { label: 'Club mandate inbox',             value: true   },
      { label: 'Basic dashboard & stats',        value: true   },
      { label: 'Player categories',              value: false  },
      { label: 'AI mandate matching',            value: false  },
      { label: 'White-label PDF proposals',      value: false  },
      { label: 'Contract expiry alerts',         value: false  },
      { label: 'WhatsApp quick-pitch',           value: false  },
      { label: 'Activity log per player',        value: false  },
      { label: 'Commission tracker',             value: false  },
      { label: 'Club contact book',              value: false  },
      { label: 'Portfolio PDF export',           value: false  },
      { label: 'AI proposal narrative',          value: false  },
      { label: 'Market window calendar',         value: false  },
      { label: 'API access',                     value: false  },
    ],
  },
  {
    id: 'premium',
    name: 'Pro',
    tagline: 'For serious agents managing an active portfolio',
    icon: Zap,
    price: { monthly: 59, annual: 41, annualTotal: 499 },
    cta: 'Start Pro',
    ctaHref: null,
    highlight: true,
    badge: 'MOST POPULAR',
    accentColor: G,
    seats: '2 seats',
    features: [
      { label: 'Player profiles',               value: 'Unlimited' },
      { label: 'Transfer pipeline (Kanban)',     value: true        },
      { label: 'Club mandate inbox',             value: true        },
      { label: 'Basic dashboard & stats',        value: true        },
      { label: 'Player categories',              value: true        },
      { label: 'AI mandate matching',            value: true        },
      { label: 'White-label PDF proposals',      value: true        },
      { label: 'Contract expiry alerts',         value: true        },
      { label: 'WhatsApp quick-pitch',           value: true        },
      { label: 'Activity log per player',        value: true        },
      { label: 'Commission tracker',             value: true        },
      { label: 'Club contact book',              value: false       },
      { label: 'Portfolio PDF export',           value: false       },
      { label: 'AI proposal narrative',          value: false       },
      { label: 'Market window calendar',         value: false       },
      { label: 'API access',                     value: false       },
    ],
  },
  {
    id: 'agency',
    name: 'Agency',
    tagline: 'For full agencies running multiple agents',
    icon: Building2,
    price: { monthly: 129, annual: 83, annualTotal: 999 },
    cta: 'Start Agency',
    ctaHref: null,
    highlight: false,
    badge: 'BEST VALUE / SEAT',
    accentColor: '#7C3AED',
    seats: 'Unlimited seats',
    features: [
      { label: 'Player profiles',               value: 'Unlimited' },
      { label: 'Transfer pipeline (Kanban)',     value: true        },
      { label: 'Club mandate inbox',             value: true        },
      { label: 'Basic dashboard & stats',        value: true        },
      { label: 'Player categories',              value: true        },
      { label: 'AI mandate matching',            value: true        },
      { label: 'White-label PDF proposals',      value: true        },
      { label: 'Contract expiry alerts',         value: true        },
      { label: 'WhatsApp quick-pitch',           value: true        },
      { label: 'Activity log per player',        value: true        },
      { label: 'Commission tracker',             value: true        },
      { label: 'Club contact book',              value: true        },
      { label: 'Portfolio PDF export',           value: true        },
      { label: 'AI proposal narrative',          value: true        },
      { label: 'Market window calendar',         value: true        },
      { label: 'API access',                     value: true        },
    ],
  },
]

const FAQ = [
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Monthly plans cancel immediately with no further charges. Annual plans are non-refundable but access continues until end of the billing year.',
  },
  {
    q: 'Do I need a credit card to start?',
    a: 'No. The Scout plan is completely free and requires no payment information.',
  },
  {
    q: 'What happens when I hit the 5-player limit on Scout?',
    a: "You'll be prompted to upgrade. Your existing player data is never deleted — you just can't add new players until you upgrade.",
  },
  {
    q: 'How much does the Pro plan save vs monthly?',
    a: 'Monthly costs €59 × 12 = €708/year. Annual is €499 — you save €209 (~30% off).',
  },
  {
    q: 'Can I switch plans later?',
    a: 'Yes. Upgrade, downgrade, or switch from monthly to annual at any time. We prorate any remaining value.',
  },
  {
    q: 'Is my player data secure?',
    a: 'All data is encrypted in transit and at rest. Each agency is fully isolated — no other agent can see your players.',
  },
]

// ─── Main page ────────────────────────────────────────────────────────────────

export default function PricingPage() {
  const [annual, setAnnual]   = useState(false)
  const [loading, setLoading] = useState<string | null>(null)

  async function startCheckout(planId: string) {
    if (planId === 'scout') { window.location.href = '/registro'; return }
    setLoading(planId)
    try {
      const referralToken = typeof window !== 'undefined'
        ? (localStorage.getItem('wlk_ref') ?? undefined)
        : undefined
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId, annual, referralToken }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else setLoading(null)
    } catch {
      setLoading(null)
    }
  }

  return (
    <div style={{ fontFamily: 'var(--font-montserrat), sans-serif', background: '#F8FAFC', minHeight: '100vh' }}>
      <style>{`
        @media (max-width: 640px) {
          .pricing-hero { padding: 40px 20px 80px !important; }
          .pricing-faq  { padding: 0 20px 48px !important; }
        }
      `}</style>

      {/* Nav */}
      <header style={{ background: N, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', textDecoration: 'none' }}>
            Welko <span style={{ color: G }}>AgentOS</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <Link href="/" style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontWeight: 500 }}>Home</Link>
            <Link href="/login" style={{ fontSize: 13, fontWeight: 700, color: '#fff', textDecoration: 'none', background: G, padding: '8px 18px', borderRadius: 8 }}>Sign in</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="pricing-hero" style={{ background: N, padding: '60px 24px 100px', textAlign: 'center' }}>
        <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: G, background: `${G}18`, padding: '5px 14px', borderRadius: 99, marginBottom: 16 }}>
          Pricing
        </span>
        <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', margin: '0 0 16px', lineHeight: 1.1 }}>
          Simple pricing for football agents.
          <br />
          <span style={{ color: G }}>No surprises.</span>
        </h1>
        <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.5)', margin: '0 auto 40px', maxWidth: 480, lineHeight: 1.6 }}>
          Start free. Upgrade when your agency is ready to scale. Cancel anytime.
        </p>

        {/* Toggle */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 0, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 99, padding: 4 }}>
          <button
            onClick={() => setAnnual(false)}
            style={{ padding: '9px 24px', borderRadius: 99, fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', transition: 'all 0.15s', background: !annual ? '#fff' : 'transparent', color: !annual ? N : 'rgba(255,255,255,0.55)' }}
          >
            Monthly
          </button>
          <button
            onClick={() => setAnnual(true)}
            style={{ padding: '9px 24px', borderRadius: 99, fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', transition: 'all 0.15s', background: annual ? '#fff' : 'transparent', color: annual ? N : 'rgba(255,255,255,0.55)', display: 'flex', alignItems: 'center', gap: 8 }}
          >
            Annual
            <span style={{ fontSize: 10, fontWeight: 800, background: '#10B981', color: '#fff', padding: '2px 8px', borderRadius: 99 }}>SAVE ~30%</span>
          </button>
        </div>

        {annual && (
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 10 }}>
            Pro: €499/yr &nbsp;·&nbsp; Agency: €999/yr
          </p>
        )}
      </div>

      {/* Plan cards */}
      <div style={{ maxWidth: 1080, margin: '-52px auto 0', padding: '0 24px 80px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, alignItems: 'start' }}>
        {PLANS.map(plan => {
          const Icon = plan.icon
          const price = annual ? plan.price.annual : plan.price.monthly
          const isLoading = loading === plan.id
          const isFree = plan.id === 'scout'

          return (
            <div key={plan.id} style={{
              background: plan.highlight ? N : 'white',
              border: `${plan.highlight ? 2 : 1}px solid ${plan.highlight ? G : '#E5E7EB'}`,
              borderRadius: 20,
              padding: '36px 28px',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              boxShadow: plan.highlight ? `0 0 40px ${G}25` : 'none',
            }}>

              {plan.badge && (
                <span style={{
                  position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                  background: plan.highlight ? G : '#7C3AED',
                  color: '#fff', fontSize: 10, fontWeight: 800,
                  padding: '4px 14px', borderRadius: 99, whiteSpace: 'nowrap', letterSpacing: '0.06em',
                }}>
                  {plan.badge}
                </span>
              )}

              {/* Plan header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${plan.accentColor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={18} color={plan.accentColor} />
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 800, color: plan.highlight ? '#fff' : N, margin: 0, letterSpacing: '-0.01em' }}>{plan.name}</p>
                  <p style={{ fontSize: 10, fontWeight: 600, color: plan.accentColor, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{plan.seats}</p>
                </div>
              </div>

              <p style={{ fontSize: 12, color: plan.highlight ? 'rgba(255,255,255,0.45)' : '#9CA3AF', margin: '0 0 20px', lineHeight: 1.5 }}>
                {plan.tagline}
              </p>

              {/* Price */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: 4 }}>
                <span style={{ fontSize: 46, fontWeight: 900, color: plan.highlight ? '#fff' : N, letterSpacing: '-0.04em', lineHeight: 1 }}>
                  {isFree ? 'Free' : `€${price}`}
                </span>
                {!isFree && <span style={{ fontSize: 14, color: plan.highlight ? 'rgba(255,255,255,0.4)' : '#9CA3AF', marginBottom: 6 }}>/mo</span>}
              </div>
              <p style={{ fontSize: 12, color: plan.highlight ? 'rgba(255,255,255,0.35)' : '#9CA3AF', margin: '0 0 24px', minHeight: 18 }}>
                {isFree
                  ? 'Forever · no credit card needed'
                  : annual
                    ? `Billed as €${plan.price.annualTotal}/year`
                    : 'Billed monthly · cancel anytime'}
              </p>

              {/* CTA */}
              <button
                onClick={() => startCheckout(plan.id)}
                disabled={isLoading}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  padding: '13px 20px', borderRadius: 10, border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontWeight: 800, fontSize: 14, marginBottom: 24,
                  background: isFree ? '#F3F4F6' : plan.highlight ? G : plan.accentColor,
                  color: isFree ? N : '#fff',
                  opacity: isLoading ? 0.7 : 1,
                  transition: 'opacity 0.15s',
                  fontFamily: 'var(--font-montserrat), sans-serif',
                }}
              >
                {isLoading ? 'Redirecting…' : plan.cta} {!isLoading && !isFree && '→'}
              </button>

              {/* Divider */}
              <div style={{ height: 1, background: plan.highlight ? 'rgba(255,255,255,0.08)' : '#F3F4F6', marginBottom: 20 }} />

              {/* Feature list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9, flex: 1 }}>
                {plan.features.map(f => (
                  <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    {f.value === false ? (
                      <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'rgba(156,163,175,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <X size={9} color="#9CA3AF" strokeWidth={3} />
                      </div>
                    ) : (
                      <div style={{ width: 16, height: 16, borderRadius: '50%', background: `${plan.accentColor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Check size={9} color={plan.accentColor} strokeWidth={3} />
                      </div>
                    )}
                    <span style={{ fontSize: 13, color: f.value === false ? (plan.highlight ? 'rgba(255,255,255,0.2)' : '#9CA3AF') : (plan.highlight ? 'rgba(255,255,255,0.85)' : '#374151'), fontWeight: f.value !== true && f.value !== false ? 700 : 400 }}>
                      {f.label}
                      {f.value !== true && f.value !== false && (
                        <span style={{ color: plan.accentColor, marginLeft: 4 }}>({f.value})</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Compare at a glance */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 80px' }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: N, letterSpacing: '-0.02em', textAlign: 'center', margin: '0 0 8px' }}>
          Full feature comparison
        </h2>
        <p style={{ fontSize: 14, color: '#9CA3AF', textAlign: 'center', margin: '0 0 32px' }}>
          Every feature, side by side.
        </p>
        <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 16, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', width: '40%' }}>Feature</th>
                <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', width: '20%' }}>Scout</th>
                <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: 11, fontWeight: 700, color: G, textTransform: 'uppercase', letterSpacing: '0.06em', width: '20%' }}>Pro</th>
                <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '0.06em', width: '20%' }}>Agency</th>
              </tr>
            </thead>
            <tbody>
              {[
                { section: 'Core',          feature: 'Seats',                       scout: '1',         pro: '2',          agency: 'Unlimited' },
                { section: 'Core',          feature: 'Player profiles',              scout: '5 max',     pro: 'Unlimited',  agency: 'Unlimited' },
                { section: 'Core',          feature: 'Transfer pipeline',            scout: true,        pro: true,         agency: true        },
                { section: 'Core',          feature: 'Club mandate inbox',           scout: true,        pro: true,         agency: true        },
                { section: 'Intelligence',  feature: 'Player categories',            scout: false,       pro: true,         agency: true        },
                { section: 'Intelligence',  feature: 'AI mandate matching',          scout: false,       pro: true,         agency: true        },
                { section: 'Intelligence',  feature: 'Activity log per player',      scout: false,       pro: true,         agency: true        },
                { section: 'Intelligence',  feature: 'Duplicate player detection',   scout: false,       pro: true,         agency: true        },
                { section: 'Proposals',     feature: 'White-label PDF proposals',    scout: false,       pro: true,         agency: true        },
                { section: 'Proposals',     feature: 'Brand kit & custom colors',    scout: false,       pro: true,         agency: true        },
                { section: 'Proposals',     feature: 'AI proposal narrative',        scout: false,       pro: false,        agency: true        },
                { section: 'Proposals',     feature: 'Portfolio PDF export',         scout: false,       pro: false,        agency: true        },
                { section: 'Automation',    feature: 'Contract expiry alerts',       scout: false,       pro: true,         agency: true        },
                { section: 'Automation',    feature: 'WhatsApp quick-pitch',         scout: false,       pro: true,         agency: true        },
                { section: 'Automation',    feature: 'Market window calendar',       scout: false,       pro: false,        agency: true        },
                { section: 'Business',      feature: 'Commission tracker',           scout: false,       pro: true,         agency: true        },
                { section: 'Business',      feature: 'Club contact book',            scout: false,       pro: false,        agency: true        },
                { section: 'Business',      feature: 'API access',                   scout: false,       pro: false,        agency: true        },
                { section: 'Business',      feature: 'Priority support',             scout: false,       pro: false,        agency: true        },
              ].map((row, i, arr) => {
                const showSection = i === 0 || arr[i - 1].section !== row.section
                return (
                  <React.Fragment key={`row-${i}`}>
                    {showSection && (
                      <tr style={{ background: '#FAFAFA', borderTop: i > 0 ? '1px solid #F3F4F6' : undefined }}>
                        <td colSpan={4} style={{ padding: '8px 20px 6px', fontSize: 10, fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                          {row.section}
                        </td>
                      </tr>
                    )}
                    <tr style={{ borderTop: '1px solid #F3F4F6' }}>
                      <td style={{ padding: '11px 20px', fontSize: 13, color: '#374151', fontWeight: 500 }}>{row.feature}</td>
                      {[row.scout, row.pro, row.agency].map((val, j) => (
                        <td key={j} style={{ padding: '11px 20px', textAlign: 'center' }}>
                          {val === true  && <Check size={16} color="#059669" strokeWidth={2.5} style={{ margin: '0 auto' }} />}
                          {val === false && <X size={14} color="#D1D5DB" strokeWidth={2.5} style={{ margin: '0 auto' }} />}
                          {val !== true && val !== false && (
                            <span style={{ fontSize: 12, fontWeight: 700, color: j === 0 ? '#6B7280' : j === 1 ? G : '#7C3AED' }}>{val}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  </React.Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Social proof strip */}
      <div style={{ background: N, padding: '40px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
          Trusted by agents across Europe
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 48, flexWrap: 'wrap' }}>
          {[
            { stat: '500+', label: 'Players managed' },
            { stat: '30+', label: 'Countries' },
            { stat: '4B€+', label: 'In player market value' },
          ].map(({ stat, label }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 28, fontWeight: 900, color: G, margin: '0 0 2px', letterSpacing: '-0.03em' }}>{stat}</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: 0, fontWeight: 500 }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '64px 24px 80px' }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: N, letterSpacing: '-0.02em', textAlign: 'center', margin: '0 0 40px' }}>Frequently asked questions</h2>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {FAQ.map((item, i) => (
            <div key={i} style={{ borderTop: '1px solid #E5E7EB', padding: '22px 0' }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: N, margin: '0 0 8px' }}>{item.q}</p>
              <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.7, margin: 0 }}>{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div style={{ background: N, padding: '64px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', margin: '0 0 12px' }}>
          Ready to run your agency smarter?
        </h2>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', margin: '0 auto 28px', maxWidth: 400 }}>
          Join agents already using Welko AgentOS to win more mandates and close deals faster.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/registro" style={{ padding: '14px 28px', borderRadius: 10, background: G, color: '#fff', fontWeight: 800, fontSize: 14, textDecoration: 'none' }}>
            Start for free →
          </Link>
          <button
            onClick={() => startCheckout('premium')}
            style={{ padding: '14px 28px', borderRadius: 10, background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'var(--font-montserrat), sans-serif' }}
          >
            Upgrade to Pro — €59/mo
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: '#060E1A', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '28px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <Link href="/" style={{ fontSize: 16, fontWeight: 800, color: '#fff', textDecoration: 'none' }}>
            Welko <span style={{ color: G }}>AgentOS</span>
          </Link>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', margin: 0 }}>
            © {new Date().getFullYear()} Welko AgentOS · welko.agency
          </p>
        </div>
      </footer>
    </div>
  )
}
