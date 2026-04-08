'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const FAQS = [
  {
    q: '¿Funciona con mi WhatsApp Business normal o necesito contratar algo extra?',
    a: 'Funciona con WhatsApp Business API, que es la versión oficial de Meta para empresas. No es el app que descargas en tu teléfono — es la versión profesional. Nosotros gestionamos todo el proceso de activación contigo: en menos de 24 horas tienes tu mismo número conectado, sin cambiarlo, sin perder tu historial de contactos.',
  },
  {
    q: '¿Tengo que cambiar mi número de WhatsApp?',
    a: 'No. Tu número actual se migra a WhatsApp Business API sin cambiarlo. Tus pacientes siguen escribiéndote al mismo número de siempre, y ahora la IA responde desde ahí. El único cambio visible para ellos es que las respuestas llegan más rápido.',
  },
  {
    q: '¿Qué pasa si la IA no sabe responder algo?',
    a: 'La IA no inventa respuestas. Cuando detecta una pregunta fuera de su conocimiento, transfiere automáticamente la conversación a tu equipo y te manda una alerta. Tú decides qué temas maneja sola y cuáles siempre llegan a un humano — desde el panel de control, sin tocar código.',
  },
  {
    q: '¿Mis pacientes van a saber que están hablando con una IA?',
    a: 'Eso lo decides tú. Puedes configurarla para que se presente como "Asistente virtual de [nombre de tu clínica]", o darle un nombre humano como "María". Muchas clínicas prefieren ser transparentes — y sus pacientes valoran la rapidez más que saber si es IA o humano. Lo que importa es que se sientan atendidos.',
  },
  {
    q: '¿La IA puede entender términos médicos de mi especialidad?',
    a: 'Sí. Welko no es una IA genérica. Durante el onboarding configuras tus servicios, precios y FAQs específicos. Una clínica dental tendrá una IA que conoce "endodoncia" o "bruxismo". Una clínica estética reconoce "rinomodelación" o "bichectomía". Y si falta algo, lo agregas en minutos desde el panel.',
  },
  {
    q: '¿Funciona para clínicas de estética, spa o bienestar?',
    a: 'Sí, es uno de nuestros casos de uso principales. Welko funciona para cualquier negocio donde los clientes necesitan agendar, confirmar, pagar o preguntar — dental, estética, dermatología, medicina general, psicología, nutrición, spa y más.',
  },
  {
    q: '¿Es caro? No sé si el retorno justifica la inversión.',
    a: 'El plan Starter arranca en $999 MXN/mes — menos del costo de una sola consulta perdida. Si tu clínica recibe 15 mensajes diarios y el 30% no obtiene respuesta rápida, estás perdiendo ~$27,000 MXN al mes en oportunidades. La mayoría de clínicas recupera el costo de Welko en los primeros 3–5 días de uso.',
  },
  {
    q: '¿Cómo se integra con mi agenda o sistema actual?',
    a: 'Welko se conecta con Google Calendar de forma nativa en todos los planes. Para sistemas como Doctoralia, Cliniccloud u otros EHR, el plan Business incluye integración directa: la IA puede ver tu disponibilidad real y agendar citas sin duplicar trabajo.',
  },
  {
    q: '¿Es seguro guardar datos de mis pacientes en Welko?',
    a: 'Sí. Los datos se almacenan con cifrado AES-256 y nunca se comparten con terceros ni se usan para entrenar modelos de IA externos. Cumplimos con la Ley Federal de Protección de Datos (LFPDPPP) de México. Tus pacientes y sus datos son únicamente tuyos.',
  },
  {
    q: '¿Puedo cancelar cuando quiera?',
    a: 'Sí. Sin contratos, sin plazos forzosos, sin penalizaciones. Cancelas desde tu panel en cualquier momento. Además tenemos garantía de 14 días: si en las primeras dos semanas no ves el valor, te devolvemos el 100% de tu pago sin preguntas.',
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
            Las preguntas que siempre hacen antes de empezar
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            WhatsApp Business, errores de IA, privacidad, precio — todo respondido sin rodeos.
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
