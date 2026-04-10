'use client'

import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { useLang } from '@/contexts/LangContext'

const NAVY  = '#1A2A56'
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

/* ── Comparison rows ── */
const ROWS_ES = [
  {
    feature:  'Visibilidad de marca',
    passive:  'Tú eres un ítem más en una lista',
    welko:    'Tu marca propia, tu WhatsApp, tu identidad',
    welkoWin: true,
  },
  {
    feature:  'Tiempo de respuesta',
    passive:  '12–48 horas promedio (si responden)',
    welko:    '< 2 segundos, cualquier hora, cualquier día',
    welkoWin: true,
  },
  {
    feature:  'Modelo de negocio',
    passive:  'Pagas por visibilidad, sin garantía de cita',
    welko:    'Infraestructura propia, ROI medible desde día 1',
    welkoWin: true,
  },
  {
    feature:  'Propiedad de datos',
    passive:  'Los datos del paciente son del directorio',
    welko:    'Todos los datos son tuyos, siempre',
    welkoWin: true,
  },
  {
    feature:  'Canales de contacto',
    passive:  'Solo formulario del directorio',
    welko:    'WhatsApp + Instagram + Web + Llamadas',
    welkoWin: true,
  },
  {
    feature:  'Persuasión y cierre',
    passive:  'El paciente decide solo, sin guía',
    welko:    'IA que persuade, resuelve dudas y cierra la cita',
    welkoWin: true,
  },
  {
    feature:  'Dependencia',
    passive:  'Rehén de la plataforma y sus precios',
    welko:    'Cero dependencia — cancela cuando quieras',
    welkoWin: true,
  },
]

const ROWS_EN = [
  {
    feature:  'Brand visibility',
    passive:  "You're just one item in a list",
    welko:    'Your own brand, your WhatsApp, your identity',
    welkoWin: true,
  },
  {
    feature:  'Response time',
    passive:  '12–48 hours on average (if they respond)',
    welko:    '< 2 seconds, any hour, any day',
    welkoWin: true,
  },
  {
    feature:  'Business model',
    passive:  'Pay for visibility, no appointment guarantee',
    welko:    'Own infrastructure, measurable ROI from day 1',
    welkoWin: true,
  },
  {
    feature:  'Data ownership',
    passive:  "Patient data belongs to the directory",
    welko:    'All data is yours, always',
    welkoWin: true,
  },
  {
    feature:  'Contact channels',
    passive:  'Directory form only',
    welko:    'WhatsApp + Instagram + Web + Calls',
    welkoWin: true,
  },
  {
    feature:  'Persuasion & closing',
    passive:  'Patient decides alone, no guidance',
    welko:    'AI that persuades, resolves doubts, closes the booking',
    welkoWin: true,
  },
  {
    feature:  'Dependency',
    passive:  'Hostage to the platform and its pricing',
    welko:    'Zero dependency — cancel anytime',
    welkoWin: true,
  },
]

/* ── Money leak funnel data ── */
const FUNNEL_ES = [
  { label: 'Pacientes que te buscan online',    value: 100, color: NAVY },
  { label: 'Llegan a un directorio pasivo',      value: 80,  color: '#2B3F7A' },
  { label: 'Ven tu perfil',                      value: 45,  color: '#3B52A0' },
  { label: 'Intentan contactarte',               value: 28,  color: '#EF4444' },
  { label: 'Reciben respuesta rápida',           value: 9,   color: '#DC2626' },
  { label: 'Agendan cita',                       value: 6,   color: '#B91C1C' },
]

const FUNNEL_WELKO_ES = [
  { label: 'Pacientes que te buscan online',    value: 100, color: NAVY },
  { label: 'Contactan por WhatsApp / Instagram', value: 94,  color: '#1D3461' },
  { label: 'Reciben respuesta en <2 seg',        value: 94,  color: '#1E3A8A' },
  { label: 'IA resuelve dudas y persuade',       value: 87,  color: '#1A4FBB' },
  { label: 'Agendan cita',                       value: 67,  color: '#1A5FCC' },
]

export function VsDirectoriosSection() {
  const { lang } = useLang()
  const rows = lang === 'es' ? ROWS_ES : ROWS_EN
  const funnelPassive = FUNNEL_ES
  const funnelWelko   = FUNNEL_WELKO_ES

  return (
    <section
      id="vs-directorios"
      className="py-16 sm:py-24 px-4 sm:px-6"
      style={{ background: 'var(--bg-secondary)' }}
    >
      <div className="max-w-5xl mx-auto flex flex-col gap-14">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE }}
          className="flex flex-col items-center text-center gap-3"
        >
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--accent-label)' }}>
            {lang === 'es' ? 'La diferencia que importa' : 'The difference that matters'}
          </span>
          <h2 className="text-xl sm:text-3xl font-bold tracking-tight max-w-2xl" style={{ color: 'var(--text-primary)' }}>
            {lang === 'es'
              ? 'Los directorios te dan visibilidad. Welko te da pacientes.'
              : 'Directories give you visibility. Welko gives you patients.'}
          </h2>
          <p className="text-sm max-w-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {lang === 'es'
              ? 'Pagar por aparecer en una lista no es una estrategia. Es solo esperar a que el paciente te elija sobre tu competencia, sin dar ninguna ventaja.'
              : "Paying to appear in a list isn't a strategy. It's just waiting for the patient to choose you over your competition — with no advantage."}
          </p>
        </motion.div>

        {/* ── Funnel / Money Leak ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.55, ease: EASE }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {/* Passive funnel */}
          <div
            className="rounded-3xl p-6 sm:p-7 flex flex-col gap-5"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-center gap-2">
              <span style={{
                fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em',
                padding: '3px 10px', borderRadius: 99,
                background: '#FEE2E2', color: '#B91C1C',
              }}>
                {lang === 'es' ? 'Directorio pasivo' : 'Passive directory'}
              </span>
            </div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {lang === 'es'
                ? '94 de cada 100 pacientes potenciales se pierden'
                : '94 out of 100 potential patients are lost'}
            </p>
            <div className="flex flex-col gap-2.5">
              {funnelPassive.map((f, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{f.label}</span>
                    <span className="text-xs font-bold" style={{ color: i > 2 ? '#EF4444' : 'var(--text-primary)' }}>
                      {f.value}%
                    </span>
                  </div>
                  <div style={{ height: 6, borderRadius: 99, background: 'var(--border)', overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${f.value}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.08 }}
                      style={{ height: '100%', background: i > 2 ? '#EF4444' : f.color, borderRadius: 99 }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div style={{
              padding: '10px 14px', borderRadius: 12,
              background: '#FEF2F2', border: '1px solid #FECACA',
            }}>
              <p className="text-xs font-bold" style={{ color: '#B91C1C' }}>
                {lang === 'es'
                  ? 'Solo el 6% convierte. El 94% restante se fue a la competencia.'
                  : 'Only 6% converts. The other 94% went to your competition.'}
              </p>
            </div>
          </div>

          {/* Welko funnel */}
          <div
            className="rounded-3xl p-6 sm:p-7 flex flex-col gap-5"
            style={{ background: NAVY, color: '#FFFFFF' }}
          >
            <div className="flex items-center gap-2">
              <span style={{
                fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em',
                padding: '3px 10px', borderRadius: 99,
                background: 'rgba(255,255,255,0.18)', color: '#fff',
              }}>
                Welko
              </span>
            </div>
            <p className="text-sm font-semibold">
              {lang === 'es'
                ? '67 de cada 100 contactos se convierten en citas'
                : '67 out of 100 contacts become appointments'}
            </p>
            <div className="flex flex-col gap-2.5">
              {funnelWelko.map((f, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>{f.label}</span>
                    <span className="text-xs font-bold" style={{ color: '#fff' }}>{f.value}%</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 99, background: 'rgba(255,255,255,0.12)', overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${f.value}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.08 }}
                      style={{ height: '100%', background: 'rgba(255,255,255,0.85)', borderRadius: 99 }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div style={{
              padding: '10px 14px', borderRadius: 12,
              background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
            }}>
              <p className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.9)' }}>
                {lang === 'es'
                  ? '10× más citas que un directorio pasivo. ROI desde el día 1.'
                  : '10× more appointments than a passive directory. ROI from day 1.'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Comparison table ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.55, ease: EASE }}
          className="rounded-3xl overflow-hidden"
          style={{ border: '1px solid var(--border)' }}
        >
          {/* Table header */}
          <div
            className="grid"
            style={{
              gridTemplateColumns: '1fr 1fr 1fr',
              background: 'var(--surface)',
              borderBottom: '1px solid var(--border)',
              padding: '14px 20px',
            }}
          >
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              {lang === 'es' ? 'Criterio' : 'Criteria'}
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-center" style={{ color: 'var(--text-muted)' }}>
              {lang === 'es' ? 'Directorio pasivo' : 'Passive directory'}
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-center" style={{ color: 'var(--accent-label)' }}>
              Welko ✦
            </span>
          </div>

          {rows.map((row, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.3, ease: EASE, delay: i * 0.05 }}
              className="grid"
              style={{
                gridTemplateColumns: '1fr 1fr 1fr',
                padding: '14px 20px',
                background: i % 2 === 0 ? 'var(--surface)' : 'var(--bg-secondary)',
                borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : 'none',
                alignItems: 'start',
                gap: 12,
              }}
            >
              <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                {row.feature}
              </span>
              <div className="flex items-start gap-2">
                <X size={12} color="#EF4444" style={{ flexShrink: 0, marginTop: 2 }} />
                <span className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {row.passive}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Check size={12} color={NAVY} style={{ flexShrink: 0, marginTop: 2 }} />
                <span className="text-xs leading-relaxed font-medium" style={{ color: 'var(--text-primary)' }}>
                  {row.welko}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Bottom CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.45, ease: EASE }}
          className="flex flex-col items-center text-center gap-4"
        >
          <p className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
            {lang === 'es'
              ? 'Deja de pagar por visibilidad. Empieza a pagar por resultados.'
              : 'Stop paying for visibility. Start paying for results.'}
          </p>
          <a
            href="/precios"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-opacity duration-150"
            style={{ background: NAVY, color: '#fff', textDecoration: 'none' }}
            onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.opacity = '0.88')}
            onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.opacity = '1')}
          >
            {lang === 'es' ? 'Ver planes Welko' : 'See Welko plans'} →
          </a>
        </motion.div>

      </div>
    </section>
  )
}
