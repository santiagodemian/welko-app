import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { openai } from '@/lib/openai'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ParsedMandate {
  position: string
  preferredFoot: 'RIGHT' | 'LEFT' | 'ANY'
  maxBudget: number | null
  maxAge: number | null
  keyAttributes: string[]
  clubName: string | null
}

interface PlayerMatch {
  id: string
  fullName: string
  position: string | null
  age: number | null
  eloRating: number | null
  salaryExpectation: number | null
  preferredFoot: string | null
  nationality: string | null
  currentClub: string | null
  matchScore: number
  matchReasons: string[]
}

// ─── Position normalization ───────────────────────────────────────────────────
// Maps common shorthand/variants to canonical uppercase names.
const POSITION_ALIASES: Record<string, string[]> = {
  'GOALKEEPER':            ['GK', 'KEEPER', 'GOALIE', 'PORTERO'],
  'CENTER BACK':           ['CB', 'CENTRE BACK', 'CENTRAL DEFENDER', 'CENTRAL BACK', 'CD'],
  'LEFT BACK':             ['LB', 'LEFT WINGBACK', 'LWB'],
  'RIGHT BACK':            ['RB', 'RIGHT WINGBACK', 'RWB'],
  'DEFENSIVE MIDFIELDER':  ['CDM', 'DM', 'HOLDING MIDFIELDER', 'DEFENSIVE MID', 'PIVOT'],
  'CENTRAL MIDFIELDER':    ['CM', 'CENTRAL MID', 'BOX TO BOX', 'BOX-TO-BOX'],
  'ATTACKING MIDFIELDER':  ['CAM', 'AM', 'ATTACKING MID', 'NUMBER 10', 'NO.10', '10', 'TREQUARTISTA'],
  'LEFT WINGER':           ['LW', 'LEFT WING', 'LEFT MIDFIELDER', 'LEFT FORWARD', 'LEFT WIDE'],
  'RIGHT WINGER':          ['RW', 'RIGHT WING', 'RIGHT MIDFIELDER', 'RIGHT FORWARD', 'RIGHT WIDE'],
  'STRIKER':               ['ST', 'CF', 'CENTER FORWARD', 'CENTRE FORWARD', 'NUMBER 9', 'NO.9', '9', 'FORWARD'],
}

function normalizePosition(raw: string): string {
  const up = raw.trim().toUpperCase()
  for (const [canonical, aliases] of Object.entries(POSITION_ALIASES)) {
    if (up === canonical || aliases.includes(up)) return canonical
    // partial word match (e.g. "Left Back" inside "Left Back / Left Midfielder")
    if (up.includes(canonical) || canonical.includes(up)) return canonical
  }
  return up
}

function positionMatches(playerPos: string | null, parsedPos: string): boolean {
  if (!playerPos) return false
  const a = normalizePosition(playerPos)
  const b = normalizePosition(parsedPos)
  return a === b || a.includes(b) || b.includes(a)
}

// ─── Scoring ──────────────────────────────────────────────────────────────────
// Weights: Position 40 | Budget 30 | Foot 15 | Age 15  (max 100)

function scorePlayer(
  player: {
    position: string | null
    salaryExpectation: number | null
    preferredFoot: string | null
    age: number | null
  },
  parsed: ParsedMandate,
): { score: number; reasons: string[] } {
  let total = 0
  const reasons: string[] = []

  // ── Position: 40 pts ──
  if (!parsed.position) {
    total += 40
  } else if (positionMatches(player.position, parsed.position)) {
    total += 40
    reasons.push(`Position match (${player.position ?? '—'})`)
  }

  // ── Budget: 30 pts ──
  if (parsed.maxBudget === null) {
    total += 30
  } else if (player.salaryExpectation === null) {
    total += 15                                           // unknown salary → partial
    reasons.push('Salary unknown — partial credit')
  } else if (player.salaryExpectation <= parsed.maxBudget) {
    total += 30
    reasons.push(`Salary €${player.salaryExpectation.toLocaleString()}/mo within budget`)
  } else if (player.salaryExpectation <= parsed.maxBudget * 1.15) {
    total += 15                                           // ≤15% over → partial
    reasons.push(`Salary slightly over budget (€${player.salaryExpectation.toLocaleString()})`)
  }

  // ── Foot: 15 pts ──
  if (!parsed.preferredFoot || parsed.preferredFoot === 'ANY') {
    total += 15
  } else if (!player.preferredFoot) {
    total += 7                                            // unknown → partial
  } else {
    const pf = player.preferredFoot.toUpperCase()
    if (pf === parsed.preferredFoot || pf === 'BOTH') {
      total += 15
      reasons.push(`${player.preferredFoot} foot match`)
    }
  }

  // ── Age: 15 pts ──
  if (parsed.maxAge === null) {
    total += 15
  } else if (player.age === null) {
    total += 7                                            // unknown → partial
  } else if (player.age <= parsed.maxAge) {
    total += 15
    reasons.push(`Age ${player.age} ≤ ${parsed.maxAge}`)
  } else if (player.age <= parsed.maxAge + 2) {
    total += 7                                            // 1-2 years over → partial
    reasons.push(`Age ${player.age} (slightly over ${parsed.maxAge})`)
  }

  return { score: Math.round(total), reasons }
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  let rawText: string
  try {
    const body = await req.json()
    rawText = (body.rawText ?? '').trim()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!rawText) {
    return NextResponse.json({ error: 'rawText is required' }, { status: 422 })
  }

  // Resolve agency from authenticated user
  const member = await db.agencyMember.findUnique({
    where: { clerkUserId: userId },
    select: { agencyId: true },
  })
  if (!member) {
    return NextResponse.json({ error: 'Complete onboarding first' }, { status: 403 })
  }

  // ── Step 1: Parse mandate text with AI ────────────────────────────────────
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.1,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: `You are a professional football transfer analyst. Parse the following club mandate text and extract structured requirements as JSON.

Return ONLY a JSON object with these exact fields:
- "position": normalized string — one of: GOALKEEPER, CENTER BACK, LEFT BACK, RIGHT BACK, DEFENSIVE MIDFIELDER, CENTRAL MIDFIELDER, ATTACKING MIDFIELDER, LEFT WINGER, RIGHT WINGER, STRIKER. Use the closest match. If unclear, make your best guess.
- "preferredFoot": "RIGHT", "LEFT", or "ANY"
- "maxBudget": monthly salary in EUR as a number, or null if not mentioned
- "maxAge": maximum player age as a number, or null if not mentioned
- "keyAttributes": array of strings describing physical or technical traits mentioned (e.g. ["aerial duels", "pace", "leadership"])
- "clubName": the name of the requesting club if mentioned in the text, or null if not found`,
      },
      {
        role: 'user',
        content: rawText,
      },
    ],
  })

  let parsed: ParsedMandate
  try {
    parsed = JSON.parse(completion.choices[0].message.content ?? '{}') as ParsedMandate
  } catch {
    return NextResponse.json({ error: 'AI parsing failed — try rephrasing the mandate' }, { status: 502 })
  }

  // ── Step 2: Query agency's player database ────────────────────────────────
  const players = await db.playerProfile.findMany({
    where: { agencyId: member.agencyId },
    select: {
      id: true,
      fullName: true,
      position: true,
      age: true,
      eloRating: true,
      salaryExpectation: true,
      preferredFoot: true,
      nationality: true,
      currentClub: true,
    },
  })

  // ── Step 3: Score and rank ─────────────────────────────────────────────────
  type RawPlayer = (typeof players)[number]
  const matches: PlayerMatch[] = players
    .map((p: RawPlayer) => {
      const { score, reasons } = scorePlayer(p, parsed)
      return { ...p, matchScore: score, matchReasons: reasons }
    })
    .filter((p: PlayerMatch) => p.matchScore > 0)
    .sort((a: PlayerMatch, b: PlayerMatch) => b.matchScore - a.matchScore)

  // ── Step 4: Persist mandate + results to DB ───────────────────────────────
  try {
    await db.clubRequest.create({
      data: {
        agencyId:         member.agencyId,
        rawText,
        clubName:         parsed.clubName ?? 'Unknown Club',
        parsedPosition:   parsed.position || null,
        parsedBudget:     parsed.maxBudget,
        parsedAgeMax:     parsed.maxAge,
        matchResults:     matches.map(m => ({
          playerId: m.id,
          fullName: m.fullName,
          score:    m.matchScore,
          reasons:  m.matchReasons,
        })),
        lastMatchedAt: new Date(),
      },
    })
  } catch {
    // Non-fatal: return results even if persistence fails
  }

  return NextResponse.json({ parsed, matches })
}
