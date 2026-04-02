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
  Leaf,
} from 'lucide-react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { IndustryHeroVisual } from '@/components/ui/IndustryHeroVisual'
import { FAQSection } from '@/components/sections/FAQSection'
import { HearItSection } from '@/components/sections/HearItSection'
import { SecurityBadgeSection } from '@/components/sections/SecurityBadgeSection'
import { SimulatorSection } from '@/components/sections/SimulatorSection'
import { HumanTalentSection } from '@/components/sections/HumanTalentSection'
import { WelkoDNASection } from '@/components/sections/WelkoDNASection'
import { PricingSection } from '@/components/sections/PricingSection'
import { useLang } from '@/contexts/LangContext'
import { INDUSTRIES, HOME_INDUSTRIES } from '@/lib/industries'

// ── Inline SVG specialty icons (linear, single-color) ────────────────────────

function IconTooth({ size = 22, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C9.5 2 7 4 7 6.5c0 1.2.4 2.3.4 3.5C7.4 13 6 17 6 19c0 1.7 1 3 2.5 3 1 0 1.8-.7 2.5-2 .4-.8.7-1.5 1-1.5s.6.7 1 1.5c.7 1.3 1.5 2 2.5 2C17 22 18 20.7 18 19c0-2-1.4-6-1.4-9 0-1.2.4-2.3.4-3.5C17 4 14.5 2 12 2z" />
    </svg>
  )
}
function IconBrain({ size = 22, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2a2.5 2.5 0 0 1 5 0" />
      <path d="M12 4.5C9 4.5 6.5 7 6.5 10c0 1.3.4 2.5 1.1 3.4A4 4 0 0 0 8 15.5V20h8v-4.5a4 4 0 0 0 .4-2.1A5.5 5.5 0 0 0 12 4.5z" />
      <path d="M8 10H6a2 2 0 0 0 0 4h2" />
      <path d="M16 10h2a2 2 0 0 1 0 4h-2" />
    </svg>
  )
}
function IconDiamond({ size = 22, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.7 10.3L12 21l9.3-10.7L17 3H7L2.7 10.3z" />
      <path d="M7 3l5 7 5-7" />
      <path d="M2.7 10.3h18.6" />
    </svg>
  )
}
function IconLeaf({ size = 22, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  )
}
function IconHeart({ size = 22, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      <path d="M12 8v4M10 10h4" />
    </svg>
  )
}
function IconEye({ size = 22, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12S5 5 12 5s11 7 11 7-4 7-11 7S1 12 1 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

const HOME_SVG_ICONS: Record<string, React.FC<{ size?: number; color?: string }>> = {
  dental:       IconTooth,
  psicologia:   IconBrain,
  estetica:     IconDiamond,
  nutricion:    IconLeaf,
  ginecologia:  IconHeart,
  oftalmologia: IconEye,
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]
const SOLUTION_ICONS = [Calendar, MessageCircle, Bell, Sparkles, BarChart2, ShieldCheck]
const FLOW_ICONS = [MessageCircle, Bot, CalendarCheck]
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
      className="inline-flex items-center justify-center px-7 py-3.5 rounded-2xl text-sm font-semibold tracking-wide transition-all duration-200"
      style={{
        background: 'var(--accent)',
        color: 'var(--accent-fg)',
        boxShadow: '0 4px 20px rgba(19,36,74,0.22)',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLAnchorElement
        el.style.background = 'var(--accent-hover)'
        el.style.transform = 'translateY(-1px)'
        el.style.boxShadow = '0 8px 28px rgba(19,36,74,0.30)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLAnchorElement
        el.style.background = 'var(--accent)'
        el.style.transform = 'translateY(0)'
        el.style.boxShadow = '0 4px 20px rgba(19,36,74,0.22)'
      }}
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
        <section className="relative px-4 sm:px-6 pt-10 pb-20 sm:pt-16 sm:pb-28 overflow-hidden">
          {/* Background glow blobs */}
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full blur-3xl opacity-[0.07]"
              style={{ background: 'radial-gradient(ellipse, #13244A 0%, transparent 70%)' }} />
            <div className="absolute top-20 right-0 w-[400px] h-[400px] rounded-full blur-3xl opacity-[0.05]"
              style={{ background: 'radial-gradient(ellipse, #1A3A7A 0%, transparent 70%)' }} />
          </div>

          {/* Flow pill */}
          <motion.div {...fadeUp(0)} className="hidden sm:block relative z-10 max-w-2xl mx-auto mb-10">
            <div className="glass-card flex items-center justify-center gap-0 rounded-full px-4 py-2">
              {t.flow.map((step, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 12px' }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                      background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {(() => { const Icon = FLOW_ICONS[i]; return <Icon size={13} color="#1A2A56" strokeWidth={2} /> })()}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: 9, fontWeight: 700, color: '#1A2A56', opacity: 0.38, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                        {`Step ${i + 1}`}
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#1A2A56', whiteSpace: 'nowrap', lineHeight: 1.3 }}>
                        {step.label}
                      </span>
                      <span style={{ fontSize: 10, color: '#6B7280', whiteSpace: 'nowrap' }}>{step.sub}</span>
                    </div>
                  </div>
                  {i < t.flow.length - 1 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <div style={{ width: 18, borderTop: '1.5px dashed rgba(26,42,86,0.18)' }} />
                      <ArrowRight size={10} color="rgba(26,42,86,0.25)" strokeWidth={2.5} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left: copy */}
            <div className="flex flex-col gap-6">
              {/* Rotating badge */}
              <motion.div {...fadeUp(0)}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold w-fit"
                style={{ background: '#E5E9F4', color: 'var(--accent)', border: '1px solid #C5CEEA' }}
              >
                <span className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0" style={{ background: 'var(--accent)' }} />
                <span style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.3s ease', display: 'inline-block', minWidth: 180 }}>
                  {labels[labelIdx]}
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1 {...fadeUp(0.1)}
                className="text-4xl lg:text-6xl font-bold tracking-tight leading-[1.1]"
                style={{ color: 'var(--text-primary)' }}
              >
                {t.hero.headline1}{' '}
                <span style={{ color: 'var(--accent)' }}>{t.hero.headline2}</span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p {...fadeUp(0.2)} className="text-base leading-relaxed max-w-lg font-light"
                style={{ color: 'var(--text-secondary)' }}>
                {t.hero.subheadline}
              </motion.p>

              {/* CTA */}
              <motion.div {...fadeUp(0.3)} className="flex flex-col sm:flex-row gap-4">
                <CTAButton label={t.hero.cta} />
              </motion.div>

              {/* CO₂ badge */}
              <motion.div {...fadeUp(0.4)}
                className="flex items-center gap-2 w-fit"
              >
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                  style={{
                    background: 'rgba(34,197,94,0.08)',
                    border: '1px solid rgba(34,197,94,0.20)',
                  }}
                >
                  <Leaf size={12} style={{ color: '#4ade80', flexShrink: 0 }} strokeWidth={1.8} />
                  <span className="text-xs font-light tracking-wide"
                    style={{ color: 'rgba(74,222,128,0.85)' }}>
                    Welko dona el 1% de tu suscripción para eliminar CO₂ de la atmósfera
                  </span>
                </div>
              </motion.div>

              {/* Trust */}
              <motion.p {...fadeUp(0.5)} className="text-xs font-light" style={{ color: 'var(--text-muted)' }}>
                {t.hero.trust}
              </motion.p>
            </div>

            {/* Right: AI visual — desktop only */}
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
        <section className="py-16 sm:py-20 px-4 sm:px-6" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
            {t.stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE, delay: i * 0.1 }}
                className="float-shadow flex flex-col items-center text-center gap-3 py-10 px-6 rounded-3xl"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
              >
                <span className="text-4xl font-extrabold tracking-tight leading-none" style={{ color: 'var(--accent)' }}>
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
            EL PROBLEMA
        ════════════════════════════════════════ */}
        <section className="section-spacing px-4 sm:px-6" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
          <div className="max-w-3xl mx-auto flex flex-col gap-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE }}
              className="flex flex-col gap-5"
            >
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--accent-label)' }}>
                {t.problem.eyebrow}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight" style={{ color: 'var(--text-primary)' }}>
                {t.problem.headline}
              </h2>
              <p className="text-base font-light leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {t.problem.sub}
              </p>
            </motion.div>

            <ul className="flex flex-col gap-4">
              {t.problem.items.map((p, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.45, ease: EASE, delay: i * 0.08 }}
                  className="float-shadow flex items-start gap-4 p-5 rounded-2xl"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                >
                  <span className="mt-0.5 flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#FEF3C7' }}>
                    <AlertTriangle size={16} color="#D97706" />
                  </span>
                  <span className="text-sm sm:text-base font-light leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                    {p}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>
        </section>

        {/* ════════════════════════════════════════
            LA SOLUCIÓN IA
        ════════════════════════════════════════ */}
        <section id="producto" className="section-spacing px-4 sm:px-6">
          <div className="max-w-5xl mx-auto flex flex-col gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE }}
              className="flex flex-col gap-5 max-w-2xl"
            >
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--accent-label)' }}>
                {t.solution.eyebrow}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight" style={{ color: 'var(--text-primary)' }}>
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
                    className="float-shadow p-6 rounded-3xl flex flex-col gap-5"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                  >
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: '#E5E9F4' }}>
                      <Icon size={20} color="#13244A" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>{s.title}</h3>
                      <p className="text-sm font-light leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{s.desc}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE }}
              className="flex flex-col items-center gap-4 pt-4"
            >
              <CTAButton label={t.hero.cta} />
              <p className="text-xs font-light" style={{ color: 'var(--text-muted)' }}>{t.hero.trust}</p>
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            ESPECIALIDADES — SVG ICONS
        ════════════════════════════════════════ */}
        <section className="section-spacing px-4 sm:px-6" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
          <div className="max-w-5xl mx-auto flex flex-col gap-10">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--accent-label)' }}>
                  {lang === 'es' ? 'Por Especialidad' : 'By Specialty'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  {lang === 'es' ? 'Diseñado para tu especialidad' : 'Designed for your specialty'}
                </h2>
              </div>
              <Link
                href="/industrias"
                className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors duration-150 w-fit"
                style={{ color: 'var(--accent)' }}
              >
                {lang === 'es' ? 'Ver todas' : 'See all'}
                <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {HOME_INDUSTRIES.map((slug, i) => {
                const ind = INDUSTRIES.find((x) => x.slug === slug)
                if (!ind) return null
                const SvgIcon = HOME_SVG_ICONS[slug]
                const name = lang === 'es' ? ind.es.name : ind.en.name
                return (
                  <motion.div
                    key={slug}
                    initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.4, ease: EASE, delay: i * 0.06 }}
                  >
                    <Link
                      href={`/industrias/${slug}`}
                      className="float-shadow flex flex-col items-center gap-3 p-5 rounded-3xl transition-all duration-200"
                      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLAnchorElement
                        el.style.borderColor = ind.color + '55'
                        el.style.background = ind.lightColor
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLAnchorElement
                        el.style.borderColor = 'var(--border)'
                        el.style.background = 'var(--surface)'
                      }}
                    >
                      <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{ background: ind.lightColor }}>
                        {SvgIcon
                          ? <SvgIcon size={22} color={ind.color} />
                          : <span style={{ fontSize: 20 }}>●</span>
                        }
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
            TALENTO HUMANO
        ════════════════════════════════════════ */}
        <HumanTalentSection />

        {/* ════════════════════════════════════════
            ADN WELKO
        ════════════════════════════════════════ */}
        <WelkoDNASection />

        {/* ════════════════════════════════════════
            SIMULADOR
        ════════════════════════════════════════ */}
        <SimulatorSection />

        {/* ════════════════════════════════════════
            PRECIOS — GLASSMORPHISM
        ════════════════════════════════════════ */}
        <PricingSection />

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
      <footer className="py-12 px-4 sm:px-6" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5">
          <p className="text-xs font-light text-center sm:text-left" style={{ color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} {t.footer.copy}
          </p>
          <nav className="flex flex-wrap items-center justify-center gap-5 sm:gap-6">
            {[
              { label: t.footer.terms,   href: '/terminos' },
              { label: t.footer.privacy, href: '/privacidad' },
              { label: t.footer.refunds, href: '/reembolsos' },
              { label: t.footer.support, href: '/contacto' },
            ].map((link) => (
              <Link key={link.href} href={link.href}
                className="text-xs font-medium transition-colors duration-150"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-primary)')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted)')}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </>
  )
}
