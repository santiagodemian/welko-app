'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Sparkles, Loader2, Search, User, Star, ChevronRight, RotateCcw, Clock, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ParsedMandate {
  position: string
  preferredFoot: 'RIGHT' | 'LEFT' | 'ANY'
  maxBudget: number | null
  maxAge: number | null
  keyAttributes: string[]
  clubName: string | null
}

interface PlayerMatch {
  id: string
  fullName: string
  position: string | null
  age: number | null
  eloRating: number | null
  salaryExpectation: number | null
  preferredFoot: string | null
  nationality: string | null
  currentClub: string | null
  matchScore: number
  matchReasons: string[]
}

interface SavedMandate {
  id: string
  clubName: string
  rawText: string
  parsedPosition: string | null
  parsedBudget: number | null
  parsedAgeMax: number | null
  matchResults: { playerId: string; fullName: string; score: number; reasons: string[] }[] | null
  status: 'OPEN' | 'CLOSED'
  createdAt: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const N = '#0A1628'
const G = '#1E6FEB'

const EXAMPLE_PROMPTS = [
  'Need a right-footed center back, strong in aerial duels, under 30 years old, budget €10k/month max',
  'Looking for a pacey left winger, under 24, max €5,000/month, good dribbling',
  'Urgently need a goalkeeper, preferably left foot, max age 32, salary up to €8k',
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80 ? '#059669' :
    score >= 60 ? G :
    score >= 40 ? '#F59E0B' : '#EF4444'
  const bg =
    score >= 80 ? 'rgba(5,150,105,0.1)' :
    score >= 60 ? 'rgba(30,111,235,0.1)' :
    score >= 40 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)'
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', width: 64, height: 64, borderRadius: '50%',
      background: bg, border: `2px solid ${color}`, flexShrink: 0,
    }}>
      <span style={{ fontSize: 18, fontWeight: 900, color, lineHeight: 1 }}>{score}</span>
      <span style={{ fontSize: 9, fontWeight: 700, color, letterSpacing: '0.05em', textTransform: 'uppercase' }}>match</span>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div style={{ background: 'white', border: '1px solid #F3F4F6', borderRadius: 16, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#F3F4F6', flexShrink: 0 }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ width: '40%', height: 16, borderRadius: 6, background: '#F3F4F6' }} />
        <div style={{ width: '60%', height: 12, borderRadius: 6, background: '#F9FAFB' }} />
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ width: 60, height: 22, borderRadius: 20, background: '#F9FAFB' }} />
          <div style={{ width: 50, height: 22, borderRadius: 20, background: '#F9FAFB' }} />
          <div style={{ width: 70, height: 22, borderRadius: 20, background: '#F9FAFB' }} />
        </div>
      </div>
    </div>
  )
}

function ParsedTags({ parsed }: { parsed: ParsedMandate }) {
  const tags: { label: string; color: string; bg: string }[] = []
  if (parsed.position)
    tags.push({ label: parsed.position, color: '#2563EB', bg: '#EFF6FF' })
  if (parsed.preferredFoot && parsed.preferredFoot !== 'ANY')
    tags.push({ label: `${parsed.preferredFoot} foot`, color: '#7C3AED', bg: '#F5F3FF' })
  if (parsed.maxBudget)
    tags.push({ label: `Max €${parsed.maxBudget.toLocaleString()}/mo`, color: '#059669', bg: '#F0FDF4' })
  if (parsed.maxAge)
    tags.push({ label: `Max age ${parsed.maxAge}`, color: G, bg: 'rgba(30,111,235,0.08)' })
  parsed.keyAttributes?.forEach((attr) =>
    tags.push({ label: attr, color: '#6B7280', bg: '#F9FAFB' })
  )
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {tags.map((t, i) => (
        <span key={i} style={{
          fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 20,
          background: t.bg, color: t.color, border: `1px solid ${t.color}22`,
        }}>
          {t.label}
        </span>
      ))}
    </div>
  )
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins < 2)   return 'just now'
  if (mins < 60)  return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7)   return `${days}d ago`
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function MandatesPage() {
  const [rawText, setRawText]     = useState('')
  const [loading, setLoading]     = useState(false)
  const [parsed, setParsed]       = useState<ParsedMandate | null>(null)
  const [matches, setMatches]     = useState<PlayerMatch[] | null>(null)
  const [error, setError]         = useState<string | null>(null)
  const [history, setHistory]     = useState<SavedMandate[]>([])
  const [historyOpen, setHistoryOpen] = useState(true)
  const [deletingId, setDeletingId]   = useState<string | null>(null)
  const textareaRef               = useRef<HTMLTextAreaElement>(null)

  const fetchHistory = useCallback(() => {
    fetch('/api/dashboard/mandates')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d.mandates)) setHistory(d.mandates) })
      .catch(() => {})
  }, [])

  useEffect(() => { fetchHistory() }, [fetchHistory])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const text = rawText.trim()
    if (!text) return
    setLoading(true)
    setError(null)
    setParsed(null)
    setMatches(null)
    try {
      const res  = await fetch('/api/dashboard/mandates/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText: text }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Something went wrong.'); return }
      setParsed(data.parsed as ParsedMandate)
      setMatches(data.matches as PlayerMatch[])
      fetchHistory()
    } catch {
      setError('Network error — please check your connection and retry.')
    } finally {
      setLoading(false)
    }
  }

  function handleReset() {
    setRawText(''); setParsed(null); setMatches(null); setError(null)
    textareaRef.current?.focus()
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      await fetch(`/api/dashboard/mandates?id=${id}`, { method: 'DELETE' })
      setHistory(h => h.filter(m => m.id !== id))
    } finally {
      setDeletingId(null)
    }
  }

  function rerunMandate(mandate: SavedMandate) {
    setRawText(mandate.rawText)
    setParsed(null); setMatches(null); setError(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setTimeout(() => textareaRef.current?.focus(), 300)
  }

  const hasResults = matches !== null
  const showEmpty  = hasResults && matches.length === 0

  return (
    <div style={{ padding: 'clamp(20px,4vw,40px) clamp(16px,4vw,40px) 80px', fontFamily: 'var(--font-montserrat), sans-serif', maxWidth: 900 }}>
      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>

      {/* Page header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: N, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={16} color={G} />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: N, margin: 0 }}>AI Mandate Matcher</h1>
        </div>
        <p style={{ color: '#6B7280', margin: 0, fontSize: 14, lineHeight: 1.6 }}>
          Paste any club request — WhatsApp message, email, or scouting note. AgentOS parses it and ranks your players by fit.
        </p>
      </div>

      {/* Input panel */}
      <div style={{
        background: 'white', borderRadius: 20, padding: 28, marginBottom: 24,
        border: `1.5px solid ${hasResults ? '#E5E7EB' : N}`,
        boxShadow: hasResults ? 'none' : '0 4px 24px rgba(10,22,40,0.08)',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}>
        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: N, marginBottom: 10 }}>
            Paste Club Request{' '}
            <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(WhatsApp / Email / Scouting note)</span>
          </label>
          <textarea
            ref={textareaRef}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            disabled={loading}
            placeholder='"Need a right-footed center back, strong in aerial duels, under 30 years old, budget €10k max"'
            rows={4}
            style={{
              width: '100%', boxSizing: 'border-box', padding: '14px 16px',
              borderRadius: 12, fontSize: 14, lineHeight: 1.6, resize: 'vertical',
              fontFamily: 'var(--font-montserrat), sans-serif', color: N, outline: 'none',
              background: loading ? '#F9FAFB' : 'white', border: '1px solid #E5E7EB',
              transition: 'border-color 0.15s',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = G }}
            onBlur={(e)  => { e.currentTarget.style.borderColor = '#E5E7EB' }}
          />
          {!rawText && !hasResults && (
            <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600 }}>Try:</span>
              {EXAMPLE_PROMPTS.map((p, i) => (
                <button key={i} type="button"
                  onClick={() => { setRawText(p); textareaRef.current?.focus() }}
                  style={{
                    fontSize: 11, padding: '4px 10px', borderRadius: 20,
                    border: '1px solid #E5E7EB', background: '#F9FAFB', color: '#6B7280',
                    cursor: 'pointer', fontFamily: 'inherit', maxWidth: 260,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16 }}>
            <button type="submit" disabled={loading || !rawText.trim()}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: loading || !rawText.trim() ? '#E5E7EB' : N,
                color: loading || !rawText.trim() ? '#9CA3AF' : 'white',
                border: 'none', borderRadius: 10, padding: '12px 24px',
                fontWeight: 800, fontSize: 14, fontFamily: 'inherit',
                cursor: loading || !rawText.trim() ? 'not-allowed' : 'pointer',
                transition: 'background 0.15s',
              }}
            >
              {loading
                ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Analysing with AI…</>
                : <><Sparkles size={15} /> Find Matches</>}
            </button>
            {hasResults && (
              <button type="button" onClick={handleReset}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: 'transparent', border: '1px solid #E5E7EB',
                  borderRadius: 10, padding: '12px 18px', fontWeight: 600,
                  fontSize: 13, cursor: 'pointer', color: '#6B7280', fontFamily: 'inherit',
                }}
              >
                <RotateCcw size={13} /> New search
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: '14px 18px', marginBottom: 24, fontSize: 14, color: '#DC2626' }}>
          {error}
        </div>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#9CA3AF', marginBottom: 16 }}>
            Parsing mandate &amp; scanning player database…
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      )}

      {/* Results */}
      {hasResults && !loading && (
        <div>
          {parsed && (
            <div style={{
              background: `linear-gradient(135deg, ${N} 0%, #13244A 100%)`,
              borderRadius: 16, padding: '20px 24px', marginBottom: 24,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Search size={14} color={G} />
                <span style={{ fontSize: 12, fontWeight: 700, color: G, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  AI parsed requirements
                  {parsed.clubName && parsed.clubName !== 'Unknown Club' && (
                    <span style={{ color: 'rgba(255,255,255,0.5)', textTransform: 'none', fontWeight: 400, marginLeft: 8 }}>
                      · {parsed.clubName}
                    </span>
                  )}
                </span>
              </div>
              <ParsedTags parsed={parsed} />
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: N, margin: 0 }}>
              {showEmpty ? 'No matches found' : `${matches.length} player${matches.length !== 1 ? 's' : ''} matched`}
            </h2>
            {!showEmpty && <span style={{ fontSize: 12, color: '#9CA3AF' }}>sorted by match score</span>}
          </div>

          {showEmpty && (
            <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 16, padding: '48px 24px', textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#F3F4F6', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={24} color="#D1D5DB" />
              </div>
              <p style={{ fontSize: 15, fontWeight: 700, color: N, margin: '0 0 6px' }}>No players matched these requirements</p>
              <p style={{ fontSize: 13, color: '#9CA3AF', margin: '0 0 16px' }}>Add more players to your database, or try adjusting the mandate criteria.</p>
              <Link href="/dashboard/players" style={{ fontSize: 13, fontWeight: 700, color: G, textDecoration: 'none' }}>
                Add Players →
              </Link>
            </div>
          )}

          {!showEmpty && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {matches.map((player, index) => (
                <div key={player.id} style={{
                  background: 'white',
                  border: index === 0 ? `1.5px solid ${G}` : '1px solid #E5E7EB',
                  borderRadius: 16, padding: '20px 24px',
                  display: 'flex', alignItems: 'center', gap: 18,
                  position: 'relative',
                  boxShadow: index === 0 ? '0 4px 16px rgba(30,111,235,0.1)' : '0 1px 3px rgba(0,0,0,0.04)',
                }}>
                  {index === 0 && (
                    <span style={{
                      position: 'absolute', top: -12, left: 20,
                      background: G, color: '#fff', fontSize: 10, fontWeight: 800,
                      padding: '3px 10px', borderRadius: 20, letterSpacing: '0.05em',
                    }}>
                      BEST MATCH
                    </span>
                  )}
                  <ScoreBadge score={player.matchScore} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 15, fontWeight: 800, color: N }}>{player.fullName}</span>
                      {player.nationality && <span style={{ fontSize: 12, color: '#9CA3AF' }}>{player.nationality}</span>}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: player.matchReasons.length ? 8 : 0 }}>
                      {player.position && (
                        <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: '#EFF6FF', color: '#2563EB' }}>{player.position}</span>
                      )}
                      {player.age !== null && (
                        <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: '#F3F4F6', color: '#374151' }}>Age {player.age}</span>
                      )}
                      {player.eloRating !== null && (
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: 'rgba(30,111,235,0.1)', color: G, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Star size={10} /> ELO {player.eloRating}
                        </span>
                      )}
                      {player.preferredFoot && (
                        <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: '#F5F3FF', color: '#7C3AED' }}>{player.preferredFoot} foot</span>
                      )}
                      {player.salaryExpectation !== null && (
                        <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: '#F0FDF4', color: '#059669' }}>€{player.salaryExpectation.toLocaleString()}/mo</span>
                      )}
                      {player.currentClub && (
                        <span style={{ fontSize: 11, color: '#9CA3AF', padding: '3px 0' }}>{player.currentClub}</span>
                      )}
                    </div>
                    {player.matchReasons.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                        {player.matchReasons.map((r, j) => (
                          <span key={j} style={{ fontSize: 11, color: '#059669' }}>✓ {r}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <Link href={`/dashboard/players/${player.id}`}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      background: index === 0 ? N : '#F3F4F6',
                      color: index === 0 ? 'white' : N,
                      border: 'none', borderRadius: 10, padding: '10px 16px',
                      fontWeight: 700, fontSize: 13, cursor: 'pointer',
                      fontFamily: 'inherit', flexShrink: 0, whiteSpace: 'nowrap',
                      textDecoration: 'none',
                    }}>
                    View <ChevronRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Mandate History ── */}
      {history.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <button
            onClick={() => setHistoryOpen(o => !o)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, background: 'none',
              border: 'none', cursor: 'pointer', padding: '0 0 16px', fontFamily: 'inherit',
              width: '100%', textAlign: 'left',
            }}
          >
            <Clock size={15} color="#9CA3AF" />
            <span style={{ fontSize: 14, fontWeight: 700, color: N, flex: 1 }}>
              Recent Mandates
              <span style={{ fontSize: 12, fontWeight: 400, color: '#9CA3AF', marginLeft: 8 }}>{history.length}</span>
            </span>
            {historyOpen ? <ChevronUp size={14} color="#9CA3AF" /> : <ChevronDown size={14} color="#9CA3AF" />}
          </button>

          {historyOpen && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {history.map((m) => {
                const matchCount = Array.isArray(m.matchResults) ? m.matchResults.length : 0
                const topScore   = matchCount > 0 ? m.matchResults![0].score : null
                return (
                  <div key={m.id} style={{
                    background: 'white', border: '1px solid #E5E7EB', borderRadius: 14,
                    padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: N }}>
                          {m.clubName && m.clubName !== 'Unknown Club' ? m.clubName : (m.parsedPosition ?? 'Mandate')}
                        </span>
                        {m.parsedPosition && m.clubName !== 'Unknown Club' && (
                          <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: '#EFF6FF', color: '#2563EB' }}>
                            {m.parsedPosition}
                          </span>
                        )}
                        <span style={{
                          fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
                          background: m.status === 'OPEN' ? 'rgba(5,150,105,0.1)' : '#F3F4F6',
                          color: m.status === 'OPEN' ? '#059669' : '#9CA3AF',
                        }}>
                          {m.status}
                        </span>
                      </div>
                      <div style={{ display: 'flex', align: 'center', gap: 14, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 12, color: '#9CA3AF' }}>{timeAgo(m.createdAt)}</span>
                        {m.parsedBudget && (
                          <span style={{ fontSize: 12, color: '#6B7280' }}>Budget €{m.parsedBudget.toLocaleString()}/mo</span>
                        )}
                        {matchCount > 0 && (
                          <span style={{ fontSize: 12, fontWeight: 600, color: '#059669' }}>
                            {matchCount} match{matchCount !== 1 ? 'es' : ''}
                            {topScore !== null && ` · top ${topScore}/100`}
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                      <button
                        onClick={() => rerunMandate(m)}
                        style={{
                          fontSize: 12, fontWeight: 700, padding: '7px 14px', borderRadius: 8,
                          background: '#F3F4F6', color: N, border: 'none', cursor: 'pointer',
                          fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 5,
                        }}
                      >
                        <RotateCcw size={11} /> Re-run
                      </button>
                      <button
                        onClick={() => handleDelete(m.id)}
                        disabled={deletingId === m.id}
                        style={{
                          width: 32, height: 32, borderRadius: 8, background: 'transparent',
                          border: '1px solid #E5E7EB', cursor: 'pointer', display: 'flex',
                          alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                          opacity: deletingId === m.id ? 0.4 : 1,
                        }}
                      >
                        <Trash2 size={13} color="#EF4444" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
