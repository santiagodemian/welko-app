/**
 * GET  /api/branches  — list branches for the authenticated clinic
 * POST /api/branches  — create a new branch (Business plan only)
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

async function getClinic(userId: string) {
  return db.clinic.findUnique({
    where: { clerkUserId: userId },
    select: { id: true, plan: true, name: true },
  })
}

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const clinic = await getClinic(userId)
  if (!clinic) return NextResponse.json({ branches: [] })

  const branches = await db.branch.findMany({
    where:   { clinicId: clinic.id },
    orderBy: { createdAt: 'asc' },
  })

  return NextResponse.json({ branches, plan: clinic.plan })
}

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const clinic = await getClinic(userId)
  if (!clinic) return NextResponse.json({ error: 'Clinic not found' }, { status: 404 })

  if (clinic.plan !== 'business') {
    return NextResponse.json({ error: 'Se requiere el plan Business para agregar sucursales.' }, { status: 403 })
  }

  const body = await req.json()
  const { name, address, phone, whatsappPhone, managerName, workingHours } = body

  if (!name?.trim()) {
    return NextResponse.json({ error: 'El nombre de la sucursal es requerido.' }, { status: 400 })
  }

  const branch = await db.branch.create({
    data: {
      clinicId:     clinic.id,
      name:         name.trim(),
      address:      address?.trim() || null,
      phone:        phone?.trim() || null,
      whatsappPhone: whatsappPhone?.trim() || null,
      managerName:  managerName?.trim() || null,
      workingHours: workingHours ?? null,
    },
  })

  return NextResponse.json({ branch }, { status: 201 })
}
