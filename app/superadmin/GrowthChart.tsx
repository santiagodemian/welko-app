'use client'

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'

interface DataPoint { month: string; agencies: number }

interface Props {
  data: DataPoint[]
}

export function GrowthChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 10, right: 20, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="agGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#1E6FEB" stopOpacity={0.28} />
            <stop offset="95%" stopColor="#1E6FEB" stopOpacity={0}    />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: '#9CA3AF' }}
          axisLine={false} tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#9CA3AF' }}
          axisLine={false} tickLine={false}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            background: '#0A1628', border: 'none',
            borderRadius: 10, fontSize: 12, color: 'white',
          }}
          labelStyle={{ color: '#1E6FEB', fontWeight: 700, marginBottom: 4 }}
          itemStyle={{ color: 'rgba(255,255,255,0.8)' }}
        />
        <Area
          type="monotone" dataKey="agencies" name="New agencies"
          stroke="#1E6FEB" fill="url(#agGradient)" strokeWidth={2.5}
          dot={{ fill: '#1E6FEB', r: 4, strokeWidth: 0 }}
          activeDot={{ r: 6, fill: '#1E6FEB', stroke: 'white', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
