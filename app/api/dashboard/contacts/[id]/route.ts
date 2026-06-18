import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

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

  let body: Record<string, string | null>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const allowed = ['clubName', 'country', 'fullName', 'role', 'email', 'phone', 'whatsapp', 'notes']
  const data: Record<string, string | null> = {}
  for (const key of allowed) {
    if (key in body) {
      const v = body[key]
      data[key] = (v === '' || v === undefined) ? null : v
    }
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: 'No valid fields' }, { status: 422 })
  }

  const result = await db.clubContact.updateMany({
    where: { id, agencyId: member.agencyId },
    data,
  })

  if (result.count === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({ ok: true })
}

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

  await db.clubContact.deleteMany({
    where: { id, agencyId: member.agencyId },
  })

  return NextResponse.json({ ok: true })
}
