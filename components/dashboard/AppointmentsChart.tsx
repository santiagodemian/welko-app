'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  type TooltipProps,
} from 'recharts'

const DATA = [
  { mes: 'Oct',  agendadas: 31, asistidas: 27 },
  { mes: 'Nov',  agendadas: 35, asistidas: 31 },
  { mes: 'Dic',  agendadas: 28, asistidas: 25 },
  { mes: 'Ene',  agendadas: 40, asistidas: 36 },
  { mes: 'Feb',  agendadas: 43, asistidas: 38 },
  { mes: 'Mar',  agendadas: 47, asistidas: 42 },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div
      style={{
        background: '#1C2333',
        border: '1px solid rgba(255,255,255,0.10)',
        borderRadius: '10px',
        padding: '10px 14px',
        fontSize: 13,
      }}
    >
      <p style={{ color: '#F9FAFB', fontWeight: 700, marginBottom: 8 }}>{label} 2025/2026</p>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {payload.map((entry: any) => (
        <div
          key={entry.name}
          style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '3px 0' }}
        >
          <span
            style={{
              display: 'inline-block',
              width: 8,
              height: 8,
              borderRadius: 2,
              background: entry.color as string,
            }}
          />
          <span style={{ color: 'rgba(255,255,255,0.6)' }}>{entry.name}:</span>
          <span style={{ color: '#F9FAFB', fontWeight: 600 }}>{entry.value}</span>
        </div>
      ))}
      {payload[0] && payload[1] && (
        <div
          style={{
            marginTop: 8,
            paddingTop: 8,
            borderTop: '1px solid rgba(255,255,255,0.07)',
            color: 'rgba(255,255,255,0.4)',
          }}
        >
          Asistencia:{' '}
          <span style={{ color: '#1A2A56', fontWeight: 700 }}>
            {Math.round(((payload[1].value as number) / (payload[0].value as number)) * 100)}%
          </span>
        </div>
      )}
    </div>
  )
}

function CustomLegend() {
  return (
    <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 4 }}>
      {[
        { color: '#3B82F6', label: 'Agendadas' },
        { color: '#1A2A56', label: 'Asistidas'  },
      ].map((item) => (
        <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12 }}>
          <span
            style={{
              display: 'inline-block',
              width: 10,
              height: 10,
              borderRadius: 3,
              background: item.color,
            }}
          />
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>{item.label}</span>
        </div>
      ))}
    </div>
  )
}

export function AppointmentsChart() {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={DATA} barCategoryGap="30%" barGap={4}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.06)"
            vertical={false}
          />
          <XAxis
            dataKey="mes"
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.07)' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={32}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Legend content={<CustomLegend />} />
          <Bar
            dataKey="agendadas"
            name="Agendadas"
            fill="#3B82F6"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="asistidas"
            name="Asistidas"
            fill="#1A2A56"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
