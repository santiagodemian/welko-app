'use client'

import { motion } from 'framer-motion'
import { useLang } from '@/contexts/LangContext'
import {
  UserPlus,
  CreditCard,
  Bot,
  Plug,
  Zap,
  BarChart2,
  ChevronRight,
} from 'lucide-react'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

interface Step {
  n: number
  icon: React.ElementType
  title: { es: string; en: string }
  desc:  { es: string; en: string }
  tag?:  { es: string; en: string }
}

const STEPS: Step[] = [
  {
    n: 1,
    icon: UserPlus,
    title: { es: 'Crea tu cuenta', en: 'Create your account' },
    desc: {
      es: 'Regístrate en welko.agency en menos de 60 segundos. Sin tarjeta de crédito para empezar.',
      en: 'Sign up at welko.agency in under 60 seconds. No credit card required to start.',
    },
  },
  {
    n: 2,
    icon: CreditCard,
    title: { es: 'Elige tu plan y paga', en: 'Choose your plan and pay' },
    desc: {
      es: 'Selecciona Essential, Pro o Business según el tamaño de tu clínica. Pago seguro por Stripe, cancela cuando quieras.',
      en: 'Choose Essential, Pro, or Business based on your clinic size. Secure payment via Stripe, cancel anytime.',
    },
    tag: { es: 'Stripe · Sin permanencia', en: 'Stripe · No lock-in' },
  },
  {
    n: 3,
    icon: Bot,
    title: { es: 'Configura tu IA en el onboarding', en: 'Configure your AI in onboarding' },
    desc: {
      es: 'Completa el asistente guiado: nombre de tu clínica, servicios, precios, horarios, tono del agente y FAQs. Tu IA queda lista al instante.',
      en: 'Complete the guided assistant: clinic name, services, prices, hours, agent tone, and FAQs. Your AI is ready instantly.',
    },
    tag: { es: '~5 minutos', en: '~5 minutes' },
  },
  {
    n: 4,
    icon: Plug,
    title: { es: 'Conecta tus canales', en: 'Connect your channels' },
    desc: {
      es: 'Desde el dashboard conecta WhatsApp (Twilio), Instagram y Facebook DMs (Meta), y Llamadas de Voz (Vapi). Instrucciones paso a paso incluidas.',
      en: 'From the dashboard connect WhatsApp (Twilio), Instagram and Facebook DMs (Meta), and Voice Calls (Vapi). Step-by-step instructions included.',
    },
    tag: { es: 'WhatsApp · Instagram · Llamadas', en: 'WhatsApp · Instagram · Calls' },
  },
  {
    n: 5,
    icon: Zap,
    title: { es: 'La IA responde sola, 24/7', en: 'AI responds on its own, 24/7' },
    desc: {
      es: 'Desde ese momento tu recepcionista IA atiende pacientes, agenda citas y convierte leads automáticamente, sin que toques nada.',
      en: 'From that moment your AI receptionist serves patients, books appointments, and converts leads automatically — you don\'t touch a thing.',
    },
  },
  {
    n: 6,
    icon: BarChart2,
    title: { es: 'Monitorea y optimiza', en: 'Monitor and optimize' },
    desc: {
      es: 'Revisa el CRM, los leads capturados, el pipeline de revenue y las conversaciones desde tu dashboard. Ajusta el agente cuando quieras.',
      en: 'Review the CRM, captured leads, revenue pipeline, and conversations from your dashboard. Adjust the agent anytime.',
    },
  },
]

export function HowItWorksSection() {
  const { lang } = useLang()

  return (
    <section id="como-funciona" className="section-spacing px-4 sm:px-6">
      <div className="max-w-5xl mx-auto flex flex-col gap-14">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE }}
          className="flex flex-col gap-4 max-w-2xl"
        >
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--accent-label)' }}>
            {lang === 'es' ? 'Cómo funciona' : 'How it works'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight" style={{ color: 'var(--text-primary)' }}>
            {lang === 'es'
              ? 'De cero a recepcionista IA en 5 pasos'
              : 'From zero to AI receptionist in 5 steps'}
          </h2>
          <p className="text-sm font-light leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {lang === 'es'
              ? 'Sin instalaciones, sin código, sin esperar. Solo configura y activa.'
              : 'No installs, no code, no waiting. Just configure and activate.'}
          </p>
        </motion.div>

        {/* Steps */}
        <div className="flex flex-col gap-0">
          {STEPS.map((step, i) => {
            const Icon = step.icon
            const isLast = i === STEPS.length - 1
            return (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.45, ease: EASE, delay: i * 0.07 }}
                className="flex gap-5 sm:gap-8"
              >
                {/* Left — number + line */}
                <div className="flex flex-col items-center flex-shrink-0" style={{ width: 44 }}>
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 z-10"
                    style={{ background: 'var(--accent)', boxShadow: '0 4px 16px rgba(19,36,74,0.18)' }}
                  >
                    <Icon size={18} color="#ffffff" strokeWidth={2} />
                  </div>
                  {!isLast && (
                    <div
                      className="flex-1 w-px mt-1"
                      style={{ background: 'var(--border)', minHeight: 32 }}
                    />
                  )}
                </div>

                {/* Right — content */}
                <div className={`flex flex-col gap-2 ${isLast ? 'pb-0' : 'pb-8'}`} style={{ flex: 1 }}>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span
                      className="text-xs font-black uppercase tracking-widest"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {lang === 'es' ? `Paso ${step.n}` : `Step ${step.n}`}
                    </span>
                    {step.tag && (
                      <span
                        className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                        style={{ background: 'var(--accent-subtle)', color: 'var(--accent-label)' }}
                      >
                        {lang === 'es' ? step.tag.es : step.tag.en}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {lang === 'es' ? step.title.es : step.title.en}
                  </h3>
                  <p className="text-sm font-light leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {lang === 'es' ? step.desc.es : step.desc.en}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE }}
          className="flex flex-col sm:flex-row items-center gap-4 pt-2"
        >
          <a
            href="/registro"
            className="flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200"
            style={{ background: 'var(--accent)', color: 'var(--accent-fg)', boxShadow: '0 4px 20px rgba(19,36,74,0.22)' }}
          >
            {lang === 'es' ? 'Comenzar ahora' : 'Get started now'}
            <ChevronRight size={15} />
          </a>
          <p className="text-xs font-light" style={{ color: 'var(--text-muted)' }}>
            {lang === 'es' ? 'Sin tarjeta · Configuración en 5 min · Cancela cuando quieras' : 'No card · 5 min setup · Cancel anytime'}
          </p>
        </motion.div>

      </div>
    </section>
  )
}
