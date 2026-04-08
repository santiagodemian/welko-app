/**
 * GET /api/calendar/status
 * Returns { connected: boolean } for the authenticated clinic.
 */

import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const clinic = await db.clinic.findUnique({
    where: { clerkUserId: userId },
    select: { googleRefreshToken: true },
  })

  return NextResponse.json({ connected: !!clinic?.googleRefreshToken })
}
