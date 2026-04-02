/**
 * GET /api/meta/connect
 *
 * Inicia el flujo OAuth de Meta para que la clínica conecte su Página de
 * Facebook (y la cuenta de Instagram vinculada).
 * Redirige al usuario a la pantalla de permisos de Meta.
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function GET(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.redirect(new URL('/login', req.url))

  const appId       = process.env.META_APP_ID
  const baseUrl     = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://welko.agency'
  const redirectUri = `${baseUrl}/api/meta/callback`

  if (!appId) {
    return NextResponse.json({ error: 'META_APP_ID not configured' }, { status: 500 })
  }

  const params = new URLSearchParams({
    client_id:     appId,
    redirect_uri:  redirectUri,
    scope:         'pages_messaging,pages_show_list,instagram_manage_messages,instagram_basic,pages_read_engagement',
    response_type: 'code',
    state:         userId, // pass userId so callback knows who to update
  })

  return NextResponse.redirect(
    `https://www.facebook.com/v19.0/dialog/oauth?${params.toString()}`
  )
}
