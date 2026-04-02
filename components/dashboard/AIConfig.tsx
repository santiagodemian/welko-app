'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Bot, Clock, Stethoscope, Banknote, MessageSquare,
  Plus, Trash2, Loader2, CheckCircle, AlertCircle,
  Building2, Phone, Globe, MapPin, ChevronDown,
} from 'lucide-react'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

// ─── Types ────────────────────────────────────────────────────────────────────

interface WorkingHours {
  open: string; close: string; active: boolean
}
type WorkingHoursMap = Record<string, WorkingHours>

interface FAQ { question: string; answer: string }
interface ServiceRow { id?: string; name: string; priceMin: string; priceMax: string; durationMins: string }

interface Config {
  name: string
  phone: string
  address: string
  website: string
  specialties: string[]
  workingHours: WorkingHoursMap
  aiAgentName: string
  aiTone: string
  paymentMethods: string[]
  insurancesAccepted: string[]
  cancellationPolicy: string
  hasParking: boolean
  hasInvoicing: boolean
  faqs: FAQ[]
  services: { id?: string; name: string; priceMin: number | null; priceMax: number | null; durationMins: number | null }[]
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DAYS = ['lunes','martes','miércoles','jueves','viernes','sábado','domingo']
const DAY_LABELS: Record<string, string> = {
  lunes:'Lun', martes:'Mar', miércoles:'Mié', jueves:'Jue', viernes:'Vie', sábado:'Sáb', domingo:'Dom',
}

const DEFAULT_HOURS: WorkingHoursMap = Object.fromEntries(
  DAYS.map(d => [d, { open: '09:00', close: '18:00', active: !['sábado','domingo'].includes(d) }])
)

const TONES = [
  { id: 'profesional', label: 'Profesional',   desc: 'Claro, directo y formal' },
  { id: 'amigable',    label: 'Amigable',       desc: 'Cálido y cercano' },
  { id: 'empático',    label: 'Empático',        desc: 'Comprensivo y humano' },
  { id: 'formal',      label: 'Formal',          desc: 'Ejecutivo y corporativo' },
]

const PAYMENT_OPTIONS = ['Efectivo','Tarjeta de crédito','Tarjeta de débito','Transferencia','PayPal','OXXO Pay']
const SPECIALTY_OPTIONS = ['Odontología General','Estética Dental','Ortodoncia','Implantes','Psicología','Nutrición','Ginecología','Oftalmología','Medicina General','Fisioterapia','Estética','Dermatología']

const TABS = [
  { id: 'agent',    label: 'Agente IA',   icon: Bot },
  { id: 'clinic',   label: 'Clínica',     icon: Building2 },
  { id: 'hours',    label: 'Horarios',    icon: Clock },
  { id: 'services', label: 'Servicios',   icon: Stethoscope },
  { id: 'policies', label: 'Políticas',   icon: Banknote },
  { id: 'faqs',     label: 'FAQs',        icon: MessageSquare },
] as const
type Tab = typeof TABS[number]['id']

// ─── Main component ───────────────────────────────────────────────────────────

export function AIConfig() {
  const [tab, setTab]             = useState<Tab>('agent')
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)
  const [saved, setSaved]         = useState(false)
  const [error, setError]         = useState<string | null>(null)

  const [config, setConfig] = useState<Config>({
    name: '', phone: '', address: '', website: '',
    specialties: [],
    workingHours: DEFAULT_HOURS,
    aiAgentName: 'Sofía', aiTone: 'profesional',
    paymentMethods: [], insurancesAccepted: [],
    cancellationPolicy: '', hasParking: false, hasInvoicing: false,
    faqs: [], services: [],
  })

  const [serviceRows, setServiceRows] = useState<ServiceRow[]>([
    { name: '', priceMin: '', priceMax: '', durationMins: '' },
  ])

  // ── Load ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    fetch('/api/ai-config')
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (!d) return
        setConfig({
          name:               d.name               ?? '',
          phone:              d.phone              ?? '',
          address:            d.address            ?? '',
          website:            d.website            ?? '',
          specialties:        (d.specialties as string[]) ?? [],
          workingHours:       (d.workingHours as WorkingHoursMap) ?? DEFAULT_HOURS,
          aiAgentName:        d.aiAgentName        ?? 'Sofía',
          aiTone:             d.aiTone             ?? 'profesional',
          paymentMethods:     (d.paymentMethods as string[]) ?? [],
          insurancesAccepted: (d.insurancesAccepted as string[]) ?? [],
          cancellationPolicy: d.cancellationPolicy ?? '',
          hasParking:         d.hasParking         ?? false,
          hasInvoicing:       d.hasInvoicing       ?? false,
          faqs:               (d.faqs as FAQ[])    ?? [],
          services:           d.services           ?? [],
        })
        if (d.services?.length) {
          setServiceRows(d.services.map((s: any) => ({
            id: s.id,
            name: s.name,
            priceMin: s.priceMin?.toString() ?? '',
            priceMax: s.priceMax?.toString() ?? '',
            durationMins: s.durationMins?.toString() ?? '',
          })))
        }
      })
      .finally(() => setLoading(false))
  }, [])

  // ── Save ──────────────────────────────────────────────────────────────────
  const save = useCallback(async () => {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/ai-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      })
      if (!res.ok) throw new Error('Error al guardar')
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError('No se pudo guardar. Intenta de nuevo.')
    } finally {
      setSaving(false)
    }
  }, [config])

  function set<K extends keyof Config>(key: K, value: Config[K]) {
    setConfig(c => ({ ...c, [key]: value }))
  }

  function toggleMulti(key: 'paymentMethods' | 'insurancesAccepted' | 'specialties', val: string) {
    setConfig(c => {
      const arr = c[key] as string[]
      return { ...c, [key]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] }
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 size={20} className="animate-spin" style={{ color: 'var(--text-muted)' }} />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            Configuración de IA
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Define cómo habla, qué sabe y cómo responde tu recepcionista.
          </p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
          style={{
            background: saved ? 'rgba(34,197,94,0.12)' : 'var(--accent)',
            color: saved ? '#16a34a' : 'var(--accent-fg)',
            border: saved ? '1px solid rgba(34,197,94,0.3)' : 'none',
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <CheckCircle size={14} /> : null}
          {saving ? 'Guardando…' : saved ? 'Guardado' : 'Guardar cambios'}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl text-sm"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}>
          <AlertCircle size={14} /> {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl overflow-x-auto"
        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
        {TABS.map(t => {
          const Icon = t.icon
          const active = tab === t.id
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all"
              style={{
                background: active ? 'var(--surface)' : 'transparent',
                color: active ? 'var(--accent)' : 'var(--text-secondary)',
                boxShadow: active ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              <Icon size={13} />
              {t.label}
            </button>
          )
        })}
      </div>

      {/* ── Tab: Agente IA ────────────────────────────────────────────────── */}
      {tab === 'agent' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: EASE }} className="flex flex-col gap-6">

          {/* Live preview */}
          <div className="flex items-start gap-4 p-4 rounded-2xl"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold flex-shrink-0"
              style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}>
              {config.aiAgentName?.[0]?.toUpperCase() ?? 'S'}
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                {config.aiAgentName || 'Sofía'}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Recepcionista IA · {TONES.find(t => t.id === config.aiTone)?.label ?? 'Profesional'}
              </p>
              <div className="mt-2 px-3 py-2 rounded-xl rounded-tl-none text-xs"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)', maxWidth: 280 }}>
                ¡Hola! Soy {config.aiAgentName || 'Sofía'} de {config.name || 'la clínica'}. ¿En qué puedo ayudarle hoy?
              </div>
            </div>
          </div>

          <Field label="Nombre del agente">
            <input
              value={config.aiAgentName}
              onChange={e => set('aiAgentName', e.target.value)}
              placeholder="Sofía"
              className="input-base"
              style={inputStyle}
            />
          </Field>

          <div className="flex flex-col gap-3">
            <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              Tono de comunicación
            </label>
            <div className="grid grid-cols-2 gap-3">
              {TONES.map(tone => (
                <button
                  key={tone.id}
                  onClick={() => set('aiTone', tone.id)}
                  className="flex flex-col gap-1 p-4 rounded-2xl text-left transition-all"
                  style={{
                    border: config.aiTone === tone.id ? '2px solid var(--accent)' : '1px solid var(--border)',
                    background: config.aiTone === tone.id ? 'var(--accent-subtle)' : 'var(--surface)',
                  }}
                >
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{tone.label}</span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{tone.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              Especialidades
            </label>
            <div className="flex flex-wrap gap-2">
              {SPECIALTY_OPTIONS.map(s => {
                const active = config.specialties.includes(s)
                return (
                  <button
                    key={s}
                    onClick={() => toggleMulti('specialties', s)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                    style={{
                      background: active ? 'var(--accent)' : 'var(--surface)',
                      color: active ? 'var(--accent-fg)' : 'var(--text-secondary)',
                      border: active ? 'none' : '1px solid var(--border)',
                    }}
                  >
                    {s}
                  </button>
                )
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Tab: Clínica ──────────────────────────────────────────────────── */}
      {tab === 'clinic' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: EASE }} className="flex flex-col gap-5">
          <Field label="Nombre de la clínica" icon={<Building2 size={14} />}>
            <input value={config.name} onChange={e => set('name', e.target.value)}
              placeholder="Clínica Dental Ejemplo" style={inputStyle} />
          </Field>
          <Field label="Teléfono" icon={<Phone size={14} />}>
            <input value={config.phone} onChange={e => set('phone', e.target.value)}
              placeholder="+52 55 1234 5678" style={inputStyle} />
          </Field>
          <Field label="Dirección" icon={<MapPin size={14} />}>
            <input value={config.address} onChange={e => set('address', e.target.value)}
              placeholder="Av. Insurgentes 123, CDMX" style={inputStyle} />
          </Field>
          <Field label="Sitio web" icon={<Globe size={14} />}>
            <input value={config.website} onChange={e => set('website', e.target.value)}
              placeholder="https://miclinica.com" style={inputStyle} />
          </Field>
        </motion.div>
      )}

      {/* ── Tab: Horarios ─────────────────────────────────────────────────── */}
      {tab === 'hours' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: EASE }} className="flex flex-col gap-3">
          {DAYS.map(day => {
            const h = config.workingHours[day] ?? { open: '09:00', close: '18:00', active: false }
            return (
              <div key={day} className="flex items-center gap-4 p-4 rounded-2xl"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                {/* Toggle */}
                <button onClick={() => {
                  const wh = { ...config.workingHours, [day]: { ...h, active: !h.active } }
                  set('workingHours', wh)
                }}>
                  <div className="relative" style={{ width: 38, height: 22 }}>
                    <div className="rounded-full transition-all" style={{
                      width: 38, height: 22,
                      background: h.active ? 'var(--accent)' : 'var(--border)',
                    }} />
                    <div className="absolute top-[3px] rounded-full bg-white transition-all" style={{
                      width: 16, height: 16,
                      left: h.active ? 19 : 3,
                    }} />
                  </div>
                </button>

                <span className="text-sm font-semibold w-8" style={{ color: h.active ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  {DAY_LABELS[day]}
                </span>

                {h.active ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input type="time" value={h.open}
                      onChange={e => set('workingHours', { ...config.workingHours, [day]: { ...h, open: e.target.value } })}
                      className="text-sm rounded-lg px-2 py-1.5"
                      style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)', outline: 'none' }} />
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>–</span>
                    <input type="time" value={h.close}
                      onChange={e => set('workingHours', { ...config.workingHours, [day]: { ...h, close: e.target.value } })}
                      className="text-sm rounded-lg px-2 py-1.5"
                      style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)', outline: 'none' }} />
                  </div>
                ) : (
                  <span className="text-sm flex-1" style={{ color: 'var(--text-muted)' }}>Cerrado</span>
                )}
              </div>
            )
          })}
        </motion.div>
      )}

      {/* ── Tab: Servicios ────────────────────────────────────────────────── */}
      {tab === 'services' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: EASE }} className="flex flex-col gap-4">
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            El agente usará estos servicios para informar precios y duración a los pacientes.
          </p>

          {/* Header row */}
          <div className="grid gap-2 text-xs font-semibold uppercase tracking-wider px-1"
            style={{ color: 'var(--text-muted)', gridTemplateColumns: '2fr 1fr 1fr 1fr auto' }}>
            <span>Servicio</span><span>Precio mín.</span><span>Precio máx.</span><span>Minutos</span><span />
          </div>

          {serviceRows.map((row, i) => (
            <div key={i} className="grid gap-2 items-center"
              style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr auto' }}>
              <input value={row.name} placeholder="Limpieza dental"
                onChange={e => {
                  const rows = [...serviceRows]; rows[i] = { ...rows[i], name: e.target.value }
                  setServiceRows(rows)
                  set('services', rows.map(r => ({
                    id: r.id, name: r.name,
                    priceMin: r.priceMin ? Number(r.priceMin) : null,
                    priceMax: r.priceMax ? Number(r.priceMax) : null,
                    durationMins: r.durationMins ? Number(r.durationMins) : null,
                  })))
                }}
                style={inputStyle} />
              {(['priceMin','priceMax','durationMins'] as const).map(field => (
                <input key={field} type="number" value={row[field]}
                  placeholder={field === 'durationMins' ? '45' : '500'}
                  onChange={e => {
                    const rows = [...serviceRows]; rows[i] = { ...rows[i], [field]: e.target.value }
                    setServiceRows(rows)
                    set('services', rows.map(r => ({
                      id: r.id, name: r.name,
                      priceMin: r.priceMin ? Number(r.priceMin) : null,
                      priceMax: r.priceMax ? Number(r.priceMax) : null,
                      durationMins: r.durationMins ? Number(r.durationMins) : null,
                    })))
                  }}
                  style={inputStyle} />
              ))}
              <button onClick={() => {
                const rows = serviceRows.filter((_, j) => j !== i)
                setServiceRows(rows.length ? rows : [{ name: '', priceMin: '', priceMax: '', durationMins: '' }])
                set('services', rows.map(r => ({
                  id: r.id, name: r.name,
                  priceMin: r.priceMin ? Number(r.priceMin) : null,
                  priceMax: r.priceMax ? Number(r.priceMax) : null,
                  durationMins: r.durationMins ? Number(r.durationMins) : null,
                })))
              }}>
                <Trash2 size={14} style={{ color: 'var(--text-muted)' }} />
              </button>
            </div>
          ))}

          <button onClick={() => setServiceRows(r => [...r, { name: '', priceMin: '', priceMax: '', durationMins: '' }])}
            className="flex items-center gap-2 text-sm font-medium self-start px-3 py-2 rounded-xl transition-all"
            style={{ border: '1px dashed var(--border)', color: 'var(--text-secondary)', background: 'transparent' }}>
            <Plus size={14} /> Agregar servicio
          </button>
        </motion.div>
      )}

      {/* ── Tab: Políticas ────────────────────────────────────────────────── */}
      {tab === 'policies' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: EASE }} className="flex flex-col gap-6">

          {/* Toggles */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: 'hasParking',   label: 'Estacionamiento', desc: 'La clínica tiene parking' },
              { key: 'hasInvoicing', label: 'Facturación',     desc: 'Se emite CFDI' },
            ].map(({ key, label, desc }) => {
              const val = config[key as 'hasParking' | 'hasInvoicing']
              return (
                <button key={key} onClick={() => set(key as 'hasParking' | 'hasInvoicing', !val)}
                  className="flex items-center gap-3 p-4 rounded-2xl text-left transition-all"
                  style={{
                    border: val ? '2px solid var(--accent)' : '1px solid var(--border)',
                    background: val ? 'var(--accent-subtle)' : 'var(--surface)',
                  }}>
                  <div className="relative flex-shrink-0" style={{ width: 38, height: 22 }}>
                    <div className="rounded-full" style={{ width: 38, height: 22, background: val ? 'var(--accent)' : 'var(--border)' }} />
                    <div className="absolute top-[3px] rounded-full bg-white transition-all" style={{ width: 16, height: 16, left: val ? 19 : 3 }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{label}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{desc}</p>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Payment methods */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              Métodos de pago
            </label>
            <div className="flex flex-wrap gap-2">
              {PAYMENT_OPTIONS.map(p => {
                const active = config.paymentMethods.includes(p)
                return (
                  <button key={p} onClick={() => toggleMulti('paymentMethods', p)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                    style={{
                      background: active ? 'var(--accent)' : 'var(--surface)',
                      color: active ? 'var(--accent-fg)' : 'var(--text-secondary)',
                      border: active ? 'none' : '1px solid var(--border)',
                    }}>
                    {p}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Insurances */}
          <Field label="Seguros aceptados (separados por coma)">
            <input
              value={config.insurancesAccepted.join(', ')}
              onChange={e => set('insurancesAccepted', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
              placeholder="GNP, AXA, Seguros Monterrey..."
              style={inputStyle}
            />
          </Field>

          {/* Cancellation policy */}
          <Field label="Política de cancelación">
            <textarea
              value={config.cancellationPolicy}
              onChange={e => set('cancellationPolicy', e.target.value)}
              placeholder="Cancelaciones con mínimo 24 horas de anticipación..."
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </Field>
        </motion.div>
      )}

      {/* ── Tab: FAQs ─────────────────────────────────────────────────────── */}
      {tab === 'faqs' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: EASE }} className="flex flex-col gap-4">
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            El agente usará estas respuestas exactas cuando los pacientes hagan estas preguntas.
          </p>

          {config.faqs.map((faq, i) => (
            <div key={i} className="flex flex-col gap-2 p-4 rounded-2xl"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: 'var(--accent-subtle)', color: 'var(--accent)' }}>P</span>
                <input value={faq.question}
                  onChange={e => {
                    const faqs = [...config.faqs]; faqs[i] = { ...faqs[i], question: e.target.value }
                    set('faqs', faqs)
                  }}
                  placeholder="¿Cuánto cuesta una consulta?"
                  style={{ ...inputStyle, flex: 1 }} />
                <button onClick={() => set('faqs', config.faqs.filter((_, j) => j !== i))}>
                  <Trash2 size={14} style={{ color: 'var(--text-muted)' }} />
                </button>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full mt-2"
                  style={{ background: 'rgba(34,197,94,0.10)', color: '#16a34a' }}>R</span>
                <textarea value={faq.answer}
                  onChange={e => {
                    const faqs = [...config.faqs]; faqs[i] = { ...faqs[i], answer: e.target.value }
                    set('faqs', faqs)
                  }}
                  placeholder="La consulta general tiene un costo de $500 MXN..."
                  rows={2}
                  style={{ ...inputStyle, flex: 1, resize: 'vertical' }} />
              </div>
            </div>
          ))}

          <button
            onClick={() => set('faqs', [...config.faqs, { question: '', answer: '' }])}
            className="flex items-center gap-2 text-sm font-medium self-start px-3 py-2 rounded-xl transition-all"
            style={{ border: '1px dashed var(--border)', color: 'var(--text-secondary)', background: 'transparent' }}>
            <Plus size={14} /> Agregar pregunta
          </button>
        </motion.div>
      )}

    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  background: 'var(--bg)',
  border: '1px solid var(--border)',
  borderRadius: 10,
  padding: '9px 12px',
  color: 'var(--text-primary)',
  fontSize: 13,
  outline: 'none',
  width: '100%',
}

function Field({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest"
        style={{ color: 'var(--text-muted)' }}>
        {icon}{label}
      </label>
      {children}
    </div>
  )
}
