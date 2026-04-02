export interface Industry {
  slug: string
  color: string
  lightColor: string
  imagePrompt: string // Midjourney/DALL-E prompt for the character image
  es: {
    name: string
    tagline: string
    headline: string
    body: string
    features: { title: string; desc: string }[]
  }
  en: {
    name: string
    tagline: string
    headline: string
    body: string
    features: { title: string; desc: string }[]
  }
}

export const INDUSTRIES: Industry[] = [
  {
    slug: 'dental',
    color: '#3B82F6',
    lightColor: '#EFF6FF',
    imagePrompt: 'High-tech humanoid female AI receptionist, wearing a white dentist coat, professional dental clinic background, wearing sleek modern headset, minimalist fintech aesthetic, hyper-realistic, 8k, soft studio lighting --ar 16:9',
    es: {
      name: 'Dental',
      tagline: 'Implantes, ortodoncia y limpiezas atendidos 24/7',
      headline: 'Tu Recepcionista IA Dental que Nunca Duerme',
      body: 'Atiende en <2 seg, agenda 24/7 y gestiona seguimientos automáticamente. Tu front desk siempre disponible para consultas de implantes, ortodoncia y limpiezas.',
      features: [
        { title: 'Agenda instantánea', desc: 'Citas por WhatsApp o chat sin espera, a cualquier hora.' },
        { title: 'Recordatorios de tratamiento', desc: 'Seguimiento automático de planes multivisita y citas pendientes.' },
        { title: 'FAQ dental automatizado', desc: 'Preguntas sobre precios, tiempos y procedimientos resueltas al instante.' },
      ],
    },
    en: {
      name: 'Dental',
      tagline: 'Implants, orthodontics and cleanings attended 24/7',
      headline: 'Your Dental AI Receptionist That Never Sleeps',
      body: 'Responds in <2 sec, books 24/7, and manages follow-ups automatically. Your front desk always available for implants, orthodontics, and cleaning consultations.',
      features: [
        { title: 'Instant scheduling', desc: 'Appointments via WhatsApp or chat without waiting, at any hour.' },
        { title: 'Treatment reminders', desc: 'Automatic follow-up of multi-visit plans and pending appointments.' },
        { title: 'Automated dental FAQ', desc: 'Questions about prices, timelines, and procedures answered instantly.' },
      ],
    },
  },
  {
    slug: 'psicologia',
    color: '#8B5CF6',
    lightColor: '#F5F3FF',
    imagePrompt: 'Professional humanoid AI receptionist, wearing elegant lavender business attire, psychology office background with calm decor, sleek modern headset, warm professional lighting, 8k realistic --ar 16:9',
    es: {
      name: 'Psicológica',
      tagline: 'Discreta, profesional y disponible las 24 horas',
      headline: 'Tu Recepcionista IA Psicológica — Discreta y Siempre Disponible',
      body: 'Primera impresión profesional y confidencial. Agenda sesiones, envía recordatorios y cuida la privacidad de tus pacientes las 24 horas, sin interrumpir tu trabajo clínico.',
      features: [
        { title: 'Confidencialidad total', desc: 'Interacciones seguras que protegen la privacidad del paciente en todo momento.' },
        { title: 'Agenda de sesiones', desc: 'Citas iniciales y de seguimiento organizadas sin fricción.' },
        { title: 'Recordatorios empáticos', desc: 'Mensajes cálidos y profesionales que reducen inasistencias.' },
      ],
    },
    en: {
      name: 'Psychology',
      tagline: 'Discreet, professional and available 24 hours',
      headline: 'Your Psychology AI Receptionist — Discreet and Always Available',
      body: 'Professional and confidential first impression. Schedules sessions, sends reminders, and protects patient privacy 24 hours a day without interrupting your clinical work.',
      features: [
        { title: 'Full confidentiality', desc: 'Secure interactions that protect patient privacy at all times.' },
        { title: 'Session scheduling', desc: 'Initial and follow-up appointments organized without friction.' },
        { title: 'Empathetic reminders', desc: 'Warm, professional messages that reduce no-shows.' },
      ],
    },
  },
  {
    slug: 'estetica',
    color: '#EC4899',
    lightColor: '#FDF2F8',
    imagePrompt: 'Elegant futuristic AI beauty consultant, wearing a minimalist silk professional uniform, sleek modern headset, luxury spa/wellness center background, soft warm lighting, high-end fintech vibe, 8k --ar 16:9',
    es: {
      name: 'Estética',
      tagline: 'Botox, faciales y tratamientos gestionados automáticamente',
      headline: 'Tu Recepcionista IA de Estética que Transforma Consultas en Citas',
      body: 'Responde preguntas sobre tratamientos faciales, corporales y laser al instante. Agenda, confirma y reduce inasistencias automáticamente mientras tú te enfocas en tus pacientes.',
      features: [
        { title: 'Consultas de tratamientos', desc: 'Precios, resultados esperados y tiempos de recuperación explicados al instante.' },
        { title: 'Agenda inteligente', desc: 'Citas para múltiples servicios y especialistas coordinadas sin esfuerzo.' },
        { title: 'Seguimiento post-tratamiento', desc: 'Recordatorios y revisiones enviados automáticamente para fidelizar pacientes.' },
      ],
    },
    en: {
      name: 'Aesthetic',
      tagline: 'Botox, facials and treatments managed automatically',
      headline: 'Your Aesthetic AI Receptionist That Turns Inquiries Into Appointments',
      body: 'Answers questions about facial, body, and laser treatments instantly. Schedules, confirms, and reduces no-shows automatically while you focus on your patients.',
      features: [
        { title: 'Treatment consultations', desc: 'Prices, expected results, and recovery times explained instantly.' },
        { title: 'Smart scheduling', desc: 'Appointments for multiple services and specialists coordinated effortlessly.' },
        { title: 'Post-treatment follow-up', desc: 'Reminders and check-ups sent automatically to build patient loyalty.' },
      ],
    },
  },
  {
    slug: 'nutricion',
    color: '#0EA5E9',
    lightColor: '#F0F9FF',
    imagePrompt: 'Elegant futuristic AI beauty consultant, wearing a minimalist silk professional green-white uniform, sleek modern headset, clean wellness nutrition center background, soft natural lighting, 8k --ar 16:9',
    es: {
      name: 'Nutrición',
      tagline: 'Consultas y seguimientos nutricionales automatizados',
      headline: 'Tu Recepcionista IA de Nutrición que Agenda Mientras Consultas',
      body: 'Gestiona citas para consultas iniciales y seguimientos nutricionales sin interrumpir tu trabajo. Disponible en WhatsApp e Instagram para que ningún paciente se quede sin atención.',
      features: [
        { title: 'Consultas iniciales', desc: 'Agendado de primera cita con recopilación de datos básicos del paciente.' },
        { title: 'Seguimiento de planes', desc: 'Recordatorios automáticos de citas de control y ajuste de plan nutricional.' },
        { title: 'Canal multicanal', desc: 'Atención por WhatsApp, Instagram y llamadas desde un solo sistema.' },
      ],
    },
    en: {
      name: 'Nutrition',
      tagline: 'Nutritional consultations and follow-ups automated',
      headline: 'Your Nutrition AI Receptionist That Schedules While You Consult',
      body: 'Manages appointments for initial consultations and nutritional follow-ups without interrupting your work. Available on WhatsApp and Instagram so no patient goes unattended.',
      features: [
        { title: 'Initial consultations', desc: 'First appointment scheduling with basic patient data collection.' },
        { title: 'Plan follow-ups', desc: 'Automatic reminders for control visits and nutritional plan adjustments.' },
        { title: 'Multichannel', desc: 'Support via WhatsApp, Instagram, and calls from a single system.' },
      ],
    },
  },
  {
    slug: 'ginecologia',
    color: '#F472B6',
    lightColor: '#FDF2F8',
    imagePrompt: 'Professional humanoid AI medical assistant, wearing a light pink medical scrub, stethoscope, sleek modern headset, clean gynecology clinic background, soft pink and white lighting, 8k realistic --ar 16:9',
    es: {
      name: 'Ginecología',
      tagline: 'Consultas ginecológicas y seguimientos confidenciales 24/7',
      headline: 'Tu Recepcionista IA Ginecológica — Confidencial y Siempre Presente',
      body: 'Discreta, profesional y disponible las 24 horas. Agenda consultas, citas preventivas, seguimientos de embarazo y postparto con total confidencialidad para tus pacientes.',
      features: [
        { title: 'Privacidad garantizada', desc: 'Interacciones seguras y confidenciales que generan confianza en tus pacientes.' },
        { title: 'Agenda preventiva', desc: 'Citas de Papanicolaou, ultrasonidos y controles programados automáticamente.' },
        { title: 'Seguimiento de embarazo', desc: 'Recordatorios y seguimiento de citas prenatales y postparto sin esfuerzo.' },
      ],
    },
    en: {
      name: 'Gynecology',
      tagline: 'Gynecological consultations and confidential follow-ups 24/7',
      headline: 'Your Gynecology AI Receptionist — Confidential and Always Present',
      body: 'Discreet, professional and available 24 hours. Schedules consultations, preventive appointments, pregnancy follow-ups, and postpartum care with full confidentiality.',
      features: [
        { title: 'Guaranteed privacy', desc: 'Secure and confidential interactions that build trust with your patients.' },
        { title: 'Preventive scheduling', desc: 'Pap smear, ultrasound, and control appointments scheduled automatically.' },
        { title: 'Pregnancy follow-up', desc: 'Prenatal and postpartum appointment reminders and tracking effortlessly.' },
      ],
    },
  },
  {
    slug: 'oftalmologia',
    color: '#6366F1',
    lightColor: '#EEF2FF',
    imagePrompt: 'High-tech humanoid AI receptionist, wearing a navy blue medical coat, ophthalmology clinic background with modern eye equipment, sleek modern headset, blue and white lighting, 8k realistic --ar 16:9',
    es: {
      name: 'Oftalmología',
      tagline: 'Revisiones de vista y cirugías coordinadas automáticamente',
      headline: 'Tu Recepcionista IA de Oftalmología que Nunca Pierde una Cita',
      body: 'Agenda revisiones de vista, cirugías LASIK y seguimientos postoperatorios automáticamente. Tu clínica visual siempre disponible para tus pacientes, sin tiempos de espera.',
      features: [
        { title: 'Revisiones programadas', desc: 'Exámenes de vista y controles periódicos coordinados sin intervención.' },
        { title: 'Información sobre cirugías', desc: 'Preguntas sobre LASIK, cataratas y procedimientos respondidas al instante.' },
        { title: 'Seguimiento postoperatorio', desc: 'Recordatorios de citas de revisión y cuidados después de cirugía ocular.' },
      ],
    },
    en: {
      name: 'Ophthalmology',
      tagline: 'Eye exams and surgeries coordinated automatically',
      headline: 'Your Ophthalmology AI Receptionist That Never Misses an Appointment',
      body: 'Schedules eye exams, LASIK surgeries, and post-op follow-ups automatically. Your vision clinic always available for your patients, without waiting times.',
      features: [
        { title: 'Scheduled exams', desc: 'Eye tests and periodic check-ups coordinated without intervention.' },
        { title: 'Surgery information', desc: 'Questions about LASIK, cataracts, and procedures answered instantly.' },
        { title: 'Post-op follow-up', desc: 'Review appointment reminders and post-eye-surgery care instructions.' },
      ],
    },
  },
  {
    slug: 'medicina',
    color: '#EF4444',
    lightColor: '#FEF2F2',
    imagePrompt: 'Professional humanoid AI medical assistant, wearing a light blue medical scrub and a stethoscope, sleek modern headset, clean hospital laboratory background, blue and white lighting, 8k, realistic --ar 16:9',
    es: {
      name: 'Médica General',
      tagline: 'Consultorios médicos atendidos 24/7 sin saturar tu equipo',
      headline: 'Tu Recepcionista IA Médica 24/7 que No Pierde una Cita',
      body: 'Triage inicial, agenda de citas y recordatorios automáticos. Tu consultorio siempre atendido, incluso fines de semana y días festivos. Sin sobrecargar a tu equipo.',
      features: [
        { title: 'Triage inicial automatizado', desc: 'Clasificación básica de urgencia para orientar al paciente al recurso correcto.' },
        { title: 'Agenda 24/7', desc: 'Citas disponibles fuera de horario sin necesidad de personal.' },
        { title: 'Recordatorios automáticos', desc: 'Confirmaciones previas a cada cita para reducir cancelaciones.' },
      ],
    },
    en: {
      name: 'General Medicine',
      tagline: 'Medical offices attended 24/7 without overloading your team',
      headline: 'Your Medical AI Receptionist 24/7 That Never Misses an Appointment',
      body: 'Initial triage, appointment scheduling, and automatic reminders. Your office always attended, even on weekends and holidays. Without overloading your team.',
      features: [
        { title: 'Automated initial triage', desc: 'Basic urgency classification to guide patients to the right resource.' },
        { title: '24/7 scheduling', desc: 'Appointments available after hours without needing staff.' },
        { title: 'Automatic reminders', desc: 'Pre-appointment confirmations to reduce cancellations.' },
      ],
    },
  },
  {
    slug: 'pediatria',
    color: '#F59E0B',
    lightColor: '#FFFBEB',
    imagePrompt: 'Professional humanoid AI medical assistant, wearing a light blue medical scrub and a stethoscope, sleek modern headset, clean hospital laboratory background, blue and white lighting, 8k, realistic --ar 16:9',
    es: {
      name: 'Pediatría',
      tagline: 'Atención cálida y disponible para padres preocupados',
      headline: 'Tu Recepcionista IA Pediátrica — Cálida, Rápida y Disponible',
      body: 'Responde con calidez a los papás las 24 horas. Agenda citas de vacunas, revisiones y urgencias de forma inmediata, sin esperas y con el tono adecuado para familias.',
      features: [
        { title: 'Respuesta inmediata a padres', desc: 'Atención empática a consultas urgentes de familias en cualquier momento.' },
        { title: 'Agenda de vacunas y revisiones', desc: 'Citas de control pediátrico organizadas automáticamente.' },
        { title: 'Tono familiar y cálido', desc: 'IA configurada con un lenguaje adecuado para comunicarse con padres.' },
      ],
    },
    en: {
      name: 'Pediatrics',
      tagline: 'Warm, available care for worried parents',
      headline: 'Your Pediatric AI Receptionist — Warm, Fast, and Always Available',
      body: 'Responds warmly to parents 24 hours a day. Schedules vaccination, checkup, and urgent appointments immediately, without waiting and with the right tone for families.',
      features: [
        { title: 'Instant response to parents', desc: 'Empathetic care for urgent family inquiries at any time.' },
        { title: 'Vaccination and checkup scheduling', desc: 'Pediatric control appointments organized automatically.' },
        { title: 'Warm, family-friendly tone', desc: 'AI configured with appropriate language to communicate with parents.' },
      ],
    },
  },
  {
    slug: 'veterinaria',
    color: '#14B8A6',
    lightColor: '#F0FDFA',
    imagePrompt: 'Professional humanoid AI veterinary receptionist, wearing a teal medical coat, sleek modern headset, clean modern veterinary clinic background, warm professional lighting, 8k realistic --ar 16:9',
    es: {
      name: 'Veterinaria',
      tagline: 'Citas, cirugías y recordatorios de vacunas automatizados',
      headline: 'Tu Recepcionista IA Veterinaria que Cuida a tus Pacientes y sus Dueños',
      body: 'Atiende consultas, agenda cirugías y baños, y envía recordatorios de vacunas automáticamente. Tu clínica siempre disponible para mascotas y dueños.',
      features: [
        { title: 'Agenda de servicios múltiples', desc: 'Consultas, grooming, cirugías y urgencias organizadas en un solo sistema.' },
        { title: 'Recordatorios de vacunas', desc: 'Alertas automáticas a dueños cuando la mascota necesita refuerzo.' },
        { title: 'Atención a urgencias', desc: 'Respuesta inmediata para orientar en situaciones de emergencia animal.' },
      ],
    },
    en: {
      name: 'Veterinary',
      tagline: 'Appointments, surgeries and vaccine reminders automated',
      headline: 'Your Veterinary AI Receptionist That Cares for Your Patients and Their Owners',
      body: 'Handles consultations, schedules surgeries and baths, and sends vaccine reminders automatically. Your clinic always available for pets and owners.',
      features: [
        { title: 'Multi-service scheduling', desc: 'Consultations, grooming, surgeries, and emergencies organized in one system.' },
        { title: 'Vaccine reminders', desc: 'Automatic alerts to owners when their pet needs a booster.' },
        { title: 'Emergency response', desc: 'Immediate response to guide owners in animal emergency situations.' },
      ],
    },
  },
  {
    slug: 'fisioterapia',
    color: '#0EA5E9',
    lightColor: '#F0F9FF',
    imagePrompt: 'Professional humanoid AI physiotherapy receptionist, wearing a sky blue sports medical uniform, sleek modern headset, modern rehabilitation clinic background, clean bright lighting, 8k realistic --ar 16:9',
    es: {
      name: 'Fisioterapia',
      tagline: 'Rehabilitación y seguimientos gestionados sin esfuerzo',
      headline: 'Tu Recepcionista IA de Fisioterapia que Maximiza tu Agenda',
      body: 'Gestiona altas, seguimientos y citas de rehabilitación sin esfuerzo. Reduce cancelaciones con recordatorios automáticos y mantén tu agenda llena.',
      features: [
        { title: 'Gestión de tratamientos', desc: 'Seguimiento de sesiones, progreso y altas organizadas automáticamente.' },
        { title: 'Recordatorios de sesión', desc: 'Notificaciones previas que reducen cancelaciones y ausencias.' },
        { title: 'Agenda optimizada', desc: 'Llena los huecos de cancelación con pacientes en lista de espera.' },
      ],
    },
    en: {
      name: 'Physiotherapy',
      tagline: 'Rehabilitation and follow-ups managed effortlessly',
      headline: 'Your Physiotherapy AI Receptionist That Maximizes Your Schedule',
      body: 'Manages discharges, follow-ups, and rehabilitation appointments effortlessly. Reduce cancellations with automatic reminders and keep your schedule full.',
      features: [
        { title: 'Treatment management', desc: 'Session tracking, progress, and discharges organized automatically.' },
        { title: 'Session reminders', desc: 'Prior notifications that reduce cancellations and absences.' },
        { title: 'Optimized schedule', desc: 'Fill cancellation gaps with patients on the waiting list.' },
      ],
    },
  },
]

// The 6 primary industries shown on the home page grid
export const HOME_INDUSTRIES = ['dental', 'psicologia', 'estetica', 'nutricion', 'ginecologia', 'oftalmologia']

export function getIndustry(slug: string): Industry | undefined {
  return INDUSTRIES.find((i) => i.slug === slug)
}
