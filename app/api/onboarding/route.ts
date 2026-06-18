/**
 * POST /api/onboarding
 *
 * Creates an Agency + AgencyMember for the authenticated Clerk user.
 * Called when a new user completes the agency setup flow.
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

interface OnboardingPayload {
  agencyName: string
  country?: string
  website?: string
  fullName?: string
  firstPlayer?: { fullName: string; position?: string; currentClub?: string }
}

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  let body: OnboardingPayload
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const agencyName = body.agencyName?.trim()
  if (!agencyName) {
    return NextResponse.json({ error: 'Agency name is required.' }, { status: 422 })
  }

  // Check if member already exists (idempotent)
  const existingMember = await db.agencyMember.findUnique({
    where: { clerkUserId: userId },
  })
  if (existingMember) {
    return NextResponse.json({ ok: true, agencyId: existingMember.agencyId })
  }

  // Create agency + owner member + free subscription in one transaction
  const result = await db.$transaction(async (tx) => {
    const agency = await tx.agency.create({
      data: {
        name:       agencyName,
        ...(body.country?.trim() ? { country: body.country.trim() } : {}),
        ...(body.website?.trim() ? { website: body.website.trim() } : {}),
        subscription: {
          create: {
            planType: 'FREE',
            status:   'ACTIVE',
          },
        },
      },
      select: { id: true },
    })

    // Fetch Clerk user email for the member record
    const member = await tx.agencyMember.create({
      data: {
        agencyId:    agency.id,
        clerkUserId: userId,
        email:       '',          // will be filled by sync job or next login
        fullName:    (body.fullName ?? '').trim() || 'Agency Owner',
        role:        'AGENCY_OWNER',
        active:      true,
      },
      select: { id: true },
    })

    // Auto-create default pipeline stages for this agency
    await tx.transferPipeline.createMany({
      data: [
        { agencyId: agency.id, name: 'INITIAL_CONTACT',  positionIndex: 0 },
        { agencyId: agency.id, name: 'PROPOSAL_SENT',    positionIndex: 1 },
        { agencyId: agency.id, name: 'FINANCIAL_TALKS',  positionIndex: 2 },
        { agencyId: agency.id, name: 'CONTRACT_CLOSURE', positionIndex: 3 },
      ],
      skipDuplicates: true,
    })

    // Optionally create first player
    if (body.firstPlayer?.fullName?.trim()) {
      await tx.playerProfile.create({
        data: {
          agencyId:          agency.id,
          createdByMemberId: member.id,
          fullName:          body.firstPlayer.fullName.trim(),
          position:          body.firstPlayer.position?.trim() || null,
          currentClub:       body.firstPlayer.currentClub?.trim() || null,
          category:          'MANAGED',
        },
      })
    }

    return { agencyId: agency.id, memberId: member.id }
  })

  return NextResponse.json({ ok: true, ...result }, { status: 201 })
}
