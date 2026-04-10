'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { X, ChevronRight, ChevronLeft, Zap } from 'lucide-react'

const STORAGE_KEY = 'welko_tour_done_v1'

interface TourStep {
  target: string | null   // data-tour attribute value, null = centered
  title: string
  body: string
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center'
}

const STEPS: TourStep[] = [
  {
    target: null,
    placement: 'center',
    title: '¡Bienvenido a tu CRM! 👋',
    body: 'Este es el corazón de Welko. En 30 segundos te enseñamos todo lo que necesitas para sacarle el máximo provecho.',
  },
  {
    target: 'tour-kpis',
    placement: 'bottom',
    title: 'Métricas clave en tiempo real',
    body: 'Aquí ves mensajes respondidos, citas agendadas, ingresos recuperados y tiempo de respuesta — todo actualizado automáticamente por tu IA.',
  },
  {
    target: 'tour-score',
    placement: 'top',
    title: 'Score de tu IA',
    body: 'Tu IA mejora según cuánto la configuras. Haz clic en los chips de acciones rápidas para subir el score y obtener respuestas más precisas.',
  },
  {
    target: 'tour-cerebro',
    placement: 'right',
    title: 'Cerebro IA',
    body: 'Tu IA analiza patrones de tu negocio y te da insights en tiempo real: cuándo hay más demanda, qué preguntan tus clientes y cómo mejorar.',
  },
  {
    target: 'tour-noshow',
    placement: 'left',
    title: 'Predictor de No-shows',
    body: 'La IA evalúa el riesgo de cada cita y envía recordatorios automáticos a quienes tienen alta probabilidad de no asistir — ahorrándote ingresos perdidos.',
  },
  {
    target: null,
    placement: 'center',
    title: '¡Listo para empezar! 🚀',
    body: 'Explora el menú lateral para ver tu CRM, citas, conversaciones y más. Si tienes dudas, el equipo de Welko está a un WhatsApp de distancia.',
  },
]

interface Rect { top: number; left: number; width: number; height: number }

function getRect(target: string): Rect | null {
  const el = document.querySelector(`[data-tour="${target}"]`) as HTMLElement | null
  if (!el) return null
  const r = el.getBoundingClientRect()
  return { top: r.top, left: r.left, width: r.width, height: r.height }
}

function Spotlight({ rect }: { rect: Rect }) {
  const PAD = 10
  return (
    <div
      style={{
        position: 'fixed',
        top: rect.top - PAD,
        left: rect.left - PAD,
        width: rect.width + PAD * 2,
        height: rect.height + PAD * 2,
        borderRadius: 16,
        boxShadow: '0 0 0 9999px rgba(0,0,0,0.55)',
        border: '2px solid rgba(96,165,250,0.7)',
        zIndex: 9998,
        pointerEvents: 'none',
        transition: 'all 0.3s cubic-bezier(0.22,1,0.36,1)',
      }}
    />
  )
}

export function CRMTour() {
  const [step, setStep] = useState(0)
  const [visible, setVisible] = useState(false)
  const [rect, setRect]   = useState<Rect | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 })
  const tooltipRef = useRef<HTMLDivElement>(null)

  // Check if tour already done
  useEffect(() => {
    const done = localStorage.getItem(STORAGE_KEY)
    if (!done) {
      // Small delay so dashboard has rendered
      const t = setTimeout(() => setVisible(true), 800)
      return () => clearTimeout(t)
    }
  }, [])

  const computePosition = useCallback((stepIndex: number) => {
    const s = STEPS[stepIndex]
    if (!s.target || s.placement === 'center') {
      setRect(null)
      setTooltipPos({ top: window.innerHeight / 2, left: window.innerWidth / 2 })
      return
    }
    const r = getRect(s.target)
    if (!r) {
      setRect(null)
      setTooltipPos({ top: window.innerHeight / 2, left: window.innerWidth / 2 })
      return
    }
    setRect(r)

    const TW = tooltipRef.current?.offsetWidth ?? 320
    const TH = tooltipRef.current?.offsetHeight ?? 180
    const PAD = 18
    let top = 0, left = 0

    if (s.placement === 'bottom') {
      top  = r.top + r.height + PAD
      left = r.left + r.width / 2
    } else if (s.placement === 'top') {
      top  = r.top - TH - PAD
      left = r.left + r.width / 2
    } else if (s.placement === 'right') {
      top  = r.top + r.height / 2
      left = r.left + r.width + PAD
    } else if (s.placement === 'left') {
      top  = r.top + r.height / 2
      left = r.left - TW - PAD
    }

    // Clamp within viewport
    const margin = 16
    left = Math.max(margin + TW / 2, Math.min(window.innerWidth - margin - TW / 2, left))
    top  = Math.max(margin, Math.min(window.innerHeight - margin - TH, top))

    setTooltipPos({ top, left })
  }, [])

  useEffect(() => {
    if (!visible) return
    computePosition(step)
  }, [step, visible, computePosition])

  // Recompute on resize
  useEffect(() => {
    if (!visible) return
    const handler = () => computePosition(step)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [step, visible, computePosition])

  function finish() {
    localStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
  }

  function next() {
    if (step < STEPS.length - 1) setStep(s => s + 1)
    else finish()
  }
  function prev() { if (step > 0) setStep(s => s - 1) }

  if (!visible) return null

  const s = STEPS[step]
  const isCenter = !s.target || s.placement === 'center'
  const isLast   = step === STEPS.length - 1

  const tooltipStyle: React.CSSProperties = isCenter
    ? {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 9999,
      }
    : s.placement === 'bottom' || s.placement === 'top'
    ? {
        position: 'fixed',
        top: tooltipPos.top,
        left: tooltipPos.left,
        transform: 'translateX(-50%)',
        zIndex: 9999,
      }
    : {
        position: 'fixed',
        top: tooltipPos.top,
        left: tooltipPos.left,
        transform: 'translateY(-50%)',
        zIndex: 9999,
      }

  return (
    <>
      {/* Backdrop (only when no spotlight) */}
      {isCenter && (
        <div
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.55)',
            zIndex: 9997,
          }}
          onClick={finish}
        />
      )}

      {/* Spotlight around target */}
      {rect && <Spotlight rect={rect} />}

      {/* Tooltip card */}
      <div
        ref={tooltipRef}
        style={{
          ...tooltipStyle,
          width: 320,
          background: '#FFFFFF',
          borderRadius: 18,
          padding: '22px 24px 18px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.22)',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {/* Step counter + close */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 5 }}>
            {STEPS.map((_, i) => (
              <div
                key={i}
                style={{
                  width: i === step ? 20 : 6,
                  height: 6,
                  borderRadius: 99,
                  background: i === step ? '#13244A' : '#E5E7EB',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </div>
          <button
            onClick={finish}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#9CA3AF', padding: 2, display: 'flex',
            }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: '#EEF2FF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Zap size={13} color="#13244A" />
            </div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827', margin: 0 }}>
              {s.title}
            </h3>
          </div>
          <p style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.6, margin: 0 }}>
            {s.body}
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
          {step > 0 ? (
            <button
              onClick={prev}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                background: 'none', border: '1px solid #E5E7EB',
                borderRadius: 10, padding: '7px 14px', cursor: 'pointer',
                fontSize: 12, fontWeight: 600, color: '#6B7280',
              }}
            >
              <ChevronLeft size={13} /> Anterior
            </button>
          ) : (
            <button
              onClick={finish}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 12, color: '#9CA3AF', padding: '7px 0',
              }}
            >
              Saltar tour
            </button>
          )}
          <button
            onClick={next}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              background: '#13244A', border: 'none',
              borderRadius: 10, padding: '8px 18px', cursor: 'pointer',
              fontSize: 12, fontWeight: 700, color: '#FFFFFF',
            }}
          >
            {isLast ? '¡Empezar! 🚀' : 'Siguiente'} {!isLast && <ChevronRight size={13} />}
          </button>
        </div>
      </div>
    </>
  )
}
