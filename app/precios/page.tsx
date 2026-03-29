import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { PricingSection } from '@/components/sections/PricingSection'
import { GuaranteeSection } from '@/components/sections/GuaranteeSection'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Precios | Welko',
  description: 'Planes simples y sin contratos forzosos. Elige el plan Welko que mejor se adapta a tu clínica.',
}

export default function PreciosPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 flex flex-col">
        <div className="max-w-5xl mx-auto w-full px-4 pt-10 pb-2">
          <Link
            href="/"
            className="text-sm font-medium"
            style={{ color: 'var(--accent)' }}
          >
            ← Volver al inicio
          </Link>
        </div>
        <PricingSection />
        <GuaranteeSection />
      </main>
      <footer
        className="py-8 px-4"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} Welko — El recepcionista IA líder para Clínicas de Salud y Estética.
          </p>
          <nav className="flex items-center gap-5">
            {[
              { label: 'Términos', href: '/terminos' },
              { label: 'Privacidad', href: '/privacidad' },
              { label: 'Reembolsos', href: '/reembolsos' },
              { label: 'Soporte', href: '/contacto' },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="text-xs font-medium" style={{ color: 'var(--accent)' }}>
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </>
  )
}
