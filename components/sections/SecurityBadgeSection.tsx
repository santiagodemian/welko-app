'use client'

import { motion } from 'framer-motion'
import { ShieldCheck, Lock, FileText, Server, ShieldAlert } from 'lucide-react'

const NAVY   = '#1A2A56'
const CARD   = 'rgba(255,255,255,0.07)'
const BORDER = 'rgba(255,255,255,0.12)'

const BADGES = [
  {
    Icon: Lock,
    title: 'AES-256-GCM en reposo',
    desc: 'Todos los datos de pacientes se cifran en la base de datos con AES-256-GCM antes de almacenarse. Ningún registro viaja sin cifrar.',
    color: '#22C55E',
    tag: 'EN REPOSO',
  },
  {
    Icon: ShieldAlert,
    title: 'TLS 1.3 en tránsito',
    desc: 'Cada solicitud viaja protegida con TLS 1.3. Los headers HSTS fuerzan HTTPS en todos los subdominios durante 2 años.',
    color: '#3B82F6',
    tag: 'EN TRÁNSITO',
  },
  {
    Icon: FileText,
    title: 'Cumplimiento LFPDPPP',
    desc: 'Adherencia total a la Ley Federal de Protección de Datos Personales en posesión de particulares.',
    color: '#8B5CF6',
    tag: 'LEGAL MX',
  },
  {
    Icon: Server,
    title: 'Headers CSP + HSTS',
    desc: 'Content Security Policy, X-Frame-Options y Permissions-Policy activos para bloquear ataques XSS, clickjacking e inyección.',
    color: '#F59E0B',
    tag: 'HARDENED',
  },
]

export function SecurityBadgeSection() {
  return (
    <section style={{ background: NAVY, padding: '64px 16px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            borderRadius: 20,
            overflow: 'hidden',
            background: CARD,
            border: `1px solid ${BORDER}`,
            boxShadow: '0 32px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(34,197,94,0.06)',
          }}
        >
          {/* Header strip */}
          <div style={{
            padding: '18px 28px',
            borderBottom: `1px solid ${BORDER}`,
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              background: 'rgba(34,197,94,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ShieldCheck size={18} color="#22C55E" />
            </div>

            <div style={{ flex: 1 }}>
              <p style={{ color: '#FFFFFF', fontWeight: 700, fontSize: 15, margin: 0 }}>
                Seguridad de Grado Médico
              </p>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: 0 }}>
                Datos de pacientes cifrados en tránsito y en reposo · Arquitectura hardened para Vercel
              </p>
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
              padding: '5px 12px', borderRadius: 99,
              background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E' }} />
              <span style={{ fontSize: 10, fontWeight: 800, color: '#22C55E', letterSpacing: '0.07em' }}>
                VERIFICADO
              </span>
            </div>
          </div>

          {/* 2×2 badges grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            {BADGES.map((badge, i) => {
              const isRightCol   = i % 2 === 0
              const isBottomRow  = i >= 2
              return (
                <div
                  key={badge.title}
                  style={{
                    padding: '22px 26px',
                    display: 'flex', flexDirection: 'column', gap: 10,
                    borderRight:  isRightCol  ? `1px solid ${BORDER}` : 'none',
                    borderBottom: !isBottomRow ? `1px solid ${BORDER}` : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                      background: `${badge.color}18`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <badge.Icon size={16} color={badge.color} />
                    </div>
                    <span style={{
                      fontSize: 9, fontWeight: 800, letterSpacing: '0.08em',
                      padding: '2px 7px', borderRadius: 4,
                      background: `${badge.color}18`, color: badge.color,
                    }}>
                      {badge.tag}
                    </span>
                  </div>
                  <div>
                    <p style={{ color: '#FFFFFF', fontWeight: 600, fontSize: 13, margin: '0 0 4px' }}>
                      {badge.title}
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, lineHeight: 1.55, margin: 0 }}>
                      {badge.desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
