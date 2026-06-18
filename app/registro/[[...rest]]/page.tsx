import { SignUp } from '@clerk/nextjs'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function RegistroPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', fontFamily: 'var(--font-montserrat), sans-serif' }}>
      <style>{`
        @media (max-width: 768px) {
          .auth-left  { display: none !important; }
          .auth-right { grid-column: 1 / -1 !important; }
        }
      `}</style>

      {/* Left — dark compass panel */}
      <div className="auth-left" style={{ background: '#050505', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 48 }}>
        <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', width: '90%', height: '90%', opacity: 0.7 }}>
          <circle cx="200" cy="200" r="193" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <circle cx="200" cy="200" r="155" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <circle cx="200" cy="200" r="110" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <circle cx="200" cy="200" r="65"  stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          <path d="M200,196 L197,120 L200,14 L203,120 Z" fill="#2563EB" opacity="0.9" />
          <path d="M200,204 L203,280 L200,386 L197,280 Z" fill="rgba(255,255,255,0.15)" />
          <path d="M204,200 L280,197 L386,200 L280,203 Z" fill="rgba(255,255,255,0.15)" />
          <path d="M196,200 L120,203 L14,200 L120,197 Z" fill="rgba(255,255,255,0.15)" />
          <text x="200" y="9" textAnchor="middle" fill="#2563EB" fontSize="13" fontWeight="700" fontFamily="system-ui">N</text>
          <circle cx="200" cy="200" r="9" fill="#050505" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <circle cx="200" cy="200" r="3" fill="#2563EB" />
        </svg>
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/polariswhitelogo.jpeg" alt="Polaris Football" style={{ height: 56, objectFit: 'contain', marginBottom: 24 }} />
          <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0 }}>
            Guiding Football Careers
          </p>
        </div>
      </div>

      {/* Right — sign up */}
      <div className="auth-right" style={{ background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 32px' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#9CA3AF', textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 40 }}>
            <ArrowLeft size={13} /> Back to site
          </Link>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#2563EB', letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 8px' }}>
            Join Polaris
          </p>
          <h1 style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: 28, fontWeight: 700, color: '#0A0A0A', margin: '0 0 32px', letterSpacing: '-0.025em' }}>
            Create your account
          </h1>
          <SignUp
            fallbackRedirectUrl="/dashboard"
            appearance={{
              variables: {
                colorPrimary: '#2563EB',
                colorText: '#0A0A0A',
                colorBackground: '#FFFFFF',
                borderRadius: '0.5rem',
                fontFamily: 'var(--font-montserrat), sans-serif',
              },
              elements: {
                card: { boxShadow: 'none', border: 'none', padding: 0 },
                rootBox: { width: '100%' },
              },
            }}
          />
          <p style={{ fontSize: 13, color: '#9CA3AF', marginTop: 20, textAlign: 'center' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#0A0A0A', fontWeight: 600, textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
