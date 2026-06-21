import type { Position, PositionGroup } from '@/lib/domain/types'
import { FONT } from '@/lib/ds'

const GROUP_COLORS: Record<PositionGroup, string> = {
  goalkeeper: '#374151',
  defender:   '#059669',
  midfielder: '#2563EB',
  forward:    '#DC2626',
}

interface Props {
  position:  Position | string
  group:     PositionGroup
  size?:     'sm' | 'md'
}

export function PositionBadge({ position, group, size = 'sm' }: Props) {
  const color = GROUP_COLORS[group] ?? '#6B7280'
  const fs    = size === 'md' ? 10 : 9

  return (
    <span style={{
      fontFamily:    FONT.mono,
      fontSize:      fs,
      fontWeight:    700,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color,
      background:    `${color}0D`,
      border:        `1px solid ${color}2E`,
      borderRadius:  4,
      padding:       size === 'md' ? '3px 9px' : '2px 7px',
      whiteSpace:    'nowrap',
    }}>
      {position}
    </span>
  )
}
