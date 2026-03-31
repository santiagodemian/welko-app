'use client'

import { useState } from 'react'
import {
  Building2, Plus, Edit3, Check, Sparkles, ChevronDown,
  MessageSquare, Phone, Globe, Mic, Save, Trash2,
} from 'lucide-react'

const NAVY  = '#1A2A56'
const NAVY2 = '#2B3F7A'
const WHITE = '#FFFFFF'
const SURF  = 'var(--surface)'
const SURF2 = 'var(--surface-hover)'
const BORD  = 'var(--border)'
const TEXT  = 'var(--text-primary)'
const MUTED = 'var(--text-secondary)'

/* ── Tone presets ── */
const TONE_PRESETS = [
  {
    id: 'profesional',
    label: 'Profesional',
    desc: 'Claro, directo y confiable. Ideal para especialidades clínicas.',
    sample: 'Buenos días, le habla el asistente virtual de Clínica XYZ. ¿En qué le puedo ayudar?',
  },
  {
    id: 'amigable',
    label: 'Amigable y cercana',
    desc: 'Cálido, conversacional. Ideal para estética y nutrición.',
    sample: '¡Hola! 😊 Soy el asistente de tu clínica. ¿Cómo te puedo ayudar hoy?',
  },
  {
    id: 'empatico',
    label: 'Empático',
    desc: 'Comprensivo, prioriza el bienestar del paciente. Ideal para psicología.',
    sample: 'Hola, entendemos que dar el primer paso puede ser difícil. Estamos aquí para acompañarte.',
  },
  {
    id: 'formal',
    label: 'Formal y ejecutivo',
    desc: 'Preciso, sin lenguaje coloquial. Ideal para corporativos y multisucursal.',
    sample: 'Bienvenido al sistema de atención de Grupo Clínico XYZ. Por favor indique su solicitud.',
  },
]

/* ── Channel toggles ── */
const CHANNELS = [
  { id: 'whatsapp',  label: 'WhatsApp',  Icon: MessageSquare },
  { id: 'llamadas',  label: 'Llamadas',  Icon: Phone },
  { id: 'instagram', label: 'Instagram', Icon: Globe },
  { id: 'web',       label: 'Chat Web',  Icon: Globe },
]

interface Branch {
  id: string
  name: string
  city: string
  specialty: string
  tone: string
  customGreeting: string
  channels: string[]
  active: boolean
}

const INITIAL_BRANCHES: Branch[] = [
  {
    id: '1',
    name: 'Sucursal Centro',
    city: 'CDMX',
    specialty: 'Odontología',
    tone: 'profesional',
    customGreeting: 'Buenos días, bienvenido a Clínica Dental Centro. ¿En qué le puedo ayudar?',
    channels: ['whatsapp', 'llamadas', 'instagram'],
    active: true,
  },
  {
    id: '2',
    name: 'Sucursal Santa Fe',
    city: 'CDMX',
    specialty: 'Medicina Estética',
    tone: 'amigable',
    customGreeting: '¡Hola! 😊 Soy el asistente de Santa Fe Beauty. ¿Cómo te puedo ayudar?',
    channels: ['whatsapp', 'instagram', 'web'],
    active: true,
  },
  {
    id: '3',
    name: 'Sucursal Monterrey',
    city: 'Monterrey',
    specialty: 'Psicología',
    tone: 'empatico',
    customGreeting: 'Hola, estamos aquí para escucharte. ¿Quieres agendar tu primera sesión?',
    channels: ['whatsapp', 'llamadas'],
    active: false,
  },
]

/* ── Branch card ── */
function BranchCard({
  branch,
  selected,
  onClick,
}: {
  branch: Branch
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', textAlign: 'left',
        padding: '14px 16px', borderRadius: 12,
        border: `1.5px solid ${selected ? NAVY : BORD}`,
        background: selected ? `${NAVY}06` : SURF,
        cursor: 'pointer', transition: 'all 0.15s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 9, flexShrink: 0,
          background: selected ? NAVY : SURF2,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Building2 size={15} color={selected ? WHITE : NAVY} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ color: TEXT, fontSize: 13, fontWeight: 700, margin: 0 }}>{branch.name}</p>
          <p style={{ color: MUTED, fontSize: 11, margin: 0 }}>{branch.city} · {branch.specialty}</p>
        </div>
        <span style={{
          fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99,
          background: branch.active ? `${NAVY}12` : '#F3F4F6',
          color: branch.active ? NAVY : '#9CA3AF',
        }}>
          {branch.active ? 'Activa' : 'Inactiva'}
        </span>
      </div>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {branch.channels.map(ch => (
          <span key={ch} style={{
            fontSize: 9, fontWeight: 600, padding: '2px 7px', borderRadius: 99,
            background: SURF2, color: MUTED, textTransform: 'capitalize',
          }}>
            {ch}
          </span>
        ))}
      </div>
    </button>
  )
}

export default function SucursalesPage() {
  const [branches, setBranches] = useState<Branch[]>(INITIAL_BRANCHES)
  const [selectedId, setSelectedId] = useState<string>('1')
  const [saved, setSaved] = useState(false)
  const [addingNew, setAddingNew] = useState(false)
  const [newName, setNewName] = useState('')

  const selected = branches.find(b => b.id === selectedId)!

  function updateSelected(patch: Partial<Branch>) {
    setBranches(prev => prev.map(b => b.id === selectedId ? { ...b, ...patch } : b))
    setSaved(false)
  }

  function toggleChannel(ch: string) {
    const current = selected.channels
    const next = current.includes(ch) ? current.filter(c => c !== ch) : [...current, ch]
    updateSelected({ channels: next })
  }

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function addBranch() {
    if (!newName.trim()) return
    const nb: Branch = {
      id: Date.now().toString(),
      name: newName.trim(),
      city: 'Nueva ciudad',
      specialty: 'General',
      tone: 'profesional',
      customGreeting: `Bienvenido a ${newName.trim()}. ¿En qué le puedo ayudar?`,
      channels: ['whatsapp'],
      active: false,
    }
    setBranches(prev => [...prev, nb])
    setSelectedId(nb.id)
    setNewName('')
    setAddingNew(false)
  }

  const selectedTone = TONE_PRESETS.find(t => t.id === selected.tone)!

  return (
    <div style={{ padding: '24px 28px', minHeight: '100vh', background: 'var(--bg)' }}>

      {/* Header */}
      <div style={{ marginBottom: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <Building2 size={20} color={NAVY} />
          <h1 style={{ color: TEXT, fontSize: 20, fontWeight: 700, margin: 0 }}>
            Sucursales & Tono de Marca
          </h1>
          <span style={{
            fontSize: 10, fontWeight: 800, padding: '3px 9px', borderRadius: 99,
            background: '#F59E0B14', color: '#D97706', marginLeft: 4,
          }}>
            BUSINESS
          </span>
        </div>
        <p style={{ color: MUTED, fontSize: 13, margin: 0 }}>
          Configura cómo habla la IA en cada sucursal. Cada ubicación puede tener un tono, canales y saludo distintos.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20 }}>

        {/* ── Left: branch list ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <p style={{ color: MUTED, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
              Sucursales ({branches.length})
            </p>
            <button
              onClick={() => setAddingNew(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                fontSize: 11, fontWeight: 700, color: NAVY,
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              }}
            >
              <Plus size={13} />
              Agregar
            </button>
          </div>

          {branches.map(b => (
            <BranchCard
              key={b.id}
              branch={b}
              selected={selectedId === b.id}
              onClick={() => setSelectedId(b.id)}
            />
          ))}

          {addingNew && (
            <div style={{
              padding: '12px', borderRadius: 12,
              border: `1.5px solid ${NAVY}`, background: `${NAVY}04`,
            }}>
              <input
                autoFocus
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addBranch()}
                placeholder="Nombre de la sucursal"
                style={{
                  width: '100%', padding: '8px 10px', borderRadius: 8,
                  border: `1px solid ${BORD}`, fontSize: 13, marginBottom: 8,
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  onClick={addBranch}
                  style={{
                    flex: 1, padding: '7px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                    background: NAVY, color: WHITE, border: 'none', cursor: 'pointer',
                  }}
                >
                  Crear
                </button>
                <button
                  onClick={() => { setAddingNew(false); setNewName('') }}
                  style={{
                    padding: '7px 10px', borderRadius: 8, fontSize: 12,
                    background: 'transparent', border: `1px solid ${BORD}`, cursor: 'pointer', color: MUTED,
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Right: config panel ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Branch name + status */}
          <div style={{
            background: SURF, border: `1px solid ${BORD}`, borderRadius: 16,
            padding: '20px 22px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 11, background: NAVY,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Building2 size={18} color={WHITE} />
                </div>
                <div>
                  <p style={{ color: TEXT, fontSize: 16, fontWeight: 700, margin: 0 }}>{selected.name}</p>
                  <p style={{ color: MUTED, fontSize: 12, margin: 0 }}>{selected.city} · {selected.specialty}</p>
                </div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <span style={{ fontSize: 12, color: MUTED }}>IA Activa</span>
                <div
                  onClick={() => updateSelected({ active: !selected.active })}
                  style={{
                    width: 40, height: 22, borderRadius: 99,
                    background: selected.active ? NAVY : '#D1D5DB',
                    position: 'relative', cursor: 'pointer', transition: 'background 0.2s',
                  }}
                >
                  <div style={{
                    position: 'absolute', top: 3, left: selected.active ? 20 : 3,
                    width: 16, height: 16, borderRadius: '50%', background: WHITE,
                    transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  }} />
                </div>
              </label>
            </div>

            {/* Channels */}
            <p style={{ color: MUTED, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 10px' }}>
              Canales activos
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {CHANNELS.map(ch => {
                const on = selected.channels.includes(ch.id)
                return (
                  <button
                    key={ch.id}
                    onClick={() => toggleChannel(ch.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '8px 14px', borderRadius: 10, fontSize: 12, fontWeight: 600,
                      border: `1.5px solid ${on ? NAVY : BORD}`,
                      background: on ? `${NAVY}0A` : 'transparent',
                      color: on ? NAVY : MUTED, cursor: 'pointer', transition: 'all 0.15s',
                    }}
                  >
                    <ch.Icon size={13} />
                    {ch.label}
                    {on && <Check size={11} />}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Brand tone */}
          <div style={{
            background: SURF, border: `1px solid ${BORD}`, borderRadius: 16,
            padding: '20px 22px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Mic size={15} color={NAVY} />
              <p style={{ color: TEXT, fontSize: 14, fontWeight: 700, margin: 0 }}>
                Tono de Comunicación IA
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
              {TONE_PRESETS.map(tone => {
                const sel = selected.tone === tone.id
                return (
                  <button
                    key={tone.id}
                    onClick={() => updateSelected({ tone: tone.id })}
                    style={{
                      textAlign: 'left', padding: '14px 16px', borderRadius: 12,
                      border: `1.5px solid ${sel ? NAVY : BORD}`,
                      background: sel ? `${NAVY}08` : 'transparent',
                      cursor: 'pointer', transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      {sel && (
                        <div style={{
                          width: 16, height: 16, borderRadius: '50%', background: NAVY,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                          <Check size={10} color={WHITE} />
                        </div>
                      )}
                      <span style={{ color: TEXT, fontSize: 13, fontWeight: 700 }}>{tone.label}</span>
                    </div>
                    <p style={{ color: MUTED, fontSize: 11, margin: 0, lineHeight: 1.5 }}>{tone.desc}</p>
                  </button>
                )
              })}
            </div>

            {/* Sample message */}
            <div style={{
              background: SURF2, borderRadius: 12, padding: '14px 16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <Sparkles size={12} color={NAVY} />
                <span style={{ color: MUTED, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Vista previa del saludo
                </span>
              </div>
              <p style={{ color: TEXT, fontSize: 13, margin: 0, lineHeight: 1.6, fontStyle: 'italic' }}>
                &quot;{selectedTone.sample}&quot;
              </p>
            </div>
          </div>

          {/* Custom greeting */}
          <div style={{
            background: SURF, border: `1px solid ${BORD}`, borderRadius: 16,
            padding: '20px 22px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Edit3 size={15} color={NAVY} />
              <p style={{ color: TEXT, fontSize: 14, fontWeight: 700, margin: 0 }}>
                Saludo personalizado de esta sucursal
              </p>
            </div>
            <textarea
              value={selected.customGreeting}
              onChange={e => updateSelected({ customGreeting: e.target.value })}
              rows={3}
              style={{
                width: '100%', padding: '12px 14px', borderRadius: 10,
                border: `1.5px solid ${BORD}`, fontSize: 13, color: TEXT,
                resize: 'none', outline: 'none', fontFamily: 'inherit',
                background: 'var(--bg)', boxSizing: 'border-box', lineHeight: 1.6,
              }}
              onFocus={e => (e.currentTarget.style.borderColor = NAVY)}
              onBlur={e => (e.currentTarget.style.borderColor = BORD)}
            />
            <p style={{ color: MUTED, fontSize: 11, margin: '6px 0 0' }}>
              Este texto reemplaza al saludo por defecto del tono seleccionado, solo para esta sucursal.
            </p>
          </div>

          {/* Save button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button
              onClick={handleSave}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '11px 22px', borderRadius: 11, fontSize: 14, fontWeight: 700,
                background: saved ? '#1A2A5618' : NAVY,
                color: saved ? NAVY : WHITE,
                border: `1.5px solid ${NAVY}`,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              {saved ? <Check size={15} /> : <Save size={15} />}
              {saved ? 'Guardado' : 'Guardar cambios'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
