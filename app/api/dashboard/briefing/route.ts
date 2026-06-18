import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { openai } from '@/lib/openai'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const member = await db.agencyMember.findUnique({
    where: { clerkUserId: userId },
    select: { agencyId: true, fullName: true },
  })
  if (!member) return NextResponse.json({ error: 'No agency found' }, { status: 404 })

  const thirtyDays = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  const today = new Date()

  const [playerCount, openMandates, activeNegotiations, expiringPlayers] = await Promise.all([
    db.playerProfile.count({ where: { agencyId: member.agencyId } }),
    db.clubRequest.count({ where: { agencyId: member.agencyId, status: 'OPEN' } }),
    db.playerNegotiation.count({ where: { pipeline: { agencyId: member.agencyId } } }),
    db.playerProfile.findMany({
      where: {
        agencyId: member.agencyId,
        contractExpiry: { gte: today, lte: thirtyDays },
      },
      select: { fullName: true, position: true, currentClub: true, contractExpiry: true },
      take: 5,
      orderBy: { contractExpiry: 'asc' },
    }),
  ])

  const agentName = member.fullName.split(' ')[0]

  const context = [
    `Total players in database: ${playerCount}`,
    `Open club mandates: ${openMandates}`,
    `Active negotiations in pipeline: ${activeNegotiations}`,
    expiringPlayers.length > 0
      ? `Players with contracts expiring in the next 30 days (${expiringPlayers.length}): ${expiringPlayers.map(p => `${p.fullName} (${p.position ?? 'unknown position'}, ${p.currentClub ?? 'free agent'}, expires ${p.contractExpiry ? new Date(p.contractExpiry).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'soon'})`).join('; ')}`
      : 'No contracts expiring in the next 30 days.',
  ].join('\n')

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.7,
    max_tokens: 160,
    messages: [
      {
        role: 'system',
        content: `You are a concise football agent assistant. Generate a 2-sentence morning briefing for ${agentName}. Be specific, actionable, and professional. Focus on the highest-priority item (expiring contracts > open mandates > negotiations). No bullet points, plain prose only. Start directly with the insight — no greeting.`,
      },
      { role: 'user', content: context },
    ],
  })

  const briefing = completion.choices[0].message.content?.trim() ?? null

  return NextResponse.json({ briefing }, {
    headers: { 'Cache-Control': 'private, max-age=14400' },
  })
}
