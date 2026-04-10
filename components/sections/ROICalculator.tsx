'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useLang } from '@/contexts/LangContext'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

// ─── Industry profiles ────────────────────────────────────────────────────────
interface IndustryProfile {
  es: string; en: string; icon: string
  volumeLabel:  { es: string; en: string }
  ticketLabel:  { es: string; en: string }
  lossLabel:    { es: string; en: string }
  lostUnit:     { es: string; en: string }
  recoveredUnit:{ es: string; en: string }
  recoveryRate: number
  defaultVolume: number
  defaultTicket: number
  defaultLoss:   number
}

const INDUSTRY_PROFILES: IndustryProfile[] = [
  {
    es: 'Clínicas & Salud', en: 'Health Clinics', icon: '🏥',
    volumeLabel:   { es: 'Citas al mes',                    en: 'Appointments per month' },
    ticketLabel:   { es: 'Precio por cita (MXN)',           en: 'Price per appointment (MXN)' },
    lossLabel:     { es: 'Tasa de no-shows (%)',            en: 'No-show rate (%)' },
    lostUnit:      { es: 'citas perdidas/mes',              en: 'lost appts/month' },
    recoveredUnit: { es: 'citas recuperadas por Welko',     en: 'appointments Welko recovers' },
    recoveryRate: 0.30, defaultVolume: 80, defaultTicket: 1200, defaultLoss: 25,
  },
  {
    es: 'Restaurantes', en: 'Restaurants', icon: '🍽️',
    volumeLabel:   { es: 'Consultas/reservas al mes',       en: 'Inquiries/reservations per month' },
    ticketLabel:   { es: 'Ticket promedio (MXN)',           en: 'Average ticket (MXN)' },
    lossLabel:     { es: 'Tasa de abandono (%)',            en: 'Drop-off rate (%)' },
    lostUnit:      { es: 'pedidos/reservas perdidas/mes',   en: 'lost orders/reservations per month' },
    recoveredUnit: { es: 'pedidos recuperados',             en: 'orders Welko recovers' },
    recoveryRate: 0.35, defaultVolume: 200, defaultTicket: 450, defaultLoss: 30,
  },
  {
    es: 'Barberías & Salones', en: 'Barbershops & Salons', icon: '✂️',
    volumeLabel:   { es: 'Turnos al mes',                   en: 'Bookings per month' },
    ticketLabel:   { es: 'Precio por turno (MXN)',          en: 'Price per booking (MXN)' },
    lossLabel:     { es: 'Tasa de no-shows (%)',            en: 'No-show rate (%)' },
    lostUnit:      { es: 'turnos perdidos/mes',             en: 'lost bookings/month' },
    recoveredUnit: { es: 'turnos recuperados',              en: 'bookings Welko recovers' },
    recoveryRate: 0.35, defaultVolume: 120, defaultTicket: 380, defaultLoss: 28,
  },
  {
    es: 'Fitness & Gyms', en: 'Fitness & Gyms', icon: '💪',
    volumeLabel:   { es: 'Leads al mes',                    en: 'Leads per month' },
    ticketLabel:   { es: 'Inscripción mensual (MXN)',       en: 'Monthly membership (MXN)' },
    lossLabel:     { es: 'Tasa de no-conversión (%)',       en: 'Non-conversion rate (%)' },
    lostUnit:      { es: 'leads no convertidos/mes',        en: 'unconverted leads/month' },
    recoveredUnit: { es: 'inscripciones generadas',         en: 'memberships Welko generates' },
    recoveryRate: 0.40, defaultVolume: 50, defaultTicket: 700, defaultLoss: 60,
  },
  {
    es: 'Hoteles', en: 'Hotels', icon: '🏨',
    volumeLabel:   { es: 'Consultas de reserva al mes',     en: 'Booking inquiries per month' },
    ticketLabel:   { es: 'Tarifa por noche (MXN)',          en: 'Rate per night (MXN)' },
    lossLabel:     { es: 'Tasa de no-reservación (%)',      en: 'Non-booking rate (%)' },
    lostUnit:      { es: 'reservaciones perdidas/mes',      en: 'lost reservations/month' },
    recoveredUnit: { es: 'reservaciones recuperadas',       en: 'reservations Welko recovers' },
    recoveryRate: 0.25, defaultVolume: 80, defaultTicket: 1800, defaultLoss: 40,
  },
  {
    es: 'Profesional', en: 'Professional', icon: '💼',
    volumeLabel:   { es: 'Consultas al mes',                en: 'Inquiries per month' },
    ticketLabel:   { es: 'Honorarios por cliente (MXN)',    en: 'Fees per client (MXN)' },
    lossLabel:     { es: 'Tasa de no-conversión (%)',       en: 'Non-conversion rate (%)' },
    lostUnit:      { es: 'consultas perdidas/mes',          en: 'lost inquiries/month' },
    recoveredUnit: { es: 'clientes convertidos',            en: 'clients Welko converts' },
    recoveryRate: 0.35, defaultVolume: 30, defaultTicket: 3500, defaultLoss: 50,
  },
]

const PLAN_PRICES_MXN = { starter: 299, essential: 799, pro: 1499 }
const PLAN_PRICES_USD = { starter: 49,  essential: 99,  pro: 199  }

function Slider({
  label, min, max, step, value, onChange, format,
}: {
  label: string; min: number; max: number; step: number
  value: number; onChange: (v: number) => void; format: (v: number) => string
}) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</span>
        <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{format(value)}</span>
      </div>
      <div className="relative h-2 rounded-full" style={{ background: 'var(--border)' }}>
        <div className="absolute left-0 top-0 h-full rounded-full transition-all duration-150"
          style={{ width: `${pct}%`, background: 'var(--accent)' }} />
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" style={{ margin: 0 }} />
        <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-md transition-all duration-150"
          style={{ left: `calc(${pct}% - 8px)`, background: 'var(--accent)' }} />
      </div>
    </div>
  )
}

export function ROICalculator() {
  const { lang, currency } = useLang()
  const isEN  = lang === 'en'
  const isUSD = currency === 'USD'

  const [industryIdx, setIndustryIdx] = useState(0)
  const profile = INDUSTRY_PROFILES[industryIdx]

  const [volume, setVolume] = useState(profile.defaultVolume)
  const [ticket, setTicket] = useState(profile.defaultTicket)
  const [loss,   setLoss]   = useState(profile.defaultLoss)
  const [plan,   setPlan]   = useState<'starter' | 'essential' | 'pro'>('essential')

  // When industry changes, reset to defaults
  function selectIndustry(idx: number) {
    const p = INDUSTRY_PROFILES[idx]
    setIndustryIdx(idx)
    setVolume(p.defaultVolume)
    setTicket(p.defaultTicket)
    setLoss(p.defaultLoss)
  }

  const PLAN_PRICES = isUSD ? PLAN_PRICES_USD : PLAN_PRICES_MXN
  const currLabel   = isUSD ? 'USD' : 'MXN'

  const lost      = Math.round(volume * (loss / 100))
  const recovered = Math.round(lost * profile.recoveryRate)
  const revenue   = recovered * ticket
  const cost      = PLAN_PRICES[plan]
  const net       = revenue - cost
  const roi       = cost > 0 ? Math.round((net / cost) * 100) : 0

  const L = {
    eyebrow:      isEN ? 'ROI Calculator'                               : 'Calculadora de ROI',
    heading:      isEN ? 'How much is not having Welko costing you?'    : '¿Cuánto te cuesta no tener Welko?',
    sub:          isEN ? 'Drag the sliders and see your return in real time.' : 'Mueve los sliders y ve tu retorno en tiempo real.',
    planLabel:    isEN ? 'Welko Plan'                                   : 'Plan Welko',
    perdidas:     isEN ? 'Lost/month'                                   : 'Perdidos/mes',
    recuperadas:  isEN ? `${profile.recoveredUnit.en}`                  : `${profile.recoveredUnit.es}`,
    ingreso:      isEN ? 'Recovered revenue'                            : 'Ingreso recuperado',
    costo:        isEN ? 'Welko cost'                                   : 'Costo de Welko',
    roiLabel:     isEN ? 'Monthly ROI'                                  : 'ROI del mes',
    cta:          isEN ? 'Get started now'                              : 'Comenzar ahora',
    disclaimer:   isEN
      ? `* Based on recovering ${Math.round(profile.recoveryRate * 100)}% of lost ${profile.lostUnit.en.split('/')[0]}s with automatic reminders (real Welko customer average).`
      : `* Basado en recuperar el ${Math.round(profile.recoveryRate * 100)}% de ${profile.lostUnit.es.split('/')[0]} con recordatorios automáticos (promedio real de clientes Welko).`,
  }

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="max-w-5xl mx-auto flex flex-col gap-10">

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

        {/* Industry selector */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.4, ease: EASE, delay: 0.05 }}
          className="flex flex-wrap justify-center gap-2"
        >
          {INDUSTRY_PROFILES.map((p, i) => (
            <button key={i} onClick={() => selectIndustry(i)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150"
              style={industryIdx === i
                ? { background: 'var(--accent)', color: 'var(--accent-fg)' }
                : { background: 'var(--surface)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }
              }
            >
              <span>{p.icon}</span>
              {isEN ? p.en : p.es}
            </button>
          ))}
        </motion.div>

        {/* Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.55, ease: EASE, delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Inputs */}
          <div className="flex flex-col gap-7 p-6 sm:p-8 rounded-3xl"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: '0 4px 24px rgba(19,36,74,0.06)' }}>
            <Slider
              label={isEN ? profile.volumeLabel.en : profile.volumeLabel.es}
              min={10} max={400} step={5} value={volume}
              onChange={setVolume} format={(v) => `${v}`}
            />
            <Slider
              label={isEN ? profile.ticketLabel.en : profile.ticketLabel.es}
              min={100} max={8000} step={100} value={ticket}
              onChange={setTicket} format={(v) => `$${v.toLocaleString('es-MX')} ${currLabel}`}
            />
            <Slider
              label={isEN ? profile.lossLabel.en : profile.lossLabel.es}
              min={5} max={70} step={1} value={loss}
              onChange={setLoss} format={(v) => `${v}%`}
            />

            {/* Plan selector */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{L.planLabel}</span>
              <div className="grid grid-cols-3 gap-2">
                {(['starter', 'essential', 'pro'] as const).map((p) => (
                  <button key={p} onClick={() => setPlan(p)}
                    className="py-2.5 rounded-xl text-xs font-bold transition-all duration-150 capitalize"
                    style={plan === p
                      ? { background: 'var(--accent)', color: 'var(--accent-fg)' }
                      : { background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }
                    }
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                    <span className="block text-[10px] font-normal opacity-75">
                      ${PLAN_PRICES[p].toLocaleString()} {currLabel}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex flex-col gap-4">
            {/* Main ROI card */}
            <div className="flex-1 flex flex-col justify-center items-center gap-2 p-8 rounded-3xl text-center"
              style={{ background: 'linear-gradient(135deg,#05101F 0%,#13244A 100%)', boxShadow: '0 16px 48px rgba(19,36,74,0.25)' }}>
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#60A5FA' }}>
                {L.roiLabel}
              </span>
              <div className="flex items-end gap-1">
                <span className="text-6xl sm:text-7xl font-extrabold tracking-tight leading-none"
                  style={{ color: roi >= 0 ? '#34D399' : '#F87171' }}>
                  {roi >= 0 ? '+' : ''}{roi}%
                </span>
              </div>
              <p className="text-sm font-light" style={{ color: 'rgba(240,244,252,0.55)' }}>
                {isEN
                  ? `Welko generates $${net.toLocaleString()} ${currLabel} net gain`
                  : `Welko genera $${net.toLocaleString('es-MX')} ${currLabel} de ganancia neta`}
              </p>
              <Link href="/precios"
                className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-200"
                style={{ background: '#FFFFFF', color: '#0A0F1A' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#F0F4FC' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#FFFFFF' }}
              >
                {L.cta} <ArrowRight size={14} />
              </Link>
            </div>

            {/* Breakdown */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: L.perdidas,     value: lost,                             color: '#F87171' },
                { label: L.recuperadas,  value: recovered,                        color: '#34D399' },
                { label: L.ingreso,      value: `$${revenue.toLocaleString('es-MX')} ${currLabel}`, color: '#34D399', isStr: true },
                { label: L.costo,        value: `$${cost.toLocaleString('es-MX')} ${currLabel}`,    color: '#F87171', isStr: true },
              ].map((row) => (
                <div key={row.label} className="flex flex-col gap-1 p-4 rounded-2xl"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{row.label}</span>
                  <span style={{ color: row.color, fontWeight: 700, fontSize: 16 }}>{row.isStr ? row.value : row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <p className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>
          {L.disclaimer}
        </p>

      </div>
    </section>
  )
}
