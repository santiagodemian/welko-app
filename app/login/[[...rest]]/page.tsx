import { SignIn } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 gap-8"
      style={{ background: 'var(--bg-secondary)' }}
    >
      <Link href="/" className="flex items-center gap-2.5">
        <Image
          src="/welko_logo_purewhite.png"
          alt="Welko"
          width={32}
          height={32}
          className="h-8 w-8 object-contain"
          priority
        />
        <span className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
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
