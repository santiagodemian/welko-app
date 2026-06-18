import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

// GET /api/dashboard/team — list all members of the agency
export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const me = await db.agencyMember.findUnique({
    where:  { clerkUserId: userId },
    select: { agencyId: true, role: true },
  })
  if (!me) return NextResponse.json({ error: 'Agency not found' }, { status: 403 })

  const members = await db.agencyMember.findMany({
    where:   { agencyId: me.agencyId, active: true },
    select:  { id: true, fullName: true, email: true, role: true, avatarUrl: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  })

  return NextResponse.json({ members, myRole: me.role })
}
