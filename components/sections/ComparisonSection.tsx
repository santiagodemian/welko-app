'use client'

import { motion } from 'framer-motion'
import { Check, X, Minus } from 'lucide-react'
import { useLang } from '@/contexts/LangContext'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

type Val = 'yes' | 'no' | 'partial'

interface Row {
  feature: { es: string; en: string }
  welko: Val
  recepcionista: Val
  chatbot: Val
  note?: { es: string; en: string }
}

const ROWS: Row[] = [
  {
    feature:      { es: 'Disponible 24/7', en: 'Available 24/7' },
    welko:        'yes',
    recepcionista:'no',
    chatbot:      'partial',
    note:         { es: 'La recep trabaja 8h/día', en: 'Receptionist works 8h/day' },
  },
  {
    feature:      { es: 'Responde en < 2 segundos', en: 'Responds in < 2 seconds' },
    welko:        'yes',
    recepcionista:'no',
    chatbot:      'yes',
  },
  {
    feature:      { es: 'Agenda citas automáticamente', en: 'Books appointments automatically' },
    welko:        'yes',
    recepcionista:'yes',
    chatbot:      'no',
  },
  {
    feature:      { es: 'Recordatorios + confirmaciones', en: 'Reminders + confirmations' },
    welko:        'yes',
    recepcionista:'partial',
    chatbot:      'no',
    note:         { es: 'La recep lo olvida o no tiene tiempo', en: 'Receptionist forgets or has no time' },
  },
  {
    feature:      { es: 'WhatsApp + Instagram + Facebook', en: 'WhatsApp + Instagram + Facebook' },
    welko:        'yes',
    recepcionista:'partial',
    chatbot:      'partial',
    note:         { es: 'La recep no cubre todos los canales a la vez', en: 'Receptionist can\'t cover all channels at once' },
  },
  {
    feature:      { es: 'Aprende de tu negocio', en: 'Learns your business' },
    welko:        'yes',
    recepcionista:'yes',
    chatbot:      'no',
    note:         { es: 'Los chatbots básicos no tienen contexto', en: 'Basic chatbots have no context' },
  },
  {
    feature:      { es: 'Costo mensual', en: 'Monthly cost' },
    welko:        'yes',
    recepcionista:'no',
    chatbot:      'partial',
    note:         { es: 'Welko $1,499 vs recep $10,000 vs chatbot básico sin agenda', en: 'Welko $1,499 vs receptionist $10,000 vs basic chatbot without scheduling' },
  },
  {
    feature:      { es: 'Activo en < 24 horas', en: 'Live in < 24 hours' },
    welko:        'yes',
    recepcionista:'no',
    chatbot:      'partial',
    note:         { es: 'Contratar y capacitar tarda semanas', en: 'Hiring and training takes weeks' },
  },
]

function Icon({ val }: { val: Val }) {
  if (val === 'yes')     return <Check size={16} strokeWidth={2.5} color="#059669" />
  if (val === 'no')      return <X     size={16} strokeWidth={2.5} color="#EF4444" />
  return                        <Minus size={16} strokeWidth={2.5} color="#F59E0B" />
}

export function ComparisonSection() {
  const { lang } = useLang()

  const L = {
    eyebrow: lang === 'es' ? 'Comparativa'                                             : 'Comparison',
    heading: lang === 'es' ? 'Por qué Welko gana en cada escenario'                   : 'Why Welko wins every scenario',
    sub:     lang === 'es' ? 'No reemplaza a tu equipo — los libera para lo que importa.' : 'Doesn\'t replace your team — frees them for what matters.',
    col1:    'Welko IA',
    col2:    lang === 'es' ? 'Recepcionista' : 'Receptionist',
    col3:    lang === 'es' ? 'Chatbot básico' : 'Basic chatbot',
  }

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
      <div className="max-w-4xl mx-auto flex flex-col gap-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE }}
          className="flex flex-col items-center text-center gap-3"
        >
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--accent-label)' }}>
            {L.eyebrow}
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            {L.heading}
          </h2>
          <p className="text-base font-light max-w-lg" style={{ color: 'var(--text-secondary)' }}>
            {L.sub}
          </p>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.55, ease: EASE, delay: 0.1 }}
          className="rounded-3xl overflow-hidden"
          style={{ border: '1px solid var(--border)', boxShadow: '0 4px 24px rgba(19,36,74,0.07)' }}
        >
          {/* Column headers */}
          <div className="grid grid-cols-4 text-xs font-bold uppercase tracking-widest"
            style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
            <div className="p-4 col-span-1" style={{ color: 'var(--text-muted)' }} />
            {/* Welko — highlighted */}
            <div className="p-4 text-center" style={{ background: '#13244A', color: '#FFFFFF' }}>
              {L.col1}
            </div>
            <div className="p-4 text-center" style={{ color: 'var(--text-secondary)' }}>
              {L.col2}
            </div>
            <div className="p-4 text-center" style={{ color: 'var(--text-secondary)' }}>
              {L.col3}
            </div>
          </div>

          {/* Rows */}
          {ROWS.map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-4 transition-colors duration-150"
              style={{
                background: i % 2 === 0 ? 'var(--surface)' : 'var(--bg-secondary)',
                borderBottom: i < ROWS.length - 1 ? '1px solid var(--border)' : 'none',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'var(--surface-hover)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = i % 2 === 0 ? 'var(--surface)' : 'var(--bg-secondary)' }}
            >
              {/* Feature name */}
              <div className="p-4 flex flex-col justify-center gap-0.5">
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {lang === 'es' ? row.feature.es : row.feature.en}
                </span>
                {row.note && (
                  <span className="text-xs font-light" style={{ color: 'var(--text-muted)' }}>
                    {lang === 'es' ? row.note.es : row.note.en}
                  </span>
                )}
              </div>

              {/* Welko — highlighted column */}
              <div className="p-4 flex items-center justify-center" style={{ background: 'rgba(19,36,74,0.04)' }}>
                <Icon val={row.welko} />
              </div>
              <div className="p-4 flex items-center justify-center">
                <Icon val={row.recepcionista} />
              </div>
              <div className="p-4 flex items-center justify-center">
                <Icon val={row.chatbot} />
              </div>
            </div>
          ))}

          {/* Legend */}
          <div
            className="flex items-center justify-center gap-5 p-4"
            style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}
          >
            {[
              { icon: <Check size={12} color="#059669" />, label: lang === 'es' ? 'Sí' : 'Yes' },
              { icon: <X     size={12} color="#EF4444" />, label: lang === 'es' ? 'No' : 'No' },
              { icon: <Minus size={12} color="#F59E0B" />, label: lang === 'es' ? 'Parcial' : 'Partial' },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                {l.icon}
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{l.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  )
}
