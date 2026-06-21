import { ENTITY_META } from '@/lib/domain/graph/relations'
import type { EntityType } from '@/lib/domain/graph/relations'
import { FONT } from '@/lib/ds'

interface Props {
  type: EntityType
  size?: 'sm' | 'md'
}

export function EntityBadge({ type, size = 'sm' }: Props) {
  const meta = ENTITY_META[type]
  const fs   = size === 'md' ? 9 : 8
  const px   = size === 'md' ? '7px 10px' : '3px 8px'
  const dot  = size === 'md' ? 6 : 5

  return (
    <span style={{
      display:        'inline-flex',
      alignItems:     'center',
      gap:            5,
      fontFamily:     FONT.mono,
      fontSize:       fs,
      fontWeight:     700,
      letterSpacing:  '0.08em',
      textTransform:  'uppercase',
      color:          meta.color,
      background:     `${meta.color}12`,
      border:         `1px solid ${meta.color}30`,
      borderRadius:   4,
      padding:        px,
      whiteSpace:     'nowrap',
    }}>
      <span style={{ width: dot, height: dot, borderRadius: '50%', background: meta.color, flexShrink: 0 }} />
      {meta.label}
    </span>
  )
}
