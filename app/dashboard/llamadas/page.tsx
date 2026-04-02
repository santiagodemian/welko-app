'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Phone, CheckCircle, Copy, Check, ExternalLink, Info } from 'lucide-react'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]
const WEBHOOK_URL = 'https://welko.agency/api/webhook/voice'

export default function LlamadasPage() {
  const [clinicId, setClinicId] = useState<string | null>(null)
  const [copied, setCopied]     = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/ai-config')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.id) setClinicId(d.id) })
  }, [])

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key)
      setTimeout(() => setCopied(null), 2500)
    })
  }

  function CopyBlock({ label, value, id }: { label: string; value: string; id: string }) {
    const isCopied = copied === id
    return (
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between px-4 py-2.5"
          style={{ background: '#0f172a', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="text-xs font-mono" style={{ color: '#94a3b8' }}>{label}</span>
          <button
            onClick={() => copy(value, id)}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg"
            style={{
              background: isCopied ? '#22c55e18' : 'rgba(255,255,255,0.06)',
              color: isCopied ? '#22c55e' : '#94a3b8',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {isCopied ? <Check size={12} /> : <Copy size={12} />}
            {isCopied ? 'Copiado' : 'Copiar'}
          </button>
        </div>
        <div className="px-4 py-3" style={{ background: '#0f172a' }}>
          <pre className="text-xs font-mono break-all whitespace-pre-wrap" style={{ color: '#34d399', margin: 0 }}>
            {value}
          </pre>
        </div>
      </div>
    )
  }

  const systemPromptExample = `Eres la recepcionista IA de [Nombre de tu clínica]. Tu nombre es Sofía.
Respondes llamadas de pacientes, resuelves dudas sobre servicios y agendas citas.
Servicios: [Lista tus servicios aquí].
Horario: Lunes a Viernes 9am-6pm, Sábados 10am-2pm.
Siempre saluda con calidez. Si hay urgencia, da el número directo del médico.`

  return (
    <div className="flex flex-col gap-8 max-w-2xl mx-auto px-4 py-8">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="flex flex-col gap-2"
      >
        <div className="flex items-center gap-3">
          <Phone size={22} style={{ color: '#6366f1' }} />
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Llamadas de Voz IA
          </h1>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(99,102,241,0.1)', color: '#6366f1' }}>
            Plan Pro
          </span>
        </div>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Tu recepcionista IA atiende llamadas telefónicas, responde dudas y agenda citas en tiempo real — usando Vapi.
        </p>
      </motion.div>

      {/* Info banner */}
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE, delay: 0.02 }}
        className="flex items-start gap-3 p-4 rounded-xl"
        style={{ background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.2)' }}
      >
        <Info size={16} style={{ color: '#6366f1', flexShrink: 0, marginTop: 1 }} />
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Welko usa <strong style={{ color: 'var(--text-primary)' }}>Vapi</strong> para las llamadas de voz.
          Vapi conecta tu número de teléfono con IA en tiempo real — conversación natural, sin bots de árbol de opciones.
          Costo estimado: ~$0.05 USD/min de llamada.
        </p>
      </motion.div>

      {/* Step 1 */}
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
            Crea una cuenta en Vapi
          </h2>
        </div>
        <ol className="flex flex-col gap-2 pl-8">
          {[
            'Ve a vapi.ai y crea tu cuenta (tiene free trial con créditos incluidos)',
            'En el dashboard ve a "Assistants" → "Create Assistant"',
            'Elige la voz: recomendamos "Nova" (español) o "Shimmer" para un tono profesional',
            'En "System Prompt" pega las instrucciones de tu clínica (ver ejemplo abajo)',
          ].map((s, i) => (
            <li key={i} className="text-sm" style={{ color: 'var(--text-secondary)' }}>{s}</li>
          ))}
        </ol>
        <a href="https://vapi.ai" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-medium self-start px-3 py-1.5 rounded-lg"
          style={{ background: '#6366f1', color: '#fff' }}>
          Abrir Vapi <ExternalLink size={11} />
        </a>
      </motion.div>

      {/* System prompt example */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE, delay: 0.08 }}
        className="flex flex-col gap-4 p-5 rounded-2xl"
        style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}
      >
        <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          Ejemplo de System Prompt para Vapi
        </h2>
        <p className="text-xs pl-0" style={{ color: 'var(--text-secondary)' }}>
          Personaliza los campos entre corchetes con los datos de tu clínica:
        </p>
        <CopyBlock label="System Prompt" value={systemPromptExample} id="prompt" />
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Tip: puedes copiar el contenido de tu "Configuración de IA" y adaptarlo aquí.
        </p>
      </motion.div>

      {/* Step 2 — Phone number */}
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
            Asigna un número de teléfono
          </h2>
        </div>
        <ol className="flex flex-col gap-2 pl-8">
          {[
            'En Vapi ve a "Phone Numbers" → "Buy Number"',
            'Elige un número con código de área mexicano (+52) o el país que prefieras',
            'Costo aprox: $1–3 USD/mes por el número',
            'Asigna el Assistant que creaste en el paso anterior a ese número',
          ].map((s, i) => (
            <li key={i} className="text-sm" style={{ color: 'var(--text-secondary)' }}>{s}</li>
          ))}
        </ol>
        <div className="p-3 rounded-xl pl-8" style={{ background: 'var(--bg)' }}>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            <strong style={{ color: 'var(--text-secondary)' }}>Alternativa:</strong> Si ya tienes un número en Twilio, puedes importarlo a Vapi en "Phone Numbers" → "Import from Twilio".
          </p>
        </div>
      </motion.div>

      {/* Step 3 — Webhook */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE, delay: 0.12 }}
        className="flex flex-col gap-4 p-5 rounded-2xl"
        style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}
      >
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style={{ background: 'var(--accent)', fontSize: 11 }}>3</span>
          <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Conecta el webhook a Welko
          </h2>
        </div>
        <p className="text-sm pl-8" style={{ color: 'var(--text-secondary)' }}>
          En Vapi ve a tu Assistant → <strong>Server URL</strong> y pega esta dirección. Así cada llamada terminada crea un lead automáticamente en tu CRM:
        </p>
        <div className="pl-8">
          <CopyBlock label="Webhook URL" value={WEBHOOK_URL} id="webhook" />
        </div>

        {clinicId && (
          <>
            <p className="text-sm pl-8" style={{ color: 'var(--text-secondary)' }}>
              También agrega el <strong>Clinic ID</strong> en el campo <strong>metadata</strong> de tu Assistant en Vapi (Settings → Metadata):
            </p>
            <div className="pl-8">
              <CopyBlock label="Tu Clinic ID" value={clinicId} id="clinicid" />
            </div>
            <p className="text-xs pl-8" style={{ color: 'var(--text-muted)' }}>
              En Vapi, en la config del Assistant, agrega en "Metadata":
              {' '}<code style={{ background: 'var(--bg)', padding: '1px 5px', borderRadius: 4 }}>
                {'{"clinic_id":"' + clinicId + '"}'}
              </code>
            </p>
          </>
        )}
      </motion.div>

      {/* Step 4 — Test */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE, delay: 0.14 }}
        className="flex flex-col gap-4 p-5 rounded-2xl"
        style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}
      >
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style={{ background: 'var(--accent)', fontSize: 11 }}>4</span>
          <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Prueba la llamada
          </h2>
        </div>
        <ol className="flex flex-col gap-2 pl-8">
          {[
            'En Vapi puedes hacer una llamada de prueba desde el dashboard (botón "Test Call")',
            'Llama al número que compraste desde tu celular',
            'Después de la llamada, ve a tu CRM en Welko — debe aparecer el lead con la transcripción',
            '¡Listo! Tu recepcionista IA ya atiende llamadas automáticamente',
          ].map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <CheckCircle size={13} style={{ color: '#22c55e', flexShrink: 0, marginTop: 3 }} />
              {s}
            </li>
          ))}
        </ol>
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE, delay: 0.18 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {[
          { icon: '🎙️', title: 'Voz natural', desc: 'IA conversacional en español, sin menús de opciones. Responde como un humano.' },
          { icon: '📋', title: 'Leads al CRM', desc: 'Cada llamada terminada crea automáticamente un lead con transcripción y datos del paciente.' },
          { icon: '⚡', title: 'Sin infraestructura', desc: 'Vapi maneja todo el audio. Tú solo configuras el prompt y listo.' },
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
