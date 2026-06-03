'use client'

import { useState, useEffect } from 'react'
import { X, Loader2, Check, Save } from 'lucide-react'

const N = '#0A1628'
const G = '#1E6FEB'

interface AIConfig {
  id?: string
  contractAlertMonths: number[]
  notificationEmails: string[]
  autoCreateTasks: boolean
  confidenceThreshold: string
  targetPositions: string[]
  targetLeagues: string[]
  dataSources: string[]
  autoTranslate: boolean
}

const DEFAULT_CONFIG: AIConfig = {
  contractAlertMonths: [], notificationEmails: [], autoCreateTasks: true,
  confidenceThreshold: 'MEDIUM', targetPositions: [], targetLeagues: [],
  dataSources: [], autoTranslate: false,
}

const INPUT_STYLE: React.CSSProperties = {
  width: '100%', padding: '9px 12px', border: '1.5px solid #E5E7EB',
  borderRadius: 8, fontSize: 13, fontFamily: 'var(--font-montserrat)',
  outline: 'none', boxSizing: 'border-box', color: N, background: '#fff',
}

const LABEL_STYLE: React.CSSProperties = {
  display: 'block', fontSize: 11, fontWeight: 700,
  color: '#6B7280', marginBottom: 4, letterSpacing: '0.06em',
  textTransform: 'uppercase', fontFamily: 'var(--font-montserrat)',
}

const CARD: React.CSSProperties = { background: '#fff', border: '1.5px solid #E5E7EB', borderRadius: 14, padding: 20 }

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div onClick={() => onChange(!value)} style={{ width: 42, height: 24, borderRadius: 12, background: value ? G : '#E5E7EB', position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: 4, left: value ? 20 : 4, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }} />
    </div>
  )
}

function TagInput({ tags, onChange, placeholder }: { tags: string[]; onChange: (t: string[]) => void; placeholder?: string }) {
  const [input, setInput] = useState('')

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault()
      const val = input.replace(/,/g, '').trim()
      if (val && !tags.includes(val)) onChange([...tags, val])
      setInput('')
    }
    if (e.key === 'Backspace' && !input && tags.length) onChange(tags.slice(0, -1))
  }

  function handleBlur() {
    if (input.trim()) {
      const vals = input.split(',').map(s => s.trim()).filter(Boolean)
      const next = [...tags]
      vals.forEach(v => { if (!next.includes(v)) next.push(v) })
      onChange(next)
      setInput('')
    }
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center', padding: '6px 10px', border: '1.5px solid #E5E7EB', borderRadius: 8, background: '#fff', minHeight: 40, cursor: 'text' }}>
      {tags.map(tag => (
        <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: `${G}15`, color: G, fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 999, fontFamily: 'var(--font-montserrat)' }}>
          {tag}
          <button onClick={() => onChange(tags.filter(t => t !== tag))} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 1 }}>
            <X size={10} color={G} />
          </button>
        </span>
      ))}
      <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey} onBlur={handleBlur} placeholder={tags.length === 0 ? placeholder : ''} style={{ border: 'none', outline: 'none', fontSize: 12, flex: 1, minWidth: 80, fontFamily: 'var(--font-montserrat)', color: N, background: 'transparent' }} />
    </div>
  )
}

export default function AIAgentsPage() {
  const [config,  setConfig]  = useState<AIConfig>(DEFAULT_CONFIG)
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [saved,   setSaved]   = useState(false)
  const [error,   setError]   = useState('')

  const ALERT_MONTHS = [1, 2, 3, 6, 12]
  const DATA_SOURCES = ['Wyscout', 'Sofascore', 'Manual Entry', 'API-Football']

  useEffect(() => {
    fetch('/api/dashboard/tools?resource=ai-config')
      .then(r => r.json())
      .then(d => { if (d.config) setConfig(d.config as AIConfig) })
      .finally(() => setLoading(false))
  }, [])

  function toggleMonth(m: number) {
    setConfig(c => ({
      ...c,
      contractAlertMonths: c.contractAlertMonths.includes(m)
        ? c.contractAlertMonths.filter(x => x !== m)
        : [...c.contractAlertMonths, m].sort((a, b) => a - b),
    }))
  }

  function toggleSource(src: string) {
    setConfig(c => ({
      ...c,
      dataSources: c.dataSources.includes(src) ? c.dataSources.filter(s => s !== src) : [...c.dataSources, src],
    }))
  }

  async function handleSave() {
    setSaving(true); setError(''); setSaved(false)
    try {
      const res = await fetch('/api/dashboard/tools?resource=ai-config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      })
      if (!res.ok) { const d = await res.json(); setError(d.error ?? 'Save failed'); return }
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch { setError('Network error') }
    finally { setSaving(false) }
  }

  return (
    <div style={{ padding: 'clamp(16px,4vw,28px) clamp(16px,4vw,32px)', fontFamily: 'var(--font-montserrat)', color: N, minHeight: '100vh', background: '#F8FAFF' }}>
      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: N, margin: 0, fontFamily: 'var(--font-montserrat)' }}>AI Agents</h1>
        <p style={{ fontSize: 13, color: '#6B7280', margin: '4px 0 0', fontFamily: 'var(--font-montserrat)' }}>
          Configure your AI agent — contract alerts, scouting, and automation
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
          <Loader2 size={28} color={G} style={{ animation: 'spin 1s linear infinite' }} />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Contract Alert Months */}
          <div style={CARD}>
            <p style={{ fontSize: 13, fontWeight: 700, color: N, margin: '0 0 4px', fontFamily: 'var(--font-montserrat)' }}>Contract Alert Months</p>
            <p style={{ fontSize: 11, color: '#6B7280', margin: '0 0 12px', fontFamily: 'var(--font-montserrat)' }}>Trigger alerts this many months before contract expiry</p>
            <div style={{ display: 'flex', gap: 8 }}>
              {ALERT_MONTHS.map(m => {
                const active = config.contractAlertMonths.includes(m)
                return (
                  <button key={m} onClick={() => toggleMonth(m)} style={{ padding: '6px 14px', borderRadius: 999, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-montserrat)', fontSize: 12, fontWeight: 700, background: active ? G : '#F3F4F6', color: active ? '#fff' : '#6B7280', transition: 'all 0.15s' }}>
                    {m}mo
                  </button>
                )
              })}
            </div>
          </div>

          {/* Notification + Auto-create */}
          <div style={CARD}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <label>
                <span style={LABEL_STYLE}>Notification Emails</span>
                <input
                  style={INPUT_STYLE}
                  value={config.notificationEmails.join(', ')}
                  onChange={e => setConfig(c => ({ ...c, notificationEmails: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
                  placeholder="agent@agency.com, manager@agency.com"
                />
              </label>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: N, margin: 0, fontFamily: 'var(--font-montserrat)' }}>Auto Create Tasks</p>
                  <p style={{ fontSize: 11, color: '#6B7280', margin: '2px 0 0', fontFamily: 'var(--font-montserrat)' }}>Automatically generate tasks from AI alerts</p>
                </div>
                <Toggle value={config.autoCreateTasks} onChange={v => setConfig(c => ({ ...c, autoCreateTasks: v }))} />
              </div>
              <label>
                <span style={LABEL_STYLE}>Confidence Threshold</span>
                <select style={INPUT_STYLE} value={config.confidenceThreshold} onChange={e => setConfig(c => ({ ...c, confidenceThreshold: e.target.value }))}>
                  <option value="LOW">Low — Show all suggestions</option>
                  <option value="MEDIUM">Medium — Balanced</option>
                  <option value="HIGH">High — Only confident matches</option>
                </select>
              </label>
            </div>
          </div>

          {/* Scouting parameters */}
          <div style={CARD}>
            <p style={{ fontSize: 13, fontWeight: 700, color: N, margin: '0 0 14px', fontFamily: 'var(--font-montserrat)' }}>Scouting Parameters</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <label>
                <span style={LABEL_STYLE}>Target Positions</span>
                <TagInput tags={config.targetPositions} onChange={tags => setConfig(c => ({ ...c, targetPositions: tags }))} placeholder="ST, CB, CM — press Enter or comma to add" />
              </label>
              <label>
                <span style={LABEL_STYLE}>Target Leagues</span>
                <TagInput tags={config.targetLeagues} onChange={tags => setConfig(c => ({ ...c, targetLeagues: tags }))} placeholder="La Liga, Premier League — press Enter to add" />
              </label>
            </div>
          </div>

          {/* Data Sources */}
          <div style={CARD}>
            <p style={{ fontSize: 13, fontWeight: 700, color: N, margin: '0 0 12px', fontFamily: 'var(--font-montserrat)' }}>Data Sources</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {DATA_SOURCES.map(src => {
                const active = config.dataSources.includes(src)
                return (
                  <label key={src} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                    <div onClick={() => toggleSource(src)} style={{ width: 18, height: 18, borderRadius: 4, flexShrink: 0, border: active ? 'none' : '2px solid #D1D5DB', background: active ? G : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      {active && <Check size={11} color="#fff" strokeWidth={3} />}
                    </div>
                    <span style={{ fontSize: 13, color: N, fontFamily: 'var(--font-montserrat)' }}>{src}</span>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Auto Translate */}
          <div style={CARD}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: N, margin: 0, fontFamily: 'var(--font-montserrat)' }}>Auto Translate</p>
                <p style={{ fontSize: 11, color: '#6B7280', margin: '2px 0 0', fontFamily: 'var(--font-montserrat)' }}>Automatically translate foreign-language scouting reports</p>
              </div>
              <Toggle value={config.autoTranslate} onChange={v => setConfig(c => ({ ...c, autoTranslate: v }))} />
            </div>
          </div>

          {error && <p style={{ fontSize: 12, color: '#EF4444', fontFamily: 'var(--font-montserrat)' }}>{error}</p>}
          <button
            onClick={handleSave}
            disabled={saving}
            style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 7, padding: '11px 24px', borderRadius: 9, border: 'none', background: saved ? '#22C55E' : saving ? '#9CA3AF' : G, color: '#fff', fontSize: 13, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-montserrat)', transition: 'background 0.2s' }}
          >
            {saving ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Saving…</>
             : saved  ? <><Check size={14} /> Saved!</>
             : <><Save size={14} /> Save AI Config</>}
          </button>
        </div>
      )}
    </div>
  )
}
