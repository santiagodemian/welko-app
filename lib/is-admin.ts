import { currentUser } from '@clerk/nextjs/server'

const ADMIN_IDS   = (process.env.ADMIN_USER_IDS ?? '').split(',').map(s => s.trim()).filter(Boolean)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? ''

export async function isAdminUser(userId: string): Promise<boolean> {
  if (ADMIN_IDS.includes(userId)) return true
  if (!ADMIN_EMAIL) return false
  const user = await currentUser()
  return user?.emailAddresses.some(e => e.emailAddress === ADMIN_EMAIL) ?? false
}
