// Player report data now lives in content/players.json — this file re-exports
// the query functions so existing imports don't need to change.
export {
  getPlayerReport,
  getAllPlayerReports,
  getAllPlayerSlugs,
  getRelatedReports,
} from '@/lib/content/players'

export type { PlayerReport } from './types'
