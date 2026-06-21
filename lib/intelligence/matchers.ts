import type { Player, Request } from '@/lib/domain/types'
import { PLAYERS, REQUESTS, CLUBS, DOMAIN_REPORTS, getCountry } from '@/lib/domain/seed'

// ─── EU country IDs (for passport scoring) ───────────────────────────────────

const EU_COUNTRY_IDS = new Set([
  'cnt-es', 'cnt-be', 'cnt-nl', 'cnt-fr', 'cnt-de',
  'cnt-it', 'cnt-pt', 'cnt-at', 'cnt-pl', 'cnt-se',
  'cnt-dk', 'cnt-fi', 'cnt-ie', 'cnt-gr', 'cnt-cz',
])

function hasEUPassport(player: Player): boolean {
  return EU_COUNTRY_IDS.has(player.nationalityId) ||
    (!!player.nationality2Id && EU_COUNTRY_IDS.has(player.nationality2Id))
}

// ─── Match score ──────────────────────────────────────────────────────────────

export interface MatchReason {
  factor:  string
  points:  number
  detail:  string
}

export interface MatchResult {
  player:  Player
  score:   number          // 0–100
  reasons: MatchReason[]
  blocked: string[]        // disqualifying factors
}

export function scorePlayerAgainstRequest(player: Player, request: Request): MatchResult {
  const { positionRequirement: pos, requirements, budget } = request
  const reasons: MatchReason[] = []
  const blocked:  string[]     = []

  // ── Hard gates (return immediately if blocked) ────────────────────────────

  const posMatch = pos.positions.some(p => player.positions.includes(p))
  if (!posMatch) {
    blocked.push(`Position mismatch — needs ${pos.positions.join('/')} (player: ${player.positions.join('/')})`)
    return { player, score: 0, reasons, blocked }
  }

  if (pos.minAge !== undefined && player.age < pos.minAge) {
    blocked.push(`Too young — min ${pos.minAge} (player: ${player.age})`)
    return { player, score: 0, reasons, blocked }
  }

  if (pos.maxAge !== undefined && player.age > pos.maxAge) {
    blocked.push(`Too old — max ${pos.maxAge} (player: ${player.age})`)
    return { player, score: 0, reasons, blocked }
  }

  // ── Scoring factors ───────────────────────────────────────────────────────

  // 1. Position match quality (primary vs secondary)
  const primaryMatch = player.position === pos.positions[0]
  reasons.push({
    factor: 'Position',
    points: primaryMatch ? 35 : 25,
    detail: primaryMatch
      ? `${player.position} — primary position match`
      : `${player.position} — secondary position match`,
  })

  // 2. Age within range
  reasons.push({
    factor: 'Age Range',
    points: 15,
    detail: `Age ${player.age} — within ${pos.minAge ?? '?'}–${pos.maxAge ?? '?'}`,
  })

  // 3. Passport / work permit
  const passportPref = requirements?.passportPreference
  if (passportPref === 'EU') {
    if (hasEUPassport(player)) {
      const primary = EU_COUNTRY_IDS.has(player.nationalityId)
      reasons.push({
        factor: 'EU Passport',
        points: 20,
        detail: primary
          ? `Primary ${getCountry(player.nationalityId)?.name} passport`
          : `Dual passport — ${getCountry(player.nationality2Id!)?.name} (EU)`,
      })
    } else {
      reasons.push({ factor: 'Passport', points: -10, detail: 'No EU passport — preference not met' })
    }
  } else {
    reasons.push({ factor: 'Passport', points: 5, detail: 'No passport restriction' })
  }

  // 4. Contract / acquisition cost
  if (player.status === 'free-agent') {
    reasons.push({ factor: 'Free Agent', points: 15, detail: 'No transfer fee required' })
  } else if (player.currentContract) {
    const expiry = player.currentContract.endDate
    const monthsLeft = Math.round(
      (new Date(expiry).getTime() - new Date('2026-06-21').getTime()) / (1000 * 60 * 60 * 24 * 30)
    )
    if (monthsLeft <= 12) {
      reasons.push({ factor: 'Contract Status', points: 10, detail: `Expiring in ${monthsLeft} months — leverage available` })
    } else {
      reasons.push({ factor: 'Contract Status', points: 5, detail: `Contracted until ${expiry.substring(0, 7)}` })
    }
  }

  // 5. Market value vs transfer budget
  if (budget?.transfer && player.marketValue) {
    const withinBudget = player.marketValue.amount <= budget.transfer.amount
    if (withinBudget) {
      reasons.push({
        factor: 'Budget Fit',
        points: 10,
        detail: `€${(player.marketValue.amount / 1000).toFixed(0)}K ≤ budget €${(budget.transfer.amount / 1000).toFixed(0)}K`,
      })
    } else {
      reasons.push({
        factor: 'Budget',
        points: -5,
        detail: `€${(player.marketValue.amount / 1000).toFixed(0)}K exceeds budget`,
      })
    }
  }

  // 6. Preferred foot
  if (pos.preferredFoot && player.preferredFoot === pos.preferredFoot) {
    reasons.push({ factor: 'Preferred Foot', points: 10, detail: `${player.preferredFoot} foot — exact match` })
  }

  const score = Math.min(100, Math.max(0,
    reasons.reduce((sum, r) => sum + r.points, 0)
  ))

  return { player, score, reasons, blocked }
}

// ─── Public query functions ───────────────────────────────────────────────────

export function matchPlayersToRequest(requestId: string): MatchResult[] {
  const request = REQUESTS.find(r => r.id === requestId)
  if (!request) return []

  return PLAYERS
    .map(p => scorePlayerAgainstRequest(p, request))
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
}

export function findExpiringContracts(withinMonths = 12): (Player & { monthsLeft: number })[] {
  const now = new Date('2026-06-21')
  return PLAYERS
    .filter(p => p.status !== 'retired')
    .flatMap(p => {
      if (p.status === 'free-agent') {
        return [{ ...p, monthsLeft: 0 }]
      }
      if (!p.currentContract) return []
      const expiry    = new Date(p.currentContract.endDate)
      const monthsLeft = Math.round((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30))
      if (monthsLeft <= withinMonths) return [{ ...p, monthsLeft }]
      return []
    })
    .sort((a, b) => a.monthsLeft - b.monthsLeft)
}

export function findFreeAgents(): Player[] {
  return PLAYERS
    .filter(p => p.status === 'free-agent')
    .sort((a, b) => (b.marketValue?.amount ?? 0) - (a.marketValue?.amount ?? 0))
}

export function findPlayersMatchingClubPhilosophy(clubId: string): MatchResult[] {
  const club = CLUBS.find(c => c.id === clubId)
  if (!club?.recruitmentPhilosophy) return []

  // Build a synthetic request from the club's philosophy
  const phil = club.recruitmentPhilosophy
  const syntheticRequest: Request = {
    id: `synthetic-${clubId}`,
    clubId,
    title: 'Philosophy Match',
    season: 'Open',
    positionRequirement: {
      positions: ['CM', 'CAM', 'LW', 'RW', 'CF'],  // versatile search
      positionGroup: 'midfielder',
      minAge: phil.ageRange.min,
      maxAge: phil.ageRange.max,
    },
    budget: phil.budgetTransfer ? { transfer: phil.budgetTransfer } : undefined,
    requirements: {
      passportPreference: phil.passportPreference,
      maxMarketValue: phil.budgetTransfer,
    },
    priority: 'Medium',
    status: 'open',
    matchedPlayerIds: [],
    shortlistedPlayerIds: [],
    createdAt: '2026-06-21',
    updatedAt: '2026-06-21',
  }

  return PLAYERS
    .map(p => scorePlayerAgainstRequest(p, syntheticRequest))
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
}

export function getRelatedReports(playerId: string) {
  const player = PLAYERS.find(p => p.id === playerId)
  if (!player) return []
  return DOMAIN_REPORTS.filter(r => player.reportIds.includes(r.id))
}

export function getEUPassportProfiles(): Player[] {
  return PLAYERS.filter(hasEUPassport)
}
