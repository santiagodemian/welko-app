'use client'

import { Navbar } from '@/components/layout/Navbar'
import { SimulatorSection } from '@/components/sections/SimulatorSection'

export default function SimuladorPage() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col flex-1 pt-20">
        <SimulatorSection />
      </main>
      <footer className="py-8 px-4 sm:px-6" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} Welko — El recepcionista IA lider.
          </p>
        </div>
      </footer>
    </>
  )
}
