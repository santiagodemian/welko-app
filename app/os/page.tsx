import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Zap, GitBranch, Target, Brain } from 'lucide-react'
import { WORKFLOW_INSTANCES, RECRUITMENT_STAGES } from '@/lib/workflows'
import { REQUESTS, PLAYERS, CLUBS, DOMAIN_REPORTS } from '@/lib/domain/seed'
import { findExpiringContracts, findFreeAgents }    from '@/lib/intelligence'
import { WorkflowCard, WorkflowStyles, WORKFLOW_CSS } from '@/components/workflow'
import { C, FONT } from '@/lib/ds'

export const metadata: Metadata = {
  title: 'Polaris OS — Football Operating System',
  description: 'Manage recruitment workflows, intelligence queries, and talent pipelines from one operating surface.',
}

function KPICard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div style={{
      background: '#FFFFFF', border: `1px solid ${C.border}`, borderRadius: 10,
      padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 6,
    }}>
      <div style={{ fontFamily: FONT.mono, fontSize: 8, color: C.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        {label}
      </div>
      <div style={{ fontFamily: FONT.display, fontSize: 32, fontWeight: 700, color: color ?? '#111827', letterSpacing: '-0.04em', lineHeight: 1 }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontFamily: FONT.sans, fontSize: 10, color: C.textSecondary }}>
          {sub}
        </div>
      )}
    </div>
  )
}

export default function OSHomePage() {
  const activeWorkflows = WORKFLOW_INSTANCES.filter(w => w.status === 'active')
  const expiring        = findExpiringContracts(12)
  const freeAgents      = findFreeAgents()
  const openMandates    = REQUESTS.filter(r => r.status === 'open')

  const stageDistribution = RECRUITMENT_STAGES.map(stage => ({
    stage,
    count: activeWorkflows.filter(w => w.currentStage === stage.id).length,
  }))

  return (
    <>
      <WorkflowStyles />
      <style>{WORKFLOW_CSS}</style>

      <div style={{ minHeight: '100vh', background: '#F9FAFB', padding: 'clamp(24px,4vw,48px)' }}>

        {/* OS header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 6, background: '#0A0A0A',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="5" stroke="white" strokeWidth="1.5" />
                <path d="M7 4V7L9 8.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <div style={{ fontFamily: FONT.mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.textMuted }}>
              Polaris OS · Football Operating System
            </div>
          </div>
          <h1 style={{
            fontFamily: FONT.display, fontSize: 'clamp(28px,4vw,42px)', fontWeight: 700,
            color: '#0A0A0A', letterSpacing: '-0.03em', textTransform: 'uppercase',
            lineHeight: 1, marginBottom: 8,
          }}>
            Recruitment<br />Dashboard
          </h1>
          <p style={{ fontFamily: FONT.sans, fontSize: 13, color: C.textSecondary, maxWidth: 500 }}>
            Overview of all active scouting operations, open mandates, and intelligence alerts.
          </p>
        </div>

        {/* KPI row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 36 }}>
          <KPICard label="Active Workflows" value={activeWorkflows.length} sub="across all mandates" color="#2563EB" />
          <KPICard label="Open Mandates"    value={openMandates.length}   sub="clubs seeking talent" />
          <KPICard label="Expiring Contracts" value={expiring.length}     sub="within 12 months" color="#D97706" />
          <KPICard label="Free Agents"       value={freeAgents.length}    sub="available now, no fee" color="#059669" />
          <KPICard label="Reports Filed"     value={DOMAIN_REPORTS.length} sub="scouting intelligence" />
        </div>

        {/* Pipeline stage distribution */}
        <div style={{ background: '#FFFFFF', border: `1px solid ${C.border}`, borderRadius: 10, padding: 20, marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ fontFamily: FONT.display, fontSize: 16, fontWeight: 700, color: '#111827', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
              Pipeline Stage Distribution
            </div>
            <Link href="/os/recruitment" style={{
              display: 'flex', alignItems: 'center', gap: 4,
              fontFamily: FONT.sans, fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
              color: C.blue, textDecoration: 'none',
            }}>
              All Workflows <ArrowRight size={10} />
            </Link>
          </div>
          <div style={{ display: 'flex', gap: 0, borderRadius: 6, overflow: 'hidden', height: 10, marginBottom: 12 }}>
            {stageDistribution.map(({ stage, count }) => (
              <div
                key={stage.id}
                style={{
                  flex: count > 0 ? count : 0.05,
                  background: count > 0 ? stage.color : '#F3F4F6',
                  transition: 'flex 0.3s',
                }}
              />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {stageDistribution.filter(d => d.count > 0).map(({ stage, count }) => (
              <div key={stage.id} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 7, height: 7, borderRadius: 2, background: stage.color }} />
                <span style={{ fontFamily: FONT.mono, fontSize: 8, color: C.textSecondary, letterSpacing: '0.04em' }}>
                  {stage.shortTitle} ({count})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Active workflows */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontFamily: FONT.display, fontSize: 20, fontWeight: 700, color: '#0A0A0A', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
              Active Workflows
            </h2>
            <Link href="/os/recruitment" style={{
              display: 'flex', alignItems: 'center', gap: 4,
              fontFamily: FONT.sans, fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
              color: C.blue, textDecoration: 'none',
            }}>
              View All <ArrowRight size={10} />
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {activeWorkflows.map(wf => (
              <WorkflowCard key={wf.id} workflow={wf} />
            ))}
          </div>
        </div>

        {/* Intelligence alerts */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontFamily: FONT.display, fontSize: 20, fontWeight: 700, color: '#0A0A0A', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
              Intelligence Alerts
            </h2>
            <Link href="/os/intelligence" style={{
              display: 'flex', alignItems: 'center', gap: 4,
              fontFamily: FONT.sans, fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
              color: C.blue, textDecoration: 'none',
            }}>
              Open Intelligence <ArrowRight size={10} />
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
            {/* Expiring contracts alert */}
            {expiring.length > 0 && (
              <Link href="/os/intelligence?q=expiring-contracts" style={{ textDecoration: 'none' }}>
                <div style={{
                  background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10,
                  padding: 16, display: 'flex', gap: 12, alignItems: 'flex-start',
                }}>
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Zap size={14} color="white" />
                  </div>
                  <div>
                    <div style={{ fontFamily: FONT.sans, fontSize: 12, fontWeight: 700, color: '#92400E', marginBottom: 3 }}>
                      {expiring.length} Expiring Contracts
                    </div>
                    <div style={{ fontFamily: FONT.sans, fontSize: 10, color: '#B45309', lineHeight: 1.5 }}>
                      Players entering final 12 months. Acquisition leverage available.
                    </div>
                  </div>
                </div>
              </Link>
            )}
            {/* Free agents alert */}
            {freeAgents.length > 0 && (
              <Link href="/os/intelligence?q=free-agents" style={{ textDecoration: 'none' }}>
                <div style={{
                  background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 10,
                  padding: 16, display: 'flex', gap: 12, alignItems: 'flex-start',
                }}>
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Target size={14} color="white" />
                  </div>
                  <div>
                    <div style={{ fontFamily: FONT.sans, fontSize: 12, fontWeight: 700, color: '#065F46', marginBottom: 3 }}>
                      {freeAgents.length} Free Agents Available
                    </div>
                    <div style={{ fontFamily: FONT.sans, fontSize: 10, color: '#047857', lineHeight: 1.5 }}>
                      Zero transfer fee. Available for immediate registration.
                    </div>
                  </div>
                </div>
              </Link>
            )}
            {/* EU passport alert */}
            <Link href="/os/intelligence?q=eu-passports" style={{ textDecoration: 'none' }}>
              <div style={{
                background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 10,
                padding: 16, display: 'flex', gap: 12, alignItems: 'flex-start',
              }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Brain size={14} color="white" />
                </div>
                <div>
                  <div style={{ fontFamily: FONT.sans, fontSize: 12, fontWeight: 700, color: '#1E40AF', marginBottom: 3 }}>
                    EU Passport Profiles
                  </div>
                  <div style={{ fontFamily: FONT.sans, fontSize: 10, color: '#1D4ED8', lineHeight: 1.5 }}>
                    Review players with EU passport eligibility for registration planning.
                  </div>
                </div>
              </div>
            </Link>
            {/* Mandate matching alert */}
            <Link href="/os/intelligence?q=match-brugge-cm" style={{ textDecoration: 'none' }}>
              <div style={{
                background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10,
                padding: 16, display: 'flex', gap: 12, alignItems: 'flex-start',
              }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <GitBranch size={14} color="white" />
                </div>
                <div>
                  <div style={{ fontFamily: FONT.sans, fontSize: 12, fontWeight: 700, color: '#991B1B', marginBottom: 3 }}>
                    Brugge CM — Match Ready
                  </div>
                  <div style={{ fontFamily: FONT.sans, fontSize: 10, color: '#DC2626', lineHeight: 1.5 }}>
                    Run the intelligence matcher for Club Brugge's open CM mandate.
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* OS navigation tiles */}
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 28 }}>
          <div style={{ fontFamily: FONT.mono, fontSize: 8, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.textMuted, marginBottom: 14 }}>
            OS Modules
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[
              { href: '/os/recruitment', label: 'Recruitment Pipeline', desc: 'All active workflows' },
              { href: '/os/intelligence', label: 'Intelligence Engine', desc: 'Pre-built queries & matching' },
              { href: '/platform', label: 'Entity Graph', desc: 'Players, clubs, agents, mandates' },
              { href: '/reports/player', label: 'Scouting Reports', desc: 'Published player reports' },
            ].map(tile => (
              <Link key={tile.href} href={tile.href} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: '#FFFFFF', border: `1px solid ${C.border}`, borderRadius: 8,
                  padding: '12px 16px', minWidth: 160,
                }}>
                  <div style={{ fontFamily: FONT.sans, fontSize: 12, fontWeight: 700, color: '#111827', marginBottom: 2 }}>
                    {tile.label}
                  </div>
                  <div style={{ fontFamily: FONT.sans, fontSize: 10, color: C.textMuted }}>{tile.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </>
  )
}
