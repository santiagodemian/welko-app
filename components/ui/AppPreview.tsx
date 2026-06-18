/**
 * AppPreview — real Polaris dashboard rendered in React.
 * Used on the marketing site to show the product, never a screenshot.
 * Design reference: Linear / Vercel / Stripe homepage product showcases.
 */

import { C, FONT } from '@/lib/ds'
import {
  BarChart3, Users, Globe2, Bell, Settings,
  TrendingUp, ArrowUpRight, ChevronDown, Plus,
} from 'lucide-react'

const PLAYERS = [
  { init: 'MS', name: 'Marcus Silva',  pos: 'FW', club: 'Madrid CF',  status: 'Signing',  val: '$2.1M', color: '#22C55E', progress: 88 },
  { init: 'JF', name: 'João Ferreira', pos: 'CM', club: 'Arsenal',    status: 'Sent',     val: '$850K', color: '#22C55E', progress: 72 },
  { init: 'KD', name: 'Keita Diallo',  pos: 'CB', club: 'Lyon FC',    status: 'Review',   val: '$1.4M', color: '#F59E0B', progress: 45 },
  { init: 'RM', name: 'Raúl Méndez',   pos: 'GK', club: 'Inter',      status: 'Prospect', val: '$620K', color: '#F59E0B', progress: 24 },
]

const ACTIVITY = [
  { dot: '#22C55E', label: 'Contract signed',   sub: 'Marcus S. · Madrid CF',  time: '2h ago' },
  { dot: C.blue,    label: 'Meeting confirmed', sub: 'Lyon FC · Keita D.',      time: '5h ago' },
  { dot: '#A855F7', label: 'New offer received',sub: 'Arsenal · João F.',       time: '1d ago' },
]

const NAV = [
  { Icon: BarChart3, label: 'Pipeline',  active: true  },
  { Icon: Users,     label: 'Players',   active: false },
  { Icon: Globe2,    label: 'Network',   active: false },
  { Icon: Bell,      label: 'Activity',  active: false },
  { Icon: Settings,  label: 'Settings',  active: false },
]

const STATS = [
  { value: '320', label: 'Players',    Icon: Users,      up: '+12' },
  { value: '47',  label: 'Active',     Icon: TrendingUp, up: '+3'  },
  { value: '58',  label: 'Countries',  Icon: Globe2,     up: null  },
]

/* ─── Micro design tokens (scaled for a 480–660px preview panel) ─── */
const bg = {
  app:     '#111111',
  sidebar: '#0D0D0D',
  surface: '#181818',
  panel:   '#141414',
  line:    'rgba(255,255,255,0.06)',
  hover:   'rgba(255,255,255,0.04)',
}

const tx = {
  hi:   'rgba(255,255,255,0.88)',
  mid:  'rgba(255,255,255,0.45)',
  lo:   'rgba(255,255,255,0.22)',
  blue:  C.blue,
}

const f = FONT.sans
const dg = 'var(--font-space-grotesk), system-ui, sans-serif'

export function AppPreview() {
  return (
    <div style={{ fontFamily: f, userSelect: 'none', borderRadius: '12px 12px 0 0', overflow: 'hidden', boxShadow: '0 -16px 64px rgba(37,99,235,0.12), 0 0 0 1px rgba(255,255,255,0.06)' }}>

      {/* ── Window chrome ────────────────────────────────────────── */}
      <div style={{ background: bg.sidebar, borderBottom: `1px solid ${bg.line}`, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Traffic lights */}
        <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
          {['#FF5F57','#FEBC2E','#28C840'].map(c => (
            <div key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c, opacity: 0.9 }} />
          ))}
        </div>
        {/* URL bar */}
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: 5, padding: '3px 10px', display: 'flex', alignItems: 'center', gap: 6, border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
          {/* Lock icon dot */}
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#22C55E', flexShrink: 0 }} />
          <span style={{ fontSize: 10, color: tx.mid, letterSpacing: 0, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            app.polarisfootball.com/pipeline
          </span>
        </div>
        {/* Agent avatar */}
        <div style={{ width: 20, height: 20, borderRadius: '50%', background: C.blue, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 8, fontWeight: 700, color: '#fff' }}>AG</span>
        </div>
      </div>

      {/* ── App shell ────────────────────────────────────────────── */}
      <div style={{ background: bg.app, display: 'flex', minHeight: 0 }}>

        {/* Sidebar */}
        <div style={{ width: 44, background: bg.sidebar, borderRight: `1px solid ${bg.line}`, padding: '14px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flexShrink: 0 }}>
          {/* Logo mark */}
          <div style={{ width: 24, height: 24, borderRadius: 6, background: C.blue, marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.85)' }} />
          </div>

          {NAV.map(({ Icon, label, active }) => (
            <div
              key={label}
              title={label}
              style={{
                width: 32, height: 32, borderRadius: 7,
                background: active ? `${C.blue}22` : 'transparent',
                border: active ? `1px solid ${C.blue}33` : '1px solid transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <Icon size={13} color={active ? C.blue : tx.lo} strokeWidth={1.6} />
            </div>
          ))}
        </div>

        {/* Main area */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>

          {/* Topbar */}
          <div style={{ padding: '10px 16px', borderBottom: `1px solid ${bg.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: tx.hi, letterSpacing: '-0.01em', fontFamily: dg }}>Transfer Pipeline</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: bg.surface, border: `1px solid ${bg.line}`, borderRadius: 5, padding: '2px 7px', cursor: 'pointer' }}>
                <span style={{ fontSize: 9, color: tx.mid, fontWeight: 600 }}>All Agents</span>
                <ChevronDown size={8} color={tx.lo} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 5 }}>
              <div style={{ padding: '4px 9px', borderRadius: 5, background: bg.surface, border: `1px solid ${bg.line}`, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 9, color: tx.mid, fontWeight: 600, letterSpacing: '0.04em' }}>FILTER</span>
              </div>
              <div style={{ padding: '4px 9px', borderRadius: 5, background: C.blue, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Plus size={8} color="#fff" strokeWidth={2.5} />
                <span style={{ fontSize: 9, color: '#fff', fontWeight: 700, letterSpacing: '0.04em' }}>NEW</span>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderBottom: `1px solid ${bg.line}`, flexShrink: 0 }}>
            {STATS.map(({ value, label, Icon, up }, i) => (
              <div key={label} style={{ padding: '12px 16px', borderRight: i < 2 ? `1px solid ${bg.line}` : 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: 18, fontWeight: 700, color: tx.hi, margin: 0, lineHeight: 1, fontFamily: dg, letterSpacing: '-0.025em' }}>{value}</p>
                  <p style={{ fontSize: 9, color: tx.lo, margin: '3px 0 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  <Icon size={11} color={tx.lo} strokeWidth={1.5} />
                  {up && (
                    <span style={{ fontSize: 8.5, color: '#22C55E', fontWeight: 700 }}>{up}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Table */}
          <div style={{ flexShrink: 0 }}>
            {/* Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 34px 70px 64px 56px', gap: 0, padding: '6px 16px', borderBottom: `1px solid ${bg.line}` }}>
              {['PLAYER','POS','CLUB','STATUS','VALUE'].map(h => (
                <span key={h} style={{ fontSize: 8, fontWeight: 700, color: tx.lo, letterSpacing: '0.1em' }}>{h}</span>
              ))}
            </div>

            {PLAYERS.map((p, i) => (
              <div
                key={p.name}
                style={{
                  display: 'grid', gridTemplateColumns: '1fr 34px 70px 64px 56px', gap: 0,
                  padding: '8px 16px',
                  borderBottom: i < PLAYERS.length - 1 ? `1px solid ${bg.line}` : 'none',
                  background: i === 2 ? bg.hover : 'transparent',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
              >
                {/* Player name + avatar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: `${p.color}20`, border: `1px solid ${p.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: 7.5, fontWeight: 700, color: p.color }}>{p.init}</span>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 11, fontWeight: 600, color: tx.hi, margin: 0, lineHeight: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</p>
                    {/* Progress bar */}
                    <div style={{ width: 48, height: 2, background: 'rgba(255,255,255,0.08)', borderRadius: 1, marginTop: 4, overflow: 'hidden' }}>
                      <div style={{ width: `${p.progress}%`, height: '100%', background: p.color, borderRadius: 1 }} />
                    </div>
                  </div>
                </div>
                {/* Pos */}
                <span style={{ fontSize: 9, fontWeight: 700, color: tx.mid, letterSpacing: '0.04em' }}>{p.pos}</span>
                {/* Club */}
                <span style={{ fontSize: 9.5, color: tx.mid, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.club}</span>
                {/* Status badge */}
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: `${p.color}14`, border: `1px solid ${p.color}28`, borderRadius: 4, padding: '2px 5px', width: 'fit-content' }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 8, fontWeight: 600, color: p.color, whiteSpace: 'nowrap' }}>{p.status}</span>
                </div>
                {/* Value */}
                <span style={{ fontSize: 10, fontWeight: 700, color: C.blue, fontFamily: dg }}>{p.val}</span>
              </div>
            ))}
          </div>

          {/* Activity feed */}
          <div style={{ borderTop: `1px solid ${bg.line}`, padding: '10px 16px', background: bg.panel }}>
            <p style={{ fontSize: 8, fontWeight: 700, color: tx.lo, letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 10px' }}>
              Recent Activity
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {ACTIVITY.map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: `${a.dot}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: a.dot }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 10, fontWeight: 600, color: tx.hi, margin: 0, lineHeight: 1.2 }}>{a.label}</p>
                    <p style={{ fontSize: 9, color: tx.lo, margin: '2px 0 0' }}>{a.sub}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                    <span style={{ fontSize: 8.5, color: tx.lo }}>{a.time}</span>
                    <ArrowUpRight size={9} color={tx.lo} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
