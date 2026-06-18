'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Settings2, Users, Palette, CreditCard, Loader2 } from 'lucide-react'

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

const TeamContent    = dynamic(() => import('../team/page'),    { ssr: false, loading: TabLoader })
const BrandContent   = dynamic(() => import('../brand/page'),   { ssr: false, loading: TabLoader })
const BillingContent = dynamic(() => import('../billing/page'), { ssr: false, loading: TabLoader })

type Tab = 'general' | 'team' | 'brand' | 'billing'

const TABS: { id: Tab; label: string; icon: React.ComponentType<{ size: number; color?: string }> }[] = [
  { id: 'general', label: 'General', icon: Settings2 },
  { id: 'team',    label: 'Team',    icon: Users },
  { id: 'brand',   label: 'Brand',   icon: Palette },
  { id: 'billing', label: 'Billing', icon: CreditCard },
]

const COUNTRIES = [
  { value: 'ES', label: 'Spain'          },
  { value: 'PT', label: 'Portugal'       },
  { value: 'BR', label: 'Brazil'         },
  { value: 'AR', label: 'Argentina'      },
  { value: 'DE', label: 'Germany'        },
  { value: 'FR', label: 'France'         },
  { value: 'IT', label: 'Italy'          },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'NL', label: 'Netherlands'    },
  { value: 'BE', label: 'Belgium'        },
  { value: 'TR', label: 'Turkey'         },
  { value: 'US', label: 'United States'  },
  { value: 'MX', label: 'Mexico'         },
  { value: 'CO', label: 'Colombia'       },
  { value: 'HR', label: 'Croatia'        },
  { value: 'RS', label: 'Serbia'         },
  { value: 'UA', label: 'Ukraine'        },
  { value: 'PL', label: 'Poland'         },
  { value: 'NG', label: 'Nigeria'        },
  { value: 'MA', label: 'Morocco'        },
  { value: 'OTHER', label: 'Other'       },
]

import { useEffect } from 'react'
import { Check } from 'lucide-react'

function GeneralTab() {
  const [name,     setName]     = useState('')
  const [country,  setCountry]  = useState('ES')
  const [website,  setWebsite]  = useState('')
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(false)
  const [error,    setError]    = useState('')
  const [readOnly, setReadOnly] = useState(false)

  useEffect(() => {
    fetch('/api/dashboard/settings')
      .then(r => r.json())
      .then(d => {
        if (d.agency) {
          setName(d.agency.name      ?? '')
          setCountry(d.agency.country ?? 'ES')
          setWebsite(d.agency.website ?? '')
        }
        if (d.error === 'Only agency owners can change settings') setReadOnly(true)
      })
      .finally(() => setLoading(false))
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) { setError('Agency name is required.'); return }
    setSaving(true); setError(''); setSaved(false)
    try {
      const res = await fetch('/api/dashboard/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, country, website }),
      })
      const d = await res.json()
      if (!res.ok) { setError(d.error ?? 'Failed to save.'); return }
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally { setSaving(false) }
  }

  const fieldStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB',
    borderRadius: 10, fontSize: 14, fontFamily: 'inherit',
    outline: 'none', boxSizing: 'border-box', color: N,
    background: readOnly ? '#F9FAFB' : 'white',
  }
  const labelStyle: React.CSSProperties = {
    fontSize: 11, fontWeight: 700, color: '#6B7280',
    textTransform: 'uppercase', letterSpacing: '0.05em',
    display: 'block', marginBottom: 7,
  }

  return (
    <div style={{ padding: 'clamp(20px,4vw,40px) clamp(16px,4vw,40px) 80px', maxWidth: 600 }}>
      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
      <p style={{ color: '#9CA3AF', margin: '0 0 24px', fontSize: 14 }}>
        {readOnly
          ? 'Contact your agency owner to change these settings.'
          : 'Basic agency configuration visible across your workspace.'}
      </p>
      {loading ? (
        <div style={{ padding: 48, textAlign: 'center', color: '#9CA3AF' }}>
          <Loader2 size={20} style={{ animation: 'spin 1s linear infinite', margin: '0 auto', display: 'block' }} />
        </div>
      ) : (
        <form onSubmit={handleSave}>
          <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 16, padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
            {error && (
              <p style={{ fontSize: 13, color: '#EF4444', background: 'rgba(239,68,68,0.06)', padding: '10px 14px', borderRadius: 8, margin: 0 }}>{error}</p>
            )}
            <div>
              <label style={labelStyle}>Agency Name *</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Elite Football Agency" disabled={readOnly} style={fieldStyle} />
            </div>
            <div>
              <label style={labelStyle}>Country</label>
              <select value={country} onChange={e => setCountry(e.target.value)} disabled={readOnly} style={fieldStyle}>
                {COUNTRIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Website</label>
              <input value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://youragency.com" disabled={readOnly} style={fieldStyle} />
            </div>
            {!readOnly && (
              <button
                type="submit"
                disabled={saving}
                style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 7, background: saved ? '#059669' : N, color: 'white', border: 'none', borderRadius: 10, padding: '11px 22px', fontWeight: 800, fontSize: 14, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: saving ? 0.7 : 1, transition: 'background 0.2s' }}
              >
                {saving ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Saving…</>
                 : saved  ? <><Check size={14} /> Saved!</>
                 : 'Save Changes'}
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  )
}

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>('general')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', fontFamily: 'var(--font-montserrat), sans-serif' }}>

      {/* Header */}
      <div style={{ padding: 'clamp(16px,4vw,28px) clamp(14px,4vw,40px) 0', borderBottom: '2px solid #F3F4F6', background: 'var(--surface, white)', flexShrink: 0 }}>
        <style>{`
          .st-tabs { overflow-x: auto !important; -webkit-overflow-scrolling: touch; }
        `}</style>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: N, margin: '0 0 20px', letterSpacing: '-0.02em' }}>Settings</h1>
        <div className="st-tabs" style={{ display: 'flex', gap: 4 }}>
          {TABS.map(t => {
            const active = tab === t.id
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '12px 18px',
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
        {tab === 'general' && <GeneralTab />}
        {tab === 'team'    && <TeamContent />}
        {tab === 'brand'   && <BrandContent />}
        {tab === 'billing' && <BillingContent />}
      </div>
    </div>
  )
}
