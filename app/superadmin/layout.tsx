import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

const SUPERADMIN_IDS = (process.env.ADMIN_USER_IDS ?? '')
  .split(',').map((s) => s.trim()).filter(Boolean)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? ''

export default async function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth()
  if (!userId) redirect('/login')

  let allowed = SUPERADMIN_IDS.includes(userId)
  if (!allowed && ADMIN_EMAIL) {
    const user = await currentUser()
    allowed = user?.emailAddresses.some(e => e.emailAddress === ADMIN_EMAIL) ?? false
  }
  if (!allowed) redirect('/login')

  return <>{children}</>
}
