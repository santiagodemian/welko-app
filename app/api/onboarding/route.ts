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

/* ─── Industry vocabulary ─── */

interface IndustryVocab {
  businessLabel: string   // "la clínica" / "el restaurante"
  clientLabel:   string   // "el paciente" / "el cliente"
  eventLabel:    string   // "cita" / "pedido"
  roleDesc:      string   // "agendar citas" / "tomar pedidos"
  infoSection:   string   // "## Información de la Clínica"
  rules:         string[]
}

function getIndustryVocab(industry?: string): IndustryVocab {
  switch (industry) {
    case 'restaurante':
      return {
        businessLabel: 'el restaurante', clientLabel: 'el cliente', eventLabel: 'pedido o reservación',
        roleDesc: 'tomar pedidos, gestionar reservaciones y responder preguntas',
        infoSection: '## Información del Restaurante',
        rules: [
          '- Nunca inventes precios ni disponibilidad. Si no sabes algo, ofrece comunicar con el equipo.',
          '- Confirma siempre la hora de reservación y número de personas.',
          '- Si hay lista de espera, informa el tiempo estimado.',
          '- Mantén la conversación en español mexicano.',
        ],
      }
    case 'barberia': case 'spa-salon':
      return {
        businessLabel: 'el establecimiento', clientLabel: 'el cliente', eventLabel: 'turno o cita',
        roleDesc: 'agendar turnos, confirmar citas y responder preguntas sobre servicios',
        infoSection: '## Información del Establecimiento',
        rules: [
          '- Nunca inventes precios ni disponibilidad de estilistas.',
          '- Confirma siempre el servicio, el estilista y el horario al agendar.',
          '- Mantén la conversación en español mexicano.',
        ],
      }
    case 'fitness': case 'yoga-wellness':
      return {
        businessLabel: 'el gimnasio', clientLabel: 'el prospecto o miembro', eventLabel: 'tour o inscripción',
        roleDesc: 'agendar tours, responder sobre planes de membresía y procesar inscripciones',
        infoSection: '## Información del Gimnasio',
        rules: [
          '- Siempre invita al prospecto a agendar un tour antes de decidir.',
          '- Nunca inventes precios de membresías.',
          '- Mantén la conversación en español mexicano.',
        ],
      }
    case 'hotel':
      return {
        businessLabel: 'el hotel', clientLabel: 'el huésped', eventLabel: 'reservación',
        roleDesc: 'gestionar reservaciones, informar sobre disponibilidad y responder preguntas',
        infoSection: '## Información del Hotel',
        rules: [
          '- Confirma siempre fechas de llegada, salida y tipo de habitación.',
          '- Nunca confirmes disponibilidad sin verificar. Ofrece consultar y confirmar.',
          '- Mantén la conversación en español mexicano.',
        ],
      }
    case 'legal':
      return {
        businessLabel: 'el despacho', clientLabel: 'el cliente potencial', eventLabel: 'consulta',
        roleDesc: 'agendar consultas iniciales, calificar el tipo de caso y responder preguntas generales',
        infoSection: '## Información del Despacho',
        rules: [
          '- Nunca des asesoría legal específica; agenda una consulta.',
          '- Confirma siempre el tipo de caso antes de agendar.',
          '- Mantén un tono profesional y discreto.',
          '- Mantén la conversación en español mexicano.',
        ],
      }
    case 'contabilidad':
      return {
        businessLabel: 'el despacho contable', clientLabel: 'el cliente o empresa', eventLabel: 'reunión',
        roleDesc: 'agendar reuniones, identificar necesidades del cliente y responder preguntas sobre servicios',
        infoSection: '## Información del Despacho Contable',
        rules: [
          '- Nunca des asesoría fiscal específica; agenda una reunión.',
          '- Identifica el tipo de empresa y necesidad antes de agendar.',
          '- Mantén la conversación en español mexicano.',
        ],
      }
    default:
      // Health industries (dental, estetica, psicologia, medicina, etc.) and generic
      return {
        businessLabel: 'la clínica o consultorio', clientLabel: 'el paciente', eventLabel: 'cita',
        roleDesc: 'agendar citas, confirmar asistencias y responder preguntas frecuentes',
        infoSection: '## Información del Consultorio',
        rules: [
          '- Nunca inventes información médica ni diagnósticos.',
          '- Siempre confirma la cita repitiendo día, hora y servicio antes de finalizar.',
          '- Si el paciente menciona una emergencia médica, indícale que llame al 911.',
          '- Mantén la conversación en español mexicano.',
          '- No compartas información personal de otros pacientes.',
        ],
      }
  }
}

/* ─── Prompt builder ─── */

function buildCustomizationPrompt(d: OnboardingPayload): string {
  const lines: string[] = []
  const vocab = getIndustryVocab(d.industry)

  const agentName  = d.aiAgentName?.trim() || 'tu asistente virtual'
  const bizName    = d.name?.trim()        || 'el negocio'

  lines.push(
    `Eres ${agentName}, asistente virtual de ${bizName}. Tu rol es ${vocab.roleDesc} para ${vocab.clientLabel}s de manera eficiente y profesional.`,
  )

  const toneMap: Record<string, string> = {
    profesional: 'Mantén un tono profesional, claro y directo.',
    amigable:    'Usa un tono cálido, amigable y cercano. Usa emojis con moderación.',
    empático:    'Sé empático y comprensivo. Prioriza que el cliente se sienta escuchado.',
    formal:      'Sé formal y ejecutivo. Evita contracciones y lenguaje coloquial.',
  }
  lines.push(toneMap[d.aiTone ?? ''] ?? toneMap.profesional)

  lines.push(`\n${vocab.infoSection}`)
  if (d.address)  lines.push(`Dirección: ${d.address}`)
  if (d.phone)    lines.push(`Teléfono: ${d.phone}`)
  if (d.website)  lines.push(`Sitio web: ${d.website}`)
  if (d.specialties?.length)
    lines.push(`Especialidades / servicios principales: ${d.specialties.join(', ')}.`)

  lines.push('\n## Horarios de Atención')
  if (d.workingHours) {
    const DAY_ES: Record<string, string> = {
      lunes: 'Lunes', martes: 'Martes', miércoles: 'Miércoles',
      jueves: 'Jueves', viernes: 'Viernes', sábado: 'Sábado', domingo: 'Domingo',
    }
    for (const [day, h] of Object.entries(d.workingHours)) {
      if (h.active) lines.push(`${DAY_ES[day] ?? day}: ${h.open} – ${h.close}`)
    }
    const closed = Object.entries(d.workingHours)
      .filter(([, h]) => !h.active).map(([day]) => DAY_ES[day] ?? day)
    if (closed.length) lines.push(`Cerrado: ${closed.join(', ')}.`)
  }

  lines.push('\n## Servicios y Precios')
  if ((d as { _services?: ServiceInput[] })._services?.length) {
    for (const s of (d as { _services?: ServiceInput[] })._services!) {
      const price = s.priceMin
        ? `$${s.priceMin}${s.priceMax && s.priceMax !== s.priceMin ? ` – $${s.priceMax}` : ''} MXN`
        : 'precio a consultar'
      const dur = s.durationMins ? ` · ${s.durationMins} min` : ''
      lines.push(`- ${s.name}: ${price}${dur}${s.description ? ` (${s.description})` : ''}`)
    }
  }

  lines.push('\n## Políticas')
  lines.push(d.hasParking   ? 'Sí contamos con estacionamiento.' : 'No contamos con estacionamiento propio.')
  lines.push(d.hasInvoicing ? 'Sí se emite factura electrónica (CFDI).' : 'No emitimos facturas por el momento.')

  if (d.paymentMethods?.length)
    lines.push(`Métodos de pago: ${d.paymentMethods.join(', ')}.`)

  if (d.insurancesAccepted?.length)
    lines.push(`Convenios / seguros aceptados: ${d.insurancesAccepted.join(', ')}.`)

  if (d.cancellationPolicy)
    lines.push(`Política de cancelación: ${d.cancellationPolicy}`)

  if (d.faqs?.length) {
    lines.push('\n## Preguntas Frecuentes')
    for (const faq of d.faqs) {
      if (faq.question && faq.answer)
        lines.push(`P: ${faq.question}\nR: ${faq.answer}`)
    }
  }

  lines.push('\n## Reglas de Comportamiento', ...vocab.rules, '- Nunca inventes información. Si no sabes algo, ofrece comunicarte con el equipo.')

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

  // Require name only when sent
  if (body.name !== undefined && !body.name.trim())
    return NextResponse.json({ error: 'El nombre del negocio es requerido.' }, { status: 422 })

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
