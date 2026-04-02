/**
 * Twilio helper — sends a WhatsApp message via the REST API.
 * Uses plain fetch (no SDK) for Vercel serverless compatibility.
 */

const TWILIO_API = 'https://api.twilio.com/2010-04-01/Accounts'

export async function sendWhatsApp(to: string, body: string): Promise<void> {
  const sid   = process.env.TWILIO_ACCOUNT_SID
  const token = process.env.TWILIO_AUTH_TOKEN
  const from  = process.env.TWILIO_WHATSAPP_FROM // e.g. "+14155238886"

  if (!sid || !token || !from) {
    throw new Error('[Welko] Twilio env vars not set (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM)')
  }

  const params = new URLSearchParams({
    To:   `whatsapp:${to}`,
    From: `whatsapp:${from}`,
    Body: body,
  })

  const res = await fetch(`${TWILIO_API}/${sid}/Messages.json`, {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(`${sid}:${token}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(`Twilio error ${res.status}: ${JSON.stringify(err)}`)
  }
}
