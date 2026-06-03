'use client'

import { Mail, Hash, Phone } from 'lucide-react'

const N = '#0A1628'

const CARD: React.CSSProperties = { background: '#fff', border: '1.5px solid #E5E7EB', borderRadius: 14, padding: 20 }

const INTEGRATIONS = [
  { name: 'Gmail',    icon: <Mail  size={20} color="#EA4335" />, iconBg: 'rgba(234,67,53,0.1)',    desc: 'Sync emails and track communications directly from your Gmail inbox.' },
  { name: 'Outlook',  icon: <Mail  size={20} color="#0078D4" />, iconBg: 'rgba(0,120,212,0.1)',    desc: 'Connect Microsoft Outlook to centralise all agency correspondence.' },
  { name: 'Slack',    icon: <Hash  size={20} color="#4A154B" />, iconBg: 'rgba(74,21,75,0.1)',     desc: 'Get real-time notifications and team updates straight in Slack.' },
  { name: 'WhatsApp', icon: <Phone size={20} color="#25D366" />, iconBg: 'rgba(37,211,102,0.1)',   desc: 'Log WhatsApp conversations with clubs and players automatically.' },
]

export default function IntegrationsPage() {
  return (
    <div style={{ padding: 'clamp(16px,4vw,28px) clamp(16px,4vw,32px)', fontFamily: 'var(--font-montserrat)', color: N, minHeight: '100vh', background: '#F8FAFF' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: N, margin: 0, fontFamily: 'var(--font-montserrat)' }}>Integrations</h1>
        <p style={{ fontSize: 13, color: '#6B7280', margin: '4px 0 0', fontFamily: 'var(--font-montserrat)' }}>
          Connect external services to streamline your workflow
        </p>
      </div>

      <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 20, fontFamily: 'var(--font-montserrat)' }}>
        Integrations are coming soon. Connect your tools to automate your agency workflows.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        {INTEGRATIONS.map(int => (
          <div key={int.name} style={{ ...CARD, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: int.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {int.icon}
              </div>
              <span style={{ fontSize: 15, fontWeight: 700, color: N, fontFamily: 'var(--font-montserrat)' }}>{int.name}</span>
            </div>
            <p style={{ fontSize: 12, color: '#6B7280', margin: 0, lineHeight: 1.5, fontFamily: 'var(--font-montserrat)' }}>{int.desc}</p>
            <div style={{ position: 'relative', alignSelf: 'flex-start' }}>
              <button disabled style={{ padding: '8px 16px', borderRadius: 8, border: '1.5px solid #E5E7EB', background: '#F9FAFB', color: '#9CA3AF', fontSize: 12, fontWeight: 600, cursor: 'not-allowed', fontFamily: 'var(--font-montserrat)', display: 'flex', alignItems: 'center', gap: 6 }}>
                Connect {int.name}
              </button>
              <span style={{ position: 'absolute', top: -8, right: -8, background: '#F59E0B', color: '#fff', fontSize: 9, fontWeight: 800, padding: '2px 6px', borderRadius: 999, letterSpacing: '0.04em', fontFamily: 'var(--font-montserrat)' }}>
                SOON
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
