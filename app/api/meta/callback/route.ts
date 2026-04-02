/**
 * GET /api/meta/callback
 *
 * OAuth callback de Meta.
 * 1. Intercambia el code por un user access token
 * 2. Lo convierte a long-lived token (60 días)
 * 3. Obtiene las Páginas del usuario + cuentas de Instagram vinculadas
 * 4. Guarda facebookPageId, facebookPageToken (encrypted) e instagramAccountId en Clinic
 * 5. Redirige al dashboard
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { encrypt } from '@/lib/encryption'
import { getLongLivedToken, getUserPages } from '@/lib/meta'

const GRAPH = 'https://graph.facebook.com/v19.0'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code   = searchParams.get('code')
  const userId = searchParams.get('state')   // Clerk user ID passed in connect route
  const error  = searchParams.get('error')

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://welko.agency'

  if (error || !code || !userId) {
    return NextResponse.redirect(`${baseUrl}/dashboard/meta?error=cancelled`)
  }

  const appId      = process.env.META_APP_ID!
  const appSecret  = process.env.META_APP_SECRET!
  const redirectUri = `${baseUrl}/api/meta/callback`

  try {
    // 1. Exchange code → short-lived user token
    const tokenRes = await fetch(
      `${GRAPH}/oauth/access_token?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&client_secret=${appSecret}&code=${code}`
    )
    const tokenData = await tokenRes.json()
    if (!tokenData.access_token) throw new Error('No access token in response')

    // 2. Short-lived → long-lived (60 days)
    const longToken = await getLongLivedToken(tokenData.access_token)

    // 3. Get pages + Instagram accounts
    const pages = await getUserPages(longToken)
    if (!pages.length) throw new Error('No Facebook Pages found')

    // Use the first page (clinics typically have one)
    const page            = pages[0]
    const pageToken       = page.access_token  // permanent page token
    const instagramId     = page.instagram_business_account?.id ?? null

    // 4. Save to clinic
    await db.clinic.update({
      where: { clerkUserId: userId },
      data: {
        facebookPageId:    page.id,
        facebookPageToken: encrypt(pageToken),
        instagramAccountId: instagramId,
      },
    })

    return NextResponse.redirect(`${baseUrl}/dashboard/meta?connected=true`)
  } catch (err) {
    console.error('[Meta OAuth]', err)
    return NextResponse.redirect(`${baseUrl}/dashboard/meta?error=failed`)
  }
}
