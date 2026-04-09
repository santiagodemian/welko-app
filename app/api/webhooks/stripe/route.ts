import * as Sentry from '@sentry/nextjs'
import { NextRequest, NextResponse } from 'next/server'
import type { Stripe } from '@/lib/stripe'
import { stripe } from '@/lib/stripe'
import { clerkClient } from '@clerk/nextjs/server'
import { Resend } from 'resend'
import { renderWelcomeEmail } from '@/lib/emails/welcome'

// ── Price ID → Plan mapping (updated April 2026) ──────────────────────────────
type PlanId = 'starter' | 'essential' | 'pro' | 'business'

const PRICE_TO_PLAN: Record<string, PlanId> = {
  // Starter
  [process.env.STRIPE_PRICE_STARTER_MONTHLY  ?? 'price_1TIxJMCtJS5pRlCl7fOo4FBC']: 'starter',
  [process.env.STRIPE_PRICE_STARTER_ANNUAL   ?? 'price_1TIxJNCtJS5pRlClYNJONNzc']: 'starter',
  // Essential — $1,499 / $1,199
  price_1THbonCtJS5pRlCl7p3MzzOh: 'essential',
  price_1TIxN8CtJS5pRlClREQtoXdG: 'essential',
  // Pro — $2,999 / $2,399
  price_1THbonCtJS5pRlCl2f4CFDKc: 'pro',
  price_1TIxN8CtJS5pRlClbeXsTJPv: 'pro',
  // Business — $5,999 / $4,799
  price_1THbokCtJS5pRlClvHqTqWh3: 'business',
  price_1TIxN9CtJS5pRlClLpVay0DX: 'business',
}

// ── Sync plan + stripeCustomerId to Clerk metadata ───────────────────────────
async function syncPlanToClerk(email: string, plan: PlanId | null, stripeCustomerId?: string) {
  const clerk = await clerkClient()
  const { data: users } = await clerk.users.getUserList({ emailAddress: [email] })
  if (users.length === 0) return
  await clerk.users.updateUserMetadata(users[0].id, {
    publicMetadata: { plan },
    // stripeCustomerId is sensitive — kept server-side only
    ...(stripeCustomerId ? { privateMetadata: { stripeCustomerId } } : {}),
  })
}

// ── Send welcome email via Resend ─────────────────────────────────────────────
async function sendWelcomeEmail(
  email: string,
  name: string,
  plan: PlanId,
  billing: 'monthly' | 'annual',
) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return // silently skip if not configured

  const resend = new Resend(apiKey)
  const html   = renderWelcomeEmail({ name, plan, billing })

  await resend.emails.send({
    from:    'Welko <hola@welko.org>',
    to:      email,
    subject: `¡Bienvenido a Welko ${plan.charAt(0).toUpperCase() + plan.slice(1)}! Tu IA ya está lista 🤖`,
    html,
  })
}

// ── Webhook handler ───────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const rawBody  = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    Sentry.captureException(err, { tags: { webhook: 'stripe', step: 'signature_verify' } })
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (
    event.type !== 'customer.subscription.created' &&
    event.type !== 'customer.subscription.updated' &&
    event.type !== 'customer.subscription.deleted'
  ) {
    return NextResponse.json({ received: true })
  }

  const subscription = event.data.object as Stripe.Subscription
  const customerId   = subscription.customer as string

  // Get customer info from Stripe
  let email: string | null = null
  let customerName         = ''
  try {
    const customer = await stripe.customers.retrieve(customerId)
    if (!customer.deleted) {
      email        = customer.email
      customerName = (customer as Stripe.Customer).name ?? ''
    }
  } catch (err) {
    Sentry.captureException(err, { tags: { webhook: 'stripe', step: 'retrieve_customer' }, extra: { customerId } })
    return NextResponse.json({ error: 'Cannot retrieve customer' }, { status: 400 })
  }

  if (!email) {
    return NextResponse.json({ error: 'No customer email' }, { status: 400 })
  }

  // Subscription deleted → remove plan but keep stripeCustomerId for portal access
  if (event.type === 'customer.subscription.deleted') {
    await syncPlanToClerk(email, null, customerId)
    return NextResponse.json({ received: true })
  }

  const priceId = subscription.items.data[0]?.price?.id
  const plan    = priceId ? PRICE_TO_PLAN[priceId] : undefined

  if (plan && subscription.status === 'active') {
    // Determine billing cycle from price interval
    const interval = subscription.items.data[0]?.price?.recurring?.interval
    const billing: 'monthly' | 'annual' = interval === 'year' ? 'annual' : 'monthly'

    // Sync plan + customer ID to Clerk
    await syncPlanToClerk(email, plan, customerId)

    // Send welcome email only on new subscription (not updates)
    if (event.type === 'customer.subscription.created') {
      await sendWelcomeEmail(email, customerName || email.split('@')[0], plan, billing)
    }
  }

  return NextResponse.json({ received: true })
}
