import type { PlayerReport } from '@/lib/reports/types'
import { C, FONT } from '@/lib/ds'
import { Badge } from '@/components/ui/Badge'

type Props = { tactical: PlayerReport['tactical'] }

export function TacticalProfile({ tactical }: Props) {
  return (
    <div>
      <p style={{ fontFamily: FONT.display, fontSize: 14, fontWeight: 700, color: '#111827', margin: '0 0 18px', letterSpacing: '-0.02em', lineHeight: 1.3 }}>
        {tactical.headline}
      </p>

      {/* Roles */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
        <Badge variant="filled">{tactical.primaryRole}</Badge>
        {tactical.alternativeRoles.map(role => (
          <Badge key={role} variant="subtle">{role}</Badge>
        ))}
      </div>

      {/* System fit */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: FONT.mono, fontSize: 8, color: C.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          System fit:
        </span>
        {tactical.systemFit.map(sys => (
          <span key={sys} style={{ fontFamily: FONT.mono, fontSize: 9, fontWeight: 700, color: C.textSecondary, background: C.bgTertiary, border: `1px solid ${C.border}`, borderRadius: 4, padding: '2px 8px' }}>
            {sys}
          </span>
        ))}
      </div>

      {/* Description paragraphs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: tactical.pressingTendency ? 24 : 0 }}>
        {tactical.description.map((para, i) => (
          <p key={i} style={{ fontFamily: FONT.sans, fontSize: 13, color: C.textSecondary, margin: 0, lineHeight: 1.9 }}>
            {para}
          </p>
        ))}
      </div>

      {/* Pressing tendency */}
      {tactical.pressingTendency && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 'clamp(12px,1.5vw,16px)', background: C.bgAlt, border: `1px solid ${C.border}`, borderRadius: 8, borderLeft: `3px solid ${C.blue}` }}>
          <span style={{ fontFamily: FONT.mono, fontSize: 8, fontWeight: 700, color: C.blue, letterSpacing: '0.1em', textTransform: 'uppercase', flexShrink: 0, paddingTop: 2 }}>
            Pressing
          </span>
          <p style={{ fontFamily: FONT.sans, fontSize: 12, color: C.textSecondary, margin: 0, lineHeight: 1.75 }}>
            {tactical.pressingTendency}
          </p>
        </div>
      )}
    </div>
  )
}
