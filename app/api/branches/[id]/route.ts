/**
 * PATCH  /api/branches/[id]  — update a branch
 * DELETE /api/branches/[id]  — delete a branch
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

type Params = { params: Promise<{ id: string }> }

async function getOwnedBranch(userId: string, branchId: string) {
  const clinic = await db.clinic.findUnique({
    where: { clerkUserId: userId },
    select: { id: true },
  })
  if (!clinic) return null

  return db.branch.findFirst({
    where: { id: branchId, clinicId: clinic.id },
  })
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { id } = await params
  const branch = await getOwnedBranch(userId, id)
  if (!branch) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json()
  const { name, address, phone, whatsappPhone, managerName, workingHours, active } = body

  const update: Record<string, unknown> = {}
  if (name         !== undefined) update.name          = name?.trim() || branch.name
  if (address      !== undefined) update.address       = address?.trim() || null
  if (phone        !== undefined) update.phone         = phone?.trim() || null
  if (whatsappPhone!== undefined) update.whatsappPhone = whatsappPhone?.trim() || null
  if (managerName  !== undefined) update.managerName   = managerName?.trim() || null
  if (workingHours !== undefined) update.workingHours  = workingHours
  if (active       !== undefined) update.active        = Boolean(active)

  const updated = await db.branch.update({ where: { id }, data: update })
  return NextResponse.json({ branch: updated })
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { id } = await params
  const branch = await getOwnedBranch(userId, id)
  if (!branch) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await db.branch.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
