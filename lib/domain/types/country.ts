import type { ID, Continent } from './shared'

export interface Country {
  id:            ID
  name:          string
  code:          string       // ISO 3166-1 alpha-2: "MA", "AR", "BE"
  continent:     Continent
  topLeagueId?:  ID           // Competition ID for domestic top flight
}
