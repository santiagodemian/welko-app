import { db } from '@/lib/db'
import Link from 'next/link'
import { GrowthChart } from './GrowthChart'
import {
  TrendingUp, Building2, Users, DollarSign,
  CheckCircle2, AlertCircle, XCircle, Clock,
} from 'lucide-react'

// ─── Pricing constants ────────────────────────────────────────────────────────
const MONTHLY_PRICE  = 39
const ANNUAL_MONTHLY = 299 / 12

// ─── Data fetching ────────────────────────────────────────────────────────────

async function getMetrics() {
  try {
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5)
    sixMonthsAgo.setDate(1)
    sixMonthsAgo.setHours(0, 0, 0, 0)

    const [
      agencyCount, totalPlayers,
      subscriptions, recentAgencies,
      allAgencies, affiliateStats,
    ] = await Promise.all([
      db.agency.count(),
      db.playerProfile.count(),
      db.subscription.findMany({ where: { NOT: { planType: 'FREE' } } }),
      db.agency.findMany({
        take: 20,
        orderBy: { createdAt: 'desc' },
        include: { subscription: true },
      }),
      db.agency.findMany({
        where: { createdAt: { gte: sixMonthsAgo } },
        select: { createdAt: true },
      }),
      db.affiliatePartner.aggregate({
        _sum: { totalEarned: true, pendingBalance: true },
        _count: true,
      }),
    ])

    const mrr = subscriptions.reduce((sum, s) => {
      if (s.planType === 'PREMIUM_MONTHLY') return sum + MONTHLY_PRICE
      if (s.planType === 'PREMIUM_ANNUAL')  return sum + ANNUAL_MONTHLY
      return sum
    }, 0)

    const arr = mrr * 12

    // Build 6-month growth buckets
    const buckets: { month: string; date: Date }[] = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date()
      d.setDate(1); d.setHours(0, 0, 0, 0)
      d.setMonth(d.getMonth() - i)
      buckets.push({
        month: d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        date: d,
      })
    }
    const growthData = buckets.map(({ month, date }, i) => {
      const next = i < 5 ? buckets[i + 1].date : new Date()
      const agencies = allAgencies.filter(
        (a) => new Date(a.createdAt) >= date && new Date(a.createdAt) < next,
      ).length
      return { month, agencies }
    })

    const sysConfigs = [
      { name: 'Stripe',          key: 'STRIPE_SECRET_KEY'                   },
      { name: 'OpenAI',          key: 'OPENAI_API_KEY'                      },
      { name: 'Resend (Email)',   key: 'RESEND_API_KEY'                      },
      { name: 'Clerk Auth',      key: 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY'   },
      { name: 'Sportmonks',      key: 'SPORTMONKS_API_KEY'                  },
      { name: 'Stripe Webhook',  key: 'STRIPE_WEBHOOK_SECRET'               },
    ].map((c) => ({ ...c, connected: !!process.env[c.key] }))

    return {
      agencyCount, totalPlayers,
      activeAgencies: subscriptions.length, mrr, arr,
      recentAgencies, growthData, affiliateStats, sysConfigs,
    }
  } catch {
    return {
      agencyCount: 0, totalPlayers: 0, activeAgencies: 0,
      mrr: 0, arr: 0, recentAgencies: [], growthData: [],
      affiliateStats: null, sysConfigs: [],
    }
  }
}

// ─── Constants ────────────────────────────────────────────────────────────────

const N = '#0A1628'
const G = '#1E6FEB'

// ─── Components ───────────────────────────────────────────────────────────────

function KpiCard({
  icon: Icon, label, value, sub, iconColor = G,
}: {
  icon: React.ElementType; label: string; value: string; sub?: string; iconColor?: string
}) {
  return (
    <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 16, padding: '24px 28px' }}>
      <div style={{ width: 36, height: 36, borderRadius: 9, background: `${iconColor}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
        <Icon size={18} color={iconColor} />
      </div>
      <p style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 6px' }}>{label}</p>
      <p style={{ fontSize: 34, fontWeight: 900, color: N, margin: '0 0 4px', letterSpacing: '-0.03em', fontFamily: 'var(--font-montserrat)' }}>{value}</p>
      {sub && <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>{sub}</p>}
    </div>
  )
}

function StatusBadge({ status }: { status: string | undefined | null }) {
  if (!status || status === 'FREE') {
    return <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: '#F3F4F6', color: '#9CA3AF' }}>Free</span>
  }
  const map: Record<string, { bg: string; color: string; label: string }> = {
    ACTIVE:   { bg: 'rgba(5,150,105,0.1)',  color: '#059669', label: 'Active'   },
    PAST_DUE: { bg: 'rgba(239,68,68,0.1)',  color: '#EF4444', label: 'Past Due' },
    CANCELED: { bg: '#F3F4F6',              color: '#9CA3AF', label: 'Canceled' },
    TRIALING: { bg: 'rgba(99,102,241,0.1)', color: '#6366F1', label: 'Trial'    },
  }
  const s = map[status] ?? map['ACTIVE']
  return (
    <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: s.bg, color: s.color }}>
      {s.label}
    </span>
  )
}

function PlanBadge({ planType }: { planType: string | undefined | null }) {
  if (!planType || planType === 'FREE') {
    return <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: '#F3F4F6', color: '#6B7280' }}>Free</span>
  }
  const label = planType === 'PREMIUM_ANNUAL' ? 'Annual' : 'Monthly'
  return (
    <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: `${G}18`, color: G }}>
      Premium · {label}
    </span>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function SuperAdminPage() {
  const m = await getMetrics()

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', fontFamily: 'var(--font-montserrat), sans-serif' }}>

      {/* Header */}
      <div style={{ background: N, padding: '28px 48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1280 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2 }}>
              <span style={{ fontSize: 20 }}>🏆</span>
              <h1 style={{ fontSize: 20, fontWeight: 800, color: 'white', margin: 0, letterSpacing: '-0.03em' }}>
                Polaris Football
              </h1>
              <span style={{ fontSize: 10, background: G, color: '#fff', fontWeight: 800, padding: '2px 10px', borderRadius: 20, letterSpacing: '0.06em' }}>
                FOUNDER
              </span>
            </div>
            <p style={{ color: '#94A3B8', margin: 0, fontSize: 13 }}>Global platform metrics — Santiago&apos;s command center</p>
          </div>
          <Link href="/dashboard" style={{ fontSize: 12, color: '#94A3B8', textDecoration: 'none', fontWeight: 500 }}>
            ← Agency Dashboard
          </Link>
        </div>
      </div>

      <div style={{ padding: '36px 48px', maxWidth: 1280, margin: '0 auto' }}>

        {/* ── KPI Cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 32 }}>
          <KpiCard icon={Building2}   label="Total Agencies"    value={m.agencyCount.toString()}     sub={`${m.activeAgencies} on paid plan`} iconColor="#6366F1" />
          <KpiCard icon={Users}       label="Players in System" value={m.totalPlayers.toLocaleString()} sub="across all agencies"            iconColor="#059669" />
          <KpiCard icon={DollarSign}  label="MRR"               value={`€${m.mrr.toFixed(0)}`}       sub="monthly recurring revenue"        iconColor={G}       />
          <KpiCard icon={TrendingUp}  label="ARR"               value={`€${m.arr.toFixed(0)}`}       sub="annualized run rate"              iconColor={N}       />
        </div>

        {/* ── Main grid: Chart + System Configs ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, marginBottom: 24 }}>

          {/* Growth chart */}
          <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 16, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: N, margin: 0 }}>Agency Growth</h2>
              <span style={{ fontSize: 11, color: '#9CA3AF' }}>New signups · last 6 months</span>
            </div>
            <GrowthChart data={m.growthData} />
          </div>

          {/* System configs */}
          <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 16, padding: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: N, margin: '0 0 16px' }}>System Integrations</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {m.sysConfigs.map((cfg) => (
                <div key={cfg.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 10, background: '#F9FAFB', border: '1px solid #F3F4F6' }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: N }}>{cfg.name}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: cfg.connected ? '#059669' : '#EF4444' }}>
                    {cfg.connected
                      ? <><CheckCircle2 size={13} /> Connected</>
                      : <><AlertCircle   size={13} /> Missing</>}
                  </span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 11, color: '#9CA3AF', margin: '14px 0 0', lineHeight: 1.5 }}>
              Keys are read from environment variables. Set them in Vercel → Settings → Environment Variables.
            </p>
          </div>
        </div>

        {/* ── Agency management table ── */}
        <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 16, overflow: 'hidden', marginBottom: 24 }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: N, margin: 0 }}>All Agencies</h2>
            <span style={{ fontSize: 12, color: '#9CA3AF' }}>{m.agencyCount} registered · showing most recent 20</span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F9FAFB' }}>
                {['Agency', 'Country', 'Plan', 'Status', 'Joined', 'Actions'].map((h) => (
                  <th key={h} style={{ padding: '10px 20px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {m.recentAgencies.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '40px 24px', textAlign: 'center', color: '#9CA3AF', fontSize: 14 }}>
                    No agencies registered yet
                  </td>
                </tr>
              ) : m.recentAgencies.map((agency) => {
                const isPaid = agency.subscription?.planType !== 'FREE' && agency.subscription?.planType != null
                return (
                  <tr key={agency.id} style={{ borderTop: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '13px 20px' }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: N }}>{agency.name}</span>
                    </td>
                    <td style={{ padding: '13px 20px', fontSize: 13, color: '#6B7280' }}>
                      {agency.country ?? '—'}
                    </td>
                    <td style={{ padding: '13px 20px' }}>
                      <PlanBadge planType={agency.subscription?.planType} />
                    </td>
                    <td style={{ padding: '13px 20px' }}>
                      <StatusBadge status={isPaid ? (agency.subscription?.status ?? 'ACTIVE') : null} />
                    </td>
                    <td style={{ padding: '13px 20px', fontSize: 12, color: '#9CA3AF' }}>
                      {new Date(agency.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}
                    </td>
                    <td style={{ padding: '13px 20px' }}>
                      <Link
                        href={`/superadmin/agencies/${agency.id}`}
                        style={{ fontSize: 12, color: G, fontWeight: 600, textDecoration: 'none' }}
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* ── Affiliate + Revenue split ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

          <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 16, padding: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: N, margin: '0 0 16px' }}>Affiliate Program</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: 'Total Affiliates', value: String(m.affiliateStats?._count ?? 0)                                },
                { label: 'Commissions Paid', value: `€${(m.affiliateStats?._sum?.totalEarned  ?? 0).toFixed(0)}`        },
                { label: 'Pending Payouts',  value: `€${(m.affiliateStats?._sum?.pendingBalance ?? 0).toFixed(0)}`, gold: true },
                { label: 'Active Rate',      value: '—'                                                                  },
              ].map(({ label, value, gold }) => (
                <div key={label} style={{ background: gold ? `${G}10` : '#F9FAFB', border: `1px solid ${gold ? G + '33' : '#F3F4F6'}`, borderRadius: 12, padding: '14px 18px' }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: gold ? G : '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 6px' }}>{label}</p>
                  <p style={{ fontSize: 24, fontWeight: 900, color: gold ? G : N, margin: 0, letterSpacing: '-0.02em' }}>{value}</p>
                </div>
              ))}
            </div>
            <Link href="/superadmin/affiliates" style={{ display: 'block', textAlign: 'center', marginTop: 16, padding: '10px', border: `1px solid ${G}`, borderRadius: 10, color: G, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
              Manage Affiliates →
            </Link>
          </div>

          <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 16, padding: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: N, margin: '0 0 16px' }}>Revenue Breakdown</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Premium Monthly subscribers', value: `€${MONTHLY_PRICE}/mo each`,      color: '#6366F1' },
                { label: 'Premium Annual subscribers',  value: `€25/mo each (€299/yr)`,         color: G        },
                { label: 'Scout (Free) agencies',       value: '€0/mo',                         color: '#9CA3AF' },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 10, background: '#F9FAFB' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: '#374151' }}>{label}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color }}>{value}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, borderTop: '1px solid #F3F4F6', paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: '#6B7280' }}>Estimated this month</span>
              <span style={{ fontSize: 20, fontWeight: 900, color: N, letterSpacing: '-0.03em' }}>${m.mrr.toFixed(0)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
