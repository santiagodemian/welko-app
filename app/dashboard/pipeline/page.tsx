'use client'

import { useState, useEffect } from 'react'
import { Plus, Loader2, X, Trash2, ChevronRight, ArrowRight } from 'lucide-react'

const N = '#0A0A0A'
const G = '#2563EB'

type StageName = 'INITIAL_CONTACT' | 'PROPOSAL_SENT' | 'FINANCIAL_TALKS' | 'CONTRACT_CLOSURE'

const STAGES: { id: StageName; label: string; color: string }[] = [
  { id: 'INITIAL_CONTACT',  label: 'Initial Contact',  color: '#6B7280' },
  { id: 'PROPOSAL_SENT',    label: 'Proposal Sent',    color: '#7C3AED' },
  { id: 'FINANCIAL_TALKS',  label: 'Financial Talks',  color: '#D97706' },
  { id: 'CONTRACT_CLOSURE', label: 'Contract Closure', color: '#059669' },
]

interface NegotiationPlayer {
  id:          string
  fullName:    string
  position:    string | null
  nationality: string | null
  eloRating:   number | null
}

interface Negotiation {
  id:                 string
  pipelineId:         string
  targetClub:         string | null
  estimatedDealValue: number | null
  player:             NegotiationPlayer
}

interface Stage {
  id:           string
  name:         StageName
  negotiations: Negotiation[]
}

interface PortfolioPlayer {
  id:          string
  fullName:    string
  position:    string | null
  nationality: string | null
}

export default function PipelinePage() {
  const [stages,  setStages]  = useState<Stage[]>([])
  const [loading, setLoading] = useState(true)
  const [addToStage, setAddToStage] = useState<StageName | null>(null)
  const [moving, setMoving]         = useState<string | null>(null)

  async function load() {
    const res = await fetch('/api/dashboard/pipeline')
    const d   = await res.json()
    setStages(d.stages ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function getStage(name: StageName) {
    return stages.find(s => s.name === name)
  }

  async function moveCard(negId: string, toStage: StageName) {
    setMoving(negId)
    await fetch(`/api/dashboard/pipeline/${negId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stageName: toStage }),
    })
    await load()
    setMoving(null)
  }

  async function deleteCard(negId: string) {
    await fetch(`/api/dashboard/pipeline/${negId}`, { method: 'DELETE' })
    setStages(prev => prev.map(s => ({ ...s, negotiations: s.negotiations.filter(n => n.id !== negId) })))
  }

  const totalValue = stages.flatMap(s => s.negotiations).reduce((sum, n) => sum + (n.estimatedDealValue ?? 0), 0)

  return (
    <div style={{ padding: 'clamp(20px,4vw,32px) clamp(16px,4vw,40px) 80px', fontFamily: 'var(--font-montserrat), sans-serif' }}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        .pipeline-board { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; align-items: start; }
        @media (max-width: 768px) {
          .pipeline-board { display: flex; overflow-x: auto; gap: 12px; padding-bottom: 16px; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; }
          .pipeline-col { min-width: 260px; scroll-snap-align: start; flex-shrink: 0; }
        }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: N, margin: '0 0 4px', letterSpacing: '-0.02em' }}>Transfer Pipeline</h1>
          <p style={{ color: '#9CA3AF', margin: 0, fontSize: 14 }}>
            Track active negotiations across all stages
            {totalValue > 0 && <span style={{ color: G, fontWeight: 700, marginLeft: 8 }}>· €{(totalValue / 1000).toFixed(0)}k pipeline value</span>}
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: 64, textAlign: 'center', color: '#9CA3AF' }}>
          <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 12px', display: 'block' }} />
          <p style={{ fontSize: 14, margin: 0 }}>Loading pipeline…</p>
        </div>
      ) : (
        <div className="pipeline-board">
          {STAGES.map((stageDef, stageIdx) => {
            const stage = getStage(stageDef.id)
            const cards = stage?.negotiations ?? []

            return (
              <div key={stageDef.id} className="pipeline-col" style={{ background: '#F9FAFB', borderRadius: 14, border: '1px solid #E5E7EB', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                {/* Column header */}
                <div style={{ padding: '14px 16px', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: stageDef.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, fontWeight: 800, color: N }}>{stageDef.label}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', background: 'white', border: '1px solid #E5E7EB', borderRadius: 20, padding: '1px 7px' }}>{cards.length}</span>
                  </div>
                  <button
                    onClick={() => setAddToStage(stageDef.id)}
                    style={{ width: 26, height: 26, borderRadius: 7, background: 'white', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  >
                    <Plus size={13} color="#6B7280" />
                  </button>
                </div>

                {/* Cards */}
                <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 8, minHeight: 80 }}>
                  {cards.map(neg => {
                    const isMoving  = moving === neg.id
                    const nextStage = STAGES[stageIdx + 1]

                    return (
                      <div key={neg.id} style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 11, padding: '12px 14px', opacity: isMoving ? 0.5 : 1 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
                          <div style={{ minWidth: 0 }}>
                            <p style={{ fontSize: 13, fontWeight: 700, color: N, margin: '0 0 2px', lineHeight: 1.2 }}>{neg.player.fullName}</p>
                            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                              {neg.player.position && (
                                <span style={{ fontSize: 10, fontWeight: 700, color: G, background: `${G}12`, padding: '1px 6px', borderRadius: 4 }}>{neg.player.position}</span>
                              )}
                              {neg.player.nationality && (
                                <span style={{ fontSize: 11 }}>{neg.player.nationality}</span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => deleteCard(neg.id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#D1D5DB', padding: 2, flexShrink: 0 }}
                            onMouseEnter={e => (e.currentTarget.style.color = '#EF4444')}
                            onMouseLeave={e => (e.currentTarget.style.color = '#D1D5DB')}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>

                        {neg.targetClub && (
                          <p style={{ fontSize: 11, color: '#6B7280', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <ChevronRight size={10} /> {neg.targetClub}
                          </p>
                        )}
                        {neg.estimatedDealValue ? (
                          <p style={{ fontSize: 11, fontWeight: 700, color: '#059669', margin: '0 0 8px' }}>
                            €{(neg.estimatedDealValue / 1000).toFixed(0)}k/yr
                          </p>
                        ) : null}

                        {nextStage ? (
                          <button
                            onClick={() => moveCard(neg.id, nextStage.id)}
                            disabled={isMoving}
                            style={{ display: 'flex', alignItems: 'center', gap: 5, width: '100%', padding: '6px 10px', background: '#F3F4F6', border: 'none', borderRadius: 7, cursor: isMoving ? 'wait' : 'pointer', fontSize: 11, fontWeight: 600, color: '#6B7280', fontFamily: 'inherit', justifyContent: 'center' }}
                          >
                            {isMoving
                              ? <Loader2 size={11} style={{ animation: 'spin 1s linear infinite' }} />
                              : <><ArrowRight size={11} /> Move to {nextStage.label}</>}
                          </button>
                        ) : (
                          <span style={{ display: 'block', textAlign: 'center', fontSize: 10, fontWeight: 700, color: '#059669', padding: '4px 0' }}>✓ Deal Closed</span>
                        )}
                      </div>
                    )
                  })}

                  {cards.length === 0 && (
                    <p style={{ fontSize: 12, color: '#D1D5DB', textAlign: 'center', padding: '16px 0', margin: 0 }}>No negotiations yet</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {addToStage && (
        <AddCardModal
          stageName={addToStage}
          stageLabel={STAGES.find(s => s.id === addToStage)!.label}
          onClose={() => setAddToStage(null)}
          onAdded={() => { setAddToStage(null); load() }}
        />
      )}
    </div>
  )
}

// ─── AddCardModal ─────────────────────────────────────────────────────────────

function AddCardModal({ stageName, stageLabel, onClose, onAdded }: {
  stageName:  StageName
  stageLabel: string
  onClose:    () => void
  onAdded:    () => void
}) {
  const [players,    setPlayers]    = useState<PortfolioPlayer[]>([])
  const [playerId,   setPlayerId]   = useState('')
  const [targetClub, setTargetClub] = useState('')
  const [dealValue,  setDealValue]  = useState('')
  const [saving,     setSaving]     = useState(false)
  const [error,      setError]      = useState('')

  useEffect(() => {
    fetch('/api/dashboard/players')
      .then(r => r.json())
      .then(d => setPlayers(d.players ?? []))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!playerId) { setError('Select a player.'); return }
    setSaving(true); setError('')
    try {
      const res = await fetch('/api/dashboard/pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId,
          stageName,
          targetClub:         targetClub || undefined,
          estimatedDealValue: dealValue  ? parseFloat(dealValue) : undefined,
        }),
      })
      if (!res.ok) { const d = await res.json(); setError(d.error ?? 'Failed'); return }
      onAdded()
    } finally { setSaving(false) }
  }

  const field: React.CSSProperties = { width: '100%', padding: '9px 12px', border: '1px solid #E5E7EB', borderRadius: 9, fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', color: N }
  const lbl:   React.CSSProperties = { fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 5 }

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(10,22,40,0.5)', zIndex: 50 }} />
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 51, width: '90%', maxWidth: 440, background: 'white', borderRadius: 16, fontFamily: 'var(--font-montserrat), sans-serif', boxShadow: '0 24px 80px rgba(10,22,40,0.25)' }}>
        <div style={{ padding: '18px 22px', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: 15, fontWeight: 800, color: N, margin: 0 }}>Add to {stageLabel}</p>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}><X size={17} /></button>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {error && <p style={{ fontSize: 12, color: '#EF4444', margin: 0 }}>{error}</p>}
          <div>
            <label style={lbl}>Player *</label>
            <select value={playerId} onChange={e => setPlayerId(e.target.value)} style={field}>
              <option value="">Select from your portfolio…</option>
              {players.map(p => (
                <option key={p.id} value={p.id}>{p.fullName}{p.position ? ` (${p.position})` : ''}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={lbl}>Target Club</label>
            <input value={targetClub} onChange={e => setTargetClub(e.target.value)} placeholder="FK Sarajevo" style={field} />
          </div>
          <div>
            <label style={lbl}>Estimated Deal Value (€/yr)</label>
            <input type="number" min={0} value={dealValue} onChange={e => setDealValue(e.target.value)} placeholder="36000" style={field} />
          </div>
          <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
            <button type="submit" disabled={saving} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, background: N, color: 'white', border: 'none', borderRadius: 10, padding: '11px', fontWeight: 800, fontSize: 13, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: saving ? 0.7 : 1 }}>
              {saving ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Saving…</> : <><Plus size={14} /> Add to Pipeline</>}
            </button>
            <button type="button" onClick={onClose} style={{ padding: '11px 18px', background: '#F3F4F6', border: 'none', borderRadius: 10, fontSize: 13, color: '#6B7280', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
          </div>
        </form>
      </div>
    </>
  )
}
