'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, Check } from 'lucide-react'
import { getSpecialtyConfig } from '@/lib/onboarding-specialties'
import type { SpecialtyStep } from '@/lib/onboarding-specialties'
import { notFound } from 'next/navigation'
import { IndustryRobotVisual } from '@/components/ui/IndustryRobotVisual'
import { getKnowledge } from '@/lib/knowledge-base'

const NAVY   = '#1A2A56'
const WHITE  = '#FFFFFF'
const BG     = '#F7F8FC'
const BORDER = '#DDE3F0'
const MUTED  = '#6B7280'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

/* ── Multi-select pill ── */
function Pill({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '8px 14px', borderRadius: 100,
        border: `1.5px solid ${selected ? NAVY : BORDER}`,
        background: selected ? NAVY : WHITE,
        color: selected ? WHITE : '#374151',
        fontSize: 13, fontWeight: 500,
        cursor: 'pointer', transition: 'all 0.15s ease',
      }}
    >
      {selected && <Check size={12} />}
      {label}
    </button>
  )
}

/* ── Radio card ── */
function RadioCard({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        width: '100%', padding: '12px 16px', borderRadius: 12,
        border: `1.5px solid ${selected ? NAVY : BORDER}`,
        background: selected ? `${NAVY}08` : WHITE,
        cursor: 'pointer', textAlign: 'left',
        transition: 'all 0.15s ease',
      }}
    >
      <span style={{
        flexShrink: 0, width: 18, height: 18, borderRadius: '50%',
        border: `2px solid ${selected ? NAVY : BORDER}`,
        background: selected ? NAVY : WHITE,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {selected && <span style={{ width: 7, height: 7, borderRadius: '50%', background: WHITE, display: 'block' }} />}
      </span>
      <span style={{ fontSize: 14, color: '#1F2937', fontWeight: selected ? 600 : 400 }}>{label}</span>
    </button>
  )
}

/* ── Step form ── */
function StepForm({ step, value, onChange }: {
  step: SpecialtyStep
  value: string | string[]
  onChange: (v: string | string[]) => void
}) {
  const { field } = step

  if (field.type === 'radio') {
    const selected = value as string
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {field.options!.map((opt) => (
          <RadioCard key={opt} label={opt} selected={selected === opt} onClick={() => onChange(opt)} />
        ))}
      </div>
    )
  }

  if (field.type === 'multiselect') {
    const selected = (value as string[]) || []
    const toggle = (opt: string) => {
      const next = selected.includes(opt)
        ? selected.filter((s) => s !== opt)
        : [...selected, opt]
      onChange(next)
    }
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {field.options!.map((opt) => (
          <Pill key={opt} label={opt} selected={selected.includes(opt)} onClick={() => toggle(opt)} />
        ))}
      </div>
    )
  }

  if (field.type === 'textarea') {
    return (
      <textarea
        value={value as string}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        rows={4}
        style={{
          width: '100%', padding: '12px 14px', borderRadius: 12,
          border: `1.5px solid ${BORDER}`, fontSize: 14, color: '#1F2937',
          resize: 'none', outline: 'none', fontFamily: 'inherit',
          boxSizing: 'border-box',
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = NAVY)}
        onBlur={(e) => (e.currentTarget.style.borderColor = BORDER)}
      />
    )
  }

  if (field.type === 'text') {
    return (
      <input
        type="text"
        value={value as string}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        style={{
          width: '100%', padding: '12px 14px', borderRadius: 12,
          border: `1.5px solid ${BORDER}`, fontSize: 14, color: '#1F2937',
          outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = NAVY)}
        onBlur={(e) => (e.currentTarget.style.borderColor = BORDER)}
      />
    )
  }

  return null
}

/* ── Page ── */
export default function SpecialtyOnboardingPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const config = getSpecialtyConfig(slug)
  if (!config) notFound()

  const knowledge = getKnowledge(slug)
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [direction, setDirection] = useState(1)
  const [done, setDone] = useState(false)
  const [showGreeting, setShowGreeting] = useState(false)

  const total = config.steps.length
  const current = config.steps[step]
  const currentValue = answers[current?.id ?? ''] ?? ''
  const progress = ((step + 1) / total) * 100

  function isValid() {
    if (!current.field.required) return true
    const val = answers[current.id]
    if (!val) return false
    if (Array.isArray(val)) return val.length > 0
    return val.trim().length > 0
  }

  function goNext() {
    if (!isValid()) return
    // After step 0 (first question), show AI greeting if knowledge exists
    if (step === 0 && knowledge && !showGreeting) {
      setDirection(1)
      setShowGreeting(true)
      return
    }
    if (showGreeting) {
      setShowGreeting(false)
      setDirection(1)
      setStep((s) => s + 1)
      return
    }
    if (step < total - 1) {
      setDirection(1)
      setStep((s) => s + 1)
    } else {
      setDone(true)
      setTimeout(() => { router.push('/onboarding') }, 1800)
    }
  }

  function goBack() {
    if (step > 0) {
      setDirection(-1)
      setStep((s) => s - 1)
    }
  }

  function setAnswer(val: string | string[]) {
    setAnswers((prev) => ({ ...prev, [current.id]: val }))
  }

  if (done) {
    return (
      <div style={{
        minHeight: '100dvh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', background: BG, padding: 24,
      }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: EASE }}
          style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}
        >
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: NAVY, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Check size={28} color={WHITE} />
          </div>
          <p style={{ fontSize: 20, fontWeight: 700, color: '#1F2937' }}>{config.emoji} ¡Listo!</p>
          <p style={{ fontSize: 14, color: MUTED, maxWidth: 280 }}>
            Configuramos tu perfil de {config.label}. Continuando...
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: BG }}>

      {/* Progress bar */}
      <div style={{ height: 3, background: BORDER, position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50 }}>
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{ height: '100%', background: NAVY, borderRadius: 9999 }}
        />
      </div>

      {/* Header */}
      <div style={{
        padding: '20px 24px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: `1px solid ${BORDER}`, background: WHITE,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20 }}>{config.emoji}</span>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: NAVY, margin: 0 }}>{config.label}</p>
            <p style={{ fontSize: 11, color: MUTED, margin: 0 }}>Paso {step + 1} de {total}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 5 }}>
          {config.steps.map((_, i) => (
            <div key={i} style={{
              width: i === step ? 18 : 7, height: 7, borderRadius: 9999,
              background: i <= step ? NAVY : BORDER,
              transition: 'all 0.3s ease',
            }} />
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 16px' }}>
        <div style={{ width: '100%', maxWidth: 900, paddingTop: 40, paddingBottom: 120, display: 'flex', gap: 40, alignItems: 'flex-start' }}>

          {/* Robot — desktop only */}
          <div style={{ flexShrink: 0, display: 'none', position: 'sticky', top: 40 }} className="lg:!block">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{ width: 200 }}
            >
              <IndustryRobotVisual slug={slug} />
              <p style={{ textAlign: 'center', fontSize: 11, color: MUTED, marginTop: 8, fontWeight: 500 }}>
                Recepcionista IA de {config.label}
              </p>
            </motion.div>
          </div>

        <div style={{ flex: 1, maxWidth: 560 }}>
          <AnimatePresence mode="wait" initial={false}>

            {/* ── AI Knowledge Greeting Card ── */}
            {showGreeting && knowledge ? (
              <motion.div
                key="greeting"
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -40, opacity: 0 }}
                transition={{ duration: 0.28, ease: EASE }}
                style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
              >
                {/* AI avatar + message */}
                <div style={{
                  display: 'flex', gap: 12, alignItems: 'flex-start',
                  background: NAVY, borderRadius: 18, padding: '18px 20px',
                }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                    background: 'rgba(255,255,255,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                  }}>🤖</div>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Welko IA
                    </p>
                    <p style={{ fontSize: 14, color: WHITE, lineHeight: 1.65, margin: 0, fontWeight: 500 }}>
                      {knowledge.aiGreeting}
                    </p>
                  </div>
                </div>

                {/* Knowledge preview — top 5 terms */}
                <div style={{
                  background: WHITE, border: `1px solid ${BORDER}`,
                  borderRadius: 14, padding: '14px 16px',
                }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: NAVY, margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    📚 Lo que ya sé sobre {knowledge.label}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {knowledge.terms.slice(0, 5).map((t, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8 }}>
                        <span style={{ color: NAVY, fontSize: 11, fontWeight: 700, flexShrink: 0 }}>•</span>
                        <div>
                          <span style={{ fontSize: 12, fontWeight: 700, color: '#111827' }}>{t.term}: </span>
                          <span style={{ fontSize: 12, color: MUTED, lineHeight: 1.5 }}>{t.explanation}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: 11, color: MUTED, margin: '10px 0 0' }}>
                    + {knowledge.terms.length - 5} términos más cargados en memoria
                  </p>
                </div>

                {/* Common questions badge */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {knowledge.commonQuestions.slice(0, 3).map((q, i) => (
                    <span key={i} style={{
                      fontSize: 11, padding: '4px 10px', borderRadius: 99,
                      background: NAVY + '0D', border: `1px solid ${BORDER}`,
                      color: NAVY, fontWeight: 500,
                    }}>
                      "{q}"
                    </span>
                  ))}
                </div>
              </motion.div>
            ) : (

            <motion.div
              key={step}
              initial={{ x: direction * 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction * -40, opacity: 0 }}
              transition={{ duration: 0.28, ease: EASE }}
              style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: '#111827', lineHeight: 1.3, margin: 0 }}>
                  {current.title}
                </h2>
                {current.subtitle && (
                  <p style={{ fontSize: 13, color: MUTED, margin: 0, lineHeight: 1.5 }}>{current.subtitle}</p>
                )}
              </div>
              <StepForm step={current} value={currentValue} onChange={setAnswer} />
            </motion.div>
            )}
          </AnimatePresence>
        </div>
        </div>
      </div>

      {/* Footer nav */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        padding: '16px 24px', background: WHITE, borderTop: `1px solid ${BORDER}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
      }}>
        <button
          type="button"
          onClick={goBack}
          disabled={step === 0}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '10px 18px', borderRadius: 10,
            border: `1.5px solid ${BORDER}`,
            background: WHITE, color: step === 0 ? BORDER : '#374151',
            fontSize: 14, fontWeight: 500, cursor: step === 0 ? 'default' : 'pointer',
            transition: 'all 0.15s',
          }}
        >
          <ChevronLeft size={16} />
          Atrás
        </button>

        <p style={{ fontSize: 11, color: MUTED, margin: 0 }}>
          {!current.field.required && 'Opcional · '}{step + 1} / {total}
        </p>

        <button
          type="button"
          onClick={goNext}
          disabled={!showGreeting && current.field.required && !isValid()}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '10px 22px', borderRadius: 10,
            border: 'none',
            background: (showGreeting || isValid()) ? NAVY : BORDER,
            color: (showGreeting || isValid()) ? WHITE : MUTED,
            fontSize: 14, fontWeight: 600, cursor: (showGreeting || isValid()) ? 'pointer' : 'default',
            transition: 'all 0.15s',
          }}
        >
          {showGreeting ? '¡Entendido, vamos!' : step === total - 1 ? 'Finalizar' : 'Continuar'}
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
