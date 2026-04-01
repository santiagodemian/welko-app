import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isDashboard    = createRouteMatcher(['/dashboard(.*)'])
const isProOnly      = createRouteMatcher(['/dashboard/reportes(.*)'])
const isBusinessOnly = createRouteMatcher([
  '/dashboard/ehr(.*)',
  '/dashboard/analisis(.*)',
  '/dashboard/sucursales(.*)',
])

// Admin user IDs that bypass all plan restrictions.
// Set ADMIN_USER_IDS=user_abc123 in your .env.local
// Get your Clerk userId from: https://dashboard.clerk.com → Users
const ADMIN_IDS = (process.env.ADMIN_USER_IDS ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

export const proxy = clerkMiddleware(async (auth, req) => {
  if (!isDashboard(req)) return

  const { userId, sessionClaims } = await auth()

  if (!userId) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Admin users bypass all plan gates — always full access
  if (ADMIN_IDS.includes(userId)) return

  // In development, skip plan checks so you can preview the dashboard without Stripe
  const isDev = process.env.NODE_ENV !== 'production'
  if (isDev) return

  // plan is injected via Clerk Dashboard → Sessions → JWT template:
  //   { "plan": "{{user.public_metadata.plan}}" }
  const plan = sessionClaims?.plan

  if (!plan) {
    return NextResponse.redirect(new URL('/precios', req.url))
  }

  if (isProOnly(req) && plan === 'essential') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  if (isBusinessOnly(req) && plan !== 'business') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
