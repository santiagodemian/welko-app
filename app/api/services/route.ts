/**
 * GET  /api/services  — list services for the authenticated clinic
 * POST /api/services  — create a new service
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

async function getClinicId(userId: string) {
  const clinic = await db.clinic.findUnique({
    where: { clerkUserId: userId },
    select: { id: true },
  })
  return clinic?.id ?? null
}

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const clinicId = await getClinicId(userId)
  if (!clinicId) return NextResponse.json({ services: [] })

  const services = await db.service.findMany({
    where:   { clinicId },
    orderBy: { createdAt: 'asc' },
  })

  return NextResponse.json({ services })
}

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const clinicId = await getClinicId(userId)
  if (!clinicId) return NextResponse.json({ error: 'Clinic not found' }, { status: 404 })

  const body = await req.json()
  const { name, description, priceMin, priceMax, durationMins } = body

  if (!name?.trim())
    return NextResponse.json({ error: 'El nombre del servicio es requerido.' }, { status: 400 })

  if (priceMin != null && priceMax != null && priceMin > priceMax)
    return NextResponse.json({ error: 'El precio mínimo no puede ser mayor al máximo.' }, { status: 400 })

  const service = await db.service.create({
    data: {
      clinicId,
      name:         name.trim(),
      description:  description?.trim() || null,
      priceMin:     priceMin  ?? null,
      priceMax:     priceMax  ?? null,
      durationMins: durationMins ?? null,
    },
  })

  return NextResponse.json({ service }, { status: 201 })
}
