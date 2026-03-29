'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw } from 'lucide-react'

/* ─── Design tokens ─── */
const ACCENT = '#22C55E'
const NAVY   = '#1A2A56'
const CARD   = 'rgba(255,255,255,0.07)'
const BORDER = 'rgba(255,255,255,0.12)'
const TICK   = 150

/* ─── Deterministic waveform heights ─── */
const BARS = Array.from({ length: 52 }, (_, i) =>
  18 + Math.abs(Math.sin(i * 0.42)) * 52 + Math.abs(Math.sin(i * 1.3)) * 20
)

type Tab = 'dental' | 'estetica' | 'nutricion'
interface Msg { role: 'agent' | 'patient'; text: string; at: number }

const SCENARIOS: Record<Tab, { label: string; dur: number; src: string; msgs: Msg[] }> = {
  dental: {
    label: 'Dental', dur: 29, src: '/dental.mp3',
    msgs: [
      { role: 'agent',   text: 'Hola, gracias por comunicarse con Clínica Dental Sonrisa. Soy Welko, su asistente virtual. ¿En qué le puedo ayudar?', at: 1  },
      { role: 'patient', text: 'Hola, quiero agendar una limpieza dental.',                                                                           at: 20 },
      { role: 'agent',   text: 'Con mucho gusto. Tenemos disponibilidad este jueves a las 10 AM y viernes a las 3 PM. ¿Cuál le funciona mejor?',      at: 30 },
      { role: 'patient', text: 'El jueves perfecto.',                                                                                                  at: 56 },
      { role: 'agent',   text: '¡Listo! Cita confirmada para el jueves a las 10 AM. Le enviaré un recordatorio 24 horas antes. ¿Algo más?',          at: 62 },
      { role: 'patient', text: 'No, muchas gracias.',                                                                                                  at: 87 },
      { role: 'agent',   text: 'Un placer. ¡Que tenga excelente día! 😊',                                                                             at: 92 },
    ],
  },
  estetica: {
    label: 'Estética', dur: 33, src: '/estetica.mp3',
    // Calibrated to 33.41s — ~3.7 wps with ~1.5s pauses between turns
    msgs: [
      { role: 'agent',   text: 'Bienvenida al Centro Estética Lumina. Soy Welko. ¿Cómo puedo ayudarle hoy?',                                                                 at: 1  }, // 0s
      { role: 'patient', text: 'Quiero saber sobre el tratamiento de botox.',                                                                                                 at: 15 }, // ~5s
      { role: 'agent',   text: 'El botox tiene duración de 4 a 6 meses y el procedimiento toma ~20 minutos. Iniciamos desde $3,500 MXN. ¿Le gustaría una consulta gratuita?', at: 25 }, // ~8.4s
      { role: 'patient', text: 'Sí, ¿cuándo tienen disponibilidad?',                                                                                                          at: 56 }, // ~18.7s
      { role: 'agent',   text: 'Tenemos este sábado a las 11 AM o el lunes a las 5 PM. ¿Cuál prefiere?',                                                                     at: 66 }, // ~22s
      { role: 'patient', text: 'El sábado a las 11, perfecto.',                                                                                                               at: 82 }, // ~27.4s
      { role: 'agent',   text: '¡Agendado! Le confirmo por WhatsApp. ¡Hasta el sábado! 💫',                                                                                  at: 91 }, // ~30.4s
    ],
  },
  nutricion: {
    label: 'Nutrición', dur: 32, src: '/nutricion.mp3',
    // Calibrated to 32.1s — ~3.7 wps with ~1.5s pauses between turns
    msgs: [
      { role: 'agent',   text: 'Hola, bienvenido al Centro Vital. Soy Welko. ¿En qué le ayudo?',                                                                          at: 1  }, // 0s
      { role: 'patient', text: 'Busco un plan de alimentación para bajar de peso.',                                                                                        at: 16 }, // ~5.1s
      { role: 'agent',   text: 'Ofrecemos consultas personalizadas con nutróloga certificada. La primera incluye evaluación completa y plan inicial. ¿Le agendaría?',      at: 28 }, // ~9s
      { role: 'patient', text: '¿Cuánto cuesta?',                                                                                                                          at: 56 }, // ~18s
      { role: 'agent',   text: 'La primera consulta es $650 MXN e incluye seguimiento por WhatsApp durante 30 días. ¿Le reservo un horario?',                              at: 62 }, // ~19.9s
      { role: 'patient', text: 'Sí, ¿tienen mañana en la tarde?',                                                                                                          at: 86 }, // ~27.6s
      { role: 'agent',   text: 'Tenemos mañana a las 4 PM o 6 PM. ¿Cuál prefiere?',                                                                                       at: 93 }, // ~29.8s
    ],
  },
}

export function HearItSection() {
  const [tab, setTab]         = useState<Tab>('dental')
  const [playing, setPlaying] = useState(false)
  const [progress, setProg]   = useState(0)
  const [useFallback, setUseFallback] = useState(false)

  const audioRef = useRef<HTMLAudioElement>(null)
  const itvRef   = useRef<ReturnType<typeof setInterval> | null>(null)

  const s       = SCENARIOS[tab]
  const visible = s.msgs.filter((m) => m.at <= progress)
  const elapsed = Math.round((progress / 100) * s.dur)
  const fmt     = (sec: number) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`

  /* Reset state when tab changes */
  useEffect(() => {
    if (itvRef.current) clearInterval(itvRef.current)
    setPlaying(false)
    setProg(0)
    setUseFallback(false)
  }, [tab])

  /* Fallback interval timer (when audio file not available) */
  useEffect(() => {
    if (!useFallback || !playing) return
    const step = (100 / (s.dur * 1000)) * TICK
    itvRef.current = setInterval(() => {
      setProg((p) => {
        const next = p + step
        if (next >= 100) { clearInterval(itvRef.current!); setPlaying(false); return 100 }
        return next
      })
    }, TICK)
    return () => { if (itvRef.current) clearInterval(itvRef.current) }
  }, [useFallback, playing, s.dur])

  function toggle() {
    const audio = audioRef.current

    if (playing) {
      audio?.pause()
      if (itvRef.current) clearInterval(itvRef.current)
      setPlaying(false)
      return
    }

    if (progress >= 100) {
      setProg(0)
      if (audio) audio.currentTime = 0
    }

    if (useFallback || !audio) {
      setPlaying(true)
      return // fallback useEffect handles the timer
    }

    // Try real audio playback
    audio.play()
      .then(() => setPlaying(true))
      .catch(() => {
        setUseFallback(true)
        setPlaying(true)
      })
  }

  function reset() {
    const audio = audioRef.current
    audio?.pause()
    if (audio) audio.currentTime = 0
    if (itvRef.current) clearInterval(itvRef.current)
    setPlaying(false)
    setProg(0)
  }

  return (
    <section style={{ background: NAVY, padding: '96px 16px' }}>

      {/* Hidden native audio element — key forces remount on tab change */}
      <audio
        key={tab}
        ref={audioRef}
        src={s.src}
        preload="auto"
        onTimeUpdate={() => {
          const a = audioRef.current
          if (a && a.duration > 0 && !useFallback) {
            setProg((a.currentTime / a.duration) * 100)
          }
        }}
        onEnded={() => {
          if (itvRef.current) clearInterval(itvRef.current)
          setPlaying(false)
          setProg(100)
        }}
        onError={() => setUseFallback(true)}
      />

      <div style={{ maxWidth: 780, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 40 }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 10 }}
        >
          <span style={{ color: ACCENT, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Demo interactivo
          </span>
          <h2 style={{ color: '#FFFFFF', fontSize: 'clamp(28px, 5vw, 38px)', fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.15, margin: 0 }}>
            Escúchalo tú mismo
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 16, lineHeight: 1.6, margin: 0 }}>
            Así suena Welko atendiendo a tus pacientes. 24/7, sin errores, sin esperas.
          </p>
        </motion.div>

        {/* Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{
            display: 'flex', gap: 3, padding: 4, borderRadius: 14,
            background: 'rgba(0,0,0,0.3)', border: `1px solid ${BORDER}`,
          }}>
            {(Object.keys(SCENARIOS) as Tab[]).map((key) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                style={{
                  padding: '8px 22px', borderRadius: 10, fontSize: 13,
                  cursor: 'pointer', border: 'none', transition: 'all 0.2s',
                  fontWeight: tab === key ? 700 : 500,
                  background: tab === key ? ACCENT : 'transparent',
                  color:      tab === key ? '#000000' : 'rgba(255,255,255,0.55)',
                }}
              >
                {SCENARIOS[key].label}
              </button>
            ))}
          </div>
        </div>

        {/* Player card */}
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          style={{
            borderRadius: 24, overflow: 'hidden',
            background: CARD, border: `1px solid ${BORDER}`,
            boxShadow: '0 40px 100px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)',
          }}
        >
          {/* Waveform + controls */}
          <div style={{ padding: '32px 32px 24px', borderBottom: `1px solid ${BORDER}` }}>

            {/* Bars — animate only while playing */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 60, marginBottom: 14 }}>
              {BARS.map((h, i) => {
                const past = (i / BARS.length) * 100 <= progress && progress > 0
                return (
                  <div
                    key={i}
                    className={playing ? 'welko-wave-bar' : ''}
                    style={{
                      flex: 1, height: `${h}%`, borderRadius: 2,
                      background: past ? ACCENT : 'rgba(255,255,255,0.18)',
                      transformOrigin: 'center',
                      animationDelay: `${(i * 0.024) % 0.72}s`,
                      transition: 'background 0.2s',
                    }}
                  />
                )
              })}
            </div>

            {/* Progress track */}
            <div style={{ height: 2, background: 'rgba(255,255,255,0.14)', borderRadius: 99, overflow: 'hidden', marginBottom: 20 }}>
              <div style={{ height: '100%', width: `${progress}%`, background: ACCENT, borderRadius: 99, transition: 'width 0.15s linear' }} />
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <button
                onClick={toggle}
                style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: ACCENT, border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, boxShadow: `0 0 28px ${ACCENT}44`, transition: 'transform 0.12s',
                }}
                onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
                onMouseUp={(e)   => (e.currentTarget.style.transform = 'scale(1)')}
              >
                {playing
                  ? <Pause size={17} color="#000" fill="#000" />
                  : <Play  size={17} color="#000" fill="#000" style={{ marginLeft: 2 }} />
                }
              </button>

              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontVariantNumeric: 'tabular-nums' }}>
                {fmt(elapsed)} / {fmt(s.dur)}
              </span>

              <div style={{ flex: 1 }} />

              {progress > 0 && !playing && (
                <button onClick={reset} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', display: 'flex', padding: 4 }}>
                  <RotateCcw size={14} />
                </button>
              )}

              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '5px 12px', borderRadius: 99,
                background: `${ACCENT}18`, border: `1px solid ${ACCENT}35`,
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: '50%', background: ACCENT, flexShrink: 0,
                  animation: playing ? 'welko-pulse 1s ease-in-out infinite' : 'none',
                }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: ACCENT, letterSpacing: '0.07em' }}>
                  {playing ? 'EN VIVO' : progress === 0 ? 'DEMO' : 'PAUSADO'}
                </span>
              </div>
            </div>
          </div>

          {/* Transcript */}
          <div style={{ padding: '24px 32px', minHeight: 220 }}>
            <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)', margin: '0 0 14px' }}>
              Transcripción en tiempo real
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 220, overflowY: 'auto' }}>
              {progress === 0 && !playing && (
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, textAlign: 'center', marginTop: 28 }}>
                  Presiona ▶ para iniciar la demostración
                </p>
              )}
              <AnimatePresence>
                {visible.map((msg, i) => (
                  <motion.div
                    key={`${tab}-${i}`}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28 }}
                    style={{ display: 'flex', justifyContent: msg.role === 'agent' ? 'flex-start' : 'flex-end' }}
                  >
                    <div style={{
                      maxWidth: '80%', padding: '9px 13px',
                      borderRadius: msg.role === 'agent' ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
                      background: msg.role === 'agent' ? `${ACCENT}15` : 'rgba(255,255,255,0.1)',
                      border: `1px solid ${msg.role === 'agent' ? `${ACCENT}30` : 'rgba(255,255,255,0.14)'}`,
                      fontSize: 13, lineHeight: 1.55, color: '#F9FAFB',
                    }}>
                      {msg.role === 'agent' && (
                        <p style={{ fontSize: 9, fontWeight: 800, color: ACCENT, margin: '0 0 3px', letterSpacing: '0.07em' }}>
                          WELKO IA
                        </p>
                      )}
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.28)' }}>
          * Simulación de demostración. El producto real opera por WhatsApp Business y voz.
        </p>
      </div>
    </section>
  )
}
