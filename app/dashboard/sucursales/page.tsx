'use client'

import { useState, useEffect } from 'react'
import {
  Building2, MapPin, Phone, MessageCircle, Plus, Edit2,
  Trash2, Check, X, Loader2, Users, Zap, ArrowUpRight,
  CheckCircle, AlertCircle,
} from 'lucide-react'
import Link from 'next/link'

const SURF  = 'var(--surface)'
const BORD  = 'var(--border)'
const TEXT  = 'var(--text-primary)'
const MUTED = 'var(--text-secondary)'
const NAVY  = '#13244A'
const GREEN = '#22C55E'
const AMBER = '#F59E0B'
const BLUE  = '#3B82F6'
const PURPLE= '#A78BFA'

// ── Types ─────────────────────────────────────────────────────────────────────

interface Branch {
  id: string; name: string; address: string | null; phone: string | null
  whatsappPhone: string | null; managerName: string | null; active: boolean
  createdAt: string
}

// ── Plan gate ─────────────────────────────────────────────────────────────────

function PlanGate() {
  return (
    <div style={{
      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '60px 28px',
    }}>
      <div style={{
        maxWidth: 480, textAlign: 'center', display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 20,
      }}>
        <div style={{ width: 64, height: 64, borderRadius: 18, background: `${AMBER}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Building2 size={28} color={AMBER} />
        </div>
        <div>
          <p style={{ fontSize: 18, fontWeight: 700, color: TEXT, margin: '0 0 8px' }}>
            Gestión multi-sucursal
          </p>
          <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.6, margin: 0 }}>
            Administra todas tus clínicas desde un solo dashboard. Cada sucursal tiene su propio número de WhatsApp, horarios, encargado y métricas independientes.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, width: '100%', textAlign: 'left' }}>
          {[
            { title:'N sucursales', desc:'Sin límite de ubicaciones' },
            { title:'BI cross-sucursal', desc:'Métricas comparativas' },
            { title:'IA por sucursal', desc:'Agente y tono independientes' },
            { title:'Encargado por sede', desc:'Control de acceso por rol' },
          ].map(f => (
            <div key={f.title} style={{ padding: '12px 14px', borderRadius: 10, background: SURF, border: `1px solid ${BORD}` }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: TEXT, margin: 0 }}>{f.title}</p>
              <p style={{ fontSize: 11, color: MUTED, margin: '2px 0 0' }}>{f.desc}</p>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 99, background: `${AMBER}18`, color: AMBER }}>
            Plan Business
          </span>
          <Link href="/precios"
            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 22px', borderRadius: 12, background: NAVY, color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
            <Zap size={14} />
            Actualizar a Business
          </Link>
          <p style={{ fontSize: 11, color: MUTED, margin: 0 }}>14 días de prueba · Cancela cuando quieras</p>
        </div>
      </div>
    </div>
  )
}

// ── Form modal ────────────────────────────────────────────────────────────────

interface BranchFormProps {
  initial?: Partial<Branch>
  onSave: (data: Partial<Branch>) => Promise<void>
  onClose: () => void
  saving: boolean
}

function BranchForm({ initial, onSave, onClose, saving }: BranchFormProps) {
  const [name, setName]           = useState(initial?.name ?? '')
  const [address, setAddress]     = useState(initial?.address ?? '')
  const [phone, setPhone]         = useState(initial?.phone ?? '')
  const [wp, setWp]               = useState(initial?.whatsappPhone ?? '')
  const [manager, setManager]     = useState(initial?.managerName ?? '')

  const isEdit = !!initial?.id

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
    }} onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: SURF, borderRadius: 18, padding: '24px', width: 440, display: 'flex', flexDirection: 'column', gap: 16, boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: TEXT, margin: 0 }}>
            {isEdit ? 'Editar sucursal' : 'Nueva sucursal'}
          </p>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: MUTED, padding: 4 }}>
            <X size={18} />
          </button>
        </div>

        {[
          { label: 'Nombre *', value: name, set: setName, placeholder: 'Ej. Sucursal Centro', required: true },
          { label: 'Dirección', value: address, set: setAddress, placeholder: 'Av. Insurgentes 123, Col. Roma' },
          { label: 'Teléfono', value: phone, set: setPhone, placeholder: '+52 55 1234 5678' },
          { label: 'WhatsApp Business', value: wp, set: setWp, placeholder: '+52 55 1234 5678' },
          { label: 'Encargado', value: manager, set: setManager, placeholder: 'Dr. Juan García' },
        ].map(f => (
          <div key={f.label}>
            <label style={{ fontSize: 11, fontWeight: 600, color: MUTED, display: 'block', marginBottom: 5 }}>{f.label}</label>
            <input
              value={f.value}
              onChange={e => f.set(e.target.value)}
              placeholder={f.placeholder}
              style={{ width: '100%', padding: '9px 12px', borderRadius: 10, border: `1px solid ${BORD}`, background: 'var(--bg)', color: TEXT, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
        ))}

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
          <button onClick={onClose} style={{ padding: '9px 18px', borderRadius: 10, border: `1px solid ${BORD}`, background: SURF, color: MUTED, fontSize: 13, cursor: 'pointer' }}>
            Cancelar
          </button>
          <button
            onClick={() => onSave({ name, address, phone, whatsappPhone: wp, managerName: manager })}
            disabled={!name.trim() || saving}
            style={{ padding: '9px 18px', borderRadius: 10, background: NAVY, color: '#fff', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', opacity: !name.trim() || saving ? 0.6 : 1, display: 'flex', alignItems: 'center', gap: 6 }}>
            {saving ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Check size={13} />}
            {saving ? 'Guardando…' : isEdit ? 'Actualizar' : 'Crear sucursal'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Branch card ───────────────────────────────────────────────────────────────

function BranchCard({ branch, onEdit, onDelete, onToggle }: {
  branch: Branch
  onEdit: () => void
  onDelete: () => void
  onToggle: () => void
}) {
  const color = branch.active ? GREEN : AMBER

  return (
    <div style={{ background: SURF, border: `1px solid ${BORD}`, borderRadius: 16, padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <div style={{ width: 40, height: 40, borderRadius: 11, background: `${NAVY}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Building2 size={18} color={NAVY} />
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: TEXT, margin: 0 }}>{branch.name}</p>
            {branch.managerName && (
              <p style={{ fontSize: 11, color: MUTED, margin: '2px 0 0', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Users size={10} /> {branch.managerName}
              </p>
            )}
          </div>
        </div>
        <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 99, background: `${color}18`, color, flexShrink: 0 }}>
          {branch.active ? 'Activa' : 'Inactiva'}
        </span>
      </div>

      {/* Details */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {branch.address && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 7 }}>
            <MapPin size={12} color={MUTED} style={{ marginTop: 1, flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: MUTED, lineHeight: 1.4 }}>{branch.address}</span>
          </div>
        )}
        {branch.phone && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <Phone size={12} color={MUTED} />
            <span style={{ fontSize: 12, color: MUTED }}>{branch.phone}</span>
          </div>
        )}
        {branch.whatsappPhone && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <MessageCircle size={12} color="#22C55E" />
            <span style={{ fontSize: 12, color: MUTED }}>{branch.whatsappPhone}</span>
            <span style={{ fontSize: 10, color: GREEN, fontWeight: 600, background: '#F0FDF4', padding: '1px 6px', borderRadius: 99 }}>WA activo</span>
          </div>
        )}
        {!branch.address && !branch.phone && !branch.whatsappPhone && (
          <p style={{ fontSize: 11, color: MUTED, fontStyle: 'italic', margin: 0 }}>Sin datos de contacto</p>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 7, borderTop: `1px solid ${BORD}`, paddingTop: 12, marginTop: 2 }}>
        <button onClick={onEdit}
          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '7px', borderRadius: 8, border: `1px solid ${BORD}`, background: 'var(--bg)', color: TEXT, fontSize: 11, fontWeight: 500, cursor: 'pointer' }}>
          <Edit2 size={12} /> Editar
        </button>
        <button onClick={onToggle}
          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '7px', borderRadius: 8, border: `1px solid ${BORD}`, background: 'var(--bg)', color: branch.active ? AMBER : GREEN, fontSize: 11, fontWeight: 500, cursor: 'pointer' }}>
          {branch.active ? <AlertCircle size={12} /> : <CheckCircle size={12} />}
          {branch.active ? 'Desactivar' : 'Activar'}
        </button>
        <button onClick={onDelete}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '7px 10px', borderRadius: 8, border: '1px solid #FECACA', background: '#FEF2F2', color: '#EF4444', cursor: 'pointer' }}>
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function SucursalesPage() {
  const [branches, setBranches] = useState<Branch[]>([])
  const [plan, setPlan]         = useState<string | null>(null)
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing]   = useState<Branch | null>(null)
  const [error, setError]       = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/branches')
      .then(r => r.json())
      .then(({ branches: b, plan: p }: { branches: Branch[]; plan: string }) => {
        setBranches(b)
        setPlan(p)
      })
      .catch(() => null)
      .finally(() => setLoading(false))
  }, [])

  async function handleSave(data: Partial<Branch>) {
    setSaving(true)
    setError(null)
    try {
      if (editing) {
        const res  = await fetch(`/api/branches/${editing.id}`, {
          method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
        })
        const json = await res.json()
        if (!res.ok) throw new Error(json.error)
        setBranches(prev => prev.map(b => b.id === editing.id ? json.branch : b))
      } else {
        const res  = await fetch('/api/branches', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
        })
        const json = await res.json()
        if (!res.ok) throw new Error(json.error)
        setBranches(prev => [...prev, json.branch])
      }
      setShowForm(false)
      setEditing(null)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(branch: Branch) {
    if (!confirm(`¿Eliminar la sucursal "${branch.name}"? Esta acción no se puede deshacer.`)) return
    await fetch(`/api/branches/${branch.id}`, { method: 'DELETE' })
    setBranches(prev => prev.filter(b => b.id !== branch.id))
  }

  async function handleToggle(branch: Branch) {
    const res  = await fetch(`/api/branches/${branch.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !branch.active }),
    })
    const json = await res.json()
    if (res.ok) setBranches(prev => prev.map(b => b.id === branch.id ? json.branch : b))
  }

  const activeBranches = branches.filter(b => b.active).length

  if (loading) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={24} color={MUTED} style={{ animation: 'spin 1s linear infinite' }} />
      </div>
    )
  }

  if (plan !== 'business') return <PlanGate />

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100%', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h1 style={{ color: TEXT, fontSize: 18, fontWeight: 700, margin: 0 }}>Sucursales</h1>
          <p style={{ color: MUTED, fontSize: 12, margin: '3px 0 0' }}>
            {branches.length === 0 ? 'Sin sucursales configuradas' : `${branches.length} sucursal${branches.length > 1 ? 'es' : ''} · ${activeBranches} activa${activeBranches !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true) }}
          style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 11, background: NAVY, color: '#fff', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
          <Plus size={15} /> Nueva sucursal
        </button>
      </div>

      {/* Summary KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {[
          { Icon: Building2,  color: NAVY,   label: 'Total sucursales', value: String(branches.length) },
          { Icon: CheckCircle,color: GREEN,  label: 'Activas',          value: String(activeBranches) },
          { Icon: MessageCircle, color: '#22C55E', label: 'Con WhatsApp', value: String(branches.filter(b => b.whatsappPhone).length) },
        ].map(k => (
          <div key={k.label} style={{ background: SURF, border: `1px solid ${BORD}`, borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: `${k.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <k.Icon size={17} color={k.color} />
            </div>
            <div>
              <p style={{ fontSize: 22, fontWeight: 800, color: k.color, margin: 0 }}>{k.value}</p>
              <p style={{ fontSize: 11, color: MUTED, margin: '1px 0 0' }}>{k.label}</p>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div style={{ padding: '10px 16px', borderRadius: 10, background: '#FEF2F2', border: '1px solid #FECACA', fontSize: 13, color: '#EF4444' }}>
          {error}
        </div>
      )}

      {/* Branch grid */}
      {branches.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: 48 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: `${NAVY}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Building2 size={24} color={NAVY} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: TEXT, margin: '0 0 6px' }}>Agrega tu primera sucursal</p>
            <p style={{ fontSize: 13, color: MUTED, margin: 0, maxWidth: 320 }}>
              Cada sucursal tiene su propio número de WhatsApp, horarios y encargado. Welko IA responde de forma independiente en cada ubicación.
            </p>
          </div>
          <button
            onClick={() => { setEditing(null); setShowForm(true) }}
            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 22px', borderRadius: 11, background: NAVY, color: '#fff', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
            <Plus size={15} /> Agregar sucursal
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {branches.map(branch => (
            <BranchCard
              key={branch.id}
              branch={branch}
              onEdit={() => { setEditing(branch); setShowForm(true) }}
              onDelete={() => handleDelete(branch)}
              onToggle={() => handleToggle(branch)}
            />
          ))}

          {/* Add card */}
          <button
            onClick={() => { setEditing(null); setShowForm(true) }}
            style={{
              background: 'transparent', border: `2px dashed ${BORD}`, borderRadius: 16,
              padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', gap: 10, cursor: 'pointer', minHeight: 160,
              color: MUTED, transition: 'border-color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = NAVY}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = BORD}
          >
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `${NAVY}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Plus size={18} color={NAVY} />
            </div>
            <p style={{ fontSize: 13, fontWeight: 600, color: NAVY, margin: 0 }}>Agregar sucursal</p>
          </button>
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <BranchForm
          initial={editing ?? undefined}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditing(null); setError(null) }}
          saving={saving}
        />
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
