import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { isAdminUser } from '@/lib/is-admin'
import Link from 'next/link'
import {
  TrendingUp, Target, Clock, AlertTriangle, Sparkles, CheckSquare,
  ArrowRight, Plus, Users, GitBranch, Building2, FileSearch,
  Bot, Shield, CalendarDays, Zap, Star,
} from 'lucide-react'
import { AISightBox } from './AISightBox'
import { getTransferWindowState } from '@/lib/transfer-windows'

const N = '#0A0A0A'
const G = '#2563EB'

// ─── Types ────────────────────────────────────────────────────────────────────

interface NegotiationPlayer { fullName: string; position: string | null; currentClub: string | null }
interface ActiveDeal {
  id: string; targetClub: string | null; estimatedDealValue: number | null
  positionIndex: number; updatedAt: Date; stageMovedAt: Date | null
  player: NegotiationPlayer
  pipeline: { name: string }
}
interface TodayTask {
  id: string; title: string; priority: string; category: string
  isCompleted: boolean
  player: { fullName: string } | null
}
interface ContractAlert {
  id: string; fullName: string; contractExpiry: Date | null
  currentClub: string | null; position: string | null
}
interface FocusItem {
  type: 'contract' | 'deal' | 'task' | 'mandate'
  urgency: 'critical' | 'high' | 'normal'
  label: string
  sub: string
  href: string
}
interface Overview {
  member: { fullName: string; agencyId: string; agency: { name: string; subscription: { planType: string } | null } }
  portfolioValue: number; pipelineRevenue: number; successRate: number
  expiringCount: number; totalNegotiations: number; completedDeals: number
  activeDeals: ActiveDeal[]; todaysTasks: TodayTask[]; contractAlerts: ContractAlert[]
  openMandatesCount: number
  focusItems: FocusItem[]
}

// ─── Data ─────────────────────────────────────────────────────────────────────

async function getOverview(userId: string): Promise<Overview | null> {
  try {
    const member = await db.agencyMember.findUnique({
      where: { clerkUserId: userId },
      include: { agency: { include: { subscription: true } } },
    })
    if (!member) return null

    const now = new Date()
    const in90Days  = new Date(now.getTime() + 90  * 86_400_000)
    const in30Days  = new Date(now.getTime() + 30  * 86_400_000)
    const todayStart    = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const tomorrowStart = new Date(todayStart.getTime() + 86_400_000)

    const [
      portfolioAgg, pipelineAgg, totalNegotiations, completedDeals,
      expiringCount, activeDeals, todaysTasks, contractAlerts, openMandatesCount,
    ] = await Promise.all([
      db.playerProfile.aggregate({
        _sum: { marketValue: true },
        where: { agencyId: member.agencyId, marketValue: { not: null } },
      }),
      db.playerNegotiation.aggregate({
        _sum: { estimatedDealValue: true },
        where: { pipeline: { agencyId: member.agencyId } },
      }),
      db.playerNegotiation.count({ where: { pipeline: { agencyId: member.agencyId } } }),
      db.playerNegotiation.count({
        where: { pipeline: { agencyId: member.agencyId }, contractClosedAt: { not: null } },
      }),
      db.playerProfile.count({
        where: { agencyId: member.agencyId, contractExpiry: { lte: in90Days, not: null } },
      }),
      db.playerNegotiation.findMany({
        where: { pipeline: { agencyId: member.agencyId } },
        orderBy: { updatedAt: 'desc' },
        take: 6,
        select: {
          id: true, targetClub: true, estimatedDealValue: true,
          positionIndex: true, updatedAt: true, stageMovedAt: true,
          player: { select: { fullName: true, position: true, currentClub: true } },
          pipeline: { select: { name: true } },
        },
      }),
      db.task.findMany({
        where: {
          agencyId: member.agencyId,
          dueDate: { gte: todayStart, lt: tomorrowStart },
          isCompleted: false,
        },
        take: 8,
        select: { id: true, title: true, priority: true, category: true, isCompleted: true, player: { select: { fullName: true } } },
      }),
      db.playerProfile.findMany({
        where: { agencyId: member.agencyId, contractExpiry: { lte: in30Days, not: null } },
        take: 5,
        select: { id: true, fullName: true, contractExpiry: true, currentClub: true, position: true },
      }),
      db.clubRequest.count({ where: { agencyId: member.agencyId, status: 'OPEN' } }).catch(() => 0),
    ])

    const portfolioValue   = portfolioAgg._sum.marketValue ?? 0
    const pipelineRevenue  = pipelineAgg._sum.estimatedDealValue ?? 0
    const successRate      = totalNegotiations > 0 ? Math.round((completedDeals / totalNegotiations) * 100) : 0

    // Build prioritised "Today's Focus" items (max 4, ranked by urgency)
    const focusItems: FocusItem[] = []

    // 1. Urgent contract expirations (≤ 14 days)
    contractAlerts.slice(0, 2).forEach(p => {
      const days = daysUntil(p.contractExpiry)
      focusItems.push({
        type: 'contract', urgency: days <= 7 ? 'critical' : 'high',
        label: `${p.fullName}'s contract expires in ${days} day${days === 1 ? '' : 's'}`,
        sub: `${p.position ?? 'Player'} · ${p.currentClub ?? 'Free agent'} — initiate renewal or transfer now`,
        href: `/dashboard/players`,
      })
    })

    // 2. Stalled deals (> 14 days without movement)
    activeDeals.forEach(d => {
      const staleDays = daysSince(d.stageMovedAt ?? d.updatedAt)
      if (staleDays >= 14 && focusItems.length < 4) {
        focusItems.push({
          type: 'deal', urgency: staleDays >= 30 ? 'critical' : 'high',
          label: `${d.player.fullName} — deal stalled for ${staleDays} days`,
          sub: `${stageLabel(d.pipeline.name)}${d.targetClub ? ` · ${d.targetClub}` : ''} — follow up required`,
          href: '/dashboard/pipeline',
        })
      }
    })

    // 3. High-priority tasks today
    todaysTasks.filter(t => t.priority === 'HIGH').slice(0, 2).forEach(t => {
      if (focusItems.length < 4) {
        focusItems.push({
          type: 'task', urgency: 'high',
          label: t.title,
          sub: `${t.category}${t.player ? ` · ${t.player.fullName}` : ''} — due today`,
          href: '/dashboard/workspace',
        })
      }
    })

    // 4. Fill with medium tasks / mandate prompt if still under 3 items
    if (focusItems.length === 0 && todaysTasks.length === 0 && totalNegotiations === 0) {
      focusItems.push({
        type: 'mandate', urgency: 'normal',
        label: 'Add your first player to the pipeline',
        sub: 'Start by creating a player profile and moving them into active negotiations',
        href: '/dashboard/players',
      })
    }

    return {
      member, portfolioValue, pipelineRevenue, successRate,
      expiringCount, totalNegotiations, completedDeals,
      activeDeals, todaysTasks, contractAlerts, openMandatesCount,
      focusItems,
    }
  } catch {
    return null
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `€${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000)     return `€${Math.round(value / 1_000)}K`
  return `€${Math.round(value)}`
}

function stageBadgeColor(name: string): { bg: string; color: string } {
  switch (name) {
    case 'INITIAL_CONTACT':  return { bg: '#EFF6FF', color: '#3B82F6' }
    case 'PROPOSAL_SENT':    return { bg: '#F5F3FF', color: '#7C3AED' }
    case 'FINANCIAL_TALKS':  return { bg: '#FFFBEB', color: '#D97706' }
    case 'CONTRACT_CLOSURE': return { bg: '#ECFDF5', color: '#059669' }
    default: return { bg: '#F3F4F6', color: '#6B7280' }
  }
}

function stageProbability(name: string): number {
  switch (name) {
    case 'INITIAL_CONTACT':  return 10
    case 'PROPOSAL_SENT':    return 30
    case 'FINANCIAL_TALKS':  return 65
    case 'CONTRACT_CLOSURE': return 90
    default: return 0
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
  return Math.ceil((new Date(date).getTime() - Date.now()) / 86_400_000)
}

function daysSince(date: Date | null): number {
  if (!date) return 0
  return Math.ceil((Date.now() - new Date(date).getTime()) / 86_400_000)
}

function urgencyDot(u: FocusItem['urgency']): string {
  if (u === 'critical') return '#EF4444'
  if (u === 'high')     return '#F59E0B'
  return '#2563EB'
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) return null

  const data = await getOverview(userId)
  const win  = getTransferWindowState()

  if (!data) {
    return (
      <div style={{ padding: 48, fontFamily: 'var(--font-montserrat), sans-serif' }}>
        <div style={{
          background: 'white', border: '1px solid #E5E7EB', borderRadius: 16,
          padding: 48, textAlign: 'center', maxWidth: 480, margin: '0 auto',
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14, background: '#EFF6FF',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
          }}>
            <Shield size={24} color={G} />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: N, margin: '0 0 8px' }}>Welcome to Polaris</h2>
          <p style={{ color: '#6B7280', margin: '0 0 24px', lineHeight: 1.6 }}>Complete your agency setup to get started.</p>
          <Link href="/onboarding" style={{
            background: N, color: 'white', padding: '12px 28px',
            borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 14,
          }}>
            Set up Agency →
          </Link>
        </div>
      </div>
    )
  }

  const { member, portfolioValue, pipelineRevenue, successRate, expiringCount,
    totalNegotiations, activeDeals, todaysTasks, contractAlerts, focusItems } = data

  const isPremium = (await isAdminUser(userId)) || member.agency.subscription?.planType !== 'FREE'
  const firstName = member.fullName.split(' ')[0]
  const hour      = new Date().getHours()
  const greeting  = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  const winUrgent    = win.urgency === 'open-critical' || win.urgency === 'approaching'
  const winBg        = win.isOpen ? (win.urgency === 'open-critical' ? '#FEF2F2' : '#ECFDF5') : winUrgent ? '#FFFBEB' : '#F9FAFB'
  const winColor     = win.isOpen ? (win.urgency === 'open-critical' ? '#DC2626' : '#059669') : winUrgent ? '#D97706' : '#6B7280'
  const winDot       = win.isOpen ? (win.urgency === 'open-critical' ? '#EF4444' : '#059669') : winUrgent ? '#F59E0B' : '#9CA3AF'

  return (
    <div style={{ fontFamily: 'var(--font-montserrat), sans-serif', maxWidth: 1200, paddingBottom: 48 }}>
      <style>{`
        @media (max-width: 640px) {
          .db-kpi-grid  { grid-template-columns: repeat(2,1fr) !important; gap: 10px !important; }
          .db-body-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
        }
        @media (max-width: 900px) {
          .db-body-grid { grid-template-columns: 1fr !important; }
        }
        .db-card-link:hover .db-kpi { border-color: ${G} !important; box-shadow: 0 4px 14px rgba(37,99,235,0.1) !important; }
        .db-kpi { transition: border-color 0.15s, box-shadow 0.15s; }
        .db-deal-row:hover { background: #F9FAFB; }
        .db-task-row:hover { background: #F9FAFB; }
        .db-focus-row:hover { background: #F5F8FF; }
        .db-qa:hover { border-color: ${G} !important; background: #EFF6FF !important; }
        .db-qa { transition: border-color 0.15s, background 0.15s; }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{
        margin: '0 0 0', padding: 'clamp(20px,4vw,28px) clamp(20px,4vw,40px)',
        background: N, position: 'relative', overflow: 'hidden',
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/diseño8.jpeg" alt="" aria-hidden="true" style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'center', opacity: 0.1,
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(5,5,5,0.97) 40%, rgba(5,5,5,0.7))' }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/polariswhitelogo.jpeg" alt="Polaris" style={{ height: 18, objectFit: 'contain', opacity: 0.5 }} />
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Agent Dashboard
              </span>
            </div>
            <h1 style={{
              fontSize: 'clamp(20px,3vw,26px)', fontWeight: 700, color: '#fff',
              margin: '0 0 3px', letterSpacing: '-0.03em',
              fontFamily: 'var(--font-space-grotesk), sans-serif',
            }}>
              {greeting}, {firstName}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.35)', margin: 0, fontSize: 13 }}>
              {member.agency.name}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, flexWrap: 'wrap' }}>
            {/* Transfer Window Pill */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 14px', borderRadius: 8,
              background: win.isOpen ? 'rgba(5,150,105,0.15)' : winUrgent ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.06)',
              border: `1px solid ${win.isOpen ? 'rgba(5,150,105,0.3)' : winUrgent ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.1)'}`,
            }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: winDot, flexShrink: 0 }} />
              <span style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
                color: win.isOpen ? '#34D399' : winUrgent ? '#FCD34D' : 'rgba(255,255,255,0.4)',
              }}>
                {win.label}
              </span>
            </div>

            {/* Plan badge */}
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
              padding: '6px 12px', borderRadius: 6,
              background: isPremium ? 'rgba(37,99,235,0.2)' : 'rgba(255,255,255,0.06)',
              color: isPremium ? '#93C5FD' : 'rgba(255,255,255,0.3)',
              border: `1px solid ${isPremium ? 'rgba(37,99,235,0.4)' : 'rgba(255,255,255,0.1)'}`,
            }}>
              {isPremium ? 'Polaris Premium' : 'Scout Plan'}
            </span>
          </div>
        </div>
      </div>

      <div style={{ padding: '24px clamp(20px,4vw,40px) 0' }}>

        {/* ── TODAY'S FOCUS ── */}
        {focusItems.length > 0 && (
          <div style={{ marginBottom: 24, borderRadius: 14, border: '1.5px solid #E5E7EB', overflow: 'hidden', background: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ padding: '13px 20px', borderBottom: '1px solid #E5E7EB', background: '#FAFAFA', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Zap size={14} color={G} />
              <span style={{ fontSize: 13, fontWeight: 700, color: N }}>{"Today's Focus"}</span>
              <span style={{
                fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 20,
                background: `${G}15`, color: G, marginLeft: 2,
              }}>
                {focusItems.length}
              </span>
              <span style={{ fontSize: 11, color: '#9CA3AF', marginLeft: 'auto' }}>
                Ranked by urgency
              </span>
            </div>
            {focusItems.map((item, i) => (
              <Link key={i} href={item.href} className="db-focus-row" style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '13px 20px',
                borderTop: i > 0 ? '1px solid #F3F4F6' : 'none', textDecoration: 'none',
                transition: 'background 0.12s',
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                  background: urgencyDot(item.urgency),
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: N, margin: '0 0 2px', lineHeight: 1.3 }}>{item.label}</p>
                  <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0 }}>{item.sub}</p>
                </div>
                <ArrowRight size={12} color="#D1D5DB" style={{ flexShrink: 0 }} />
              </Link>
            ))}
          </div>
        )}

        {/* ── KPI CARDS ── */}
        <div className="db-kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
          {[
            {
              label: 'Portfolio Value', value: formatCurrency(portfolioValue),
              icon: TrendingUp, iconBg: `${G}15`, iconColor: G, href: '/dashboard/players',
              sub: 'Combined market value',
            },
            {
              label: 'Pipeline Revenue', value: formatCurrency(pipelineRevenue),
              icon: Target, iconBg: '#05966915', iconColor: '#059669', href: '/dashboard/pipeline',
              sub: 'Est. deal value in pipeline',
            },
            {
              label: 'Close Rate', value: `${successRate}%`,
              icon: Sparkles, iconBg: '#7C3AED15', iconColor: '#7C3AED', href: '/dashboard/pipeline',
              sub: totalNegotiations > 0 ? `${totalNegotiations} total negotiations` : 'No deals yet',
            },
            {
              label: 'Expiring (90d)', value: String(expiringCount),
              icon: AlertTriangle,
              iconBg: expiringCount > 0 ? '#EF444415' : '#F3F4F6',
              iconColor: expiringCount > 0 ? '#EF4444' : '#9CA3AF',
              href: '/dashboard/players',
              sub: expiringCount > 0 ? 'Contracts need attention' : 'All contracts clear',
              valueColor: expiringCount > 0 ? '#EF4444' : N,
            },
          ].map(({ label, value, icon: Icon, iconBg, iconColor, href, sub, valueColor }) => (
            <Link key={label} href={href} className="db-card-link" style={{ textDecoration: 'none' }}>
              <div className="db-kpi" style={{
                background: 'white', border: '1.5px solid #E5E7EB', borderRadius: 14,
                padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={15} color={iconColor} />
                  </div>
                  <ArrowRight size={12} color="#D1D5DB" />
                </div>
                <p style={{
                  fontSize: 'clamp(22px,2.5vw,28px)', fontWeight: 800,
                  color: valueColor ?? N, margin: '0 0 3px',
                  letterSpacing: '-0.04em', lineHeight: 1,
                  fontFamily: 'var(--font-space-grotesk), sans-serif',
                }}>
                  {value}
                </p>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', margin: '0 0 2px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</p>
                <p style={{ fontSize: 10, color: '#C1C8D4', margin: 0 }}>{sub}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* ── BODY GRID ── */}
        <div className="db-body-grid" style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 20, marginBottom: 24 }}>

          {/* Left col */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* AI Sight Box */}
            <AISightBox />

            {/* Active Deals */}
            <div style={{ background: 'white', border: '1.5px solid #E5E7EB', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ padding: '13px 20px', borderBottom: '1px solid #E5E7EB', background: '#FAFAFA', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <GitBranch size={14} color={G} />
                  <h2 style={{ fontSize: 13, fontWeight: 700, color: N, margin: 0 }}>Active Deals</h2>
                  {activeDeals.length > 0 && (
                    <span style={{ fontSize: 10, background: `${G}15`, color: G, fontWeight: 700, padding: '2px 7px', borderRadius: 20 }}>
                      {activeDeals.length}
                    </span>
                  )}
                </div>
                <Link href="/dashboard/pipeline" style={{ fontSize: 11, color: G, textDecoration: 'none', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Pipeline <ArrowRight size={11} />
                </Link>
              </div>
              {activeDeals.length > 0 ? (
                <div>
                  {activeDeals.map((deal, i) => {
                    const badge = stageBadgeColor(deal.pipeline.name)
                    const prob  = stageProbability(deal.pipeline.name)
                    const stale = daysSince(deal.stageMovedAt ?? deal.updatedAt)
                    const staleBg    = stale >= 30 ? '#FEF2F2' : stale >= 14 ? '#FFFBEB' : 'transparent'
                    const staleColor = stale >= 30 ? '#EF4444'  : stale >= 14 ? '#D97706'  : '#9CA3AF'
                    const initials   = deal.player.fullName.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()
                    return (
                      <div key={deal.id} className="db-deal-row" style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '11px 20px', borderTop: i > 0 ? '1px solid #F3F4F6' : 'none',
                        transition: 'background 0.1s',
                      }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                          background: `linear-gradient(135deg, ${N} 0%, #2A2A2A 100%)`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <span style={{ fontSize: 10, fontWeight: 800, color: G }}>{initials}</span>
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                          {/* Probability chip */}
                          <span style={{
                            fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 6,
                            background: `${badge.color}15`, color: badge.color,
                          }}>
                            {prob}%
                          </span>
                          {/* Stage */}
                          <span style={{
                            fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20,
                            background: badge.bg, color: badge.color, letterSpacing: '0.03em',
                          }}>
                            {stageLabel(deal.pipeline.name).replace(' ', ' ')}
                          </span>
                          {/* Stale indicator */}
                          {stale >= 14 && (
                            <span style={{
                              fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 20,
                              background: staleBg, color: staleColor,
                            }}>
                              {stale}d
                            </span>
                          )}
                          {/* Commission forecast */}
                          {deal.estimatedDealValue != null && (
                            <span style={{ fontSize: 12, fontWeight: 700, color: '#059669' }}>
                              {formatCurrency(deal.estimatedDealValue * 0.05)}
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div style={{ padding: '28px 20px', textAlign: 'center' }}>
                  <GitBranch size={24} color="#D1D5DB" style={{ marginBottom: 8, display: 'block', margin: '0 auto 8px' }} />
                  <p style={{ fontSize: 13, color: '#9CA3AF', margin: '0 0 12px', fontWeight: 500 }}>No active deals</p>
                  <Link href="/dashboard/pipeline" style={{ fontSize: 12, color: G, textDecoration: 'none', fontWeight: 700 }}>
                    Open Pipeline →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right col */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* Today's Tasks */}
            <div style={{ background: 'white', border: '1.5px solid #E5E7EB', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ padding: '13px 20px', borderBottom: '1px solid #E5E7EB', background: '#FAFAFA', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckSquare size={14} color={G} />
                  <h2 style={{ fontSize: 13, fontWeight: 700, color: N, margin: 0 }}>{"Today's Tasks"}</h2>
                </div>
                <Link href="/dashboard/workspace" style={{
                  width: 24, height: 24, borderRadius: 6, background: `${G}15`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none',
                }}>
                  <Plus size={12} color={G} />
                </Link>
              </div>
              {todaysTasks.length > 0 ? (
                <div>
                  {todaysTasks.map((task, i) => (
                    <div key={task.id} className="db-task-row" style={{
                      display: 'flex', alignItems: 'flex-start', gap: 10,
                      padding: '10px 16px', borderTop: i > 0 ? '1px solid #F3F4F6' : 'none',
                      transition: 'background 0.1s',
                    }}>
                      <div style={{ width: 15, height: 15, borderRadius: 4, border: '1.5px solid #D1D5DB', flexShrink: 0, marginTop: 2 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: N, margin: '0 0 1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {task.title}
                        </p>
                        <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0 }}>
                          {task.category}{task.player ? ` · ${task.player.fullName}` : ''}
                        </p>
                      </div>
                      <span style={{
                        fontSize: 9, fontWeight: 800, padding: '2px 6px', borderRadius: 20, flexShrink: 0, letterSpacing: '0.05em', textTransform: 'uppercase',
                        background: task.priority === 'HIGH' ? '#FEF2F2' : task.priority === 'MEDIUM' ? '#FFFBEB' : '#F3F4F6',
                        color: task.priority === 'HIGH' ? '#EF4444' : task.priority === 'MEDIUM' ? '#D97706' : '#6B7280',
                      }}>
                        {task.priority}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '24px 16px', textAlign: 'center' }}>
                  <CheckSquare size={20} color="#D1D5DB" style={{ marginBottom: 8, display: 'block', margin: '0 auto 8px' }} />
                  <p style={{ fontSize: 12, color: '#9CA3AF', margin: '0 0 10px', fontWeight: 500 }}>No tasks today</p>
                  <Link href="/dashboard/workspace" style={{ fontSize: 12, color: G, textDecoration: 'none', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Plus size={12} /> Add task
                  </Link>
                </div>
              )}
            </div>

            {/* Contract Alerts */}
            <div style={{ background: 'white', border: `1.5px solid ${contractAlerts.length > 0 ? '#FCA5A5' : '#E5E7EB'}`, borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{
                padding: '13px 20px', borderBottom: `1px solid ${contractAlerts.length > 0 ? '#FCA5A5' : '#E5E7EB'}`,
                background: contractAlerts.length > 0 ? '#FFF5F5' : '#FAFAFA',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <Clock size={14} color={contractAlerts.length > 0 ? '#EF4444' : '#9CA3AF'} />
                <h2 style={{ fontSize: 13, fontWeight: 700, color: N, margin: 0 }}>Contract Alerts</h2>
                {contractAlerts.length > 0 && (
                  <span style={{ fontSize: 10, background: '#FEF2F2', color: '#EF4444', fontWeight: 800, padding: '2px 7px', borderRadius: 20 }}>
                    {contractAlerts.length}
                  </span>
                )}
              </div>
              {contractAlerts.length > 0 ? (
                <div>
                  {contractAlerts.map((player, i) => {
                    const days  = daysUntil(player.contractExpiry)
                    const color = days <= 7 ? '#EF4444' : days <= 14 ? '#D97706' : G
                    return (
                      <Link key={player.id} href={`/dashboard/players/${player.id}`} style={{ textDecoration: 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderTop: i > 0 ? '1px solid #F3F4F6' : 'none' }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: 13, fontWeight: 700, color: N, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {player.fullName}
                            </p>
                            <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0 }}>
                              {player.currentClub ?? '—'}{player.position ? ` · ${player.position}` : ''}
                            </p>
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 800, color, flexShrink: 0, minWidth: 30, textAlign: 'right' }}>
                            {days <= 0 ? 'Expired' : `${days}d`}
                          </span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              ) : (
                <div style={{ padding: '20px 16px', textAlign: 'center' }}>
                  <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0, fontWeight: 500 }}>No urgent expirations</p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div style={{ background: 'white', border: '1.5px solid #E5E7EB', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ padding: '13px 20px', borderBottom: '1px solid #E5E7EB', background: '#FAFAFA' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                  Quick Access
                </p>
              </div>
              <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {[
                  { label: 'Players',   href: '/dashboard/players',   icon: Users },
                  { label: 'Pipeline',  href: '/dashboard/pipeline',  icon: GitBranch },
                  { label: 'Mandates',  href: '/dashboard/mandates',  icon: Star },
                  { label: 'Scouting', href: '/dashboard/scouting',  icon: FileSearch },
                  { label: 'Clubs',    href: '/dashboard/clubs',     icon: Building2 },
                  { label: 'AI Agents',href: '/dashboard/ai-agents', icon: Bot },
                ].map(({ label, href, icon: Icon }) => (
                  <Link key={href} href={href} className="db-qa" style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '8px 12px', borderRadius: 8, textDecoration: 'none',
                    border: '1px solid transparent',
                  }}>
                    <Icon size={14} color="#9CA3AF" />
                    <span style={{ fontSize: 13, fontWeight: 500, color: N }}>{label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
