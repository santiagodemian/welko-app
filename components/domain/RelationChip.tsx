import { FONT } from '@/lib/ds'

interface Props {
  label:     string        // edge label, e.g. "plays for"
  target:    string        // target entity name
  color?:    string
}

export function RelationChip({ label, target, color = '#6B7280' }: Props) {
  return (
    <span style={{
      display:        'inline-flex',
      alignItems:     'center',
      gap:            4,
      fontFamily:     FONT.sans,
      fontSize:       10,
      color:          '#6B7280',
      background:     '#F9FAFB',
      border:         '1px solid #E5E7EB',
      borderRadius:   20,
      padding:        '2px 8px 2px 5px',
      whiteSpace:     'nowrap',
    }}>
      <span style={{ fontFamily: FONT.mono, fontSize: 7, color, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        {label}
      </span>
      <span style={{ color: '#374151', fontWeight: 600 }}>{target}</span>
    </span>
  )
}
