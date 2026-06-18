'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  CheckSquare, Plus, Filter, X, Loader2,
  Clock, Check, Circle, ArrowRight,
} from 'lucide-react'

const N = '#0A0A0A'
const G = '#2563EB'

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

function priorityStyle(priority: string): { bg: string; color: string } {
  switch (priority) {
    case 'HIGH':   return { bg: 'rgba(239,68,68,0.12)',   color: '#EF4444' }
    case 'MEDIUM': return { bg: 'rgba(245,158,11,0.12)',  color: '#D97706' }
    default:       return { bg: 'rgba(156,163,175,0.15)', color: '#6B7280' }
  }
}

function dueDateColor(iso: string): string {
  const diff = new Date(iso).getTime() - Date.now()
  if (diff < 0)        return '#EF4444'
  if (diff < 86400000) return '#F59E0B'
  return '#6B7280'
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
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
    setSaving(true); setError('')
    try {
      const res = await fetch('/api/dashboard/workspace?resource=tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), dueDate, priority, category: category.trim() || 'General' }),
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
            <span style={{ fontSize: 16, fontWeight: 700, color: N }}>Add Task</span>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}><X size={18} color="#9CA3AF" /></button>
          </div>
          {error && <p style={{ fontSize: 12, color: '#EF4444', marginBottom: 12 }}>{error}</p>}
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
                <input style={INPUT_STYLE} value={category} onChange={e => setCategory(e.target.value)} placeholder="Follow-up, Contract, Scouting..." />
              </label>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
              <button type="button" onClick={onClose} style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: '1.5px solid #E5E7EB', background: '#fff', color: '#6B7280', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-montserrat)' }}>Cancel</button>
              <button type="submit" disabled={saving} style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: 'none', background: saving ? '#9CA3AF' : G, color: '#fff', fontSize: 13, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-montserrat)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                {saving && <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />}
                {saving ? 'Saving…' : 'Add Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function TasksPage() {
  const [tasks,            setTasks]           = useState<Task[]>([])
  const [loading,          setLoading]         = useState(true)
  const [showCompleted,    setShowCompleted]   = useState(false)
  const [priorityFilter,   setPriorityFilter]  = useState('')
  const [showAddTaskModal, setShowAddTaskModal] = useState(false)
  const [taskPage,         setTaskPage]        = useState(20)

  const fetchTasks = useCallback(() => {
    setLoading(true)
    fetch('/api/dashboard/workspace?resource=tasks')
      .then(r => r.json())
      .then(d => setTasks(d.tasks ?? []))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchTasks() }, [fetchTasks])

  async function toggleTask(task: Task) {
    await fetch(`/api/dashboard/workspace?resource=tasks&id=${task.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isCompleted: !task.isCompleted }),
    })
    fetchTasks()
  }

  const filteredTasks = tasks.filter(t => {
    if (!showCompleted && t.isCompleted) return false
    if (priorityFilter && t.priority !== priorityFilter) return false
    return true
  })

  return (
    <div style={{ padding: 'clamp(16px,4vw,28px) clamp(16px,4vw,32px)', fontFamily: 'var(--font-montserrat)', color: N, minHeight: '100vh', background: '#F8FAFF' }}>
      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: N, margin: 0, fontFamily: 'var(--font-montserrat)' }}>Tasks</h1>
        <p style={{ fontSize: 13, color: '#6B7280', margin: '4px 0 0', fontFamily: 'var(--font-montserrat)' }}>
          Manage and track tasks across your agency
        </p>
      </div>

      {/* Filter row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer' }}>
            <div
              onClick={() => setShowCompleted(v => !v)}
              style={{ width: 38, height: 22, borderRadius: 11, background: showCompleted ? G : '#E5E7EB', position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0 }}
            >
              <div style={{ position: 'absolute', top: 3, left: showCompleted ? 18 : 3, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }} />
            </div>
            <span style={{ fontSize: 12, color: '#6B7280', fontFamily: 'var(--font-montserrat)' }}>Show Completed</span>
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Filter size={13} color="#9CA3AF" />
            <select
              value={priorityFilter}
              onChange={e => { setPriorityFilter(e.target.value); setTaskPage(20) }}
              style={{ padding: '6px 10px', borderRadius: 8, border: '1.5px solid #E5E7EB', fontSize: 12, fontFamily: 'var(--font-montserrat)', color: N, background: '#fff', cursor: 'pointer', outline: 'none' }}
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
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 8, border: 'none', background: G, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-montserrat)' }}
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
              <div key={task.id} style={{ background: '#fff', border: '1.5px solid #E5E7EB', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, opacity: task.isCompleted ? 0.65 : 1 }}>
                <button
                  onClick={() => toggleTask(task)}
                  style={{ width: 24, height: 24, borderRadius: '50%', flexShrink: 0, border: task.isCompleted ? 'none' : '2px solid #D1D5DB', background: task.isCompleted ? N : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
                >
                  {task.isCompleted ? <Check size={13} color="#fff" strokeWidth={3} /> : <Circle size={0} />}
                </button>
                <span style={{ fontSize: 13, fontWeight: 600, color: N, flex: 1, textDecoration: task.isCompleted ? 'line-through' : 'none', fontFamily: 'var(--font-montserrat)' }}>
                  {task.title}
                </span>
                <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 999, background: ps.bg, color: ps.color, fontFamily: 'var(--font-montserrat)', letterSpacing: '0.04em' }}>
                  {task.priority}
                </span>
                <span style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'var(--font-montserrat)', minWidth: 60 }}>{task.category}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={11} color={dueDateColor(task.dueDate)} />
                  <span style={{ fontSize: 11, color: dueDateColor(task.dueDate), fontFamily: 'var(--font-montserrat)' }}>{fmtDate(task.dueDate)}</span>
                </div>
                {task.player && <span style={{ fontSize: 11, color: G, fontFamily: 'var(--font-montserrat)' }}>{task.player.fullName}</span>}
                <span style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'var(--font-montserrat)', textAlign: 'right' }}>{task.assignedTo.fullName}</span>
              </div>
            )
          })}
          {filteredTasks.length > taskPage && (
            <button
              onClick={() => setTaskPage(p => p + 20)}
              style={{ alignSelf: 'center', display: 'flex', alignItems: 'center', gap: 6, padding: '9px 20px', borderRadius: 8, border: '1.5px solid #E5E7EB', background: '#fff', color: G, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-montserrat)', marginTop: 4 }}
            >
              Show more <ArrowRight size={14} />
            </button>
          )}
        </div>
      )}

      {showAddTaskModal && <AddTaskModal onClose={() => setShowAddTaskModal(false)} onSaved={fetchTasks} />}
    </div>
  )
}
