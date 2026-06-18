import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { BrandColorApplier } from '@/components/dashboard/BrandColorApplier'
import { db } from '@/lib/db'

const SUPERADMIN_IDS = (process.env.ADMIN_USER_IDS ?? '')
  .split(',').map((s) => s.trim()).filter(Boolean)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? ''

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId, sessionClaims } = await auth()
  if (!userId) redirect('/login')

  let isSuperAdmin = SUPERADMIN_IDS.includes(userId)
  if (!isSuperAdmin && ADMIN_EMAIL) {
    const user = await currentUser()
    isSuperAdmin = user?.emailAddresses.some(e => e.emailAddress === ADMIN_EMAIL) ?? false
  }
  const isDev = process.env.NODE_ENV !== 'production'

  // Resolve plan from Clerk session metadata
  const rawPlan = isSuperAdmin ? 'premium' : ((sessionClaims?.plan ?? (isDev ? 'premium' : null)) as string | null)
  const plan: 'scout' | 'premium' = rawPlan === 'premium' ? 'premium' : rawPlan === 'scout' ? 'scout' : 'scout'

  // Load agency data via member lookup
  let agencyName: string | null = null
  let logoUrl: string | null = null
  let brandColor: string | null = null

  try {
    const member = await db.agencyMember.findUnique({
      where: { clerkUserId: userId },
      include: { agency: { include: { brandKit: true, subscription: true } } },
    })

    if (member) {
      agencyName = member.agency.name
      logoUrl    = member.agency.brandKit?.logoUrl ?? null
      brandColor = member.agency.brandKit?.primaryColor ?? null

      // Redirect to pricing if no subscription and not dev/admin
      if (!isDev && !isSuperAdmin && !member.agency.subscription) {
        redirect('/pricing')
      }
    } else if (!isDev && !isSuperAdmin) {
      // New user — no agency yet, send to onboarding
      redirect('/onboarding')
    }
  } catch {
    // DB not yet migrated — allow access in dev/superadmin
    if (!isDev && !isSuperAdmin) redirect('/onboarding')
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg)' }}>
      <Sidebar plan={plan} agencyName={agencyName} logoUrl={logoUrl} isSuperAdmin={isSuperAdmin} />
      <main className="flex-1 overflow-y-auto">{children}</main>
      <BrandColorApplier dbColor={brandColor} />
    </div>
  )
}
