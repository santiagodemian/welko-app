export interface IndustryRichContent {
  slug: string
  es: {
    stat1: { value: string; label: string }
    stat2: { value: string; label: string }
    stat3: { value: string; label: string }
    specific: {
      title: string
      items: { heading: string; desc: string }[]
    }
    aiByPlan: {
      essential: string
      pro: string
      business: string
    }
  }
  en: {
    stat1: { value: string; label: string }
    stat2: { value: string; label: string }
    stat3: { value: string; label: string }
    specific: {
      title: string
      items: { heading: string; desc: string }[]
    }
    aiByPlan: {
      essential: string
      pro: string
      business: string
    }
  }
}

export const INDUSTRY_RICH: IndustryRichContent[] = [
  {
    slug: 'dental',
    es: {
      stat1: { value: '60%', label: 'de pacientes dentales buscan cita fuera de horario de oficina' },
      stat2: { value: '35%', label: 'de llamadas a clínicas dentales quedan sin respuesta en horas pico' },
      stat3: { value: '+28%', label: 'de aumento en ingresos al eliminar la saturación de recepción' },
      specific: {
        title: 'Lo que hace diferente a Welko Dental',
        items: [
          { heading: 'Diferencia urgencias de rutina', desc: 'La IA identifica si el paciente describe dolor agudo, inflamación o accidente dental y prioriza la agenda del doctor automáticamente. Las limpiezas y revisiones de rutina se canalizan a los horarios de menor demanda.' },
          { heading: 'Seguimiento de tratamientos largos', desc: 'Para ortodoncia, implantes o endodoncias —tratamientos de múltiples visitas— la IA recuerda automáticamente al paciente sus citas de revisión y hace seguimiento si no confirma.' },
          { heading: 'Preguntas frecuentes al instante', desc: 'Costos de blanqueamiento, tiempo de ortodoncia, diferencia entre puente e implante: la IA responde todo sin que tu equipo tenga que interrumpir su trabajo.' },
        ],
      },
      aiByPlan: {
        essential: 'Agenda citas básicas, responde horarios y preguntas frecuentes de precios en WhatsApp e Instagram.',
        pro: 'Conoce terminología dental (endodoncia, ortodoncia, implantes, periodoncia). Diferencia urgencias de revisiones. CRM con historial de tratamientos. Voz IA para llamadas entrantes.',
        business: 'Coordina múltiples sucursales y especialistas. Integración con software dental (Dentrix, Dentsply). Reportes de ROI por tipo de tratamiento.',
      },
    },
    en: {
      stat1: { value: '60%', label: 'of dental patients look for appointments outside office hours' },
      stat2: { value: '35%', label: 'of calls to dental clinics go unanswered during peak hours' },
      stat3: { value: '+28%', label: 'revenue increase by eliminating reception overload' },
      specific: {
        title: "What makes Welko Dental different",
        items: [
          { heading: 'Differentiates emergencies from routine', desc: 'The AI identifies if a patient describes acute pain, swelling, or dental accident, and automatically prioritizes the doctor\'s schedule. Cleanings and routine checkups are channeled to lower-demand time slots.' },
          { heading: 'Long treatment follow-up', desc: 'For orthodontics, implants, or root canals —multi-visit treatments— the AI automatically reminds patients of their follow-up appointments and follows up if they don\'t confirm.' },
          { heading: 'Instant FAQ responses', desc: 'Whitening costs, orthodontics timeline, difference between bridge and implant: the AI answers everything without interrupting your team.' },
        ],
      },
      aiByPlan: {
        essential: 'Schedules basic appointments, answers hours and price FAQs on WhatsApp and Instagram.',
        pro: 'Knows dental terminology (endodontics, orthodontics, implants, periodontics). Differentiates emergencies from checkups. CRM with treatment history. Voice AI for incoming calls.',
        business: 'Coordinates multiple locations and specialists. Integration with dental software (Dentrix, Dentsply). ROI reports by treatment type.',
      },
    },
  },
  {
    slug: 'psicologia',
    es: {
      stat1: { value: '70%', label: 'de personas con problemas de salud mental no buscan ayuda por barreras de acceso' },
      stat2: { value: '48h', label: 'es el tiempo máximo tolerable de espera para una primera cita de salud mental' },
      stat3: { value: '40%', label: 'de inasistencias se reducen con recordatorios empáticos automatizados' },
      specific: {
        title: 'Welko Psicología: discreción y calidez ante todo',
        items: [
          { heading: 'Respuesta empática configurada', desc: 'La IA está entrenada para comunicarse con un tono cálido, sin juzgar. Cuando detecta palabras clave de crisis (ideación, urgencia, desesperación), escala inmediatamente al terapeuta o línea de emergencia.' },
          { heading: 'Privacidad total en cada interacción', desc: 'Ningún dato de la consulta se almacena fuera de tu sistema. El paciente puede explorar opciones y preguntar sobre costos sin sentir que está siendo evaluado.' },
          { heading: 'Gestión de lista de espera', desc: 'El terapeuta tiene agenda llena. La IA coloca al paciente en lista de espera y le avisa en cuanto haya un espacio disponible, sin que el paciente tenga que volver a llamar.' },
        ],
      },
      aiByPlan: {
        essential: 'Agenda citas iniciales, responde con calidez sobre servicios y costos. Disponible 24/7 en WhatsApp.',
        pro: 'Detecta palabras clave de crisis y escala automáticamente. Tono personalizado por tipo de terapia. CRM con notas de seguimiento. Recordatorios empáticos por sesión.',
        business: 'Coordina múltiples terapeutas y modalidades (individual, pareja, grupo). Reportes de adherencia al tratamiento.',
      },
    },
    en: {
      stat1: { value: '70%', label: 'of people with mental health issues don\'t seek help due to access barriers' },
      stat2: { value: '48h', label: 'is the maximum tolerable wait for a first mental health appointment' },
      stat3: { value: '40%', label: 'no-show reduction with automated empathetic reminders' },
      specific: {
        title: 'Welko Psychology: discretion and warmth above all',
        items: [
          { heading: 'Configured empathetic response', desc: 'The AI is trained to communicate with a warm, non-judgmental tone. When it detects crisis keywords (ideation, urgency, despair), it immediately escalates to the therapist or emergency line.' },
          { heading: 'Full privacy in every interaction', desc: 'No consultation data is stored outside your system. Patients can explore options and ask about costs without feeling evaluated.' },
          { heading: 'Waitlist management', desc: 'When the therapist\'s schedule is full, the AI places the patient on a waitlist and notifies them as soon as a slot opens — no need to call again.' },
        ],
      },
      aiByPlan: {
        essential: 'Schedules initial appointments, responds warmly about services and costs. Available 24/7 on WhatsApp.',
        pro: 'Detects crisis keywords and escalates automatically. Custom tone by therapy type. CRM with follow-up notes. Empathetic per-session reminders.',
        business: 'Coordinates multiple therapists and modalities (individual, couples, group). Treatment adherence reports.',
      },
    },
  },
  {
    slug: 'estetica',
    es: {
      stat1: { value: '25%', label: 'de citas de Botox y rellenos representan no-shows sin recordatorio previo' },
      stat2: { value: '$3,500', label: 'es el costo promedio de un no-show en tratamientos estéticos de alta gama' },
      stat3: { value: '2x', label: 'más reservas cuando se responde en menos de 5 minutos vs. más de 1 hora' },
      specific: {
        title: 'Welko Estética: convierte consultas en citas y citas en ingresos',
        items: [
          { heading: 'Elimina los No-Shows de Botox', desc: 'La IA envía hasta 3 recordatorios antes de cada cita de Botox, rellenos o tratamientos láser. El paciente confirma directamente por WhatsApp. Si no confirma, libera el espacio para otro paciente.' },
          { heading: 'Asesora antes de que lleguen', desc: 'Responde preguntas sobre procedimientos, tiempos de recuperación, cuidados post-tratamiento y precios de forma inmediata. El paciente llega más informado y decidido.' },
          { heading: 'Agenda multi-tratamiento', desc: 'Un paciente puede agendar su sesión de Botox, masaje y consulta de nutrición en la misma conversación. La IA coordina sin conflictos de agenda.' },
        ],
      },
      aiByPlan: {
        essential: 'Agenda citas, responde preguntas sobre tratamientos y precios. Recordatorios básicos por WhatsApp.',
        pro: 'Conoce terminología de estética médica (toxina botulínica, ácido hialurónico, IPL, ultherapy). Secuencia de recordatorios anti no-show. CRM con historial de tratamientos por paciente.',
        business: 'Multi-sucursal y múltiples especialistas. Integración con sistemas de punto de venta. Análisis de tratamientos más rentables.',
      },
    },
    en: {
      stat1: { value: '25%', label: 'of Botox and filler appointments are no-shows without prior reminder' },
      stat2: { value: '$3,500', label: 'average cost of a no-show in high-end aesthetic treatments (MXN)' },
      stat3: { value: '2x', label: 'more bookings when responding in under 5 min vs. over 1 hour' },
      specific: {
        title: 'Welko Aesthetic: turn inquiries into bookings and bookings into revenue',
        items: [
          { heading: 'Eliminate Botox No-Shows', desc: 'The AI sends up to 3 reminders before each Botox, filler, or laser treatment. Patients confirm directly via WhatsApp. If they don\'t confirm, the slot is released for another patient.' },
          { heading: 'Advises before they arrive', desc: 'Answers questions about procedures, recovery times, post-treatment care, and prices immediately. Patients arrive more informed and decided.' },
          { heading: 'Multi-treatment scheduling', desc: 'A patient can book their Botox session, massage, and nutrition consultation in the same conversation. The AI coordinates without scheduling conflicts.' },
        ],
      },
      aiByPlan: {
        essential: 'Schedules appointments, answers questions about treatments and prices. Basic WhatsApp reminders.',
        pro: 'Knows medical aesthetic terminology (botulinum toxin, hyaluronic acid, IPL, ultherapy). Anti no-show reminder sequence. CRM with patient treatment history.',
        business: 'Multi-location and multiple specialists. POS system integration. Most profitable treatment analytics.',
      },
    },
  },
  {
    slug: 'nutricion',
    es: {
      stat1: { value: '65%', label: 'de pacientes de nutrición abandona el seguimiento después de la primera consulta sin recordatorio' },
      stat2: { value: '3.2x', label: 'más adherencia al plan nutricional con seguimiento automatizado semanal' },
      stat3: { value: '80%', label: 'de consultas de nutrición se inician por redes sociales o WhatsApp' },
      specific: {
        title: 'Welko Nutrición: adherencia y seguimiento continuo',
        items: [
          { heading: 'Recordatorios de control semanales', desc: 'La IA agenda y recuerda automáticamente las citas de seguimiento cada semana o quincena según el plan del nutriólogo. El paciente no tiene que recordar llamar.' },
          { heading: 'Captura de datos previos a la consulta', desc: 'Antes de la primera cita, la IA recopila por WhatsApp datos básicos: peso actual, objetivo, alergias, antecedentes. El nutriólogo aprovecha mejor cada minuto de consulta.' },
          { heading: 'Responde dudas entre consultas', desc: 'El paciente puede preguntar sobre substituciones de alimentos, porciones o recetas saludables en cualquier momento. La IA responde dentro del protocolo configurado por el nutriólogo.' },
        ],
      },
      aiByPlan: {
        essential: 'Agenda primera cita y seguimientos. Responde dudas básicas sobre el servicio y horarios.',
        pro: 'Protocolo de recopilación de datos pre-consulta. Recordatorios de control semanales configurables. CRM con progreso del paciente. Tono de marca personalizado.',
        business: 'Coordinación de equipo multidisciplinario (nutriólogo + médico + psicólogo). Reportes de adherencia al tratamiento por paciente.',
      },
    },
    en: {
      stat1: { value: '65%', label: 'of nutrition patients abandon follow-up after the first consultation without reminders' },
      stat2: { value: '3.2x', label: 'more adherence to the nutritional plan with automated weekly follow-up' },
      stat3: { value: '80%', label: 'of nutrition consultations are initiated via social media or WhatsApp' },
      specific: {
        title: 'Welko Nutrition: continuous adherence and follow-up',
        items: [
          { heading: 'Weekly control reminders', desc: 'The AI automatically schedules and reminds patients of follow-up appointments weekly or bi-weekly according to the nutritionist\'s plan. Patients don\'t have to remember to call.' },
          { heading: 'Pre-consultation data capture', desc: 'Before the first appointment, the AI collects basic data via WhatsApp: current weight, goal, allergies, medical history. The nutritionist gets more out of every minute of consultation.' },
          { heading: 'Answers questions between consultations', desc: 'Patients can ask about food substitutions, portions, or healthy recipes at any time. The AI responds within the protocol configured by the nutritionist.' },
        ],
      },
      aiByPlan: {
        essential: 'Schedules first appointment and follow-ups. Answers basic questions about the service and hours.',
        pro: 'Pre-consultation data collection protocol. Configurable weekly control reminders. Patient progress CRM. Custom brand voice.',
        business: 'Multidisciplinary team coordination (nutritionist + physician + psychologist). Patient treatment adherence reports.',
      },
    },
  },
  {
    slug: 'ginecologia',
    es: {
      stat1: { value: '55%', label: 'de mujeres pospone citas ginecológicas por dificultad para agendar' },
      stat2: { value: '90%', label: 'de pacientes prefiere un canal digital y discreto para agendar' },
      stat3: { value: '1 de 3', label: 'pacientes embarazadas pierde una cita prenatal por falta de recordatorio' },
      specific: {
        title: 'Welko Ginecología: confianza, discreción y seguimiento',
        items: [
          { heading: 'Canal discreto y de confianza', desc: 'La paciente puede agendar su colposcopia, ultrasonido o consulta de planificación familiar de forma discreta y sin incomodidad, en el horario que mejor le convenga.' },
          { heading: 'Seguimiento de embarazo automatizado', desc: 'La IA registra la semana de gestación y programa automáticamente recordatorios para cada cita prenatal, Doppler, ultrasonidos y consultas post-parto.' },
          { heading: 'Recordatorios preventivos anuales', desc: 'El sistema recuerda a cada paciente cuando es momento de su Papanicolaou o mastografía anual, aumentando la adherencia al cuidado preventivo.' },
        ],
      },
      aiByPlan: {
        essential: 'Agenda citas de consulta, ultrasonido y seguimiento. Responde preguntas de servicios y horarios.',
        pro: 'Protocolo de seguimiento prenatal automatizado. Recordatorios de estudios preventivos anuales. CRM con historial reproductivo y obstétrico.',
        business: 'Coordinación con laboratorio, ultrasonido y hospital. Integración con expediente clínico electrónico. Multi-consultorio.',
      },
    },
    en: {
      stat1: { value: '55%', label: 'of women postpone gynecological appointments due to scheduling difficulty' },
      stat2: { value: '90%', label: 'of patients prefer a digital and discreet channel for scheduling' },
      stat3: { value: '1 in 3', label: 'pregnant patients miss a prenatal appointment due to lack of reminder' },
      specific: {
        title: 'Welko Gynecology: trust, discretion, and follow-up',
        items: [
          { heading: 'Discreet and trusted channel', desc: 'Patients can schedule their colposcopy, ultrasound, or family planning consultation discreetly and comfortably, at the time that suits them best.' },
          { heading: 'Automated pregnancy follow-up', desc: 'The AI records the week of gestation and automatically schedules reminders for each prenatal appointment, Doppler, ultrasounds, and postpartum consultations.' },
          { heading: 'Annual preventive reminders', desc: 'The system reminds each patient when it\'s time for their annual Pap smear or mammogram, increasing adherence to preventive care.' },
        ],
      },
      aiByPlan: {
        essential: 'Schedules consultation, ultrasound, and follow-up appointments. Answers service and hours questions.',
        pro: 'Automated prenatal follow-up protocol. Annual preventive study reminders. CRM with reproductive and obstetric history.',
        business: 'Coordination with lab, ultrasound, and hospital. EHR integration. Multi-office.',
      },
    },
  },
  {
    slug: 'oftalmologia',
    es: {
      stat1: { value: '40%', label: 'de personas no acude a revisión anual de vista por no recordar agendarla' },
      stat2: { value: '8 de 10', label: 'pacientes de LASIK investigan por WhatsApp antes de llamar' },
      stat3: { value: '3 sem', label: 'es el tiempo de seguimiento crítico post-cirugía refractiva sin cita programada' },
      specific: {
        title: 'Welko Oftalmología: precisión y seguimiento post-operatorio',
        items: [
          { heading: 'Proceso de información pre-LASIK', desc: 'Los candidatos a cirugía refractiva tienen muchas preguntas. La IA responde sobre candidatura, proceso, riesgos y costos al instante, filtrando candidatos calificados para el médico.' },
          { heading: 'Recordatorios de revisión anual', desc: 'El sistema recuerda automáticamente a cada paciente cuando deben renovar su graduación o acudir a revisión de fondo de ojo, en una fecha calculada desde su última visita.' },
          { heading: 'Seguimiento post-operatorio preciso', desc: 'Después de una cirugía de cataratas o LASIK, la IA programa y recuerda las revisiones al día 1, semana 1 y mes 1 automáticamente, garantizando el seguimiento clínico correcto.' },
        ],
      },
      aiByPlan: {
        essential: 'Agenda citas de revisión de vista y exámenes. Responde preguntas de servicios y precios.',
        pro: 'Conoce terminología oftalmológica (refracción, cataratas, glaucoma, LASIK). Seguimiento post-operatorio automatizado. CRM con historial visual del paciente.',
        business: 'Coordinación con optometría, cirugía y lentes de contacto. Integración con equipos de diagnóstico. Multi-consultorio.',
      },
    },
    en: {
      stat1: { value: '40%', label: 'of people skip their annual eye exam because they forget to schedule it' },
      stat2: { value: '8 in 10', label: 'LASIK patients research via WhatsApp before calling' },
      stat3: { value: '3 weeks', label: 'is the critical follow-up period post-refractive surgery without a scheduled appointment' },
      specific: {
        title: 'Welko Ophthalmology: precision and post-operative follow-up',
        items: [
          { heading: 'Pre-LASIK information process', desc: 'Refractive surgery candidates have many questions. The AI answers about candidacy, process, risks, and costs instantly, filtering qualified candidates for the doctor.' },
          { heading: 'Annual exam reminders', desc: 'The system automatically reminds each patient when they need to renew their prescription or have a fundus exam, calculated from their last visit.' },
          { heading: 'Precise post-operative follow-up', desc: 'After cataract or LASIK surgery, the AI schedules and reminds patients of day 1, week 1, and month 1 follow-ups automatically, ensuring proper clinical monitoring.' },
        ],
      },
      aiByPlan: {
        essential: 'Schedules vision checks and exams. Answers service and price questions.',
        pro: 'Knows ophthalmology terminology (refraction, cataracts, glaucoma, LASIK). Automated post-operative follow-up. CRM with patient visual history.',
        business: 'Coordination with optometry, surgery, and contact lenses. Diagnostic equipment integration. Multi-office.',
      },
    },
  },
  {
    slug: 'medicina',
    es: {
      stat1: { value: '45%', label: 'de consultas médicas generales se solicitan fuera del horario de oficina' },
      stat2: { value: '3 min', label: 'es el tiempo máximo que un paciente espera antes de colgar y buscar otro médico' },
      stat3: { value: '22%', label: 'de los pacientes que no obtienen respuesta inmediata no regresan a intentarlo' },
      specific: {
        title: 'Welko Medicina: siempre presente, sin saturar a tu equipo',
        items: [
          { heading: 'Triage inicial sin intervención', desc: 'La IA clasifica si la consulta es urgente, semi-urgente o de rutina. Las urgencias se canalizan de inmediato al médico o a urgencias. Las rutinas se agendan en el primer espacio disponible.' },
          { heading: 'Citas fuera de horario sin costo extra', desc: 'El consultorio duerme, la IA no. Pacientes que llaman a las 11pm pueden agendar su cita de mañana sin que nadie tenga que levantar el teléfono.' },
          { heading: 'Gestión de múltiples especialistas', desc: '¿El médico general deriva a cardiología o nutrición? La IA coordina la cita con el especialista correspondiente en el mismo consultorio.' },
        ],
      },
      aiByPlan: {
        essential: 'Agenda citas, responde preguntas de servicios y horarios. Triage básico por síntomas descritos.',
        pro: 'Triage avanzado con vocabulario médico general. CRM con historial de visitas. Llamadas de voz IA. Recordatorios pre y post consulta.',
        business: 'Multi-especialidad y multi-consultorio. Integración con expediente clínico electrónico (EHR). Reportes de ocupación y ROI por especialidad.',
      },
    },
    en: {
      stat1: { value: '45%', label: 'of general medical consultations are requested outside office hours' },
      stat2: { value: '3 min', label: 'is the max time a patient waits before hanging up and looking for another doctor' },
      stat3: { value: '22%', label: 'of patients who don\'t get immediate response don\'t try again' },
      specific: {
        title: 'Welko Medicine: always present, without overloading your team',
        items: [
          { heading: 'Initial triage without intervention', desc: 'The AI classifies whether the consultation is urgent, semi-urgent, or routine. Emergencies are immediately channeled to the doctor or ER. Routine cases are scheduled in the first available slot.' },
          { heading: 'After-hours appointments at no extra cost', desc: 'The office sleeps, the AI doesn\'t. Patients who call at 11pm can book tomorrow\'s appointment without anyone having to answer the phone.' },
          { heading: 'Multiple specialist management', desc: 'Does the general practitioner refer to cardiology or nutrition? The AI coordinates the specialist appointment at the same practice.' },
        ],
      },
      aiByPlan: {
        essential: 'Schedules appointments, answers service and hours questions. Basic triage by described symptoms.',
        pro: 'Advanced triage with general medical vocabulary. Visit history CRM. AI voice calls. Pre and post-consultation reminders.',
        business: 'Multi-specialty and multi-office. EHR integration. Occupancy and ROI reports by specialty.',
      },
    },
  },
  {
    slug: 'veterinaria',
    es: {
      stat1: { value: '68%', label: 'de propietarios de mascotas olvidan las vacunas anuales sin recordatorio activo' },
      stat2: { value: '$850', label: 'es el ingreso promedio por mascota cuando se activan recordatorios de vacunas + desparasitación' },
      stat3: { value: '30%', label: 'de las clínicas veterinarias pierden pacientes por no seguir después de la primera visita' },
      specific: {
        title: 'Welko Veterinaria: el recordatorio que genera ingresos recurrentes',
        items: [
          { heading: 'Recordatorios de vacunas y desparasitación', desc: 'La IA calcula automáticamente cuándo vence la próxima vacuna de cada mascota registrada y envía un recordatorio personalizado al dueño. Es el servicio con mayor impacto en ingresos recurrentes para clínicas veterinarias.' },
          { heading: 'Gestión de urgencias animales', desc: 'Cuando un dueño llama desesperado porque su mascota tuvo un accidente, la IA responde de inmediato con instrucciones básicas de primeros auxilios y confirma si hay médico disponible o canaliza a urgencias.' },
          { heading: 'Agenda de servicios múltiples', desc: 'En una sola conversación, el dueño puede agendar la consulta, el baño y el control de vacunas para su mascota. La IA coordina sin chocar horarios.' },
        ],
      },
      aiByPlan: {
        essential: 'Agenda citas de consulta y grooming. Responde preguntas de servicios, horarios y precios.',
        pro: 'Protocolo de recordatorios de vacunas y desparasitación por especie. CRM con historial de mascotas por dueño. Voz IA para llamadas. Tono de marca personalizado.',
        business: 'Multi-clínica. Integración con software veterinario (ezyVet, Cornerstone). Reportes de ingresos por tipo de servicio y especie.',
      },
    },
    en: {
      stat1: { value: '68%', label: 'of pet owners forget annual vaccines without active reminders' },
      stat2: { value: '$850', label: 'average revenue per pet when vaccine + deworming reminders are activated (MXN)' },
      stat3: { value: '30%', label: 'of veterinary clinics lose patients by not following up after the first visit' },
      specific: {
        title: 'Welko Veterinary: the reminder that generates recurring revenue',
        items: [
          { heading: 'Vaccine and deworming reminders', desc: 'The AI automatically calculates when each registered pet\'s next vaccine is due and sends a personalized reminder to the owner. This is the highest-impact service for recurring revenue in veterinary clinics.' },
          { heading: 'Animal emergency management', desc: 'When an owner calls desperately because their pet had an accident, the AI responds immediately with basic first aid instructions and confirms if a doctor is available or channels to emergency care.' },
          { heading: 'Multi-service scheduling', desc: 'In a single conversation, the owner can schedule the consultation, bath, and vaccine control for their pet. The AI coordinates without scheduling conflicts.' },
        ],
      },
      aiByPlan: {
        essential: 'Schedules consultation and grooming appointments. Answers service, hours, and price questions.',
        pro: 'Vaccine and deworming reminder protocol by species. Pet history CRM by owner. AI voice calls. Custom brand voice.',
        business: 'Multi-clinic. Veterinary software integration (ezyVet, Cornerstone). Revenue reports by service type and species.',
      },
    },
  },
  {
    slug: 'fisioterapia',
    es: {
      stat1: { value: '42%', label: 'de pacientes de fisioterapia abandona el plan de rehabilitación antes de terminar' },
      stat2: { value: '3x', label: 'más adherencia al tratamiento con recordatorios de sesión automatizados' },
      stat3: { value: '60%', label: 'de clínicas de fisio operan con lista de espera pero sin sistema de notificación' },
      specific: {
        title: 'Welko Fisioterapia: agenda llena y adherencia garantizada',
        items: [
          { heading: 'Notificación automática de cancelaciones', desc: 'Cuando un paciente cancela, la IA notifica inmediatamente al primer paciente en lista de espera. El hueco se llena en minutos, sin que el fisioterapeuta tenga que hacer ninguna llamada.' },
          { heading: 'Seguimiento de planes de rehabilitación', desc: 'La IA sabe en qué sesión va cada paciente y ajusta los recordatorios según la frecuencia del plan (diaria, 3 veces por semana, quincenal). También avisa cuando el paciente se acerca al alta.' },
          { heading: 'Recopilación de evolución pre-sesión', desc: 'Antes de cada sesión, la IA puede preguntar al paciente cómo se sintió después de la última cita. El fisioterapeuta recibe ese resumen antes de que el paciente llegue al consultorio.' },
        ],
      },
      aiByPlan: {
        essential: 'Agenda sesiones, responde preguntas de servicios y precios. Recordatorios básicos de cita.',
        pro: 'Seguimiento de plan de rehabilitación por paciente. Sistema de lista de espera automatizado. CRM con notas de evolución. Recordatorios ajustados a frecuencia del tratamiento.',
        business: 'Multi-fisioterapeuta y multi-consultorio. Integración con expediente clínico de rehabilitación. Reportes de alta y adherencia.',
      },
    },
    en: {
      stat1: { value: '42%', label: 'of physiotherapy patients abandon their rehabilitation plan before finishing' },
      stat2: { value: '3x', label: 'more treatment adherence with automated session reminders' },
      stat3: { value: '60%', label: 'of physio clinics operate with a waitlist but no notification system' },
      specific: {
        title: 'Welko Physiotherapy: full schedule and guaranteed adherence',
        items: [
          { heading: 'Automatic cancellation notification', desc: 'When a patient cancels, the AI immediately notifies the first patient on the waitlist. The slot is filled in minutes, without the physiotherapist making a single call.' },
          { heading: 'Rehabilitation plan follow-up', desc: 'The AI knows which session each patient is on and adjusts reminders according to the plan frequency (daily, 3 times a week, bi-weekly). It also alerts when a patient is approaching discharge.' },
          { heading: 'Pre-session progress collection', desc: 'Before each session, the AI can ask the patient how they felt after the last appointment. The physiotherapist receives that summary before the patient arrives.' },
        ],
      },
      aiByPlan: {
        essential: 'Schedules sessions, answers service and price questions. Basic appointment reminders.',
        pro: 'Rehabilitation plan follow-up per patient. Automated waitlist system. CRM with progress notes. Reminders adjusted to treatment frequency.',
        business: 'Multi-physiotherapist and multi-office. Rehabilitation clinical record integration. Discharge and adherence reports.',
      },
    },
  },
  {
    slug: 'dermatologia',
    es: {
      stat1: { value: '50%', label: 'de consultas de dermatología comienzan con una foto enviada por WhatsApp' },
      stat2: { value: '2.5x', label: 'más probabilidad de continuar tratamiento cuando se reciben recordatorios de renovación' },
      stat3: { value: '35%', label: 'de ingresos recurrentes provienen de tratamientos continuos (acné, psoriasis, anti-edad)' },
      specific: {
        title: 'Welko Dermatología: primera impresión impecable y seguimiento continuo',
        items: [
          { heading: 'Triaje fotográfico pre-consulta', desc: 'El paciente envía una foto de su condición por WhatsApp. La IA registra la imagen en el expediente y programa la cita según la urgencia observada. El dermatólogo llega a consulta ya con contexto visual.' },
          { heading: 'Seguimiento de tratamientos continuos', desc: 'Para acné, rosácea, psoriasis o tratamientos anti-edad que duran semanas o meses, la IA recuerda automáticamente al paciente cada renovación de crema o sesión de seguimiento.' },
          { heading: 'Información de procedimientos al instante', desc: '¿Cuánto dura una sesión de peeling? ¿Cuándo se ven resultados del láser? La IA responde estas preguntas frecuentes al instante, reduciendo la carga de tu equipo.' },
        ],
      },
      aiByPlan: {
        essential: 'Agenda citas de consulta y procedimientos. Responde preguntas de servicios, precios y horarios.',
        pro: 'Protocolo de seguimiento por tipo de condición. Recordatorios de renovación de tratamiento. CRM con historial dermatológico. Tono de marca configurado.',
        business: 'Multi-dermatólogo y multi-consultorio. Integración con expediente dermatológico. Reportes de tratamientos más solicitados y recurrentes.',
      },
    },
    en: {
      stat1: { value: '50%', label: 'of dermatology consultations start with a photo sent via WhatsApp' },
      stat2: { value: '2.5x', label: 'more likely to continue treatment when renewal reminders are received' },
      stat3: { value: '35%', label: 'of recurring revenue comes from ongoing treatments (acne, psoriasis, anti-aging)' },
      specific: {
        title: 'Welko Dermatology: impeccable first impression and continuous follow-up',
        items: [
          { heading: 'Pre-consultation photo triage', desc: 'The patient sends a photo of their condition via WhatsApp. The AI records the image in the file and schedules the appointment based on observed urgency. The dermatologist arrives to the consultation already with visual context.' },
          { heading: 'Continuous treatment follow-up', desc: 'For acne, rosacea, psoriasis, or anti-aging treatments lasting weeks or months, the AI automatically reminds patients of each cream renewal or follow-up session.' },
          { heading: 'Instant procedure information', desc: 'How long does a peeling session last? When do laser results appear? The AI answers these FAQs instantly, reducing the load on your team.' },
        ],
      },
      aiByPlan: {
        essential: 'Schedules consultation and procedure appointments. Answers service, price, and hours questions.',
        pro: 'Follow-up protocol by condition type. Treatment renewal reminders. CRM with dermatological history. Configured brand voice.',
        business: 'Multi-dermatologist and multi-office. Dermatological record integration. Most requested and recurring treatment reports.',
      },
    },
  },
]

export function getIndustryRich(slug: string): IndustryRichContent | undefined {
  return INDUSTRY_RICH.find((i) => i.slug === slug)
}
