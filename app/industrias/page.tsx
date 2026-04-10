'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { useLang } from '@/contexts/LangContext'
import { SimulatorSection } from '@/components/sections/SimulatorSection'
import { WelkoLogo } from '@/components/ui/WelkoLogo'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

// ─── Collapsed industry list (health grouped into one entry) ──────────────────
const DISPLAY_INDUSTRIES = [
  {
    slug:     'dental',
    icon:     '🏥',
    color:    '#3B82F6',
    es: { name: 'Clínicas & Consultorios de Salud', tagline: 'Dental, medicina, estética, psicología, nutrición y más' },
    en: { name: 'Health Clinics & Practices',        tagline: 'Dental, medicine, aesthetics, psychology, nutrition and more' },
  },
  {
    slug:     'restaurante',
    icon:     '🍽️',
    color:    '#F59E0B',
    es: { name: 'Restaurantes & Cafés',             tagline: 'Reservaciones, pedidos y atención 24/7' },
    en: { name: 'Restaurants & Cafés',              tagline: 'Reservations, orders and 24/7 service' },
  },
  {
    slug:     'barberia',
    icon:     '✂️',
    color:    '#8B5CF6',
    es: { name: 'Barberías & Salones de Belleza',   tagline: 'Turnos, confirmaciones y recordatorios automáticos' },
    en: { name: 'Barbershops & Beauty Salons',      tagline: 'Bookings, confirmations and automatic reminders' },
  },
  {
    slug:     'spa-salon',
    icon:     '💆',
    color:    '#EC4899',
    es: { name: 'Spa & Bienestar',                  tagline: 'Reservaciones y seguimiento de clientes con IA' },
    en: { name: 'Spa & Wellness',                   tagline: 'Bookings and AI-powered client follow-up' },
  },
  {
    slug:     'fitness',
    icon:     '💪',
    color:    '#EF4444',
    es: { name: 'Fitness & Gyms',                   tagline: 'Convierte leads en miembros con seguimiento IA' },
    en: { name: 'Fitness & Gyms',                   tagline: 'Convert leads into members with AI follow-up' },
  },
  {
    slug:     'hotel',
    icon:     '🏨',
    color:    '#0EA5E9',
    es: { name: 'Hoteles & Hospitalidad',           tagline: 'Reservaciones, cotizaciones y check-in automatizados' },
    en: { name: 'Hotels & Hospitality',             tagline: 'Reservations, quotes and check-in automated' },
  },
  {
    slug:     'legal',
    icon:     '⚖️',
    color:    '#374151',
    es: { name: 'Despachos Legales',                tagline: 'Califica leads y agenda consultas 24/7' },
    en: { name: 'Law Firms',                        tagline: 'Qualify leads and book consultations 24/7' },
  },
  {
    slug:     'contabilidad',
    icon:     '📊',
    color:    '#0F766E',
    es: { name: 'Contabilidad & Finanzas',          tagline: 'Prospecta clientes y agenda reuniones automáticamente' },
    en: { name: 'Accounting & Finance',             tagline: 'Prospect clients and book meetings automatically' },
  },
]

export default function IndustriasPage() {
  const { lang } = useLang()

  return (
    <>
      <Navbar />

      <main className="flex flex-col flex-1 pt-24">

        {/* ── Hero ── */}
        <section className="px-4 sm:px-6 pt-10 pb-14 sm:pt-14 sm:pb-20">
          <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-5">
            <motion.span
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: 'var(--accent-label)' }}
            >
              {lang === 'es' ? 'Welko para cada industria' : 'Welko for every industry'}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE, delay: 0.08 }}
              className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              {lang === 'es' ? 'Una IA que habla el idioma de tu negocio' : 'AI that speaks your business language'}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.15 }}
              className="text-sm sm:text-base max-w-xl leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              {lang === 'es'
                ? 'Welko adapta su vocabulario, flujo y CRM al tipo de negocio que tienes — no es una solución genérica.'
                : "Welko adapts its vocabulary, flow and CRM to your type of business — it's not a one-size-fits-all solution."}
            </motion.p>
          </div>
        </section>

        {/* ── Industry grid ── */}
        <section className="py-10 sm:py-16 px-4 sm:px-6" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {DISPLAY_INDUSTRIES.map((ind, i) => {
                const name    = lang === 'es' ? ind.es.name    : ind.en.name
                const tagline = lang === 'es' ? ind.es.tagline : ind.en.tagline
                return (
                  <motion.div
                    key={ind.slug}
                    initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.4, ease: EASE, delay: i * 0.04 }}
                  >
                    <Link
                      href={`/industrias/${ind.slug}`}
                      className="group flex flex-col gap-4 p-5 rounded-2xl transition-all duration-200"
                      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLAnchorElement
                        el.style.borderColor = ind.color + '66'
                        el.style.transform = 'translateY(-3px)'
                        el.style.boxShadow = `0 8px 32px ${ind.color}18`
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLAnchorElement
                        el.style.borderColor = 'var(--border)'
                        el.style.transform = 'translateY(0)'
                        el.style.boxShadow = 'none'
                      }}
                    >
                      {/* Icon */}
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                        style={{ background: ind.color + '15' }}
                      >
                        {ind.icon}
                      </div>

                      {/* Text */}
                      <div className="flex flex-col gap-1 flex-1">
                        <span className="text-sm font-semibold leading-snug" style={{ color: 'var(--text-primary)' }}>{name}</span>
                        <span className="text-xs leading-snug" style={{ color: 'var(--text-secondary)' }}>{tagline}</span>
                      </div>

                      {/* Arrow */}
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-xs font-semibold" style={{ color: ind.color }}>
                          {lang === 'es' ? 'Ver solución' : 'See solution'}
                        </span>
                        <ArrowRight size={12} color={ind.color} className="transition-transform duration-150 group-hover:translate-x-0.5" />
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

      {/* Footer minimal */}
      <footer className="py-8 px-4 sm:px-6" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <WelkoLogo size={18} />
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              © {new Date().getFullYear()} Welko
            </p>
          </div>
          <Link href="/" className="text-xs" style={{ color: 'var(--text-muted)' }}>
            ← {lang === 'es' ? 'Volver al inicio' : 'Back to home'}
          </Link>
        </div>
      </footer>
    </>
  )
}
