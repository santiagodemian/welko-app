'use client'

import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import {
  MessageSquare, CheckSquare, Plus, Filter, Check, X, Loader2,
  Clock, Phone, Mail, Video, Users, ArrowRight, Circle,
  CalendarDays, Bot,
} from 'lucide-react'
import Link from 'next/link'

function TabLoader() {
  return (
    <div style={{ padding: 64, textAlign: 'center', color: '#9CA3AF' }}>
      <Loader2 size={22} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 10px', display: 'block' }} />
    </div>
  )
}
const CalendarContent = dynamic(() => import('../calendar/page'), { ssr: false, loading: TabLoader })
const AIContent       = dynamic(() => import('../chat/page'),     { ssr: false, loading: TabLoader })

const N = '#0A0A0A'
const G = '#2563EB'

// ─── Interfaces ───────────────────────────────────────────────────────────────

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

interface Task {
  id: string
  title: string
  dueDate: string
  priority: string
  category: string
  isCompleted: boolean
  player: { fullName: string } | null
  assignedTo: { fullName: string }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

function priorityStyle(priority: string): { bg: string; color: string } {
  switch (priority) {
    case 'HIGH':   return { bg: 'rgba(239,68,68,0.12)',  color: '#EF4444' }
    case 'MEDIUM': return { bg: 'rgba(245,158,11,0.12)', color: '#D97706' }
    default:       return { bg: 'rgba(156,163,175,0.15)', color: '#6B7280' }
  }
}

function dueDateColor(iso: string): string {
  const d    = new Date(iso)
  const now  = new Date()
  const diff = d.getTime() - now.getTime()
  if (diff < 0)        return '#EF4444'
  if (diff < 86400000) return '#F59E0B'
  return '#6B7280'
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function fmtDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

// ─── Badge ────────────────────────────────────────────────────────────────────

function Badge({ label, bg, color }: { label: string; bg: string; color: string }) {
  return (
    <span style={{
      background: bg,
      color,
      fontSize: 10,
      fontWeight: 700,
      padding: '2px 7px',
      borderRadius: 20,
      fontFamily: 'var(--font-montserrat)',
      letterSpacing: '0.02em',
    }}>
      {label}
    </span>
  )
}

// ─── Modal wrapper ────────────────────────────────────────────────────────────

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: 'rgba(10,22,40,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: 16, width: 480,
          maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          fontFamily: 'var(--font-montserrat)',
        }}
      >
        {children}
      </div>
    </div>
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

// ─── Add Communication Modal ──────────────────────────────────────────────────

function AddCommModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [title,     setTitle]     = useState('')
  const [summary,   setSummary]   = useState('')
  const [type,      setType]      = useState('CALL')
  const [outcome,   setOutcome]   = useState('NEUTRAL')
  const [timestamp, setTimestamp] = useState(() => {
    const d = new Date()
    d.setSeconds(0, 0)
    return d.toISOString().slice(0, 16)
  })
  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) { setError('Title is required'); return }
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/dashboard/workspace?resource=communications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), summary: summary.trim(), type, outcome, timestamp }),
      })
      if (!res.ok) { const d = await res.json(); setError(d.error ?? 'Save failed'); return }
      onSaved()
      onClose()
    } catch {
      setError('Network error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal onClose={onClose}>
      <div style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: N, fontFamily: 'var(--font-montserrat)' }}>Log Communication</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}><X size={18} color="#9CA3AF" /></button>
        </div>
        {error && <p style={{ fontSize: 12, color: '#EF4444', marginBottom: 12, fontFamily: 'var(--font-montserrat)' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <label>
              <span style={LABEL_STYLE}>Title *</span>
              <input style={INPUT_STYLE} value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Call with Barcelona scout" />
            </label>
            <label>
              <span style={LABEL_STYLE}>Summary</span>
              <textarea
                style={{ ...INPUT_STYLE, resize: 'vertical', minHeight: 80 }}
                value={summary}
                onChange={e => setSummary(e.target.value)}
                placeholder="Key points discussed..."
              />
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
            <button
              type="button" onClick={onClose}
              style={{
                flex: 1, padding: '10px 0', borderRadius: 8, border: '1.5px solid #E5E7EB',
                background: '#fff', color: '#6B7280', fontSize: 13, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'var(--font-montserrat)',
              }}
            >Cancel</button>
            <button
              type="submit" disabled={saving}
              style={{
                flex: 1, padding: '10px 0', borderRadius: 8, border: 'none',
                background: saving ? '#9CA3AF' : G, color: '#fff', fontSize: 13, fontWeight: 700,
                cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-montserrat)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
            >
              {saving && <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />}
              {saving ? 'Saving…' : 'Save Log'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  )
}

// ─── Add Task Modal ───────────────────────────────────────────────────────────

function AddTaskModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [title,    setTitle]    = useState('')
  const [dueDate,  setDueDate]  = useState('')
  const [priority, setPriority] = useState('MEDIUM')
  const [category, setCategory] = useState('')
  const [saving,   setSaving]   = useState(false)
  const [error,    setError]    = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) { setError('Title is required'); return }
    if (!dueDate)       { setError('Due date is required'); return }
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/dashboard/workspace?resource=tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), dueDate, priority, category: category.trim() || 'General' }),
      })
      if (!res.ok) { const d = await res.json(); setError(d.error ?? 'Save failed'); return }
      onSaved()
      onClose()
    } catch {
      setError('Network error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal onClose={onClose}>
      <div style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: N, fontFamily: 'var(--font-montserrat)' }}>Add Task</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}><X size={18} color="#9CA3AF" /></button>
        </div>
        {error && <p style={{ fontSize: 12, color: '#EF4444', marginBottom: 12, fontFamily: 'var(--font-montserrat)' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <label>
              <span style={LABEL_STYLE}>Title *</span>
              <input style={INPUT_STYLE} value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Send proposal to Valencia" />
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <label>
                <span style={LABEL_STYLE}>Due Date *</span>
                <input style={INPUT_STYLE} type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
              </label>
              <label>
                <span style={LABEL_STYLE}>Priority</span>
                <select style={INPUT_STYLE} value={priority} onChange={e => setPriority(e.target.value)}>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </label>
            </div>
            <label>
              <span style={LABEL_STYLE}>Category</span>
              <input
                style={INPUT_STYLE}
                value={category}
                onChange={e => setCategory(e.target.value)}
                placeholder="Follow-up, Contract, Scouting..."
              />
            </label>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
            <button
              type="button" onClick={onClose}
              style={{
                flex: 1, padding: '10px 0', borderRadius: 8, border: '1.5px solid #E5E7EB',
                background: '#fff', color: '#6B7280', fontSize: 13, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'var(--font-montserrat)',
              }}
            >Cancel</button>
            <button
              type="submit" disabled={saving}
              style={{
                flex: 1, padding: '10px 0', borderRadius: 8, border: 'none',
                background: saving ? '#9CA3AF' : G, color: '#fff', fontSize: 13, fontWeight: 700,
                cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-montserrat)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
            >
              {saving && <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />}
              {saving ? 'Saving…' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function WorkspacePage() {
  const [activeTab,         setActiveTab]         = useState<'communications' | 'tasks' | 'calendar' | 'ai'>('communications')
  const [commLogs,          setCommLogs]           = useState<CommLog[]>([])
  const [tasks,             setTasks]              = useState<Task[]>([])
  const [loading,           setLoading]            = useState(true)
  const [outcomeFilter,     setOutcomeFilter]      = useState('')
  const [showCompleted,     setShowCompleted]      = useState(false)
  const [priorityFilter,    setPriorityFilter]     = useState('')
  const [showAddCommModal,  setShowAddCommModal]   = useState(false)
  const [showAddTaskModal,  setShowAddTaskModal]   = useState(false)
  const [commPage,          setCommPage]           = useState(20)
  const [taskPage,          setTaskPage]           = useState(20)

  // ── fetch communications ──────────────────────────────────────────────────
  const fetchComms = useCallback(() => {
    setLoading(true)
    const params = new URLSearchParams({ resource: 'communications' })
    if (outcomeFilter) params.set('outcome', outcomeFilter)
    fetch(`/api/dashboard/workspace?${params}`)
      .then(r => r.json())
      .then(d => setCommLogs(d.logs ?? []))
      .finally(() => setLoading(false))
  }, [outcomeFilter])

  // ── fetch tasks ───────────────────────────────────────────────────────────
  const fetchTasks = useCallback(() => {
    setLoading(true)
    const params = new URLSearchParams({ resource: 'tasks' })
    fetch(`/api/dashboard/workspace?${params}`)
      .then(r => r.json())
      .then(d => setTasks(d.tasks ?? []))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (activeTab === 'communications') fetchComms()
    else if (activeTab === 'tasks') fetchTasks()
  }, [activeTab, fetchComms, fetchTasks])

  // ── toggle task completion ────────────────────────────────────────────────
  async function toggleTask(task: Task) {
    await fetch(`/api/dashboard/workspace?resource=tasks&id=${task.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isCompleted: !task.isCompleted }),
    })
    fetchTasks()
  }

  // ── filtered data ─────────────────────────────────────────────────────────
  const filteredTasks = tasks.filter(t => {
    if (!showCompleted && t.isCompleted) return false
    if (priorityFilter && t.priority !== priorityFilter) return false
    return true
  })

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div style={{ padding: 'clamp(16px,4vw,28px) clamp(14px,4vw,32px)', fontFamily: 'var(--font-montserrat)', color: N, minHeight: '100vh', background: '#F8FAFF' }}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        .ws-subtabs   { overflow-x: auto !important; -webkit-overflow-scrolling: touch; }
        .ws-filterrow { flex-wrap: wrap !important; gap: 8px !important; }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: N, margin: 0, fontFamily: 'var(--font-montserrat)' }}>Workspace</h1>
        <p style={{ fontSize: 13, color: '#6B7280', margin: '4px 0 0', fontFamily: 'var(--font-montserrat)' }}>
          Manage communications and tasks across your agency
        </p>
      </div>

      {/* Sub-tabs */}
      <div className="ws-subtabs" style={{ display: 'flex', gap: 0, marginBottom: 24, borderBottom: '2px solid #E5E7EB' }}>
        {([
          { id: 'communications', label: 'Communications', icon: <MessageSquare size={14} /> },
          { id: 'tasks',          label: 'Tasks',          icon: <CheckSquare size={14} /> },
          { id: 'calendar',       label: 'Calendar',       icon: <CalendarDays size={14} /> },
          { id: 'ai',             label: 'Agent AI',       icon: <Bot size={14} /> },
        ] as const).map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: '10px 18px',
              borderBottom: activeTab === t.id ? `2px solid ${G}` : '2px solid transparent',
              marginBottom: -2,
              cursor: 'pointer',
              fontFamily: 'var(--font-montserrat)', fontSize: 13, fontWeight: activeTab === t.id ? 700 : 500,
              background: 'none', border: 'none',
              color: activeTab === t.id ? G : '#6B7280',
              display: 'flex', alignItems: 'center', gap: 6,
              transition: 'color 0.15s',
              whiteSpace: 'nowrap',
            } as React.CSSProperties}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* ── COMMUNICATIONS TAB ─────────────────────────────────────────────── */}
      {activeTab === 'communications' && (
        <div>
          {/* Filter row */}
          <div className="ws-filterrow" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Filter size={14} color="#6B7280" />
              <select
                value={outcomeFilter}
                onChange={e => { setOutcomeFilter(e.target.value); setCommPage(20) }}
                style={{
                  padding: '7px 12px', borderRadius: 8, border: '1.5px solid #E5E7EB',
                  fontSize: 12, fontFamily: 'var(--font-montserrat)', color: N,
                  background: '#fff', cursor: 'pointer', outline: 'none',
                }}
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
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '9px 16px', borderRadius: 8, border: 'none',
                background: G, color: '#fff', fontSize: 13, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'var(--font-montserrat)',
              }}
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
                <div
                  key={log.id}
                  style={{
                    background: '#fff', border: '1.5px solid #E5E7EB', borderRadius: 12,
                    padding: '14px 18px',
                  }}
                >
                  {/* Row 1: dot + icon + title + timestamp */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                      background: outcomeColor(log.outcome),
                    }} />
                    <TypeIcon type={log.type} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: N, flex: 1, fontFamily: 'var(--font-montserrat)' }}>
                      {log.title}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={11} color="#9CA3AF" />
                      <span style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'var(--font-montserrat)' }}>
                        {fmtDateTime(log.timestamp)}
                      </span>
                    </div>
                  </div>

                  {/* Summary */}
                  {log.summary && (
                    <p style={{
                      fontSize: 12, color: '#6B7280', margin: '0 0 8px 16px',
                      overflow: 'hidden', maxHeight: 36, lineHeight: '18px',
                      fontFamily: 'var(--font-montserrat)',
                    }}>
                      {log.summary}
                    </p>
                  )}

                  {/* Tags row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 16, flexWrap: 'wrap' }}>
                    <Badge
                      label={outcomeLabel(log.outcome)}
                      bg={`${outcomeColor(log.outcome)}20`}
                      color={outcomeColor(log.outcome)}
                    />
                    <Badge label={typeLabel(log.type)} bg={`${G}15`} color={G} />
                    {log.player && (
                      <Badge label={log.player.fullName} bg="rgba(124,58,237,0.1)" color="#7C3AED" />
                    )}
                    {log.club && (
                      <Badge label={log.club.name} bg="rgba(6,182,212,0.1)" color="#0891B2" />
                    )}
                  </div>
                </div>
              ))}

              {commLogs.length > commPage && (
                <button
                  onClick={() => setCommPage(p => p + 20)}
                  style={{
                    alignSelf: 'center', display: 'flex', alignItems: 'center', gap: 6,
                    padding: '9px 20px', borderRadius: 8, border: '1.5px solid #E5E7EB',
                    background: '#fff', color: G, fontSize: 13, fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'var(--font-montserrat)', marginTop: 4,
                  }}
                >
                  Show more <ArrowRight size={14} />
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── TASKS TAB ──────────────────────────────────────────────────────── */}
      {activeTab === 'tasks' && (
        <div>
          {/* Filter row */}
          <div className="ws-filterrow" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {/* Show completed toggle */}
              <label style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer' }}>
                <div
                  onClick={() => setShowCompleted(v => !v)}
                  style={{
                    width: 38, height: 22, borderRadius: 11,
                    background: showCompleted ? G : '#E5E7EB',
                    position: 'relative', cursor: 'pointer', transition: 'background 0.2s',
                    flexShrink: 0,
                  }}
                >
                  <div style={{
                    position: 'absolute', top: 3, left: showCompleted ? 18 : 3,
                    width: 16, height: 16, borderRadius: '50%', background: '#fff',
                    transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                  }} />
                </div>
                <span style={{ fontSize: 12, color: '#6B7280', fontFamily: 'var(--font-montserrat)' }}>
                  Show Completed
                </span>
              </label>

              {/* Priority filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Filter size={13} color="#9CA3AF" />
                <select
                  value={priorityFilter}
                  onChange={e => { setPriorityFilter(e.target.value); setTaskPage(20) }}
                  style={{
                    padding: '6px 10px', borderRadius: 8, border: '1.5px solid #E5E7EB',
                    fontSize: 12, fontFamily: 'var(--font-montserrat)', color: N,
                    background: '#fff', cursor: 'pointer', outline: 'none',
                  }}
                >
                  <option value="">All Priorities</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => setShowAddTaskModal(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '9px 16px', borderRadius: 8, border: 'none',
                background: G, color: '#fff', fontSize: 13, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'var(--font-montserrat)',
              }}
            >
              <Plus size={15} /> Add Task
            </button>
          </div>

          {/* Tasks list */}
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
              <Loader2 size={28} color={G} style={{ animation: 'spin 1s linear infinite' }} />
            </div>
          ) : filteredTasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '56px 0', color: '#9CA3AF' }}>
              <CheckSquare size={40} color="#D1D5DB" style={{ marginBottom: 12 }} />
              <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>No tasks found</p>
              <p style={{ fontSize: 12, margin: '4px 0 0' }}>
                {!showCompleted ? 'Toggle "Show Completed" or create a new task' : 'Create your first task'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filteredTasks.slice(0, taskPage).map(task => {
                const ps = priorityStyle(task.priority)
                return (
                  <div
                    key={task.id}
                    style={{
                      background: '#fff', border: '1.5px solid #E5E7EB', borderRadius: 12,
                      padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12,
                      opacity: task.isCompleted ? 0.65 : 1,
                    }}
                  >
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleTask(task)}
                      style={{
                        width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                        border: task.isCompleted ? 'none' : '2px solid #D1D5DB',
                        background: task.isCompleted ? N : 'transparent',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: 0,
                      }}
                    >
                      {task.isCompleted && <Check size={13} color="#fff" strokeWidth={3} />}
                      {!task.isCompleted && <Circle size={0} />}
                    </button>

                    {/* Title */}
                    <span style={{
                      fontSize: 13, fontWeight: 600, color: N, flex: 1,
                      textDecoration: task.isCompleted ? 'line-through' : 'none',
                      fontFamily: 'var(--font-montserrat)',
                    }}>
                      {task.title}
                    </span>

                    {/* Priority badge */}
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 999,
                      background: ps.bg, color: ps.color, fontFamily: 'var(--font-montserrat)',
                      letterSpacing: '0.04em',
                    }}>
                      {task.priority}
                    </span>

                    {/* Category */}
                    <span style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'var(--font-montserrat)', minWidth: 60 }}>
                      {task.category}
                    </span>

                    {/* Due date */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={11} color={dueDateColor(task.dueDate)} />
                      <span style={{ fontSize: 11, color: dueDateColor(task.dueDate), fontFamily: 'var(--font-montserrat)' }}>
                        {fmtDate(task.dueDate)}
                      </span>
                    </div>

                    {/* Player */}
                    {task.player && (
                      <span style={{ fontSize: 11, color: G, fontFamily: 'var(--font-montserrat)' }}>
                        {task.player.fullName}
                      </span>
                    )}

                    {/* Assigned to */}
                    <span style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'var(--font-montserrat)', textAlign: 'right' }}>
                      {task.assignedTo.fullName}
                    </span>
                  </div>
                )
              })}

              {filteredTasks.length > taskPage && (
                <button
                  onClick={() => setTaskPage(p => p + 20)}
                  style={{
                    alignSelf: 'center', display: 'flex', alignItems: 'center', gap: 6,
                    padding: '9px 20px', borderRadius: 8, border: '1.5px solid #E5E7EB',
                    background: '#fff', color: G, fontSize: 13, fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'var(--font-montserrat)', marginTop: 4,
                  }}
                >
                  Show more <ArrowRight size={14} />
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── CALENDAR TAB ──────────────────────────────────────────────────── */}
      {activeTab === 'calendar' && (
        <div style={{ margin: '-28px -32px' }}>
          <CalendarContent />
        </div>
      )}

      {/* ── AI CHAT TAB ───────────────────────────────────────────────────── */}
      {activeTab === 'ai' && (
        <div style={{ margin: '-28px -32px', minHeight: 600 }}>
          <AIContent />
        </div>
      )}

      {/* Modals */}
      {showAddCommModal && (
        <AddCommModal onClose={() => setShowAddCommModal(false)} onSaved={fetchComms} />
      )}
      {showAddTaskModal && (
        <AddTaskModal onClose={() => setShowAddTaskModal(false)} onSaved={fetchTasks} />
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
