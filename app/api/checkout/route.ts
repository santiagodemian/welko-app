import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

const PRICE_IDS = {
  essential_monthly: 'price_1THbwaCtJS5pRlClQRhTvUbd',
  pro_monthly:       'price_1THbxDCtJS5pRlClJDIns0Xf',
  business_monthly:  'price_1THby5CtJS5pRlClmW2z59y2',
  essential_annual:  'price_1THcqLCtJS5pRlClpnUIkakz',
  pro_annual:        'price_1THcqMCtJS5pRlClen4F7iA1',
  business_annual:   'price_1THcqMCtJS5pRlClxMhIk8o6',
} as const

type PriceKey = keyof typeof PRICE_IDS

export async function POST(req: NextRequest) {
  let plan: string
  let annual: boolean
  let priceKey: PriceKey

  try {
    const body = await req.json()
    plan = body.plan
    annual = !!body.annual
    if (!plan) throw new Error('missing plan')
    priceKey = `${plan}_${annual ? 'annual' : 'monthly'}` as PriceKey
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  if (!(priceKey in PRICE_IDS)) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: PRICE_IDS[priceKey], quantity: 1 }],
      success_url: 'https://welko.agency/onboarding?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://welko.agency/precios',
      billing_address_collection: 'required',
      customer_creation: 'always',
      allow_promotion_codes: true,
      metadata: { plan, billing: annual ? 'annual' : 'monthly' },
    })
    return NextResponse.json({ url: session.url })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
