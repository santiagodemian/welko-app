import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

// ── API-Football (RapidAPI) player shape ──────────────────────────────────────
interface RapidPlayer {
  player: {
    id:          number
    name:        string
    firstname:   string
    lastname:    string
    age:         number | null
    nationality: string | null
    height:      string | null
    weight:      string | null
    photo:       string | null
    birth:       { date: string | null; country: string | null } | null
  }
  statistics: Array<{
    team:  { id: number; name: string; logo: string } | null
    games: { appearences: number | null; minutes: number | null; position: string | null } | null
  }>
}

// ── TheSportsDB (free fallback) ───────────────────────────────────────────────
interface SportsDBPlayer {
  idPlayer:        string
  strPlayer:       string
  strTeam:         string | null
  strNationality:  string | null
  strPosition:     string | null
  strThumb:        string | null
  dateBorn:        string | null
  strHeight:       string | null
}

function calcAge(dateBorn: string | null): number | null {
  if (!dateBorn) return null
  const born = new Date(dateBorn)
  if (isNaN(born.getTime())) return null
  return Math.floor((Date.now() - born.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
}

// Search using API-Football on RapidAPI (requires RAPIDAPI_KEY env var)
async function searchRapidAPI(q: string): Promise<GlobalPlayer[]> {
  const key = process.env.RAPIDAPI_KEY
  if (!key) return []

  const url = `https://api-football-v1.p.rapidapi.com/v3/players?search=${encodeURIComponent(q)}&season=2024`
  const res = await fetch(url, {
    headers: {
      'X-RapidAPI-Key':  key,
      'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
    },
    next: { revalidate: 3600 },
  })
  if (!res.ok) return []

  const data = await res.json()
  const players: RapidPlayer[] = data.response ?? []

  return players.slice(0, 25).map(p => {
    const stat    = p.statistics?.[0]
    const team    = stat?.team?.name ?? null
    const pos     = stat?.games?.position ?? null
    return {
      externalId:  `rapid_${p.player.id}`,
      fullName:    p.player.name,
      club:        team,
      nationality: p.player.nationality,
      position:    pos,
      photoUrl:    p.player.photo,
      age:         p.player.age,
      height:      p.player.height,
      inPortfolio: false,
    }
  })
}

// Search using TheSportsDB free tier (max 1 result — fallback only)
async function searchSportsDB(q: string): Promise<GlobalPlayer[]> {
  const url = `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(q)}`
  const res = await fetch(url, {
    next: { revalidate: 3600 },
    headers: { 'User-Agent': 'PolarisFootball/1.0' },
  })
  if (!res.ok) return []
  const data = await res.json()
  const players: SportsDBPlayer[] = data.player ?? []

  return players.map(p => ({
    externalId:  p.idPlayer,
    fullName:    p.strPlayer,
    club:        p.strTeam       ?? null,
    nationality: p.strNationality ?? null,
    position:    p.strPosition    ?? null,
    photoUrl:    p.strThumb       ?? null,
    age:         calcAge(p.dateBorn),
    height:      p.strHeight      ?? null,
    inPortfolio: false,
  }))
}

interface GlobalPlayer {
  externalId:  string
  fullName:    string
  club:        string | null
  nationality: string | null
  position:    string | null
  photoUrl:    string | null
  age:         number | null
  height:      string | null
  inPortfolio: boolean
}

// GET /api/dashboard/search?q=QUERY
export async function GET(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const member = await db.agencyMember.findUnique({
    where: { clerkUserId: userId },
    select: { agencyId: true },
  })
  if (!member) return NextResponse.json({ error: 'Agency not found' }, { status: 403 })

  const q = req.nextUrl.searchParams.get('q')?.trim()
  if (!q || q.length < 2) return NextResponse.json({ results: [], hasApiKey: !!process.env.RAPIDAPI_KEY })

  // Use API-Football if key available, otherwise fall back to TheSportsDB
  const hasApiKey = !!process.env.RAPIDAPI_KEY
  let players = hasApiKey
    ? await searchRapidAPI(q)
    : await searchSportsDB(q)

  // Mark players already in this agency's portfolio
  const existing = await db.playerProfile.findMany({
    where: { agencyId: member.agencyId },
    select: { id: true, externalApiId: true, fullName: true },
  })
  const existingExternalIds = new Set(existing.map(p => p.externalApiId).filter(Boolean))
  const existingNames       = new Set(existing.map(p => p.fullName.toLowerCase()))
  const existingByName      = Object.fromEntries(existing.map(p => [p.fullName.toLowerCase(), p.id]))
  const existingByExternal  = Object.fromEntries(existing.filter(p => p.externalApiId).map(p => [p.externalApiId!, p.id]))

  const results = players.map(p => ({
    ...p,
    inPortfolio: existingExternalIds.has(p.externalId) || existingNames.has(p.fullName.toLowerCase()),
    portfolioId: existingByExternal[p.externalId] ?? existingByName[p.fullName.toLowerCase()] ?? null,
  }))

  return NextResponse.json({ results, hasApiKey })
}

// POST /api/dashboard/search — add a global player to the agency's portfolio
export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const member = await db.agencyMember.findUnique({
    where: { clerkUserId: userId },
    select: { id: true, agencyId: true },
  })
  if (!member) return NextResponse.json({ error: 'Agency not found' }, { status: 403 })

  let body: {
    externalId: string; fullName: string; club?: string | null
    nationality?: string | null; position?: string | null
    photoUrl?: string | null; age?: number | null; height?: string | null
  }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }
  if (!body.fullName) return NextResponse.json({ error: 'fullName required' }, { status: 422 })

  const exists = await db.playerProfile.findFirst({
    where: {
      agencyId: member.agencyId,
      OR: [
        { externalApiId: body.externalId },
        { fullName: { equals: body.fullName, mode: 'insensitive' } },
      ],
    },
    select: { id: true },
  })
  if (exists) {
    return NextResponse.json({ error: 'Player already in portfolio', existingId: exists.id }, { status: 409 })
  }

  // Parse height: "175 cm" → 175
  let heightCm: number | null = null
  if (body.height) {
    const m = body.height.match(/(\d+)\s*cm/i)
    if (m) heightCm = parseInt(m[1])
  }

  const player = await db.playerProfile.create({
    data: {
      agencyId:          member.agencyId,
      createdByMemberId: member.id,
      externalApiId:     body.externalId,
      fullName:          body.fullName,
      currentClub:       body.club        ?? null,
      nationality:       body.nationality ?? null,
      position:          body.position    ?? null,
      photoUrl:          body.photoUrl    ?? null,
      age:               body.age         ?? null,
      height:            heightCm,
      category:          'PROSPECTIVE',
    },
  })

  await db.playerActivity.create({
    data: {
      playerId:    player.id,
      agencyId:    member.agencyId,
      memberId:    member.id,
      type:        'PLAYER_ADDED',
      description: 'Added from global search',
    },
  })

  return NextResponse.json({ player }, { status: 201 })
}
