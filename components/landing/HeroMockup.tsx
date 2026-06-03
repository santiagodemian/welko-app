'use client'

import { useState, useEffect } from 'react'

const N = '#0A1628'
const G = '#1E6FEB'

// Simulated chart data points (normalized 0–100)
const CHART_POINTS = [18, 22, 19, 35, 30, 45, 42, 60, 58, 72, 68, 88, 85, 100]

function MiniChart() {
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 400)
    return () => clearTimeout(t)
  }, [])

  const w = 200
  const h = 90
  const pad = 8
  const pts = CHART_POINTS
  const xs  = pts.map((_, i) => pad + (i / (pts.length - 1)) * (w - pad * 2))
  const ys  = pts.map(v => h - pad - (v / 100) * (h - pad * 2))

  const pathD   = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(' ')
  const areaD   = `${pathD} L${xs[xs.length - 1].toFixed(1)},${h} L${xs[0].toFixed(1)},${h} Z`

  return (
    <div style={{ position: 'relative' }}>
      <svg width={w} height={h} style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <linearGradient id="heroChartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={G} stopOpacity={animated ? 0.25 : 0} style={{ transition: 'stop-opacity 0.8s ease' }} />
            <stop offset="100%" stopColor={G} stopOpacity={0} />
          </linearGradient>
          <clipPath id="chartClip">
            <rect x={0} y={0} width={animated ? w : 0} height={h} style={{ transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)' }} />
          </clipPath>
        </defs>
        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((f, i) => (
          <line key={i} x1={pad} y1={pad + f * (h - pad * 2)} x2={w - pad} y2={pad + f * (h - pad * 2)}
            stroke="#E5E7EB" strokeWidth={0.5} />
        ))}
        {/* Area fill */}
        <path d={areaD} fill="url(#heroChartGrad)" clipPath="url(#chartClip)" />
        {/* Line */}
        <path d={pathD} fill="none" stroke={G} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
          clipPath="url(#chartClip)" />
        {/* Last dot */}
        <circle
          cx={xs[xs.length - 1]} cy={ys[ys.length - 1]} r={3}
          fill={G} stroke="#fff" strokeWidth={1.5}
          style={{ opacity: animated ? 1 : 0, transition: 'opacity 0.3s ease 1.1s' }}
        />
      </svg>
      {/* X-axis labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, paddingLeft: pad, paddingRight: pad }}>
        {['Jan', 'Mar', 'May', 'Aug', 'Oct', 'Dec'].map(m => (
          <span key={m} style={{ fontSize: 7, color: '#9CA3AF', fontWeight: 500 }}>{m}</span>
        ))}
      </div>
    </div>
  )
}

export function HeroMockup() {
  return (
    <>
      <style>{`
        @media (max-width: 640px) {
          .hero-mockup-wrap {
            transform: scale(0.43);
            transform-origin: top center;
            margin-bottom: -200px !important;
          }
        }
        @media (max-width: 380px) {
          .hero-mockup-wrap {
            transform: scale(0.36);
            margin-bottom: -225px !important;
          }
        }
      `}</style>
    <div className="hero-mockup-wrap" style={{ maxWidth: 840, margin: '48px auto 0', position: 'relative', paddingBottom: 20 }}>

      {/* ── Laptop outer shell ── */}
      <div style={{
        background: 'linear-gradient(180deg, #D1D5DB 0%, #9CA3AF 100%)',
        borderRadius: '14px 14px 0 0',
        padding: '10px 10px 0',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.15)',
      }}>
        {/* Camera dot */}
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#9CA3AF', border: '1px solid #6B7280', margin: '0 auto 6px' }} />

        {/* Screen */}
        <div style={{ background: '#fff', borderRadius: '7px 7px 0 0', overflow: 'hidden' }}>

          {/* ── Chrome top bar ── */}
          <div style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', padding: '8px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* URL bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ display: 'flex', gap: 4 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#EF4444' }} />
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#F59E0B' }} />
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22C55E' }} />
              </div>
              <div style={{ background: '#E5E7EB', borderRadius: 4, padding: '2px 10px', fontSize: 8, color: '#6B7280', fontWeight: 500 }}>
                app.welko.agency/dashboard
              </div>
            </div>
            {/* App brand */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 10, fontWeight: 800, color: N, letterSpacing: '-0.02em' }}>
                Welko <span style={{ color: G }}>AgentOS</span>
              </span>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: N, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 8, fontWeight: 900, color: G }}>CA</span>
              </div>
            </div>
          </div>

          {/* ── Dashboard layout ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', minHeight: 260 }}>

            {/* Mini sidebar */}
            <div style={{ background: '#fff', borderRight: '1px solid #E5E7EB', padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Agency header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 6px 10px', borderBottom: '1px solid #F3F4F6', marginBottom: 4 }}>
                <div style={{ width: 20, height: 20, borderRadius: 5, background: N, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 7, fontWeight: 900, color: G }}>EA</span>
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 8, fontWeight: 800, color: N, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Elite Agency</p>
                  <p style={{ fontSize: 6, color: '#9CA3AF', margin: 0 }}>Premium</p>
                </div>
              </div>
              {[
                { label: 'Overview',   active: true  },
                { label: 'Players',    active: false },
                { label: 'Pipeline',   active: false },
                { label: 'Mandates',   active: false },
                { label: 'Proposals',  active: false },
              ].map(item => (
                <div key={item.label} style={{
                  padding: '5px 8px', borderRadius: 6, fontSize: 8, fontWeight: item.active ? 700 : 500,
                  background: item.active ? 'rgba(30,111,235,0.08)' : 'transparent',
                  color: item.active ? G : '#9CA3AF',
                }}>
                  {item.label}
                </div>
              ))}
            </div>

            {/* Main content */}
            <div style={{ padding: '14px', background: '#FAFAFA', display: 'flex', flexDirection: 'column', gap: 10 }}>

              {/* Greeting */}
              <p style={{ fontSize: 11, fontWeight: 800, color: N, margin: 0, letterSpacing: '-0.02em' }}>Good morning, Carlos 👋</p>

              {/* Stats row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {[
                  { label: 'Players',      value: '48', color: N        },
                  { label: 'Open Mandates', value: '12', color: '#7C3AED' },
                  { label: 'Negotiations', value: '7',  color: '#059669' },
                ].map(s => (
                  <div key={s.label} style={{ background: '#fff', borderRadius: 8, padding: '8px 10px', border: '1px solid #E5E7EB' }}>
                    <p style={{ fontSize: 18, fontWeight: 900, color: s.color, margin: 0, letterSpacing: '-0.03em' }}>{s.value}</p>
                    <p style={{ fontSize: 7, color: '#9CA3AF', margin: 0, fontWeight: 500 }}>{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Bottom split: Match Card + Chart */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, flex: 1 }}>

                {/* Player Match Card */}
                <div style={{ background: '#fff', borderRadius: 8, padding: '10px 12px', border: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 7, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#9CA3AF' }}>AI Match</span>
                    <span style={{ fontSize: 8, fontWeight: 800, background: G, color: '#fff', padding: '1px 6px', borderRadius: 4 }}>95% MATCH</span>
                  </div>
                  {/* Player avatar row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: N, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: 9, fontWeight: 900, color: G }}>LV</span>
                    </div>
                    <div>
                      <p style={{ fontSize: 9, fontWeight: 800, color: N, margin: 0 }}>Luc Villeneuve</p>
                      <div style={{ display: 'flex', gap: 4, marginTop: 2 }}>
                        <span style={{ fontSize: 7, background: '#F3F4F6', color: '#374151', padding: '1px 5px', borderRadius: 3, fontWeight: 600 }}>CENTER BACK</span>
                        <span style={{ fontSize: 7, background: 'rgba(30,111,235,0.08)', color: G, padding: '1px 5px', borderRadius: 3, fontWeight: 700 }}>ELO 75</span>
                      </div>
                    </div>
                  </div>
                  {/* Match score bar */}
                  <div>
                    <div style={{ height: 4, background: '#E5E7EB', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ width: '95%', height: '100%', background: `linear-gradient(90deg, ${G}, #3B82F6)`, borderRadius: 2 }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
                      <span style={{ fontSize: 6, color: '#9CA3AF' }}>Position · Budget · Age · Foot</span>
                      <span style={{ fontSize: 7, fontWeight: 700, color: G }}>95/100</span>
                    </div>
                  </div>
                  {/* Reasons */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {['✓ CB matches mandate', '✓ Under budget', '✓ Age 24 (≤26)'].map((r, i) => (
                      <span key={i} style={{ fontSize: 7, color: '#6B7280' }}>{r}</span>
                    ))}
                  </div>
                </div>

                {/* Growth chart */}
                <div style={{ background: '#fff', borderRadius: 8, padding: '10px 12px', border: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 7, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#9CA3AF' }}>Agency Growth</span>
                    <span style={{ fontSize: 7, background: 'rgba(5,150,105,0.1)', color: '#059669', fontWeight: 700, padding: '1px 5px', borderRadius: 3 }}>↑ 42%</span>
                  </div>
                  <MiniChart />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontSize: 8, fontWeight: 900, color: N, margin: 0 }}>€4,680</p>
                      <p style={{ fontSize: 6, color: '#9CA3AF', margin: 0 }}>Pipeline value</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: 8, fontWeight: 900, color: '#059669', margin: 0 }}>+€920</p>
                      <p style={{ fontSize: 6, color: '#9CA3AF', margin: 0 }}>this month</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Laptop hinge + base */}
      <div style={{ background: 'linear-gradient(180deg, #9CA3AF 0%, #6B7280 100%)', height: 12, borderRadius: '0 0 3px 3px', boxShadow: '0 4px 16px rgba(0,0,0,0.25)' }}>
        <div style={{ width: 50, height: 3, borderRadius: '0 0 3px 3px', background: 'rgba(0,0,0,0.2)', margin: '0 auto' }} />
      </div>
      <div style={{ background: 'linear-gradient(180deg, #6B7280 0%, #4B5563 100%)', height: 6, borderRadius: '0 0 8px 8px', width: '75%', margin: '0 auto', boxShadow: '0 8px 24px rgba(0,0,0,0.35)' }} />
    </div>
    </>
  )
}
