import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { stripe } from '@/lib/stripe'

const PRICE_IDS = {
  essential: 'price_1THbwaCtJS5pRlClQRhTvUbd',
  pro:       'price_1THbxDCtJS5pRlClJDIns0Xf',
  business:  'price_1THby5CtJS5pRlClmW2z59y2',
} as const

type PlanId = keyof typeof PRICE_IDS

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let plan: PlanId
  try {
    const body = await req.json()
    plan = body.plan
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!plan || !(plan in PRICE_IDS)) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: PRICE_IDS[plan], quantity: 1 }],
    success_url: 'https://welko.agency/onboarding?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'https://welko.agency/precios',
    metadata: { clerkUserId: userId, plan },
    allow_promotion_codes: true,
  })

  return NextResponse.json({ url: session.url })
}
