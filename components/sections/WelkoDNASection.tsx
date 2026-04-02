'use client'

import { motion } from 'framer-motion'
import { useLang } from '@/contexts/LangContext'
import Link from 'next/link'

const NAVY  = '#1A2A56'
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const CHANNELS = [
  { icon: '💬', label: 'WhatsApp', color: '#25D366' },
  { icon: '📸', label: 'Instagram', color: '#E1306C' },
  { icon: '🌐', label: 'Web Chat', color: '#3B82F6' },
  { icon: '📞', label: 'Llamadas', color: '#8B5CF6' },
]

const SPECIALTIES = [
  { emoji: '🦷', label: 'Dental' },
  { emoji: '🧠', label: 'Psicología' },
  { emoji: '✨', label: 'Estética' },
  { emoji: '🥗', label: 'Nutrición' },
  { emoji: '🌸', label: 'Ginecología' },
  { emoji: '👁️', label: 'Oftalmología' },
  { emoji: '🩺', label: 'Medicina Gral' },
  { emoji: '💪', label: 'Fisioterapia' },
  { emoji: '💆', label: 'Spa & Bienestar' },
  { emoji: '🔧', label: 'Quiropráctica' },
]

export function WelkoDNASection() {
  const { lang } = useLang()

  return (
    <section
      className="py-16 sm:py-24 px-4 sm:px-6"
      style={{ background: NAVY, color: '#fff' }}
    >
      <div className="max-w-5xl mx-auto flex flex-col gap-14">

        {/* ── Headline ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE }}
          className="flex flex-col items-center text-center gap-4"
        >
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.45)' }}>
            {lang === 'es' ? 'El ADN de Welko' : "Welko's DNA"}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight max-w-3xl leading-tight">
            {lang === 'es'
              ? <>No somos un directorio.<br />Somos tu infraestructura de ingresos.</>
              : <>We're not a directory.<br />We're your revenue infrastructure.</>}
          </h2>
          <p className="text-sm sm:text-base max-w-xl leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
            {lang === 'es'
              ? 'Welko no te lista entre la competencia. Te da las herramientas para captar, convertir y retener pacientes — en tus propios canales, con tu propia marca.'
              : "Welko doesn't list you among the competition. It gives you the tools to capture, convert, and retain patients — on your own channels, with your own brand."}
          </p>
        </motion.div>

        {/* ── Channels + Specialties grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">

          {/* Omnichannel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE }}
            className="flex flex-col gap-5"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {lang === 'es' ? 'Omnicanalidad' : 'Omnichannel'}
              </p>
              <p className="text-lg font-bold">
                {lang === 'es'
                  ? 'Un solo cerebro IA. Todos tus canales.'
                  : 'One AI brain. All your channels.'}
              </p>
              <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
                {lang === 'es'
                  ? 'La misma IA atiende simultáneamente en WhatsApp, Instagram, tu web y llamadas — con voz y contexto unificados.'
                  : 'The same AI simultaneously handles WhatsApp, Instagram, your website, and calls — with a unified voice and context.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {CHANNELS.map((ch, i) => (
                <motion.div
                  key={ch.label}
                  initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }} transition={{ duration: 0.3, ease: EASE, delay: i * 0.07 }}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: ch.color + '22',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18,
                  }}>
                    {ch.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{ch.label}</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
                      {lang === 'es' ? '< 2 seg' : '< 2 sec'}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Specialties */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
            className="flex flex-col gap-5"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {lang === 'es' ? 'Especialización clínica' : 'Clinical specialization'}
              </p>
              <p className="text-lg font-bold">
                {lang === 'es'
                  ? '10 módulos médicos especializados.'
                  : '10 specialized medical modules.'}
              </p>
              <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
                {lang === 'es'
                  ? 'Cada especialidad tiene su propio entrenamiento de IA, terminología clínica y flujos de conversación.'
                  : 'Each specialty has its own AI training, clinical terminology, and conversation flows.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {SPECIALTIES.map((sp, i) => (
                <motion.div
                  key={sp.label}
                  initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.25, ease: EASE, delay: i * 0.04 }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <span style={{ fontSize: 14 }}>{sp.emoji}</span>
                  <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>{sp.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Bottom strip: 3 pillars ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-8"
          style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
        >
          {[
            {
              icon: '🏗️',
              title: lang === 'es' ? 'Infraestructura propia' : 'Own infrastructure',
              desc:  lang === 'es'
                ? 'Marca blanca, tus datos, tu CRM — sin depender de ningún directorio ni plataforma externa.'
                : 'White label, your data, your CRM — no dependency on any directory or external platform.',
            },
            {
              icon: '⚡',
              title: lang === 'es' ? 'Respuesta inmediata' : 'Instant response',
              desc:  lang === 'es'
                ? 'La IA contesta en menos de 2 segundos, cierra la cita y la registra en tu calendario — sola.'
                : 'AI responds in under 2 seconds, books the appointment, and adds it to your calendar — alone.',
            },
            {
              icon: '📈',
              title: lang === 'es' ? 'Revenue medible' : 'Measurable revenue',
              desc:  lang === 'es'
                ? 'Dashboard en tiempo real. Sabes exactamente cuánto dinero rescató Welko esta semana.'
                : 'Real-time dashboard. Know exactly how much revenue Welko rescued this week.',
            },
          ].map((p, i) => (
            <div key={i} className="flex flex-col gap-3">
              <span style={{ fontSize: 24 }}>{p.icon}</span>
              <div>
                <p className="text-sm font-bold mb-1">{p.title}</p>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>{p.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.4, ease: EASE }}
          className="flex justify-center"
        >
          <Link
            href="/registro"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200"
            style={{ background: '#fff', color: NAVY }}
            onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.opacity = '0.9')}
            onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.opacity = '1')}
          >
            {lang === 'es' ? 'Quiero mi infraestructura de ingresos' : 'I want my revenue infrastructure'} →
          </Link>
        </motion.div>

      </div>
    </section>
  )
}
