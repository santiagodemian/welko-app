import type { WorkflowInstance } from './types'

export const WORKFLOW_INSTANCES: WorkflowInstance[] = [
  {
    id:           'wf-001',
    requestId:    'req-brugge-cm',
    currentStage: 'scout-review',
    status:       'active',
    history: [
      { stage: 'request-open',   enteredAt: '2026-05-01', completedAt: '2026-05-03', actor: 'Polaris' },
      { stage: 'auto-matching',  enteredAt: '2026-05-03', completedAt: '2026-05-03', actor: 'Intelligence Engine', notes: '1 high-confidence match identified.' },
      { stage: 'scout-review',   enteredAt: '2026-05-04', actor: 'Polaris Scouting Desk', notes: 'Benjdida profile opened. Reviewing full report and CAF CL data.' },
    ],
    matchedPlayerIds:     ['plr-benjdida'],
    reviewedPlayerIds:    ['plr-benjdida'],
    comparedPlayerIds:    [],
    shortlistedPlayerIds: [],
    assignedTo: 'Polaris Scouting Desk',
    notes: 'Club Brugge CM mandate. Benjdida dual passport profile is well-suited. Contact with agent Vidal pending club confirmation.',
    createdAt: '2026-05-01',
    updatedAt: '2026-06-21',
  },
  {
    id:           'wf-002',
    requestId:    'req-ajax-rb',
    currentStage: 'shortlist',
    status:       'active',
    history: [
      { stage: 'request-open',         enteredAt: '2026-04-20', completedAt: '2026-04-22', actor: 'Polaris' },
      { stage: 'auto-matching',         enteredAt: '2026-04-22', completedAt: '2026-04-22', actor: 'Intelligence Engine', notes: '1 match identified from Argentine Liga Profesional.' },
      { stage: 'scout-review',          enteredAt: '2026-04-23', completedAt: '2026-05-02', actor: 'Polaris Scouting Desk', notes: 'May\'s crossing metrics and ground duel rate validated.' },
      { stage: 'candidate-comparison',  enteredAt: '2026-05-02', completedAt: '2026-05-10', actor: 'Polaris Scouting Desk', notes: 'May the only physical-profile RB in current radar that meets Ajax\'s age ceiling.' },
      { stage: 'shortlist',             enteredAt: '2026-05-10', actor: 'Polaris Scouting Desk', notes: 'May confirmed as #1 recommendation. Fee projection €350K–€500K.' },
    ],
    matchedPlayerIds:     ['plr-may'],
    reviewedPlayerIds:    ['plr-may'],
    comparedPlayerIds:    ['plr-may'],
    shortlistedPlayerIds: ['plr-may'],
    selectedPlayerId:     'plr-may',
    assignedTo: 'Polaris Scouting Desk',
    notes: 'Ajax RB mandate. May cleared review and comparison phases. Shortlist finalized — generating report before sharing with de Wit.',
    createdAt: '2026-04-20',
    updatedAt: '2026-06-21',
  },
  {
    id:           'wf-003',
    requestId:    'req-betis-cdm',
    currentStage: 'request-open',
    status:       'active',
    history: [
      { stage: 'request-open', enteredAt: '2026-06-10', actor: 'Polaris', notes: 'Mandate received from Andrés Quesada. Loan only. EU passport required.' },
    ],
    matchedPlayerIds:     [],
    reviewedPlayerIds:    [],
    comparedPlayerIds:    [],
    shortlistedPlayerIds: [],
    assignedTo: 'Polaris Scouting Desk',
    notes: 'Betis January 2027 window. Holding CM loan. EU passport critical. Will run matching when Q3 radar update is complete.',
    createdAt: '2026-06-10',
    updatedAt: '2026-06-21',
  },
]

export const WORKFLOW_BY_REQUEST: Record<string, WorkflowInstance> =
  Object.fromEntries(WORKFLOW_INSTANCES.map(w => [w.requestId, w]))

export function getWorkflow(id: string): WorkflowInstance | undefined {
  return WORKFLOW_INSTANCES.find(w => w.id === id || w.requestId === id)
}

export function getActiveWorkflows(): WorkflowInstance[] {
  return WORKFLOW_INSTANCES.filter(w => w.status === 'active')
}
