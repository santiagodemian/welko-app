'use client'

import { motion } from 'framer-motion'
import { useLang } from '@/contexts/LangContext'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const INTEGRATIONS = [
  { name: 'WhatsApp Business',  color: '#22C55E', status: 'live' },
  { name: 'Instagram DMs',      color: '#E1306C', status: 'live' },
  { name: 'Facebook Messenger', color: '#1877F2', status: 'live' },
  { name: 'Google Calendar',    color: '#4285F4', status: 'live' },
  { name: 'Llamadas de voz',    color: '#8B5CF6', status: 'live' },
  { name: 'Widget web',         color: '#60A5FA', status: 'live' },
  { name: 'Doctoralia',         color: '#0EA5E9', status: 'soon' },
  { name: 'Cliniccloud',        color: '#14B8A6', status: 'soon' },
  { name: 'Dentix / SW dental', color: '#F59E0B', status: 'soon' },
  { name: 'Odoo',               color: '#875BE1', status: 'soon' },
  { name: 'Zapier',             color: '#FF4F00', status: 'soon' },
  { name: 'Google Ads',         color: '#FBBC04', status: 'soon' },
]

export function IntegrationsSection() {
  const { lang } = useLang()

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE }}
          className="flex flex-col items-center text-center gap-3"
        >
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--accent-label)' }}>
            {lang === 'es' ? 'Integraciones' : 'Integrations'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            {lang === 'es' ? 'Conecta con las herramientas que ya usas' : 'Connect with the tools you already use'}
          </h2>
          <p className="text-sm max-w-lg" style={{ color: 'var(--text-secondary)' }}>
            {lang === 'es'
              ? 'Welko funciona con los canales y sistemas que ya tiene tu clínica. Sin migraciones, sin fricción.'
              : 'Welko works with the channels and systems your clinic already has. No migrations, no friction.'}
          </p>
        </motion.div>

        {/* Grid */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {INTEGRATIONS.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.4, ease: EASE, delay: i * 0.04 }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{
                background: 'var(--surface)',
                border: `1px solid var(--border)`,
                opacity: item.status === 'soon' ? 0.7 : 1,
              }}
            >
              <div style={{ width: 28, height: 28, borderRadius: 8, background: item.color + '20', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color }} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{item.name}</span>
                {item.status === 'live'
                  ? <span className="text-[10px] font-medium" style={{ color: '#22C55E' }}>
                      {lang === 'es' ? '● Disponible' : '● Available'}
                    </span>
                  : <span className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>
                      {lang === 'es' ? '○ Próximamente' : '○ Coming soon'}
                    </span>
                }
              </div>
            </motion.div>
          ))}
        </div>

        {/* Note */}
        <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
          {lang === 'es'
            ? '¿Usas un sistema que no aparece aquí? Escríbenos — lo evaluamos.'
            : "Using a system not listed here? Write to us — we'll evaluate it."}
        </p>
      </div>
    </section>
  )
}
