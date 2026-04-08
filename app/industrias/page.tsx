'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { IndustryRobotVisual } from '@/components/ui/IndustryRobotVisual'
import { INDUSTRIES } from '@/lib/industries'
import { useLang } from '@/contexts/LangContext'
import { SimulatorSection } from '@/components/sections/SimulatorSection'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const PREVIEWS = ['dental', 'medicina', 'estetica']

export default function IndustriasPage() {
  const { lang } = useLang()

  return (
    <>
      <Navbar />

      <main className="flex flex-col flex-1 pt-24">

        {/* ── Hero ── */}
        <section className="px-4 sm:px-6 pt-10 pb-14 sm:pt-14 sm:pb-20">
          <div className="max-w-5xl mx-auto flex flex-col items-center text-center gap-5">
            <motion.span
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: 'var(--accent)' }}
            >
              {lang === 'es' ? 'Soluciones por Industria' : 'Solutions by Industry'}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE, delay: 0.08 }}
              className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight max-w-3xl"
              style={{ color: 'var(--text-primary)' }}
            >
              {lang === 'es'
                ? 'Welko para tu Especialidad'
                : 'Welko for Your Specialty'}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.15 }}
              className="text-sm sm:text-base max-w-2xl leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              {lang === 'es'
                ? 'Cada especialidad tiene sus propios retos. Welko adapta su IA recepcionista al vocabulario, flujo y necesidades específicas de tu consultorio.'
                : 'Every specialty has its own challenges. Welko adapts its AI receptionist to the vocabulary, flow, and specific needs of your practice.'}
            </motion.p>
          </div>

          {/* Preview characters — 3 examples */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.25 }}
            className="max-w-2xl mx-auto mt-12 grid grid-cols-3 gap-6 sm:gap-8"
          >
            {PREVIEWS.map((slug) => {
              const ind = INDUSTRIES.find((i) => i.slug === slug)!
              const name = lang === 'es' ? ind.es.name : ind.en.name
              return (
                <Link key={slug} href={`/industrias/${slug}`} className="flex flex-col items-center gap-3 group">
                  <div className="w-full overflow-hidden rounded-2xl transition-transform duration-200 group-hover:scale-105">
                    <IndustryRobotVisual slug={slug} size="sm" />
                  </div>
                  <span className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>{name}</span>
                </Link>
              )
            })}
          </motion.div>
        </section>

        {/* ── Industry grid ── */}
        <section className="py-14 sm:py-20 px-4 sm:px-6" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="max-w-5xl mx-auto flex flex-col gap-10">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--accent-label)' }}>
                {lang === 'es' ? 'Todas las Industrias' : 'All Industries'}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                {lang === 'es' ? 'Selecciona tu especialidad' : 'Select your specialty'}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {INDUSTRIES.map((ind, i) => {
                const name    = lang === 'es' ? ind.es.name    : ind.en.name
                const tagline = lang === 'es' ? ind.es.tagline : ind.en.tagline
                return (
                  <motion.div
                    key={ind.slug}
                    initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.45, ease: EASE, delay: i * 0.05 }}
                  >
                    <Link
                      href={`/industrias/${ind.slug}`}
                      className="group flex flex-col gap-4 p-5 rounded-2xl transition-all duration-200 hover:shadow-md"
                      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.borderColor = ind.color + '66'
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border)'
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div
                          className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0"
                        >
                          <IndustryRobotVisual slug={ind.slug} size="sm" />
                        </div>
                        <ArrowRight
                          size={16}
                          color={ind.color}
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 -translate-x-1 group-hover:translate-x-0 transition-transform"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{name}</span>
                        <span className="text-xs leading-snug" style={{ color: 'var(--text-secondary)' }}>{tagline}</span>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── Simulator ── */}
        <SimulatorSection />

      </main>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} Welko —{' '}
            {lang === 'es'
              ? 'El recepcionista IA lider.'
              : 'The leading AI receptionist for Health & Aesthetic Clinics.'}
          </p>
        </div>
      </footer>
    </>
  )
}
