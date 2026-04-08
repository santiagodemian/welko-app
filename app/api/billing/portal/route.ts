/**
 * POST /api/billing/portal
 *
 * Creates a Stripe Billing Portal session for the authenticated user and
 * returns the URL to redirect them to.
 *
 * Strategy for finding the Stripe customer:
 *   1. Read stripeCustomerId from Clerk privateMetadata (set by the webhook).
 *   2. Fall back to searching by email in Stripe (covers legacy accounts where
 *      the webhook hasn't re-run yet).
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { stripe } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const body        = await req.json().catch(() => ({}))
  const returnUrl   = (body.returnUrl as string | undefined) ?? `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://welko.agency'}/dashboard/ajustes`

  // ── 1. Try privateMetadata first ─────────────────────────────────────────────
  let stripeCustomerId: string | null = null
  try {
    const clerk = await clerkClient()
    const user  = await clerk.users.getUser(userId)
    stripeCustomerId = (user.privateMetadata?.stripeCustomerId as string | undefined) ?? null
  } catch {
    // non-fatal — fall through to email lookup
  }

  // ── 2. Fall back to email lookup in Stripe ────────────────────────────────────
  if (!stripeCustomerId) {
    try {
      const clerk = await clerkClient()
      const user  = await clerk.users.getUser(userId)
      const email = user.emailAddresses[0]?.emailAddress
      if (email) {
        const customers = await stripe.customers.list({ email, limit: 1 })
        stripeCustomerId = customers.data[0]?.id ?? null
      }
    } catch {
      // non-fatal
    }
  }

  if (!stripeCustomerId) {
    return NextResponse.json(
      { error: 'No Stripe customer found. Make sure you have an active subscription.' },
      { status: 404 },
    )
  }

  // ── 3. Create Billing Portal session ─────────────────────────────────────────
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer:   stripeCustomerId,
      return_url: returnUrl,
    })
    return NextResponse.json({ url: session.url })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Stripe error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
