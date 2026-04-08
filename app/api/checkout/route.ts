import { NextRequest, NextResponse } from 'next/server'

// ── Stripe Price IDs — updated April 2026 ─────────────────────────────────────
// Monthly prices configured in Stripe dashboard.
// Annual: same price IDs por ahora — crear precios anuales en Stripe y
// agregar starter_annual, essential_annual, pro_annual, business_annual cuando estén listos.
const MONTHLY: Record<string, string> = {
  starter:   process.env.STRIPE_PRICE_STARTER_MONTHLY   ?? 'price_1TJMn7CtJS5pRlClflS9EM0C',
  essential: process.env.STRIPE_PRICE_ESSENTIAL_MONTHLY ?? 'price_1TJMnyCtJS5pRlClEzSFryks',
  pro:       process.env.STRIPE_PRICE_PRO_MONTHLY       ?? 'price_1TJMoVCtJS5pRlCl1MsUpvvr',
  business:  process.env.STRIPE_PRICE_BUSINESS_MONTHLY  ?? 'price_1TJMoxCtJS5pRlClCMtm4DW9',
}
const ANNUAL: Record<string, string> = {
  starter:   process.env.STRIPE_PRICE_STARTER_ANNUAL   ?? MONTHLY.starter,
  essential: process.env.STRIPE_PRICE_ESSENTIAL_ANNUAL ?? MONTHLY.essential,
  pro:       process.env.STRIPE_PRICE_PRO_ANNUAL       ?? MONTHLY.pro,
  business:  process.env.STRIPE_PRICE_BUSINESS_ANNUAL  ?? MONTHLY.business,
}

export async function POST(req: NextRequest) {
  let plan: string
  let annual: boolean

  try {
    const body = await req.json()
    plan   = body.plan
    annual = !!body.annual
    if (!plan) throw new Error('missing plan')
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const priceId = annual ? ANNUAL[plan] : MONTHLY[plan]
  if (!priceId) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  }

  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  const params = new URLSearchParams({
    mode:                           'subscription',
    'line_items[0][price]':         priceId,
    'line_items[0][quantity]':      '1',
    success_url:                    'https://welko.agency/onboarding?session_id={CHECKOUT_SESSION_ID}',
    cancel_url:                     'https://welko.agency/precios',
    billing_address_collection:     'required',
    allow_promotion_codes:          'true',
    'metadata[plan]':               plan,
    'metadata[billing]':            annual ? 'annual' : 'monthly',
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
