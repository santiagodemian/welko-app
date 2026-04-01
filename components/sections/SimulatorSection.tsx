'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ArrowRight, Sparkles, RotateCcw, Play } from 'lucide-react'
import Link from 'next/link'

const NAVY  = '#1A2A56'
const NAVY2 = '#2B3F7A'
const WHITE = '#FFFFFF'
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

/* ── Specialty data ── */
const SPECIALTIES = [
  { slug: 'dental',       label: 'Dental',          emoji: '🦷', accent: '#3B82F6' },
  { slug: 'psicologia',   label: 'Psicología',      emoji: '🧠', accent: '#8B5CF6' },
  { slug: 'estetica',     label: 'Estética',        emoji: '✨', accent: '#EC4899' },
  { slug: 'nutricion',    label: 'Nutrición',       emoji: '🥗', accent: '#16A34A' },
  { slug: 'ginecologia',  label: 'Ginecología',     emoji: '🌸', accent: '#F472B6' },
  { slug: 'oftalmologia', label: 'Oftalmología',    emoji: '👁️', accent: '#6366F1' },
  { slug: 'medica',       label: 'Medicina Gral',   emoji: '🩺', accent: '#0EA5E9' },
  { slug: 'fisioterapia', label: 'Fisioterapia',    emoji: '💪', accent: '#0EA5E9' },
  { slug: 'spa',          label: 'Spa & Bienestar', emoji: '💆', accent: '#A78BFA' },
  { slug: 'quiropractica',label: 'Quiropráctica',   emoji: '🔧', accent: '#10B981' },
]

const PAINS = [
  { id: 'lost_calls',   label: 'Llamadas y mensajes sin responder', emoji: '📞' },
  { id: 'messy_agenda', label: 'Agenda caótica, huecos y conflictos', emoji: '📅' },
  { id: 'admin',        label: 'Horas perdidas en tareas repetitivas', emoji: '📋' },
  { id: 'noshow',       label: 'Pacientes que agendan y no llegan',    emoji: '🚫' },
  { id: 'after_hours',  label: 'Consultas que llegan fuera de horario', emoji: '🌙' },
]

const AUTOMATIONS = [
  { id: 'scheduling',     label: 'Agendamiento de citas 24/7',         emoji: '📆' },
  { id: 'confirmations',  label: 'Confirmaciones automáticas',         emoji: '✅' },
  { id: 'crm',            label: 'CRM y seguimiento de pacientes',     emoji: '🧩' },
  { id: 'reminders',      label: 'Recordatorios que evitan no-shows',  emoji: '🔔' },
  { id: 'info_queries',   label: 'Responder preguntas frecuentes',     emoji: '💬' },
]

/* ── Smart result generator ── */
function getResult(slug: string, pain: string, automation: string) {
  const spec = SPECIALTIES.find(s => s.slug === slug)!
  const painLabel = PAINS.find(p => p.id === pain)?.label ?? pain
  const autoLabel = AUTOMATIONS.find(a => a.id === automation)?.label ?? automation

  const solutions: Record<string, string> = {
    lost_calls:   'contestar el 100% de los mensajes en menos de 2 segundos, sin importar la hora ni el día',
    messy_agenda: 'organizar tu agenda automáticamente, llenando los huecos y evitando conflictos de citas',
    admin:        'encargarse de las tareas repetitivas: confirmaciones, recordatorios y preguntas frecuentes',
    noshow:       'reducir los no-shows hasta un 40% con recordatorios persuasivos por WhatsApp antes de cada cita',
    after_hours:  'atender y agendar pacientes a cualquier hora, incluso cuando tu consultorio está cerrado',
  }
  const autoDetails: Record<string, string> = {
    scheduling:    'agenda citas en tiempo real directo en tu calendario, sin que muevas un dedo',
    confirmations: 'confirma asistencias automáticamente vía WhatsApp con tasa de respuesta >85%',
    crm:           'registra, categoriza y da seguimiento a cada paciente con inteligencia artificial',
    reminders:     'envía recordatorios personalizados que disparan la tasa de asistencia',
    info_queries:  'responde precios, tratamientos y horarios en menos de 2 segundos, 24/7',
  }

  // Deterministic numbers based on inputs (no random flicker on re-render)
  const painIdx = PAINS.findIndex(p => p.id === pain)
  const autoIdx = AUTOMATIONS.findIndex(a => a.id === automation)
  const revenue = 18000 + (painIdx * 4200) + (autoIdx * 2800)
  const saving  = 9 + painIdx + autoIdx

  return {
    specialty: spec.label,
    emoji: spec.emoji,
    accent: spec.accent,
    painSolved: solutions[pain] ?? `resolver ${painLabel}`,
    autoDetail: autoDetails[automation] ?? autoLabel,
    revenue,
    saving,
  }
}

const STEP_COPY = [
  {
    title: '¿Qué tipo de clínica tienes?',
    subtitle: 'Welko entrena su IA de forma diferente para cada especialidad.',
  },
  {
    title: '¿Qué te quita el sueño hoy?',
    subtitle: 'Sé honesto — vamos a atacar el problema exacto.',
  },
  {
    title: '¿Por dónde arrancamos?',
    subtitle: 'Elige el área que más impacto tendría para ti mañana.',
  },
]

export function SimulatorSection() {
  const [started, setStarted]       = useState(false)
  const [step, setStep]             = useState(0)
  const [specialty, setSpecialty]   = useState<string | null>(null)
  const [pain, setPain]             = useState<string | null>(null)
  const [automation, setAutomation] = useState<string | null>(null)
  const [done, setDone]             = useState(false)
  const [direction, setDirection]   = useState(1)

  function reset() {
    setStarted(false); setStep(0)
    setSpecialty(null); setPain(null); setAutomation(null); setDone(false)
  }

  function next(val: string) {
    setDirection(1)
    if (step === 0) { setSpecialty(val); setStep(1) }
    else if (step === 1) { setPain(val); setStep(2) }
    else if (step === 2) { setAutomation(val); setDone(true) }
  }

  const result = done && specialty && pain && automation
    ? getResult(specialty, pain, automation)
    : null

  const progress = !started ? 0 : done ? 100 : (step / 3) * 100

  return (
    <section id="simulador" className="py-16 sm:py-24 px-4 sm:px-6" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-3xl mx-auto">

        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE }}
          className="flex flex-col items-center text-center gap-3 mb-10"
        >
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--accent-label)' }}>
            Simulador
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Imagina Welko en tu clínica<br className="hidden sm:block" /> antes de comprarlo
          </h2>
          <p className="text-sm max-w-sm" style={{ color: 'var(--text-secondary)' }}>
            3 preguntas · 30 segundos · sin registro ni tarjeta
          </p>
        </motion.div>

        {/* ── Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.55, ease: EASE, delay: 0.1 }}
          className="rounded-3xl overflow-hidden"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            boxShadow: '0 8px 40px rgba(26,42,86,0.10)',
          }}
        >
          {/* Progress bar */}
          <div style={{ height: 3, background: 'var(--border)' }}>
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              style={{ height: '100%', background: NAVY, borderRadius: 9999 }}
            />
          </div>

          <div className="p-6 sm:p-8">
            <AnimatePresence mode="wait">

              {/* ── Intro screen ── */}
              {!started && !done && (
                <motion.div
                  key="intro"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="flex flex-col items-center text-center gap-6 py-4"
                >
                  {/* Emoji row */}
                  <div className="flex items-center gap-3">
                    {['🦷','🧠','✨','🩺','💆'].map((e, i) => (
                      <motion.span
                        key={e}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07, duration: 0.35, ease: EASE }}
                        style={{
                          fontSize: i === 2 ? 32 : 22,
                          filter: i !== 2 ? 'grayscale(0.5) opacity(0.6)' : undefined,
                          transform: i === 2 ? 'scale(1.2)' : undefined,
                        }}
                      >
                        {e}
                      </motion.span>
                    ))}
                  </div>

                  <div className="flex flex-col gap-2 max-w-xs">
                    <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                      ¿Cómo quedaría Welko en tu clínica?
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      Responde 3 preguntas y te mostramos exactamente qué automatizaría y cuánto dinero recuperarías.
                    </p>
                  </div>

                  {/* Start badges */}
                  <div className="flex flex-wrap justify-center gap-2">
                    {['Sin registro', 'Sin tarjeta', '30 segundos'].map(b => (
                      <span key={b} className="text-xs font-medium px-3 py-1.5 rounded-full"
                        style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
                      >
                        {b}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => setStarted(true)}
                    className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200"
                    style={{ background: NAVY, color: WHITE, border: 'none', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget.style.background = NAVY2)}
                    onMouseLeave={e => (e.currentTarget.style.background = NAVY)}
                  >
                    <Play size={14} fill={WHITE} />
                    Ver cómo quedaría en mi clínica
                  </button>
                </motion.div>
              )}

              {/* ── Result screen ── */}
              {done && result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="flex flex-col gap-6"
                >
                  {/* Header result */}
                  <div className="flex items-center gap-3">
                    <div style={{
                      width: 48, height: 48, borderRadius: 14, background: result.accent + '18',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0,
                    }}>
                      {result.emoji}
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: result.accent }}>
                        Así quedaría para {result.specialty}
                      </p>
                      <h3 className="text-lg font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
                        Tu clínica con Welko se vería así
                      </h3>
                    </div>
                  </div>

                  {/* Main benefit card */}
                  <div className="rounded-2xl p-5 sm:p-6" style={{ background: NAVY, color: WHITE }}>
                    <div className="flex items-start gap-3 mb-4">
                      <Sparkles size={18} style={{ flexShrink: 0, marginTop: 2, color: result.accent }} />
                      <p className="text-sm leading-relaxed font-medium">
                        Tu recepcionista IA de <strong>{result.specialty}</strong> se encargaría de{' '}
                        <span style={{ color: result.accent }}>{result.painSolved}</span>
                        {' '}y además{' '}
                        <span style={{ color: result.accent }}>{result.autoDetail}</span>.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4" style={{ borderTop: 'rgba(255,255,255,0.12) solid 1px' }}>
                      <div>
                        <p className="text-2xl font-black">${result.revenue.toLocaleString('es-MX')}</p>
                        <p className="text-xs opacity-60">MXN recuperables al mes</p>
                      </div>
                      <div>
                        <p className="text-2xl font-black">{result.saving}h</p>
                        <p className="text-xs opacity-60">de trabajo administrativo ahorradas / semana</p>
                      </div>
                    </div>
                  </div>

                  {/* 3 micro-features */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { icon: '⚡', title: 'Activo en 24h', desc: 'Sin instalaciones ni contratos largos' },
                      { icon: '🔒', title: 'Datos protegidos', desc: 'Cifrado AES-256, LFPDPPP' },
                      { icon: '📊', title: 'ROI desde día 1', desc: 'Métricas en tiempo real en tu dashboard' },
                    ].map((item) => (
                      <div key={item.title} style={{
                        background: 'var(--bg-secondary)', borderRadius: 12,
                        padding: '12px 14px', border: '1px solid var(--border)',
                      }}>
                        <p style={{ fontSize: 18, marginBottom: 4 }}>{item.icon}</p>
                        <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{item.title}</p>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
                      </div>
                    ))}
                  </div>

                  {/* CTAs */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      href="/registro"
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold"
                      style={{ background: NAVY, color: WHITE }}
                    >
                      Quiero esto para mi clínica
                      <ArrowRight size={15} />
                    </Link>
                    <Link
                      href="/precios"
                      className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-sm font-medium"
                      style={{ border: '1.5px solid var(--border)', color: 'var(--text-primary)' }}
                    >
                      Ver planes y precios
                    </Link>
                  </div>

                  <button
                    onClick={reset}
                    className="flex items-center justify-center gap-2 text-xs mx-auto"
                    style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    <RotateCcw size={12} />
                    Volver a empezar
                  </button>
                </motion.div>
              ) : null}

              {/* ── Question steps ── */}
              {started && !done && (
                <motion.div
                  key={`step-${step}`}
                  initial={{ x: direction * 32, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: direction * -32, opacity: 0 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="flex flex-col gap-6"
                >
                  {/* Step progress dots */}
                  <div className="flex items-center gap-2">
                    {STEP_COPY.map((_, i) => (
                      <div key={i} style={{
                        height: 4, flex: 1, borderRadius: 99,
                        background: i <= step ? NAVY : 'var(--border)',
                        transition: 'background 0.3s',
                      }} />
                    ))}
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: 'var(--accent-label)' }}>
                      {step + 1} de 3
                    </p>
                    <h3 className="text-lg sm:text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                      {STEP_COPY[step].title}
                    </h3>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                      {STEP_COPY[step].subtitle}
                    </p>
                  </div>

                  {/* Step 0: Specialty grid */}
                  {step === 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {SPECIALTIES.map((sp) => (
                        <button
                          key={sp.slug}
                          onClick={() => next(sp.slug)}
                          className="flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-150"
                          style={{
                            border: '1.5px solid var(--border)',
                            background: specialty === sp.slug ? sp.accent + '14' : 'var(--bg-secondary)',
                            cursor: 'pointer',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.borderColor = sp.accent)}
                          onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                        >
                          <span style={{ fontSize: 22 }}>{sp.emoji}</span>
                          <span className="text-xs font-semibold text-center leading-tight" style={{ color: 'var(--text-primary)' }}>
                            {sp.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Step 1: Pain points */}
                  {step === 1 && (
                    <div className="flex flex-col gap-2">
                      {PAINS.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => next(p.id)}
                          className="flex items-center gap-4 p-4 rounded-2xl text-left transition-all duration-150"
                          style={{
                            border: '1.5px solid var(--border)',
                            background: 'var(--bg-secondary)',
                            cursor: 'pointer',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = NAVY; e.currentTarget.style.background = NAVY + '06' }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-secondary)' }}
                        >
                          <span style={{ fontSize: 20, flexShrink: 0 }}>{p.emoji}</span>
                          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{p.label}</span>
                          <ChevronRight size={14} style={{ marginLeft: 'auto', color: 'var(--text-muted)', flexShrink: 0 }} />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Step 2: Automations */}
                  {step === 2 && (
                    <div className="flex flex-col gap-2">
                      {AUTOMATIONS.map((a) => (
                        <button
                          key={a.id}
                          onClick={() => next(a.id)}
                          className="flex items-center gap-4 p-4 rounded-2xl text-left transition-all duration-150"
                          style={{
                            border: '1.5px solid var(--border)',
                            background: 'var(--bg-secondary)',
                            cursor: 'pointer',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = NAVY; e.currentTarget.style.background = NAVY + '06' }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-secondary)' }}
                        >
                          <span style={{ fontSize: 20, flexShrink: 0 }}>{a.emoji}</span>
                          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{a.label}</span>
                          <ChevronRight size={14} style={{ marginLeft: 'auto', color: 'var(--text-muted)', flexShrink: 0 }} />
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
