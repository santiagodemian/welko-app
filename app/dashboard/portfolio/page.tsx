'use client'

import { useState, useEffect, useRef } from 'react'
import { Download, Loader2, FileText, Users } from 'lucide-react'

const N = '#0A1628'
const G = '#1E6FEB'

interface BrandKit {
  logoUrl:         string | null
  primaryColor:    string | null
  accentColor:     string | null
  footerEmail:     string | null
  footerPhone:     string | null
  footerLocation:  string | null
}

interface Agency {
  name:     string
  brandKit: BrandKit | null
}

interface Player {
  id:             string
  fullName:       string
  position:       string | null
  nationality:    string | null
  currentClub:    string | null
  age:            number | null
  height:         number | null
  preferredFoot:  string | null
  marketValue:    number | null
  releaseFee:     number | null
  contractExpiry: string | null
  eloRating:      number | null
  category:       string
  seasonMatches:  number
  seasonGoals:    number
  seasonAssists:  number
  storedPhotoUrl: string | null
  photoUrl:       string | null
}

const CATEGORY_LABEL: Record<string, string> = {
  MANAGED:     'Managed',
  MANDATE:     'Mandate',
  PROSPECTIVE: 'Prospective',
}

function fmtDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
}

function fmtValue(v: number | null) {
  if (!v) return null
  if (v >= 1_000_000) return `€${(v / 1_000_000).toFixed(1)}M`
  return `€${(v / 1000).toFixed(0)}k`
}

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

function PlayerCard({ player, accent, primary }: { player: Player; accent: string; primary: string }) {
  const photo = player.storedPhotoUrl || player.photoUrl

  return (
    <div style={{
      background: 'white', border: '1px solid #E5E7EB', borderRadius: 14,
      overflow: 'hidden', pageBreakInside: 'avoid', breakInside: 'avoid',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    }}>
      {/* Colour bar */}
      <div style={{ height: 4, background: `linear-gradient(90deg, ${primary}, ${accent})` }} />
      <div style={{ padding: '16px 18px' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          {/* Photo */}
          <div style={{ width: 52, height: 52, borderRadius: '50%', overflow: 'hidden', background: '#F3F4F6', flexShrink: 0, border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo} alt={player.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
            ) : (
              <span style={{ fontSize: 16, fontWeight: 900, color: '#D1D5DB' }}>{initials(player.fullName)}</span>
            )}
          </div>
          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 14, fontWeight: 800, color: N, margin: '0 0 1px', lineHeight: 1.2 }}>{player.fullName}</p>
            <p style={{ fontSize: 11, color: '#6B7280', margin: '0 0 8px' }}>{player.currentClub ?? 'Free agent'}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 10px' }}>
              {player.position && <span style={{ fontSize: 10, fontWeight: 700, color: accent, background: `${accent}12`, padding: '2px 6px', borderRadius: 4 }}>{player.position}</span>}
              {player.nationality && <span style={{ fontSize: 10, color: '#9CA3AF' }}>{player.nationality}</span>}
              {player.age && <span style={{ fontSize: 10, color: '#9CA3AF' }}>{player.age} yrs</span>}
              {player.height && <span style={{ fontSize: 10, color: '#9CA3AF' }}>{player.height} cm</span>}
            </div>
          </div>
          {/* ELO */}
          {player.eloRating && (
            <div style={{ textAlign: 'center', flexShrink: 0 }}>
              <p style={{ fontSize: 22, fontWeight: 900, color: accent, margin: 0, letterSpacing: '-0.03em', lineHeight: 1 }}>{player.eloRating}</p>
              <p style={{ fontSize: 8, color: '#9CA3AF', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>ELO</p>
            </div>
          )}
        </div>

        {/* Stats row */}
        <div className="pdf-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 12, padding: '10px 0', borderTop: '1px solid #F3F4F6' }}>
          {[
            { label: 'Apps',     value: player.seasonMatches || '—' },
            { label: 'Goals',    value: player.seasonGoals   || '—' },
            { label: 'Assists',  value: player.seasonAssists || '—' },
            { label: 'Contract', value: fmtDate(player.contractExpiry) },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 16, fontWeight: 900, color: N, margin: 0, letterSpacing: '-0.03em' }}>{s.value}</p>
              <p style={{ fontSize: 9, color: '#9CA3AF', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Value row */}
        {(player.marketValue || player.releaseFee) && (
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            {player.marketValue && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: `${G}08`, border: `1px solid ${G}20`, borderRadius: 6, padding: '4px 10px' }}>
                <span style={{ fontSize: 9, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Value</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: G }}>{fmtValue(player.marketValue)}</span>
              </div>
            )}
            {player.releaseFee && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(5,150,105,0.06)', border: '1px solid rgba(5,150,105,0.2)', borderRadius: 6, padding: '4px 10px' }}>
                <span style={{ fontSize: 9, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Release</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#059669' }}>{fmtValue(player.releaseFee)}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function PortfolioPage() {
  const [agency,  setAgency]  = useState<Agency | null>(null)
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const printRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/dashboard/portfolio-pdf')
      .then(r => r.json())
      .then(d => { setAgency(d.agency); setPlayers(d.players ?? []) })
      .finally(() => setLoading(false))
  }, [])

  const primary  = agency?.brandKit?.primaryColor ?? N
  const accent   = agency?.brandKit?.accentColor  ?? G
  const logoUrl  = agency?.brandKit?.logoUrl ?? null

  const categories = ['MANAGED', 'MANDATE', 'PROSPECTIVE'] as const

  function handleExport() {
    window.print()
  }

  const grouped = categories
    .map(cat => ({ cat, list: players.filter(p => p.category === cat) }))
    .filter(g => g.list.length > 0)

  return (
    <>
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 14mm; }
          .no-print { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        @media (max-width: 600px) {
          .pdf-grid  { grid-template-columns: 1fr !important; }
          .pdf-stats { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      {/* ── Screen header (hidden when printing) ── */}
      <div className="no-print" style={{ padding: 'clamp(20px,4vw,40px) clamp(16px,4vw,40px) 24px', fontFamily: 'var(--font-montserrat), sans-serif', maxWidth: 1000 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `${G}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={18} color={G} />
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: N, margin: 0, letterSpacing: '-0.03em' }}>Agency Portfolio PDF</h1>
          </div>
          <button
            onClick={handleExport}
            disabled={loading || players.length === 0}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: N, color: 'white', border: 'none', borderRadius: 12, padding: '11px 20px', cursor: loading || players.length === 0 ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 800, fontFamily: 'inherit', opacity: loading || players.length === 0 ? 0.5 : 1 }}
          >
            {loading
              ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Loading…</>
              : <><Download size={15} /> Export PDF</>}
          </button>
        </div>
        <p style={{ color: '#9CA3AF', margin: 0, fontSize: 14 }}>
          {players.length} player{players.length !== 1 ? 's' : ''} across your portfolio · Print or save as PDF using your browser
        </p>
      </div>

      {/* ── Printable content ── */}
      <div ref={printRef} style={{ padding: '0 clamp(16px,4vw,40px) 80px', maxWidth: 1000, fontFamily: 'var(--font-montserrat), sans-serif' }}>

        {/* Cover header */}
        <div style={{ background: `linear-gradient(135deg, ${primary} 0%, #0D1F3C 100%)`, borderRadius: 16, padding: '28px 32px', marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt={agency?.name} style={{ height: 40, objectFit: 'contain', marginBottom: 8 }} />
            ) : (
              <p style={{ fontSize: 20, fontWeight: 900, color: accent, margin: '0 0 4px', letterSpacing: '-0.03em' }}>
                {agency?.name ?? 'Agency'}
              </p>
            )}
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: 0 }}>Player Portfolio · {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `${accent}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={22} color={accent} />
            </div>
            <div>
              <p style={{ fontSize: 28, fontWeight: 900, color: 'white', margin: 0, letterSpacing: '-0.04em', lineHeight: 1 }}>{players.length}</p>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Players</p>
            </div>
          </div>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: 64, color: '#9CA3AF' }}>
            <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 12px', display: 'block' }} />
            <p style={{ fontSize: 14, margin: 0 }}>Loading portfolio…</p>
          </div>
        )}

        {!loading && players.length === 0 && (
          <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 14, padding: 48, textAlign: 'center' }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: N, margin: '0 0 6px' }}>No players yet</p>
            <p style={{ fontSize: 13, color: '#9CA3AF', margin: 0 }}>Add players to your portfolio first.</p>
          </div>
        )}

        {/* Player groups */}
        {!loading && grouped.map(({ cat, list }) => (
          <div key={cat} style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <h2 style={{ fontSize: 13, fontWeight: 800, color: N, margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {CATEGORY_LABEL[cat]}
              </h2>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', background: '#F3F4F6', padding: '2px 8px', borderRadius: 20 }}>{list.length}</span>
              <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
            </div>
            <div className="pdf-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              {list.map(p => (
                <PlayerCard key={p.id} player={p} accent={accent} primary={primary} />
              ))}
            </div>
          </div>
        ))}

        {/* Footer */}
        {!loading && players.length > 0 && (
          <div style={{ marginTop: 24, borderTop: '1px solid #E5E7EB', paddingTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {agency?.brandKit?.footerEmail && <span style={{ fontSize: 11, color: '#9CA3AF' }}>{agency.brandKit.footerEmail}</span>}
              {agency?.brandKit?.footerPhone && <span style={{ fontSize: 11, color: '#9CA3AF' }}>{agency.brandKit.footerPhone}</span>}
              {agency?.brandKit?.footerLocation && <span style={{ fontSize: 11, color: '#9CA3AF' }}>{agency.brandKit.footerLocation}</span>}
            </div>
            <span style={{ fontSize: 10, color: '#D1D5DB' }}>Powered by Welko AgentOS</span>
          </div>
        )}
      </div>
    </>
  )
}
