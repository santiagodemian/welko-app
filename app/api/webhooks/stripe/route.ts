import * as Sentry from '@sentry/nextjs'
import { NextRequest, NextResponse } from 'next/server'
import type { Stripe } from '@/lib/stripe'
import { stripe } from '@/lib/stripe'
import { clerkClient } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { Resend } from 'resend'
import { renderWelcomeEmail } from '@/lib/emails/welcome'

// ── Price ID → plan type mapping ──────────────────────────────────────────────
type PlanType = 'PREMIUM_MONTHLY' | 'PREMIUM_ANNUAL' | 'AGENCY_MONTHLY' | 'AGENCY_ANNUAL'

const PRICE_TO_PLAN: Record<string, PlanType> = {
  [process.env.STRIPE_PRICE_PREMIUM_MONTHLY ?? 'price_premium_monthly']: 'PREMIUM_MONTHLY',
  [process.env.STRIPE_PRICE_PREMIUM_ANNUAL  ?? 'price_premium_annual']:  'PREMIUM_ANNUAL',
  [process.env.STRIPE_PRICE_AGENCY_MONTHLY  ?? 'price_agency_monthly']:  'AGENCY_MONTHLY',
  [process.env.STRIPE_PRICE_AGENCY_ANNUAL   ?? 'price_agency_annual']:   'AGENCY_ANNUAL',
}

// ── Sync plan to Clerk public metadata ───────────────────────────────────────
async function syncPlanToClerk(
  email: string,
  plan: 'premium' | null,
  stripeCustomerId?: string,
) {
  const clerk = await clerkClient()
  const { data: users } = await clerk.users.getUserList({ emailAddress: [email] })
  if (users.length === 0) return
  await clerk.users.updateUserMetadata(users[0].id, {
    publicMetadata: { plan },
    ...(stripeCustomerId ? { privateMetadata: { stripeCustomerId } } : {}),
  })
}

// ── Upsert Subscription record in DB ─────────────────────────────────────────
async function syncSubscriptionToDB(
  email: string,
  planType: PlanType | null,
  stripeCustomerId: string,
  stripeSubscriptionId: string,
  stripePriceId: string | null,
  status: string,
) {
  try {
    const clerk = await clerkClient()
    const { data: users } = await clerk.users.getUserList({ emailAddress: [email] })
    if (users.length === 0) return

    const member = await db.agencyMember.findUnique({
      where: { clerkUserId: users[0].id },
      select: { agencyId: true },
    })
    if (!member) return

    await db.subscription.upsert({
      where:  { agencyId: member.agencyId },
      create: {
        agencyId:             member.agencyId,
        stripeCustomerId,
        stripeSubscriptionId,
        stripePriceId,
        planType:  planType ?? 'FREE',
        status:    mapStatus(status),
      },
      update: {
        stripeCustomerId,
        stripeSubscriptionId,
        stripePriceId,
        planType:  planType ?? 'FREE',
        status:    mapStatus(status),
      },
    })
  } catch {
    // non-fatal — Clerk or DB might not have this user yet
  }
}

function mapStatus(s: string): 'ACTIVE' | 'CANCELED' | 'PAST_DUE' | 'TRIALING' {
  if (s === 'active')   return 'ACTIVE'
  if (s === 'trialing') return 'TRIALING'
  if (s === 'past_due') return 'PAST_DUE'
  return 'CANCELED'
}

// ── Send welcome email ────────────────────────────────────────────────────────
async function sendWelcomeEmail(
  email: string,
  name: string,
  plan: string,
  billing: 'monthly' | 'annual',
) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return

  const resend = new Resend(apiKey)
  const html   = renderWelcomeEmail({ name, plan, billing })

  await resend.emails.send({
    from:    'Polaris Football <hola@polarisfootball.com>',
    to:      email,
    subject: `Welcome to Polaris Football Premium! 🏆`,
    html,
  })
}

// ── Webhook handler ───────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const rawBody   = await req.text()
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

  const priceId       = subscription.items.data[0]?.price?.id ?? null
  const planType      = priceId ? PRICE_TO_PLAN[priceId] ?? null : null
  const subId         = subscription.id
  const subStatus     = subscription.status

  if (event.type === 'customer.subscription.deleted') {
    await syncPlanToClerk(email, null, customerId)
    await syncSubscriptionToDB(email, null, customerId, subId, priceId, 'canceled')
    return NextResponse.json({ received: true })
  }

  if (planType && subStatus === 'active') {
    await syncPlanToClerk(email, 'premium', customerId)
    await syncSubscriptionToDB(email, planType, customerId, subId, priceId, subStatus)

    if (event.type === 'customer.subscription.created') {
      const interval  = subscription.items.data[0]?.price?.recurring?.interval
      const billing: 'monthly' | 'annual' = interval === 'year' ? 'annual' : 'monthly'
      const emailPlan = planType.startsWith('AGENCY') ? 'agency' : 'premium'
      await sendWelcomeEmail(email, customerName || email.split('@')[0], emailPlan, billing)

      // ── Affiliate commission: €50 flat on annual plan conversion ─────────
      if (planType === 'PREMIUM_ANNUAL' || planType === 'AGENCY_ANNUAL') {
        const refToken = (subscription.metadata as Record<string, string>)?.referralToken
        if (refToken) {
          try {
            const affiliate = await db.affiliatePartner.findUnique({
              where: { referralToken: refToken },
              select: { id: true, status: true },
            })
            if (affiliate && affiliate.status === 'ACTIVE') {
              const COMMISSION = 50 // EUR flat fee per annual conversion
              await db.$transaction([
                db.affiliateReferral.create({
                  data: {
                    affiliateId:        affiliate.id,
                    referredAgencyName: customerName || email.split('@')[0],
                    planType:           'PREMIUM_ANNUAL',
                    monthlyValueEur:    299,
                    commissionRate:     0,
                    monthlyCommission:  0,
                    status:             'active',
                  },
                }),
                db.affiliatePartner.update({
                  where: { id: affiliate.id },
                  data:  {
                    totalEarned:    { increment: COMMISSION },
                    pendingBalance: { increment: COMMISSION },
                  },
                }),
              ])
            }
          } catch (err) {
            Sentry.captureException(err, { tags: { webhook: 'stripe', step: 'affiliate_commission' } })
          }
        }
      }
    }
  }

  return NextResponse.json({ received: true })
}
