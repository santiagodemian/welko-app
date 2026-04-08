'use client'

import { useState, useEffect } from 'react'
import {
  MessageCircle, Calendar, TrendingUp, Zap, Sparkles,
  Brain, AlertTriangle, CheckCircle2, Clock, ToggleLeft, ToggleRight,
  ChevronRight, ArrowUpRight, ArrowRight,
} from 'lucide-react'
import Link from 'next/link'

const SURF  = 'var(--surface)'
const BORD  = 'var(--border)'
const TEXT  = 'var(--text-primary)'
const MUTED = 'var(--text-secondary)'
const NAVY  = '#13244A'

/* ── Mock cerebro IA observations ── */
const CEREBRO_FEED = [
  { id:1, icon:'📈', time:'hace 5 min',  color:'#34D399', text:'Desde que activaste recordatorios, los no-shows bajaron 18% — ahorro estimado $4,200 MXN este mes.' },
  { id:2, icon:'🔍', time:'hace 18 min', color:'#60A5FA', text:'Hoy 4 pacientes preguntaron por precio antes de agendar. Considera agregar tu tarifa al perfil para respuestas más rápidas.' },
  { id:3, icon:'📅', time:'hace 1h',     color:'#A78BFA', text:'Los martes a las 10am tienen 40% más demanda. La agenda está llena — hay 3 pacientes en lista de espera.' },
  { id:4, icon:'⚡', time:'hace 2h',     color:'#F59E0B', text:'3 pacientes no respondieron el recordatorio de mañana — riesgo de no-show alto. Welko enviará segundo aviso automáticamente.' },
  { id:5, icon:'💬', time:'hace 3h',     color:'#60A5FA', text:'"¿Tienen estacionamiento?" fue la pregunta más frecuente de hoy (6 veces). Actualiza tu perfil para responderla automáticamente.' },
]

/* ── No-show predictor ── */
const UPCOMING = [
  { name:'Miguel Sánchez',  time:'Mañana 10:00am', service:'Blanqueamiento',    risk:'ALTO',  channel:'WhatsApp',  value:1800 },
  { name:'Patricia Vega',   time:'Mañana 11:30am', service:'Consulta general',  risk:'MEDIO', channel:'Instagram', value:900  },
  { name:'Carlos Ruiz',     time:'Mañana 2:00pm',  service:'Ortodoncia',        risk:'BAJO',  channel:'Web',       value:3200 },
  { name:'Ana Martínez',    time:'Mañana 4:00pm',  service:'Limpieza dental',   risk:'ALTO',  channel:'WhatsApp',  value:850  },
  { name:'Diego Morales',   time:'Jue 9:00am',     service:'Cirugía menor',     risk:'BAJO',  channel:'Llamada',   value:6500 },
]

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

  useEffect(() => {
    const stored = localStorage.getItem('welko_modo_ocupado')
    if (stored === 'true') { setModo(true); setSavedModo(true) }
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
      label: 'Citas agendadas',
      value: String((stats?.pipelineByStage?.AGENDADO ?? 0) + (stats?.pipelineByStage?.CONFIRMADO ?? 0) || '18'),
      sub: '+3 vs ayer',
    },
    {
      Icon: TrendingUp, color: '#34D399',
      label: 'Ingresos recuperados',
      value: stats ? `$${Intl.NumberFormat('es-MX').format(Math.round(stats.revenueAsegurado))}` : '$18,400',
      sub: 'No-shows evitados este mes',
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
    <div style={{ background: 'var(--bg)', minHeight: '100%', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>

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
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr 1fr 1fr', gap: 12, alignItems: 'stretch' }}>
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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 12 }}>

        {/* Cerebro IA feed */}
        <div style={{ background: SURF, border: `1px solid ${BORD}`, borderRadius: 16, display: 'flex', flexDirection: 'column' }}>
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
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {CEREBRO_FEED.map((obs, i) => (
              <div
                key={obs.id}
                style={{
                  display: 'flex', gap: 14, padding: '14px 20px',
                  borderBottom: i < CEREBRO_FEED.length - 1 ? `1px solid ${BORD}` : 'none',
                  alignItems: 'flex-start',
                }}
              >
                <div style={{
                  width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                  background: `${obs.color}15`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16,
                }}>
                  {obs.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 12.5, color: TEXT, margin: 0, lineHeight: 1.55 }}>{obs.text}</p>
                  <span style={{ fontSize: 10, color: MUTED, marginTop: 4, display: 'block' }}>{obs.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right col */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* No-show predictor */}
          <div style={{ background: SURF, border: `1px solid ${BORD}`, borderRadius: 16, flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '14px 18px', borderBottom: `1px solid ${BORD}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <AlertTriangle size={14} color="#F59E0B" />
                <p style={{ color: TEXT, fontSize: 13, fontWeight: 600, margin: 0 }}>Predictor de No-shows</p>
              </div>
              <p style={{ fontSize: 11, color: MUTED, margin: '3px 0 0' }}>Próximas citas con análisis de riesgo IA</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', padding: '8px 0' }}>
              {UPCOMING.map((apt, i) => {
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
                Ver todas las citas <ChevronRight size={12} />
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
