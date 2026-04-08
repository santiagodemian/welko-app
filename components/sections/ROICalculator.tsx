'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { useLang } from '@/contexts/LangContext'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

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
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-150"
          style={{ width: `${pct}%`, background: 'var(--accent)' }}
        />
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          style={{ margin: 0 }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-md transition-all duration-150"
          style={{ left: `calc(${pct}% - 8px)`, background: 'var(--accent)' }}
        />
      </div>
    </div>
  )
}

export function ROICalculator() {
  const { lang } = useLang()
  const [citas,    setCitas]    = useState(60)
  const [ticket,   setTicket]   = useState(1000)
  const [noshow,   setNoshow]   = useState(25)
  const [plan,     setPlan]     = useState<'starter' | 'essential' | 'pro'>('essential')

  const PLAN_PRICES = { starter: 799, essential: 1499, pro: 2999 }

  // Citas perdidas por mes
  const citasPerdidas   = Math.round(citas * (noshow / 100))
  // Welko recupera aprox 30% de los no-shows con recordatorios
  const citasRecuperadas = Math.round(citasPerdidas * 0.30)
  const ingresoRecuperado = citasRecuperadas * ticket
  const costoPlan         = PLAN_PRICES[plan]
  const gananciaNet       = ingresoRecuperado - costoPlan
  const roi               = costoPlan > 0 ? Math.round((gananciaNet / costoPlan) * 100) : 0

  const L = {
    eyebrow:    lang === 'es' ? 'Calculadora de ROI'                           : 'ROI Calculator',
    heading:    lang === 'es' ? '¿Cuánto dinero te está costando no tener Welko?' : 'How much is not having Welko costing you?',
    sub:        lang === 'es' ? 'Mueve los sliders y ve tu retorno en tiempo real.' : 'Drag the sliders and see your return in real time.',
    citas:      lang === 'es' ? 'Citas al mes'                                 : 'Appointments per month',
    ticket:     lang === 'es' ? 'Precio por cita / servicio'                  : 'Price per appointment',
    noshow:     lang === 'es' ? 'Tasa de no-shows (%)'                        : 'No-show rate (%)',
    planLabel:  lang === 'es' ? 'Plan Welko'                                   : 'Welko Plan',
    perdidas:   lang === 'es' ? 'Citas perdidas/mes'                          : 'Lost appts/month',
    recuperadas:lang === 'es' ? 'Citas que recupera Welko'                    : 'Appointments Welko recovers',
    ingreso:    lang === 'es' ? 'Ingreso recuperado'                          : 'Recovered revenue',
    costo:      lang === 'es' ? 'Costo de Welko'                              : 'Welko cost',
    ganancia:   lang === 'es' ? 'Ganancia neta'                               : 'Net gain',
    roiLabel:   lang === 'es' ? 'ROI del mes'                                 : 'Monthly ROI',
    cta:        lang === 'es' ? 'Comenzar ahora'                              : 'Get started now',
    disclaimer: lang === 'es' ? '* Basado en recuperar el 30% de no-shows con recordatorios automáticos (promedio real de clientes Welko).'
                              : '* Based on recovering 30% of no-shows with automatic reminders (real Welko customer average).',
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

        {/* Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.55, ease: EASE, delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Inputs */}
          <div
            className="flex flex-col gap-7 p-8 rounded-3xl"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: '0 4px 24px rgba(19,36,74,0.06)' }}
          >
            <Slider
              label={L.citas} min={10} max={300} step={5} value={citas}
              onChange={setCitas} format={(v) => `${v}`}
            />
            <Slider
              label={L.ticket} min={300} max={5000} step={100} value={ticket}
              onChange={setTicket} format={(v) => `$${v.toLocaleString('es-MX')} MXN`}
            />
            <Slider
              label={L.noshow} min={5} max={50} step={1} value={noshow}
              onChange={setNoshow} format={(v) => `${v}%`}
            />

            {/* Plan selector */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{L.planLabel}</span>
              <div className="grid grid-cols-3 gap-2">
                {(['starter', 'essential', 'pro'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPlan(p)}
                    className="py-2 rounded-xl text-xs font-bold transition-all duration-150 capitalize"
                    style={
                      plan === p
                        ? { background: 'var(--accent)', color: 'var(--accent-fg)' }
                        : { background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }
                    }
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                    <span className="block text-[10px] font-normal opacity-75">
                      ${PLAN_PRICES[p].toLocaleString()}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex flex-col gap-4">
            {/* Main result card */}
            <div
              className="flex-1 flex flex-col justify-center items-center gap-2 p-8 rounded-3xl text-center"
              style={{ background: 'linear-gradient(135deg,#05101F 0%,#13244A 100%)', boxShadow: '0 16px 48px rgba(19,36,74,0.25)' }}
            >
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#60A5FA' }}>
                {L.roiLabel}
              </span>
              <div className="flex items-end gap-1">
                <span
                  className="text-6xl sm:text-7xl font-extrabold tracking-tight leading-none"
                  style={{ color: roi >= 0 ? '#34D399' : '#F87171' }}
                >
                  {roi >= 0 ? '+' : ''}{roi}%
                </span>
              </div>
              <p className="text-sm font-light" style={{ color: 'rgba(240,244,252,0.55)' }}>
                {lang === 'es'
                  ? `Welko genera $${gananciaNet.toLocaleString('es-MX')} MXN de ganancia neta`
                  : `Welko generates $${gananciaNet.toLocaleString()} MXN net gain`}
              </p>
              <Link
                href="/precios"
                className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-200"
                style={{ background: '#FFFFFF', color: '#0A0F1A' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#F0F4FC' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#FFFFFF' }}
              >
                {L.cta} <ArrowRight size={14} />
              </Link>
            </div>

            {/* Breakdown */}
            <div
              className="grid grid-cols-2 gap-3"
              style={{ fontSize: 13 }}
            >
              {[
                { label: L.perdidas,    value: citasPerdidas,                               color: '#F87171' },
                { label: L.recuperadas, value: citasRecuperadas,                            color: '#34D399' },
                { label: L.ingreso,     value: `$${ingresoRecuperado.toLocaleString('es-MX')} MXN`, color: '#34D399', isStr: true },
                { label: L.costo,       value: `$${costoPlan.toLocaleString('es-MX')} MXN`,         color: '#F87171', isStr: true },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex flex-col gap-1 p-4 rounded-2xl"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                >
                  <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{row.label}</span>
                  <span style={{ color: row.color, fontWeight: 700, fontSize: 16 }}>
                    {row.isStr ? row.value : row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <p className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>
          {L.disclaimer}
        </p>

      </div>
    </section>
  )
}
