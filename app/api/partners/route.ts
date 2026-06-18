/**
 * GET  /api/partners  — get current user's affiliate profile + referrals + payouts
 * POST /api/partners  — apply / create affiliate profile
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

function generateToken(name: string): string {
  const slug = name.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6)
  const suffix = Math.floor(Math.random() * 900 + 100).toString()
  return `${slug}${suffix}`
}

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const partner = await db.affiliatePartner.findUnique({
    where: { clerkUserId: userId },
    include: {
      referrals: { orderBy: { createdAt: 'desc' } },
      payouts:   { orderBy: { createdAt: 'desc' }, take: 24 },
    },
  })

  return NextResponse.json({ partner })
}

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  // Prevent duplicates
  const existing = await db.affiliatePartner.findUnique({ where: { clerkUserId: userId } })
  if (existing) return NextResponse.json({ partner: existing })

  let body: Record<string, unknown>
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!body.fullName || !body.email)
    return NextResponse.json({ error: 'fullName and email are required' }, { status: 422 })

  // Generate unique referral token
  let referralToken = generateToken(body.fullName as string)
  let attempts = 0
  while (attempts < 5) {
    const conflict = await db.affiliatePartner.findUnique({ where: { referralToken } })
    if (!conflict) break
    referralToken = generateToken(body.fullName as string)
    attempts++
  }

  const partner = await db.affiliatePartner.create({
    data: {
      clerkUserId:  userId,
      fullName:     (body.fullName as string).trim(),
      email:        (body.email as string).trim(),
      agencyName:   (body.agencyName as string | undefined) ?? null,
      status:       'PENDING',
      referralToken,
    },
  })

  return NextResponse.json({ partner }, { status: 201 })
}
