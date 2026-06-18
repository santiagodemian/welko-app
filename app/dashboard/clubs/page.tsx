'use client'

import { useState, useEffect } from 'react'
import { Building2, Plus, Search, X, Filter, Globe, DollarSign, Users as _Users, Loader2, Trash2 } from 'lucide-react'

const N = '#0A0A0A'
const G = '#2563EB'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Club {
  id: string
  name: string
  country: string | null
  league: string | null
  logoUrl: string | null
  sportingDirector: string | null
  transferBudget: number | null
  squadNeeds: string[]
  relationshipStatus: string | null
}

// ─── Relationship badge config ────────────────────────────────────────────────

type RelStatus = 'Active partner' | 'Hot lead' | 'Cold lead' | 'Prospect'

const REL_STYLES: Record<RelStatus, { bg: string; color: string }> = {
  'Active partner': { bg: 'rgba(5,150,105,0.1)',   color: '#059669' },
  'Hot lead':       { bg: 'rgba(37,99,235,0.1)',  color: '#2563EB' },
  'Cold lead':      { bg: '#F3F4F6',               color: '#6B7280' },
  'Prospect':       { bg: 'rgba(245,158,11,0.1)',  color: '#D97706' },
}

const REL_OPTIONS: RelStatus[] = ['Active partner', 'Hot lead', 'Prospect', 'Cold lead']

function relStyle(status: string | null) {
  if (!status) return { bg: '#F3F4F6', color: '#6B7280' }
  return REL_STYLES[status as RelStatus] ?? { bg: '#F3F4F6', color: '#6B7280' }
}

function formatBudget(budget: number): string {
  if (budget >= 1_000_000) return `€${(budget / 1_000_000).toFixed(1)}M`
  if (budget >= 1_000)     return `€${Math.round(budget / 1_000)}K`
  return `€${budget}`
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ClubsPage() {
  const [clubs,              setClubs]              = useState<Club[]>([])
  const [loading,            setLoading]            = useState(true)
  const [search,             setSearch]             = useState('')
  const [countryFilter,      setCountryFilter]      = useState('')
  const [relationshipFilter, setRelationshipFilter] = useState('')
  const [showAddModal,       setShowAddModal]       = useState(false)
  const [adding,             setAdding]             = useState(false)
  const [deleting,           setDeleting]           = useState<string | null>(null)
  const [memberRole,         setMemberRole]         = useState<string | null>(null)

  function buildQuery() {
    const p = new URLSearchParams()
    if (search)             p.set('q',                  search)
    if (countryFilter)      p.set('country',            countryFilter)
    if (relationshipFilter) p.set('relationshipStatus', relationshipFilter)
    return p.toString() ? `?${p.toString()}` : ''
  }

  function fetchClubs() {
    setLoading(true)
    fetch(`/api/dashboard/clubs${buildQuery()}`)
      .then(r => r.json())
      .then(d => {
        setClubs(d.clubs ?? [])
        if (d.memberRole) setMemberRole(d.memberRole as string)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  // Also fetch member role on mount so we can show/hide delete
  useEffect(() => {
    fetch('/api/dashboard/clubs')
      .then(r => r.json())
      .then(d => {
        if (d.memberRole) setMemberRole(d.memberRole as string)
      })
      .catch(() => {})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    fetchClubs()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, countryFilter, relationshipFilter])

  const canEdit = memberRole === 'AGENCY_OWNER' || memberRole === 'MANAGER'

  const uniqueCountries = Array.from(
    new Set(clubs.map(c => c.country).filter((c): c is string => Boolean(c)))
  ).sort()

  async function handleDelete(id: string) {
    if (!confirm('Delete this club?')) return
    setDeleting(id)
    try {
      await fetch(`/api/dashboard/clubs?id=${id}`, { method: 'DELETE' })
      setClubs(prev => prev.filter(c => c.id !== id))
    } finally {
      setDeleting(null)
    }
  }

  // Shared input / label styles
  const inputStyle: React.CSSProperties = {
    padding: '9px 14px', borderRadius: 10, border: '1px solid #E5E7EB',
    fontSize: 13, fontFamily: 'var(--font-montserrat), sans-serif',
    background: 'white', outline: 'none', color: N, boxSizing: 'border-box',
  }

  return (
    <div style={{ padding: 'clamp(20px,4vw,40px) clamp(16px,4vw,40px) 80px', fontFamily: 'var(--font-montserrat), sans-serif', maxWidth: 1000 }}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        .club-card-delete { opacity: 0; transition: opacity 0.15s; }
        .club-card:hover .club-card-delete { opacity: 1; }
        .club-card { transition: box-shadow 0.15s; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
        .club-card:hover { box-shadow: 0 4px 20px rgba(10,22,40,0.12); }
        .delete-btn:hover { color: #EF4444 !important; background: rgba(239,68,68,0.06) !important; }
      `}</style>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%', background: G,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Building2 size={20} color="white" />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: N, margin: 0, letterSpacing: '-0.02em' }}>
            Clubs
          </h1>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: N, color: 'white', border: 'none',
            borderRadius: 10, padding: '10px 20px', cursor: 'pointer',
            fontWeight: 700, fontSize: 13, fontFamily: 'var(--font-montserrat), sans-serif',
          }}
        >
          <Plus size={15} /> Add Club
        </button>
      </div>

      {/* ── Filters ── */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
        {/* Search */}
        <div style={{ flex: '1 1 220px', position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search clubs…"
            style={{ ...inputStyle, paddingLeft: 38, width: '100%' }}
          />
        </div>

        {/* Country filter */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <Globe size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }} />
          <select
            value={countryFilter}
            onChange={e => setCountryFilter(e.target.value)}
            style={{ ...inputStyle, paddingLeft: 30, cursor: 'pointer', minWidth: 150 }}
          >
            <option value="">All Countries</option>
            {uniqueCountries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Relationship filter */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <Filter size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }} />
          <select
            value={relationshipFilter}
            onChange={e => setRelationshipFilter(e.target.value)}
            style={{ ...inputStyle, paddingLeft: 30, cursor: 'pointer', minWidth: 160 }}
          >
            <option value="">All</option>
            {REL_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        {/* Clear filters */}
        {(search || countryFilter || relationshipFilter) && (
          <button
            onClick={() => { setSearch(''); setCountryFilter(''); setRelationshipFilter('') }}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 10, padding: '9px 14px', cursor: 'pointer',
              fontSize: 12, color: '#EF4444', fontWeight: 600,
              fontFamily: 'var(--font-montserrat), sans-serif',
            }}
          >
            <X size={12} /> Clear
          </button>
        )}
      </div>

      {/* ── Loading ── */}
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 64, color: '#9CA3AF' }}>
          <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
          <span style={{ fontSize: 14 }}>Loading clubs…</span>
        </div>
      ) : clubs.length === 0 ? (
        /* ── Empty state ── */
        <div style={{ textAlign: 'center', padding: '80px 24px' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%', background: 'rgba(37,99,235,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
          }}>
            <Building2 size={28} color={G} />
          </div>
          <p style={{ fontSize: 16, fontWeight: 700, color: N, margin: '0 0 8px' }}>No clubs tracked yet</p>
          <p style={{ fontSize: 14, color: '#9CA3AF', margin: '0 0 24px' }}>
            Add your first club to start tracking relationships and transfer intelligence.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: N, color: 'white', border: 'none', borderRadius: 10,
              padding: '11px 22px', cursor: 'pointer', fontWeight: 700,
              fontSize: 13, fontFamily: 'var(--font-montserrat), sans-serif',
            }}
          >
            <Plus size={15} /> Add your first club
          </button>
        </div>
      ) : (
        /* ── Cards grid ── */
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16,
        }}>
          {clubs.map(club => {
            const rel   = relStyle(club.relationshipStatus)
            const needs = club.squadNeeds.slice(0, 5)
            return (
              <div
                key={club.id}
                className="club-card"
                style={{
                  background: 'white', border: '1px solid #E5E7EB',
                  borderRadius: 14, padding: 18, overflow: 'hidden',
                  position: 'relative',
                }}
              >
                {/* Delete button */}
                {canEdit && (
                  <button
                    className="club-card-delete delete-btn"
                    onClick={() => handleDelete(club.id)}
                    disabled={deleting === club.id}
                    title="Delete club"
                    style={{
                      position: 'absolute', top: 12, right: 12,
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: '#9CA3AF', padding: 4, borderRadius: 6,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    {deleting === club.id
                      ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                      : <Trash2 size={14} />}
                  </button>
                )}

                {/* Top row: avatar + name + country */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: N, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', flexShrink: 0, overflow: 'hidden',
                  }}>
                    {club.logoUrl
                      ? <img src={club.logoUrl} alt={club.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <Building2 size={18} color={G} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontSize: 14, fontWeight: 700, color: N, margin: '0 0 2px',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      paddingRight: canEdit ? 20 : 0,
                    }}>
                      {club.name}
                    </p>
                    {club.country && (
                      <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>{club.country}</p>
                    )}
                  </div>
                </div>

                {/* League */}
                {club.league && (
                  <p style={{ fontSize: 12, color: '#6B7280', margin: '0 0 4px' }}>{club.league}</p>
                )}

                {/* Sporting director */}
                {club.sportingDirector && (
                  <p style={{ fontSize: 12, color: '#6B7280', margin: '0 0 8px', fontStyle: 'italic' }}>
                    SD: {club.sportingDirector}
                  </p>
                )}

                {/* Transfer budget */}
                {club.transferBudget !== null && club.transferBudget > 0 && (
                  <div style={{ marginBottom: 8 }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      fontSize: 11, fontWeight: 700,
                      background: 'rgba(5,150,105,0.1)', color: '#059669',
                      padding: '3px 9px', borderRadius: 20,
                    }}>
                      <DollarSign size={10} />
                      {formatBudget(club.transferBudget)} budget
                    </span>
                  </div>
                )}

                {/* Squad needs */}
                {needs.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
                    {needs.map(pos => (
                      <span key={pos} style={{
                        fontSize: 10, fontWeight: 700,
                        background: 'rgba(37,99,235,0.08)', color: G,
                        padding: '2px 7px', borderRadius: 20, letterSpacing: '0.02em',
                      }}>
                        {pos}
                      </span>
                    ))}
                    {club.squadNeeds.length > 5 && (
                      <span style={{ fontSize: 10, color: '#9CA3AF', alignSelf: 'center' }}>
                        +{club.squadNeeds.length - 5}
                      </span>
                    )}
                  </div>
                )}

                {/* Relationship badge */}
                {club.relationshipStatus && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700,
                      background: rel.bg, color: rel.color,
                      padding: '3px 10px', borderRadius: 20,
                    }}>
                      {club.relationshipStatus}
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* ── Add Club Modal ── */}
      {showAddModal && (
        <AddClubModal
          adding={adding}
          setAdding={setAdding}
          onClose={() => setShowAddModal(false)}
          onCreated={(club) => {
            setClubs(prev => [club, ...prev])
            setShowAddModal(false)
          }}
        />
      )}
    </div>
  )
}

// ─── AddClubModal ─────────────────────────────────────────────────────────────

function AddClubModal({ adding, setAdding, onClose, onCreated }: {
  adding: boolean
  setAdding: (v: boolean) => void
  onClose: () => void
  onCreated: (club: Club) => void
}) {
  const [error, setError] = useState('')
  const [form, setForm]   = useState({
    name:              '',
    country:           '',
    league:            '',
    sportingDirector:  '',
    transferBudget:    '',
    squadNeedsRaw:     '',
    relationshipStatus: '',
    logoUrl:           '',
  })

  function field(k: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) { setError('Club name is required.'); return }
    setAdding(true); setError('')
    try {
      const squadNeeds = form.squadNeedsRaw
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)

      const res = await fetch('/api/dashboard/clubs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:              form.name.trim(),
          country:           form.country          || null,
          league:            form.league           || null,
          logoUrl:           form.logoUrl          || null,
          sportingDirector:  form.sportingDirector || null,
          transferBudget:    form.transferBudget   ? parseFloat(form.transferBudget) : null,
          squadNeeds,
          relationshipStatus: form.relationshipStatus || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError((data as { error?: string }).error ?? 'Failed to create club.'); return }
      onCreated((data as { club: Club }).club)
    } finally {
      setAdding(false)
    }
  }

  const f: React.CSSProperties = {
    width: '100%', padding: '9px 12px', border: '1px solid #E5E7EB',
    borderRadius: 9, fontSize: 13, fontFamily: 'var(--font-montserrat), sans-serif',
    outline: 'none', boxSizing: 'border-box', color: N,
  }
  const lbl: React.CSSProperties = {
    fontSize: 10, fontWeight: 700, color: '#9CA3AF',
    textTransform: 'uppercase', letterSpacing: '0.06em',
    display: 'block', marginBottom: 5,
  }

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(10,22,40,0.5)', zIndex: 50 }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        zIndex: 51, width: '90%', maxWidth: 480, maxHeight: '90vh',
        background: 'white', borderRadius: 18, display: 'flex', flexDirection: 'column',
        fontFamily: 'var(--font-montserrat), sans-serif',
        boxShadow: '0 24px 80px rgba(10,22,40,0.25)',
      }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <p style={{ fontSize: 16, fontWeight: 800, color: N, margin: '0 0 2px' }}>Add Club</p>
            <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>Track a new club relationship</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}>
            <X size={18} />
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {error && (
            <p style={{ fontSize: 13, color: '#EF4444', margin: '0 0 16px', padding: '10px 14px', background: 'rgba(239,68,68,0.06)', borderRadius: 8 }}>
              {error}
            </p>
          )}

          {/* Name */}
          <div style={{ marginBottom: 14 }}>
            <label style={lbl}>Club Name *</label>
            <input value={form.name} onChange={field('name')} placeholder="e.g. FC Barcelona" style={f} required />
          </div>

          {/* Country + League */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={lbl}>Country</label>
              <input value={form.country} onChange={field('country')} placeholder="Spain" style={f} />
            </div>
            <div>
              <label style={lbl}>League</label>
              <input value={form.league} onChange={field('league')} placeholder="La Liga" style={f} />
            </div>
          </div>

          {/* Sporting director */}
          <div style={{ marginBottom: 14 }}>
            <label style={lbl}>Sporting Director</label>
            <input value={form.sportingDirector} onChange={field('sportingDirector')} placeholder="e.g. Deco" style={f} />
          </div>

          {/* Transfer budget */}
          <div style={{ marginBottom: 14 }}>
            <label style={lbl}>Transfer Budget (€)</label>
            <input type="number" min={0} value={form.transferBudget} onChange={field('transferBudget')} placeholder="e.g. 20000000" style={f} />
          </div>

          {/* Squad needs */}
          <div style={{ marginBottom: 14 }}>
            <label style={lbl}>Squad Needs (comma-separated)</label>
            <input value={form.squadNeedsRaw} onChange={field('squadNeedsRaw')} placeholder="e.g. ST, CB, GK" style={f} />
          </div>

          {/* Relationship status */}
          <div style={{ marginBottom: 14 }}>
            <label style={lbl}>Relationship Status</label>
            <select value={form.relationshipStatus} onChange={field('relationshipStatus')} style={{ ...f, cursor: 'pointer' }}>
              <option value="">— Select —</option>
              {(['Active partner', 'Hot lead', 'Prospect', 'Cold lead'] as const).map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Logo URL */}
          <div style={{ marginBottom: 6 }}>
            <label style={lbl}>Logo URL (optional)</label>
            <input value={form.logoUrl} onChange={field('logoUrl')} placeholder="https://…" style={f} />
          </div>
        </form>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid #E5E7EB', display: 'flex', gap: 10, flexShrink: 0 }}>
          <button
            onClick={handleSubmit as unknown as React.MouseEventHandler}
            disabled={adding}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              background: N, color: 'white', border: 'none', borderRadius: 10, padding: '12px',
              fontWeight: 800, fontSize: 14, cursor: adding ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-montserrat), sans-serif', opacity: adding ? 0.7 : 1,
            }}
          >
            {adding
              ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Saving…</>
              : <><Plus size={15} /> Add Club</>}
          </button>
          <button
            onClick={onClose}
            style={{
              padding: '12px 20px', background: '#F3F4F6', border: 'none',
              borderRadius: 10, fontSize: 14, color: '#6B7280', cursor: 'pointer',
              fontWeight: 600, fontFamily: 'var(--font-montserrat), sans-serif',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  )
}

