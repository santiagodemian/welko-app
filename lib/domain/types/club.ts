import type { ID, DateString, Money, ActiveStatus } from './shared'

export type PlayingStyle =
  | 'possession' | 'counter' | 'high-press' | 'pressing' | 'low-block'
  | 'direct' | 'physical' | 'technical' | 'hybrid'

export interface RecruitmentPhilosophy {
  style:              PlayingStyle[]
  formations:         string[]       // ["4-2-3-1", "4-3-3"]
  ageRange:           { min: number; max: number }
  budgetTransfer?:    Money
  budgetWage?:        Money
  passportPreference?: 'EU' | 'any'
  notes?:             string
}

export interface Club {
  id:                   ID
  name:                 string
  shortName:            string
  countryId:            ID
  city:                 string
  primaryCompetitionId: ID
  tier:                 1 | 2 | 3 | 4 | 5
  foundedYear?:         number

  recruitmentPhilosophy?: RecruitmentPhilosophy

  // Relations (IDs)
  contactIds:     ID[]
  openRequestIds: ID[]
  organizationIds: ID[]  // parent groups (multi-club ownership)

  status:    ActiveStatus
  createdAt: DateString
  updatedAt: DateString
}
