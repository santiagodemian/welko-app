'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Building2, Plus, Search, MapPin, Bed, Bath, Car, SquareIcon,
  DollarSign, Filter, Eye, Edit2, Trash2, X, ChevronDown,
  Navigation, Shield, School, Star, CheckCircle2, AlertCircle,
  Home, Loader2, Camera,
} from 'lucide-react'
import { PlanGate } from '@/components/dashboard/PlanGate'

const NAVY  = '#13244A'
const GREEN = '#16A34A'
const SURF  = 'var(--surface)'
const BORD  = 'var(--border)'
const TEXT  = 'var(--text-primary)'
const MUTED = 'var(--text-secondary)'

// ── Types ──────────────────────────────────────────────────────────────────────
type PropertyStatus = 'DISPONIBLE' | 'RESERVADA' | 'VENDIDA' | 'RENTADA' | 'PAUSADA'
type PropertyType   = 'CASA' | 'DEPARTAMENTO' | 'TERRENO' | 'OFICINA' | 'LOCAL_COMERCIAL' | 'BODEGA' | 'OTRO'
type ListingType    = 'VENTA' | 'RENTA' | 'AMBOS'

interface NeighborhoodInsights {
  schools?: { name: string; level: string; distanceKm: number; rating?: number }[]
  security?: { level: 'alto' | 'medio' | 'bajo'; notes?: string }
  transport?: { type: string; name: string; distanceKm: number }[]
  notes?: string
}

interface Property {
  id: string
  title: string
  description?: string
  type: PropertyType
  listingType: ListingType
  status: PropertyStatus
  price?: number
  rentPrice?: number
  currency: string
  address?: string
  neighborhood?: string
  city?: string
  lat?: number
  lng?: number
  areaSqm?: number
  builtSqm?: number
  bedrooms?: number
  bathrooms?: number
  parkingSpots?: number
  photos?: string[]
  amenities?: string[]
  neighborhoodInsights?: NeighborhoodInsights
  agentName?: string
  createdAt: string
}

// ── Demo data ──────────────────────────────────────────────────────────────────
const DEMO: Property[] = [
  {
    id: 'p1', title: 'Casa en Colonia Del Valle', type: 'CASA', listingType: 'VENTA', status: 'DISPONIBLE',
    price: 4_800_000, currency: 'MXN', address: 'Av. Insurgentes Sur 1234, Del Valle, CDMX',
    neighborhood: 'Del Valle', city: 'Ciudad de México', lat: 19.3738, lng: -99.1712,
    areaSqm: 280, builtSqm: 220, bedrooms: 4, bathrooms: 3, parkingSpots: 2,
    amenities: ['Jardín', 'Roof garden', 'Estudio', 'Cuarto de servicio'],
    neighborhoodInsights: {
      schools: [
        { name: 'Colegio Motolinia', level: 'Primaria / Secundaria', distanceKm: 0.4, rating: 4.5 },
        { name: 'UNAM – Ciudad Universitaria', level: 'Universidad', distanceKm: 3.2 },
      ],
      security: { level: 'alto', notes: 'Colonia con vigilancia privada y casetas de seguridad en accesos principales.' },
      transport: [{ type: 'metro', name: 'Línea 3 – Insurgentes Sur', distanceKm: 0.6 }],
    },
    agentName: 'Carlos Mendoza', createdAt: '2026-04-01T10:00:00Z',
  },
  {
    id: 'p2', title: 'Depto 2 Rec en Polanco', type: 'DEPARTAMENTO', listingType: 'RENTA', status: 'DISPONIBLE',
    rentPrice: 28_000, currency: 'MXN', address: 'Emilio Castelar 175, Polanco, CDMX',
    neighborhood: 'Polanco', city: 'Ciudad de México', lat: 19.4348, lng: -99.1942,
    areaSqm: 95, builtSqm: 95, bedrooms: 2, bathrooms: 2, parkingSpots: 1,
    amenities: ['Alberca', 'Gimnasio', 'Terraza', 'Elevador', 'Vigilancia 24h'],
    neighborhoodInsights: {
      schools: [{ name: 'Liceo Franco Mexicano', level: 'Primaria–Bachillerato', distanceKm: 1.2, rating: 4.8 }],
      security: { level: 'alto', notes: 'Una de las zonas más seguras de CDMX, con alta presencia policial.' },
    },
    agentName: 'Ana Torres', createdAt: '2026-04-03T14:00:00Z',
  },
  {
    id: 'p3', title: 'Casa Residencial Santa Fe', type: 'CASA', listingType: 'VENTA', status: 'RESERVADA',
    price: 12_500_000, currency: 'MXN', address: 'Bosques de las Lomas 450, Santa Fe, CDMX',
    neighborhood: 'Santa Fe', city: 'Ciudad de México', lat: 19.3591, lng: -99.2602,
    areaSqm: 520, builtSqm: 420, bedrooms: 5, bathrooms: 4.5, parkingSpots: 4,
    amenities: ['Alberca climatizada', 'Cine en casa', 'Jardín con asador', 'Cuarto de servicio', 'Bodega'],
    neighborhoodInsights: {
      security: { level: 'alto', notes: 'Privada cerrada con vigilancia 24/7.' },
    },
    agentName: 'Carlos Mendoza', createdAt: '2026-04-05T09:00:00Z',
  },
  {
    id: 'p4', title: 'Local Comercial Condesa', type: 'LOCAL_COMERCIAL', listingType: 'RENTA', status: 'DISPONIBLE',
    rentPrice: 45_000, currency: 'MXN', address: 'Av. Ámsterdam 80, Condesa, CDMX',
    neighborhood: 'Condesa', city: 'Ciudad de México', lat: 19.4128, lng: -99.1697,
    areaSqm: 120, builtSqm: 120,
    agentName: 'Ana Torres', createdAt: '2026-04-08T11:00:00Z',
  },
  {
    id: 'p5', title: 'Terreno en Tlalpan', type: 'TERRENO', listingType: 'VENTA', status: 'DISPONIBLE',
    price: 2_200_000, currency: 'MXN', address: 'Blvd. Adolfo López Mateos, Tlalpan, CDMX',
    neighborhood: 'Tlalpan', city: 'Ciudad de México', lat: 19.2929, lng: -99.1685,
    areaSqm: 400,
    agentName: 'Carlos Mendoza', createdAt: '2026-04-09T08:00:00Z',
  },
]

// ── Config ─────────────────────────────────────────────────────────────────────
const STATUS_CFG: Record<PropertyStatus, { label: string; bg: string; text: string }> = {
  DISPONIBLE: { label: 'Disponible', bg: 'rgba(22,163,74,0.08)',  text: '#16A34A' },
  RESERVADA:  { label: 'Reservada',  bg: 'rgba(245,158,11,0.08)', text: '#D97706' },
  VENDIDA:    { label: 'Vendida',    bg: 'rgba(107,114,128,0.08)',text: '#6B7280' },
  RENTADA:    { label: 'Rentada',    bg: 'rgba(59,130,246,0.08)', text: '#2563EB' },
  PAUSADA:    { label: 'Pausada',    bg: 'rgba(239,68,68,0.08)',  text: '#DC2626' },
}

const TYPE_LABEL: Record<PropertyType, string> = {
  CASA: 'Casa', DEPARTAMENTO: 'Depto', TERRENO: 'Terreno',
  OFICINA: 'Oficina', LOCAL_COMERCIAL: 'Local', BODEGA: 'Bodega', OTRO: 'Otro',
}

const LISTING_LABEL: Record<ListingType, string> = { VENTA: 'Venta', RENTA: 'Renta', AMBOS: 'Venta / Renta' }

const SECURITY_CFG = {
  alto:  { label: 'Seguridad Alta',   color: '#16A34A', icon: Shield },
  medio: { label: 'Seguridad Media',  color: '#D97706', icon: Shield },
  bajo:  { label: 'Seguridad Baja',   color: '#DC2626', icon: Shield },
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function fmtPrice(p: number, cur: string) {
  if (cur === 'USD') return `$${(p / 1000).toFixed(0)}K USD`
  if (p >= 1_000_000) return `$${(p / 1_000_000).toFixed(1)}M`
  return `$${p.toLocaleString('es-MX')}`
}

// ── Google Maps loader ─────────────────────────────────────────────────────────
let mapsLoaded = false
function loadGoogleMaps(): Promise<void> {
  if (mapsLoaded) return Promise.resolve()
  return new Promise((resolve, reject) => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!key) { resolve(); return }
    const s = document.createElement('script')
    s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`
    s.onload = () => { mapsLoaded = true; resolve() }
    s.onerror = reject
    document.head.appendChild(s)
  })
}

// ── Property card ──────────────────────────────────────────────────────────────
function PropertyCard({ prop, onView, onEdit, onDelete }: {
  prop: Property
  onView: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  const sc = STATUS_CFG[prop.status]
  const mainPhoto = prop.photos?.[0]

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: SURF, border: `1px solid ${BORD}` }}>
      {/* Photo */}
      <div className="relative h-44 flex items-center justify-center" style={{ background: 'var(--bg-secondary)' }}>
        {mainPhoto ? (
          <img src={mainPhoto} alt={prop.title} className="w-full h-full object-cover" />
        ) : (
          <Building2 size={40} style={{ color: 'var(--text-muted)', opacity: 0.3 }} />
        )}
        <span className="absolute top-3 left-3 text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: sc.bg, color: sc.text }}>
          {sc.label}
        </span>
        <span className="absolute top-3 right-3 text-[11px] font-semibold px-2 py-0.5 rounded-full text-white" style={{ background: 'rgba(0,0,0,0.5)' }}>
          {LISTING_LABEL[prop.listingType]}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="text-sm font-bold leading-tight line-clamp-2" style={{ color: TEXT }}>{prop.title}</p>
          <span className="text-[11px] px-1.5 py-0.5 rounded-md flex-shrink-0" style={{ background: 'var(--accent-subtle)', color: 'var(--accent)' }}>
            {TYPE_LABEL[prop.type]}
          </span>
        </div>

        {prop.neighborhood && (
          <div className="flex items-center gap-1 mb-2">
            <MapPin size={11} style={{ color: MUTED }} />
            <span className="text-xs truncate" style={{ color: MUTED }}>{prop.neighborhood}, {prop.city}</span>
          </div>
        )}

        {/* Price */}
        <p className="text-lg font-extrabold mb-3" style={{ color: NAVY }}>
          {prop.listingType === 'RENTA' && prop.rentPrice ? `${fmtPrice(prop.rentPrice, prop.currency)}/mes`
           : prop.price ? fmtPrice(prop.price, prop.currency)
           : 'Precio a consultar'}
        </p>

        {/* Specs */}
        <div className="flex flex-wrap gap-3 mb-4">
          {prop.bedrooms != null && (
            <span className="flex items-center gap-1 text-xs" style={{ color: MUTED }}>
              <Bed size={12} />{prop.bedrooms}
            </span>
          )}
          {prop.bathrooms != null && (
            <span className="flex items-center gap-1 text-xs" style={{ color: MUTED }}>
              <Bath size={12} />{prop.bathrooms}
            </span>
          )}
          {prop.parkingSpots != null && (
            <span className="flex items-center gap-1 text-xs" style={{ color: MUTED }}>
              <Car size={12} />{prop.parkingSpots}
            </span>
          )}
          {prop.areaSqm != null && (
            <span className="flex items-center gap-1 text-xs" style={{ color: MUTED }}>
              <SquareIcon size={12} />{prop.areaSqm} m²
            </span>
          )}
        </div>

        {/* Neighborhood insight badges */}
        {prop.neighborhoodInsights?.security && (
          <div className="flex items-center gap-1.5 mb-3">
            <Shield size={12} style={{ color: SECURITY_CFG[prop.neighborhoodInsights.security.level].color }} />
            <span className="text-[11px] font-semibold" style={{ color: SECURITY_CFG[prop.neighborhoodInsights.security.level].color }}>
              {SECURITY_CFG[prop.neighborhoodInsights.security.level].label}
            </span>
            {(prop.neighborhoodInsights.schools?.length ?? 0) > 0 && (
              <>
                <span style={{ color: BORD }}>·</span>
                <School size={12} style={{ color: '#3B82F6' }} />
                <span className="text-[11px]" style={{ color: MUTED }}>
                  {prop.neighborhoodInsights.schools!.length} escuela{prop.neighborhoodInsights.schools!.length > 1 ? 's' : ''} cercana{prop.neighborhoodInsights.schools!.length > 1 ? 's' : ''}
                </span>
              </>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button onClick={onView} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold" style={{ background: 'var(--accent-subtle)', color: 'var(--accent)' }}>
            <Eye size={13} />Ver
          </button>
          <button onClick={onEdit} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold" style={{ background: 'var(--bg-secondary)', color: MUTED, border: `1px solid ${BORD}` }}>
            <Edit2 size={13} />Editar
          </button>
          <button onClick={onDelete} className="w-9 flex items-center justify-center rounded-xl text-xs" style={{ background: 'rgba(239,68,68,0.08)', color: '#DC2626', border: `1px solid rgba(239,68,68,0.15)` }}>
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Neighborhood Insights panel ────────────────────────────────────────────────
function InsightsPanel({ insights }: { insights: NeighborhoodInsights }) {
  return (
    <div className="space-y-4">
      {insights.security && (
        <div className="p-3 rounded-xl" style={{ background: `${SECURITY_CFG[insights.security.level].color}0A`, border: `1px solid ${SECURITY_CFG[insights.security.level].color}22` }}>
          <div className="flex items-center gap-2 mb-1">
            <Shield size={14} style={{ color: SECURITY_CFG[insights.security.level].color }} />
            <span className="text-sm font-bold" style={{ color: SECURITY_CFG[insights.security.level].color }}>
              {SECURITY_CFG[insights.security.level].label}
            </span>
          </div>
          {insights.security.notes && <p className="text-xs" style={{ color: MUTED }}>{insights.security.notes}</p>}
        </div>
      )}

      {insights.schools && insights.schools.length > 0 && (
        <div>
          <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: MUTED }}>Escuelas cercanas</p>
          <div className="space-y-2">
            {insights.schools.map((s, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                <div>
                  <p className="text-xs font-semibold" style={{ color: TEXT }}>{s.name}</p>
                  <p className="text-[11px]" style={{ color: MUTED }}>{s.level} · {s.distanceKm} km</p>
                </div>
                {s.rating && (
                  <div className="flex items-center gap-1">
                    <Star size={11} fill="#F59E0B" style={{ color: '#F59E0B' }} />
                    <span className="text-xs font-bold" style={{ color: TEXT }}>{s.rating}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {insights.transport && insights.transport.length > 0 && (
        <div>
          <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: MUTED }}>Transporte</p>
          <div className="space-y-1.5">
            {insights.transport.map((t, i) => (
              <div key={i} className="flex items-center justify-between text-xs px-2.5 py-2 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                <span style={{ color: TEXT }}>{t.name} ({t.type})</span>
                <span style={{ color: MUTED }}>{t.distanceKm} km</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {insights.notes && <p className="text-xs italic" style={{ color: MUTED }}>{insights.notes}</p>}
    </div>
  )
}

// ── Property detail modal ──────────────────────────────────────────────────────
function PropertyDetail({ prop, onClose, onEdit }: { prop: Property; onClose: () => void; onEdit: () => void }) {
  const sc = STATUS_CFG[prop.status]
  const [tab, setTab] = useState<'info' | 'insights'>('info')

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg rounded-3xl flex flex-col overflow-hidden"
        style={{ background: SURF, border: `1px solid ${BORD}`, maxHeight: '90vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 pb-0">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <p className="font-extrabold text-base leading-tight" style={{ color: TEXT }}>{prop.title}</p>
              {prop.address && <p className="text-xs mt-0.5 truncate" style={{ color: MUTED }}>{prop.address}</p>}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: sc.bg, color: sc.text }}>{sc.label}</span>
              <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--accent-ghost)', color: MUTED }}>✕</button>
            </div>
          </div>

          {/* Price */}
          <p className="text-2xl font-black mb-3" style={{ color: NAVY }}>
            {prop.listingType === 'RENTA' && prop.rentPrice
              ? `${fmtPrice(prop.rentPrice, prop.currency)}/mes`
              : prop.price ? fmtPrice(prop.price, prop.currency) : 'Precio a consultar'}
          </p>

          {/* Specs row */}
          <div className="flex flex-wrap gap-4 pb-4" style={{ borderBottom: `1px solid ${BORD}` }}>
            {prop.bedrooms != null && <Spec icon={Bed} label={`${prop.bedrooms} rec`} />}
            {prop.bathrooms != null && <Spec icon={Bath} label={`${prop.bathrooms} baños`} />}
            {prop.parkingSpots != null && <Spec icon={Car} label={`${prop.parkingSpots} cajones`} />}
            {prop.areaSqm != null && <Spec icon={SquareIcon} label={`${prop.areaSqm} m²`} />}
            {prop.builtSqm != null && <Spec icon={Home} label={`${prop.builtSqm} m² const`} />}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-3">
            {(['info', 'insights'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className="px-4 py-1.5 rounded-full text-xs font-semibold"
                style={tab === t ? { background: NAVY, color: '#fff' } : { background: 'var(--bg-secondary)', color: MUTED }}>
                {t === 'info' ? 'Información' : 'Zona & Insights'}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {tab === 'info' ? (
            <div className="space-y-4">
              {prop.description && <p className="text-sm" style={{ color: MUTED, lineHeight: 1.6 }}>{prop.description}</p>}
              {prop.amenities && prop.amenities.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: MUTED }}>Amenidades</p>
                  <div className="flex flex-wrap gap-2">
                    {prop.amenities.map((a, i) => (
                      <span key={i} className="text-xs px-2.5 py-1 rounded-full" style={{ background: 'var(--accent-subtle)', color: 'var(--accent)' }}>{a}</span>
                    ))}
                  </div>
                </div>
              )}
              {prop.agentName && (
                <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: 'var(--accent-subtle)', color: 'var(--accent)' }}>
                    {prop.agentName[0]}
                  </div>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: TEXT }}>{prop.agentName}</p>
                    <p className="text-[11px]" style={{ color: MUTED }}>Agente asignado</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <InsightsPanel insights={prop.neighborhoodInsights ?? {}} />
          )}
        </div>

        {/* Footer */}
        <div className="p-4 flex gap-2" style={{ borderTop: `1px solid ${BORD}` }}>
          <button onClick={onEdit} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold" style={{ background: NAVY, color: '#fff' }}>
            <Edit2 size={14} />Editar propiedad
          </button>
        </div>
      </div>
    </div>
  )
}

function Spec({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon size={13} style={{ color: MUTED }} />
      <span className="text-xs font-medium" style={{ color: TEXT }}>{label}</span>
    </div>
  )
}

// ── Property form (add/edit) ───────────────────────────────────────────────────
function PropertyForm({ initial, onSave, onClose }: {
  initial?: Partial<Property>
  onSave: (data: Partial<Property>) => Promise<void>
  onClose: () => void
}) {
  const [form, setForm] = useState<Partial<Property>>(initial ?? {
    type: 'DEPARTAMENTO', listingType: 'VENTA', status: 'DISPONIBLE', currency: 'MXN',
  })
  const [saving, setSaving] = useState(false)
  const addressRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)

  // Google Maps autocomplete
  useEffect(() => {
    let mounted = true
    loadGoogleMaps().then(() => {
      if (!mounted || !addressRef.current || !window.google?.maps?.places) return
      autocompleteRef.current = new window.google.maps.places.Autocomplete(addressRef.current, {
        types: ['address'], fields: ['formatted_address', 'geometry', 'address_components'],
      })
      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace() as (google.maps.places.PlaceResult & { address_components?: { types: string[]; long_name: string }[] }) | undefined
        if (!place?.geometry?.location) return
        const components = place.address_components ?? []
        const get = (type: string) => components.find((c: { types: string[]; long_name: string }) => c.types.includes(type))?.long_name ?? ''
        setForm(f => ({
          ...f,
          address: place.formatted_address,
          neighborhood: get('sublocality') || get('neighborhood'),
          city: get('locality') || get('administrative_area_level_2'),
          state: get('administrative_area_level_1'),
          lat: place.geometry!.location!.lat(),
          lng: place.geometry!.location!.lng(),
        }))
      })
    })
    return () => { mounted = false }
  }, [])

  const set = (k: keyof Property, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try { await onSave(form) } finally { setSaving(false) }
  }

  const PROP_TYPES: PropertyType[] = ['CASA','DEPARTAMENTO','TERRENO','OFICINA','LOCAL_COMERCIAL','BODEGA','OTRO']
  const LISTING_TYPES: ListingType[] = ['VENTA','RENTA','AMBOS']
  const STATUSES: PropertyStatus[]   = ['DISPONIBLE','RESERVADA','PAUSADA','VENDIDA','RENTADA']

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <form
        className="relative w-full max-w-xl rounded-3xl flex flex-col overflow-hidden"
        style={{ background: SURF, border: `1px solid ${BORD}`, maxHeight: '92vh' }}
        onClick={e => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <div className="p-5 flex items-center justify-between" style={{ borderBottom: `1px solid ${BORD}` }}>
          <h3 className="font-extrabold text-base" style={{ color: TEXT }}>{initial?.id ? 'Editar propiedad' : 'Nueva propiedad'}</h3>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--accent-ghost)', color: MUTED }}>✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Title */}
          <FormField label="Título *">
            <input required value={form.title ?? ''} onChange={e => set('title', e.target.value)} placeholder="Casa en Col. Del Valle" style={inputStyle} />
          </FormField>

          {/* Type / Listing / Status */}
          <div className="grid grid-cols-3 gap-3">
            <FormField label="Tipo">
              <select value={form.type} onChange={e => set('type', e.target.value)} style={inputStyle}>
                {PROP_TYPES.map(t => <option key={t} value={t}>{TYPE_LABEL[t]}</option>)}
              </select>
            </FormField>
            <FormField label="Operación">
              <select value={form.listingType} onChange={e => set('listingType', e.target.value)} style={inputStyle}>
                {LISTING_TYPES.map(t => <option key={t} value={t}>{LISTING_LABEL[t]}</option>)}
              </select>
            </FormField>
            <FormField label="Estado">
              <select value={form.status} onChange={e => set('status', e.target.value)} style={inputStyle}>
                {STATUSES.map(s => <option key={s} value={s}>{STATUS_CFG[s].label}</option>)}
              </select>
            </FormField>
          </div>

          {/* Prices */}
          <div className="grid grid-cols-2 gap-3">
            {(form.listingType === 'VENTA' || form.listingType === 'AMBOS') && (
              <FormField label="Precio de venta (MXN)">
                <input type="number" value={form.price ?? ''} onChange={e => set('price', +e.target.value)} placeholder="4500000" style={inputStyle} />
              </FormField>
            )}
            {(form.listingType === 'RENTA' || form.listingType === 'AMBOS') && (
              <FormField label="Renta mensual (MXN)">
                <input type="number" value={form.rentPrice ?? ''} onChange={e => set('rentPrice', +e.target.value)} placeholder="25000" style={inputStyle} />
              </FormField>
            )}
          </div>

          {/* Address with Google Maps */}
          <FormField label="Dirección (Google Maps)">
            <input ref={addressRef} value={form.address ?? ''} onChange={e => set('address', e.target.value)}
              placeholder="Busca la dirección exacta…" style={inputStyle} />
            {form.lat && form.lng && (
              <p className="text-[11px] mt-1 flex items-center gap-1" style={{ color: GREEN }}>
                <CheckCircle2 size={11} />Ubicación capturada ({form.lat?.toFixed(4)}, {form.lng?.toFixed(4)})
              </p>
            )}
          </FormField>

          {/* Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <FormField label="Recámaras"><input type="number" min={0} value={form.bedrooms ?? ''} onChange={e => set('bedrooms', +e.target.value)} placeholder="3" style={inputStyle} /></FormField>
            <FormField label="Baños"><input type="number" min={0} step={0.5} value={form.bathrooms ?? ''} onChange={e => set('bathrooms', +e.target.value)} placeholder="2" style={inputStyle} /></FormField>
            <FormField label="Cajones"><input type="number" min={0} value={form.parkingSpots ?? ''} onChange={e => set('parkingSpots', +e.target.value)} placeholder="2" style={inputStyle} /></FormField>
            <FormField label="m² totales"><input type="number" min={0} value={form.areaSqm ?? ''} onChange={e => set('areaSqm', +e.target.value)} placeholder="120" style={inputStyle} /></FormField>
          </div>

          {/* Agent */}
          <FormField label="Agente asignado">
            <input value={form.agentName ?? ''} onChange={e => set('agentName', e.target.value)} placeholder="Nombre del agente" style={inputStyle} />
          </FormField>

          {/* Description */}
          <FormField label="Descripción">
            <textarea value={form.description ?? ''} onChange={e => set('description', e.target.value)} rows={3} placeholder="Describe los atributos de la propiedad…" style={{ ...inputStyle, resize: 'none' }} />
          </FormField>
        </div>

        <div className="p-4" style={{ borderTop: `1px solid ${BORD}` }}>
          <button type="submit" disabled={saving} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm" style={{ background: NAVY, color: '#fff', opacity: saving ? 0.6 : 1 }}>
            {saving ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <CheckCircle2 size={16} />}
            {saving ? 'Guardando…' : initial?.id ? 'Guardar cambios' : 'Agregar propiedad'}
          </button>
        </div>
      </form>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '8px 12px', borderRadius: 10, border: '1.5px solid var(--border)',
  background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 13, outline: 'none',
  boxSizing: 'border-box',
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ fontSize: 11, fontWeight: 600, color: MUTED, display: 'block', marginBottom: 5 }}>{label}</label>
      {children}
    </div>
  )
}

// ── KPI strip ─────────────────────────────────────────────────────────────────
function KPIs({ props }: { props: Property[] }) {
  const total     = props.length
  const disponible= props.filter(p => p.status === 'DISPONIBLE').length
  const reservada = props.filter(p => p.status === 'RESERVADA').length
  const vendida   = props.filter(p => p.status === 'VENDIDA').length
  const avgPrice  = props.filter(p => p.price).reduce((s, p) => s + (p.price ?? 0), 0) / (props.filter(p => p.price).length || 1)

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
      {[
        { label: 'Total',        value: total,      color: NAVY    },
        { label: 'Disponibles',  value: disponible, color: GREEN   },
        { label: 'Reservadas',   value: reservada,  color: '#D97706'},
        { label: 'Vendidas',     value: vendida,    color: '#6B7280'},
        { label: 'Precio Prom.', value: avgPrice > 0 ? `$${(avgPrice/1_000_000).toFixed(1)}M` : '—', color: NAVY },
      ].map(k => (
        <div key={k.label} className="rounded-2xl p-4 text-center" style={{ background: SURF, border: `1px solid ${BORD}` }}>
          <p className="text-xl font-extrabold" style={{ color: k.color }}>{k.value}</p>
          <p className="text-xs mt-0.5" style={{ color: MUTED }}>{k.label}</p>
        </div>
      ))}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function InventarioPage() {
  const [plan, setPlan]           = useState<string>('essential')
  const [properties, setProperties] = useState<Property[]>(DEMO)
  const [search, setSearch]       = useState('')
  const [filter, setFilter]       = useState<PropertyStatus | 'TODOS'>('TODOS')
  const [selected, setSelected]   = useState<Property | null>(null)
  const [editing, setEditing]     = useState<Partial<Property> | null>(null)
  const [loading, setLoading]     = useState(false)

  useEffect(() => {
    const meta = document.querySelector('meta[name="clerk-plan"]')
    if (meta) setPlan(meta.getAttribute('content') ?? 'essential')
  }, [])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const r = await fetch('/api/propiedades')
      if (r.ok) {
        const { properties: data } = await r.json()
        if (data?.length) setProperties(data)
      }
    } catch { /* use demo */ } finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = properties.filter(p => {
    const matchStatus = filter === 'TODOS' || p.status === filter
    const q = search.toLowerCase()
    const matchSearch = !q || p.title.toLowerCase().includes(q)
      || p.neighborhood?.toLowerCase().includes(q)
      || p.address?.toLowerCase().includes(q)
    return matchStatus && matchSearch
  })

  async function handleSave(data: Partial<Property>) {
    if (editing?.id) {
      await fetch(`/api/propiedades/${editing.id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
      })
    } else {
      await fetch('/api/propiedades', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
      })
    }
    setEditing(null)
    load()
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar esta propiedad?')) return
    await fetch(`/api/propiedades/${id}`, { method: 'DELETE' })
    setProperties(ps => ps.filter(p => p.id !== id))
  }

  if (plan === 'starter') {
    return (
      <PlanGate
        icon={Building2}
        iconColor={GREEN}
        title="Inventario de Propiedades"
        description="Carga, organiza y muestra tu portafolio completo de propiedades con fotos, ubicación en mapa, Neighborhood Insights y filtrado inteligente de leads."
        features={[
          { title: 'Inventario ilimitado', desc: 'Casas, deptos, terrenos, locales y más' },
          { title: 'Google Maps integrado', desc: 'Captura lat/lng automáticamente al escribir la dirección' },
          { title: 'Filtro de Oro IA', desc: 'Califica presupuesto, zona y crédito antes de agendar' },
          { title: 'Neighborhood Insights', desc: 'Escuelas, seguridad y transporte por propiedad' },
          { title: 'Showing Scheduler', desc: 'La IA coordina las visitas físicas automáticamente' },
          { title: 'CRM de leads inmobiliarios', desc: 'Historial de contactos por propiedad' },
        ]}
        requiredPlan="essential"
      />
    )
  }

  const STATUSES: (PropertyStatus | 'TODOS')[] = ['TODOS','DISPONIBLE','RESERVADA','VENDIDA','RENTADA','PAUSADA']
  const STATUS_LABELS: Record<PropertyStatus | 'TODOS', string> = { TODOS: 'Todas', ...Object.fromEntries(Object.entries(STATUS_CFG).map(([k,v]) => [k, v.label])) } as any

  return (
    <div className="p-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: TEXT }}>Inventario</h1>
          <p className="text-sm mt-0.5" style={{ color: MUTED }}>{properties.length} propiedades · {filtered.length} mostrando</p>
        </div>
        <button
          onClick={() => setEditing({})}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white"
          style={{ background: NAVY }}
        >
          <Plus size={16} />Nueva propiedad
        </button>
      </div>

      {/* KPIs */}
      <KPIs props={properties} />

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: MUTED }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por título, colonia, dirección…"
            style={{ ...inputStyle, paddingLeft: 32 }}
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {STATUSES.map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold"
              style={filter === s
                ? { background: NAVY, color: '#fff' }
                : { background: SURF, color: MUTED, border: `1px solid ${BORD}` }}>
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <Building2 size={48} style={{ color: MUTED, opacity: 0.3, margin: '0 auto 12px' }} />
          <p style={{ color: MUTED }}>No hay propiedades que coincidan</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(p => (
            <PropertyCard key={p.id} prop={p}
              onView={() => setSelected(p)}
              onEdit={() => setEditing(p)}
              onDelete={() => handleDelete(p.id)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {selected && <PropertyDetail prop={selected} onClose={() => setSelected(null)} onEdit={() => { setEditing(selected); setSelected(null) }} />}
      {editing !== null && <PropertyForm initial={editing} onSave={handleSave} onClose={() => setEditing(null)} />}
    </div>
  )
}
