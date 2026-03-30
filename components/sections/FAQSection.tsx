'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const FAQS = [
  {
    q: '¿Qué es Welko y cómo funciona?',
    a: 'Welko es un recepcionista virtual con inteligencia artificial que atiende a tus pacientes por WhatsApp, chat web y otros canales digitales. Responde preguntas frecuentes, agenda citas en tu calendario y envía recordatorios automáticos — todo sin intervención humana, las 24 horas del día.',
  },
  {
    q: '¿En cuánto tiempo se configura Welko para mi clínica?',
    a: 'El proceso de configuración toma menos de 24 horas desde que te registras. Nuestro equipo te contacta por WhatsApp para personalizar el tono de comunicación, los tratamientos que ofreces, tu horario de atención y las preguntas frecuentes de tus pacientes.',
  },
  {
    q: '¿Mis pacientes saben que están hablando con una IA?',
    a: 'Depende de cómo quieras configurarlo. Puedes presentar a Welko como tu "asistente virtual" con el nombre y tono de tu clínica, o ser transparente sobre el uso de IA. En ambos casos, la experiencia para el paciente es fluida, amable y profesional.',
  },
  {
    q: '¿Qué canales de comunicación soporta Welko?',
    a: 'Actualmente Welko funciona con WhatsApp Business (el canal principal de las clínicas en México). Próximamente integraremos Instagram DM, chat web embebido y llamadas telefónicas con voz IA.',
  },
  {
    q: '¿Puedo cancelar mi suscripción cuando quiera?',
    a: 'Sí. No hay plazos forzosos ni penalizaciones. Puedes cancelar tu suscripción en cualquier momento desde tu panel. Además, ofrecemos una garantía de 7 días: si no estás satisfecho, te devolvemos el 100% de tu pago sin preguntas.',
  },
  {
    q: '¿Mis datos y los de mis pacientes están seguros?',
    a: 'Absolutamente. Los datos de los pacientes se almacenan con cifrado AES-256 y nunca se comparten con terceros ni se usan para entrenar modelos de IA públicos. Welko cumple con la Ley Federal de Protección de Datos Personales (LFPDPPP) de México y los estándares de confidencialidad médica.',
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
            Todo lo que necesitas saber
          </h2>
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
                transition={{ duration: 0.4, ease: EASE, delay: i * 0.06 }}
                className="rounded-2xl overflow-hidden"
                style={{ border: '1px solid var(--border)' }}
              >
                {/* Question row */}
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left transition-colors duration-150"
                  style={{
                    background: isOpen ? 'var(--surface-hover)' : 'var(--surface)',
                  }}
                >
                  <span
                    className="text-sm sm:text-base font-semibold leading-snug"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {faq.q}
                  </span>
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{
                      background: isOpen ? 'var(--accent)' : 'var(--border)',
                    }}
                  >
                    {isOpen
                      ? <Minus size={13} color="#FFFFFF" />
                      : <Plus size={13} color="var(--text-secondary)" />
                    }
                  </span>
                </button>

                {/* Answer */}
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
