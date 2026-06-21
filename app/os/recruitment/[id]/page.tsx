import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { getWorkflow, WORKFLOW_INSTANCES } from '@/lib/workflows'
import { getStage, getNextStage, RECRUITMENT_STAGES } from '@/lib/workflows/recruitment'
import { getRequest, getClub, getPlayer, getAgent } from '@/lib/domain/seed'
import { matchPlayersToRequest } from '@/lib/intelligence'
import { StageNav, WorkflowStyles, WORKFLOW_CSS } from '@/components/workflow'
import { EntityBadge }  from '@/components/domain/EntityBadge'
import { PositionBadge } from '@/components/domain/PositionBadge'
import { MatchCard }    from '@/components/intelligence/MatchCard'
import { C, FONT } from '@/lib/ds'

export async function generateStaticParams() {
  const ids: string[] = []
  WORKFLOW_INSTANCES.forEach(wf => {
    ids.push(wf.id)
    ids.push(wf.requestId)
  })
  return [...new Set(ids)].map(id => ({ id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const wf      = getWorkflow(id)
  if (!wf) return { title: 'Workflow Not Found — Polaris OS' }
  const request = getRequest(wf.requestId)
  const club    = request ? getClub(request.clubId) : undefined
  const stage   = getStage(wf.currentStage)
  return {
    title: `${club?.name ?? 'Unknown'} — ${stage.shortTitle} · Polaris OS`,
    description: `Recruitment workflow for ${club?.name}: currently at stage ${stage.num} (${stage.title}).`,
  }
}

export default async function WorkflowDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id }  = await params
  const wf      = getWorkflow(id)

  if (!wf) {
    return (
      <div style={{ padding: 48, fontFamily: FONT.sans }}>
        <p style={{ color: '#DC2626' }}>Workflow not found: {id}</p>
        <Link href="/os/recruitment" style={{ color: C.blue }}>← Back to Pipeline</Link>
      </div>
    )
  }

  const request   = getRequest(wf.requestId)
  const club      = request ? getClub(request.clubId) : undefined
  const stage     = getStage(wf.currentStage)
  const nextStage = getNextStage(wf.currentStage)

  const completedStageIds = wf.history
    .filter(h => h.completedAt)
    .map(h => h.stage)

  const matchedPlayers = wf.matchedPlayerIds.map(id => getPlayer(id)).filter(Boolean)
  const shortlisted    = wf.shortlistedPlayerIds.map(id => getPlayer(id)).filter(Boolean)
  const selectedPlayer = wf.selectedPlayerId ? getPlayer(wf.selectedPlayerId) : undefined

  const agentId = selectedPlayer?.agentId ?? matchedPlayers[0]?.agentId
  const agent   = agentId ? getAgent(agentId) : undefined

  const intelligenceMatches = matchPlayersToRequest(wf.requestId)

  const completedCount = wf.history.filter(h => h.completedAt).length

  return (
    <>
      <WorkflowStyles />
      <style>{WORKFLOW_CSS}</style>

      {/* OS layout: dark sidebar + main content */}
      <div className="os-layout" style={{ background: '#F9FAFB' }}>

        {/* ── Sidebar ── */}
        <aside style={{ background: '#0A0A0A', minHeight: '100vh', position: 'sticky', top: 0, display: 'flex', flexDirection: 'column' }}>

          {/* Sidebar header */}
          <div style={{ padding: '20px 20px 0' }}>
            <Link href="/os/recruitment" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontFamily: FONT.sans, fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.4)',
              textDecoration: 'none', marginBottom: 16,
            }}>
              <ArrowLeft size={10} /> Pipeline
            </Link>
            {/* Club name */}
            <div style={{
              fontFamily: FONT.display, fontSize: 14, fontWeight: 700,
              color: '#FFFFFF', letterSpacing: '-0.01em', textTransform: 'uppercase',
              lineHeight: 1.2, marginBottom: 4,
            }}>
              {club?.name ?? 'Unknown Club'}
            </div>
            {/* Position requirements */}
            {request && (
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
                {request.positionRequirement.positions.map(p => (
                  <PositionBadge key={p} position={p} group={request.positionRequirement.positionGroup} />
                ))}
              </div>
            )}
            {/* Progress mini-bar */}
            <div style={{ display: 'flex', gap: 2, marginBottom: 4 }}>
              {RECRUITMENT_STAGES.map(s => (
                <div key={s.id} style={{
                  flex: 1, height: 2, borderRadius: 1,
                  background: s.num <= completedCount ? '#059669'
                    : s.id === wf.currentStage ? '#2563EB'
                    : 'rgba(255,255,255,0.1)',
                }} />
              ))}
            </div>
            <div style={{ fontFamily: FONT.mono, fontSize: 7, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {completedCount}/8 complete
            </div>
          </div>

          {/* Stage nav */}
          <StageNav
            currentStage={wf.currentStage}
            completedStages={completedStageIds}
            requestId={wf.requestId}
          />

          {/* Workflow ID footer */}
          <div style={{ padding: '12px 20px', marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ fontFamily: FONT.mono, fontSize: 7, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.06em' }}>
              {wf.id} · {wf.assignedTo}
            </div>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="os-content" style={{ padding: 'clamp(24px,3vw,40px)', display: 'flex', flexDirection: 'column', gap: 28 }}>

          {/* Stage header */}
          <div style={{
            background: '#FFFFFF', border: `1px solid ${C.border}`, borderRadius: 10,
            padding: 22,
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
              <div>
                <div style={{ fontFamily: FONT.mono, fontSize: 8, color: C.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>
                  Stage {stage.num} of 8
                </div>
                <h1 style={{
                  fontFamily: FONT.display, fontSize: 'clamp(18px,2.5vw,26px)', fontWeight: 700,
                  color: '#0A0A0A', letterSpacing: '-0.02em', textTransform: 'uppercase', lineHeight: 1,
                }}>
                  {stage.title}
                </h1>
              </div>
              <div style={{
                fontFamily: FONT.mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.08em',
                textTransform: 'uppercase', color: stage.color,
                background: `${stage.color}14`, border: `1px solid ${stage.color}35`,
                borderRadius: 6, padding: '4px 12px', whiteSpace: 'nowrap', flexShrink: 0,
              }}>
                Current Stage
              </div>
            </div>
            <p style={{ fontFamily: FONT.sans, fontSize: 12, color: C.textSecondary, lineHeight: 1.7, maxWidth: 600, marginBottom: 16 }}>
              {stage.description}
            </p>

            {/* Primary action */}
            {nextStage && (
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <button className="wf-action-primary" style={{
                  fontFamily: FONT.sans, fontSize: 12, fontWeight: 700,
                  color: '#FFFFFF', background: '#2563EB',
                  border: 'none', borderRadius: 7, padding: '10px 20px',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                  letterSpacing: '0.02em',
                }}>
                  {stage.primary.label} <ArrowRight size={12} />
                </button>
                {stage.secondary?.map((action, i) => (
                  <button key={i} style={{
                    fontFamily: FONT.sans, fontSize: 11, fontWeight: 600,
                    color: '#374151', background: '#FFFFFF',
                    border: `1px solid ${C.border}`, borderRadius: 7, padding: '10px 16px',
                    cursor: 'pointer', letterSpacing: '0.01em',
                  }}>
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mandate context */}
          {request && (
            <div style={{ background: '#FFFFFF', border: `1px solid ${C.border}`, borderRadius: 10, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <EntityBadge type="request" />
                <h2 style={{ fontFamily: FONT.display, fontSize: 14, fontWeight: 700, color: '#111827', letterSpacing: '-0.01em', textTransform: 'uppercase' }}>
                  Mandate Brief
                </h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14 }}>
                {[
                  { label: 'Club',      value: club?.name ?? 'Unknown' },
                  { label: 'Season',    value: request.season },
                  { label: 'Priority',  value: request.priority },
                  { label: 'Deadline',  value: request.deadline ?? 'Open' },
                  { label: 'Positions', value: request.positionRequirement.positions.join(', ') },
                  { label: 'Age Range', value: `${request.positionRequirement.minAge ?? '?'}–${request.positionRequirement.maxAge ?? '?'}` },
                  { label: 'Budget',    value: request.budget?.transfer ? `€${(request.budget.transfer.amount / 1000).toFixed(0)}K` : 'TBD' },
                  { label: 'Passport',  value: request.requirements?.passportPreference ?? 'Any' },
                  { label: 'Foot',      value: request.positionRequirement.preferredFoot ?? 'Any' },
                ].map(item => (
                  <div key={item.label}>
                    <div style={{ fontFamily: FONT.mono, fontSize: 7, color: C.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 3 }}>
                      {item.label}
                    </div>
                    <div style={{ fontFamily: FONT.sans, fontSize: 12, color: '#374151', fontWeight: 600 }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
              {request.description && (
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
                  <div style={{ fontFamily: FONT.mono, fontSize: 7, color: C.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
                    Club Brief
                  </div>
                  <p style={{ fontFamily: FONT.sans, fontSize: 12, color: C.textSecondary, lineHeight: 1.7 }}>
                    {request.description}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Intelligence match results */}
          {intelligenceMatches.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <h2 style={{ fontFamily: FONT.display, fontSize: 18, fontWeight: 700, color: '#0A0A0A', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
                  Intelligence Matches
                </h2>
                <span style={{ fontFamily: FONT.mono, fontSize: 9, color: C.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  {intelligenceMatches.length} result{intelligenceMatches.length > 1 ? 's' : ''}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 14 }}>
                {intelligenceMatches.map((match, i) => (
                  <MatchCard key={match.player.id} result={match} rank={i + 1} />
                ))}
              </div>
            </div>
          )}

          {/* Agent context */}
          {agent && (
            <div style={{ background: '#FFFFFF', border: `1px solid ${C.border}`, borderRadius: 10, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <EntityBadge type="agent" />
                <h2 style={{ fontFamily: FONT.display, fontSize: 14, fontWeight: 700, color: '#111827', letterSpacing: '-0.01em', textTransform: 'uppercase' }}>
                  Agent Contact
                </h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14 }}>
                <div>
                  <div style={{ fontFamily: FONT.mono, fontSize: 7, color: C.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 3 }}>Name</div>
                  <div style={{ fontFamily: FONT.sans, fontSize: 12, fontWeight: 600, color: '#374151' }}>{agent.name}</div>
                </div>
                <div>
                  <div style={{ fontFamily: FONT.mono, fontSize: 7, color: C.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 3 }}>Agency</div>
                  <div style={{ fontFamily: FONT.sans, fontSize: 12, fontWeight: 600, color: '#374151' }}>{agent.company ?? 'Independent'}</div>
                </div>
                {agent.email && (
                  <div>
                    <div style={{ fontFamily: FONT.mono, fontSize: 7, color: C.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 3 }}>Email</div>
                    <div style={{ fontFamily: FONT.sans, fontSize: 12, fontWeight: 600, color: C.blue }}>{agent.email}</div>
                  </div>
                )}
                {agent.phone && (
                  <div>
                    <div style={{ fontFamily: FONT.mono, fontSize: 7, color: C.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 3 }}>Phone</div>
                    <div style={{ fontFamily: FONT.sans, fontSize: 12, fontWeight: 600, color: '#374151' }}>{agent.phone}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Stage history */}
          <div style={{ background: '#FFFFFF', border: `1px solid ${C.border}`, borderRadius: 10, padding: 20 }}>
            <h2 style={{ fontFamily: FONT.display, fontSize: 14, fontWeight: 700, color: '#111827', letterSpacing: '-0.01em', textTransform: 'uppercase', marginBottom: 16 }}>
              Stage History
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[...wf.history].reverse().map((entry, i) => {
                const stageDef = RECRUITMENT_STAGES.find(s => s.id === entry.stage)
                return (
                  <div key={i} className="wf-history-item" style={{ display: 'flex', gap: 12, alignItems: 'flex-start', position: 'relative', paddingBottom: 8 }}>
                    <div style={{
                      width: 14, height: 14, borderRadius: '50%', flexShrink: 0, marginTop: 2,
                      background: entry.completedAt ? '#059669' : '#2563EB',
                      border: '2px solid #FFFFFF', boxShadow: '0 0 0 1px #E5E7EB',
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                        <span style={{ fontFamily: FONT.sans, fontSize: 11, fontWeight: 700, color: '#111827' }}>
                          {stageDef?.title ?? entry.stage}
                        </span>
                        {entry.completedAt ? (
                          <span style={{ fontFamily: FONT.mono, fontSize: 7, color: '#059669', letterSpacing: '0.06em', textTransform: 'uppercase', background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 4, padding: '1px 5px' }}>
                            Completed
                          </span>
                        ) : (
                          <span style={{ fontFamily: FONT.mono, fontSize: 7, color: '#2563EB', letterSpacing: '0.06em', textTransform: 'uppercase', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 4, padding: '1px 5px' }}>
                            In Progress
                          </span>
                        )}
                      </div>
                      <div style={{ fontFamily: FONT.mono, fontSize: 8, color: C.textMuted, marginBottom: entry.notes ? 4 : 0 }}>
                        {entry.enteredAt}{entry.completedAt ? ` → ${entry.completedAt}` : ''}{entry.actor ? ` · ${entry.actor}` : ''}
                      </div>
                      {entry.notes && (
                        <div style={{ fontFamily: FONT.sans, fontSize: 11, color: C.textSecondary, lineHeight: 1.6 }}>
                          {entry.notes}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Notes */}
          {wf.notes && (
            <div style={{ background: '#FFFFFF', border: `1px solid ${C.border}`, borderRadius: 10, padding: 20 }}>
              <div style={{ fontFamily: FONT.mono, fontSize: 8, color: C.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
                Workflow Notes
              </div>
              <p style={{ fontFamily: FONT.sans, fontSize: 12, color: C.textSecondary, lineHeight: 1.7 }}>
                {wf.notes}
              </p>
            </div>
          )}

        </main>
      </div>
    </>
  )
}
