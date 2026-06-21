import type { ID, DateString, Money, Foot, ActiveStatus } from './shared'

// ─── Football Positions ───────────────────────────────────────────────────────

export type Position =
  | 'GK'
  | 'CB' | 'LB' | 'RB' | 'LWB' | 'RWB'
  | 'CDM' | 'CM' | 'CAM' | 'LM' | 'RM'
  | 'LW' | 'RW' | 'CF' | 'ST' | 'SS'

export type PositionGroup = 'goalkeeper' | 'defender' | 'midfielder' | 'forward'

export const POSITION_GROUPS: Record<Position, PositionGroup> = {
  GK:  'goalkeeper',
  CB:  'defender',  LB:  'defender',  RB:  'defender', LWB: 'defender', RWB: 'defender',
  CDM: 'midfielder', CM: 'midfielder', CAM: 'midfielder', LM: 'midfielder', RM: 'midfielder',
  LW:  'forward',  RW:  'forward',  CF:  'forward',  ST:  'forward',  SS:  'forward',
}

// ─── Player States ────────────────────────────────────────────────────────────

export type PlayerStatus = 'active' | 'free-agent' | 'injured' | 'suspended' | 'retired' | 'unknown'

// ─── Contract & Transfer History ──────────────────────────────────────────────

export interface Contract {
  clubId:            ID
  startDate:         DateString
  endDate:           DateString
  salary?:           Money
  releaseClause?:    Money
  extensionOptions?: string
}

export type TransferType = 'permanent' | 'loan' | 'free' | 'end-of-contract' | 'return-from-loan'

export interface Transfer {
  fromClubId?: ID
  toClubId?:   ID
  fee?:        Money
  type:        TransferType
  date:        DateString
  season:      string
}

// ─── Player Entity ────────────────────────────────────────────────────────────

export interface Player {
  id:        ID
  firstName: string
  lastName:  string
  name:      string            // display name

  nationalityId:  ID
  nationality2Id?: ID          // dual passport

  born:          DateString
  age:           number
  height?:       string        // "1.76 m"
  weight?:       string        // "72 kg"
  preferredFoot: Foot

  position:      Position      // primary position
  positions:     Position[]    // all playable positions
  positionGroup: PositionGroup

  currentClubId?:   ID
  currentContract?: Contract
  transferHistory:  Transfer[]

  agentId?:     ID
  marketValue?: Money
  status:       PlayerStatus

  // Relations (IDs)
  reportIds:       ID[]        // scouting reports covering this player
  requestMatchIds: ID[]        // recruitment requests where this player is a match

  tags:   string[]
  notes?: string

  createdAt: DateString
  updatedAt: DateString
}
