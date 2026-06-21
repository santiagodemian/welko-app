import type { ID } from './shared'

export type CompetitionType   = 'league' | 'cup' | 'continental' | 'international'
export type CompetitionStatus = 'active' | 'completed' | 'upcoming'

export interface Competition {
  id:            ID
  name:          string
  shortName:     string
  countryId:     ID            // 'international' for continental tournaments
  tier:          1 | 2 | 3 | 4 | 5
  type:          CompetitionType
  currentSeason: string        // "2025/26" or "2025"
  status:        CompetitionStatus
  color?:        string        // brand color for UI
}
