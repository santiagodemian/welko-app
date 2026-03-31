'use client'

import { use } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, MessageCircle, Bell, CheckCircle } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { IndustryCharacter } from '@/components/ui/IndustryCharacter'
import { getIndustry } from '@/lib/industries'
import { useLang } from '@/contexts/LangContext'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const FEATURE_ICONS = [Calendar, MessageCircle, Bell]

interface Props {
  params: Promise<{ slug: string }>
}

export default function IndustryPage({ params }: Props) {
  const { slug } = use(params)
  const { lang, t } = useLang()

  const industry = getIndustry(slug)
  if (!industry) notFound()

  const content = lang === 'es' ? industry.es : industry.en

  return (
    <>
      <Navbar />

      <main className="flex flex-col flex-1 pt-24">

        {/* ── Hero ── */}
        <section className="px-4 sm:px-6 pt-8 pb-14 sm:pt-12 sm:pb-20">
          <div className="max-w-6xl mx-auto">

            {/* Breadcrumb */}
            <motion.div
              initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="mb-8"
            >
              <Link
                href="/industrias"
                className="inline-flex items-center gap-1.5 text-xs font-medium transition-colors duration-150"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--accent)')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted)')}
              >
                <ArrowLeft size={13} />
                {lang === 'es' ? 'Todas las industrias' : 'All industries'}
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

              {/* Left: copy */}
              <div className="flex flex-col gap-5 order-2 lg:order-1">
                <motion.div
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold w-fit"
                  style={{ background: industry.lightColor, color: industry.color, border: `1px solid ${industry.color}33` }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: industry.color }} />
                  {lang === 'es' ? `Para ${content.name}` : `For ${content.name}`}
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, ease: EASE, delay: 0.08 }}
                  className="text-3xl lg:text-6xl font-bold tracking-tight leading-tight"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {content.headline}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE, delay: 0.15 }}
                  className="text-sm sm:text-base leading-relaxed max-w-lg"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {content.body}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: EASE, delay: 0.22 }}
                >
                  <a
                    href="/precios"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-semibold transition-colors duration-150"
                    style={{ background: industry.color, color: '#FFFFFF' }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = '0.88')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = '1')}
                  >
                    {t.hero.cta}
                  </a>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, ease: EASE, delay: 0.3 }}
                  className="text-xs"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {t.hero.trust}
                </motion.p>
              </div>

              {/* Right: AI character */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
                className="flex justify-center lg:justify-end order-1 lg:order-2"
              >
                <div
                  className="w-64 sm:w-72 lg:w-80 rounded-3xl p-8"
                  style={{ background: industry.lightColor, border: `1.5px solid ${industry.color}22` }}
                >
                  <IndustryCharacter slug={slug} />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section className="py-14 sm:py-20 px-4 sm:px-6" style={{ background: 'var(--bg-secondary)' }}>
          <div className="max-w-4xl mx-auto flex flex-col gap-10">
            <motion.div
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE }}
              className="flex flex-col gap-2"
            >
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: industry.color }}>
                {lang === 'es' ? 'Lo que incluye' : "What's included"}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                {lang === 'es'
                  ? `Diseñado para ${content.name}`
                  : `Designed for ${content.name}`}
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {content.features.map((feat, i) => {
                const Icon = FEATURE_ICONS[i] ?? CheckCircle
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.45, ease: EASE, delay: i * 0.08 }}
                    className="p-5 rounded-2xl flex flex-col gap-3"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: industry.lightColor }}
                    >
                      <Icon size={18} color={industry.color} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{feat.title}</h3>
                      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{feat.desc}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── CTA banner ── */}
        <section className="py-14 sm:py-20 px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE }}
            className="max-w-3xl mx-auto flex flex-col items-center text-center gap-5 p-10 rounded-3xl"
            style={{ background: industry.lightColor, border: `1.5px solid ${industry.color}33` }}
          >
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              {lang === 'es'
                ? `¿Tienes una clínica de ${content.name}?`
                : `Do you run a ${content.name} practice?`}
            </h2>
            <p className="text-sm leading-relaxed max-w-md" style={{ color: 'var(--text-secondary)' }}>
              {lang === 'es'
                ? 'Instala tu recepcionista IA en 24 horas y nunca pierdas otra cita.'
                : 'Install your AI receptionist in 24 hours and never miss another appointment.'}
            </p>
            <a
              href="/precios"
              className="inline-flex items-center justify-center px-7 py-3 rounded-xl text-sm font-semibold transition-opacity duration-150"
              style={{ background: industry.color, color: '#FFFFFF' }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = '0.88')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = '1')}
            >
              {t.hero.cta}
            </a>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.hero.trust}</p>
          </motion.div>
        </section>

      </main>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} Welko —{' '}
            {lang === 'es'
              ? 'El recepcionista IA líder para Clínicas de Salud y Estética.'
              : 'The leading AI receptionist for Health & Aesthetic Clinics.'}
          </p>
        </div>
      </footer>
    </>
  )
}
