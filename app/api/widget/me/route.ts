import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const clinic = await db.clinic.findUnique({
    where: { clerkUserId: userId },
    select: { id: true, name: true, aiAgentName: true, specialties: true },
  })

  if (!clinic) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({ clinicId: clinic.id, clinicName: clinic.name })
}
