'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useClerk, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import {
  LayoutDashboard, Users, Building2,
  TrendingUp, Eye, FileText,
  MessageSquare, CalendarDays, BarChart2,
  LineChart, Settings2, LogOut, Menu, X,
  HelpCircle, Star,
} from 'lucide-react'
import { useState } from 'react'

type Plan = 'scout' | 'premium'

const NAV_ITEMS = [
  { label: 'Overview',      href: '/dashboard',               icon: LayoutDashboard, plan: 'scout'   as Plan },
  { label: 'Players',       href: '/dashboard/players',       icon: Users,           plan: 'scout'   as Plan },
  { label: 'Clubs',         href: '/dashboard/clubs',         icon: Building2,       plan: 'scout'   as Plan },
  { label: 'Opportunities', href: '/dashboard/pipeline',      icon: TrendingUp,      plan: 'scout'   as Plan },
  { label: 'Scouting',      href: '/dashboard/scouting',      icon: Eye,             plan: 'scout'   as Plan },
  { label: 'Contracts',     href: '/dashboard/workspace',     icon: FileText,        plan: 'scout'   as Plan },
  { label: 'Messages',      href: '/dashboard/outreach',      icon: MessageSquare,   plan: 'scout'   as Plan },
  { label: 'Calendar',      href: '/dashboard/calendar',      icon: CalendarDays,    plan: 'scout'   as Plan },
  { label: 'Reports',       href: '/dashboard/reports',       icon: BarChart2,       plan: 'scout'   as Plan },
  { label: 'Analytics',     href: '/dashboard/commissions',   icon: LineChart,       plan: 'premium' as Plan },
]

const BOTTOM_NAV = [
  { label: 'Settings',      href: '/dashboard/settings',      icon: Settings2 },
  { label: 'Help & Support', href: '/contact',                icon: HelpCircle },
]

const G = '#2563EB'
const BORDER = '#E5E7EB'

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
  const pathname    = usePathname()
  const { signOut } = useClerk()
  const { user }    = useUser()
  const router      = useRouter()
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

  const NavItem = ({ item }: { item: typeof NAV_ITEMS[number] }) => {
    const locked = item.plan === 'premium' && !isPremium
    const active = isActive(item.href)

    if (locked) {
      return (
        <Link
          href="/dashboard"
          title="Upgrade to unlock Analytics"
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 14px', borderRadius: 8,
            color: '#C4C4C4', textDecoration: 'none',
            fontFamily: 'var(--font-montserrat), sans-serif',
          }}
        >
          <item.icon size={15} strokeWidth={1.5} color="#D1D5DB" />
          <span style={{ fontSize: 13, flex: 1, color: '#C4C4C4' }}>{item.label}</span>
          <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 5px', borderRadius: 3, background: '#EFF6FF', color: G, letterSpacing: '0.04em' }}>PRO</span>
        </Link>
      )
    }

    return (
      <Link
        href={item.href}
        onClick={() => setOpen(false)}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '8px 14px', borderRadius: 8,
          background: active ? '#EFF6FF' : 'transparent',
          color: active ? G : '#6B7280',
          textDecoration: 'none',
          fontFamily: 'var(--font-montserrat), sans-serif',
          transition: 'background 0.12s, color 0.12s',
        }}
        onMouseEnter={(e) => { if (!active) { (e.currentTarget as HTMLElement).style.background = '#F9FAFB'; (e.currentTarget as HTMLElement).style.color = '#374151' } }}
        onMouseLeave={(e) => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#6B7280' } }}
      >
        <item.icon size={15} strokeWidth={active ? 2 : 1.5} color={active ? G : undefined} />
        <span style={{ fontSize: 13, fontWeight: active ? 600 : 500, flex: 1 }}>{item.label}</span>
      </Link>
    )
  }

  const inner = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#FFFFFF', borderRight: `1px solid ${BORDER}` }}>

      {/* Logo header */}
      <div style={{ padding: '18px 20px 14px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={agencyName ?? 'Agency'} style={{ height: 30, objectFit: 'contain', maxWidth: 160 }} />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src="/polarispnglogo.jpeg" alt="Polaris Football" style={{ height: 32, objectFit: 'contain', maxWidth: 160 }} />
          )}
          <button className="lg:hidden" onClick={() => setOpen(false)} style={{ color: '#9CA3AF', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Primary navigation */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV_ITEMS.map(item => <NavItem key={item.href} item={item} />)}

        {/* SuperAdmin */}
        {isSuperAdmin && (
          <>
            <div style={{ height: 1, background: BORDER, margin: '6px 4px' }} />
            <Link
              href="/superadmin"
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', borderRadius: 8, color: G, textDecoration: 'none', fontFamily: 'var(--font-montserrat), sans-serif', fontSize: 13 }}
            >
              <Star size={14} strokeWidth={1.5} color={G} />
              Founder Dashboard
            </Link>
          </>
        )}
      </nav>

      {/* Bottom nav (Settings + Help) */}
      <div style={{ padding: '8px 8px 0', borderTop: `1px solid ${BORDER}` }}>
        {BOTTOM_NAV.map(item => {
          const active = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 14px', borderRadius: 8,
                background: active ? '#EFF6FF' : 'transparent',
                color: active ? G : '#6B7280',
                textDecoration: 'none',
                fontFamily: 'var(--font-montserrat), sans-serif',
                transition: 'background 0.12s, color 0.12s',
              }}
              onMouseEnter={(e) => { if (!active) { (e.currentTarget as HTMLElement).style.background = '#F9FAFB'; (e.currentTarget as HTMLElement).style.color = '#374151' } }}
              onMouseLeave={(e) => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#6B7280' } }}
            >
              <item.icon size={15} strokeWidth={active ? 2 : 1.5} color={active ? G : undefined} />
              <span style={{ fontSize: 13, fontWeight: active ? 600 : 500 }}>{item.label}</span>
            </Link>
          )
        })}
      </div>

      {/* User footer */}
      <div style={{ padding: '10px 16px 14px', borderTop: `1px solid ${BORDER}`, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
            background: '#EFF6FF', color: G,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-montserrat), sans-serif',
          }}>
            {initial}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#111827', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'var(--font-montserrat), sans-serif' }}>
              {displayName}
            </p>
            <p style={{ fontSize: 10, color: '#9CA3AF', margin: 0, fontFamily: 'var(--font-montserrat), sans-serif' }}>
              {isPremium ? 'Premium Plan' : 'Scout Plan'}
            </p>
          </div>
          <button
            onClick={() => signOut(() => router.push('/'))}
            title="Sign out"
            style={{ color: '#D1D5DB', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 4 }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#6B7280')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#D1D5DB')}
          >
            <LogOut size={14} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <aside className="hidden lg:block w-[220px] flex-shrink-0 h-screen sticky top-0">
        {inner}
      </aside>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-9 h-9 rounded-xl flex items-center justify-center"
        style={{ background: '#fff', color: '#374151', border: '1px solid #E5E7EB', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
      >
        <Menu size={16} />
      </button>
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="relative z-10 w-[220px]">{inner}</aside>
        </div>
      )}
    </>
  )
}
