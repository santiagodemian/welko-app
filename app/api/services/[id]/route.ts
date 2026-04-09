/**
 * PATCH  /api/services/[id]  — update a service
 * DELETE /api/services/[id]  — delete a service
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

type Params = { params: Promise<{ id: string }> }

async function getOwnedService(userId: string, serviceId: string) {
  const clinic = await db.clinic.findUnique({
    where: { clerkUserId: userId },
    select: { id: true },
  })
  if (!clinic) return null

  return db.service.findFirst({
    where: { id: serviceId, clinicId: clinic.id },
  })
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { id } = await params
  const service = await getOwnedService(userId, id)
  if (!service) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json()
  const { name, description, priceMin, priceMax, durationMins, active } = body

  if (priceMin != null && priceMax != null && priceMin > priceMax)
    return NextResponse.json({ error: 'El precio mínimo no puede ser mayor al máximo.' }, { status: 400 })

  const update: Record<string, unknown> = {}
  if (name         !== undefined) update.name         = name?.trim() || service.name
  if (description  !== undefined) update.description  = description?.trim() || null
  if (priceMin     !== undefined) update.priceMin     = priceMin ?? null
  if (priceMax     !== undefined) update.priceMax     = priceMax ?? null
  if (durationMins !== undefined) update.durationMins = durationMins ?? null
  if (active       !== undefined) update.active       = Boolean(active)

  const updated = await db.service.update({ where: { id }, data: update })
  return NextResponse.json({ service: updated })
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { id } = await params
  const service = await getOwnedService(userId, id)
  if (!service) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await db.service.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
