'use client'

import { useState, useEffect } from 'react'
import { Plus, Loader2, X, Trash2, ChevronRight, ArrowRight, TrendingUp } from 'lucide-react'

const N = '#0A0A0A'
const G = '#2563EB'

type StageName = 'INITIAL_CONTACT' | 'PROPOSAL_SENT' | 'FINANCIAL_TALKS' | 'CONTRACT_CLOSURE'

const STAGES: { id: StageName; label: string; color: string; prob: number }[] = [
  { id: 'INITIAL_CONTACT',  label: 'Initial Contact',  color: '#6B7280', prob: 10 },
  { id: 'PROPOSAL_SENT',    label: 'Proposal Sent',    color: '#7C3AED', prob: 30 },
  { id: 'FINANCIAL_TALKS',  label: 'Financial Talks',  color: '#D97706', prob: 65 },
  { id: 'CONTRACT_CLOSURE', label: 'Contract Closure', color: '#059669', prob: 90 },
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
  updatedAt:          string
  stageMovedAt:       string | null
  player:             NegotiationPlayer
}

interface Stage {
  id:           string
  name:         StageName
  negotiations: Negotiation[]
}

interface PortfolioPlayer {
  id:       string
  fullName: string
  position: string | null
}

function daysSince(dateStr: string | null): number {
  if (!dateStr) return 0
  return Math.max(0, Math.floor((Date.now() - new Date(dateStr).getTime()) / 86_400_000))
}

function formatValue(v: number | null): string {
  if (!v) return ''
  if (v >= 1_000_000) return `€${(v / 1_000_000).toFixed(1)}M/yr`
  if (v >= 1_000)     return `€${Math.round(v / 1_000)}k/yr`
  return `€${Math.round(v)}/yr`
}

function formatCommission(v: number | null): string {
  if (!v) return ''
  const c = v * 0.05
  if (c >= 1_000) return `€${Math.round(c / 1_000)}k fee`
  return `€${Math.round(c)} fee`
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

  // Summary stats
  const allCards       = stages.flatMap(s => s.negotiations)
  const totalValue     = allCards.reduce((sum, n) => sum + (n.estimatedDealValue ?? 0), 0)
  const weightedValue  = STAGES.reduce((sum, def) => {
    const stage = getStage(def.id)
    const sv = (stage?.negotiations ?? []).reduce((s, n) => s + (n.estimatedDealValue ?? 0), 0)
    return sum + sv * (def.prob / 100)
  }, 0)
  const totalCards     = allCards.length

  return (
    <div style={{ padding: 'clamp(20px,4vw,32px) clamp(16px,4vw,40px) 80px', fontFamily: 'var(--font-montserrat), sans-serif' }}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        .pipeline-board { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; align-items: start; }
        @media (max-width: 900px) {
          .pipeline-board { display: flex; overflow-x: auto; gap: 12px; padding-bottom: 16px; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; }
          .pipeline-col { min-width: 260px; scroll-snap-align: start; flex-shrink: 0; }
        }
        .neg-card { transition: box-shadow 0.12s; }
        .neg-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08) !important; }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: N, margin: '0 0 4px', letterSpacing: '-0.02em' }}>
          Transfer Pipeline
        </h1>
        <p style={{ color: '#9CA3AF', margin: 0, fontSize: 14 }}>
          Track negotiations · probability-weighted forecasting
        </p>
      </div>

      {/* Summary bar */}
      {totalCards > 0 && (
        <div style={{
          display: 'flex', gap: 0, borderRadius: 12, border: '1.5px solid #E5E7EB',
          background: 'white', overflow: 'hidden', marginBottom: 22,
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        }}>
          {[
            { label: 'Deals active', value: String(totalCards) },
            { label: 'Pipeline value', value: totalValue >= 1_000 ? `€${Math.round(totalValue / 1_000)}k/yr` : `€${Math.round(totalValue)}` },
            { label: 'Weighted forecast', value: weightedValue >= 1_000 ? `€${Math.round(weightedValue / 1_000)}k/yr` : `€${Math.round(weightedValue)}`, accent: true },
            { label: 'Commission est. (5%)', value: (totalValue * 0.05) >= 1_000 ? `€${Math.round(totalValue * 0.05 / 1_000)}k` : `€${Math.round(totalValue * 0.05)}` },
          ].map(({ label, value, accent }, i) => (
            <div key={i} style={{
              flex: 1, padding: '12px 18px',
              borderLeft: i > 0 ? '1px solid #F3F4F6' : 'none',
              background: accent ? '#F5F8FF' : 'transparent',
            }}>
              <p style={{ fontSize: 10, color: '#9CA3AF', margin: '0 0 3px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</p>
              <p style={{ fontSize: 18, fontWeight: 800, color: accent ? G : N, margin: 0, letterSpacing: '-0.02em', fontFamily: 'var(--font-space-grotesk), sans-serif' }}>{value}</p>
            </div>
          ))}
        </div>
      )}

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
            const stageValue = cards.reduce((s, n) => s + (n.estimatedDealValue ?? 0), 0)

            return (
              <div key={stageDef.id} className="pipeline-col" style={{ background: '#F9FAFB', borderRadius: 14, border: '1px solid #E5E7EB', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                {/* Column header */}
                <div style={{ padding: '12px 14px', borderBottom: '1px solid #E5E7EB' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: stageDef.color }} />
                      <span style={{ fontSize: 11, fontWeight: 800, color: N }}>{stageDef.label}</span>
                      <span style={{ fontSize: 10, fontWeight: 600, color: '#9CA3AF', background: 'white', border: '1px solid #E5E7EB', borderRadius: 20, padding: '1px 6px' }}>{cards.length}</span>
                    </div>
                    <button
                      onClick={() => setAddToStage(stageDef.id)}
                      style={{ width: 24, height: 24, borderRadius: 6, background: 'white', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    >
                      <Plus size={12} color="#6B7280" />
                    </button>
                  </div>
                  {/* Probability + stage value */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: stageDef.color, background: `${stageDef.color}15`, padding: '2px 7px', borderRadius: 5 }}>
                      {stageDef.prob}% close
                    </span>
                    {stageValue > 0 && (
                      <span style={{ fontSize: 10, fontWeight: 600, color: '#9CA3AF' }}>
                        €{Math.round(stageValue / 1_000)}k
                      </span>
                    )}
                  </div>
                </div>

                {/* Cards */}
                <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 8, minHeight: 80 }}>
                  {cards.map(neg => {
                    const isMoving  = moving === neg.id
                    const nextStage = STAGES[stageIdx + 1]
                    const stale     = daysSince(neg.stageMovedAt ?? neg.updatedAt)
                    const staleColor = stale >= 30 ? '#EF4444' : stale >= 14 ? '#D97706' : '#9CA3AF'
                    const staleBg    = stale >= 30 ? '#FEF2F2' : stale >= 14 ? '#FFFBEB' : 'transparent'

                    return (
                      <div key={neg.id} className="neg-card" style={{
                        background: 'white', border: '1px solid #E5E7EB',
                        borderRadius: 11, padding: '11px 13px',
                        opacity: isMoving ? 0.5 : 1,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                      }}>
                        {/* Top row: name + delete */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 5 }}>
                          <div style={{ minWidth: 0 }}>
                            <p style={{ fontSize: 13, fontWeight: 700, color: N, margin: '0 0 3px', lineHeight: 1.2 }}>{neg.player.fullName}</p>
                            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', alignItems: 'center' }}>
                              {neg.player.position && (
                                <span style={{ fontSize: 10, fontWeight: 700, color: G, background: `${G}12`, padding: '1px 6px', borderRadius: 4 }}>
                                  {neg.player.position}
                                </span>
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
                            <Trash2 size={11} />
                          </button>
                        </div>

                        {/* Target club */}
                        {neg.targetClub && (
                          <p style={{ fontSize: 11, color: '#6B7280', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <ChevronRight size={9} /> {neg.targetClub}
                          </p>
                        )}

                        {/* Financial row */}
                        {neg.estimatedDealValue != null && (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: '#059669' }}>
                              {formatValue(neg.estimatedDealValue)}
                            </span>
                            <span style={{ fontSize: 10, fontWeight: 600, color: '#9CA3AF' }}>
                              {formatCommission(neg.estimatedDealValue)}
                            </span>
                          </div>
                        )}

                        {/* Time in stage */}
                        {stale > 0 && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 7 }}>
                            <span style={{
                              fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 5,
                              background: staleBg || `${staleColor}15`, color: staleColor,
                            }}>
                              {stale === 0 ? 'Just moved' : `${stale}d in stage`}
                            </span>
                            {stale >= 14 && <span style={{ fontSize: 9, color: staleColor }}>— follow up</span>}
                          </div>
                        )}

                        {/* Advance / closed */}
                        {nextStage ? (
                          <button
                            onClick={() => moveCard(neg.id, nextStage.id)}
                            disabled={isMoving}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 5, width: '100%',
                              padding: '6px 10px', background: '#F3F4F6', border: 'none',
                              borderRadius: 7, cursor: isMoving ? 'wait' : 'pointer',
                              fontSize: 11, fontWeight: 600, color: '#6B7280',
                              fontFamily: 'inherit', justifyContent: 'center',
                            }}
                          >
                            {isMoving
                              ? <Loader2 size={11} style={{ animation: 'spin 1s linear infinite' }} />
                              : <><ArrowRight size={11} /> {nextStage.label}</>}
                          </button>
                        ) : (
                          <span style={{ display: 'block', textAlign: 'center', fontSize: 10, fontWeight: 800, color: '#059669', padding: '5px 0', background: '#ECFDF5', borderRadius: 6 }}>
                            ✓ Deal Closed
                          </span>
                        )}
                      </div>
                    )
                  })}

                  {cards.length === 0 && (
                    <div style={{ padding: '20px 0', textAlign: 'center' }}>
                      <p style={{ fontSize: 12, color: '#D1D5DB', margin: '0 0 8px' }}>No negotiations yet</p>
                      <button
                        onClick={() => setAddToStage(stageDef.id)}
                        style={{ fontSize: 11, color: G, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                      >
                        <Plus size={11} /> Add player
                      </button>
                    </div>
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
