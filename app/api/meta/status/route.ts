/**
 * GET /api/meta/status
 * Returns current Facebook/Instagram connection status for the logged-in clinic.
 */

import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const clinic = await db.clinic.findUnique({
    where: { clerkUserId: userId },
    select: { facebookPageId: true, instagramAccountId: true },
  })

  return NextResponse.json({
    facebookConnected:  !!clinic?.facebookPageId,
    instagramConnected: !!clinic?.instagramAccountId,
    facebookPageId:     clinic?.facebookPageId   ?? null,
    instagramAccountId: clinic?.instagramAccountId ?? null,
  })
}

export async function DELETE() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await db.clinic.update({
    where: { clerkUserId: userId },
    data: { facebookPageId: null, facebookPageToken: null, instagramAccountId: null },
  })

  return NextResponse.json({ ok: true })
}
