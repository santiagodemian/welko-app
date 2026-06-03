'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Download, Sun, Moon, Loader2,
  Mail, Phone, MapPin, Star, Zap,
  Upload, PenLine, X, Check, ChevronRight,
  ExternalLink, BarChart2, Save, CheckCircle2, Sparkles,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface PlayerData {
  id: string
  fullName: string
  position: string | null
  nationality: string | null
  age: number | null
  currentClub: string | null
  marketValue: number | null
  contractExpiry: string | null
  height: number | null
  preferredFoot: string | null
  eloRating: number | null
  notes: string | null
  // Persistent photo
  storedPhotoUrl: string | null
  // Scouting links
  transfermarktUrl: string | null
  besoccerUrl: string | null
  sofascoreUrl: string | null
  // Season stats
  seasonMatches: number
  seasonMinutes: number
  seasonGoals: number
  seasonAssists: number
}

interface BrandKit {
  primaryColor: string | null
  accentColor: string | null
  logoUrl: string | null
  footerEmail: string | null
  footerPhone: string | null
  footerLocation: string | null
}

interface ProposalPayload {
  player: PlayerData
  brandKit: BrandKit | null
  isPremium: boolean
}

interface PhysicalMetric { label: string; value: number; max: number; display: string }
interface PerfMetric     { label: string; pct: number;  display: string }

interface ProfileDraft {
  transfermarktUrl: string
  besoccerUrl: string
  sofascoreUrl: string
  seasonMatches: string
  seasonMinutes: string
  seasonGoals: string
  seasonAssists: string
}

type Tab = 'studio' | 'profile' | 'activity'

// ─── Activity types ───────────────────────────────────────────────────────────

interface Activity {
  id: string
  type: string
  description: string
  createdAt: string
  memberId: string | null
}

// ─── Default metric presets ───────────────────────────────────────────────────

const DEFAULT_PHYSICAL: PhysicalMetric[] = [
  { label: 'Top Speed',       value: 32.7, max: 40,   display: '32.7 km/h' },
  { label: 'HSR Distance',    value: 890,  max: 1500, display: '890 m'     },
  { label: 'Sprint Distance', value: 1240, max: 2000, display: '1,240 m'   },
  { label: 'No. of Sprints',  value: 38,   max: 60,   display: '38'        },
  { label: 'Total Distance',  value: 11.2, max: 14,   display: '11.2 km'   },
]

const DEFAULT_PERFORMANCE: PerfMetric[] = [
  { label: 'Def. Duels Won',     pct: 68, display: '68%'  },
  { label: 'Aerial Duels Won',   pct: 72, display: '72%'  },
  { label: 'PADJ Interceptions', pct: 82, display: '8.2'  },
  { label: 'Accurate Passes',    pct: 85, display: '85%'  },
  { label: 'Progressive Passes', pct: 89, display: '12.4' },
  { label: 'Succ. Def. Actions', pct: 91, display: '9.1'  },
]

// ─── Palette ──────────────────────────────────────────────────────────────────

const N = '#0A1628'
const G = '#1E6FEB'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function initials(name: string) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
}
function fmtDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
}
function eloLabel(elo: number) {
  if (elo >= 85) return 'Elite'
  if (elo >= 75) return 'Top'
  if (elo >= 60) return 'Good'
  return 'Dev'
}

// ─── MetricBar ────────────────────────────────────────────────────────────────

function MetricBar({ label, value, max, display, accent, animated, dark }: {
  label: string; value: number; max: number; display: string
  accent: string; animated: boolean; dark: boolean
}) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
        <span style={{ fontSize: 11, color: dark ? 'rgba(255,255,255,0.5)' : '#6B7280', letterSpacing: '0.02em' }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 800, color: dark ? 'rgba(255,255,255,0.9)' : N }}>{display}</span>
      </div>
      <div style={{ height: 5, borderRadius: 99, background: dark ? 'rgba(255,255,255,0.08)' : '#E5E7EB', overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 99,
          background: `linear-gradient(90deg, ${accent}, ${accent}CC)`,
          width: animated ? `${pct}%` : '0%',
          transition: 'width 1.1s cubic-bezier(0.4, 0, 0.2, 1)',
        }} />
      </div>
    </div>
  )
}

// ─── CircleMetric ─────────────────────────────────────────────────────────────

function CircleMetric({ label, pct, display, accent, animated, dark }: {
  label: string; pct: number; display: string
  accent: string; animated: boolean; dark: boolean
}) {
  const r = 25, circ = 2 * Math.PI * r
  const offset = animated ? circ * (1 - Math.min(pct, 100) / 100) : circ
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flex: '1 0 0', minWidth: 76 }}>
      <svg width="64" height="64" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={r} fill="none" stroke={dark ? 'rgba(255,255,255,0.1)' : '#E5E7EB'} strokeWidth="4" />
        <circle cx="32" cy="32" r={r} fill="none" stroke={accent}
          strokeWidth="4" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          transform="rotate(-90 32 32)"
          style={{ transition: 'stroke-dashoffset 1.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
        <text x="32" y="36" textAnchor="middle" fontSize="12" fontWeight="800" fill={dark ? '#FFFFFF' : N}>{display}</text>
      </svg>
      <span style={{ fontSize: 9, fontWeight: 600, lineHeight: 1.35, color: dark ? 'rgba(255,255,255,0.5)' : '#6B7280', textAlign: 'center', maxWidth: 68 }}>
        {label}
      </span>
    </div>
  )
}

// ─── PlayerAvatar ─────────────────────────────────────────────────────────────

function PlayerAvatar({ name, primary, photoUrl }: {
  name: string; primary: string; photoUrl?: string | null
}) {
  if (photoUrl) {
    return (
      <div style={{ width: 176, height: 216, borderRadius: 16, overflow: 'hidden', flexShrink: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photoUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
      </div>
    )
  }
  const ini = initials(name)
  return (
    <div style={{ width: 176, height: 216, borderRadius: 16, overflow: 'hidden', background: primary, position: 'relative', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 176 216" preserveAspectRatio="xMidYMid slice">
        <polygon points="88,0 176,60 176,156 88,216 0,156 0,60" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
        <polygon points="88,30 146,65 146,151 88,186 30,151 30,65" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
        <polygon points="88,60 116,76 116,140 88,156 60,140 60,76" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
        <circle cx="88" cy="108" r="72" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="40" />
      </svg>
      <span style={{ fontSize: 64, fontWeight: 900, color: 'rgba(255,255,255,0.85)', letterSpacing: '-0.05em', position: 'relative', zIndex: 1, textShadow: '0 4px 24px rgba(0,0,0,0.3)' }}>
        {ini}
      </span>
    </div>
  )
}

// ─── MetricsDrawer ────────────────────────────────────────────────────────────

function MetricsDrawer({ physical, performance, onSave, onClose }: {
  physical: PhysicalMetric[]; performance: PerfMetric[]
  onSave: (p: PhysicalMetric[], perf: PerfMetric[]) => void
  onClose: () => void
}) {
  const [draftP, setDraftP]     = useState<PhysicalMetric[]>(physical.map(m => ({ ...m })))
  const [draftPerf, setDraftPerf] = useState<PerfMetric[]>(performance.map(m => ({ ...m })))

  function setPhys(i: number, key: keyof PhysicalMetric, val: string) {
    setDraftP(prev => { const n = prev.map(m => ({ ...m })); if (key === 'display') n[i].display = val; if (key === 'value') n[i].value = parseFloat(val) || 0; return n })
  }
  function setPerf(i: number, key: keyof PerfMetric, val: string) {
    setDraftPerf(prev => { const n = prev.map(m => ({ ...m })); if (key === 'display') n[i].display = val; if (key === 'pct') n[i].pct = parseInt(val, 10) || 0; return n })
  }

  const fieldStyle: React.CSSProperties = { width: '100%', padding: '6px 10px', borderRadius: 7, border: '1px solid #E5E7EB', fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }
  const lbl: React.CSSProperties = { fontSize: 9, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 3 }

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(10,22,40,0.35)', zIndex: 40 }} />
      <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 50, width: 380, background: 'white', boxShadow: '-8px 0 40px rgba(10,22,40,0.15)', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-montserrat), sans-serif' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <p style={{ fontSize: 15, fontWeight: 800, color: N, margin: '0 0 2px' }}>Edit Metrics</p>
            <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>Override display values for this proposal</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 4 }}><X size={18} /></button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: G, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Zap size={12} /> Physical &amp; Intensity
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
            {draftP.map((m, i) => (
              <div key={m.label}>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#374151', margin: '0 0 6px' }}>{m.label}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div><label style={lbl}>Display</label><input value={m.display} onChange={e => setPhys(i, 'display', e.target.value)} style={fieldStyle} /></div>
                  <div><label style={lbl}>Value (bar)</label><input type="number" value={m.value} onChange={e => setPhys(i, 'value', e.target.value)} style={fieldStyle} /></div>
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 10, fontWeight: 700, color: G, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Star size={12} /> Performance &amp; Efficiency
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {draftPerf.map((m, i) => (
              <div key={m.label}>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#374151', margin: '0 0 6px' }}>{m.label}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div><label style={lbl}>Display</label><input value={m.display} onChange={e => setPerf(i, 'display', e.target.value)} style={fieldStyle} /></div>
                  <div><label style={lbl}>Circle % (0–100)</label><input type="number" min={0} max={100} value={m.pct} onChange={e => setPerf(i, 'pct', e.target.value)} style={fieldStyle} /></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: '16px 24px', borderTop: '1px solid #E5E7EB', display: 'flex', gap: 10, flexShrink: 0 }}>
          <button onClick={() => { onSave(draftP, draftPerf); onClose() }} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, background: N, color: 'white', border: 'none', borderRadius: 10, padding: '11px', fontWeight: 800, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
            <Check size={14} /> Apply to Canvas
          </button>
          <button onClick={onClose} style={{ padding: '11px 16px', background: '#F3F4F6', border: 'none', borderRadius: 10, fontSize: 13, color: '#6B7280', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}>Cancel</button>
        </div>
      </div>
    </>
  )
}

// ─── ProposalCanvas ───────────────────────────────────────────────────────────

function ProposalCanvas({ player, brandKit, isPremium, dark, animated, photoUrl, physicalMetrics, perfMetrics, narrative }: {
  player: PlayerData; brandKit: BrandKit | null
  isPremium: boolean; dark: boolean; animated: boolean
  photoUrl: string | null
  physicalMetrics: PhysicalMetric[]; perfMetrics: PerfMetric[]
  narrative?: string | null
}) {
  const primary = brandKit?.primaryColor ?? N
  const accent  = brandKit?.accentColor  ?? G
  const bg      = dark ? `linear-gradient(145deg, ${primary} 0%, #0D1F3C 100%)` : '#FFFFFF'
  const cardBg  = dark ? 'rgba(255,255,255,0.045)' : '#F8FAFC'
  const border  = dark ? 'rgba(255,255,255,0.08)'  : '#E5E7EB'
  const text    = dark ? '#FFFFFF'                  : N
  const muted   = dark ? 'rgba(255,255,255,0.5)'    : '#6B7280'
  const subtle  = dark ? 'rgba(255,255,255,0.18)'   : '#D1D5DB'
  const eloPct  = player.eloRating ? Math.min((player.eloRating / 99) * 100, 100) : 0

  const META = [
    { icon: '🌍', label: 'Nationality', value: player.nationality },
    { icon: '🏆', label: 'Club',        value: player.currentClub },
    { icon: '📅', label: 'Age',         value: player.age != null ? `${player.age} yrs` : null },
    { icon: '⬤',  label: 'Position',   value: player.position },
    { icon: '📏', label: 'Height',      value: player.height != null ? `${player.height} cm` : null },
    { icon: '👟', label: 'Foot',        value: player.preferredFoot },
  ]

  return (
    <div style={{ background: bg, borderRadius: 20, overflow: 'hidden', fontFamily: 'var(--font-montserrat), sans-serif', width: '100%', position: 'relative' }}>
      {/* Top strip */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 28px 0' }}>
        {brandKit?.logoUrl
          ? <img src={brandKit.logoUrl} alt="Agency logo" style={{ height: 36, objectFit: 'contain' }} /> // eslint-disable-line @next/next/no-img-element
          : <span style={{ fontSize: 14, fontWeight: 800, color: accent, letterSpacing: '-0.03em' }}>Welko <span style={{ color: text }}>AgentOS</span></span>}
        {player.position && (
          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.09em', textTransform: 'uppercase', padding: '5px 14px', borderRadius: 99, background: `${accent}22`, border: `1px solid ${accent}44`, color: accent }}>
            {player.position}
          </span>
        )}
      </div>
      {/* Player hero */}
      <div style={{ display: 'flex', gap: 28, padding: '20px 28px 24px', alignItems: 'flex-start' }}>
        <PlayerAvatar name={player.fullName} primary={primary} photoUrl={photoUrl} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 900, color: text, letterSpacing: '-0.04em', margin: '0 0 6px', lineHeight: 1.05 }}>
            {player.fullName}
          </h2>
          {player.currentClub && <p style={{ fontSize: 13, color: muted, margin: '0 0 16px', fontWeight: 500 }}>{player.currentClub}</p>}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px', marginBottom: 16 }}>
            {META.map(({ icon, label, value }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 7, flexShrink: 0, background: dark ? 'rgba(255,255,255,0.08)' : '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>{icon}</div>
                <div>
                  <p style={{ fontSize: 9, color: muted, margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: text, margin: 0 }}>{value ?? '—'}</p>
                </div>
              </div>
            ))}
          </div>
          {player.marketValue && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: `${accent}18`, border: `1px solid ${accent}33`, borderRadius: 99, padding: '4px 12px' }}>
              <Star size={11} color={accent} />
              <span style={{ fontSize: 12, fontWeight: 700, color: accent }}>Market value: €{(player.marketValue / 1000).toFixed(0)}k</span>
            </div>
          )}
        </div>
      </div>
      {/* ELO strip */}
      <div className="pp-elo" style={{ margin: '0 28px 20px', background: cardBg, border: `1px solid ${border}`, borderRadius: 14, padding: '16px 20px', display: 'grid', gridTemplateColumns: 'auto 1fr auto auto', gap: 16, alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span style={{ fontSize: 30, fontWeight: 900, color: accent, letterSpacing: '-0.04em', lineHeight: 1 }}>{player.eloRating ?? '—'}</span>
          <div>
            <p style={{ fontSize: 9, color: muted, margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em' }}>ELO</p>
            {player.eloRating && <p style={{ fontSize: 10, fontWeight: 700, color: accent, margin: 0 }}>{eloLabel(player.eloRating)}</p>}
          </div>
        </div>
        <div>
          <div style={{ height: 6, borderRadius: 99, background: dark ? 'rgba(255,255,255,0.08)' : '#E5E7EB', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 99, background: `linear-gradient(90deg, ${accent}99, ${accent})`, width: animated ? `${eloPct}%` : '0%', transition: 'width 1.4s cubic-bezier(0.4, 0, 0.2, 1)' }} />
          </div>
          <p style={{ fontSize: 9, color: subtle, margin: '4px 0 0', letterSpacing: '0.04em' }}>BeSoccer AgentOS Score — 1 to 99</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 9, color: muted, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Contract</p>
          <p style={{ fontSize: 13, fontWeight: 700, color: text, margin: 0 }}>{fmtDate(player.contractExpiry)}</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 9, color: muted, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Agent</p>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#059669', margin: 0 }}>Available</p>
        </div>
      </div>
      {/* AI Narrative */}
      {narrative && (
        <div style={{ margin: '0 28px 16px', background: dark ? 'rgba(255,255,255,0.05)' : `${accent}08`, border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : `${accent}25`}`, borderRadius: 12, padding: '14px 18px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <Sparkles size={14} color={accent} style={{ flexShrink: 0, marginTop: 2 }} />
          <p style={{ fontSize: 12, color: dark ? 'rgba(255,255,255,0.75)' : '#374151', margin: 0, lineHeight: 1.65, fontStyle: 'italic' }}>{narrative}</p>
        </div>
      )}
      {/* Metrics panels */}
      <div className="pp-metrics" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, padding: '0 28px', marginBottom: 20 }}>
        <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 14, padding: '16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
            <Zap size={12} color={accent} />
            <span style={{ fontSize: 10, fontWeight: 800, color: accent, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Physical &amp; Intensity</span>
            <span style={{ fontSize: 9, color: subtle, marginLeft: 'auto' }}>Custom</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            {physicalMetrics.map(m => <MetricBar key={m.label} {...m} accent={accent} animated={animated} dark={dark} />)}
          </div>
        </div>
        <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 14, padding: '16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
            <Star size={12} color={accent} />
            <span style={{ fontSize: 10, fontWeight: 800, color: accent, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Performance &amp; Efficiency</span>
            <span style={{ fontSize: 9, color: subtle, marginLeft: 'auto' }}>Custom</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px 4px' }}>
            {perfMetrics.map(m => <CircleMetric key={m.label} label={m.label} pct={m.pct} display={m.display} accent={accent} animated={animated} dark={dark} />)}
          </div>
        </div>
      </div>
      {/* Footer */}
      <div style={{ margin: '0 28px 20px', background: dark ? 'rgba(255,255,255,0.04)' : '#F1F5F9', border: `1px solid ${border}`, borderRadius: 12, padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          {brandKit?.footerEmail && <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Mail size={11} color={muted} /><span style={{ fontSize: 11, color: muted }}>{brandKit.footerEmail}</span></div>}
          {brandKit?.footerPhone && <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Phone size={11} color={muted} /><span style={{ fontSize: 11, color: muted }}>{brandKit.footerPhone}</span></div>}
          {brandKit?.footerLocation && <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><MapPin size={11} color={muted} /><span style={{ fontSize: 11, color: muted }}>{brandKit.footerLocation}</span></div>}
          {!brandKit?.footerEmail && !brandKit?.footerPhone && !brandKit?.footerLocation && (
            <span style={{ fontSize: 11, color: subtle, fontStyle: 'italic' }}>Set contact details in Brand Kit → Dashboard</span>
          )}
        </div>
        {!isPremium && <span style={{ fontSize: 10, color: subtle, letterSpacing: '0.03em' }}>Powered by <strong style={{ color: accent }}>Welko AgentOS</strong></span>}
      </div>
    </div>
  )
}

// ─── ProfileOverview tab ──────────────────────────────────────────────────────

function ProfileOverview({ player, playerId, onPhotoSaved }: {
  player: PlayerData
  playerId: string
  onPhotoSaved: (url: string) => void
}) {
  const photoInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl]   = useState<string | null>(null)
  const [photoSaving, setPhotoSaving] = useState(false)
  const [photoOk, setPhotoOk]         = useState(false)

  const [draft, setDraft] = useState<ProfileDraft>({
    transfermarktUrl: player.transfermarktUrl ?? '',
    besoccerUrl:      player.besoccerUrl      ?? '',
    sofascoreUrl:     player.sofascoreUrl     ?? '',
    seasonMatches:    String(player.seasonMatches  ?? 0),
    seasonMinutes:    String(player.seasonMinutes  ?? 0),
    seasonGoals:      String(player.seasonGoals    ?? 0),
    seasonAssists:    String(player.seasonAssists  ?? 0),
  })
  const [saving, setSaving] = useState(false)
  const [saveOk, setSaveOk] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  function set(key: keyof ProfileDraft) {
    return (val: string) => setDraft(p => ({ ...p, [key]: val }))
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setPreviewUrl(ev.target?.result as string)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  async function handleSavePhoto() {
    if (!previewUrl) return
    setPhotoSaving(true)
    try {
      const res = await fetch(`/api/dashboard/players/${playerId}/profile`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storedPhotoUrl: previewUrl }),
      })
      if (res.ok) {
        onPhotoSaved(previewUrl)
        setPreviewUrl(null)
        setPhotoOk(true)
        setTimeout(() => setPhotoOk(false), 3000)
      } else {
        const d = await res.json().catch(() => ({}))
        alert((d as { error?: string }).error ?? 'Failed to save photo')
      }
    } finally {
      setPhotoSaving(false)
    }
  }

  async function handleSaveProfile() {
    setSaving(true)
    setSaveOk(false)
    setSaveError(null)
    try {
      const res = await fetch(`/api/dashboard/players/${playerId}/profile`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transfermarktUrl: draft.transfermarktUrl || null,
          besoccerUrl:      draft.besoccerUrl      || null,
          sofascoreUrl:     draft.sofascoreUrl     || null,
          seasonMatches:    parseInt(draft.seasonMatches, 10)  || 0,
          seasonMinutes:    parseInt(draft.seasonMinutes, 10)  || 0,
          seasonGoals:      parseInt(draft.seasonGoals, 10)    || 0,
          seasonAssists:    parseInt(draft.seasonAssists, 10)  || 0,
        }),
      })
      if (res.ok) {
        setSaveOk(true)
        setTimeout(() => setSaveOk(false), 3000)
      } else {
        const d = await res.json().catch(() => ({}))
        setSaveError((d as { error?: string }).error ?? 'Save failed')
      }
    } finally {
      setSaving(false)
    }
  }

  const currentPhoto = previewUrl ?? player.storedPhotoUrl

  const card: React.CSSProperties = { background: 'white', border: '1px solid #E5E7EB', borderRadius: 16, padding: '24px 28px', marginBottom: 16 }
  const sectionTitle: React.CSSProperties = { fontSize: 13, fontWeight: 800, color: N, margin: '0 0 18px', display: 'flex', alignItems: 'center', gap: 8 }
  const fieldLabel: React.CSSProperties = { fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 5 }
  const inputStyle: React.CSSProperties = { width: '100%', padding: '9px 12px', borderRadius: 9, border: '1px solid #E5E7EB', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', color: N }

  return (
    <div style={{ maxWidth: 720, fontFamily: 'var(--font-montserrat), sans-serif' }}>

      {/* Hidden file input */}
      <input ref={photoInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />

      {/* ── Player Photo ── */}
      <div style={card}>
        <p style={sectionTitle}><Upload size={15} color={G} /> Player Photo</p>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24 }}>
          {/* Preview */}
          <div style={{ width: 100, height: 120, borderRadius: 12, overflow: 'hidden', border: '2px solid #E5E7EB', background: '#F9FAFB', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {currentPhoto
              ? <img src={currentPhoto} alt="Player" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} /> // eslint-disable-line @next/next/no-img-element
              : <span style={{ fontSize: 28, fontWeight: 900, color: '#D1D5DB' }}>{initials(player.fullName)}</span>}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
              <button
                onClick={() => photoInputRef.current?.click()}
                style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'white', border: '1px solid #E5E7EB', borderRadius: 9, padding: '8px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit', color: N }}
              >
                <Upload size={13} color={G} /> {previewUrl ? 'Replace Photo' : 'Upload Photo'}
              </button>

              {previewUrl && (
                <button
                  onClick={handleSavePhoto}
                  disabled={photoSaving}
                  style={{ display: 'flex', alignItems: 'center', gap: 7, background: N, color: 'white', border: 'none', borderRadius: 9, padding: '8px 16px', cursor: photoSaving ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'inherit' }}
                >
                  {photoSaving ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={13} />}
                  {photoSaving ? 'Saving…' : 'Save to Profile'}
                </button>
              )}

              {photoOk && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#059669', fontWeight: 600 }}>
                  <CheckCircle2 size={14} /> Photo saved permanently
                </span>
              )}
            </div>

            {previewUrl && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11, color: '#9CA3AF' }}>New photo selected — click &quot;Save to Profile&quot; to persist it across sessions.</span>
                <button onClick={() => setPreviewUrl(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 0, display: 'flex' }}><X size={13} /></button>
              </div>
            )}

            {!previewUrl && player.storedPhotoUrl && (
              <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0 }}>Saved photo is active on the proposal canvas.</p>
            )}
            {!previewUrl && !player.storedPhotoUrl && (
              <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0 }}>Upload a PNG or JPG cutout to replace the initials avatar on the proposal canvas.</p>
            )}
          </div>
        </div>
      </div>

      {/* ── External Scouting Links ── */}
      <div style={card}>
        <p style={sectionTitle}><ExternalLink size={15} color={G} /> External Scouting Links</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {([
            { key: 'transfermarktUrl', label: 'Transfermarkt URL', placeholder: 'https://www.transfermarkt.com/player/…', icon: '⚽' },
            { key: 'besoccerUrl',      label: 'BeSoccer URL',      placeholder: 'https://www.besoccer.com/player/…',      icon: '📊' },
            { key: 'sofascoreUrl',     label: 'Sofascore URL',     placeholder: 'https://www.sofascore.com/player/…',     icon: '⭐' },
          ] as const).map(({ key, label, placeholder, icon }) => (
            <div key={key}>
              <label style={fieldLabel}>{icon} {label}</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="url"
                  value={draft[key]}
                  onChange={e => set(key)(e.target.value)}
                  placeholder={placeholder}
                  style={inputStyle}
                />
                {draft[key] && (
                  <a href={draft[key]} target="_blank" rel="noopener noreferrer"
                    style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: G, display: 'flex' }}>
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Season Performance ── */}
      <div style={card}>
        <p style={sectionTitle}><BarChart2 size={15} color={G} /> Season Performance</p>
        <div className="pp-season" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {([
            { key: 'seasonMatches',  label: 'Matches Played', icon: '🏟️' },
            { key: 'seasonMinutes',  label: 'Minutes',        icon: '⏱️' },
            { key: 'seasonGoals',    label: 'Goals',          icon: '⚽' },
            { key: 'seasonAssists',  label: 'Assists',        icon: '🎯' },
          ] as const).map(({ key, label, icon }) => (
            <div key={key} style={{ background: '#F9FAFB', borderRadius: 12, padding: '14px 16px', border: '1px solid #F3F4F6' }}>
              <p style={{ fontSize: 18, margin: '0 0 2px' }}>{icon}</p>
              <p style={{ fontSize: 22, fontWeight: 900, color: N, margin: '0 0 4px', letterSpacing: '-0.03em' }}>
                {draft[key] || '0'}
              </p>
              <label style={{ ...fieldLabel, marginBottom: 6 }}>{label}</label>
              <input
                type="number" min={0}
                value={draft[key]}
                onChange={e => set(key)(e.target.value)}
                style={{ ...inputStyle, padding: '6px 10px', fontSize: 12 }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Save bar ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button
          onClick={handleSaveProfile}
          disabled={saving}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: saving ? '#E5E7EB' : N,
            color: saving ? '#9CA3AF' : 'white',
            border: 'none', borderRadius: 10, padding: '11px 24px',
            fontWeight: 800, fontSize: 14, cursor: saving ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
          }}
        >
          {saving ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={14} />}
          {saving ? 'Saving…' : 'Save Changes'}
        </button>

        {saveOk && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#059669', fontWeight: 600 }}>
            <CheckCircle2 size={16} /> Saved successfully
          </span>
        )}
        {saveError && <span style={{ fontSize: 13, color: '#DC2626' }}>{saveError}</span>}
      </div>
    </div>
  )
}

// ─── Activity Log ─────────────────────────────────────────────────────────────

const ACTIVITY_ICONS: Record<string, string> = {
  PLAYER_ADDED:    '➕',
  NOTE_ADDED:      '📝',
  PIPELINE_MOVED:  '🔄',
  PROPOSAL_SENT:   '📄',
  CATEGORY_CHANGED:'🏷️',
  PROFILE_UPDATED: '✏️',
  MANDATE_MATCHED: '🎯',
}

function ActivityLog({ playerId }: { playerId: string }) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [logLoading, setLogLoading] = useState(true)
  const [noteText, setNoteText]     = useState('')
  const [posting, setPosting]       = useState(false)

  function fetchLog() {
    setLogLoading(true)
    fetch(`/api/dashboard/players/${playerId}/activity`)
      .then(r => r.json())
      .then(d => setActivities(d.activities ?? []))
      .finally(() => setLogLoading(false))
  }

  useEffect(() => { fetchLog() }, [playerId]) // eslint-disable-line react-hooks/exhaustive-deps

  async function addNote(e: React.FormEvent) {
    e.preventDefault()
    if (!noteText.trim()) return
    setPosting(true)
    try {
      await fetch(`/api/dashboard/players/${playerId}/activity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'NOTE_ADDED', description: noteText.trim() }),
      })
      setNoteText('')
      fetchLog()
    } finally {
      setPosting(false)
    }
  }

  function timeSince(iso: string) {
    const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
    if (s < 60)     return 'just now'
    if (s < 3600)   return `${Math.floor(s / 60)}m ago`
    if (s < 86400)  return `${Math.floor(s / 3600)}h ago`
    if (s < 604800) return `${Math.floor(s / 86400)}d ago`
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <div style={{ maxWidth: 680, fontFamily: 'var(--font-montserrat), sans-serif' }}>

      {/* Add note form */}
      <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 14, padding: '20px 24px', marginBottom: 20 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: N, margin: '0 0 12px' }}>Add a note</p>
        <form onSubmit={addNote} style={{ display: 'flex', gap: 10 }}>
          <input
            value={noteText}
            onChange={e => setNoteText(e.target.value)}
            placeholder="e.g. Spoke with sporting director at Betis — interested in a loan..."
            style={{ flex: 1, padding: '9px 13px', borderRadius: 9, border: '1px solid #E5E7EB', fontSize: 13, fontFamily: 'inherit', outline: 'none' }}
          />
          <button type="submit" disabled={posting || !noteText.trim()}
            style={{ padding: '9px 18px', borderRadius: 9, background: N, color: 'white', border: 'none', cursor: posting ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'inherit', opacity: !noteText.trim() ? 0.5 : 1 }}>
            {posting ? '…' : 'Add'}
          </button>
        </form>
      </div>

      {/* Timeline */}
      <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 14, overflow: 'hidden' }}>
        {logLoading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#9CA3AF', fontSize: 14 }}>Loading…</div>
        ) : activities.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <p style={{ fontSize: 28, margin: '0 0 8px' }}>📋</p>
            <p style={{ fontSize: 14, fontWeight: 700, color: N, margin: '0 0 4px' }}>No activity yet</p>
            <p style={{ fontSize: 13, color: '#9CA3AF', margin: 0 }}>Actions on this player will appear here automatically.</p>
          </div>
        ) : (
          <div style={{ padding: '8px 0' }}>
            {activities.map((a, i) => (
              <div key={a.id} style={{ padding: '14px 24px', borderBottom: i < activities.length - 1 ? '1px solid #F3F4F6' : 'none', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 15 }}>
                  {ACTIVITY_ICONS[a.type] ?? '📌'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, color: N, margin: '0 0 3px', fontWeight: 500, lineHeight: 1.4 }}>{a.description}</p>
                  <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0 }}>{timeSince(a.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PlayerProposalPage() {
  const params = useParams<{ id: string }>()

  const [data, setData]         = useState<ProposalPayload | null>(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)
  const [tab, setTab]           = useState<Tab>('studio')

  // Studio state
  const [dark, setDark]         = useState(true)
  const [animated, setAnimated] = useState(false)
  const [showDrawer, setShowDrawer] = useState(false)
  const [physicalMetrics, setPhysicalMetrics] = useState<PhysicalMetric[]>(DEFAULT_PHYSICAL)
  const [perfMetrics, setPerfMetrics]         = useState<PerfMetric[]>(DEFAULT_PERFORMANCE)

  // AI narrative pitch
  const [narrative, setNarrative]           = useState<string | null>(null)
  const [generatingPitch, setGeneratingPitch] = useState(false)

  // Photo state — unsaved session upload (overrides DB value on the canvas)
  const [sessionPhotoUrl, setSessionPhotoUrl] = useState<string | null>(null)
  const photoInputRef = useRef<HTMLInputElement>(null)
  const canvasRef     = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch(`/api/dashboard/players/${params.id}/proposal`)
      .then(r => r.json())
      .then((d: ProposalPayload) => {
        setData(d)
        setLoading(false)
        setTimeout(() => setAnimated(true), 150)
      })
      .catch(() => { setError('Failed to load player data.'); setLoading(false) })
  }, [params.id])

  async function generatePitch() {
    if (!params.id || generatingPitch) return
    setGeneratingPitch(true)
    try {
      const res  = await fetch(`/api/dashboard/players/${params.id}/pitch`, { method: 'POST' })
      const data = await res.json()
      if (data.narrative) setNarrative(data.narrative)
    } finally {
      setGeneratingPitch(false)
    }
  }

  const handleExport = useCallback(() => {
    document.body.classList.add('welko-print-proposal')
    window.print()
    window.addEventListener('afterprint', () => {
      document.body.classList.remove('welko-print-proposal')
    }, { once: true })
  }, [])

  function handleStudioPhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setSessionPhotoUrl(ev.target?.result as string)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  // When photo is saved from the Profile tab, update local data + clear session override
  function handlePhotoSaved(url: string) {
    setData(prev => prev ? { ...prev, player: { ...prev.player, storedPhotoUrl: url } } : null)
    setSessionPhotoUrl(null)
  }

  // Effective photo shown on canvas: unsaved session upload → DB-persisted → null (initials)
  const effectivePhotoUrl = sessionPhotoUrl ?? data?.player.storedPhotoUrl ?? null

  const ctrlBtn: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: 8,
    background: 'white', border: '1px solid #E5E7EB', borderRadius: 99,
    padding: '7px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 700,
    color: N, fontFamily: 'inherit',
  }

  return (
    <div style={{ padding: 'clamp(20px,4vw,32px) clamp(16px,4vw,40px) 80px', fontFamily: 'var(--font-montserrat), sans-serif', maxWidth: 960, margin: '0 auto' }}>

      <style>{`
        @media print {
          @page { size: A4 landscape; margin: 0; }
          body.welko-print-proposal > * { display: none !important; }
          body.welko-print-proposal #proposal-canvas-root {
            display: block !important; position: fixed; inset: 0;
            padding: 12mm; box-sizing: border-box;
            -webkit-print-color-adjust: exact; print-color-adjust: exact;
          }
        }
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        @media (max-width: 640px) {
          .pp-header   { flex-wrap: wrap !important; gap: 8px !important; }
          .pp-controls { flex-wrap: wrap !important; gap: 6px !important; justify-content: flex-start !important; }
          .pp-tabs     { overflow-x: auto !important; width: 100% !important; -webkit-overflow-scrolling: touch; }
          .pp-elo      { grid-template-columns: 1fr 1fr !important; gap: 10px !important; }
          .pp-metrics  { grid-template-columns: 1fr !important; }
          .pp-season   { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      {/* Hidden file input for studio quick-upload */}
      <input ref={photoInputRef} type="file" accept="image/*" onChange={handleStudioPhotoUpload} style={{ display: 'none' }} />

      {/* ── Controls header ── */}
      <div className="pp-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link href="/dashboard/players" style={{ display: 'flex', alignItems: 'center', color: '#9CA3AF', textDecoration: 'none' }}>
            <ArrowLeft size={16} />
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#9CA3AF', fontSize: 13 }}>
            <span>Player Hub</span>
            <ChevronRight size={13} />
            <span style={{ color: N, fontWeight: 700 }}>
              {data?.player.fullName ?? 'Loading…'}
            </span>
          </div>
        </div>

        {tab === 'studio' && data && (
          <div className="pp-controls" style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <button onClick={() => photoInputRef.current?.click()} style={ctrlBtn}>
              <Upload size={13} color={G} />
              {sessionPhotoUrl ? 'Replace Photo' : 'Upload Photo'}
            </button>
            {sessionPhotoUrl && (
              <button onClick={() => setSessionPhotoUrl(null)} style={{ ...ctrlBtn, color: '#EF4444', borderColor: 'rgba(239,68,68,0.25)' }}>
                <X size={13} /> Remove
              </button>
            )}
            <button onClick={() => setShowDrawer(true)} style={ctrlBtn}>
              <PenLine size={13} color={G} /> Edit Metrics
            </button>
            <button onClick={generatePitch} disabled={generatingPitch} style={{ ...ctrlBtn, borderColor: `${G}40`, color: G, opacity: generatingPitch ? 0.7 : 1 }}>
              {generatingPitch
                ? <><Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> Generating…</>
                : <><Sparkles size={13} /> {narrative ? 'Regenerate Pitch' : 'Generate Pitch'}</>}
            </button>
            {narrative && (
              <button onClick={() => setNarrative(null)} style={{ ...ctrlBtn, color: '#9CA3AF', fontSize: 11 }}>
                <X size={12} /> Remove Pitch
              </button>
            )}
            <button onClick={() => { setDark(!dark); setAnimated(false); setTimeout(() => setAnimated(true), 100) }} style={ctrlBtn}>
              {dark ? <Sun size={13} color={G} /> : <Moon size={13} color={N} />}
              {dark ? 'Dark' : 'Light'}
            </button>
            <button onClick={handleExport} style={{ display: 'flex', alignItems: 'center', gap: 8, background: N, color: 'white', border: 'none', borderRadius: 10, padding: '9px 18px', cursor: 'pointer', fontSize: 13, fontWeight: 800, fontFamily: 'inherit' }}>
              <Download size={14} /> Export PDF
            </button>
          </div>
        )}
      </div>

      {/* ── Tab bar ── */}
      <div className="pp-tabs" style={{ display: 'flex', gap: 0, marginBottom: 24, background: 'white', border: '1px solid #E5E7EB', borderRadius: 12, padding: 4, width: 'fit-content' }}>
        {([
          ['studio',   'Presentation Studio'],
          ['profile',  'Profile & Season Stats'],
          ['activity', 'Activity Log'],
        ] as const).map(([t, label]) => (
          <button key={t} onClick={() => setTab(t)}
            style={{
              padding: '8px 20px', borderRadius: 9, border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 700, fontFamily: 'inherit',
              background: tab === t ? N : 'transparent',
              color: tab === t ? '#fff' : '#6B7280',
              transition: 'background 0.15s, color 0.15s',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Loading / Error ── */}
      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: 12, color: '#6B7280' }}>
          <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
          <span style={{ fontSize: 14 }}>Loading player data…</span>
        </div>
      )}
      {error && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: '16px 20px', color: '#DC2626', fontSize: 14 }}>
          {error}
        </div>
      )}

      {/* ── Studio tab ── */}
      {data && !loading && tab === 'studio' && (
        <div id="proposal-canvas-root" ref={canvasRef}>
          <ProposalCanvas
            player={data.player}
            brandKit={data.brandKit}
            isPremium={data.isPremium}
            dark={dark}
            animated={animated}
            photoUrl={effectivePhotoUrl}
            physicalMetrics={physicalMetrics}
            perfMetrics={perfMetrics}
            narrative={narrative}
          />
          <p style={{ fontSize: 11, color: '#D1D5DB', textAlign: 'center', marginTop: 12 }}>
            Physical &amp; performance metrics use editable custom data. Click &quot;Edit Metrics&quot; to adjust values before export.
            {sessionPhotoUrl && <span style={{ color: '#F59E0B' }}> · Session photo active — go to Profile tab to save permanently.</span>}
          </p>
        </div>
      )}

      {/* ── Profile tab ── */}
      {data && !loading && tab === 'profile' && (
        <ProfileOverview
          player={data.player}
          playerId={params.id}
          onPhotoSaved={handlePhotoSaved}
        />
      )}

      {/* ── Activity tab ── */}
      {!loading && tab === 'activity' && (
        <ActivityLog playerId={params.id} />
      )}

      {/* ── Metrics drawer ── */}
      {showDrawer && (
        <MetricsDrawer
          physical={physicalMetrics}
          performance={perfMetrics}
          onSave={(p, perf) => {
            setPhysicalMetrics(p); setPerfMetrics(perf)
            setAnimated(false); setTimeout(() => setAnimated(true), 80)
          }}
          onClose={() => setShowDrawer(false)}
        />
      )}
    </div>
  )
}
