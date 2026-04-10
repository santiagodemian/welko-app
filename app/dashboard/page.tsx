'use client'

import { useState, useEffect } from 'react'
import {
  MessageCircle, Calendar, TrendingUp, Zap, Sparkles,
  Brain, AlertTriangle, CheckCircle2, Clock, ToggleLeft, ToggleRight,
  ChevronRight, ArrowUpRight, ArrowRight,
} from 'lucide-react'
import Link from 'next/link'
import { CRMTour } from '@/components/ui/CRMTour'

const SURF  = 'var(--surface)'
const BORD  = 'var(--border)'
const TEXT  = 'var(--text-primary)'
const MUTED = 'var(--text-secondary)'
const NAVY  = '#13244A'

/* ── Industry presets for CRM preview ── */
const CRM_INDUSTRIES = [
  { slug: 'salud',       label: 'Salud',       color: '#3B82F6',
    client: 'paciente', event: 'cita', metric: 'No-shows evitados', metricVal: '18,400' },
  { slug: 'restaurante', label: 'Restaurante', color: '#F59E0B',
    client: 'comensal', event: 'reservación', metric: 'Reservaciones hoy', metricVal: '43' },
  { slug: 'barberia',    label: 'Barbería',    color: '#8B5CF6',
    client: 'cliente',  event: 'turno', metric: 'Turnos confirmados', metricVal: '28' },
  { slug: 'hotel',       label: 'Hotel',       color: '#0EA5E9',
    client: 'huésped',  event: 'reserva', metric: 'Ocupación hoy', metricVal: '87%' },
  { slug: 'fitness',     label: 'Fitness',     color: '#EF4444',
    client: 'miembro',  event: 'clase', metric: 'Inscripciones mes', metricVal: '31' },
  { slug: 'legal',       label: 'Legal',       color: '#6366F1',
    client: 'cliente',  event: 'consulta', metric: 'Consultas calificadas', metricVal: '12' },
  { slug: 'spa',         label: 'Spa',         color: '#EC4899',
    client: 'cliente',  event: 'sesión', metric: 'Sesiones del día', metricVal: '19' },
  { slug: 'retail',      label: 'Retail',      color: '#14B8A6',
    client: 'comprador', event: 'pedido', metric: 'Pedidos procesados', metricVal: '67' },
]

/* ── Cerebro IA feed — per industry ── */
type CerebroItem = { id: number; time: string; color: string; text: string }
const CEREBRO_BY_INDUSTRY: Record<string, CerebroItem[]> = {
  salud:       [
    { id:1, time:'hace 5 min',  color:'#34D399', text:'Desde que activaste recordatorios, los no-shows bajaron 18% — ahorro estimado $4,200 MXN este mes.' },
    { id:2, time:'hace 18 min', color:'#60A5FA', text:'Hoy 4 pacientes preguntaron por precio antes de agendar. Considera agregar tu tarifa al perfil.' },
    { id:3, time:'hace 1h',     color:'#A78BFA', text:'Los martes a las 10am tienen 40% más demanda — 3 pacientes en lista de espera.' },
    { id:4, time:'hace 2h',     color:'#F59E0B', text:'3 pacientes no respondieron el recordatorio de mañana. Welko enviará segundo aviso automáticamente.' },
    { id:5, time:'hace 3h',     color:'#60A5FA', text:'"¿Tienen estacionamiento?" fue la pregunta más frecuente de hoy (6 veces). Actualiza tu perfil.' },
  ],
  restaurante: [
    { id:1, time:'hace 3 min',  color:'#34D399', text:'Viernes y sábado concentran el 68% de tus reservaciones. Considera abrir turno de mediodía.' },
    { id:2, time:'hace 22 min', color:'#60A5FA', text:'0 reservas sin respuesta esta semana. Tiempo promedio de respuesta: 1.2 seg.' },
    { id:3, time:'hace 45 min', color:'#A78BFA', text:'"¿Tienen menú vegano?" fue preguntada 5 veces hoy. Agrégala a tu perfil de IA.' },
    { id:4, time:'hace 2h',     color:'#F59E0B', text:'Mesa de 8 personas el sábado sin confirmar — alto riesgo. Welko enviará recordatorio.' },
    { id:5, time:'hace 4h',     color:'#60A5FA', text:'Reservas de Instagram tienen 3× más cancelaciones. Activa recordatorio doble para ese canal.' },
  ],
  barberia:    [
    { id:1, time:'hace 8 min',  color:'#34D399', text:'Corte + barba es tu combo más pedido (43%). Agrégalo como paquete destacado.' },
    { id:2, time:'hace 30 min', color:'#60A5FA', text:'No-shows bajaron 38% con recordatorios. Ahorro estimado: $3,200 MXN este mes.' },
    { id:3, time:'hace 1h',     color:'#A78BFA', text:'Los sábados AM son tu hora pico. Considera añadir un barbero extra de 9–12am.' },
    { id:4, time:'hace 3h',     color:'#F59E0B', text:'2 turnos de hoy sin confirmar — riesgo alto. Welko enviará recordatorio automáticamente.' },
    { id:5, time:'hace 5h',     color:'#60A5FA', text:'"¿Cuánto tardas?" fue la pregunta #1 esta semana. Agrega tiempos por servicio.' },
  ],
  hotel:       [
    { id:1, time:'hace 2 min',  color:'#34D399', text:'Reservas de fin de semana superan entre semana 3×. Considera tarifa dinámica para temporada alta.' },
    { id:2, time:'hace 15 min', color:'#60A5FA', text:'Tasa de conversión consulta → reserva: 28% (↑12% vs. mes anterior).' },
    { id:3, time:'hace 1h',     color:'#A78BFA', text:'WhatsApp tiene el mayor ticket promedio ($3,200 MXN). Prioriza para grupos y eventos.' },
    { id:4, time:'hace 2h',     color:'#F59E0B', text:'Check-in del viernes sin confirmar documentación. Welko enviará instrucciones automáticamente.' },
    { id:5, time:'hace 4h',     color:'#60A5FA', text:'"¿Incluye desayuno?" fue la pregunta más frecuente (8 veces). Responde automáticamente.' },
  ],
  fitness:     [
    { id:1, time:'hace 10 min', color:'#34D399', text:'30% de tus leads visitan el gym pero no convierten. Activa oferta de primer mes gratis.' },
    { id:2, time:'hace 25 min', color:'#60A5FA', text:'Retención mejoró 18% con recordatorios de inactividad automáticos.' },
    { id:3, time:'hace 1h',     color:'#A78BFA', text:'Instagram atrae más leads. WhatsApp cierra más membresías. Usa ambos canales.' },
    { id:4, time:'hace 3h',     color:'#F59E0B', text:'Clase de 7am tiene 40% menos asistencia los lunes. Considera ofrecer incentivo.' },
    { id:5, time:'hace 5h',     color:'#60A5FA', text:'"¿Tienen regaderas?" fue preguntada 7 veces. Agrégala a tu perfil.' },
  ],
  legal:       [
    { id:1, time:'hace 5 min',  color:'#34D399', text:'Derecho familiar y corporativo concentran el 62% de tus consultas esta semana.' },
    { id:2, time:'hace 20 min', color:'#60A5FA', text:'Tiempo de respuesta: 1.8 seg. 0 prospectos sin atender esta semana.' },
    { id:3, time:'hace 1h',     color:'#A78BFA', text:'Consultas con respuesta en < 5 min tienen 4× más probabilidad de cerrar el caso.' },
    { id:4, time:'hace 2h',     color:'#F59E0B', text:'Cliente de mañana no confirmó documentos. Welko enviará lista de requisitos.' },
    { id:5, time:'hace 4h',     color:'#60A5FA', text:'"¿Tienen pago en mensualidades?" fue preguntada 4 veces. Agrega opciones de pago.' },
  ],
  spa:         [
    { id:1, time:'hace 4 min',  color:'#34D399', text:'Paquete de novias es el servicio con mayor ticket ($3,200 MXN). Promociónalo en Instagram.' },
    { id:2, time:'hace 18 min', color:'#60A5FA', text:'No-shows bajaron 35% desde que activaste recordatorios. Ahorro estimado: $5,100 MXN.' },
    { id:3, time:'hace 1h',     color:'#A78BFA', text:'Viernes y sábados tienen 70% más demanda. Considera abrir más turnos de 4–8pm.' },
    { id:4, time:'hace 3h',     color:'#F59E0B', text:'2 sesiones de mañana sin confirmar. Welko enviará recordatorio automáticamente.' },
    { id:5, time:'hace 5h',     color:'#60A5FA', text:'"¿Incluye productos premium?" fue preguntada 6 veces. Especifica materiales en tu perfil.' },
  ],
  retail:      [
    { id:1, time:'hace 6 min',  color:'#34D399', text:'Pedidos por WhatsApp tienen ticket promedio 40% mayor que los de web.' },
    { id:2, time:'hace 20 min', color:'#60A5FA', text:'Tasa de conversión a precio esta semana: 32%. Tiempo de respuesta: 1.4 seg.' },
    { id:3, time:'hace 1h',     color:'#A78BFA', text:'"¿Hacen envíos?" fue la pregunta #1 (12 veces). Actualiza tu política de envíos.' },
    { id:4, time:'hace 2h',     color:'#F59E0B', text:'3 pedidos grandes sin pago confirmado. Welko enviará recordatorio automáticamente.' },
    { id:5, time:'hace 4h',     color:'#60A5FA', text:'Lunes y martes son tus días de más pedidos. Asegúrate de tener inventario actualizado.' },
  ],
}

/* ── No-show predictor — per industry ── */
type UpcomingItem = { name: string; time: string; service: string; risk: string; channel: string; value: number }
const UPCOMING_BY_INDUSTRY: Record<string, UpcomingItem[]> = {
  salud:       [
    { name:'Miguel Sánchez',  time:'Mañana 10:00am', service:'Blanqueamiento',    risk:'ALTO',  channel:'WhatsApp',  value:1800 },
    { name:'Patricia Vega',   time:'Mañana 11:30am', service:'Consulta general',  risk:'MEDIO', channel:'Instagram', value:900  },
    { name:'Carlos Ruiz',     time:'Mañana 2:00pm',  service:'Ortodoncia',        risk:'BAJO',  channel:'Web',       value:3200 },
    { name:'Ana Martínez',    time:'Mañana 4:00pm',  service:'Limpieza dental',   risk:'ALTO',  channel:'WhatsApp',  value:850  },
    { name:'Diego Morales',   time:'Jue 9:00am',     service:'Cirugía menor',     risk:'BAJO',  channel:'Llamada',   value:6500 },
  ],
  restaurante: [
    { name:'Carlos Mendoza',  time:'Hoy 8:00pm',     service:'Mesa 4 personas',   risk:'ALTO',  channel:'WhatsApp',  value:800  },
    { name:'Ana López',       time:'Hoy 9:00pm',     service:'Mesa 2 personas',   risk:'BAJO',  channel:'Instagram', value:400  },
    { name:'Fam. Pérez',      time:'Sáb 9:30pm',     service:'Mesa 6 personas',   risk:'MEDIO', channel:'Web',       value:1200 },
    { name:'Roberto Silva',   time:'Sáb 8:00pm',     service:'Evento privado',    risk:'BAJO',  channel:'Llamada',   value:4500 },
    { name:'Daniela Torres',  time:'Dom 2:00pm',     service:'Mesa 3 personas',   risk:'ALTO',  channel:'WhatsApp',  value:600  },
  ],
  barberia:    [
    { name:'Luis García',     time:'Hoy 4:00pm',     service:'Corte + Barba',     risk:'ALTO',  channel:'WhatsApp',  value:280  },
    { name:'Rodrigo Mora',    time:'Hoy 5:30pm',     service:'Corte',             risk:'MEDIO', channel:'Instagram', value:180  },
    { name:'Andrés Torres',   time:'Hoy 6:00pm',     service:'Afeitado clásico',  risk:'BAJO',  channel:'WhatsApp',  value:120  },
    { name:'Juan Pérez',      time:'Mañana 10:00am', service:'Corte + Barba',     risk:'ALTO',  channel:'Llamada',   value:280  },
    { name:'Marco López',     time:'Mañana 11:00am', service:'Corte infantil',    risk:'BAJO',  channel:'WhatsApp',  value:150  },
  ],
  hotel:       [
    { name:'Sofía Ramírez',   time:'Vie check-in',   service:'Suite júnior',      risk:'BAJO',  channel:'WhatsApp',  value:3600 },
    { name:'Fam. López',      time:'Vie check-in',   service:'Habitación doble',  risk:'ALTO',  channel:'Web',       value:2800 },
    { name:'Juan Mora',       time:'Sáb check-in',   service:'Hab. sencilla',     risk:'MEDIO', channel:'Instagram', value:1800 },
    { name:'Ana Torres',      time:'Dom check-in',   service:'Suite deluxe',      risk:'BAJO',  channel:'WhatsApp',  value:5200 },
    { name:'Grupo Empresarial',time:'Lun check-in',  service:'5 habitaciones',    risk:'BAJO',  channel:'Llamada',   value:9000 },
  ],
  fitness:     [
    { name:'Carlos Vega',     time:'Hoy 9:00am',     service:'Visita + tour',     risk:'BAJO',  channel:'Instagram', value:699  },
    { name:'Daniela Mora',    time:'Hoy 11:00am',    service:'Clase de yoga',     risk:'ALTO',  channel:'WhatsApp',  value:200  },
    { name:'Pedro López',     time:'Hoy 6:00pm',     service:'Entrenamiento PT',  risk:'MEDIO', channel:'Web',       value:300  },
    { name:'Ana Ruiz',        time:'Mañana 7:00am',  service:'Clase de spinning', risk:'BAJO',  channel:'WhatsApp',  value:200  },
    { name:'Roberto García',  time:'Mañana 8:00am',  service:'Alta membresía',    risk:'ALTO',  channel:'Llamada',   value:699  },
  ],
  legal:       [
    { name:'Ricardo Montoya', time:'Mañana 10:00am', service:'Consulta familiar', risk:'BAJO',  channel:'WhatsApp',  value:1200 },
    { name:'Elena Vargas',    time:'Mañana 12:00pm', service:'Contrato laboral',  risk:'ALTO',  channel:'Instagram', value:3500 },
    { name:'Fam. Torres',     time:'Mañana 4:00pm',  service:'Derecho sucesorio', risk:'MEDIO', channel:'Web',       value:8000 },
    { name:'Marco Silva',     time:'Jue 9:00am',     service:'Consulta mercantil',risk:'BAJO',  channel:'Llamada',   value:2000 },
    { name:'Dra. López',      time:'Jue 11:00am',    service:'Constitución S.A.', risk:'BAJO',  channel:'WhatsApp',  value:5000 },
  ],
  spa:         [
    { name:'Valeria Torres',  time:'Hoy 10:00am',    service:'Masaje relajante',  risk:'BAJO',  channel:'WhatsApp',  value:850  },
    { name:'Mariana López',   time:'Hoy 12:00pm',    service:'Facial completo',   risk:'ALTO',  channel:'Instagram', value:1200 },
    { name:'Sara Ramírez',    time:'Mañana 11:00am', service:'Tratamiento facial',risk:'MEDIO', channel:'Web',       value:1500 },
    { name:'Camila Pérez',    time:'Mañana 3:00pm',  service:'Paquete novias',    risk:'BAJO',  channel:'WhatsApp',  value:3200 },
    { name:'Diana García',    time:'Sáb 2:00pm',     service:'Día de spa',        risk:'BAJO',  channel:'Llamada',   value:2400 },
  ],
  retail:      [
    { name:'Jorge Morales',   time:'Hoy 2:00pm',     service:'Pedido #1043',      risk:'BAJO',  channel:'WhatsApp',  value:1280 },
    { name:'Patricia Silva',  time:'Hoy 4:00pm',     service:'Pedido #1044',      risk:'MEDIO', channel:'Instagram', value:450  },
    { name:'Carlos López',    time:'Mañana',         service:'Pedido #1045',      risk:'ALTO',  channel:'Web',       value:2100 },
    { name:'Ana Martínez',    time:'Mañana',         service:'Pedido #1046',      risk:'BAJO',  channel:'WhatsApp',  value:680  },
    { name:'Roberto Torres',  time:'Jue',            service:'Pedido mayoreo',    risk:'BAJO',  channel:'Llamada',   value:5600 },
  ],
}

const RISK_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  ALTO:  { bg: '#FEF2F2', color: '#EF4444', label: 'Riesgo alto'  },
  MEDIO: { bg: '#FFFBEB', color: '#F59E0B', label: 'Riesgo medio' },
  BAJO:  { bg: '#F0FDF4', color: '#22C55E', label: 'Riesgo bajo'  },
}

const SPARK = [28, 42, 34, 58, 48, 72, 63, 78, 68, 88, 82, 100]

type StatsResponse = {
  pacientesInteresados: number
  pipelinePredictivo: number
  revenueAsegurado: number
  recentLeads: { id: string; patientName: string; channel: string; status: string; createdAt: string }[]
  pipelineByStage: Record<string, number>
}

/* ── Mock AI training score (would come from API in production) ── */
const AI_TRAINING_ITEMS = [
  { label: 'Nombre de la clínica',    done: true,  pts: 10 },
  { label: 'Teléfono de contacto',    done: true,  pts: 5  },
  { label: 'Dirección',               done: true,  pts: 5  },
  { label: 'Especialidades',          done: true,  pts: 10 },
  { label: 'Horarios configurados',   done: true,  pts: 10 },
  { label: 'Al menos 1 servicio',     done: true,  pts: 15 },
  { label: 'Precio en servicios',     done: true,  pts: 5  },
  { label: 'Métodos de pago',         done: true,  pts: 5  },
  { label: 'Política de cancelación', done: false, pts: 5  },
  { label: '3+ FAQs completas',       done: false, pts: 15 },
  { label: 'Nombre del agente IA',    done: true,  pts: 10 },
  { label: 'Tono configurado',        done: true,  pts: 5  },
]

function AITrainingScore() {
  const total   = AI_TRAINING_ITEMS.reduce((s, i) => s + i.pts, 0)
  const earned  = AI_TRAINING_ITEMS.filter(i => i.done).reduce((s, i) => s + i.pts, 0)
  const score   = Math.round((earned / total) * 100)
  const missing = AI_TRAINING_ITEMS.filter(i => !i.done)
  const color   = score >= 80 ? '#22C55E' : score >= 50 ? '#F59E0B' : '#60A5FA'

  return (
    <div data-tour="tour-score" style={{
      background: SURF, border: `1px solid ${BORD}`,
      borderRadius: 16, padding: '16px 20px',
      display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap',
    }}>
      {/* Score number */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <div style={{ position: 'relative', width: 52, height: 52, flexShrink: 0 }}>
          <svg width="52" height="52" viewBox="0 0 52 52">
            <circle cx="26" cy="26" r="22" fill="none" stroke="var(--border)" strokeWidth="5" />
            <circle cx="26" cy="26" r="22" fill="none" stroke={color} strokeWidth="5"
              strokeDasharray={`${(score / 100) * 138.2} 138.2`}
              strokeLinecap="round"
              transform="rotate(-90 26 26)"
              style={{ transition: 'stroke-dasharray 0.8s ease' }}
            />
          </svg>
          <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color }}>{score}</span>
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: TEXT, margin: 0 }}>
            Tu IA está al <span style={{ color }}>{score}%</span> de su potencial
          </p>
          <p style={{ fontSize: 11, color: MUTED, margin: '2px 0 0' }}>
            {missing.length === 0 ? '¡Configuración completa! Tu IA está al máximo.' : `${missing.length} acción${missing.length > 1 ? 'es' : ''} para mejorar las respuestas`}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ flex: 1, minWidth: 160 }}>
        <div style={{ height: 6, borderRadius: 99, background: 'var(--border)', overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: 99, width: `${score}%`, background: color, transition: 'width 0.8s ease' }} />
        </div>
      </div>

      {/* Next actions */}
      <div style={{ display: 'flex', gap: 8, flexShrink: 0, flexWrap: 'wrap' }}>
        {missing.slice(0, 2).map((item) => (
          <Link key={item.label} href="/onboarding"
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '5px 12px', borderRadius: 99,
              background: `${color}12`, border: `1px solid ${color}30`,
              fontSize: 11, fontWeight: 600, color: '#13244A', textDecoration: 'none',
            }}>
            <Sparkles size={10} color={color} />
            +{item.pts}pts: {item.label}
          </Link>
        ))}
        {missing.length > 2 && (
          <Link href="/onboarding"
            style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 12px', borderRadius: 99, background: 'var(--bg)', border: `1px solid ${BORD}`, fontSize: 11, color: MUTED, textDecoration: 'none' }}>
            +{missing.length - 2} más <ArrowRight size={10} />
          </Link>
        )}
      </div>
    </div>
  )
}

function HealthGauge({ score }: { score: number }) {
  const color = score >= 75 ? '#22C55E' : score >= 50 ? '#F59E0B' : '#EF4444'
  const label = score >= 75 ? 'Excelente' : score >= 50 ? 'En crecimiento' : 'Necesita atención'
  // SVG arc from 180deg to 0deg, radius 36
  const r = 36
  const circ = Math.PI * r  // half circle
  const fill = (score / 100) * circ

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div style={{ position: 'relative', width: 96, height: 52 }}>
        <svg width="96" height="52" viewBox="0 0 96 52" style={{ overflow: 'visible' }}>
          {/* Track */}
          <path d="M 8 48 A 40 40 0 0 1 88 48" fill="none" stroke="var(--border)" strokeWidth="8" strokeLinecap="round" />
          {/* Fill */}
          <path
            d="M 8 48 A 40 40 0 0 1 88 48"
            fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={`${(score / 100) * 125.66} 125.66`}
            style={{ transition: 'stroke-dasharray 1s ease' }}
          />
        </svg>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, textAlign: 'center' }}>
          <span style={{ fontSize: 24, fontWeight: 800, color, lineHeight: 1 }}>{score}</span>
        </div>
      </div>
      <span style={{ fontSize: 11, fontWeight: 600, color, letterSpacing: '0.02em' }}>{label}</span>
    </div>
  )
}

export default function DashboardPage() {
  const [stats, setStats]         = useState<StatsResponse | null>(null)
  const [modoOcupado, setModo]    = useState(false)
  const [savedModo, setSavedModo] = useState(false)
  const [industrySlug, setIndustrySlug] = useState('salud')

  const industry = CRM_INDUSTRIES.find(i => i.slug === industrySlug) ?? CRM_INDUSTRIES[0]

  useEffect(() => {
    const stored = localStorage.getItem('welko_modo_ocupado')
    if (stored === 'true') { setModo(true); setSavedModo(true) }
    const storedInd = localStorage.getItem('welko_preview_industry')
    if (storedInd) setIndustrySlug(storedInd)
  }, [])

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then(r => r.json())
      .then(setStats)
      .catch(() => null)
  }, [])

  function toggleModo() {
    const next = !modoOcupado
    setModo(next)
    setSavedModo(next)
    localStorage.setItem('welko_modo_ocupado', String(next))
  }

  const today = new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })

  const kpis = [
    {
      Icon: MessageCircle, color: '#60A5FA',
      label: 'Mensajes respondidos hoy',
      value: stats ? String(stats.pacientesInteresados) : '143',
      sub: '100% tasa de respuesta · < 2 seg',
    },
    {
      Icon: Calendar, color: '#A78BFA',
      label: `${industry.event.charAt(0).toUpperCase() + industry.event.slice(1)}s agendadas`,
      value: String((stats?.pipelineByStage?.AGENDADO ?? 0) + (stats?.pipelineByStage?.CONFIRMADO ?? 0) || '18'),
      sub: '+3 vs ayer',
    },
    {
      Icon: TrendingUp, color: '#34D399',
      label: industry.metric,
      value: industry.metricVal,
      sub: 'Este mes',
    },
    {
      Icon: Zap, color: '#F59E0B',
      label: 'Tiempo de respuesta',
      value: '1.8s',
      sub: 'Promedio del día · Meta: < 2s ✓',
    },
  ]

  const healthScore = 81

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100%', padding: 'clamp(12px, 3vw, 24px) clamp(12px, 3vw, 28px)', display: 'flex', flexDirection: 'column', gap: 16 }}>

      <CRMTour />

      {/* ── Industry selector ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
        padding: '10px 14px', borderRadius: 14,
        background: SURF, border: `1px solid ${BORD}`,
      }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: MUTED, marginRight: 4, whiteSpace: 'nowrap' }}>
          Vista de industria:
        </span>
        {CRM_INDUSTRIES.map(ind => (
          <button
            key={ind.slug}
            onClick={() => { setIndustrySlug(ind.slug); localStorage.setItem('welko_preview_industry', ind.slug) }}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '5px 12px', borderRadius: 99,
              background: industrySlug === ind.slug ? ind.color : ind.color + '12',
              border: `1px solid ${industrySlug === ind.slug ? ind.color : ind.color + '30'}`,
              color: industrySlug === ind.slug ? '#fff' : ind.color,
              fontSize: 11, fontWeight: 600, cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {ind.label}
          </button>
        ))}
      </div>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ color: TEXT, fontSize: 18, fontWeight: 700, margin: 0 }}>Inicio</h1>
          <p style={{ color: MUTED, fontSize: 12, margin: '3px 0 0', textTransform: 'capitalize' }}>{today}</p>
        </div>
        {/* Modo Ocupado */}
        <button
          onClick={toggleModo}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 16px', borderRadius: 12,
            background: modoOcupado ? '#FEF2F2' : SURF,
            border: `1px solid ${modoOcupado ? '#FECACA' : BORD}`,
            cursor: 'pointer', transition: 'all 0.2s',
          }}
        >
          {modoOcupado
            ? <ToggleRight size={18} color="#EF4444" />
            : <ToggleLeft size={18} color={MUTED} />}
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontSize: 12, fontWeight: 600, margin: 0, color: modoOcupado ? '#EF4444' : TEXT }}>
              {modoOcupado ? 'Modo Ocupado activo' : 'Modo Ocupado'}
            </p>
            <p style={{ fontSize: 10, margin: 0, color: MUTED }}>
              {modoOcupado ? 'IA solo toma datos · responde en 2h' : 'IA responde todo 24/7'}
            </p>
          </div>
        </button>
      </div>

      {/* ── Health Score + KPIs ── */}
      <div data-tour="tour-kpis" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, alignItems: 'stretch' }}>
        {/* Health Score */}
        <div style={{
          background: SURF, border: `1px solid ${BORD}`, borderRadius: 16,
          padding: '18px 22px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, justifyContent: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Brain size={13} color={MUTED} />
            <span style={{ fontSize: 11, fontWeight: 600, color: MUTED }}>Health Score</span>
          </div>
          <HealthGauge score={healthScore} />
          <p style={{ fontSize: 10, color: MUTED, margin: 0, textAlign: 'center', maxWidth: 90, lineHeight: 1.4 }}>
            Basado en respuesta, citas y canales activos
          </p>
        </div>

        {/* KPI cards */}
        {kpis.map((k) => (
          <div
            key={k.label}
            style={{ background: SURF, border: `1px solid ${BORD}`, borderRadius: 16, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: 11, color: MUTED, fontWeight: 500 }}>{k.label}</span>
              <div style={{ width: 30, height: 30, borderRadius: 9, background: `${k.color}1A`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <k.Icon size={14} color={k.color} strokeWidth={2} />
              </div>
            </div>
            <div>
              <span style={{ fontSize: 28, fontWeight: 800, color: k.color, lineHeight: 1 }}>{k.value}</span>
              <span style={{ fontSize: 10, color: MUTED, display: 'block', marginTop: 4 }}>{k.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── AI Training Score ── */}
      <AITrainingScore />

      {/* ── Main 2-col ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 12 }} className="lg:grid-cols-[1fr_340px]">

        {/* Cerebro IA feed */}
        <div data-tour="tour-cerebro" style={{ background: SURF, border: `1px solid ${BORD}`, borderRadius: 16, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '14px 20px', borderBottom: `1px solid ${BORD}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sparkles size={15} color="#A78BFA" />
              <div>
                <p style={{ color: TEXT, fontSize: 13, fontWeight: 600, margin: 0 }}>Cerebro IA</p>
                <p style={{ color: MUTED, fontSize: 11, margin: '1px 0 0' }}>Lo que tu IA está aprendiendo de tu negocio</p>
              </div>
            </div>
            <span style={{
              display: 'flex', alignItems: 'center', gap: 5,
              fontSize: 10, color: '#22C55E', fontWeight: 600,
              background: '#F0FDF4', padding: '3px 9px', borderRadius: 99,
            }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22C55E', animation: 'pulse 2s infinite' }} />
              En vivo
            </span>
          </div>
          {(() => {
            const cerebroFeed = CEREBRO_BY_INDUSTRY[industrySlug] ?? CEREBRO_BY_INDUSTRY.salud
            return (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {cerebroFeed.map((obs, i) => (
              <div
                key={obs.id}
                style={{
                  display: 'flex', gap: 14, padding: '14px 20px',
                  borderBottom: i < cerebroFeed.length - 1 ? `1px solid ${BORD}` : 'none',
                  alignItems: 'flex-start',
                }}
              >
                <div style={{
                  width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                  background: `${obs.color}15`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Brain size={15} color={obs.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 12.5, color: TEXT, margin: 0, lineHeight: 1.55 }}>{obs.text}</p>
                  <span style={{ fontSize: 10, color: MUTED, marginTop: 4, display: 'block' }}>{obs.time}</span>
                </div>
              </div>
            ))}
          </div>
          )})()}
        </div>

        {/* Right col */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* No-show predictor */}
          <div data-tour="tour-noshow" style={{ background: SURF, border: `1px solid ${BORD}`, borderRadius: 16, flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '14px 18px', borderBottom: `1px solid ${BORD}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <AlertTriangle size={14} color="#F59E0B" />
                <p style={{ color: TEXT, fontSize: 13, fontWeight: 600, margin: 0 }}>Predictor de No-shows</p>
              </div>
              <p style={{ fontSize: 11, color: MUTED, margin: '3px 0 0' }}>
                {`Próximos ${industry.event}s con análisis de riesgo IA`}
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', padding: '8px 0' }}>
              {(UPCOMING_BY_INDUSTRY[industrySlug] ?? UPCOMING_BY_INDUSTRY.salud).map((apt, i) => {
                const risk = RISK_STYLE[apt.risk]
                return (
                  <div
                    key={i}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 18px', cursor: 'default' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--accent-ghost)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                  >
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)' }}>{apt.name.charAt(0)}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 12, fontWeight: 600, color: TEXT, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{apt.name}</p>
                      <p style={{ fontSize: 10, color: MUTED, margin: 0 }}>{apt.time} · {apt.service}</p>
                    </div>
                    <span style={{
                      fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 99,
                      background: risk.bg, color: risk.color, flexShrink: 0,
                    }}>
                      {apt.risk}
                    </span>
                  </div>
                )
              })}
            </div>
            <div style={{ padding: '10px 18px', borderTop: `1px solid ${BORD}` }}>
              <Link href="/dashboard/citas" style={{ fontSize: 11, color: '#60A5FA', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none', fontWeight: 600 }}>
                {`Ver todos los ${industry.event}s`} <ChevronRight size={12} />
              </Link>
            </div>
          </div>

          {/* Sparkline ingreso */}
          <div style={{ background: SURF, border: `1px solid ${BORD}`, borderRadius: 16, padding: '16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
              <TrendingUp size={13} color="#34D399" />
              <div>
                <p style={{ color: TEXT, fontSize: 12, fontWeight: 600, margin: 0 }}>Ingresos del mes</p>
                <p style={{ color: '#34D399', fontSize: 11, fontWeight: 700, margin: '1px 0 0' }}>Tendencia +22%</p>
              </div>
            </div>
            <div style={{ height: 40, display: 'flex', alignItems: 'flex-end', gap: 3 }}>
              {SPARK.map((h, i) => (
                <div key={i} style={{
                  flex: 1, borderRadius: 3,
                  background: i === SPARK.length - 1 ? '#34D399' : `rgba(52,211,153,${0.15 + (i / SPARK.length) * 0.5})`,
                  height: `${h}%`,
                }} />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              <span style={{ fontSize: 10, color: MUTED }}>Inicio del mes</span>
              <span style={{ fontSize: 10, color: '#34D399', fontWeight: 600 }}>Hoy</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
    </div>
  )
}
