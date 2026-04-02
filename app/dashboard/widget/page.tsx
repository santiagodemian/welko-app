'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, Code2, Globe, Zap, MessageSquare } from 'lucide-react'
import { useUser } from '@clerk/nextjs'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export default function WidgetPage() {
  const { user } = useUser()
  const [clinicId, setClinicId]   = useState<string | null>(null)
  const [copied, setCopied]       = useState(false)
  const [activeTab, setActiveTab] = useState<'html' | 'wordpress' | 'webflow'>('html')

  useEffect(() => {
    if (!user) return
    fetch('/api/onboarding', { method: 'GET' })
      .catch(() => {})
    // Get clinicId from DB via a quick fetch
    fetch('/api/widget/me')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.clinicId) setClinicId(d.clinicId) })
      .catch(() => {})
  }, [user])

  // Fallback: use clerk user ID as identifier shown to user
  const displayId = clinicId ?? user?.id ?? 'TU_CLINIC_ID'

  const snippet = `<script src="https://welko.agency/widget.js" data-clinic-id="${displayId}"></script>`

  function copy() {
    navigator.clipboard.writeText(snippet).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  const TABS = [
    { id: 'html',      label: 'HTML',      icon: Code2 },
    { id: 'wordpress', label: 'WordPress', icon: Globe },
    { id: 'webflow',   label: 'Webflow',   icon: Zap   },
  ] as const

  const INSTRUCTIONS: Record<typeof activeTab, { steps: string[] }> = {
    html: {
      steps: [
        'Abre el HTML de tu sitio web.',
        'Pega el código justo antes de cerrar la etiqueta </body>.',
        'Guarda y publica. El widget aparece automáticamente.',
      ],
    },
    wordpress: {
      steps: [
        'Ve a Apariencia → Editor de temas (o usa el plugin "Insert Headers and Footers").',
        'Pega el código en la sección "Footer Scripts" o antes de </body>.',
        'Guarda los cambios y visita tu sitio.',
      ],
    },
    webflow: {
      steps: [
        'Ve a Configuración del Proyecto → Custom Code.',
        'Pega el código en "Footer Code".',
        'Publica tu sitio. El widget aparece en todas las páginas.',
      ],
    },
  }

  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto px-4 py-8">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="flex flex-col gap-2"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--accent)', opacity: 0.12, position: 'absolute' }} />
          <MessageSquare size={22} style={{ color: 'var(--accent)' }} />
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Widget Embebible
          </h1>
        </div>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Pega una línea de código en tu web y tu recepcionista IA aparece en segundos.
        </p>
      </motion.div>

      {/* Preview card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE, delay: 0.05 }}
        className="rounded-2xl overflow-hidden"
        style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}
      >
        {/* Mock browser bar */}
        <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
          <div className="flex gap-1.5">
            {['#ef4444','#f59e0b','#22c55e'].map(c => (
              <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />
            ))}
          </div>
          <div className="flex-1 h-6 rounded-md mx-2 text-xs flex items-center px-3"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
            tusitio.com
          </div>
        </div>
        {/* Mock page with widget */}
        <div className="relative h-48" style={{ background: '#f8fafc' }}>
          <div className="absolute inset-4 flex flex-col gap-2">
            <div className="h-4 rounded-full w-2/3" style={{ background: '#e2e8f0' }} />
            <div className="h-3 rounded-full w-full" style={{ background: '#e2e8f0' }} />
            <div className="h-3 rounded-full w-4/5" style={{ background: '#e2e8f0' }} />
          </div>
          {/* Widget button mock */}
          <div className="absolute bottom-4 right-4 flex flex-col items-end gap-2">
            <div className="rounded-2xl px-4 py-2.5 text-xs font-medium text-white shadow-lg"
              style={{ background: '#1A2A56', maxWidth: 200 }}>
              ¡Hola! ¿En qué le puedo ayudar?
              <div className="absolute -bottom-1.5 right-4 w-3 h-3 rotate-45"
                style={{ background: '#1A2A56' }} />
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-xl relative"
              style={{ background: '#1A2A56' }}>
              <MessageSquare size={20} color="white" />
              <div className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Code snippet */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE, delay: 0.1 }}
        className="flex flex-col gap-4"
      >
        <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          Tu código de instalación
        </h2>

        {/* Snippet box */}
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between px-4 py-2.5"
            style={{ background: '#0f172a', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <span className="text-xs font-mono" style={{ color: '#94a3b8' }}>HTML</span>
            <button
              onClick={copy}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-150"
              style={{
                background: copied ? '#22c55e18' : 'rgba(255,255,255,0.06)',
                color: copied ? '#22c55e' : '#94a3b8',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? 'Copiado' : 'Copiar'}
            </button>
          </div>
          <div className="px-4 py-4 overflow-x-auto" style={{ background: '#0f172a' }}>
            <pre className="text-xs font-mono leading-relaxed whitespace-pre-wrap break-all"
              style={{ color: '#e2e8f0', margin: 0 }}>
              <span style={{ color: '#60a5fa' }}>&lt;script</span>
              {' '}
              <span style={{ color: '#34d399' }}>src</span>
              <span style={{ color: '#f8fafc' }}>=</span>
              <span style={{ color: '#fbbf24' }}>&quot;https://welko.agency/widget.js&quot;</span>
              {' '}
              <span style={{ color: '#34d399' }}>data-clinic-id</span>
              <span style={{ color: '#f8fafc' }}>=</span>
              <span style={{ color: '#fbbf24' }}>&quot;{displayId}&quot;</span>
              <span style={{ color: '#60a5fa' }}>&gt;&lt;/script&gt;</span>
            </pre>
          </div>
        </div>

        {/* Platform tabs */}
        <div className="flex flex-col gap-4 p-5 rounded-xl"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
          <div className="flex gap-2">
            {TABS.map(tab => (
              <button key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150"
                style={{
                  background: activeTab === tab.id ? 'var(--accent)' : 'var(--surface)',
                  color: activeTab === tab.id ? '#fff' : 'var(--text-secondary)',
                  border: '1px solid var(--border)',
                }}
              >
                <tab.icon size={12} />
                {tab.label}
              </button>
            ))}
          </div>

          <ol className="flex flex-col gap-2.5">
            {INSTRUCTIONS[activeTab].steps.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                  style={{ background: 'var(--accent)', color: '#fff', fontSize: 10 }}>
                  {i + 1}
                </span>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE, delay: 0.15 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {[
          { icon: '⚡', title: 'Activo en 30 segundos', desc: 'Una línea de código. Sin configuración adicional.' },
          { icon: '🎨', title: 'Tu identidad de marca', desc: 'Nombre, color y especialidad de tu clínica automáticamente.' },
          { icon: '📋', title: 'Leads al CRM', desc: 'Cada conversación con datos de cita va directo a tu panel.' },
        ].map(item => (
          <div key={item.title} className="flex flex-col gap-2 p-4 rounded-xl"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{item.title}</p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
          </div>
        ))}
      </motion.div>

    </div>
  )
}
