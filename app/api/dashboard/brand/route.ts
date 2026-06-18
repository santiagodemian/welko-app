import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

async function getMember(userId: string) {
  return db.agencyMember.findUnique({
    where: { clerkUserId: userId },
    select: { agencyId: true, role: true },
  })
}

// GET /api/dashboard/brand
export async function GET() {
  const { userId, sessionClaims } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const member = await getMember(userId)
  if (!member) return NextResponse.json({ error: 'Agency not found' }, { status: 403 })

  const brandKit = await db.agencyBrandKit.findUnique({
    where: { agencyId: member.agencyId },
  })

  const isDev      = process.env.NODE_ENV !== 'production'
  const plan       = (sessionClaims as Record<string, unknown> | null)?.plan as string | undefined
  const isPremium  = isDev || plan === 'premium'
  const canEdit    = isPremium && (member.role === 'AGENCY_OWNER' || member.role === 'MANAGER')

  return NextResponse.json({ brandKit: brandKit ?? null, isPremium, canEdit, myRole: member.role })
}

// PATCH /api/dashboard/brand
export async function PATCH(req: NextRequest) {
  const { userId, sessionClaims } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const isDev = process.env.NODE_ENV !== 'production'
  const plan  = (sessionClaims as Record<string, unknown> | null)?.plan as string | undefined
  if (!isDev && plan !== 'premium') {
    return NextResponse.json({ error: 'Premium plan required' }, { status: 403 })
  }

  const member = await getMember(userId)
  if (!member) return NextResponse.json({ error: 'Agency not found' }, { status: 403 })

  const allowedRoles = ['AGENCY_OWNER', 'MANAGER']
  if (!allowedRoles.includes(member.role)) {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
  }

  let body: {
    primaryColor?: string | null
    accentColor?: string | null
    logoUrl?: string | null
    footerEmail?: string | null
    footerPhone?: string | null
    footerLocation?: string | null
  }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  const brandKit = await db.agencyBrandKit.upsert({
    where:  { agencyId: member.agencyId },
    create: { agencyId: member.agencyId, ...body },
    update: body,
  })

  return NextResponse.json({ brandKit })
}
