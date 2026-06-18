import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { PlayerActivityType } from '@prisma/client'

// GET — fetch activity log for a player
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { id: playerId } = await params

  const member = await db.agencyMember.findUnique({
    where: { clerkUserId: userId },
    select: { agencyId: true },
  })
  if (!member) return NextResponse.json({ error: 'Agency not found' }, { status: 403 })

  // Verify player belongs to this agency
  const player = await db.playerProfile.findFirst({
    where: { id: playerId, agencyId: member.agencyId },
    select: { id: true },
  })
  if (!player) return NextResponse.json({ error: 'Player not found' }, { status: 404 })

  const activities = await db.playerActivity.findMany({
    where: { playerId, agencyId: member.agencyId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return NextResponse.json({ activities })
}

// POST — log a new activity entry
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { id: playerId } = await params

  const member = await db.agencyMember.findUnique({
    where: { clerkUserId: userId },
    select: { id: true, agencyId: true },
  })
  if (!member) return NextResponse.json({ error: 'Agency not found' }, { status: 403 })

  let body: { type: string; description: string; metadata?: Record<string, unknown> }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const validTypes = Object.values(PlayerActivityType) as string[]
  if (!body.type || !validTypes.includes(body.type)) {
    return NextResponse.json({ error: 'Invalid activity type' }, { status: 422 })
  }
  if (!body.description || typeof body.description !== 'string') {
    return NextResponse.json({ error: 'Description required' }, { status: 422 })
  }

  // Verify player belongs to this agency
  const player = await db.playerProfile.findFirst({
    where: { id: playerId, agencyId: member.agencyId },
    select: { id: true },
  })
  if (!player) return NextResponse.json({ error: 'Player not found' }, { status: 404 })

  const activity = await db.playerActivity.create({
    data: {
      playerId,
      agencyId:  member.agencyId,
      memberId:  member.id,
      type:      body.type as PlayerActivityType,
      description: body.description.slice(0, 500),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      metadata:  (body.metadata ?? undefined) as any,
    },
  })

  return NextResponse.json({ activity })
}
