'use client'

import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { X, ArrowRight, ArrowLeft, Sparkles, HelpCircle } from 'lucide-react'

interface TourStep {
  target?: string          // data-tour attribute value
  title: string
  description: string
  position?: 'right' | 'bottom' | 'left' | 'top' | 'center'
  emoji?: string
}

const STEPS: TourStep[] = [
  {
    title: '¡Bienvenido a Welko!',
    description: 'Tu recepcionista IA ya está lista. En menos de 2 minutos te mostramos todo lo que puedes hacer desde aquí. ¿Comenzamos?',
    position: 'center',
  },
  {
    target: 'tour-inicio',
    title: 'Inicio — Tu centro de control',
    description: 'Aquí ves de un vistazo: el Health Score de tu negocio, lo que tu IA está aprendiendo en tiempo real (Cerebro IA), y las próximas citas con riesgo de no-show.',
    position: 'right',
  },
  {
    target: 'tour-score',
    title: 'Estado de tu IA',
    description: 'Este % muestra qué tan bien entrenada está tu IA. A más información agregues en el onboarding, mejores y más precisas serán sus respuestas. Las píldoras azules te dicen exactamente qué agregar para subir el score.',
    position: 'bottom',
  },
  {
    target: 'tour-conversaciones',
    title: 'Conversaciones — Tu pipeline de pacientes',
    description: 'Vista Kanban con todos tus pacientes organizados por etapa: Nuevo → Agendado → Confirmado → Atendido. Cada tarjeta muestra el canal, el valor de la cita y el riesgo de no-show calculado por la IA.',
    position: 'right',
  },
  {
    target: 'tour-citas',
    title: 'Citas — Vista lista y calendario',
    description: 'Todas tus citas próximas con análisis de riesgo. Las marcadas en rojo tienen alta probabilidad de no asistir — Welko les manda un recordatorio extra automáticamente.',
    position: 'right',
  },
  {
    target: 'tour-canales',
    title: 'Canales — Todo en un solo lugar',
    description: 'Conecta y gestiona WhatsApp, Instagram, Facebook, Llamadas de voz y el widget de tu sitio web. Una vez conectado, la IA responde en todos los canales 24/7.',
    position: 'right',
  },
  {
    target: 'tour-ia',
    title: 'IA & Negocio — El cerebro de tu recepcionista',
    description: 'Aquí configuras cómo habla tu IA, editas las respuestas más frecuentes, activas el Modo Ocupado para días de cirugía, y ajustas el tiempo de respuesta para que se sienta más humana.',
    position: 'right',
  },
  {
    title: '¡Listo para empezar!',
    description: 'Eso es todo. Si en algún momento tienes dudas, el ícono de ayuda en la esquina inferior derecha muestra esta guía de nuevo. ¡Mucho éxito con tu recepcionista IA!',
    position: 'center',
  },
]

const NAVY = '#13244A'

function getElementRect(tourId: string): DOMRect | null {
  const el = document.querySelector(`[data-tour="${tourId}"]`)
  if (!el) return null
  return el.getBoundingClientRect()
}

function Tooltip({
  step,
  index,
  total,
  rect,
  onNext,
  onPrev,
  onSkip,
}: {
  step: TourStep
  index: number
  total: number
  rect: DOMRect | null
  onNext: () => void
  onPrev: () => void
  onSkip: () => void
}) {
  const isCenter = step.position === 'center' || !rect
  const isLast   = index === total - 1
  const isFirst  = index === 0

  let tooltipStyle: React.CSSProperties = {
    position: 'fixed',
    zIndex: 99999,
    width: 320,
    background: '#FFFFFF',
    borderRadius: 16,
    padding: '20px 22px',
    boxShadow: '0 24px 64px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)',
  }

  if (isCenter) {
    tooltipStyle = {
      ...tooltipStyle,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    }
  } else if (rect) {
    const pad = 16
    if (step.position === 'right') {
      tooltipStyle.top  = Math.max(12, rect.top + rect.height / 2 - 120)
      tooltipStyle.left = rect.right + pad
    } else if (step.position === 'left') {
      tooltipStyle.top  = Math.max(12, rect.top + rect.height / 2 - 120)
      tooltipStyle.right = window.innerWidth - rect.left + pad
    } else if (step.position === 'bottom') {
      tooltipStyle.top  = rect.bottom + pad
      tooltipStyle.left = Math.max(12, rect.left + rect.width / 2 - 160)
    } else {
      tooltipStyle.bottom = window.innerHeight - rect.top + pad
      tooltipStyle.left   = Math.max(12, rect.left + rect.width / 2 - 160)
    }
  }

  return (
    <div style={tooltipStyle}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12, gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: NAVY, margin: 0, lineHeight: 1.3 }}>{step.title}</h3>
        </div>
        <button onClick={onSkip} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 2, flexShrink: 0 }}>
          <X size={16} />
        </button>
      </div>

      {/* Description */}
      <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.6, margin: '0 0 18px' }}>
        {step.description}
      </p>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Step dots */}
        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} style={{
              width: i === index ? 18 : 6,
              height: 6, borderRadius: 99,
              background: i === index ? NAVY : '#D1D5DB',
              transition: 'all 0.2s',
            }} />
          ))}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 8 }}>
          {!isFirst && (
            <button onClick={onPrev}
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 9, border: '1px solid #E5E7EB', background: '#F9FAFB', color: '#6B7280', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
              <ArrowLeft size={12} /> Atrás
            </button>
          )}
          <button onClick={onNext}
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 9, background: NAVY, color: '#fff', fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
            {isLast ? 'Comenzar' : 'Siguiente'} <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  )
}

export function ProductTour() {
  const [active,  setActive]  = useState(false)
  const [index,   setIndex]   = useState(0)
  const [rect,    setRect]    = useState<DOMRect | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const seen = localStorage.getItem('welko_tour_done')
    if (!seen) {
      // Small delay so layout renders first
      const t = setTimeout(() => setActive(true), 1200)
      return () => clearTimeout(t)
    }
  }, [])

  const updateRect = useCallback((stepIndex: number) => {
    const target = STEPS[stepIndex].target
    if (!target) { setRect(null); return }
    const r = getElementRect(target)
    setRect(r)
  }, [])

  useEffect(() => {
    if (active) updateRect(index)
  }, [active, index, updateRect])

  function next() {
    if (index < STEPS.length - 1) {
      const next = index + 1
      setIndex(next)
      updateRect(next)
    } else {
      finish()
    }
  }

  function prev() {
    if (index > 0) {
      const prev = index - 1
      setIndex(prev)
      updateRect(prev)
    }
  }

  function finish() {
    localStorage.setItem('welko_tour_done', '1')
    setActive(false)
  }

  if (!mounted) return null

  const step = STEPS[index]
  const hasTarget = !!step.target && !!rect

  return (
    <>
      {/* Re-launch button */}
      <button
        onClick={() => { setIndex(0); setRect(null); setActive(true) }}
        style={{
          position: 'fixed', bottom: 20, right: 20, zIndex: 9998,
          width: 40, height: 40, borderRadius: '50%',
          background: NAVY, color: '#fff', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(19,36,74,0.3)',
          }}
        title="Ver guía de Welko"
      >
        <HelpCircle size={18} />
      </button>

      {active && createPortal(
        <>
          {/* Overlay */}
          <div style={{
            position: 'fixed', inset: 0, zIndex: 99990,
            background: 'rgba(0,0,0,0.55)',
            transition: 'background 0.3s',
          }} onClick={finish} />

          {/* Spotlight — cutout around target element */}
          {hasTarget && rect && (
            <div style={{
              position: 'fixed', zIndex: 99991,
              top: rect.top - 6,
              left: rect.left - 6,
              width: rect.width + 12,
              height: rect.height + 12,
              borderRadius: 12,
              boxShadow: '0 0 0 4px #60A5FA, 0 0 0 9999px rgba(0,0,0,0)',
              pointerEvents: 'none',
              transition: 'all 0.3s ease',
              animation: 'tourPulse 1.8s ease-in-out infinite',
            }} />
          )}

          {/* Tooltip */}
          <Tooltip
            step={step}
            index={index}
            total={STEPS.length}
            rect={rect}
            onNext={next}
            onPrev={prev}
            onSkip={finish}
          />

          <style>{`
            @keyframes tourPulse {
              0%, 100% { box-shadow: 0 0 0 4px #60A5FA, 0 0 0 9999px rgba(0,0,0,0.55); }
              50%       { box-shadow: 0 0 0 6px #93C5FD, 0 0 0 9999px rgba(0,0,0,0.55); }
            }
          `}</style>
        </>,
        document.body
      )}
    </>
  )
}
