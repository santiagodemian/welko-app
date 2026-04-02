'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  CheckCircle, AlertCircle,
  ExternalLink, Loader2, Unlink, Copy, Check, Share2,
} from 'lucide-react'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]
const WEBHOOK_URL = 'https://welko.agency/api/webhooks/meta'

interface Status {
  facebookConnected:  boolean
  instagramConnected: boolean
  facebookPageId:     string | null
  instagramAccountId: string | null
}

export default function MetaPage() {
  const searchParams = useSearchParams()
  const [status, setStatus]       = useState<Status | null>(null)
  const [loading, setLoading]     = useState(true)
  const [disconnecting, setDisconnecting] = useState(false)
  const [copied, setCopied]       = useState(false)

  const justConnected = searchParams.get('connected') === 'true'
  const connectError  = searchParams.get('error')

  useEffect(() => {
    fetch('/api/meta/status')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setStatus(d) })
      .finally(() => setLoading(false))
  }, [justConnected])

  async function disconnect() {
    setDisconnecting(true)
    await fetch('/api/meta/status', { method: 'DELETE' })
    setStatus(s => s ? { ...s, facebookConnected: false, instagramConnected: false, facebookPageId: null, instagramAccountId: null } : s)
    setDisconnecting(false)
  }

  function copyWebhook() {
    navigator.clipboard.writeText(WEBHOOK_URL).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2500)
    })
  }

  const isConnected = status?.facebookConnected

  return (
    <div className="flex flex-col gap-8 max-w-2xl mx-auto px-4 py-8">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }} className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <Share2 size={20} style={{ color: '#1877F2' }} />
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Instagram & Facebook DMs
          </h1>
          {isConnected && (
            <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(37,211,102,0.12)', color: '#16a34a' }}>
              <CheckCircle size={11} /> Conectado
            </span>
          )}
        </div>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Tu recepcionista IA responde DMs de Instagram y Messenger automáticamente.
        </p>
      </motion.div>

      {/* Success / error banners */}
      {justConnected && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 p-4 rounded-xl"
          style={{ background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.2)' }}>
          <CheckCircle size={18} style={{ color: '#16a34a', flexShrink: 0 }} />
          <div>
            <p className="text-sm font-semibold" style={{ color: '#15803d' }}>¡Cuenta conectada exitosamente!</p>
            <p className="text-xs mt-0.5" style={{ color: '#16a34a' }}>
              Tu IA ya puede responder DMs de Facebook e Instagram.
            </p>
          </div>
        </motion.div>
      )}

      {connectError && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 p-4 rounded-xl"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <AlertCircle size={18} style={{ color: '#ef4444', flexShrink: 0 }} />
          <p className="text-sm" style={{ color: '#dc2626' }}>
            {connectError === 'cancelled' ? 'Cancelaste la conexión. Puedes intentarlo nuevamente.' : 'Ocurrió un error al conectar. Verifica los permisos e intenta de nuevo.'}
          </p>
        </motion.div>
      )}

      {/* Status card */}
      {loading ? (
        <div className="flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
          <Loader2 size={16} className="animate-spin" />
          <span className="text-sm">Verificando conexión…</span>
        </div>
      ) : isConnected ? (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="flex flex-col gap-4 p-5 rounded-2xl"
          style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}>
          <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Canales activos
          </h2>
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-3">
              <Share2 size={16} style={{ color: '#1877F2' }} />
              <span className="text-sm flex-1" style={{ color: 'var(--text-secondary)' }}>
                Facebook Messenger — <span className="font-mono text-xs">{status.facebookPageId}</span>
              </span>
              <CheckCircle size={14} style={{ color: '#16a34a' }} />
            </div>
            {status.instagramConnected && (
              <div className="flex items-center gap-3">
                <Share2 size={16} style={{ color: '#E1306C' }} />
                <span className="text-sm flex-1" style={{ color: 'var(--text-secondary)' }}>
                  Instagram DMs — <span className="font-mono text-xs">{status.instagramAccountId}</span>
                </span>
                <CheckCircle size={14} style={{ color: '#16a34a' }} />
              </div>
            )}
          </div>
          <button
            onClick={disconnect}
            disabled={disconnecting}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg self-start transition-all"
            style={{ border: '1px solid var(--border)', color: 'var(--text-muted)', background: 'var(--bg)' }}
          >
            {disconnecting ? <Loader2 size={12} className="animate-spin" /> : <Unlink size={12} />}
            Desconectar cuenta
          </button>
        </motion.div>
      ) : (

        /* ── Setup steps ─────────────────────────────────────────────────────── */
        <>
          {/* Step 1 */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE, delay: 0.05 }}
            className="flex flex-col gap-4 p-5 rounded-2xl"
            style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ background: 'var(--accent)', fontSize: 11 }}>1</span>
              <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                Crea una App en Meta for Developers
              </h2>
            </div>
            <ol className="flex flex-col gap-2 pl-8">
              {[
                'Ve a developers.facebook.com → Mis Apps → Crear App',
                'Tipo: "Business" (o "Consumer" si no tienes Business Manager)',
                'Agrega el producto "Messenger" y también "Instagram" si quieres DMs de Instagram',
                'En Configuración → Básico, copia el App ID y App Secret y dámelos',
              ].map((s, i) => (
                <li key={i} className="text-sm" style={{ color: 'var(--text-secondary)' }}>{s}</li>
              ))}
            </ol>
            <a href="https://developers.facebook.com/apps" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-medium self-start px-3 py-1.5 rounded-lg"
              style={{ background: '#1877F2', color: '#fff' }}>
              Abrir Meta Developers <ExternalLink size={11} />
            </a>
          </motion.div>

          {/* Step 2 — Webhook */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE, delay: 0.1 }}
            className="flex flex-col gap-4 p-5 rounded-2xl"
            style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ background: 'var(--accent)', fontSize: 11 }}>2</span>
              <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                Configura el Webhook en tu App de Meta
              </h2>
            </div>
            <p className="text-sm pl-8" style={{ color: 'var(--text-secondary)' }}>
              En tu App → Messenger (o Instagram) → Webhooks → Agregar callback URL:
            </p>
            <div className="ml-8 rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              <div className="flex items-center justify-between px-4 py-2.5"
                style={{ background: '#0f172a', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="text-xs font-mono" style={{ color: '#94a3b8' }}>Callback URL</span>
                <button onClick={copyWebhook}
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg"
                  style={{ background: copied ? '#22c55e18' : 'rgba(255,255,255,0.06)',
                    color: copied ? '#22c55e' : '#94a3b8', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? 'Copiado' : 'Copiar'}
                </button>
              </div>
              <div className="px-4 py-3" style={{ background: '#0f172a' }}>
                <pre className="text-xs font-mono" style={{ color: '#34d399', margin: 0 }}>{WEBHOOK_URL}</pre>
              </div>
            </div>
            <p className="text-xs pl-8" style={{ color: 'var(--text-muted)' }}>
              El <strong>Verify Token</strong> es el valor de <code>META_WEBHOOK_VERIFY_TOKEN</code> que configuraste (o que yo generé). Suscríbete a los eventos: <strong>messages</strong>.
            </p>
          </motion.div>

          {/* Step 3 — Connect */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE, delay: 0.15 }}
            className="flex flex-col gap-4 p-5 rounded-2xl"
            style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ background: 'var(--accent)', fontSize: 11 }}>3</span>
              <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                Conecta tu Página de Facebook
              </h2>
            </div>
            <p className="text-sm pl-8" style={{ color: 'var(--text-secondary)' }}>
              Una vez que tengas el App ID y App Secret configurados en Welko, haz clic aquí para autorizar tu Página:
            </p>
            <a href="/api/meta/connect"
              className="flex items-center gap-2 self-start ml-8 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{ background: '#1877F2', color: '#fff' }}>
              <Share2 size={16} /> Conectar con Facebook
            </a>
            <p className="text-xs pl-8" style={{ color: 'var(--text-muted)' }}>
              Instagram se conecta automáticamente si tu cuenta de Instagram está vinculada a la Página de Facebook.
            </p>
          </motion.div>
        </>
      )}

      {/* Features */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE, delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: '💬', title: 'Un inbox, dos canales', desc: 'Messenger e Instagram con la misma IA y el mismo contexto de tu clínica.' },
          { icon: '📋', title: 'Leads automáticos', desc: 'Cada conversación con datos de cita va directo al CRM con canal Facebook o Instagram.' },
          { icon: '🔒', title: 'Tokens seguros', desc: 'Los tokens de acceso se guardan encriptados con AES-256.' },
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
