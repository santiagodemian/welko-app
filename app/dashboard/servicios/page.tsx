'use client'

import { useState, useEffect, useRef } from 'react'
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, X, Check, Loader2, Package } from 'lucide-react'

const TEXT  = 'var(--text-primary)'
const MUTED = 'var(--text-secondary)'
const SURF  = 'var(--surface)'
const BORD  = 'var(--border)'
const ACCENT = 'var(--accent)'

interface Service {
  id:           string
  name:         string
  description:  string | null
  priceMin:     number | null
  priceMax:     number | null
  durationMins: number | null
  active:       boolean
}

const EMPTY: Omit<Service, 'id' | 'active'> = {
  name: '', description: null, priceMin: null, priceMax: null, durationMins: null,
}

function priceLabel(s: Service) {
  if (!s.priceMin) return '—'
  if (s.priceMax && s.priceMax !== s.priceMin)
    return `$${s.priceMin.toLocaleString()} – $${s.priceMax.toLocaleString()}`
  return `$${s.priceMin.toLocaleString()}`
}

/* ── Modal de crear / editar ── */
function ServiceModal({
  initial,
  onClose,
  onSave,
  saving,
}: {
  initial: Partial<Service> | null
  onClose: () => void
  onSave: (data: Partial<Service>) => Promise<void>
  saving: boolean
}) {
  const isEdit = !!initial?.id
  const [form, setForm] = useState({
    name:         initial?.name         ?? '',
    description:  initial?.description  ?? '',
    priceMin:     initial?.priceMin     != null ? String(initial.priceMin)     : '',
    priceMax:     initial?.priceMax     != null ? String(initial.priceMax)     : '',
    durationMins: initial?.durationMins != null ? String(initial.durationMins) : '',
  })
  const [error, setError] = useState<string | null>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  useEffect(() => { nameRef.current?.focus() }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const min = form.priceMin ? parseFloat(form.priceMin) : null
    const max = form.priceMax ? parseFloat(form.priceMax) : null
    if (min != null && max != null && min > max) {
      setError('El precio mínimo no puede ser mayor al máximo.')
      return
    }
    await onSave({
      name:         form.name.trim(),
      description:  form.description.trim() || null,
      priceMin:     min,
      priceMax:     max,
      durationMins: form.durationMins ? parseInt(form.durationMins, 10) : null,
    })
  }

  const field = (label: string, key: keyof typeof form, type = 'text', placeholder = '') => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: MUTED }}>{label}</label>
      <input
        ref={key === 'name' ? nameRef : undefined}
        type={type}
        value={form[key]}
        placeholder={placeholder}
        onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
        style={{
          padding: '9px 12px', borderRadius: 10, border: `1px solid ${BORD}`,
          background: SURF, color: TEXT, fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box',
        }}
      />
    </div>
  )

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 16 }}>
      <div style={{ background: SURF, borderRadius: 16, padding: 28, width: '100%', maxWidth: 460, position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: MUTED }}>
          <X size={18} />
        </button>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: TEXT, margin: '0 0 20px' }}>
          {isEdit ? 'Editar servicio' : 'Nuevo servicio'}
        </h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {field('Nombre *', 'name', 'text', 'Ej. Consulta general')}
          {field('Descripción', 'description', 'text', 'Breve descripción opcional')}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            {field('Precio mín. (MXN)', 'priceMin', 'number', '0')}
            {field('Precio máx. (MXN)', 'priceMax', 'number', '0')}
            {field('Duración (min)', 'durationMins', 'number', '30')}
          </div>
          {error && <p style={{ fontSize: 12, color: '#EF4444', margin: 0 }}>{error}</p>}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
            <button type="button" onClick={onClose}
              style={{ padding: '9px 18px', borderRadius: 10, border: `1px solid ${BORD}`, background: 'none', cursor: 'pointer', fontSize: 13, color: MUTED }}>
              Cancelar
            </button>
            <button type="submit" disabled={saving || !form.name.trim()}
              style={{ padding: '9px 18px', borderRadius: 10, background: ACCENT, color: '#fff', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 7, opacity: saving ? 0.7 : 1 }}>
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              {isEdit ? 'Guardar cambios' : 'Crear servicio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ── Página principal ── */
export default function ServiciosPage() {
  const [services, setServices]   = useState<Service[]>([])
  const [loading, setLoading]     = useState(true)
  const [modal, setModal]         = useState<Partial<Service> | null | false>(false)
  const [saving, setSaving]       = useState(false)
  const [deleting, setDeleting]   = useState<string | null>(null)
  const [toggling, setToggling]   = useState<string | null>(null)
  const [toast, setToast]         = useState<string | null>(null)

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 2800)
  }

  useEffect(() => {
    fetch('/api/services')
      .then((r) => r.json())
      .then((d) => setServices(d.services ?? []))
      .finally(() => setLoading(false))
  }, [])

  async function handleSave(data: Partial<Service>) {
    setSaving(true)
    try {
      const isEdit = !!(modal as Partial<Service>)?.id
      const url    = isEdit ? `/api/services/${(modal as Service).id}` : '/api/services'
      const method = isEdit ? 'PATCH' : 'POST'
      const res    = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      const json   = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Error guardando')
      if (isEdit) {
        setServices((p) => p.map((s) => (s.id === json.service.id ? json.service : s)))
      } else {
        setServices((p) => [...p, json.service])
      }
      setModal(false)
      showToast(isEdit ? 'Servicio actualizado' : 'Servicio creado')
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error desconocido'
      alert(msg)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este servicio?')) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/services/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Error eliminando')
      setServices((p) => p.filter((s) => s.id !== id))
      showToast('Servicio eliminado')
    } finally {
      setDeleting(null)
    }
  }

  async function handleToggle(service: Service) {
    setToggling(service.id)
    try {
      const res  = await fetch(`/api/services/${service.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !service.active }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      setServices((p) => p.map((s) => (s.id === service.id ? json.service : s)))
    } finally {
      setToggling(null)
    }
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ padding: '24px 28px', borderBottom: `1px solid ${BORD}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Package size={17} color={ACCENT} />
          </div>
          <div>
            <h1 style={{ color: TEXT, fontSize: 18, fontWeight: 700, margin: 0 }}>Servicios</h1>
            <p style={{ color: MUTED, fontSize: 12, margin: '2px 0 0' }}>
              Administra el catálogo que usa tu agente IA para responder sobre precios y tiempos
            </p>
          </div>
        </div>
        <button
          onClick={() => setModal({ ...EMPTY })}
          style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 10, background: ACCENT, color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, flexShrink: 0 }}>
          <Plus size={15} />
          Nuevo servicio
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: '24px 28px', flex: 1 }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
            <Loader2 size={22} style={{ color: MUTED, animation: 'spin 1s linear infinite' }} />
          </div>
        ) : services.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, minHeight: 260, textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={24} color={ACCENT} />
            </div>
            <p style={{ fontSize: 15, fontWeight: 600, color: TEXT, margin: 0 }}>Sin servicios aún</p>
            <p style={{ fontSize: 13, color: MUTED, margin: 0, maxWidth: 340 }}>
              Agrega los servicios que ofrece tu clínica y tu agente IA los usará para cotizar y agendar.
            </p>
            <button
              onClick={() => setModal({ ...EMPTY })}
              style={{ marginTop: 4, padding: '9px 20px', borderRadius: 10, background: ACCENT, color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
              Agregar primer servicio
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
            {services.map((s) => (
              <div key={s.id} style={{ padding: '16px 18px', borderRadius: 12, background: SURF, border: `1px solid ${BORD}`, display: 'flex', flexDirection: 'column', gap: 10, opacity: s.active ? 1 : 0.55 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: TEXT, margin: 0, wordBreak: 'break-word' }}>{s.name}</p>
                    {s.description && (
                      <p style={{ fontSize: 12, color: MUTED, margin: '3px 0 0', lineHeight: 1.5 }}>{s.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleToggle(s)}
                    disabled={!!toggling}
                    title={s.active ? 'Desactivar' : 'Activar'}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: s.active ? ACCENT : MUTED, flexShrink: 0 }}>
                    {toggling === s.id
                      ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                      : s.active ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                  </button>
                </div>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {(s.priceMin || s.priceMax) && (
                    <span style={{ fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 99, background: 'var(--accent-subtle)', color: ACCENT }}>
                      {priceLabel(s)} MXN
                    </span>
                  )}
                  {s.durationMins && (
                    <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 99, background: 'var(--bg)', border: `1px solid ${BORD}`, color: MUTED }}>
                      {s.durationMins} min
                    </span>
                  )}
                  {!s.active && (
                    <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 99, background: '#FEF3C7', color: '#92400E' }}>
                      Inactivo
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
                  <button
                    onClick={() => setModal(s)}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '7px', borderRadius: 8, border: `1px solid ${BORD}`, background: 'none', cursor: 'pointer', fontSize: 12, color: MUTED }}>
                    <Pencil size={13} /> Editar
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    disabled={deleting === s.id}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '7px 12px', borderRadius: 8, border: '1px solid #FECACA', background: 'none', cursor: 'pointer', fontSize: 12, color: '#EF4444' }}>
                    {deleting === s.id ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={13} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {modal !== false && (
        <ServiceModal
          initial={modal}
          onClose={() => setModal(false)}
          onSave={handleSave}
          saving={saving}
        />
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: '#1A1A2E', color: '#fff', padding: '10px 18px', borderRadius: 10, fontSize: 13, fontWeight: 600, zIndex: 200 }}>
          {toast}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
