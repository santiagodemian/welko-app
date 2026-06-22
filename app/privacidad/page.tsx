import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { C, FONT, T, R, SECTION } from '@/lib/ds'

export const metadata: Metadata = {
  title: 'Privacy Policy — Polaris Football',
  description: 'Privacy Policy for the Polaris Football Intelligence Platform. How we collect, use, and protect your personal data.',
}

const SECTIONS = [
  { id: 'what-we-collect',  num: '01', title: 'What Data We Collect' },
  { id: 'how-we-use',       num: '02', title: 'How We Use Your Data' },
  { id: 'third-parties',    num: '03', title: 'Third-Party Services' },
  { id: 'your-rights',      num: '04', title: 'Your Rights' },
  { id: 'retention',        num: '05', title: 'Data Retention' },
  { id: 'cookies',          num: '06', title: 'Cookies' },
  { id: 'changes',          num: '07', title: 'Changes to This Policy' },
  { id: 'contact',          num: '08', title: 'Contact' },
]

export default function PrivacyPage() {
  const PH = SECTION.padH
  return (
    <div style={{ fontFamily: FONT.sans, background: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, padding: `clamp(80px,10vw,112px) ${PH} clamp(64px,8vw,96px)` }}>
        <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 40 }}>

          <Link href="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 11, fontWeight: 700, color: C.textMuted,
            textDecoration: 'none', letterSpacing: '0.08em', textTransform: 'uppercase',
            transition: 'color 0.15s',
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
              Privacy Policy
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

            <LegalSection id="what-we-collect" num="01" title="What Data We Collect">
              <p style={{ ...T.body, color: '#374151', lineHeight: 1.8, margin: '0 0 16px' }}>
                When you use the Polaris Football Intelligence Platform, we may collect the following categories of personal data:
              </p>
              <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Account information', desc: 'Your name, email address, and job title provided when you create an account.' },
                  { label: 'Payment information', desc: 'Billing details including card type and last four digits, processed securely by Stripe. We do not store full card numbers.' },
                  { label: 'Usage data', desc: 'Pages visited, reports accessed, search queries, and session duration — used to improve the platform experience.' },
                  { label: 'Device and browser data', desc: 'IP address, browser type, operating system, and referrer URL collected automatically for security and performance purposes.' },
                ].map(item => (
                  <li key={item.label} style={{ display: 'flex', gap: 12, fontSize: 13, color: '#374151', lineHeight: 1.75 }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: C.blue, flexShrink: 0, marginTop: 8 }} />
                    <span><strong style={{ color: C.textPrimary, fontWeight: 600 }}>{item.label}:</strong> {item.desc}</span>
                  </li>
                ))}
              </ul>
            </LegalSection>

            <LegalSection id="how-we-use" num="02" title="How We Use Your Data">
              <p style={{ ...T.body, color: '#374151', lineHeight: 1.8, margin: '0 0 16px' }}>
                We use your personal data for the following purposes:
              </p>
              <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  'To create and manage your account, and deliver your subscription to the Polaris Football Intelligence Platform.',
                  'To process payments and manage your subscription billing through Stripe.',
                  'To send you intelligence updates, new report notifications, and platform announcements relevant to your subscription tier.',
                  'To improve the platform — analysing usage patterns to identify features that work well and areas that need improvement.',
                  'To respond to support requests and enquiries submitted through the platform or by email.',
                  'To comply with legal obligations and protect Polaris Football from fraudulent or abusive activity.',
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: 12, fontSize: 13, color: '#374151', lineHeight: 1.75 }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: C.blue, flexShrink: 0, marginTop: 8 }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p style={{ ...T.small, color: C.textSecondary, margin: '16px 0 0', lineHeight: 1.7 }}>
                We do not sell your personal data to third parties, and we do not use your data to train external AI models or share it for advertising purposes.
              </p>
            </LegalSection>

            <LegalSection id="third-parties" num="03" title="Third-Party Services">
              <p style={{ ...T.body, color: '#374151', lineHeight: 1.8, margin: '0 0 16px' }}>
                To operate the Polaris Football Intelligence Platform, we work with the following trusted third-party services:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { name: 'Stripe', desc: 'Processes all subscription payments. Stripe is PCI DSS Level 1 certified. Your card data is never held on Polaris servers.' },
                  { name: 'Clerk', desc: 'Manages user authentication, login sessions, and account security. Clerk handles password management and multi-factor authentication.' },
                  { name: 'Vercel', desc: 'Hosts the Polaris Football platform infrastructure. All data is processed within regions compliant with applicable data protection standards.' },
                ].map(tp => (
                  <div key={tp.name} style={{ padding: '14px 18px', borderRadius: R.card, background: C.bgLight, border: `1px solid ${C.border}` }}>
                    <p style={{ fontFamily: FONT.sans, fontSize: 13, fontWeight: 700, color: C.textPrimary, margin: '0 0 4px' }}>{tp.name}</p>
                    <p style={{ fontFamily: FONT.sans, fontSize: 12, color: C.textSecondary, margin: 0, lineHeight: 1.7 }}>{tp.desc}</p>
                  </div>
                ))}
              </div>
            </LegalSection>

            <LegalSection id="your-rights" num="04" title="Your Rights">
              <p style={{ ...T.body, color: '#374151', lineHeight: 1.8, margin: '0 0 16px' }}>
                You have the following rights regarding your personal data:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
                {[
                  { title: 'Access', desc: 'Request a copy of the personal data we hold about you.' },
                  { title: 'Correction', desc: 'Ask us to correct inaccurate or incomplete data.' },
                  { title: 'Deletion', desc: 'Request the deletion of your account and associated personal data.' },
                  { title: 'Portability', desc: 'Receive your data in a structured, machine-readable format.' },
                ].map(right => (
                  <div key={right.title} style={{ padding: '14px 16px', borderRadius: R.card, background: C.bgLight, border: `1px solid ${C.border}`, display: 'flex', gap: 12 }}>
                    <div style={{ width: 32, height: 32, borderRadius: R.button, background: C.blueDim, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontFamily: FONT.display, fontSize: 11, fontWeight: 700, color: C.blue }}>{right.title[0]}</span>
                    </div>
                    <div>
                      <p style={{ fontFamily: FONT.sans, fontSize: 12, fontWeight: 700, color: C.textPrimary, margin: '0 0 3px' }}>{right.title}</p>
                      <p style={{ fontFamily: FONT.sans, fontSize: 11, color: C.textSecondary, margin: 0, lineHeight: 1.6 }}>{right.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p style={{ ...T.small, color: '#374151', margin: '16px 0 0', lineHeight: 1.7 }}>
                To exercise any of these rights, email us at{' '}
                <a href="mailto:privacy@polarisfootball.com" style={{ color: C.blue, fontWeight: 600, textDecoration: 'none' }}>
                  privacy@polarisfootball.com
                </a>
                . We will respond within 30 days.
              </p>
            </LegalSection>

            <LegalSection id="retention" num="05" title="Data Retention">
              <p style={{ ...T.body, color: '#374151', lineHeight: 1.8, margin: 0 }}>
                We retain your personal data for as long as your account remains active or as necessary to fulfil the purposes described in this policy. Account data is deleted within 90 days of a deletion request. Billing and transaction records may be retained for up to seven years for legal and financial compliance purposes. Anonymised usage analytics data may be retained indefinitely as it cannot be used to identify you.
              </p>
            </LegalSection>

            <LegalSection id="cookies" num="06" title="Cookies">
              <p style={{ ...T.body, color: '#374151', lineHeight: 1.8, margin: 0 }}>
                Polaris Football uses strictly necessary session cookies to maintain your login state and platform preferences. We do not use advertising cookies, tracking cookies, or third-party analytics cookies that profile your behaviour across other websites. You can clear session cookies at any time through your browser settings, though this will log you out of your account.
              </p>
            </LegalSection>

            <LegalSection id="changes" num="07" title="Changes to This Policy">
              <p style={{ ...T.body, color: '#374151', lineHeight: 1.8, margin: 0 }}>
                We may update this Privacy Policy from time to time to reflect changes in our practices or applicable law. We will notify registered users by email at least 14 days before any material changes take effect. The updated date at the top of this page always reflects the most recent version. Your continued use of the platform after the effective date constitutes acceptance of the updated policy.
              </p>
            </LegalSection>

            <LegalSection id="contact" num="08" title="Contact">
              <p style={{ ...T.body, color: '#374151', lineHeight: 1.8, margin: 0 }}>
                For privacy-related questions, data requests, or concerns about how we handle your personal data, please contact us at{' '}
                <a href="mailto:privacy@polarisfootball.com" style={{ color: C.blue, fontWeight: 600, textDecoration: 'none' }}>
                  privacy@polarisfootball.com
                </a>
                . Polaris Football operates from its registered address in England. If you are based in the European Economic Area and believe your rights have not been respected, you have the right to lodge a complaint with your local data protection authority.
              </p>
            </LegalSection>

          </div>

          <div style={{
            padding: '24px', borderRadius: R.panel,
            background: C.blueDim, border: `1px solid ${C.blueStr}`,
            display: 'flex', flexDirection: 'column', gap: 12,
          }}>
            <p style={{ fontFamily: FONT.sans, fontSize: 14, fontWeight: 700, color: C.textPrimary, margin: 0 }}>
              Questions about your privacy?
            </p>
            <p style={{ ...T.small, color: C.textSecondary, margin: 0 }}>
              Our team responds to privacy requests within 30 days.
            </p>
            <a href="mailto:privacy@polarisfootball.com" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 11, fontWeight: 700, color: C.blue,
              textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>
              Contact Privacy Team →
            </a>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}

function LegalSection({ id, num, title, children }: { id: string; num: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} style={{ display: 'flex', flexDirection: 'column', gap: 16, scrollMarginTop: 80 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontFamily: FONT.mono, fontSize: 10, fontWeight: 700, color: C.textMuted }}>{num}</span>
        <h2 style={{ fontFamily: FONT.display, fontSize: 18, fontWeight: 700, color: C.textPrimary, margin: 0, letterSpacing: '-0.015em', textTransform: 'uppercase' }}>
          {title}
        </h2>
      </div>
      <div>{children}</div>
    </section>
  )
}
