'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  Check,
  Plus,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Bot,
  Clock,
  Stethoscope,
  Brain,
  Sparkles,
  Plug,
  MessageCircle,
  Share2,
  Phone,
  CheckCircle,
  ExternalLink,
} from 'lucide-react'

/* ─── Design tokens (light — matches landing page + logo) ─── */
const BG     = '#F9FAFB'
const SURF   = '#FFFFFF'
const SURF2  = '#F3F4F6'
const BORDER = '#E5E7EB'
const TEXT   = '#0A0F1A'
const MUTED  = '#6B7280'
const GREEN  = '#22C55E'
const NAVY   = '#13244A'

/* ─── Types ─── */
type DayKey = 'lunes' | 'martes' | 'miércoles' | 'jueves' | 'viernes' | 'sábado' | 'domingo'
type WorkingHours = Record<DayKey, { open: string; close: string; active: boolean }>
type ServiceRow   = { _id: string; name: string; description: string; priceMin: string; priceMax: string; durationMins: string }
type FaqRow       = { _id: string; question: string; answer: string }

/* ─── Constants ─── */
const DAYS: DayKey[] = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo']
const DAY_LABEL: Record<DayKey, string> = {
  lunes: 'Lun', martes: 'Mar', miércoles: 'Mié',
  jueves: 'Jue', viernes: 'Vie', sábado: 'Sáb', domingo: 'Dom',
}
const DEFAULT_HOURS: WorkingHours = {
  lunes:     { open: '09:00', close: '18:00', active: true  },
  martes:    { open: '09:00', close: '18:00', active: true  },
  miércoles: { open: '09:00', close: '18:00', active: true  },
  jueves:    { open: '09:00', close: '18:00', active: true  },
  viernes:   { open: '09:00', close: '18:00', active: true  },
  sábado:    { open: '10:00', close: '14:00', active: false },
  domingo:   { open: '10:00', close: '14:00', active: false },
}
const SPECIALTIES_LIST = [
  'Odontología General', 'Ortodoncia', 'Implantes Dentales', 'Blanqueamiento',
  'Endodoncia', 'Periodoncia', 'Cirugía Oral', 'Odontopediatría',
  'Medicina Estética', 'Nutrición Clínica', 'Dermatología', 'Spa & Bienestar',
  'Medicina General', 'Psicología',
]
const PAYMENT_OPTIONS = ['Efectivo', 'Tarjeta de crédito', 'Tarjeta de débito', 'Transferencia SPEI', 'Pago en línea', 'PayPal']
const INSURANCE_OPTIONS = ['IMSS', 'ISSSTE', 'GNP', 'AXA', 'BUPA', 'Metlife', 'Seguros Monterrey', 'Mapfre']
const TONE_OPTIONS = [
  { value: 'profesional', label: 'Profesional',          desc: 'Claro, directo y confiable.' },
  { value: 'amigable',    label: 'Amigable y cercana',   desc: 'Cálido, conversacional.' },
  { value: 'empático',    label: 'Empático',             desc: 'Comprensivo, prioriza al paciente.' },
  { value: 'formal',      label: 'Formal y ejecutivo',   desc: 'Preciso, sin lenguaje coloquial.' },
]
const STEPS = [
  { num: 1, label: 'Perfil',      Icon: Stethoscope },
  { num: 2, label: 'Horarios',    Icon: Clock       },
  { num: 3, label: 'Servicios',   Icon: Plus        },
  { num: 4, label: 'Conocimiento',Icon: Brain       },
  { num: 5, label: 'Agente IA',   Icon: Bot         },
  { num: 6, label: 'Canales',     Icon: Plug        },
]

/* ─── Shared UI primitives ─── */
function Label({ children }: { children: React.ReactNode }) {
  return <p style={{ color: MUTED, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 6px' }}>{children}</p>
}
function Input({ value, onChange, placeholder, type = 'text' }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string
}) {
  return (
    <input
      type={type} value={value} placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%', background: SURF2, border: `1px solid ${BORDER}`,
        borderRadius: 10, padding: '10px 14px', color: TEXT, fontSize: 13,
        outline: 'none', boxSizing: 'border-box',
      }}
      onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(19,36,74,0.45)')}
      onBlur={(e)  => (e.currentTarget.style.borderColor = BORDER)}
    />
  )
}
function Textarea({ value, onChange, placeholder, rows = 3 }: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number
}) {
  return (
    <textarea
      value={value} placeholder={placeholder} rows={rows}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%', background: SURF2, border: `1px solid ${BORDER}`,
        borderRadius: 10, padding: '10px 14px', color: TEXT, fontSize: 13,
        outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit',
      }}
      onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(19,36,74,0.45)')}
      onBlur={(e)  => (e.currentTarget.style.borderColor = BORDER)}
    />
  )
}
function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }}>
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: 40, height: 22, borderRadius: 11, position: 'relative', flexShrink: 0,
          background: checked ? NAVY : '#D1D5DB',
          transition: 'background 0.2s',
        }}
      >
        <div style={{
          position: 'absolute', top: 3, left: checked ? 21 : 3,
          width: 16, height: 16, borderRadius: '50%', background: '#fff',
          transition: 'left 0.2s',
        }} />
      </div>
      <span style={{ color: TEXT, fontSize: 13 }}>{label}</span>
    </label>
  )
}
function Chip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 12px', borderRadius: 99, fontSize: 12, fontWeight: 500,
        border: selected ? `1px solid ${NAVY}` : `1px solid ${BORDER}`,
        background: selected ? 'rgba(19,36,74,0.08)' : SURF2,
        color: selected ? NAVY : MUTED, cursor: 'pointer',
        transition: 'all 0.15s',
      }}
    >
      {label}
    </button>
  )
}

function uid() { return Math.random().toString(36).slice(2) }

/* ─── Main component ─── */
export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep]     = useState(1)
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState<string | null>(null)

  // Step 1 — Perfil
  const [name,         setName]         = useState('')
  const [phone,        setPhone]        = useState('')
  const [address,      setAddress]      = useState('')
  const [website,      setWebsite]      = useState('')
  const [specialties,  setSpecialties]  = useState<string[]>([])

  // Step 2 — Horarios
  const [hours, setHours] = useState<WorkingHours>(DEFAULT_HOURS)

  // Step 3 — Servicios
  const [services, setServices] = useState<ServiceRow[]>([
    { _id: uid(), name: '', description: '', priceMin: '', priceMax: '', durationMins: '' },
  ])

  // Step 4 — Conocimiento IA
  const [hasParking,          setHasParking]         = useState(false)
  const [hasInvoicing,        setHasInvoicing]       = useState(false)
  const [cancellationPolicy,  setCancellationPolicy] = useState('')
  const [paymentMethods,      setPaymentMethods]     = useState<string[]>(['Efectivo', 'Tarjeta de crédito'])
  const [insurancesAccepted,  setInsurancesAccepted] = useState<string[]>([])
  const [faqs,                setFaqs]               = useState<FaqRow[]>([
    { _id: uid(), question: '¿Cuánto tarda una consulta inicial?', answer: '' },
    { _id: uid(), question: '¿Qué incluye la consulta?', answer: '' },
    { _id: uid(), question: '¿Trabajan con seguros?', answer: '' },
  ])

  // Step 5 — Agente IA
  const [aiAgentName,      setAiAgentName]     = useState('')
  const [aiTone,           setAiTone]          = useState('profesional')

  // Step 6 — Canales
  const [voiceActivating,  setVoiceActivating] = useState(false)
  const [voiceActive,      setVoiceActive]     = useState(false)
  const [voicePhone,       setVoicePhone]      = useState<string | null>(null)

  /* ─── Helpers ─── */
  function toggleSpecialty(s: string) {
    setSpecialties((p) => p.includes(s) ? p.filter((x) => x !== s) : [...p, s])
  }
  function togglePayment(m: string) {
    setPaymentMethods((p) => p.includes(m) ? p.filter((x) => x !== m) : [...p, m])
  }
  function toggleInsurance(i: string) {
    setInsurancesAccepted((p) => p.includes(i) ? p.filter((x) => x !== i) : [...p, i])
  }
  function addService() {
    setServices((p) => [...p, { _id: uid(), name: '', description: '', priceMin: '', priceMax: '', durationMins: '' }])
  }
  function removeService(id: string) {
    setServices((p) => p.filter((s) => s._id !== id))
  }
  function updateService(id: string, field: keyof Omit<ServiceRow, '_id'>, val: string) {
    setServices((p) => p.map((s) => s._id === id ? { ...s, [field]: val } : s))
  }
  function addFaq() {
    setFaqs((p) => [...p, { _id: uid(), question: '', answer: '' }])
  }
  function removeFaq(id: string) {
    setFaqs((p) => p.filter((f) => f._id !== id))
  }
  function updateFaq(id: string, field: 'question' | 'answer', val: string) {
    setFaqs((p) => p.map((f) => f._id === id ? { ...f, [field]: val } : f))
  }
  function toggleDay(day: DayKey) {
    setHours((p) => ({ ...p, [day]: { ...p[day], active: !p[day].active } }))
  }
  function updateHour(day: DayKey, field: 'open' | 'close', val: string) {
    setHours((p) => ({ ...p, [day]: { ...p[day], [field]: val } }))
  }

  /* ─── Save partial / final ─── */
  async function save(completed: boolean) {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, phone, address, website, specialties,
          workingHours: hours,
          services: services
            .filter((s) => s.name.trim())
            .map((s) => ({
              name: s.name.trim(),
              description: s.description.trim() || undefined,
              priceMin: s.priceMin ? parseFloat(s.priceMin) : undefined,
              priceMax: s.priceMax ? parseFloat(s.priceMax) : undefined,
              durationMins: s.durationMins ? parseInt(s.durationMins) : undefined,
            })),
          hasParking, hasInvoicing, cancellationPolicy,
          paymentMethods, insurancesAccepted,
          faqs: faqs.filter((f) => f.question.trim() && f.answer.trim()).map(({ question, answer }) => ({ question, answer })),
          aiAgentName, aiTone,
          onboardingCompleted: completed,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Error desconocido')
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error guardando datos.')
      return false
    } finally {
      setSaving(false)
    }
  }

  async function handleNext() {
    if (step === 1 && !name.trim()) { setError('El nombre de la clínica es requerido.'); return }
    setError(null)
    // In development, advance immediately (save runs in background — no real DB needed)
    if (process.env.NODE_ENV !== 'production') {
      save(false).catch(() => {})
      setStep((s) => s + 1)
      return
    }
    const ok = await save(false)
    if (ok) setStep((s) => s + 1)
  }

  async function handleFinish() {
    if (!aiAgentName.trim()) { setError('Elige un nombre para tu agente.'); return }
    if (process.env.NODE_ENV !== 'production') {
      save(true).catch(() => {})
      setStep(6)
      return
    }
    const ok = await save(true)
    if (ok) setStep(6)
  }

  async function activateVoice() {
    setVoiceActivating(true)
    try {
      const r = await fetch('/api/voice/activate', { method: 'POST' })
      const d = await r.json()
      if (r.ok) { setVoiceActive(true); setVoicePhone(d.phoneNumber ?? null) }
    } finally {
      setVoiceActivating(false)
    }
  }

  /* ─── AI Completeness Score ─── */
  const scoreItems = [
    { label: 'Nombre de la clínica',    done: !!name.trim(),                              pts: 10 },
    { label: 'Teléfono de contacto',    done: !!phone.trim(),                             pts: 5  },
    { label: 'Dirección',               done: !!address.trim(),                           pts: 5  },
    { label: 'Especialidades',          done: specialties.length > 0,                     pts: 10 },
    { label: 'Horarios configurados',   done: Object.values(hours).some(h => h.active),   pts: 10 },
    { label: 'Al menos 1 servicio',     done: services.some(s => s.name.trim()),          pts: 15 },
    { label: 'Precio en servicios',     done: services.some(s => s.priceMin.trim()),      pts: 5  },
    { label: 'Métodos de pago',         done: paymentMethods.length > 0,                  pts: 5  },
    { label: 'Política de cancelación', done: !!cancellationPolicy.trim(),               pts: 5  },
    { label: '3+ FAQs completas',       done: faqs.filter(f => f.question.trim() && f.answer.trim()).length >= 3, pts: 15 },
    { label: 'Nombre del agente IA',    done: !!aiAgentName.trim(),                       pts: 10 },
    { label: 'Tono configurado',        done: !!aiTone,                                   pts: 5  },
  ]
  const totalPts   = scoreItems.reduce((s, i) => s + i.pts, 0)
  const earnedPts  = scoreItems.filter(i => i.done).reduce((s, i) => s + i.pts, 0)
  const aiScore    = Math.round((earnedPts / totalPts) * 100)
  const missing    = scoreItems.filter(i => !i.done)
  const nextAction = missing[0]

  const scoreColor = aiScore >= 80 ? '#22C55E' : aiScore >= 50 ? '#F59E0B' : '#60A5FA'

  /* ─── Render ─── */
  return (
    <div style={{ minHeight: '100vh', background: BG, display: 'flex', flexDirection: 'column' }}>

      {/* ── Topbar ── */}
      <div style={{
        height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 28px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0,
        background: SURF, boxShadow: '0 1px 0 #E5E7EB', gap: 16,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: NAVY, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Image src="/welko_logo_purewhite.png" alt="Welko" width={18} height={18} style={{ objectFit: 'contain' }} />
          </div>
          <span style={{ color: NAVY, fontWeight: 800, fontSize: 16 }}>Welko</span>
        </div>

        {/* AI Score pill — grows to fill center */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
          {/* Progress bar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 200, maxWidth: 340 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: NAVY }}>
                Tu IA está al <span style={{ color: scoreColor }}>{aiScore}%</span> de su potencial
              </span>
              <span style={{ fontSize: 10, color: MUTED }}>{earnedPts}/{totalPts} pts</span>
            </div>
            <div style={{ height: 6, borderRadius: 99, background: '#E5E7EB', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 99,
                width: `${aiScore}%`,
                background: scoreColor,
                transition: 'width 0.5s ease, background 0.3s',
              }} />
            </div>
          </div>
          {/* Next action nudge */}
          {nextAction && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '5px 12px', borderRadius: 99,
              background: `${scoreColor}15`, border: `1px solid ${scoreColor}30`,
              flexShrink: 0,
            }}>
              <Sparkles size={11} color={scoreColor} />
              <span style={{ fontSize: 11, color: NAVY, fontWeight: 500 }}>
                +{nextAction.pts}pts: <strong>{nextAction.label}</strong>
              </span>
            </div>
          )}
        </div>

        <span style={{ color: MUTED, fontSize: 12, flexShrink: 0 }}>Paso {step} de {STEPS.length}</span>
      </div>

      {/* ── Stepper ── */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '28px 0 24px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          {STEPS.map((s, i) => {
            const done   = step > s.num
            const active = step === s.num
            return (
              <div key={s.num} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: done ? NAVY : active ? 'rgba(19,36,74,0.1)' : SURF2,
                    border: active ? `2px solid ${NAVY}` : done ? 'none' : `1px solid ${BORDER}`,
                    transition: 'all 0.2s',
                  }}>
                    {done
                      ? <Check size={16} color="#fff" strokeWidth={2.5} />
                      : <s.Icon size={15} color={active ? NAVY : MUTED} strokeWidth={1.8} />
                    }
                  </div>
                  <span style={{
                    fontSize: 10, fontWeight: active ? 600 : 400,
                    color: active ? NAVY : done ? '#374151' : MUTED,
                    whiteSpace: 'nowrap',
                  }}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{
                    width: 48, height: 1, margin: '0 4px',
                    marginBottom: 20,
                    background: done ? NAVY : BORDER,
                    transition: 'background 0.3s',
                  }} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Form card ── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '0 16px 40px' }}>
        <div style={{
          width: '100%', maxWidth: 640,
          background: SURF, border: `1px solid ${BORDER}`,
          borderRadius: 18, overflow: 'hidden',
          boxShadow: '0 4px 24px rgba(19,36,74,0.08)',
        }}>
          {/* Card header */}
          <div style={{ padding: '22px 28px 18px', borderBottom: `1px solid ${BORDER}` }}>
            {step === 1 && <StepHeader title="Perfil de tu Clínica" desc="Esta información le da contexto a tu recepcionista IA." />}
            {step === 2 && <StepHeader title="Horarios de Atención" desc="La IA rechazará citas fuera de tu horario configurado." />}
            {step === 3 && <StepHeader title="Servicios y Precios" desc="Cada servicio con precio alimenta el cálculo de Revenue Asegurado." />}
            {step === 4 && <StepHeader title="Conocimiento de la IA" desc="Entre más detalle, mejor y más personalizada será tu recepcionista." />}
            {step === 5 && <StepHeader title="Tu Agente Recepcionista" desc="Define el nombre y tono de tu IA. En el siguiente paso conectas los canales." />}
            {step === 6 && <StepHeader title="Conecta tus Canales" desc="Elige por dónde quieres que tu IA atienda pacientes. Puedes activarlos ahora o después desde el dashboard." />}
          </div>

          {/* Card body */}
          <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* ══ STEP 1 — PERFIL ══ */}
            {step === 1 && (
              <>
                <div>
                  <Label>Nombre de la clínica *</Label>
                  <Input value={name} onChange={setName} placeholder="Ej. Clínica Dental Pérez" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <Label>Teléfono principal</Label>
                    <Input value={phone} onChange={setPhone} placeholder="+52 81 1234 5678" type="tel" />
                  </div>
                  <div>
                    <Label>Sitio web</Label>
                    <Input value={website} onChange={setWebsite} placeholder="https://tuclinica.com" />
                  </div>
                </div>
                <div>
                  <Label>Dirección completa</Label>
                  <Textarea value={address} onChange={setAddress} placeholder="Av. Constitución 123, Col. Centro, Monterrey, N.L." rows={2} />
                </div>
                <div>
                  <Label>Especialidades (selecciona todas las que apliquen)</Label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 8 }}>
                    {SPECIALTIES_LIST.map((s) => (
                      <Chip key={s} label={s} selected={specialties.includes(s)} onClick={() => toggleSpecialty(s)} />
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ══ STEP 2 — HORARIOS ══ */}
            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {DAYS.map((day) => (
                  <div key={day} style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '10px 14px', borderRadius: 10,
                    background: hours[day].active ? 'rgba(19,36,74,0.05)' : SURF2,
                    border: `1px solid ${hours[day].active ? 'rgba(19,36,74,0.2)' : BORDER}`,
                    transition: 'all 0.15s',
                  }}>
                    <Toggle
                      checked={hours[day].active}
                      onChange={() => toggleDay(day)}
                      label={DAY_LABEL[day]}
                    />
                    {hours[day].active ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
                        <input
                          type="time" value={hours[day].open}
                          onChange={(e) => updateHour(day, 'open', e.target.value)}
                          style={{ background: SURF2, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '6px 10px', color: TEXT, fontSize: 12 }}
                        />
                        <span style={{ color: MUTED, fontSize: 12 }}>–</span>
                        <input
                          type="time" value={hours[day].close}
                          onChange={(e) => updateHour(day, 'close', e.target.value)}
                          style={{ background: SURF2, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '6px 10px', color: TEXT, fontSize: 12 }}
                        />
                      </div>
                    ) : (
                      <span style={{ color: MUTED, fontSize: 12, marginLeft: 'auto' }}>Cerrado</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* ══ STEP 3 — SERVICIOS ══ */}
            {step === 3 && (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {services.map((svc, i) => (
                    <div key={svc._id} style={{
                      background: SURF2, border: `1px solid ${BORDER}`,
                      borderRadius: 12, padding: '14px 16px',
                      display: 'flex', flexDirection: 'column', gap: 10,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ color: MUTED, fontSize: 11, fontWeight: 600 }}>SERVICIO {i + 1}</span>
                        {services.length > 1 && (
                          <button onClick={() => removeService(svc._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', display: 'flex' }}>
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        <div>
                          <Label>Nombre del servicio *</Label>
                          <Input value={svc.name} onChange={(v) => updateService(svc._id, 'name', v)} placeholder="Ej. Limpieza Dental" />
                        </div>
                        <div>
                          <Label>Duración (minutos)</Label>
                          <Input value={svc.durationMins} onChange={(v) => updateService(svc._id, 'durationMins', v)} placeholder="45" type="number" />
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        <div>
                          <Label>Precio desde (MXN)</Label>
                          <Input value={svc.priceMin} onChange={(v) => updateService(svc._id, 'priceMin', v)} placeholder="800" type="number" />
                        </div>
                        <div>
                          <Label>Precio hasta (MXN)</Label>
                          <Input value={svc.priceMax} onChange={(v) => updateService(svc._id, 'priceMax', v)} placeholder="1200" type="number" />
                        </div>
                      </div>
                      <div>
                        <Label>Descripción breve (opcional)</Label>
                        <Input value={svc.description} onChange={(v) => updateService(svc._id, 'description', v)} placeholder="Incluye pulido, remoción de sarro y flúor" />
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={addService}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                    padding: '10px 16px', borderRadius: 10, border: `1px dashed rgba(19,36,74,0.3)`,
                    background: 'rgba(19,36,74,0.04)', color: NAVY, fontSize: 13, fontWeight: 500, cursor: 'pointer',
                  }}
                >
                  <Plus size={15} /> Agregar otro servicio
                </button>
              </>
            )}

            {/* ══ STEP 4 — CONOCIMIENTO IA ══ */}
            {step === 4 && (
              <>
                {/* Toggles */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div style={{ background: SURF2, border: `1px solid ${BORDER}`, borderRadius: 10, padding: '14px 16px' }}>
                    <Toggle checked={hasParking} onChange={setHasParking} label="Tenemos estacionamiento" />
                  </div>
                  <div style={{ background: SURF2, border: `1px solid ${BORDER}`, borderRadius: 10, padding: '14px 16px' }}>
                    <Toggle checked={hasInvoicing} onChange={setHasInvoicing} label="Emitimos facturas (CFDI)" />
                  </div>
                </div>

                {/* Métodos de pago */}
                <div>
                  <Label>Métodos de pago aceptados</Label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 8 }}>
                    {PAYMENT_OPTIONS.map((m) => (
                      <Chip key={m} label={m} selected={paymentMethods.includes(m)} onClick={() => togglePayment(m)} />
                    ))}
                  </div>
                </div>

                {/* Seguros */}
                <div>
                  <Label>Seguros médicos que aceptan (si aplica)</Label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 8 }}>
                    {INSURANCE_OPTIONS.map((s) => (
                      <Chip key={s} label={s} selected={insurancesAccepted.includes(s)} onClick={() => toggleInsurance(s)} />
                    ))}
                  </div>
                </div>

                {/* Política de cancelación */}
                <div>
                  <Label>Política de cancelación</Label>
                  <Textarea
                    value={cancellationPolicy} onChange={setCancellationPolicy} rows={2}
                    placeholder="Ej. Cancelaciones con menos de 24 horas de anticipación tienen cargo del 50%."
                  />
                </div>

                {/* FAQs */}
                <div>
                  <Label>Preguntas frecuentes personalizadas</Label>
                  <p style={{ color: MUTED, fontSize: 11, marginBottom: 10 }}>
                    La IA usará estas respuestas exactas cuando un paciente haga estas preguntas.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {faqs.map((faq, i) => (
                      <div key={faq._id} style={{ background: SURF2, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '14px 16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                          <span style={{ color: MUTED, fontSize: 11, fontWeight: 600 }}>FAQ {i + 1}</span>
                          <button onClick={() => removeFaq(faq._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.25)' }}>
                            <Trash2 size={12} />
                          </button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          <Input value={faq.question} onChange={(v) => updateFaq(faq._id, 'question', v)} placeholder="Pregunta del paciente..." />
                          <Textarea value={faq.answer} onChange={(v) => updateFaq(faq._id, 'answer', v)} placeholder="Respuesta de la IA..." rows={2} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={addFaq}
                    style={{
                      marginTop: 10, display: 'flex', alignItems: 'center', gap: 6,
                      background: 'none', border: 'none', color: NAVY, fontSize: 12, cursor: 'pointer', fontWeight: 500,
                    }}
                  >
                    <Plus size={13} /> Añadir pregunta frecuente
                  </button>
                </div>
              </>
            )}

            {/* ══ STEP 5 — AGENTE IA ══ */}
            {step === 5 && (
              <>
                <div>
                  <Label>Nombre de tu agente IA *</Label>
                  <Input value={aiAgentName} onChange={setAiAgentName} placeholder="Ej. Sofía, Ana, Luna..." />
                  <p style={{ color: MUTED, fontSize: 11, marginTop: 6 }}>
                    El paciente conocerá a tu IA por este nombre.
                  </p>
                </div>

                {/* Tono */}
                <div>
                  <Label>Tono de comunicación</Label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 8 }}>
                    {TONE_OPTIONS.map((t) => (
                      <button
                        key={t.value}
                        onClick={() => setAiTone(t.value)}
                        style={{
                          background: aiTone === t.value ? 'rgba(19,36,74,0.07)' : SURF2,
                          border: aiTone === t.value ? `1.5px solid ${NAVY}` : `1px solid ${BORDER}`,
                          borderRadius: 10, padding: '12px 14px', cursor: 'pointer',
                          textAlign: 'left', transition: 'all 0.15s',
                        }}
                      >
                        <p style={{ color: aiTone === t.value ? NAVY : TEXT, fontWeight: 600, fontSize: 13, margin: '0 0 3px' }}>{t.label}</p>
                        <p style={{ color: MUTED, fontSize: 11, margin: 0 }}>{t.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview */}
                <div style={{
                  background: 'rgba(19,36,74,0.04)', border: '1px solid rgba(19,36,74,0.14)',
                  borderRadius: 12, padding: '14px 18px',
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                }}>
                  <Sparkles size={14} color={NAVY} style={{ marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <p style={{ color: TEXT, fontSize: 12, fontWeight: 600, margin: '0 0 4px' }}>
                      Vista previa del prompt de tu IA
                    </p>
                    <p style={{ color: MUTED, fontSize: 11, margin: 0, lineHeight: 1.7 }}>
                      Al finalizar, Welko generará automáticamente un prompt completo con toda la información que configuraste:
                      nombre de clínica, horarios, servicios y precios, políticas, FAQs y la personalidad de{' '}
                      <strong style={{ color: NAVY }}>{aiAgentName || 'tu agente'}</strong>.
                      Este prompt se encripta y se envía a Vapi/Retell para entrenar tu recepcionista.
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* ══ STEP 6 — CANALES ══ */}
            {step === 6 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

                {/* WhatsApp */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '16px 18px', borderRadius: 14,
                  border: `1px solid ${BORDER}`, background: SURF2,
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                    background: 'rgba(37,211,102,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <MessageCircle size={18} color="#16a34a" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: TEXT, fontSize: 13, fontWeight: 600, margin: '0 0 2px' }}>WhatsApp IA</p>
                    <p style={{ color: MUTED, fontSize: 11, margin: 0 }}>
                      Conecta tu número de Twilio para responder WhatsApp 24/7
                    </p>
                  </div>
                  <a
                    href="/dashboard/whatsapp"
                    target="_blank"
                    style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      background: NAVY, color: '#fff', border: 'none',
                      borderRadius: 8, padding: '7px 14px',
                      fontSize: 12, fontWeight: 600, cursor: 'pointer',
                      textDecoration: 'none', flexShrink: 0,
                    }}
                  >
                    Configurar <ExternalLink size={11} />
                  </a>
                </div>

                {/* Instagram & Facebook */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '16px 18px', borderRadius: 14,
                  border: `1px solid ${BORDER}`, background: SURF2,
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                    background: 'rgba(24,119,242,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Share2 size={18} color="#1877F2" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: TEXT, fontSize: 13, fontWeight: 600, margin: '0 0 2px' }}>Instagram & Facebook DMs</p>
                    <p style={{ color: MUTED, fontSize: 11, margin: 0 }}>
                      Autoriza tu página de Facebook para responder DMs e Instagram
                    </p>
                  </div>
                  <a
                    href="/dashboard/meta"
                    target="_blank"
                    style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      background: '#1877F2', color: '#fff', border: 'none',
                      borderRadius: 8, padding: '7px 14px',
                      fontSize: 12, fontWeight: 600, cursor: 'pointer',
                      textDecoration: 'none', flexShrink: 0,
                    }}
                  >
                    Conectar <ExternalLink size={11} />
                  </a>
                </div>

                {/* Llamadas IA */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '16px 18px', borderRadius: 14,
                  border: voiceActive ? '1px solid rgba(34,197,94,0.35)' : `1px solid ${BORDER}`,
                  background: voiceActive ? 'rgba(34,197,94,0.05)' : SURF2,
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                    background: 'rgba(99,102,241,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Phone size={18} color="#6366f1" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: TEXT, fontSize: 13, fontWeight: 600, margin: '0 0 2px' }}>
                      Llamadas de Voz IA
                      {voiceActive && (
                        <span style={{
                          marginLeft: 8, fontSize: 10, fontWeight: 600,
                          color: '#16a34a', background: 'rgba(34,197,94,0.12)',
                          padding: '2px 7px', borderRadius: 99,
                        }}>Activo</span>
                      )}
                    </p>
                    <p style={{ color: MUTED, fontSize: 11, margin: 0 }}>
                      {voiceActive && voicePhone
                        ? `Número asignado: ${voicePhone}`
                        : voiceActive
                        ? 'Asistente creado. El número se asignará en breve.'
                        : 'Welko crea tu asistente de voz y te asigna un número al instante (Plan Pro)'}
                    </p>
                  </div>
                  {!voiceActive ? (
                    <button
                      onClick={activateVoice}
                      disabled={voiceActivating}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 5,
                        background: '#6366f1', color: '#fff', border: 'none',
                        borderRadius: 8, padding: '7px 14px',
                        fontSize: 12, fontWeight: 600,
                        cursor: voiceActivating ? 'not-allowed' : 'pointer',
                        opacity: voiceActivating ? 0.7 : 1, flexShrink: 0,
                      }}
                    >
                      {voiceActivating
                        ? <><Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> Activando…</>
                        : 'Activar'}
                    </button>
                  ) : (
                    <CheckCircle size={20} color="#16a34a" style={{ flexShrink: 0 }} />
                  )}
                </div>

                <p style={{ color: MUTED, fontSize: 11, textAlign: 'center', marginTop: 4 }}>
                  Puedes configurar o cambiar cualquier canal en cualquier momento desde el dashboard.
                </p>
              </div>
            )}

            {/* ── Error ── */}
            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
                borderRadius: 10, padding: '10px 14px', color: '#FCA5A5', fontSize: 12,
              }}>
                {error}
              </div>
            )}
          </div>

          {/* ── Footer buttons ── */}
          <div style={{
            padding: '16px 28px', borderTop: `1px solid ${BORDER}`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <button
              onClick={() => { setError(null); setStep((s) => s - 1) }}
              disabled={step === 1}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'none', border: 'none', color: step === 1 ? 'transparent' : MUTED,
                fontSize: 13, cursor: step === 1 ? 'default' : 'pointer', fontWeight: 500,
              }}
            >
              <ChevronLeft size={16} /> Anterior
            </button>

            {step < 5 && (
              <button
                onClick={handleNext}
                disabled={saving}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  background: NAVY, color: '#FFFFFF', border: 'none',
                  borderRadius: 10, padding: '10px 22px',
                  fontSize: 13, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.7 : 1,
                }}
              >
                {saving ? <Loader2 size={15} className="animate-spin" /> : null}
                Siguiente <ChevronRight size={15} />
              </button>
            )}
            {step === 5 && (
              <button
                onClick={handleFinish}
                disabled={saving}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  background: NAVY, color: '#FFFFFF', border: 'none',
                  borderRadius: 10, padding: '10px 24px',
                  fontSize: 13, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.7 : 1,
                }}
              >
                {saving ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
                {saving ? 'Guardando...' : 'Activar mi recepcionista'}
              </button>
            )}
            {step === 6 && (
              <button
                onClick={() => router.push('/dashboard')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  background: GREEN, color: '#FFFFFF', border: 'none',
                  borderRadius: 10, padding: '10px 24px',
                  fontSize: 13, fontWeight: 700, cursor: 'pointer',
                }}
              >
                <CheckCircle size={15} /> Ir al Dashboard
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function StepHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <div>
      <h2 style={{ color: NAVY, fontSize: 17, fontWeight: 700, margin: '0 0 4px' }}>{title}</h2>
      <p style={{ color: MUTED, fontSize: 12, margin: 0 }}>{desc}</p>
    </div>
  )
}
