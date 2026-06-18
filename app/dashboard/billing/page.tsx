'use client'

import { useState, useEffect } from 'react'
import { CreditCard, Loader2, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react'
import Link from 'next/link'

const N = '#0A0A0A'
const G = '#2563EB'

interface BillingInfo {
  planType:         string
  status:           string
  cancelAtPeriodEnd: boolean
  currentPeriodEnd: string | null
  hasSubscription:  boolean
}

const PLAN_LABEL: Record<string, string> = {
  FREE:             'Scout — Free',
  PREMIUM_MONTHLY:  'Polaris Premium · Monthly',
  PREMIUM_ANNUAL:   'Polaris Premium · Annual',
  AGENCY_MONTHLY:   'Polaris Agency · Monthly',
  AGENCY_ANNUAL:    'Polaris Agency · Annual',
}

const PLAN_FEATURES: Record<string, Array<[string, string]>> = {
  FREE: [
    ['Player Profiles', 'Up to 5'],
    ['Team Members', '1'],
    ['Proposals', 'Basic'],
    ['AI Features', 'Not included'],
  ],
  PREMIUM_MONTHLY: [
    ['Player Profiles', 'Unlimited'],
    ['Team Members', 'Up to 5'],
    ['AI Proposals', 'Included'],
    ['Pipeline CRM', 'Included'],
  ],
  PREMIUM_ANNUAL: [
    ['Player Profiles', 'Unlimited'],
    ['Team Members', 'Up to 5'],
    ['AI Proposals', 'Included'],
    ['Pipeline CRM', 'Included'],
  ],
  AGENCY_MONTHLY: [
    ['Player Profiles', 'Unlimited'],
    ['Team Members', 'Unlimited'],
    ['AI Proposals', 'Included'],
    ['White-label PDF', 'Included'],
  ],
  AGENCY_ANNUAL: [
    ['Player Profiles', 'Unlimited'],
    ['Team Members', 'Unlimited'],
    ['AI Proposals', 'Included'],
    ['White-label PDF', 'Included'],
  ],
}

export default function BillingPage() {
  const [billing,  setBilling]  = useState<BillingInfo | null>(null)
  const [loading,  setLoading]  = useState(true)
  const [portalLoading, setPortalLoading] = useState(false)
  const [portalError,   setPortalError]   = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/dashboard/billing').then(r => r.json()).then(d => setBilling(d))
      .finally(() => setLoading(false))
  }, [])

  async function openPortal() {
    setPortalLoading(true)
    setPortalError(null)
    try {
      const res  = await fetch('/api/billing/portal', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setPortalError(data.error ?? 'Could not open billing portal.')
      }
    } catch {
      setPortalError('Network error. Please try again.')
    } finally {
      setPortalLoading(false)
    }
  }

  const isPremium = billing && billing.planType !== 'FREE'
  const features  = PLAN_FEATURES[billing?.planType ?? 'FREE'] ?? PLAN_FEATURES.FREE

  return (
    <div style={{ padding: 'clamp(20px,4vw,40px) clamp(16px,4vw,40px) 80px', fontFamily: 'var(--font-montserrat), sans-serif', maxWidth: 700 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: `${G}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CreditCard size={18} color={G} />
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: N, margin: 0, letterSpacing: '-0.03em' }}>Billing & Subscription</h1>
      </div>
      <p style={{ color: '#9CA3AF', margin: '0 0 28px', fontSize: 14 }}>Manage your plan and payment details.</p>

      {loading ? (
        <div style={{ padding: 64, textAlign: 'center', color: '#9CA3AF' }}>
          <Loader2 size={22} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 12px', display: 'block' }} />
          <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
        </div>
      ) : (
        <>
          <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>

          {/* Current plan card */}
          <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 16, padding: 28, marginBottom: 16 }}>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <p style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }}>Current Plan</p>
                <p style={{ fontSize: 20, fontWeight: 800, color: N, margin: 0 }}>
                  {PLAN_LABEL[billing?.planType ?? 'FREE'] ?? billing?.planType}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {billing?.status === 'ACTIVE' || billing?.status === 'TRIALING' ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(5,150,105,0.08)', color: '#059669', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, border: '1px solid rgba(5,150,105,0.2)' }}>
                    <CheckCircle size={12} strokeWidth={2.5} />
                    {billing.status === 'TRIALING' ? 'Trial' : 'Active'}
                  </span>
                ) : billing?.status === 'PAST_DUE' ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(245,158,11,0.08)', color: '#F59E0B', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, border: '1px solid rgba(245,158,11,0.2)' }}>
                    <AlertCircle size={12} strokeWidth={2.5} /> Past due
                  </span>
                ) : (
                  <span style={{ background: '#F3F4F6', color: '#6B7280', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                    {billing?.status ?? 'Free'}
                  </span>
                )}
              </div>
            </div>

            {/* Feature grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '16px 0', borderTop: '1px solid #F3F4F6', borderBottom: '1px solid #F3F4F6', marginBottom: 20 }}>
              {features.map(([k, v]) => (
                <div key={k}>
                  <p style={{ fontSize: 12, color: '#9CA3AF', margin: '0 0 2px' }}>{k}</p>
                  <p style={{ fontSize: 14, fontWeight: 700, color: N, margin: 0 }}>{v}</p>
                </div>
              ))}
            </div>

            {/* Renewal info */}
            {billing?.currentPeriodEnd && (
              <p style={{ fontSize: 12, color: '#9CA3AF', margin: '0 0 16px' }}>
                {billing.cancelAtPeriodEnd
                  ? `Cancels on ${new Date(billing.currentPeriodEnd).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`
                  : `Renews on ${new Date(billing.currentPeriodEnd).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`}
              </p>
            )}

            {!isPremium && (
              <Link href="/precios" style={{ display: 'block', textAlign: 'center', background: N, color: 'white', padding: 12, borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
                Upgrade to Polaris Premium →
              </Link>
            )}
          </div>

          {/* Billing portal */}
          {billing?.hasSubscription && (
            <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 12, overflow: 'hidden' }}>
              <button
                onClick={openPortal}
                disabled={portalLoading}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'none', border: 'none', padding: 14, cursor: portalLoading ? 'wait' : 'pointer', fontSize: 14, color: '#6B7280', fontFamily: 'inherit', fontWeight: 600 }}
              >
                {portalLoading
                  ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Opening portal…</>
                  : <><ExternalLink size={14} /> Manage Billing Portal</>}
              </button>
              {portalError && (
                <p style={{ fontSize: 12, color: '#EF4444', textAlign: 'center', padding: '0 16px 12px', margin: 0 }}>{portalError}</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
