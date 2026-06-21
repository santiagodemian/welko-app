import { soufianeBenjdida } from './players/soufiane-benjdida'
import { guillermoMay }      from './players/guillermo-may'
import type { PlayerReport } from './types'

// ─── Registry — add every new player report here ─────────────────────────────

const PLAYER_REPORTS: PlayerReport[] = [
  soufianeBenjdida,
  guillermoMay,
]

export function getPlayerReport(slug: string): PlayerReport | undefined {
  return PLAYER_REPORTS.find(r => r.slug === slug)
}

export function getAllPlayerReports(): PlayerReport[] {
  return PLAYER_REPORTS
}

export function getAllPlayerSlugs(): { slug: string }[] {
  return PLAYER_REPORTS.map(r => ({ slug: r.slug }))
}

export function getRelatedReports(slugs: string[]): PlayerReport[] {
  return PLAYER_REPORTS.filter(r => slugs.includes(r.slug))
}

export type { PlayerReport }
