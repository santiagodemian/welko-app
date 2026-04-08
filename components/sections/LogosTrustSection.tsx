'use client'

import { motion } from 'framer-motion'
import { useLang } from '@/contexts/LangContext'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const LOGOS = [
  { name: 'WhatsApp',        emoji: '💬', color: '#25D366' },
  { name: 'Instagram',       emoji: '📸', color: '#E1306C' },
  { name: 'Facebook',        emoji: '📘', color: '#1877F2' },
  { name: 'Stripe',          emoji: '💳', color: '#635BFF' },
  { name: 'Google Calendar', emoji: '📅', color: '#4285F4' },
  { name: 'Vapi Voice AI',   emoji: '📞', color: '#1A2A56' },
  { name: 'GPT-4o',          emoji: '🤖', color: '#10A37F' },
  { name: 'Widget Web',      emoji: '🌐', color: '#6366F1' },
]

export function LogosTrustSection() {
  const { lang } = useLang()

  return (
    <section className="py-10 px-4 sm:px-6" style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
      <div className="max-w-4xl mx-auto flex flex-col gap-6">

        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.4, ease: EASE }}
          className="text-center text-xs font-semibold uppercase tracking-widest"
          style={{ color: 'var(--text-muted)' }}
        >
          {lang === 'es' ? 'Funciona con lo que ya usas' : 'Works with what you already use'}
        </motion.p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {LOGOS.map((logo, i) => (
            <motion.div
              key={logo.name}
              initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.3, ease: EASE, delay: i * 0.04 }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
              }}
            >
              <span style={{ fontSize: 14 }}>{logo.emoji}</span>
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                {logo.name}
              </span>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
