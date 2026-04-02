'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, CheckCircle, AlertCircle, Copy, Check, ExternalLink, Loader2 } from 'lucide-react'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]
const WEBHOOK_URL = 'https://welko.agency/api/webhooks/whatsapp'

export default function WhatsAppPage() {
  const [phone, setPhone]         = useState('')
  const [saved, setSaved]         = useState<string | null>(null)
  const [saving, setSaving]       = useState(false)
  const [error, setError]         = useState<string | null>(null)
  const [copied, setCopied]       = useState(false)
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    fetch('/api/whatsapp')
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d?.phone) { setPhone(d.phone); setSaved(d.phone) }
      })
      .finally(() => setLoading(false))
  }, [])

  async function save() {
    setError(null)
    setSaving(true)
    try {
      const res = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Error al guardar'); return }
      setSaved(data.phone)
    } catch {
      setError('Error de conexión')
    } finally {
      setSaving(false)
    }
  }

  function copyWebhook() {
    navigator.clipboard.writeText(WEBHOOK_URL).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  const isConnected = !!saved

  return (
    <div className="flex flex-col gap-8 max-w-2xl mx-auto px-4 py-8">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="flex flex-col gap-2"
      >
        <div className="flex items-center gap-3">
          <MessageCircle size={22} style={{ color: '#25D366' }} />
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Integración WhatsApp
          </h1>
          {isConnected && (
            <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(37,211,102,0.12)', color: '#16a34a' }}>
              <CheckCircle size={11} /> Conectado
            </span>
          )}
        </div>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Tu recepcionista IA responde mensajes de WhatsApp automáticamente, 24/7.
        </p>
      </motion.div>

      {/* Step 1 — Get Twilio number */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE, delay: 0.05 }}
        className="flex flex-col gap-4 p-5 rounded-2xl"
        style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}
      >
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style={{ background: 'var(--accent)', fontSize: 11 }}>1</span>
          <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Obtén tu número de WhatsApp en Twilio
          </h2>
        </div>
        <ol className="flex flex-col gap-2 pl-8">
          {[
            'Crea una cuenta gratis en twilio.com',
            'Ve a Messaging → Try it out → Send a WhatsApp message',
            'Activa el Sandbox y toma nota del número asignado (ej. +14155238886)',
            'Para producción: compra un número y aprueba tu cuenta de WhatsApp Business',
          ].map((step, i) => (
            <li key={i} className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {step}
            </li>
          ))}
        </ol>
        <a
          href="https://www.twilio.com/console/sms/whatsapp/sandbox"
          target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-medium self-start px-3 py-1.5 rounded-lg"
          style={{ background: 'var(--accent)', color: '#fff' }}
        >
          Abrir Twilio Console <ExternalLink size={11} />
        </a>
      </motion.div>

      {/* Step 2 — Configure webhook */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE, delay: 0.1 }}
        className="flex flex-col gap-4 p-5 rounded-2xl"
        style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}
      >
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style={{ background: 'var(--accent)', fontSize: 11 }}>2</span>
          <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Conecta Twilio a Welko
          </h2>
        </div>
        <p className="text-sm pl-8" style={{ color: 'var(--text-secondary)' }}>
          En Twilio, ve a tu número (o Sandbox) y en <strong>Webhook URL (incoming message)</strong> pega esta URL:
        </p>
        <div className="ml-8 rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between px-4 py-2.5"
            style={{ background: '#0f172a', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <span className="text-xs font-mono" style={{ color: '#94a3b8' }}>Webhook URL</span>
            <button
              onClick={copyWebhook}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
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
          <div className="px-4 py-3" style={{ background: '#0f172a' }}>
            <pre className="text-xs font-mono" style={{ color: '#34d399', margin: 0 }}>
              {WEBHOOK_URL}
            </pre>
          </div>
        </div>
        <p className="text-xs ml-8" style={{ color: 'var(--text-muted)' }}>
          Método: <strong>HTTP POST</strong>. También agrega tu Account SID y Auth Token como variables de entorno en Welko.
        </p>
      </motion.div>

      {/* Step 3 — Register number */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE, delay: 0.15 }}
        className="flex flex-col gap-4 p-5 rounded-2xl"
        style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}
      >
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style={{ background: 'var(--accent)', fontSize: 11 }}>3</span>
          <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Registra tu número en Welko
          </h2>
        </div>
        <p className="text-sm pl-8" style={{ color: 'var(--text-secondary)' }}>
          Escribe el número de Twilio asignado a tu clínica (formato E.164):
        </p>

        {loading ? (
          <div className="pl-8"><Loader2 size={16} className="animate-spin" style={{ color: 'var(--text-muted)' }} /></div>
        ) : (
          <div className="flex gap-3 pl-8">
            <input
              type="text"
              value={phone}
              onChange={e => { setPhone(e.target.value); setError(null) }}
              placeholder="+14155238886"
              className="flex-1 text-sm px-3 py-2 rounded-lg outline-none"
              style={{
                border: `1px solid ${error ? '#ef4444' : 'var(--border)'}`,
                background: 'var(--bg)',
                color: 'var(--text-primary)',
              }}
              onKeyDown={e => { if (e.key === 'Enter') save() }}
            />
            <button
              onClick={save}
              disabled={saving || phone === saved}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: 'var(--accent)',
                color: '#fff',
                opacity: saving || phone === saved ? 0.6 : 1,
              }}
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : null}
              {saving ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        )}

        {error && (
          <p className="flex items-center gap-1.5 text-xs pl-8" style={{ color: '#ef4444' }}>
            <AlertCircle size={13} /> {error}
          </p>
        )}
        {saved && phone === saved && !error && (
          <p className="flex items-center gap-1.5 text-xs pl-8" style={{ color: '#16a34a' }}>
            <CheckCircle size={13} /> Número guardado correctamente.
          </p>
        )}
      </motion.div>

      {/* Status card */}
      {isConnected && (
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE, delay: 0.2 }}
          className="flex items-start gap-3 p-4 rounded-2xl"
          style={{ background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.2)' }}
        >
          <CheckCircle size={18} style={{ color: '#16a34a', flexShrink: 0, marginTop: 1 }} />
          <div>
            <p className="text-sm font-semibold" style={{ color: '#15803d' }}>¡WhatsApp activo!</p>
            <p className="text-xs mt-0.5" style={{ color: '#16a34a' }}>
              Tu recepcionista IA está respondiendo mensajes en <strong>{saved}</strong>. Los leads llegan directo al CRM con canal WhatsApp.
            </p>
          </div>
        </motion.div>
      )}

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE, delay: 0.25 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {[
          { icon: '🤖', title: 'IA con contexto total', desc: 'Conoce tus servicios, horarios y políticas. Responde como tu recepcionista.' },
          { icon: '📋', title: 'Leads al CRM', desc: 'Cuando el paciente quiere cita, el dato va directo al panel de control.' },
          { icon: '🕐', title: '24/7 sin esfuerzo', desc: 'Responde fuera de horario, en fines de semana, sin intervención humana.' },
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
