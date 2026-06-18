import { NextRequest, NextResponse } from 'next/server'

const MONTHLY: Record<string, string> = {
  premium: process.env.STRIPE_PRICE_PREMIUM_MONTHLY ?? '',
  agency:  process.env.STRIPE_PRICE_AGENCY_MONTHLY  ?? '',
}
const ANNUAL: Record<string, string> = {
  premium: process.env.STRIPE_PRICE_PREMIUM_ANNUAL ?? '',
  agency:  process.env.STRIPE_PRICE_AGENCY_ANNUAL  ?? '',
}

export async function POST(req: NextRequest) {
  let plan: string
  let annual: boolean
  let referralToken: string | null = null

  try {
    const body = await req.json()
    plan           = body.plan
    annual         = !!body.annual
    referralToken  = (body.referralToken as string | undefined) ?? null
    if (!plan) throw new Error('missing plan')
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const priceId = annual ? ANNUAL[plan] : MONTHLY[plan]
  if (!priceId) {
    return NextResponse.json({ error: 'Invalid plan or Stripe price not configured' }, { status: 400 })
  }

  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  const params = new URLSearchParams({
    mode:                                    'subscription',
    'line_items[0][price]':                  priceId,
    'line_items[0][quantity]':               '1',
    success_url:                             `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://polarisfootball.com'}/onboarding?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url:                              `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://polarisfootball.com'}/pricing`,
    billing_address_collection:              'required',
    allow_promotion_codes:                   'true',
    'metadata[plan]':                        plan,
    'metadata[billing]':                     annual ? 'annual' : 'monthly',
    'subscription_data[metadata][plan]':     plan,
    'subscription_data[metadata][billing]':  annual ? 'annual' : 'monthly',
    ...(referralToken ? { 'subscription_data[metadata][referralToken]': referralToken } : {}),
  })

  const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization:  `Bearer ${key}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  })

  const data = await res.json()
  if (!res.ok) {
    return NextResponse.json({ error: data?.error?.message ?? 'Stripe error' }, { status: 500 })
  }

  return NextResponse.json({ url: data.url })
}
