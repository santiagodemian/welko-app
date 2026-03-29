'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useClerk, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import Image from 'next/image'
import {
  BarChart2,
  Users,
  Bot,
  GitBranch,
  Brain,
  CalendarCheck,
  Stethoscope,
  TrendingUp,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

type Plan = 'essential' | 'pro' | 'business'

const PLAN_ORDER: Record<Plan, number> = { essential: 0, pro: 1, business: 2 }

const NAV_GROUPS = [
  {
    title: 'Inteligencia',
    items: [
      {
        label: 'BI & Ventas',
        href: '/dashboard',
        icon: BarChart2,
        requiredPlan: 'essential' as Plan,
      },
    ],
  },
  {
    title: 'Operaciones',
    items: [
      {
        label: 'Manejo de Pacientes',
        href: '/dashboard/citas',
        icon: Users,
        requiredPlan: 'essential' as Plan,
      },
      {
        label: 'CRM & Cerebro IA',
        href: '/dashboard/crm',
        icon: Brain,
        requiredPlan: 'essential' as Plan,
      },
      {
        label: 'Configuración de IA',
        href: '/dashboard/ehr',
        icon: Bot,
        requiredPlan: 'pro' as Plan,
      },
      {
        label: 'Flujos de Conversación',
        href: '/dashboard/analisis',
        icon: GitBranch,
        requiredPlan: 'pro' as Plan,
      },
    ],
  },
  {
    title: 'Avanzado',
    items: [
      {
        label: 'Reportes de Rendimiento',
        href: '/dashboard/reportes',
        icon: TrendingUp,
        requiredPlan: 'business' as Plan,
      },
      {
        label: 'Expediente Clínico',
        href: '/dashboard/clientes',
        icon: Stethoscope,
        requiredPlan: 'business' as Plan,
      },
    ],
  },
]

const PLAN_LABELS: Record<Plan, string> = {
  essential: 'Essential',
  pro: 'Pro',
  business: 'Business',
}

const PLAN_BADGE: Record<Plan, React.CSSProperties> = {
  essential: { background: '#F3F4F6', color: '#6B7280' },
  pro:       { background: 'rgba(59,130,246,0.1)', color: '#2563EB' },
  business:  { background: 'rgba(245,158,11,0.1)', color: '#D97706' },
}

export function Sidebar({ plan }: { plan: string }) {
  const pathname = usePathname()
  const { signOut } = useClerk()
  const { user } = useUser()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const currentPlan = (plan as Plan) || 'essential'

  function canAccess(required: Plan) {
    return PLAN_ORDER[currentPlan] >= PLAN_ORDER[required]
  }

  function isActive(href: string) {
    return href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href)
  }

  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`.trim()
    : (user?.emailAddresses?.[0]?.emailAddress ?? '')

  const initial =
    user?.firstName?.[0] ??
    user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() ??
    '?'

  const inner = (
    <div className="flex flex-col h-full" style={{ background: 'var(--surface)', borderRight: '1px solid var(--border)' }}>
      {/* Logo */}
      <div
        className="flex items-center justify-between px-5 h-16 flex-shrink-0"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <Link href="/" className="flex items-center gap-2">
          <div style={{
            width: 26, height: 26, borderRadius: 7, background: '#13244A', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Image
              src="/welko_logo_purewhite.png"
              alt="Welko"
              width={16}
              height={16}
              className="object-contain"
            />
          </div>
          <span className="text-sm font-bold tracking-tight" style={{ color: 'var(--accent)' }}>
            Welko
          </span>
        </Link>
        <button
          className="lg:hidden"
          onClick={() => setOpen(false)}
          style={{ color: 'var(--text-muted)' }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-5">
        {NAV_GROUPS.map((group) => (
          <div key={group.title}>
            <p
              className="px-3 text-[10px] font-semibold uppercase tracking-widest mb-1.5"
              style={{ color: 'var(--text-muted)' }}
            >
              {group.title}
            </p>
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const accessible = canAccess(item.requiredPlan)
                const active = isActive(item.href)

                if (!accessible) {
                  return (
                    <Link
                      key={item.href}
                      href="/precios"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
                      style={{ opacity: 0.4, color: 'var(--text-muted)' }}
                      title={`Requiere Plan ${PLAN_LABELS[item.requiredPlan]}`}
                    >
                      <item.icon size={15} />
                      <span className="text-sm flex-1 truncate">
                        {item.label}
                      </span>
                      <span
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                        style={{
                          background: '#F3F4F6',
                          color: '#9CA3AF',
                        }}
                      >
                        {item.requiredPlan === 'pro' ? 'PRO' : 'BIZ'}
                      </span>
                    </Link>
                  )
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-150"
                    style={
                      active
                        ? {
                            background: 'var(--accent-subtle)',
                            color: 'var(--accent)',
                            boxShadow: 'inset 2px 0 0 var(--accent)',
                          }
                        : { color: 'var(--text-secondary)' }
                    }
                    onMouseEnter={(e) => {
                      if (!active)
                        (e.currentTarget as HTMLElement).style.background = 'var(--accent-ghost)'
                    }}
                    onMouseLeave={(e) => {
                      if (!active)
                        (e.currentTarget as HTMLElement).style.background = 'transparent'
                    }}
                  >
                    <item.icon size={15} />
                    <span className="text-sm font-medium truncate">{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div
        className="px-4 py-4 flex flex-col gap-3"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={PLAN_BADGE[currentPlan]}
          >
            {PLAN_LABELS[currentPlan]}
          </span>
          {currentPlan !== 'business' && (
            <Link
              href="/precios"
              className="text-xs"
              style={{ color: 'var(--text-muted)' }}
            >
              Actualizar →
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{ background: 'var(--accent-subtle)', color: 'var(--accent)' }}
          >
            {initial}
          </div>
          <p className="text-xs font-medium flex-1 min-w-0 truncate" style={{ color: 'var(--text-primary)' }}>
            {displayName}
          </p>
          <ThemeToggle />
          <button
            onClick={() => signOut(() => router.push('/'))}
            title="Cerrar sesión"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)')
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.color = 'var(--text-muted)')
            }
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:block w-[260px] flex-shrink-0 h-screen sticky top-0">
        {inner}
      </aside>

      {/* Mobile: hamburger */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-9 h-9 rounded-xl flex items-center justify-center"
        style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
      >
        <Menu size={16} />
      </button>

      {/* Mobile: drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="relative z-10 w-[260px]">{inner}</aside>
        </div>
      )}
    </>
  )
}
