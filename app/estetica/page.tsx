'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { ArrowRight, Plus, Minus, CheckCircle2 } from 'lucide-react'
import { WelkoLogo } from '@/components/ui/WelkoLogo'

const NAVY = '#13244A'
const ROSE = '#E11D48'
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const PAIN_POINTS = [
  {
    emoji: '',
    title: 'Cancelaciones last-minute de botox y rellenos',
    desc: 'Slots de $2,000 a $5,000 MXN que se pierden sin aviso. Llegaste al procedimiento, preparaste el consultorio, y el cliente no llega. Sin que nadie lo haya detectado a tiempo.',
    fix: 'Welko predice qué citas tienen riesgo ALTO y manda recordatorios extra automáticamente. Detecta patrones antes de que tú lo notes.',
  },
  {
    emoji: '',
    title: 'Consultas de precio que nunca convierten',
    desc: '"¿Cuánto cuesta el botox de frente?" — y no vuelves a saber de esa persona. El tiempo de respuesta lo es todo: si tardas más de 5 minutos, ya buscó a alguien más.',
    fix: 'La IA responde en 2 segundos con tus precios y disponibilidad. Convierte esa pregunta en una cita antes de que cierres el mensaje.',
  },
  {
    emoji: '',
    title: 'DMs de Instagram sin responder por horas',
    desc: 'Tu Instagram tiene mensajes desde el martes. El algoritmo te penaliza cuando tardas. Y cada DM sin respuesta es un cliente que se fue.',
    fix: 'Conectas Instagram a Welko y todos los mensajes se responden automáticamente — con el mismo tono y calidad que tú.',
  },
  {
    emoji: '',
    title: 'Sin seguimiento post-tratamiento',
    desc: 'El cliente se fue después del botox o el relleno. No hay seguimiento a las 24h ni a las 48h. Y cuando hay algún efecto secundario, no te enteraste a tiempo.',
    fix: 'Welko manda seguimiento automático el día siguiente y a las 48h. Construye confianza sin que hagas nada.',
  },
]

const HOW_IT_WORKS = [
  { n: '01', title: 'Configuras tus tratamientos y precios', desc: 'Botox, rellenos, rinomodelación, bichectomía, hidratación — lo que ofreces. Sin código.' },
  { n: '02', title: 'Conectas WhatsApp e Instagram', desc: 'Tu mismo número y cuenta de siempre. La IA empieza a responder en todos los canales al instante.' },
  { n: '03', title: 'Tu centro estético atiende 24/7', desc: 'Consultas de precio, agendado de citas, seguimiento post-tratamiento — todo sin intervención humana.' },
]

const FAQS = [
  {
    q: '¿La IA entiende términos como rinomodelación, bichectomía o ácido hialurónico?',
    a: 'Sí. Durante el onboarding agregas tus servicios específicos con sus nombres, precios y duración. La IA aprende exactamente lo que ofreces y responde con esa información — no con respuestas genéricas.',
  },
  {
    q: '¿Funciona para WhatsApp e Instagram al mismo tiempo?',
    a: 'Sí, ambos canales en un solo panel. Conectas WhatsApp Business API e Instagram Business API, y la IA responde en los dos con el mismo tono y disponibilidad. Un mensaje desde Instagram y otro desde WhatsApp llegan al mismo dashboard.',
  },
  {
    q: '¿Puede mandar seguimiento automático después del procedimiento?',
    a: 'Sí. Puedes configurar mensajes automáticos post-tratamiento: uno a las 24 horas ("¿Cómo te sentiste después del botox?") y otro a las 48 horas. El cliente lo percibe como atención personalizada — en realidad lo hizo la IA.',
  },
  {
    q: '¿Vale para centros pequeños o de una sola persona?',
    a: 'Es perfectamente pensado para eso. Una terapeuta que trabaja sola no puede estar en el teléfono y haciendo tratamientos al mismo tiempo. Welko es literalmente tu recepcionista virtual cuando tú estás ocupada. El plan Starter ($999 MXN/mes) es el más popular entre centros individuales.',
  },
  {
    q: '¿Qué garantías tienen?',
    a: '14 días de garantía completa. Si en las primeras dos semanas no ves el valor, te devolvemos el 100% de tu pago sin preguntas. Sin contratos anuales, sin penalizaciones por cancelar.',
  },
]

export default function EsteticaPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <>
      <Navbar />
      <main className="flex flex-col flex-1 pt-28" style={{ background: 'var(--bg)' }}>

        {/* Hero */}
        <section className="px-4 sm:px-6 pt-10 sm:pt-14 pb-14 sm:pb-20">
          <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-5 sm:gap-7">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold"
              style={{ background: '#FFF1F2', color: ROSE, border: '1px solid #FECDD3' }}>
               Especialmente para Centros de Estética y Spa
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: EASE, delay: 0.06 }}
              className="text-[1.875rem] sm:text-5xl font-extrabold tracking-tight leading-tight"
              style={{ color: 'var(--text-primary)' }}>
              Tu asistente IA<br />
              <span style={{ color: NAVY }}>para Centros de Estética</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.12 }}
              className="text-lg sm:text-xl font-light leading-relaxed max-w-2xl"
              style={{ color: 'var(--text-secondary)' }}>
              Desde consultas de botox hasta seguimiento post-procedimiento. La IA atiende a tus clientas mientras tú te enfocas en los tratamientos.
            </motion.p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, ease: EASE }}
              className="flex flex-col sm:flex-row gap-3">
              <Link href="/precios"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-base transition-all"
                style={{ background: NAVY, color: '#fff', boxShadow: '0 4px 20px rgba(19,36,74,0.25)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)' }}>
                Comenzar gratis <ArrowRight size={16} />
              </Link>
              <Link href="/demo"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-medium text-base transition-all"
                style={{ border: '1.5px solid var(--border)', color: 'var(--text-primary)', background: 'var(--surface)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'var(--surface-hover)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'var(--surface)' }}>
                Ver demo en vivo
              </Link>
            </motion.div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Garantía 14 días · Sin contrato · Sin cambiar tu número
            </motion.p>
          </div>
        </section>

        {/* Pain points */}
        <section className="py-16 sm:py-20 px-4 sm:px-6" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
          <div className="max-w-5xl mx-auto flex flex-col gap-10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center" style={{ color: 'var(--text-primary)' }}>
              Los problemas que los centros estéticos enfrentan todos los días
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {PAIN_POINTS.map((p, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.4, ease: EASE }}
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <span style={{ fontSize: 28 }}>{p.emoji}</span>
                  <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{p.title}</p>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{p.desc}</p>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '8px 12px', background: 'rgba(19,36,74,0.05)', borderRadius: 10, borderLeft: `3px solid ${NAVY}` }}>
                    <CheckCircle2 size={13} color={NAVY} style={{ flexShrink: 0, marginTop: 1 }} />
                    <p style={{ fontSize: 12, color: NAVY, fontWeight: 500, margin: 0, lineHeight: 1.55 }}>{p.fix}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-16 sm:py-20 px-4 sm:px-6" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="max-w-4xl mx-auto flex flex-col gap-10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center" style={{ color: 'var(--text-primary)' }}>
              Cómo funciona Welko para tu centro estético
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {HOW_IT_WORKS.map((step, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.4, ease: EASE }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <span style={{ fontSize: 28, fontWeight: 900, color: 'var(--border)', lineHeight: 1 }}>{step.n}</span>
                  <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{step.title}</p>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 sm:py-20 px-4 sm:px-6" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
          <div className="max-w-3xl mx-auto flex flex-col gap-8">
            <div className="text-center flex flex-col gap-2">
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Preguntas de centros estéticos</h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Lo que siempre preguntan antes de activar Welko.</p>
            </div>
            <div className="flex flex-col gap-3">
              {FAQS.map((faq, i) => {
                const isOpen = openFaq === i
                return (
                  <motion.div key={i}
                    initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.05, duration: 0.35, ease: EASE }}
                    style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <button onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left transition-colors"
                      style={{ background: isOpen ? 'var(--surface-hover)' : 'var(--surface)' }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{faq.q}</span>
                      <span style={{ flexShrink: 0, width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: isOpen ? NAVY : 'var(--border)' }}>
                        {isOpen ? <Minus size={12} color="#fff" /> : <Plus size={12} color="var(--text-secondary)" />}
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28, ease: EASE }}
                          style={{ overflow: 'hidden' }}>
                          <p style={{ padding: '0 20px 16px', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>{faq.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4 sm:px-6"
          style={{ background: `linear-gradient(135deg, #05101F 0%, ${NAVY} 100%)` }}>
          <div className="max-w-2xl mx-auto flex flex-col items-center text-center gap-6">
            <span style={{ fontSize: 32 }}></span>
            <h2 className="text-2xl sm:text-3xl font-extrabold" style={{ color: '#fff' }}>
              Tu centro estético, atendiendo 24/7 desde hoy
            </h2>
            <p style={{ color: 'rgba(240,244,252,0.6)', fontSize: 15 }}>
              Tú enfocada en los tratamientos. La IA en los mensajes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/precios"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-base transition-all"
                style={{ background: '#fff', color: NAVY }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#F0F4FC' }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#fff' }}>
                Comenzar ahora <ArrowRight size={16} />
              </Link>
              <Link href="/demo"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-medium text-base transition-all"
                style={{ border: '1.5px solid rgba(255,255,255,0.25)', color: 'rgba(240,244,252,0.85)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.07)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent' }}>
                Ver demo primero
              </Link>
            </div>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>Garantía 14 días · Cancela cuando quieras</p>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 sm:px-6" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <WelkoLogo size={20} />
              <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>© {new Date().getFullYear()} Welko — El recepcionista IA lider.</p>
            </div>
            <div className="flex gap-5">
              {[{ l: 'Precios', h: '/precios' }, { l: 'Demo', h: '/demo' }, { l: 'Contacto', h: '/contacto' }].map(link => (
                <Link key={link.h} href={link.h} style={{ fontSize: 11, color: 'var(--text-muted)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-primary)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted)' }}>
                  {link.l}
                </Link>
              ))}
            </div>
          </div>
        </footer>
      </main>
    </>
  )
}
