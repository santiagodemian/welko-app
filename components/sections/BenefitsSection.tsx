'use client'

import { motion } from 'framer-motion'
import { Zap, Clock, Settings } from 'lucide-react'
import { useLang } from '@/contexts/LangContext'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const BENEFITS = {
  es: [
    {
      icon: Zap,
      color: '#3B82F6',
      title: 'Responde en menos de 2 segundos',
      desc: 'Cada mensaje recibido obtiene una respuesta inmediata, sin importar la hora ni el canal.',
    },
    {
      icon: Clock,
      color: '#8B5CF6',
      title: 'Disponible 24/7, sin interrupciones',
      desc: 'Nunca se ausenta, nunca se enferma. Tu negocio atiende incluso cuando está cerrado.',
    },
    {
      icon: Settings,
      color: '#10B981',
      title: 'Activo en menos de 24 horas',
      desc: 'Configura la IA con tus servicios, precios y horarios. Sin código, sin integraciones complejas.',
    },
  ],
  en: [
    {
      icon: Zap,
      color: '#3B82F6',
      title: 'Responds in under 2 seconds',
      desc: 'Every incoming message gets an immediate response, regardless of time or channel.',
    },
    {
      icon: Clock,
      color: '#8B5CF6',
      title: 'Available 24/7, no interruptions',
      desc: 'Never absent, never sick. Your business attends even when it\'s closed.',
    },
    {
      icon: Settings,
      color: '#10B981',
      title: 'Live in under 24 hours',
      desc: 'Configure the AI with your services, prices and hours. No code, no complex integrations.',
    },
  ],
}

export function BenefitsSection() {
  const { lang } = useLang()
  const items = BENEFITS[lang as 'es' | 'en'] ?? BENEFITS.es

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="max-w-5xl mx-auto flex flex-col gap-14">

        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE }}
          className="flex flex-col items-center text-center gap-3"
        >
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--accent-label)' }}>
            {lang === 'es' ? 'Por qué Welko' : 'Why Welko'}
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            {lang === 'es' ? 'Lo que cambia desde el primer día' : 'What changes from day one'}
          </h2>
          <p className="text-base font-light max-w-lg" style={{ color: 'var(--text-secondary)' }}>
            {lang === 'es'
              ? 'Resultados medibles desde el momento en que activas tu recepcionista IA.'
              : 'Measurable results from the moment you activate your AI receptionist.'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {items.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE, delay: i * 0.1 }}
              className="flex flex-col gap-5 p-8 rounded-3xl transition-all duration-200"
              style={{
                background: 'var(--surface)',
                boxShadow: '0 4px 24px rgba(19,36,74,0.07), 0 1px 4px rgba(19,36,74,0.04)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'
                ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 16px 48px rgba(19,36,74,0.12), 0 4px 12px rgba(19,36,74,0.07)'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
                ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 24px rgba(19,36,74,0.07), 0 1px 4px rgba(19,36,74,0.04)'
              }}
            >
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: b.color + '15' }}
              >
                <b.icon size={22} color={b.color} strokeWidth={1.8} />
              </div>

              {/* Content */}
              <div className="flex flex-col gap-2">
                <p className="font-bold text-base leading-snug" style={{ color: 'var(--text-primary)' }}>
                  {b.title}
                </p>
                <p className="text-sm font-light leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {b.desc}
                </p>
              </div>

              {/* Colored bottom accent */}
              <div className="mt-auto pt-4" style={{ borderTop: `2px solid ${b.color}22` }}>
                <span className="text-xs font-semibold" style={{ color: b.color }}>
                  {lang === 'es' ? 'Incluido en todos los planes →' : 'Included in all plans →'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
