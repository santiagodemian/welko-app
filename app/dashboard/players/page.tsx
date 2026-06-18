'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { Search, Plus, SlidersHorizontal, X, ChevronUp, ChevronDown, Loader2, Eye, Globe, MessageCircle, FileDown, FileText } from 'lucide-react'
import Link from 'next/link'

function TabLoader() {
  return (
    <div style={{ padding: 64, textAlign: 'center', color: '#9CA3AF' }}>
      <Loader2 size={22} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 10px', display: 'block' }} />
      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
const SearchContent    = dynamic(() => import('../search/page'),    { ssr: false, loading: TabLoader })
const PortfolioContent = dynamic(() => import('../portfolio/page'), { ssr: false, loading: TabLoader })
const ProposalsContent = dynamic(() => import('../proposals/page'), { ssr: false, loading: TabLoader })

const N = '#0A0A0A'
const G = '#2563EB'

// ─── Types ────────────────────────────────────────────────────────────────────

type PlayerCategory = 'MANAGED' | 'MANDATE' | 'PROSPECTIVE'

interface Player {
  id: string
  fullName: string
  position: string | null
  age: number | null
  nationality: string | null
  currentClub: string | null
  currentLeague: string | null
  contractExpiry: string | null
  salaryExpectation: number | null
  eloRating: number | null
  verificationStatus: 'VERIFIED_NO_AGENT' | 'REPRESENTED_EXTERNAL' | 'UNDER_REVIEW'
  category: PlayerCategory
}

const CATEGORY_STYLES: Record<PlayerCategory, { bg: string; color: string; label: string }> = {
  MANAGED:     { bg: 'rgba(5,150,105,0.1)',   color: '#059669', label: 'Managed'     },
  MANDATE:     { bg: 'rgba(37,99,235,0.1)',  color: '#2563EB', label: 'Mandate'     },
  PROSPECTIVE: { bg: '#F3F4F6',               color: '#6B7280', label: 'Prospective' },
}

type SortField = 'fullName' | 'eloRating' | 'age' | 'salaryExpectation'
type SortDir   = 'asc' | 'desc'
type Scope     = 'mine' | 'all'

interface Filters {
  search:       string
  position:     string
  ageRange:     string
  contractYear: string
  maxSalary:    string
  status:       string
  eloMin:       string
  eloMax:       string
  country:      string
  league:       string
  club:         string
  category:     string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const POSITIONS = ['GK', 'CB', 'LB', 'RB', 'DM', 'CM', 'CAM', 'RW', 'LW', 'ST']

const AGE_RANGES = [
  { label: 'U21',   min: 0,  max: 20 },
  { label: 'U23',   min: 0,  max: 22 },
  { label: '24–28', min: 24, max: 28 },
  { label: '29+',   min: 29, max: 99 },
]

const CONTRACT_YEARS = ['2025', '2026', '2027+']

const STATUSES = [
  { value: 'VERIFIED_NO_AGENT',    label: 'Verified: No Agent' },
  { value: 'UNDER_REVIEW',         label: 'Under Review'       },
  { value: 'REPRESENTED_EXTERNAL', label: 'External Agency'    },
]

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  VERIFIED_NO_AGENT:    { bg: 'rgba(5,150,105,0.1)',  color: '#059669', label: 'Verified: No Agent' },
  UNDER_REVIEW:         { bg: '#F3F4F6',               color: '#6B7280', label: 'Under Review'       },
  REPRESENTED_EXTERNAL: { bg: 'rgba(239,68,68,0.1)',  color: '#EF4444', label: 'External Agency'    },
}

const EMPTY_FILTERS: Filters = {
  search: '', position: '', ageRange: '', contractYear: '',
  maxSalary: '', status: '', eloMin: '', eloMax: '',
  country: '', league: '', club: '', category: '',
}

// Dev/fallback mock data (1-99 ELO scale)
const MOCK_PLAYERS: Player[] = [
  { id: '1', fullName: 'Marco Fernández',  position: 'LB',  nationality: '🇪🇸', age: 24, eloRating: 78, currentClub: 'Deportivo FC',  currentLeague: 'Segunda División',    contractExpiry: '2025-06-30', verificationStatus: 'VERIFIED_NO_AGENT',    salaryExpectation: 3500, category: 'MANAGED'     as PlayerCategory },
  { id: '2', fullName: 'Aleksander Kovač', position: 'CAM', nationality: '🇸🇮', age: 22, eloRating: 72, currentClub: 'NK Olimpija',   currentLeague: 'PrvaLiga',             contractExpiry: '2025-12-31', verificationStatus: 'UNDER_REVIEW',         salaryExpectation: 2200, category: 'MANDATE'     as PlayerCategory },
  { id: '3', fullName: 'James Okonkwo',    position: 'ST',  nationality: '🇳🇬', age: 26, eloRating: 81, currentClub: 'FC Ashdod',     currentLeague: "Ligat ha'Al",          contractExpiry: '2026-05-31', verificationStatus: 'REPRESENTED_EXTERNAL', salaryExpectation: 5800, category: 'MANAGED'     as PlayerCategory },
  { id: '4', fullName: 'Pavel Horváth',    position: 'CB',  nationality: '🇨🇿', age: 28, eloRating: 69, currentClub: 'Bohemian FC',   currentLeague: 'League of Ireland',    contractExpiry: '2025-08-15', verificationStatus: 'VERIFIED_NO_AGENT',    salaryExpectation: 2800, category: 'PROSPECTIVE' as PlayerCategory },
  { id: '5', fullName: 'Diogo Santos',     position: 'RW',  nationality: '🇵🇹', age: 21, eloRating: 76, currentClub: 'Belenenses',    currentLeague: 'Liga Portugal 2',      contractExpiry: '2026-06-30', verificationStatus: 'UNDER_REVIEW',         salaryExpectation: 4100, category: 'PROSPECTIVE' as PlayerCategory },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function matchesAgeRange(age: number | null, range: string): boolean {
  if (!range) return true
  if (age === null) return false
  const r = AGE_RANGES.find(r => r.label === range)
  return r ? age >= r.min && age <= r.max : true
}

function matchesContractYear(expiry: string | null, year: string): boolean {
  if (!year) return true
  if (!expiry) return false
  const y = new Date(expiry).getFullYear()
  return year === '2027+' ? y >= 2027 : y === parseInt(year)
}

function countActiveFilters(f: Filters): number {
  return Object.entries(f).filter(([k, v]) => k !== 'search' && v !== '').length
}

// ─── Filter row sub-components ────────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  fontSize: 10, fontWeight: 700, color: '#9CA3AF',
  textTransform: 'uppercase', letterSpacing: '0.06em',
  marginBottom: 4, display: 'block',
}

const inputBase: React.CSSProperties = {
  padding: '7px 10px', borderRadius: 8, border: '1px solid #E5E7EB',
  fontSize: 12, fontFamily: 'var(--font-montserrat), sans-serif',
  background: 'white', outline: 'none', width: '100%', boxSizing: 'border-box',
  color: N,
}

function FSelect({ label, value, options, onChange }: {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{ ...inputBase, cursor: 'pointer', color: value ? N : '#9CA3AF' }}>
        <option value="">All</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

function FInput({ label, value, onChange, placeholder, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void
  placeholder?: string; type?: string
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder ?? 'Any'} style={inputBase} />
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

type PlayerTab = 'roster' | 'search' | 'proposals' | 'portfolio'

const PLAYER_TABS: { id: PlayerTab; label: string; icon: React.ComponentType<{ size: number; color?: string }> }[] = [
  { id: 'roster',    label: 'My Players',  icon: Eye },
  { id: 'search',    label: 'Search',      icon: Globe },
  { id: 'proposals', label: 'Proposals',   icon: FileText },
  { id: 'portfolio', label: 'Portfolio PDF', icon: FileDown },
]

export default function PlayersPage() {
  const [playerTab, setPlayerTab]     = useState<PlayerTab>('roster')
  const [players, setPlayers]         = useState<Player[]>(MOCK_PLAYERS)
  const [memberRole, setMemberRole]   = useState<string | null>(null)
  const [isPremium, setIsPremium]     = useState(false)
  const [scope, setScope]             = useState<Scope>('all')
  const [loading, setLoading]         = useState(false)
  const [filters, setFilters]         = useState<Filters>(EMPTY_FILTERS)
  const [showFilters, setShowFilters] = useState(false)
  const [sortField, setSortField]     = useState<SortField>('eloRating')
  const [sortDir, setSortDir]         = useState<SortDir>('desc')
  const [showAddModal, setShowAddModal] = useState(false)

  const isManager = memberRole === 'AGENCY_OWNER' || memberRole === 'MANAGER'

  const fetchPlayers = useCallback((s: Scope) => {
    setLoading(true)
    const q = `?scope=${s}`
    fetch(`/api/dashboard/players${q}`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data.players)) {
          setPlayers(data.players as Player[])
          setMemberRole(data.memberRole as string)
          setIsPremium(Boolean(data.isPremium))
        }
      })
      .catch(() => { /* use existing mock data */ })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchPlayers(scope) }, [fetchPlayers, scope])

  const setFilter = useCallback((key: keyof Filters) =>
    (val: string) => setFilters(prev => ({ ...prev, [key]: val })), [])

  const activeCount = countActiveFilters(filters)

  const filtered = useMemo(() => {
    return players
      .filter(p => {
        const f = filters
        const q = f.search.toLowerCase()
        if (q &&
          !p.fullName.toLowerCase().includes(q) &&
          !(p.position ?? '').toLowerCase().includes(q) &&
          !(p.currentClub ?? '').toLowerCase().includes(q)) return false
        if (f.position) {
          const pos = (p.position ?? '').toUpperCase().trim()
          if (pos !== f.position) return false
        }
        if (!matchesAgeRange(p.age, f.ageRange)) return false
        if (!matchesContractYear(p.contractExpiry, f.contractYear)) return false
        if (f.maxSalary && p.salaryExpectation !== null &&
            p.salaryExpectation > Number(f.maxSalary)) return false
        if (f.status && p.verificationStatus !== f.status) return false
        if (f.eloMin && (p.eloRating === null || p.eloRating < Number(f.eloMin))) return false
        if (f.eloMax && (p.eloRating === null || p.eloRating > Number(f.eloMax))) return false
        if (f.country  && !(p.nationality ?? '').toLowerCase().includes(f.country.toLowerCase())) return false
        if (f.league   && !(p.currentLeague ?? '').toLowerCase().includes(f.league.toLowerCase())) return false
        if (f.club     && !(p.currentClub ?? '').toLowerCase().includes(f.club.toLowerCase())) return false
        if (f.category && p.category !== f.category) return false
        return true
      })
      .sort((a, b) => {
        const va = (a[sortField] ?? '') as string | number
        const vb = (b[sortField] ?? '') as string | number
        if (va < vb) return sortDir === 'asc' ? -1 : 1
        if (va > vb) return sortDir === 'asc' ?  1 : -1
        return 0
      })
  }, [players, filters, sortField, sortDir])

  function toggleSort(field: SortField) {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('desc') }
  }

  const SortIcon = ({ field }: { field: SortField }) =>
    sortField === field
      ? (sortDir === 'desc' ? <ChevronDown size={11} /> : <ChevronUp size={11} />)
      : <span style={{ width: 11, display: 'inline-block' }} />

  return (
    <div style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        @media (min-width: 641px) { .polaris-mobile-cards { display: none !important; } }
        @media (max-width: 640px) {
          .polaris-desktop-table { display: none !important; }
          .polaris-players-header { padding: 0 4px !important; }
          .polaris-filter-bar { flex-direction: column !important; }
        }
      `}</style>

      {/* Tab bar */}
      <div style={{ borderBottom: '2px solid #F3F4F6', padding: '0 20px', background: 'var(--surface, white)' }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {PLAYER_TABS.map(t => {
            const active = playerTab === t.id
            return (
              <button
                key={t.id}
                onClick={() => setPlayerTab(t.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '14px 18px',
                  background: 'none', border: 'none',
                  borderBottom: active ? `2px solid ${G}` : '2px solid transparent',
                  marginBottom: -2,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: 13,
                  fontWeight: active ? 700 : 500,
                  color: active ? G : '#6B7280',
                  transition: 'color 0.15s',
                  whiteSpace: 'nowrap',
                }}
              >
                <t.icon size={15} color={active ? G : '#9CA3AF'} />
                {t.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Non-roster tabs */}
      {playerTab === 'search'    && <SearchContent />}
      {playerTab === 'proposals' && <ProposalsContent />}
      {playerTab === 'portfolio' && <PortfolioContent />}

      {/* Roster tab — existing content */}
      {playerTab === 'roster' && (
    <div style={{ padding: '32px 20px 80px', maxWidth: 1200 }}>

      {/* ── Page header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: N, margin: '0 0 4px', letterSpacing: '-0.02em' }}>
            Player Database
          </h1>
          <p style={{ color: '#6B7280', margin: 0, fontSize: 14 }}>
            {loading ? 'Loading…' : `${filtered.length} of ${players.length} players`}
            {activeCount > 0 && (
              <span style={{ color: G, fontWeight: 600 }}> · {activeCount} filter{activeCount > 1 ? 's' : ''} active</span>
            )}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Manager scope toggle — only visible for AGENCY_OWNER / MANAGER */}
          {isManager && (
            <div style={{
              display: 'flex', alignItems: 'center',
              background: 'white', border: '1px solid #E5E7EB',
              borderRadius: 10, overflow: 'hidden', flexShrink: 0,
            }}>
              {([['mine', <Eye key="e" size={13} />, 'My Portfolio'],
                 ['all',  <Globe key="g" size={13} />, 'Entire Agency']] as const).map(([val, icon, lbl]) => (
                <button key={val}
                  onClick={() => setScope(val as Scope)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '8px 14px', border: 'none', cursor: 'pointer',
                    fontSize: 12, fontWeight: 700, fontFamily: 'inherit',
                    background: scope === val ? N : 'transparent',
                    color: scope === val ? '#fff' : '#6B7280',
                    transition: 'background 0.15s, color 0.15s',
                  }}
                >
                  {icon} {lbl}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => setShowAddModal(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              background: N, color: 'white', border: 'none',
              borderRadius: 10, padding: '9px 18px', cursor: 'pointer',
              fontWeight: 700, fontSize: 13, fontFamily: 'inherit',
            }}
          >
            <Plus size={15} /> Add Player
          </button>
        </div>
      </div>

      {/* ── Search + filter toggle ── */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
          <input
            value={filters.search}
            onChange={e => setFilter('search')(e.target.value)}
            placeholder="Search by name, position, or club…"
            style={{
              width: '100%', padding: '9px 14px 9px 38px', borderRadius: 10,
              border: '1px solid #E5E7EB', outline: 'none', fontSize: 13,
              boxSizing: 'border-box', fontFamily: 'inherit',
            }}
          />
        </div>
        <button
          onClick={() => setShowFilters(v => !v)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: showFilters ? N : 'white',
            border: `1px solid ${showFilters ? N : '#E5E7EB'}`,
            borderRadius: 10, padding: '9px 16px', cursor: 'pointer',
            fontSize: 13, color: showFilters ? '#fff' : '#374151',
            fontWeight: 600, fontFamily: 'inherit', whiteSpace: 'nowrap',
          }}
        >
          <SlidersHorizontal size={14} />
          Filters
          {activeCount > 0 && (
            <span style={{
              background: G, color: '#fff', fontSize: 10, fontWeight: 800,
              padding: '1px 6px', borderRadius: 99, minWidth: 18, textAlign: 'center',
              lineHeight: 1.4,
            }}>
              {activeCount}
            </span>
          )}
        </button>
        {activeCount > 0 && (
          <button
            onClick={() => setFilters(EMPTY_FILTERS)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 10, padding: '9px 14px', cursor: 'pointer',
              fontSize: 12, color: '#EF4444', fontWeight: 600, fontFamily: 'inherit',
            }}
          >
            <X size={12} /> Clear all
          </button>
        )}
      </div>

      {/* ── Expandable filter panel ── */}
      {showFilters && (
        <div style={{
          background: 'white', border: '1px solid #E5E7EB', borderRadius: 14,
          padding: '20px 24px', marginBottom: 12,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))',
          gap: '16px 18px',
        }}>
          <FSelect label="Position" value={filters.position}
            options={POSITIONS.map(p => ({ value: p, label: p }))}
            onChange={setFilter('position')} />
          <FSelect label="Age Range" value={filters.ageRange}
            options={AGE_RANGES.map(r => ({ value: r.label, label: r.label }))}
            onChange={setFilter('ageRange')} />
          <FSelect label="Contract Year" value={filters.contractYear}
            options={CONTRACT_YEARS.map(y => ({ value: y, label: y }))}
            onChange={setFilter('contractYear')} />
          <FInput label="Max Salary (€/mo)" value={filters.maxSalary}
            onChange={setFilter('maxSalary')} placeholder="e.g. 5000" type="number" />
          <FSelect label="Verification" value={filters.status}
            options={STATUSES.map(s => ({ value: s.value, label: s.label }))}
            onChange={setFilter('status')} />

          {/* ELO range — two side-by-side inputs */}
          <div>
            <label style={labelStyle}>ELO Range (1–99)</label>
            <div style={{ display: 'flex', gap: 6 }}>
              <input type="number" value={filters.eloMin} onChange={e => setFilter('eloMin')(e.target.value)}
                placeholder="Min" min={1} max={99}
                style={{ ...inputBase, width: '50%' }} />
              <input type="number" value={filters.eloMax} onChange={e => setFilter('eloMax')(e.target.value)}
                placeholder="Max" min={1} max={99}
                style={{ ...inputBase, width: '50%' }} />
            </div>
          </div>

          <FSelect label="Category" value={filters.category}
            options={[
              { value: 'MANAGED',     label: 'Managed'     },
              { value: 'MANDATE',     label: 'Mandate'     },
              { value: 'PROSPECTIVE', label: 'Prospective' },
            ]}
            onChange={setFilter('category')} />
          <FInput label="Country / Nationality" value={filters.country}
            onChange={setFilter('country')} placeholder="e.g. Spain" />
          <FInput label="League" value={filters.league}
            onChange={setFilter('league')} placeholder="e.g. LaLiga" />
          <FInput label="Current Club" value={filters.club}
            onChange={setFilter('club')} placeholder="e.g. Betis" />
        </div>
      )}

      {/* ── Active filter chips ── */}
      {activeCount > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 14 }}>
          {(Object.entries(filters) as [keyof Filters, string][])
            .filter(([k, v]) => k !== 'search' && v !== '')
            .map(([key, val]) => (
              <span key={key} style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                fontSize: 11, fontWeight: 600, padding: '3px 10px',
                borderRadius: 20,
                background: 'rgba(37,99,235,0.08)', color: G,
                border: '1px solid rgba(37,99,235,0.2)',
              }}>
                {val}
                <X size={10} style={{ cursor: 'pointer' }}
                  onClick={() => setFilter(key)('')} />
              </span>
            ))}
        </div>
      )}

      {/* ── Table ── */}
      <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 16, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, color: '#9CA3AF' }}>
            <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
            <span style={{ fontSize: 14 }}>Loading player database…</span>
            <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
          </div>
        ) : (
          <>
            <div className="polaris-desktop-table" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
                <thead>
                  <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                    {([
                      ['Player',       'fullName'          as SortField],
                      ['Category',     null               ],
                      ['Pos.',         null               ],
                      ['Club / League', null              ],
                      ['ELO',          'eloRating'         as SortField],
                      ['Age',          'age'               as SortField],
                      ['Contract',     null               ],
                      ['Salary',       'salaryExpectation' as SortField],
                      ['Status',       null               ],
                    ] as [string, SortField | null][]).map(([lbl, fld]) => (
                      <th key={lbl}
                        onClick={() => fld && toggleSort(fld)}
                        style={{
                          padding: '10px 16px', textAlign: 'left',
                          fontSize: 10, fontWeight: 700, color: '#9CA3AF',
                          textTransform: 'uppercase', letterSpacing: '0.06em',
                          cursor: fld ? 'pointer' : 'default', userSelect: 'none',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                          {lbl}{fld && <SortIcon field={fld} />}
                        </span>
                      </th>
                    ))}
                    <th style={{ padding: '10px 16px', width: 72 }} />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(p => {
                    const s = STATUS_STYLES[p.verificationStatus]
                    const expiringSoon = p.contractExpiry
                      ? new Date(p.contractExpiry) < new Date(Date.now() + 180 * 86400_000)
                      : false
                    const eloColor = (p.eloRating ?? 0) >= 80 ? '#059669'
                      : (p.eloRating ?? 0) >= 70 ? G : N
                    return (
                      <tr key={p.id}
                        style={{ borderTop: '1px solid #F3F4F6', cursor: 'default' }}
                        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#FAFAFA')}
                        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'white')}
                      >
                        {/* Player */}
                        <td style={{ padding: '13px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{
                              width: 34, height: 34, borderRadius: '50%',
                              background: N, color: G, fontSize: 11, fontWeight: 800,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              flexShrink: 0,
                            }}>
                              {p.fullName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p style={{ fontSize: 13, fontWeight: 700, color: N, margin: 0 }}>{p.fullName}</p>
                              <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0 }}>{p.nationality}</p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td style={{ padding: '13px 16px' }}>
                          {(() => {
                            const cat = CATEGORY_STYLES[p.category] ?? CATEGORY_STYLES['PROSPECTIVE']
                            return (
                              <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 20, background: cat.bg, color: cat.color, whiteSpace: 'nowrap' }}>
                                {cat.label}
                              </span>
                            )
                          })()}
                        </td>

                        {/* Position */}
                        <td style={{ padding: '13px 16px' }}>
                          {p.position
                            ? <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: 'rgba(37,99,235,0.08)', color: G }}>{p.position}</span>
                            : <span style={{ color: '#9CA3AF', fontSize: 12 }}>—</span>}
                        </td>

                        {/* Club / League */}
                        <td style={{ padding: '13px 16px' }}>
                          <p style={{ fontSize: 13, color: N, margin: 0, fontWeight: 500 }}>{p.currentClub ?? '—'}</p>
                          {p.currentLeague && <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0 }}>{p.currentLeague}</p>}
                        </td>

                        {/* ELO */}
                        <td style={{ padding: '13px 16px' }}>
                          {p.eloRating !== null ? (
                            <div style={{
                              width: 36, height: 36, borderRadius: '50%',
                              border: `2px solid ${eloColor}`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                              <span style={{ fontSize: 11, fontWeight: 900, color: eloColor }}>{p.eloRating}</span>
                            </div>
                          ) : <span style={{ color: '#9CA3AF', fontSize: 12 }}>—</span>}
                        </td>

                        {/* Age */}
                        <td style={{ padding: '13px 16px', fontSize: 13, color: '#374151', fontWeight: 500 }}>
                          {p.age ?? '—'}
                        </td>

                        {/* Contract */}
                        <td style={{ padding: '13px 16px' }}>
                          <span style={{ fontSize: 12, fontWeight: expiringSoon ? 700 : 400, color: expiringSoon ? '#EF4444' : '#374151', display: 'block' }}>
                            {p.contractExpiry ? new Date(p.contractExpiry).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : '—'}
                          </span>
                          {expiringSoon && <span style={{ fontSize: 9, color: '#EF4444', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Expiring soon</span>}
                        </td>

                        {/* Salary */}
                        <td style={{ padding: '13px 16px', fontSize: 13, color: '#374151' }}>
                          {p.salaryExpectation != null ? `€${p.salaryExpectation.toLocaleString()}/mo` : '—'}
                        </td>

                        {/* Status */}
                        <td style={{ padding: '13px 16px' }}>
                          <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 20, background: s.bg, color: s.color, whiteSpace: 'nowrap' }}>
                            {s.label}
                          </span>
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '13px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <a
                              href={`https://wa.me/?text=${encodeURIComponent(
                                `Hi, I'd like to present ${p.fullName}${p.position ? `, ${p.position}` : ''}${p.age ? `, ${p.age} years old` : ''}${p.currentClub ? `, currently at ${p.currentClub}` : ''}${p.eloRating ? `. ELO rating: ${p.eloRating}/99` : ''}. I think they could be a great fit. Let me know if you'd like more information or a full proposal.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Quick WhatsApp pitch"
                              style={{
                                width: 30, height: 30, borderRadius: 7,
                                background: 'rgba(37,211,102,0.1)',
                                border: '1px solid rgba(37,211,102,0.25)',
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0,
                              }}
                            >
                              <MessageCircle size={13} color="#25D366" />
                            </a>
                            <Link href={`/dashboard/players/${p.id}`}
                              style={{
                                fontSize: 12, fontWeight: 700, color: N,
                                textDecoration: 'none', padding: '5px 12px',
                                borderRadius: 7, border: '1px solid #E5E7EB',
                                whiteSpace: 'nowrap', display: 'inline-block',
                              }}>
                              View →
                            </Link>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* ── Mobile card list ── */}
            <div className="polaris-mobile-cards" style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 4px' }}>
              {filtered.map(p => {
                const s          = STATUS_STYLES[p.verificationStatus]
                const cat        = CATEGORY_STYLES[p.category] ?? CATEGORY_STYLES['PROSPECTIVE']
                const eloColor   = (p.eloRating ?? 0) >= 80 ? '#059669' : (p.eloRating ?? 0) >= 70 ? G : N
                const expiringSoon = p.contractExpiry
                  ? new Date(p.contractExpiry) < new Date(Date.now() + 180 * 86400_000)
                  : false
                return (
                  <div key={`m-${p.id}`} style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 14, padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                      <div style={{ width: 42, height: 42, borderRadius: '50%', background: N, color: G, fontSize: 13, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {p.fullName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 15, fontWeight: 800, color: N, margin: '0 0 2px', lineHeight: 1.2 }}>{p.fullName}</p>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                          {p.position && <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 5, background: 'rgba(37,99,235,0.1)', color: G }}>{p.position}</span>}
                          <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 20, background: cat.bg, color: cat.color }}>{cat.label}</span>
                        </div>
                      </div>
                      {p.eloRating !== null && (
                        <div style={{ width: 38, height: 38, borderRadius: '50%', border: `2px solid ${eloColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ fontSize: 12, fontWeight: 900, color: eloColor }}>{p.eloRating}</span>
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 12px', marginBottom: 12 }}>
                      <div><p style={{ fontSize: 9, color: '#9CA3AF', margin: '0 0 1px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Club</p><p style={{ fontSize: 12, color: N, margin: 0, fontWeight: 600 }}>{p.currentClub ?? '—'}</p></div>
                      <div><p style={{ fontSize: 9, color: '#9CA3AF', margin: '0 0 1px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Age</p><p style={{ fontSize: 12, color: N, margin: 0, fontWeight: 600 }}>{p.age ?? '—'}</p></div>
                      <div>
                        <p style={{ fontSize: 9, color: '#9CA3AF', margin: '0 0 1px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contract</p>
                        <p style={{ fontSize: 12, color: expiringSoon ? '#EF4444' : N, margin: 0, fontWeight: expiringSoon ? 700 : 600 }}>
                          {p.contractExpiry ? new Date(p.contractExpiry).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : '—'}
                        </p>
                      </div>
                      <div><p style={{ fontSize: 9, color: '#9CA3AF', margin: '0 0 1px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</p><span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 20, background: s.bg, color: s.color }}>{s.label}</span></div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(`Hi, I'd like to present ${p.fullName}${p.position ? `, ${p.position}` : ''}${p.age ? `, ${p.age} years old` : ''}${p.currentClub ? `, currently at ${p.currentClub}` : ''}. Let me know if you'd like a full proposal.`)}`}
                        target="_blank" rel="noopener noreferrer"
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px', background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.25)', borderRadius: 9, fontSize: 12, fontWeight: 700, color: '#25D366', textDecoration: 'none' }}
                      >
                        <MessageCircle size={13} /> WhatsApp
                      </a>
                      <Link href={`/dashboard/players/${p.id}`}
                        style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px', background: N, border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 700, color: 'white', textDecoration: 'none' }}
                      >
                        View Profile →
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>

            {filtered.length === 0 && (
              <div style={{ padding: 48, textAlign: 'center', color: '#9CA3AF', fontSize: 14 }}>
                {activeCount > 0
                  ? 'No players match the active filters — try adjusting your criteria.'
                  : 'No players in your database yet. Add your first player to get started.'}
              </div>
            )}

            <div style={{ padding: '10px 16px', borderTop: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FAFAFA' }}>
              <span style={{ fontSize: 12, color: '#9CA3AF' }}>
                {filtered.length} player{filtered.length !== 1 ? 's' : ''} shown
                {isManager && scope === 'all' && <span style={{ color: G, fontWeight: 600 }}> · Full agency view</span>}
              </span>
              {!isPremium && (
                <Link href="/pricing" style={{ fontSize: 12, color: N, fontWeight: 700, textDecoration: 'none' }}>
                  Upgrade for unlimited →
                </Link>
              )}
            </div>
          </>
        )}
      </div>

      {/* ── Add Player Modal ── */}
      {showAddModal && (
        <AddPlayerModal
          onClose={() => setShowAddModal(false)}
          onCreated={(p) => {
            setPlayers(prev => [p, ...prev])
            setShowAddModal(false)
          }}
        />
      )}
    </div>
    )}
    </div>
  )
}

// ─── AddPlayerModal ───────────────────────────────────────────────────────────

function AddPlayerModal({ onClose, onCreated }: {
  onClose: () => void
  onCreated: (player: Player) => void
}) {
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')
  const [form, setForm]       = useState({
    fullName:          '',
    position:          '',
    age:               '',
    nationality:       '',
    currentClub:       '',
    currentLeague:     '',
    contractExpiry:    '',
    salaryExpectation: '',
    height:            '',
    preferredFoot:     '',
    marketValue:       '',
    category:          'PROSPECTIVE',
    notes:             '',
  })

  function set(k: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.fullName.trim()) { setError('Full name is required.'); return }
    setSaving(true); setError('')
    try {
      const res = await fetch('/api/dashboard/players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName:          form.fullName.trim(),
          position:          form.position       || null,
          age:               form.age            ? parseInt(form.age)               : null,
          nationality:       form.nationality    || null,
          currentClub:       form.currentClub    || null,
          currentLeague:     form.currentLeague  || null,
          contractExpiry:    form.contractExpiry || null,
          salaryExpectation: form.salaryExpectation ? parseFloat(form.salaryExpectation) : null,
          height:            form.height         ? parseInt(form.height)            : null,
          preferredFoot:     form.preferredFoot  || null,
          marketValue:       form.marketValue    ? parseFloat(form.marketValue)    : null,
          category:          form.category,
          notes:             form.notes          || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Failed to create player.'); return }
      // Shape returned player to match local Player interface
      onCreated({
        id:                 data.player.id,
        fullName:           data.player.fullName,
        position:           data.player.position           ?? null,
        age:                data.player.age                ?? null,
        nationality:        data.player.nationality        ?? null,
        currentClub:        data.player.currentClub        ?? null,
        currentLeague:      data.player.currentLeague      ?? null,
        contractExpiry:     data.player.contractExpiry     ? new Date(data.player.contractExpiry).toISOString() : null,
        salaryExpectation:  data.player.salaryExpectation  ?? null,
        eloRating:          null,
        verificationStatus: 'UNDER_REVIEW',
        category:           (data.player.category ?? 'PROSPECTIVE') as PlayerCategory,
      })
    } finally { setSaving(false) }
  }

  const field: React.CSSProperties = {
    width: '100%', padding: '9px 12px', border: '1px solid #E5E7EB',
    borderRadius: 9, fontSize: 13, fontFamily: 'inherit', outline: 'none',
    boxSizing: 'border-box', color: N,
  }
  const label: React.CSSProperties = {
    fontSize: 10, fontWeight: 700, color: '#9CA3AF',
    textTransform: 'uppercase', letterSpacing: '0.06em',
    display: 'block', marginBottom: 5,
  }

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(10,22,40,0.5)', zIndex: 50 }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        zIndex: 51, width: '90%', maxWidth: 600, maxHeight: '90vh',
        background: 'white', borderRadius: 18, display: 'flex', flexDirection: 'column',
        fontFamily: 'var(--font-montserrat), sans-serif',
        boxShadow: '0 24px 80px rgba(10,22,40,0.25)',
      }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <p style={{ fontSize: 16, fontWeight: 800, color: N, margin: '0 0 2px' }}>Add Player</p>
            <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>Manually add a player to your portfolio</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}><X size={18} /></button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {error && <p style={{ fontSize: 13, color: '#EF4444', margin: '0 0 16px', padding: '10px 14px', background: 'rgba(239,68,68,0.06)', borderRadius: 8 }}>{error}</p>}

          {/* Row 1 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={label}>Full Name *</label>
              <input value={form.fullName} onChange={set('fullName')} placeholder="e.g. Carlos García" style={field} required />
            </div>
          </div>

          {/* Row 2 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={label}>Position</label>
              <select value={form.position} onChange={set('position')} style={field}>
                <option value="">—</option>
                {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label style={label}>Age</label>
              <input type="number" min={14} max={45} value={form.age} onChange={set('age')} placeholder="24" style={field} />
            </div>
            <div>
              <label style={label}>Height (cm)</label>
              <input type="number" min={150} max={220} value={form.height} onChange={set('height')} placeholder="180" style={field} />
            </div>
          </div>

          {/* Row 3 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={label}>Nationality</label>
              <input value={form.nationality} onChange={set('nationality')} placeholder="Spanish" style={field} />
            </div>
            <div>
              <label style={label}>Preferred Foot</label>
              <select value={form.preferredFoot} onChange={set('preferredFoot')} style={field}>
                <option value="">—</option>
                <option value="Right">Right</option>
                <option value="Left">Left</option>
                <option value="Both">Both</option>
              </select>
            </div>
          </div>

          {/* Row 4 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={label}>Current Club</label>
              <input value={form.currentClub} onChange={set('currentClub')} placeholder="FC Barcelona B" style={field} />
            </div>
            <div>
              <label style={label}>League</label>
              <input value={form.currentLeague} onChange={set('currentLeague')} placeholder="Segunda División" style={field} />
            </div>
          </div>

          {/* Row 5 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={label}>Contract Expiry</label>
              <input type="date" value={form.contractExpiry} onChange={set('contractExpiry')} style={field} />
            </div>
            <div>
              <label style={label}>Salary Expectation (€/mo)</label>
              <input type="number" min={0} value={form.salaryExpectation} onChange={set('salaryExpectation')} placeholder="5000" style={field} />
            </div>
          </div>

          {/* Row 6 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={label}>Market Value (€)</label>
              <input type="number" min={0} value={form.marketValue} onChange={set('marketValue')} placeholder="500000" style={field} />
            </div>
            <div>
              <label style={label}>Category</label>
              <select value={form.category} onChange={set('category')} style={field}>
                <option value="PROSPECTIVE">Prospective</option>
                <option value="MANDATE">Mandate</option>
                <option value="MANAGED">Managed</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div style={{ marginBottom: 6 }}>
            <label style={label}>Notes</label>
            <textarea value={form.notes} onChange={set('notes')} placeholder="Add any context…" rows={3}
              style={{ ...field, resize: 'vertical', lineHeight: 1.5 }} />
          </div>
        </form>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid #E5E7EB', display: 'flex', gap: 10, flexShrink: 0 }}>
          <button
            onClick={handleSubmit as unknown as React.MouseEventHandler}
            disabled={saving}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: N, color: 'white', border: 'none', borderRadius: 10, padding: '12px', fontWeight: 800, fontSize: 14, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: saving ? 0.7 : 1 }}
          >
            {saving ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Saving…</> : <><Plus size={15} /> Add to Portfolio</>}
          </button>
          <button onClick={onClose} style={{ padding: '12px 20px', background: '#F3F4F6', border: 'none', borderRadius: 10, fontSize: 14, color: '#6B7280', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}>Cancel</button>
        </div>
      </div>
    </>
  )
}
