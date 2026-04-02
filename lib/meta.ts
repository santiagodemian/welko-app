/**
 * Meta Graph API helper — sends messages via Facebook Messenger or Instagram DMs.
 * Uses plain fetch (no SDK) for Vercel serverless compatibility.
 *
 * Both channels share the same endpoint; the page access token determines
 * which page/IG account sends the message.
 */

const GRAPH = 'https://graph.facebook.com/v19.0'

export async function sendMetaMessage(
  recipientId: string,
  text: string,
  pageAccessToken: string,
): Promise<void> {
  const res = await fetch(`${GRAPH}/me/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${pageAccessToken}`,
    },
    body: JSON.stringify({
      recipient: { id: recipientId },
      message:   { text },
      messaging_type: 'RESPONSE',
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(`Meta API error ${res.status}: ${JSON.stringify(err)}`)
  }
}

/**
 * Exchange a short-lived user access token for a long-lived one (60 days).
 * Called during the OAuth callback.
 */
export async function getLongLivedToken(shortToken: string): Promise<string> {
  const appId     = process.env.META_APP_ID!
  const appSecret = process.env.META_APP_SECRET!

  const url = new URL(`${GRAPH}/oauth/access_token`)
  url.searchParams.set('grant_type',        'fb_exchange_token')
  url.searchParams.set('client_id',          appId)
  url.searchParams.set('client_secret',      appSecret)
  url.searchParams.set('fb_exchange_token',  shortToken)

  const res  = await fetch(url.toString())
  const data = await res.json()
  if (!res.ok || !data.access_token) throw new Error('Failed to exchange token')
  return data.access_token
}

/**
 * Returns the list of Facebook Pages the user manages,
 * each with its own permanent Page Access Token.
 */
export async function getUserPages(userToken: string): Promise<
  { id: string; name: string; access_token: string; instagram_business_account?: { id: string } }[]
> {
  const res  = await fetch(
    `${GRAPH}/me/accounts?fields=id,name,access_token,instagram_business_account&access_token=${userToken}`
  )
  const data = await res.json()
  return data.data ?? []
}
