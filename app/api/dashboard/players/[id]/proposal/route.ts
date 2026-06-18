import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { isAdminUser } from '@/lib/is-admin'

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
  if (!member) return NextResponse.json({ error: 'Agency not found' }, { status: 404 })

  const [player, brandKit, subscription] = await Promise.all([
    db.playerProfile.findFirst({
      where: { id: playerId, agencyId: member.agencyId },
      select: {
        id: true,
        fullName: true,
        position: true,
        nationality: true,
        age: true,
        currentClub: true,
        marketValue: true,
        contractExpiry: true,
        height: true,
        preferredFoot: true,
        eloRating: true,
        externalApiId: true,
        tags: true,
        notes: true,
        storedPhotoUrl: true,
        transfermarktUrl: true,
        besoccerUrl: true,
        sofascoreUrl: true,
        seasonMatches: true,
        seasonMinutes: true,
        seasonGoals: true,
        seasonAssists: true,
      },
    }),
    db.agencyBrandKit.findUnique({
      where: { agencyId: member.agencyId },
      select: {
        primaryColor: true,
        accentColor: true,
        logoUrl: true,
        footerEmail: true,
        footerPhone: true,
        footerLocation: true,
      },
    }),
    db.subscription.findUnique({
      where: { agencyId: member.agencyId },
      select: { planType: true },
    }),
  ])

  if (!player) return NextResponse.json({ error: 'Player not found' }, { status: 404 })

  const isPremium = (await isAdminUser(userId)) || subscription?.planType !== 'FREE'
  return NextResponse.json({ player, brandKit, isPremium })
}
