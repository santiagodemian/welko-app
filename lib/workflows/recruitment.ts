import type { WorkflowStageId } from './types'

// ─── Stage definition ─────────────────────────────────────────────────────────

export interface PrimaryAction {
  label:     string
  nextStage: WorkflowStageId | null   // null = terminal
}

export interface SecondaryAction {
  label: string
  href?: string
}

export type StageEntityFocus =
  | 'request'      // show mandate details
  | 'matches'      // show matched player cards
  | 'review'       // show full player profile for review
  | 'comparison'   // show side-by-side table
  | 'shortlist'    // show finalized shortlist
  | 'report'       // show report preview
  | 'delivery'     // show delivery / sharing details
  | 'outcome'      // show outcome recording

export interface StageDefinition {
  id:           WorkflowStageId
  num:          1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
  title:        string
  shortTitle:   string
  description:  string
  color:        string
  entityFocus:  StageEntityFocus
  primary:      PrimaryAction
  secondary?:   SecondaryAction[]
}

// ─── The 8-stage recruitment workflow ─────────────────────────────────────────

export const RECRUITMENT_STAGES: StageDefinition[] = [
  {
    id: 'request-open', num: 1,
    title: 'Request Open', shortTitle: 'Request',
    description: 'Recruitment mandate is defined and active. Review position requirements, budget constraints, and the club\'s recruitment philosophy before triggering the matching engine.',
    color: '#374151',
    entityFocus: 'request',
    primary: { label: 'Run Intelligence Matching', nextStage: 'auto-matching' },
    secondary: [{ label: 'Edit mandate criteria' }],
  },
  {
    id: 'auto-matching', num: 2,
    title: 'Auto-Matching', shortTitle: 'Matching',
    description: 'Intelligence engine is scanning the player graph. Candidates are scored against the mandate criteria: position, age, passport, market value, preferred foot.',
    color: '#2563EB',
    entityFocus: 'matches',
    primary: { label: 'Review Matched Candidates', nextStage: 'scout-review' },
    secondary: [{ label: 'Adjust scoring weights' }, { label: 'Add manual candidate' }],
  },
  {
    id: 'scout-review', num: 3,
    title: 'Scout Review', shortTitle: 'Review',
    description: 'Open each matched candidate profile. Review scouting reports, physical attributes, tactical profile, and contract situation. Mark each profile as strong, neutral, or weak.',
    color: '#7C3AED',
    entityFocus: 'review',
    primary: { label: 'Begin Candidate Comparison', nextStage: 'candidate-comparison' },
    secondary: [{ label: 'Request additional scouting' }, { label: 'View related reports' }],
  },
  {
    id: 'candidate-comparison', num: 4,
    title: 'Comparison', shortTitle: 'Compare',
    description: 'Side-by-side comparison of the strongest candidates across position, physical profile, tactical fit, contract situation, and market value. Identify the recommendation.',
    color: '#0891B2',
    entityFocus: 'comparison',
    primary: { label: 'Finalize Shortlist', nextStage: 'shortlist' },
    secondary: [{ label: 'Return to review' }],
  },
  {
    id: 'shortlist', num: 5,
    title: 'Shortlist', shortTitle: 'Shortlist',
    description: 'Finalized shortlist of 1–3 candidates with ranked priority. The top candidate is marked as the Polaris recommendation.',
    color: '#059669',
    entityFocus: 'shortlist',
    primary: { label: 'Generate Scouting Report', nextStage: 'report-generated' },
    secondary: [{ label: 'Add shortlist notes' }],
  },
  {
    id: 'report-generated', num: 6,
    title: 'Report Ready', shortTitle: 'Report',
    description: 'Scouting report generated from shortlist data. Review report content, verify all sections, and confirm the Polaris recommendation before delivering to the club.',
    color: '#D97706',
    entityFocus: 'report',
    primary: { label: 'Share Report with Club', nextStage: 'report-shared' },
    secondary: [{ label: 'Download PDF' }, { label: 'Edit report content' }],
  },
  {
    id: 'report-shared', num: 7,
    title: 'Report Shared', shortTitle: 'Delivered',
    description: 'Report has been shared with the club contact. Track acknowledgement, follow up on questions, and schedule a walkthrough if requested.',
    color: '#B45309',
    entityFocus: 'delivery',
    primary: { label: 'Track Outcome', nextStage: 'outcome-tracked' },
    secondary: [{ label: 'Send follow-up' }, { label: 'Schedule walkthrough' }],
  },
  {
    id: 'outcome-tracked', num: 8,
    title: 'Outcome', shortTitle: 'Outcome',
    description: 'Record the final result of this recruitment workflow. This closes the mandate and feeds the performance intelligence of the Polaris network.',
    color: '#64748B',
    entityFocus: 'outcome',
    primary: { label: 'Close Workflow', nextStage: null },
    secondary: [{ label: 'Open new mandate for this position' }],
  },
]

// ─── Stage lookup ─────────────────────────────────────────────────────────────

export const STAGE_BY_ID: Record<WorkflowStageId, StageDefinition> =
  Object.fromEntries(RECRUITMENT_STAGES.map(s => [s.id, s])) as Record<WorkflowStageId, StageDefinition>

export function getStage(id: WorkflowStageId): StageDefinition {
  return STAGE_BY_ID[id]
}

export function isTerminal(id: WorkflowStageId): boolean {
  return STAGE_BY_ID[id].primary.nextStage === null
}

export function getNextStage(id: WorkflowStageId): StageDefinition | null {
  const next = STAGE_BY_ID[id].primary.nextStage
  return next ? STAGE_BY_ID[next] : null
}
