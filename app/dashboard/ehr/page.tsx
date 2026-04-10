'use client'

import { useUser } from '@clerk/nextjs'
import { EHRConfig } from '@/components/dashboard/EHRConfig'
import { Stethoscope, Zap } from 'lucide-react'
import Link from 'next/link'

const TEXT  = 'var(--text-primary)'
const MUTED = 'var(--text-secondary)'
const SURF  = 'var(--surface)'
const BORD  = 'var(--border)'
const NAVY  = '#13244A'
const PURPLE = '#A78BFA'

const EHR_PLANS = ['pro', 'business']

function PlanGate() {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 28px' }}>
      <div style={{ maxWidth: 460, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        <div style={{ width: 64, height: 64, borderRadius: 18, background: `${PURPLE}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Stethoscope size={28} color={PURPLE} />
        </div>
        <div>
          <p style={{ fontSize: 18, fontWeight: 700, color: TEXT, margin: '0 0 8px' }}>Integración con EHR / HIS</p>
          <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.6, margin: 0 }}>
            Conecta Welko con tu sistema de expediente electrónico. Sincroniza pacientes, citas y tratamientos en tiempo real sin duplicar capturas.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, width: '100%', textAlign: 'left' }}>
          {[
            { title: 'Sync bidireccional', desc: 'Welko ↔ tu EHR en tiempo real' },
            { title: 'Expediente completo', desc: 'Historial clínico en el CRM' },
            { title: 'Citas unificadas', desc: 'Un solo calendario para todo' },
            { title: 'HIPAA / NOM-024', desc: 'Transmisión cifrada AES-256' },
          ].map(f => (
            <div key={f.title} style={{ padding: '12px 14px', borderRadius: 10, background: SURF, border: `1px solid ${BORD}` }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: TEXT, margin: 0 }}>{f.title}</p>
              <p style={{ fontSize: 11, color: MUTED, margin: '2px 0 0' }}>{f.desc}</p>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 99, background: `${PURPLE}18`, color: PURPLE }}>
            Plan Pro o Business
          </span>
          <Link href="/precios"
            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 22px', borderRadius: 12, background: NAVY, color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
            <Zap size={14} />
            Ver planes
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function EHRPage() {
  const { user, isLoaded } = useUser()
  const plan = user?.publicMetadata?.plan as string | undefined

  if (!isLoaded) return null

  const hasAccess = plan && EHR_PLANS.includes(plan)

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '24px 28px', borderBottom: `1px solid ${BORD}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `${PURPLE}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Stethoscope size={17} color={PURPLE} />
          </div>
          <div>
            <h1 style={{ color: TEXT, fontSize: 18, fontWeight: 700, margin: 0 }}>EHR / HIS</h1>
            <p style={{ color: MUTED, fontSize: 12, margin: '2px 0 0' }}>
              Integra Welko con tu sistema de expediente electrónico de salud
            </p>
          </div>
          {hasAccess && (
            <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 99, background: `${PURPLE}18`, color: PURPLE }}>
              {plan === 'business' ? 'Business' : 'Pro'}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      {hasAccess ? (
        <div style={{ padding: '28px', flex: 1 }}>
          <EHRConfig />
        </div>
      ) : (
        <PlanGate />
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
