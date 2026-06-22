import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { C, FONT } from '@/lib/ds'

function PitchSVG() {
  return (
    <svg
      viewBox="0 0 400 540"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      aria-hidden="true"
    >
      <rect x="30" y="30" width="340" height="480" rx="6" stroke="#2563EB" strokeWidth="2" strokeOpacity="0.22" />
      <line x1="30" y1="270" x2="370" y2="270" stroke="#2563EB" strokeWidth="1.5" strokeOpacity="0.22" />
      <circle cx="200" cy="270" r="52" stroke="#2563EB" strokeWidth="1.5" strokeOpacity="0.22" />
      <circle cx="200" cy="270" r="4" fill="#2563EB" fillOpacity="0.3" />
      <rect x="110" y="30" width="180" height="80" stroke="#2563EB" strokeWidth="1.5" strokeOpacity="0.22" />
      <rect x="148" y="30" width="104" height="38" stroke="#2563EB" strokeWidth="1.5" strokeOpacity="0.22" />
      <circle cx="200" cy="110" r="14" stroke="#2563EB" strokeWidth="1.5" strokeOpacity="0.22" />
      <rect x="110" y="430" width="180" height="80" stroke="#2563EB" strokeWidth="1.5" strokeOpacity="0.22" />
      <rect x="148" y="472" width="104" height="38" stroke="#2563EB" strokeWidth="1.5" strokeOpacity="0.22" />
      <circle cx="200" cy="430" r="14" stroke="#2563EB" strokeWidth="1.5" strokeOpacity="0.22" />
      <circle cx="200" cy="175" r="5" fill="#2563EB" fillOpacity="0.4" />
      <circle cx="145" cy="220" r="5" fill="#2563EB" fillOpacity="0.4" />
      <circle cx="255" cy="220" r="5" fill="#2563EB" fillOpacity="0.4" />
      <circle cx="115" cy="258" r="5" fill="#2563EB" fillOpacity="0.4" />
      <circle cx="200" cy="252" r="5" fill="#2563EB" fillOpacity="0.4" />
      <circle cx="285" cy="258" r="5" fill="#2563EB" fillOpacity="0.4" />
      <circle cx="145" cy="298" r="5" fill="#2563EB" fillOpacity="0.4" />
      <circle cx="255" cy="298" r="5" fill="#2563EB" fillOpacity="0.4" />
      <circle cx="200" cy="340" r="5" fill="#2563EB" fillOpacity="0.4" />
      <circle cx="162" cy="378" r="5" fill="#2563EB" fillOpacity="0.4" />
      <circle cx="238" cy="378" r="5" fill="#2563EB" fillOpacity="0.4" />
    </svg>
  )
}

export default function LoginPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', fontFamily: FONT.sans }}>
      <style>{`
        @media (max-width: 768px) {
          .login-left  { grid-column: 1 / -1 !important; }
          .login-right { display: none !important; }
        }
        .back-link { transition: color 0.15s; }
        .back-link:hover { color: #0A0A0A !important; }
        .intel-card { background: #fff; border-radius: 10px; padding: 14px 18px; box-shadow: 0 4px 20px rgba(37,99,235,0.1), 0 1px 4px rgba(0,0,0,0.05); }
      `}</style>

      <div className="login-left" style={{
        background: '#fff', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '48px 40px', position: 'relative',
      }}>
        <div style={{ position: 'absolute', top: 28, left: 32 }}>
          <Link href="/" className="back-link" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 11, fontWeight: 700, color: '#9CA3AF',
            textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>
            <ArrowLeft size={12} /> Back to site
          </Link>
        </div>

        <div style={{ width: '100%', maxWidth: 400 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/polarispnglogo.jpeg"
            alt="Polaris Football"
            style={{ height: 40, objectFit: 'contain', marginBottom: 40, display: 'block' }}
          />

          <div style={{ marginBottom: 32 }}>
            <p style={{
              fontSize: 10, fontWeight: 700, color: C.blue,
              letterSpacing: '0.16em', textTransform: 'uppercase', margin: '0 0 10px',
            }}>
              Welcome Back
            </p>
            <h1 style={{
              fontFamily: 'var(--font-space-grotesk), sans-serif',
              fontSize: 30, fontWeight: 700, color: '#0A0A0A',
              margin: '0 0 10px', letterSpacing: '-0.025em', lineHeight: 1.08,
            }}>
              Access Your<br /><span style={{ color: C.blue }}>Intelligence.</span>
            </h1>
            <p style={{ fontSize: 13, color: '#6B7280', margin: 0, lineHeight: 1.65 }}>
              Log in to your account and continue building your competitive edge.
            </p>
          </div>

          <SignIn
            fallbackRedirectUrl="/dashboard"
            appearance={{
              variables: {
                colorPrimary:    '#2563EB',
                colorText:       '#0A0A0A',
                colorBackground: '#FFFFFF',
                borderRadius:    '0.5rem',
                fontFamily:      FONT.sans,
              },
              elements: {
                card:    { boxShadow: 'none', border: 'none', padding: 0 },
                rootBox: { width: '100%' },
              },
            }}
          />
        </div>
      </div>

      <div className="login-right" style={{ position: 'relative', overflow: 'hidden', background: '#EFF4FF' }}>
        <PitchSVG />

        <div style={{
          position: 'relative', zIndex: 1, height: '100%',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '48px 40px',
        }}>
          <div />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="intel-card">
              <p style={{ fontSize: 10, fontWeight: 700, color: C.blue, letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 6px' }}>
                Scouting Reports
              </p>
              <p style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: 14, fontWeight: 700, color: '#0A0A0A', margin: '0 0 4px' }}>
                Deep-profile player analysis
              </p>
              <p style={{ fontSize: 12, color: '#6B7280', margin: 0, lineHeight: 1.6 }}>
                Position profiles, technical markers, and market value estimates across 12 countries.
              </p>
            </div>

            <div className="intel-card">
              <p style={{ fontSize: 10, fontWeight: 700, color: C.blue, letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 6px' }}>
                Recruitment Intelligence
              </p>
              <p style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: 14, fontWeight: 700, color: '#0A0A0A', margin: '0 0 4px' }}>
                Mandate support & candidate discovery
              </p>
              <p style={{ fontSize: 12, color: '#6B7280', margin: 0, lineHeight: 1.6 }}>
                Structured recruitment analysis combining scouting data and transfer market context.
              </p>
            </div>

            <div className="intel-card">
              <p style={{ fontSize: 10, fontWeight: 700, color: C.blue, letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 6px' }}>
                Transfer Market Analysis
              </p>
              <p style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: 14, fontWeight: 700, color: '#0A0A0A', margin: '0 0 4px' }}>
                Window previews & valuations
              </p>
              <p style={{ fontSize: 12, color: '#6B7280', margin: 0, lineHeight: 1.6 }}>
                Market movements, free agent tracking, and deal valuations — updated each window.
              </p>
            </div>
          </div>

          <p style={{
            fontSize: 11, fontWeight: 600, color: C.blue,
            letterSpacing: '0.02em', margin: 0, lineHeight: 1.65,
            fontStyle: 'italic',
          }}>
            &ldquo;The intelligence platform built for modern football professionals.&rdquo;
          </p>
        </div>
      </div>
    </div>
  )
}
