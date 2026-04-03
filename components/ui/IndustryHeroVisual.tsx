'use client'

import { INDUSTRIES } from '@/lib/industries'
import { motion, AnimatePresence } from 'framer-motion'

interface Props { slug: string }

// Deterministic neural network node positions
const NODES = [
  { x: 12, y: 18 }, { x: 42, y: 8  }, { x: 78, y: 22 }, { x: 92, y: 58 },
  { x: 62, y: 72 }, { x: 22, y: 68 }, { x: 5,  y: 45 }, { x: 50, y: 42 },
  { x: 35, y: 32 }, { x: 68, y: 50 },
]
const EDGES = [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,3],[7,2],[5,8]]

const CHAT: Record<string, { msg: string; reply: string }> = {
  dental:        { msg: 'Quiero una limpieza dental', reply: 'Tenemos este jueves a las 10 AM. ¿Le funciona?' },
  psicologia:    { msg: 'Necesito una consulta urgente', reply: 'Mañana a las 6 PM disponible. ¿Le agendo?' },
  estetica:      { msg: '¿Cuánto cuesta el botox?', reply: 'Desde $3,500 MXN. ¿Le agendo consulta gratis?' },
  nutricion:     { msg: 'Quiero un plan de alimentación', reply: 'Primera cita incluye evaluación completa. ✓' },
  ginecologia:   { msg: 'Necesito un chequeo general', reply: 'Esta semana disponible. ¿Qué horario prefiere?' },
  oftalmologia:  { msg: '¿Hacen examen de la vista?', reply: 'Sí, revisión completa y prescripción incluida.' },
  medica:        { msg: 'Quiero una consulta general', reply: 'Hoy a las 4 PM disponible. ¿Le confirmo?' },
  fisioterapia:  { msg: '¿Atienden lesiones deportivas?', reply: 'Sí, evaluamos y diseñamos tu plan de rehab.' },
  spa:           { msg: 'Quiero reservar un masaje', reply: 'Sábado a las 11 AM disponible. ¿Lo aparto?' },
  quiropractica: { msg: 'Tengo dolor de espalda fuerte', reply: 'Hoy a las 5 PM para tu evaluación inicial.' },
}

export function IndustryHeroVisual({ slug }: Props) {
  const industry = INDUSTRIES.find((i) => i.slug === slug)
  const color    = industry?.color ?? '#13244A'
  const chat     = CHAT[slug] ?? CHAT.dental

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={slug}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'relative',
          width: '100%',
          minHeight: 340,
          borderRadius: 28,
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #05101F 0%, #0E1F38 55%, #081628 100%)',
          border: `1px solid ${color}35`,
          padding: '24px 20px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        {/* Neural network background */}
        <svg
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.15 }}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {EDGES.map(([a, b], i) => (
            <line
              key={i}
              x1={NODES[a].x} y1={NODES[a].y}
              x2={NODES[b].x} y2={NODES[b].y}
              stroke={color} strokeWidth="0.35"
            />
          ))}
          {NODES.map((n, i) => (
            <circle key={i} cx={n.x} cy={n.y} r={i % 3 === 0 ? '1.4' : '0.9'} fill={color} />
          ))}
        </svg>

        {/* Glow orb */}
        <div style={{
          position: 'absolute', top: -60, right: -60,
          width: 240, height: 240, borderRadius: '50%',
          background: `radial-gradient(ellipse, ${color}40 0%, transparent 68%)`,
          pointerEvents: 'none',
        }} />

        {/* Bottom glow */}
        <div style={{
          position: 'absolute', bottom: 0, left: '10%', right: '10%',
          height: 60,
          background: `radial-gradient(ellipse, ${color}28 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />

        {/* Header: badge + status */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: `${color}20`, border: `1px solid ${color}45`,
            padding: '4px 12px', borderRadius: 99,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#F0F4FC', letterSpacing: '0.04em' }}>
              {industry?.es.name ?? 'Clínica'}
            </span>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.28)',
            padding: '4px 10px', borderRadius: 99,
          }}>
            <motion.span
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              style={{ width: 5, height: 5, borderRadius: '50%', background: '#22C55E', display: 'inline-block', flexShrink: 0 }}
            />
            <span style={{ fontSize: 9, fontWeight: 700, color: '#22C55E', letterSpacing: '0.06em' }}>ONLINE 24/7</span>
          </div>
        </div>

        {/* Glass chat card */}
        <motion.div
          key={`chat-${slug}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: 20,
            padding: '12px 14px',
            display: 'flex', flexDirection: 'column', gap: 9,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            position: 'relative', zIndex: 1, flex: 1,
          }}
        >
          {/* Chat header bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 9, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{
              width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
              background: `linear-gradient(135deg, ${color} 0%, ${color}88 100%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 800, color: '#fff',
            }}>W</div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#F0F4FC', lineHeight: 1.2 }}>Welko IA</p>
              <p style={{ margin: 0, fontSize: 9, color: 'rgba(240,244,252,0.40)' }}>WhatsApp Business · cifrado</p>
            </div>
            <div style={{ display: 'flex', gap: 3 }}>
              {['#ef4444','#f59e0b','#22c55e'].map(c => (
                <div key={c} style={{ width: 7, height: 7, borderRadius: '50%', background: c, opacity: 0.7 }} />
              ))}
            </div>
          </div>

          {/* Patient bubble */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{
              maxWidth: '78%',
              background: 'rgba(255,255,255,0.09)',
              borderRadius: '12px 12px 2px 12px',
              padding: '7px 11px',
              fontSize: 11, color: '#F0F4FC', lineHeight: 1.45,
            }}>{chat.msg}</div>
          </div>

          {/* AI reply */}
          <motion.div
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.5 }}
            style={{ display: 'flex', gap: 6, alignItems: 'flex-end' }}
          >
            <div style={{
              width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
              background: color, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 8, fontWeight: 800, color: '#fff',
            }}>W</div>
            <div style={{
              maxWidth: '78%',
              background: `${color}22`,
              border: `1px solid ${color}38`,
              borderRadius: '12px 12px 12px 2px',
              padding: '7px 11px',
              fontSize: 11, color: '#F0F4FC', lineHeight: 1.45,
            }}>{chat.reply}</div>
          </motion.div>

          {/* Typing dots */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end' }}>
            <div style={{
              width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
              background: 'rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 7, color: 'rgba(255,255,255,0.35)',
            }}>W</div>
            <div style={{
              display: 'flex', gap: 3, alignItems: 'center',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 10, padding: '7px 10px',
            }}>
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.38)' }}
                  animate={{ opacity: [0.25, 1, 0.25] }}
                  transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.22 }}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Bottom metric row */}
        <div style={{
          display: 'flex', gap: 6, position: 'relative', zIndex: 1,
        }}>
          {[
            { v: '< 2s',  l: 'respuesta' },
            { v: '100%',  l: 'automático' },
            { v: '24/7',  l: 'disponible' },
          ].map((m) => (
            <div key={m.v} style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12, padding: '6px 0',
            }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#F0F4FC' }}>{m.v}</span>
              <span style={{ fontSize: 9, color: 'rgba(240,244,252,0.40)', marginTop: 1 }}>{m.l}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
