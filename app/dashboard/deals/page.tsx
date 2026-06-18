'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { GitBranch, FileSearch, FileText, TrendingUp, Loader2 } from 'lucide-react'

const N = '#0A0A0A'
const G = '#2563EB'

function TabLoader() {
  return (
    <div style={{ padding: 64, textAlign: 'center', color: '#9CA3AF' }}>
      <Loader2 size={22} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 10px', display: 'block' }} />
      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

const PipelineContent    = dynamic(() => import('../pipeline/page'),    { ssr: false, loading: TabLoader })
const MandatesContent    = dynamic(() => import('../mandates/page'),    { ssr: false, loading: TabLoader })
const ProposalsContent   = dynamic(() => import('../proposals/page'),   { ssr: false, loading: TabLoader })
const CommissionsContent = dynamic(() => import('../commissions/page'), { ssr: false, loading: TabLoader })

type Tab = 'pipeline' | 'mandates' | 'proposals' | 'commissions'

const TABS: { id: Tab; label: string; icon: React.ComponentType<{ size: number; color?: string }> }[] = [
  { id: 'pipeline',    label: 'Pipeline',    icon: GitBranch },
  { id: 'mandates',    label: 'Mandates',    icon: FileSearch },
  { id: 'proposals',   label: 'Proposals',   icon: FileText },
  { id: 'commissions', label: 'Commissions', icon: TrendingUp },
]

export default function DealsPage() {
  const [tab, setTab] = useState<Tab>('pipeline')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', fontFamily: 'var(--font-montserrat), sans-serif' }}>

      {/* Tab bar */}
      <div style={{ borderBottom: '2px solid #F3F4F6', padding: '0 clamp(12px,3vw,40px)', background: 'var(--surface, white)', flexShrink: 0, overflowX: 'auto' }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {TABS.map(t => {
            const active = tab === t.id
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '14px 18px',
                  background: 'none', border: 'none',
                  borderBottom: active ? `2px solid ${G}` : '2px solid transparent',
                  marginBottom: -2,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: 13,
                  fontWeight: active ? 700 : 500,
                  color: active ? G : '#6B7280',
                  transition: 'color 0.15s',
                  whiteSpace: 'nowrap',
                }}
              >
                <t.icon size={15} color={active ? G : '#9CA3AF'} />
                {t.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        {tab === 'pipeline'    && <PipelineContent />}
        {tab === 'mandates'    && <MandatesContent />}
        {tab === 'proposals'   && <ProposalsContent />}
        {tab === 'commissions' && <CommissionsContent />}
      </div>
    </div>
  )
}
