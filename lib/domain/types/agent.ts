import type { ID, DateString, ActiveStatus } from './shared'

export interface Agent {
  id:              ID
  name:            string
  company?:        string
  organizationId?: ID      // parent Agency organization
  countryId:       ID

  email?: string
  phone?: string

  // Relations (IDs)
  playerIds: ID[]

  // Licensing
  licensed:     boolean
  licenseBody?: string    // "FIFA", "FAR", "AFA", "RFEF", etc.

  status:    ActiveStatus
  createdAt: DateString
  updatedAt: DateString
}
