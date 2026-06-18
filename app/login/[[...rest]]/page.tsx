import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function LoginPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', fontFamily: 'var(--font-montserrat), sans-serif' }}>
      <style>{`
        @media (max-width: 768px) {
          .login-left  { grid-column: 1 / -1 !important; }
          .login-right { display: none !important; }
        }
      `}</style>

      {/* Left — white form panel */}
      <div className="login-left" style={{ background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 40px', position: 'relative' }}>
        {/* Back link */}
        <div style={{ position: 'absolute', top: 28, left: 32 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600, color: '#9CA3AF', textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase', transition: 'color 0.15s' }}>
            <ArrowLeft size={12} /> Back to site
          </Link>
        </div>

        <div style={{ width: '100%', maxWidth: 400 }}>
          {/* Logo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/polarispnglogo.jpeg" alt="Polaris Football" style={{ height: 40, objectFit: 'contain', marginBottom: 36, display: 'block' }} />

          {/* Headline */}
          <div style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: '#2563EB', letterSpacing: '0.16em', textTransform: 'uppercase', margin: '0 0 8px' }}>
              Welcome Back
            </p>
            <h1 style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: 28, fontWeight: 700, color: '#0A0A0A', margin: '0 0 6px', letterSpacing: '-0.025em', lineHeight: 1.1 }}>
              Access Your<br /><span style={{ color: '#2563EB' }}>Opportunities.</span>
            </h1>
            <p style={{ fontSize: 13, color: '#6B7280', margin: 0, lineHeight: 1.6 }}>
              Log in to your account and continue building the future.
            </p>
          </div>

          {/* Clerk SignIn */}
          <SignIn
            fallbackRedirectUrl="/dashboard"
            appearance={{
              variables: {
                colorPrimary:    '#2563EB',
                colorText:       '#0A0A0A',
                colorBackground: '#FFFFFF',
                borderRadius:    '0.5rem',
                fontFamily:      'var(--font-montserrat), sans-serif',
              },
              elements: {
                card:    { boxShadow: 'none', border: 'none', padding: 0 },
                rootBox: { width: '100%' },
              },
            }}
          />
        </div>
      </div>

      {/* Right — cinematic dark panel */}
      <div className="login-right" style={{
        background: '#050505', position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* Stadium atmosphere gradients */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 50% at 30% 0%, rgba(37,99,235,0.12) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 50% at 70% 0%, rgba(37,99,235,0.08) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(to top, rgba(37,99,235,0.05) 0%, transparent 100%)' }} />

        {/* Compass SVG */}
        <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg"
          style={{ position: 'absolute', width: '80%', height: '80%', opacity: 0.12 }}>
          <circle cx="250" cy="250" r="240" stroke="white" strokeWidth="1" />
          <circle cx="250" cy="250" r="195" stroke="white" strokeWidth="0.8" />
          <circle cx="250" cy="250" r="145" stroke="white" strokeWidth="0.7" />
          <circle cx="250" cy="250" r="90"  stroke="white" strokeWidth="0.7" />
          <circle cx="250" cy="250" r="40"  stroke="white" strokeWidth="0.7" />
          <line x1="250" y1="10" x2="250" y2="490" stroke="white" strokeWidth="0.5" />
          <line x1="10" y1="250" x2="490" y2="250" stroke="white" strokeWidth="0.5" />
          <path d="M250,245 L247,155 L250,18 L253,155 Z" fill="#2563EB" opacity="0.8" />
          <path d="M250,255 L253,345 L250,482 L247,345 Z" fill="white" opacity="0.4" />
          <path d="M255,250 L345,247 L482,250 L345,253 Z" fill="white" opacity="0.4" />
          <path d="M245,250 L155,253 L18,250 L155,247 Z" fill="white" opacity="0.4" />
          <circle cx="250" cy="250" r="14" fill="#050505" stroke="white" strokeWidth="1" opacity="0.6" />
          <circle cx="250" cy="250" r="5" fill="#2563EB" />
        </svg>

        {/* Content overlay */}
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '48px 40px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/polariswhitelogo.jpeg" alt="Polaris Football" style={{ height: 56, objectFit: 'contain', marginBottom: 24, opacity: 0.9 }} />
          <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0 }}>
            Guiding Football Careers
          </p>
        </div>

        {/* Bottom tagline */}
        <div style={{ position: 'absolute', bottom: 36, left: 0, right: 0, textAlign: 'center' }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.15)', letterSpacing: '0.22em', textTransform: 'uppercase', margin: 0 }}>
            Prepare. <span style={{ color: 'rgba(255,255,255,0.22)' }}>Perform.</span>{' '}
            <span style={{ color: '#2563EB' }}>Achieve.</span>
          </p>
        </div>
      </div>
    </div>
  )
}
