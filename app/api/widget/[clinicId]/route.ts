/**
 * GET /api/widget/[clinicId]
 * Public endpoint — returns safe clinic config for the embeddable widget.
 * No auth required. Only exposes non-sensitive fields.
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

const SPECIALTY_ACCENT: Record<string, string> = {
  dental:        '#3B82F6',
  psicologia:    '#8B5CF6',
  estetica:      '#EC4899',
  nutricion:     '#16A34A',
  ginecologia:   '#F472B6',
  oftalmologia:  '#6366F1',
  medica:        '#0EA5E9',
  fisioterapia:  '#0EA5E9',
  spa:           '#A78BFA',
  quiropractica: '#10B981',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS })
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ clinicId: string }> }
) {
  const { clinicId } = await params

  try {
    const clinic = await db.clinic.findUnique({
      where: { id: clinicId },
      select: {
        id: true,
        name: true,
        aiAgentName: true,
        aiTone: true,
        specialties: true,
        phone: true,
      },
    })

    if (!clinic) {
      return NextResponse.json({ error: 'Not found' }, { status: 404, headers: CORS })
    }

    const specs = (clinic.specialties as string[] | null) ?? []
    const slug  = specs[0]
      ?.toLowerCase()
      .replace(/á/g,'a').replace(/é/g,'e').replace(/í/g,'i').replace(/ó/g,'o').replace(/ú/g,'u')
      ?? 'medica'

    return NextResponse.json({
      clinicId:  clinic.id,
      clinicName: clinic.name,
      agentName: clinic.aiAgentName ?? 'Sofía',
      specialty: slug,
      accent:    SPECIALTY_ACCENT[slug] ?? '#1A2A56',
      phone:     clinic.phone ?? null,
    }, { headers: CORS })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500, headers: CORS })
  }
}
