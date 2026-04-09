/**
 * POST /api/onboarding
 *
 * Creates or updates a Clinic record and its Services for the authenticated
 * Clerk user. Called on every "Next" step (partial saves) and on final submit.
 *
 * On final submit (onboardingCompleted: true) a customizationPrompt is
 * generated server-side from all form data and stored encrypted.
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { encrypt } from '@/lib/encryption'

/* ─── Types ─── */

interface ServiceInput {
  name: string
  description?: string
  priceMin?: number
  priceMax?: number
  durationMins?: number
}

interface FaqInput {
  question: string
  answer: string
}

type WorkingHoursInput = Record<
  string,
  { open: string; close: string; active: boolean }
>

interface OnboardingPayload {
  // Step 1 — Industria
  industry?: string

  // Step 2 — Perfil
  name?: string
  phone?: string
  address?: string
  website?: string
  specialties?: string[]

  // Step 2 — Horarios
  workingHours?: WorkingHoursInput

  // Step 3 — Servicios
  services?: ServiceInput[]

  // Step 4 — Conocimiento IA
  hasParking?: boolean
  hasInvoicing?: boolean
  cancellationPolicy?: string
  paymentMethods?: string[]
  insurancesAccepted?: string[]
  faqs?: FaqInput[]

  // Step 5 — Agente
  aiAgentName?: string
  aiTone?: string
  vapiAssistantId?: string

  // Completion flag
  onboardingCompleted?: boolean
}

/* ─── Prompt builder ─── */

function buildCustomizationPrompt(d: OnboardingPayload): string {
  const lines: string[] = []

  const agentName = d.aiAgentName?.trim() || 'la recepcionista virtual'
  const clinicName = d.name?.trim() || 'la clínica'

  lines.push(
    `Eres ${agentName}, recepcionista virtual de ${clinicName}. Tu rol es atender a los pacientes de manera eficiente, agendar citas y responder preguntas frecuentes.`,
  )

  const toneMap: Record<string, string> = {
    profesional: 'Mantén un tono profesional, claro y directo.',
    amigable:    'Usa un tono cálido, amigable y cercano. Usa emojis con moderación.',
    empático:    'Sé empático y comprensivo. Prioriza que el paciente se sienta escuchado.',
    formal:      'Sé formal y ejecutivo. Evita contracciones y lenguaje coloquial.',
  }
  lines.push(toneMap[d.aiTone ?? ''] ?? toneMap.profesional)

  lines.push('\n## Información de la Clínica')
  if (d.address)  lines.push(`Dirección: ${d.address}`)
  if (d.phone)    lines.push(`Teléfono: ${d.phone}`)
  if (d.website)  lines.push(`Sitio web: ${d.website}`)

  if (d.specialties?.length)
    lines.push(`Especialidades: ${d.specialties.join(', ')}.`)

  lines.push('\n## Horarios de Atención')
  if (d.workingHours) {
    const DAY_ES: Record<string, string> = {
      lunes: 'Lunes', martes: 'Martes', miércoles: 'Miércoles',
      jueves: 'Jueves', viernes: 'Viernes', sábado: 'Sábado', domingo: 'Domingo',
    }
    for (const [day, h] of Object.entries(d.workingHours)) {
      if (h.active) {
        lines.push(`${DAY_ES[day] ?? day}: ${h.open} – ${h.close}`)
      }
    }
    const closed = Object.entries(d.workingHours)
      .filter(([, h]) => !h.active)
      .map(([day]) => DAY_ES[day] ?? day)
    if (closed.length) lines.push(`Cerrado: ${closed.join(', ')}.`)
  }

  lines.push('\n## Servicios y Precios')
  // Services come from the DB after being saved in the transaction.
  // We pass them via payload for prompt generation.
  if ((d as { _services?: ServiceInput[] })._services?.length) {
    for (const s of (d as { _services?: ServiceInput[] })._services!) {
      const price = s.priceMin
        ? `$${s.priceMin}${s.priceMax && s.priceMax !== s.priceMin ? ` – $${s.priceMax}` : ''} MXN`
        : 'precio a consultar'
      const dur = s.durationMins ? ` · ${s.durationMins} min` : ''
      lines.push(`- ${s.name}: ${price}${dur}${s.description ? ` (${s.description})` : ''}`)
    }
  }

  lines.push('\n## Políticas y Preguntas Frecuentes')
  lines.push(d.hasParking   ? 'Sí contamos con estacionamiento.' : 'No contamos con estacionamiento propio.')
  lines.push(d.hasInvoicing ? 'Sí se emite factura electrónica (CFDI).' : 'No emitimos facturas por el momento.')

  if (d.paymentMethods?.length)
    lines.push(`Métodos de pago aceptados: ${d.paymentMethods.join(', ')}.`)

  if (d.insurancesAccepted?.length)
    lines.push(`Seguros aceptados: ${d.insurancesAccepted.join(', ')}.`)
  else
    lines.push('No trabajamos con seguros médicos directamente.')

  if (d.cancellationPolicy)
    lines.push(`Política de cancelación: ${d.cancellationPolicy}`)

  if (d.faqs?.length) {
    lines.push('\n## Otras Preguntas Frecuentes')
    for (const faq of d.faqs) {
      if (faq.question && faq.answer)
        lines.push(`P: ${faq.question}\nR: ${faq.answer}`)
    }
  }

  lines.push(
    '\n## Reglas de Comportamiento',
    '- Nunca inventes información. Si no sabes algo, ofrece transferir la llamada.',
    '- Siempre confirma la cita repitiendo día, hora y servicio antes de finalizar.',
    '- Si el paciente menciona una emergencia médica, indícale que llame al 911.',
    '- Mantén la conversación en español mexicano.',
    '- No compartas información personal de otros pacientes.',
  )

  return lines.join('\n')
}

/* ─── Route ─── */

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  let body: OnboardingPayload & { _services?: ServiceInput[] }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Require name only on first step
  if (body.name !== undefined && !body.name.trim())
    return NextResponse.json({ error: 'El nombre de la clínica es requerido.' }, { status: 422 })

  // Validate service prices
  for (const svc of body.services ?? []) {
    if (svc.priceMin != null && svc.priceMax != null && svc.priceMin > svc.priceMax)
      return NextResponse.json(
        { error: `"${svc.name}": precio mínimo no puede ser mayor al máximo.` },
        { status: 422 },
      )
  }

  // Pass services into the prompt builder
  if (body.services?.length) body._services = body.services

  // Build and encrypt customizationPrompt on final step
  let encryptedPrompt: string | undefined
  if (body.onboardingCompleted) {
    const prompt = buildCustomizationPrompt(body)
    encryptedPrompt = encrypt(prompt)
  }

  // Upsert Clinic + bulk-replace Services in a single transaction
  const clinic = await db.$transaction(async (tx) => {
    const clinicData = {
      ...(body.industry !== undefined ? { industry: body.industry } : {}),
      ...(body.name    !== undefined ? { name:    body.name.trim() } : {}),
      ...(body.phone   !== undefined ? { phone:   body.phone   } : {}),
      ...(body.address !== undefined ? { address: body.address } : {}),
      ...(body.website !== undefined ? { website: body.website } : {}),
      // Json fields must be cast to satisfy Prisma's InputJsonValue
      ...(body.specialties        !== undefined ? { specialties:        body.specialties        as unknown as object } : {}),
      ...(body.workingHours       !== undefined ? { workingHours:       body.workingHours       as unknown as object } : {}),
      ...(body.hasParking         !== undefined ? { hasParking:         body.hasParking         } : {}),
      ...(body.hasInvoicing       !== undefined ? { hasInvoicing:       body.hasInvoicing       } : {}),
      ...(body.cancellationPolicy !== undefined ? { cancellationPolicy: body.cancellationPolicy } : {}),
      ...(body.paymentMethods     !== undefined ? { paymentMethods:     body.paymentMethods     as unknown as object } : {}),
      ...(body.insurancesAccepted !== undefined ? { insurancesAccepted: body.insurancesAccepted as unknown as object } : {}),
      ...(body.faqs               !== undefined ? { faqs:               body.faqs               as unknown as object } : {}),
      ...(body.aiAgentName        !== undefined ? { aiAgentName:        body.aiAgentName        } : {}),
      ...(body.aiTone             !== undefined ? { aiTone:             body.aiTone             } : {}),
      ...(body.vapiAssistantId    !== undefined ? { vapiAssistantId:    body.vapiAssistantId    } : {}),
      ...(encryptedPrompt         !== undefined ? { customizationPrompt: encryptedPrompt        } : {}),
      ...(body.onboardingCompleted !== undefined ? { onboardingCompleted: body.onboardingCompleted } : {}),
    }

    const updated = await tx.clinic.upsert({
      where:  { clerkUserId: userId },
      create: { clerkUserId: userId, name: body.name?.trim() ?? 'Mi Clínica', ...clinicData },
      update: clinicData,
      select: { id: true },
    })

    // Bulk-replace services only when the step includes them
    if (body.services !== undefined) {
      await tx.service.deleteMany({ where: { clinicId: updated.id } })
      if (body.services.length > 0) {
        await tx.service.createMany({
          data: body.services.map((s) => ({
            clinicId:     updated.id,
            name:         s.name.trim(),
            description:  s.description?.trim() || null,
            priceMin:     s.priceMin  ?? null,
            priceMax:     s.priceMax  ?? null,
            durationMins: s.durationMins ?? null,
          })),
        })
      }
    }

    return updated
  })

  return NextResponse.json({ ok: true, clinicId: clinic.id })
}
