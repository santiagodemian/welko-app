export type FieldType = 'radio' | 'multiselect' | 'text' | 'number' | 'textarea' | 'select'

export interface SpecialtyStep {
  id: string
  title: string
  subtitle?: string
  field: {
    type: FieldType
    options?: string[]
    placeholder?: string
    required: boolean
  }
}

export interface SpecialtyConfig {
  slug: string
  label: string
  emoji: string
  steps: SpecialtyStep[]
}

const SPECIALTIES: SpecialtyConfig[] = [
  /* ── Dental ── */
  {
    slug: 'dental',
    label: 'Odontología',
    emoji: '',
    steps: [
      {
        id: 'software',
        title: '¿Usas algún software para gestionar tu agenda?',
        subtitle: 'Esto nos ayuda a conectar Welko con tus herramientas actuales.',
        field: { type: 'radio', options: ['Dentix', 'Clinic Cloud', 'Dentiplus', 'Google Calendar', 'Excel / Papel', 'Otro'], required: true },
      },
      {
        id: 'tratamientos',
        title: '¿Cuáles son tus tratamientos más frecuentes?',
        subtitle: 'Selecciona todos los que apliquen.',
        field: { type: 'multiselect', options: ['Limpieza dental', 'Ortodoncia', 'Implantes dentales', 'Blanqueamiento', 'Endodoncia', 'Cirugía oral', 'Odontopediatría', 'Periodoncia', 'Carillas'], required: true },
      },
      {
        id: 'sillones',
        title: '¿Cuántos sillones dentales tiene tu consultorio?',
        field: { type: 'radio', options: ['1 sillón', '2 sillones', '3 sillones', '4 o más'], required: true },
      },
      {
        id: 'seguros',
        title: '¿Aceptas seguros médicos o convenios empresariales?',
        field: { type: 'multiselect', options: ['IMSS', 'ISSSTE', 'GNP', 'AXA', 'Seguros Monterrey', 'Convenio empresarial propio', 'No, solo consulta privada'], required: true },
      },
      {
        id: 'valoracion',
        title: '¿Cómo quieres que la IA presente el costo de los tratamientos?',
        subtitle: 'Esto define cómo Welko responde cuando preguntan por precios.',
        field: { type: 'radio', options: ['Dar rangos de precio aproximados', 'Solo decir que se cotiza en consulta', 'Redirigir siempre a WhatsApp con un humano'], required: true },
      },
    ],
  },

  /* ── Psicología ── */
  {
    slug: 'psicologia',
    label: 'Psicología',
    emoji: '',
    steps: [
      {
        id: 'confidencialidad',
        title: '¿Cómo manejas la confidencialidad con tus pacientes?',
        subtitle: 'Welko se asegura de que la IA respete siempre tus protocolos.',
        field: { type: 'radio', options: ['Tengo consentimiento informado digital', 'Uso formatos físicos en consulta', 'Aún no tengo un protocolo formal'], required: true },
      },
      {
        id: 'crisis',
        title: '¿Tienes un protocolo establecido para situaciones de crisis?',
        subtitle: 'La IA nunca maneja una crisis sola — siempre escala a un humano.',
        field: { type: 'radio', options: ['Sí, tengo un protocolo claro y quiero que la IA lo siga', 'Sí, pero prefiero que la IA escale inmediatamente', 'No, prefiero que la IA siempre me notifique y yo responda'], required: true },
      },
      {
        id: 'modalidad',
        title: '¿Qué modalidad de terapia ofreces?',
        field: { type: 'multiselect', options: ['Presencial', 'En línea (videollamada)', 'Híbrida (presencial + online)', 'Chat de texto'], required: true },
      },
      {
        id: 'sesiones',
        title: '¿Con qué frecuencia suelen agendar tus pacientes?',
        field: { type: 'radio', options: ['Semanal', 'Quincenal', 'Mensual', 'Varía por paciente'], required: true },
      },
      {
        id: 'enfoque',
        title: '¿Cuáles son tus áreas de especialización?',
        subtitle: 'La IA responderá con mayor precisión sobre lo que puedes atender.',
        field: { type: 'multiselect', options: ['Terapia individual adultos', 'Terapia de pareja', 'Terapia infantil', 'Terapia familiar', 'Psicología organizacional', 'Neuropsicología', 'Adicciones', 'Duelo y pérdida'], required: true },
      },
    ],
  },

  /* ── Estética ── */
  {
    slug: 'estetica',
    label: 'Medicina Estética',
    emoji: '',
    steps: [
      {
        id: 'especialidad',
        title: '¿Cuál es tu rama principal?',
        field: { type: 'radio', options: ['Medicina estética no invasiva', 'Cirugía plástica y reconstructiva', 'Dermatología estética', 'Spa & bienestar integral'], required: true },
      },
      {
        id: 'tratamientos',
        title: '¿Cuáles son tus tratamientos estrella?',
        subtitle: 'La IA los promoverá de forma natural en las conversaciones.',
        field: { type: 'multiselect', options: ['Botox / Toxina botulínica', 'Rellenos dérmicos', 'Diseño de sonrisa estética', 'Láser fraccionado', 'Faciales médicos', 'Reducción de grasa localizada', 'Rinomodelación', 'PRP', 'Blefaroplastia'], required: true },
      },
      {
        id: 'paquetes',
        title: '¿Ofreces paquetes, membresías o programas de resultados?',
        field: { type: 'radio', options: ['Sí, tengo paquetes definidos', 'Sí, pero son personalizados por paciente', 'No, cobro por sesión'], required: true },
      },
      {
        id: 'fotos',
        title: '¿Cómo manejas las fotos de antes/después?',
        subtitle: 'Esto define si la IA puede mencionar o solicitar fotos de diagnóstico.',
        field: { type: 'radio', options: ['Sí, las comparto con permiso del paciente', 'Solo internamente, no las publico', 'No manejo fotos en el proceso de citas'], required: true },
      },
    ],
  },

  /* ── Nutrición ── */
  {
    slug: 'nutricion',
    label: 'Nutrición',
    emoji: '',
    steps: [
      {
        id: 'enfoque',
        title: '¿Cuál es tu enfoque nutricional principal?',
        field: { type: 'radio', options: ['Nutrición clínica / enfermedades crónicas', 'Nutrición deportiva y rendimiento', 'Nutrición pediátrica', 'Nutrición bariátrica', 'Nutrición integrativa y funcional'], required: true },
      },
      {
        id: 'seguimiento',
        title: '¿Con qué frecuencia ves a tus pacientes para seguimiento?',
        field: { type: 'radio', options: ['Semanal durante el primer mes', 'Quincenal', 'Mensual', 'Varía según el objetivo del paciente'], required: true },
      },
      {
        id: 'virtual',
        title: '¿Realizas consultas virtuales?',
        field: { type: 'radio', options: ['Sí, todas mis consultas son virtuales', 'Sí, ofrezco ambas modalidades', 'No, solo presencial'], required: true },
      },
      {
        id: 'mediciones',
        title: '¿Realizas mediciones antropométricas en consulta?',
        subtitle: 'Peso, porcentaje de grasa, IMC, etc.',
        field: { type: 'radio', options: ['Sí, tengo báscula y cinta métrica', 'Sí, tengo báscula de bioimpedancia', 'No, solo evalúo por historial y fotos', 'Depende del paciente'], required: true },
      },
    ],
  },

  /* ── Ginecología ── */
  {
    slug: 'ginecologia',
    label: 'Ginecología',
    emoji: '',
    steps: [
      {
        id: 'subespecialidad',
        title: '¿Cuáles subespecialidades ofreces?',
        subtitle: 'La IA sabrá exactamente para qué tipo de consulta agendarte.',
        field: { type: 'multiselect', options: ['Ginecología general', 'Obstetricia (embarazo)', 'Medicina reproductiva / fertilidad', 'Ginecología oncológica', 'Climaterio y menopausia', 'Colposcopía / CACU', 'Ecografía ginecológica'], required: true },
      },
      {
        id: 'urgencias',
        title: '¿Atiendes urgencias obstétricas o ginecológicas?',
        subtitle: 'Si la paciente describe una urgencia, la IA sabrá cómo escalar.',
        field: { type: 'radio', options: ['Sí, tengo guardia activa o número de emergencias', 'Sí, pero las canalizo a urgencias del hospital', 'No, solo consulta programada'], required: true },
      },
      {
        id: 'hospital',
        title: '¿En qué clínica u hospital atiendes?',
        field: { type: 'text', placeholder: 'Ej: Hospital Ángeles, Clínica Médica del Pedregal...', required: false },
      },
      {
        id: 'prenatales',
        title: '¿Cuántas consultas prenatales promedio tiene un embarazo en tu práctica?',
        field: { type: 'radio', options: ['5 a 8 consultas', '9 a 12 consultas', 'Más de 12 consultas', 'Depende de la paciente'], required: true },
      },
    ],
  },

  /* ── Oftalmología ── */
  {
    slug: 'oftalmologia',
    label: 'Oftalmología',
    emoji: '️',
    steps: [
      {
        id: 'procedimientos',
        title: '¿Qué procedimientos realizas en tu práctica?',
        field: { type: 'multiselect', options: ['Cirugía LASIK / PRK', 'Cirugía de cataratas', 'Tratamiento de glaucoma', 'Cirugía de retina', 'Cirugía de estrabismo', 'Párpados (blefaroplastia)', 'Lentes intraoculares premium', 'Optometría médica'], required: true },
      },
      {
        id: 'lentes',
        title: '¿Vendes o recetas lentes de contacto?',
        field: { type: 'radio', options: ['Sí, tengo óptica integrada', 'Sí, receto pero el paciente compra en otra parte', 'No manejo lentes de contacto'], required: true },
      },
      {
        id: 'equipo',
        title: '¿Con qué equipamiento de diagnóstico cuentas?',
        field: { type: 'multiselect', options: ['Topógrafo corneal', 'Tomógrafo (OCT)', 'Campimetría computarizada', 'Aberrómetro', 'Angiografía retiniana', 'Ultrasonido ocular'], required: false },
      },
      {
        id: 'cirugia_dia',
        title: '¿Realizas cirugías de un día (ambulatorias)?',
        subtitle: 'Esto define si los pacientes pueden agendar cirugía directamente.',
        field: { type: 'radio', options: ['Sí, la mayoría son ambulatorias', 'Sí, pero se requiere evaluación previa', 'No, opero en hospital con hospitalización'], required: true },
      },
    ],
  },

  /* ── Medicina General ── */
  {
    slug: 'medica',
    label: 'Medicina General',
    emoji: '',
    steps: [
      {
        id: 'tipo_consulta',
        title: '¿Qué tipo de consultas atiendes principalmente?',
        field: { type: 'multiselect', options: ['Medicina familiar / general', 'Medicina preventiva', 'Urgencias menores', 'Medicina del viajero', 'Certificados médicos', 'Atención a domicilio'], required: true },
      },
      {
        id: 'seguros',
        title: '¿Aceptas seguros médicos?',
        field: { type: 'multiselect', options: ['GNP', 'AXA', 'BUPA', 'Metlife', 'Seguros Monterrey', 'IMSS (convenio)', 'Solo consulta privada'], required: true },
      },
      {
        id: 'laboratorio',
        title: '¿Solicitas estudios de laboratorio o imagen?',
        subtitle: 'La IA podrá orientar a los pacientes sobre preparación para estudios.',
        field: { type: 'radio', options: ['Sí, tengo convenio con laboratorio', 'Sí, pero los pacientes van a cualquier laboratorio', 'Raramente solicito estudios'], required: true },
      },
      {
        id: 'domicilio',
        title: '¿Ofreces atención a domicilio o teleconsulta?',
        field: { type: 'radio', options: ['Sí, ambas', 'Solo teleconsulta', 'Solo a domicilio', 'No, solo consultorio'], required: true },
      },
    ],
  },

  /* ── Spa ── */
  {
    slug: 'spa',
    label: 'Spa & Bienestar',
    emoji: '',
    steps: [
      {
        id: 'servicios',
        title: '¿Cuáles son tus servicios principales?',
        field: { type: 'multiselect', options: ['Masajes terapéuticos', 'Faciales', 'Tratamientos corporales', 'Aromaterapia', 'Reflexología', 'Manicure / Pedicure spa', 'Terapias de relajación', 'Hidroterapia'], required: true },
      },
      {
        id: 'paquetes',
        title: '¿Manejas paquetes o membresías?',
        field: { type: 'radio', options: ['Sí, tengo membresías mensuales', 'Sí, tengo paquetes por sesiones', 'Sí, tengo ambas opciones', 'No, solo sesiones individuales'], required: true },
      },
      {
        id: 'duracion',
        title: '¿Cuánto dura típicamente una sesión?',
        field: { type: 'radio', options: ['30 minutos', '45 minutos', '60 minutos', '90 minutos', '2 horas o más'], required: true },
      },
      {
        id: 'reserva_anticipada',
        title: '¿Con cuánta anticipación suelen agendar tus clientes?',
        field: { type: 'radio', options: ['Mismo día', '1-2 días antes', '3-7 días antes', 'Más de una semana'], required: true },
      },
    ],
  },

  /* ── Fisioterapia ── */
  {
    slug: 'fisioterapia',
    label: 'Fisioterapia',
    emoji: '',
    steps: [
      {
        id: 'especialidad',
        title: '¿En qué área de fisioterapia te especializas?',
        field: { type: 'radio', options: ['Ortopédica y traumatológica', 'Neurológica', 'Deportiva', 'Pediátrica', 'Geriátrica', 'Cardiorrespiratoria', 'Piso pélvico'], required: true },
      },
      {
        id: 'sesiones',
        title: '¿Cuántas sesiones promedio tiene un tratamiento completo?',
        field: { type: 'radio', options: ['1 a 5 sesiones', '6 a 12 sesiones', '13 a 20 sesiones', 'Más de 20 sesiones', 'Depende del diagnóstico'], required: true },
      },
      {
        id: 'derivacion',
        title: '¿Recibes pacientes derivados de médicos o por cuenta propia?',
        field: { type: 'radio', options: ['Principalmente derivados (traumatólogo, ortopedista)', 'Mix de derivados y por cuenta propia', 'Principalmente por cuenta propia'], required: true },
      },
      {
        id: 'domicilio',
        title: '¿Realizas sesiones a domicilio?',
        field: { type: 'radio', options: ['Sí, es parte de mi servicio', 'Sí, pero con costo adicional', 'No, solo en consultorio'], required: true },
      },
    ],
  },
]

export function getSpecialtyConfig(slug: string): SpecialtyConfig | undefined {
  return SPECIALTIES.find((s) => s.slug === slug)
}

export { SPECIALTIES }
