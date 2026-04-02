'use client'

import { motion } from 'framer-motion'
import { useLang } from '@/contexts/LangContext'

const NAVY  = '#1A2A56'
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const TASKS_AI = [
  { es: 'Contestar mensajes repetitivos', en: 'Answering repetitive messages' },
  { es: 'Confirmar citas 24/7',           en: 'Confirming appointments 24/7' },
  { es: 'Responder precios y horarios',   en: 'Answering pricing & hours' },
  { es: 'Enviar recordatorios',           en: 'Sending reminders' },
  { es: 'Gestionar cancelaciones',        en: 'Managing cancellations' },
  { es: 'Seguimiento post-consulta',      en: 'Post-visit follow-up' },
]

const TASKS_HUMAN = [
  { es: 'Calidez y empatía con el paciente', en: 'Warmth & empathy with patients' },
  { es: 'Diagnóstico y tratamiento',         en: 'Diagnosis & treatment' },
  { es: 'Experiencia en clínica',            en: 'In-clinic experience' },
  { es: 'Fidelización y confianza',          en: 'Loyalty & trust building' },
  { es: 'Decisiones clínicas complejas',     en: 'Complex clinical decisions' },
]

export function HumanTalentSection() {
  const { lang } = useLang()

  return (
    <section
      className="py-16 sm:py-24 px-4 sm:px-6"
      style={{ background: 'var(--bg)' }}
    >
      <div className="max-w-5xl mx-auto flex flex-col gap-12">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE }}
          className="flex flex-col items-center text-center gap-3"
        >
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--accent-label)' }}>
            {lang === 'es' ? 'Tu equipo, potenciado' : 'Your team, amplified'}
          </span>
          <h2 className="text-xl sm:text-3xl font-bold tracking-tight max-w-2xl" style={{ color: 'var(--text-primary)' }}>
            {lang === 'es'
              ? 'Potencia tu talento humano'
              : 'Amplify your human talent'}
          </h2>
          <p className="text-sm sm:text-base max-w-xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {lang === 'es'
              ? 'La IA absorbe el 100% de la carga operativa repetitiva. Tu equipo deja de ser esclavo de las líneas ocupadas y vuelve a hacer lo que ninguna IA puede: conectar con el paciente.'
              : 'AI absorbs 100% of repetitive operational load. Your team stops being a slave to busy lines and gets back to doing what no AI can: connecting with patients.'}
          </p>
        </motion.div>

        {/* ── Two columns ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          {/* AI side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE }}
            className="rounded-3xl p-6 sm:p-8 flex flex-col gap-5"
            style={{ background: NAVY, color: '#FFFFFF' }}
          >
            {/* Robot icon */}
            <div className="flex items-center gap-3">
              <div style={{
                width: 44, height: 44, borderRadius: 13,
                background: 'rgba(255,255,255,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22,
              }}>
                🤖
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Welko IA
                </p>
                <p className="text-sm font-semibold">
                  {lang === 'es' ? 'Maneja la carga operativa' : 'Handles operational load'}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              {TASKS_AI.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.35, ease: EASE, delay: i * 0.06 }}
                  className="flex items-center gap-3"
                >
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <span style={{ fontSize: 10, color: '#fff' }}>✓</span>
                  </div>
                  <span className="text-sm" style={{ color: 'rgba(255,255,255,0.85)' }}>
                    {lang === 'es' ? t.es : t.en}
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="pt-4 mt-auto" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {lang === 'es'
                  ? '⚡ Activo 24/7 · Responde en menos de 2 segundos'
                  : '⚡ Active 24/7 · Responds in under 2 seconds'}
              </p>
            </div>
          </motion.div>

          {/* Human side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
            className="rounded-3xl p-6 sm:p-8 flex flex-col gap-5"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-center gap-3">
              <div style={{
                width: 44, height: 44, borderRadius: 13,
                background: 'var(--bg-secondary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22,
              }}>
                🩺
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--accent-label)' }}>
                  {lang === 'es' ? 'Tu equipo' : 'Your team'}
                </p>
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {lang === 'es' ? 'Se enfoca en lo que importa' : 'Focuses on what matters'}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              {TASKS_HUMAN.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.35, ease: EASE, delay: i * 0.06 }}
                  className="flex items-center gap-3"
                >
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%',
                    background: NAVY + '12',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <span style={{ fontSize: 10, color: NAVY }}>✦</span>
                  </div>
                  <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                    {lang === 'es' ? t.es : t.en}
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="pt-4 mt-auto" style={{ borderTop: '1px solid var(--border)' }}>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {lang === 'es'
                  ? '💡 Clínicas más ágiles, eficientes y rentables — sin sacrificar la calidad humana'
                  : '💡 More agile, efficient, and profitable clinics — without sacrificing human quality'}
              </p>
            </div>
          </motion.div>
        </div>

        {/* ── Bottom stat strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE }}
          className="grid grid-cols-3 gap-4 sm:gap-6"
        >
          {[
            { value: '100%', label: lang === 'es' ? 'de mensajes respondidos' : 'of messages answered' },
            { value: '-60%', label: lang === 'es' ? 'tiempo en tareas admin' : 'time on admin tasks' },
            { value: '+40%', label: lang === 'es' ? 'citas agendadas al mes' : 'appointments per month' },
          ].map((s, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-1">
              <p className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: NAVY }}>
                {s.value}
              </p>
              <p className="text-xs leading-snug max-w-[120px]" style={{ color: 'var(--text-secondary)' }}>
                {s.label}
              </p>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
