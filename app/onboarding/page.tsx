'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Loader2 } from 'lucide-react'

const N = '#0A1628'
const G = '#1E6FEB'

export default function OnboardingPage() {
  const router = useRouter()

  const [agencyName, setAgencyName] = useState('')
  const [country, setCountry]       = useState('')
  const [website, setWebsite]       = useState('')
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!agencyName.trim()) { setError('Agency name is required.'); return }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/onboarding', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ agencyName, country, website }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Something went wrong.'); return }
      router.push('/dashboard')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: N, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: 'var(--font-montserrat), sans-serif' }}>
      <div style={{ width: '100%', maxWidth: 480 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <span style={{ fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: '-0.03em' }}>
            Polaris Football
          </span>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', margin: '20px 0 8px', letterSpacing: '-0.02em' }}>
            Set up your agency
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.6 }}>
            Tell us about your football agency so we can personalize your workspace.
          </p>
        </div>

        {/* Form card */}
        <form
          onSubmit={handleSubmit}
          style={{ background: 'white', borderRadius: 20, padding: '36px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}
        >
          {/* Agency name */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
              Agency name *
            </label>
            <input
              type="text"
              value={agencyName}
              onChange={e => setAgencyName(e.target.value)}
              placeholder="e.g. Premier Sports Agency"
              required
              style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid #E5E7EB', fontSize: 14, outline: 'none', boxSizing: 'border-box', color: '#111' }}
              onFocus={e => (e.currentTarget.style.borderColor = G)}
              onBlur={e => (e.currentTarget.style.borderColor = '#E5E7EB')}
            />
          </div>

          {/* Country */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
              Country
            </label>
            <input
              type="text"
              value={country}
              onChange={e => setCountry(e.target.value)}
              placeholder="e.g. Spain"
              style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid #E5E7EB', fontSize: 14, outline: 'none', boxSizing: 'border-box', color: '#111' }}
              onFocus={e => (e.currentTarget.style.borderColor = G)}
              onBlur={e => (e.currentTarget.style.borderColor = '#E5E7EB')}
            />
          </div>

          {/* Website */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
              Website <span style={{ textTransform: 'none', fontWeight: 400, color: '#9CA3AF' }}>(optional)</span>
            </label>
            <input
              type="url"
              value={website}
              onChange={e => setWebsite(e.target.value)}
              placeholder="https://youragency.com"
              style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid #E5E7EB', fontSize: 14, outline: 'none', boxSizing: 'border-box', color: '#111' }}
              onFocus={e => (e.currentTarget.style.borderColor = G)}
              onBlur={e => (e.currentTarget.style.borderColor = '#E5E7EB')}
            />
          </div>

          {error && (
            <p style={{ fontSize: 13, color: '#EF4444', margin: 0, padding: '10px 14px', background: 'rgba(239,68,68,0.06)', borderRadius: 8, border: '1px solid rgba(239,68,68,0.15)' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !agencyName.trim()}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              background: N, color: 'white', border: 'none', borderRadius: 12,
              padding: '14px', fontSize: 15, fontWeight: 800, cursor: loading || !agencyName.trim() ? 'not-allowed' : 'pointer',
              opacity: loading || !agencyName.trim() ? 0.6 : 1, marginTop: 4,
            }}
          >
            {loading
              ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Setting up…</>
              : <>Continue to Dashboard <ArrowRight size={16} /></>}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 24 }}>
          You can update these details anytime in Settings.
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
