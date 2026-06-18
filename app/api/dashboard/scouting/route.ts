import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const member = await db.agencyMember.findUnique({
    where: { clerkUserId: userId },
    select: { agencyId: true },
  })
  if (!member) return NextResponse.json({ error: 'Agency not found' }, { status: 403 })

  const playerId = req.nextUrl.searchParams.get('playerId') ?? ''

  const reports = await db.scoutingReport.findMany({
    where: {
      player: { agencyId: member.agencyId },
      ...(playerId ? { playerId } : {}),
    },
    include: {
      player: {
        select: { fullName: true, position: true, currentClub: true, photoUrl: true },
      },
      createdBy: {
        select: { fullName: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ reports })
}

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const member = await db.agencyMember.findUnique({
    where: { clerkUserId: userId },
    select: { id: true, agencyId: true, role: true },
  })
  if (!member) return NextResponse.json({ error: 'Agency not found' }, { status: 403 })

  // Require at least AGENT role (AGENT, MANAGER, AGENCY_OWNER — not SCOUT)
  const ALLOWED_ROLES = ['AGENCY_OWNER', 'MANAGER', 'AGENT']
  if (!ALLOWED_ROLES.includes(member.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  let body: {
    playerId: string
    matchName: string
    league?: string | null
    date: string
    overallRating: number
    techScore: number
    tactScore: number
    physScore: number
    mentScore: number
    verdict: string
  }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!body.playerId || !body.matchName?.trim() || !body.date || !body.verdict?.trim()) {
    return NextResponse.json({ error: 'playerId, matchName, date, and verdict are required' }, { status: 422 })
  }

  // Verify the player belongs to this agency
  const player = await db.playerProfile.findUnique({
    where: { id: body.playerId },
    select: { agencyId: true },
  })
  if (!player || player.agencyId !== member.agencyId) {
    return NextResponse.json({ error: 'Player not found' }, { status: 404 })
  }

  const clamp = (n: number) => Math.min(10, Math.max(1, Math.round(n)))

  const report = await db.scoutingReport.create({
    data: {
      playerId:      body.playerId,
      matchName:     body.matchName.trim(),
      league:        body.league ?? null,
      date:          new Date(body.date),
      overallRating: clamp(body.overallRating),
      techScore:     clamp(body.techScore),
      tactScore:     clamp(body.tactScore),
      physScore:     clamp(body.physScore),
      mentScore:     clamp(body.mentScore),
      verdict:       body.verdict.trim(),
      createdById:   member.id,
    },
    include: {
      player: {
        select: { fullName: true, position: true, currentClub: true, photoUrl: true },
      },
      createdBy: {
        select: { fullName: true },
      },
    },
  })

  return NextResponse.json({ report }, { status: 201 })
}
