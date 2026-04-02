'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, X, Loader2 } from 'lucide-react'
import { useLang } from '@/contexts/LangContext'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const WA_NUMBER = '525628443738'

function whatsappUrl(planName: string, lang: string): string {
  const msg = lang === 'es'
    ? `Hola, me interesa contratar el Plan ${planName} de Welko. ¿Me pueden dar los detalles?`
    : `Hi, I'm interested in Welko's ${planName} Plan. Can you give me the details?`
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`
}

interface Plan {
  id: string
  name: string
  tagline: { es: string; en: string }
  monthly: number
  annual: number
  featured: boolean
  features: { text: { es: string; en: string }; included: boolean }[]
}

const PLANS: Plan[] = [
  {
    id: 'essential',
    name: 'Essential',
    tagline: {
      es: 'Eficiencia pura para tu consulta',
      en: 'Pure efficiency for your practice',
    },
    monthly: 1999,
    annual: 1599,
    featured: false,
    features: [
      { text: { es: 'WhatsApp e Instagram 24/7', en: 'WhatsApp & Instagram 24/7' }, included: true },
      { text: { es: 'Agendamiento básico de citas', en: 'Basic appointment scheduling' }, included: true },
      { text: { es: 'Respuestas a preguntas frecuentes', en: 'FAQ auto-responses' }, included: true },
      { text: { es: 'Recordatorios automáticos', en: 'Automatic reminders' }, included: true },
      { text: { es: 'CRM Médico Welko', en: 'Welko Medical CRM' }, included: false },
      { text: { es: 'Estadísticas de conversión', en: 'Conversion analytics' }, included: false },
      { text: { es: 'Llamadas de voz (IA)', en: 'AI voice calls' }, included: false },
      { text: { es: 'Multi-clínica', en: 'Multi-clinic' }, included: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: {
      es: 'Potencia y Control Total',
      en: 'Full Power and Control',
    },
    monthly: 3999,
    annual: 3199,
    featured: true,
    features: [
      { text: { es: 'WhatsApp e Instagram 24/7', en: 'WhatsApp & Instagram 24/7' }, included: true },
      { text: { es: 'Agendamiento básico de citas', en: 'Basic appointment scheduling' }, included: true },
      { text: { es: 'Respuestas a preguntas frecuentes', en: 'FAQ auto-responses' }, included: true },
      { text: { es: 'Recordatorios automáticos', en: 'Automatic reminders' }, included: true },
      { text: { es: 'CRM Médico Welko', en: 'Welko Medical CRM' }, included: true },
      { text: { es: 'Estadísticas de conversión', en: 'Conversion analytics' }, included: true },
      { text: { es: 'Llamadas de voz (IA)', en: 'AI voice calls' }, included: true },
      { text: { es: 'Tono de marca personalizado', en: 'Custom brand voice' }, included: true },
      { text: { es: 'Multi-clínica', en: 'Multi-clinic' }, included: false },
    ],
  },
  {
    id: 'business',
    name: 'Business',
    tagline: {
      es: 'Escalabilidad Multisucursal',
      en: 'Multi-location Scalability',
    },
    monthly: 6999,
    annual: 5599,
    featured: false,
    features: [
      { text: { es: 'Todo lo del plan Pro', en: 'Everything in Pro' }, included: true },
      { text: { es: 'Multi-clínica (sucursales ilimitadas)', en: 'Multi-clinic (unlimited branches)' }, included: true },
      { text: { es: 'Integración EHR / HIS', en: 'EHR / HIS Integration' }, included: true },
      { text: { es: 'Soporte prioritario 24/7', en: 'Priority support 24/7' }, included: true },
      { text: { es: 'Análisis avanzado de ROI', en: 'Advanced ROI analytics' }, included: true },
      { text: { es: 'Onboarding dedicado', en: 'Dedicated onboarding' }, included: true },
    ],
  },
]

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)
  const { lang } = useLang()

  async function handleCheckout(planId: string) {
    setLoading(planId)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId, annual: isAnnual }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No URL')
      }
    } catch {
      // Fallback: WhatsApp
      const plan = PLANS.find((p) => p.id === planId)
      if (plan) window.open(whatsappUrl(plan.name, lang), '_blank')
    } finally {
      setLoading(null)
    }
  }

  const labels = {
    eyebrow:  lang === 'es' ? 'Precios'                     : 'Pricing',
    heading:  lang === 'es' ? 'Planes simples, resultados claros' : 'Simple plans, clear results',
    sub:      lang === 'es' ? 'Sin costos ocultos. Cancela cuando quieras.' : 'No hidden fees. Cancel anytime.',
    monthly:  lang === 'es' ? 'Mensual'                     : 'Monthly',
    annual:   lang === 'es' ? 'Anual'                       : 'Annual',
    popular:  lang === 'es' ? 'Más Popular'                 : 'Most Popular',
    cta:      lang === 'es' ? 'Elegir plan'                 : 'Choose plan',
    trust:    lang === 'es' ? '🔒 Pagos seguros por Stripe. Sin permanencia.' : '🔒 Secure payments by Stripe. No lock-in.',
    iva:      lang === 'es' ? 'MXN/mes + IVA'               : 'MXN/mo + VAT',
  }

  return (
    <section id="precios" className="py-16 sm:py-24 px-4 sm:px-6" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-5xl mx-auto flex flex-col gap-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE }}
          className="flex flex-col items-center gap-4 text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--accent-label)' }}>
            {labels.eyebrow}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            {labels.heading}
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {labels.sub}
          </p>

          {/* Toggle */}
          <div
            className="flex items-center gap-1 p-1 rounded-xl"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <button
              onClick={() => setIsAnnual(false)}
              className="px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={{ background: !isAnnual ? 'var(--accent)' : 'transparent', color: !isAnnual ? '#FFFFFF' : 'var(--text-secondary)' }}
            >
              {labels.monthly}
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={{ background: isAnnual ? 'var(--accent)' : 'transparent', color: isAnnual ? '#FFFFFF' : 'var(--text-secondary)' }}
            >
              {labels.annual}
              <span
                className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: isAnnual ? 'rgba(255,255,255,0.18)' : '#E5E9F4', color: isAnnual ? '#FFFFFF' : 'var(--accent)' }}
              >
                −20%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {PLANS.map((plan, i) => {
            const price = isAnnual ? plan.annual : plan.monthly
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE, delay: i * 0.1 }}
                className="relative flex flex-col gap-5 p-5 sm:p-7 rounded-2xl"
                style={{
                  background: plan.featured ? '#13244A' : 'var(--surface)',
                  border: plan.featured ? '2px solid #13244A' : '1px solid var(--border)',
                  boxShadow: plan.featured ? '0 8px 40px rgba(19,36,74,0.20)' : 'none',
                }}
              >
                {plan.featured && (
                  <span
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold tracking-wide whitespace-nowrap"
                    style={{ background: '#FFFFFF', color: '#13244A' }}
                  >
                    {labels.popular}
                  </span>
                )}

                {/* Name + tagline */}
                <div className="flex flex-col gap-0.5">
                  <span
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{ color: plan.featured ? 'rgba(255,255,255,0.5)' : 'var(--text-muted)' }}
                  >
                    {plan.name}
                  </span>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: plan.featured ? 'rgba(255,255,255,0.9)' : 'var(--text-primary)' }}
                  >
                    {lang === 'es' ? plan.tagline.es : plan.tagline.en}
                  </p>
                </div>

                {/* Price */}
                <div className="flex items-end gap-1.5">
                  <span
                    className="text-3xl font-black tracking-tight leading-none"
                    style={{ color: plan.featured ? '#FFFFFF' : 'var(--text-primary)' }}
                  >
                    ${price.toLocaleString('es-MX')}
                  </span>
                  <span
                    className="text-xs mb-1"
                    style={{ color: plan.featured ? 'rgba(255,255,255,0.5)' : 'var(--text-muted)' }}
                  >
                    {labels.iva}
                  </span>
                </div>

                <hr style={{ borderColor: plan.featured ? 'rgba(255,255,255,0.1)' : 'var(--border)', margin: 0 }} />

                {/* Features */}
                <ul className="flex flex-col gap-2.5 flex-1">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-2.5">
                      <span
                        className="mt-0.5 flex-shrink-0 w-4.5 h-4.5"
                        style={{ color: f.included ? (plan.featured ? '#FFFFFF' : '#13244A') : (plan.featured ? 'rgba(255,255,255,0.25)' : 'var(--text-muted)') }}
                      >
                        {f.included
                          ? <Check size={14} />
                          : <X size={14} />}
                      </span>
                      <span
                        className="text-xs leading-snug"
                        style={{
                          color: f.included
                            ? (plan.featured ? 'rgba(255,255,255,0.85)' : 'var(--text-secondary)')
                            : (plan.featured ? 'rgba(255,255,255,0.3)' : 'var(--text-muted)'),
                          textDecoration: f.included ? 'none' : 'line-through',
                        }}
                      >
                        {lang === 'es' ? f.text.es : f.text.en}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={() => handleCheckout(plan.id)}
                  disabled={loading === plan.id}
                  className="mt-1 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-150 disabled:opacity-70 disabled:cursor-not-allowed"
                  style={
                    plan.featured
                      ? { background: '#FFFFFF', color: '#13244A', border: 'none', cursor: loading === plan.id ? 'not-allowed' : 'pointer' }
                      : { background: 'transparent', color: 'var(--text-primary)', border: '1.5px solid var(--border)', cursor: loading === plan.id ? 'not-allowed' : 'pointer' }
                  }
                  onMouseEnter={(e) => {
                    if (loading === plan.id) return
                    const el = e.currentTarget as HTMLButtonElement
                    el.style.background = plan.featured ? '#F0F0F0' : 'var(--surface-hover)'
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLButtonElement
                    el.style.background = plan.featured ? '#FFFFFF' : 'transparent'
                  }}
                >
                  {loading === plan.id
                    ? <Loader2 size={14} className="animate-spin" />
                    : labels.cta}
                </button>
              </motion.div>
            )
          })}
        </div>

        {/* Trust */}
        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center text-xs"
          style={{ color: 'var(--text-muted)' }}
        >
          {labels.trust}
        </motion.p>
      </div>
    </section>
  )
}
