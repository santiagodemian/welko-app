'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useClerk, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import {
  LayoutDashboard, Users, GitBranch,
  Settings2, LogOut, Menu, X, Trophy, ArrowUpRight,
  Building2, Eye, MessageSquare, CheckSquare,
  BarChart2, Bot, Shield, Plug, Search, Target,
} from 'lucide-react'
import { useState } from 'react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

type Plan = 'scout' | 'premium'

const NAV_ITEMS = [
  { label: 'Dashboard',        href: '/dashboard',                  icon: LayoutDashboard, plan: 'scout'   as Plan },
  { label: 'Players',          href: '/dashboard/players',          icon: Users,           plan: 'scout'   as Plan },
  { label: 'Mandates AI',      href: '/dashboard/mandates',         icon: Bot,             plan: 'scout'   as Plan },
  { label: 'Pipeline',         href: '/dashboard/pipeline',         icon: GitBranch,       plan: 'scout'   as Plan },
  { label: 'Commissions',      href: '/dashboard/commissions',      icon: BarChart2,       plan: 'scout'   as Plan },
  { label: 'Outreach',         href: '/dashboard/outreach',         icon: Target,          plan: 'scout'   as Plan },
  { label: 'Clubs',            href: '/dashboard/clubs',            icon: Building2,       plan: 'scout'   as Plan },
  { label: 'Tasks',            href: '/dashboard/tasks',            icon: CheckSquare,     plan: 'scout'   as Plan },
  { label: 'Communications',   href: '/dashboard/communications',   icon: MessageSquare,   plan: 'scout'   as Plan },
  { label: 'Scouting',         href: '/dashboard/scouting',         icon: Eye,             plan: 'premium' as Plan },
  { label: 'Agent Search',     href: '/dashboard/search',           icon: Search,          plan: 'premium' as Plan },
  { label: 'Reports',          href: '/dashboard/reports',          icon: BarChart2,       plan: 'premium' as Plan },
  { label: 'Automatizaciones', href: '/dashboard/ai-agents',        icon: Bot,             plan: 'premium' as Plan },
  { label: 'Integrations',     href: '/dashboard/integrations',     icon: Plug,            plan: 'premium' as Plan },
]

export function Sidebar({
  plan,
  agencyName,
  logoUrl,
  isSuperAdmin,
}: {
  plan: Plan
  agencyName?: string | null
  logoUrl?: string | null
  isSuperAdmin?: boolean
}) {
  const pathname  = usePathname()
  const { signOut } = useClerk()
  const { user }  = useUser()
  const router    = useRouter()
  const [open, setOpen] = useState(false)

  const isPremium = plan === 'premium'

  function isActive(href: string) {
    return href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href)
  }

  const displayName =
    user?.firstName
      ? `${user.firstName} ${user.lastName ?? ''}`.trim()
      : (user?.emailAddresses?.[0]?.emailAddress ?? '')

  const initial =
    user?.firstName?.[0] ??
    user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() ??
    '?'

  const inner = (
    <div className="flex flex-col h-full" style={{ background: '#0A1628', borderRight: '1px solid rgba(255,255,255,0.06)' }}>

      {/* Agency brand header */}
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', minHeight: 64 }}>
        <div className="flex items-center gap-2.5 min-w-0">
          {logoUrl ? (
            <img src={logoUrl} alt={agencyName ?? 'Agency'} style={{ width: 32, height: 32, borderRadius: 8, objectFit: 'contain', flexShrink: 0, border: '1px solid rgba(255,255,255,0.12)' }} />
          ) : (
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#1E6FEB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Trophy size={16} color="#fff" />
            </div>
          )}
          <div className="min-w-0">
            <p style={{ fontSize: 13, fontWeight: 800, letterSpacing: '-0.02em', color: '#fff', fontFamily: 'var(--font-montserrat), sans-serif', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 130 }}>
              {agencyName ?? 'My Agency'}
            </p>
            <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', margin: 0, fontWeight: 500, letterSpacing: '0.02em' }}>
              Powered by Welko AgentOS
            </p>
          </div>
        </div>
        <button className="lg:hidden" onClick={() => setOpen(false)} style={{ color: 'rgba(255,255,255,0.5)', flexShrink: 0 }}>
          <X size={18} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-0.5">
        {NAV_ITEMS.map((item) => {
          const locked  = item.plan === 'premium' && !isPremium
          const active  = isActive(item.href)

          if (locked) {
            return (
              <Link
                key={item.href}
                href="/pricing"
                className="flex items-center gap-3 px-3 py-2 rounded-lg"
                style={{ opacity: 0.4, color: 'rgba(255,255,255,0.6)' }}
                title="Requires Premium plan"
              >
                <item.icon size={16} />
                <span style={{ fontSize: 13, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</span>
                <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 6px', borderRadius: 4, background: 'rgba(30,111,235,0.3)', color: '#60A5FA', letterSpacing: '0.04em' }}>PRO</span>
              </Link>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-150"
              style={
                active
                  ? { background: 'rgba(30,111,235,0.18)', color: '#fff', fontWeight: 600 }
                  : { color: 'rgba(255,255,255,0.55)' }
              }
              onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)' }}
              onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
            >
              <item.icon size={16} color={active ? '#60A5FA' : undefined} strokeWidth={active ? 2.5 : 1.75} />
              <span style={{ fontSize: 13, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</span>
              {active && <div className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#1E6FEB' }} />}
            </Link>
          )
        })}

        {/* SuperAdmin link */}
        {isSuperAdmin && (
          <Link
            href="/superadmin"
            className="flex items-center gap-3 px-3 py-2 rounded-lg"
            style={{ color: '#60A5FA', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12, marginTop: 8 }}
          >
            <Trophy size={16} />
            <span style={{ fontSize: 13 }}>Founder Dashboard</span>
          </Link>
        )}
      </nav>

      {/* Upgrade CTA — visible only on Scout (free) plan */}
      {!isPremium && (
        <div className="px-3 pb-2">
          <Link
            href="/pricing"
            className="flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #1E6FEB, #3B82F6)',
              color: '#fff', padding: '10px 16px', borderRadius: 10,
              fontWeight: 800, fontSize: 11, textDecoration: 'none',
              textTransform: 'uppercase', letterSpacing: '0.06em',
              fontFamily: 'var(--font-montserrat), sans-serif',
            }}
          >
            <ArrowUpRight size={13} />
            Upgrade to Premium
          </Link>
        </div>
      )}

      {/* Footer */}
      <div className="px-4 py-3 flex flex-col gap-2.5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={isPremium
              ? { background: 'rgba(30,111,235,0.25)', color: '#60A5FA' }
              : { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }
            }>
            {isPremium ? 'AgentOS Premium' : 'Scout — Free'}
          </span>
          {!isPremium && (
            <Link href="/pricing" className="text-xs" style={{ color: '#60A5FA' }}>
              Upgrade →
            </Link>
          )}
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{ background: 'rgba(30,111,235,0.25)', color: '#60A5FA' }}>
            {initial}
          </div>
          <p className="text-xs font-medium flex-1 min-w-0 truncate" style={{ color: 'rgba(255,255,255,0.7)' }}>
            {displayName}
          </p>
          <Link
            href="/dashboard/settings"
            title="Settings"
            style={{ color: isActive('/dashboard/settings') ? '#60A5FA' : 'rgba(255,255,255,0.4)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.8)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = isActive('/dashboard/settings') ? '#60A5FA' : 'rgba(255,255,255,0.4)' }}
          >
            <Settings2 size={15} />
          </Link>
          <button
            onClick={() => signOut(() => router.push('/'))}
            title="Sign out"
            style={{ color: 'rgba(255,255,255,0.4)' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.8)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)')}
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <aside className="hidden lg:block w-[240px] flex-shrink-0 h-screen sticky top-0">
        {inner}
      </aside>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-9 h-9 rounded-xl flex items-center justify-center"
        style={{ background: '#0A1628', color: '#1E6FEB' }}
      >
        <Menu size={16} />
      </button>
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="relative z-10 w-[240px]">{inner}</aside>
        </div>
      )}
    </>
  )
}
