import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { isAdminUser } from '@/lib/is-admin'
import Link from 'next/link'
import {
  TrendingUp,
  Target,
  Clock,
  AlertTriangle,
  Sparkles,
  CheckSquare,
  ArrowRight,
  Plus,
  Users,
  GitBranch,
  Building2,
  FileSearch,
  Bot,
  Shield,
  CalendarDays,
} from 'lucide-react'

const N = '#0A1628'
const G = '#1E6FEB'

interface NegotiationPlayer {
  fullName: string
  position: string | null
  currentClub: string | null
  photoUrl: string | null
}

interface NegotiationPipeline {
  name: string
}

interface ActiveDeal {
  id: string
  targetClub: string | null
  estimatedDealValue: number | null
  notes: string | null
  positionIndex: number
  proposalSentAt: Date | null
  financialTalksAt: Date | null
  contractClosedAt: Date | null
  createdAt: Date
  updatedAt: Date
  player: NegotiationPlayer
  pipeline: NegotiationPipeline
}

interface TodayTask {
  id: string
  title: string
  priority: string
  category: string
  dueDate: Date
  isCompleted: boolean
  player: { fullName: string } | null
}

interface ContractAlert {
  id: string
  fullName: string
  contractExpiry: Date | null
  currentClub: string | null
  position: string | null
}

interface AIAlert {
  priority: 'HIGH' | 'MEDIUM'
  title: string
  description: string
  href: string
}

interface Overview {
  member: {
    fullName: string
    agencyId: string
    agency: {
      name: string
      subscription: { planType: string } | null
    }
  }
  portfolioValue: number
  pipelineRevenue: number
  successRate: number
  expiringCount: number
  totalNegotiations: number
  completedDeals: number
  activeDeals: ActiveDeal[]
  todaysTasks: TodayTask[]
  contractAlerts: ContractAlert[]
  aiAlerts: AIAlert[]
}

async function getOverview(userId: string): Promise<Overview | null> {
  try {
    const member = await db.agencyMember.findUnique({
      where: { clerkUserId: userId },
      include: { agency: { include: { subscription: true } } },
    })
    if (!member) return null

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
            select: { fullName: true, position: true, currentClub: true, photoUrl: true },
          },
          pipeline: { select: { name: true } },
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
          player: { select: { fullName: true } },
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
        description: 'Review and initiate renewal or transfer proceedings before the window closes.',
        href: '/dashboard/players',
      })
    }

    if (contractAlerts.length > 0) {
      const names = contractAlerts.slice(0, 2).map((p) => p.fullName).join(', ')
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
        description: `${totalNegotiations} active negotiation${totalNegotiations > 1 ? 's' : ''} missing estimated deal values.`,
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

    return {
      member,
      portfolioValue,
      pipelineRevenue,
      successRate,
      expiringCount,
      totalNegotiations,
      completedDeals,
      activeDeals,
      todaysTasks,
      contractAlerts,
      aiAlerts,
    }
  } catch {
    return null
  }
}

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `€${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `€${Math.round(value / 1_000)}K`
  return `€${Math.round(value)}`
}

function stageBadgeColor(name: string): { bg: string; color: string } {
  switch (name) {
    case 'INITIAL_CONTACT': return { bg: '#EFF6FF', color: '#3B82F6' }
    case 'PROPOSAL_SENT':   return { bg: '#F5F3FF', color: '#7C3AED' }
    case 'FINANCIAL_TALKS': return { bg: '#FFFBEB', color: '#D97706' }
    case 'CONTRACT_CLOSURE': return { bg: '#ECFDF5', color: '#059669' }
    default: return { bg: '#F3F4F6', color: '#6B7280' }
  }
}

function stageLabel(name: string): string {
  switch (name) {
    case 'INITIAL_CONTACT':  return 'Initial Contact'
    case 'PROPOSAL_SENT':    return 'Proposal Sent'
    case 'FINANCIAL_TALKS':  return 'Financial Talks'
    case 'CONTRACT_CLOSURE': return 'Contract Closure'
    default: return name
  }
}

function daysUntil(date: Date | null): number {
  if (!date) return 0
  return Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) return null

  const data = await getOverview(userId)

  if (!data) {
    return (
      <div style={{ padding: 48, fontFamily: 'var(--font-montserrat), sans-serif' }}>
        <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 16, padding: 48, textAlign: 'center', maxWidth: 480, margin: '0 auto' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚽</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: N, margin: '0 0 8px' }}>Welcome to Welko AgentOS</h2>
          <p style={{ color: '#6B7280', margin: '0 0 24px', lineHeight: 1.6 }}>Complete your agency setup to get started.</p>
          <Link href="/onboarding" style={{ background: N, color: 'white', padding: '12px 28px', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
            Set up Agency →
          </Link>
        </div>
      </div>
    )
  }

  const {
    member,
    portfolioValue,
    pipelineRevenue,
    successRate,
    expiringCount,
    activeDeals,
    todaysTasks,
    contractAlerts,
    aiAlerts,
  } = data

  const isPremium = (await isAdminUser(userId)) || member.agency.subscription?.planType !== 'FREE'
  const firstName = member.fullName.split(' ')[0]
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  const highAlerts = aiAlerts.filter((a) => a.priority === 'HIGH')
  const mediumAlerts = aiAlerts.filter((a) => a.priority === 'MEDIUM')

  const kpiCards = [
    {
      label: 'Portfolio Value',
      value: formatCurrency(portfolioValue),
      icon: TrendingUp,
      iconBg: `${G}15`,
      iconColor: G,
      href: '/dashboard/players',
    },
    {
      label: 'Pipeline Revenue',
      value: formatCurrency(pipelineRevenue),
      icon: Target,
      iconBg: '#059669' + '15',
      iconColor: '#059669',
      href: '/dashboard/pipeline',
    },
    {
      label: 'Success Rate',
      value: `${successRate}%`,
      icon: Sparkles,
      iconBg: '#7C3AED' + '15',
      iconColor: '#7C3AED',
      href: '/dashboard/pipeline',
    },
    {
      label: 'Expiring Contracts',
      value: String(expiringCount),
      icon: AlertTriangle,
      iconBg: expiringCount > 0 ? '#EF444415' : '#F3F4F6',
      iconColor: expiringCount > 0 ? '#EF4444' : '#6B7280',
      href: '/dashboard/players',
      valueColor: expiringCount > 0 ? '#EF4444' : N,
    },
  ]

  const quickActions = [
    { label: 'Add Player',   href: '/dashboard/players',   icon: Users },
    { label: 'Pipeline',     href: '/dashboard/pipeline',  icon: GitBranch },
    { label: 'Mandates AI',  href: '/dashboard/mandates',  icon: Bot },
    { label: 'Clubs',        href: '/dashboard/clubs',     icon: Building2 },
    { label: 'Scouting',     href: '/dashboard/scouting',  icon: FileSearch },
    { label: 'Workspace',    href: '/dashboard/workspace', icon: Shield },
  ]

  return (
    <div style={{ padding: 'clamp(20px,4vw,40px)', fontFamily: 'var(--font-montserrat), sans-serif', maxWidth: 1200 }}>
      <style>{`
        @media (max-width: 640px) {
          .db-kpi-grid    { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
          .db-ai-grid     { grid-template-columns: 1fr !important; gap: 12px !important; }
          .db-main-grid   { grid-template-columns: 1fr !important; gap: 16px !important; }
          .db-quick-grid  { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; }
        }
      `}</style>

      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: N, margin: '0 0 4px', letterSpacing: '-0.03em' }}>
          {greeting}, {firstName} 👋
        </h1>
        <p style={{ color: '#6B7280', margin: 0, fontSize: 14 }}>
          {member.agency.name} · {isPremium ? 'AgentOS Premium' : 'Scout Plan'}
        </p>
      </div>

      <div className="db-kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {kpiCards.map(({ label, value, icon: Icon, iconBg, iconColor, href, valueColor }) => (
          <Link key={label} href={href} style={{ textDecoration: 'none' }}>
            <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 14, padding: 20, cursor: 'pointer' }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                <Icon size={18} color={iconColor} />
              </div>
              <p style={{ fontSize: 28, fontWeight: 800, color: valueColor ?? N, margin: '0 0 4px', letterSpacing: '-0.03em', fontFamily: 'var(--font-montserrat)' }}>
                {value}
              </p>
              <p style={{ fontSize: 12, color: '#6B7280', margin: 0, fontWeight: 500 }}>{label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ background: '#F9FAFB', borderRadius: 16, padding: 24, border: '1px solid #E5E7EB', marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Bot size={16} color={G} />
          <span style={{ fontSize: 13, fontWeight: 700, color: N }}>AI Insights</span>
        </div>
        <div className="db-ai-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#EF4444', margin: '0 0 10px' }}>🔴 High Priority</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {highAlerts.length > 0 ? highAlerts.map((alert, i) => (
                <Link key={i} href={alert.href} style={{ textDecoration: 'none' }}>
                  <div style={{ background: 'white', borderRadius: 10, padding: 12, borderLeft: '3px solid #EF4444', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: N, margin: '0 0 3px' }}>{alert.title}</p>
                      <p style={{ fontSize: 12, color: '#6B7280', margin: 0, lineHeight: 1.4 }}>{alert.description}</p>
                    </div>
                    <ArrowRight size={14} color="#9CA3AF" style={{ flexShrink: 0, marginTop: 2 }} />
                  </div>
                </Link>
              )) : (
                <div style={{ background: 'white', borderRadius: 10, padding: 12, borderLeft: '3px solid #EF4444' }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#6B7280', margin: 0 }}>No high priority alerts</p>
                </div>
              )}
            </div>
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#D97706', margin: '0 0 10px' }}>🟡 Medium Priority</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {mediumAlerts.length > 0 ? mediumAlerts.map((alert, i) => (
                <Link key={i} href={alert.href} style={{ textDecoration: 'none' }}>
                  <div style={{ background: 'white', borderRadius: 10, padding: 12, borderLeft: '3px solid #F59E0B', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: N, margin: '0 0 3px' }}>{alert.title}</p>
                      <p style={{ fontSize: 12, color: '#6B7280', margin: 0, lineHeight: 1.4 }}>{alert.description}</p>
                    </div>
                    <ArrowRight size={14} color="#9CA3AF" style={{ flexShrink: 0, marginTop: 2 }} />
                  </div>
                </Link>
              )) : (
                <div style={{ background: 'white', borderRadius: 10, padding: 12, borderLeft: '3px solid #F59E0B' }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#6B7280', margin: 0 }}>No medium priority alerts</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="db-main-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 28 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <GitBranch size={15} color={G} />
                <h2 style={{ fontSize: 14, fontWeight: 700, color: N, margin: 0 }}>Active Deals</h2>
              </div>
              <Link href="/dashboard/pipeline" style={{ fontSize: 12, color: G, textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                View all <ArrowRight size={12} />
              </Link>
            </div>
            {activeDeals.length > 0 ? (
              <div>
                {activeDeals.map((deal, i) => {
                  const badge = stageBadgeColor(deal.pipeline.name)
                  return (
                    <div
                      key={deal.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                        padding: '13px 20px',
                        borderTop: i > 0 ? '1px solid #F3F4F6' : 'none',
                      }}
                    >
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: N, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: G }}>
                          {deal.player.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: N, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {deal.player.fullName}
                        </p>
                        <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0 }}>
                          {deal.targetClub ?? deal.player.currentClub ?? '—'}
                          {deal.player.position ? ` · ${deal.player.position}` : ''}
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 20, background: badge.bg, color: badge.color }}>
                          {stageLabel(deal.pipeline.name)}
                        </span>
                        {deal.estimatedDealValue != null && (
                          <span style={{ fontSize: 12, fontWeight: 700, color: '#059669' }}>
                            {formatCurrency(deal.estimatedDealValue)}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div style={{ padding: '32px 20px', textAlign: 'center' }}>
                <GitBranch size={28} color="#D1D5DB" style={{ marginBottom: 10 }} />
                <p style={{ fontSize: 13, color: '#9CA3AF', margin: '0 0 14px', fontWeight: 500 }}>No active deals in pipeline</p>
                <Link href="/dashboard/pipeline" style={{ fontSize: 12, color: G, textDecoration: 'none', fontWeight: 700 }}>
                  Open Pipeline →
                </Link>
              </div>
            )}
          </div>

          <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: 8 }}>
              <CalendarDays size={15} color={G} />
              <h2 style={{ fontSize: 14, fontWeight: 700, color: N, margin: 0 }}>Upcoming Meetings</h2>
            </div>
            <div style={{ padding: '32px 20px', textAlign: 'center' }}>
              <CalendarDays size={28} color="#D1D5DB" style={{ marginBottom: 10 }} />
              <p style={{ fontSize: 13, color: '#9CA3AF', margin: '0 0 14px', fontWeight: 500 }}>Calendar integration coming soon</p>
              <Link href="/dashboard/calendar" style={{ fontSize: 12, color: G, textDecoration: 'none', fontWeight: 700 }}>
                View Calendar →
              </Link>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckSquare size={15} color={G} />
                <h2 style={{ fontSize: 14, fontWeight: 700, color: N, margin: 0 }}>Today's Tasks</h2>
              </div>
              <Link href="/dashboard/workspace" style={{ width: 26, height: 26, borderRadius: 6, background: `${G}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Plus size={14} color={G} />
              </Link>
            </div>
            {todaysTasks.length > 0 ? (
              <div>
                {todaysTasks.map((task, i) => (
                  <div
                    key={task.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                      padding: '11px 16px',
                      borderTop: i > 0 ? '1px solid #F3F4F6' : 'none',
                    }}
                  >
                    <div style={{ width: 16, height: 16, borderRadius: 4, border: '2px solid #D1D5DB', flexShrink: 0, marginTop: 1 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: N, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {task.title}
                      </p>
                      <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0 }}>
                        {task.category}{task.player ? ` · ${task.player.fullName}` : ''}
                      </p>
                    </div>
                    <span style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: 20,
                      background: task.priority === 'HIGH' ? '#FEF2F2' : task.priority === 'MEDIUM' ? '#FFFBEB' : '#F3F4F6',
                      color: task.priority === 'HIGH' ? '#EF4444' : task.priority === 'MEDIUM' ? '#D97706' : '#6B7280',
                      flexShrink: 0,
                    }}>
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '28px 16px', textAlign: 'center' }}>
                <CheckSquare size={24} color="#D1D5DB" style={{ marginBottom: 8 }} />
                <p style={{ fontSize: 12, color: '#9CA3AF', margin: '0 0 12px', fontWeight: 500 }}>No tasks today</p>
                <Link href="/dashboard/workspace" style={{ fontSize: 12, color: G, textDecoration: 'none', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <Plus size={12} /> Add task
                </Link>
              </div>
            )}
          </div>

          <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Clock size={15} color="#EF4444" />
              <h2 style={{ fontSize: 14, fontWeight: 700, color: N, margin: 0 }}>Contract Alerts</h2>
              {contractAlerts.length > 0 && (
                <span style={{ fontSize: 10, background: '#FEF2F2', color: '#EF4444', fontWeight: 800, padding: '2px 7px', borderRadius: 20 }}>
                  {contractAlerts.length}
                </span>
              )}
            </div>
            {contractAlerts.length > 0 ? (
              <div>
                {contractAlerts.map((player, i) => {
                  const days = daysUntil(player.contractExpiry)
                  const color = days <= 7 ? '#EF4444' : days <= 14 ? '#D97706' : G
                  return (
                    <Link key={player.id} href={`/dashboard/players/${player.id}`} style={{ textDecoration: 'none' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '11px 16px',
                        borderTop: i > 0 ? '1px solid #F3F4F6' : 'none',
                      }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 13, fontWeight: 700, color: N, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {player.fullName}
                          </p>
                          <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0 }}>{player.currentClub ?? '—'}</p>
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color, flexShrink: 0 }}>
                          {days <= 0 ? 'Expired' : `${days}d`}
                        </span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div style={{ padding: '28px 16px', textAlign: 'center' }}>
                <Clock size={24} color="#D1D5DB" style={{ marginBottom: 8 }} />
                <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0, fontWeight: 500 }}>No urgent contract alerts</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 14, padding: '18px 20px' }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 14px' }}>
          Quick Actions
        </p>
        <div className="db-quick-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {quickActions.map(({ label, href, icon: Icon }) => (
            <Link key={href} href={href} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', transition: 'border-color 0.15s' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: `${G}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={15} color={G} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: N }}>{label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  )
}
