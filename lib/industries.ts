export interface Industry {
  slug:        string
  color:       string
  lightColor:  string
  category:    IndustryCategory
  icon:        string
  imagePrompt: string
  es: {
    name:     string
    tagline:  string
    headline: string
    body:     string
    features: { title: string; desc: string }[]
  }
  en: {
    name:     string
    tagline:  string
    headline: string
    body:     string
    features: { title: string; desc: string }[]
  }
}

export type IndustryCategory =
  | 'health'
  | 'food'
  | 'beauty'
  | 'fitness'
  | 'hospitality'
  | 'professional'
  | 'retail'
  | 'other'

export const INDUSTRY_CATEGORIES: { id: IndustryCategory; es: string; en: string; icon: string }[] = [
  { id: 'health',       es: 'Clínicas de Salud',         en: 'Health Clinics',          icon: '🏥' },
  { id: 'food',         es: 'Restaurantes & Cafés',      en: 'Restaurants & Cafés',     icon: '🍽️' },
  { id: 'beauty',       es: 'Belleza & Cuidado Personal', en: 'Beauty & Personal Care',  icon: '✂️' },
  { id: 'fitness',      es: 'Fitness & Bienestar',       en: 'Fitness & Wellness',      icon: '💪' },
  { id: 'hospitality',  es: 'Hospitalidad',              en: 'Hospitality',             icon: '🏨' },
  { id: 'professional', es: 'Servicios Profesionales',   en: 'Professional Services',   icon: '💼' },
  { id: 'retail',       es: 'Comercio & Retail',         en: 'Commerce & Retail',       icon: '🏪' },
]

export const INDUSTRIES: Industry[] = [

  // ─── HEALTH ──────────────────────────────────────────────────────────────────

  {
    slug: 'dental',
    color: '#3B82F6',
    lightColor: '#EFF6FF',
    category: 'health',
    icon: '🦷',
    imagePrompt: 'High-tech humanoid female AI receptionist, wearing a white dentist coat, professional dental clinic background, sleek modern headset, 8k --ar 16:9',
    es: {
      name: 'Clínica Dental & Ortodoncia',
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
      name: 'Dental & Orthodontics Clinic',
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
    slug: 'estetica',
    color: '#EC4899',
    lightColor: '#FDF2F8',
    category: 'health',
    icon: '✨',
    imagePrompt: 'Elegant futuristic AI beauty consultant, wearing minimalist silk professional uniform, sleek modern headset, luxury aesthetic clinic background, soft warm lighting, 8k --ar 16:9',
    es: {
      name: 'Medicina Estética',
      tagline: 'Botox, faciales y tratamientos gestionados automáticamente',
      headline: 'Tu Recepcionista IA de Estética que Transforma Consultas en Citas',
      body: 'Responde preguntas sobre tratamientos faciales, corporales y laser al instante. Agenda, confirma y reduce inasistencias automáticamente.',
      features: [
        { title: 'Consultas de tratamientos', desc: 'Precios, resultados esperados y tiempos de recuperación al instante.' },
        { title: 'Agenda inteligente', desc: 'Citas para múltiples servicios y especialistas coordinadas sin esfuerzo.' },
        { title: 'Seguimiento post-tratamiento', desc: 'Recordatorios y revisiones enviados automáticamente para fidelizar.' },
      ],
    },
    en: {
      name: 'Aesthetic Medicine',
      tagline: 'Botox, facials and treatments managed automatically',
      headline: 'Your Aesthetic AI Receptionist That Turns Inquiries Into Appointments',
      body: 'Answers questions about facial, body, and laser treatments instantly. Schedules, confirms, and reduces no-shows automatically.',
      features: [
        { title: 'Treatment consultations', desc: 'Prices, expected results, and recovery times explained instantly.' },
        { title: 'Smart scheduling', desc: 'Appointments for multiple services and specialists coordinated effortlessly.' },
        { title: 'Post-treatment follow-up', desc: 'Reminders and follow-up visits sent automatically to retain patients.' },
      ],
    },
  },

  {
    slug: 'psicologia',
    color: '#8B5CF6',
    lightColor: '#F5F3FF',
    category: 'health',
    icon: '🧠',
    imagePrompt: 'Professional humanoid AI receptionist, wearing elegant lavender business attire, psychology office background, sleek modern headset, warm professional lighting, 8k --ar 16:9',
    es: {
      name: 'Psicología & Salud Mental',
      tagline: 'Discreta, profesional y disponible las 24 horas',
      headline: 'Tu Recepcionista IA Psicológica — Discreta y Siempre Disponible',
      body: 'Primera impresión profesional y confidencial. Agenda sesiones, envía recordatorios y cuida la privacidad de tus pacientes las 24 horas.',
      features: [
        { title: 'Confidencialidad total', desc: 'Interacciones seguras que protegen la privacidad del paciente.' },
        { title: 'Agenda de sesiones', desc: 'Citas iniciales y de seguimiento organizadas sin fricción.' },
        { title: 'Recordatorios empáticos', desc: 'Mensajes cálidos y profesionales que reducen inasistencias.' },
      ],
    },
    en: {
      name: 'Psychology & Mental Health',
      tagline: 'Discreet, professional and available 24 hours',
      headline: 'Your Psychology AI Receptionist — Discreet and Always Available',
      body: 'Professional and confidential first impression. Schedules sessions, sends reminders, and protects patient privacy 24 hours a day.',
      features: [
        { title: 'Full confidentiality', desc: 'Secure interactions that protect patient privacy at all times.' },
        { title: 'Session scheduling', desc: 'Initial and follow-up appointments organized without friction.' },
        { title: 'Empathetic reminders', desc: 'Warm, professional messages that reduce no-shows.' },
      ],
    },
  },

  {
    slug: 'medicina',
    color: '#10B981',
    lightColor: '#ECFDF5',
    category: 'health',
    icon: '🏥',
    imagePrompt: 'Professional female AI receptionist in white medical coat, modern clinic reception, headset, clean medical environment, 8k --ar 16:9',
    es: {
      name: 'Medicina General & Especialidades',
      tagline: 'Consultas, urgencias y seguimientos atendidos 24/7',
      headline: 'Tu Recepcionista IA Médica — Siempre Lista para tus Pacientes',
      body: 'Gestiona citas, responde preguntas frecuentes y guía a los pacientes al servicio correcto. Nunca pierdas una consulta por falta de respuesta.',
      features: [
        { title: 'Triaje conversacional', desc: 'Guía al paciente al servicio o especialista correcto.' },
        { title: 'Agenda automática', desc: 'Citas confirmadas sin intervención humana, 24/7.' },
        { title: 'Recordatorios preventivos', desc: 'Seguimiento de consultas de control y estudios pendientes.' },
      ],
    },
    en: {
      name: 'General Medicine & Specialties',
      tagline: 'Consultations, emergencies and follow-ups attended 24/7',
      headline: 'Your Medical AI Receptionist — Always Ready for Your Patients',
      body: 'Manages appointments, answers FAQs, and guides patients to the right service. Never miss a consultation from lack of response.',
      features: [
        { title: 'Conversational triage', desc: 'Guides the patient to the right service or specialist.' },
        { title: 'Automatic scheduling', desc: 'Confirmed appointments without human intervention, 24/7.' },
        { title: 'Preventive reminders', desc: 'Follow-up for check-up appointments and pending studies.' },
      ],
    },
  },

  {
    slug: 'nutricion',
    color: '#F59E0B',
    lightColor: '#FFFBEB',
    category: 'health',
    icon: '🥗',
    imagePrompt: 'Friendly AI nutritionist assistant, colorful healthy food environment, modern clinic background, sleek headset, warm professional lighting, 8k --ar 16:9',
    es: {
      name: 'Nutrición & Dietética',
      tagline: 'Planes nutricionales y seguimientos gestionados por IA',
      headline: 'Tu Asistente IA de Nutrición que Cuida a tus Pacientes',
      body: 'Responde consultas sobre planes de alimentación, agenda valoraciones y da seguimiento a tus pacientes automáticamente entre sesiones.',
      features: [
        { title: 'Valoraciones agendadas', desc: 'Primera consulta y seguimientos organizados al instante.' },
        { title: 'FAQ nutricional', desc: 'Preguntas sobre dietas, suplementos y objetivos respondidas de inmediato.' },
        { title: 'Seguimiento entre sesiones', desc: 'Recordatorios y motivación automática para tus pacientes.' },
      ],
    },
    en: {
      name: 'Nutrition & Dietetics',
      tagline: 'Nutritional plans and follow-ups managed by AI',
      headline: 'Your AI Nutrition Assistant That Cares for Your Patients',
      body: 'Answers queries about meal plans, schedules assessments, and automatically follows up with your patients between sessions.',
      features: [
        { title: 'Scheduled assessments', desc: 'First consultation and follow-ups organized instantly.' },
        { title: 'Nutritional FAQ', desc: 'Questions about diets, supplements, and goals answered immediately.' },
        { title: 'Between-session follow-up', desc: 'Automatic reminders and motivation for your patients.' },
      ],
    },
  },

  {
    slug: 'fisioterapia',
    color: '#06B6D4',
    lightColor: '#ECFEFF',
    category: 'health',
    icon: '🏃',
    imagePrompt: 'Professional AI physiotherapy assistant, modern rehabilitation clinic, exercise equipment in background, headset, natural lighting, 8k --ar 16:9',
    es: {
      name: 'Fisioterapia & Rehabilitación',
      tagline: 'Sesiones, ejercicios y seguimientos coordinados por IA',
      headline: 'Tu Recepcionista IA de Fisioterapia — Coordinación sin Esfuerzo',
      body: 'Agenda sesiones, responde dudas sobre tratamientos y envía recordatorios de ejercicios entre citas. Tu clínica de rehab siempre disponible.',
      features: [
        { title: 'Agenda de sesiones', desc: 'Citas de rehabilitación organizadas automáticamente.' },
        { title: 'Instrucciones de ejercicios', desc: 'Recordatorios y rutinas enviadas entre sesiones.' },
        { title: 'Seguimiento de progreso', desc: 'Check-ins automáticos para monitorear la evolución del paciente.' },
      ],
    },
    en: {
      name: 'Physical Therapy & Rehabilitation',
      tagline: 'Sessions, exercises and follow-ups coordinated by AI',
      headline: 'Your Physical Therapy AI Receptionist — Effortless Coordination',
      body: 'Schedules sessions, answers treatment questions, and sends exercise reminders between appointments. Your rehab clinic always available.',
      features: [
        { title: 'Session scheduling', desc: 'Rehabilitation appointments organized automatically.' },
        { title: 'Exercise instructions', desc: 'Reminders and routines sent between sessions.' },
        { title: 'Progress follow-up', desc: 'Automatic check-ins to monitor patient evolution.' },
      ],
    },
  },

  {
    slug: 'veterinaria',
    color: '#84CC16',
    lightColor: '#F7FEE7',
    category: 'health',
    icon: '🐾',
    imagePrompt: 'Friendly AI veterinary receptionist, modern animal clinic with pet-friendly decor, headset, warm welcoming lighting, 8k --ar 16:9',
    es: {
      name: 'Clínica Veterinaria',
      tagline: 'Citas, vacunas y emergencias gestionadas 24/7',
      headline: 'Tu Recepcionista IA Veterinaria — Cuida a tus Pacientes y sus Dueños',
      body: 'Atiende consultas sobre mascotas, agenda vacunas y revisiones, y maneja urgencias con empatía. Siempre disponible para los papás de peludos.',
      features: [
        { title: 'Agenda de vacunas y revisiones', desc: 'Recordatorios automáticos para no perder ninguna cita preventiva.' },
        { title: 'Atención de urgencias', desc: 'Guía empática en situaciones de emergencia con tus mascotas.' },
        { title: 'FAQ veterinario', desc: 'Dudas sobre enfermedades, medicamentos y cuidados resueltas al instante.' },
      ],
    },
    en: {
      name: 'Veterinary Clinic',
      tagline: 'Appointments, vaccines and emergencies managed 24/7',
      headline: 'Your Veterinary AI Receptionist — Caring for Pets and Their Owners',
      body: 'Handles pet consultations, schedules vaccines and check-ups, and manages emergencies with empathy. Always available for pet parents.',
      features: [
        { title: 'Vaccine & check-up scheduling', desc: 'Automatic reminders so no preventive appointment is missed.' },
        { title: 'Emergency assistance', desc: 'Empathetic guidance in emergency situations involving your pets.' },
        { title: 'Veterinary FAQ', desc: 'Questions about illnesses, medications, and care answered instantly.' },
      ],
    },
  },

  // ─── FOOD ────────────────────────────────────────────────────────────────────

  {
    slug: 'restaurante',
    color: '#F97316',
    lightColor: '#FFF7ED',
    category: 'food',
    icon: '🍽️',
    imagePrompt: 'Professional AI restaurant host assistant, elegant restaurant ambiance, warm candlelight, modern headset, 8k --ar 16:9',
    es: {
      name: 'Restaurante & Cafetería',
      tagline: 'Pedidos, reservaciones y menú gestionados por IA',
      headline: 'Tu Anfitrión IA que Toma Pedidos y Reservas sin Parar',
      body: 'Recibe pedidos a domicilio, gestiona reservaciones y responde sobre el menú y tiempos de espera. Todo automático mientras tu equipo se enfoca en la cocina.',
      features: [
        { title: 'Pedidos a domicilio', desc: 'Recibe y confirma pedidos con nombre, dirección y total por WhatsApp.' },
        { title: 'Reservaciones automáticas', desc: 'Gestiona mesas, horarios y número de personas sin llamadas.' },
        { title: 'Tiempos personalizados', desc: 'Informa tiempos de preparación y entrega configurados por ti.' },
      ],
    },
    en: {
      name: 'Restaurant & Café',
      tagline: 'Orders, reservations and menu inquiries managed by AI',
      headline: 'Your AI Host That Takes Orders and Reservations Non-Stop',
      body: 'Receives delivery orders, manages reservations, and answers menu and wait time questions. All automatic while your team focuses on the kitchen.',
      features: [
        { title: 'Delivery orders', desc: 'Receive and confirm orders with name, address, and total via WhatsApp.' },
        { title: 'Automatic reservations', desc: 'Manage tables, schedules, and party sizes without phone calls.' },
        { title: 'Custom timing', desc: 'Answers prep and delivery times configured by you.' },
      ],
    },
  },

  // ─── BEAUTY ──────────────────────────────────────────────────────────────────

  {
    slug: 'barberia',
    color: '#1E40AF',
    lightColor: '#EFF6FF',
    category: 'beauty',
    icon: '✂️',
    imagePrompt: 'Stylish AI barbershop receptionist, modern barbershop interior, barber chairs and grooming tools, contemporary headset, moody warm lighting, 8k --ar 16:9',
    es: {
      name: 'Barbería & Peluquería',
      tagline: 'Turnos, estilos y clientes frecuentes gestionados por IA',
      headline: 'Tu Recepcionista IA de Barbería — Sin Llamadas, Sin Esperas',
      body: 'Agenda turnos por WhatsApp, recuerda preferencias de corte de cada cliente y envía confirmaciones automáticas. Tu silla siempre ocupada, sin esfuerzo.',
      features: [
        { title: 'Turnos por WhatsApp', desc: 'Agenda corte, barba o combo al instante sin llamar.' },
        { title: 'Preferencias de cliente', desc: 'Recuerda el estilo y barbero favorito de cada cliente.' },
        { title: 'Recordatorios automáticos', desc: 'Reduce los no-shows con confirmaciones previas al turno.' },
      ],
    },
    en: {
      name: 'Barbershop & Hair Salon',
      tagline: 'Appointments, styles and loyal clients managed by AI',
      headline: 'Your Barbershop AI Receptionist — No Calls, No Waiting',
      body: 'Books appointments via WhatsApp, remembers each client\'s cut preferences, and sends automatic confirmations. Your chair always full, effortlessly.',
      features: [
        { title: 'WhatsApp bookings', desc: 'Book a haircut, beard, or combo instantly without calling.' },
        { title: 'Client preferences', desc: 'Remembers each client\'s style and favorite barber.' },
        { title: 'Automatic reminders', desc: 'Reduce no-shows with pre-appointment confirmations.' },
      ],
    },
  },

  {
    slug: 'spa-salon',
    color: '#A855F7',
    lightColor: '#FAF5FF',
    category: 'beauty',
    icon: '💆',
    imagePrompt: 'Serene AI spa receptionist, luxury spa environment with candles and soft decor, elegant headset, warm ambient lighting, 8k --ar 16:9',
    es: {
      name: 'Spa & Salón de Belleza',
      tagline: 'Masajes, tratamientos y uñas agendados 24/7',
      headline: 'Tu Recepcionista IA de Spa — Lujo y Atención sin Límites de Horario',
      body: 'Agenda masajes, tratamientos faciales, servicios de uñas y más. Envía recordatorios, gestiona preferencias y fideliza a tus clientes con atención personalizada.',
      features: [
        { title: 'Agenda de tratamientos', desc: 'Masajes, faciales, manicure y pedicure reservados al instante.' },
        { title: 'Preferencias guardadas', desc: 'Recuerda terapeuta favorito, presión de masaje y alergias.' },
        { title: 'Paquetes y promociones', desc: 'Informa y agenda paquetes especiales y días de spa.' },
      ],
    },
    en: {
      name: 'Spa & Beauty Salon',
      tagline: 'Massages, treatments and nails booked 24/7',
      headline: 'Your Spa AI Receptionist — Luxury and Attention Without Time Limits',
      body: 'Books massages, facials, nail services, and more. Sends reminders, manages preferences, and builds client loyalty with personalized attention.',
      features: [
        { title: 'Treatment scheduling', desc: 'Massages, facials, manicures and pedicures booked instantly.' },
        { title: 'Saved preferences', desc: 'Remembers favorite therapist, massage pressure, and allergies.' },
        { title: 'Packages & promotions', desc: 'Informs and books special packages and spa days.' },
      ],
    },
  },

  // ─── FITNESS ─────────────────────────────────────────────────────────────────

  {
    slug: 'fitness',
    color: '#EF4444',
    lightColor: '#FEF2F2',
    category: 'fitness',
    icon: '💪',
    imagePrompt: 'Energetic AI fitness coach assistant, modern gym environment with equipment, athletic professional headset, dynamic lighting, 8k --ar 16:9',
    es: {
      name: 'Gym & Centro de Fitness',
      tagline: 'Membresías, clases y rutinas gestionadas por IA',
      headline: 'Tu Asistente IA de Fitness — Convierte Leads en Miembros',
      body: 'Responde sobre membresías, horarios de clases y planes de entrenamiento. Agenda tours, registra nuevos miembros y da seguimiento a prospects automáticamente.',
      features: [
        { title: 'Tours y registros', desc: 'Agenda visitas al gym y convierte leads en miembros sin esfuerzo.' },
        { title: 'Horarios de clases', desc: 'Informa y reserva clases de yoga, spinning, crossfit y más.' },
        { title: 'Seguimiento de prospects', desc: 'Recontacta automáticamente a quienes preguntaron y no se inscribieron.' },
      ],
    },
    en: {
      name: 'Gym & Fitness Center',
      tagline: 'Memberships, classes and routines managed by AI',
      headline: 'Your Fitness AI Assistant — Turn Leads Into Members',
      body: 'Answers questions about memberships, class schedules, and training plans. Books tours, registers new members, and automatically follows up prospects.',
      features: [
        { title: 'Tours & registrations', desc: 'Schedule gym visits and convert leads into members effortlessly.' },
        { title: 'Class schedules', desc: 'Inform and reserve yoga, spinning, crossfit, and more.' },
        { title: 'Prospect follow-up', desc: 'Automatically re-contact those who inquired but didn\'t sign up.' },
      ],
    },
  },

  {
    slug: 'yoga-wellness',
    color: '#0EA5E9',
    lightColor: '#F0F9FF',
    category: 'fitness',
    icon: '🧘',
    imagePrompt: 'Calm AI wellness studio receptionist, serene yoga studio with natural light and plants, elegant headset, zen atmosphere, 8k --ar 16:9',
    es: {
      name: 'Yoga & Wellness Studio',
      tagline: 'Clases, retiros y sesiones de bienestar gestionados por IA',
      headline: 'Tu Recepcionista IA de Wellness — Paz Mental para ti y tus Clientes',
      body: 'Agenda clases, retiros y sesiones privadas. Responde sobre estilos de yoga, instructores y precios. Cuida el bienestar de tus clientes desde el primer mensaje.',
      features: [
        { title: 'Agenda de clases y retiros', desc: 'Reservaciones de clases grupales y sesiones privadas al instante.' },
        { title: 'FAQ de bienestar', desc: 'Preguntas sobre estilos, instructores y beneficios respondidas de inmediato.' },
        { title: 'Seguimiento holístico', desc: 'Recordatorios y motivación personalizada para cada estudiante.' },
      ],
    },
    en: {
      name: 'Yoga & Wellness Studio',
      tagline: 'Classes, retreats and wellness sessions managed by AI',
      headline: 'Your Wellness AI Receptionist — Peace of Mind for You and Your Clients',
      body: 'Books classes, retreats, and private sessions. Answers questions about yoga styles, instructors, and pricing.',
      features: [
        { title: 'Class & retreat scheduling', desc: 'Group class and private session reservations instantly.' },
        { title: 'Wellness FAQ', desc: 'Questions about styles, instructors, and benefits answered immediately.' },
        { title: 'Holistic follow-up', desc: 'Personalized reminders and motivation for each student.' },
      ],
    },
  },

  // ─── HOSPITALITY ─────────────────────────────────────────────────────────────

  {
    slug: 'hotel',
    color: '#D97706',
    lightColor: '#FFFBEB',
    category: 'hospitality',
    icon: '🏨',
    imagePrompt: 'Elegant AI hotel concierge, luxury hotel lobby with marble floors, formal attire headset, golden ambient lighting, 5-star atmosphere, 8k --ar 16:9',
    es: {
      name: 'Hotel & Hospitalidad',
      tagline: 'Reservaciones, check-in y servicios atendidos 24/7',
      headline: 'Tu Concierge IA — Experiencia 5 Estrellas las 24 Horas',
      body: 'Gestiona reservaciones, responde sobre disponibilidad, amenidades y servicios del hotel. Atiende solicitudes de huéspedes con la calidad de un concierge premium.',
      features: [
        { title: 'Reservaciones directas', desc: 'Reservas de habitación sin pasar por OTAs, con comisión cero.' },
        { title: 'Concierge virtual', desc: 'Responde sobre amenidades, restaurantes, spa y actividades.' },
        { title: 'Solicitudes de huéspedes', desc: 'Gestiona peticiones de servicio a cuarto, transporte y más.' },
      ],
    },
    en: {
      name: 'Hotel & Hospitality',
      tagline: 'Reservations, check-in and services attended 24/7',
      headline: 'Your AI Concierge — 5-Star Experience Around the Clock',
      body: 'Manages reservations, answers questions about availability, amenities, and hotel services. Handles guest requests with premium concierge quality.',
      features: [
        { title: 'Direct reservations', desc: 'Room bookings without going through OTAs, zero commission.' },
        { title: 'Virtual concierge', desc: 'Answers questions about amenities, restaurants, spa, and activities.' },
        { title: 'Guest requests', desc: 'Manages room service, transportation, and other requests.' },
      ],
    },
  },

  // ─── PROFESSIONAL ────────────────────────────────────────────────────────────

  {
    slug: 'legal',
    color: '#374151',
    lightColor: '#F9FAFB',
    category: 'professional',
    icon: '⚖️',
    imagePrompt: 'Professional AI legal receptionist, modern law office with wood paneling and books, formal headset, serious yet approachable atmosphere, 8k --ar 16:9',
    es: {
      name: 'Despacho Legal & Notaría',
      tagline: 'Consultas, citas y documentos gestionados con discreción',
      headline: 'Tu Recepcionista IA Legal — Primer Filtro Profesional y Confidencial',
      body: 'Califica leads, agenda consultas y responde preguntas frecuentes sobre áreas de práctica. Primer contacto profesional que nunca descansa.',
      features: [
        { title: 'Calificación de leads', desc: 'Filtra consultas por tipo de caso antes de agendar.' },
        { title: 'Agenda de consultas', desc: 'Primera cita organizada sin intervención del equipo legal.' },
        { title: 'FAQ legal', desc: 'Explica áreas de práctica y proceso inicial sin dar asesoría.' },
      ],
    },
    en: {
      name: 'Law Firm & Legal Services',
      tagline: 'Consultations, appointments and documents managed with discretion',
      headline: 'Your Legal AI Receptionist — Professional and Confidential First Filter',
      body: 'Qualifies leads, schedules consultations, and answers FAQs about practice areas. A professional first contact that never rests.',
      features: [
        { title: 'Lead qualification', desc: 'Filters inquiries by case type before scheduling.' },
        { title: 'Consultation scheduling', desc: 'First appointment organized without legal team intervention.' },
        { title: 'Legal FAQ', desc: 'Explains practice areas and initial process without giving legal advice.' },
      ],
    },
  },

  {
    slug: 'contabilidad',
    color: '#0F766E',
    lightColor: '#F0FDFA',
    category: 'professional',
    icon: '📊',
    imagePrompt: 'Professional AI accounting firm receptionist, modern financial office with screens, corporate headset, clean professional environment, 8k --ar 16:9',
    es: {
      name: 'Contaduría & Consultoría',
      tagline: 'Consultas fiscales, citas y documentación atendidas por IA',
      headline: 'Tu Recepcionista IA Contable — Eficiencia Profesional sin Tiempo de Espera',
      body: 'Califica consultas fiscales, agenda citas y recopila información previa de clientes. Tu despacho siempre accesible, incluso fuera de horario de oficina.',
      features: [
        { title: 'Calificación de consultas', desc: 'Identifica si es declaración anual, nómina, auditoría o consultoría.' },
        { title: 'Agenda de citas', desc: 'Reuniones con clientes nuevos y existentes organizadas sin fricción.' },
        { title: 'Recopilación de documentos', desc: 'Solicita lista de documentos necesarios antes de la cita.' },
      ],
    },
    en: {
      name: 'Accounting & Consulting',
      tagline: 'Tax consultations, appointments and documentation handled by AI',
      headline: 'Your Accounting AI Receptionist — Professional Efficiency Without Wait Times',
      body: 'Qualifies tax inquiries, schedules appointments, and gathers pre-meeting client information. Your firm always accessible, even outside office hours.',
      features: [
        { title: 'Consultation qualification', desc: 'Identifies whether it\'s annual filing, payroll, audit, or consulting.' },
        { title: 'Appointment scheduling', desc: 'Meetings with new and existing clients organized without friction.' },
        { title: 'Document collection', desc: 'Requests required document list before the appointment.' },
      ],
    },
  },
]

export function getIndustry(slug: string): Industry | undefined {
  return INDUSTRIES.find((i) => i.slug === slug)
}

export function getIndustriesByCategory(category: IndustryCategory): Industry[] {
  return INDUSTRIES.filter((i) => i.category === category)
}

/** Slugs shown in the home page hero cycling animation */
export const HERO_INDUSTRY_SLUGS = [
  'dental', 'restaurante', 'barberia', 'spa-salon', 'fitness', 'hotel',
]

/** Slugs shown prominently on the /industrias page grid */
export const HOME_INDUSTRIES = [
  'dental', 'restaurante', 'barberia', 'spa-salon', 'fitness', 'hotel',
  'psicologia', 'veterinaria', 'legal',
]
