'use client'

import { motion } from 'framer-motion'
import {
  Calendar,
  MessageCircle,
  Bell,
  Sparkles,
  BarChart2,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { PricingSection } from '@/components/sections/PricingSection'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.55, ease: EASE, delay },
  }
}

function CTAButton({ href = '#precios' }: { href?: string }) {
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

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main className="flex flex-col flex-1 pt-24">

        {/* ════════════════════════════════════════
            HERO
        ════════════════════════════════════════ */}
        <section className="relative flex flex-col items-center justify-center text-center px-4 py-28 sm:py-36 overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <div
              className="w-[600px] h-[400px] rounded-full blur-3xl opacity-20"
              style={{ background: 'radial-gradient(ellipse, #13244A 0%, transparent 70%)' }}
            />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center gap-6">
            {/* Badge */}
            <motion.div
              {...fadeUp(0)}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium"
              style={{
                background: '#E5E9F4',
                color: 'var(--accent)',
                border: '1px solid #C5CEEA',
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: 'var(--accent)' }}
              />
              El recepcionista IA líder para Clínicas Estéticas, Dentales y de Salud
            </motion.div>

            {/* Headline */}
            <motion.h1
              {...fadeUp(0.1)}
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              Tu recepcionista{' '}
              <span style={{ color: 'var(--accent)' }}>que nunca duerme.</span>
              <br />
              Tu clínica{' '}
              <span style={{ color: 'var(--accent)' }}>nunca pierde pacientes.</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              {...fadeUp(0.2)}
              className="max-w-xl text-lg sm:text-xl leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              Welko, es un recepcionista virtual con IA que agenda citas, responde
              consultas y atiende a tus pacientes 24/7. Diseñado para Clínicas
              de Salud y Estética.
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
            PRECIOS
        ════════════════════════════════════════ */}
        <PricingSection />

      </main>

      {/* ── Footer ── */}
      <footer
        className="py-8 px-4 text-center text-xs"
        style={{ color: 'var(--text-muted)', borderTop: '1px solid var(--border)' }}
      >
        © {new Date().getFullYear()} Welko — El recepcionista IA líder para Clínicas Estéticas, Dentales y de Salud.
      </footer>
    </>
  )
}

/* ─── Data ─── */

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
