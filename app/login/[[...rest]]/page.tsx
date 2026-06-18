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
        .back-link { transition: color 0.15s; }
        .back-link:hover { color: #0A0A0A !important; }
      `}</style>

      {/* Left — white form panel */}
      <div className="login-left" style={{
        background: '#fff', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '48px 40px', position: 'relative',
      }}>
        {/* Back link */}
        <div style={{ position: 'absolute', top: 28, left: 32 }}>
          <Link href="/" className="back-link" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 11, fontWeight: 600, color: '#9CA3AF',
            textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>
            <ArrowLeft size={12} /> Back to site
          </Link>
        </div>

        <div style={{ width: '100%', maxWidth: 400 }}>
          {/* Logo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/polarispnglogo.jpeg"
            alt="Polaris Football"
            style={{ height: 40, objectFit: 'contain', marginBottom: 40, display: 'block' }}
          />

          {/* Headline */}
          <div style={{ marginBottom: 32 }}>
            <p style={{
              fontSize: 10, fontWeight: 700, color: '#2563EB',
              letterSpacing: '0.16em', textTransform: 'uppercase', margin: '0 0 10px',
            }}>
              Welcome Back
            </p>
            <h1 style={{
              fontFamily: 'var(--font-space-grotesk), sans-serif',
              fontSize: 30, fontWeight: 700, color: '#0A0A0A',
              margin: '0 0 10px', letterSpacing: '-0.025em', lineHeight: 1.08,
            }}>
              Access Your<br /><span style={{ color: '#2563EB' }}>Opportunities.</span>
            </h1>
            <p style={{ fontSize: 13, color: '#6B7280', margin: 0, lineHeight: 1.65 }}>
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

      {/* Right — cinematic stadium tunnel */}
      <div className="login-right" style={{
        position: 'relative', overflow: 'hidden',
        background: '#050505',
      }}>
        {/* Player tunnel photo — show right side of diseño9 (the tunnel/stadium portion) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/diseño9.jpeg"
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            objectPosition: 'right center',
          }}
        />

        {/* Dark overlay for depth */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(5,5,5,0.62)',
        }} />

        {/* Blue stadium light atmosphere */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(37,99,235,0.18) 0%, transparent 65%)',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '35%',
          background: 'linear-gradient(to top, rgba(5,5,5,0.8) 0%, transparent 100%)',
        }} />

        {/* Left-edge fade so text doesn't clash with white panel */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(5,5,5,0.5) 0%, transparent 30%)',
        }} />

        {/* Content overlay */}
        <div style={{
          position: 'relative', zIndex: 1,
          height: '100%',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '48px 40px', textAlign: 'center',
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/polariswhitelogo.jpeg"
            alt="Polaris Football"
            style={{ height: 64, objectFit: 'contain', marginBottom: 24, opacity: 0.95 }}
          />

          {/* Tagline */}
          <p style={{
            fontFamily: 'var(--font-space-grotesk), sans-serif',
            fontSize: 'clamp(28px, 3.5vw, 42px)',
            fontWeight: 700, color: '#fff',
            letterSpacing: '-0.025em', textTransform: 'uppercase',
            lineHeight: 1.08, margin: '0 0 8px',
            textShadow: '0 2px 20px rgba(0,0,0,0.5)',
          }}>
            Prepare.<br />Perform.<br /><span style={{ color: '#2563EB' }}>Achieve.</span>
          </p>
        </div>

        {/* Bottom tagline */}
        <div style={{ position: 'absolute', bottom: 36, left: 0, right: 0, textAlign: 'center', zIndex: 1 }}>
          <p style={{
            fontSize: 10, fontWeight: 700,
            color: 'rgba(255,255,255,0.22)',
            letterSpacing: '0.22em', textTransform: 'uppercase', margin: 0,
          }}>
            Guiding Football Careers
          </p>
        </div>
      </div>
    </div>
  )
}
