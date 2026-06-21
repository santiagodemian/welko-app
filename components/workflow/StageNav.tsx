import type { WorkflowStageId } from '@/lib/workflows/types'
import { RECRUITMENT_STAGES }   from '@/lib/workflows/recruitment'
import { FONT } from '@/lib/ds'

interface Props {
  currentStage: WorkflowStageId
  completedStages: WorkflowStageId[]
  requestId: string
}

export function StageNav({ currentStage, completedStages, requestId }: Props) {
  const currentNum = RECRUITMENT_STAGES.find(s => s.id === currentStage)?.num ?? 1

  return (
    <nav style={{ padding: '20px 0' }}>
      <div style={{ fontFamily: FONT.mono, fontSize: 8, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0 20px', marginBottom: 12 }}>
        Workflow Stages
      </div>

      {RECRUITMENT_STAGES.map(stage => {
        const isActive    = stage.id === currentStage
        const isCompleted = completedStages.includes(stage.id)
        const isFuture    = stage.num > currentNum

        const itemColor = isCompleted ? '#059669'
          : isActive ? '#2563EB'
          : isFuture ? 'rgba(255,255,255,0.2)'
          : 'rgba(255,255,255,0.5)'

        return (
          <div
            key={stage.id}
            className={`wf-stage-item${isActive ? ' active' : ''}`}
            style={{
              display:     'flex',
              alignItems:  'center',
              gap:         10,
              padding:     '9px 20px',
              borderLeft:  isActive ? '2px solid #2563EB' : '2px solid transparent',
              background:  isActive ? '#1E3A5F' : 'transparent',
              marginBottom: 1,
            }}
          >
            {/* Stage indicator */}
            <div style={{
              width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: isCompleted ? '#059669' : isActive ? '#2563EB' : 'rgba(255,255,255,0.08)',
              border: isFuture ? '1.5px solid rgba(255,255,255,0.15)' : 'none',
            }}>
              {isCompleted ? (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <span style={{ fontFamily: FONT.mono, fontSize: 8, fontWeight: 700, color: isActive ? '#fff' : 'rgba(255,255,255,0.35)' }}>
                  {stage.num}
                </span>
              )}
            </div>

            {/* Stage name */}
            <span style={{
              fontFamily:    FONT.sans,
              fontSize:      11,
              fontWeight:    isActive ? 700 : 500,
              color:         itemColor,
              letterSpacing: '-0.01em',
            }}>
              {stage.shortTitle}
            </span>

            {/* Active indicator */}
            {isActive && (
              <span style={{ marginLeft: 'auto', width: 5, height: 5, borderRadius: '50%', background: '#2563EB', flexShrink: 0 }} />
            )}
          </div>
        )
      })}
    </nav>
  )
}
