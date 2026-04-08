'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ArrowRight, Sparkles, RotateCcw, Play, Send, Loader2 } from 'lucide-react'
import Link from 'next/link'

const NAVY  = '#1A2A56'
const NAVY2 = '#2B3F7A'
const WHITE = '#FFFFFF'
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

interface ChatMessage { role: 'user' | 'assistant'; content: string }

const SPECIALTIES = [
  { slug: 'dental',        label: 'Dental',          emoji: '🦷', accent: '#3B82F6' },
  { slug: 'psicologia',    label: 'Psicología',      emoji: '🧠', accent: '#8B5CF6' },
  { slug: 'estetica',      label: 'Estética',        emoji: '✨', accent: '#EC4899' },
  { slug: 'nutricion',     label: 'Nutrición',       emoji: '🥗', accent: '#16A34A' },
  { slug: 'ginecologia',   label: 'Ginecología',     emoji: '🌸', accent: '#F472B6' },
  { slug: 'oftalmologia',  label: 'Oftalmología',    emoji: '👁️', accent: '#6366F1' },
  { slug: 'medica',        label: 'Medicina Gral',   emoji: '🩺', accent: '#0EA5E9' },
  { slug: 'fisioterapia',  label: 'Fisioterapia',    emoji: '💪', accent: '#0EA5E9' },
  { slug: 'spa',           label: 'Spa & Bienestar', emoji: '💆', accent: '#A78BFA' },
  { slug: 'quiropractica', label: 'Quiropráctica',   emoji: '🔧', accent: '#10B981' },
]

const PAINS = [
  { id: 'lost_calls',   label: 'Llamadas y mensajes sin responder',   emoji: '📞' },
  { id: 'messy_agenda', label: 'Agenda caótica, huecos y conflictos', emoji: '📅' },
  { id: 'admin',        label: 'Horas perdidas en tareas repetitivas', emoji: '📋' },
  { id: 'noshow',       label: 'Pacientes que agendan y no llegan',   emoji: '🚫' },
  { id: 'after_hours',  label: 'Consultas que llegan fuera de horario', emoji: '🌙' },
]

const AUTOMATIONS = [
  { id: 'scheduling',    label: 'Agendamiento de citas 24/7',        emoji: '📆' },
  { id: 'confirmations', label: 'Confirmaciones automáticas',        emoji: '✅' },
  { id: 'crm',           label: 'CRM y seguimiento de pacientes',    emoji: '🧩' },
  { id: 'reminders',     label: 'Recordatorios que evitan no-shows', emoji: '🔔' },
  { id: 'info_queries',  label: 'Responder preguntas frecuentes',    emoji: '💬' },
]

function getResult(slug: string, pain: string, automation: string) {
  const spec    = SPECIALTIES.find(s => s.slug === slug)!
  const painIdx = PAINS.findIndex(p => p.id === pain)
  const autoIdx = AUTOMATIONS.findIndex(a => a.id === automation)
  const solutions: Record<string, string> = {
    lost_calls:   'contestar el 100% de los mensajes en menos de 2 segundos, sin importar la hora',
    messy_agenda: 'organizar tu agenda automáticamente, llenando huecos y evitando conflictos',
    admin:        'encargarse de confirmaciones, recordatorios y preguntas frecuentes',
    noshow:       'reducir los no-shows hasta un 40% con recordatorios persuasivos por WhatsApp',
    after_hours:  'atender y agendar pacientes a cualquier hora, incluso con el consultorio cerrado',
  }
  const autoDetails: Record<string, string> = {
    scheduling:    'agenda citas en tiempo real sin que muevas un dedo',
    confirmations: 'confirma asistencias vía WhatsApp con tasa >85%',
    crm:           'registra y da seguimiento a cada paciente con IA',
    reminders:     'envía recordatorios personalizados que disparan la asistencia',
    info_queries:  'responde precios, tratamientos y horarios en <2 segundos',
  }
  return {
    specialty: spec.label, emoji: spec.emoji, accent: spec.accent,
    painSolved: solutions[pain] ?? pain,
    autoDetail: autoDetails[automation] ?? automation,
    revenue: 18000 + (painIdx * 4200) + (autoIdx * 2800),
    saving:  9 + painIdx + autoIdx,
  }
}

const AI_GREETINGS: Record<string, string> = {
  dental:        'Bienvenido a la demostración de Welko. Soy Sofía, recepcionista virtual para clínicas de Odontología. ¿En qué le puedo ayudar hoy?',
  psicologia:    'Bienvenido a la demostración de Welko. Soy Sofía, recepcionista virtual para consultorios de Psicología. ¿En qué le puedo ayudar?',
  estetica:      'Bienvenido a la demostración de Welko. Soy Sofía, recepcionista virtual para clínicas de Estética. ¿En qué le puedo ayudar hoy?',
  nutricion:     'Bienvenido a la demostración de Welko. Soy Sofía, recepcionista virtual para consultorios de Nutrición. ¿En qué le puedo ayudar?',
  ginecologia:   'Bienvenido a la demostración de Welko. Soy Sofía, recepcionista virtual para clínicas de Ginecología. ¿En qué le puedo ayudar hoy?',
  oftalmologia:  'Bienvenido a la demostración de Welko. Soy Sofía, recepcionista virtual para clínicas de Oftalmología. ¿En qué le puedo ayudar?',
  medica:        'Bienvenido a la demostración de Welko. Soy Sofía, recepcionista virtual para clínicas de Medicina General. ¿En qué le puedo ayudar?',
  fisioterapia:  'Bienvenido a la demostración de Welko. Soy Sofía, recepcionista virtual para clínicas de Fisioterapia. ¿En qué le puedo ayudar hoy?',
  spa:           'Bienvenido a la demostración de Welko. Soy Sofía, recepcionista virtual para Spa y Bienestar. ¿En qué le puedo ayudar?',
  quiropractica: 'Bienvenido a la demostración de Welko. Soy Sofía, recepcionista virtual para clínicas de Quiropráctica. ¿En qué le puedo ayudar?',
}

const STEP_COPY = [
  { title: '¿Qué tipo de clínica tienes?',  subtitle: 'Welko entrena su IA de forma diferente para cada especialidad.' },
  { title: '¿Qué te quita el sueño hoy?',   subtitle: 'Sé honesto — vamos a atacar el problema exacto.' },
  { title: '¿Por dónde arrancamos?',         subtitle: 'Elige el área que más impacto tendría para ti mañana.' },
]

export function SimulatorSection() {
  const [started, setStarted]       = useState(false)
  const [step, setStep]             = useState(0)
  const [specialty, setSpecialty]   = useState<string | null>(null)
  const [pain, setPain]             = useState<string | null>(null)
  const [automation, setAutomation] = useState<string | null>(null)
  const [done, setDone]             = useState(false)
  const [direction]                 = useState(1)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput]       = useState('')
  const [chatLoading, setChatLoading]   = useState(false)
  const chatBottomRef = useRef<HTMLDivElement>(null)
  const inputRef      = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (done && specialty) {
      setChatMessages([{ role: 'assistant', content: AI_GREETINGS[specialty] ?? AI_GREETINGS.dental }])
    }
  }, [done, specialty])

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  function reset() {
    setStarted(false); setStep(0)
    setSpecialty(null); setPain(null); setAutomation(null)
    setDone(false); setChatMessages([]); setChatInput('')
  }

  function next(val: string) {
    if (step === 0)      { setSpecialty(val);  setStep(1) }
    else if (step === 1) { setPain(val);        setStep(2) }
    else if (step === 2) { setAutomation(val);  setDone(true) }
  }

  async function sendMessage() {
    const text = chatInput.trim()
    if (!text || chatLoading) return
    const userMsg: ChatMessage = { role: 'user', content: text }
    const updated = [...chatMessages, userMsg]
    setChatMessages(updated)
    setChatInput('')
    setChatLoading(true)
    try {
      const res  = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ specialty, messages: updated }),
      })
      const data = await res.json()
      if (data.reply) setChatMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch {
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Disculpe, hubo un problema de conexión. ¿Podría intentarlo de nuevo?' }])
    } finally {
      setChatLoading(false)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }

  const result   = done && specialty && pain && automation ? getResult(specialty, pain, automation) : null
  const progress = !started ? 0 : done ? 100 : (step / 3) * 100
  const specData = SPECIALTIES.find(s => s.slug === specialty)

  return (
    <section id="simulador" className="py-16 sm:py-24 px-4 sm:px-6" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-3xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE }}
          className="flex flex-col items-center text-center gap-3 mb-10"
        >
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--accent-label)' }}>
            Simulador
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Habla con tu recepcionista IA<br className="hidden sm:block" /> antes de comprarlo
          </h2>
          <p className="text-sm max-w-sm" style={{ color: 'var(--text-secondary)' }}>
            Elige tu especialidad · Ve el impacto en números · Chatea con la IA real
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.55, ease: EASE, delay: 0.1 }}
          className="rounded-3xl overflow-hidden"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: '0 8px 40px rgba(26,42,86,0.10)' }}
        >
          <div style={{ height: 3, background: 'var(--border)' }}>
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              style={{ height: '100%', background: NAVY, borderRadius: 9999 }}
            />
          </div>

          <div className="p-6 sm:p-8">
            <AnimatePresence mode="wait">

              {/* Intro */}
              {!started && !done && (
                <motion.div key="intro"
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3, ease: EASE }}
                  className="flex flex-col items-center text-center gap-6 py-4"
                >
                  <div className="flex items-center gap-3">
                    {['🦷','🧠','✨','🩺','💆'].map((e, i) => (
                      <motion.span key={e}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07, duration: 0.35, ease: EASE }}
                        style={{ fontSize: i === 2 ? 32 : 22, filter: i !== 2 ? 'grayscale(0.5) opacity(0.6)' : undefined }}
                      >{e}</motion.span>
                    ))}
                  </div>
                  <div className="flex flex-col gap-2 max-w-xs">
                    <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                      ¿Cómo quedaría Welko en tu clínica?
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      Responde 3 preguntas, ve el impacto en números y chatea en vivo con la IA real de tu especialidad.
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    {['Sin registro', 'Sin tarjeta', 'IA real · en vivo'].map(b => (
                      <span key={b} className="text-xs font-medium px-3 py-1.5 rounded-full"
                        style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
                      >{b}</span>
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
                    Comenzar ahora
                  </button>
                </motion.div>
              )}

              {/* Result + Live chat */}
              {done && result && (
                <motion.div key="result"
                  initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: EASE }}
                  className="flex flex-col gap-5"
                >
                  {/* ROI card */}
                  <div className="rounded-2xl p-5" style={{ background: NAVY, color: WHITE }}>
                    <div className="flex items-center gap-3 mb-3">
                      <span style={{ fontSize: 22 }}>{result.emoji}</span>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest opacity-60">Resultado para {result.specialty}</p>
                        <p className="text-sm font-semibold flex items-center gap-1.5">
                          <Sparkles size={13} style={{ color: result.accent }} />
                          {result.painSolved}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-3" style={{ borderTop: 'rgba(255,255,255,0.12) solid 1px' }}>
                      <div>
                        <p className="text-2xl font-black">${result.revenue.toLocaleString('es-MX')}</p>
                        <p className="text-xs opacity-50">MXN recuperables/mes</p>
                      </div>
                      <div>
                        <p className="text-2xl font-black">{result.saving}h</p>
                        <p className="text-xs opacity-50">admin ahorradas/semana</p>
                      </div>
                    </div>
                  </div>

                  {/* Live chat */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <p className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                        IA en vivo
                        {specData && <span style={{ color: specData.accent }}> · {specData.emoji} {specData.label}</span>}
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 overflow-y-auto"
                      style={{ height: 260, padding: 14, background: 'var(--bg-secondary)', borderRadius: 16, border: '1px solid var(--border)' }}
                    >
                      {chatMessages.map((msg, i) => (
                        <motion.div key={i}
                          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          {msg.role === 'assistant' && (
                            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mr-2 mt-0.5"
                              style={{ background: NAVY, color: WHITE, fontSize: 9, fontWeight: 800 }}>IA</div>
                          )}
                          <div className="max-w-[80%] text-xs leading-relaxed px-3 py-2.5 rounded-2xl"
                            style={msg.role === 'user'
                              ? { background: NAVY, color: WHITE, borderBottomRightRadius: 4 }
                              : { background: 'var(--surface)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderBottomLeftRadius: 4 }
                            }
                          >{msg.content}</div>
                        </motion.div>
                      ))}

                      {chatLoading && (
                        <div className="flex justify-start">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mr-2"
                            style={{ background: NAVY, color: WHITE, fontSize: 9, fontWeight: 800 }}>IA</div>
                          <div className="px-3 py-2.5 rounded-2xl flex items-center gap-1.5"
                            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                            {[0,1,2].map(i => (
                              <motion.div key={i} className="w-1.5 h-1.5 rounded-full"
                                style={{ background: 'var(--text-muted)' }}
                                animate={{ opacity: [0.3,1,0.3] }}
                                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                      <div ref={chatBottomRef} />
                    </div>

                    <div className="flex gap-2">
                      <input ref={inputRef} type="text" value={chatInput}
                        onChange={e => setChatInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && sendMessage()}
                        placeholder="Escribe tu mensaje..."
                        className="flex-1 text-sm px-4 py-2.5 rounded-xl outline-none"
                        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                      />
                      <button onClick={sendMessage}
                        disabled={!chatInput.trim() || chatLoading}
                        className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150 disabled:opacity-40"
                        style={{ background: NAVY, color: WHITE, border: 'none', cursor: chatLoading ? 'not-allowed' : 'pointer' }}
                      >
                        {chatLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                      </button>
                    </div>
                    <p className="text-center text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      Demo en vivo — la IA real se personaliza con tu clínica, horarios y servicios
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/registro"
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold"
                      style={{ background: NAVY, color: WHITE }}
                    >
                      Quiero esto para mi clínica <ArrowRight size={15} />
                    </Link>
                    <Link href="/precios"
                      className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-sm font-medium"
                      style={{ border: '1.5px solid var(--border)', color: 'var(--text-primary)' }}
                    >
                      Ver planes
                    </Link>
                  </div>

                  <button onClick={reset}
                    className="flex items-center justify-center gap-2 text-xs mx-auto"
                    style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    <RotateCcw size={12} /> Volver a empezar
                  </button>
                </motion.div>
              )}

              {/* Question steps */}
              {started && !done && (
                <motion.div key={`step-${step}`}
                  initial={{ x: direction * 32, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                  exit={{ x: direction * -32, opacity: 0 }} transition={{ duration: 0.25, ease: EASE }}
                  className="flex flex-col gap-6"
                >
                  <div className="flex items-center gap-2">
                    {STEP_COPY.map((_, i) => (
                      <div key={i} style={{ height: 4, flex: 1, borderRadius: 99, background: i <= step ? NAVY : 'var(--border)', transition: 'background 0.3s' }} />
                    ))}
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: 'var(--accent-label)' }}>
                      {step + 1} de 3
                    </p>
                    <h3 className="text-lg sm:text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{STEP_COPY[step].title}</h3>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{STEP_COPY[step].subtitle}</p>
                  </div>

                  {step === 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {SPECIALTIES.map(sp => (
                        <button key={sp.slug} onClick={() => next(sp.slug)}
                          className="flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-150"
                          style={{ border: '1.5px solid var(--border)', background: 'var(--bg-secondary)', cursor: 'pointer' }}
                          onMouseEnter={e => (e.currentTarget.style.borderColor = sp.accent)}
                          onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                        >
                          <span style={{ fontSize: 22 }}>{sp.emoji}</span>
                          <span className="text-xs font-semibold text-center leading-tight" style={{ color: 'var(--text-primary)' }}>{sp.label}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {step === 1 && (
                    <div className="flex flex-col gap-2">
                      {PAINS.map(p => (
                        <button key={p.id} onClick={() => next(p.id)}
                          className="flex items-center gap-4 p-4 rounded-2xl text-left transition-all duration-150"
                          style={{ border: '1.5px solid var(--border)', background: 'var(--bg-secondary)', cursor: 'pointer' }}
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

                  {step === 2 && (
                    <div className="flex flex-col gap-2">
                      {AUTOMATIONS.map(a => (
                        <button key={a.id} onClick={() => next(a.id)}
                          className="flex items-center gap-4 p-4 rounded-2xl text-left transition-all duration-150"
                          style={{ border: '1.5px solid var(--border)', background: 'var(--bg-secondary)', cursor: 'pointer' }}
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
