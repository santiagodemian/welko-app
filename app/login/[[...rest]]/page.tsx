import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'
import { WelkoLogo } from '@/components/ui/WelkoLogo'

export default function LoginPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 gap-8"
      style={{ background: 'var(--bg-secondary)' }}
    >
      <Link href="/" className="flex items-center gap-2.5">
        <WelkoLogo size={32} />
        <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--text-primary)', fontFamily: 'var(--font-montserrat), sans-serif' }}>
          Welko
        </span>
      </Link>

      <SignIn
        fallbackRedirectUrl="/dashboard"
        appearance={{
          variables: {
            colorPrimary: '#13244A',
            colorText: '#0A0F1A',
            colorBackground: '#FFFFFF',
            borderRadius: '0.75rem',
            fontFamily: 'var(--font-geist-sans)',
          },
          elements: {
            card: {
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              border: '1px solid #E5E7EB',
            },
          },
        }}
      />

      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
        ¿No tienes cuenta?{' '}
        <Link href="/registro" className="font-medium" style={{ color: 'var(--accent)' }}>
          Crear cuenta
        </Link>
      </p>
    </div>
  )
}
