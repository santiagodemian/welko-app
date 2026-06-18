import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

async function getMember(userId: string) {
  return db.agencyMember.findUnique({
    where: { clerkUserId: userId },
    select: { id: true, agencyId: true, role: true },
  })
}

// Derive outreach status from latest comm log + pipeline presence
function deriveStatus(
  commCount: number,
  latestLog: { type: string; outcome: string } | null,
  inPipeline: boolean,
): string {
  if (inPipeline)               return 'PROPOSAL_SENT'
  if (commCount === 0)          return 'NOT_CONTACTED'
  if (!latestLog)               return 'NOT_CONTACTED'
  if (latestLog.outcome === 'NEGATIVE')           return 'NOT_INTERESTED'
  if (latestLog.outcome === 'FOLLOW_UP_REQUIRED') return 'FOLLOW_UP'
  if (latestLog.type === 'CALL' || latestLog.type === 'MEETING' || latestLog.type === 'VIDEO_CALL') {
    return 'SITUATION_KNOWN'
  }
  if (latestLog.outcome === 'POSITIVE') return 'REPLIED'
  return 'MESSAGED'
}

export async function GET(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const member = await getMember(userId)
  if (!member) return NextResponse.json({ error: 'Agency not found' }, { status: 403 })

  const statusFilter = req.nextUrl.searchParams.get('status') // optional filter

  const players = await db.playerProfile.findMany({
    where: { agencyId: member.agencyId },
    select: {
      id: true,
      fullName: true,
      position: true,
      age: true,
      nationality: true,
      currentClub: true,
      currentLeague: true,
      contractExpiry: true,
      eloRating: true,
      category: true,
      verificationStatus: true,
      storedPhotoUrl: true,
      photoUrl: true,
      communicationLogs: {
        select: { id: true, title: true, type: true, outcome: true, timestamp: true },
        orderBy: { timestamp: 'desc' },
        take: 1,
      },
      _count: { select: { communicationLogs: true } },
      negotiations: {
        select: { id: true, targetClub: true },
        take: 1,
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const result = players.map(p => {
    const latestLog = p.communicationLogs[0] ?? null
    const status = deriveStatus(p._count.communicationLogs, latestLog, p.negotiations.length > 0)
    return {
      id:             p.id,
      fullName:       p.fullName,
      position:       p.position,
      age:            p.age,
      nationality:    p.nationality,
      currentClub:    p.currentClub,
      currentLeague:  p.currentLeague,
      contractExpiry: p.contractExpiry,
      eloRating:      p.eloRating,
      category:       p.category,
      verificationStatus: p.verificationStatus,
      storedPhotoUrl: p.storedPhotoUrl,
      photoUrl:       p.photoUrl,
      outreachStatus: status,
      contactCount:   p._count.communicationLogs,
      latestLog,
    }
  })

  const filtered = statusFilter ? result.filter(p => p.outreachStatus === statusFilter) : result

  // Counts per status for the tab badges
  const counts: Record<string, number> = {}
  for (const p of result) {
    counts[p.outreachStatus] = (counts[p.outreachStatus] ?? 0) + 1
  }

  return NextResponse.json({ players: filtered, counts, total: result.length })
}
