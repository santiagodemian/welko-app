import rawPlayers from '@/content/players.json'
import type { PlayerReport } from '@/lib/reports/types'

// Cast the JSON data to the typed interface.
// The JSON shape mirrors PlayerReport exactly — summary is string[].
const PLAYERS = rawPlayers as unknown as PlayerReport[]

export function getPlayerReport(slug: string): PlayerReport | undefined {
  return PLAYERS.find(p => p.slug === slug)
}

export function getAllPlayerReports(): PlayerReport[] {
  return PLAYERS
}

export function getAllPlayerSlugs(): { slug: string }[] {
  return PLAYERS.map(p => ({ slug: p.slug }))
}

export function getRelatedReports(slugs: string[]): PlayerReport[] {
  return PLAYERS.filter(p => slugs.includes(p.slug))
}
