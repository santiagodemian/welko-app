import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isDashboard   = createRouteMatcher(['/dashboard(.*)'])
const isProOnly     = createRouteMatcher(['/dashboard/reportes(.*)'])
const isBusinessOnly = createRouteMatcher([
  '/dashboard/ehr(.*)',
  '/dashboard/analisis(.*)',
])

// clerkMiddleware returns NextMiddleware ≡ NextProxy — compatible with proxy.ts
export const proxy = clerkMiddleware(async (auth, req) => {
  if (!isDashboard(req)) return

  const { userId, sessionClaims } = await auth()

  if (!userId) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

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
