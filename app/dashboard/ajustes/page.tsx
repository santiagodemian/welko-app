'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { Check, Palette, CreditCard, ExternalLink, Zap, ArrowUpRight, Loader2 } from 'lucide-react'
import { applyBrandColor } from '@/components/dashboard/BrandColorApplier'
import Link from 'next/link'

const PRESETS = [
  { name: 'Welko Navy',    hex: '#13244A' },
  { name: 'Azul',          hex: '#1D4ED8' },
  { name: 'Cielo',         hex: '#0284C7' },
  { name: 'Teal',          hex: '#0F766E' },
  { name: 'Verde',         hex: '#15803D' },
  { name: 'Morado',        hex: '#7C3AED' },
  { name: 'Rosa',          hex: '#BE185D' },
  { name: 'Rojo',          hex: '#DC2626' },
  { name: 'Naranja',       hex: '#C2410C' },
  { name: 'Ámbar',         hex: '#B45309' },
  { name: 'Grafito',       hex: '#374151' },
  { name: 'Negro',         hex: '#0A0F1A' },
]

type PlanId = 'starter' | 'essential' | 'pro' | 'business'

const PLAN_LABEL: Record<PlanId, string> = {
  starter:   'Starter',
  essential: 'Essential',
  pro:       'Pro',
  business:  'Business',
}
const PLAN_COLOR: Record<PlanId, string> = {
  starter:   '#60A5FA',
  essential: '#22C55E',
  pro:       '#A78BFA',
  business:  '#F59E0B',
}
const PLAN_FEATURES: Record<PlanId, string[]> = {
  starter:   ['1 canal (WhatsApp)', 'Hasta 100 conversaciones/mes', 'Soporte por email'],
  essential: ['3 canales', 'Conversaciones ilimitadas', 'Cron de recordatorios', 'Soporte prioritario'],
  pro:       ['Todos los canales', 'IA personalizada por clínica', 'Integraciones EHR', 'Account manager'],
  business:  ['Multi-sucursal', 'BI avanzado', 'SLA garantizado', 'Onboarding dedicado'],
}

function PlanSection() {
  const { user, isLoaded } = useUser()
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  const plan = (user?.publicMetadata?.plan as PlanId | undefined) ?? null

  async function openPortal() {
    setLoading(true)
    setError(null)
    try {
      const res  = await fetch('/api/billing/portal', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Error abriendo portal')
      window.location.href = data.url
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error desconocido')
      setLoading(false)
    }
  }

  if (!isLoaded) return null

  return (
    <div className="rounded-2xl p-6 flex flex-col gap-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'var(--accent-subtle)', color: 'var(--accent)' }}>
          <CreditCard size={18} />
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Plan y facturación</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Gestiona tu suscripción, facturas y método de pago</p>
        </div>
      </div>

      {plan ? (
        <>
          {/* Current plan badge */}
          <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${PLAN_COLOR[plan]}18` }}>
              <Zap size={18} color={PLAN_COLOR[plan]} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                  Welko {PLAN_LABEL[plan]}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: `${PLAN_COLOR[plan]}18`, color: PLAN_COLOR[plan] }}>
                  Activo
                </span>
              </div>
              <ul className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
                {PLAN_FEATURES[plan].map(f => (
                  <li key={f} className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <Check size={10} color="#22C55E" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={openPortal}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{ background: 'var(--accent)', color: '#fff', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <ExternalLink size={14} />}
              {loading ? 'Abriendo portal…' : 'Gestionar suscripción'}
            </button>

            {plan !== 'business' && (
              <Link href="/precios"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                <ArrowUpRight size={14} />
                Cambiar plan
              </Link>
            )}
          </div>

          {error && (
            <p className="text-xs px-3 py-2 rounded-lg" style={{ background: '#FEF2F2', color: '#EF4444' }}>
              {error}
            </p>
          )}

          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Desde el portal puedes cancelar, ver facturas, cambiar tu método de pago o actualizar datos de facturación.
          </p>
        </>
      ) : (
        /* No active plan */
        <div className="flex flex-col gap-3">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            No tienes un plan activo. Activa Welko para comenzar a convertir leads en pacientes.
          </p>
          <Link href="/precios"
            className="self-start flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: 'var(--accent)', color: '#fff' }}>
            <Zap size={14} />
            Ver planes
          </Link>
        </div>
      )}
    </div>
  )
}

export default function AjustesPage() {
  const [color, setColor] = useState('#13244A')
  const [custom, setCustom] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('welko_brand_color') ?? '#13244A'
    setColor(stored)
    setCustom(stored)
  }, [])

  function pickColor(hex: string) {
    setColor(hex)
    setCustom(hex)
    setSaved(false)
  }

  function handleCustom(val: string) {
    setCustom(val)
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      setColor(val)
      setSaved(false)
    }
  }

  function save() {
    localStorage.setItem('welko_brand_color', color)
    window.dispatchEvent(new CustomEvent('welko-brand-color', { detail: { color } }))
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="p-6 sm:p-8 max-w-2xl mx-auto flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Ajustes
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Plan, facturación y personalización de tu CRM.
        </p>
      </div>

      {/* Plan & Billing */}
      <PlanSection />

      {/* Brand color section */}
      <div className="rounded-2xl p-6 flex flex-col gap-6" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--accent-subtle)', color: 'var(--accent)' }}>
            <Palette size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Color de marca</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Se aplica a botones, badges y elementos activos del CRM</p>
          </div>
        </div>

        {/* Preset palette */}
        <div className="flex flex-wrap gap-2.5">
          {PRESETS.map((p) => (
            <button
              key={p.hex}
              onClick={() => pickColor(p.hex)}
              title={p.name}
              className="relative w-9 h-9 rounded-xl transition-transform duration-150 hover:scale-110 focus:outline-none"
              style={{ background: p.hex, boxShadow: color === p.hex ? `0 0 0 3px var(--bg), 0 0 0 5px ${p.hex}` : 'none' }}
            >
              {color === p.hex && (
                <Check size={14} strokeWidth={3} className="absolute inset-0 m-auto text-white" />
              )}
            </button>
          ))}
        </div>

        {/* Custom hex input */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex-shrink-0 border" style={{ background: color, borderColor: 'var(--border)' }} />
          <div className="flex flex-col gap-0.5 flex-1">
            <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              Código hex personalizado
            </label>
            <input
              type="text"
              value={custom}
              onChange={(e) => handleCustom(e.target.value)}
              placeholder="#000000"
              maxLength={7}
              className="w-full text-sm px-3 py-2 rounded-xl outline-none font-mono"
              style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
              }}
            />
          </div>
          <div className="flex flex-col gap-0.5">
            <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Selector</label>
            <input
              type="color"
              value={color}
              onChange={(e) => pickColor(e.target.value)}
              className="w-10 h-10 rounded-xl cursor-pointer"
              style={{ border: '1px solid var(--border)', background: 'transparent', padding: 2 }}
            />
          </div>
        </div>

        {/* Preview */}
        <div className="rounded-xl p-4 flex flex-col gap-3" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Vista previa</p>
          <div className="flex flex-wrap gap-2 items-center">
            <button
              className="px-4 py-2 rounded-xl text-sm font-semibold"
              style={{ background: color, color: '#fff' }}
            >
              Agendar cita
            </button>
            <span
              className="px-2.5 py-1 rounded-full text-xs font-bold"
              style={{ background: color + '18', color: color }}
            >
              Pro
            </span>
            <span className="text-sm font-semibold" style={{ color: color }}>
              Ver conversaciones →
            </span>
          </div>
        </div>

        {/* Save */}
        <button
          onClick={save}
          className="self-start flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
          style={{ background: color, color: '#fff' }}
        >
          {saved ? <><Check size={15} /> Guardado</> : 'Guardar color'}
        </button>
      </div>
    </div>
  )
}
