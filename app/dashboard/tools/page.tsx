'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import {
  Bot, Plug, BarChart2, Shield, Plus, X, Loader2,
  Mail, Hash, Phone, Check, Save,
} from 'lucide-react'

const N = '#0A0A0A'
const G = '#2563EB'

// ─── Shared style helpers ─────────────────────────────────────────────────────

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

const CARD: React.CSSProperties = {
  background: '#fff', border: '1.5px solid #E5E7EB', borderRadius: 14, padding: 20,
}

// ─── Types ────────────────────────────────────────────────────────────────────

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

interface PlayerSummary {
  id: string
  position: string | null
  nationality: string | null
  category: string
}

interface ComplianceRecord {
  id: string
  title: string
  type: string
  status: string
  entityName: string
  referenceNumber: string | null
  expiryDate: string | null
  fileUrl: string | null
}

// ─── Default AI config ────────────────────────────────────────────────────────

const DEFAULT_CONFIG: AIConfig = {
  contractAlertMonths: [],
  notificationEmails: [],
  autoCreateTasks: true,
  confidenceThreshold: 'MEDIUM',
  targetPositions: [],
  targetLeagues: [],
  dataSources: [],
  autoTranslate: false,
}

// ─── Toggle switch ────────────────────────────────────────────────────────────

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div
      onClick={() => onChange(!value)}
      style={{
        width: 42, height: 24, borderRadius: 12,
        background: value ? G : '#E5E7EB',
        position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0,
      }}
    >
      <div style={{
        position: 'absolute', top: 4, left: value ? 20 : 4,
        width: 16, height: 16, borderRadius: '50%', background: '#fff',
        transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
      }} />
    </div>
  )
}

// ─── Tag input ────────────────────────────────────────────────────────────────

function TagInput({
  tags, onChange, placeholder,
}: { tags: string[]; onChange: (t: string[]) => void; placeholder?: string }) {
  const [input, setInput] = useState('')

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault()
      const val = input.replace(/,/g, '').trim()
      if (val && !tags.includes(val)) onChange([...tags, val])
      setInput('')
    }
    if (e.key === 'Backspace' && !input && tags.length) {
      onChange(tags.slice(0, -1))
    }
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
    <div style={{
      display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center',
      padding: '6px 10px', border: '1.5px solid #E5E7EB', borderRadius: 8,
      background: '#fff', minHeight: 40, cursor: 'text',
    }}>
      {tags.map(tag => (
        <span key={tag} style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          background: `${G}15`, color: G, fontSize: 11, fontWeight: 700,
          padding: '3px 8px', borderRadius: 999, fontFamily: 'var(--font-montserrat)',
        }}>
          {tag}
          <button
            onClick={() => onChange(tags.filter(t => t !== tag))}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 1 }}
          >
            <X size={10} color={G} />
          </button>
        </span>
      ))}
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKey}
        onBlur={handleBlur}
        placeholder={tags.length === 0 ? placeholder : ''}
        style={{
          border: 'none', outline: 'none', fontSize: 12, flex: 1,
          minWidth: 80, fontFamily: 'var(--font-montserrat)', color: N, background: 'transparent',
        }}
      />
    </div>
  )
}

// ─── Compliance status helpers ────────────────────────────────────────────────

function complianceStatusStyle(status: string): { bg: string; color: string } {
  switch (status) {
    case 'VALID':           return { bg: 'rgba(34,197,94,0.12)',  color: '#16A34A' }
    case 'EXPIRING_SOON':   return { bg: 'rgba(245,158,11,0.12)', color: '#D97706' }
    case 'EXPIRED':         return { bg: 'rgba(239,68,68,0.12)',  color: '#DC2626' }
    case 'NON_COMPLIANT':   return { bg: 'rgba(239,68,68,0.12)',  color: '#DC2626' }
    case 'PENDING_REVIEW':  return { bg: 'rgba(156,163,175,0.15)', color: '#6B7280' }
    default:                return { bg: '#F3F4F6', color: '#6B7280' }
  }
}

function complianceStatusLabel(status: string): string {
  const map: Record<string, string> = {
    VALID: 'Valid', EXPIRING_SOON: 'Expiring Soon',
    EXPIRED: 'Expired', PENDING_REVIEW: 'Pending Review', NON_COMPLIANT: 'Non-Compliant',
  }
  return map[status] ?? status
}

function complianceTypeLabel(type: string): string {
  const map: Record<string, string> = {
    AGENT_LICENSE: 'Agent License', GDPR_CONSENT: 'GDPR Consent',
    DATA_DELETION: 'Data Deletion', CONTRACT_AUDIT: 'Contract Audit',
    TRANSFER_COMPLIANCE: 'Transfer Compliance', WORK_PERMIT: 'Work Permit',
  }
  return map[type] ?? type
}

function fmtDate(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

// ─── Add Compliance Modal ─────────────────────────────────────────────────────

function AddComplianceModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [title,           setTitle]           = useState('')
  const [type,            setType]            = useState('AGENT_LICENSE')
  const [status,          setStatus]          = useState('PENDING_REVIEW')
  const [entityName,      setEntityName]      = useState('')
  const [referenceNumber, setReferenceNumber] = useState('')
  const [expiryDate,      setExpiryDate]      = useState('')
  const [fileUrl,         setFileUrl]         = useState('')
  const [saving,          setSaving]          = useState(false)
  const [error,           setError]           = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !entityName.trim()) { setError('Title and entity name are required'); return }
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/dashboard/tools?resource=compliance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(), type, status, entityName: entityName.trim(),
          referenceNumber: referenceNumber.trim() || undefined,
          expiryDate: expiryDate || undefined,
          fileUrl: fileUrl.trim() || undefined,
        }),
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
        <div style={{ padding: '24px 28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: N, fontFamily: 'var(--font-montserrat)' }}>Add Compliance Record</span>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
              <X size={18} color="#9CA3AF" />
            </button>
          </div>
          {error && <p style={{ fontSize: 12, color: '#EF4444', marginBottom: 12 }}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <label>
                <span style={LABEL_STYLE}>Title *</span>
                <input style={INPUT_STYLE} value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. FIFA Agent License 2025" />
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <label>
                  <span style={LABEL_STYLE}>Type</span>
                  <select style={INPUT_STYLE} value={type} onChange={e => setType(e.target.value)}>
                    <option value="AGENT_LICENSE">Agent License</option>
                    <option value="GDPR_CONSENT">GDPR Consent</option>
                    <option value="DATA_DELETION">Data Deletion</option>
                    <option value="CONTRACT_AUDIT">Contract Audit</option>
                    <option value="TRANSFER_COMPLIANCE">Transfer Compliance</option>
                    <option value="WORK_PERMIT">Work Permit</option>
                  </select>
                </label>
                <label>
                  <span style={LABEL_STYLE}>Status</span>
                  <select style={INPUT_STYLE} value={status} onChange={e => setStatus(e.target.value)}>
                    <option value="PENDING_REVIEW">Pending Review</option>
                    <option value="VALID">Valid</option>
                    <option value="EXPIRING_SOON">Expiring Soon</option>
                    <option value="EXPIRED">Expired</option>
                    <option value="NON_COMPLIANT">Non-Compliant</option>
                  </select>
                </label>
              </div>
              <label>
                <span style={LABEL_STYLE}>Entity Name *</span>
                <input style={INPUT_STYLE} value={entityName} onChange={e => setEntityName(e.target.value)} placeholder="Player or agent name" />
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <label>
                  <span style={LABEL_STYLE}>Reference Number</span>
                  <input style={INPUT_STYLE} value={referenceNumber} onChange={e => setReferenceNumber(e.target.value)} placeholder="License ref..." />
                </label>
                <label>
                  <span style={LABEL_STYLE}>Expiry Date</span>
                  <input style={INPUT_STYLE} type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} />
                </label>
              </div>
              <label>
                <span style={LABEL_STYLE}>Document URL</span>
                <input style={INPUT_STYLE} value={fileUrl} onChange={e => setFileUrl(e.target.value)} placeholder="https://..." />
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
                {saving ? 'Saving…' : 'Add Record'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// ─── AI Agent Tab ─────────────────────────────────────────────────────────────

function AIAgentTab() {
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
      .then(d => {
        if (d.config) setConfig(d.config as AIConfig)
      })
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
      dataSources: c.dataSources.includes(src)
        ? c.dataSources.filter(s => s !== src)
        : [...c.dataSources, src],
    }))
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      const res = await fetch('/api/dashboard/tools?resource=ai-config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      })
      if (!res.ok) { const d = await res.json(); setError(d.error ?? 'Save failed'); return }
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError('Network error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
        <Loader2 size={28} color={G} style={{ animation: 'spin 1s linear infinite' }} />
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Contract Alert Months */}
      <div style={CARD}>
        <p style={{ fontSize: 13, fontWeight: 700, color: N, margin: '0 0 4px', fontFamily: 'var(--font-montserrat)' }}>
          Contract Alert Months
        </p>
        <p style={{ fontSize: 11, color: '#6B7280', margin: '0 0 12px', fontFamily: 'var(--font-montserrat)' }}>
          Trigger alerts this many months before contract expiry
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          {ALERT_MONTHS.map(m => {
            const active = config.contractAlertMonths.includes(m)
            return (
              <button
                key={m}
                onClick={() => toggleMonth(m)}
                style={{
                  padding: '6px 14px', borderRadius: 999, border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-montserrat)', fontSize: 12, fontWeight: 700,
                  background: active ? G : '#F3F4F6',
                  color: active ? '#fff' : '#6B7280',
                  transition: 'all 0.15s',
                }}
              >
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
              <p style={{ fontSize: 11, color: '#6B7280', margin: '2px 0 0', fontFamily: 'var(--font-montserrat)' }}>
                Automatically generate tasks from AI alerts
              </p>
            </div>
            <Toggle value={config.autoCreateTasks} onChange={v => setConfig(c => ({ ...c, autoCreateTasks: v }))} />
          </div>

          <label>
            <span style={LABEL_STYLE}>Confidence Threshold</span>
            <select
              style={INPUT_STYLE}
              value={config.confidenceThreshold}
              onChange={e => setConfig(c => ({ ...c, confidenceThreshold: e.target.value }))}
            >
              <option value="LOW">Low — Show all suggestions</option>
              <option value="MEDIUM">Medium — Balanced</option>
              <option value="HIGH">High — Only confident matches</option>
            </select>
          </label>
        </div>
      </div>

      {/* Scouting parameters */}
      <div style={CARD}>
        <p style={{ fontSize: 13, fontWeight: 700, color: N, margin: '0 0 14px', fontFamily: 'var(--font-montserrat)' }}>
          Scouting Parameters
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <label>
            <span style={LABEL_STYLE}>Target Positions</span>
            <TagInput
              tags={config.targetPositions}
              onChange={tags => setConfig(c => ({ ...c, targetPositions: tags }))}
              placeholder="ST, CB, CM — press Enter or comma to add"
            />
          </label>
          <label>
            <span style={LABEL_STYLE}>Target Leagues</span>
            <TagInput
              tags={config.targetLeagues}
              onChange={tags => setConfig(c => ({ ...c, targetLeagues: tags }))}
              placeholder="La Liga, Premier League — press Enter to add"
            />
          </label>
        </div>
      </div>

      {/* Data Sources */}
      <div style={CARD}>
        <p style={{ fontSize: 13, fontWeight: 700, color: N, margin: '0 0 12px', fontFamily: 'var(--font-montserrat)' }}>
          Data Sources
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {DATA_SOURCES.map(src => {
            const active = config.dataSources.includes(src)
            return (
              <label key={src} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                <div
                  onClick={() => toggleSource(src)}
                  style={{
                    width: 18, height: 18, borderRadius: 4, flexShrink: 0,
                    border: active ? 'none' : '2px solid #D1D5DB',
                    background: active ? G : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
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
            <p style={{ fontSize: 11, color: '#6B7280', margin: '2px 0 0', fontFamily: 'var(--font-montserrat)' }}>
              Automatically translate foreign-language scouting reports
            </p>
          </div>
          <Toggle value={config.autoTranslate} onChange={v => setConfig(c => ({ ...c, autoTranslate: v }))} />
        </div>
      </div>

      {/* Save */}
      {error && <p style={{ fontSize: 12, color: '#EF4444', fontFamily: 'var(--font-montserrat)' }}>{error}</p>}
      <button
        onClick={handleSave}
        disabled={saving}
        style={{
          alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 7,
          padding: '11px 24px', borderRadius: 9, border: 'none',
          background: saved ? '#22C55E' : saving ? '#9CA3AF' : G,
          color: '#fff', fontSize: 13, fontWeight: 700,
          cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-montserrat)',
          transition: 'background 0.2s',
        }}
      >
        {saving
          ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Saving…</>
          : saved
          ? <><Check size={14} /> Saved!</>
          : <><Save size={14} /> Save AI Config</>
        }
      </button>
    </div>
  )
}

// ─── Integrations Tab ─────────────────────────────────────────────────────────

function IntegrationsTab() {
  const integrations = [
    { name: 'Gmail',   icon: <Mail size={20} color="#EA4335" />,  iconBg: 'rgba(234,67,53,0.1)',   desc: 'Sync emails and track communications directly from your Gmail inbox.' },
    { name: 'Outlook', icon: <Mail size={20} color="#0078D4" />,  iconBg: 'rgba(0,120,212,0.1)',   desc: 'Connect Microsoft Outlook to centralise all agency correspondence.' },
    { name: 'Slack',   icon: <Hash size={20} color="#4A154B" />,  iconBg: 'rgba(74,21,75,0.1)',    desc: 'Get real-time notifications and team updates straight in Slack.' },
    { name: 'WhatsApp', icon: <Phone size={20} color="#25D366" />, iconBg: 'rgba(37,211,102,0.1)', desc: 'Log WhatsApp conversations with clubs and players automatically.' },
  ]

  return (
    <div>
      <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 20, fontFamily: 'var(--font-montserrat)' }}>
        Connect external services to streamline your workflow. Integrations are coming soon.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        {integrations.map(int => (
          <div key={int.name} style={{ ...CARD, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: int.iconBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                {int.icon}
              </div>
              <span style={{ fontSize: 15, fontWeight: 700, color: N, fontFamily: 'var(--font-montserrat)' }}>
                {int.name}
              </span>
            </div>
            <p style={{ fontSize: 12, color: '#6B7280', margin: 0, lineHeight: 1.5, fontFamily: 'var(--font-montserrat)' }}>
              {int.desc}
            </p>
            <div style={{ position: 'relative', alignSelf: 'flex-start' }}>
              <button
                disabled
                style={{
                  padding: '8px 16px', borderRadius: 8, border: '1.5px solid #E5E7EB',
                  background: '#F9FAFB', color: '#9CA3AF', fontSize: 12, fontWeight: 600,
                  cursor: 'not-allowed', fontFamily: 'var(--font-montserrat)',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                Connect {int.name}
              </button>
              <span style={{
                position: 'absolute', top: -8, right: -8,
                background: '#F59E0B', color: '#fff', fontSize: 9, fontWeight: 800,
                padding: '2px 6px', borderRadius: 999, letterSpacing: '0.04em',
                fontFamily: 'var(--font-montserrat)',
              }}>
                SOON
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Reports Tab ──────────────────────────────────────────────────────────────

function ReportsTab() {
  const [players, setPlayers] = useState<PlayerSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard/players')
      .then(r => r.json())
      .then(d => setPlayers(d.players ?? []))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
        <Loader2 size={28} color={G} style={{ animation: 'spin 1s linear infinite' }} />
      </div>
    )
  }

  if (players.length < 3) {
    return (
      <div style={{ textAlign: 'center', padding: '56px 0', color: '#9CA3AF' }}>
        <BarChart2 size={40} color="#D1D5DB" style={{ marginBottom: 12 }} />
        <p style={{ fontSize: 14, fontWeight: 600, margin: 0, color: N, fontFamily: 'var(--font-montserrat)' }}>
          Add more players to see reports
        </p>
        <p style={{ fontSize: 12, margin: '4px 0 0', fontFamily: 'var(--font-montserrat)' }}>
          You need at least 3 players in your portfolio to generate charts.
        </p>
      </div>
    )
  }

  // ── Position distribution ──────────────────────────────────────────────────
  const positionMap: Record<string, number> = {}
  players.forEach(p => {
    const pos = p.position ?? 'Unknown'
    positionMap[pos] = (positionMap[pos] ?? 0) + 1
  })
  const positionData = Object.entries(positionMap)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }))

  // ── Category distribution ─────────────────────────────────────────────────
  const catMap: Record<string, number> = { MANAGED: 0, MANDATE: 0, PROSPECTIVE: 0 }
  players.forEach(p => { if (p.category in catMap) catMap[p.category]++ })
  const categoryData = [
    { name: 'Managed',     value: catMap.MANAGED,     color: '#22C55E' },
    { name: 'Mandate',     value: catMap.MANDATE,     color: G },
    { name: 'Prospective', value: catMap.PROSPECTIVE, color: '#9CA3AF' },
  ].filter(d => d.value > 0)

  // ── Top nationalities ─────────────────────────────────────────────────────
  const natMap: Record<string, number> = {}
  players.forEach(p => {
    const nat = p.nationality ?? 'Unknown'
    natMap[nat] = (natMap[nat] ?? 0) + 1
  })
  const natData = Object.entries(natMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count]) => ({ name, count }))

  const tickStyle = { fontSize: 11, fontFamily: 'var(--font-montserrat)', fill: '#6B7280' }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
      {/* Position Distribution */}
      <div style={CARD}>
        <p style={{ fontSize: 13, fontWeight: 700, color: N, margin: '0 0 14px', fontFamily: 'var(--font-montserrat)' }}>
          Position Distribution
        </p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={positionData} layout="vertical" margin={{ left: 8, right: 16 }}>
            <XAxis type="number" tick={tickStyle} axisLine={false} tickLine={false} allowDecimals={false} />
            <YAxis type="category" dataKey="name" tick={tickStyle} width={56} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ fontFamily: 'var(--font-montserrat)', fontSize: 12, borderRadius: 8, border: `1px solid #E5E7EB` }}
              cursor={{ fill: `${G}10` }}
            />
            <Bar dataKey="count" fill={G} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category Distribution */}
      <div style={CARD}>
        <p style={{ fontSize: 13, fontWeight: 700, color: N, margin: '0 0 14px', fontFamily: 'var(--font-montserrat)' }}>
          Category Distribution
        </p>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={categoryData} dataKey="value"
              cx="50%" cy="45%" innerRadius={50} outerRadius={80}
            >
              {categoryData.map((entry, idx) => (
                <Cell key={idx} fill={entry.color} />
              ))}
            </Pie>
            <Legend
              iconType="circle" iconSize={9}
              formatter={(val: string) => <span style={{ fontSize: 11, fontFamily: 'var(--font-montserrat)', color: N }}>{val}</span>}
            />
            <Tooltip
              contentStyle={{ fontFamily: 'var(--font-montserrat)', fontSize: 12, borderRadius: 8, border: '1px solid #E5E7EB' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Top Nationalities */}
      <div style={CARD}>
        <p style={{ fontSize: 13, fontWeight: 700, color: N, margin: '0 0 14px', fontFamily: 'var(--font-montserrat)' }}>
          Top Nationalities
        </p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={natData} margin={{ left: 0, right: 8, bottom: 16 }}>
            <XAxis dataKey="name" tick={{ ...tickStyle, fontSize: 10 }} axisLine={false} tickLine={false} interval={0} angle={-30} textAnchor="end" />
            <YAxis tick={tickStyle} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip
              contentStyle={{ fontFamily: 'var(--font-montserrat)', fontSize: 12, borderRadius: 8, border: '1px solid #E5E7EB' }}
              cursor={{ fill: `${G}10` }}
            />
            <Bar dataKey="count" fill={G} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// ─── Compliance Tab ───────────────────────────────────────────────────────────

function ComplianceTab() {
  const [records,        setRecords]        = useState<ComplianceRecord[]>([])
  const [loading,        setLoading]        = useState(true)
  const [showAddModal,   setShowAddModal]   = useState(false)
  const [updatingId,     setUpdatingId]     = useState<string | null>(null)

  const fetchRecords = useCallback(() => {
    setLoading(true)
    fetch('/api/dashboard/tools?resource=compliance')
      .then(r => r.json())
      .then(d => setRecords(d.records ?? []))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchRecords() }, [fetchRecords])

  async function cycleStatus(record: ComplianceRecord) {
    const cycle: string[] = ['PENDING_REVIEW', 'VALID', 'EXPIRING_SOON', 'EXPIRED', 'NON_COMPLIANT']
    const next = cycle[(cycle.indexOf(record.status) + 1) % cycle.length]
    setUpdatingId(record.id)
    await fetch(`/api/dashboard/tools?resource=compliance&id=${record.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next }),
    })
    fetchRecords()
    setUpdatingId(null)
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
        <Loader2 size={28} color={G} style={{ animation: 'spin 1s linear infinite' }} />
      </div>
    )
  }

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '9px 16px', borderRadius: 8, border: 'none',
            background: G, color: '#fff', fontSize: 13, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'var(--font-montserrat)',
          }}
        >
          <Plus size={15} /> Add Record
        </button>
      </div>

      {records.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#9CA3AF' }}>
          <Shield size={44} color="#D1D5DB" style={{ marginBottom: 14 }} />
          <p style={{ fontSize: 14, fontWeight: 600, margin: 0, color: N, fontFamily: 'var(--font-montserrat)' }}>
            No compliance records
          </p>
          <p style={{ fontSize: 12, margin: '4px 0 0', fontFamily: 'var(--font-montserrat)' }}>
            Start by adding your agent license or GDPR consents.
          </p>
        </div>
      ) : (
        <div style={{ background: '#fff', border: '1.5px solid #E5E7EB', borderRadius: 14, overflow: 'hidden' }}>
          {/* Table header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1.2fr 1.5fr 1.2fr 1.2fr 1fr 80px',
            padding: '10px 16px', background: '#F8FAFF',
            borderBottom: '1.5px solid #E5E7EB',
            gap: 8,
          }}>
            {['Title', 'Type', 'Entity', 'Status', 'Reference', 'Expiry', 'Actions'].map(h => (
              <span key={h} style={{
                fontSize: 10, fontWeight: 700, color: '#6B7280',
                textTransform: 'uppercase', letterSpacing: '0.06em',
                fontFamily: 'var(--font-montserrat)',
              }}>{h}</span>
            ))}
          </div>

          {/* Rows */}
          {records.map((rec, idx) => {
            const ss = complianceStatusStyle(rec.status)
            return (
              <div
                key={rec.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1.2fr 1.5fr 1.2fr 1.2fr 1fr 80px',
                  padding: '12px 16px', gap: 8, alignItems: 'center',
                  borderBottom: idx < records.length - 1 ? '1px solid #F3F4F6' : 'none',
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 600, color: N, fontFamily: 'var(--font-montserrat)' }}>
                  {rec.title}
                </span>
                <span style={{ fontSize: 11, color: '#6B7280', fontFamily: 'var(--font-montserrat)' }}>
                  {complianceTypeLabel(rec.type)}
                </span>
                <span style={{ fontSize: 12, color: N, fontFamily: 'var(--font-montserrat)' }}>
                  {rec.entityName}
                </span>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 999,
                  background: ss.bg, color: ss.color, fontFamily: 'var(--font-montserrat)',
                  display: 'inline-block', width: 'fit-content',
                }}>
                  {complianceStatusLabel(rec.status)}
                </span>
                <span style={{ fontSize: 11, color: '#6B7280', fontFamily: 'var(--font-montserrat)' }}>
                  {rec.referenceNumber ?? '—'}
                </span>
                <span style={{ fontSize: 11, color: '#6B7280', fontFamily: 'var(--font-montserrat)' }}>
                  {fmtDate(rec.expiryDate)}
                </span>
                <button
                  onClick={() => cycleStatus(rec)}
                  disabled={updatingId === rec.id}
                  style={{
                    padding: '5px 10px', borderRadius: 7, border: '1.5px solid #E5E7EB',
                    background: '#fff', color: '#6B7280', fontSize: 11, fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'var(--font-montserrat)',
                    display: 'flex', alignItems: 'center', gap: 4,
                  }}
                >
                  {updatingId === rec.id
                    ? <Loader2 size={11} style={{ animation: 'spin 1s linear infinite' }} />
                    : 'Update'
                  }
                </button>
              </div>
            )
          })}
        </div>
      )}

      {showAddModal && (
        <AddComplianceModal onClose={() => setShowAddModal(false)} onSaved={fetchRecords} />
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type TabId = 'ai-agent' | 'integrations' | 'reports' | 'compliance'

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'ai-agent',      label: 'AI Agent',     icon: <Bot size={15} /> },
  { id: 'integrations',  label: 'Integrations', icon: <Plug size={15} /> },
  { id: 'reports',       label: 'Reports',      icon: <BarChart2 size={15} /> },
  { id: 'compliance',    label: 'Compliance',   icon: <Shield size={15} /> },
]

export default function ToolsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('ai-agent')

  return (
    <div style={{ padding: '28px 32px', fontFamily: 'var(--font-montserrat)', color: N, minHeight: '100vh', background: '#F8FAFF' }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: N, margin: 0, fontFamily: 'var(--font-montserrat)' }}>Tools</h1>
        <p style={{ fontSize: 13, color: '#6B7280', margin: '4px 0 0', fontFamily: 'var(--font-montserrat)' }}>
          Configure your AI agent, integrations, analytics, and compliance
        </p>
      </div>

      {/* Tab navigation */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '8px 18px', borderRadius: 999, cursor: 'pointer',
              fontFamily: 'var(--font-montserrat)', fontSize: 13, fontWeight: 600,
              background: activeTab === tab.id ? N : '#fff',
              color:      activeTab === tab.id ? '#fff' : '#6B7280',
              boxShadow:  activeTab === tab.id ? 'none' : '0 1px 4px rgba(0,0,0,0.08)',
              border:     activeTab === tab.id ? 'none' : '1.5px solid #E5E7EB',
              display: 'flex', alignItems: 'center', gap: 7,
              transition: 'all 0.15s',
            } as React.CSSProperties}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'ai-agent'     && <AIAgentTab />}
      {activeTab === 'integrations' && <IntegrationsTab />}
      {activeTab === 'reports'      && <ReportsTab />}
      {activeTab === 'compliance'   && <ComplianceTab />}

      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
