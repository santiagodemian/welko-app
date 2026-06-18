'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  MessageSquare, Plus, Filter, X, Loader2,
  Clock, Phone, Mail, Video, Users, ArrowRight,
} from 'lucide-react'

const N = '#0A0A0A'
const G = '#2563EB'

interface CommLog {
  id: string
  title: string
  summary: string
  type: string
  outcome: string
  timestamp: string
  player: { fullName: string } | null
  club: { name: string } | null
  createdBy: { fullName: string }
}

function outcomeColor(outcome: string): string {
  switch (outcome) {
    case 'POSITIVE':           return '#22C55E'
    case 'NEGATIVE':           return '#EF4444'
    case 'NEUTRAL':            return '#9CA3AF'
    case 'FOLLOW_UP_REQUIRED': return '#F59E0B'
    default:                   return '#9CA3AF'
  }
}

function outcomeLabel(outcome: string): string {
  switch (outcome) {
    case 'POSITIVE':           return 'Positive'
    case 'NEGATIVE':           return 'Negative'
    case 'NEUTRAL':            return 'Neutral'
    case 'FOLLOW_UP_REQUIRED': return 'Follow-up Required'
    default:                   return outcome
  }
}

function typeLabel(type: string): string {
  switch (type) {
    case 'EMAIL':      return 'Email'
    case 'CALL':       return 'Call'
    case 'MEETING':    return 'Meeting'
    case 'MESSAGE':    return 'Message'
    case 'VIDEO_CALL': return 'Video Call'
    default:           return type
  }
}

function TypeIcon({ type }: { type: string }) {
  const props = { size: 14, color: G }
  switch (type) {
    case 'CALL':       return <Phone {...props} />
    case 'EMAIL':      return <Mail {...props} />
    case 'VIDEO_CALL': return <Video {...props} />
    case 'MEETING':    return <Users {...props} />
    default:           return <MessageSquare {...props} />
  }
}

function fmtDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function Badge({ label, bg, color }: { label: string; bg: string; color: string }) {
  return (
    <span style={{
      background: bg, color, fontSize: 10, fontWeight: 700,
      padding: '2px 7px', borderRadius: 20, fontFamily: 'var(--font-montserrat)', letterSpacing: '0.02em',
    }}>
      {label}
    </span>
  )
}

const INPUT_STYLE: React.CSSProperties = {
  width: '100%', padding: '9px 12px', border: '1.5px solid #E5E7EB',
  borderRadius: 8, fontSize: 13, fontFamily: 'var(--font-montserrat)',
  outline: 'none', boxSizing: 'border-box', color: N,
}

const LABEL_STYLE: React.CSSProperties = {
  display: 'block', fontSize: 11, fontWeight: 700,
  color: '#6B7280', marginBottom: 4, letterSpacing: '0.06em',
  textTransform: 'uppercase', fontFamily: 'var(--font-montserrat)',
}

function AddCommModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [title,     setTitle]     = useState('')
  const [summary,   setSummary]   = useState('')
  const [type,      setType]      = useState('CALL')
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
        body: JSON.stringify({ title: title.trim(), summary: summary.trim(), type, outcome, timestamp }),
      })
      if (!res.ok) { const d = await res.json(); setError(d.error ?? 'Save failed'); return }
      onSaved(); onClose()
    } catch { setError('Network error') }
    finally { setSaving(false) }
  }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(10,22,40,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16, width: 480, maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', fontFamily: 'var(--font-montserrat)' }}>
        <div style={{ padding: '24px 28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: N }}>Log Communication</span>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}><X size={18} color="#9CA3AF" /></button>
          </div>
          {error && <p style={{ fontSize: 12, color: '#EF4444', marginBottom: 12 }}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <label>
                <span style={LABEL_STYLE}>Title *</span>
                <input style={INPUT_STYLE} value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Call with Barcelona scout" />
              </label>
              <label>
                <span style={LABEL_STYLE}>Summary</span>
                <textarea style={{ ...INPUT_STYLE, resize: 'vertical', minHeight: 80 } as React.CSSProperties} value={summary} onChange={e => setSummary(e.target.value)} placeholder="Key points discussed..." />
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <label>
                  <span style={LABEL_STYLE}>Type</span>
                  <select style={INPUT_STYLE} value={type} onChange={e => setType(e.target.value)}>
                    <option value="CALL">Call</option>
                    <option value="EMAIL">Email</option>
                    <option value="MEETING">Meeting</option>
                    <option value="MESSAGE">Message</option>
                    <option value="VIDEO_CALL">Video Call</option>
                  </select>
                </label>
                <label>
                  <span style={LABEL_STYLE}>Outcome</span>
                  <select style={INPUT_STYLE} value={outcome} onChange={e => setOutcome(e.target.value)}>
                    <option value="POSITIVE">Positive</option>
                    <option value="NEUTRAL">Neutral</option>
                    <option value="NEGATIVE">Negative</option>
                    <option value="FOLLOW_UP_REQUIRED">Follow-up Required</option>
                  </select>
                </label>
              </div>
              <label>
                <span style={LABEL_STYLE}>Date & Time</span>
                <input style={INPUT_STYLE} type="datetime-local" value={timestamp} onChange={e => setTimestamp(e.target.value)} />
              </label>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
              <button type="button" onClick={onClose} style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: '1.5px solid #E5E7EB', background: '#fff', color: '#6B7280', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-montserrat)' }}>Cancel</button>
              <button type="submit" disabled={saving} style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: 'none', background: saving ? '#9CA3AF' : G, color: '#fff', fontSize: 13, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-montserrat)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                {saving && <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />}
                {saving ? 'Saving…' : 'Save Log'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function CommunicationsPage() {
  const [commLogs,         setCommLogs]         = useState<CommLog[]>([])
  const [loading,          setLoading]          = useState(true)
  const [outcomeFilter,    setOutcomeFilter]    = useState('')
  const [showAddCommModal, setShowAddCommModal] = useState(false)
  const [commPage,         setCommPage]         = useState(20)

  const fetchComms = useCallback(() => {
    setLoading(true)
    const params = new URLSearchParams({ resource: 'communications' })
    if (outcomeFilter) params.set('outcome', outcomeFilter)
    fetch(`/api/dashboard/workspace?${params}`)
      .then(r => r.json())
      .then(d => setCommLogs(d.logs ?? []))
      .finally(() => setLoading(false))
  }, [outcomeFilter])

  useEffect(() => { fetchComms() }, [fetchComms])

  return (
    <div style={{ padding: 'clamp(16px,4vw,28px) clamp(16px,4vw,32px)', fontFamily: 'var(--font-montserrat)', color: N, minHeight: '100vh', background: '#F8FAFF' }}>
      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: N, margin: 0, fontFamily: 'var(--font-montserrat)' }}>Communications</h1>
        <p style={{ fontSize: 13, color: '#6B7280', margin: '4px 0 0', fontFamily: 'var(--font-montserrat)' }}>
          Track all agency communications — calls, emails, meetings and more
        </p>
      </div>

      {/* Filter row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Filter size={14} color="#6B7280" />
          <select
            value={outcomeFilter}
            onChange={e => { setOutcomeFilter(e.target.value); setCommPage(20) }}
            style={{ padding: '7px 12px', borderRadius: 8, border: '1.5px solid #E5E7EB', fontSize: 12, fontFamily: 'var(--font-montserrat)', color: N, background: '#fff', cursor: 'pointer', outline: 'none' }}
          >
            <option value="">All Outcomes</option>
            <option value="POSITIVE">Positive</option>
            <option value="NEUTRAL">Neutral</option>
            <option value="NEGATIVE">Negative</option>
            <option value="FOLLOW_UP_REQUIRED">Follow-up Required</option>
          </select>
        </div>
        <button
          onClick={() => setShowAddCommModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 8, border: 'none', background: G, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-montserrat)' }}
        >
          <Plus size={15} /> Log Communication
        </button>
      </div>

      {/* Logs list */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
          <Loader2 size={28} color={G} style={{ animation: 'spin 1s linear infinite' }} />
        </div>
      ) : commLogs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '56px 0', color: '#9CA3AF' }}>
          <MessageSquare size={40} color="#D1D5DB" style={{ marginBottom: 12 }} />
          <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>No communication logs yet</p>
          <p style={{ fontSize: 12, margin: '4px 0 0' }}>Click &quot;Log Communication&quot; to get started</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {commLogs.slice(0, commPage).map(log => (
            <div key={log.id} style={{ background: '#fff', border: '1.5px solid #E5E7EB', borderRadius: 12, padding: '14px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: outcomeColor(log.outcome) }} />
                <TypeIcon type={log.type} />
                <span style={{ fontSize: 13, fontWeight: 700, color: N, flex: 1, fontFamily: 'var(--font-montserrat)' }}>{log.title}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={11} color="#9CA3AF" />
                  <span style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'var(--font-montserrat)' }}>{fmtDateTime(log.timestamp)}</span>
                </div>
              </div>
              {log.summary && (
                <p style={{ fontSize: 12, color: '#6B7280', margin: '0 0 8px 16px', overflow: 'hidden', maxHeight: 36, lineHeight: '18px', fontFamily: 'var(--font-montserrat)' }}>
                  {log.summary}
                </p>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 16, flexWrap: 'wrap' }}>
                <Badge label={outcomeLabel(log.outcome)} bg={`${outcomeColor(log.outcome)}20`} color={outcomeColor(log.outcome)} />
                <Badge label={typeLabel(log.type)} bg={`${G}15`} color={G} />
                {log.player && <Badge label={log.player.fullName} bg="rgba(124,58,237,0.1)" color="#7C3AED" />}
                {log.club   && <Badge label={log.club.name}       bg="rgba(6,182,212,0.1)"   color="#0891B2" />}
              </div>
            </div>
          ))}
          {commLogs.length > commPage && (
            <button
              onClick={() => setCommPage(p => p + 20)}
              style={{ alignSelf: 'center', display: 'flex', alignItems: 'center', gap: 6, padding: '9px 20px', borderRadius: 8, border: '1.5px solid #E5E7EB', background: '#fff', color: G, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-montserrat)', marginTop: 4 }}
            >
              Show more <ArrowRight size={14} />
            </button>
          )}
        </div>
      )}

      {showAddCommModal && <AddCommModal onClose={() => setShowAddCommModal(false)} onSaved={fetchComms} />}
    </div>
  )
}
