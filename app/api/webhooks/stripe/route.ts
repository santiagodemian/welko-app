import { NextRequest, NextResponse } from 'next/server'
import type { Stripe } from '@/lib/stripe'
import { stripe } from '@/lib/stripe'
import { clerkClient } from '@clerk/nextjs/server'

// ─── Map your Stripe Price IDs to plan names ──────────────────────────────────
// Find Price IDs: Stripe Dashboard → Products → [Product] → Prices → price_xxx
const PRICE_TO_PLAN: Record<string, 'essential' | 'pro' | 'business'> = {
  // TODO: Replace with your actual Stripe Price IDs after creating products
  price_essential_monthly: 'essential',
  price_essential_annual: 'essential',
  price_pro_monthly: 'pro',
  price_pro_annual: 'pro',
  price_business_monthly: 'business',
  price_business_annual: 'business',
}

async function syncPlanToClerk(email: string, plan: 'essential' | 'pro' | 'business' | null) {
  const clerk = await clerkClient()
  const { data: users } = await clerk.users.getUserList({ emailAddress: [email] })
  if (users.length === 0) return
  await clerk.users.updateUserMetadata(users[0].id, {
    publicMetadata: { plan },
  })
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    )
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Only handle subscription events
  if (
    event.type !== 'customer.subscription.created' &&
    event.type !== 'customer.subscription.updated' &&
    event.type !== 'customer.subscription.deleted'
  ) {
    return NextResponse.json({ received: true })
  }

  const subscription = event.data.object as Stripe.Subscription
  const customerId = subscription.customer as string

  // Get email from Stripe customer
  let email: string | null = null
  try {
    const customer = await stripe.customers.retrieve(customerId)
    if (!customer.deleted) email = customer.email
  } catch {
    return NextResponse.json({ error: 'Cannot retrieve customer' }, { status: 400 })
  }

  if (!email) {
    return NextResponse.json({ error: 'No customer email' }, { status: 400 })
  }

  if (event.type === 'customer.subscription.deleted') {
    await syncPlanToClerk(email, null)
    return NextResponse.json({ received: true })
  }

  // created or updated
  const priceId = subscription.items.data[0]?.price?.id
  const plan = PRICE_TO_PLAN[priceId]

  if (plan && subscription.status === 'active') {
    await syncPlanToClerk(email, plan)
  }

  return NextResponse.json({ received: true })
}
