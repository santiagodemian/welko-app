import { NextRequest, NextResponse } from 'next/server'
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
    select: { name: true, country: true, website: true },
  })

  return NextResponse.json({ agency })
}

export async function PATCH(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const member = await db.agencyMember.findUnique({
    where: { clerkUserId: userId },
    select: { agencyId: true, role: true },
  })
  if (!member) return NextResponse.json({ error: 'Agency not found' }, { status: 403 })
  if (member.role !== 'AGENCY_OWNER' && member.role !== 'MANAGER') {
    return NextResponse.json({ error: 'Only agency owners can change settings' }, { status: 403 })
  }

  let body: { name?: string; country?: string; website?: string }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  if (body.name !== undefined && !body.name.trim()) {
    return NextResponse.json({ error: 'Agency name cannot be empty' }, { status: 422 })
  }

  const agency = await db.agency.update({
    where: { id: member.agencyId },
    data: {
      ...(body.name    !== undefined ? { name:    body.name.trim()    } : {}),
      ...(body.country !== undefined ? { country: body.country        } : {}),
      ...(body.website !== undefined ? { website: body.website.trim() || null } : {}),
    },
    select: { name: true, country: true, website: true },
  })

  return NextResponse.json({ agency })
}
