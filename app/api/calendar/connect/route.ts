/**
 * GET /api/calendar/connect
 *
 * Initiates the Google OAuth2 flow.
 * Stores a CSRF state token in a cookie, then redirects to Google's consent screen.
 */

import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getOAuthUrl } from '@/lib/google-calendar'
import { randomBytes } from 'crypto'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  // CSRF state: userId + random nonce, base64-encoded
  const nonce = randomBytes(16).toString('hex')
  const state = Buffer.from(JSON.stringify({ userId, nonce })).toString('base64url')

  const url = getOAuthUrl(state)

  const res = NextResponse.redirect(url)
  // Store state in a short-lived HttpOnly cookie for CSRF validation in the callback
  res.cookies.set('gcal_oauth_state', state, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   600, // 10 minutes
    path:     '/',
  })

  return res
}
