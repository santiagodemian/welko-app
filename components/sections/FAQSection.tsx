'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const FAQS = [
  {
    q: '¿La IA puede entender términos técnicos de mi especialidad?',
    a: 'Sí. Welko no es una IA genérica — está entrenada por rama médica. Una clínica dental tendrá una IA que conoce términos como "endodoncia", "periodoncia" o "bruxismo". Una clínica de psicología entiende "terapia cognitivo-conductual" o "episodio disociativo". Cada especialidad tiene su propio modelo de conocimiento clínico.',
  },
  {
    q: '¿Cómo se integra con mi agenda o sistema actual?',
    a: 'Welko se conecta a Google Calendar y sistemas de agenda digital de forma nativa. Para clínicas con sistemas más avanzados (EHR/HIS como Doctoralia, Cliniccloud, o sistemas propietarios), el plan Business incluye integración directa: la IA puede leer tu agenda y agendar citas en tiempo real, sin duplicar trabajo. En menos de 24 horas tienes todo configurado.',
  },
  {
    q: '¿Es seguro guardar datos de mis pacientes en Welko?',
    a: 'Absolutamente. Los datos se almacenan con cifrado AES-256 y nunca se comparten con terceros ni se usan para entrenar modelos de IA públicos. Welko cumple con la Ley Federal de Protección de Datos Personales (LFPDPPP) de México y los estándares internacionales de confidencialidad médica (HIPAA-ready). Tus pacientes y sus datos son solo tuyos.',
  },
  {
    q: '¿Qué pasa si mi clínica crece o abro más sucursales?',
    a: 'Precisamente para eso existe el plan Business. Con él puedes gestionar sucursales ilimitadas desde un solo panel, cada una con su propio tono de comunicación, canales activos y saludo personalizado. La IA de la sucursal Centro puede sonar diferente a la de Santa Fe. Sin costos extra por sucursal.',
  },
  {
    q: '¿Es caro? No sé si el retorno justifica la inversión.',
    a: 'Welko cuesta menos que una sola consulta perdida al mes. Si tu clínica tiene 20 contactos diarios y el 35% no recibe respuesta, estás perdiendo ~$53,000 MXN mensuales en oportunidades. El plan Essential arranca en $1,999 MXN/mes — menos del 4% de ese valor en riesgo. El ROI promedio de nuestras clínicas es positivo desde el primer mes.',
  },
  {
    q: '¿La IA puede cometer errores o dar información incorrecta?',
    a: 'La IA está diseñada para ser honesta sobre lo que no sabe. Si no puede responder con certeza, no inventa — transfiere la conversación a un humano de inmediato y te notifica. Tú defines qué preguntas la IA responde sola y cuáles siempre escalan a un humano. El control es tuyo.',
  },
  {
    q: '¿Qué es Welko y cómo funciona?',
    a: 'Welko es un recepcionista virtual con inteligencia artificial que atiende a tus pacientes por WhatsApp, Instagram y otros canales. Responde preguntas, agenda citas, envía recordatorios automáticos y hace seguimiento de leads — todo sin intervención humana, las 24 horas del día.',
  },
  {
    q: '¿En cuánto tiempo se configura Welko para mi clínica?',
    a: 'En menos de 24 horas desde que te registras. Nuestro equipo te contacta para personalizar el tono de comunicación, tratamientos, horarios y preguntas frecuentes de tu especialidad. Sin instalaciones, sin contratos, sin tecnicismos.',
  },
  {
    q: '¿Puedo cancelar mi suscripción cuando quiera?',
    a: 'Sí. Sin plazos forzosos ni penalizaciones. Cancelas en cualquier momento desde tu panel. Además ofrecemos garantía de 7 días: si no estás satisfecho, te devolvemos el 100% de tu pago sin preguntas.',
  },
]

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="py-24 px-4">
      <div className="max-w-3xl mx-auto flex flex-col gap-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
          className="flex flex-col gap-3"
        >
          <span
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--accent)' }}
          >
            Preguntas frecuentes
          </span>
          <h2
            className="text-xl sm:text-2xl font-bold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Resolvemos las dudas que frenan la decisión
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Desde precio hasta seguridad de datos — aquí está todo lo que necesitas saber antes de empezar.
          </p>
        </motion.div>

        {/* Accordion */}
        <div className="flex flex-col gap-3">
          {FAQS.map((faq, i) => {
            const isOpen = open === i
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, ease: EASE, delay: i * 0.04 }}
                className="rounded-2xl overflow-hidden"
                style={{ border: '1px solid var(--border)' }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left transition-colors duration-150"
                  style={{ background: isOpen ? 'var(--surface-hover)' : 'var(--surface)' }}
                >
                  <span
                    className="text-sm font-semibold leading-snug"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {faq.q}
                  </span>
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ background: isOpen ? 'var(--accent)' : 'var(--border)' }}
                  >
                    {isOpen
                      ? <Minus size={13} color="#FFFFFF" />
                      : <Plus size={13} color="var(--text-secondary)" />}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: EASE }}
                      style={{ overflow: 'hidden' }}
                    >
                      <p
                        className="px-5 pb-5 pt-1 text-sm leading-relaxed"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
