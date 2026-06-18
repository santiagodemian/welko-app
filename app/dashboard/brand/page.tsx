'use client'

import { useState, useEffect } from 'react'
import { Palette, Save, Loader2, Lock, Check } from 'lucide-react'
import Link from 'next/link'

const N = '#0A0A0A'
const G = '#2563EB'

interface BrandKit {
  primaryColor:   string | null
  accentColor:    string | null
  logoUrl:        string | null
  footerEmail:    string | null
  footerPhone:    string | null
  footerLocation: string | null
}

export default function BrandPage() {
  const [loading,    setLoading]    = useState(true)
  const [saving,     setSaving]     = useState(false)
  const [saved,      setSaved]      = useState(false)
  const [isPremium,  setIsPremium]  = useState(false)
  const [canEdit,    setCanEdit]    = useState(false)

  const [primaryColor,    setPrimaryColor]    = useState('#0A0A0A')
  const [accentColor,     setAccentColor]     = useState('#C9A84C')
  const [logoUrl,         setLogoUrl]         = useState('')
  const [footerEmail,     setFooterEmail]     = useState('')
  const [footerPhone,     setFooterPhone]     = useState('')
  const [footerLocation,  setFooterLocation]  = useState('')

  useEffect(() => {
    fetch('/api/dashboard/brand').then(r => r.json()).then(data => {
      const kit: BrandKit | null = data.brandKit
      if (kit) {
        if (kit.primaryColor)   setPrimaryColor(kit.primaryColor)
        if (kit.accentColor)    setAccentColor(kit.accentColor)
        if (kit.logoUrl)        setLogoUrl(kit.logoUrl)
        if (kit.footerEmail)    setFooterEmail(kit.footerEmail)
        if (kit.footerPhone)    setFooterPhone(kit.footerPhone)
        if (kit.footerLocation) setFooterLocation(kit.footerLocation)
      }
      setIsPremium(data.isPremium ?? false)
      setCanEdit(data.canEdit ?? false)
    }).finally(() => setLoading(false))
  }, [])

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch('/api/dashboard/brand', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ primaryColor, accentColor, logoUrl: logoUrl || null, footerEmail: footerEmail || null, footerPhone: footerPhone || null, footerLocation: footerLocation || null }),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
        <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', color: '#9CA3AF' }} />
        <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ padding: 'clamp(20px,4vw,40px) clamp(16px,4vw,40px) 80px', fontFamily: 'var(--font-montserrat), sans-serif', maxWidth: 700 }}>
      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: `${G}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Palette size={18} color={G} />
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: N, margin: 0, letterSpacing: '-0.03em' }}>Brand Kit</h1>
      </div>
      <p style={{ color: '#9CA3AF', margin: '0 0 28px', fontSize: 14 }}>
        Customise your agency&apos;s white-label appearance on proposals and PDFs.
      </p>

      {/* Upgrade banner for non-premium */}
      {!isPremium && (
        <div style={{ background: 'rgba(37,99,235,0.05)', border: `1px solid ${G}30`, borderRadius: 14, padding: '14px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
          <Lock size={16} color={G} style={{ flexShrink: 0 }} />
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: G, margin: '0 0 2px' }}>Premium Feature</p>
            <p style={{ fontSize: 12, color: '#374151', margin: 0 }}>Brand Kit is included in Polaris Premium. Upgrade to apply your branding to all proposals.</p>
          </div>
          <Link href="/precios" style={{ background: N, color: 'white', padding: '8px 16px', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: 13, flexShrink: 0, marginLeft: 'auto' }}>
            Upgrade
          </Link>
        </div>
      )}

      {/* Form */}
      <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 16, padding: 28, ...(!canEdit ? { opacity: 0.65, pointerEvents: 'none' } : {}) }}>

        {/* Colors */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 8 }}>Primary Color</label>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)}
                style={{ width: 44, height: 44, border: '1px solid #E5E7EB', borderRadius: 10, cursor: 'pointer', padding: 2 }} />
              <input value={primaryColor} onChange={e => setPrimaryColor(e.target.value)}
                style={{ flex: 1, padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 10, fontSize: 14, fontFamily: 'inherit', outline: 'none', color: N }} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 8 }}>Accent Color</label>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <input type="color" value={accentColor} onChange={e => setAccentColor(e.target.value)}
                style={{ width: 44, height: 44, border: '1px solid #E5E7EB', borderRadius: 10, cursor: 'pointer', padding: 2 }} />
              <input value={accentColor} onChange={e => setAccentColor(e.target.value)}
                style={{ flex: 1, padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 10, fontSize: 14, fontFamily: 'inherit', outline: 'none', color: N }} />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div style={{ marginBottom: 24, padding: '14px 18px', borderRadius: 12, background: '#F9FAFB', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: primaryColor }} />
          <div style={{ width: 32, height: 32, borderRadius: 8, background: accentColor }} />
          <span style={{ fontSize: 12, color: '#9CA3AF', marginLeft: 4 }}>Color preview</span>
          <div style={{ marginLeft: 'auto', padding: '6px 14px', borderRadius: 8, background: primaryColor, color: 'white', fontSize: 12, fontWeight: 700 }}>Button</div>
          <div style={{ padding: '6px 14px', borderRadius: 8, background: accentColor, color: primaryColor, fontSize: 12, fontWeight: 700 }}>Accent</div>
        </div>

        {/* Logo URL */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 8 }}>Agency Logo URL</label>
          <input
            value={logoUrl}
            onChange={e => setLogoUrl(e.target.value)}
            placeholder="https://yoursite.com/logo.png"
            style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 10, fontSize: 14, boxSizing: 'border-box', fontFamily: 'inherit', outline: 'none', color: N }}
          />
          {logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="Logo preview" style={{ marginTop: 10, maxHeight: 48, maxWidth: 200, objectFit: 'contain', borderRadius: 6, border: '1px solid #E5E7EB', padding: 4 }}
              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
          )}
        </div>

        {/* Footer contact info */}
        <p style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 12px' }}>Proposal Footer</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Email', value: footerEmail, set: setFooterEmail, placeholder: 'agency@example.com' },
            { label: 'Phone', value: footerPhone, set: setFooterPhone, placeholder: '+34 600 000 000' },
            { label: 'Location', value: footerLocation, set: setFooterLocation, placeholder: 'Madrid, Spain' },
          ].map(({ label, value, set, placeholder }) => (
            <div key={label}>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', display: 'block', marginBottom: 6 }}>{label}</label>
              <input value={value} onChange={e => set(e.target.value)} placeholder={placeholder}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, boxSizing: 'border-box', fontFamily: 'inherit', outline: 'none', color: N }} />
            </div>
          ))}
        </div>

        <button
          onClick={handleSave}
          disabled={saving || !canEdit}
          style={{ display: 'flex', alignItems: 'center', gap: 8, background: N, color: 'white', border: 'none', borderRadius: 10, padding: '12px 24px', fontWeight: 700, fontSize: 14, cursor: saving ? 'wait' : 'pointer', fontFamily: 'inherit', opacity: saving ? 0.7 : 1 }}
        >
          {saving ? (
            <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Saving…</>
          ) : saved ? (
            <><Check size={15} /> Saved!</>
          ) : (
            <><Save size={15} /> Save Brand Kit</>
          )}
        </button>
      </div>
    </div>
  )
}
