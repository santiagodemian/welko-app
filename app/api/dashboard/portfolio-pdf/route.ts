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
  if (!member) return NextResponse.json({ error: 'Agency not found' }, { status: 403 })

  const agency = await db.agency.findUnique({
    where: { id: member.agencyId },
    select: {
      name:     true,
      brandKit: { select: { logoUrl: true, primaryColor: true, accentColor: true, footerEmail: true, footerPhone: true, footerLocation: true } },
    },
  })

  const players = await db.playerProfile.findMany({
    where: { agencyId: member.agencyId },
    select: {
      id:             true,
      fullName:       true,
      position:       true,
      nationality:    true,
      currentClub:    true,
      age:            true,
      height:         true,
      preferredFoot:  true,
      marketValue:    true,
      releaseFee:     true,
      contractExpiry: true,
      eloRating:      true,
      category:       true,
      seasonMatches:  true,
      seasonGoals:    true,
      seasonAssists:  true,
      storedPhotoUrl: true,
      photoUrl:       true,
    },
    orderBy: [{ category: 'asc' }, { fullName: 'asc' }],
  })

  return NextResponse.json({ agency, players })
}
