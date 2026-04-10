'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react'
import { useLang } from '@/contexts/LangContext'

const NAVY = '#13244A'
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]
const AUTO_ADVANCE_MS = 4800

const IND_TABS = [
  { slug: 'dental',      es: 'Salud',       en: 'Health',      color: '#3B82F6' },
  { slug: 'restaurante', es: 'Restaurante', en: 'Restaurant',  color: '#F59E0B' },
  { slug: 'barberia',    es: 'Barbería',    en: 'Barbershop',  color: '#8B5CF6' },
  { slug: 'hotel',       es: 'Hotel',       en: 'Hotel',       color: '#0EA5E9' },
  { slug: 'fitness',     es: 'Fitness',     en: 'Fitness',     color: '#EF4444' },
  { slug: 'legal',       es: 'Legal',       en: 'Legal',       color: '#374151' },
]

interface CRMData {
  clientLabel: string
  eventLabel: string
  kanbanCols: string[]
  kanbanCards: string[][]
  citas: {
    title: string
    items: { name: string; time: string; risk: string; riskColor: string; riskBg: string }[]
    autoMsg: string
  }
  cerebro: { text: string; color: string }[]
}

const CRM: Record<string, CRMData> = {
  dental: {
    clientLabel: 'pacientes', eventLabel: 'citas',
    kanbanCols:  ['NUEVO', 'AGENDADO', 'CONFIRMADO', 'ATENDIDO'],
    kanbanCards: [['Isabel T. · WhatsApp · ahora'], ['Miguel S. · ayer'], ['Patricia V. · lun'], ['Carlos R. · vie']],
    citas: {
      title: '3 citas',
      items: [
        { name: 'Isabel Torres',  time: '10:00 AM', risk: 'BAJO',  riskColor: '#22C55E', riskBg: 'rgba(34,197,94,0.12)'  },
        { name: 'Miguel Sánchez', time: '11:30 AM', risk: 'ALTO',  riskColor: '#EF4444', riskBg: 'rgba(239,68,68,0.12)'  },
        { name: 'Patricia Vega',  time: '3:00 PM',  risk: 'MEDIO', riskColor: '#F59E0B', riskBg: 'rgba(245,158,11,0.12)' },
      ],
      autoMsg: 'Recordatorio extra enviado a Miguel automáticamente',
    },
    cerebro: [
      { text: 'Limpieza dental es tu servicio más pedido esta semana (8 consultas). Considera abrir más horarios AM.', color: '#34D399' },
      { text: 'No-shows bajaron 23% vs. el mes pasado. Ahorro estimado: $5,100 MXN.',                                  color: '#60A5FA' },
      { text: 'WhatsApp convierte 3× mejor que Instagram para citas. Prioriza ese canal.',                             color: '#A78BFA' },
    ],
  },
  restaurante: {
    clientLabel: 'comensales', eventLabel: 'reservaciones',
    kanbanCols:  ['NUEVO', 'RESERVADO', 'CONFIRMADO', 'ATENDIDO'],
    kanbanCards: [['Ricardo M. · mesa 4 · ahora'], ['Ana L. · sáb 8pm'], ['Fam. Pérez · sáb 9pm'], ['Mesa 2 · vie']],
    citas: {
      title: '3 reservaciones',
      items: [
        { name: 'Ricardo M. · Mesa 4', time: '8:00 PM',  risk: 'BAJO',  riskColor: '#22C55E', riskBg: 'rgba(34,197,94,0.12)'  },
        { name: 'Ana López · Mesa 2',  time: '9:00 PM',  risk: 'ALTO',  riskColor: '#EF4444', riskBg: 'rgba(239,68,68,0.12)'  },
        { name: 'Fam. Pérez · Mesa 6', time: '9:30 PM',  risk: 'MEDIO', riskColor: '#F59E0B', riskBg: 'rgba(245,158,11,0.12)' },
      ],
      autoMsg: 'Recordatorio de reservación enviado a Ana automáticamente',
    },
    cerebro: [
      { text: 'Viernes y sábado concentran el 68% de tus reservaciones. Considera abrir turno de mediodía.', color: '#34D399' },
      { text: '0 reservas sin respuesta esta semana. Tiempo promedio de respuesta: 1.2 seg.',                   color: '#60A5FA' },
      { text: 'Instagram convierte mejor para eventos especiales (cumpleaños, aniversarios).',                  color: '#A78BFA' },
    ],
  },
  barberia: {
    clientLabel: 'clientes', eventLabel: 'turnos',
    kanbanCols:  ['NUEVO', 'AGENDADO', 'CONFIRMADO', 'ATENDIDO'],
    kanbanCards: [['Luis G. · WhatsApp · ahora'], ['Rodrigo M. · hoy 5:30pm'], ['Andrés T. · hoy 6pm'], ['Juan P. · ayer']],
    citas: {
      title: '3 turnos',
      items: [
        { name: 'Luis García',    time: '4:00 PM', risk: 'BAJO',  riskColor: '#22C55E', riskBg: 'rgba(34,197,94,0.12)'  },
        { name: 'Rodrigo Mora',   time: '5:30 PM', risk: 'ALTO',  riskColor: '#EF4444', riskBg: 'rgba(239,68,68,0.12)'  },
        { name: 'Andrés Torres',  time: '6:00 PM', risk: 'MEDIO', riskColor: '#F59E0B', riskBg: 'rgba(245,158,11,0.12)' },
      ],
      autoMsg: 'Recordatorio de turno enviado a Rodrigo automáticamente',
    },
    cerebro: [
      { text: 'Corte + barba es tu combo más pedido (43%). Agrégalo como paquete destacado.', color: '#34D399' },
      { text: 'No-shows bajaron 38% con recordatorios. Ahorro estimado: $3,200 MXN/mes.',     color: '#60A5FA' },
      { text: 'Los sábados AM son tu hora pico. Considera añadir un barbero extra.',           color: '#A78BFA' },
    ],
  },
  hotel: {
    clientLabel: 'huéspedes', eventLabel: 'reservaciones',
    kanbanCols:  ['CONSULTA', 'COTIZADO', 'RESERVADO', 'HOSPEDADO'],
    kanbanCards: [['Sofía R. · WhatsApp · ahora'], ['Fam. López · vie–dom'], ['Juan M. · confirmado'], ['Ana T. · check-in hoy']],
    citas: {
      title: '3 check-ins',
      items: [
        { name: 'Sofía Ramírez · Suite',  time: 'Check-in vie', risk: 'BAJO',  riskColor: '#22C55E', riskBg: 'rgba(34,197,94,0.12)'  },
        { name: 'Fam. López · Doble',     time: 'Check-in vie', risk: 'ALTO',  riskColor: '#EF4444', riskBg: 'rgba(239,68,68,0.12)'  },
        { name: 'Juan Mora · Sencilla',   time: 'Check-in sáb', risk: 'MEDIO', riskColor: '#F59E0B', riskBg: 'rgba(245,158,11,0.12)' },
      ],
      autoMsg: 'Instrucciones de check-in enviadas a Fam. López automáticamente',
    },
    cerebro: [
      { text: 'Reservas de fin de semana superan entre semana 3×. Aplica tarifa dinámica.', color: '#34D399' },
      { text: 'Tasa de conversión consulta → reserva: 28% (↑12% vs. mes anterior).',        color: '#60A5FA' },
      { text: 'WhatsApp tiene el mayor ticket promedio. Prioriza para grupos y eventos.',    color: '#A78BFA' },
    ],
  },
  fitness: {
    clientLabel: 'miembros', eventLabel: 'visitas',
    kanbanCols:  ['LEAD', 'VISITA', 'MIEMBRO', 'INACTIVO'],
    kanbanCards: [['Carlos V. · Instagram · ahora'], ['Daniela M. · visita hoy'], ['Pedro L. · activo'], ['Ana R. · 30d sin ir']],
    citas: {
      title: '3 visitas',
      items: [
        { name: 'Carlos Vega · lead', time: '9:00 AM',  risk: 'BAJO',  riskColor: '#22C55E', riskBg: 'rgba(34,197,94,0.12)'  },
        { name: 'Daniela Mora',       time: '11:00 AM', risk: 'ALTO',  riskColor: '#EF4444', riskBg: 'rgba(239,68,68,0.12)'  },
        { name: 'Roberto Silva',      time: '6:00 PM',  risk: 'MEDIO', riskColor: '#F59E0B', riskBg: 'rgba(245,158,11,0.12)' },
      ],
      autoMsg: 'Seguimiento "¿Cómo te fue?" enviado a Daniela automáticamente',
    },
    cerebro: [
      { text: '30% de tus leads visitan el gym pero no convierten. Activa oferta de primer mes.',   color: '#34D399' },
      { text: 'Retención mejoró 18% con recordatorios de inactividad automáticos.',                 color: '#60A5FA' },
      { text: 'Instagram atrae más leads. WhatsApp cierra más membresías. Usa ambos.',              color: '#A78BFA' },
    ],
  },
  legal: {
    clientLabel: 'clientes', eventLabel: 'consultas',
    kanbanCols:  ['PROSPECTO', 'CONSULTA', 'EN PROCESO', 'CERRADO'],
    kanbanCards: [['Ricardo M. · WhatsApp · ahora'], ['Elena V. · lun'], ['Caso López · proceso'], ['Contrato T. · cerrado']],
    citas: {
      title: '3 consultas',
      items: [
        { name: 'Ricardo Montoya', time: '10:00 AM', risk: 'BAJO',  riskColor: '#22C55E', riskBg: 'rgba(34,197,94,0.12)'  },
        { name: 'Elena Vargas',    time: '12:00 PM', risk: 'ALTO',  riskColor: '#EF4444', riskBg: 'rgba(239,68,68,0.12)'  },
        { name: 'Fam. Torres',     time: '4:00 PM',  risk: 'MEDIO', riskColor: '#F59E0B', riskBg: 'rgba(245,158,11,0.12)' },
      ],
      autoMsg: 'Lista de documentos enviada a Elena automáticamente',
    },
    cerebro: [
      { text: 'Derecho familiar y corporativo concentran el 62% de tus consultas.',               color: '#34D399' },
      { text: 'Tiempo de respuesta: 1.8 seg. 0 prospectos sin atender esta semana.',              color: '#60A5FA' },
      { text: 'Consultas con respuesta en <5 min tienen 4× más probabilidad de cerrar.',          color: '#A78BFA' },
    ],
  },
}

function getSteps(crm: CRMData) {
  const { clientLabel, eventLabel } = crm
  return [
    {
      tag: '01 · Pipeline',
      title: `Cada ${clientLabel.replace(/s$/, '')} en el pipeline`,
      desc:  `Vista Kanban con todos los contactos organizados por etapa. Canal, hora y valor de ${eventLabel.replace(/es$/, '').replace(/s$/, '')} visibles de un vistazo.`,
      benefit: '→ Nunca más pierdas el seguimiento de un lead.',
      panel: 'kanban',
    },
    {
      tag: `02 · ${eventLabel.charAt(0).toUpperCase() + eventLabel.slice(1)}`,
      title: `Lista de ${eventLabel} con predictor IA`,
      desc:  `Vista de lista y calendario semanal. Cada ${eventLabel.replace(/es$/, '').replace(/s$/, '')} tiene un badge de riesgo (ALTO / MEDIO / BAJO). Los de riesgo alto reciben recordatorio extra automático.`,
      benefit: '→ Hasta 35% menos no-shows desde el primer mes.',
      panel: 'citas',
    },
    {
      tag: '03 · Canales',
      title: 'Todos los canales en un solo panel',
      desc:  `Conecta WhatsApp, Instagram, Facebook, llamadas y tu widget web. La IA responde en todos — el mismo mensaje, la misma calidad, 24/7.`,
      benefit: '→ 0 mensajes sin respuesta, las 24 horas.',
      panel: 'canales',
    },
    {
      tag: '04 · Cerebro IA',
      title: 'Insights en tiempo real sobre tu negocio',
      desc:  `La IA detecta patrones: ${eventLabel} más pedidas, canales que más convierten, horas pico y preguntas frecuentes que no están en tu perfil.`,
      benefit: '→ Tu negocio mejora solo con cada conversación.',
      panel: 'cerebro',
    },
    {
      tag: '05 · Health Score',
      title: 'Score de salud de tu IA',
      desc:  'Un número del 0 al 100 que mide qué tan completo está el entrenamiento de tu IA. A mayor score, mejores y más precisas son las respuestas.',
      benefit: '→ Sabe exactamente qué falta para mejorar.',
      panel: 'score',
    },
  ]
}

/* ── Panels ─────────────────────────────────────────────────────────── */
function KanbanPanel({ crm }: { crm: CRMData }) {
  return (
    <div style={{ display: 'flex', gap: 6, height: '100%' }}>
      {crm.kanbanCols.map((col, ci) => (
        <div key={col} style={{ flex: 1, background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: 8 }}>
          <p style={{ fontSize: 8, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 6px' }}>{col}</p>
          {(crm.kanbanCards[ci] ?? []).map((card, i) => (
            <motion.div key={i}
              initial={ci === 0 ? { opacity: 0, y: 10 } : { opacity: 1 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: ci === 0 ? 0.2 : 0, duration: 0.35 }}
              style={{
                background: ci === 0 ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.06)',
                border:     ci === 0 ? '1px solid rgba(34,197,94,0.25)' : 'none',
                borderRadius: 8, padding: '7px 9px', marginBottom: 5,
              }}>
              <p style={{ fontSize: 10, fontWeight: ci === 0 ? 700 : 500, color: ci === 0 ? '#fff' : 'rgba(255,255,255,0.55)', margin: 0, lineHeight: 1.4 }}>{card}</p>
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  )
}

function CitasPanel({ crm }: { crm: CRMData }) {
  const { title, items, autoMsg } = crm.citas
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      <p style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
        Mañana · {title}
      </p>
      {items.map((c, i) => (
        <motion.div key={c.name}
          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.12, duration: 0.3 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: '9px 12px' }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#fff', margin: 0 }}>{c.name}</p>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', margin: '1px 0 0' }}>{c.time}</p>
          </div>
          <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: c.riskBg, color: c.riskColor }}>{c.risk}</span>
        </motion.div>
      ))}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', background: 'rgba(239,68,68,0.1)', borderRadius: 8, border: '1px solid rgba(239,68,68,0.2)' }}>
        <AlertTriangle size={11} color="#EF4444" />
        <span style={{ fontSize: 10, color: '#EF4444', fontWeight: 500 }}>{autoMsg}</span>
      </motion.div>
    </div>
  )
}

function CanalesPanel() {
  const channels = [
    { name: 'WhatsApp Business', color: '#22C55E', msgs: '14 hoy' },
    { name: 'Instagram DMs',     color: '#E1306C', msgs: '6 hoy'  },
    { name: 'Facebook',          color: '#1877F2', msgs: '3 hoy'  },
    { name: 'Widget web',        color: '#60A5FA', msgs: '2 hoy'  },
    { name: 'Llamadas',          color: '#A78BFA', msgs: '1 hoy'  },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      {channels.map((c, i) => (
        <motion.div key={c.name}
          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.09, duration: 0.3 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '8px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.color, flexShrink: 0 }} />
            <span style={{ fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.8)' }}>{c.name}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{c.msgs}</span>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: c.color, boxShadow: `0 0 5px ${c.color}` }} />
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function CerebroPanel({ crm }: { crm: CRMData }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <p style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>Cerebro IA — insights recientes</p>
      {crm.cerebro.map((f, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.15, duration: 0.35 }}
          style={{ display: 'flex', gap: 10, background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '9px 11px' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: f.color, flexShrink: 0, marginTop: 4 }} />
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.55 }}>{f.text}</p>
        </motion.div>
      ))}
    </div>
  )
}

function ScorePanel() {
  const score = 78
  const r = 52, cx = 64, cy = 64
  const circ = 2 * Math.PI * r
  const dash  = (score / 100) * circ
  const color = score >= 80 ? '#22C55E' : '#F59E0B'
  const items = [
    { label: 'Nombre y teléfono',     done: true  },
    { label: 'Servicios con precio',  done: true  },
    { label: 'Horarios configurados', done: true  },
    { label: '3+ FAQs completas',     done: false },
    { label: 'Política cancelación',  done: false },
  ]
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <svg width={128} height={128} style={{ flexShrink: 0 }}>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={10} />
          <motion.circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={10}
            strokeDasharray={circ} strokeDashoffset={circ} strokeLinecap="round"
            style={{ transformOrigin: `${cx}px ${cy}px`, transform: 'rotate(-90deg)' }}
            animate={{ strokeDashoffset: circ - dash }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }} />
          <text x={cx} y={cy - 6}  textAnchor="middle" fill="#fff"                    fontSize={26} fontWeight={800}>{score}</text>
          <text x={cx} y={cy + 14} textAnchor="middle" fill="rgba(255,255,255,0.4)"  fontSize={10}>/ 100</text>
        </svg>
      </motion.div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, paddingTop: 4 }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>Completitud IA</p>
        {items.map((it, i) => (
          <motion.div key={it.label}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.1 }}
            style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <CheckCircle2 size={12} color={it.done ? '#22C55E' : 'rgba(255,255,255,0.2)'} />
            <span style={{ fontSize: 10, color: it.done ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)' }}>{it.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ── Component ───────────────────────────────────────────────────────── */
export function DashboardWalkthrough() {
  const { lang } = useLang()
  const isEN = lang === 'en'

  const [industry, setIndustry] = useState('dental')
  const [step,     setStep]     = useState(0)
  const [playing,  setPlaying]  = useState(true)

  const crm   = CRM[industry] ?? CRM.dental
  const steps = getSteps(crm)

  const advance = useCallback(() => setStep(s => (s + 1) % steps.length), [steps.length])

  useEffect(() => {
    if (!playing) return
    const t = setInterval(advance, AUTO_ADVANCE_MS)
    return () => clearInterval(t)
  }, [playing, advance])

  function selectIndustry(slug: string) { setIndustry(slug); setStep(0); setPlaying(true) }

  const current  = steps[step]
  const indColor = IND_TABS.find(t => t.slug === industry)?.color ?? NAVY

  function renderPanel() {
    switch (current.panel) {
      case 'kanban':  return <KanbanPanel  crm={crm} />
      case 'citas':   return <CitasPanel   crm={crm} />
      case 'canales': return <CanalesPanel />
      case 'cerebro': return <CerebroPanel crm={crm} />
      case 'score':   return <ScorePanel />
      default:        return null
    }
  }

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6" style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
      <div className="max-w-5xl mx-auto flex flex-col gap-8">

        {/* Header */}
        <div className="flex flex-col items-center text-center gap-3">
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--accent-label)' }}>
            {isEN ? 'The Welko CRM' : 'El CRM de Welko'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            {isEN ? 'Everything included in the dashboard' : 'Todo lo que incluye el dashboard'}
          </h2>
          <p className="text-sm max-w-lg" style={{ color: 'var(--text-secondary)' }}>
            {isEN
              ? `Not just a chatbot. Welko is the complete operating system for your ${crm.clientLabel}.`
              : `No solo es un chatbot. Welko es el sistema operativo completo de la relación con tus ${crm.clientLabel}.`}
          </p>
        </div>

        {/* Industry selector */}
        <div className="flex flex-wrap gap-2 justify-center">
          {IND_TABS.map(t => (
            <button key={t.slug} onClick={() => selectIndustry(t.slug)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-150"
              style={{
                background: industry === t.slug ? t.color : t.color + '12',
                border:     `1px solid ${industry === t.slug ? t.color : t.color + '28'}`,
                color:      industry === t.slug ? '#fff' : t.color,
                transform:  industry === t.slug ? 'scale(1.04)' : 'scale(1)',
              }}>
              {isEN ? t.en : t.es}
            </button>
          ))}
        </div>

        {/* Step pills */}
        <div className="flex gap-2 flex-wrap justify-center">
          {steps.map((s, i) => (
            <button key={i} onClick={() => { setStep(i); setPlaying(false) }}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200"
              style={{
                background: step === i ? NAVY : 'var(--surface)',
                border: `1px solid ${step === i ? NAVY : 'var(--border)'}`,
                color: step === i ? '#fff' : 'var(--text-secondary)',
              }}>
              {s.tag}
            </button>
          ))}
        </div>

        {/* Split view */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

          {/* Left: description */}
          <AnimatePresence mode="wait">
            <motion.div key={`${industry}-${step}`}
              initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="lg:col-span-2 flex flex-col gap-4">
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: indColor }}>{current.tag}</span>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>{current.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{current.desc}</p>
              <p className="text-sm font-semibold" style={{ color: NAVY }}>{current.benefit}</p>

              {/* Navigation */}
              <div className="flex items-center gap-3 mt-2">
                <button onClick={() => { setStep(s => (s - 1 + steps.length) % steps.length); setPlaying(false) }}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                  style={{ border: '1px solid var(--border)', color: 'var(--text-muted)', background: 'var(--surface)' }}>
                  <ChevronLeft size={14} />
                </button>
                <div className="flex gap-1.5">
                  {steps.map((_, i) => (
                    <button key={i} onClick={() => { setStep(i); setPlaying(false) }}
                      style={{ width: i === step ? 16 : 5, height: 5, borderRadius: 99, border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.2s',
                        background: i === step ? NAVY : 'var(--border)' }} />
                  ))}
                </div>
                <button onClick={() => { setStep(s => (s + 1) % steps.length); setPlaying(false) }}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                  style={{ border: '1px solid var(--border)', color: 'var(--text-muted)', background: 'var(--surface)' }}>
                  <ChevronRight size={14} />
                </button>
                <button onClick={() => setPlaying(p => !p)}
                  className="ml-auto px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                  style={{ background: playing ? 'var(--surface)' : NAVY, color: playing ? 'var(--text-muted)' : '#fff',
                    border: `1px solid ${playing ? 'var(--border)' : NAVY}` }}>
                  {playing ? '⏸' : '▶'}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Right: dashboard panel */}
          <div className="lg:col-span-3 !p-3 sm:!p-5"
            style={{ background: 'linear-gradient(145deg, #05101F 0%, #0E1E3A 100%)', borderRadius: 16,
              border: '1px solid rgba(255,255,255,0.08)', minHeight: 220 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
              {['#EF4444', '#F59E0B', '#22C55E'].map(c => (
                <div key={c} style={{ width: 7, height: 7, borderRadius: '50%', background: c }} />
              ))}
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginLeft: 4 }}>welko.agency / dashboard</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={`${industry}-${step}`}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: EASE }}>
                {renderPanel()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  )
}
