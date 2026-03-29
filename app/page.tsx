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
} from 'lucide-react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { LaptopMockup } from '@/components/ui/LaptopMockup'
import { FAQSection } from '@/components/sections/FAQSection'
import { HearItSection } from '@/components/sections/HearItSection'
import { SecurityBadgeSection } from '@/components/sections/SecurityBadgeSection'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.55, ease: EASE, delay },
  }
}

function CTAButton({ href = '/precios' }: { href?: string }) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-semibold transition-colors duration-150"
      style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLAnchorElement).style.background = 'var(--accent-hover)')
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLAnchorElement).style.background = 'var(--accent)')
      }
    >
      Quiero mi recepcionista virtual
    </a>
  )
}

const LABELS = [
  'Para Dueños de Spa',
  'Para Clínicas Dentales',
  'Para Clínicas Estéticas',
  'Para Consultorios de Salud',
  'Para Especialistas en Nutrición',
  'Para Centros de Bienestar',
]

export default function HomePage() {
  const [labelIdx, setLabelIdx] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setLabelIdx((i) => (i + 1) % LABELS.length)
        setVisible(true)
      }, 350)
    }, 2800)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <Navbar />

      <main className="flex flex-col flex-1 pt-24">

        {/* ════════════════════════════════════════
            HERO
        ════════════════════════════════════════ */}
        <section className="relative px-4 pt-6 pb-14 sm:pt-8 sm:pb-16 overflow-hidden">
          {/* Background glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-start"
          >
            <div
              className="w-[500px] h-[500px] rounded-full blur-3xl opacity-15"
              style={{ background: 'radial-gradient(ellipse, #13244A 0%, transparent 70%)' }}
            />
          </div>

          {/* ── Flow diagram — centered above hero columns ── */}
          <motion.div
            {...fadeUp(0)}
            className="relative z-10 max-w-2xl mx-auto mb-7"
          >
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 0,
              background: 'rgba(255,255,255,0.65)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(26,42,86,0.09)',
              borderRadius: 9999,
              padding: '7px 16px',
              boxShadow: '0 2px 16px rgba(26,42,86,0.07), 0 1px 2px rgba(26,42,86,0.05)',
            }}>
              {FLOW_STEPS.map((step, i) => (
                <div key={step.label} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                  {/* Step */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '3px 10px' }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                      background: '#EEF2FF',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <step.Icon size={13} color="#1A2A56" strokeWidth={2} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                      <span style={{ fontSize: 9, fontWeight: 600, color: '#1A2A56', opacity: 0.4, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        Paso {i + 1}
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: '#1A2A56', whiteSpace: 'nowrap', lineHeight: 1.35 }}>
                        {step.label}
                      </span>
                      <span style={{ fontSize: 10, color: '#6B7280', whiteSpace: 'nowrap' }}>
                        {step.sub}
                      </span>
                    </div>
                  </div>

                  {/* Connector (not after last) */}
                  {i < FLOW_STEPS.length - 1 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 2, padding: '0 2px' }}>
                      <div style={{ width: 18, borderTop: '1.5px dashed rgba(26,42,86,0.18)' }} />
                      <ArrowRight size={10} color="rgba(26,42,86,0.28)" strokeWidth={2.5} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

            {/* ── Left: copy ── */}
            <div className="flex flex-col gap-4">
              {/* Badge */}
              <motion.div
                {...fadeUp(0)}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium w-fit"
                style={{
                  background: '#E5E9F4',
                  color: 'var(--accent)',
                  border: '1px solid #C5CEEA',
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0"
                  style={{ background: 'var(--accent)' }}
                />
                <span
                  style={{
                    opacity: visible ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                    display: 'inline-block',
                    minWidth: 220,
                  }}
                >
                  {LABELS[labelIdx]}
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                {...fadeUp(0.1)}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight"
                style={{ color: 'var(--text-primary)' }}
              >
                No Pierdas una Sola Llamada:{' '}
                <span style={{ color: 'var(--accent)' }}>
                  Tu Recepcionista IA Disponible 24/7
                </span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                {...fadeUp(0.2)}
                className="text-lg sm:text-xl leading-relaxed max-w-lg"
                style={{ color: '#6B7280' }}
              >
                Transforma cada consulta en una cita confirmada. Nuestra IA atiende a tus
                pacientes por WhatsApp, Instagram y llamadas, asegurando que nunca pierdas
                un ingreso por falta de atención.
              </motion.p>

              {/* CTA */}
              <motion.div {...fadeUp(0.3)}>
                <CTAButton />
              </motion.div>

              {/* Trust line */}
              <motion.p
                {...fadeUp(0.4)}
                className="text-xs"
                style={{ color: 'var(--text-muted)' }}
              >
                Instalación en 24 horas • Sin contratos forzosos • Soporte bilingüe
              </motion.p>
            </div>

            {/* ── Right: tablet mockup ── */}
            <div className="flex justify-center lg:justify-end">
              <LaptopMockup />
            </div>

          </div>
        </section>

        {/* ════════════════════════════════════════
            STATS
        ════════════════════════════════════════ */}
        <section className="py-16 px-4" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: EASE, delay: i * 0.1 }}
                className="flex flex-col items-center text-center gap-2 py-8 px-6 rounded-2xl"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                }}
              >
                <span
                  className="text-5xl font-black tracking-tight leading-none"
                  style={{ color: 'var(--accent)' }}
                >
                  {s.value}
                </span>
                <span
                  className="text-sm font-medium leading-snug max-w-[180px]"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {s.label}
                </span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════
            HEAR IT — DEMO INTERACTIVO
        ════════════════════════════════════════ */}
        <HearItSection />

        {/* ════════════════════════════════════════
            EL PROBLEMA
        ════════════════════════════════════════ */}
        <section className="py-24 px-4" style={{ background: 'var(--bg-secondary)' }}>
          <div className="max-w-3xl mx-auto flex flex-col gap-10">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE }}
              className="flex flex-col gap-4"
            >
              <span
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: 'var(--accent)' }}
              >
                El Problema
              </span>
              <h2
                className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight"
                style={{ color: 'var(--text-primary)' }}
              >
                ¿Cuántos pacientes estás perdiendo mientras tu recepcionista está ocupada/o?
              </h2>
              <p className="text-base sm:text-lg" style={{ color: 'var(--text-secondary)' }}>
                La falta de respuesta inmediata es la causa{' '}
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  #1 de abandono
                </span>{' '}
                en clínicas de salud.
              </p>
            </motion.div>

            {/* Problem list */}
            <ul className="flex flex-col gap-4">
              {PROBLEMS.map((p, i) => (
                <motion.li
                  key={p}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, ease: EASE, delay: i * 0.08 }}
                  className="flex items-start gap-4 p-4 rounded-xl"
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <span
                    className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: '#FEF3C7' }}
                  >
                    <AlertTriangle size={16} color="#D97706" />
                  </span>
                  <span
                    className="text-sm sm:text-base leading-relaxed"
                    style={{ color: 'var(--text-primary)' }}
                  >
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
        <section id="producto" className="py-24 px-4">
          <div className="max-w-5xl mx-auto flex flex-col gap-12">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE }}
              className="flex flex-col gap-4 max-w-2xl"
            >
              <span
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: 'var(--accent)' }}
              >
                La Solución
              </span>
              <h2
                className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight"
                style={{ color: 'var(--text-primary)' }}
              >
                Un recepcionista que trabaja como tú quieres
              </h2>
            </motion.div>

            {/* 3×2 grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {SOLUTIONS.map((s, i) => (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, ease: EASE, delay: i * 0.07 }}
                  className="p-6 rounded-2xl flex flex-col gap-4"
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: '#E5E9F4' }}
                  >
                    <s.Icon size={20} color="#13244A" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3
                      className="text-base font-semibold"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {s.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {s.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA al final de la sección */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE }}
              className="flex flex-col items-center gap-3 pt-4"
            >
              <CTAButton />
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Instalación en 24 horas • Sin contratos forzosos • Soporte bilingüe
              </p>
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            SEGURIDAD DE GRADO MÉDICO
        ════════════════════════════════════════ */}
        <SecurityBadgeSection />

        {/* ════════════════════════════════════════
            FAQ
        ════════════════════════════════════════ */}
        <FAQSection />

      </main>

      {/* ── Footer ── */}
      <footer
        className="py-8 px-4"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} Welko — El recepcionista IA líder para Clínicas de Salud y Estética.
          </p>
          <nav className="flex items-center gap-5">
            {[
              { label: 'Términos y Condiciones', href: '/terminos' },
              { label: 'Aviso de Privacidad', href: '/privacidad' },
              { label: 'Reembolsos', href: '/reembolsos' },
              { label: 'Soporte', href: '/contacto' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs font-medium transition-colors duration-150"
                style={{ color: '#1A2A56' }}
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

/* ─── Data ─── */

const FLOW_STEPS = [
  {
    Icon: MessageCircle,
    label: 'Paciente Llama o Escribe',
    sub: 'WhatsApp · Instagram · FB',
  },
  {
    Icon: Bot,
    label: 'Procesa IA de Welko',
    sub: 'Respuesta segura en segundos',
  },
  {
    Icon: CalendarCheck,
    label: 'Agenda en tu Calendario',
    sub: 'Sincronizado con tu CRM',
  },
]

const STATS = [
  { value: '100%', label: 'de mensajes contestados sin intervención humana' },
  { value: '24/7', label: 'disponibilidad total para agendar citas' },
  { value: '+40%', label: 'incremento en citas agendadas mensualmente' },
]

const PROBLEMS = [
  'Pacientes que llaman fuera de horario y nunca vuelven a intentar.',
  'Llamadas perdidas en horas pico que se convierten en citas para tu competencia.',
  'Equipo administrativo saturado repitiendo las mismas respuestas.',
  'Seguimiento manual ineficiente de pacientes que no confirman.',
]

const SOLUTIONS = [
  {
    Icon: Calendar,
    title: 'Agenda automática',
    desc: 'Citas por WhatsApp o chat sin intervención humana, disponible las 24 horas.',
  },
  {
    Icon: MessageCircle,
    title: 'Respuestas inmediatas',
    desc: 'Resuelve dudas sobre tratamientos y precios al instante, sin esperas.',
  },
  {
    Icon: Bell,
    title: 'Recordatorios inteligentes',
    desc: 'Reduce inasistencias con confirmaciones automáticas antes de cada cita.',
  },
  {
    Icon: Sparkles,
    title: 'Personalizada a tu marca',
    desc: 'La IA habla con la voz y el tono de tu clínica, como si fuera tu equipo.',
  },
  {
    Icon: BarChart2,
    title: 'Reportes en tiempo real',
    desc: 'Visualiza métricas de llamadas y citas cada día desde tu dashboard.',
  },
  {
    Icon: ShieldCheck,
    title: 'Privacidad garantizada',
    desc: 'Protección de datos con estándares de seguridad médica en cada interacción.',
  },
]
