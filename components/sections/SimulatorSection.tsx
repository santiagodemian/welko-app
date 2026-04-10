'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ArrowRight, Sparkles, RotateCcw, Play, Send, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { INDUSTRIES, INDUSTRY_CATEGORIES } from '@/lib/industries'
import { getCRMConfig } from '@/lib/industry-crm'
import { useLang } from '@/contexts/LangContext'

const NAVY  = '#1A2A56'
const NAVY2 = '#2B3F7A'
const WHITE = '#FFFFFF'
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

interface ChatMessage { role: 'user' | 'assistant'; content: string }

// ─── ROI profiles per industry category ──────────────────────────────────────
interface ROIProfile {
  volumeLabel: string
  ticketLabel: string
  lossLabel:   string
  recoveryRate: number
  defaultVolume: number
  defaultTicket: number
  defaultLoss:   number
  lostUnitLabel: string   // "citas perdidas", "pedidos perdidos"
  recoveredUnit: string   // "citas recuperadas", "reservaciones recuperadas"
}

const ROI_BY_CATEGORY: Record<string, ROIProfile> = {
  health: {
    volumeLabel: 'Citas al mes', ticketLabel: 'Precio por cita (MXN)', lossLabel: 'Tasa de no-shows (%)',
    recoveryRate: 0.30, defaultVolume: 80, defaultTicket: 1200, defaultLoss: 25,
    lostUnitLabel: 'citas perdidas/mes', recoveredUnit: 'citas que Welko recupera',
  },
  food: {
    volumeLabel: 'Consultas/reservas al mes', ticketLabel: 'Ticket promedio (MXN)', lossLabel: 'Tasa de abandono (%)',
    recoveryRate: 0.35, defaultVolume: 200, defaultTicket: 450, defaultLoss: 30,
    lostUnitLabel: 'pedidos/reservas perdidas/mes', recoveredUnit: 'pedidos recuperados',
  },
  beauty: {
    volumeLabel: 'Turnos al mes', ticketLabel: 'Precio por turno (MXN)', lossLabel: 'Tasa de no-shows (%)',
    recoveryRate: 0.35, defaultVolume: 120, defaultTicket: 380, defaultLoss: 28,
    lostUnitLabel: 'turnos perdidos/mes', recoveredUnit: 'turnos que Welko recupera',
  },
  fitness: {
    volumeLabel: 'Leads/consultas al mes', ticketLabel: 'Inscripción mensual (MXN)', lossLabel: 'Tasa de no-conversión (%)',
    recoveryRate: 0.40, defaultVolume: 50, defaultTicket: 700, defaultLoss: 60,
    lostUnitLabel: 'leads no convertidos/mes', recoveredUnit: 'inscripciones que Welko genera',
  },
  hospitality: {
    volumeLabel: 'Consultas de reserva al mes', ticketLabel: 'Precio por noche (MXN)', lossLabel: 'Tasa de no-reservación (%)',
    recoveryRate: 0.25, defaultVolume: 80, defaultTicket: 1800, defaultLoss: 40,
    lostUnitLabel: 'reservaciones perdidas/mes', recoveredUnit: 'reservaciones recuperadas',
  },
  professional: {
    volumeLabel: 'Consultas al mes', ticketLabel: 'Honorarios por cliente (MXN)', lossLabel: 'Tasa de no-conversión (%)',
    recoveryRate: 0.35, defaultVolume: 30, defaultTicket: 3500, defaultLoss: 50,
    lostUnitLabel: 'consultas perdidas/mes', recoveredUnit: 'clientes que Welko convierte',
  },
  retail: {
    volumeLabel: 'Consultas/visitas al mes', ticketLabel: 'Ticket promedio (MXN)', lossLabel: 'Tasa de no-compra (%)',
    recoveryRate: 0.30, defaultVolume: 150, defaultTicket: 600, defaultLoss: 35,
    lostUnitLabel: 'ventas perdidas/mes', recoveredUnit: 'ventas que Welko convierte',
  },
}

function getROIProfile(industrySlug: string): ROIProfile {
  const ind = INDUSTRIES.find(i => i.slug === industrySlug)
  return ROI_BY_CATEGORY[ind?.category ?? 'health'] ?? ROI_BY_CATEGORY.health
}

// ─── Bilingual copy ───────────────────────────────────────────────────────────
const PAINS_ES = [
  { id: 'lost_contacts', label: 'Mensajes y llamadas sin responder'      },
  { id: 'messy_agenda',  label: 'Agenda caótica con huecos y conflictos' },
  { id: 'admin_time',    label: 'Horas perdidas en tareas repetitivas'   },
  { id: 'noshow',        label: 'Clientes que confirman y no llegan'     },
  { id: 'after_hours',   label: 'Consultas que llegan fuera de horario'  },
]
const PAINS_EN = [
  { id: 'lost_contacts', label: 'Unanswered messages and calls'           },
  { id: 'messy_agenda',  label: 'Chaotic schedule with gaps and conflicts' },
  { id: 'admin_time',    label: 'Hours lost on repetitive tasks'           },
  { id: 'noshow',        label: 'Clients who confirm and don\'t show up'   },
  { id: 'after_hours',   label: 'Inquiries that arrive after hours'        },
]
const AUTOMATIONS_ES = [
  { id: 'scheduling',    label: 'Agendamiento 24/7 sin intervención'         },
  { id: 'confirmations', label: 'Confirmaciones automáticas por WhatsApp'    },
  { id: 'crm',           label: 'CRM y seguimiento de clientes con IA'       },
  { id: 'reminders',     label: 'Recordatorios que evitan cancelaciones'     },
  { id: 'info_queries',  label: 'Responder preguntas frecuentes al instante' },
]
const AUTOMATIONS_EN = [
  { id: 'scheduling',    label: '24/7 booking without manual work'       },
  { id: 'confirmations', label: 'Automatic WhatsApp confirmations'       },
  { id: 'crm',           label: 'AI-powered CRM and client follow-up'    },
  { id: 'reminders',     label: 'Reminders that prevent no-shows'        },
  { id: 'info_queries',  label: 'Answer FAQs instantly'                  },
]

const PAIN_SOLUTIONS_ES: Record<string, string> = {
  lost_contacts: 'contestar el 100% de los mensajes en menos de 2 segundos, sin importar la hora',
  messy_agenda:  'organizar tu agenda automáticamente, llenando huecos y evitando conflictos',
  admin_time:    'encargarse de confirmaciones, recordatorios y preguntas frecuentes',
  noshow:        'reducir las inasistencias hasta un 40% con recordatorios por WhatsApp',
  after_hours:   'atender y agendar clientes a cualquier hora, incluso con el negocio cerrado',
}
const PAIN_SOLUTIONS_EN: Record<string, string> = {
  lost_contacts: 'answer 100% of messages in under 2 seconds, any time of day',
  messy_agenda:  'automatically organize your schedule, filling gaps and avoiding conflicts',
  admin_time:    'handle confirmations, reminders and FAQs without human intervention',
  noshow:        'reduce no-shows by up to 40% with persuasive WhatsApp reminders',
  after_hours:   'attend and book clients at any hour, even when your business is closed',
}

export function SimulatorSection() {
  const { lang } = useLang()
  const isEN = lang === 'en'

  const PAINS       = isEN ? PAINS_EN       : PAINS_ES
  const AUTOMATIONS = isEN ? AUTOMATIONS_EN : AUTOMATIONS_ES
  const PAIN_SOLUTIONS = isEN ? PAIN_SOLUTIONS_EN : PAIN_SOLUTIONS_ES

  const STEP_COPY = isEN
    ? [
        { title: 'What type of business do you run?',  subtitle: 'Welko trains its AI differently for each industry.' },
        { title: "What's keeping you up at night?",    subtitle: 'Be honest — we\'ll attack the exact problem.' },
        { title: 'Where should we start?',             subtitle: 'Pick the area that would have the biggest impact tomorrow.' },
      ]
    : [
        { title: '¿Cuál es tu tipo de negocio?',   subtitle: 'Welko entrena su IA de forma diferente para cada industria.' },
        { title: '¿Qué te quita el sueño hoy?',   subtitle: 'Sé honesto — vamos a atacar el problema exacto.' },
        { title: '¿Por dónde arrancamos?',          subtitle: 'Elige el área que más impacto tendría para ti mañana.' },
      ]

  const [started, setStarted]         = useState(false)
  const [step, setStep]               = useState(0)
  const [industry, setIndustry]       = useState<string | null>(null)
  const [pain, setPain]               = useState<string | null>(null)
  const [automation, setAutomation]   = useState<string | null>(null)
  const [done, setDone]               = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput]     = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const chatBottomRef = useRef<HTMLDivElement>(null)
  const inputRef      = useRef<HTMLInputElement>(null)

  // Seed greeting when reaching done
  useEffect(() => {
    if (!done || !industry) return
    const ind  = INDUSTRIES.find(i => i.slug === industry)
    const name = isEN ? (ind?.en.name ?? 'your business') : (ind?.es.name ?? 'tu negocio')
    const greeting = isEN
      ? `Welcome to the Welko demo. I'm Sophia, your virtual receptionist for ${name}. How can I help you today?`
      : `Bienvenido a la demostración de Welko. Soy Sofía, recepcionista virtual de ${name}. ¿En qué le puedo ayudar hoy?`
    setChatMessages([{ role: 'assistant', content: greeting }])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done, industry, isEN])

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  function reset() {
    setStarted(false); setStep(0)
    setIndustry(null); setPain(null); setAutomation(null)
    setDone(false); setChatMessages([]); setChatInput('')
  }

  function next(val: string) {
    if (step === 0) { setIndustry(val);   setStep(1) }
    else if (step === 1) { setPain(val);  setStep(2) }
    else if (step === 2) { setAutomation(val); setDone(true) }
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
        body: JSON.stringify({ specialty: industry, messages: updated }),
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

  // Derived state
  const indData   = industry ? INDUSTRIES.find(i => i.slug === industry) : null
  const profile   = industry ? getROIProfile(industry) : null
  const crmConfig = industry ? getCRMConfig(industry) : null
  const painIdx   = PAINS.findIndex(p => p.id === pain)
  const autoIdx   = AUTOMATIONS.findIndex(a => a.id === automation)

  // ROI calculation
  const roi = profile ? (() => {
    const lost      = Math.round(profile.defaultVolume * (profile.defaultLoss / 100))
    const recovered = Math.round(lost * profile.recoveryRate)
    const revenue   = recovered * profile.defaultTicket + (painIdx * 4200) + (autoIdx * 2800)
    const saving    = 9 + (painIdx >= 0 ? painIdx : 0) + (autoIdx >= 0 ? autoIdx : 0)
    return { lost, recovered, revenue, saving }
  })() : null

  const progress = !started ? 0 : done ? 100 : (step / 3) * 100

  // CRM kanban columns preview
  const crmColumns = crmConfig ? [
    { key: 'NUEVO',             label: crmConfig.kanban.NUEVO.es,             color: crmConfig.kanban.NUEVO.color },
    { key: 'EN_SEGUIMIENTO_IA', label: crmConfig.kanban.EN_SEGUIMIENTO_IA.es, color: crmConfig.kanban.EN_SEGUIMIENTO_IA.color },
    { key: 'CITA_CONFIRMADA',   label: crmConfig.kanban.CITA_CONFIRMADA.es,   color: crmConfig.kanban.CITA_CONFIRMADA.color },
    { key: 'REVENUE_CERRADO',   label: crmConfig.kanban.REVENUE_CERRADO.es,   color: crmConfig.kanban.REVENUE_CERRADO.color },
  ] : []

  return (
    <section id="simulador" className="py-16 sm:py-24 px-4 sm:px-6" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-3xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE }}
          className="flex flex-col items-center text-center gap-3 mb-10"
        >
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--accent-label)' }}>
            {isEN ? 'Live demo' : 'Simulador'}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            {isEN ? 'Talk to your AI before buying' : 'Habla con tu IA antes de comprarlo'}
          </h2>
          <p className="text-sm max-w-sm" style={{ color: 'var(--text-secondary)' }}>
            {isEN
              ? 'Choose your industry · See impact in numbers · Chat with live AI'
              : 'Elige tu industria · Ve el impacto en números · Chatea con la IA real'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.55, ease: EASE, delay: 0.1 }}
          className="rounded-3xl overflow-hidden"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: '0 8px 40px rgba(26,42,86,0.10)' }}
        >
          {/* Progress bar */}
          <div style={{ height: 3, background: 'var(--border)' }}>
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              style={{ height: '100%', background: NAVY, borderRadius: 9999 }}
            />
          </div>

          <div className="p-5 sm:p-7">
            <AnimatePresence mode="wait">

              {/* ── Intro screen ── */}
              {!started && !done && (
                <motion.div key="intro"
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3, ease: EASE }}
                  className="flex flex-col items-center text-center gap-6 py-4"
                >
                  <div className="flex items-center gap-2 flex-wrap justify-center">
                    {['Salud','Restaurante','Barbería','Fitness','Hotel','Legal'].map((label, i) => (
                      <motion.span key={label}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07, duration: 0.35, ease: EASE }}
                        className="px-3 py-1 rounded-full text-xs font-semibold"
                        style={{ fontSize: 11, opacity: i !== 2 ? 0.6 : 1, background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                      >{label}</motion.span>
                    ))}
                  </div>
                  <div className="flex flex-col gap-2 max-w-xs">
                    <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                      {isEN ? 'How would Welko work for your business?' : '¿Cómo quedaría Welko en tu negocio?'}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {isEN
                        ? 'Answer 3 questions, see the impact in numbers and chat live with the real AI for your industry.'
                        : 'Responde 3 preguntas, ve el impacto en números y chatea en vivo con la IA real de tu industria.'}
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    {(isEN
                      ? ['No sign-up', 'No credit card', 'Real AI · live']
                      : ['Sin registro', 'Sin tarjeta', 'IA real · en vivo']
                    ).map(b => (
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
                    {isEN ? 'Start now' : 'Comenzar ahora'}
                  </button>
                </motion.div>
              )}

              {/* ── Result + Live chat ── */}
              {done && roi && indData && crmConfig && (
                <motion.div key="result"
                  initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: EASE }}
                  className="flex flex-col gap-5"
                >
                  {/* ROI card */}
                  <div className="rounded-2xl p-4 sm:p-5" style={{ background: NAVY, color: WHITE }}>
                    <div className="flex items-start gap-3 mb-3">
                      <span style={{ fontSize: 24, lineHeight: 1 }}>{indData.icon}</span>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-0.5">
                          {isEN ? `Results for ${indData.en.name}` : `Resultado para ${indData.es.name}`}
                        </p>
                        <p className="text-sm font-semibold flex items-center gap-1.5">
                          <Sparkles size={13} style={{ color: indData.color ?? '#60A5FA' }} />
                          {isEN ? 'Welko can ' : 'Welko puede '}
                          {PAIN_SOLUTIONS[pain ?? ''] ?? (isEN ? 'automate your customer service' : 'automatizar tu atención al cliente')}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}>
                      <div>
                        <p className="text-xl sm:text-2xl font-black">${roi.revenue.toLocaleString('es-MX')}</p>
                        <p className="text-[10px] opacity-50 mt-0.5">{isEN ? 'MXN recoverable/month' : 'MXN recuperables/mes'}</p>
                      </div>
                      <div>
                        <p className="text-xl sm:text-2xl font-black">{roi.saving}h</p>
                        <p className="text-[10px] opacity-50 mt-0.5">
                          {isEN ? 'admin hours saved/week' : 'admin ahorradas/semana'}
                        </p>
                      </div>
                    </div>
                    {/* ROI breakdown pills */}
                    <div className="flex gap-2 mt-3 flex-wrap">
                      <span className="text-[10px] px-2 py-1 rounded-full" style={{ background: 'rgba(248,113,113,0.18)', color: '#FCA5A5' }}>
                        {roi.lost} {isEN ? 'lost/month' : profile?.lostUnitLabel}
                      </span>
                      <span className="text-[10px] px-2 py-1 rounded-full" style={{ background: 'rgba(52,211,153,0.18)', color: '#6EE7B7' }}>
                        {roi.recovered} {isEN ? 'Welko recovers' : profile?.recoveredUnit}
                      </span>
                    </div>
                  </div>

                  {/* CRM Preview */}
                  <div className="rounded-2xl p-4" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
                      {isEN
                        ? `Your CRM · ${crmConfig.clientLabel.en.toLowerCase()} pipeline`
                        : `Tu CRM · pipeline de ${crmConfig.clientLabel.es.toLowerCase()}s`}
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {crmColumns.map((col, i) => (
                        <div key={col.key} className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                            style={{ background: col.color + '18', color: col.color, border: `1px solid ${col.color}30` }}>
                            {isEN ? crmConfig.kanban[col.key as keyof typeof crmConfig.kanban]?.en ?? col.label : col.label}
                          </span>
                          {i < crmColumns.length - 1 && (
                            <ChevronRight size={10} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] mt-2" style={{ color: 'var(--text-muted)' }}>
                      {isEN
                        ? 'CRM is automatically configured when you activate Welko for your industry.'
                        : 'El CRM se configura automáticamente al activar Welko para tu industria.'}
                    </p>
                  </div>

                  {/* Live chat */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <p className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                        {isEN ? 'AI live' : 'IA en vivo'}
                        <span style={{ color: indData.color ?? NAVY }}>
                          {' '}· {indData.icon} {isEN ? indData.en.name : indData.es.name}
                        </span>
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 overflow-y-auto"
                      style={{ height: 240, padding: 12, background: 'var(--bg-secondary)', borderRadius: 14, border: '1px solid var(--border)' }}
                    >
                      {chatMessages.map((msg, i) => (
                        <motion.div key={i}
                          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          {msg.role === 'assistant' && (
                            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mr-2 mt-0.5"
                              style={{ background: NAVY, color: WHITE, fontSize: 9, fontWeight: 800 }}>AI</div>
                          )}
                          <div className="max-w-[80%] text-xs leading-relaxed px-3 py-2 rounded-2xl"
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
                            style={{ background: NAVY, color: WHITE, fontSize: 9, fontWeight: 800 }}>AI</div>
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
                        placeholder={isEN ? 'Type your message...' : 'Escribe tu mensaje...'}
                        className="flex-1 text-sm px-4 py-2.5 rounded-xl outline-none"
                        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                      />
                      <button onClick={sendMessage}
                        disabled={!chatInput.trim() || chatLoading}
                        className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150 disabled:opacity-40"
                        style={{ background: NAVY, color: WHITE, border: 'none', cursor: chatLoading ? 'not-allowed' : 'pointer', flexShrink: 0 }}
                      >
                        {chatLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                      </button>
                    </div>
                    <p className="text-center text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      {isEN
                        ? 'Live demo — the real AI is customized with your business, hours and services'
                        : 'Demo en vivo — la IA real se personaliza con tu negocio, horarios y servicios'}
                    </p>
                  </div>

                  {/* CTAs */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/registro"
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold"
                      style={{ background: NAVY, color: WHITE, textDecoration: 'none' }}
                    >
                      {isEN ? 'I want this for my business' : 'Quiero esto para mi negocio'} <ArrowRight size={15} />
                    </Link>
                    <Link href="/precios"
                      className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-sm font-medium"
                      style={{ border: '1.5px solid var(--border)', color: 'var(--text-primary)', textDecoration: 'none' }}
                    >
                      {isEN ? 'See plans' : 'Ver planes'}
                    </Link>
                  </div>

                  <button onClick={reset}
                    className="flex items-center justify-center gap-2 text-xs mx-auto"
                    style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    <RotateCcw size={12} /> {isEN ? 'Start over' : 'Volver a empezar'}
                  </button>
                </motion.div>
              )}

              {/* ── Question steps ── */}
              {started && !done && (
                <motion.div key={`step-${step}`}
                  initial={{ x: 32, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -32, opacity: 0 }} transition={{ duration: 0.25, ease: EASE }}
                  className="flex flex-col gap-5"
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
                    <h3 className="text-base sm:text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                      {STEP_COPY[step].title}
                    </h3>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                      {STEP_COPY[step].subtitle}
                    </p>
                  </div>

                  {/* Step 0 — Industry picker (all categories) */}
                  {step === 0 && (
                    <div className="flex flex-col gap-4 max-h-[380px] overflow-y-auto pr-1">
                      {INDUSTRY_CATEGORIES.map(cat => {
                        const catInds = INDUSTRIES.filter(i => i.category === cat.id)
                        if (!catInds.length) return null
                        return (
                          <div key={cat.id}>
                            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
                              {cat.icon} {isEN ? cat.en : cat.es}
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {catInds.map(ind => (
                                <button key={ind.slug} onClick={() => next(ind.slug)}
                                  className="flex items-center gap-2 p-2.5 rounded-xl transition-all duration-150 text-left"
                                  style={{ border: '1.5px solid var(--border)', background: 'var(--bg-secondary)', cursor: 'pointer' }}
                                  onMouseEnter={e => { e.currentTarget.style.borderColor = ind.color ?? NAVY; e.currentTarget.style.background = (ind.color ?? NAVY) + '10' }}
                                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-secondary)' }}
                                >
                                  <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>{ind.icon}</span>
                                  <span className="text-xs font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>
                                    {isEN ? ind.en.name : ind.es.name}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* Step 1 — Pain point */}
                  {step === 1 && (
                    <div className="flex flex-col gap-2">
                      {PAINS.map(p => (
                        <button key={p.id} onClick={() => next(p.id)}
                          className="flex items-center gap-4 p-3.5 rounded-2xl text-left transition-all duration-150"
                          style={{ border: '1.5px solid var(--border)', background: 'var(--bg-secondary)', cursor: 'pointer' }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = NAVY; e.currentTarget.style.background = NAVY + '06' }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-secondary)' }}
                        >
                          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{p.label}</span>
                          <ChevronRight size={14} style={{ marginLeft: 'auto', color: 'var(--text-muted)', flexShrink: 0 }} />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Step 2 — Automation */}
                  {step === 2 && (
                    <div className="flex flex-col gap-2">
                      {AUTOMATIONS.map(a => (
                        <button key={a.id} onClick={() => next(a.id)}
                          className="flex items-center gap-4 p-3.5 rounded-2xl text-left transition-all duration-150"
                          style={{ border: '1.5px solid var(--border)', background: 'var(--bg-secondary)', cursor: 'pointer' }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = NAVY; e.currentTarget.style.background = NAVY + '06' }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-secondary)' }}
                        >
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
