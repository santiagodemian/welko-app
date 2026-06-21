import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { WORKFLOW_INSTANCES } from '@/lib/workflows'
import { RECRUITMENT_STAGES } from '@/lib/workflows/recruitment'
import { WorkflowCard, WorkflowStyles, WORKFLOW_CSS } from '@/components/workflow'
import { C, FONT } from '@/lib/ds'

export const metadata: Metadata = {
  title: 'Recruitment Pipeline — Polaris OS',
  description: 'All active and completed recruitment workflows.',
}

export default function RecruitmentPage() {
  const active    = WORKFLOW_INSTANCES.filter(w => w.status === 'active')
  const completed = WORKFLOW_INSTANCES.filter(w => w.status === 'completed')
  const onHold    = WORKFLOW_INSTANCES.filter(w => w.status === 'on-hold')

  return (
    <>
      <WorkflowStyles />
      <style>{WORKFLOW_CSS}</style>

      <div style={{ minHeight: '100vh', background: '#F9FAFB', padding: 'clamp(24px,4vw,48px)' }}>

        {/* Back nav */}
        <div style={{ marginBottom: 24 }}>
          <Link href="/os" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontFamily: FONT.sans, fontSize: 11, fontWeight: 600, color: C.textSecondary,
            textDecoration: 'none', letterSpacing: '0.02em',
          }}>
            <ArrowLeft size={12} /> Polaris OS
          </Link>
        </div>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontFamily: FONT.mono, fontSize: 8, color: C.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
            Recruitment Module
          </div>
          <h1 style={{
            fontFamily: FONT.display, fontSize: 'clamp(28px,4vw,40px)', fontWeight: 700,
            color: '#0A0A0A', letterSpacing: '-0.03em', textTransform: 'uppercase', lineHeight: 1, marginBottom: 8,
          }}>
            Recruitment<br />Pipeline
          </h1>
          <p style={{ fontFamily: FONT.sans, fontSize: 13, color: C.textSecondary, maxWidth: 500 }}>
            Every active scouting operation, from mandate intake to outcome tracking.
          </p>
        </div>

        {/* Stage legend */}
        <div style={{ background: '#FFFFFF', border: `1px solid ${C.border}`, borderRadius: 10, padding: '14px 20px', marginBottom: 28 }}>
          <div style={{ fontFamily: FONT.mono, fontSize: 7, color: C.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
            8-Stage Recruitment Process
          </div>
          <div style={{ display: 'flex', gap: 3, marginBottom: 8 }}>
            {RECRUITMENT_STAGES.map(stage => (
              <div key={stage.id} title={stage.title} style={{ flex: 1, height: 4, borderRadius: 2, background: stage.color }} />
            ))}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {RECRUITMENT_STAGES.map(stage => (
              <div key={stage.id} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 7, height: 7, borderRadius: 2, background: stage.color }} />
                <span style={{ fontFamily: FONT.mono, fontSize: 8, color: C.textSecondary, letterSpacing: '0.03em' }}>
                  {stage.num}. {stage.shortTitle}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Active workflows */}
        <section style={{ marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 16 }}>
            <h2 style={{ fontFamily: FONT.display, fontSize: 20, fontWeight: 700, color: '#0A0A0A', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
              Active
            </h2>
            <span style={{
              fontFamily: FONT.mono, fontSize: 10, fontWeight: 700,
              color: '#2563EB', background: '#EFF6FF', border: '1px solid #BFDBFE',
              borderRadius: 20, padding: '1px 8px',
            }}>
              {active.length}
            </span>
          </div>
          {active.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
              {active.map(wf => <WorkflowCard key={wf.id} workflow={wf} />)}
            </div>
          ) : (
            <div style={{ fontFamily: FONT.sans, fontSize: 12, color: C.textMuted, padding: '20px 0' }}>
              No active workflows.
            </div>
          )}
        </section>

        {/* On hold */}
        {onHold.length > 0 && (
          <section style={{ marginBottom: 36 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 16 }}>
              <h2 style={{ fontFamily: FONT.display, fontSize: 20, fontWeight: 700, color: '#0A0A0A', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
                On Hold
              </h2>
              <span style={{
                fontFamily: FONT.mono, fontSize: 10, fontWeight: 700,
                color: '#D97706', background: '#FFFBEB', border: '1px solid #FDE68A',
                borderRadius: 20, padding: '1px 8px',
              }}>
                {onHold.length}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
              {onHold.map(wf => <WorkflowCard key={wf.id} workflow={wf} />)}
            </div>
          </section>
        )}

        {/* Completed */}
        {completed.length > 0 && (
          <section>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 16 }}>
              <h2 style={{ fontFamily: FONT.display, fontSize: 20, fontWeight: 700, color: '#0A0A0A', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
                Completed
              </h2>
              <span style={{
                fontFamily: FONT.mono, fontSize: 10, fontWeight: 700,
                color: '#059669', background: '#ECFDF5', border: '1px solid #A7F3D0',
                borderRadius: 20, padding: '1px 8px',
              }}>
                {completed.length}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
              {completed.map(wf => <WorkflowCard key={wf.id} workflow={wf} />)}
            </div>
          </section>
        )}

      </div>
    </>
  )
}
