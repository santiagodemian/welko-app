'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { PhoneMissed, TrendingUp, Clock, ArrowRight } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { useLang } from '@/contexts/LangContext'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export default function AIReceptionistPage() {
  const { lang } = useLang()

  const [callsPerDay, setCallsPerDay] = useState(20)
  const [unansweredPct, setUnansweredPct] = useState(35)
  const [avgValue, setAvgValue] = useState(800)

  const unansweredPerMonth = Math.round(callsPerDay * (unansweredPct / 100) * 22)
  const lostPerMonth = unansweredPerMonth * avgValue
  const lostPerYear = lostPerMonth * 12

  const labels = {
    eyebrow:      lang === 'es' ? 'Soluciones' : 'Solutions',
    heading:      lang === 'es' ? 'Recepcionista IA 24/7' : 'AI Receptionist 24/7',
    sub:          lang === 'es' ? 'El primer contacto define si un paciente se queda o se va. Welko garantiza que nunca pierdas esa oportunidad.' : 'The first contact defines whether a patient stays or leaves. Welko ensures you never miss that opportunity.',
    calcTitle:    lang === 'es' ? 'Calculadora de ROI' : 'ROI Calculator',
    calcSub:      lang === 'es' ? '¿Cuánto estás perdiendo por llamadas no contestadas?' : 'How much are you losing from unanswered calls?',
    calls:        lang === 'es' ? 'Llamadas o mensajes por día' : 'Calls or messages per day',
    unanswered:   lang === 'es' ? '% que no reciben respuesta' : '% that go unanswered',
    value:        lang === 'es' ? 'Valor promedio de una cita (MXN)' : 'Average appointment value (MXN)',
    lostMonth:    lang === 'es' ? 'Estás perdiendo al mes' : "You're losing per month",
    lostYear:     lang === 'es' ? 'Al año son' : 'Per year that\'s',
    unansweredN:  lang === 'es' ? 'consultas sin atender al mes' : 'unanswered inquiries per month',
    cta:          lang === 'es' ? 'Recuperar esos ingresos con Welko' : 'Recover that revenue with Welko',
    trust:        lang === 'es' ? 'Instalación en 24 h · Sin contratos · Soporte bilingüe' : '24h setup · No contracts · Bilingual support',
    featuresTitle: lang === 'es' ? '¿Por qué Welko?' : 'Why Welko?',
  }

  const features = lang === 'es'
    ? [
        { icon: Clock,        title: 'Respuesta en <2 segundos',      desc: 'Cada mensaje recibe respuesta inmediata, en cualquier canal, sin importar la hora.' },
        { icon: PhoneMissed,  title: 'Cero llamadas perdidas',         desc: 'Tu IA atiende en WhatsApp, Instagram y llamadas simultáneamente, sin saturarse.' },
        { icon: TrendingUp,   title: 'Más citas, más ingresos',        desc: 'Clínicas con Welko reportan hasta +40% en citas agendadas en el primer mes.' },
      ]
    : [
        { icon: Clock,        title: 'Response in <2 seconds',        desc: 'Every message gets an immediate response, on any channel, at any time.' },
        { icon: PhoneMissed,  title: 'Zero missed calls',             desc: 'Your AI handles WhatsApp, Instagram, and calls simultaneously, without overloading.' },
        { icon: TrendingUp,   title: 'More appointments, more revenue', desc: 'Clinics with Welko report up to +40% in scheduled appointments in the first month.' },
      ]

  return (
    <>
      <Navbar />

      <main className="flex flex-col flex-1 pt-24">

        {/* ── Hero ── */}
        <section className="px-4 sm:px-6 pt-10 pb-14 sm:pt-14 sm:pb-20">
          <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-5">
            <motion.span
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: 'var(--accent)' }}
            >
              {labels.eyebrow}
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.08 }}
              className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              {labels.heading}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE, delay: 0.15 }}
              className="text-sm sm:text-base leading-relaxed max-w-xl"
              style={{ color: 'var(--text-secondary)' }}
            >
              {labels.sub}
            </motion.p>
          </div>
        </section>

        {/* ── ROI Calculator ── */}
        <section className="py-14 sm:py-20 px-4 sm:px-6" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
          <div className="max-w-3xl mx-auto flex flex-col gap-10">
            <motion.div
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE }}
              className="flex flex-col gap-2"
            >
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
                {labels.calcTitle}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                {labels.calcSub}
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
              className="flex flex-col gap-8 p-6 sm:p-8 rounded-2xl"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              {/* Sliders */}
              <div className="flex flex-col gap-6">
                {/* Calls per day */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {labels.calls}
                    </label>
                    <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>{callsPerDay}</span>
                  </div>
                  <input
                    type="range" min={5} max={100} step={5} value={callsPerDay}
                    onChange={(e) => setCallsPerDay(Number(e.target.value))}
                    className="w-full accent-[#13244A]"
                  />
                  <div className="flex justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
                    <span>5</span><span>100</span>
                  </div>
                </div>

                {/* Unanswered % */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {labels.unanswered}
                    </label>
                    <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>{unansweredPct}%</span>
                  </div>
                  <input
                    type="range" min={5} max={80} step={5} value={unansweredPct}
                    onChange={(e) => setUnansweredPct(Number(e.target.value))}
                    className="w-full accent-[#13244A]"
                  />
                  <div className="flex justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
                    <span>5%</span><span>80%</span>
                  </div>
                </div>

                {/* Avg value */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {labels.value}
                    </label>
                    <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>
                      ${avgValue.toLocaleString('es-MX')}
                    </span>
                  </div>
                  <input
                    type="range" min={200} max={5000} step={100} value={avgValue}
                    onChange={(e) => setAvgValue(Number(e.target.value))}
                    className="w-full accent-[#13244A]"
                  />
                  <div className="flex justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
                    <span>$200</span><span>$5,000</span>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="flex flex-col gap-3 p-6 rounded-xl" style={{ background: '#13244A' }}>
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {unansweredPerMonth.toLocaleString('es-MX')} {labels.unansweredN}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex flex-col gap-0.5">
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>{labels.lostMonth}</p>
                    <p className="text-3xl font-black tracking-tight" style={{ color: '#FFFFFF' }}>
                      ${lostPerMonth.toLocaleString('es-MX')} MXN
                    </p>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>{labels.lostYear}</p>
                    <p className="text-xl font-bold tracking-tight" style={{ color: 'rgba(255,255,255,0.8)' }}>
                      ${lostPerYear.toLocaleString('es-MX')} MXN
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col items-center gap-3">
                <Link
                  href="/precios"
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold transition-opacity duration-150 w-full sm:w-auto justify-center"
                  style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = '0.88')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = '1')}
                >
                  {labels.cta}
                  <ArrowRight size={15} />
                </Link>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{labels.trust}</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Why Welko ── */}
        <section className="py-14 sm:py-20 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto flex flex-col gap-10">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              {labels.featuresTitle}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.45, ease: EASE, delay: i * 0.08 }}
                  className="flex flex-col gap-4 p-5 rounded-2xl"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#E5E9F4' }}>
                    <f.icon size={18} color="#13244A" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{f.title}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <footer className="py-8 px-4 sm:px-6" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} Welko —{' '}
            {lang === 'es'
              ? 'El recepcionista IA líder para Clínicas de Salud y Estética.'
              : 'The leading AI receptionist for Health & Aesthetic Clinics.'}
          </p>
        </div>
      </footer>
    </>
  )
}
