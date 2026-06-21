import type { ID, DateString, ActiveStatus } from './shared'

export type ContactRole =
  | 'Sporting Director'
  | 'Head of Recruitment'
  | 'Head of Scouting'
  | 'Scout'
  | 'Chief Executive'
  | 'President'
  | 'Agent'
  | 'Intermediary'
  | 'Analyst'
  | 'Lawyer'
  | 'Coach'
  | 'Other'

export type RelationshipStrength = 'strong' | 'medium' | 'weak' | 'cold'

export interface Contact {
  id:   ID
  name: string
  role: ContactRole | string

  // Exactly one affiliation
  organizationId?: ID
  clubId?:         ID
  agentId?:        ID

  countryId?: ID
  email?:     string
  phone?:     string
  linkedIn?:  string

  relationshipStrength: RelationshipStrength
  lastContactDate?:     DateString
  notes?:               string

  status:    ActiveStatus
  createdAt: DateString
  updatedAt: DateString
}
