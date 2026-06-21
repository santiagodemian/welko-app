// ─── Workflow Stage IDs ────────────────────────────────────────────────────────
// The 8 stages of the Polaris Recruitment Workflow.
// Each stage is a node in the state machine; transitions are explicit.

export type WorkflowStageId =
  | 'request-open'         // 1. Club mandate defined, ready to match
  | 'auto-matching'        // 2. Intelligence engine scanning the graph
  | 'scout-review'         // 3. Scout reviews each matched candidate
  | 'candidate-comparison' // 4. Side-by-side attribute comparison
  | 'shortlist'            // 5. Final shortlist built (≤3 candidates)
  | 'report-generated'     // 6. Scouting report written and formatted
  | 'report-shared'        // 7. Report delivered to club contact
  | 'outcome-tracked'      // 8. Result recorded (hired / rejected / on-hold)

export type WorkflowStatus  = 'active' | 'completed' | 'on-hold' | 'cancelled'
export type WorkflowOutcome = 'hired' | 'rejected' | 'on-hold' | 'pending'

// ─── Stage history ────────────────────────────────────────────────────────────

export interface StageEntry {
  stage:       WorkflowStageId
  enteredAt:   string
  completedAt?: string
  notes?:      string
  actor?:      string
}

// ─── Workflow instance ────────────────────────────────────────────────────────

export interface WorkflowInstance {
  id:           string
  requestId:    string            // domain Request ID

  currentStage: WorkflowStageId
  status:       WorkflowStatus
  history:      StageEntry[]

  // Populated as workflow progresses
  matchedPlayerIds:     string[]  // from intelligence engine
  reviewedPlayerIds:    string[]  // scout has opened profile
  comparedPlayerIds:    string[]  // included in comparison view
  shortlistedPlayerIds: string[]  // final shortlist
  selectedPlayerId?:    string    // single recommended player

  outcome?:      WorkflowOutcome
  outcomeNotes?: string

  assignedTo:  string
  notes:       string
  createdAt:   string
  updatedAt:   string
}
