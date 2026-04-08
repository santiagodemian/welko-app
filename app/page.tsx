'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, MessageCircle, Bot, CalendarCheck } from 'lucide-react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { IndustryHeroVisual } from '@/components/ui/IndustryHeroVisual'
import { LogosTrustSection } from '@/components/sections/LogosTrustSection'
import { BenefitsSection } from '@/components/sections/BenefitsSection'
import { WhatsAppDemo } from '@/components/sections/WhatsAppDemo'
import { ComparisonSection } from '@/components/sections/ComparisonSection'
import { ROICalculator } from '@/components/sections/ROICalculator'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { FAQSection } from '@/components/sections/FAQSection'
import { GuaranteeSection } from '@/components/sections/GuaranteeSection'
import { IntegrationsSection } from '@/components/sections/IntegrationsSection'
import { useLang } from '@/contexts/LangContext'
import { WelkoLogo } from '@/components/ui/WelkoLogo'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]
const FLOW_ICONS = [MessageCircle, Bot, CalendarCheck]
const HERO_SLUGS = ['estetica', 'dental', 'estetica', 'medicina', 'nutricion', 'psicologia']

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: EASE, delay },
  }
}

// ── Animated counter ──────────────────────────────────────────────────────────
function CountUp({ to, suffix = '', duration = 1800 }: { to: number; suffix?: string; duration?: number }) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = Math.ceil(to / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= to) { setValue(to); clearInterval(timer) }
      else setValue(start)
    }, 16)
    return () => clearInterval(timer)
  }, [inView, to, duration])

  return <span ref={ref}>{value.toLocaleString()}{suffix}</span>
}

export default function HomePage() {
  const { t, lang } = useLang()
  const [labelIdx, setLabelIdx] = useState(0)
  const [visible, setVisible] = useState(true)
  const labels = t.hero.labels

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => { setLabelIdx((i) => (i + 1) % labels.length); setVisible(true) }, 350)
    }, 2800)
    return () => clearInterval(interval)
  }, [labels.length])

  return (
    <>
      <Navbar />

      <main className="flex flex-col flex-1 pt-28">

        {/* ════════════════════════════════════════
            HERO — Fresha-style centered
        ════════════════════════════════════════ */}
        <section className="relative px-4 sm:px-6 pt-16 pb-24 sm:pt-24 sm:pb-32 overflow-hidden">

          {/* Spotlight gradient orbs */}
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full blur-3xl opacity-[0.08]"
              style={{ background: 'radial-gradient(ellipse at center, #13244A 0%, #1A3A7A 40%, transparent 70%)' }} />
            <div className="absolute top-40 right-[-100px] w-[400px] h-[400px] rounded-full blur-3xl opacity-[0.05]"
              style={{ background: '#1A3A7A' }} />
            <div className="absolute bottom-0 left-[-80px] w-[350px] h-[350px] rounded-full blur-3xl opacity-[0.04]"
              style={{ background: '#13244A' }} />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center gap-8">

            {/* Rotating eyebrow badge */}
            <motion.div {...fadeUp(0)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--accent-label)', boxShadow: '0 2px 12px rgba(19,36,74,0.08)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0" style={{ background: 'var(--accent-label)' }} />
              <span style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.3s ease', minWidth: 200, display: 'inline-block' }}>
                {labels[labelIdx]}
              </span>
            </motion.div>

            {/* Headline — very large */}
            <motion.h1 {...fadeUp(0.08)}
              className="text-[2rem] sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.08]"
              style={{ color: 'var(--text-primary)' }}
            >
              {t.hero.headline1}{' '}
              <span style={{ color: 'var(--accent)' }}>{t.hero.headline2}</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p {...fadeUp(0.16)}
              className="text-lg sm:text-xl font-light leading-relaxed max-w-2xl"
              style={{ color: 'var(--text-secondary)' }}
            >
              {t.hero.subheadline}
            </motion.p>

            {/* CTA row */}
            <motion.div {...fadeUp(0.22)} className="flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/precios"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold transition-all duration-200"
                style={{ background: 'var(--accent)', color: 'var(--accent-fg)', boxShadow: '0 4px 24px rgba(19,36,74,0.25)' }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = 'var(--accent-hover)'; el.style.transform = 'translateY(-2px)' }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = 'var(--accent)'; el.style.transform = 'translateY(0)' }}
              >
                {lang === 'es' ? 'Comenzar ahora' : 'Get started now'}
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/simulador"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-medium transition-all duration-200"
                style={{ border: '1.5px solid var(--border)', color: 'var(--text-primary)', background: 'var(--surface)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'var(--surface-hover)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'var(--surface)' }}
              >
                {lang === 'es' ? 'Ver simulador' : 'Try simulator'}
              </Link>
            </motion.div>

            {/* Trust line */}
            <motion.p {...fadeUp(0.28)} className="text-sm font-light" style={{ color: 'var(--text-muted)' }}>
              {t.hero.trust}
            </motion.p>

            {/* Flow pill */}
            <motion.div {...fadeUp(0.34)} className="hidden sm:block w-full max-w-2xl">
              <div className="glass-card flex items-center justify-center gap-0 rounded-full px-4 py-2">
                {t.flow.map((step, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 12px' }}>
                      <div style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0, background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {(() => { const Icon = FLOW_ICONS[i]; return <Icon size={13} color="#1A2A56" strokeWidth={2} /> })()}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: 9, fontWeight: 700, color: '#1A2A56', opacity: 0.38, letterSpacing: '0.07em', textTransform: 'uppercase' }}>{`Step ${i + 1}`}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#1A2A56', whiteSpace: 'nowrap', lineHeight: 1.3 }}>{step.label}</span>
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

            {/* Hero visual — floating card, centered */}
            <motion.div
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.4 }}
              className="w-full max-w-sm mx-auto"
            >
              <IndustryHeroVisual slug={HERO_SLUGS[labelIdx] ?? 'dental'} />
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            STATS — animated counters
        ════════════════════════════════════════ */}
        <section className="py-14 px-4 sm:px-6" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <div className="max-w-4xl mx-auto grid grid-cols-3 gap-0 divide-x divide-[var(--border)]">
            {[
              { value: 500,  suffix: '+', label: lang === 'es' ? 'negocios activos' : 'active businesses' },
              { value: 98,   suffix: '%', label: lang === 'es' ? 'tasa de respuesta' : 'response rate' },
              { value: 24,   suffix: '/7', label: lang === 'es' ? 'disponibilidad' : 'always available' },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE, delay: i * 0.1 }}
                className="flex flex-col items-center text-center gap-1 px-3 sm:px-8 py-4"
              >
                <span className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-none" style={{ color: 'var(--text-primary)' }}>
                  <CountUp to={s.value} suffix={s.suffix} />
                </span>
                <span className="text-xs sm:text-sm font-medium" style={{ color: 'var(--text-muted)' }}>{s.label}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════
            ESPECIALIDADES — links a /dental y /estetica
        ════════════════════════════════════════ */}
        <section className="py-10 px-4 sm:px-6" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="max-w-3xl mx-auto flex flex-col items-center gap-5">
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              {lang === 'es' ? '¿En qué tipo de clínica trabajas?' : 'What type of clinic do you run?'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-lg">
              {[
                { href: '/dental',   emoji: '🦷', label: lang === 'es' ? 'Clínica Dental'    : 'Dental Clinic',      color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
                { href: '/estetica', emoji: '✨', label: lang === 'es' ? 'Centro de Estética' : 'Aesthetic Center',   color: '#BE185D', bg: '#FFF1F2', border: '#FECDD3' },
                { href: '/industrias', emoji: '🏥', label: lang === 'es' ? 'Otra especialidad' : 'Other specialty',  color: 'var(--text-secondary)', bg: 'var(--surface)', border: 'var(--border)' },
              ].map(item => (
                <Link key={item.href} href={item.href}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm transition-all duration-150"
                  style={{ background: item.bg, border: `1.5px solid ${item.border}`, color: item.color }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 14px rgba(0,0,0,0.08)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none' }}>
                  <span>{item.emoji}</span>
                  {item.label}
                  <ArrowRight size={13} />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            LOGOS TRUST
        ════════════════════════════════════════ */}
        <LogosTrustSection />

        {/* ════════════════════════════════════════
            WHATSAPP DEMO ANIMADO
        ════════════════════════════════════════ */}
        <WhatsAppDemo />

        {/* ════════════════════════════════════════
            BENEFITS
        ════════════════════════════════════════ */}
        <BenefitsSection />

        {/* ════════════════════════════════════════
            COMPARATIVA
        ════════════════════════════════════════ */}
        <ComparisonSection />

        {/* ════════════════════════════════════════
            ROI CALCULATOR
        ════════════════════════════════════════ */}
        <ROICalculator />

        {/* ════════════════════════════════════════
            TESTIMONIALS — carousel
        ════════════════════════════════════════ */}
        <TestimonialsSection />

        {/* ════════════════════════════════════════
            INTEGRACIONES
        ════════════════════════════════════════ */}
        <IntegrationsSection />

        {/* ════════════════════════════════════════
            FAQ — objeciones reales
        ════════════════════════════════════════ */}
        <FAQSection />

        {/* ════════════════════════════════════════
            GARANTÍA
        ════════════════════════════════════════ */}
        <GuaranteeSection />

        {/* ════════════════════════════════════════
            DARK CTA — Fresha-style "La solución #1"
        ════════════════════════════════════════ */}
        <section className="py-20 sm:py-28 px-4 sm:px-6 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #05101F 0%, #13244A 50%, #0E1F38 100%)' }}>
          {/* Decorative orbs */}
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute top-[-80px] right-[-80px] w-[500px] h-[500px] rounded-full blur-3xl opacity-10"
              style={{ background: '#3B82F6' }} />
            <div className="absolute bottom-[-60px] left-[-60px] w-[400px] h-[400px] rounded-full blur-3xl opacity-10"
              style={{ background: '#1A3A7A' }} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, ease: EASE }}
            className="relative z-10 max-w-3xl mx-auto flex flex-col items-center text-center gap-8"
          >
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#60A5FA' }}>
              {lang === 'es' ? 'La infraestructura IA #1 para negocios en LATAM' : 'The #1 AI infrastructure for businesses in LATAM'}
            </span>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight" style={{ color: '#FFFFFF' }}>
              {lang === 'es'
                ? <>¿Listo para nunca volver<br />a perder un cliente?</>
                : <>Ready to never miss<br />a client again?</>}
            </h2>

            <p className="text-lg font-light leading-relaxed max-w-xl" style={{ color: 'rgba(240,244,252,0.65)' }}>
              {lang === 'es'
                ? 'Activa tu recepcionista IA hoy. Sin código, sin integraciones complejas. En menos de 24 horas.'
                : 'Activate your AI receptionist today. No code, no complex integrations. In under 24 hours.'}
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
              {[
                { n: '< 2s',  label: lang === 'es' ? 'tiempo de respuesta' : 'response time' },
                { n: '24/7',  label: lang === 'es' ? 'sin interrupciones'  : 'no interruptions' },
                { n: '−35%', label: lang === 'es' ? 'en no-shows'          : 'in no-shows' },
              ].map((s) => (
                <div key={s.n} className="flex flex-col items-center gap-0.5">
                  <span className="text-2xl font-extrabold" style={{ color: '#FFFFFF' }}>{s.n}</span>
                  <span className="text-xs font-medium" style={{ color: 'rgba(240,244,252,0.45)' }}>{s.label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/precios"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold transition-all duration-200"
                style={{ background: '#FFFFFF', color: '#0A0F1A', boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = '#F0F4FC'; el.style.transform = 'translateY(-2px)' }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = '#FFFFFF'; el.style.transform = 'translateY(0)' }}
              >
                {lang === 'es' ? 'Comenzar ahora' : 'Get started now'}
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/como-funciona"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-medium transition-all duration-200"
                style={{ border: '1.5px solid rgba(255,255,255,0.2)', color: 'rgba(240,244,252,0.85)', background: 'transparent' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.07)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent' }}
              >
                {lang === 'es' ? 'Ver cómo funciona' : 'See how it works'}
              </Link>
            </div>
          </motion.div>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer className="py-12 px-4 sm:px-6" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-2.5">
            <WelkoLogo size={22} />
            <p className="text-xs font-light" style={{ color: 'var(--text-muted)' }}>
              © {new Date().getFullYear()} {t.footer.copy}
            </p>
          </div>
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
