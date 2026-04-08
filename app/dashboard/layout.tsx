import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { ProductTour } from '@/components/dashboard/ProductTour'
import { BrandColorApplier } from '@/components/dashboard/BrandColorApplier'
import { db } from '@/lib/db'

// Admin user IDs — comma-separated in ADMIN_USER_IDS env var.
// Get your Clerk userId from: https://dashboard.clerk.com → Users
// Example: ADMIN_USER_IDS=user_2abc123,user_2xyz789
const ADMIN_IDS = (process.env.ADMIN_USER_IDS ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId, sessionClaims } = await auth()

  if (!userId) redirect('/login')

  const isAdmin = ADMIN_IDS.includes(userId)

  // In development or for admin users, skip plan & onboarding gates
  const isDev = process.env.NODE_ENV !== 'production'

  // Admin always gets business-level access
  const VALID_PLANS = ['starter', 'essential', 'pro', 'business']
  const rawPlan = isAdmin
    ? 'business'
    : ((sessionClaims?.plan ?? (isDev ? 'pro' : null)) as string | null)
  const plan = rawPlan && VALID_PLANS.includes(rawPlan) ? rawPlan : null

  if (!plan) redirect('/precios')

  if (!isDev && !isAdmin) {
    const clinic = await db.clinic.findUnique({
      where: { clerkUserId: userId },
      select: { onboardingCompleted: true },
    })
    if (!clinic?.onboardingCompleted) redirect('/onboarding')
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg)' }}>
      <Sidebar plan={plan} />
      <main className="flex-1 overflow-y-auto">{children}</main>
      <ProductTour />
      <BrandColorApplier />
    </div>
  )
}
