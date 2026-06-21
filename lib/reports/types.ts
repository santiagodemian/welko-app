import type { Status } from '@/components/ui/StatusBadge'

// ─── Primitives ───────────────────────────────────────────────────────────────

export interface StatBar {
  label: string
  value: number    // 0–100
  context?: string // "Avg. league: 62"
}

export interface SeasonEntry {
  competition: string
  season: string
  apps: number
  started: number
  goals?: number
  assists?: number
  minutesPlayed?: number
  passAccuracy?: number   // percentage, e.g. 84
  keyPassesPer90?: number
  extraStats?: { label: string; value: string }[]
}

export type ReportVerdict = 'Recommended' | 'Monitor' | 'Under Review' | 'Not Recommended'
export type ReportPriority = 'High' | 'Medium' | 'Low'
export type PositionGroup  = 'goalkeeper' | 'defender' | 'midfielder' | 'forward'
export type Foot           = 'Left' | 'Right' | 'Both'

// ─── Core PlayerReport ────────────────────────────────────────────────────────

export interface PlayerReport {
  // ── Identifiers ────────────────────────────────────────────────────────────
  slug:              string
  reportNumber:      string   // "PR-001"
  publishedAt:       string   // "June 2026"
  updatedAt?:        string
  analyst:           string
  status:            Status
  readTime:          number   // minutes
  confidentiality:   'Public' | 'Restricted' | 'Private'

  // ── Player ─────────────────────────────────────────────────────────────────
  player: {
    name:          string
    firstName:     string
    lastName:      string
    position:      string    // display, e.g. "Central Midfielder / AM"
    positionGroup: PositionGroup
    positionCode:  string    // "CM", "CAM", "RB" etc.
    club:          string
    league:        string
    leagueCountry: string
    nationality:   string
    nationality2?: string    // dual passport
    age:           number
    born:          string    // "12 March 2001"
    height:        string    // "1.78 m"
    weight?:       string    // "72 kg"
    preferredFoot: Foot
    contractUntil: string    // "June 2026"
    marketValue:   string    // "€320,000"
    jerseyNumber?: number
  }

  // ── Sections ───────────────────────────────────────────────────────────────
  summary: string            // executive summary paragraph(s) — split on \n\n

  season: {
    headline:  string
    entries:   SeasonEntry[]
    narrative: string
  }

  tactical: {
    headline:          string
    primaryRole:       string
    alternativeRoles:  string[]
    description:       string[]   // each item = one paragraph
    pressingTendency?: string
    systemFit:         string[]   // e.g. ["4-2-3-1", "4-3-3", "3-5-2"]
  }

  strengths:  { title: string; body: string }[]
  weaknesses: { title: string; body: string }[]

  physical: {
    headline:   string
    attributes: StatBar[]
    notes:      string
  }

  recommendation: {
    verdict:     ReportVerdict
    priority:    ReportPriority
    suitableFor: string[]
    summary:     string
    notes?:      string
  }

  // ── Discovery ──────────────────────────────────────────────────────────────
  tags:         string[]
  relatedSlugs: string[]
}
