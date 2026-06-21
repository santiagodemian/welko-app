import type { Player, DomainReport } from '@/lib/domain/types'
import type { MatchResult } from './matchers'
import {
  matchPlayersToRequest,
  findExpiringContracts,
  findFreeAgents,
  findPlayersMatchingClubPhilosophy,
  getRelatedReports,
  getEUPassportProfiles,
} from './matchers'

// ─── Query types ──────────────────────────────────────────────────────────────

export type QueryCategory = 'matching' | 'market' | 'opportunity' | 'network'

export type QueryResultItem =
  | { kind: 'player-match'; data: MatchResult }
  | { kind: 'player';       data: Player & { monthsLeft?: number } }
  | { kind: 'report';       data: DomainReport }

export interface QueryResult {
  queryId:  string
  items:    QueryResultItem[]
  summary:  string
  isEmpty:  boolean
}

export interface IntelligenceQuery {
  id:          string
  category:    QueryCategory
  title:       string
  description: string
  example:     string     // natural-language version ("Show me players that...")
  color:       string
  execute:     () => QueryResult
}

// ─── Pre-built queries ────────────────────────────────────────────────────────

export const INTELLIGENCE_QUERIES: IntelligenceQuery[] = [
  {
    id:          'match-brugge-cm',
    category:    'matching',
    title:       'Club Brugge — CM Mandate',
    description: 'Players matching Club Brugge\'s open central midfielder mandate (EU passport, age 21–27, left foot preferred).',
    example:     '"Show me players that match Club Brugge\'s current mandate."',
    color:       '#DC2626',
    execute: () => {
      const items = matchPlayersToRequest('req-brugge-cm')
        .map((r): QueryResultItem => ({ kind: 'player-match', data: r }))
      return {
        queryId: 'match-brugge-cm',
        items,
        summary: items.length > 0
          ? `${items.length} profile${items.length > 1 ? 's' : ''} match the Brugge CM mandate. Top match: ${(items[0]?.data as MatchResult).player.name}.`
          : 'No profiles in the current radar match this mandate.',
        isEmpty: items.length === 0,
      }
    },
  },
  {
    id:          'match-ajax-rb',
    category:    'matching',
    title:       'Ajax — Right Back Mandate',
    description: 'Players matching Ajax\'s RB mandate (attacking profile, age 22–28, any passport, physical style).',
    example:     '"Who fits Ajax\'s current right back search?"',
    color:       '#F97316',
    execute: () => {
      const items = matchPlayersToRequest('req-ajax-rb')
        .map((r): QueryResultItem => ({ kind: 'player-match', data: r }))
      return {
        queryId: 'match-ajax-rb',
        items,
        summary: items.length > 0
          ? `${items.length} profile${items.length > 1 ? 's' : ''} match the Ajax RB mandate. Top match: ${(items[0]?.data as MatchResult).player.name}.`
          : 'No profiles currently match the Ajax RB mandate.',
        isEmpty: items.length === 0,
      }
    },
  },
  {
    id:          'expiring-contracts',
    category:    'opportunity',
    title:       'Expiring Contracts — 12 Months',
    description: 'Players whose contracts expire within the next 12 months, creating free agent or low-cost acquisition opportunities.',
    example:     '"Which players have expiring contracts within 12 months?"',
    color:       '#D97706',
    execute: () => {
      const expiring = findExpiringContracts(12)
      const items: QueryResultItem[] = expiring.map(p => ({ kind: 'player', data: p }))
      return {
        queryId: 'expiring-contracts',
        items,
        summary: items.length > 0
          ? `${items.length} player${items.length > 1 ? 's' : ''} with contracts expiring within 12 months. ${expiring.filter(p => p.monthsLeft === 0).length} already free.`
          : 'No expiring contracts detected in the current radar.',
        isEmpty: items.length === 0,
      }
    },
  },
  {
    id:          'free-agents',
    category:    'opportunity',
    title:       'Available Free Agents',
    description: 'Players currently without a club — available immediately at zero transfer cost.',
    example:     '"Which free agents are available right now?"',
    color:       '#059669',
    execute: () => {
      const items: QueryResultItem[] = findFreeAgents().map(p => ({ kind: 'player', data: p }))
      return {
        queryId: 'free-agents',
        items,
        summary: items.length > 0
          ? `${items.length} free agent${items.length > 1 ? 's' : ''} available. No transfer fee required.`
          : 'No free agents in the current network.',
        isEmpty: items.length === 0,
      }
    },
  },
  {
    id:          'eu-passports',
    category:    'market',
    title:       'EU Passport Profiles',
    description: 'Players holding an EU passport — priority for clubs with squad registration constraints in European leagues.',
    example:     '"Which players hold an EU passport?"',
    color:       '#2563EB',
    execute: () => {
      const items: QueryResultItem[] = getEUPassportProfiles().map(p => ({ kind: 'player', data: p }))
      return {
        queryId: 'eu-passports',
        items,
        summary: `${items.length} profile${items.length > 1 ? 's' : ''} with EU passport eligibility.`,
        isEmpty: items.length === 0,
      }
    },
  },
  {
    id:          'betis-philosophy-match',
    category:    'matching',
    title:       'Real Betis — Philosophy Fit',
    description: 'Players that match Real Betis\'s possession-based, EU-passport-required recruitment philosophy, independent of their open CDM mandate.',
    example:     '"Which free agents fit Betis\'s playing model?"',
    color:       '#059669',
    execute: () => {
      const items = findPlayersMatchingClubPhilosophy('cl-betis')
        .map((r): QueryResultItem => ({ kind: 'player-match', data: r }))
      return {
        queryId: 'betis-philosophy-match',
        items,
        summary: items.length > 0
          ? `${items.length} profile${items.length > 1 ? 's' : ''} align with Betis\'s possession philosophy and EU passport requirement.`
          : 'No matching profiles in the current radar.',
        isEmpty: items.length === 0,
      }
    },
  },
  {
    id:          'reports-benjdida',
    category:    'network',
    title:       'Reports — Soufiane Benjdida',
    description: 'All scouting reports and intelligence documents related to Soufiane Benjdida.',
    example:     '"What reports are related to this player?"',
    color:       '#7C3AED',
    execute: () => {
      const reports = getRelatedReports('plr-benjdida')
      const items: QueryResultItem[] = reports.map(r => ({ kind: 'report', data: r }))
      return {
        queryId: 'reports-benjdida',
        items,
        summary: items.length > 0
          ? `${items.length} report${items.length > 1 ? 's' : ''} filed for Benjdida. Latest: ${reports[0]?.reportNumber}.`
          : 'No reports on file for this player.',
        isEmpty: items.length === 0,
      }
    },
  },
]

export const QUERY_BY_ID: Record<string, IntelligenceQuery> =
  Object.fromEntries(INTELLIGENCE_QUERIES.map(q => [q.id, q]))

export function runQuery(id: string): QueryResult | null {
  const query = QUERY_BY_ID[id]
  return query ? query.execute() : null
}
