'use client'

import { Navbar } from '@/components/layout/Navbar'
import { VsDirectoriosSection } from '@/components/sections/VsDirectoriosSection'
import { HumanTalentSection } from '@/components/sections/HumanTalentSection'
import { WelkoDNASection } from '@/components/sections/WelkoDNASection'
import { useLang } from '@/contexts/LangContext'
import { motion } from 'framer-motion'
import Link from 'next/link'

const NAVY = '#1A2A56'
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export default function PorQuePage() {
  const { lang } = useLang()

  return (
    <>
      <Navbar />
      <main className="flex flex-col flex-1 pt-24">

        {/* ── Hero ── */}
        <section className="py-14 sm:py-20 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-5">
            <motion.span
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: 'var(--accent-label)' }}
            >
              {lang === 'es' ? 'Por qué somos diferentes' : 'Why we\'re different'}
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.08 }}
              className="text-3xl sm:text-5xl font-black tracking-tight leading-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              {lang === 'es'
                ? <>No somos un directorio.<br className="hidden sm:block" /> Somos tu ventaja.</>
                : <>We\'re not a directory.<br className="hidden sm:block" /> We\'re your advantage.</>}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE, delay: 0.15 }}
              className="text-sm sm:text-base leading-relaxed max-w-xl"
              style={{ color: 'var(--text-secondary)' }}
            >
              {lang === 'es'
                ? 'Mientras otros te listan entre la competencia, Welko construye tu infraestructura de ingresos propia — con IA especializada por industria, omnicanalidad y control humano total.'
                : 'While others list you among the competition, Welko builds your own revenue infrastructure — with industry-specialized AI, omnichannel, and full human control.'}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE, delay: 0.22 }}
              className="flex flex-wrap justify-center gap-3"
            >
              <Link
                href="/registro"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold"
                style={{ background: NAVY, color: '#fff' }}
              >
                {lang === 'es' ? 'Empezar gratis' : 'Get started free'} →
              </Link>
              <Link
                href="/precios"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium"
                style={{ border: '1.5px solid var(--border)', color: 'var(--text-primary)' }}
              >
                {lang === 'es' ? 'Ver planes' : 'See plans'}
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ── Comparison blocks ── */}
        <VsDirectoriosSection />
        <HumanTalentSection />
        <WelkoDNASection />

      </main>

      <footer className="py-8 px-4 sm:px-6" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} Welko — {lang === 'es' ? 'El recepcionista IA líder para Clínicas de Salud y Estética.' : 'The leading AI receptionist for Health & Aesthetic Clinics.'}
          </p>
        </div>
      </footer>
    </>
  )
}
