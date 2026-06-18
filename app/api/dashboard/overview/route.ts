import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

interface AIAlert {
  priority: 'HIGH' | 'MEDIUM'
  title: string
  description: string
  href: string
}

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const member = await db.agencyMember.findUnique({
    where: { clerkUserId: userId },
    select: { agencyId: true, fullName: true },
  })
  if (!member) return NextResponse.json({ error: 'Agency not found' }, { status: 403 })

  const now = new Date()
  const in90Days = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000)
  const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const tomorrowStart = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000)

  const [
    portfolioAgg,
    pipelineAgg,
    totalNegotiations,
    completedDeals,
    expiringCount,
    activeDeals,
    todaysTasks,
    contractAlerts,
  ] = await Promise.all([
    db.playerProfile.aggregate({
      _sum: { marketValue: true },
      where: { agencyId: member.agencyId, marketValue: { not: null } },
    }),
    db.playerNegotiation.aggregate({
      _sum: { estimatedDealValue: true },
      where: { pipeline: { agencyId: member.agencyId } },
    }),
    db.playerNegotiation.count({
      where: { pipeline: { agencyId: member.agencyId } },
    }),
    db.playerNegotiation.count({
      where: {
        pipeline: { agencyId: member.agencyId },
        contractClosedAt: { not: null },
      },
    }),
    db.playerProfile.count({
      where: {
        agencyId: member.agencyId,
        contractExpiry: { lte: in90Days, not: null },
      },
    }),
    db.playerNegotiation.findMany({
      where: { pipeline: { agencyId: member.agencyId } },
      orderBy: { updatedAt: 'desc' },
      take: 5,
      select: {
        id: true,
        targetClub: true,
        estimatedDealValue: true,
        notes: true,
        positionIndex: true,
        proposalSentAt: true,
        financialTalksAt: true,
        contractClosedAt: true,
        createdAt: true,
        updatedAt: true,
        player: {
          select: {
            fullName: true,
            position: true,
            currentClub: true,
            photoUrl: true,
          },
        },
        pipeline: {
          select: { name: true },
        },
      },
    }),
    db.task.findMany({
      where: {
        agencyId: member.agencyId,
        dueDate: { gte: todayStart, lt: tomorrowStart },
        isCompleted: false,
      },
      take: 10,
      select: {
        id: true,
        title: true,
        priority: true,
        category: true,
        dueDate: true,
        isCompleted: true,
        player: {
          select: { fullName: true },
        },
      },
    }),
    db.playerProfile.findMany({
      where: {
        agencyId: member.agencyId,
        contractExpiry: { lte: in30Days, not: null },
      },
      take: 5,
      select: {
        id: true,
        fullName: true,
        contractExpiry: true,
        currentClub: true,
        position: true,
      },
    }),
  ])

  const portfolioValue = portfolioAgg._sum.marketValue ?? 0
  const pipelineRevenue = pipelineAgg._sum.estimatedDealValue ?? 0
  const successRate =
    totalNegotiations > 0
      ? Math.round((completedDeals / totalNegotiations) * 100)
      : 0

  const aiAlerts: AIAlert[] = []

  if (expiringCount > 0) {
    aiAlerts.push({
      priority: 'HIGH',
      title: `${expiringCount} contract${expiringCount > 1 ? 's' : ''} expiring within 90 days`,
      description: `Review and initiate renewal or transfer proceedings before the window closes.`,
      href: '/dashboard/players',
    })
  }

  if (contractAlerts.length > 0) {
    const names = contractAlerts
      .slice(0, 2)
      .map((p) => p.fullName)
      .join(', ')
    aiAlerts.push({
      priority: 'HIGH',
      title: `Urgent: ${contractAlerts.length} player${contractAlerts.length > 1 ? 's' : ''} expire within 30 days`,
      description: `${names}${contractAlerts.length > 2 ? ` and ${contractAlerts.length - 2} more` : ''} need immediate attention.`,
      href: '/dashboard/players',
    })
  }

  if (totalNegotiations > 0 && completedDeals < Math.ceil(totalNegotiations / 2)) {
    aiAlerts.push({
      priority: 'MEDIUM',
      title: 'Pipeline conversion rate below 50%',
      description: `${completedDeals} of ${totalNegotiations} deals closed. Push stalled negotiations forward.`,
      href: '/dashboard/pipeline',
    })
  }

  if (todaysTasks.length === 0) {
    aiAlerts.push({
      priority: 'MEDIUM',
      title: 'No tasks scheduled for today',
      description: 'Add follow-up tasks to stay on top of your active deals and player contacts.',
      href: '/dashboard/workspace',
    })
  }

  if (pipelineRevenue === 0 && totalNegotiations > 0) {
    aiAlerts.push({
      priority: 'MEDIUM',
      title: 'Deal values not set in pipeline',
      description: `${totalNegotiations} active negotiation${totalNegotiations > 1 ? 's' : ''} have no estimated deal value. Update them for accurate revenue forecasting.`,
      href: '/dashboard/pipeline',
    })
  }

  if (aiAlerts.length === 0) {
    aiAlerts.push({
      priority: 'MEDIUM',
      title: 'Keep your pipeline updated',
      description: 'Regularly review and advance negotiations to improve your success rate.',
      href: '/dashboard/pipeline',
    })
  }

  return NextResponse.json({
    portfolioValue,
    pipelineRevenue,
    successRate,
    expiringCount,
    activeDeals,
    todaysTasks,
    contractAlerts,
    aiAlerts,
  })
}
