/**
 * Welko — Cerebro Médico
 * Knowledge base per specialty loaded automatically during onboarding.
 * The AI uses this to understand clinical vocabulary and answer patient questions.
 */

export interface KnowledgeEntry {
  term: string
  explanation: string // what the AI uses to explain the term to patients
}

export interface SpecialtyKnowledge {
  slug: string
  label: string
  emoji: string
  /** Short greeting the AI shows the doctor after loading the knowledge base */
  aiGreeting: string
  aiGreetingEn: string
  /** Clinical terms the AI learns for this specialty */
  terms: KnowledgeEntry[]
  /** Common questions patients ask — AI knows these by heart */
  commonQuestions: string[]
}

export const KNOWLEDGE_BASE: SpecialtyKnowledge[] = [
  /* ── DENTAL ── */
  {
    slug: 'dental',
    label: 'Odontología',
    emoji: '🦷',
    aiGreeting: '¡Excelente! Ya cargué los conocimientos de Odontología en mi sistema. Conozco la diferencia entre limpiezas, resinas, endodoncias, ortodoncia y carillas. Solo confírmame tus horarios.',
    aiGreetingEn: 'Excellent! I\'ve loaded Dentistry knowledge into my system. I know the difference between cleanings, fillings, root canals, orthodontics, and veneers. Just confirm your hours.',
    terms: [
      { term: 'Limpieza dental', explanation: 'Procedimiento preventivo que elimina sarro y placa bacteriana. Dura ~45 min y se recomienda cada 6 meses.' },
      { term: 'Resina dental', explanation: 'Restauración estética del color del diente para caries o fracturas. No require anestesia general, dura ~1 hora.' },
      { term: 'Endodoncia', explanation: 'Tratamiento de conductos para dientes con infección profunda. Elimina el nervio y sella el canal. 1-3 sesiones.' },
      { term: 'Ortodoncia', explanation: 'Corrección de la posición dental con brackets o alineadores. Proceso de 12-24 meses según el caso.' },
      { term: 'Carilla dental', explanation: 'Lámina de porcelana o resina que se adhiere al frente del diente para mejorar su forma, color o tamaño. Resultado inmediato.' },
      { term: 'Implante dental', explanation: 'Tornillo de titanio que reemplaza la raíz del diente perdido. Se coloca quirúrgicamente y luego se corona. Proceso de 3-6 meses.' },
      { term: 'Blanqueamiento', explanation: 'Aclaramiento del tono dental con agentes peróxidos. Puede ser en clínica (1h) o en casa (7-14 días).' },
      { term: 'Extracción', explanation: 'Remoción de un diente que no puede ser tratado. Se realiza con anestesia local. Recuperación 2-3 días.' },
      { term: 'Corona dental', explanation: 'Funda protectora que cubre un diente debilitado o con gran restauración. Porcelana, zirconia o metal-porcelana.' },
      { term: 'Bruxismo', explanation: 'Hábito de apretar o rechinar los dientes, generalmente al dormir. Se trata con guarda oclusal.' },
    ],
    commonQuestions: [
      '¿Cuánto cuesta una limpieza?',
      '¿Duele la endodoncia?',
      '¿Cuánto dura el blanqueamiento?',
      '¿Los implantes son de por vida?',
      '¿Qué diferencia hay entre resina y porcelana?',
    ],
  },

  /* ── PSICOLOGÍA ── */
  {
    slug: 'psicologia',
    label: 'Psicología',
    emoji: '🧠',
    aiGreeting: '¡Excelente! Ya cargué los conocimientos de Psicología en mi sistema. Manejo vocabulario de contención, diferencia entre terapias individual, de pareja y cognitivo-conductual. Solo confírmame tus horarios.',
    aiGreetingEn: 'Excellent! I\'ve loaded Psychology knowledge. I understand containment vocabulary, individual vs couples therapy, and CBT. Just confirm your hours.',
    terms: [
      { term: 'Terapia individual', explanation: 'Sesiones uno a uno entre paciente y psicólogo. Frecuencia habitual: 1 vez por semana, 50 min por sesión.' },
      { term: 'Terapia de pareja', explanation: 'Sesiones con ambos miembros de la pareja para mejorar comunicación y resolver conflictos. 60-90 min.' },
      { term: 'Terapia cognitivo-conductual (TCC)', explanation: 'Enfoque basado en identificar y cambiar patrones de pensamiento y conducta negativos. Alta efectividad en ansiedad y depresión.' },
      { term: 'Contención emocional', explanation: 'Técnicas para acompañar al paciente en momentos de crisis emocional sin minimizar ni amplificar su estado.' },
      { term: 'Primera consulta', explanation: 'Sesión de evaluación inicial donde el psicólogo explora la historia del paciente y define el plan terapéutico.' },
      { term: 'Crisis emocional', explanation: 'Estado de desestabilización emocional aguda. En casos de riesgo, se activa protocolo de urgencia.' },
      { term: 'Ansiedad', explanation: 'Estado de alerta excesiva y preocupación constante. Uno de los motivos de consulta más frecuentes.' },
      { term: 'Depresión', explanation: 'Trastorno del estado de ánimo caracterizado por tristeza persistente, pérdida de interés y energía.' },
      { term: 'Psicoterapia online', explanation: 'Sesiones por videollamada. Misma efectividad que presencial para la mayoría de los casos.' },
      { term: 'Alta terapéutica', explanation: 'Conclusión del proceso cuando el paciente ha alcanzado sus objetivos terapéuticos.' },
    ],
    commonQuestions: [
      '¿Cuántas sesiones necesito?',
      '¿Es confidencial lo que hablo?',
      '¿Haces terapia online?',
      '¿Cuánto cuesta la primera consulta?',
      '¿Atiendes urgencias?',
    ],
  },

  /* ── ESTÉTICA ── */
  {
    slug: 'estetica',
    label: 'Estética',
    emoji: '✨',
    aiGreeting: '¡Excelente! Ya cargué los conocimientos de Estética Facial y Dental en mi sistema. Conozco botox, bichectomía, lipopapada, carillas y más. Solo confírmame tus horarios.',
    aiGreetingEn: 'Excellent! I\'ve loaded Facial & Dental Aesthetic knowledge. I know botox, bichectomy, lipopapad, veneers and more. Just confirm your hours.',
    terms: [
      { term: 'Botox (toxina botulínica)', explanation: 'Inyección que relaja músculos faciales para reducir arrugas de expresión. Efecto dura 4-6 meses. Sin cirugía.' },
      { term: 'Bichectomía', explanation: 'Extracción de las bolsas de Bichat para afinar el rostro. Procedimiento quirúrgico ambulatorio de ~1 hora.' },
      { term: 'Lipopapada', explanation: 'Eliminación de grasa submentoniana (doble mentón) con lipo o ácido desoxicólico. Sin cicatrices visibles.' },
      { term: 'Ácido hialurónico', explanation: 'Relleno dérmico para labios, pómulos y surcos. Resultado inmediato, dura 6-18 meses.' },
      { term: 'Rinomodelación', explanation: 'Corrección no quirúrgica de la nariz con relleno. Resultados en 30 minutos, sin anestesia general.' },
      { term: 'Peeling químico', explanation: 'Exfoliación profunda de la piel con ácidos. Mejora manchas, cicatrices y textura. 3-5 sesiones.' },
      { term: 'Láser CO2', explanation: 'Tratamiento de rejuvenecimiento y manchas con láser fraccionado. Recuperación 5-10 días.' },
      { term: 'Hydrafacial', explanation: 'Limpieza facial profunda con hidrodermoabrasión. Sin tiempo de recuperación. Resultados inmediatos.' },
      { term: 'Hilo tensor', explanation: 'Lifting sin cirugía con hilos reabsorbibles. Levanta tejidos caídos. Efecto 12-18 meses.' },
      { term: 'Carilla dental estética', explanation: 'Láminas de porcelana ultra-finas para transformar la sonrisa. Resultado permanente y natural.' },
    ],
    commonQuestions: [
      '¿Cuánto dura el botox?',
      '¿La bichectomía duele mucho?',
      '¿Qué rellenos usan?',
      '¿Qué hago antes del procedimiento?',
      '¿Tienen financiamiento?',
    ],
  },

  /* ── NUTRICIÓN ── */
  {
    slug: 'nutricion',
    label: 'Nutrición',
    emoji: '🥗',
    aiGreeting: '¡Excelente! Ya cargué los conocimientos de Nutrición Clínica en mi sistema. Manejo conceptos de planes alimenticios, IMC, control de peso y patologías metabólicas. Solo confírmame tus horarios.',
    aiGreetingEn: 'Excellent! I\'ve loaded Clinical Nutrition knowledge. I handle meal plans, BMI, weight control, and metabolic conditions. Just confirm your hours.',
    terms: [
      { term: 'Consulta inicial nutricional', explanation: 'Primera cita donde se evalúa peso, talla, composición corporal, hábitos y objetivos. Dura ~60 minutos.' },
      { term: 'Plan de alimentación', explanation: 'Dieta personalizada basada en las metas y condición del paciente. Se actualiza en cada seguimiento.' },
      { term: 'IMC (Índice de Masa Corporal)', explanation: 'Relación peso/talla² para clasificar el estado nutricional: bajo peso, normal, sobrepeso u obesidad.' },
      { term: 'Composición corporal', explanation: 'Análisis de porcentaje de grasa, músculo y agua. Se realiza con bioimpedancia.' },
      { term: 'Síndrome metabólico', explanation: 'Conjunto de condiciones (glucosa alta, presión alta, triglicéridos elevados) que aumentan riesgo cardiovascular.' },
      { term: 'Diabetes tipo 2', explanation: 'Condición crónica donde el cuerpo no usa bien la insulina. La dieta es pilar fundamental del tratamiento.' },
      { term: 'Intolerancia al gluten', explanation: 'Reacción adversa al gluten. Requiere plan de alimentación sin trigo, cebada ni centeno.' },
      { term: 'Nutrición deportiva', explanation: 'Plan alimenticio para mejorar rendimiento y recuperación atlética. Incluye timing de macronutrientes.' },
      { term: 'Alimentación intuitiva', explanation: 'Enfoque que enseña a reconocer señales internas de hambre y saciedad, sin contar calorías.' },
      { term: 'Seguimiento nutricional', explanation: 'Citas periódicas (cada 2-4 semanas) para ajustar el plan según el progreso del paciente.' },
    ],
    commonQuestions: [
      '¿Cuánto tarda en verse resultados?',
      '¿Haces planes para deportistas?',
      '¿Qué pasa si tengo diabetes?',
      '¿Con qué frecuencia debo ir?',
      '¿Cobras por el plan alimenticio?',
    ],
  },

  /* ── GINECOLOGÍA ── */
  {
    slug: 'ginecologia',
    label: 'Ginecología',
    emoji: '🌸',
    aiGreeting: '¡Excelente! Ya cargué los conocimientos de Ginecología en mi sistema. Manejo control prenatal, Papanicolaou, colposcopia, anticonceptivos y más. Solo confírmame tus horarios.',
    aiGreetingEn: 'Excellent! I\'ve loaded Gynecology knowledge. I handle prenatal care, Pap smears, colposcopy, contraceptives and more. Just confirm your hours.',
    terms: [
      { term: 'Papanicolaou (Pap)', explanation: 'Examen preventivo para detectar células anormales en el cuello uterino. Se recomienda anualmente.' },
      { term: 'Colposcopia', explanation: 'Examen visual del cuello uterino con lente de aumento para evaluar células anormales después de un Pap alterado.' },
      { term: 'Control prenatal', explanation: 'Serie de citas durante el embarazo para monitorear la salud de madre e hijo. 1ª cita: antes de semana 12.' },
      { term: 'Ultrasonido obstétrico', explanation: 'Imagen por ultrasonido para evaluar el desarrollo del bebé. Frecuencia: semanas 12, 20 y 32.' },
      { term: 'Anticonceptivos hormonales', explanation: 'Pastillas, parche, inyección o DIU hormonal para prevenir embarazo. Requieren receta médica.' },
      { term: 'DIU (dispositivo intrauterino)', explanation: 'Método anticonceptivo colocado dentro del útero. Puede ser hormonal (Mirena) o de cobre. Dura 5-10 años.' },
      { term: 'Endometriosis', explanation: 'Tejido similar al endometrio crece fuera del útero. Causa dolor pélvico e infertilidad en algunos casos.' },
      { term: 'Síndrome de ovario poliquístico (SOP)', explanation: 'Condición hormonal con quistes en ovarios, ciclos irregulares y exceso de andrógenos.' },
      { term: 'Climaterio / Menopausia', explanation: 'Etapa de cese de menstruación (~50 años). Se manejan síntomas con terapia hormonal o alternativas.' },
      { term: 'Infección vaginal', explanation: 'Puede ser bacteriana, fúngica (candidiasis) o por ITS. Requiere cultivo y tratamiento específico.' },
    ],
    commonQuestions: [
      '¿Cada cuánto debo hacerme el Pap?',
      '¿Qué anticonceptivo me recomiendas?',
      '¿Atiendes embarazos de alto riesgo?',
      '¿La colposcopia duele?',
      '¿Puedo ir durante mi período?',
    ],
  },

  /* ── OFTALMOLOGÍA ── */
  {
    slug: 'oftalmologia',
    label: 'Oftalmología',
    emoji: '👁️',
    aiGreeting: '¡Excelente! Ya cargué los conocimientos de Oftalmología en mi sistema. Manejo cirugía LASIK, cataratas, glaucoma, retinopatía y más. Solo confírmame tus horarios.',
    aiGreetingEn: 'Excellent! I\'ve loaded Ophthalmology knowledge. I handle LASIK, cataracts, glaucoma, retinopathy and more. Just confirm your hours.',
    terms: [
      { term: 'LASIK', explanation: 'Cirugía con láser para corregir miopía, hipermetropía y astigmatismo. Elimina o reduce la necesidad de lentes. Recuperación 1-2 días.' },
      { term: 'Cataratas', explanation: 'Opacidad del cristalino que reduce la visión. Se trata con cirugía ambulatoria (facoemulsificación) que dura ~20 min.' },
      { term: 'Glaucoma', explanation: 'Daño al nervio óptico por presión intraocular elevada. Tratamiento con gotas, láser o cirugía. Requiere monitoreo de por vida.' },
      { term: 'Retinopatía diabética', explanation: 'Daño en vasos de la retina por diabetes. Se monitorea con fondo de ojo y se trata con láser o inyecciones.' },
      { term: 'Degeneración macular', explanation: 'Deterioro de la mácula (visión central). Hay tipo seca (lenta) y húmeda (más agresiva, tratable con inyecciones).' },
      { term: 'Pterigión', explanation: 'Tejido que crece sobre la córnea. Si cubre el eje visual, se extirpa quirúrgicamente.' },
      { term: 'Ojo seco', explanation: 'Insuficiente producción de lágrima. Se trata con lágrimas artificiales, tapones lagrimales o calor.' },
      { term: 'Estrabismo', explanation: 'Desalineación ocular. Puede tratarse con prismas, parche, cirugía o terapia visual.' },
      { term: 'Examen de agudeza visual', explanation: 'Prueba para determinar la prescripción óptica (miopia, astigmatismo). Base de toda consulta oftalmológica.' },
      { term: 'Fondo de ojo', explanation: 'Examen que evalúa retina, nervio óptico y vasos sanguíneos. Requiere dilatación pupilar.' },
    ],
    commonQuestions: [
      '¿Soy candidato para LASIK?',
      '¿Las cataratas se pueden operar con seguro?',
      '¿Cada cuánto debo hacerme un examen de vista?',
      '¿Qué tan rápido recupero la visión post-operación?',
      '¿Atienden urgencias oculares?',
    ],
  },

  /* ── MEDICINA GENERAL ── */
  {
    slug: 'medica',
    label: 'Medicina General',
    emoji: '🩺',
    aiGreeting: '¡Excelente! Ya cargué los conocimientos de Medicina General en mi sistema. Manejo triage inicial, urgencias, enfermedades crónicas y más. Solo confírmame tus horarios.',
    aiGreetingEn: 'Excellent! I\'ve loaded General Medicine knowledge. I handle triage, emergencies, chronic conditions and more. Just confirm your hours.',
    terms: [
      { term: 'Consulta general', explanation: 'Evaluación integral del paciente para diagnóstico, tratamiento o seguimiento. Dura ~20-30 min.' },
      { term: 'Triage', explanation: 'Clasificación de urgencia del paciente: no urgente, urgente o emergencia. Determina el orden de atención.' },
      { term: 'Hipertensión arterial', explanation: 'Presión sanguínea elevada crónica. Tratamiento farmacológico + dieta + ejercicio. Seguimiento mensual.' },
      { term: 'Diabetes mellitus', explanation: 'Alteración del metabolismo de la glucosa. Tipo 1 (insulinodependiente) y Tipo 2 (estilo de vida + medicamentos).' },
      { term: 'Infección respiratoria', explanation: 'Catarro, gripe, bronquitis o neumonía. La mayoría viral, no requiere antibióticos.' },
      { term: 'Certificado médico', explanation: 'Documento oficial emitido por el médico para trabajo, escuela o deporte. Requiere evaluación presencial.' },
      { term: 'Receta médica', explanation: 'Prescripción de medicamentos o estudios. En México requiere cédula profesional válida.' },
      { term: 'Electrocardiograma (ECG)', explanation: 'Registro eléctrico del corazón. Evalúa ritmo cardíaco y detecta alteraciones. Dura ~5 minutos.' },
      { term: 'Medicina preventiva', explanation: 'Chequeos periódicos para detectar enfermedades antes de que den síntomas. Base de la salud a largo plazo.' },
      { term: 'Urgencia vs emergencia', explanation: 'Urgencia: requiere atención pronto pero no inmediata. Emergencia: riesgo de vida, atención inmediata.' },
    ],
    commonQuestions: [
      '¿Atienden urgencias sin cita?',
      '¿Dan certificados médicos?',
      '¿Cuánto cuesta una consulta?',
      '¿Hacen análisis de laboratorio?',
      '¿Atienden a domicilio?',
    ],
  },

  /* ── FISIOTERAPIA ── */
  {
    slug: 'fisioterapia',
    label: 'Fisioterapia',
    emoji: '💪',
    aiGreeting: '¡Excelente! Ya cargué los conocimientos de Fisioterapia en mi sistema. Manejo rehabilitación, lesiones deportivas, electroterapia y más. Solo confírmame tus horarios.',
    aiGreetingEn: 'Excellent! I\'ve loaded Physiotherapy knowledge. I handle rehabilitation, sports injuries, electrotherapy and more. Just confirm your hours.',
    terms: [
      { term: 'Evaluación fisioterapéutica', explanation: 'Primera cita para diagnosticar la condición musculoesquelética y diseñar el plan de rehabilitación.' },
      { term: 'Rehabilitación', explanation: 'Proceso de recuperación funcional después de lesión, cirugía o evento neurológico. Número de sesiones variable.' },
      { term: 'Electroterapia', explanation: 'Uso de corrientes eléctricas (TENS, ultrasonido, láser) para reducir dolor e inflamación.' },
      { term: 'Lesión de ligamento', explanation: 'Esguince o ruptura de tejido conectivo articular. Tratamiento con inmovilización, hielo y fisioterapia.' },
      { term: 'Hernia de disco', explanation: 'Desplazamiento del núcleo del disco intervertebral que comprime nervios. Fisioterapia como primer tratamiento.' },
      { term: 'Fisioterapia deportiva', explanation: 'Especialidad que trata y previene lesiones en deportistas. Incluye kinesiotaping y ejercicio terapéutico.' },
      { term: 'Dolor lumbar', explanation: 'Uno de los motivos de consulta más frecuentes. En el 90% de casos se resuelve con fisioterapia.' },
      { term: 'Kinesiotaping', explanation: 'Aplicación de vendaje elástico para soporte muscular y articular sin limitar el movimiento.' },
      { term: 'Movilización articular', explanation: 'Técnica manual para restaurar el rango de movimiento de una articulación.' },
      { term: 'Alta fisioterapéutica', explanation: 'Cuando el paciente recuperó la función deseada. Se dan ejercicios de mantenimiento en casa.' },
    ],
    commonQuestions: [
      '¿Cuántas sesiones necesito?',
      '¿Trabajas con seguros médicos?',
      '¿Tratas hernias de disco?',
      '¿Haces domicilios?',
      '¿Atienden lesiones deportivas?',
    ],
  },

  /* ── SPA & BIENESTAR ── */
  {
    slug: 'spa',
    label: 'Spa & Bienestar',
    emoji: '💆',
    aiGreeting: '¡Excelente! Ya cargué los conocimientos de Spa y Bienestar en mi sistema. Manejo masajes terapéuticos, tratamientos corporales, aromaterapia y más. Solo confírmame tus horarios.',
    aiGreetingEn: 'Excellent! I\'ve loaded Spa & Wellness knowledge. I handle therapeutic massage, body treatments, aromatherapy and more. Just confirm your hours.',
    terms: [
      { term: 'Masaje relajante', explanation: 'Técnica de effleurage y amasamiento para reducir tensión muscular y estrés. Duración 60-90 min.' },
      { term: 'Masaje terapéutico', explanation: 'Trabajo profundo sobre músculos y tejido conectivo para aliviar dolor crónico o lesiones.' },
      { term: 'Aromaterapia', explanation: 'Uso de aceites esenciales en masajes o difusores para mejorar estado emocional y físico.' },
      { term: 'Tratamiento facial', explanation: 'Limpieza profunda + hidratación + tratamientos específicos (manchas, acné, anti-edad). ~60 min.' },
      { term: 'Envolturas corporales', explanation: 'Aplicación de algas, arcillas o cremas con vendas para desintoxicar y modelar el cuerpo.' },
      { term: 'Hidroterapia', explanation: 'Uso terapéutico del agua (jacuzzi, vapor, duchas alternas) para mejorar circulación y relajación.' },
      { term: 'Reflexología', explanation: 'Técnica de presión en puntos del pie que corresponden a órganos y sistemas del cuerpo.' },
      { term: 'Circuito de spa', explanation: 'Recorrido por instalaciones (sauna, vapor, hidromasaje, descanso) con o sin tratamientos.' },
      { term: 'Masaje de piedras calientes', explanation: 'Uso de piedras volcánicas a 50-55°C sobre el cuerpo para relajar músculos en profundidad.' },
      { term: 'Reiki', explanation: 'Técnica de canalización de energía universal para equilibrar el campo energético del cuerpo.' },
    ],
    commonQuestions: [
      '¿Cuánto dura una sesión de masaje?',
      '¿Tienen paquetes o combos?',
      '¿Puedo ir embarazada?',
      '¿Hay estacionamiento?',
      '¿Hacen masajes a domicilio?',
    ],
  },

  /* ── VETERINARIA ── */
  {
    slug: 'veterinaria',
    label: 'Veterinaria',
    emoji: '🐾',
    aiGreeting: '¡Excelente! Ya cargué los conocimientos de Medicina Veterinaria en mi sistema. Manejo protocolos de vacunación, desparasitación, urgencias y más. Solo confírmame tus horarios.',
    aiGreetingEn: 'Excellent! I\'ve loaded Veterinary knowledge. I handle vaccination protocols, deworming, emergencies and more. Just confirm your hours.',
    terms: [
      { term: 'Consulta veterinaria', explanation: 'Evaluación general del estado de salud de la mascota. Incluye peso, temperatura y auscultación.' },
      { term: 'Vacuna Triple (perros)', explanation: 'Protege contra Distemper, Hepatitis infecciosa y Parvovirus. Cachorro: 3 dosis + refuerzo anual.' },
      { term: 'Vacuna antirrábica', explanation: 'Obligatoria por ley en México para perros y gatos. Se aplica anualmente a partir de los 3 meses de edad.' },
      { term: 'Desparasitación', explanation: 'Interna (áscaris, tenias) y externa (pulgas, garrapatas). Frecuencia: cada 3 meses en adultos.' },
      { term: 'Esterilización (castración)', explanation: 'Procedimiento quirúrgico para eliminar capacidad reproductiva. Reduce riesgo de cánceres hormonales.' },
      { term: 'Urgencia veterinaria', explanation: 'Signos de emergencia: vómito/diarrea con sangre, dificultad respiratoria, convulsiones, trauma.' },
      { term: 'Microchip', explanation: 'Identificación permanente subcutánea reglamentaria. Registrado en base de datos nacional.' },
      { term: 'Grooming', explanation: 'Baño, corte, secado y limpieza de oídos y uñas. Frecuencia según raza: cada 4-8 semanas.' },
      { term: 'Parvovirus', explanation: 'Enfermedad viral grave en cachorros sin vacunar. Causa vómito, diarrea con sangre y puede ser fatal.' },
      { term: 'Garrapata', explanation: 'Parásito externo que puede transmitir Ehrlichia y Babesia. Control con pipetas, collares o tabletas mensuales.' },
    ],
    commonQuestions: [
      '¿Cuándo vacuno a mi cachorro?',
      '¿Cada cuánto desparasito a mi mascota?',
      '¿Atienden urgencias de noche?',
      '¿Cuánto cuesta la esterilización?',
      '¿Hacen visitas a domicilio?',
    ],
  },

  /* ── QUIROPRÁCTICA (maps to onboarding slug) ── */
  {
    slug: 'quiropractica',
    label: 'Quiropráctica',
    emoji: '🔧',
    aiGreeting: '¡Excelente! Ya cargué los conocimientos de Quiropráctica en mi sistema. Manejo ajustes vertebrales, subluxaciones, dolor crónico y más. Solo confírmame tus horarios.',
    aiGreetingEn: 'Excellent! I\'ve loaded Chiropractic knowledge. I handle spinal adjustments, subluxations, chronic pain and more. Just confirm your hours.',
    terms: [
      { term: 'Ajuste quiropráctico', explanation: 'Manipulación controlada de las vértebras para restaurar la alineación y movilidad espinal.' },
      { term: 'Subluxación', explanation: 'Desalineación parcial de una vértebra que puede comprimir nervios y causar dolor o disfunción.' },
      { term: 'Evaluación postural', explanation: 'Análisis de la postura para identificar desequilibrios y diseñar el plan de tratamiento.' },
      { term: 'Cervicalgia', explanation: 'Dolor en el cuello. Causa frecuente: postura al usar dispositivos. Muy tratable con quiropráctica.' },
      { term: 'Escoliosis', explanation: 'Curvatura lateral anormal de la columna. Quiropráctica ayuda a manejar síntomas y mejorar postura.' },
      { term: 'Ciática', explanation: 'Dolor que irradia por el nervio ciático desde la espalda baja hasta la pierna. Responde bien a ajustes.' },
      { term: 'Técnica Gonstead', explanation: 'Método quiropráctico de alta precisión basado en análisis de rayos X y palpación segmentaria.' },
      { term: 'Decompresión espinal', explanation: 'Técnica de tracción para aliviar presión en discos y nervios. No quirúrgica.' },
      { term: 'Dolor lumbar crónico', explanation: 'Dolor en zona baja de la espalda de más de 3 meses. La quiropráctica es tratamiento de primera línea.' },
      { term: 'Plan de mantenimiento', explanation: 'Visitas periódicas (cada 2-4 semanas) para mantener la alineación y prevenir recaídas.' },
    ],
    commonQuestions: [
      '¿Cuántas sesiones necesito?',
      '¿Los ajustes duelen?',
      '¿Atienden a niños?',
      '¿Se puede ir durante el embarazo?',
      '¿Qué diferencia hay con un fisioterapeuta?',
    ],
  },
]

export function getKnowledge(slug: string): SpecialtyKnowledge | undefined {
  return KNOWLEDGE_BASE.find(k => k.slug === slug)
}
