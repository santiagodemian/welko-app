export {
  scorePlayerAgainstRequest,
  matchPlayersToRequest,
  findExpiringContracts,
  findFreeAgents,
  findPlayersMatchingClubPhilosophy,
  getRelatedReports,
  getEUPassportProfiles,
} from './matchers'
export type { MatchResult, MatchReason } from './matchers'

export {
  INTELLIGENCE_QUERIES,
  QUERY_BY_ID,
  runQuery,
} from './queries'
export type {
  IntelligenceQuery, QueryResult, QueryResultItem, QueryCategory,
} from './queries'
