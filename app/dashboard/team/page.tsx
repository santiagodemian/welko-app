'use client'

import { useState, useEffect } from 'react'
import { Users, Loader2, ShieldCheck, Shield, User } from 'lucide-react'

const N = '#0A0A0A'
const G = '#2563EB'

interface Member {
  id:        string
  fullName:  string
  email:     string
  role:      string
  avatarUrl: string | null
  createdAt: string
}

const ROLE_LABEL: Record<string, string> = {
  AGENCY_OWNER: 'Owner',
  MANAGER:      'Manager',
  AGENT:        'Agent',
  SCOUT:        'Scout',
  SUPERADMIN:   'Superadmin',
}

const ROLE_COLOR: Record<string, string> = {
  AGENCY_OWNER: '#059669',
  MANAGER:      G,
  AGENT:        '#6B7280',
  SCOUT:        '#9CA3AF',
  SUPERADMIN:   '#7C3AED',
}

function RoleIcon({ role }: { role: string }) {
  if (role === 'AGENCY_OWNER') return <ShieldCheck size={14} color={ROLE_COLOR[role] ?? '#6B7280'} />
  if (role === 'MANAGER')      return <Shield size={14} color={ROLE_COLOR[role] ?? '#6B7280'} />
  return <User size={14} color={ROLE_COLOR[role] ?? '#9CA3AF'} />
}

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

export default function TeamPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [myRole,  setMyRole]  = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard/team').then(r => r.json()).then(d => {
      setMembers(d.members ?? [])
      setMyRole(d.myRole ?? '')
    }).finally(() => setLoading(false))
  }, [])

  const isOwner = myRole === 'AGENCY_OWNER' || myRole === 'MANAGER'

  return (
    <div style={{ padding: 'clamp(20px,4vw,40px) clamp(16px,4vw,40px) 80px', fontFamily: 'var(--font-montserrat), sans-serif', maxWidth: 800 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `${G}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={18} color={G} />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: N, margin: 0, letterSpacing: '-0.03em' }}>Team</h1>
        </div>
        {isOwner && (
          <button
            style={{ background: N, color: 'white', border: 'none', borderRadius: 10, padding: '10px 20px', cursor: 'pointer', fontWeight: 700, fontSize: 13, fontFamily: 'inherit' }}
            onClick={() => alert('Invitations via email — coming soon!')}
          >
            + Invite Member
          </button>
        )}
      </div>
      <p style={{ color: '#9CA3AF', margin: '0 0 28px', fontSize: 14 }}>
        All members with access to this agency.
      </p>

      {loading ? (
        <div style={{ padding: 64, textAlign: 'center', color: '#9CA3AF' }}>
          <Loader2 size={22} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 12px', display: 'block' }} />
          <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
        </div>
      ) : members.length === 0 ? (
        <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 14, padding: 48, textAlign: 'center' }}>
          <Users size={36} color="#E5E7EB" style={{ margin: '0 auto 12px', display: 'block' }} />
          <p style={{ fontSize: 15, fontWeight: 700, color: N, margin: '0 0 6px' }}>No team members yet</p>
        </div>
      ) : (
        <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 16, overflow: 'hidden' }}>
          {members.map((m, i) => (
            <div key={m.id} style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px',
              borderTop: i === 0 ? 'none' : '1px solid #F3F4F6',
            }}>
              {/* Avatar */}
              <div style={{ width: 40, height: 40, borderRadius: '50%', overflow: 'hidden', background: N, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #E5E7EB' }}>
                {m.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.avatarUrl} alt={m.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: 12, fontWeight: 900, color: G }}>{initials(m.fullName)}</span>
                )}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: N, margin: '0 0 2px' }}>{m.fullName}</p>
                <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>{m.email}</p>
              </div>

              {/* Role badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 20, background: `${ROLE_COLOR[m.role] ?? '#6B7280'}12`, border: `1px solid ${ROLE_COLOR[m.role] ?? '#6B7280'}25`, flexShrink: 0 }}>
                <RoleIcon role={m.role} />
                <span style={{ fontSize: 11, fontWeight: 700, color: ROLE_COLOR[m.role] ?? '#6B7280' }}>
                  {ROLE_LABEL[m.role] ?? m.role}
                </span>
              </div>

              {/* Since date */}
              <span style={{ fontSize: 11, color: '#D1D5DB', flexShrink: 0 }}>
                Joined {new Date(m.createdAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
              </span>
            </div>
          ))}
        </div>
      )}

      <p style={{ fontSize: 11, color: '#D1D5DB', marginTop: 20 }}>
        To add or remove members, contact support or manage roles via your Clerk dashboard.
      </p>
    </div>
  )
}
