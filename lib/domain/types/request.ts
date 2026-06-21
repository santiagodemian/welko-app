import type { ID, DateString, Money, Foot } from './shared'
import type { Position, PositionGroup } from './player'

export type RequestStatus   = 'open' | 'matched' | 'shortlisted' | 'closed' | 'expired'
export type RequestPriority = 'Critical' | 'High' | 'Medium' | 'Low'

export interface PositionRequirement {
  positions:     Position[]
  positionGroup: PositionGroup
  minAge?:       number
  maxAge?:       number
  preferredFoot?: Foot
  minHeightCm?:  number
}

export interface Request {
  id:      ID
  clubId:  ID
  title:   string          // "Central Midfielder — Summer 2026"
  description?: string
  season:  string          // "Summer 2026", "January 2027"

  positionRequirement: PositionRequirement

  budget?: {
    transfer?: Money
    loan?:     Money
    maxWage?:  Money
  }

  requirements?: {
    passportPreference?: 'EU' | 'any'
    leagueIds?:          ID[]   // acceptable source leagues
    style?:              string[]
    minMarketValue?:     Money
    maxMarketValue?:     Money
  }

  deadline?: DateString
  priority:  RequestPriority
  status:    RequestStatus

  // Relations (IDs)
  matchedPlayerIds:    ID[]   // players system has identified as matches
  shortlistedPlayerIds: ID[]  // manually shortlisted by analyst

  assignedTo?: string

  createdAt: DateString
  updatedAt: DateString
}
