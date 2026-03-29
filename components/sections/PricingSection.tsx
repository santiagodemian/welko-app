'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const WA_NUMBER = '525628443738'

function whatsappUrl(planName: string): string {
  const msg = `Hola, me interesa contratar el Plan ${planName} de Welko con el plan anual para obtener el 20% de descuento. ¿Me podrían dar los detalles de pago?`
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`
}

const PLANS = [
  {
    id: 'essential',
    name: 'Essential',
    tagline: 'Ideal para consultorios independientes.',
    monthly: 1499,
    annual: 1199,
    featured: false,
    stripeUrl: 'https://buy.stripe.com/test_3cI3cvc3dbCSai57Y67AI00',
    features: [
      'Hasta 100 citas agendadas/mes',
      'WhatsApp 24/7',
      'Respuestas a preguntas frecuentes',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'Diseñado para clínicas en crecimiento.',
    monthly: 2999,
    annual: 2399,
    featured: true,
    stripeUrl: 'https://buy.stripe.com/test_00waEX2sD4aqai5emu7AI01',
    features: [
      'Citas ilimitadas',
      'Confirmaciones y recordatorios automáticos',
      'IA personalizada con el tono de tu clínica',
      'Reportes de rendimiento mensuales',
    ],
  },
  {
    id: 'business',
    name: 'Business',
    tagline: 'Para grupos médicos o múltiples sucursales.',
    monthly: 5999,
    annual: 4799,
    featured: false,
    stripeUrl: 'https://buy.stripe.com/test_9B68wP7MX7mC3THbai7AI02',
    features: [
      'Integración con sistemas de gestión (EHR)',
      'Soporte prioritario 24/7',
      'Análisis avanzado de conversión de pacientes',
    ],
  },
]

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false)

  return (
    <section id="precios" className="py-24 px-4" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-5xl mx-auto flex flex-col gap-12">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
          className="flex flex-col items-center gap-5 text-center"
        >
          <span
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--accent)' }}
          >
            Precios
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Planes simples, resultados claros
          </h2>
          <p className="max-w-md text-base" style={{ color: 'var(--text-secondary)' }}>
            Sin costos ocultos. Cancela cuando quieras.
          </p>

          {/* Toggle mensual / anual */}
          <div
            className="flex items-center gap-1 p-1 rounded-xl"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <button
              onClick={() => setIsAnnual(false)}
              className="px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                background: !isAnnual ? 'var(--accent)' : 'transparent',
                color: !isAnnual ? '#FFFFFF' : 'var(--text-secondary)',
              }}
            >
              Mensual
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                background: isAnnual ? 'var(--accent)' : 'transparent',
                color: isAnnual ? '#FFFFFF' : 'var(--text-secondary)',
              }}
            >
              Anual
              <span
                className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                style={{
                  background: isAnnual ? 'rgba(255,255,255,0.18)' : '#E5E9F4',
                  color: isAnnual ? '#FFFFFF' : 'var(--accent)',
                }}
              >
                −20%
              </span>
            </button>
          </div>
        </motion.div>

        {/* ── Plans grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {PLANS.map((plan, i) => {
            const price = isAnnual ? plan.annual : plan.monthly
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: EASE, delay: i * 0.1 }}
                className="relative flex flex-col gap-6 p-8 rounded-2xl"
                style={{
                  background: plan.featured ? '#13244A' : 'var(--surface)',
                  border: plan.featured
                    ? '2px solid #13244A'
                    : '1px solid var(--border)',
                  boxShadow: plan.featured
                    ? '0 8px 40px rgba(19,36,74,0.20)'
                    : 'none',
                }}
              >
                {/* Badge "Más Popular" */}
                {plan.featured && (
                  <span
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold tracking-wide whitespace-nowrap"
                    style={{ background: '#FFFFFF', color: '#13244A' }}
                  >
                    Más Popular
                  </span>
                )}

                {/* Plan name & tagline */}
                <div className="flex flex-col gap-1">
                  <span
                    className="text-xs font-semibold uppercase tracking-widest"
                    style={{
                      color: plan.featured ? 'rgba(255,255,255,0.55)' : 'var(--text-muted)',
                    }}
                  >
                    {plan.name}
                  </span>
                  <p
                    className="text-sm"
                    style={{
                      color: plan.featured ? 'rgba(255,255,255,0.70)' : 'var(--text-secondary)',
                    }}
                  >
                    {plan.tagline}
                  </p>
                </div>

                {/* Price */}
                <div className="flex items-end gap-1.5">
                  <span
                    className="text-4xl font-black tracking-tight leading-none"
                    style={{ color: plan.featured ? '#FFFFFF' : 'var(--text-primary)' }}
                  >
                    ${price.toLocaleString('es-MX')}
                  </span>
                  <span
                    className="text-sm mb-1"
                    style={{
                      color: plan.featured ? 'rgba(255,255,255,0.55)' : 'var(--text-muted)',
                    }}
                  >
                    MXN/mes + IVA
                  </span>
                </div>

                {/* Divider */}
                <hr
                  style={{
                    borderColor: plan.featured ? 'rgba(255,255,255,0.12)' : 'var(--border)',
                  }}
                />

                {/* Feature list */}
                <ul className="flex flex-col gap-3 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <span
                        className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{
                          background: plan.featured ? 'rgba(255,255,255,0.15)' : '#E5E9F4',
                        }}
                      >
                        <Check size={11} color={plan.featured ? '#FFFFFF' : '#13244A'} />
                      </span>
                      <span
                        className="text-sm leading-snug"
                        style={{
                          color: plan.featured
                            ? 'rgba(255,255,255,0.82)'
                            : 'var(--text-secondary)',
                        }}
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href={isAnnual ? whatsappUrl(plan.name) : plan.stripeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 w-full flex items-center justify-center py-3 rounded-xl text-sm font-semibold transition-colors duration-150"
                  style={
                    plan.featured
                      ? { background: '#FFFFFF', color: '#13244A' }
                      : {
                          background: 'transparent',
                          color: 'var(--text-primary)',
                          border: '1.5px solid var(--text-primary)',
                        }
                  }
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement
                    if (plan.featured) {
                      el.style.background = '#F0F0F0'
                    } else {
                      el.style.background = 'var(--surface-hover)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement
                    if (plan.featured) {
                      el.style.background = '#FFFFFF'
                    } else {
                      el.style.background = 'transparent'
                    }
                  }}
                >
                  Elegir plan
                </a>
              </motion.div>
            )
          })}
        </div>

        {/* Trust badge */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center text-xs"
          style={{ color: 'var(--text-muted)' }}
        >
          🔒 Pagos seguros procesados por Stripe. Facturación mensual automatizada.
        </motion.p>

      </div>
    </section>
  )
}
