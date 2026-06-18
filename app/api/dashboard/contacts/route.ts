import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function GET(_req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const member = await db.agencyMember.findUnique({
    where: { clerkUserId: userId },
    select: { agencyId: true },
  })
  if (!member) return NextResponse.json({ error: 'Agency not found' }, { status: 403 })

  const contacts = await db.clubContact.findMany({
    where: { agencyId: member.agencyId },
    orderBy: [{ clubName: 'asc' }, { fullName: 'asc' }],
  })

  return NextResponse.json({ contacts })
}

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const member = await db.agencyMember.findUnique({
    where: { clerkUserId: userId },
    select: { agencyId: true },
  })
  if (!member) return NextResponse.json({ error: 'Agency not found' }, { status: 403 })

  let body: {
    clubName: string; country?: string; fullName: string; role?: string
    email?: string; phone?: string; whatsapp?: string; notes?: string
  }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!body.clubName || !body.fullName) {
    return NextResponse.json({ error: 'clubName and fullName are required' }, { status: 422 })
  }

  const contact = await db.clubContact.create({
    data: {
      agencyId: member.agencyId,
      clubName: body.clubName,
      country:  body.country  ?? null,
      fullName: body.fullName,
      role:     body.role     ?? null,
      email:    body.email    ?? null,
      phone:    body.phone    ?? null,
      whatsapp: body.whatsapp ?? null,
      notes:    body.notes    ?? null,
    },
  })

  return NextResponse.json({ contact }, { status: 201 })
}
