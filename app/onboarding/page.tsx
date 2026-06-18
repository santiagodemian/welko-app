'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Loader2, Check, Users, GitBranch, Brain } from 'lucide-react'

const N = '#0A0A0A'
const G = '#2563EB'

const STEPS = [
  {
    n: 1, label: 'Agency Setup',
    icon: Users,
    headline: 'Set up your agency',
    sub: 'Tell us who you are. We\'ll use this to personalise your workspace and proposals.',
  },
  {
    n: 2, label: 'First Player',
    icon: GitBranch,
    headline: 'Add your first player',
    sub: 'Add a player you represent so your pipeline, reports and proposals are ready from day one.',
  },
  {
    n: 3, label: 'First Action',
    icon: Brain,
    headline: 'What would you like to do first?',
    sub: 'Choose your starting point. You can always change direction inside your dashboard.',
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)

  // Step 1 state
  const [agencyName, setAgencyName] = useState('')
  const [country,    setCountry]    = useState('')
  const [website,    setWebsite]    = useState('')

  // Step 2 state
  const [playerName,  setPlayerName]  = useState('')
  const [position,    setPosition]    = useState('')
  const [club,        setClub]        = useState('')
  const [skipPlayer,  setSkipPlayer]  = useState(false)

  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  async function handleStep1(e: React.FormEvent) {
    e.preventDefault()
    if (!agencyName.trim()) { setError('Agency name is required.'); return }
    setError('')
    setStep(2)
  }

  async function handleStep2(e: React.FormEvent) {
    e.preventDefault()
    if (!skipPlayer && !playerName.trim()) { setError('Add a player name or skip this step.'); return }
    setError('')
    setStep(3)
  }

  async function handleFinish(firstAction: string) {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/onboarding', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          agencyName,
          country,
          website,
          firstPlayer: !skipPlayer && playerName.trim() ? { fullName: playerName, position, currentClub: club } : undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Something went wrong.'); setLoading(false); return }

      // Route to the right first action
      if (firstAction === 'pipeline') router.push('/dashboard/pipeline')
      else if (firstAction === 'mandates') router.push('/dashboard/mandates')
      else router.push('/dashboard')
    } catch {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  const currentStep = STEPS[step - 1]
  const StepIcon = currentStep.icon

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px', borderRadius: 10,
    border: '1.5px solid #E5E7EB', fontSize: 14, outline: 'none',
    boxSizing: 'border-box', color: N, fontFamily: 'inherit',
    transition: 'border-color 0.12s',
  }
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 11, fontWeight: 700, color: '#6B7280',
    textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 7,
  }

  return (
    <div style={{
      minHeight: '100vh', background: N,
      display: 'flex', fontFamily: 'var(--font-montserrat), sans-serif',
    }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        .ob-input:focus { border-color: ${G} !important; }
        .ob-action:hover { border-color: ${G} !important; background: #EFF6FF !important; }
        .ob-action { transition: border-color 0.12s, background 0.12s; }
      `}</style>

      {/* Left brand panel */}
      <div style={{
        width: '40%', minWidth: 320, background: '#050505',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: 'clamp(32px,4vw,60px)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/diseño8.jpeg" alt="" aria-hidden="true" style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', opacity: 0.06,
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/polariswhitelogo.jpeg" alt="Polaris" style={{ height: 24, objectFit: 'contain', marginBottom: 48, filter: 'brightness(0) invert(1)', opacity: 0.6 }} />

          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 16px' }}>Getting started</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {STEPS.map(s => {
              const done    = s.n < step
              const current = s.n === step
              const S = s.icon
              return (
                <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderRadius: 10, background: current ? 'rgba(255,255,255,0.06)' : 'transparent' }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    background: done ? G : current ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: `1px solid ${done ? G : current ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)'}`,
                  }}>
                    {done
                      ? <Check size={12} color="white" strokeWidth={3} />
                      : <S size={12} color={current ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.25)'} />}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: current ? 700 : 400, color: current ? '#fff' : done ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.25)' }}>
                    {s.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <p style={{ position: 'relative', zIndex: 1, fontSize: 11, color: 'rgba(255,255,255,0.15)', margin: 0 }}>
          Polaris Football · Representation Network
        </p>
      </div>

      {/* Right form panel */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(32px,5vw,60px)', background: '#F9FAFB',
      }}>
        <div style={{ width: '100%', maxWidth: 480 }}>

          {/* Step indicator */}
          <p style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <StepIcon size={13} color={G} />
            Step {step} of 3
          </p>

          <h1 style={{
            fontSize: 'clamp(22px,3vw,28px)', fontWeight: 800, color: N,
            letterSpacing: '-0.03em', margin: '0 0 8px',
            fontFamily: 'var(--font-space-grotesk), sans-serif',
          }}>
            {currentStep.headline}
          </h1>
          <p style={{ fontSize: 14, color: '#9CA3AF', margin: '0 0 32px', lineHeight: 1.6 }}>
            {currentStep.sub}
          </p>

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <form onSubmit={handleStep1} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label style={labelStyle}>Agency name *</label>
                <input
                  className="ob-input" type="text" value={agencyName}
                  onChange={e => setAgencyName(e.target.value)}
                  placeholder="e.g. Premier Sports Agency"
                  required style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Country</label>
                <input
                  className="ob-input" type="text" value={country}
                  onChange={e => setCountry(e.target.value)}
                  placeholder="e.g. Spain" style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Website <span style={{ textTransform: 'none', fontWeight: 400 }}>(optional)</span></label>
                <input
                  className="ob-input" type="url" value={website}
                  onChange={e => setWebsite(e.target.value)}
                  placeholder="https://youragency.com" style={inputStyle}
                />
              </div>
              {error && <p style={{ fontSize: 13, color: '#EF4444', margin: 0 }}>{error}</p>}
              <button type="submit" disabled={!agencyName.trim()} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                background: N, color: 'white', border: 'none', borderRadius: 10,
                padding: '13px', fontSize: 14, fontWeight: 800, cursor: !agencyName.trim() ? 'not-allowed' : 'pointer',
                opacity: !agencyName.trim() ? 0.5 : 1, fontFamily: 'inherit',
              }}>
                Continue <ArrowRight size={15} />
              </button>
            </form>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <form onSubmit={handleStep2} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label style={labelStyle}>Player full name *</label>
                <input
                  className="ob-input" type="text" value={playerName}
                  onChange={e => setPlayerName(e.target.value)}
                  placeholder="e.g. Carlos Mendez" disabled={skipPlayer}
                  style={{ ...inputStyle, opacity: skipPlayer ? 0.5 : 1 }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={labelStyle}>Position</label>
                  <select
                    className="ob-input" value={position}
                    onChange={e => setPosition(e.target.value)}
                    disabled={skipPlayer}
                    style={{ ...inputStyle, opacity: skipPlayer ? 0.5 : 1, cursor: 'pointer' }}
                  >
                    <option value="">— Select —</option>
                    {['GK','CB','RB','LB','CDM','CM','CAM','RW','LW','ST'].map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Current club</label>
                  <input
                    className="ob-input" type="text" value={club}
                    onChange={e => setClub(e.target.value)}
                    placeholder="e.g. FK Sarajevo" disabled={skipPlayer}
                    style={{ ...inputStyle, opacity: skipPlayer ? 0.5 : 1 }}
                  />
                </div>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13, color: '#6B7280' }}>
                <input type="checkbox" checked={skipPlayer} onChange={e => setSkipPlayer(e.target.checked)} />
                Skip this step — I'll add players from the dashboard
              </label>

              {error && <p style={{ fontSize: 13, color: '#EF4444', margin: 0 }}>{error}</p>}
              <button type="submit" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                background: N, color: 'white', border: 'none', borderRadius: 10,
                padding: '13px', fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit',
              }}>
                Continue <ArrowRight size={15} />
              </button>
              <button type="button" onClick={() => setStep(1)} style={{
                background: 'none', border: 'none', fontSize: 13, color: '#9CA3AF',
                cursor: 'pointer', fontFamily: 'inherit',
              }}>
                ← Back
              </button>
            </form>
          )}

          {/* ── STEP 3 ── */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                {
                  action: 'dashboard',
                  headline: 'Go to my dashboard',
                  sub: 'See your overview and get oriented in the workspace.',
                  icon: Users,
                },
                {
                  action: 'pipeline',
                  headline: 'Open the Transfer Pipeline',
                  sub: 'Start tracking active negotiations immediately.',
                  icon: GitBranch,
                },
                {
                  action: 'mandates',
                  headline: 'Run AI Mandate Matching',
                  sub: 'Paste a club request and find matching players instantly.',
                  icon: Brain,
                },
              ].map(({ action, headline, sub, icon: Icon }) => (
                <button
                  key={action}
                  className="ob-action"
                  onClick={() => handleFinish(action)}
                  disabled={loading}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 16,
                    padding: '16px 20px', borderRadius: 12,
                    background: 'white', border: '1.5px solid #E5E7EB',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    textAlign: 'left', fontFamily: 'inherit',
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={16} color={G} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: N, margin: '0 0 2px' }}>{headline}</p>
                    <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>{sub}</p>
                  </div>
                  {loading
                    ? <Loader2 size={15} color="#9CA3AF" style={{ animation: 'spin 1s linear infinite', flexShrink: 0 }} />
                    : <ArrowRight size={15} color="#D1D5DB" style={{ flexShrink: 0 }} />}
                </button>
              ))}

              {error && <p style={{ fontSize: 13, color: '#EF4444', margin: 0 }}>{error}</p>}

              <button type="button" onClick={() => setStep(2)} style={{
                background: 'none', border: 'none', fontSize: 13, color: '#9CA3AF',
                cursor: 'pointer', fontFamily: 'inherit', marginTop: 4,
              }}>
                ← Back
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
