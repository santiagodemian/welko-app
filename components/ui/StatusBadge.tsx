import { Badge } from './Badge'
import { C } from '@/lib/ds'

export type Status = 'live' | 'available' | 'development' | 'beta' | 'research' | 'invite'

const CONFIG: Record<Status, { label: string; color: string; dot: boolean }> = {
  live:        { label: 'Live',            color: '#059669', dot: true  },
  available:   { label: 'Available',       color: C.blue,    dot: false },
  development: { label: 'In Development',  color: '#D97706', dot: false },
  beta:        { label: 'Private Beta',    color: '#7C3AED', dot: false },
  research:    { label: 'Research',        color: '#6B7280', dot: false },
  invite:      { label: 'Invitation Only', color: '#374151', dot: false },
}

export function StatusBadge({ status }: { status: Status }) {
  const c = CONFIG[status]
  return (
    <Badge variant="outline" color={c.color}>
      {c.dot && (
        <span
          style={{
            width: 5, height: 5, borderRadius: '50%',
            background: c.color, display: 'inline-block', flexShrink: 0,
          }}
        />
      )}
      {c.label}
    </Badge>
  )
}
