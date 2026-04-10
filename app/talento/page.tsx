'use client'

import { Navbar } from '@/components/layout/Navbar'
import { HumanTalentSection } from '@/components/sections/HumanTalentSection'
import { useLang } from '@/contexts/LangContext'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export default function TalentoPage() {
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
              {lang === 'es' ? 'Tu equipo, potenciado' : 'Your team, amplified'}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.08 }}
              className="text-3xl sm:text-5xl font-black tracking-tight leading-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              {lang === 'es'
                ? <>Potencia tu talento<br className="hidden sm:block" /> humano con IA</>
                : <>Amplify your human<br className="hidden sm:block" /> talent with AI</>}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.15 }}
              className="text-base sm:text-lg font-light leading-relaxed max-w-xl"
              style={{ color: 'var(--text-secondary)' }}
            >
              {lang === 'es'
                ? 'La IA de Welko se encarga de las tareas repetitivas para que tu equipo se enfoque en lo que realmente importa: crear experiencias memorables para tus clientes.'
                : "Welko's AI handles the repetitive work so your team can focus on what truly matters: creating memorable experiences for your clients."}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.22 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Link
                href="/precios"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200"
                style={{ background: 'var(--accent)', color: 'var(--accent-fg)', boxShadow: '0 4px 20px rgba(19,36,74,0.2)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)' }}
              >
                {lang === 'es' ? 'Empezar ahora' : 'Get started'}
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/simulador"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-medium transition-all duration-200"
                style={{ border: '1.5px solid var(--border)', color: 'var(--text-primary)', background: 'var(--surface)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'var(--surface-hover)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'var(--surface)' }}
              >
                {lang === 'es' ? 'Ver demo' : 'Try demo'}
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ── Human Talent Section ── */}
        <HumanTalentSection />

        {/* ── Bottom CTA ── */}
        <section className="py-20 px-4 sm:px-6" style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
          <div className="max-w-2xl mx-auto flex flex-col items-center text-center gap-6">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              {lang === 'es'
                ? 'Dale a tu equipo el tiempo que merece'
                : 'Give your team the time they deserve'}
            </h2>
            <p className="text-base font-light" style={{ color: 'var(--text-secondary)' }}>
              {lang === 'es'
                ? 'Activa Welko hoy y libera a tu equipo de tareas repetitivas en menos de 24 horas.'
                : 'Activate Welko today and free your team from repetitive tasks in under 24 hours.'}
            </p>
            <Link
              href="/precios"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold transition-all duration-200"
              style={{ background: 'var(--accent)', color: 'var(--accent-fg)', boxShadow: '0 4px 20px rgba(19,36,74,0.2)' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = 'translateY(0)' }}
            >
              {lang === 'es' ? 'Comenzar gratis' : 'Start for free'}
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

      </main>
    </>
  )
}
