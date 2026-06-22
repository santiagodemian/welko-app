import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { C, FONT, T, R, SECTION } from '@/lib/ds'

export const metadata: Metadata = {
  title: 'Refund Policy — Polaris Football',
  description: '7-day satisfaction guarantee for new Polaris Football subscribers. Our refund policy for the intelligence platform.',
}

export default function RefundPage() {
  return (
    <div style={{ fontFamily: FONT.sans, background: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, padding: `clamp(80px,10vw,112px) ${SECTION.padH} clamp(64px,8vw,96px)` }}>
        <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 40 }}>

          <Link href="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 11, fontWeight: 700, color: C.textMuted,
            textDecoration: 'none', letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            ← Back to Home
          </Link>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span style={{
              display: 'inline-block', padding: '4px 10px', borderRadius: R.badge,
              fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
              background: C.blueDim, color: C.blue, border: `1px solid ${C.blueStr}`, width: 'fit-content',
            }}>
              Legal
            </span>
            <h1 style={{ fontFamily: FONT.display, fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: C.textPrimary, margin: 0, letterSpacing: '-0.025em', textTransform: 'uppercase', lineHeight: 1.05 }}>
              Refund Policy
            </h1>
            <p style={{ ...T.small, color: C.textMuted, margin: 0 }}>
              Polaris Football Intelligence Platform · Last updated: June 2026
            </p>
          </div>

          <div style={{ height: 1, background: C.border }} />

          <div style={{
            padding: '24px 28px', borderRadius: R.panel,
            background: '#EFF6FF', border: `1px solid ${C.blueMid}`,
            display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            <p style={{ fontFamily: FONT.display, fontSize: 16, fontWeight: 700, color: C.textPrimary, margin: 0, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
              7-Day Satisfaction Guarantee
            </p>
            <p style={{ ...T.body, color: '#374151', margin: 0, lineHeight: 1.8 }}>
              New subscribers to the Polaris Football Intelligence Platform are entitled to a full refund within seven calendar days of their first subscription payment, no questions asked. If the platform does not meet your professional needs, we will return your payment in full.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>

            <RefundSection title="1. Seven-Day Guarantee for New Subscribers">
              <p>
                If you are a first-time subscriber to Polaris Football and you request a refund within seven calendar days of your initial subscription payment, you are entitled to a full refund of that payment. This applies to both monthly and annual subscription plans.
              </p>
              <p>
                To request a refund under this guarantee, email us at{' '}
                <a href="mailto:refunds@polarisfootball.com" style={{ color: C.blue, fontWeight: 600, textDecoration: 'none' }}>
                  refunds@polarisfootball.com
                </a>{' '}
                with the subject line &quot;Refund Request&quot; and include the email address associated with your account. We will process the refund within five business days to your original payment method.
              </p>
              <p>
                The seven-day period begins from the date and time of your first successful subscription payment as recorded by Stripe, our payment processor.
              </p>
            </RefundSection>

            <RefundSection title="2. Individual Report Purchases">
              <p>
                Where Polaris Football makes individual reports available for one-time purchase outside a subscription, refunds are not available once the report has been accessed. If you experience a technical issue preventing access to a purchased report, please contact our support team and we will resolve the issue promptly or issue a credit to your account.
              </p>
            </RefundSection>

            <RefundSection title="3. Subscription Renewals">
              <p>
                After the initial seven-day guarantee period has passed, subscription renewal charges are non-refundable. You may cancel your subscription at any time from your account dashboard to prevent future billing. Cancellation takes effect at the end of your current billing period, and you will retain platform access until that date.
              </p>
              <p>
                We recommend enabling subscription renewal reminders in your account settings if you wish to review your subscription before the next billing date.
              </p>
            </RefundSection>

            <RefundSection title="4. Unrecognised Charges">
              <p>
                If you believe a charge to your payment method was made in error, contact us immediately at{' '}
                <a href="mailto:refunds@polarisfootball.com" style={{ color: C.blue, fontWeight: 600, textDecoration: 'none' }}>
                  refunds@polarisfootball.com
                </a>
                . We will investigate the charge promptly and, where an error has occurred, issue a full refund without delay.
              </p>
            </RefundSection>

            <RefundSection title="5. Refund Processing">
              <p>
                All approved refunds are returned to the original payment method used at the time of purchase. Stripe, our payment processor, will return the funds to your card within 5–10 business days depending on your card issuer. You will receive an email confirmation when the refund has been initiated.
              </p>
              <p>
                Polaris Football does not charge any administration fees for processing refunds.
              </p>
            </RefundSection>

            <RefundSection title="6. Contact">
              <p>
                For all refund requests and billing enquiries, contact our team at{' '}
                <a href="mailto:refunds@polarisfootball.com" style={{ color: C.blue, fontWeight: 600, textDecoration: 'none' }}>
                  refunds@polarisfootball.com
                </a>
                . We aim to respond to all refund requests within two business days.
              </p>
            </RefundSection>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}

function RefundSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h2 style={{ fontFamily: FONT.display, fontSize: 17, fontWeight: 700, color: C.textPrimary, margin: 0, letterSpacing: '-0.015em' }}>
        {title}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13, color: '#374151', lineHeight: 1.8 }}>
        {children}
      </div>
    </section>
  )
}
