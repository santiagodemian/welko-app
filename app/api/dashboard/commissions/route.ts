import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

// GET — fetch all commissions for the agency
export async function GET(_req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const member = await db.agencyMember.findUnique({
    where: { clerkUserId: userId },
    select: { agencyId: true },
  })
  if (!member) return NextResponse.json({ error: 'Agency not found' }, { status: 403 })

  const commissions = await db.dealCommission.findMany({
    where: { agencyId: member.agencyId },
    include: {
      player: { select: { id: true, fullName: true, position: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ commissions })
}

// POST — create a new commission record
export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const member = await db.agencyMember.findUnique({
    where: { clerkUserId: userId },
    select: { id: true, agencyId: true },
  })
  if (!member) return NextResponse.json({ error: 'Agency not found' }, { status: 403 })

  let body: {
    description: string
    dealValue:   number
    rate:        number
    playerId?:   string | null
    expectedAt?: string | null
  }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const dealValue = Number(body.dealValue)
  const rate      = Number(body.rate)
  if (!body.description || isNaN(dealValue) || isNaN(rate) || dealValue < 0 || rate < 0 || rate > 1) {
    return NextResponse.json({ error: 'Invalid fields' }, { status: 422 })
  }

  const commission = await db.dealCommission.create({
    data: {
      agencyId:    member.agencyId,
      memberId:    member.id,
      playerId:    body.playerId ?? null,
      description: body.description,
      dealValue,
      rate,
      amount:      dealValue * rate,
      expectedAt:  body.expectedAt ? new Date(body.expectedAt) : null,
    },
  })

  return NextResponse.json({ commission })
}
