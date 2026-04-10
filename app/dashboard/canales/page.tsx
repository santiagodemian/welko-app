'use client'

import { useState, useEffect } from 'react'
import {
  MessageCircle, Share2, Phone, Code2, CalendarDays,
  CheckCircle, AlertCircle, Copy, Check, ExternalLink,
  Loader2, Radio, Globe,
} from 'lucide-react'

const SURF  = 'var(--surface)'
const BORD  = 'var(--border)'
const TEXT  = 'var(--text-primary)'
const MUTED = 'var(--text-secondary)'
const NAVY  = '#13244A'
const GREEN = '#22C55E'

const WEBHOOK_WA   = 'https://welko.agency/api/webhooks/whatsapp'
const WEBHOOK_META = 'https://welko.agency/api/webhooks/meta'

const TABS = [
  { key: 'whatsapp',   label: 'WhatsApp',             icon: MessageCircle, color: '#22C55E' },
  { key: 'meta',       label: 'Instagram & Facebook',  icon: Share2,        color: '#E1306C' },
  { key: 'voz',        label: 'Voz IA',                icon: Phone,          color: '#3B82F6' },
  { key: 'widget',     label: 'Widget Web',             icon: Code2,          color: '#A78BFA' },
  { key: 'calendario', label: 'Google Calendar',        icon: CalendarDays,   color: '#4285F4' },
]

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  function doCopy() {
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500) })
  }
  return (
    <button onClick={doCopy} style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied ? GREEN : MUTED, padding: 4 }}>
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  )
}

function StatusBadge({ connected }: { connected: boolean }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600,
      padding: '4px 12px', borderRadius: 99,
      background: connected ? '#F0FDF4' : '#FEF9EC',
      color: connected ? '#16A34A' : '#D97706',
    }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: connected ? GREEN : '#F59E0B' }} />
      {connected ? 'Conectado' : 'Sin conectar'}
    </span>
  )
}

/* ─── WhatsApp Tab ─── */
function WhatsAppTab() {
  const [phone, setPhone] = useState('')
  const [saved, setSaved] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/whatsapp').then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.phone) { setPhone(d.phone); setSaved(d.phone) } })
      .finally(() => setLoading(false))
  }, [])

  async function save() {
    setErr(null); setSaving(true)
    try {
      const res = await fetch('/api/whatsapp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone }) })
      const data = await res.json()
      if (!res.ok) { setErr(data.error ?? 'Error'); return }
      setSaved(data.phone)
    } catch { setErr('Error de conexión') } finally { setSaving(false) }
  }

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><Loader2 size={20} style={{ animation: 'spin 1s linear infinite', color: MUTED }} /></div>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 560 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <StatusBadge connected={!!saved} />
        {saved && <span style={{ fontSize: 12, color: MUTED }}>Número activo: <strong style={{ color: TEXT }}>{saved}</strong></span>}
      </div>

      {/* Step 1 */}
      <Step n={1} color="#22C55E" title="Obtén un número de WhatsApp Business" desc="Crea un número en Twilio (sandbox gratis o producción) o usa tu número existente de WhatsApp Business API.">
        <a href="https://www.twilio.com/try-twilio" target="_blank" rel="noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#22C55E', fontWeight: 600 }}>
          Ir a Twilio <ExternalLink size={12} />
        </a>
      </Step>

      {/* Step 2 */}
      <Step n={2} color="#22C55E" title="Configura el webhook en Twilio" desc="En tu número de WhatsApp, pega esta URL en el campo «When a Message Comes In»:">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg)', border: `1px solid ${BORD}`, borderRadius: 8, padding: '8px 12px' }}>
          <code style={{ fontSize: 11, flex: 1, color: TEXT, wordBreak: 'break-all' }}>{WEBHOOK_WA}</code>
          <CopyButton text={WEBHOOK_WA} />
        </div>
      </Step>

      {/* Step 3 */}
      <Step n={3} color="#22C55E" title="Registra tu número en Welko" desc="Ingresa tu número de WhatsApp Business para activar la recepcionista IA:">
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={phone} onChange={e => setPhone(e.target.value)}
            placeholder="+52 55 1234 5678"
            style={{ flex: 1, padding: '9px 12px', borderRadius: 9, border: `1px solid ${BORD}`, background: SURF, color: TEXT, fontSize: 13, outline: 'none' }}
          />
          <button onClick={save} disabled={saving || !phone.trim()}
            style={{ padding: '9px 18px', borderRadius: 9, background: NAVY, color: '#fff', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', opacity: saving || !phone.trim() ? 0.6 : 1 }}>
            {saving ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : 'Guardar'}
          </button>
        </div>
        {err && <p style={{ color: '#EF4444', fontSize: 12, margin: '6px 0 0' }}>{err}</p>}
        {saved && <p style={{ color: GREEN, fontSize: 12, margin: '6px 0 0' }}>✓ Número guardado y activo</p>}
      </Step>
    </div>
  )
}

/* ─── Meta Tab ─── */
function MetaTab() {
  const [connected, setConnected] = useState(false)
  const [verifyToken] = useState('welko_meta_' + Math.random().toString(36).slice(2, 8))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 560 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <StatusBadge connected={connected} />
      </div>

      <Step n={1} color="#E1306C" title="Crea una app en Meta for Developers" desc="Ve a developers.facebook.com → Mis Apps → Crear app. Elige «Empresa» como tipo.">
        <a href="https://developers.facebook.com" target="_blank" rel="noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#E1306C', fontWeight: 600 }}>
          Meta for Developers <ExternalLink size={12} />
        </a>
      </Step>

      <Step n={2} color="#E1306C" title="Configura el webhook" desc="En tu app, ve a Webhooks → Agregar. Usa esta URL y token de verificación:">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg)', border: `1px solid ${BORD}`, borderRadius: 8, padding: '8px 12px' }}>
            <code style={{ fontSize: 11, flex: 1, color: TEXT, wordBreak: 'break-all' }}>{WEBHOOK_META}</code>
            <CopyButton text={WEBHOOK_META} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg)', border: `1px solid ${BORD}`, borderRadius: 8, padding: '8px 12px' }}>
            <span style={{ fontSize: 11, color: MUTED, marginRight: 4 }}>Token:</span>
            <code style={{ fontSize: 11, flex: 1, color: TEXT }}>{verifyToken}</code>
            <CopyButton text={verifyToken} />
          </div>
        </div>
      </Step>

      <Step n={3} color="#E1306C" title="Activa la integración" desc="Suscríbete a los eventos «messages» e «messaging_postbacks» en tu app. Luego activa:">
        <button
          onClick={() => setConnected(true)}
          style={{ padding: '9px 20px', borderRadius: 9, background: '#E1306C', color: '#fff', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
          {connected ? '✓ Conectado' : 'Activar Instagram & Facebook'}
        </button>
      </Step>
    </div>
  )
}

/* ─── Voz Tab ─── */
function VozTab() {
  const [active, setActive] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 560 }}>
      <div style={{ background: active ? '#EFF6FF' : SURF, border: `1px solid ${active ? '#BFDBFE' : BORD}`, borderRadius: 16, padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Phone size={22} color="#3B82F6" />
          </div>
          <div>
            <p style={{ color: TEXT, fontSize: 15, fontWeight: 700, margin: 0 }}>Recepcionista de Voz IA</p>
            <p style={{ color: MUTED, fontSize: 12, margin: '3px 0 0' }}>Responde llamadas entrantes automáticamente en español mexicano</p>
          </div>
          <StatusBadge connected={active} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          {[
            { title:'Voz natural', desc:'Español mexicano con acento neutro' },
            { title:'GPT-4o mini', desc:'Mismo motor que el chat de WhatsApp' },
            { title:'Número dedicado', desc:'Número de marcación directa incluido' },
            { title:'Transcripción', desc:'Cada llamada queda registrada en CRM' },
          ].map((f) => (
            <div key={f.title} style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--bg)', border: `1px solid ${BORD}` }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: TEXT, margin: 0 }}>{f.title}</p>
              <p style={{ fontSize: 11, color: MUTED, margin: '2px 0 0' }}>{f.desc}</p>
            </div>
          ))}
        </div>
        <button onClick={() => setActive(!active)}
          style={{ padding: '11px 24px', borderRadius: 10, background: active ? '#EF4444' : '#3B82F6', color: '#fff', fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
          {active ? 'Desactivar Voz IA' : 'Activar Voz IA'}
        </button>
      </div>
    </div>
  )
}

/* ─── Widget Tab ─── */
function WidgetTab() {
  const snippet = `<script src="https://welko.agency/widget.js"
  data-clinic-id="TU_CLINIC_ID"
  data-color="#13244A">
</script>`

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 600 }}>
      <div style={{ background: SURF, border: `1px solid ${BORD}`, borderRadius: 14, padding: '18px 20px' }}>
        <p style={{ color: TEXT, fontSize: 13, fontWeight: 600, margin: '0 0 6px' }}>Código de instalación</p>
        <p style={{ color: MUTED, fontSize: 12, margin: '0 0 12px' }}>Pega este script antes del cierre de tu etiqueta &lt;/body&gt;:</p>
        <div style={{ position: 'relative', background: '#0A0F1A', borderRadius: 10, padding: '14px 16px' }}>
          <pre style={{ margin: 0, fontSize: 12, color: '#A5F3FC', lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{snippet}</pre>
          <div style={{ position: 'absolute', top: 10, right: 10 }}>
            <CopyButton text={snippet} />
          </div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        {[
          { title:'30 segundos', desc:'De cero a chat activo en tu sitio' },
          { title:'Tu marca', desc:'Color y nombre de tu clínica' },
          { title:'CRM integrado', desc:'Cada lead va directo a Conversaciones' },
        ].map((f) => (
          <div key={f.title} style={{ padding: '14px 16px', borderRadius: 12, background: SURF, border: `1px solid ${BORD}` }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: TEXT, margin: 0 }}>{f.title}</p>
            <p style={{ fontSize: 11, color: MUTED, margin: '3px 0 0' }}>{f.desc}</p>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        {['HTML / Vanilla JS', 'WordPress', 'Webflow'].map((p, i) => (
          <div key={p} style={{ flex: 1, padding: '12px 16px', borderRadius: 10, background: SURF, border: `1px solid ${BORD}` }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: TEXT, margin: '0 0 4px' }}>{p}</p>
            <p style={{ fontSize: 11, color: MUTED, margin: 0 }}>{i === 0 ? 'Pega el script directamente' : i === 1 ? 'Plugin → HTML personalizado → Pegar' : 'Ajustes → Código personalizado → Body'}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Google Calendar Tab ─── */
function CalendarioTab() {
  const [connected, setConnected]   = useState(false)
  const [loading, setLoading]       = useState(true)
  const [disconnecting, setDisconn] = useState(false)
  const [flash, setFlash]           = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/calendar/status')
      .then(r => r.json())
      .then(d => setConnected(!!d.connected))
      .finally(() => setLoading(false))

    // Handle return from OAuth callback
    const params = new URLSearchParams(window.location.search)
    const gcal   = params.get('gcal')
    const tab    = params.get('tab')
    if (gcal === 'connected' && tab === 'calendario') {
      setConnected(true)
      setFlash('Conectado exitosamente a Google Calendar ✓')
      window.history.replaceState({}, '', window.location.pathname)
    } else if (gcal === 'denied') {
      setFlash('Conexión cancelada por el usuario.')
    } else if (gcal === 'error' || gcal === 'no_refresh_token') {
      setFlash('Error al conectar. Intenta de nuevo o revoca el acceso en myaccount.google.com y reintenta.')
    }
  }, [])

  async function disconnect() {
    if (!confirm('¿Desconectar Google Calendar? Las citas futuras ya no se sincronizarán.')) return
    setDisconn(true)
    await fetch('/api/calendar/disconnect', { method: 'DELETE' })
    setConnected(false)
    setFlash('Google Calendar desconectado.')
    setDisconn(false)
  }

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><Loader2 size={20} style={{ animation: 'spin 1s linear infinite', color: MUTED }} /></div>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 560 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <StatusBadge connected={connected} />
        {flash && (
          <span style={{ fontSize: 12, color: connected ? '#16A34A' : '#D97706' }}>{flash}</span>
        )}
      </div>

      {/* Info card */}
      <div style={{ background: SURF, border: `1px solid ${BORD}`, borderRadius: 14, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <CalendarDays size={22} color="#4285F4" />
          </div>
          <div>
            <p style={{ color: TEXT, fontSize: 14, fontWeight: 700, margin: 0 }}>Sincronización automática de citas</p>
            <p style={{ color: MUTED, fontSize: 12, margin: '3px 0 0' }}>Cada cita agendada por Welko aparece en tu Google Calendar</p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { title:'Creación automática', desc:'Evento creado al agendar cita' },
            { title:'Actualización en vivo', desc:'Cambios reflejados al instante' },
            { title:'Cancelaciones', desc:'Elimina el evento si se cancela la cita' },
            { title:'Recordatorios Welko', desc:'Welko gestiona los avisos por WhatsApp' },
          ].map(f => (
            <div key={f.title} style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--bg)', border: `1px solid ${BORD}` }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: TEXT, margin: 0 }}>{f.title}</p>
              <p style={{ fontSize: 11, color: MUTED, margin: '2px 0 0' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {!connected ? (
        <Step n={1} color="#4285F4" title="Conecta tu cuenta de Google" desc="Welko necesita acceso solo a eventos de Calendar (no lee correos ni otros datos). Puedes revocar el acceso en cualquier momento.">
          <a href="/api/calendar/connect"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 10, background: '#4285F4', color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
            <CalendarDays size={14} />
            Conectar Google Calendar
          </a>
        </Step>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 10, background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
            <CheckCircle size={16} color="#16A34A" />
            <p style={{ fontSize: 13, color: '#15803D', margin: 0, fontWeight: 500 }}>
              Google Calendar activo. Las nuevas citas se sincronizarán automáticamente.
            </p>
          </div>
          <button
            onClick={disconnect}
            disabled={disconnecting}
            style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 9, background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', fontSize: 12, fontWeight: 600, cursor: disconnecting ? 'not-allowed' : 'pointer', opacity: disconnecting ? 0.6 : 1 }}>
            {disconnecting ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : null}
            Desconectar Google Calendar
          </button>
        </div>
      )}
    </div>
  )
}

/* ─── Step helper ─── */
function Step({ n, color, title, desc, children }: { n: number; color: string; title: string; desc: string; children?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 14 }}>
      <div style={{ width: 28, height: 28, borderRadius: '50%', background: `${color}20`, border: `1.5px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
        <span style={{ fontSize: 12, fontWeight: 800, color }}>{n}</span>
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: TEXT, margin: '0 0 4px' }}>{title}</p>
        <p style={{ fontSize: 12, color: MUTED, margin: '0 0 10px', lineHeight: 1.55 }}>{desc}</p>
        {children}
      </div>
    </div>
  )
}

/* ─── Main ─── */
export default function CanalesPage() {
  const [tab, setTab] = useState('whatsapp')
  const active = TABS.find(t => t.key === tab)!

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100%', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ color: TEXT, fontSize: 18, fontWeight: 700, margin: 0 }}>Canales</h1>
        <p style={{ color: MUTED, fontSize: 12, margin: '3px 0 0' }}>Conecta y gestiona todos los canales de tu recepcionista IA desde aquí</p>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 4, borderBottom: `1px solid ${BORD}`, paddingBottom: 0 }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '8px 16px', background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: tab === t.key ? 600 : 400,
              color: tab === t.key ? TEXT : MUTED,
              borderBottom: tab === t.key ? `2px solid ${t.color}` : '2px solid transparent',
              marginBottom: -1, transition: 'color 0.15s',
            }}
          >
            <t.icon size={14} color={tab === t.key ? t.color : MUTED} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ paddingTop: 4 }}>
        {tab === 'whatsapp'   && <WhatsAppTab />}
        {tab === 'meta'       && <MetaTab />}
        {tab === 'voz'        && <VozTab />}
        {tab === 'widget'     && <WidgetTab />}
        {tab === 'calendario' && <CalendarioTab />}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
