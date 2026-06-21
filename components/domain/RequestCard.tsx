import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Request }     from '@/lib/domain/types'
import { getClub, getPlayer } from '@/lib/domain/seed'
import { EntityBadge }   from './EntityBadge'
import { PositionBadge } from './PositionBadge'
import { C, FONT } from '@/lib/ds'

const PRIORITY_COLORS: Record<string, string> = {
  Critical: '#DC2626', High: '#D97706', Medium: '#2563EB', Low: '#6B7280',
}

const STATUS_COLORS: Record<string, string> = {
  open: '#059669', matched: '#2563EB', shortlisted: '#7C3AED',
  closed: '#374151', expired: '#6B7280',
}

interface Props { request: Request }

export function RequestCard({ request }: Props) {
  const club          = getClub(request.clubId)
  const matched       = request.matchedPlayerIds.map(id => getPlayer(id)).filter(Boolean)
  const priorityColor = PRIORITY_COLORS[request.priority] ?? '#6B7280'
  const statusColor   = STATUS_COLORS[request.status]     ?? '#6B7280'
  const { positionRequirement: pos, budget } = request

  return (
    <div style={{
      background:    '#FFFFFF',
      border:        `1px solid ${C.border}`,
      borderRadius:  10,
      padding:       'clamp(16px,1.8vw,22px)',
      display:       'flex',
      flexDirection: 'column',
      gap:           14,
    }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
        <EntityBadge type="request" />
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <span style={{
            fontFamily: FONT.mono, fontSize: 8, fontWeight: 700, letterSpacing: '0.08em',
            textTransform: 'uppercase', color: priorityColor,
            background: `${priorityColor}12`, border: `1px solid ${priorityColor}30`,
            borderRadius: 4, padding: '2px 7px',
          }}>
            {request.priority}
          </span>
          <span style={{
            fontFamily: FONT.mono, fontSize: 8, fontWeight: 700, letterSpacing: '0.08em',
            textTransform: 'uppercase', color: statusColor,
            background: `${statusColor}12`, border: `1px solid ${statusColor}30`,
            borderRadius: 4, padding: '2px 7px',
          }}>
            {request.status}
          </span>
        </div>
      </div>

      {/* Title + club */}
      <div>
        <div style={{
          fontFamily: FONT.display, fontSize: 'clamp(13px,1.4vw,16px)', fontWeight: 700,
          color: '#111827', letterSpacing: '-0.02em', textTransform: 'uppercase',
          lineHeight: 1.1, marginBottom: 4,
        }}>
          {request.title}
        </div>
        {club && (
          <div style={{ fontFamily: FONT.sans, fontSize: 11, color: C.textSecondary, fontWeight: 600 }}>
            {club.name} · {request.season}
          </div>
        )}
      </div>

      {/* Position requirements */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {pos.positions.map(p => (
          <PositionBadge key={p} position={p} group={pos.positionGroup} size="md" />
        ))}
        {pos.minAge !== undefined && pos.maxAge !== undefined && (
          <span style={{
            fontFamily: FONT.mono, fontSize: 9, color: '#374151',
            background: '#37415112', border: '1px solid #37415130',
            borderRadius: 4, padding: '3px 8px',
          }}>
            Age {pos.minAge}–{pos.maxAge}
          </span>
        )}
        {pos.preferredFoot && (
          <span style={{
            fontFamily: FONT.mono, fontSize: 9, color: '#374151',
            background: '#37415112', border: '1px solid #37415130',
            borderRadius: 4, padding: '3px 8px',
          }}>
            {pos.preferredFoot} Foot
          </span>
        )}
      </div>

      {/* Budget */}
      {budget && (
        <div style={{
          fontFamily: FONT.mono, fontSize: 9, color: C.textSecondary,
          letterSpacing: '0.04em', background: C.bgAlt,
          border: `1px solid ${C.border}`, borderRadius: 6, padding: '8px 10px',
          display: 'flex', gap: 12, flexWrap: 'wrap',
        }}>
          {budget.transfer && <span>Transfer ≤ €{(budget.transfer.amount / 1000).toFixed(0)}K</span>}
          {budget.loan     && <span>Loan fee ≤ €{(budget.loan.amount / 1000).toFixed(0)}K</span>}
          {budget.maxWage  && <span>Wage ≤ €{budget.maxWage.amount.toLocaleString()}/mo</span>}
        </div>
      )}

      {/* Matched players */}
      {matched.length > 0 && (
        <div>
          <div style={{ fontFamily: FONT.mono, fontSize: 8, color: '#059669', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 6 }}>
            {matched.length} {matched.length === 1 ? 'Match' : 'Matches'} Identified
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {matched.map(p => p && (
              <div key={p.id} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                fontFamily: FONT.sans, fontSize: 11, color: '#374151',
              }}>
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#059669', flexShrink: 0 }} />
                <span style={{ fontWeight: 600 }}>{p.name}</span>
                <span style={{ color: C.textMuted }}>{p.position} · {p.age} yrs</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {request.deadline && (
        <div style={{ fontFamily: FONT.mono, fontSize: 8, color: C.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 'auto', paddingTop: 8, borderTop: `1px solid ${C.border}` }}>
          Deadline: {request.deadline}
        </div>
      )}
    </div>
  )
}
