'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { MessageCircle, Calendar, TrendingUp, Sparkles, CheckCircle } from 'lucide-react'

const NAVY  = '#1A2A56'
const GREEN = '#22C55E'

const CARDS = [
  {
    Icon: MessageCircle,
    value: '303',
    label: 'Pacientes Interesados',
    color: NAVY,
    bg: '#EEF2FF',
  },
  {
    Icon: Calendar,
    value: '$53,315',
    sub: 'MXN',
    label: 'Revenue Predictivo',
    color: NAVY,
    bg: '#EEF2FF',
  },
  {
    Icon: TrendingUp,
    value: '$47,173',
    sub: '.5 MXN',
    label: 'Revenue Asegurado IA',
    color: GREEN,
    bg: 'rgba(34,197,94,0.10)',
  },
]

export function LaptopMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className="flex items-center justify-center w-full"
      style={{ perspective: 1100 }}
    >
      <motion.div
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          transformStyle: 'preserve-3d',
          transform: 'rotateY(-11deg) rotateX(4deg)',
          filter:
            'drop-shadow(0 44px 64px rgba(19,36,74,0.22)) drop-shadow(0 8px 18px rgba(0,0,0,0.12))',
        }}
      >
        {/* ── Lid ── */}
        <div
          style={{
            width: 460,
            background: 'linear-gradient(155deg, #424242 0%, #1E1E1E 100%)',
            borderRadius: '14px 14px 0 0',
            padding: '10px 8px 0 8px',
            position: 'relative',
            boxSizing: 'border-box',
          }}
        >
          {/* Camera */}
          <div
            style={{
              position: 'absolute', top: 5, left: '50%',
              transform: 'translateX(-50%)',
              width: 5, height: 5, borderRadius: '50%', background: '#0A0A0A',
            }}
          />

          {/* Screen */}
          <div
            style={{
              borderRadius: '7px 7px 0 0',
              overflow: 'hidden',
              background: '#F1F5F9',
              height: 275,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* ─ Header bar ─ */}
            <div
              style={{
                background: NAVY,
                padding: '7px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                flexShrink: 0,
              }}
            >
              {/* Logo — matches the real Welko navbar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                <Image
                  src="/welko_logo_purewhite.png"
                  alt="Welko"
                  width={18}
                  height={18}
                  style={{ objectFit: 'contain', display: 'block' }}
                />
                <span style={{ color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '-0.01em' }}>
                  Welko
                </span>
              </div>
              {/* Divider */}
              <div style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
              <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 9, fontWeight: 500, flex: 1 }}>
                Dashboard de Inteligencia
              </span>
              {/* IA Activa badge */}
              <div
                style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  background: 'rgba(34,197,94,0.18)',
                  border: '1px solid rgba(34,197,94,0.35)',
                  borderRadius: 99, padding: '2px 7px',
                }}
              >
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: GREEN, display: 'inline-block' }} />
                <span style={{ color: GREEN, fontSize: 8, fontWeight: 700, letterSpacing: '0.04em' }}>IA ACTIVA</span>
              </div>
            </div>

            {/* ─ Body ─ */}
            <div style={{ flex: 1, padding: '10px 10px 8px', display: 'flex', flexDirection: 'column', gap: 9 }}>

              {/* KPI cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 7 }}>
                {CARDS.map((card) => (
                  <motion.div
                    key={card.label}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.4 }}
                    style={{
                      background: '#fff',
                      border: `1px solid ${card.color === GREEN ? 'rgba(34,197,94,0.2)' : 'rgba(26,42,86,0.08)'}`,
                      borderRadius: 9,
                      padding: '8px 8px 7px',
                      display: 'flex', flexDirection: 'column', gap: 5,
                    }}
                  >
                    {/* Icon */}
                    <div
                      style={{
                        width: 24, height: 24, borderRadius: 6, flexShrink: 0,
                        background: card.bg,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <card.Icon size={12} color={card.color} strokeWidth={2} />
                    </div>
                    {/* Value */}
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                      <span style={{ fontSize: 16, fontWeight: 800, color: card.color, lineHeight: 1 }}>
                        {card.value}
                      </span>
                      {card.sub && (
                        <span style={{ fontSize: 8, fontWeight: 600, color: card.color, opacity: 0.7 }}>
                          {card.sub}
                        </span>
                      )}
                    </div>
                    {/* Label */}
                    <span style={{ fontSize: 8.5, color: '#6B7280', lineHeight: 1.3 }}>
                      {card.label}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* ─ AI Insight row ─ */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.4 }}
                style={{
                  background: 'rgba(34,197,94,0.06)',
                  border: '1px solid rgba(34,197,94,0.18)',
                  borderRadius: 8,
                  padding: '7px 10px',
                  display: 'flex', flexDirection: 'column', gap: 4,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Sparkles size={10} color={GREEN} />
                  <span style={{ fontSize: 9, fontWeight: 700, color: NAVY }}>
                    Detección Predictiva · IA
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ fontSize: 9, color: '#374151' }}>→ IA detectó <strong>4 huecos</strong> en tu agenda esta semana.</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <CheckCircle size={9} color={GREEN} />
                    <span style={{ fontSize: 9, color: '#374151' }}>Campaña de reactivación <strong>aprobada</strong> y en ejecución.</span>
                  </div>
                </div>
              </motion.div>

              {/* ─ Mini activity list ─ */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.4 }}
                style={{ display: 'flex', flexDirection: 'column', gap: 4 }}
              >
                <span style={{ fontSize: 8.5, fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Últimas interacciones
                </span>
                {[
                  { name: 'Ana García',    time: '09:14', ch: 'WhatsApp', ok: true  },
                  { name: 'Luis Mendoza',  time: '09:31', ch: 'Instagram', ok: true  },
                  { name: 'Carla Ruiz',   time: '09:47', ch: 'Llamada', ok: false },
                ].map((row) => (
                  <div
                    key={row.name}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      background: '#fff', borderRadius: 6,
                      padding: '5px 8px',
                      border: '1px solid rgba(26,42,86,0.06)',
                    }}
                  >
                    <div style={{
                      width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                      background: '#EEF2FF',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span style={{ fontSize: 7, fontWeight: 800, color: NAVY }}>
                        {row.name.charAt(0)}
                      </span>
                    </div>
                    <span style={{ fontSize: 8.5, fontWeight: 600, color: '#111827', flex: 1 }}>{row.name}</span>
                    <span style={{ fontSize: 7.5, color: '#9CA3AF' }}>{row.ch}</span>
                    <span style={{ fontSize: 7.5, color: '#9CA3AF' }}>{row.time}</span>
                    <span style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: row.ok ? GREEN : '#F59E0B', flexShrink: 0,
                    }} />
                  </div>
                ))}
              </motion.div>

            </div>
          </div>
        </div>

        {/* ── Hinge ── */}
        <div
          style={{
            width: 460,
            height: 4,
            background: 'linear-gradient(to bottom, #111, #2a2a2a)',
          }}
        />

        {/* ── Base ── */}
        <div
          style={{
            width: 460,
            height: 22,
            background: 'linear-gradient(155deg, #3C3C3C 0%, #222 100%)',
            borderRadius: '0 0 10px 10px',
            position: 'relative',
          }}
        >
          {/* Trackpad */}
          <div
            style={{
              position: 'absolute',
              bottom: 5, left: '50%', transform: 'translateX(-50%)',
              width: 72, height: 9,
              borderRadius: 3,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          />
          {/* Foot reflections */}
          <div style={{
            position: 'absolute', left: 16, bottom: 3,
            width: 14, height: 3, borderRadius: 2,
            background: 'rgba(255,255,255,0.07)',
          }} />
          <div style={{
            position: 'absolute', right: 16, bottom: 3,
            width: 14, height: 3, borderRadius: 2,
            background: 'rgba(255,255,255,0.07)',
          }} />
        </div>

      </motion.div>
    </motion.div>
  )
}
