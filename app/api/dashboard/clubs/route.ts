import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const member = await db.agencyMember.findUnique({
    where: { clerkUserId: userId },
    select: { agencyId: true, role: true },
  })
  if (!member) return NextResponse.json({ error: 'Agency not found' }, { status: 403 })

  const q                  = req.nextUrl.searchParams.get('q')                  ?? ''
  const country            = req.nextUrl.searchParams.get('country')            ?? ''
  const relationshipStatus = req.nextUrl.searchParams.get('relationshipStatus') ?? ''

  const clubs = await db.club.findMany({
    where: {
      agencyId: member.agencyId,
      ...(q       ? { name:               { contains: q,       mode: 'insensitive' } } : {}),
      ...(country ? { country:            { equals:  country,  mode: 'insensitive' } } : {}),
      ...(relationshipStatus ? { relationshipStatus: { equals: relationshipStatus } } : {}),
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ clubs })
}

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const member = await db.agencyMember.findUnique({
    where: { clerkUserId: userId },
    select: { agencyId: true, role: true },
  })
  if (!member) return NextResponse.json({ error: 'Agency not found' }, { status: 403 })

  if (member.role !== 'AGENCY_OWNER' && member.role !== 'MANAGER') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  let body: {
    name: string
    country?: string | null
    league?: string | null
    logoUrl?: string | null
    sportingDirector?: string | null
    transferBudget?: number | null
    squadNeeds?: string[]
    relationshipStatus?: string | null
  }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!body.name?.trim()) {
    return NextResponse.json({ error: 'name is required' }, { status: 422 })
  }

  const club = await db.club.create({
    data: {
      agencyId:          member.agencyId,
      name:              body.name.trim(),
      country:           body.country           ?? null,
      league:            body.league            ?? null,
      logoUrl:           body.logoUrl           ?? null,
      sportingDirector:  body.sportingDirector  ?? null,
      transferBudget:    body.transferBudget     ?? null,
      squadNeeds:        body.squadNeeds        ?? [],
      relationshipStatus: body.relationshipStatus ?? null,
    },
  })

  return NextResponse.json({ club }, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const member = await db.agencyMember.findUnique({
    where: { clerkUserId: userId },
    select: { agencyId: true, role: true },
  })
  if (!member) return NextResponse.json({ error: 'Agency not found' }, { status: 403 })

  if (member.role !== 'AGENCY_OWNER' && member.role !== 'MANAGER') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

  const existing = await db.club.findUnique({
    where: { id },
    select: { agencyId: true },
  })
  if (!existing || existing.agencyId !== member.agencyId) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  await db.club.delete({ where: { id } })

  return new NextResponse(null, { status: 204 })
}
