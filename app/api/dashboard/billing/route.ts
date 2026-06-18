import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

// GET /api/dashboard/billing — returns current subscription info
export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const member = await db.agencyMember.findUnique({
    where:   { clerkUserId: userId },
    include: { agency: { include: { subscription: true } } },
  })
  if (!member) return NextResponse.json({ error: 'Agency not found' }, { status: 403 })

  const sub = member.agency.subscription

  return NextResponse.json({
    planType:       sub?.planType  ?? 'FREE',
    status:         sub?.status    ?? 'ACTIVE',
    cancelAtPeriodEnd: sub?.cancelAtPeriodEnd ?? false,
    currentPeriodEnd:  sub?.currentPeriodEnd?.toISOString() ?? null,
    hasSubscription: !!sub,
  })
}
