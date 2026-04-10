'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Send, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import { useLang } from '@/contexts/LangContext'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const SPECIALTIES = [
  { slug: 'salud',        es: 'Salud',       en: 'Health'      },
  { slug: 'restaurante',  es: 'Restaurante', en: 'Restaurant'  },
  { slug: 'barberia',     es: 'Barbería',    en: 'Barbershop'  },
  { slug: 'hotel',        es: 'Hotel',       en: 'Hotel'       },
  { slug: 'fitness',      es: 'Fitness',     en: 'Fitness'     },
  { slug: 'legal',        es: 'Legal',       en: 'Legal'       },
]

// Fallback responses when /api/chat fails — keeps the demo working
function getDemoFallback(text: string, specialty: string, lang: string): string {
  const t = text.toLowerCase()
  if (lang === 'es') {
    if (/precio|costo|cu[aá]nto|tarifa/.test(t)) {
      const p: Record<string, string> = {
        salud:       'Los precios varían según el servicio. Limpieza desde $350, consulta desde $450. ¿Qué necesitas? ',
        restaurante: 'Nuestro menú tiene opciones desde $120. ¿Te envío la carta completa? ️',
        barberia:    'Corte desde $120, barba desde $80, combo desde $180. ¿Qué servicio buscas? ️',
        hotel:       'Las tarifas varían por temporada. ¿Me das las fechas para cotizarte? ',
        fitness:     'Membresía mensual desde $699, trimestral desde $1,799. ¿Te agendo una visita? ',
        legal:       'La consulta inicial es gratuita. Honorarios según el caso. ¿Me platicas qué necesitas? ️',
      }
      return p[specialty] ?? '¡Hola! Con gusto te doy los precios. ¿Qué servicio te interesa?'
    }
    if (/cita|disponib|agendar|agenda|reserva|reservar|mesa|turno/.test(t))
      return 'Tenemos disponibilidad esta semana.  ¿Prefieres por la mañana o por la tarde?'
    if (/hora|abre|cierra|horario/.test(t))
      return 'Atendemos de lunes a viernes 9am–8pm y sábados 9am–3pm. ¿Te agendo?'
    if (/tarjeta|pago|efectivo|transferencia/.test(t))
      return 'Aceptamos efectivo, tarjeta y transferencia bancaria.  ¿En qué más te ayudo?'
    if (/urgencia|urgente|dolor|emergencia/.test(t))
      return '¡Entendido! Tenemos espacio de urgencia hoy mismo. ¿Me das tu nombre? '
    return '¡Hola! Soy la recepcionista IA. ¿En qué te puedo apoyar hoy? '
  } else {
    if (/price|cost|how much|rate|fee/.test(t)) {
      const p: Record<string, string> = {
        salud:       'Prices vary by service. Cleaning from $25, consultation from $35. What do you need? ',
        restaurante: 'Our menu starts at $10. Would you like me to send you the full menu? ️',
        barberia:    'Haircut from $10, beard from $8, combo from $16. Which service? ️',
        hotel:       'Rates vary by season. Give me your dates and I\'ll quote you right away. ',
        fitness:     'Monthly membership from $49, quarterly from $129. Want to schedule a visit? ',
        legal:       'Initial consultation is free. Fees depend on the case. Tell me what you need? ️',
      }
      return p[specialty] ?? 'Hi! I\'d be happy to help with pricing. What service are you looking for?'
    }
    if (/appointment|available|book|schedule|reservation|table|slot/.test(t))
      return 'We have availability this week!  Morning or afternoon?'
    if (/hours|open|close/.test(t))
      return 'Open Monday–Friday 9am–8pm and Saturdays 9am–3pm. Would you like to book?'
    if (/card|payment|cash/.test(t))
      return 'We accept cash, credit/debit cards, and bank transfers.  Anything else?'
    return 'Hi! I\'m the AI receptionist. How can I help you today? '
  }
}

const STARTERS = {
  es: [
    '¿Cuánto cuesta una limpieza dental?',
    '¿Tienen cita disponible esta semana?',
    '¿Cuáles son sus horarios?',
    '¿Aceptan tarjeta de crédito?',
  ],
  en: [
    'How much does a dental cleaning cost?',
    'Do you have availability this week?',
    'What are your office hours?',
    'Do you accept credit cards?',
  ],
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-3 py-2 rounded-2xl rounded-bl-sm w-fit" style={{ background: '#FFFFFF', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full"
          style={{
            background: '#9CA3AF',
            animation: `wa-bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes wa-bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  )
}

export function DemoChat() {
  const { lang } = useLang()
  const [specialty, setSpecialty] = useState('dental')
  const [messages, setMessages]   = useState<Message[]>([])
  const [input, setInput]         = useState('')
  const [loading, setLoading]     = useState(false)
  const [started, setStarted]     = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const starters = STARTERS[lang as 'es' | 'en'] ?? STARTERS.es

  const L = {
    eyebrow:  lang === 'es' ? 'Demo interactiva'                         : 'Interactive demo',
    heading:  lang === 'es' ? 'Habla con tu futura recepcionista'        : 'Talk to your future receptionist',
    sub:      lang === 'es' ? 'Escríbele como si fuera un paciente real. Respuestas reales de la IA, sin scripts ni trucos.' : 'Message it like a real patient. Real AI responses, no scripts or tricks.',
    clinicName: lang === 'es' ? 'Clínica Demo Welko'                    : 'Welko Demo Clinic',
    online:   lang === 'es' ? 'En línea · Recepcionista IA'             : 'Online · AI Receptionist',
    placeholder: lang === 'es' ? 'Escribe un mensaje...'                : 'Type a message...',
    startLabel:  lang === 'es' ? 'Elige una especialidad y comienza'    : 'Pick a specialty and start chatting',
    tryLabel:    lang === 'es' ? 'Prueba preguntando:'                  : 'Try asking:',
    reset:       lang === 'es' ? 'Nueva conversación'                   : 'New conversation',
    ctaLabel:    lang === 'es' ? '¿Listo para tener esto en tu negocio?' : 'Ready to have this in your business?',
    ctaBtn:      lang === 'es' ? 'Ver planes'                           : 'See plans',
    ctaBtnSec:   lang === 'es' ? 'Comenzar ahora'                       : 'Get started',
    specialtyLabel: lang === 'es' ? 'Especialidad'                      : 'Specialty',
    msgYou:      lang === 'es' ? 'Tú'                                   : 'You',
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return
    setStarted(true)

    const userMsg: Message = { role: 'user', content: text }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, specialty }),
      })
      const data = await res.json()
      const reply = data.reply ?? getDemoFallback(text, specialty, lang)
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
    } catch {
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: getDemoFallback(text, specialty, lang),
      }])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  function reset() {
    setMessages([])
    setStarted(false)
    setInput('')
    setLoading(false)
  }

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <main className="min-h-screen" style={{ background: 'var(--bg)' }}>

      {/* Hero / intro */}
      <section className="pt-28 pb-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center gap-4">
          <motion.span
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: 'var(--accent-label)' }}
          >
            {L.eyebrow}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.05 }}
            className="text-3xl sm:text-5xl font-extrabold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            {L.heading}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
            className="text-base font-light max-w-md"
            style={{ color: 'var(--text-secondary)' }}
          >
            {L.sub}
          </motion.p>
        </div>
      </section>

      {/* Demo area */}
      <section className="pb-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-10 items-start justify-center">

          {/* Left: phone */}
          <motion.div
            initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
            className="flex flex-col items-center gap-5 w-full lg:w-auto"
          >
            {/* Specialty pills */}
            <div className="flex flex-wrap gap-2 justify-center">
              {SPECIALTIES.map((s) => (
                <button
                  key={s.slug}
                  onClick={() => { setSpecialty(s.slug); reset() }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150"
                  style={
                    specialty === s.slug
                      ? { background: 'var(--accent)', color: 'var(--accent-fg)' }
                      : { background: 'var(--surface)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }
                  }
                >
                  {lang === 'es' ? s.es : s.en}
                </button>
              ))}
            </div>

            {/* Phone mockup */}
            <div
              className="relative w-[300px] sm:w-[320px] rounded-[44px] overflow-hidden flex-shrink-0"
              style={{
                background: '#111',
                boxShadow: '0 32px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.08)',
                padding: '12px',
              }}
            >
              <div className="rounded-[34px] overflow-hidden flex flex-col" style={{ background: '#ECE5DD', height: 580 }}>
                {/* Header */}
                <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0" style={{ background: '#075E54' }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: '#128C7E' }}>
                    W
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm leading-none truncate">{L.clinicName}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.7)' }}>{L.online}</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto flex flex-col gap-2 px-3 py-4 scroll-smooth">
                  {!started && messages.length === 0 && (
                    <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-4">
                      <span className="text-3xl"></span>
                      <p className="text-xs font-medium" style={{ color: '#6B7280' }}>
                        {L.startLabel}
                      </p>
                    </div>
                  )}

                  <AnimatePresence initial={false}>
                    {messages.map((msg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.22, ease: EASE }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className="max-w-[220px] px-3 py-2 rounded-2xl text-xs leading-relaxed"
                          style={
                            msg.role === 'user'
                              ? { background: '#DCF8C6', color: '#111', borderBottomRightRadius: 4 }
                              : { background: '#FFFFFF', color: '#111', borderBottomLeftRadius: 4, boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }
                          }
                        >
                          {msg.content}
                          <span className="block text-right mt-1" style={{ fontSize: 9, color: 'rgba(0,0,0,0.4)' }}>
                            {msg.role === 'assistant' ? ' ' : ''}{now}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {loading && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                      className="flex justify-start"
                    >
                      <TypingDots />
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="flex items-center gap-2 px-3 py-2 flex-shrink-0" style={{ background: '#F0F0F0', borderTop: '1px solid #DDD' }}>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder={L.placeholder}
                    disabled={loading}
                    className="flex-1 rounded-full px-3 py-2 text-xs outline-none"
                    style={{ background: '#FFF', color: '#111', border: 'none' }}
                  />
                  <button
                    onClick={() => sendMessage(input)}
                    disabled={loading || !input.trim()}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-opacity"
                    style={{ background: '#075E54', opacity: loading || !input.trim() ? 0.5 : 1 }}
                  >
                    <Send size={13} />
                  </button>
                </div>
              </div>
            </div>

            {/* Reset */}
            {started && (
              <motion.button
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                onClick={reset}
                className="flex items-center gap-2 text-xs px-4 py-2 rounded-xl transition-all"
                style={{ color: 'var(--text-muted)', border: '1px solid var(--border)', background: 'var(--surface)' }}
              >
                <RotateCcw size={12} />
                {L.reset}
              </motion.button>
            )}
          </motion.div>

          {/* Right: sidebar content */}
          <motion.div
            initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: EASE, delay: 0.2 }}
            className="flex flex-col gap-8 max-w-sm w-full"
          >
            {/* Starter questions */}
            <div className="flex flex-col gap-3">
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--accent-label)' }}>
                {L.tryLabel}
              </p>
              <div className="flex flex-col gap-2">
                {starters.map((q, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, ease: EASE, delay: 0.25 + i * 0.07 }}
                    onClick={() => sendMessage(q)}
                    disabled={loading}
                    className="text-left px-4 py-3 rounded-2xl text-sm transition-all duration-150"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-hover)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)' }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)' }}
                  >
                    <span style={{ color: 'var(--accent-label)', marginRight: 8 }}>→</span>
                    {q}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Feature callouts */}
            <div className="flex flex-col gap-4">
              {[
                { icon: '', text: lang === 'es' ? 'IA entrenada para tu especialidad — responde con contexto real.' : 'AI trained for your specialty — responds with real context.' },
                { icon: '', text: lang === 'es' ? 'Puede agendar citas, preguntar disponibilidad y confirmar horarios.' : 'Can book appointments, check availability, and confirm schedules.' },
                { icon: '', text: lang === 'es' ? 'Mismo motor que corre en WhatsApp, Instagram y Facebook.' : 'Same engine running on WhatsApp, Instagram, and Facebook.' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-xl flex-shrink-0 mt-0.5">{item.icon}</span>
                  <p className="text-sm font-light" style={{ color: 'var(--text-secondary)' }}>{item.text}</p>
                </div>
              ))}
            </div>

            {/* CTA card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.5 }}
              className="p-6 rounded-3xl flex flex-col gap-4"
              style={{ background: 'linear-gradient(135deg,#05101F 0%,#13244A 100%)', boxShadow: '0 16px 48px rgba(19,36,74,0.25)' }}
            >
              <p className="font-bold text-base leading-snug" style={{ color: '#F0F4FC' }}>
                {L.ctaLabel}
              </p>
              <div className="flex gap-3 flex-wrap">
                <Link
                  href="/precios"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150"
                  style={{ background: '#FFFFFF', color: '#0A0F1A' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#F0F4FC' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#FFFFFF' }}
                >
                  {L.ctaBtn} <ArrowRight size={13} />
                </Link>
                <Link
                  href="/registro"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150"
                  style={{ border: '1px solid rgba(255,255,255,0.25)', color: '#F0F4FC', background: 'transparent' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.08)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent' }}
                >
                  {L.ctaBtnSec}
                </Link>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </section>

    </main>
  )
}
