'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useClerk, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { WelkoLogo } from '@/components/ui/WelkoLogo'
import {
  LayoutDashboard,
  MessageSquare,
  CalendarCheck,
  Radio,
  Bot,
  Package,
  Settings2,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

type Plan = 'starter' | 'essential' | 'pro' | 'business'
const PLAN_ORDER: Record<Plan, number> = { starter: 0, essential: 1, pro: 2, business: 3 }

// Industry-specific label for the "Citas" nav item
const INDUSTRY_CITAS: Record<string, string> = {
  salud: 'Citas', restaurante: 'Reservaciones', barberia: 'Turnos',
  hotel: 'Reservas', fitness: 'Clases', legal: 'Consultas',
  spa: 'Sesiones', retail: 'Pedidos',
}
// Industry-specific label for "Clientes/Pacientes/Huéspedes"
const INDUSTRY_CLIENT: Record<string, string> = {
  salud: 'Pacientes', restaurante: 'Comensales', barberia: 'Clientes',
  hotel: 'Huéspedes', fitness: 'Miembros', legal: 'Expedientes',
  spa: 'Clientes', retail: 'Compradores',
}

function buildNavItems(industry: string): { label: string; href: string; icon: React.ElementType; requiredPlan: Plan }[] {
  return [
    { label: 'Inicio',                           href: '/dashboard',                  icon: LayoutDashboard, requiredPlan: 'starter'   as Plan },
    { label: 'Conversaciones',                   href: '/dashboard/conversaciones',   icon: MessageSquare,   requiredPlan: 'starter'   as Plan },
    { label: INDUSTRY_CITAS[industry] ?? 'Citas',href: '/dashboard/citas',            icon: CalendarCheck,   requiredPlan: 'starter'   as Plan },
    { label: INDUSTRY_CLIENT[industry] ?? 'Clientes', href: '/dashboard/clientes',   icon: Package,         requiredPlan: 'starter'   as Plan },
    { label: 'Canales',                          href: '/dashboard/canales',          icon: Radio,           requiredPlan: 'essential' as Plan },
    { label: 'IA & Negocio',                     href: '/dashboard/ia',               icon: Bot,             requiredPlan: 'starter'   as Plan },
    { label: 'Ajustes',                          href: '/dashboard/ajustes',          icon: Settings2,       requiredPlan: 'starter'   as Plan },
  ]
}

const PLAN_LABELS: Record<Plan, string> = { starter: 'Starter', essential: 'Essential', pro: 'Pro', business: 'Business' }
const PLAN_BADGE: Record<Plan, React.CSSProperties> = {
  starter:   { background: '#F3F4F6', color: '#6B7280' },
  essential: { background: 'rgba(16,185,129,0.1)', color: '#059669' },
  pro:       { background: 'rgba(59,130,246,0.1)', color: '#2563EB' },
  business:  { background: 'rgba(245,158,11,0.1)', color: '#D97706' },
}
const LOCK_BADGE: Record<Plan, string> = { starter: '', essential: 'ESS', pro: 'PRO', business: 'BIZ' }

export function Sidebar({ plan }: { plan: string }) {
  const pathname  = usePathname()
  const { signOut } = useClerk()
  const { user }  = useUser()
  const router    = useRouter()
  const [open, setOpen] = useState(false)
  const [previewIndustry, setPreviewIndustry] = useState('salud')

  // Re-read industry on every route change so labels update without refresh
  useEffect(() => {
    const stored = localStorage.getItem('welko_preview_industry')
    if (stored) setPreviewIndustry(stored)
  }, [pathname])

  const NAV_ITEMS = buildNavItems(previewIndustry)
  const currentPlan = (plan as Plan) || 'essential'
  const canAccess = (req: Plan) => PLAN_ORDER[currentPlan] >= PLAN_ORDER[req]

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
      <div className="flex items-center justify-between px-5 h-16 flex-shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
        <Link href="/" className="flex items-center gap-2.5">
          <WelkoLogo size={32} />
          <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', fontFamily: 'var(--font-montserrat), sans-serif' }}>
            Welko
          </span>
        </Link>
        <button className="lg:hidden" onClick={() => setOpen(false)} style={{ color: 'var(--text-muted)' }}>
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const accessible = canAccess(item.requiredPlan)
          const active     = isActive(item.href)

          if (!accessible) {
            return (
              <Link
                key={item.href}
                href="/precios"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                style={{ opacity: 0.4, color: 'var(--text-muted)' }}
                title={`Requiere Plan ${PLAN_LABELS[item.requiredPlan]}`}
              >
                <item.icon size={17} />
                <span className="text-sm flex-1 truncate">{item.label}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: '#F3F4F6', color: '#9CA3AF' }}>
                  {LOCK_BADGE[item.requiredPlan]}
                </span>
              </Link>
            )
          }

          const tourId =
            item.href === '/dashboard'                 ? 'tour-inicio' :
            item.href === '/dashboard/conversaciones'  ? 'tour-conversaciones' :
            item.href === '/dashboard/citas'           ? 'tour-citas' :
            item.href === '/dashboard/canales'         ? 'tour-canales' :
            item.href === '/dashboard/ia'              ? 'tour-ia' : undefined

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              {...(tourId ? { 'data-tour': tourId } : {})}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors duration-150"
              style={
                active
                  ? { background: 'var(--accent-subtle)', color: 'var(--accent)', fontWeight: 600 }
                  : { color: 'var(--text-secondary)' }
              }
              onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = 'var(--accent-ghost)' }}
              onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
            >
              <item.icon size={17} strokeWidth={active ? 2.5 : 1.75} />
              <span className="text-sm font-medium truncate">{item.label}</span>
              {active && <div className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--accent)' }} />}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 flex flex-col gap-3" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={PLAN_BADGE[currentPlan]}>
            {PLAN_LABELS[currentPlan]}
          </span>
          {currentPlan !== 'business' && (
            <Link href="/precios" className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Actualizar →
            </Link>
          )}
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: 'var(--accent-subtle)', color: 'var(--accent)' }}>
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
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-muted)')}
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
        style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
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
