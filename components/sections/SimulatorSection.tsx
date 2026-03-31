'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ArrowRight, Sparkles, RotateCcw } from 'lucide-react'
import Link from 'next/link'

const NAVY  = '#1A2A56'
const NAVY2 = '#2B3F7A'
const WHITE = '#FFFFFF'
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

/* ── Specialty data ── */
const SPECIALTIES = [
  { slug: 'dental',       label: 'Dental',       emoji: '🦷', accent: '#3B82F6' },
  { slug: 'psicologia',   label: 'Psicología',   emoji: '🧠', accent: '#8B5CF6' },
  { slug: 'estetica',     label: 'Estética',     emoji: '✨', accent: '#EC4899' },
  { slug: 'nutricion',    label: 'Nutrición',    emoji: '🥗', accent: '#16A34A' },
  { slug: 'ginecologia',  label: 'Ginecología',  emoji: '🌸', accent: '#F472B6' },
  { slug: 'oftalmologia', label: 'Oftalmología', emoji: '👁️', accent: '#6366F1' },
  { slug: 'medica',       label: 'Medicina Gral',emoji: '🩺', accent: '#0EA5E9' },
  { slug: 'fisioterapia', label: 'Fisioterapia', emoji: '💪', accent: '#0EA5E9' },
  { slug: 'spa',          label: 'Spa & Bienestar', emoji: '💆', accent: '#A78BFA' },
  { slug: 'quiropractica',label: 'Quiropráctica',emoji: '🔧', accent: '#10B981' },
]

const PAINS = [
  { id: 'lost_calls',   label: 'Llamadas y mensajes perdidos', emoji: '📞' },
  { id: 'messy_agenda', label: 'Agenda desordenada',           emoji: '📅' },
  { id: 'admin',        label: 'Demasiada tarea administrativa',emoji: '📋' },
  { id: 'noshow',       label: 'Pacientes que no se presentan', emoji: '🚫' },
  { id: 'after_hours',  label: 'Consultas fuera de horario',    emoji: '🌙' },
]

const AUTOMATIONS = [
  { id: 'scheduling',     label: 'Agendamiento de citas',        emoji: '📆' },
  { id: 'confirmations',  label: 'Confirmaciones automáticas',   emoji: '✅' },
  { id: 'crm',            label: 'CRM y seguimiento de pacientes',emoji: '🧩' },
  { id: 'reminders',      label: 'Recordatorios y seguimientos', emoji: '🔔' },
  { id: 'info_queries',   label: 'Responder preguntas frecuentes',emoji: '💬' },
]

/* ── Smart result generator ── */
function getResult(slug: string, pain: string, automation: string) {
  const spec = SPECIALTIES.find(s => s.slug === slug)!
  const painLabel = PAINS.find(p => p.id === pain)?.label ?? pain
  const autoLabel = AUTOMATIONS.find(a => a.id === automation)?.label ?? automation

  const solutions: Record<string, string> = {
    lost_calls:   'responder el 100% de los mensajes en menos de 2 segundos, sin importar la hora',
    messy_agenda: 'organizar tu agenda automáticamente, eliminando huecos y conflictos de horario',
    admin:        'manejar las tareas repetitivas: confirmaciones, recordatorios y preguntas frecuentes',
    noshow:       'reducir los no-shows en un 40% con recordatorios persuasivos por WhatsApp',
    after_hours:  'atender pacientes a cualquier hora, incluso cuando tu consultorio está cerrado',
  }
  const autoDetails: Record<string, string> = {
    scheduling:    'agenda citas en tiempo real directamente en tu calendario',
    confirmations: 'confirma asistencias automáticamente sin que levantes un dedo',
    crm:           'registra y da seguimiento a cada paciente con inteligencia artificial',
    reminders:     'envía recordatorios personalizados que aumentan la tasa de asistencia',
    info_queries:  'responde preguntas sobre precios, tratamientos y horarios 24/7',
  }

  return {
    specialty: spec.label,
    emoji: spec.emoji,
    accent: spec.accent,
    painSolved: solutions[pain] ?? `resolver ${painLabel}`,
    autoDetail: autoDetails[automation] ?? autoLabel,
    revenue: Math.floor(Math.random() * 30000 + 15000),
    saving: Math.floor(Math.random() * 15 + 8),
  }
}

interface Step {
  title: string
  subtitle: string
}

const STEPS: Step[] = [
  { title: '¿Cuál es tu especialidad?', subtitle: 'Welko se entrena específicamente para cada rama médica.' },
  { title: '¿Cuál es tu mayor problema?', subtitle: 'Identifica el cuello de botella en tu clínica.' },
  { title: '¿Qué quieres automatizar primero?', subtitle: 'Elige el área de mayor impacto para ti.' },
]

export function SimulatorSection() {
  const [step, setStep] = useState(0)
  const [specialty, setSpecialty] = useState<string | null>(null)
  const [pain, setPain] = useState<string | null>(null)
  const [automation, setAutomation] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [direction, setDirection] = useState(1)

  function reset() {
    setStep(0); setSpecialty(null); setPain(null); setAutomation(null); setDone(false)
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

  const progress = done ? 100 : (step / 3) * 100

  return (
    <section id="simulador" className="py-16 sm:py-24 px-4 sm:px-6" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE }}
          className="flex flex-col items-center text-center gap-3 mb-10"
        >
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--accent-label)' }}>
            Simulador Welko
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Descubre en 30 segundos cómo Welko<br className="hidden sm:block" /> se adaptaría a tu clínica
          </h2>
          <p className="text-sm max-w-md" style={{ color: 'var(--text-secondary)' }}>
            Sin registro. Sin tarjeta. Solo responde 3 preguntas.
          </p>
        </motion.div>

        {/* Card */}
        <div
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
                        Resultado para {result.specialty}
                      </p>
                      <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                        ¡Perfecto! Welko se adaptaría así a tu clínica
                      </h3>
                    </div>
                  </div>

                  {/* Main benefit card */}
                  <div
                    className="rounded-2xl p-5 sm:p-6"
                    style={{ background: NAVY, color: WHITE }}
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <Sparkles size={18} style={{ flexShrink: 0, marginTop: 2, color: result.accent }} />
                      <p className="text-sm leading-relaxed font-medium">
                        Para una clínica de <strong>{result.specialty}</strong>, Welko IA se encargaría de{' '}
                        <span style={{ color: result.accent }}>{result.painSolved}</span>
                        {' '}mientras{' '}
                        <span style={{ color: result.accent }}>{result.autoDetail}</span>.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4" style={{ borderTop: `1px solid rgba(255,255,255,0.12)` }}>
                      <div>
                        <p className="text-2xl font-black">${result.revenue.toLocaleString('es-MX')}</p>
                        <p className="text-xs opacity-60">MXN recuperables al mes</p>
                      </div>
                      <div>
                        <p className="text-2xl font-black">{result.saving}h</p>
                        <p className="text-xs opacity-60">de trabajo administrativo ahorradas/semana</p>
                      </div>
                    </div>
                  </div>

                  {/* 3 micro-features */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { icon: '⚡', title: 'Activo en 24h', desc: 'Sin instalaciones ni contratos' },
                      { icon: '🔒', title: 'Datos protegidos', desc: 'Cifrado AES-256, LFPDPPP' },
                      { icon: '📊', title: 'ROI desde día 1', desc: 'Métricas en tiempo real' },
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
                      href="/contacto"
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
              ) : (
                /* ── Question steps ── */
                <motion.div
                  key={`step-${step}`}
                  initial={{ x: direction * 32, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: direction * -32, opacity: 0 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="flex flex-col gap-6"
                >
                  {/* Step indicator */}
                  <div className="flex items-center gap-2">
                    {STEPS.map((_, i) => (
                      <div key={i} style={{
                        height: 4, flex: 1, borderRadius: 99,
                        background: i <= step ? NAVY : 'var(--border)',
                        transition: 'background 0.3s',
                      }} />
                    ))}
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
                      Paso {step + 1} de 3
                    </p>
                    <h3 className="text-lg sm:text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                      {STEPS[step].title}
                    </h3>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                      {STEPS[step].subtitle}
                    </p>
                  </div>

                  {/* Step 0: Specialties grid */}
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
                            background: pain === p.id ? NAVY + '08' : 'var(--bg-secondary)',
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
                            background: automation === a.id ? NAVY + '08' : 'var(--bg-secondary)',
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
        </div>
      </div>
    </section>
  )
}
