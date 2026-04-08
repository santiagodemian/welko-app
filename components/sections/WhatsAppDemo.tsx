'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '@/contexts/LangContext'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

interface Message {
  from: 'patient' | 'ai'
  text: string
  delay: number // ms from start
}

const CONVERSATIONS = {
  es: [
    { from: 'patient', text: 'Hola, ¿cuánto cuesta una limpieza dental?',            delay: 0 },
    { from: 'ai',      text: 'Hola 😊 Una limpieza dental cuesta $850 MXN. ¿Le gustaría agendar una cita?', delay: 1200 },
    { from: 'patient', text: 'Sí, ¿tienen lugar esta semana?',                       delay: 2600 },
    { from: 'ai',      text: 'Claro, tengo disponibilidad el jueves 10 a las 10:00 AM o el viernes 11 a las 4:00 PM. ¿Cuál le queda mejor?', delay: 3800 },
    { from: 'patient', text: 'El jueves está perfecto',                              delay: 5400 },
    { from: 'ai',      text: '✅ Listo, agendé su cita para el jueves 10 a las 10:00 AM. Le enviaré un recordatorio el día anterior. ¡Nos vemos pronto! 😊', delay: 6600 },
  ] as Message[],
  en: [
    { from: 'patient', text: 'Hi, how much does a dental cleaning cost?',           delay: 0 },
    { from: 'ai',      text: 'Hi 😊 A dental cleaning costs $850 MXN. Would you like to book an appointment?', delay: 1200 },
    { from: 'patient', text: 'Yes, do you have availability this week?',            delay: 2600 },
    { from: 'ai',      text: 'Of course! I have availability Thursday the 10th at 10:00 AM or Friday the 11th at 4:00 PM. Which works better for you?', delay: 3800 },
    { from: 'patient', text: 'Thursday works perfectly',                            delay: 5400 },
    { from: 'ai',      text: '✅ Done! Your appointment is booked for Thursday the 10th at 10:00 AM. I\'ll send you a reminder the day before. See you soon! 😊', delay: 6600 },
  ] as Message[],
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-3 py-2 rounded-2xl rounded-bl-sm w-fit" style={{ background: '#E5E7EB' }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full"
          style={{
            background: '#9CA3AF',
            animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  )
}

export function WhatsAppDemo() {
  const { lang } = useLang()
  const messages = CONVERSATIONS[lang as 'es' | 'en'] ?? CONVERSATIONS.es

  const [shown,    setShown]    = useState<Message[]>([])
  const [typing,   setTyping]   = useState(false)
  const [running,  setRunning]  = useState(false)
  const [done,     setDone]     = useState(false)

  function start() {
    setShown([])
    setTyping(false)
    setDone(false)
    setRunning(true)
  }

  useEffect(() => {
    if (!running) return
    const timers: ReturnType<typeof setTimeout>[] = []

    messages.forEach((msg, i) => {
      // Show typing indicator before AI messages
      if (msg.from === 'ai') {
        timers.push(setTimeout(() => setTyping(true), msg.delay - 900))
      }
      timers.push(setTimeout(() => {
        setTyping(false)
        setShown((prev) => [...prev, msg])
        if (i === messages.length - 1) { setDone(true); setRunning(false) }
      }, msg.delay + 300))
    })

    return () => timers.forEach(clearTimeout)
  }, [running, messages])

  const L = {
    eyebrow: lang === 'es' ? 'Demo en vivo'                                          : 'Live demo',
    heading: lang === 'es' ? 'Así responde tu recepcionista IA'                     : 'This is how your AI receptionist responds',
    sub:     lang === 'es' ? 'Responde, informa, agenda — sin que tú hagas nada.'   : 'Responds, informs, books — without you doing anything.',
    name:    lang === 'es' ? 'Clínica Dental Welko'                                  : 'Welko Dental Clinic',
    online:  lang === 'es' ? 'En línea · Recepcionista IA'                          : 'Online · AI Receptionist',
    play:    lang === 'es' ? 'Ver conversación'                                      : 'Watch conversation',
    replay:  lang === 'es' ? 'Repetir'                                               : 'Replay',
    patient: lang === 'es' ? 'Paciente'                                              : 'Patient',
    ai:      lang === 'es' ? 'IA · ahora'                                           : 'AI · now',
  }

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="max-w-5xl mx-auto flex flex-col gap-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE }}
          className="flex flex-col items-center text-center gap-3"
        >
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--accent-label)' }}>
            {L.eyebrow}
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            {L.heading}
          </h2>
          <p className="text-base font-light max-w-lg" style={{ color: 'var(--text-secondary)' }}>
            {L.sub}
          </p>
        </motion.div>

        {/* Phone mockup + context */}
        <div className="flex flex-col lg:flex-row items-center gap-10 justify-center">

          {/* Phone */}
          <motion.div
            initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
            className="flex-shrink-0"
          >
            <div
              className="relative w-[300px] rounded-[40px] overflow-hidden"
              style={{
                background: '#111',
                boxShadow: '0 32px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.08)',
                padding: '12px',
              }}
            >
              {/* WhatsApp UI */}
              <div className="rounded-[32px] overflow-hidden" style={{ background: '#ECE5DD' }}>
                {/* Header bar */}
                <div className="flex items-center gap-3 px-4 py-3" style={{ background: '#075E54' }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: '#128C7E' }}>
                    W
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm leading-none truncate">{L.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.7)' }}>{L.online}</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                </div>

                {/* Messages area */}
                <div className="flex flex-col gap-2 px-3 py-4 min-h-[380px]" style={{ background: '#ECE5DD' }}>
                  <AnimatePresence>
                    {shown.map((msg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.25, ease: EASE }}
                        className={`flex ${msg.from === 'patient' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className="max-w-[220px] px-3 py-2 rounded-2xl text-xs leading-relaxed relative"
                          style={
                            msg.from === 'patient'
                              ? { background: '#DCF8C6', color: '#111', borderBottomRightRadius: 4 }
                              : { background: '#FFFFFF', color: '#111', borderBottomLeftRadius: 4, boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }
                          }
                        >
                          {msg.text}
                          <span className="block text-right mt-1" style={{ fontSize: 9, color: 'rgba(0,0,0,0.4)' }}>
                            {msg.from === 'ai' ? '✓✓' : ''} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Typing indicator */}
                  <AnimatePresence>
                    {typing && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.2 }}
                        className="flex justify-start"
                      >
                        <TypingIndicator />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Play button overlay (when not started) */}
                  {!running && !done && shown.length === 0 && (
                    <div className="flex-1 flex items-center justify-center">
                      <button
                        onClick={start}
                        className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-200"
                        style={{ background: '#075E54', color: '#FFFFFF', boxShadow: '0 4px 16px rgba(7,94,84,0.4)' }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#128C7E' }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#075E54' }}
                      >
                        ▶ {L.play}
                      </button>
                    </div>
                  )}
                </div>

                {/* Input bar */}
                <div className="flex items-center gap-2 px-3 py-2" style={{ background: '#F0F0F0', borderTop: '1px solid #DDD' }}>
                  <div className="flex-1 rounded-full px-3 py-2 text-xs" style={{ background: '#FFF', color: '#9CA3AF' }}>
                    {lang === 'es' ? 'Escribe un mensaje...' : 'Type a message...'}
                  </div>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs" style={{ background: '#075E54' }}>
                    ➤
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Context bullets */}
          <motion.div
            initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.55, ease: EASE, delay: 0.2 }}
            className="flex flex-col gap-5 max-w-sm"
          >
            {[
              { icon: '⚡', title: lang === 'es' ? 'Responde en < 2 segundos' : 'Responds in < 2 seconds',
                desc: lang === 'es' ? 'Sin importar si es medianoche o domingo.' : 'No matter if it\'s midnight or Sunday.' },
              { icon: '📅', title: lang === 'es' ? 'Agenda en la misma conversación' : 'Books in the same conversation',
                desc: lang === 'es' ? 'Consulta disponibilidad y confirma la cita al instante.' : 'Checks availability and confirms the appointment instantly.' },
              { icon: '🔔', title: lang === 'es' ? 'Recordatorio automático' : 'Automatic reminder',
                desc: lang === 'es' ? 'Le avisa al paciente 24h antes para reducir no-shows.' : 'Reminds the patient 24h before to reduce no-shows.' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <span className="text-2xl flex-shrink-0 mt-0.5">{item.icon}</span>
                <div>
                  <p className="font-semibold text-sm mb-0.5" style={{ color: 'var(--text-primary)' }}>{item.title}</p>
                  <p className="text-sm font-light" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
                </div>
              </div>
            ))}

            {done && (
              <motion.button
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                onClick={start}
                className="self-start mt-2 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                style={{ border: '1.5px solid var(--border)', color: 'var(--text-secondary)', background: 'var(--surface)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-hover)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface)' }}
              >
                ↺ {L.replay}
              </motion.button>
            )}
          </motion.div>
        </div>

      </div>
    </section>
  )
}
