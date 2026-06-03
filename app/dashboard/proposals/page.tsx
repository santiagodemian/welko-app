'use client'

import { useState, useEffect } from 'react'
import { FileText, ExternalLink, Loader2, Search } from 'lucide-react'
import Link from 'next/link'

const N = '#0A1628'
const G = '#1E6FEB'

interface Player {
  id:             string
  fullName:       string
  position:       string | null
  nationality:    string | null
  currentClub:    string | null
  eloRating:      number | null
  contractExpiry: string | null
  category:       string
  storedPhotoUrl: string | null
  photoUrl:       string | null
}

const CATEGORY_COLOR: Record<string, string> = {
  MANAGED:     '#059669',
  MANDATE:     G,
  PROSPECTIVE: '#6B7280',
}

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

export default function ProposalsPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')

  useEffect(() => {
    fetch('/api/dashboard/players')
      .then(r => r.json())
      .then(d => setPlayers(d.players ?? []))
      .finally(() => setLoading(false))
  }, [])

  const filtered = players.filter(p =>
    !search || p.fullName.toLowerCase().includes(search.toLowerCase()) ||
    (p.currentClub ?? '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ padding: 'clamp(20px,4vw,40px) clamp(16px,4vw,40px) 80px', fontFamily: 'var(--font-montserrat), sans-serif', maxWidth: 1000 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `${G}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={18} color={G} />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: N, margin: 0, letterSpacing: '-0.03em' }}>Player Proposals</h1>
        </div>
      </div>
      <p style={{ color: '#9CA3AF', margin: '0 0 24px', fontSize: 14 }}>
        Select any player to open their Presentation Studio and generate a branded PDF proposal.
      </p>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 20, maxWidth: 400 }}>
        <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search players…"
          style={{ width: '100%', padding: '9px 14px 9px 36px', border: '1px solid #E5E7EB', borderRadius: 10, fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', color: N }}
        />
      </div>

      {loading ? (
        <div style={{ padding: 64, textAlign: 'center', color: '#9CA3AF' }}>
          <Loader2 size={22} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 12px', display: 'block' }} />
          <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 14, padding: 48, textAlign: 'center' }}>
          <FileText size={36} color="#E5E7EB" style={{ margin: '0 auto 12px', display: 'block' }} />
          <p style={{ fontSize: 15, fontWeight: 700, color: N, margin: '0 0 6px' }}>
            {search ? 'No players match your search' : 'No players in your portfolio yet'}
          </p>
          <p style={{ fontSize: 13, color: '#9CA3AF', margin: '0 0 20px' }}>
            {search ? 'Try a different name or club.' : 'Add players first, then generate proposals here.'}
          </p>
          {!search && (
            <Link href="/dashboard/players" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: N, color: 'white', textDecoration: 'none', padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 700 }}>
              Go to Players →
            </Link>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
          {filtered.map(p => {
            const photo = p.storedPhotoUrl || p.photoUrl
            const catColor = CATEGORY_COLOR[p.category] ?? '#6B7280'

            return (
              <Link
                key={p.id}
                href={`/dashboard/players/${p.id}`}
                style={{ textDecoration: 'none', display: 'block' }}
              >
                <div
                  style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 14, padding: '16px 18px', cursor: 'pointer', transition: 'border-color 0.15s, box-shadow 0.15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = G; (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 16px ${G}18` }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#E5E7EB'; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', background: N, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #E5E7EB' }}>
                      {photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={photo} alt={p.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
                      ) : (
                        <span style={{ fontSize: 13, fontWeight: 900, color: G }}>{initials(p.fullName)}</span>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 800, color: N, margin: '0 0 2px', lineHeight: 1.2 }}>{p.fullName}</p>
                      <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0 }}>{p.currentClub ?? 'Free agent'}</p>
                    </div>
                    {p.eloRating && (
                      <span style={{ fontSize: 13, fontWeight: 900, color: G, flexShrink: 0 }}>{p.eloRating}</span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                    {p.position && (
                      <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 5, background: `${G}10`, color: G }}>{p.position}</span>
                    )}
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 5, background: `${catColor}12`, color: catColor }}>{p.category.charAt(0) + p.category.slice(1).toLowerCase()}</span>
                    {p.contractExpiry && (
                      <span style={{ fontSize: 10, color: '#9CA3AF' }}>Until {new Date(p.contractExpiry).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}</span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', background: `${G}08`, borderRadius: 8, border: `1px solid ${G}20` }}>
                    <FileText size={12} color={G} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: G, flex: 1 }}>Open Presentation Studio</span>
                    <ExternalLink size={11} color={G} />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <p style={{ fontSize: 11, color: '#D1D5DB', textAlign: 'center', marginTop: 20 }}>
          {filtered.length} player{filtered.length !== 1 ? 's' : ''} · Click any card to open the studio and export a PDF proposal
        </p>
      )}
    </div>
  )
}
