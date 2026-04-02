/**
 * GET  /api/ai-config  — returns current AI agent config for the clinic
 * POST /api/ai-config  — saves updated AI agent config
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const clinic = await db.clinic.findUnique({
    where: { clerkUserId: userId },
    select: {
      id: true,
      name: true,
      phone: true,
      address: true,
      website: true,
      specialties: true,
      workingHours: true,
      aiAgentName: true,
      aiTone: true,
      paymentMethods: true,
      insurancesAccepted: true,
      cancellationPolicy: true,
      hasParking: true,
      hasInvoicing: true,
      faqs: true,
      services: { where: { active: true }, select: { id: true, name: true, priceMin: true, priceMax: true, durationMins: true } },
    },
  })

  if (!clinic) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(clinic)
}

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()

  const {
    name, phone, address, website, specialties,
    workingHours, aiAgentName, aiTone,
    paymentMethods, insurancesAccepted, cancellationPolicy,
    hasParking, hasInvoicing, faqs,
  } = body

  await db.clinic.upsert({
    where:  { clerkUserId: userId },
    update: {
      name:               name              ?? undefined,
      phone:              phone             ?? undefined,
      address:            address           ?? undefined,
      website:            website           ?? undefined,
      specialties:        specialties       ?? undefined,
      workingHours:       workingHours      ?? undefined,
      aiAgentName:        aiAgentName       ?? undefined,
      aiTone:             aiTone            ?? undefined,
      paymentMethods:     paymentMethods    ?? undefined,
      insurancesAccepted: insurancesAccepted ?? undefined,
      cancellationPolicy: cancellationPolicy ?? undefined,
      hasParking:         hasParking        ?? undefined,
      hasInvoicing:       hasInvoicing      ?? undefined,
      faqs:               faqs              ?? undefined,
    },
    create: {
      clerkUserId:        userId,
      name:               name        || 'Mi Clínica',
      phone:              phone       || null,
      address:            address     || null,
      website:            website     || null,
      specialties:        specialties || [],
      workingHours:       workingHours || null,
      aiAgentName:        aiAgentName || 'Sofía',
      aiTone:             aiTone      || 'profesional',
      paymentMethods:     paymentMethods    || [],
      insurancesAccepted: insurancesAccepted || [],
      cancellationPolicy: cancellationPolicy || null,
      hasParking:         hasParking  ?? false,
      hasInvoicing:       hasInvoicing ?? false,
      faqs:               faqs        || [],
    },
  })

  return NextResponse.json({ ok: true })
}
