'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Phone, CheckCircle, Loader2, RefreshCw,
  PhoneOff, Copy, Check, Zap, Mic, Brain,
} from 'lucide-react'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

interface VoiceStatus {
  active: boolean
  assistantId: string | null
  phoneNumber: string | null
  phoneNumberId: string | null
  clinicName: string
}

function CopyLine({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2500)
    })
  }
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-2.5 rounded-xl"
      style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</span>
        <span className="text-sm font-mono truncate" style={{ color: 'var(--text-primary)' }}>{value}</span>
      </div>
      <button onClick={copy}
        className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg flex-shrink-0"
        style={{
          background: copied ? 'rgba(34,197,94,0.1)' : 'var(--surface)',
          color: copied ? '#16a34a' : 'var(--text-secondary)',
          border: '1px solid var(--border)',
        }}>
        {copied ? <Check size={12} /> : <Copy size={12} />}
        {copied ? 'Copiado' : 'Copiar'}
      </button>
    </div>
  )
}

export default function LlamadasPage() {
  const [status, setStatus]         = useState<VoiceStatus | null>(null)
  const [loading, setLoading]       = useState(true)
  const [activating, setActivating] = useState(false)
  const [syncing, setSyncing]       = useState(false)
  const [deactivating, setDeactivating] = useState(false)
  const [error, setError]           = useState<string | null>(null)

  useEffect(() => { fetchStatus() }, [])

  async function fetchStatus() {
    setLoading(true)
    try {
      const r = await fetch('/api/voice/status')
      if (r.ok) setStatus(await r.json())
    } finally {
      setLoading(false)
    }
  }

  async function activate() {
    setError(null)
    setActivating(true)
    try {
      const r = await fetch('/api/voice/activate', { method: 'POST' })
      const d = await r.json()
      if (!r.ok) { setError(d.error ?? 'Error al activar'); return }
      await fetchStatus()
    } catch {
      setError('Error de conexión')
    } finally {
      setActivating(false)
    }
  }

  async function sync() {
    setError(null)
    setSyncing(true)
    try {
      const r = await fetch('/api/voice/activate', { method: 'PATCH' })
      if (!r.ok) { const d = await r.json(); setError(d.error ?? 'Error al sincronizar'); return }
    } catch {
      setError('Error de conexión')
    } finally {
      setSyncing(false)
    }
  }

  async function deactivate() {
    if (!confirm('¿Seguro que quieres desactivar las llamadas IA? Se liberará el número de teléfono.')) return
    setDeactivating(true)
    try {
      await fetch('/api/voice/deactivate', { method: 'DELETE' })
      await fetchStatus()
    } finally {
      setDeactivating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64" style={{ color: 'var(--text-muted)' }}>
        <Loader2 size={22} className="animate-spin" />
      </div>
    )
  }

  const isActive = status?.active && !!status?.assistantId

  return (
    <div className="flex flex-col gap-8 max-w-2xl mx-auto px-4 py-8">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }} className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <Phone size={22} style={{ color: '#6366f1' }} />
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Llamadas de Voz IA
          </h1>
          {isActive && (
            <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(34,197,94,0.12)', color: '#16a34a' }}>
              <CheckCircle size={11} /> Activo
            </span>
          )}
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(99,102,241,0.1)', color: '#6366f1' }}>
            Plan Pro
          </span>
        </div>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Welko crea automáticamente tu asistente de voz IA y te asigna un número de teléfono.
          Los pacientes llaman, la IA atiende, y el lead llega al CRM.
        </p>
      </motion.div>

      {error && (
        <div className="p-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.08)', color: '#dc2626', border: '1px solid rgba(239,68,68,0.2)' }}>
          {error}
        </div>
      )}

      {/* ── ACTIVE STATE ── */}
      {isActive ? (
        <>
          {/* Status card */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="flex flex-col gap-5 p-6 rounded-2xl"
            style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)' }}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(34,197,94,0.15)' }}>
                <Phone size={18} style={{ color: '#16a34a' }} />
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-semibold" style={{ color: '#15803d' }}>
                  Recepcionista de voz activa
                </p>
                <p className="text-xs" style={{ color: '#16a34a' }}>
                  Tu asistente IA está listo para atender llamadas 24/7
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {status.phoneNumber ? (
                <CopyLine label="Número de teléfono asignado" value={status.phoneNumber} />
              ) : (
                <div className="p-3 rounded-xl text-xs"
                  style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                  Número en proceso de asignación. Recarga en unos segundos.
                </div>
              )}
              {status.assistantId && (
                <CopyLine label="Assistant ID (Vapi)" value={status.assistantId} />
              )}
            </div>
          </motion.div>

          {/* Actions */}
          <div className="flex gap-3 flex-wrap">
            <button onClick={sync} disabled={syncing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-primary)', opacity: syncing ? 0.6 : 1 }}>
              {syncing ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
              {syncing ? 'Sincronizando…' : 'Sincronizar configuración'}
            </button>
            <button onClick={deactivate} disabled={deactivating}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)', opacity: deactivating ? 0.6 : 1 }}>
              {deactivating ? <Loader2 size={14} className="animate-spin" /> : <PhoneOff size={14} />}
              {deactivating ? 'Desactivando…' : 'Desactivar'}
            </button>
          </div>

          {/* Info */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="p-4 rounded-xl text-xs leading-relaxed"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>Sincronizar configuración</strong> — actualiza el prompt del asistente IA si cambiaste
            datos en <em>Configuración de IA</em> (servicios, horarios, tono, FAQs). Úsalo cada vez que edites tu perfil.
          </motion.div>
        </>
      ) : (

        /* ── INACTIVE STATE ── */
        <>
          {/* Activate card */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE, delay: 0.05 }}
            className="flex flex-col gap-6 p-6 rounded-2xl"
            style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}>

            <div className="flex flex-col gap-2">
              <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                Activar Llamadas IA
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Con un solo clic, Welko:
              </p>
              <ul className="flex flex-col gap-2 mt-1">
                {[
                  'Crea tu asistente de voz con la configuración de tu clínica',
                  'Usa voz en español mexicano natural (Azure Neural)',
                  'Te asigna un número de teléfono dedicado',
                  'Los leads de cada llamada van directo a tu CRM',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm"
                    style={{ color: 'var(--text-secondary)' }}>
                    <CheckCircle size={14} style={{ color: '#16a34a', flexShrink: 0, marginTop: 2 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-xl text-xs"
              style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
              <strong style={{ color: 'var(--text-secondary)' }}>Asegúrate primero</strong> de tener tu{' '}
              <a href="/dashboard/ehr" className="underline" style={{ color: 'var(--accent-label)' }}>
                Configuración de IA
              </a>{' '}
              completa (nombre, servicios, horarios) — esa información se usa para programar el asistente de voz.
            </div>

            <button
              onClick={activate}
              disabled={activating}
              className="flex items-center justify-center gap-2.5 py-3.5 rounded-2xl text-sm font-semibold transition-all"
              style={{
                background: activating ? 'var(--accent-subtle)' : '#6366f1',
                color: activating ? 'var(--text-muted)' : '#ffffff',
                cursor: activating ? 'not-allowed' : 'pointer',
              }}
            >
              {activating
                ? <><Loader2 size={16} className="animate-spin" /> Configurando asistente y número…</>
                : <><Zap size={16} /> Activar Llamadas IA</>
              }
            </button>
            {activating && (
              <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
                Esto puede tardar hasta 30 segundos. No cierres esta página.
              </p>
            )}
          </motion.div>

          {/* How it works */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE, delay: 0.1 }}
            className="flex flex-col gap-4 p-5 rounded-2xl"
            style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}>
            <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              ¿Cómo funciona?
            </h2>
            <div className="flex flex-col gap-3">
              {[
                { n: '1', text: 'Un paciente llama a tu número asignado por Welko' },
                { n: '2', text: 'La IA responde en voz, en español, con el contexto de tu clínica' },
                { n: '3', text: 'Si quiere cita, extrae nombre, teléfono y motivo' },
                { n: '4', text: 'Al colgar, el lead aparece en tu CRM con la transcripción completa' },
              ].map(s => (
                <div key={s.n} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                    style={{ background: 'rgba(99,102,241,0.12)', color: '#6366f1' }}>{s.n}</span>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{s.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}

      {/* Feature chips */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE, delay: 0.15 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { Icon: Mic,   title: 'Voz en español MX',  desc: 'Azure Neural es-MX-Dalia. Natural, clara, sin acento robótico.' },
          { Icon: Brain, title: 'GPT-4o-mini',         desc: 'Mismo motor que el chat. Conoce tus servicios, precios y horarios.' },
          { Icon: Phone, title: 'Número dedicado',     desc: 'Número propio asignado. Los pacientes lo guardan como tu clínica.' },
        ].map(({ Icon, title, desc }) => (
          <div key={title} className="flex flex-col gap-2 p-4 rounded-xl"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <Icon size={16} style={{ color: '#6366f1' }} />
            <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
          </div>
        ))}
      </motion.div>

    </div>
  )
}
