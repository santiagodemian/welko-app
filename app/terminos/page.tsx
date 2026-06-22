import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { C, FONT, T, R, SECTION } from '@/lib/ds'

export const metadata: Metadata = {
  title: 'Terms of Service — Polaris Football',
  description: 'Terms of Service for the Polaris Football Intelligence Platform subscription service.',
}

const SECTIONS = [
  { id: 'service',       num: '01', title: 'Service Description' },
  { id: 'subscriptions', num: '02', title: 'Subscriptions & Payment' },
  { id: 'acceptable',    num: '03', title: 'Acceptable Use' },
  { id: 'ip',            num: '04', title: 'Intellectual Property' },
  { id: 'disclaimers',   num: '05', title: 'Disclaimers' },
  { id: 'liability',     num: '06', title: 'Limitation of Liability' },
  { id: 'termination',   num: '07', title: 'Termination' },
  { id: 'governing',     num: '08', title: 'Governing Law' },
  { id: 'changes',       num: '09', title: 'Changes to These Terms' },
  { id: 'contact',       num: '10', title: 'Contact' },
]

export default function TermsPage() {
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
              Terms of Service
            </h1>
            <p style={{ ...T.small, color: C.textMuted, margin: 0 }}>
              Polaris Football Intelligence Platform · Last updated: June 2026
            </p>
          </div>

          <div style={{ height: 1, background: C.border }} />

          <nav style={{ background: C.bgLight, border: `1px solid ${C.border}`, borderRadius: R.panel, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p style={{ ...T.label, color: C.textMuted, margin: '0 0 8px' }}>Contents</p>
            {SECTIONS.map(s => (
              <a key={s.id} href={`#${s.id}`} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                fontSize: 13, color: C.textPrimary, textDecoration: 'none',
                fontFamily: FONT.sans, transition: 'opacity 0.15s',
              }}>
                <span style={{ fontFamily: FONT.mono, fontSize: 10, color: C.textMuted, minWidth: 20 }}>{s.num}</span>
                {s.title}
              </a>
            ))}
          </nav>

          <p style={{ ...T.body, color: '#374151', lineHeight: 1.8, margin: 0 }}>
            These Terms of Service govern your access to and use of the Polaris Football Intelligence Platform operated by Polaris Football. By creating an account or accessing any part of the platform, you agree to be bound by these Terms. If you do not agree, you must not use the service.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

            <TermsSection id="service" num="01" title="Service Description">
              <p>
                Polaris Football operates a subscription-based football intelligence platform providing scouting reports, recruitment analytics, transfer market analysis, tactical analysis, club intelligence briefings, and related football intelligence content. The platform is designed for football professionals including scouts, agents, sporting directors, club analysts, and executive staff.
              </p>
              <p>
                Content on the platform includes proprietary research and analysis produced by the Polaris editorial and scouting teams. The availability, scope, and depth of specific content categories may vary by subscription tier and are subject to change as the platform develops.
              </p>
            </TermsSection>

            <TermsSection id="subscriptions" num="02" title="Subscriptions & Payment">
              <p>
                Access to the Polaris Football Intelligence Platform requires a paid subscription. Subscription plans are available on a monthly or annual basis and are detailed on our pricing page. Prices are listed in British Pounds Sterling and are inclusive of applicable VAT where required by law.
              </p>
              <p>
                All payments are processed securely by Stripe, Inc. By subscribing, you authorise Polaris Football to charge your nominated payment method at the beginning of each billing cycle. Subscriptions renew automatically unless cancelled before the renewal date.
              </p>
              <p>
                You may cancel your subscription at any time from your account dashboard. Cancellation takes effect at the end of the current billing period. You will retain access to the platform until that date. Please refer to our Refund Policy for information on refund eligibility.
              </p>
            </TermsSection>

            <TermsSection id="acceptable" num="03" title="Acceptable Use">
              <p>
                Your subscription grants you a personal, non-transferable licence to access and use the Polaris Football Intelligence Platform for legitimate professional football purposes. The following activities are strictly prohibited:
              </p>
              <ul style={{ margin: '12px 0 0', paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  'Redistributing, republishing, or reselling any report, analysis, or content from the platform without express written permission from Polaris Football.',
                  'Scraping, crawling, or using automated tools to extract data or content from the platform.',
                  'Sharing account credentials with individuals who are not covered by your subscription.',
                  'Using platform content to create competing intelligence products or services.',
                  'Attempting to reverse-engineer, decompile, or otherwise access the platform\'s source code or data infrastructure.',
                  'Using the platform for any purpose that violates applicable law or regulations.',
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: 10, fontSize: 13, color: '#374151', lineHeight: 1.75 }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: C.blue, flexShrink: 0, marginTop: 8 }} />
                    {item}
                  </li>
                ))}
              </ul>
              <p>
                Polaris Football reserves the right to suspend or terminate accounts that violate these terms without prior notice and without refund.
              </p>
            </TermsSection>

            <TermsSection id="ip" num="04" title="Intellectual Property">
              <p>
                All content, reports, data, analysis, software, design, and other materials available through the Polaris Football Intelligence Platform are the exclusive intellectual property of Polaris Football or its licensed contributors, and are protected by copyright, database rights, and other applicable intellectual property laws.
              </p>
              <p>
                Your subscription grants you a limited right to access and use this content for your own professional purposes. It does not transfer any ownership rights to you. You may not use Polaris Football branding, logos, or proprietary methodology descriptions without express written consent.
              </p>
              <p>
                Any feedback, suggestions, or ideas submitted to Polaris Football regarding the platform may be used by Polaris Football without restriction or compensation.
              </p>
            </TermsSection>

            <TermsSection id="disclaimers" num="05" title="Disclaimers">
              <p>
                The Polaris Football Intelligence Platform is provided for informational and professional reference purposes only. While we take significant care to ensure the accuracy and quality of our intelligence content, we make no warranties — express or implied — regarding the completeness, timeliness, or fitness for purpose of any specific report or analysis.
              </p>
              <p>
                Football intelligence involves inherent uncertainty. Transfer market analyses, player valuations, and recruitment recommendations are professional assessments based on available information at the time of publication and should not be treated as guarantees of outcome. Polaris Football accepts no liability for commercial or sporting decisions made on the basis of platform content.
              </p>
            </TermsSection>

            <TermsSection id="liability" num="06" title="Limitation of Liability">
              <p>
                To the maximum extent permitted by applicable law, Polaris Football shall not be liable for any indirect, incidental, consequential, special, or punitive damages arising from your use of the platform, including but not limited to loss of profits, loss of data, or missed business opportunities.
              </p>
              <p>
                Our total liability to you for any claim arising from your use of the platform, regardless of the basis of the claim, shall not exceed the total subscription fees paid by you in the twelve months preceding the claim.
              </p>
            </TermsSection>

            <TermsSection id="termination" num="07" title="Termination">
              <p>
                You may terminate your subscription and close your account at any time. Polaris Football may suspend or terminate your access immediately if you breach these Terms, fail to pay subscription fees, or engage in conduct that we reasonably determine to be harmful to the platform, other users, or Polaris Football.
              </p>
              <p>
                Upon termination, your right to access the platform ceases immediately. Sections relating to intellectual property, disclaimers, limitation of liability, and governing law will survive any termination of these Terms.
              </p>
            </TermsSection>

            <TermsSection id="governing" num="08" title="Governing Law">
              <p>
                These Terms of Service and any disputes arising from your use of the Polaris Football Intelligence Platform are governed by the laws of England and Wales. You agree to submit to the exclusive jurisdiction of the courts of England and Wales for the resolution of any disputes.
              </p>
            </TermsSection>

            <TermsSection id="changes" num="09" title="Changes to These Terms">
              <p>
                Polaris Football may update these Terms from time to time to reflect changes in our service, business practices, or applicable law. We will notify you of material changes by email at least 14 days before they take effect. Your continued use of the platform after the effective date of any changes constitutes your acceptance of the updated Terms.
              </p>
            </TermsSection>

            <TermsSection id="contact" num="10" title="Contact">
              <p>
                For questions about these Terms of Service, please contact us at{' '}
                <a href="mailto:legal@polarisfootball.com" style={{ color: C.blue, fontWeight: 600, textDecoration: 'none' }}>
                  legal@polarisfootball.com
                </a>
                . We aim to respond to all enquiries within five business days.
              </p>
            </TermsSection>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}

function TermsSection({ id, num, title, children }: { id: string; num: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} style={{ display: 'flex', flexDirection: 'column', gap: 14, scrollMarginTop: 80 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontFamily: FONT.mono, fontSize: 10, fontWeight: 700, color: C.textMuted }}>{num}</span>
        <h2 style={{ fontFamily: FONT.display, fontSize: 18, fontWeight: 700, color: C.textPrimary, margin: 0, letterSpacing: '-0.015em', textTransform: 'uppercase' }}>
          {title}
        </h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13, color: '#374151', lineHeight: 1.8 }}>
        {children}
      </div>
    </section>
  )
}
