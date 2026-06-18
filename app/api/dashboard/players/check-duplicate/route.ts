import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

// GET /api/dashboard/players/check-duplicate?name=John%20Doe&club=FC%20Betis
// Returns { duplicate: true/false, existing?: { id, fullName, currentClub } }
export async function GET(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const member = await db.agencyMember.findUnique({
    where: { clerkUserId: userId },
    select: { agencyId: true },
  })
  if (!member) return NextResponse.json({ error: 'Agency not found' }, { status: 403 })

  const name = req.nextUrl.searchParams.get('name')?.trim().toLowerCase() ?? ''
  if (!name || name.length < 2) {
    return NextResponse.json({ duplicate: false })
  }

  // Find players whose normalized name closely matches
  const players = await db.playerProfile.findMany({
    where: { agencyId: member.agencyId },
    select: { id: true, fullName: true, currentClub: true, position: true },
  })

  const match = players.find(p =>
    p.fullName.toLowerCase() === name ||
    p.fullName.toLowerCase().includes(name) ||
    name.includes(p.fullName.toLowerCase())
  )

  if (!match) return NextResponse.json({ duplicate: false })

  return NextResponse.json({ duplicate: true, existing: match })
}
