/**
 * GET /api/voice/status — returns current voice configuration for the clinic
 */

import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const clinic = await db.clinic.findUnique({
    where: { clerkUserId: userId },
    select: {
      vapiAssistantId:   true,
      vapiPhoneNumberId: true,
      voicePhoneNumber:  true,
      name:              true,
    },
  })

  if (!clinic) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({
    active:           !!clinic.vapiAssistantId,
    assistantId:      clinic.vapiAssistantId,
    phoneNumber:      clinic.voicePhoneNumber,
    phoneNumberId:    clinic.vapiPhoneNumberId,
    clinicName:       clinic.name,
  })
}
