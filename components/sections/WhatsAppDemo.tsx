'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '@/contexts/LangContext'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

interface Msg { from: 'user' | 'ai'; text: string; delay: number }

const TABS = [
  { slug: 'dental',      emoji: '🦷', es: 'Dental',      en: 'Dental',      color: '#3B82F6' },
  { slug: 'restaurante', emoji: '🍽️', es: 'Restaurante', en: 'Restaurant',  color: '#F59E0B' },
  { slug: 'barberia',    emoji: '✂️', es: 'Barbería',     en: 'Barbershop',  color: '#8B5CF6' },
  { slug: 'hotel',       emoji: '🏨', es: 'Hotel',        en: 'Hotel',       color: '#0EA5E9' },
  { slug: 'fitness',     emoji: '💪', es: 'Fitness',      en: 'Fitness',     color: '#EF4444' },
  { slug: 'psicologia',  emoji: '🧠', es: 'Psicología',   en: 'Psychology',  color: '#6366F1' },
]

const DEMOS: Record<string, { es: { name: string; msgs: Msg[] }; en: { name: string; msgs: Msg[] } }> = {
  dental: {
    es: {
      name: 'Clínica Dental Welko',
      msgs: [
        { from: 'user', text: 'Hola, ¿cuánto cuesta una limpieza dental?', delay: 0 },
        { from: 'ai',   text: 'Hola 😊 Una limpieza dental cuesta $850 MXN. ¿Le gustaría agendar una cita?', delay: 1200 },
        { from: 'user', text: 'Sí, ¿tienen lugar esta semana?', delay: 2600 },
        { from: 'ai',   text: 'Claro, tengo disponibilidad el jueves a las 10:00 AM o el viernes a las 4:00 PM. ¿Cuál le queda mejor?', delay: 3800 },
        { from: 'user', text: 'El jueves está perfecto', delay: 5400 },
        { from: 'ai',   text: '✅ Listo, agendé su cita para el jueves a las 10:00 AM. Le enviaré un recordatorio el día anterior. ¡Nos vemos! 😊', delay: 6600 },
      ],
    },
    en: {
      name: 'Welko Dental Clinic',
      msgs: [
        { from: 'user', text: 'Hi, how much does a dental cleaning cost?', delay: 0 },
        { from: 'ai',   text: 'Hi 😊 A dental cleaning costs $850 MXN. Would you like to book an appointment?', delay: 1200 },
        { from: 'user', text: 'Yes, do you have availability this week?', delay: 2600 },
        { from: 'ai',   text: 'Of course! Thursday at 10:00 AM or Friday at 4:00 PM. Which works better?', delay: 3800 },
        { from: 'user', text: 'Thursday works perfectly', delay: 5400 },
        { from: 'ai',   text: '✅ Done! Booked for Thursday at 10:00 AM. I\'ll send a reminder the day before. See you soon! 😊', delay: 6600 },
      ],
    },
  },
  restaurante: {
    es: {
      name: 'Restaurante La Hacienda',
      msgs: [
        { from: 'user', text: '¿Tienen mesa para 4 personas el sábado a las 8?', delay: 0 },
        { from: 'ai',   text: '¡Hola! 😊 Sí, tengo disponibilidad el sábado a las 8:00 PM y a las 9:30 PM. ¿Cuál prefieren?', delay: 1100 },
        { from: 'user', text: 'A las 8, es el cumpleaños de mi esposa 🎂', delay: 2500 },
        { from: 'ai',   text: '¡Qué especial! ¿El nombre para la reservación, por favor?', delay: 3400 },
        { from: 'user', text: 'Carlos Mendoza', delay: 4800 },
        { from: 'ai',   text: '✅ Reservación confirmada: Carlos Mendoza · 4 personas · sáb 8:00 PM. ¡Los esperamos para celebrar! 🥂', delay: 5900 },
      ],
    },
    en: {
      name: 'La Hacienda Restaurant',
      msgs: [
        { from: 'user', text: 'Do you have a table for 4 on Saturday at 8?', delay: 0 },
        { from: 'ai',   text: 'Hi! 😊 Yes, available Saturday at 8:00 PM or 9:30 PM. Which do you prefer?', delay: 1100 },
        { from: 'user', text: 'At 8 — it\'s my wife\'s birthday 🎂', delay: 2500 },
        { from: 'ai',   text: 'How lovely! What name for the reservation?', delay: 3400 },
        { from: 'user', text: 'Carlos Mendoza', delay: 4800 },
        { from: 'ai',   text: '✅ Confirmed: Carlos Mendoza · 4 people · Sat 8:00 PM. See you to celebrate! 🥂', delay: 5900 },
      ],
    },
  },
  barberia: {
    es: {
      name: 'Barbería El Corte Maestro',
      msgs: [
        { from: 'user', text: '¿Cuánto cuesta corte + arreglo de barba?', delay: 0 },
        { from: 'ai',   text: '¡Hola! 💈 Corte + barba cuesta $280 MXN. ¿Te agendo un turno?', delay: 1000 },
        { from: 'user', text: 'Sí, ¿mañana por la tarde?', delay: 2200 },
        { from: 'ai',   text: 'Tengo mañana a las 4:00 PM o a las 5:30 PM. ¿Cuál te va?', delay: 3100 },
        { from: 'user', text: 'A las 5:30 🙌', delay: 4400 },
        { from: 'ai',   text: '✅ Turno agendado para mañana a las 5:30 PM. ¡Te esperamos! ✂️', delay: 5400 },
      ],
    },
    en: {
      name: 'El Corte Maestro Barbershop',
      msgs: [
        { from: 'user', text: 'How much is a haircut + beard trim?', delay: 0 },
        { from: 'ai',   text: 'Hey! 💈 Haircut + beard is $280 MXN. Want to book a slot?', delay: 1000 },
        { from: 'user', text: 'Yes, tomorrow afternoon?', delay: 2200 },
        { from: 'ai',   text: 'Available tomorrow at 4:00 PM or 5:30 PM. Which works?', delay: 3100 },
        { from: 'user', text: '5:30 PM 🙌', delay: 4400 },
        { from: 'ai',   text: '✅ Booked for tomorrow at 5:30 PM. See you then! ✂️', delay: 5400 },
      ],
    },
  },
  hotel: {
    es: {
      name: 'Hotel Boutique Casa Luna',
      msgs: [
        { from: 'user', text: '¿Cuánto cuesta habitación doble este fin de semana?', delay: 0 },
        { from: 'ai',   text: '¡Hola! 🏨 La habitación doble desde $1,800 MXN/noche. ¿Viernes y sábado?', delay: 1200 },
        { from: 'user', text: 'Sí, somos 2 personas', delay: 2400 },
        { from: 'ai',   text: 'Tengo disponibilidad. Total: $3,600 MXN por 2 noches. ¿Lo confirmo a tu nombre?', delay: 3400 },
        { from: 'user', text: 'Sí, Sofía Ramírez', delay: 4900 },
        { from: 'ai',   text: '✅ Reservación confirmada: Sofía Ramírez · vie–sáb · 2 personas. ¡Bienvenida! 🌙', delay: 6000 },
      ],
    },
    en: {
      name: 'Casa Luna Boutique Hotel',
      msgs: [
        { from: 'user', text: 'How much is a double room this weekend?', delay: 0 },
        { from: 'ai',   text: 'Hi! 🏨 Double room from $1,800 MXN/night. Friday and Saturday?', delay: 1200 },
        { from: 'user', text: 'Yes, 2 people', delay: 2400 },
        { from: 'ai',   text: 'Available those nights. Total: $3,600 MXN for 2 nights. Confirm your name?', delay: 3400 },
        { from: 'user', text: 'Sofía Ramírez', delay: 4900 },
        { from: 'ai',   text: '✅ Confirmed: Sofía Ramírez · Fri–Sat · 2 guests. Welcome! 🌙', delay: 6000 },
      ],
    },
  },
  fitness: {
    es: {
      name: 'Iron Power Gym',
      msgs: [
        { from: 'user', text: '¿Cuánto cuesta la membresía mensual?', delay: 0 },
        { from: 'ai',   text: '¡Hola! 💪 La membresía es $699 MXN/mes — acceso ilimitado + clases. ¿Quieres visitarnos?', delay: 1100 },
        { from: 'user', text: 'Sí, ¿puedo ir mañana a conocer?', delay: 2300 },
        { from: 'ai',   text: '¡Claro! ¿Mañana a las 9:00 AM o a las 6:00 PM te queda mejor?', delay: 3200 },
        { from: 'user', text: 'A las 9 AM 💪', delay: 4400 },
        { from: 'ai',   text: '✅ Visita agendada para mañana a las 9:00 AM. ¡Pregunta por nuestro asesor al llegar! 🏋️', delay: 5400 },
      ],
    },
    en: {
      name: 'Iron Power Gym',
      msgs: [
        { from: 'user', text: 'How much is the monthly membership?', delay: 0 },
        { from: 'ai',   text: 'Hey! 💪 Monthly membership is $699 MXN — unlimited access + classes. Want to visit?', delay: 1100 },
        { from: 'user', text: 'Yes, can I come check it out tomorrow?', delay: 2300 },
        { from: 'ai',   text: 'Sure! Tomorrow at 9:00 AM or 6:00 PM?', delay: 3200 },
        { from: 'user', text: '9 AM 💪', delay: 4400 },
        { from: 'ai',   text: '✅ Visit booked for tomorrow at 9:00 AM. Ask for our advisor when you arrive! 🏋️', delay: 5400 },
      ],
    },
  },
  psicologia: {
    es: {
      name: 'Centro de Psicología Bienestar',
      msgs: [
        { from: 'user', text: 'Hola, ¿cuánto cuesta una consulta de psicología?', delay: 0 },
        { from: 'ai',   text: 'Hola 😊 La consulta inicial es $950 MXN (50 min). ¿Te gustaría agendar?', delay: 1200 },
        { from: 'user', text: 'Sí, ¿tienen esta semana?', delay: 2400 },
        { from: 'ai',   text: 'Tengo el miércoles a las 6:00 PM o el jueves a las 10:00 AM. ¿Cuál prefieres?', delay: 3400 },
        { from: 'user', text: 'El miércoles a las 6 🙏', delay: 4800 },
        { from: 'ai',   text: '✅ Sesión agendada para el miércoles a las 6:00 PM. Te envío recordatorio el día anterior. ¡Aquí estamos para ti! 🌱', delay: 5900 },
      ],
    },
    en: {
      name: 'Bienestar Psychology Center',
      msgs: [
        { from: 'user', text: 'Hi, how much is a psychology session?', delay: 0 },
        { from: 'ai',   text: 'Hi 😊 Initial session is $950 MXN (50 min). Would you like to book?', delay: 1200 },
        { from: 'user', text: 'Yes, do you have availability this week?', delay: 2400 },
        { from: 'ai',   text: 'Wednesday at 6:00 PM or Thursday at 10:00 AM. Which do you prefer?', delay: 3400 },
        { from: 'user', text: 'Wednesday at 6 🙏', delay: 4800 },
        { from: 'ai',   text: '✅ Session booked for Wednesday at 6:00 PM. I\'ll send a reminder the day before. We\'re here for you! 🌱', delay: 5900 },
      ],
    },
  },
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-3 py-2 rounded-2xl rounded-bl-sm w-fit" style={{ background: '#E5E7EB' }}>
      {[0, 1, 2].map((i) => (
        <span key={i} className="w-1.5 h-1.5 rounded-full"
          style={{ background: '#9CA3AF', animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
      ))}
      <style>{`@keyframes bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}`}</style>
    </div>
  )
}

export function WhatsAppDemo() {
  const { lang } = useLang()
  const isEN = lang === 'en'

  const [tab,     setTab]     = useState('dental')
  const [shown,   setShown]   = useState<Msg[]>([])
  const [typing,  setTyping]  = useState(false)
  const [running, setRunning] = useState(false)
  const [done,    setDone]    = useState(false)

  const tabInfo  = TABS.find(t => t.slug === tab) ?? TABS[0]
  const demoData = (DEMOS[tab] ?? DEMOS.dental)[isEN ? 'en' : 'es']
  const messages = demoData.msgs

  function start() { setShown([]); setTyping(false); setDone(false); setRunning(true) }

  function selectTab(slug: string) {
    setTab(slug); setShown([]); setTyping(false); setDone(false); setRunning(false)
  }

  useEffect(() => {
    if (!running) return
    const timers: ReturnType<typeof setTimeout>[] = []
    messages.forEach((msg, i) => {
      if (msg.from === 'ai') timers.push(setTimeout(() => setTyping(true), msg.delay - 900))
      timers.push(setTimeout(() => {
        setTyping(false)
        setShown(prev => [...prev, msg])
        if (i === messages.length - 1) { setDone(true); setRunning(false) }
      }, msg.delay + 300))
    })
    return () => timers.forEach(clearTimeout)
  }, [running, messages])

  const L = {
    eyebrow: isEN ? 'Live demo'                                                    : 'Demo en vivo',
    heading: isEN ? 'This is how your AI receptionist responds'                    : 'Así responde tu recepcionista IA',
    sub:     isEN ? 'Responds, informs, books — without you doing anything.'       : 'Responde, informa, agenda — sin que tú hagas nada.',
    online:  isEN ? 'Online · AI Receptionist'                                     : 'En línea · Recepcionista IA',
    play:    isEN ? 'Watch conversation'                                           : 'Ver conversación',
    replay:  isEN ? 'Replay'                                                       : 'Repetir',
    inputPh: isEN ? 'Type a message...'                                            : 'Escribe un mensaje...',
  }

  const bullets = [
    { icon: '⚡',
      title: isEN ? 'Responds in < 2 seconds'          : 'Responde en < 2 segundos',
      desc:  isEN ? 'No matter if it\'s midnight or Sunday.' : 'Sin importar si es medianoche o domingo.' },
    { icon: '📅',
      title: isEN ? 'Books in the same conversation'   : 'Agenda en la misma conversación',
      desc:  isEN ? 'Checks availability and confirms instantly.' : 'Consulta disponibilidad y confirma al instante.' },
    { icon: '🔔',
      title: isEN ? 'Automatic reminder'               : 'Recordatorio automático',
      desc:  isEN ? 'Reminds clients before their booking.' : 'Avisa al cliente antes de su cita o reserva.' },
  ]

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="max-w-5xl mx-auto flex flex-col gap-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE }}
          className="flex flex-col items-center text-center gap-3"
        >
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--accent-label)' }}>{L.eyebrow}</span>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>{L.heading}</h2>
          <p className="text-base font-light max-w-lg" style={{ color: 'var(--text-secondary)' }}>{L.sub}</p>
        </motion.div>

        {/* Industry tabs */}
        <div className="flex flex-wrap gap-2 justify-center">
          {TABS.map(t => (
            <button key={t.slug} onClick={() => selectTab(t.slug)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-150"
              style={{
                background:  tab === t.slug ? t.color : t.color + '12',
                border:      `1px solid ${tab === t.slug ? t.color : t.color + '28'}`,
                color:       tab === t.slug ? '#fff' : t.color,
                transform:   tab === t.slug ? 'scale(1.04)' : 'scale(1)',
              }}>
              {t.emoji} {isEN ? t.en : t.es}
            </button>
          ))}
        </div>

        {/* Phone + bullets */}
        <div className="flex flex-col lg:flex-row items-center gap-10 justify-center">

          {/* Phone mockup */}
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="flex-shrink-0"
          >
            <div className="relative w-[300px] rounded-[40px] overflow-hidden"
              style={{ background: '#111', boxShadow: '0 32px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.08)', padding: '12px' }}>
              <div className="rounded-[32px] overflow-hidden" style={{ background: '#ECE5DD' }}>

                {/* WA header */}
                <div className="flex items-center gap-3 px-4 py-3" style={{ background: '#075E54' }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{ background: tabInfo.color }}>
                    {demoData.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm leading-none truncate">{demoData.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.7)' }}>{L.online}</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                </div>

                {/* Messages */}
                <div className="flex flex-col gap-2 px-3 py-4 min-h-[380px]" style={{ background: '#ECE5DD' }}>
                  <AnimatePresence>
                    {shown.map((msg, i) => (
                      <motion.div key={i}
                        initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.25, ease: EASE }}
                        className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className="max-w-[220px] px-3 py-2 rounded-2xl text-xs leading-relaxed"
                          style={msg.from === 'user'
                            ? { background: '#DCF8C6', color: '#111', borderBottomRightRadius: 4 }
                            : { background: '#FFFFFF', color: '#111', borderBottomLeftRadius: 4, boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                          {msg.text}
                          <span className="block text-right mt-1" style={{ fontSize: 9, color: 'rgba(0,0,0,0.4)' }}>
                            {msg.from === 'ai' ? '✓✓ ' : ''}{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  <AnimatePresence>
                    {typing && (
                      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }} className="flex justify-start">
                        <TypingIndicator />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {!running && !done && shown.length === 0 && (
                    <div className="flex-1 flex items-center justify-center">
                      <button onClick={start}
                        className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold"
                        style={{ background: '#075E54', color: '#FFFFFF', boxShadow: '0 4px 16px rgba(7,94,84,0.4)' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#128C7E' }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#075E54' }}>
                        ▶ {L.play}
                      </button>
                    </div>
                  )}
                </div>

                {/* Input bar */}
                <div className="flex items-center gap-2 px-3 py-2" style={{ background: '#F0F0F0', borderTop: '1px solid #DDD' }}>
                  <div className="flex-1 rounded-full px-3 py-2 text-xs" style={{ background: '#FFF', color: '#9CA3AF' }}>{L.inputPh}</div>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs" style={{ background: '#075E54' }}>➤</div>
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
            {bullets.map((item, i) => (
              <div key={i} className="flex gap-4">
                <span className="text-2xl flex-shrink-0 mt-0.5">{item.icon}</span>
                <div>
                  <p className="font-semibold text-sm mb-0.5" style={{ color: 'var(--text-primary)' }}>{item.title}</p>
                  <p className="text-sm font-light" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
                </div>
              </div>
            ))}

            {done && (
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                onClick={start}
                className="self-start mt-2 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                style={{ border: '1.5px solid var(--border)', color: 'var(--text-secondary)', background: 'var(--surface)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-hover)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface)' }}>
                ↺ {L.replay}
              </motion.button>
            )}
          </motion.div>
        </div>

      </div>
    </section>
  )
}
