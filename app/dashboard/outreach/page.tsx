'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Target, Plus, X, Loader2, Phone, Mail, Video,
  MessageSquare, Users, Clock, ArrowUpRight, RefreshCw,
} from 'lucide-react'
import Link from 'next/link'

const N = '#0A1628'
const G = '#1E6FEB'

// ─── Types ────────────────────────────────────────────────────────────────────

type OutreachStatus =
  | 'NOT_CONTACTED'
  | 'MESSAGED'
  | 'REPLIED'
  | 'FOLLOW_UP'
  | 'SITUATION_KNOWN'
  | 'PROPOSAL_SENT'
  | 'NOT_INTERESTED'

interface LatestLog {
  id: string
  title: string
  type: string
  outcome: string
  timestamp: string
}

interface OutreachPlayer {
  id: string
  fullName: string
  position: string | null
  age: number | null
  nationality: string | null
  currentClub: string | null
  currentLeague: string | null
  contractExpiry: string | null
  eloRating: number | null
  category: string
  verificationStatus: string
  storedPhotoUrl: string | null
  photoUrl: string | null
  outreachStatus: OutreachStatus
  contactCount: number
  latestLog: LatestLog | null
}

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<OutreachStatus, { label: string; bg: string; color: string; dot: string }> = {
  NOT_CONTACTED:  { label: 'No Contact',       bg: '#F3F4F6',                   color: '#6B7280', dot: '#D1D5DB' },
  MESSAGED:       { label: 'Messaged',          bg: 'rgba(30,111,235,0.1)',      color: '#1E6FEB', dot: '#1E6FEB' },
  REPLIED:        { label: 'Replied',           bg: 'rgba(34,197,94,0.12)',      color: '#16A34A', dot: '#22C55E' },
  FOLLOW_UP:      { label: 'Follow-up',         bg: 'rgba(245,158,11,0.12)',     color: '#D97706', dot: '#F59E0B' },
  SITUATION_KNOWN:{ label: 'Situation Known',   bg: 'rgba(124,58,237,0.1)',      color: '#7C3AED', dot: '#7C3AED' },
  PROPOSAL_SENT:  { label: 'Proposal Sent',     bg: 'rgba(6,182,212,0.1)',       color: '#0891B2', dot: '#06B6D4' },
  NOT_INTERESTED: { label: 'Not Interested',    bg: 'rgba(239,68,68,0.1)',       color: '#DC2626', dot: '#EF4444' },
}

const STATUS_ORDER: OutreachStatus[] = [
  'NOT_CONTACTED', 'MESSAGED', 'REPLIED', 'FOLLOW_UP',
  'SITUATION_KNOWN', 'PROPOSAL_SENT', 'NOT_INTERESTED',
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function fmtRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7)  return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return `${Math.floor(days / 30)}mo ago`
}

function contractUrgency(iso: string | null): string {
  if (!iso) return '#9CA3AF'
  const months = (new Date(iso).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30)
  if (months < 0)   return '#EF4444'
  if (months < 3)   return '#F59E0B'
  if (months < 6)   return '#1E6FEB'
  return '#6B7280'
}

function TypeIcon({ type }: { type: string }) {
  const s = { size: 12, color: G }
  switch (type) {
    case 'CALL':       return <Phone {...s} />
    case 'EMAIL':      return <Mail {...s} />
    case 'VIDEO_CALL': return <Video {...s} />
    case 'MEETING':    return <Users {...s} />
    default:           return <MessageSquare {...s} />
  }
}

function PlayerAvatar({ player }: { player: OutreachPlayer }) {
  const url = player.storedPhotoUrl ?? player.photoUrl
  if (url) {
    return <img src={url} alt={player.fullName} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
  }
  const initials = player.fullName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
  return (
    <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${G}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <span style={{ fontSize: 12, fontWeight: 700, color: G, fontFamily: 'var(--font-montserrat)' }}>{initials}</span>
    </div>
  )
}

// ─── Log Contact Modal ────────────────────────────────────────────────────────

const INPUT_STYLE: React.CSSProperties = {
  width: '100%', padding: '9px 12px', border: '1.5px solid #E5E7EB',
  borderRadius: 8, fontSize: 13, fontFamily: 'var(--font-montserrat)',
  outline: 'none', boxSizing: 'border-box', color: N,
}
const LABEL_STYLE: React.CSSProperties = {
  display: 'block', fontSize: 11, fontWeight: 700, color: '#6B7280',
  marginBottom: 4, letterSpacing: '0.06em', textTransform: 'uppercase',
  fontFamily: 'var(--font-montserrat)',
}

function LogContactModal({
  player, onClose, onSaved,
}: {
  player: OutreachPlayer
  onClose: () => void
  onSaved: () => void
}) {
  const [title,     setTitle]     = useState(`DM ${player.fullName}`)
  const [summary,   setSummary]   = useState('')
  const [type,      setType]      = useState('MESSAGE')
  const [outcome,   setOutcome]   = useState('NEUTRAL')
  const [timestamp, setTimestamp] = useState(() => {
    const d = new Date(); d.setSeconds(0, 0); return d.toISOString().slice(0, 16)
  })
  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) { setError('Title is required'); return }
    setSaving(true); setError('')
    try {
      const res = await fetch('/api/dashboard/workspace?resource=communications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(), summary: summary.trim() || title.trim(),
          type, outcome, timestamp, playerId: player.id,
        }),
      })
      if (!res.ok) { const d = await res.json(); setError(d.error ?? 'Save failed'); return }
      onSaved(); onClose()
    } catch { setError('Network error') }
    finally { setSaving(false) }
  }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(10,22,40,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16, width: 460, maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', fontFamily: 'var(--font-montserrat)' }}>
        <div style={{ padding: '22px 26px' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <PlayerAvatar player={player} />
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: N, margin: 0 }}>{player.fullName}</p>
                <p style={{ fontSize: 11, color: '#6B7280', margin: 0 }}>{player.position ?? '—'} · {player.currentClub ?? '—'}</p>
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}><X size={18} color="#9CA3AF" /></button>
          </div>

          {error && <p style={{ fontSize: 12, color: '#EF4444', marginBottom: 12 }}>{error}</p>}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <label>
                <span style={LABEL_STYLE}>Contact Title *</span>
                <input style={INPUT_STYLE} value={title} onChange={e => setTitle(e.target.value)} />
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <label>
                  <span style={LABEL_STYLE}>Platform / Type</span>
                  <select style={INPUT_STYLE} value={type} onChange={e => setType(e.target.value)}>
                    <option value="MESSAGE">Instagram / WhatsApp DM</option>
                    <option value="EMAIL">Email</option>
                    <option value="CALL">Phone Call</option>
                    <option value="VIDEO_CALL">Video Call</option>
                    <option value="MEETING">Meeting</option>
                  </select>
                </label>
                <label>
                  <span style={LABEL_STYLE}>Outcome</span>
                  <select style={INPUT_STYLE} value={outcome} onChange={e => setOutcome(e.target.value)}>
                    <option value="NEUTRAL">Sent / No reply yet</option>
                    <option value="POSITIVE">Replied ✓</option>
                    <option value="FOLLOW_UP_REQUIRED">Follow-up needed</option>
                    <option value="NEGATIVE">Not interested</option>
                  </select>
                </label>
              </div>
              <label>
                <span style={LABEL_STYLE}>Notes</span>
                <textarea
                  style={{ ...INPUT_STYLE, resize: 'vertical', minHeight: 64 } as React.CSSProperties}
                  value={summary}
                  onChange={e => setSummary(e.target.value)}
                  placeholder="Contract situation, agent info, response..."
                />
              </label>
              <label>
                <span style={LABEL_STYLE}>Date & Time</span>
                <input style={INPUT_STYLE} type="datetime-local" value={timestamp} onChange={e => setTimestamp(e.target.value)} />
              </label>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
              <button type="button" onClick={onClose} style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: '1.5px solid #E5E7EB', background: '#fff', color: '#6B7280', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-montserrat)' }}>Cancel</button>
              <button type="submit" disabled={saving} style={{ flex: 2, padding: '10px 0', borderRadius: 8, border: 'none', background: saving ? '#9CA3AF' : G, color: '#fff', fontSize: 13, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-montserrat)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                {saving && <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} />}
                {saving ? 'Saving…' : 'Log Contact'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// ─── Player Row ───────────────────────────────────────────────────────────────

function PlayerRow({
  player,
  onLogContact,
}: {
  player: OutreachPlayer
  onLogContact: (p: OutreachPlayer) => void
}) {
  const sc = STATUS_CONFIG[player.outreachStatus]
  const cExp = player.contractExpiry ? fmtDate(player.contractExpiry) : '—'
  const cColor = contractUrgency(player.contractExpiry)

  return (
    <>
      {/* ── Desktop row ── */}
      <div className="outreach-desktop" style={{
        background: '#fff', border: '1.5px solid #E5E7EB', borderRadius: 12,
        padding: '12px 16px',
        gridTemplateColumns: '36px 1fr 80px 48px 52px 110px 120px 130px auto',
        gap: 12, alignItems: 'center',
      }}>
        <PlayerAvatar player={player} />
        <div style={{ minWidth: 0 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: N, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'var(--font-montserrat)' }}>{player.fullName}</p>
          <p style={{ fontSize: 11, color: '#6B7280', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'var(--font-montserrat)' }}>
            {player.currentClub ?? '—'}{player.currentLeague ? ` · ${player.currentLeague}` : ''}
          </p>
        </div>
        <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 7px', borderRadius: 6, background: `${G}12`, color: G, fontFamily: 'var(--font-montserrat)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {player.position ?? '—'}
        </span>
        <span style={{ fontSize: 12, color: N, fontFamily: 'var(--font-montserrat)', textAlign: 'center' }}>{player.age ?? '—'}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: G, fontFamily: 'var(--font-montserrat)', textAlign: 'center' }}>{player.eloRating ?? '—'}</span>
        <span style={{ fontSize: 11, color: cColor, fontFamily: 'var(--font-montserrat)', display: 'flex', alignItems: 'center', gap: 4 }}>
          <Clock size={10} color={cColor} />{cExp}
        </span>
        <span style={{ fontSize: 10, fontWeight: 700, padding: '4px 9px', borderRadius: 20, background: sc.bg, color: sc.color, fontFamily: 'var(--font-montserrat)', display: 'flex', alignItems: 'center', gap: 5, width: 'fit-content' }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: sc.dot, flexShrink: 0 }} />
          {sc.label}
        </span>
        <div style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'var(--font-montserrat)', minWidth: 0 }}>
          {player.latestLog ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <TypeIcon type={player.latestLog.type} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fmtRelative(player.latestLog.timestamp)}</span>
            </div>
          ) : <span style={{ color: '#D1D5DB' }}>No contact</span>}
        </div>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
          <button onClick={() => onLogContact(player)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 11px', borderRadius: 7, border: `1.5px solid ${G}`, background: 'transparent', color: G, fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-montserrat)', whiteSpace: 'nowrap' }}>
            <Plus size={11} /> Contact
          </button>
          <Link href="/dashboard/players" style={{ display: 'flex', alignItems: 'center', padding: '6px 8px', borderRadius: 7, border: '1.5px solid #E5E7EB', background: 'transparent', color: '#9CA3AF' }}>
            <ArrowUpRight size={11} />
          </Link>
        </div>
      </div>

      {/* ── Mobile card ── */}
      <div className="outreach-mobile" style={{
        background: '#fff', border: '1.5px solid #E5E7EB', borderRadius: 14,
        padding: '14px 16px', flexDirection: 'column', gap: 10,
      }}>
        {/* Top row: avatar + name + status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <PlayerAvatar player={player} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: N, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'var(--font-montserrat)' }}>{player.fullName}</p>
            <p style={{ fontSize: 11, color: '#6B7280', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'var(--font-montserrat)' }}>
              {player.currentClub ?? '—'}{player.currentLeague ? ` · ${player.currentLeague}` : ''}
            </p>
          </div>
          <span style={{ fontSize: 10, fontWeight: 700, padding: '4px 9px', borderRadius: 20, background: sc.bg, color: sc.color, fontFamily: 'var(--font-montserrat)', display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: sc.dot }} />
            {sc.label}
          </span>
        </div>

        {/* Middle row: stats chips */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {player.position && (
            <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: `${G}12`, color: G, fontFamily: 'var(--font-montserrat)' }}>
              {player.position}
            </span>
          )}
          {player.age && (
            <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, background: '#F3F4F6', color: N, fontFamily: 'var(--font-montserrat)' }}>
              {player.age} yrs
            </span>
          )}
          {player.eloRating && (
            <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: '#F3F4F6', color: G, fontFamily: 'var(--font-montserrat)' }}>
              ELO {player.eloRating}
            </span>
          )}
          <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, background: '#F3F4F6', color: cColor, fontFamily: 'var(--font-montserrat)', display: 'flex', alignItems: 'center', gap: 3 }}>
            <Clock size={9} color={cColor} /> {cExp}
          </span>
        </div>

        {/* Bottom row: last contact + action */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'var(--font-montserrat)', display: 'flex', alignItems: 'center', gap: 4 }}>
            {player.latestLog ? (
              <><TypeIcon type={player.latestLog.type} />{fmtRelative(player.latestLog.timestamp)}</>
            ) : <span style={{ color: '#D1D5DB' }}>No contact yet</span>}
          </div>
          <button
            onClick={() => onLogContact(player)}
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 14px', borderRadius: 8, border: `1.5px solid ${G}`, background: G, color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-montserrat)', whiteSpace: 'nowrap' }}
          >
            <Plus size={12} /> Log Contact
          </button>
        </div>
      </div>
    </>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function OutreachPage() {
  const [players,        setPlayers]        = useState<OutreachPlayer[]>([])
  const [counts,         setCounts]         = useState<Record<string, number>>({})
  const [total,          setTotal]          = useState(0)
  const [loading,        setLoading]        = useState(true)
  const [activeStatus,   setActiveStatus]   = useState<OutreachStatus | 'ALL'>('ALL')
  const [contactPlayer,  setContactPlayer]  = useState<OutreachPlayer | null>(null)
  const [search,         setSearch]         = useState('')

  const fetchPlayers = useCallback(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (activeStatus !== 'ALL') params.set('status', activeStatus)
    fetch(`/api/dashboard/outreach?${params}`)
      .then(r => r.json())
      .then(d => {
        setPlayers(d.players ?? [])
        setCounts(d.counts ?? {})
        setTotal(d.total ?? 0)
      })
      .finally(() => setLoading(false))
  }, [activeStatus])

  useEffect(() => { fetchPlayers() }, [fetchPlayers])

  const filtered = search.trim()
    ? players.filter(p =>
        p.fullName.toLowerCase().includes(search.toLowerCase()) ||
        (p.currentClub ?? '').toLowerCase().includes(search.toLowerCase()) ||
        (p.position ?? '').toLowerCase().includes(search.toLowerCase()) ||
        (p.nationality ?? '').toLowerCase().includes(search.toLowerCase())
      )
    : players

  return (
    <div style={{ padding: 'clamp(16px,4vw,28px) clamp(16px,4vw,32px)', fontFamily: 'var(--font-montserrat)', color: N, minHeight: '100vh', background: '#F8FAFF' }}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        .outreach-desktop { display: grid; }
        .outreach-mobile  { display: none; }
        .outreach-hdr     { display: grid; }
        .outreach-refresh-label { display: inline; }
        @media (max-width: 768px) {
          .outreach-desktop { display: none !important; }
          .outreach-mobile  { display: flex !important; }
          .outreach-hdr     { display: none !important; }
          .outreach-refresh-label { display: none !important; }
        }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 'clamp(18px,4vw,24px)', fontWeight: 800, color: N, margin: 0, fontFamily: 'var(--font-montserrat)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Target size={22} color={G} strokeWidth={2.5} />
            Outreach Board
          </h1>
          <p style={{ fontSize: 13, color: '#6B7280', margin: '4px 0 0', fontFamily: 'var(--font-montserrat)' }}>
            {total} player{total !== 1 ? 's' : ''} · Track who you've contacted, who replied, and next steps
          </p>
        </div>
        <button
          onClick={fetchPlayers}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: '1.5px solid #E5E7EB', background: '#fff', color: '#6B7280', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-montserrat)', flexShrink: 0 }}
        >
          <RefreshCw size={13} />
          <span className="outreach-refresh-label">Refresh</span>
        </button>
      </div>

      {/* Status tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 16, borderBottom: '2px solid #E5E7EB', overflowX: 'auto' }}>
        {(['ALL', ...STATUS_ORDER] as const).map(s => {
          const active = s === activeStatus
          const count  = s === 'ALL' ? total : (counts[s] ?? 0)
          const cfg    = s !== 'ALL' ? STATUS_CONFIG[s] : null
          return (
            <button
              key={s}
              onClick={() => setActiveStatus(s)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '10px 16px', background: 'none', border: 'none',
                borderBottom: active ? `2px solid ${G}` : '2px solid transparent',
                marginBottom: -2, cursor: 'pointer',
                fontFamily: 'var(--font-montserrat)', fontSize: 12,
                fontWeight: active ? 700 : 500,
                color: active ? G : '#6B7280',
                whiteSpace: 'nowrap', transition: 'color 0.15s',
              }}
            >
              {cfg && <span style={{ width: 6, height: 6, borderRadius: '50%', background: active ? cfg.dot : '#D1D5DB', flexShrink: 0 }} />}
              {s === 'ALL' ? 'All Players' : STATUS_CONFIG[s].label}
              {count > 0 && (
                <span style={{
                  fontSize: 10, fontWeight: 800, padding: '1px 6px', borderRadius: 999,
                  background: active ? `${G}18` : '#F3F4F6',
                  color: active ? G : '#9CA3AF',
                }}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Search */}
      <div style={{ marginBottom: 14 }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, club, position, nationality…"
          style={{
            width: '100%', maxWidth: 400, padding: '9px 14px',
            border: '1.5px solid #E5E7EB', borderRadius: 9, fontSize: 13,
            fontFamily: 'var(--font-montserrat)', outline: 'none', color: N,
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Desktop table header */}
      {!loading && filtered.length > 0 && (
        <div className="outreach-hdr" style={{
          gridTemplateColumns: '36px 1fr 80px 48px 52px 110px 120px 130px auto',
          gap: 12, padding: '6px 16px', marginBottom: 6,
        }}>
          {['', 'Player', 'Position', 'Age', 'ELO', 'Contract', 'Status', 'Last Contact', ''].map((h, i) => (
            <span key={i} style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--font-montserrat)' }}>{h}</span>
          ))}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
          <Loader2 size={28} color={G} style={{ animation: 'spin 1s linear infinite' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#9CA3AF' }}>
          <Target size={44} color="#D1D5DB" style={{ marginBottom: 14 }} />
          <p style={{ fontSize: 14, fontWeight: 600, margin: 0, color: N, fontFamily: 'var(--font-montserrat)' }}>
            {total === 0 ? 'No players in your roster yet' : 'No players match this filter'}
          </p>
          <p style={{ fontSize: 12, margin: '6px 0 0', fontFamily: 'var(--font-montserrat)' }}>
            {total === 0
              ? 'Add players in the Players section to start tracking outreach.'
              : 'Try selecting a different status tab.'}
          </p>
          {total === 0 && (
            <Link href="/dashboard/players" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 16, padding: '10px 20px', borderRadius: 9, background: G, color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none', fontFamily: 'var(--font-montserrat)' }}>
              <Plus size={14} /> Add Players
            </Link>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {filtered.map(player => (
            <PlayerRow
              key={player.id}
              player={player}
              onLogContact={p => setContactPlayer(p)}
            />
          ))}
        </div>
      )}

      {/* Log Contact Modal */}
      {contactPlayer && (
        <LogContactModal
          player={contactPlayer}
          onClose={() => setContactPlayer(null)}
          onSaved={() => { setContactPlayer(null); fetchPlayers() }}
        />
      )}
    </div>
  )
}
