'use client'

import { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { BarChart2, Loader2 } from 'lucide-react'

const N = '#0A0A0A'
const G = '#2563EB'

interface PlayerSummary {
  id: string
  position: string | null
  nationality: string | null
  category: string
}

export default function ReportsPage() {
  const [players, setPlayers] = useState<PlayerSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard/players')
      .then(r => r.json())
      .then(d => setPlayers(d.players ?? []))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ padding: 'clamp(16px,4vw,28px) clamp(16px,4vw,32px)', fontFamily: 'var(--font-montserrat)', color: N, minHeight: '100vh', background: '#F8FAFF' }}>
      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: N, margin: 0, fontFamily: 'var(--font-montserrat)' }}>Reports</h1>
        <p style={{ fontSize: 13, color: '#6B7280', margin: '4px 0 0', fontFamily: 'var(--font-montserrat)' }}>
          Analytics and insights for your player portfolio
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
          <Loader2 size={28} color={G} style={{ animation: 'spin 1s linear infinite' }} />
        </div>
      ) : players.length < 3 ? (
        <div style={{ textAlign: 'center', padding: '56px 0', color: '#9CA3AF' }}>
          <BarChart2 size={40} color="#D1D5DB" style={{ marginBottom: 12 }} />
          <p style={{ fontSize: 14, fontWeight: 600, margin: 0, color: N, fontFamily: 'var(--font-montserrat)' }}>
            Add more players to see reports
          </p>
          <p style={{ fontSize: 12, margin: '4px 0 0', fontFamily: 'var(--font-montserrat)' }}>
            You need at least 3 players in your portfolio to generate charts.
          </p>
        </div>
      ) : (
        <Charts players={players} />
      )}
    </div>
  )
}

function Charts({ players }: { players: PlayerSummary[] }) {
  const positionMap: Record<string, number> = {}
  players.forEach(p => {
    const pos = p.position ?? 'Unknown'
    positionMap[pos] = (positionMap[pos] ?? 0) + 1
  })
  const positionData = Object.entries(positionMap).sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count }))

  const catMap: Record<string, number> = { MANAGED: 0, MANDATE: 0, PROSPECTIVE: 0 }
  players.forEach(p => { if (p.category in catMap) catMap[p.category]++ })
  const categoryData = [
    { name: 'Managed',     value: catMap.MANAGED,     color: '#22C55E' },
    { name: 'Mandate',     value: catMap.MANDATE,     color: G },
    { name: 'Prospective', value: catMap.PROSPECTIVE, color: '#9CA3AF' },
  ].filter(d => d.value > 0)

  const natMap: Record<string, number> = {}
  players.forEach(p => {
    const nat = p.nationality ?? 'Unknown'
    natMap[nat] = (natMap[nat] ?? 0) + 1
  })
  const natData = Object.entries(natMap).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, count]) => ({ name, count }))

  const tickStyle = { fontSize: 11, fontFamily: 'var(--font-montserrat)', fill: '#6B7280' }
  const CARD: React.CSSProperties = { background: '#fff', border: '1.5px solid #E5E7EB', borderRadius: 14, padding: 20 }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
      <div style={CARD}>
        <p style={{ fontSize: 13, fontWeight: 700, color: N, margin: '0 0 14px', fontFamily: 'var(--font-montserrat)' }}>Position Distribution</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={positionData} layout="vertical" margin={{ left: 8, right: 16 }}>
            <XAxis type="number" tick={tickStyle} axisLine={false} tickLine={false} allowDecimals={false} />
            <YAxis type="category" dataKey="name" tick={tickStyle} width={56} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ fontFamily: 'var(--font-montserrat)', fontSize: 12, borderRadius: 8, border: '1px solid #E5E7EB' }} cursor={{ fill: `${G}10` }} />
            <Bar dataKey="count" fill={G} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={CARD}>
        <p style={{ fontSize: 13, fontWeight: 700, color: N, margin: '0 0 14px', fontFamily: 'var(--font-montserrat)' }}>Category Distribution</p>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={categoryData} dataKey="value" cx="50%" cy="45%" innerRadius={50} outerRadius={80}>
              {categoryData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
            </Pie>
            <Legend iconType="circle" iconSize={9} formatter={(val: string) => <span style={{ fontSize: 11, fontFamily: 'var(--font-montserrat)', color: N }}>{val}</span>} />
            <Tooltip contentStyle={{ fontFamily: 'var(--font-montserrat)', fontSize: 12, borderRadius: 8, border: '1px solid #E5E7EB' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div style={CARD}>
        <p style={{ fontSize: 13, fontWeight: 700, color: N, margin: '0 0 14px', fontFamily: 'var(--font-montserrat)' }}>Top Nationalities</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={natData} margin={{ left: 0, right: 8, bottom: 16 }}>
            <XAxis dataKey="name" tick={{ ...tickStyle, fontSize: 10 }} axisLine={false} tickLine={false} interval={0} angle={-30} textAnchor="end" />
            <YAxis tick={tickStyle} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={{ fontFamily: 'var(--font-montserrat)', fontSize: 12, borderRadius: 8, border: '1px solid #E5E7EB' }} cursor={{ fill: `${G}10` }} />
            <Bar dataKey="count" fill={G} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
