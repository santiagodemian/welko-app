import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

// GET — fetch all pipeline stages + their negotiation cards
export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const member = await db.agencyMember.findUnique({
    where: { clerkUserId: userId },
    select: { agencyId: true },
  })
  if (!member) return NextResponse.json({ error: 'Agency not found' }, { status: 403 })

  const stages = await db.transferPipeline.findMany({
    where: { agencyId: member.agencyId },
    orderBy: { positionIndex: 'asc' },
    include: {
      negotiations: {
        orderBy: { positionIndex: 'asc' },
        include: {
          player: {
            select: { id: true, fullName: true, position: true, nationality: true, eloRating: true },
          },
        },
      },
    },
  })

  return NextResponse.json({ stages })
}

// POST — add a player to a pipeline stage
export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const member = await db.agencyMember.findUnique({
    where: { clerkUserId: userId },
    select: { agencyId: true },
  })
  if (!member) return NextResponse.json({ error: 'Agency not found' }, { status: 403 })

  let body: { playerId: string; stageName: string; targetClub?: string; estimatedDealValue?: number }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  const stage = await db.transferPipeline.findUnique({
    where: { agencyId_name: { agencyId: member.agencyId, name: body.stageName as 'INITIAL_CONTACT' | 'PROPOSAL_SENT' | 'FINANCIAL_TALKS' | 'CONTRACT_CLOSURE' } },
  })
  if (!stage) return NextResponse.json({ error: 'Stage not found' }, { status: 404 })

  // Count existing cards to set positionIndex
  const count = await db.playerNegotiation.count({ where: { pipelineId: stage.id } })

  const negotiation = await db.playerNegotiation.create({
    data: {
      pipelineId:         stage.id,
      playerId:           body.playerId,
      targetClub:         body.targetClub         ?? null,
      estimatedDealValue: body.estimatedDealValue ?? null,
      positionIndex:      count,
    },
    include: {
      player: { select: { id: true, fullName: true, position: true, nationality: true, eloRating: true } },
    },
  })

  return NextResponse.json({ negotiation }, { status: 201 })
}
