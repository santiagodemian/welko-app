'use client'

import { useState } from 'react'
import { AIConfig } from '@/components/dashboard/AIConfig'
import {
  Bot, MessageSquare, ToggleLeft, ToggleRight, Building2,
  Edit3, Save, Check, Sparkles, Clock,
} from 'lucide-react'

const SURF  = 'var(--surface)'
const BORD  = 'var(--border)'
const TEXT  = 'var(--text-primary)'
const MUTED = 'var(--text-secondary)'
const NAVY  = '#13244A'
const PURPLE= '#A78BFA'

const TABS = [
  { key: 'config',     label: 'Configuración IA', icon: Bot },
  { key: 'plantillas', label: 'Plantillas',         icon: MessageSquare },
  { key: 'ocupado',    label: 'Modo Ocupado',       icon: ToggleLeft },
  { key: 'sucursales', label: 'Sucursales',          icon: Building2 },
]

/* ─── Plantillas Tab ─── */
const DEFAULT_PLANTILLAS = [
  { trigger: '¿Cuál es el precio?',        response: 'El costo de {servicio} es {precio}. ¿Le gustaría agendar una cita?' },
  { trigger: '¿Tienen disponibilidad?',    response: 'Tenemos disponibilidad {dias_disponibles}. ¿Cuál le queda mejor?' },
  { trigger: '¿Cuál es la dirección?',     response: 'Estamos ubicados en {direccion}. ¿Necesita indicaciones para llegar?' },
  { trigger: '¿Cuáles son sus horarios?',  response: 'Atendemos {horario}. ¿Le gustaría agendar dentro de ese horario?' },
  { trigger: '¿Aceptan seguro?',           response: 'Trabajamos con {seguros}. ¿Su seguro es de alguno de estos?' },
  { trigger: 'Quiero cancelar mi cita',    response: 'Entendido. Para cancelar necesito su nombre y la fecha de la cita. ¿Me los puede proporcionar?' },
  { trigger: '¿Cuánto tiempo dura?',       response: '{servicio} tiene una duración aproximada de {duracion}.' },
  { trigger: '¿Se puede pagar con tarjeta?', response: 'Sí aceptamos {metodos_pago}. ¿Tiene alguna preferencia?' },
  { trigger: 'Primera vez en la clínica',  response: '¡Bienvenido! Para pacientes nuevos ofrecemos {beneficio_nuevo}. ¿Le interesa?' },
  { trigger: 'Quiero reagendar',           response: 'Con gusto le ayudo a reagendar. ¿Me puede dar su nombre y la fecha actual de su cita?' },
]

function PlantillasTab() {
  const [plantillas, setPlantillas] = useState(DEFAULT_PLANTILLAS)
  const [editing, setEditing] = useState<number | null>(null)
  const [saved, setSaved] = useState<number | null>(null)

  function saveEdit(i: number, field: 'trigger' | 'response', val: string) {
    const next = [...plantillas]
    next[i] = { ...next[i], [field]: val }
    setPlantillas(next)
  }

  function confirmSave(i: number) {
    setEditing(null)
    setSaved(i)
    setTimeout(() => setSaved(null), 2000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <Sparkles size={14} color={PURPLE} />
        <p style={{ color: TEXT, fontSize: 13, fontWeight: 600, margin: 0 }}>Respuestas frecuentes de tu IA</p>
        <span style={{ fontSize: 11, color: MUTED, background: 'var(--bg)', padding: '2px 8px', borderRadius: 99, border: `1px solid ${BORD}` }}>
          Edita para personalizar
        </span>
      </div>

      {plantillas.map((p, i) => (
        <div key={i} style={{
          background: SURF, border: `1px solid ${editing === i ? PURPLE : BORD}`,
          borderRadius: 12, padding: '12px 16px',
          transition: 'border-color 0.15s',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ flex: 1 }}>
              {/* Trigger */}
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Cuando preguntan</span>
                {editing === i
                  ? <input value={p.trigger} onChange={e => saveEdit(i, 'trigger', e.target.value)}
                      style={{ display: 'block', width: '100%', padding: '6px 0', fontSize: 13, fontWeight: 600, color: TEXT, background: 'none', border: 'none', borderBottom: `1px solid ${PURPLE}`, outline: 'none', marginTop: 3 }} />
                  : <p style={{ fontSize: 13, fontWeight: 600, color: TEXT, margin: '3px 0 0' }}>«{p.trigger}»</p>
                }
              </div>
              {/* Response */}
              <div>
                <span style={{ fontSize: 10, fontWeight: 600, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Tu IA responde</span>
                {editing === i
                  ? <textarea value={p.response} onChange={e => saveEdit(i, 'response', e.target.value)}
                      rows={2}
                      style={{ display: 'block', width: '100%', padding: '6px 0', fontSize: 12, color: TEXT, background: 'none', border: 'none', borderBottom: `1px solid ${PURPLE}`, outline: 'none', resize: 'none', marginTop: 3, lineHeight: 1.5 }} />
                  : <p style={{ fontSize: 12, color: MUTED, margin: '3px 0 0', lineHeight: 1.5 }}>{p.response}</p>
                }
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexShrink: 0, marginTop: 2 }}>
              {editing === i
                ? <button onClick={() => confirmSave(i)}
                    style={{ padding: '5px 10px', borderRadius: 7, background: NAVY, color: '#fff', fontSize: 11, fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Save size={11} /> Guardar
                  </button>
                : saved === i
                  ? <span style={{ fontSize: 11, color: '#22C55E', display: 'flex', alignItems: 'center', gap: 4 }}><Check size={12} /> Guardado</span>
                  : <button onClick={() => setEditing(i)}
                      style={{ padding: '5px 10px', borderRadius: 7, background: 'var(--bg)', color: MUTED, fontSize: 11, border: `1px solid ${BORD}`, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Edit3 size={11} /> Editar
                    </button>
              }
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─── Modo Ocupado Tab ─── */
const DELAY_OPTIONS = [
  { value: '2s',   label: '2 seg',   desc: 'Inmediato' },
  { value: '10s',  label: '10 seg',  desc: 'Natural' },
  { value: '30s',  label: '30 seg',  desc: 'Pausado' },
  { value: '1m',   label: '1 min',   desc: 'Humano' },
  { value: '2m',   label: '2 min',   desc: 'Reflexivo' },
  { value: '5m',   label: '5 min',   desc: 'Muy humano' },
]

function ModoOcupadoTab() {
  const [active, setActive] = useState(() => localStorage.getItem('welko_modo_ocupado') === 'true')
  const [hours, setHours] = useState('2')
  const [customMsg, setCustomMsg] = useState('Gracias por escribirnos. En este momento estamos atendiendo cirugías. Te confirmaremos en aproximadamente {horas} horas.')
  const [delay, setDelay] = useState(() => localStorage.getItem('welko_response_delay') ?? '10s')
  const [saved, setSaved] = useState(false)

  function toggle() {
    const next = !active
    setActive(next)
    localStorage.setItem('welko_modo_ocupado', String(next))
  }

  function save() {
    localStorage.setItem('welko_modo_ocupado_msg', customMsg)
    localStorage.setItem('welko_modo_ocupado_hours', hours)
    localStorage.setItem('welko_response_delay', delay)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 560 }}>
      {/* Main toggle */}
      <div style={{
        background: active ? '#FEF2F2' : SURF,
        border: `1px solid ${active ? '#FECACA' : BORD}`,
        borderRadius: 16, padding: '20px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: active ? '#FEE2E2' : 'var(--accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={20} color={active ? '#EF4444' : NAVY} />
          </div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, color: TEXT, margin: 0 }}>{active ? 'Modo Ocupado activado' : 'Modo Ocupado desactivado'}</p>
            <p style={{ fontSize: 12, color: MUTED, margin: '3px 0 0' }}>
              {active ? 'La IA solo toma datos y no agenda — responde con tu mensaje personalizado' : 'La IA responde y agenda automáticamente 24/7'}
            </p>
          </div>
        </div>
        <button onClick={toggle} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          {active
            ? <ToggleRight size={40} color="#EF4444" />
            : <ToggleLeft size={40} color={MUTED} />}
        </button>
      </div>

      {/* Config */}
      <div style={{ background: SURF, border: `1px solid ${BORD}`, borderRadius: 14, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: TEXT, margin: 0 }}>Configuración del modo ocupado</p>

        <div>
          <label style={{ fontSize: 12, fontWeight: 500, color: MUTED, display: 'block', marginBottom: 6 }}>Tiempo de respuesta estimado</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {['1', '2', '4', '8', '24'].map(h => (
              <button key={h} onClick={() => setHours(h)}
                style={{ padding: '7px 14px', borderRadius: 9, fontSize: 13, fontWeight: 600, border: `1px solid ${hours === h ? NAVY : BORD}`, background: hours === h ? NAVY : SURF, color: hours === h ? '#fff' : MUTED, cursor: 'pointer' }}>
                {h}h
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ fontSize: 12, fontWeight: 500, color: MUTED, display: 'block', marginBottom: 6 }}>Mensaje automático de respuesta</label>
          <textarea
            value={customMsg}
            onChange={e => setCustomMsg(e.target.value)}
            rows={3}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 9, border: `1px solid ${BORD}`, background: 'var(--bg)', color: TEXT, fontSize: 12, lineHeight: 1.6, resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
          />
          <p style={{ fontSize: 10, color: MUTED, margin: '4px 0 0' }}>Usa {'{horas}'} para insertar el tiempo configurado arriba</p>
        </div>

        <button onClick={save}
          style={{ alignSelf: 'flex-start', padding: '9px 20px', borderRadius: 9, background: NAVY, color: '#fff', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          {saved ? <><Check size={14} /> Guardado</> : <><Save size={14} /> Guardar cambios</>}
        </button>
      </div>

      {/* Response delay */}
      <div style={{ background: SURF, border: `1px solid ${BORD}`, borderRadius: 14, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Clock size={15} color={NAVY} />
          <p style={{ fontSize: 13, fontWeight: 600, color: TEXT, margin: 0 }}>Tiempo de respuesta de la IA</p>
        </div>
        <p style={{ fontSize: 12, color: MUTED, margin: 0, lineHeight: 1.5 }}>
          Cuánto tarda tu IA en responder después de recibir un mensaje. Un pequeño delay hace que la respuesta se sienta más humana y natural.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {DELAY_OPTIONS.map(opt => (
            <button key={opt.value} onClick={() => setDelay(opt.value)}
              style={{
                padding: '10px 12px', borderRadius: 10, textAlign: 'left',
                border: `1.5px solid ${delay === opt.value ? NAVY : BORD}`,
                background: delay === opt.value ? 'rgba(19,36,74,0.06)' : SURF,
                cursor: 'pointer', transition: 'all 0.15s',
              }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: delay === opt.value ? NAVY : TEXT, margin: 0 }}>{opt.label}</p>
              <p style={{ fontSize: 10, color: MUTED, margin: '2px 0 0' }}>{opt.desc}</p>
            </button>
          ))}
        </div>
        <button onClick={save}
          style={{ alignSelf: 'flex-start', padding: '9px 20px', borderRadius: 9, background: NAVY, color: '#fff', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          {saved ? <><Check size={14} /> Guardado</> : <><Save size={14} /> Guardar</>}
        </button>
      </div>
    </div>
  )
}

/* ─── Sucursales Tab ─── */
const TONE_PRESETS = [
  { id: 'profesional', label: 'Profesional', desc: 'Claro, directo y confiable', sample: 'Buenos días, le habla el asistente virtual. ¿En qué le puedo ayudar?' },
  { id: 'amigable',    label: 'Amigable',    desc: 'Cálido y conversacional',    sample: '¡Hola! 😊 Soy el asistente de tu clínica. ¿Cómo te puedo ayudar?' },
  { id: 'empatico',    label: 'Empático',    desc: 'Comprensivo y de apoyo',      sample: 'Hola, entendemos que dar el primer paso puede ser difícil. Estamos aquí.' },
  { id: 'formal',      label: 'Formal',      desc: 'Preciso y ejecutivo',         sample: 'Bienvenido al sistema de atención. Por favor indique su solicitud.' },
]

function SucursalesTab() {
  const [tone, setTone]     = useState('profesional')
  const [greeting, setGreeting] = useState('')
  const [saved, setSaved]   = useState(false)
  const selected = TONE_PRESETS.find(t => t.id === tone)!

  function save() { setSaved(true); setTimeout(() => setSaved(false), 2500) }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 560 }}>
      <div>
        <p style={{ fontSize: 13, fontWeight: 600, color: TEXT, margin: '0 0 12px' }}>Tono de voz de la IA</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {TONE_PRESETS.map(t => (
            <button key={t.id} onClick={() => setTone(t.id)}
              style={{
                textAlign: 'left', padding: '12px 14px', borderRadius: 12,
                background: tone === t.id ? `rgba(19,36,74,0.06)` : SURF,
                border: `1.5px solid ${tone === t.id ? NAVY : BORD}`,
                cursor: 'pointer', transition: 'all 0.15s',
              }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: tone === t.id ? NAVY : TEXT, margin: '0 0 3px' }}>{t.label}</p>
              <p style={{ fontSize: 11, color: MUTED, margin: 0 }}>{t.desc}</p>
            </button>
          ))}
        </div>
        <div style={{ marginTop: 12, padding: '12px 16px', borderRadius: 10, background: 'rgba(19,36,74,0.05)', border: `1px solid rgba(19,36,74,0.12)` }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: NAVY, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 4px' }}>Vista previa</p>
          <p style={{ fontSize: 12, color: MUTED, margin: 0, lineHeight: 1.55, fontStyle: 'italic' }}>«{selected.sample}»</p>
        </div>
      </div>

      <div>
        <label style={{ fontSize: 13, fontWeight: 600, color: TEXT, display: 'block', marginBottom: 8 }}>Saludo personalizado (opcional)</label>
        <textarea
          value={greeting}
          onChange={e => setGreeting(e.target.value)}
          rows={3}
          placeholder="Ej: Hola, bienvenido a Clínica Sonrisa Perfecta. ¿En qué te puedo ayudar?"
          style={{ width: '100%', padding: '10px 12px', borderRadius: 9, border: `1px solid ${BORD}`, background: 'var(--bg)', color: TEXT, fontSize: 12, lineHeight: 1.6, resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
        />
      </div>

      <button onClick={save}
        style={{ alignSelf: 'flex-start', padding: '9px 20px', borderRadius: 9, background: NAVY, color: '#fff', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
        {saved ? <><Check size={14} /> Guardado</> : <><Save size={14} /> Guardar tono</>}
      </button>
    </div>
  )
}

/* ─── Main ─── */
export default function IAPage() {
  const [tab, setTab] = useState('config')

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100%', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ color: TEXT, fontSize: 18, fontWeight: 700, margin: 0 }}>IA & Negocio</h1>
        <p style={{ color: MUTED, fontSize: 12, margin: '3px 0 0' }}>Configura cómo trabaja y habla tu recepcionista IA</p>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 4, borderBottom: `1px solid ${BORD}` }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '8px 16px', background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: tab === t.key ? 600 : 400,
              color: tab === t.key ? TEXT : MUTED,
              borderBottom: tab === t.key ? `2px solid ${NAVY}` : '2px solid transparent',
              marginBottom: -1, transition: 'color 0.15s',
            }}>
            <t.icon size={14} color={tab === t.key ? NAVY : MUTED} />
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ paddingTop: 4 }}>
        {tab === 'config'     && <div style={{ background: SURF, borderRadius: 14, border: `1px solid ${BORD}`, padding: '0' }}><AIConfig /></div>}
        {tab === 'plantillas' && <PlantillasTab />}
        {tab === 'ocupado'    && <ModoOcupadoTab />}
        {tab === 'sucursales' && <SucursalesTab />}
      </div>
    </div>
  )
}
