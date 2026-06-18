import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

// PATCH — move card to a different stage
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { id } = await params

  const member = await db.agencyMember.findUnique({
    where: { clerkUserId: userId },
    select: { agencyId: true },
  })
  if (!member) return NextResponse.json({ error: 'Agency not found' }, { status: 403 })

  let body: { stageName?: string; targetClub?: string; estimatedDealValue?: number }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  if (body.stageName) {
    const stage = await db.transferPipeline.findUnique({
      where: { agencyId_name: { agencyId: member.agencyId, name: body.stageName as 'INITIAL_CONTACT' | 'PROPOSAL_SENT' | 'FINANCIAL_TALKS' | 'CONTRACT_CLOSURE' } },
    })
    if (!stage) return NextResponse.json({ error: 'Stage not found' }, { status: 404 })

    const count = await db.playerNegotiation.count({ where: { pipelineId: stage.id } })

    // Milestone timestamps
    const milestones: Record<string, object> = {
      PROPOSAL_SENT:    { proposalSentAt:   new Date() },
      FINANCIAL_TALKS:  { financialTalksAt: new Date() },
      CONTRACT_CLOSURE: { contractClosedAt: new Date() },
    }

    await db.playerNegotiation.update({
      where: { id },
      data: {
        pipelineId:    stage.id,
        positionIndex: count,
        ...(milestones[body.stageName] ?? {}),
      },
    })
  }

  return NextResponse.json({ ok: true })
}

// DELETE — remove a negotiation card
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { id } = await params
  await db.playerNegotiation.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
