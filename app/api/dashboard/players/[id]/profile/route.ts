import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

const ALLOWED_STRING  = ['transfermarktUrl', 'besoccerUrl', 'sofascoreUrl', 'storedPhotoUrl'] as const
const ALLOWED_INT     = ['seasonMatches', 'seasonMinutes', 'seasonGoals', 'seasonAssists']    as const
const ALLOWED_CATEGORY = ['MANAGED', 'MANDATE', 'PROSPECTIVE'] as const

// 2 MB hard cap for storedPhotoUrl base64 data
const MAX_PHOTO_BYTES = 2 * 1024 * 1024

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { id: playerId } = await params

  const member = await db.agencyMember.findUnique({
    where: { clerkUserId: userId },
    select: { agencyId: true },
  })
  if (!member) return NextResponse.json({ error: 'Agency not found' }, { status: 403 })

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const data: Record<string, string | number | null> = {}

  if ('category' in body) {
    const cat = body.category
    if (typeof cat === 'string' && (ALLOWED_CATEGORY as readonly string[]).includes(cat)) {
      data.category = cat
    }
  }

  for (const key of ALLOWED_STRING) {
    if (!(key in body)) continue
    const val = body[key]
    if (val === null || val === undefined || val === '') {
      data[key] = null
    } else if (typeof val === 'string') {
      if (key === 'storedPhotoUrl' && val.length > MAX_PHOTO_BYTES) {
        return NextResponse.json({ error: 'Photo exceeds 2 MB limit' }, { status: 413 })
      }
      data[key] = val
    }
  }

  for (const key of ALLOWED_INT) {
    if (!(key in body)) continue
    const val = body[key]
    const parsed = typeof val === 'number' ? val : parseInt(String(val), 10)
    data[key] = isNaN(parsed) ? 0 : Math.max(0, parsed)
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 422 })
  }

  const result = await db.playerProfile.updateMany({
    where: { id: playerId, agencyId: member.agencyId },
    data,
  })

  if (result.count === 0) {
    return NextResponse.json({ error: 'Player not found' }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}
