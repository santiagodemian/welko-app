'use client'

import { use } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Check } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { IndustryRobotVisual } from '@/components/ui/IndustryRobotVisual'
import { getIndustry } from '@/lib/industries'
import { getIndustryRich } from '@/lib/industry-content'
import { useLang } from '@/contexts/LangContext'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const NAVY = '#13244A'

interface Props {
  params: Promise<{ slug: string }>
}

export default function IndustryPage({ params }: Props) {
  const { slug } = use(params)
  const { lang, t } = useLang()

  const industry = getIndustry(slug)
  const rich     = getIndustryRich(slug)
  if (!industry) notFound()

  const content     = lang === 'es' ? industry.es : industry.en
  const richContent = rich ? (lang === 'es' ? rich.es : rich.en) : null

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
                  style={{ background: '#E5E9F4', color: NAVY, border: `1px solid ${NAVY}22` }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: NAVY }} />
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
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <a
                    href="/precios"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-semibold transition-opacity duration-150"
                    style={{ background: NAVY, color: '#FFFFFF' }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = '0.85')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = '1')}
                  >
                    {t.hero.cta}
                  </a>
                  <Link
                    href="/soluciones/ai-receptionist"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-semibold transition-colors duration-150"
                    style={{ background: 'transparent', color: 'var(--text-primary)', border: '1.5px solid var(--border)' }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = 'var(--surface-hover)')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = 'transparent')}
                  >
                    {lang === 'es' ? 'Calcular mi ROI' : 'Calculate my ROI'}
                  </Link>
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

              {/* Right: Robot visual */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
                className="flex justify-center lg:justify-end order-1 lg:order-2"
              >
                <div className="w-64 sm:w-72 lg:w-80">
                  <IndustryRobotVisual slug={slug} size="lg" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Sector stats ── */}
        {richContent && (
          <section className="py-12 sm:py-16 px-4 sm:px-6" style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
            <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[richContent.stat1, richContent.stat2, richContent.stat3].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.45, ease: EASE, delay: i * 0.1 }}
                  className="flex flex-col items-center text-center gap-2 p-6 rounded-2xl"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                >
                  <span className="text-3xl font-black tracking-tight" style={{ color: NAVY }}>
                    {stat.value}
                  </span>
                  <span className="text-xs leading-snug" style={{ color: 'var(--text-secondary)' }}>
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ── Specific benefits ── */}
        {richContent && (
          <section className="py-14 sm:py-20 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto flex flex-col gap-10">
              <motion.div
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE }}
                className="flex flex-col gap-2"
              >
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: NAVY }}>
                  {lang === 'es' ? 'Beneficios específicos' : 'Specific benefits'}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  {richContent.specific.title}
                </h2>
              </motion.div>

              <div className="flex flex-col gap-4">
                {richContent.specific.items.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.45, ease: EASE, delay: i * 0.08 }}
                    className="flex items-start gap-4 p-5 rounded-2xl"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: '#E5E9F4' }}
                    >
                      <Check size={15} color={NAVY} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{item.heading}</h3>
                      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── AI Training by Plan ── */}
        {richContent && (
          <section className="py-14 sm:py-20 px-4 sm:px-6" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
            <div className="max-w-4xl mx-auto flex flex-col gap-10">
              <motion.div
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE }}
                className="flex flex-col gap-2"
              >
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: NAVY }}>
                  {lang === 'es' ? 'IA entrenada por plan' : 'AI trained by plan'}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  {lang === 'es'
                    ? `¿Qué sabe la IA de ${content.name} según tu plan?`
                    : `What does the ${content.name} AI know by plan?`}
                </h2>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { name: 'Essential', price: '$1,999', desc: richContent.aiByPlan.essential, featured: false },
                  { name: 'Pro',       price: '$3,999', desc: richContent.aiByPlan.pro,       featured: true  },
                  { name: 'Business',  price: '$6,999', desc: richContent.aiByPlan.business,  featured: false },
                ].map((plan, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.45, ease: EASE, delay: i * 0.09 }}
                    className="relative flex flex-col gap-3 p-5 rounded-2xl"
                    style={{
                      background: plan.featured ? NAVY : 'var(--surface)',
                      border: plan.featured ? `2px solid ${NAVY}` : '1px solid var(--border)',
                      boxShadow: plan.featured ? '0 8px 32px rgba(19,36,74,0.18)' : 'none',
                    }}
                  >
                    {plan.featured && (
                      <span
                        className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap"
                        style={{ background: '#FFFFFF', color: NAVY }}
                      >
                        {lang === 'es' ? 'Más Popular' : 'Most Popular'}
                      </span>
                    )}
                    <div className="flex items-center justify-between">
                      <span
                        className="text-xs font-bold uppercase tracking-widest"
                        style={{ color: plan.featured ? 'rgba(255,255,255,0.55)' : 'var(--text-muted)' }}
                      >
                        {plan.name}
                      </span>
                      <span
                        className="text-sm font-black"
                        style={{ color: plan.featured ? '#FFFFFF' : 'var(--text-primary)' }}
                      >
                        {plan.price}
                      </span>
                    </div>
                    <p
                      className="text-xs leading-relaxed"
                      style={{ color: plan.featured ? 'rgba(255,255,255,0.75)' : 'var(--text-secondary)' }}
                    >
                      {plan.desc}
                    </p>
                    <a
                      href="/precios"
                      className="mt-auto text-xs font-semibold text-center py-2 rounded-lg transition-opacity duration-150"
                      style={{
                        background: plan.featured ? 'rgba(255,255,255,0.15)' : '#E5E9F4',
                        color: plan.featured ? '#FFFFFF' : NAVY,
                      }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = '0.8')}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = '1')}
                    >
                      {lang === 'es' ? 'Elegir plan' : 'Choose plan'}
                    </a>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Basic features ── */}
        <section className="py-14 sm:py-20 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto flex flex-col gap-10">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: NAVY }}>
                {lang === 'es' ? 'Lo que incluye' : "What's included"}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                {lang === 'es' ? `Funciones clave para ${content.name}` : `Key features for ${content.name}`}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {content.features.map((feat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.45, ease: EASE, delay: i * 0.08 }}
                  className="p-5 rounded-2xl flex flex-col gap-3"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#E5E9F4' }}>
                    <Check size={15} color={NAVY} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{feat.title}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{feat.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-14 sm:py-20 px-4 sm:px-6" style={{ borderTop: '1px solid var(--border)' }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE }}
            className="max-w-3xl mx-auto flex flex-col items-center text-center gap-5 p-10 rounded-3xl"
            style={{ background: '#E5E9F4', border: `1.5px solid ${NAVY}22` }}
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
              style={{ background: NAVY, color: '#FFFFFF' }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = '0.85')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = '1')}
            >
              {t.hero.cta}
            </a>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.hero.trust}</p>
          </motion.div>
        </section>

      </main>

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
