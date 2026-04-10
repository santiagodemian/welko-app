'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { ArrowRight, Plus, Minus, CheckCircle2 } from 'lucide-react'
import { WelkoLogo } from '@/components/ui/WelkoLogo'

const NAVY = '#13244A'
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const PAIN_POINTS = [
  {
    emoji: '',
    title: 'Pacientes que preguntan a las 11 PM y no vuelven',
    desc: 'Alguien pregunta el precio de un implante por WhatsApp en la noche. Tú no ves el mensaje hasta la mañana. Para entonces, ya agendó con tu competencia.',
    fix: 'Welko responde en 2 segundos a cualquier hora — y agenda la cita antes de que cierres los ojos.',
  },
  {
    emoji: '',
    title: 'No-shows en limpiezas y ortodoncia',
    desc: 'Un slot de $850 vacío. Otro de $2,400. Se acumulan a fin de mes y la pérdida duele. Los recordatorios manuales no escalan.',
    fix: 'Welko predice qué citas tienen riesgo ALTO y manda recordatorio extra automáticamente. Sin que nadie lo pida.',
  },
  {
    emoji: '',
    title: 'Horas perdidas confirmando citas por teléfono',
    desc: 'Tu recepcionista llama a 15 pacientes al día para confirmar. 8 no contestan. 4 necesitan reagendar. Es tiempo que debería estar en la sala de espera.',
    fix: 'La IA confirma, reagenda y cancela por WhatsApp. Tu recepcionista se enfoca en los pacientes que ya están ahí.',
  },
  {
    emoji: '',
    title: '¿Cuánto cuesta una limpieza? × 40 veces al día',
    desc: 'Las mismas preguntas, todos los días, a todas horas. Precio de ortodoncia. Tiempo de implante. Si aceptan seguro. Tu equipo contesta lo mismo en loop.',
    fix: 'La IA conoce todos tus servicios, precios y FAQs. Responde al instante y convierte esa pregunta en una cita.',
  },
]

const HOW_IT_WORKS = [
  { n: '01', title: 'Configuras tu clínica en 20 minutos', desc: 'Agregas tus servicios, precios, horarios y el nombre de tu asistente IA. Sin código, sin trucos.' },
  { n: '02', title: 'Conectas WhatsApp e Instagram', desc: 'Tu número actual, sin cambiarlo. La IA empieza a responder inmediatamente en todos los canales.' },
  { n: '03', title: 'Tu clínica atiende 24/7 sola', desc: 'Preguntas, cotizaciones, citas y recordatorios — todo en automático. Tú solo atiendes a los pacientes frente a ti.' },
]

const FAQS = [
  {
    q: '¿La IA entiende términos como endodoncia, periodoncia o implantes?',
    a: 'Sí. Welko se configura con tus servicios específicos. Si ofreces endodoncia, bruxismo, ortodoncia invisible o implantes all-on-4, la IA sabe de qué habla — no da respuestas genéricas. Tú agregas los términos y precios que usas en tu clínica.',
  },
  {
    q: '¿Funciona con mi número de WhatsApp Business actual?',
    a: 'Tu mismo número, sin cambiarlo. Migramos tu línea a WhatsApp Business API (la versión oficial de Meta) en menos de 24 horas. Tus pacientes siguen escribiendo al mismo número de siempre.',
  },
  {
    q: '¿Puede agendar citas directamente en mi agenda?',
    a: 'Sí. Welko se conecta con Google Calendar en todos los planes. Para clínicas que usan Doctoralia u otros sistemas de agenda, el plan Business incluye integración directa. La IA puede ver tu disponibilidad real y agendar sin crear duplicados.',
  },
  {
    q: '¿Qué pasa si un paciente tiene una urgencia dental?',
    a: 'La IA detecta palabras clave de urgencia ("me duele mucho", "se me cayó la corona", "absceso") y transfiere la conversación a tu equipo en tiempo real, con una notificación. Tú decides qué categorías de mensajes siempre llegan a un humano.',
  },
  {
    q: '¿Cuánto cuesta Welko para una clínica dental?',
    a: 'El plan Starter arranca en $999 MXN/mes. Para una clínica con 10+ citas al día, el costo se paga solo con la primera cita recuperada. Además, tienes 14 días de garantía: si no ves valor, te devolvemos el 100%.',
  },
]

export default function DentalPage() {
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
              style={{ background: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE' }}>
               Especialmente para Clínicas Dentales
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: EASE, delay: 0.06 }}
              className="text-[1.875rem] sm:text-5xl font-extrabold tracking-tight leading-tight"
              style={{ color: 'var(--text-primary)' }}>
              Tu recepcionista IA<br />
              <span style={{ color: NAVY }}>para Clínicas Dentales</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.12 }}
              className="text-base sm:text-xl font-light leading-relaxed max-w-2xl"
              style={{ color: 'var(--text-secondary)' }}>
              Responde consultas de implantes, ortodoncia y limpiezas. Agenda citas. Reduce no-shows. Todo en automático, las 24 horas — sin que tu equipo levante un dedo.
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
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Los problemas que una clínica dental enfrenta todos los días
              </h2>
            </div>
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
              Cómo funciona Welko para tu clínica dental
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
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Preguntas frecuentes de dentistas</h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Lo que siempre preguntan antes de activar Welko en su clínica.</p>
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
              Tu clínica dental, atendiendo 24/7 desde hoy
            </h2>
            <p style={{ color: 'rgba(240,244,252,0.6)', fontSize: 15 }}>
              Sin cambiar tu número. Sin instalar nada. En menos de 24 horas.
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
