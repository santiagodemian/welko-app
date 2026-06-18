import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { Resend } from 'resend'
import { renderContractExpiryEmail } from '@/lib/emails/contract-expiry'

const resend = new Resend(process.env.RESEND_API_KEY)

// Runs daily at 14:00 UTC via vercel.json cron.
// Sends contract-expiry alerts at 90, 60, and 30-day thresholds.
export async function GET(req: NextRequest) {
  const secret = req.headers.get('authorization')
  if (secret !== `Bearer ${process.env.CRON_SECRET ?? ''}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date()

  // Build three date targets: 90, 60, and 30 days from today (±1 day window to avoid gaps)
  const windows = [90, 60, 30].map(days => ({
    days,
    from: new Date(now.getTime() + (days - 1) * 86_400_000),
    to:   new Date(now.getTime() + (days + 1) * 86_400_000),
  }))

  // Fetch all players whose contracts expire in any of the three windows
  const players = await db.playerProfile.findMany({
    where: {
      contractExpiry: {
        gte: windows[windows.length - 1].from,
        lte: windows[0].to,
      },
    },
    select: {
      id:            true,
      fullName:      true,
      position:      true,
      currentClub:   true,
      contractExpiry: true,
      agencyId:      true,
    },
  })

  if (players.length === 0) {
    return NextResponse.json({ sent: 0 })
  }

  // Group players by agencyId
  const byAgency = new Map<string, typeof players>()
  for (const p of players) {
    const list = byAgency.get(p.agencyId) ?? []
    list.push(p)
    byAgency.set(p.agencyId, list)
  }

  // For each agency, get all member emails and send one digest email
  let totalSent = 0
  for (const [agencyId, agencyPlayers] of byAgency) {
    const members = await db.agencyMember.findMany({
      where: { agencyId, active: true },
      select: { email: true, fullName: true },
    })

    if (members.length === 0) continue

    // Annotate each player with daysLeft
    const annotated = agencyPlayers
      .filter(p => p.contractExpiry !== null)
      .map(p => ({
        fullName:       p.fullName,
        position:       p.position,
        currentClub:    p.currentClub,
        contractExpiry: p.contractExpiry!,
        daysLeft:       Math.ceil(
          (p.contractExpiry!.getTime() - now.getTime()) / 86_400_000,
        ),
      }))
      .sort((a, b) => a.daysLeft - b.daysLeft)

    if (annotated.length === 0) continue

    // Send to each active member
    for (const member of members) {
      try {
        const html = renderContractExpiryEmail({
          agentName: member.fullName,
          players:   annotated,
        })
        await resend.emails.send({
          from:    'Polaris Football <alerts@polarisfootball.com>',
          to:      member.email,
          subject: `Contract Alert: ${annotated.length} player${annotated.length !== 1 ? 's' : ''} expiring within 90 days`,
          html,
        })
        totalSent++
      } catch {
        // Non-fatal — continue to next member
      }
    }
  }

  return NextResponse.json({ sent: totalSent })
}
