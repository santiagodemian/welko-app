/**
 * CRM label and column definitions per industry.
 *
 * The Lead model keeps the same LeadStatus enum across all industries.
 * This file maps those enum values to industry-specific display labels,
 * so the Kanban and CRM tables feel native to each type of business.
 */

export interface CRMConfig {
  // What to call the "client" in this industry
  clientLabel:      { es: string; en: string }
  // What to call an "appointment / order / reservation"
  eventLabel:       { es: string; en: string }
  // What to call the "notes" field
  notesLabel:       { es: string; en: string }
  // Kanban column labels per LeadStatus
  kanban: {
    NUEVO:             { es: string; en: string; color: string }
    EN_SEGUIMIENTO_IA: { es: string; en: string; color: string }
    CITA_CONFIRMADA:   { es: string; en: string; color: string }
    REVENUE_CERRADO:   { es: string; en: string; color: string }
    PERDIDO:           { es: string; en: string; color: string }
  }
  // Extra hint shown in the "new" column
  newHint?: { es: string; en: string }
}

const DEFAULT: CRMConfig = {
  clientLabel: { es: 'Cliente', en: 'Client' },
  eventLabel:  { es: 'Cita', en: 'Appointment' },
  notesLabel:  { es: 'Notas', en: 'Notes' },
  kanban: {
    NUEVO:             { es: 'Nuevo',             en: 'New',          color: '#6B7280' },
    EN_SEGUIMIENTO_IA: { es: 'En seguimiento IA', en: 'AI Follow-up', color: '#3B82F6' },
    CITA_CONFIRMADA:   { es: 'Cita confirmada',   en: 'Confirmed',    color: '#8B5CF6' },
    REVENUE_CERRADO:   { es: 'Cerrado',           en: 'Closed',       color: '#10B981' },
    PERDIDO:           { es: 'Perdido',           en: 'Lost',         color: '#EF4444' },
  },
}

const HEALTH: CRMConfig = {
  clientLabel: { es: 'Paciente', en: 'Patient' },
  eventLabel:  { es: 'Cita médica', en: 'Appointment' },
  notesLabel:  { es: 'Notas clínicas', en: 'Clinical notes' },
  kanban: {
    NUEVO:             { es: 'Nuevo consultor',    en: 'New inquiry',    color: '#6B7280' },
    EN_SEGUIMIENTO_IA: { es: 'En seguimiento IA',  en: 'AI Follow-up',   color: '#3B82F6' },
    CITA_CONFIRMADA:   { es: 'Cita confirmada',    en: 'Appt confirmed', color: '#8B5CF6' },
    REVENUE_CERRADO:   { es: 'Cita realizada',     en: 'Visit completed', color: '#10B981' },
    PERDIDO:           { es: 'No concretado',      en: 'Not converted',  color: '#EF4444' },
  },
}

const RESTAURANT: CRMConfig = {
  clientLabel: { es: 'Cliente', en: 'Customer' },
  eventLabel:  { es: 'Pedido', en: 'Order' },
  notesLabel:  { es: 'Detalles del pedido', en: 'Order details' },
  kanban: {
    NUEVO:             { es: 'Pedido recibido',    en: 'Order received',  color: '#F59E0B' },
    EN_SEGUIMIENTO_IA: { es: 'En preparación',     en: 'In preparation',  color: '#F97316' },
    CITA_CONFIRMADA:   { es: 'Listo para entrega', en: 'Ready to deliver', color: '#8B5CF6' },
    REVENUE_CERRADO:   { es: 'Entregado',          en: 'Delivered',       color: '#10B981' },
    PERDIDO:           { es: 'Cancelado',          en: 'Cancelled',       color: '#EF4444' },
  },
  newHint: { es: 'Pedido o reservación recibida', en: 'Order or reservation received' },
}

const BARBERSHOP: CRMConfig = {
  clientLabel: { es: 'Cliente', en: 'Client' },
  eventLabel:  { es: 'Turno', en: 'Appointment' },
  notesLabel:  { es: 'Estilo y preferencias', en: 'Style & preferences' },
  kanban: {
    NUEVO:             { es: 'Solicitud',        en: 'Request',       color: '#6B7280' },
    EN_SEGUIMIENTO_IA: { es: 'Confirmado',       en: 'Confirmed',     color: '#3B82F6' },
    CITA_CONFIRMADA:   { es: 'En atención',      en: 'In progress',   color: '#8B5CF6' },
    REVENUE_CERRADO:   { es: 'Completado',       en: 'Completed',     color: '#10B981' },
    PERDIDO:           { es: 'Cancelado',        en: 'Cancelled',     color: '#EF4444' },
  },
}

const SPA: CRMConfig = {
  clientLabel: { es: 'Cliente', en: 'Client' },
  eventLabel:  { es: 'Reservación', en: 'Booking' },
  notesLabel:  { es: 'Preferencias de tratamiento', en: 'Treatment preferences' },
  kanban: {
    NUEVO:             { es: 'Consulta',            en: 'Inquiry',        color: '#6B7280' },
    EN_SEGUIMIENTO_IA: { es: 'Cotización enviada',  en: 'Quote sent',     color: '#A855F7' },
    CITA_CONFIRMADA:   { es: 'Reservado',           en: 'Booked',         color: '#8B5CF6' },
    REVENUE_CERRADO:   { es: 'Completado',          en: 'Completed',      color: '#10B981' },
    PERDIDO:           { es: 'Cancelado',           en: 'Cancelled',      color: '#EF4444' },
  },
}

const FITNESS: CRMConfig = {
  clientLabel: { es: 'Prospecto / Miembro', en: 'Prospect / Member' },
  eventLabel:  { es: 'Tour / Registro', en: 'Tour / Sign-up' },
  notesLabel:  { es: 'Objetivos y preferencias', en: 'Goals & preferences' },
  kanban: {
    NUEVO:             { es: 'Consulta',        en: 'Inquiry',       color: '#EF4444' },
    EN_SEGUIMIENTO_IA: { es: 'Tour agendado',   en: 'Tour booked',   color: '#F97316' },
    CITA_CONFIRMADA:   { es: 'Tour realizado',  en: 'Tour done',     color: '#8B5CF6' },
    REVENUE_CERRADO:   { es: 'Inscrito',        en: 'Enrolled',      color: '#10B981' },
    PERDIDO:           { es: 'No inscrito',     en: 'Not enrolled',  color: '#EF4444' },
  },
}

const HOTEL: CRMConfig = {
  clientLabel: { es: 'Huésped', en: 'Guest' },
  eventLabel:  { es: 'Reservación', en: 'Reservation' },
  notesLabel:  { es: 'Solicitudes y preferencias', en: 'Requests & preferences' },
  kanban: {
    NUEVO:             { es: 'Consulta',           en: 'Inquiry',         color: '#6B7280' },
    EN_SEGUIMIENTO_IA: { es: 'Cotización enviada', en: 'Quote sent',      color: '#D97706' },
    CITA_CONFIRMADA:   { es: 'Reservado',          en: 'Reserved',        color: '#8B5CF6' },
    REVENUE_CERRADO:   { es: 'Check-out',          en: 'Checked-out',     color: '#10B981' },
    PERDIDO:           { es: 'Cancelado',          en: 'Cancelled',       color: '#EF4444' },
  },
}

const LEGAL: CRMConfig = {
  clientLabel: { es: 'Cliente potencial', en: 'Prospect' },
  eventLabel:  { es: 'Consulta', en: 'Consultation' },
  notesLabel:  { es: 'Tipo de caso y detalles', en: 'Case type & details' },
  kanban: {
    NUEVO:             { es: 'Lead calificado',   en: 'Qualified lead',   color: '#6B7280' },
    EN_SEGUIMIENTO_IA: { es: 'Contactado',        en: 'Contacted',        color: '#374151' },
    CITA_CONFIRMADA:   { es: 'Consulta agendada', en: 'Consultation set', color: '#8B5CF6' },
    REVENUE_CERRADO:   { es: 'Cliente firmado',   en: 'Client signed',    color: '#10B981' },
    PERDIDO:           { es: 'No calificó',       en: 'Not qualified',    color: '#EF4444' },
  },
}

const ACCOUNTING: CRMConfig = {
  clientLabel: { es: 'Empresa / Cliente', en: 'Company / Client' },
  eventLabel:  { es: 'Reunión', en: 'Meeting' },
  notesLabel:  { es: 'Tipo de servicio requerido', en: 'Service type required' },
  kanban: {
    NUEVO:             { es: 'Prospecto',         en: 'Prospect',     color: '#6B7280' },
    EN_SEGUIMIENTO_IA: { es: 'En contacto',       en: 'In contact',   color: '#0F766E' },
    CITA_CONFIRMADA:   { es: 'Reunión agendada',  en: 'Meeting set',  color: '#8B5CF6' },
    REVENUE_CERRADO:   { es: 'Cliente firmado',   en: 'Client signed', color: '#10B981' },
    PERDIDO:           { es: 'No calificó',       en: 'Not qualified', color: '#EF4444' },
  },
}

// Map industry slug → CRM config
const INDUSTRY_CRM_MAP: Record<string, CRMConfig> = {
  dental:          HEALTH,
  estetica:        HEALTH,
  psicologia:      HEALTH,
  medicina:        HEALTH,
  nutricion:       HEALTH,
  fisioterapia:    HEALTH,
  ginecologia:     HEALTH,
  oftalmologia:    HEALTH,
  pediatria:       HEALTH,
  veterinaria:     { ...HEALTH, clientLabel: { es: 'Dueño / Mascota', en: 'Owner / Pet' }, eventLabel: { es: 'Consulta veterinaria', en: 'Vet appointment' } },

  restaurante:     RESTAURANT,

  barberia:        BARBERSHOP,
  'spa-salon':     SPA,

  fitness:         FITNESS,
  'yoga-wellness': FITNESS,

  hotel:           HOTEL,

  legal:           LEGAL,
  contabilidad:    ACCOUNTING,
}

export function getCRMConfig(industrySlug: string): CRMConfig {
  return INDUSTRY_CRM_MAP[industrySlug] ?? DEFAULT
}
