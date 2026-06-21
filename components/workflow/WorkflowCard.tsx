import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { WorkflowInstance } from '@/lib/workflows/types'
import { RECRUITMENT_STAGES }    from '@/lib/workflows/recruitment'
import { getRequest, getClub }   from '@/lib/domain/seed'
import { EntityBadge }           from '@/components/domain/EntityBadge'
import { PositionBadge }         from '@/components/domain/PositionBadge'
import { C, FONT } from '@/lib/ds'

const STAGE_COLORS: Record<string, string> = {
  'request-open':         '#374151',
  'auto-matching':        '#2563EB',
  'scout-review':         '#7C3AED',
  'candidate-comparison': '#0891B2',
  'shortlist':            '#059669',
  'report-generated':     '#D97706',
  'report-shared':        '#B45309',
  'outcome-tracked':      '#64748B',
}

interface Props { workflow: WorkflowInstance }

export function WorkflowCard({ workflow }: Props) {
  const request  = getRequest(workflow.requestId)
  const club     = request ? getClub(request.clubId) : undefined
  const stageNum = RECRUITMENT_STAGES.find(s => s.id === workflow.currentStage)?.num ?? 1
  const stageDef = RECRUITMENT_STAGES.find(s => s.id === workflow.currentStage)
  const stageColor = STAGE_COLORS[workflow.currentStage] ?? '#374151'

  const completedCount = workflow.history.filter(h => h.completedAt).length

  return (
    <Link href={`/os/recruitment/${workflow.requestId}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div className="wf-card" style={{
        background:    '#FFFFFF',
        border:        `1px solid ${C.border}`,
        borderRadius:  10,
        padding:       'clamp(16px,1.8vw,22px)',
        display:       'flex',
        flexDirection: 'column',
        gap:           14,
      }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            <EntityBadge type="request" />
            {request?.priority && (
              <span style={{
                fontFamily: FONT.mono, fontSize: 8, fontWeight: 700, letterSpacing: '0.06em',
                textTransform: 'uppercase', color: '#D97706',
                background: '#D9770612', border: '1px solid #D9770630',
                borderRadius: 4, padding: '2px 7px',
              }}>
                {request.priority}
              </span>
            )}
          </div>
          <span style={{
            fontFamily: FONT.mono, fontSize: 8, fontWeight: 700, letterSpacing: '0.08em',
            textTransform: 'uppercase', color: stageColor,
            background: `${stageColor}12`, border: `1px solid ${stageColor}30`,
            borderRadius: 4, padding: '2px 7px', whiteSpace: 'nowrap',
          }}>
            Stage {stageNum}/8 · {stageDef?.shortTitle}
          </span>
        </div>

        {/* Club + position */}
        <div>
          <div style={{
            fontFamily: FONT.display, fontSize: 'clamp(14px,1.6vw,17px)', fontWeight: 700,
            color: '#111827', letterSpacing: '-0.02em', textTransform: 'uppercase',
            lineHeight: 1.1, marginBottom: 6,
          }}>
            {club?.name ?? 'Unknown Club'}
          </div>
          {request && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
              {request.positionRequirement.positions.map(p => (
                <PositionBadge key={p} position={p} group={request.positionRequirement.positionGroup} />
              ))}
              <span style={{ fontFamily: FONT.sans, fontSize: 11, color: C.textSecondary }}>
                {request.season}
              </span>
            </div>
          )}
        </div>

        {/* Pipeline progress */}
        <div>
          <div style={{ display: 'flex', gap: 3, marginBottom: 6 }}>
            {RECRUITMENT_STAGES.map(stage => (
              <div
                key={stage.id}
                className="wf-seg"
                style={{
                  flex: 1, height: 3, borderRadius: 2,
                  background: stage.num <= completedCount
                    ? '#059669'
                    : stage.id === workflow.currentStage
                    ? stageColor
                    : '#E5E7EB',
                }}
              />
            ))}
          </div>
          <div style={{ fontFamily: FONT.mono, fontSize: 8, color: C.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {completedCount} of 8 stages complete
          </div>
        </div>

        {/* Matches / shortlist */}
        {workflow.matchedPlayerIds.length > 0 && (
          <div style={{ fontFamily: FONT.sans, fontSize: 11, color: '#059669', fontWeight: 600 }}>
            {workflow.matchedPlayerIds.length} match{workflow.matchedPlayerIds.length > 1 ? 'es' : ''} identified
            {workflow.shortlistedPlayerIds.length > 0 && ` · ${workflow.shortlistedPlayerIds.length} shortlisted`}
          </div>
        )}

        {/* Assigned + arrow */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 10, borderTop: `1px solid ${C.border}` }}>
          <span style={{ fontFamily: FONT.mono, fontSize: 8, color: C.textMuted, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            {workflow.assignedTo}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: FONT.sans, fontSize: 10, fontWeight: 700, color: C.blue, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Open <ArrowRight size={10} />
          </span>
        </div>
      </div>
    </Link>
  )
}
