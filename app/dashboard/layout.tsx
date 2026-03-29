import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { db } from '@/lib/db'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId, sessionClaims } = await auth()

  if (!userId) redirect('/login')

  // In development, skip plan & onboarding gates so you can preview the dashboard
  const isDev = process.env.NODE_ENV !== 'production'
  const plan = (sessionClaims?.plan ?? (isDev ? 'pro' : null)) as string | null
  if (!plan) redirect('/precios')

  if (!isDev) {
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
    </div>
  )
}
