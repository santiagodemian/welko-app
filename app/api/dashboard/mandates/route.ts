import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const member = await db.agencyMember.findUnique({
    where: { clerkUserId: userId },
    select: { agencyId: true },
  })
  if (!member) return NextResponse.json({ mandates: [] })

  const mandates = await db.clubRequest.findMany({
    where: { agencyId: member.agencyId },
    orderBy: { createdAt: 'desc' },
    take: 20,
    select: {
      id:             true,
      clubName:       true,
      rawText:        true,
      parsedPosition: true,
      parsedBudget:   true,
      parsedAgeMax:   true,
      matchResults:   true,
      status:         true,
      createdAt:      true,
    },
  })

  return NextResponse.json({ mandates })
}

export async function DELETE(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const member = await db.agencyMember.findUnique({
    where: { clerkUserId: userId },
    select: { agencyId: true },
  })
  if (!member) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await db.clubRequest.deleteMany({
    where: { id, agencyId: member.agencyId },
  })

  return NextResponse.json({ ok: true })
}
