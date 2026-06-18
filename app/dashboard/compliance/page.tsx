'use client'

import { useState, useEffect, useCallback } from 'react'
import { Shield, Plus, X, Loader2 } from 'lucide-react'

const N = '#0A0A0A'
const G = '#2563EB'

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

function complianceStatusStyle(status: string): { bg: string; color: string } {
  switch (status) {
    case 'VALID':           return { bg: 'rgba(34,197,94,0.12)',   color: '#16A34A' }
    case 'EXPIRING_SOON':   return { bg: 'rgba(245,158,11,0.12)',  color: '#D97706' }
    case 'EXPIRED':         return { bg: 'rgba(239,68,68,0.12)',   color: '#DC2626' }
    case 'NON_COMPLIANT':   return { bg: 'rgba(239,68,68,0.12)',   color: '#DC2626' }
    case 'PENDING_REVIEW':  return { bg: 'rgba(156,163,175,0.15)', color: '#6B7280' }
    default:                return { bg: '#F3F4F6',                color: '#6B7280' }
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
    setSaving(true); setError('')
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
      onSaved(); onClose()
    } catch { setError('Network error') }
    finally { setSaving(false) }
  }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(10,22,40,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16, width: 480, maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', fontFamily: 'var(--font-montserrat)' }}>
        <div style={{ padding: '24px 28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: N }}>Add Compliance Record</span>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}><X size={18} color="#9CA3AF" /></button>
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
              <button type="button" onClick={onClose} style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: '1.5px solid #E5E7EB', background: '#fff', color: '#6B7280', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-montserrat)' }}>Cancel</button>
              <button type="submit" disabled={saving} style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: 'none', background: saving ? '#9CA3AF' : G, color: '#fff', fontSize: 13, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-montserrat)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
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

export default function CompliancePage() {
  const [records,      setRecords]      = useState<ComplianceRecord[]>([])
  const [loading,      setLoading]      = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [updatingId,   setUpdatingId]   = useState<string | null>(null)

  const fetchRecords = useCallback(() => {
    setLoading(true)
    fetch('/api/dashboard/tools?resource=compliance')
      .then(r => r.json())
      .then(d => setRecords(d.records ?? []))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchRecords() }, [fetchRecords])

  async function cycleStatus(record: ComplianceRecord) {
    const cycle = ['PENDING_REVIEW', 'VALID', 'EXPIRING_SOON', 'EXPIRED', 'NON_COMPLIANT']
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

  return (
    <div style={{ padding: 'clamp(16px,4vw,28px) clamp(16px,4vw,32px)', fontFamily: 'var(--font-montserrat)', color: N, minHeight: '100vh', background: '#F8FAFF' }}>
      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: N, margin: 0, fontFamily: 'var(--font-montserrat)' }}>Compliance</h1>
        <p style={{ fontSize: 13, color: '#6B7280', margin: '4px 0 0', fontFamily: 'var(--font-montserrat)' }}>
          Manage licenses, GDPR consents, and regulatory documents
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
          <Loader2 size={28} color={G} style={{ animation: 'spin 1s linear infinite' }} />
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <button
              onClick={() => setShowAddModal(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 8, border: 'none', background: G, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-montserrat)' }}
            >
              <Plus size={15} /> Add Record
            </button>
          </div>

          {records.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#9CA3AF' }}>
              <Shield size={44} color="#D1D5DB" style={{ marginBottom: 14 }} />
              <p style={{ fontSize: 14, fontWeight: 600, margin: 0, color: N, fontFamily: 'var(--font-montserrat)' }}>No compliance records</p>
              <p style={{ fontSize: 12, margin: '4px 0 0', fontFamily: 'var(--font-montserrat)' }}>Start by adding your agent license or GDPR consents.</p>
            </div>
          ) : (
            <div style={{ background: '#fff', border: '1.5px solid #E5E7EB', borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1.5fr 1.2fr 1.2fr 1fr 80px', padding: '10px 16px', background: '#F8FAFF', borderBottom: '1.5px solid #E5E7EB', gap: 8 }}>
                {['Title', 'Type', 'Entity', 'Status', 'Reference', 'Expiry', 'Actions'].map(h => (
                  <span key={h} style={{ fontSize: 10, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--font-montserrat)' }}>{h}</span>
                ))}
              </div>
              {records.map((rec, idx) => {
                const ss = complianceStatusStyle(rec.status)
                return (
                  <div key={rec.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1.5fr 1.2fr 1.2fr 1fr 80px', padding: '12px 16px', gap: 8, alignItems: 'center', borderBottom: idx < records.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: N, fontFamily: 'var(--font-montserrat)' }}>{rec.title}</span>
                    <span style={{ fontSize: 11, color: '#6B7280', fontFamily: 'var(--font-montserrat)' }}>{complianceTypeLabel(rec.type)}</span>
                    <span style={{ fontSize: 12, color: N, fontFamily: 'var(--font-montserrat)' }}>{rec.entityName}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 999, background: ss.bg, color: ss.color, fontFamily: 'var(--font-montserrat)', display: 'inline-block', width: 'fit-content' }}>
                      {complianceStatusLabel(rec.status)}
                    </span>
                    <span style={{ fontSize: 11, color: '#6B7280', fontFamily: 'var(--font-montserrat)' }}>{rec.referenceNumber ?? '—'}</span>
                    <span style={{ fontSize: 11, color: '#6B7280', fontFamily: 'var(--font-montserrat)' }}>{fmtDate(rec.expiryDate)}</span>
                    <button
                      onClick={() => cycleStatus(rec)}
                      disabled={updatingId === rec.id}
                      style={{ padding: '5px 10px', borderRadius: 7, border: '1.5px solid #E5E7EB', background: '#fff', color: '#6B7280', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-montserrat)', display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                      {updatingId === rec.id ? <Loader2 size={11} style={{ animation: 'spin 1s linear infinite' }} /> : 'Update'}
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {showAddModal && <AddComplianceModal onClose={() => setShowAddModal(false)} onSaved={fetchRecords} />}
    </div>
  )
}
