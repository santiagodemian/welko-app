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

// ─── GET ─────────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const member = await getMember(userId)
  if (!member) return NextResponse.json({ error: 'Agency not found' }, { status: 403 })

  const resource = req.nextUrl.searchParams.get('resource')

  // ── GET communications ────────────────────────────────────────────────────
  if (resource === 'communications') {
    const outcomeParam = req.nextUrl.searchParams.get('outcome')

    const logs = await db.communicationLog.findMany({
      where: {
        agencyId: member.agencyId,
        ...(outcomeParam ? { outcome: outcomeParam as 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' | 'FOLLOW_UP_REQUIRED' } : {}),
      },
      select: {
        id: true,
        title: true,
        summary: true,
        type: true,
        outcome: true,
        timestamp: true,
        player: { select: { fullName: true } },
        club:   { select: { name: true } },
        createdBy: { select: { fullName: true } },
      },
      orderBy: { timestamp: 'desc' },
    })

    return NextResponse.json({ logs })
  }

  // ── GET tasks ─────────────────────────────────────────────────────────────
  if (resource === 'tasks') {
    const isCompletedParam = req.nextUrl.searchParams.get('isCompleted')
    const isCompletedFilter =
      isCompletedParam === 'true'
        ? true
        : isCompletedParam === 'false'
        ? false
        : undefined

    const tasks = await db.task.findMany({
      where: {
        agencyId: member.agencyId,
        ...(isCompletedFilter !== undefined ? { isCompleted: isCompletedFilter } : {}),
      },
      select: {
        id: true,
        title: true,
        dueDate: true,
        priority: true,
        category: true,
        isCompleted: true,
        player:     { select: { fullName: true } },
        assignedTo: { select: { fullName: true } },
      },
      orderBy: [{ isCompleted: 'asc' }, { dueDate: 'asc' }],
    })

    return NextResponse.json({ tasks })
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

  // ── POST communications ───────────────────────────────────────────────────
  if (resource === 'communications') {
    const { title, summary, type, outcome, timestamp, playerId, clubId } = body as {
      title: string
      summary: string
      type: string
      outcome: string
      timestamp: string
      playerId?: string
      clubId?: string
    }

    if (!title || !summary || !type || !outcome || !timestamp) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 422 })
    }

    const log = await db.communicationLog.create({
      data: {
        agencyId:    member.agencyId,
        title,
        summary,
        type:        type as 'EMAIL' | 'CALL' | 'MEETING' | 'MESSAGE' | 'VIDEO_CALL',
        outcome:     outcome as 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' | 'FOLLOW_UP_REQUIRED',
        timestamp:   new Date(timestamp),
        playerId:    playerId ?? null,
        clubId:      clubId   ?? null,
        createdById: member.id,
      },
      select: {
        id: true,
        title: true,
        summary: true,
        type: true,
        outcome: true,
        timestamp: true,
        player:    { select: { fullName: true } },
        club:      { select: { name: true } },
        createdBy: { select: { fullName: true } },
      },
    })

    return NextResponse.json({ log }, { status: 201 })
  }

  // ── POST tasks ────────────────────────────────────────────────────────────
  if (resource === 'tasks') {
    const { title, dueDate, priority, category, playerId, assignedToId } = body as {
      title: string
      dueDate: string
      priority: string
      category: string
      playerId?: string
      assignedToId?: string
    }

    if (!title || !dueDate || !priority || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 422 })
    }

    const task = await db.task.create({
      data: {
        agencyId:    member.agencyId,
        title,
        dueDate:     new Date(dueDate),
        priority,
        category,
        isCompleted: false,
        playerId:    playerId    ?? null,
        assignedToId: assignedToId ?? member.id,
      },
      select: {
        id: true,
        title: true,
        dueDate: true,
        priority: true,
        category: true,
        isCompleted: true,
        player:     { select: { fullName: true } },
        assignedTo: { select: { fullName: true } },
      },
    })

    return NextResponse.json({ task }, { status: 201 })
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

  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // ── PATCH tasks ───────────────────────────────────────────────────────────
  if (resource === 'tasks') {
    const existing = await db.task.findFirst({
      where: { id, agencyId: member.agencyId },
    })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const { isCompleted, title, dueDate, priority } = body as {
      isCompleted?: boolean
      title?: string
      dueDate?: string
      priority?: string
    }

    const task = await db.task.update({
      where: { id },
      data: {
        ...(isCompleted !== undefined ? { isCompleted } : {}),
        ...(title      !== undefined ? { title }       : {}),
        ...(dueDate    !== undefined ? { dueDate: new Date(dueDate) } : {}),
        ...(priority   !== undefined ? { priority }    : {}),
      },
      select: {
        id: true,
        title: true,
        dueDate: true,
        priority: true,
        category: true,
        isCompleted: true,
        player:     { select: { fullName: true } },
        assignedTo: { select: { fullName: true } },
      },
    })

    return NextResponse.json({ task })
  }

  return NextResponse.json({ error: 'Unknown resource' }, { status: 400 })
}
