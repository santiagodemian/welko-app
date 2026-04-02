/**
 * GET  /api/whatsapp  — returns current whatsappPhone for this clinic
 * POST /api/whatsapp  — saves whatsappPhone { phone: string }
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const clinic = await db.clinic.findUnique({
    where: { clerkUserId: userId },
    select: { whatsappPhone: true },
  })

  return NextResponse.json({ phone: clinic?.whatsappPhone ?? null })
}

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { phone } = await req.json()

  // Basic E.164 validation or empty string to unset
  const normalized = typeof phone === 'string' ? phone.trim() : ''
  if (normalized && !/^\+\d{7,15}$/.test(normalized)) {
    return NextResponse.json({ error: 'Formato inválido. Usa E.164, e.g. +521234567890' }, { status: 400 })
  }

  const clinic = await db.clinic.upsert({
    where:  { clerkUserId: userId },
    update: { whatsappPhone: normalized || null },
    create: { clerkUserId: userId, name: 'Mi Clínica', whatsappPhone: normalized || null },
    select: { id: true, whatsappPhone: true },
  })

  return NextResponse.json({ phone: clinic.whatsappPhone })
}
