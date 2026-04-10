'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, X, Loader2, Zap } from 'lucide-react'
import { useLang } from '@/contexts/LangContext'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]
const WA_NUMBER = '525628443738'

function whatsappUrl(planName: string, lang: string): string {
  const msg = lang === 'es'
    ? `Hola, me interesa contratar el Plan ${planName} de Welko. ¿Me pueden dar los detalles?`
    : `Hi, I'm interested in Welko's ${planName} Plan. Can you give me the details?`
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`
}

interface Feature {
  text: { es: string; en: string }
  included: boolean
  highlight?: boolean
}

interface Plan {
  id: string
  name: string
  badge?: { es: string; en: string }
  tagline: { es: string; en: string }
  for: { es: string; en: string }
  // MXN prices
  monthly: number
  annual: number
  // USD prices (USA / Canada / international)
  monthlyUSD: number
  annualUSD: number
  featured: boolean
  cta?: { es: string; en: string }
  features: Feature[]
  roi?: { es: string; en: string }
  roiUSD?: { es: string; en: string }
}

const PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: { es: 'Para arrancar sin riesgos', en: 'Start with no risk' },
    for: { es: 'Solo profesional · negocio chico', en: 'Solo professional · small business' },
    monthly: 299,    annual: 239,
    monthlyUSD: 49,  annualUSD: 39,
    featured: false,
    features: [
      { text: { es: '1 canal: WhatsApp Business API', en: '1 channel: WhatsApp Business API' }, included: true },
      { text: { es: 'IA responde precios, horarios, ubicación', en: 'AI answers prices, hours, location' }, included: true },
      { text: { es: 'Hasta 300 conversaciones/mes', en: 'Up to 300 conversations/month' }, included: true },
      { text: { es: 'Recordatorios de cita (hasta 100/mes)', en: 'Appointment reminders (up to 100/mo)' }, included: true },
      { text: { es: 'Panel básico de métricas', en: 'Basic metrics dashboard' }, included: true },
      { text: { es: 'Configuración en < 24 horas', en: 'Setup in < 24 hours' }, included: true },
      { text: { es: 'Agenda inteligente', en: 'Smart scheduling' }, included: false },
      { text: { es: 'Multi-canal (Instagram, Facebook)', en: 'Multi-channel (Instagram, Facebook)' }, included: false },
      { text: { es: 'Recordatorios ilimitados', en: 'Unlimited reminders' }, included: false },
      { text: { es: 'CRM de clientes', en: 'Client CRM' }, included: false },
    ],
    roi: {
      es: 'Recupera 1 cita/mes para que se pague solo',
      en: 'Recover 1 appointment/month to break even',
    },
    roiUSD: {
      es: 'Recover 1 booking/month and it pays for itself',
      en: 'Recover 1 booking/month and it pays for itself',
    },
  },
  {
    id: 'essential',
    name: 'Essential',
    tagline: { es: 'Automatización completa del canal digital', en: 'Full digital channel automation' },
    for: { es: 'Profesional establecido · 1 sede', en: 'Established professional · 1 location' },
    monthly: 799,    annual: 639,
    monthlyUSD: 99,  annualUSD: 79,
    featured: false,
    features: [
      { text: { es: '1 canal: WhatsApp Business API', en: '1 channel: WhatsApp Business API' }, included: true },
      { text: { es: 'IA conversacional 24/7', en: '24/7 conversational AI' }, included: true },
      { text: { es: 'Hasta 500 conversaciones/mes', en: 'Up to 500 conversations/month' }, included: true },
      { text: { es: 'Agenda inteligente (Google Calendar)', en: 'Smart scheduling (Google Calendar)' }, included: true, highlight: true },
      { text: { es: 'Recordatorios + confirmaciones ilimitadas', en: 'Unlimited reminders + confirmations' }, included: true, highlight: true },
      { text: { es: 'Widget web embebible', en: 'Embeddable web widget' }, included: true },
      { text: { es: 'Reportes semanales automáticos', en: 'Automatic weekly reports' }, included: true },
      { text: { es: 'Soporte por chat (< 24 h)', en: 'Chat support (< 24 h)' }, included: true },
      { text: { es: 'Multi-canal (Instagram, Facebook)', en: 'Multi-channel (Instagram, Facebook)' }, included: false },
      { text: { es: 'CRM de clientes', en: 'Client CRM' }, included: false },
    ],
    roi: {
      es: '1 cita recuperada/mes = plan pagado',
      en: '1 recovered appointment/month = plan paid',
    },
    roiUSD: {
      es: '1 recovered booking/month = plan paid',
      en: '1 recovered booking/month = plan paid',
    },
  },
  {
    id: 'pro',
    name: 'Pro',
    badge: { es: 'Más popular', en: 'Most popular' },
    tagline: { es: 'Tu secretaria se enfoca en vender, no en contestar', en: 'Your staff sells, not answers messages' },
    for: { es: 'Equipos de 2–5 personas · cualquier industria', en: '2–5 person teams · any industry' },
    monthly: 1499,    annual: 1199,
    monthlyUSD: 199,  annualUSD: 159,
    featured: true,
    features: [
      { text: { es: '3 canales: WhatsApp + Instagram + Facebook', en: '3 channels: WhatsApp + Instagram + Facebook' }, included: true, highlight: true },
      { text: { es: 'IA conversacional 24/7', en: '24/7 conversational AI' }, included: true },
      { text: { es: 'Hasta 2,000 conversaciones/mes', en: 'Up to 2,000 conversations/month' }, included: true },
      { text: { es: 'Agenda inteligente + waitlist automático', en: 'Smart scheduling + automatic waitlist' }, included: true, highlight: true },
      { text: { es: 'Recordatorios + reconfirmación 24h antes', en: 'Reminders + 24h reconfirmation' }, included: true },
      { text: { es: 'CRM de clientes (historial + contexto)', en: 'Client CRM (history + context)' }, included: true, highlight: true },
      { text: { es: 'Widget web + 2 integraciones (Stripe / Calendly)', en: 'Web widget + 2 integrations (Stripe / Calendly)' }, included: true },
      { text: { es: 'Reportes semanales automáticos', en: 'Automatic weekly reports' }, included: true },
      { text: { es: 'Soporte prioritario (< 8 h)', en: 'Priority support (< 8 h)' }, included: true },
      { text: { es: 'Voz IA / llamadas automáticas', en: 'Voice AI / automatic calls' }, included: false },
    ],
    roi: {
      es: 'Recupera 3–4 citas/mes = plan pagado 2–3×',
      en: 'Recover 3–4 appts/month = plan paid 2–3×',
    },
    roiUSD: {
      es: 'Recover 3–4 bookings/month = plan pays itself 3×',
      en: 'Recover 3–4 bookings/month = plan pays itself 3×',
    },
  },
  {
    id: 'business',
    name: 'Business',
    tagline: { es: 'Escalabilidad total sin límites', en: 'Total scalability, no limits' },
    for: { es: 'Multi-sede · alto volumen · franquicia', en: 'Multi-location · high volume · franchise' },
    monthly: 2999,    annual: 2399,
    monthlyUSD: 399,  annualUSD: 319,
    featured: false,
    cta: { es: 'Hablar con ventas', en: 'Talk to sales' },
    features: [
      { text: { es: 'Todo lo del plan Pro', en: 'Everything in Pro' }, included: true },
      { text: { es: 'Canales ilimitados', en: 'Unlimited channels' }, included: true },
      { text: { es: 'Conversaciones ilimitadas', en: 'Unlimited conversations' }, included: true },
      { text: { es: 'Voz IA: responde y agenda por llamada', en: 'Voice AI: answers and books by call' }, included: true, highlight: true },
      { text: { es: 'Hasta 3 sedes incluidas (+$999/sede extra)', en: 'Up to 3 locations (+$999/extra)' }, included: true, highlight: true },
      { text: { es: 'Campañas de reactivación automáticas', en: 'Automatic reactivation campaigns' }, included: true, highlight: true },
      { text: { es: 'API access + Zapier + HubSpot', en: 'API access + Zapier + HubSpot' }, included: true },
      { text: { es: '2 sesiones onboarding 1:1', en: '2 onboarding 1:1 sessions' }, included: true },
      { text: { es: 'Account manager dedicado', en: 'Dedicated account manager' }, included: true },
      { text: { es: 'SLA soporte < 4 horas', en: 'Support SLA < 4 hours' }, included: true },
    ],
    roi: {
      es: '1 prospecto cerrado extra/mes = plan pagado 5×',
      en: '1 extra closed lead/month = plan paid 5×',
    },
    roiUSD: {
      es: '1 extra closed deal/month = plan paid 5×',
      en: '1 extra closed deal/month = plan paid 5×',
    },
  },
]

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)
  const { lang, currency } = useLang()
  const isUSD = currency === 'USD'

  async function handleCheckout(planId: string, planName: string) {
    setLoading(planId)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId, annual: isAnnual }),
      })
      const data = await res.json()
      if (data.url) { window.location.href = data.url; return }
      throw new Error('No URL')
    } catch {
      window.location.href = '/registro'
    } finally {
      setLoading(null)
    }
  }

  const L = {
    eyebrow: lang === 'es' ? 'Planes y precios'                            : 'Plans & pricing',
    heading: lang === 'es' ? 'Planes simples, resultados claros'           : 'Simple plans, clear results',
    sub:     lang === 'es' ? 'Sin costos ocultos. Cancela cuando quieras.' : 'No hidden fees. Cancel anytime.',
    monthly: lang === 'es' ? 'Mensual'                                     : 'Monthly',
    annual:  lang === 'es' ? 'Anual'                                       : 'Annual',
    cta:     lang === 'es' ? 'Comenzar ahora'                              : 'Get started now',
    trust:   lang === 'es' ? '🔒 Pagos seguros por Stripe · Sin permanencia · Cancela cuando quieras' : '🔒 Secure payments via Stripe · No lock-in · Cancel anytime',
    iva:     isUSD
              ? (lang === 'es' ? 'USD/mes + impuestos' : 'USD/mo + tax')
              : (lang === 'es' ? 'MXN/mes + IVA'       : 'MXN/mo + VAT'),
    forLabel: lang === 'es' ? 'Para:'                                      : 'For:',
    roi:      lang === 'es' ? '💡 ROI:'                                    : '💡 ROI:',
  }

  return (
    <section id="precios" className="py-20 sm:py-28 px-4 sm:px-6" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
      <div className="max-w-6xl mx-auto flex flex-col gap-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE }}
          className="flex flex-col items-center gap-4 text-center"
        >
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--accent-label)' }}>
            {L.eyebrow}
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            {L.heading}
          </h2>
          <p className="text-base font-light" style={{ color: 'var(--text-secondary)' }}>
            {L.sub}
          </p>

          {/* Toggle mensual / anual */}
          <div
            className="flex items-center gap-1 p-1 rounded-xl mt-2"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <button
              onClick={() => setIsAnnual(false)}
              className="px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={{ background: !isAnnual ? 'var(--accent)' : 'transparent', color: !isAnnual ? '#FFFFFF' : 'var(--text-secondary)' }}
            >
              {L.monthly}
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={{ background: isAnnual ? 'var(--accent)' : 'transparent', color: isAnnual ? '#FFFFFF' : 'var(--text-secondary)' }}
            >
              {L.annual}
              <span
                className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: isAnnual ? 'rgba(255,255,255,0.2)' : '#E5E9F4', color: isAnnual ? '#fff' : 'var(--accent)' }}
              >
                −20%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Plans grid — 4 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {PLANS.map((plan, i) => {
            const price = isUSD
              ? (isAnnual ? plan.annualUSD : plan.monthlyUSD)
              : (isAnnual ? plan.annual    : plan.monthly)
            const isFeatured = plan.featured
            const ctaLabel = plan.cta ? (lang === 'es' ? plan.cta.es : plan.cta.en) : L.cta
            const roiText = isUSD && plan.roiUSD
              ? (lang === 'es' ? plan.roiUSD.es : plan.roiUSD.en)
              : plan.roi ? (lang === 'es' ? plan.roi.es : plan.roi.en) : null

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE, delay: i * 0.08 }}
                className="relative flex flex-col gap-5 p-6 rounded-3xl"
                style={
                  isFeatured
                    ? {
                        background: 'linear-gradient(145deg, #13244A 0%, #0E1F38 100%)',
                        border: '1.5px solid rgba(96,165,250,0.35)',
                        boxShadow: '0 20px 60px rgba(19,36,74,0.35), 0 0 0 1px rgba(96,165,250,0.15)',
                        transform: 'scale(1.02)',
                      }
                    : {
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        boxShadow: '0 4px 24px rgba(19,36,74,0.07)',
                      }
                }
              >
                {/* Popular badge */}
                {plan.badge && (
                  <span
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-bold whitespace-nowrap"
                    style={{ background: '#60A5FA', color: '#05101F', boxShadow: '0 4px 12px rgba(96,165,250,0.4)' }}
                  >
                    <Zap size={10} fill="#05101F" />
                    {lang === 'es' ? plan.badge.es : plan.badge.en}
                  </span>
                )}

                {/* Plan name + tagline */}
                <div className="flex flex-col gap-1 pt-1">
                  <span
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{ color: isFeatured ? 'rgba(255,255,255,0.45)' : 'var(--text-muted)' }}
                  >
                    {plan.name}
                  </span>
                  <p
                    className="text-sm font-semibold leading-snug"
                    style={{ color: isFeatured ? '#F0F4FC' : 'var(--text-primary)' }}
                  >
                    {lang === 'es' ? plan.tagline.es : plan.tagline.en}
                  </p>
                  <p
                    className="text-xs font-light"
                    style={{ color: isFeatured ? 'rgba(255,255,255,0.35)' : 'var(--text-muted)' }}
                  >
                    {L.forLabel} {lang === 'es' ? plan.for.es : plan.for.en}
                  </p>
                </div>

                {/* Price */}
                <div className="flex items-end gap-1.5">
                  <span
                    className="text-4xl font-black tracking-tight leading-none"
                    style={{ color: isFeatured ? '#FFFFFF' : 'var(--text-primary)' }}
                  >
                    {isUSD ? `$${price}` : `$${price.toLocaleString('es-MX')}`}
                  </span>
                  <span
                    className="text-xs mb-1.5"
                    style={{ color: isFeatured ? 'rgba(255,255,255,0.4)' : 'var(--text-muted)' }}
                  >
                    {L.iva}
                  </span>
                </div>

                {/* ROI pill */}
                {roiText && (
                  <div
                    className="px-3 py-2 rounded-xl text-xs font-medium leading-snug"
                    style={
                      isFeatured
                        ? { background: 'rgba(96,165,250,0.15)', color: '#93C5FD', border: '1px solid rgba(96,165,250,0.2)' }
                        : { background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }
                    }
                  >
                    {L.roi} {roiText}
                  </div>
                )}

                <hr style={{ borderColor: isFeatured ? 'rgba(255,255,255,0.08)' : 'var(--border)', margin: 0 }} />

                {/* Features */}
                <ul className="flex flex-col gap-2.5 flex-1">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-2">
                      <span
                        className="mt-0.5 flex-shrink-0"
                        style={{
                          color: f.included
                            ? (isFeatured ? (f.highlight ? '#60A5FA' : 'rgba(255,255,255,0.7)') : (f.highlight ? 'var(--accent)' : 'var(--text-secondary)'))
                            : (isFeatured ? 'rgba(255,255,255,0.2)' : 'var(--border)'),
                        }}
                      >
                        {f.included ? <Check size={13} strokeWidth={2.5} /> : <X size={13} />}
                      </span>
                      <span
                        className="text-xs leading-snug"
                        style={{
                          fontWeight: f.highlight && f.included ? 600 : 400,
                          color: f.included
                            ? (isFeatured ? (f.highlight ? '#E0EEFF' : 'rgba(255,255,255,0.75)') : (f.highlight ? 'var(--text-primary)' : 'var(--text-secondary)'))
                            : (isFeatured ? 'rgba(255,255,255,0.25)' : 'var(--text-muted)'),
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
                  onClick={() => handleCheckout(plan.id, plan.name)}
                  disabled={loading === plan.id}
                  className="mt-2 w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold tracking-wide transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={
                    isFeatured
                      ? { background: '#FFFFFF', color: '#0A0F1A', border: 'none', boxShadow: '0 4px 16px rgba(255,255,255,0.2)', cursor: 'pointer' }
                      : { background: 'transparent', color: 'var(--text-primary)', border: '1.5px solid var(--border)', cursor: 'pointer' }
                  }
                  onMouseEnter={(e) => {
                    if (loading === plan.id) return
                    const el = e.currentTarget as HTMLButtonElement
                    if (isFeatured) { el.style.background = '#EEF2FF'; el.style.transform = 'translateY(-1px)' }
                    else el.style.background = 'var(--surface-hover)'
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLButtonElement
                    el.style.background = isFeatured ? '#FFFFFF' : 'transparent'
                    el.style.transform = 'translateY(0)'
                  }}
                >
                  {loading === plan.id ? <Loader2 size={14} className="animate-spin" /> : ctaLabel}
                </button>
              </motion.div>
            )
          })}
        </div>

        {/* Trust line */}
        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center text-xs"
          style={{ color: 'var(--text-muted)' }}
        >
          {L.trust}
        </motion.p>

      </div>
    </section>
  )
}
