'use client'

import { useState, useEffect, useMemo } from 'react'
import { Plus, TrendingUp, Trash2 } from 'lucide-react'

const N = '#0A0A0A'
const G = '#2563EB'

interface Commission {
  id: string
  description: string
  dealValue: number
  rate: number
  amount: number
  status: 'EXPECTED' | 'INVOICED' | 'RECEIVED' | 'CANCELLED'
  expectedAt: string | null
  receivedAt: string | null
  createdAt: string
  player: { id: string; fullName: string; position: string | null } | null
}

const STATUS_STYLES = {
  EXPECTED:  { bg: 'rgba(37,99,235,0.1)',   color: G,         label: 'Expected'  },
  INVOICED:  { bg: 'rgba(245,158,11,0.1)',   color: '#F59E0B', label: 'Invoiced'  },
  RECEIVED:  { bg: 'rgba(5,150,105,0.1)',    color: '#059669', label: 'Received'  },
  CANCELLED: { bg: '#F3F4F6',               color: '#9CA3AF', label: 'Cancelled' },
}

function StatBox({ label, value, color = N, sub }: { label: string; value: string; color?: string; sub?: string }) {
  return (
    <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 14, padding: '20px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
      <p style={{ fontSize: 12, color: '#9CA3AF', margin: '0 0 6px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
      <p style={{ fontSize: 28, fontWeight: 900, color, margin: 0, letterSpacing: '-0.03em', fontFamily: 'var(--font-montserrat)' }}>{value}</p>
      {sub && <p style={{ fontSize: 11, color: '#9CA3AF', margin: '4px 0 0' }}>{sub}</p>}
    </div>
  )
}

export default function CommissionsPage() {
  const [commissions, setCommissions] = useState<Commission[]>([])
  const [loading, setLoading]         = useState(true)
  const [showForm, setShowForm]       = useState(false)
  const [form, setForm]               = useState({
    description: '', dealValue: '', rate: '5', playerId: '', expectedAt: '',
  })
  const [saving, setSaving] = useState(false)

  function fetchCommissions() {
    setLoading(true)
    fetch('/api/dashboard/commissions')
      .then(r => r.json())
      .then(d => setCommissions(d.commissions ?? []))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchCommissions() }, [])

  const totals = useMemo(() => {
    const expected  = commissions.filter(c => c.status === 'EXPECTED').reduce((s, c) => s + c.amount, 0)
    const invoiced  = commissions.filter(c => c.status === 'INVOICED').reduce((s, c) => s + c.amount, 0)
    const received  = commissions.filter(c => c.status === 'RECEIVED').reduce((s, c) => s + c.amount, 0)
    const pipeline  = expected + invoiced
    return { expected, invoiced, received, pipeline }
  }, [commissions])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.description || !form.dealValue) return
    setSaving(true)
    try {
      await fetch('/api/dashboard/commissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: form.description,
          dealValue:   Number(form.dealValue),
          rate:        Number(form.rate) / 100,
          playerId:    form.playerId || null,
          expectedAt:  form.expectedAt || null,
        }),
      })
      setForm({ description: '', dealValue: '', rate: '5', playerId: '', expectedAt: '' })
      setShowForm(false)
      fetchCommissions()
    } finally {
      setSaving(false)
    }
  }

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/dashboard/commissions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    fetchCommissions()
  }

  async function deleteCommission(id: string) {
    if (!confirm('Delete this commission record?')) return
    await fetch(`/api/dashboard/commissions/${id}`, { method: 'DELETE' })
    fetchCommissions()
  }

  const fmt = (n: number) => `€${n.toLocaleString('en-EU', { maximumFractionDigits: 0 })}`

  return (
    <div style={{ padding: 'clamp(20px,4vw,40px)', fontFamily: 'var(--font-montserrat), sans-serif', maxWidth: 1000 }}>
      <style>{`
        .cm-stats  { grid-template-columns: repeat(4, 1fr) !important; }
        .cm-form   { grid-template-columns: 2fr 1fr 1fr 1fr !important; }
        .cm-table  { display: table !important; }
        .cm-cards  { display: none !important; }
        @media (max-width: 640px) {
          .cm-stats { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
          .cm-form  { grid-template-columns: 1fr !important; }
          .cm-table { display: none !important; }
          .cm-cards { display: flex !important; }
        }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: N, margin: '0 0 4px', letterSpacing: '-0.03em' }}>Commission Tracker</h1>
          <p style={{ color: '#9CA3AF', margin: 0, fontSize: 14 }}>Log expected and received commissions per deal.</p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          style={{ display: 'flex', alignItems: 'center', gap: 7, background: N, color: 'white', padding: '10px 18px', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13, fontFamily: 'inherit' }}
        >
          <Plus size={15} /> Add Commission
        </button>
      </div>

      {/* Stats */}
      <div className="cm-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        <StatBox label="Pipeline" value={fmt(totals.pipeline)} color={G} sub={`${commissions.filter(c => c.status === 'EXPECTED' || c.status === 'INVOICED').length} deals`} />
        <StatBox label="Expected" value={fmt(totals.expected)} sub={`${commissions.filter(c => c.status === 'EXPECTED').length} deals`} />
        <StatBox label="Invoiced" value={fmt(totals.invoiced)} color="#F59E0B" sub={`${commissions.filter(c => c.status === 'INVOICED').length} deals`} />
        <StatBox label="Received" value={fmt(totals.received)} color="#059669" sub={`${commissions.filter(c => c.status === 'RECEIVED').length} deals`} />
      </div>

      {/* Add form */}
      {showForm && (
        <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 14, padding: 24, marginBottom: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: N, margin: '0 0 16px' }}>New Commission</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }} className="cm-form">
            <div>
              <label style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 4 }}>Description</label>
              <input value={form.description} onChange={e => setForm(v => ({ ...v, description: e.target.value }))}
                placeholder="e.g. Transfer fee — Fernández to Club A"
                required
                style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 13, boxSizing: 'border-box', fontFamily: 'inherit' }} />
            </div>
            <div>
              <label style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 4 }}>Deal Value (€)</label>
              <input type="number" value={form.dealValue} onChange={e => setForm(v => ({ ...v, dealValue: e.target.value }))}
                placeholder="e.g. 500000" min={0} required
                style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 13, boxSizing: 'border-box', fontFamily: 'inherit' }} />
            </div>
            <div>
              <label style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 4 }}>Rate (%)</label>
              <input type="number" value={form.rate} onChange={e => setForm(v => ({ ...v, rate: e.target.value }))}
                placeholder="5" min={0} max={100} step={0.5}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 13, boxSizing: 'border-box', fontFamily: 'inherit' }} />
            </div>
            <div>
              <label style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 4 }}>Expected Date</label>
              <input type="date" value={form.expectedAt} onChange={e => setForm(v => ({ ...v, expectedAt: e.target.value }))}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 13, boxSizing: 'border-box', fontFamily: 'inherit' }} />
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              {form.dealValue && form.rate && (
                <span style={{ fontSize: 13, color: G, fontWeight: 700, alignSelf: 'center' }}>
                  Commission: {fmt(Number(form.dealValue) * Number(form.rate) / 100)}
                </span>
              )}
              <button type="button" onClick={() => setShowForm(false)}
                style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #E5E7EB', background: 'white', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', fontWeight: 600, color: '#6B7280' }}>
                Cancel
              </button>
              <button type="submit" disabled={saving}
                style={{ padding: '8px 20px', borderRadius: 8, background: G, color: 'white', border: 'none', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', fontWeight: 700 }}>
                {saving ? 'Saving…' : 'Add'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Commission list */}
      <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 14, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: 'center', color: '#9CA3AF', fontSize: 14 }}>Loading…</div>
        ) : commissions.length === 0 ? (
          <div style={{ padding: 64, textAlign: 'center' }}>
            <TrendingUp size={36} color="#E5E7EB" style={{ margin: '0 auto 12px', display: 'block' }} />
            <p style={{ fontSize: 15, fontWeight: 700, color: N, margin: '0 0 6px' }}>No commissions yet</p>
            <p style={{ fontSize: 13, color: '#9CA3AF', margin: 0 }}>Add your first deal commission above.</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <table className="cm-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                  {['Deal', 'Player', 'Deal Value', 'Rate', 'Commission', 'Status', 'Expected', ''].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {commissions.map(c => {
                  const s = STATUS_STYLES[c.status]
                  return (
                    <tr key={c.id} style={{ borderTop: '1px solid #F3F4F6' }}>
                      <td style={{ padding: '13px 16px', fontSize: 13, color: N, fontWeight: 600, maxWidth: 220 }}>
                        <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.description}</span>
                      </td>
                      <td style={{ padding: '13px 16px', fontSize: 12, color: '#6B7280' }}>{c.player ? c.player.fullName : '—'}</td>
                      <td style={{ padding: '13px 16px', fontSize: 13, color: '#374151', fontWeight: 500 }}>{fmt(c.dealValue)}</td>
                      <td style={{ padding: '13px 16px', fontSize: 13, color: '#374151' }}>{(c.rate * 100).toFixed(1)}%</td>
                      <td style={{ padding: '13px 16px', fontSize: 14, color: G, fontWeight: 800 }}>{fmt(c.amount)}</td>
                      <td style={{ padding: '13px 16px' }}>
                        <select value={c.status} onChange={e => updateStatus(c.id, e.target.value)}
                          style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 20, background: s.bg, color: s.color, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                          {Object.entries(STATUS_STYLES).map(([k, v]) => (
                            <option key={k} value={k}>{v.label}</option>
                          ))}
                        </select>
                      </td>
                      <td style={{ padding: '13px 16px', fontSize: 12, color: '#9CA3AF' }}>
                        {c.expectedAt ? new Date(c.expectedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                      </td>
                      <td style={{ padding: '13px 16px' }}>
                        <button onClick={() => deleteCommission(c.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#9CA3AF' }} title="Delete">
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {/* Mobile card list */}
            <div className="cm-cards" style={{ flexDirection: 'column', gap: 10, padding: 12 }}>
              {commissions.map(c => {
                const s = STATUS_STYLES[c.status]
                return (
                  <div key={`m-${c.id}`} style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 13, padding: '14px 16px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 14, fontWeight: 700, color: N, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.description}</p>
                        {c.player && <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>{c.player.fullName}</p>}
                      </div>
                      <button onClick={() => deleteCommission(c.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px', color: '#9CA3AF', flexShrink: 0 }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px 4px', marginBottom: 12 }}>
                      <div>
                        <p style={{ fontSize: 9, color: '#9CA3AF', margin: '0 0 1px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Deal</p>
                        <p style={{ fontSize: 13, fontWeight: 600, color: N, margin: 0 }}>{fmt(c.dealValue)}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: 9, color: '#9CA3AF', margin: '0 0 1px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rate</p>
                        <p style={{ fontSize: 13, fontWeight: 600, color: N, margin: 0 }}>{(c.rate * 100).toFixed(1)}%</p>
                      </div>
                      <div>
                        <p style={{ fontSize: 9, color: '#9CA3AF', margin: '0 0 1px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Commission</p>
                        <p style={{ fontSize: 14, fontWeight: 800, color: G, margin: 0 }}>{fmt(c.amount)}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <select value={c.status} onChange={e => updateStatus(c.id, e.target.value)}
                        style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, background: s.bg, color: s.color, border: `1px solid ${s.color}30`, cursor: 'pointer', fontFamily: 'inherit' }}>
                        {Object.entries(STATUS_STYLES).map(([k, v]) => (
                          <option key={k} value={k}>{v.label}</option>
                        ))}
                      </select>
                      {c.expectedAt && (
                        <span style={{ fontSize: 11, color: '#9CA3AF' }}>
                          {new Date(c.expectedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
