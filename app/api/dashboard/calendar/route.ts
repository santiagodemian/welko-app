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

  const players = await db.playerProfile.findMany({
    where: {
      agencyId: member.agencyId,
      contractExpiry: { not: null },
    },
    select: {
      id:             true,
      fullName:       true,
      position:       true,
      currentClub:    true,
      photoUrl:       true,
      storedPhotoUrl: true,
      contractExpiry: true,
      category:       true,
    },
    orderBy: { contractExpiry: 'asc' },
  })

  return NextResponse.json({ players })
}
