/**
 * GET /api/calendar/callback
 *
 * Google OAuth2 callback. Validates state, exchanges code for tokens,
 * stores the encrypted refresh token on the Clinic row, then redirects
 * to the Canales page.
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { exchangeCodeForTokens, storeRefreshToken } from '@/lib/google-calendar'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://welko.agency'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code  = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  // User denied access
  if (error) {
    return NextResponse.redirect(`${APP_URL}/dashboard/canales?gcal=denied`)
  }

  if (!code || !state) {
    return NextResponse.redirect(`${APP_URL}/dashboard/canales?gcal=error`)
  }

  // ── CSRF validation ───────────────────────────────────────────────────────────
  const cookieState = req.cookies.get('gcal_oauth_state')?.value
  if (!cookieState || cookieState !== state) {
    return NextResponse.redirect(`${APP_URL}/dashboard/canales?gcal=error`)
  }

  // ── Verify the state userId matches the session ───────────────────────────────
  const { userId } = await auth()
  if (!userId) return NextResponse.redirect(`${APP_URL}/login`)

  let stateUserId: string
  try {
    const parsed = JSON.parse(Buffer.from(state, 'base64url').toString())
    stateUserId  = parsed.userId
  } catch {
    return NextResponse.redirect(`${APP_URL}/dashboard/canales?gcal=error`)
  }
  if (stateUserId !== userId) {
    return NextResponse.redirect(`${APP_URL}/dashboard/canales?gcal=error`)
  }

  // ── Find the clinic ───────────────────────────────────────────────────────────
  const clinic = await db.clinic.findUnique({
    where: { clerkUserId: userId },
    select: { id: true },
  })
  if (!clinic) return NextResponse.redirect(`${APP_URL}/dashboard/canales?gcal=error`)

  // ── Exchange code for tokens ──────────────────────────────────────────────────
  try {
    const tokens = await exchangeCodeForTokens(code)
    if (!tokens.refresh_token) {
      // Google only returns refresh_token on first consent — revoke & retry
      return NextResponse.redirect(`${APP_URL}/dashboard/canales?gcal=no_refresh_token`)
    }
    await storeRefreshToken(clinic.id, tokens.refresh_token)
  } catch (err) {
    console.error('[Welko] Google Calendar callback error:', err)
    return NextResponse.redirect(`${APP_URL}/dashboard/canales?gcal=error`)
  }

  // Clear the CSRF cookie
  const res = NextResponse.redirect(`${APP_URL}/dashboard/canales?gcal=connected&tab=calendario`)
  res.cookies.delete('gcal_oauth_state')
  return res
}
