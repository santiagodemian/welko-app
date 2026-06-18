import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { isAdminUser } from '@/lib/is-admin'

export async function GET(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const member = await db.agencyMember.findUnique({
    where: { clerkUserId: userId },
    select: { id: true, agencyId: true, role: true },
  })
  if (!member) return NextResponse.json({ error: 'Agency not found' }, { status: 403 })

  const [adminCheck, subscription] = await Promise.all([
    isAdminUser(userId),
    db.subscription.findUnique({ where: { agencyId: member.agencyId }, select: { planType: true } }),
  ])
  const isPremium = adminCheck || subscription?.planType !== 'FREE'

  const scope = req.nextUrl.searchParams.get('scope') // 'mine' | 'all'
  const isPrivileged = member.role === 'AGENCY_OWNER' || member.role === 'MANAGER'

  // AGENT / SCOUT: always scoped to their own portfolio only.
  // AGENCY_OWNER / MANAGER: full agency when scope=all (default), or own when scope=mine.
  const restrictToMember = !isPrivileged || scope === 'mine'

  const players = await db.playerProfile.findMany({
    where: {
      agencyId: member.agencyId,
      ...(restrictToMember ? { createdByMemberId: member.id } : {}),
    },
    select: {
      id: true,
      fullName: true,
      position: true,
      age: true,
      nationality: true,
      currentClub: true,
      currentLeague: true,
      contractExpiry: true,
      salaryExpectation: true,
      eloRating: true,
      verificationStatus: true,
      category: true,
    },
    orderBy: { eloRating: 'desc' },
  })

  return NextResponse.json({ players, memberRole: member.role, isPremium })
}

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const member = await db.agencyMember.findUnique({
    where: { clerkUserId: userId },
    select: { id: true, agencyId: true },
  })
  if (!member) return NextResponse.json({ error: 'Agency not found' }, { status: 403 })

  let body: {
    fullName: string
    position?: string | null
    age?: number | null
    nationality?: string | null
    currentClub?: string | null
    currentLeague?: string | null
    contractExpiry?: string | null
    salaryExpectation?: number | null
    height?: number | null
    preferredFoot?: string | null
    marketValue?: number | null
    category?: string
    notes?: string | null
  }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  if (!body.fullName?.trim()) return NextResponse.json({ error: 'fullName required' }, { status: 422 })

  const ALLOWED_CATEGORIES = ['MANAGED', 'MANDATE', 'PROSPECTIVE']
  const category = ALLOWED_CATEGORIES.includes(body.category ?? '') ? (body.category as 'MANAGED' | 'MANDATE' | 'PROSPECTIVE') : 'PROSPECTIVE'

  const player = await db.playerProfile.create({
    data: {
      agencyId:          member.agencyId,
      createdByMemberId: member.id,
      fullName:          body.fullName.trim(),
      position:          body.position          ?? null,
      age:               body.age               ?? null,
      nationality:       body.nationality       ?? null,
      currentClub:       body.currentClub       ?? null,
      currentLeague:     body.currentLeague     ?? null,
      contractExpiry:    body.contractExpiry ? new Date(body.contractExpiry) : null,
      salaryExpectation: body.salaryExpectation ?? null,
      height:            body.height            ?? null,
      preferredFoot:     body.preferredFoot     ?? null,
      marketValue:       body.marketValue       ?? null,
      notes:             body.notes             ?? null,
      category,
    },
  })

  await db.playerActivity.create({
    data: {
      playerId:    player.id,
      agencyId:    member.agencyId,
      memberId:    member.id,
      type:        'PLAYER_ADDED',
      description: 'Added manually',
    },
  })

  return NextResponse.json({ player }, { status: 201 })
}
