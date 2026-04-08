/**
 * DELETE /api/calendar/disconnect
 * Removes the Google Calendar integration for the authenticated clinic.
 */

import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function DELETE() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const clinic = await db.clinic.findUnique({
    where: { clerkUserId: userId },
    select: { id: true },
  })
  if (!clinic) return NextResponse.json({ error: 'Clinic not found' }, { status: 404 })

  await db.clinic.update({
    where: { id: clinic.id },
    data:  { googleRefreshToken: null },
  })

  return NextResponse.json({ ok: true })
}
