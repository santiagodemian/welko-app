import Link from 'next/link'
import { Suspense } from 'react'
import { Users, GitBranch, FileSearch, ArrowRight, Check, Zap, Shield, Target } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { RefTracker } from '@/components/layout/RefTracker'
import { HeroMockup } from '@/components/landing/HeroMockup'

const N = '#0A1628'
const G = '#1E6FEB'

export default function HomePage() {
  return (
    <div style={{ fontFamily: 'var(--font-montserrat), sans-serif', background: '#fff', minHeight: '100vh' }}>

      <style>{`
        .lp-hero       { padding: 80px 24px 0 !important; }
        .lp-stats      { grid-template-columns: repeat(3, 1fr) !important; }
        .lp-pricing    { grid-template-columns: 1fr 1fr !important; }
        .lp-footer-nav { display: flex !important; }
        .lp-footer-grid{ grid-template-columns: 1fr auto auto !important; }
        .lp-affiliate  { flex-direction: row !important; }
        .lp-hero-p     { font-size: 18px !important; }
        .lp-how-grid   { grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)) !important; }
        @media (max-width: 640px) {
          .lp-hero      { padding: 52px 20px 0 !important; }
          .lp-hero-p    { font-size: 15px !important; }
          .lp-stats     { grid-template-columns: 1fr !important; }
          .lp-stat-border { border-right: none !important; border-bottom: 1px solid #E5E7EB; }
          .lp-stat-last  { border-bottom: none !important; }
          .lp-pricing    { grid-template-columns: 1fr !important; }
          .lp-affiliate  { flex-direction: column !important; align-items: flex-start !important; }
          .lp-footer-grid{ grid-template-columns: 1fr !important; gap: 28px !important; }
          .lp-footer-nav { display: none !important; }
          .lp-how-grid   { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 400px) {
          .lp-how-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <Navbar />
      <Suspense fallback={null}><RefTracker /></Suspense>

      {/* ── Hero ── */}
      <section className="lp-hero" style={{ background: N, textAlign: 'center', overflow: 'hidden', position: 'relative' }}>
        {/* Background glow orbs */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 400, background: 'radial-gradient(ellipse, rgba(30,111,235,0.18) 0%, transparent 70%)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: '30%', left: '-5%', width: 300, height: 300, background: 'radial-gradient(ellipse, rgba(30,111,235,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: '20%', right: '-5%', width: 350, height: 350, background: 'radial-gradient(ellipse, rgba(59,130,246,0.06) 0%, transparent 70%)', borderRadius: '50%' }} />
          {/* Dot grid */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04 }} xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
                <circle cx="1.5" cy="1.5" r="1.5" fill="#fff" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>
        <div style={{ maxWidth: 760, margin: '0 auto', position: 'relative' }}>
          <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: G, background: 'rgba(30,111,235,0.12)', padding: '4px 14px', borderRadius: 99, marginBottom: 24 }}>
            Football Agency Platform
          </span>
          <h1 style={{ fontSize: 'clamp(28px, 6vw, 58px)', fontWeight: 900, color: '#fff', lineHeight: 1.08, letterSpacing: '-0.03em', margin: '0 0 20px' }}>
            The Operating System<br />for <span style={{ color: G }}>Football Agents</span>
          </h1>
          <p className="lp-hero-p" style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, maxWidth: 540, margin: '0 auto 40px' }}>
            Manage your entire player roster, track transfers through a live pipeline, and convert club mandates into signed deals — all in one place.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/registro" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: G, color: '#fff', padding: '14px 28px', borderRadius: 12, fontWeight: 800, fontSize: 15, textDecoration: 'none' }}>
              Start for free <ArrowRight size={16} />
            </Link>
            <Link href="/demo" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1.5px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.85)', padding: '14px 28px', borderRadius: 12, fontWeight: 600, fontSize: 15, textDecoration: 'none' }}>
              Book a demo
            </Link>
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 20 }}>
            Free Scout plan — no credit card required
          </p>
        </div>

        <HeroMockup />
      </section>

      {/* ── Stats strip ── */}
      <div style={{ background: 'white', borderBottom: '1px solid #E5E7EB' }}>
        <div className="lp-stats" style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px', display: 'grid' }}>
          {[
            { n: '< 5 min', label: 'To set up your agency', cls: 'lp-stat-border' },
            { n: '€0',      label: 'To get started, forever', cls: 'lp-stat-border' },
            { n: 'AI',      label: 'Mandate matching built-in', cls: 'lp-stat-last' },
          ].map((s, i) => (
            <div key={i} className={s.cls} style={{ padding: '28px 20px', textAlign: 'center', borderRight: i < 2 ? '1px solid #E5E7EB' : 'none' }}>
              <p style={{ fontSize: 32, fontWeight: 900, color: N, margin: '0 0 4px', letterSpacing: '-0.03em' }}>{s.n}</p>
              <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Pain point banner ── */}
      <div style={{ background: '#FFF7ED', borderBottom: '1px solid #FDE68A', padding: '20px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: 14, color: '#92400E', margin: 0, fontWeight: 600 }}>
          Still managing 50 players in WhatsApp and Excel? There&apos;s a better way. 👇
        </p>
      </div>

      {/* ── Core features ── */}
      <section style={{ padding: 'clamp(48px,8vw,80px) 24px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: G, margin: '0 0 12px' }}>Everything your agency needs</p>
          <h2 style={{ fontSize: 'clamp(22px, 4vw, 38px)', fontWeight: 800, color: N, letterSpacing: '-0.02em', margin: 0 }}>
            From WhatsApp mandate to signed deal
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {[
            {
              icon: Users,
              color: N,
              title: 'Player Roster',
              desc: 'Centralize every player profile with ELO ratings, contract expiry alerts, salary expectations, and verification status. Filter in seconds, never lose a lead.',
            },
            {
              icon: GitBranch,
              color: '#059669',
              title: 'Transfer Pipeline',
              desc: 'Kanban board for every active negotiation. Drag deals from Initial Contact to Contract Closure. See total pipeline value at a glance.',
            },
            {
              icon: Target,
              color: '#DC2626',
              title: 'Outreach Tracking',
              desc: 'Know exactly who you messaged, who replied, and who needs a follow-up. Log Instagram DMs, calls, and WhatsApp contacts in one click.',
            },
            {
              icon: FileSearch,
              color: '#7C3AED',
              title: 'Mandate Parser (AI)',
              desc: 'Paste a raw club request from your WhatsApp group. AI extracts position, budget, and age — then scores your players for fit automatically.',
            },
            {
              icon: Zap,
              color: '#F59E0B',
              title: 'Smart Alerts',
              desc: 'Contract expiry warnings 90/30/7 days out. Never miss a free agent window because you forgot to check a spreadsheet.',
            },
            {
              icon: Shield,
              color: '#0891B2',
              title: 'White-label Proposals',
              desc: 'Generate PDF player proposals with your agency branding in one click. Send to clubs looking professional from day one.',
            },
          ].map((f, i) => (
            <div key={i} style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 20, padding: '28px 24px' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${f.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <f.icon size={20} color={f.color} />
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: N, margin: '0 0 8px', letterSpacing: '-0.01em' }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ background: N, padding: 'clamp(48px,8vw,80px) 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: G, margin: '0 0 12px' }}>How it works</p>
          <h2 style={{ fontSize: 'clamp(20px, 3.5vw, 34px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', margin: '0 0 48px' }}>
            Set up your agency in minutes
          </h2>
          <div className="lp-how-grid" style={{ display: 'grid', gap: 16 }}>
            {[
              { n: '01', title: 'Create your agency',  desc: 'Sign up, name your agency, upload your logo. Done in under 5 minutes.' },
              { n: '02', title: 'Add your players',    desc: 'Import or enter player profiles with stats, contract data, and contact info.' },
              { n: '03', title: 'Receive mandates',    desc: 'Paste any club WhatsApp message. AI extracts what they need and matches your roster.' },
              { n: '04', title: 'Close deals',         desc: 'Track every negotiation from first contact to signed contract. Log every call, DM, and meeting.' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '24px 20px', textAlign: 'left' }}>
                <p style={{ fontSize: 26, fontWeight: 900, color: G, margin: '0 0 10px', letterSpacing: '-0.03em' }}>{s.n}</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: '0 0 6px' }}>{s.title}</p>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Vs. the alternatives ── */}
      <section style={{ padding: 'clamp(48px,8vw,80px) 24px', maxWidth: 860, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: G, margin: '0 0 12px' }}>Why Welko</p>
          <h2 style={{ fontSize: 'clamp(20px, 3.5vw, 34px)', fontWeight: 800, color: N, letterSpacing: '-0.02em', margin: 0 }}>
            Built for agents, not clubs
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          {[
            { label: 'Excel + WhatsApp', icon: '📊', points: ['No pipeline tracking', 'Mandates lost in chat', 'No contract alerts'], bad: true },
            { label: 'Generic CRM',      icon: '🔧', points: ['No ELO ratings', 'No market windows', 'No football context'], bad: true },
            { label: 'Wyscout / InStat', icon: '💸', points: ['€1,000+/month', 'Built for clubs, not agents', 'Complex, overkill'], bad: true },
            { label: 'Welko AgentOS',    icon: '⚽', points: ['AI mandate parsing', 'Pipeline + commissions', '€0 to start'], highlight: true },
          ].map((r, i) => (
            <div key={i} style={{
              background: r.highlight ? N : 'white',
              border: r.highlight ? `2px solid ${G}` : '1px solid #E5E7EB',
              borderRadius: 16, padding: '22px 20px',
              boxShadow: r.highlight ? '0 8px 32px rgba(30,111,235,0.15)' : '0 1px 4px rgba(0,0,0,0.04)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 20 }}>{r.icon}</span>
                <p style={{ fontSize: 14, fontWeight: 800, color: r.highlight ? '#fff' : N, margin: 0 }}>{r.label}</p>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {r.points.map((pt, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                    <span style={{ flexShrink: 0 }}>{r.highlight ? '✓' : '✗'}</span>
                    <span style={{ color: r.highlight ? 'rgba(255,255,255,0.8)' : '#6B7280' }}>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing teaser ── */}
      <section style={{ padding: 'clamp(0px,2vw,20px) 24px clamp(48px,8vw,80px)', maxWidth: 860, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: G, margin: '0 0 12px' }}>Simple pricing</p>
          <h2 style={{ fontSize: 'clamp(20px, 3.5vw, 34px)', fontWeight: 800, color: N, letterSpacing: '-0.02em', margin: 0 }}>
            Start free. Upgrade when you grow.
          </h2>
        </div>
        <div className="lp-pricing" style={{ display: 'grid', gap: 20 }}>
          <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 20, padding: '32px 28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Shield size={16} color="#6B7280" />
              <p style={{ fontSize: 13, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>Scout</p>
            </div>
            <p style={{ fontSize: 38, fontWeight: 900, color: N, margin: '0 0 4px', letterSpacing: '-0.03em' }}>Free</p>
            <p style={{ fontSize: 13, color: '#9CA3AF', margin: '0 0 24px' }}>Forever, no credit card</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['1 user seat', 'Up to 5 player profiles', 'Transfer pipeline', 'Club mandate inbox', 'Outreach board'].map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#374151' }}>
                  <Check size={15} color="#059669" /> {f}
                </li>
              ))}
            </ul>
            <Link href="/registro" style={{ display: 'block', textAlign: 'center', background: '#F3F4F6', color: N, padding: '12px', borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
              Get started free
            </Link>
          </div>
          <div style={{ background: N, border: '2px solid ' + G, borderRadius: 20, padding: '32px 28px', position: 'relative' }}>
            <span style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: G, color: '#fff', fontSize: 11, fontWeight: 800, padding: '4px 14px', borderRadius: 99, whiteSpace: 'nowrap' }}>
              MOST POPULAR
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Zap size={16} color={G} />
              <p style={{ fontSize: 13, fontWeight: 700, color: G, textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>AgentOS Premium</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
              <p style={{ fontSize: 38, fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '-0.03em' }}>€39</p>
              <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>/month</span>
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: '0 0 24px' }}>or €299/year (save ~35%)</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['Unlimited users & players', 'AI mandate matching', 'White-label PDF proposals', 'Contract expiry alerts', 'Brand kit upload', 'Priority support'].map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'rgba(255,255,255,0.85)' }}>
                  <Check size={15} color={G} /> {f}
                </li>
              ))}
            </ul>
            <Link href="/pricing" style={{ display: 'block', textAlign: 'center', background: G, color: '#fff', padding: '12px', borderRadius: 10, fontWeight: 800, fontSize: 14, textDecoration: 'none' }}>
              Upgrade to Premium →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Affiliate CTA ── */}
      <div style={{ background: 'white', borderTop: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB', padding: 'clamp(28px,5vw,40px) 24px' }}>
        <div className="lp-affiliate" style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: G, margin: '0 0 6px' }}>Affiliate Program</p>
            <p style={{ fontSize: 18, fontWeight: 800, color: N, margin: '0 0 6px' }}>Know football agencies? Earn with us.</p>
            <p style={{ fontSize: 14, color: '#6B7280', margin: 0 }}>Refer agencies and earn €50 per annual conversion. No cap, no expiry.</p>
          </div>
          <Link href="/partners" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: N, color: 'white', padding: '13px 26px', borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: 'none', whiteSpace: 'nowrap' }}>
            Join as affiliate <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      {/* ── Founder's Manifesto ── */}
      <section style={{ background: N, padding: 'clamp(48px,8vw,80px) 24px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: G, margin: '0 0 24px' }}>A Letter from the Founder</p>
          <blockquote style={{ margin: 0, padding: 0, borderLeft: `3px solid ${G}`, paddingLeft: 24 }}>
            <p style={{ fontSize: 'clamp(15px,2.5vw,18px)', color: 'rgba(255,255,255,0.85)', lineHeight: 1.8, margin: '0 0 24px', fontStyle: 'italic' }}>
              &ldquo;The world&apos;s top football agencies have had custom CRMs, automated mandate pipelines, and data-driven transfer tools for decades. Independent agents — representing over 90% of the market — have been managing multi-million-euro deals in WhatsApp groups and Excel spreadsheets. That ends today.
            </p>
            <p style={{ fontSize: 'clamp(15px,2.5vw,18px)', color: 'rgba(255,255,255,0.85)', lineHeight: 1.8, margin: '0 0 32px', fontStyle: 'italic' }}>
              Welko AgentOS was built by an agent, for agents. Every feature exists because I lived the problem firsthand. We&apos;re not a generic CRM with a football skin — we are the operating system that levels the playing field.&rdquo;
            </p>
          </blockquote>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: G, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: 16, fontWeight: 900, color: '#fff' }}>D</span>
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: '0 0 2px' }}>Demian Santiago Mendoza Ledesma</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', margin: 0 }}>Founder, Welko AgentOS</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section style={{ padding: 'clamp(48px,8vw,80px) 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 580, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(22px, 4vw, 40px)', fontWeight: 900, color: N, letterSpacing: '-0.03em', margin: '0 0 16px' }}>
            Ready to run your agency<br />like a professional?
          </h2>
          <p style={{ fontSize: 'clamp(14px,2vw,16px)', color: '#6B7280', lineHeight: 1.7, margin: '0 0 36px' }}>
            Join the agents already using Welko AgentOS to close deals faster. Free to start, no credit card required.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/registro" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: N, color: 'white', padding: '16px 36px', borderRadius: 12, fontWeight: 800, fontSize: 16, textDecoration: 'none' }}>
              Start for free today <ArrowRight size={17} />
            </Link>
            <Link href="/demo" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '2px solid #E5E7EB', color: N, padding: '16px 28px', borderRadius: 12, fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
              Book a demo
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: N, borderTop: '1px solid rgba(255,255,255,0.08)', padding: 'clamp(36px,6vw,48px) 24px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="lp-footer-grid" style={{ display: 'grid', gap: 40, marginBottom: 40, alignItems: 'start' }}>
            <div>
              <span style={{ fontSize: 18, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
                Welko <span style={{ color: G }}>AgentOS</span>
              </span>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: '8px 0 0', lineHeight: 1.6, maxWidth: 260 }}>
                The operating system for football agents. Manage players, mandates, and transfers — all in one place.
              </p>
            </div>
            <nav className="lp-footer-nav" style={{ flexDirection: 'column', gap: 10 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>Product</p>
              {[
                { label: 'Pricing',    href: '/pricing'  },
                { label: 'Demo',       href: '/demo'     },
                { label: 'Affiliates', href: '/partners' },
              ].map(l => (
                <Link key={l.href} href={l.href} style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>{l.label}</Link>
              ))}
            </nav>
            <nav className="lp-footer-nav" style={{ flexDirection: 'column', gap: 10 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>Legal</p>
              {[
                { label: 'Terms',   href: '/terminos'  },
                { label: 'Privacy', href: '/privacidad' },
                { label: 'Support', href: '/soporte'    },
              ].map(l => (
                <Link key={l.href} href={l.href} style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>{l.label}</Link>
              ))}
            </nav>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', margin: 0 }}>
              © {new Date().getFullYear()} Welko AgentOS · welko.agency
            </p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', margin: 0 }}>
              Demian Santiago Mendoza Ledesma
            </p>
          </div>
        </div>
      </footer>

    </div>
  )
}
