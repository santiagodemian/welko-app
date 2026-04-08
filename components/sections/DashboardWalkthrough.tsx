'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react'

const NAVY = '#13244A'
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]
const AUTO_ADVANCE_MS = 4800

const STEPS = [
  {
    tag: '01 · Pipeline',
    emoji: '📋',
    title: 'Cada paciente tiene su lugar en el pipeline',
    desc: 'Vista Kanban con todos los contactos organizados por etapa: Nuevo → Agendado → Confirmado → Atendido. Canal, hora y valor de cita visibles en un vistazo.',
    benefit: '→ Nunca más pierdas el seguimiento de un lead.',
    panel: 'kanban',
  },
  {
    tag: '02 · Citas',
    emoji: '📅',
    title: 'Lista y calendario de citas con predictor IA',
    desc: 'Vista de lista y calendario semanal. Cada cita tiene un badge de riesgo (ALTO / MEDIO / BAJO). Las de riesgo alto reciben recordatorio extra automático.',
    benefit: '→ Hasta 35% menos no-shows desde el primer mes.',
    panel: 'citas',
  },
  {
    tag: '03 · Canales',
    emoji: '📡',
    title: 'Todos los canales en un solo panel',
    desc: 'Conecta WhatsApp, Instagram, Facebook, llamadas y tu widget web. Una vez conectados, la IA responde en todos — el mismo mensaje, la misma calidad.',
    benefit: '→ 0 mensajes sin respuesta, las 24 horas.',
    panel: 'canales',
  },
  {
    tag: '04 · Cerebro IA',
    emoji: '🧠',
    title: 'Insights en tiempo real sobre tu negocio',
    desc: 'La IA detecta patrones: servicios más pedidos, canales que más convierten, horas pico, preguntas frecuentes que no están en tu perfil.',
    benefit: '→ Tu clínica mejora sola con cada conversación.',
    panel: 'cerebro',
  },
  {
    tag: '05 · Health Score',
    emoji: '📊',
    title: 'Score de salud de tu IA y tu negocio',
    desc: 'Un número del 0 al 100 que mide qué tan completo está el entrenamiento de tu IA. A mayor score, mejores y más precisas son las respuestas.',
    benefit: '→ Sabe exactamente qué falta para mejorar.',
    panel: 'score',
  },
]

/* ── Panels ───────────────────────────────────────── */
function KanbanPanel() {
  const COLS = [
    { label: 'NUEVO',      cards: ['Isabel T. · WhatsApp · ahora'] },
    { label: 'AGENDADO',   cards: ['Miguel S. · ayer'] },
    { label: 'CONFIRMADO', cards: ['Patricia V. · lun'] },
    { label: 'ATENDIDO',   cards: ['Carlos R. · vie'] },
  ]
  return (
    <div style={{ display: 'flex', gap: 6, height: '100%' }}>
      {COLS.map((col, ci) => (
        <div key={col.label} style={{ flex: 1, background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: 8 }}>
          <p style={{ fontSize: 8, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 6px' }}>{col.label}</p>
          {col.cards.map((card, i) => (
            <motion.div key={i}
              initial={ci === 0 ? { opacity: 0, y: 10 } : { opacity: 1 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: ci === 0 ? 0.2 : 0, duration: 0.35 }}
              style={{ background: ci === 0 ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.06)',
                border: ci === 0 ? '1px solid rgba(34,197,94,0.25)' : 'none',
                borderRadius: 8, padding: '7px 9px', marginBottom: 5 }}>
              <p style={{ fontSize: 10, fontWeight: ci === 0 ? 700 : 500, color: ci === 0 ? '#fff' : 'rgba(255,255,255,0.55)', margin: 0, lineHeight: 1.4 }}>{card}</p>
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  )
}

function CitasPanel() {
  const citas = [
    { name: 'Isabel Torres',  time: '10:00 AM', risk: 'BAJO',  color: '#22C55E', bg: 'rgba(34,197,94,0.12)' },
    { name: 'Miguel Sánchez', time: '11:30 AM', risk: 'ALTO',  color: '#EF4444', bg: 'rgba(239,68,68,0.12)' },
    { name: 'Patricia Vega',  time: '3:00 PM',  risk: 'MEDIO', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      <p style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>Mañana · 3 citas</p>
      {citas.map((c, i) => (
        <motion.div key={c.name}
          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.12, duration: 0.3 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: '9px 12px' }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#fff', margin: 0 }}>{c.name}</p>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', margin: '1px 0 0' }}>{c.time}</p>
          </div>
          <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: c.bg, color: c.color }}>{c.risk}</span>
        </motion.div>
      ))}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', background: 'rgba(239,68,68,0.1)', borderRadius: 8, border: '1px solid rgba(239,68,68,0.2)' }}>
        <AlertTriangle size={11} color="#EF4444" />
        <span style={{ fontSize: 10, color: '#EF4444', fontWeight: 500 }}>Recordatorio extra enviado a Miguel automáticamente</span>
      </motion.div>
    </div>
  )
}

function CanalesPanel() {
  const channels = [
    { name: 'WhatsApp Business', emoji: '💬', color: '#22C55E', status: 'Activo', msgs: '14 hoy' },
    { name: 'Instagram DMs',     emoji: '📸', color: '#E1306C', status: 'Activo', msgs: '6 hoy' },
    { name: 'Facebook',          emoji: '📘', color: '#1877F2', status: 'Activo', msgs: '3 hoy' },
    { name: 'Widget web',        emoji: '🌐', color: '#60A5FA', status: 'Activo', msgs: '2 hoy' },
    { name: 'Llamadas',          emoji: '📞', color: '#A78BFA', status: 'Activo', msgs: '1 hoy' },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      {channels.map((c, i) => (
        <motion.div key={c.name}
          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.09, duration: 0.3 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '8px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 15 }}>{c.emoji}</span>
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

function CerebroPanel() {
  const feed = [
    { icon: '📈', text: 'Limpieza dental es tu servicio más pedido esta semana (8 consultas). Considera abrir más horarios AM.', color: '#34D399' },
    { icon: '⚡', text: 'Recordatorios activos: no-shows bajaron 23% vs. el mes pasado. Ahorro estimado $5,100 MXN.', color: '#60A5FA' },
    { icon: '🔍', text: 'WhatsApp convierte 3× mejor que Instagram para citas. Prioriza ese canal en tu estrategia.', color: '#A78BFA' },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <p style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>Cerebro IA — insights recientes</p>
      {feed.map((f, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.15, duration: 0.35 }}
          style={{ display: 'flex', gap: 10, background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '9px 11px' }}>
          <span style={{ fontSize: 15, flexShrink: 0 }}>{f.icon}</span>
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
  const dash = (score / 100) * circ
  const color = score >= 80 ? '#22C55E' : score >= 50 ? '#F59E0B' : '#60A5FA'
  const items = [
    { label: 'Nombre y teléfono',      done: true },
    { label: 'Servicios con precio',   done: true },
    { label: 'Horarios configurados',  done: true },
    { label: '3+ FAQs completas',      done: false },
    { label: 'Política cancelación',   done: false },
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
          <text x={cx} y={cy - 6} textAnchor="middle" fill="#fff" fontSize={26} fontWeight={800}>{score}</text>
          <text x={cx} y={cy + 14} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize={10}>/ 100</text>
        </svg>
      </motion.div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, paddingTop: 4 }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>Completitud IA</p>
        {items.map((it, i) => (
          <motion.div key={it.label}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <CheckCircle2 size={12} color={it.done ? '#22C55E' : 'rgba(255,255,255,0.2)'} />
            <span style={{ fontSize: 10, color: it.done ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)' }}>{it.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

const PANEL_MAP: Record<string, React.FC> = {
  kanban: KanbanPanel,
  citas: CitasPanel,
  canales: CanalesPanel,
  cerebro: CerebroPanel,
  score: ScorePanel,
}

/* ── Component ────────────────────────────────────── */
export function DashboardWalkthrough() {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(true)

  const advance = useCallback(() => setStep(s => (s + 1) % STEPS.length), [])

  useEffect(() => {
    if (!playing) return
    const t = setInterval(advance, AUTO_ADVANCE_MS)
    return () => clearInterval(t)
  }, [playing, advance])

  const current = STEPS[step]
  const Panel = PANEL_MAP[current.panel]

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6" style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
      <div className="max-w-5xl mx-auto flex flex-col gap-10">

        {/* Header */}
        <div className="flex flex-col items-center text-center gap-3">
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--accent-label)' }}>
            El CRM de Welko
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Todo lo que incluye el dashboard
          </h2>
          <p className="text-sm max-w-lg" style={{ color: 'var(--text-secondary)' }}>
            No solo es un chatbot. Welko es el sistema operativo completo de la relación con tus pacientes.
          </p>
        </div>

        {/* Step pills */}
        <div className="flex gap-2 flex-wrap justify-center">
          {STEPS.map((s, i) => (
            <button key={i} onClick={() => { setStep(i); setPlaying(false) }}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200"
              style={{
                background: step === i ? NAVY : 'var(--surface)',
                border: `1px solid ${step === i ? NAVY : 'var(--border)'}`,
                color: step === i ? '#fff' : 'var(--text-secondary)',
              }}>
              <span>{s.emoji}</span>
              <span>{s.tag}</span>
            </button>
          ))}
        </div>

        {/* Split view */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

          {/* Left: description (2 cols) */}
          <AnimatePresence mode="wait">
            <motion.div key={step}
              initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="lg:col-span-2 flex flex-col gap-4">
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--accent-label)' }}>{current.tag}</span>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>{current.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{current.desc}</p>
              <p className="text-sm font-semibold" style={{ color: NAVY }}>{current.benefit}</p>

              {/* Navigation */}
              <div className="flex items-center gap-3 mt-2">
                <button onClick={() => { setStep(s => (s - 1 + STEPS.length) % STEPS.length); setPlaying(false) }}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                  style={{ border: '1px solid var(--border)', color: 'var(--text-muted)', background: 'var(--surface)' }}>
                  <ChevronLeft size={14} />
                </button>
                <div className="flex gap-1.5">
                  {STEPS.map((_, i) => (
                    <button key={i} onClick={() => { setStep(i); setPlaying(false) }}
                      style={{ width: i === step ? 16 : 5, height: 5, borderRadius: 99, border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.2s',
                        background: i === step ? NAVY : 'var(--border)' }} />
                  ))}
                </div>
                <button onClick={() => { setStep(s => (s + 1) % STEPS.length); setPlaying(false) }}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                  style={{ border: '1px solid var(--border)', color: 'var(--text-muted)', background: 'var(--surface)' }}>
                  <ChevronRight size={14} />
                </button>
                <button onClick={() => setPlaying(p => !p)}
                  className="ml-auto px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                  style={{ background: playing ? 'var(--surface)' : NAVY, color: playing ? 'var(--text-muted)' : '#fff', border: `1px solid ${playing ? 'var(--border)' : NAVY}` }}>
                  {playing ? '⏸' : '▶'}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Right: dashboard panel (3 cols) */}
          <div className="lg:col-span-3 !p-3 sm:!p-5"
            style={{ background: 'linear-gradient(145deg, #05101F 0%, #0E1E3A 100%)', borderRadius: 16,
              border: '1px solid rgba(255,255,255,0.08)', minHeight: 220 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
              {['#EF4444', '#F59E0B', '#22C55E'].map(c => (
                <div key={c} style={{ width: 7, height: 7, borderRadius: '50%', background: c }} />
              ))}
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginLeft: 4 }}>
                welko.agency / dashboard
              </span>
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={step}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: EASE }}>
                <Panel />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
