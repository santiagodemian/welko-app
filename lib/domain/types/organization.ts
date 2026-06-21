import type { ID, DateString, ActiveStatus } from './shared'

export type OrganizationType =
  | 'agency'           // player agency
  | 'club-group'       // multi-club ownership (City Football Group, etc.)
  | 'scouting-network' // data/scouting providers
  | 'media'            // sports media
  | 'federation'       // national/continental FA
  | 'other'

export interface Organization {
  id:        ID
  name:      string
  shortName?: string
  type:      OrganizationType
  countryId?: ID
  website?:  string

  // Relations (IDs)
  agentIds:  ID[]     // agents affiliated with this org
  clubIds:   ID[]     // clubs owned by this org (for club-group type)
  contactIds: ID[]

  status:    ActiveStatus
  createdAt: DateString
  updatedAt: DateString
}
