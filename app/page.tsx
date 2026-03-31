'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Calendar,
  MessageCircle,
  Bell,
  Sparkles,
  BarChart2,
  ShieldCheck,
  AlertTriangle,
  Bot,
  CalendarCheck,
  ArrowRight,
  Smile,
  Brain,
  Leaf,
  Heart,
  Eye,
} from 'lucide-react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { IndustryHeroVisual } from '@/components/ui/IndustryHeroVisual'
import { FAQSection } from '@/components/sections/FAQSection'
import { HearItSection } from '@/components/sections/HearItSection'
import { SecurityBadgeSection } from '@/components/sections/SecurityBadgeSection'
import { SimulatorSection } from '@/components/sections/SimulatorSection'
import { useLang } from '@/contexts/LangContext'
import { INDUSTRIES, HOME_INDUSTRIES } from '@/lib/industries'

const HOME_ICONS: Record<string, React.ElementType> = {
  dental:       Smile,
  psicologia:   Brain,
  estetica:     Sparkles,
  nutricion:    Leaf,
  ginecologia:  Heart,
  oftalmologia: Eye,
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const SOLUTION_ICONS = [Calendar, MessageCircle, Bell, Sparkles, BarChart2, ShieldCheck]
const FLOW_ICONS = [MessageCircle, Bot, CalendarCheck]

// Maps each rotating hero label to an industry slug for the visual
const HERO_SLUGS = ['estetica', 'dental', 'estetica', 'medicina', 'nutricion', 'psicologia']

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.55, ease: EASE, delay },
  }
}

function CTAButton({ label }: { label: string }) {
  return (
    <a
      href="/precios"
      className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-semibold transition-colors duration-150"
      style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLAnchorElement).style.background = 'var(--accent-hover)')
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLAnchorElement).style.background = 'var(--accent)')
      }
    >
      {label}
    </a>
  )
}

export default function HomePage() {
  const { t, lang } = useLang()
  const [labelIdx, setLabelIdx] = useState(0)
  const [visible, setVisible] = useState(true)

  const labels = t.hero.labels

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setLabelIdx((i) => (i + 1) % labels.length)
        setVisible(true)
      }, 350)
    }, 2800)
    return () => clearInterval(interval)
  }, [labels.length])

  return (
    <>
      <Navbar />

      <main className="flex flex-col flex-1 pt-24">

        {/* ════════════════════════════════════════
            HERO
        ════════════════════════════════════════ */}
        <section className="relative px-4 sm:px-6 pt-6 pb-14 sm:pt-8 sm:pb-16 overflow-hidden">
          {/* Background glow */}
          <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-start">
            <div
              className="w-[500px] h-[500px] rounded-full blur-3xl opacity-15"
              style={{ background: 'radial-gradient(ellipse, #13244A 0%, transparent 70%)' }}
            />
          </div>

          {/* Flow diagram — hidden on mobile */}
          <motion.div {...fadeUp(0)} className="hidden sm:block relative z-10 max-w-2xl mx-auto mb-7">
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(255,255,255,0.65)',
              backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(26,42,86,0.09)', borderRadius: 9999,
              padding: '7px 16px',
              boxShadow: '0 2px 16px rgba(26,42,86,0.07)',
            }}>
              {t.flow.map((step, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '3px 10px' }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                      background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {(() => { const Icon = FLOW_ICONS[i]; return <Icon size={13} color="#1A2A56" strokeWidth={2} /> })()}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: 9, fontWeight: 600, color: '#1A2A56', opacity: 0.4, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        {`Step ${i + 1}`}
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: '#1A2A56', whiteSpace: 'nowrap', lineHeight: 1.35 }}>
                        {step.label}
                      </span>
                      <span style={{ fontSize: 10, color: '#6B7280', whiteSpace: 'nowrap' }}>{step.sub}</span>
                    </div>
                  </div>
                  {i < t.flow.length - 1 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 2, padding: '0 2px' }}>
                      <div style={{ width: 18, borderTop: '1.5px dashed rgba(26,42,86,0.18)' }} />
                      <ArrowRight size={10} color="rgba(26,42,86,0.28)" strokeWidth={2.5} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">

            {/* Left: copy */}
            <div className="flex flex-col gap-5">
              {/* Rotating badge */}
              <motion.div
                {...fadeUp(0)}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium w-fit"
                style={{ background: '#E5E9F4', color: 'var(--accent)', border: '1px solid #C5CEEA' }}
              >
                <span className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0" style={{ background: 'var(--accent)' }} />
                <span style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.3s ease', display: 'inline-block', minWidth: 180 }}>
                  {labels[labelIdx]}
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                {...fadeUp(0.1)}
                className="text-3xl lg:text-6xl font-bold tracking-tight leading-tight"
                style={{ color: 'var(--text-primary)' }}
              >
                {t.hero.headline1}{' '}
                <span style={{ color: 'var(--accent)' }}>{t.hero.headline2}</span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p {...fadeUp(0.2)} className="text-sm sm:text-base leading-relaxed max-w-lg" style={{ color: '#6B7280' }}>
                {t.hero.subheadline}
              </motion.p>

              {/* CTA */}
              <motion.div {...fadeUp(0.3)} className="flex flex-col sm:flex-row gap-3">
                <CTAButton label={t.hero.cta} />
              </motion.div>

              {/* Trust */}
              <motion.p {...fadeUp(0.4)} className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {t.hero.trust}
              </motion.p>
            </div>

            {/* Right: AI character — desktop only */}
            <div className="hidden lg:flex justify-end">
              <div className="w-[380px]">
                <IndustryHeroVisual slug={HERO_SLUGS[labelIdx] ?? 'dental'} />
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            STATS
        ════════════════════════════════════════ */}
        <section className="py-12 sm:py-16 px-4 sm:px-6" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {t.stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE, delay: i * 0.1 }}
                className="flex flex-col items-center text-center gap-2 py-8 px-6 rounded-2xl"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
              >
                <span className="text-3xl font-black tracking-tight leading-none" style={{ color: 'var(--accent)' }}>
                  {s.value}
                </span>
                <span className="text-sm font-medium leading-snug max-w-[180px]" style={{ color: 'var(--text-secondary)' }}>
                  {s.label}
                </span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════
            INDUSTRIAS GRID
        ════════════════════════════════════════ */}
        <section className="py-12 sm:py-16 px-4 sm:px-6" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
          <div className="max-w-5xl mx-auto flex flex-col gap-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--accent-label)' }}>
                  {lang === 'es' ? 'Por Industria' : 'By Industry'}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  {lang === 'es' ? 'Diseñado para tu especialidad' : 'Designed for your specialty'}
                </h2>
              </div>
              <Link
                href="/industrias"
                className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors duration-150 w-fit"
                style={{ color: 'var(--accent)' }}
              >
                {lang === 'es' ? 'Ver todas' : 'See all'}
                <ArrowRight size={13} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {HOME_INDUSTRIES.map((slug, i) => {
                const ind = INDUSTRIES.find((x) => x.slug === slug)
                if (!ind) return null
                const Icon = HOME_ICONS[slug] ?? Smile
                const name = lang === 'es' ? ind.es.name : ind.en.name
                return (
                  <motion.div
                    key={slug}
                    initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.4, ease: EASE, delay: i * 0.06 }}
                  >
                    <Link
                      href={`/industrias/${slug}`}
                      className="flex flex-col items-center gap-3 p-4 rounded-2xl transition-all duration-200 group"
                      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.borderColor = ind.color + '66'
                        ;(e.currentTarget as HTMLAnchorElement).style.background = ind.lightColor
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border)'
                        ;(e.currentTarget as HTMLAnchorElement).style.background = 'var(--surface)'
                      }}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: ind.lightColor }}
                      >
                        <Icon size={20} color={ind.color} />
                      </div>
                      <span className="text-xs font-semibold text-center leading-snug" style={{ color: 'var(--text-primary)' }}>
                        {name}
                      </span>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            HEAR IT — DEMO INTERACTIVO
        ════════════════════════════════════════ */}
        <HearItSection />

        {/* ════════════════════════════════════════
            EL PROBLEMA
        ════════════════════════════════════════ */}
        <section className="py-16 sm:py-24 px-4 sm:px-6" style={{ background: 'var(--bg-secondary)' }}>
          <div className="max-w-3xl mx-auto flex flex-col gap-8 sm:gap-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE }}
              className="flex flex-col gap-4"
            >
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--accent-label)' }}>
                {t.problem.eyebrow}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight leading-tight" style={{ color: 'var(--text-primary)' }}>
                {t.problem.headline}
              </h2>
              <p className="text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>
                {t.problem.sub}
              </p>
            </motion.div>

            <ul className="flex flex-col gap-4">
              {t.problem.items.map((p, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.45, ease: EASE, delay: i * 0.08 }}
                  className="flex items-start gap-4 p-4 rounded-xl"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                >
                  <span className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#FEF3C7' }}>
                    <AlertTriangle size={16} color="#D97706" />
                  </span>
                  <span className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                    {p}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>
        </section>

        {/* ════════════════════════════════════════
            LA SOLUCIÓN
        ════════════════════════════════════════ */}
        <section id="producto" className="py-16 sm:py-24 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto flex flex-col gap-10 sm:gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE }}
              className="flex flex-col gap-4 max-w-2xl"
            >
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--accent-label)' }}>
                {t.solution.eyebrow}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight leading-tight" style={{ color: 'var(--text-primary)' }}>
                {t.solution.headline}
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {t.solution.items.map((s, i) => {
                const Icon = SOLUTION_ICONS[i]
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.45, ease: EASE, delay: i * 0.07 }}
                    className="p-6 rounded-2xl flex flex-col gap-4"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#E5E9F4' }}>
                      <Icon size={20} color="#13244A" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>{s.title}</h3>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{s.desc}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE }}
              className="flex flex-col items-center gap-3 pt-4"
            >
              <CTAButton label={t.hero.cta} />
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.hero.trust}</p>
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            SIMULADOR
        ════════════════════════════════════════ */}
        <SimulatorSection />

        {/* ════════════════════════════════════════
            SEGURIDAD
        ════════════════════════════════════════ */}
        <SecurityBadgeSection />

        {/* ════════════════════════════════════════
            FAQ
        ════════════════════════════════════════ */}
        <FAQSection />

      </main>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-center sm:text-left" style={{ color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} {t.footer.copy}
          </p>
          <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-5">
            {[
              { label: t.footer.terms,   href: '/terminos' },
              { label: t.footer.privacy, href: '/privacidad' },
              { label: t.footer.refunds, href: '/reembolsos' },
              { label: t.footer.support, href: '/contacto' },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="text-xs font-medium" style={{ color: '#1A2A56' }}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </>
  )
}
