'use client'

import { useState, useCallback } from 'react'
import { Search, Plus, Check, Loader2, Globe, ExternalLink, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

const N = '#0A0A0A'
const G = '#2563EB'

interface GlobalPlayer {
  externalId:  string
  fullName:    string
  club:        string | null
  nationality: string | null
  position:    string | null
  photoUrl:    string | null
  age:         number | null
  height:      string | null
  inPortfolio: boolean
  portfolioId: string | null
}

export default function GlobalSearchPage() {
  const [query, setQuery]         = useState('')
  const [results, setResults]     = useState<GlobalPlayer[]>([])
  const [loading, setLoading]     = useState(false)
  const [searched, setSearched]   = useState(false)
  const [adding, setAdding]       = useState<string | null>(null)
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null)

  const doSearch = useCallback(async (q: string) => {
    if (q.trim().length < 2) return
    setLoading(true)
    setSearched(true)
    try {
      const res  = await fetch(`/api/dashboard/search?q=${encodeURIComponent(q.trim())}`)
      const data = await res.json()
      setResults(data.results ?? [])
      if (data.hasApiKey !== undefined) setHasApiKey(data.hasApiKey)
    } finally {
      setLoading(false)
    }
  }, [])

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter') doSearch(query)
  }

  async function addToPortfolio(player: GlobalPlayer) {
    setAdding(player.externalId)
    try {
      const res = await fetch('/api/dashboard/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          externalId:  player.externalId,
          fullName:    player.fullName,
          club:        player.club,
          nationality: player.nationality,
          position:    player.position,
          photoUrl:    player.photoUrl,
          age:         player.age,
          height:      player.height,
        }),
      })
      const data = await res.json()
      if (res.ok || res.status === 409) {
        const pid = data.player?.id ?? data.existingId
        setResults(prev => prev.map(p =>
          p.externalId === player.externalId
            ? { ...p, inPortfolio: true, portfolioId: pid ?? p.portfolioId }
            : p
        ))
      }
    } finally {
      setAdding(null)
    }
  }

  return (
    <div style={{ padding: 'clamp(20px,4vw,40px) clamp(16px,4vw,40px) 80px', fontFamily: 'var(--font-montserrat), sans-serif', maxWidth: 900 }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `${G}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Globe size={18} color={G} />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: N, margin: 0, letterSpacing: '-0.03em' }}>Global Player Search</h1>
        </div>
        <p style={{ color: '#9CA3AF', margin: 0, fontSize: 14 }}>
          Search professional players worldwide and add them to your portfolio in one click.
        </p>
      </div>

      {/* API key setup banner */}
      {hasApiKey === false && (
        <div style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 12, padding: '14px 18px', marginBottom: 20, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <AlertTriangle size={16} color="#F59E0B" style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#92400E', margin: '0 0 4px' }}>Limited search — only top-level players visible</p>
            <p style={{ fontSize: 12, color: '#78350F', margin: '0 0 8px', lineHeight: 1.5 }}>
              You&apos;re using the free fallback (TheSportsDB), which only returns 1 result per search and misses most players.
              Add a free <strong>RapidAPI key</strong> to unlock full search across 100,000+ players.
            </p>
            <p style={{ fontSize: 11, color: '#92400E', margin: 0, lineHeight: 1.6 }}>
              1. Go to <strong>rapidapi.com</strong> → sign up free → search &quot;API-Football&quot; → subscribe to the free plan (100 req/day)<br />
              2. Copy your RapidAPI key → add <code style={{ background: 'rgba(0,0,0,0.08)', padding: '1px 5px', borderRadius: 4 }}>RAPIDAPI_KEY=your_key_here</code> to your <code style={{ background: 'rgba(0,0,0,0.08)', padding: '1px 5px', borderRadius: 4 }}>.env.local</code> file<br />
              3. Restart the dev server
            </p>
          </div>
        </div>
      )}

      {/* Search bar */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Search by player name — e.g. Pedri, Bellingham, Lamine Yamal…"
            style={{
              width: '100%', padding: '12px 16px 12px 44px',
              borderRadius: 12, border: '1px solid #E5E7EB',
              fontSize: 14, fontFamily: 'inherit', outline: 'none',
              boxSizing: 'border-box', color: N,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
          />
        </div>
        <button
          onClick={() => doSearch(query)}
          disabled={loading || query.trim().length < 2}
          style={{
            padding: '12px 24px', borderRadius: 12, background: N, color: 'white',
            border: 'none', cursor: loading || query.trim().length < 2 ? 'not-allowed' : 'pointer',
            fontSize: 14, fontWeight: 800, fontFamily: 'inherit',
            opacity: query.trim().length < 2 ? 0.5 : 1,
            display: 'flex', alignItems: 'center', gap: 8,
          }}
        >
          {loading ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Search size={15} />}
          Search
        </button>
        <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
      </div>

      {loading && (
        <div style={{ padding: 48, textAlign: 'center', color: '#9CA3AF' }}>
          <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 12px', display: 'block' }} />
          <p style={{ fontSize: 14, margin: 0 }}>Searching player database…</p>
        </div>
      )}

      {!loading && searched && results.length === 0 && (
        <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 14, padding: 48, textAlign: 'center' }}>
          <p style={{ fontSize: 28, margin: '0 0 8px' }}>🔍</p>
          <p style={{ fontSize: 15, fontWeight: 700, color: N, margin: '0 0 4px' }}>No players found</p>
          <p style={{ fontSize: 13, color: '#9CA3AF', margin: '0 0 20px' }}>
            {hasApiKey
              ? 'Try a different spelling or search by last name only.'
              : 'Without an API key only top-level players are searchable. Try adding them manually instead.'}
          </p>
          <Link href="/dashboard/players" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: N, color: 'white', textDecoration: 'none', padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 700 }}>
            Add player manually →
          </Link>
        </div>
      )}

      {!loading && results.length > 0 && (
        <>
          <p style={{ fontSize: 12, color: '#9CA3AF', margin: '0 0 14px', fontWeight: 600 }}>
            {results.length} player{results.length !== 1 ? 's' : ''} found
            {hasApiKey ? ' · via API-Football' : ' · via TheSportsDB (limited)'}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {results.map(player => {
              const isAdded  = player.inPortfolio
              const isAdding = adding === player.externalId

              return (
                <div key={player.externalId} style={{
                  background: 'white', border: `1px solid ${isAdded ? 'rgba(5,150,105,0.25)' : '#E5E7EB'}`,
                  borderRadius: 14, padding: '16px 20px',
                  display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                }}>
                  {/* Photo */}
                  <div style={{ width: 52, height: 52, borderRadius: '50%', overflow: 'hidden', background: '#F3F4F6', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E5E7EB' }}>
                    {player.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={player.photoUrl} alt={player.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
                    ) : (
                      <span style={{ fontSize: 18, fontWeight: 900, color: '#D1D5DB' }}>
                        {player.fullName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <p style={{ fontSize: 14, fontWeight: 800, color: N, margin: 0 }}>{player.fullName}</p>
                      {player.position && (
                        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 6, background: `${G}10`, color: G }}>
                          {player.position}
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                      {player.club        && <span style={{ fontSize: 12, color: '#374151', fontWeight: 500 }}>{player.club}</span>}
                      {player.nationality && <span style={{ fontSize: 12, color: '#9CA3AF' }}>{player.nationality}</span>}
                      {player.age !== null && <span style={{ fontSize: 12, color: '#9CA3AF' }}>{player.age} yrs</span>}
                      {player.height      && <span style={{ fontSize: 12, color: '#9CA3AF' }}>{player.height}</span>}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    {isAdded ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: '#059669', background: 'rgba(5,150,105,0.08)', padding: '6px 12px', borderRadius: 20, border: '1px solid rgba(5,150,105,0.2)' }}>
                          <Check size={12} strokeWidth={3} /> In Portfolio
                        </span>
                        {player.portfolioId && (
                          <Link href={`/dashboard/players/${player.portfolioId}`}
                            style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: N, textDecoration: 'none', padding: '6px 12px', borderRadius: 20, border: '1px solid #E5E7EB', background: 'white' }}
                          >
                            View <ExternalLink size={11} />
                          </Link>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => addToPortfolio(player)}
                        disabled={isAdding}
                        style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: 10, background: N, color: 'white', border: 'none', cursor: isAdding ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'inherit', opacity: isAdding ? 0.7 : 1 }}
                      >
                        {isAdding
                          ? <><Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> Adding…</>
                          : <><Plus size={13} /> Add to Portfolio</>}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
          <p style={{ fontSize: 11, color: '#D1D5DB', textAlign: 'center', marginTop: 20 }}>
            {hasApiKey ? 'Player data from API-Football · Photos and stats may not be complete for all leagues' : 'Player data from TheSportsDB · Add RAPIDAPI_KEY to your .env.local for full search coverage'}
          </p>
        </>
      )}

      {!loading && !searched && (
        <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 14, padding: '48px 40px', textAlign: 'center' }}>
          <Globe size={40} color="#E5E7EB" style={{ margin: '0 auto 16px', display: 'block' }} />
          <p style={{ fontSize: 16, fontWeight: 700, color: N, margin: '0 0 8px' }}>Search the world&apos;s players</p>
          <p style={{ fontSize: 13, color: '#9CA3AF', margin: '0 auto', maxWidth: 380, lineHeight: 1.6 }}>
            Type a player name above and hit Search. Their profile, club, nationality, and position will be pre-filled automatically.
          </p>
        </div>
      )}
    </div>
  )
}
