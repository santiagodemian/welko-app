import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { CommissionStatus } from '@prisma/client'

// PATCH — update commission status
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { id } = await params

  const member = await db.agencyMember.findUnique({
    where: { clerkUserId: userId },
    select: { agencyId: true },
  })
  if (!member) return NextResponse.json({ error: 'Agency not found' }, { status: 403 })

  let body: { status?: string; receivedAt?: string | null }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const validStatuses = Object.values(CommissionStatus) as string[]
  const data: Record<string, string | Date | null> = {}

  if (body.status && validStatuses.includes(body.status)) {
    data.status = body.status
    if (body.status === 'RECEIVED') {
      data.receivedAt = body.receivedAt ? new Date(body.receivedAt) : new Date()
    }
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: 'No valid fields' }, { status: 422 })
  }

  const result = await db.dealCommission.updateMany({
    where: { id, agencyId: member.agencyId },
    data,
  })

  if (result.count === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({ ok: true })
}

// DELETE
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { id } = await params

  const member = await db.agencyMember.findUnique({
    where: { clerkUserId: userId },
    select: { agencyId: true },
  })
  if (!member) return NextResponse.json({ error: 'Agency not found' }, { status: 403 })

  await db.dealCommission.deleteMany({
    where: { id, agencyId: member.agencyId },
  })

  return NextResponse.json({ ok: true })
}
