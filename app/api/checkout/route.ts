import { NextRequest, NextResponse } from 'next/server'

const PRICE_IDS: Record<string, string> = {
  essential_monthly: 'price_1THbwaCtJS5pRlClQRhTvUbd',
  pro_monthly:       'price_1THbxDCtJS5pRlClJDIns0Xf',
  business_monthly:  'price_1THby5CtJS5pRlClmW2z59y2',
  essential_annual:  'price_1THcqLCtJS5pRlClpnUIkakz',
  pro_annual:        'price_1THcqMCtJS5pRlClen4F7iA1',
  business_annual:   'price_1THcqMCtJS5pRlClxMhIk8o6',
}

export async function POST(req: NextRequest) {
  let plan: string
  let annual: boolean
  let priceKey: string

  try {
    const body = await req.json()
    plan = body.plan
    annual = !!body.annual
    if (!plan) throw new Error('missing plan')
    priceKey = `${plan}_${annual ? 'annual' : 'monthly'}`
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const priceId = PRICE_IDS[priceKey]
  if (!priceId) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  }

  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  const params = new URLSearchParams({
    mode: 'subscription',
    'line_items[0][price]': priceId,
    'line_items[0][quantity]': '1',
    success_url: 'https://welko.agency/onboarding?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'https://welko.agency/precios',
    billing_address_collection: 'required',
    customer_creation: 'always',
    allow_promotion_codes: 'true',
    'metadata[plan]': plan,
    'metadata[billing]': annual ? 'annual' : 'monthly',
  })

  const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
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
