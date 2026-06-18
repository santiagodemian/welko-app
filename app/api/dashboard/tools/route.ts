import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

// ─── helpers ─────────────────────────────────────────────────────────────────

async function getMember(userId: string) {
  return db.agencyMember.findUnique({
    where: { clerkUserId: userId },
    select: { id: true, agencyId: true, role: true },
  })
}

function isPrivileged(role: string) {
  return role === 'AGENCY_OWNER' || role === 'MANAGER'
}

// ─── GET ─────────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const member = await getMember(userId)
  if (!member) return NextResponse.json({ error: 'Agency not found' }, { status: 403 })

  const resource = req.nextUrl.searchParams.get('resource')

  // ── GET ai-config ─────────────────────────────────────────────────────────
  if (resource === 'ai-config') {
    const config = await db.aIAgentConfig.findUnique({
      where: { agencyId: member.agencyId },
    })
    return NextResponse.json({ config })
  }

  // ── GET compliance ────────────────────────────────────────────────────────
  if (resource === 'compliance') {
    const records = await db.complianceRecord.findMany({
      where:   { agencyId: member.agencyId },
      orderBy: [{ expiryDate: 'asc' }],
    })
    return NextResponse.json({ records })
  }

  return NextResponse.json({ error: 'Unknown resource' }, { status: 400 })
}

// ─── POST ─────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const member = await getMember(userId)
  if (!member) return NextResponse.json({ error: 'Agency not found' }, { status: 403 })

  const resource = req.nextUrl.searchParams.get('resource')

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // ── POST compliance ───────────────────────────────────────────────────────
  if (resource === 'compliance') {
    if (!isPrivileged(member.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { title, type, status, entityName, referenceNumber, expiryDate, fileUrl } = body as {
      title: string
      type: string
      status: string
      entityName: string
      referenceNumber?: string
      expiryDate?: string
      fileUrl?: string
    }

    if (!title || !type || !status || !entityName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 422 })
    }

    const record = await db.complianceRecord.create({
      data: {
        agencyId:        member.agencyId,
        title,
        type:            type as 'AGENT_LICENSE' | 'GDPR_CONSENT' | 'DATA_DELETION' | 'CONTRACT_AUDIT' | 'TRANSFER_COMPLIANCE' | 'WORK_PERMIT',
        status:          status as 'VALID' | 'EXPIRING_SOON' | 'EXPIRED' | 'PENDING_REVIEW' | 'NON_COMPLIANT',
        entityName,
        referenceNumber: referenceNumber ?? null,
        expiryDate:      expiryDate ? new Date(expiryDate) : null,
        fileUrl:         fileUrl ?? null,
      },
    })

    return NextResponse.json({ record }, { status: 201 })
  }

  return NextResponse.json({ error: 'Unknown resource' }, { status: 400 })
}

// ─── PATCH ────────────────────────────────────────────────────────────────────

export async function PATCH(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const member = await getMember(userId)
  if (!member) return NextResponse.json({ error: 'Agency not found' }, { status: 403 })

  const resource = req.nextUrl.searchParams.get('resource')
  const id       = req.nextUrl.searchParams.get('id')

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // ── PATCH ai-config ───────────────────────────────────────────────────────
  if (resource === 'ai-config') {
    if (!isPrivileged(member.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const {
      contractAlertMonths,
      notificationEmails,
      autoCreateTasks,
      confidenceThreshold,
      targetPositions,
      targetLeagues,
      dataSources,
      autoTranslate,
    } = body as {
      contractAlertMonths?: number[]
      notificationEmails?: string[]
      autoCreateTasks?: boolean
      confidenceThreshold?: string
      targetPositions?: string[]
      targetLeagues?: string[]
      dataSources?: string[]
      autoTranslate?: boolean
    }

    const config = await db.aIAgentConfig.upsert({
      where: { agencyId: member.agencyId },
      update: {
        ...(contractAlertMonths !== undefined ? { contractAlertMonths } : {}),
        ...(notificationEmails  !== undefined ? { notificationEmails }  : {}),
        ...(autoCreateTasks     !== undefined ? { autoCreateTasks }     : {}),
        ...(confidenceThreshold !== undefined ? { confidenceThreshold } : {}),
        ...(targetPositions     !== undefined ? { targetPositions }     : {}),
        ...(targetLeagues       !== undefined ? { targetLeagues }       : {}),
        ...(dataSources         !== undefined ? { dataSources }         : {}),
        ...(autoTranslate       !== undefined ? { autoTranslate }       : {}),
      },
      create: {
        agencyId:             member.agencyId,
        contractAlertMonths:  contractAlertMonths  ?? [],
        notificationEmails:   notificationEmails   ?? [],
        autoCreateTasks:      autoCreateTasks      ?? true,
        confidenceThreshold:  confidenceThreshold  ?? 'MEDIUM',
        activeComparisonFactors: [],
        targetPositions:      targetPositions      ?? [],
        targetLeagues:        targetLeagues        ?? [],
        dataSources:          dataSources          ?? [],
        autoTranslate:        autoTranslate        ?? false,
      },
    })

    return NextResponse.json({ config })
  }

  // ── PATCH compliance ──────────────────────────────────────────────────────
  if (resource === 'compliance') {
    if (!isPrivileged(member.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const existing = await db.complianceRecord.findFirst({
      where: { id, agencyId: member.agencyId },
    })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const { status, title } = body as { status?: string; title?: string }

    const record = await db.complianceRecord.update({
      where: { id },
      data: {
        ...(status !== undefined ? { status: status as 'VALID' | 'EXPIRING_SOON' | 'EXPIRED' | 'PENDING_REVIEW' | 'NON_COMPLIANT' } : {}),
        ...(title  !== undefined ? { title }  : {}),
      },
    })

    return NextResponse.json({ record })
  }

  return NextResponse.json({ error: 'Unknown resource' }, { status: 400 })
}
