/**
 * DELETE /api/voice/deactivate — removes the Vapi assistant and releases the phone number
 */

import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

const VAPI = 'https://api.vapi.ai'
const KEY  = () => process.env.VAPI_PRIVATE_KEY!

async function vapiDelete(path: string) {
  await fetch(`${VAPI}${path}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${KEY()}` },
  })
}

export async function DELETE() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const clinic = await db.clinic.findUnique({
    where: { clerkUserId: userId },
    select: { id: true, vapiAssistantId: true, vapiPhoneNumberId: true },
  })
  if (!clinic) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  if (clinic.vapiPhoneNumberId) await vapiDelete(`/phone-number/${clinic.vapiPhoneNumberId}`)
  if (clinic.vapiAssistantId)   await vapiDelete(`/assistant/${clinic.vapiAssistantId}`)

  await db.clinic.update({
    where: { id: clinic.id },
    data: { vapiAssistantId: null, vapiPhoneNumberId: null, voicePhoneNumber: null },
  })

  return NextResponse.json({ ok: true })
}
