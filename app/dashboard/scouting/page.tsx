'use client'

import { useState, useEffect } from 'react'
import { Eye, Plus, Star as _Star, TrendingUp as _TrendingUp, Search, Loader2, ChevronRight as _ChevronRight, X } from 'lucide-react'

const N = '#0A0A0A'
const G = '#2563EB'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ScoutingReport {
  id: string
  matchName: string
  league: string | null
  date: string
  overallRating: number
  techScore: number
  tactScore: number
  physScore: number
  mentScore: number
  verdict: string
  player: {
    fullName: string
    position: string | null
    currentClub: string | null
  }
  createdBy: {
    fullName: string
  }
  createdAt: string
}

interface PlayerOption {
  id: string
  fullName: string
  position: string | null
  currentClub: string | null
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function initials(name: string): string {
  return name
    .split(' ')
    .map(w => w[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

// ─── ScoreBar ─────────────────────────────────────────────────────────────────

function ScoreBar({ label, score }: { label: string; score: number }) {
  const pct = (score / 10) * 100
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </span>
        <span style={{ fontSize: 11, fontWeight: 700, color: N }}>{score}/10</span>
      </div>
      <div style={{ height: 4, borderRadius: 2, background: '#F3F4F6', overflow: 'hidden' }}>
        <div style={{ height: '100%', borderRadius: 2, background: G, width: `${pct}%`, transition: 'width 0.3s ease' }} />
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ScoutingPage() {
  const [reports,      setReports]      = useState<ScoutingReport[]>([])
  const [loading,      setLoading]      = useState(true)
  const [search,       setSearch]       = useState('')
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch('/api/dashboard/scouting')
      .then(r => r.json())
      .then(d => setReports((d as { reports?: ScoutingReport[] }).reports ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = reports.filter(r => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      r.player.fullName.toLowerCase().includes(q) ||
      r.matchName.toLowerCase().includes(q) ||
      (r.league ?? '').toLowerCase().includes(q) ||
      (r.player.currentClub ?? '').toLowerCase().includes(q)
    )
  })

  return (
    <div style={{ padding: 'clamp(20px,4vw,40px) clamp(16px,4vw,40px) 80px', fontFamily: 'var(--font-montserrat), sans-serif', maxWidth: 1000 }}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        @media (max-width: 640px) {
          .sc-scores { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%', background: G,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Eye size={20} color="white" />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: N, margin: 0, letterSpacing: '-0.02em' }}>
            Scouting Reports
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
          <Plus size={15} /> New Report
        </button>
      </div>

      {/* ── Search ── */}
      <div style={{ position: 'relative', marginBottom: 20, maxWidth: 420 }}>
        <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by player, match, or club…"
          style={{
            width: '100%', padding: '9px 14px 9px 38px', borderRadius: 10,
            border: '1px solid #E5E7EB', outline: 'none', fontSize: 13,
            boxSizing: 'border-box', fontFamily: 'var(--font-montserrat), sans-serif', color: N,
          }}
        />
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 64, color: '#9CA3AF' }}>
          <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
          <span style={{ fontSize: 14 }}>Loading reports…</span>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 24px' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%', background: 'rgba(37,99,235,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
          }}>
            <Eye size={28} color={G} />
          </div>
          <p style={{ fontSize: 16, fontWeight: 700, color: N, margin: '0 0 8px' }}>
            {search ? 'No reports match your search' : 'No scouting reports yet'}
          </p>
          <p style={{ fontSize: 14, color: '#9CA3AF', margin: '0 0 24px' }}>
            {search ? 'Try a different search term.' : 'Submit your first match observation report.'}
          </p>
          {!search && (
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: N, color: 'white', border: 'none', borderRadius: 10,
                padding: '11px 22px', cursor: 'pointer', fontWeight: 700,
                fontSize: 13, fontFamily: 'var(--font-montserrat), sans-serif',
              }}
            >
              <Plus size={15} /> New Report
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(report => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      )}

      {/* ── Add Report Modal ── */}
      {showAddModal && (
        <AddReportModal
          onClose={() => setShowAddModal(false)}
          onCreated={(r) => {
            setReports(prev => [r, ...prev])
            setShowAddModal(false)
          }}
        />
      )}
    </div>
  )
}

// ─── ReportCard ───────────────────────────────────────────────────────────────

function ReportCard({ report }: { report: ScoutingReport }) {
  const p = report.player
  return (
    <div style={{
      background: 'white', border: '1px solid #E5E7EB',
      borderRadius: 14, padding: '18px 20px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    }}>
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 12 }}>
        {/* Player avatar */}
        <div style={{
          width: 44, height: 44, borderRadius: '50%', background: N,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, fontSize: 13, fontWeight: 800, color: G,
        }}>
          {initials(p.fullName)}
        </div>

        {/* Player info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 3 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: N }}>{p.fullName}</span>
            {p.position && (
              <span style={{
                fontSize: 10, fontWeight: 700,
                background: 'rgba(37,99,235,0.08)', color: G,
                padding: '2px 7px', borderRadius: 20,
              }}>
                {p.position}
              </span>
            )}
          </div>
          {p.currentClub && (
            <span style={{ fontSize: 12, color: '#9CA3AF' }}>{p.currentClub}</span>
          )}
        </div>

        {/* Overall rating */}
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <div style={{ fontSize: 32, fontWeight: 900, color: G, lineHeight: 1 }}>
            {report.overallRating}
          </div>
          <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>/10</div>
        </div>
      </div>

      {/* Match info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: N }}>{report.matchName}</span>
        {report.league && (
          <span style={{ fontSize: 12, color: '#9CA3AF' }}>{report.league}</span>
        )}
        <span style={{ fontSize: 12, color: '#9CA3AF', marginLeft: 'auto' }}>
          {formatDate(report.date)}
        </span>
      </div>

      {/* 4 Quadrant score bars */}
      <div className="sc-scores" style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr',
        gap: 8, marginTop: 8, marginBottom: 10,
      }}>
        <ScoreBar label="Tech"  score={report.techScore} />
        <ScoreBar label="Tact"  score={report.tactScore} />
        <ScoreBar label="Phys"  score={report.physScore} />
        <ScoreBar label="Ment"  score={report.mentScore} />
      </div>

      {/* Verdict */}
      {report.verdict && (
        <p style={{
          fontSize: 12, color: '#6B7280', fontStyle: 'italic',
          margin: '0 0 10px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {report.verdict}
        </p>
      )}

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid #F3F4F6' }}>
        <span style={{ fontSize: 11, color: '#9CA3AF' }}>
          Reported by {report.createdBy.fullName}
        </span>
        <span style={{ fontSize: 11, color: '#9CA3AF' }}>
          {formatDate(report.createdAt)}
        </span>
      </div>
    </div>
  )
}

// ─── AddReportModal ───────────────────────────────────────────────────────────

function AddReportModal({ onClose, onCreated }: {
  onClose: () => void
  onCreated: (report: ScoutingReport) => void
}) {
  const [players,  setPlayers]  = useState<PlayerOption[]>([])
  const [saving,   setSaving]   = useState(false)
  const [error,    setError]    = useState('')
  const [form, setForm] = useState({
    playerId:      '',
    matchName:     '',
    league:        '',
    date:          new Date().toISOString().slice(0, 10),
    overallRating: 7,
    techScore:     7,
    tactScore:     7,
    physScore:     7,
    mentScore:     7,
    verdict:       '',
  })

  useEffect(() => {
    fetch('/api/dashboard/players')
      .then(r => r.json())
      .then(d => setPlayers((d as { players?: PlayerOption[] }).players ?? []))
      .catch(() => {})
  }, [])

  function setNum(k: 'overallRating' | 'techScore' | 'tactScore' | 'physScore' | 'mentScore') {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(f => ({ ...f, [k]: parseInt(e.target.value) || 1 }))
  }

  function set(k: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.playerId)    { setError('Please select a player.');      return }
    if (!form.matchName.trim()) { setError('Match name is required.'); return }
    if (!form.verdict.trim())   { setError('Verdict is required.');    return }
    setSaving(true); setError('')
    try {
      const res = await fetch('/api/dashboard/scouting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId:      form.playerId,
          matchName:     form.matchName.trim(),
          league:        form.league || null,
          date:          form.date,
          overallRating: form.overallRating,
          techScore:     form.techScore,
          tactScore:     form.tactScore,
          physScore:     form.physScore,
          mentScore:     form.mentScore,
          verdict:       form.verdict.trim(),
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError((data as { error?: string }).error ?? 'Failed to create report.'); return }
      onCreated((data as { report: ScoutingReport }).report)
    } finally {
      setSaving(false)
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

  const SCORE_FIELDS: { key: 'overallRating' | 'techScore' | 'tactScore' | 'physScore' | 'mentScore'; label: string }[] = [
    { key: 'overallRating', label: 'Overall Rating' },
    { key: 'techScore',     label: 'Technical'      },
    { key: 'tactScore',     label: 'Tactical'       },
    { key: 'physScore',     label: 'Physical'       },
    { key: 'mentScore',     label: 'Mental'         },
  ]

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(10,22,40,0.5)', zIndex: 50 }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        zIndex: 51, width: '90%', maxWidth: 520, maxHeight: '90vh',
        background: 'white', borderRadius: 18, display: 'flex', flexDirection: 'column',
        fontFamily: 'var(--font-montserrat), sans-serif',
        boxShadow: '0 24px 80px rgba(10,22,40,0.25)',
      }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <p style={{ fontSize: 16, fontWeight: 800, color: N, margin: '0 0 2px' }}>New Scouting Report</p>
            <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>Submit a match observation</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}>
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {error && (
            <p style={{ fontSize: 13, color: '#EF4444', margin: '0 0 16px', padding: '10px 14px', background: 'rgba(239,68,68,0.06)', borderRadius: 8 }}>
              {error}
            </p>
          )}

          {/* Player select */}
          <div style={{ marginBottom: 14 }}>
            <label style={lbl}>Player *</label>
            <select value={form.playerId} onChange={set('playerId')} style={{ ...f, cursor: 'pointer' }}>
              <option value="">— Select player —</option>
              {players.map(p => (
                <option key={p.id} value={p.id}>
                  {p.fullName}{p.position ? ` (${p.position})` : ''}{p.currentClub ? ` — ${p.currentClub}` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Match name */}
          <div style={{ marginBottom: 14 }}>
            <label style={lbl}>Match *</label>
            <input value={form.matchName} onChange={set('matchName')} placeholder="e.g. Real Madrid vs Barça — La Liga" style={f} required />
          </div>

          {/* League + Date */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={lbl}>League</label>
              <input value={form.league} onChange={set('league')} placeholder="La Liga" style={f} />
            </div>
            <div>
              <label style={lbl}>Date *</label>
              <input type="date" value={form.date} onChange={set('date')} style={f} required />
            </div>
          </div>

          {/* Score sliders */}
          <div style={{ marginBottom: 14 }}>
            {SCORE_FIELDS.map(({ key, label }) => (
              <div key={key} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <label style={{ ...lbl, marginBottom: 0 }}>{label}</label>
                  <span style={{ fontSize: 13, fontWeight: 800, color: G }}>
                    {form[key]}/10
                  </span>
                </div>
                <input
                  type="range" min={1} max={10} step={1}
                  value={form[key]}
                  onChange={setNum(key)}
                  style={{ width: '100%', accentColor: G, cursor: 'pointer' }}
                />
              </div>
            ))}
          </div>

          {/* Verdict */}
          <div style={{ marginBottom: 6 }}>
            <label style={lbl}>Verdict *</label>
            <textarea
              value={form.verdict}
              onChange={set('verdict')}
              placeholder="Analyst conclusion and recommendation…"
              rows={4}
              style={{ ...f, resize: 'vertical', lineHeight: 1.5 }}
              required
            />
          </div>
        </form>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid #E5E7EB', display: 'flex', gap: 10, flexShrink: 0 }}>
          <button
            onClick={handleSubmit as unknown as React.MouseEventHandler}
            disabled={saving}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              background: N, color: 'white', border: 'none', borderRadius: 10, padding: '12px',
              fontWeight: 800, fontSize: 14, cursor: saving ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-montserrat), sans-serif', opacity: saving ? 0.7 : 1,
            }}
          >
            {saving
              ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Saving…</>
              : <><Plus size={15} /> Submit Report</>}
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
