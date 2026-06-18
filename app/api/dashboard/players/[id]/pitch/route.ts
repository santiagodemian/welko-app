import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { openai } from '@/lib/openai'
import { isAdminUser } from '@/lib/is-admin'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { id: playerId } = await params

  const member = await db.agencyMember.findUnique({
    where: { clerkUserId: userId },
    select: { agencyId: true, agency: { select: { subscription: { select: { planType: true } } } } },
  })
  if (!member) return NextResponse.json({ error: 'Agency not found' }, { status: 403 })

  const [adminCheck] = await Promise.all([isAdminUser(userId)])
  const isPremium = adminCheck || member.agency.subscription?.planType !== 'FREE'
  if (!isPremium) return NextResponse.json({ error: 'Premium required' }, { status: 403 })

  const player = await db.playerProfile.findFirst({
    where: { id: playerId, agencyId: member.agencyId },
    select: {
      fullName:         true,
      position:         true,
      nationality:      true,
      currentClub:      true,
      currentLeague:    true,
      age:              true,
      height:           true,
      preferredFoot:    true,
      seasonMatches:    true,
      seasonGoals:      true,
      seasonAssists:    true,
      seasonMinutes:    true,
      marketValue:      true,
      releaseFee:       true,
      contractExpiry:   true,
      eloRating:        true,
      notes:            true,
    },
  })
  if (!player) return NextResponse.json({ error: 'Player not found' }, { status: 404 })

  const contractDate = player.contractExpiry
    ? new Date(player.contractExpiry).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
    : null

  const prompt = `You are writing a professional scouting pitch for a football agent's player proposal document.

Player data:
- Name: ${player.fullName}
- Position: ${player.position ?? 'Not specified'}
- Age: ${player.age ?? 'Not specified'}
- Nationality: ${player.nationality ?? 'Not specified'}
- Current club: ${player.currentClub ?? 'Free agent'}
- League: ${player.currentLeague ?? 'Not specified'}
- Height: ${player.height ? `${player.height} cm` : 'Not specified'}
- Preferred foot: ${player.preferredFoot ?? 'Not specified'}
- This season: ${player.seasonMatches} apps, ${player.seasonGoals} goals, ${player.seasonAssists} assists, ${player.seasonMinutes} min
- Market value: ${player.marketValue ? `€${(player.marketValue / 1000).toFixed(0)}k` : 'Not specified'}
- Release fee: ${player.releaseFee ? `€${(player.releaseFee / 1000).toFixed(0)}k` : 'Not specified'}
- Contract until: ${contractDate ?? 'Not specified'}
- Polaris rating: ${player.eloRating ?? 'Not rated'}
- Agent notes: ${player.notes ?? 'None'}

Write a compelling 3-sentence scouting pitch paragraph in English. It should:
1. Open with the player's key quality and position (sentence 1)
2. Reference their current season output or physical/technical profile (sentence 2)
3. Close with their transfer opportunity or availability (sentence 3)

Be professional, precise, and persuasive. Do not invent stats. Only output the paragraph — no title, no labels.`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200,
      temperature: 0.7,
    })
    const narrative = completion.choices[0]?.message?.content?.trim() ?? ''
    return NextResponse.json({ narrative })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'AI error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
