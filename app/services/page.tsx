import type { CSSProperties } from 'react'
import Link from 'next/link'
import { ArrowRight, Shield, FileText, Users, Star, Globe2, BarChart3, Handshake, Zap } from 'lucide-react'
import { Navbar }       from '@/components/layout/Navbar'
import { Footer }       from '@/components/layout/Footer'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { C, BTN, FONT } from '@/lib/ds'

/* Shared heading style */
const SH: CSSProperties = {
  fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif',
  fontSize:   'clamp(38px, 4.8vw, 60px)',
  fontWeight: 700,
  lineHeight: 0.92,
  letterSpacing: '-0.035em',
  textTransform: 'uppercase',
  margin: 0,
}

const SERVICES = [
  {
    id:           'career-management',
    tag:          'What We Do',
    headline:     'Career',
    headlineBlue: 'Management',
    sub: 'We guide players at every stage of their career with strategic planning, personal development and the right opportunities to reach their full potential.',
    photo: '/diseño3.jpeg',
    features: [
      { icon: Shield,   title: 'Strategic Planning',  desc: 'Long-term career roadmap tailored to each player.' },
      { icon: BarChart3,title: 'Development',         desc: 'Maximizing performance on and off the pitch.' },
      { icon: Globe2,   title: 'Opportunities',       desc: 'Connecting players with clubs, trials and career opportunities.' },
      { icon: Star,     title: 'Continuous Support',  desc: "We're with our players every step of the way." },
    ],
  },
  {
    id:           'contract-negotiation',
    tag:          'What We Do',
    headline:     'Contract',
    headlineBlue: 'Negotiation',
    sub: "We handle every detail to secure the best possible terms and protect our players' interests at every step.",
    photo: '/diseño5.jpeg',
    features: [
      { icon: Shield,   title: 'Best Terms',           desc: 'We negotiate the best possible terms for your career and future.' },
      { icon: FileText, title: 'Contract Review',      desc: 'Our experts review every clause to protect your rights.' },
      { icon: Handshake,title: 'Club Liaison',         desc: 'Direct communication with clubs to reach successful agreements.' },
      { icon: Zap,      title: 'Secure & Transparent', desc: 'A secure, transparent and professional negotiation process.' },
    ],
  },
  {
    id:           'club-connections',
    tag:          'What We Do',
    headline:     'Club',
    headlineBlue: 'Connections',
    sub: 'We build strong relationships with clubs worldwide to create opportunities and drive successful partnerships.',
    photo: '/diseño6.jpeg',
    features: [
      { icon: Globe2,   title: 'Global Network',          desc: 'Access to a worldwide network of top clubs and decision makers.' },
      { icon: Users,    title: 'Strong Relationships',    desc: 'Long-term partnerships built on trust and results.' },
      { icon: Handshake,title: 'Mutual Growth',           desc: 'Creating value for players and clubs through strategic collaborations.' },
      { icon: Star,     title: 'Exclusive Opportunities', desc: 'Opening doors to opportunities not available to everyone.' },
    ],
  },
  {
    id:           'personal-branding',
    tag:          'Personal Branding',
    headline:     'Building Your Identity',
    headlineBlue: 'On and Off The Pitch.',
    sub: 'We help players grow their personal brand, increase their visibility and maximize opportunities worldwide.',
    photo: '/diseño4.jpeg',
    features: [
      { icon: Star,     title: 'Media & Content',        desc: 'Professional shoots, videos and content that elevate your image.' },
      { icon: Globe2,   title: 'Social Media Strategy',  desc: 'Strategic positioning across all digital platforms.' },
      { icon: Users,    title: 'Global Visibility',      desc: 'Connect with brands, clubs and new opportunities.' },
      { icon: BarChart3,title: 'Partnerships',           desc: 'Access premium endorsement and sponsorship deals.' },
    ],
  },
]

export default function ServicesPage() {
  return (
    <div style={{ fontFamily: FONT.sans, background: '#fff', minHeight: '100vh' }}>
      <style>{`
        /* ─── Split sections (identical approach to homepage) ─── */
        /* Image fills 100% of the section; white coded panel (38%) covers the
           left portion — same ratio as every mockup image's text panel. */
        .sv-wrap  { position: relative; overflow: hidden; }
        .sv-photo {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover; object-position: center top;
        }
        .sv-panel {
          position: relative; z-index: 1;
          width: 38%; background: #fff;
          padding: clamp(72px,9vw,112px) clamp(44px,5vw,84px);
          min-height: 620px;
          display: flex; flex-direction: column; justify-content: center;
        }

        /* ─── CRM band ─── */
        .crm-band { display: grid; grid-template-columns: 56fr 44fr; }
        .crm-dark {
          background: #0A0A0A; overflow: hidden; position: relative;
          padding: clamp(40px,5vw,64px) clamp(36px,4vw,56px) 0;
          min-height: 560px;
        }
        .crm-light {
          background: #F9FAFB;
          padding: clamp(72px,9vw,112px) clamp(44px,5vw,80px);
          display: flex; flex-direction: column; justify-content: center;
        }

        /* ─── Service tabs ─── */
        .sv-tab {
          display: flex; align-items: center; gap: 8;
          padding: 16px 22px; border-bottom: 2px solid transparent;
          font-size: 11px; font-weight: 700; color: #9CA3AF;
          text-decoration: none; letter-spacing: 0.08em; text-transform: uppercase;
          white-space: nowrap; transition: color 0.15s, border-color 0.15s;
        }
        .sv-tab:hover { color: #0A0A0A; border-color: rgba(37,99,235,0.35); }

        /* ─── Responsive ─── */
        @media (max-width: 900px) {
          .sv-wrap  { display: flex !important; flex-direction: column !important; }
          .sv-photo { position: relative !important; inset: unset !important; height: 300px !important; width: 100% !important; }
          .sv-panel { width: 100% !important; min-height: 0 !important; }
          .crm-band { display: flex !important; flex-direction: column !important; }
          .crm-dark { min-height: 260px !important; }
          .crm-light { padding: 56px 24px !important; }
        }
        @media (max-width: 600px) {
          .sv-panel { padding: 48px 20px !important; }
        }

        /* ─── Hover ─── */
        .btn-primary:hover { background: #1D4ED8 !important; }
        .ghost-link:hover  { opacity: .65; }
      `}</style>

      <Navbar />

      {/* ━━━ PAGE HERO ━━━ */}
      <section style={{ background: '#0A0A0A', padding: 'clamp(72px,9vw,112px) clamp(44px,5vw,84px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <SectionLabel color="#ffffff" marginBottom={36}>What We Do</SectionLabel>
          <h1 style={{
            fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif',
            fontSize: 'clamp(52px,7vw,88px)', fontWeight: 700,
            lineHeight: 0.9, letterSpacing: '-0.04em', textTransform: 'uppercase',
            color: '#fff', margin: '0 0 24px',
          }}>
            Full-Service<br /><span style={{ color: C.blue }}>Representation</span>
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.42)', lineHeight: 1.75, maxWidth: 480, margin: 0, fontFamily: FONT.sans }}>
            From career planning to contract negotiation, we are with our players every step of the way.
          </p>
        </div>
      </section>

      {/* ━━━ SERVICE TABS ━━━ */}
      <section style={{ background: '#FAFAFA', borderBottom: `1px solid ${C.border}`, padding: '0 clamp(24px,4vw,64px)', overflowX: 'auto' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex' }}>
          {SERVICES.map(s => (
            <a key={s.id} href={`#${s.id}`} className="sv-tab" style={{ fontFamily: FONT.sans }}>
              {s.headlineBlue}
            </a>
          ))}
        </div>
      </section>

      {/* ━━━ SERVICE SECTIONS ━━━ */}
      {SERVICES.map(s => (
        <section key={s.id} id={s.id} className="sv-wrap" style={{ borderBottom: `1px solid ${C.border}` }}>
          {/* Full-section background — each composite image fills the section.
              The white coded panel (38%) covers the left text area of the mockup
              at exactly the same proportion. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="sv-photo" src={s.photo} alt="" aria-hidden="true" />

          <div className="sv-panel">
            <SectionLabel marginBottom={32}>{s.tag}</SectionLabel>

            <h2 style={{ ...SH, color: '#0A0A0A', marginBottom: 4 }}>{s.headline}</h2>
            <h2 style={{ ...SH, color: C.blue,    marginBottom: 28 }}>{s.headlineBlue}</h2>

            <p style={{ fontSize: 14, color: '#4B5563', lineHeight: 1.8, maxWidth: 360, margin: '0 0 40px', fontFamily: FONT.sans }}>
              {s.sub}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
              {s.features.map(({ icon: Icon, title, desc }) => (
                <div key={title} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <span style={{ flexShrink: 0, display: 'flex', marginTop: 1 }}>
                    <Icon size={14} color={C.blue} />
                  </span>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#0A0A0A', margin: '0 0 4px', fontFamily: FONT.sans }}>{title}</p>
                    <p style={{ fontSize: 13, color: '#6B7280', margin: 0, lineHeight: 1.65, fontFamily: FONT.sans }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 44 }}>
              <Link href="/contact" className="ghost-link" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#0A0A0A', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 7, borderBottom: '1.5px solid #0A0A0A', paddingBottom: 2, fontFamily: FONT.sans }}>
                Get Started <ArrowRight size={11} />
              </Link>
            </div>
          </div>
        </section>
      ))}

      {/* ━━━ PLATFORM BAND ━━━ */}
      {/* CRM shown as contained product screenshot — same technique as homepage */}
      <section className="crm-band" style={{ borderBottom: `1px solid ${C.border}` }}>
        <div className="crm-dark">
          <div style={{ position: 'absolute', top: 28, left: 28, zIndex: 2 }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', background: C.blue, color: '#fff', padding: '5px 14px', borderRadius: 6, fontFamily: FONT.sans }}>
              Agent CRM
            </span>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/diseño10.jpeg"
            alt="Polaris CRM Dashboard"
            style={{ width: '100%', borderRadius: '10px 10px 0 0', display: 'block', boxShadow: '0 -12px 48px rgba(37,99,235,0.14), 0 0 0 1px rgba(255,255,255,0.06)', marginTop: 52 }}
          />
        </div>
        <div className="crm-light">
          <SectionLabel marginBottom={32}>Our Platform</SectionLabel>
          <h2 style={{ ...SH, color: '#0A0A0A', marginBottom: 4 }}>Your Career.</h2>
          <h2 style={{ ...SH, color: C.blue,    marginBottom: 28 }}>Managed End-to-End.</h2>
          <p style={{ fontSize: 14, color: '#4B5563', lineHeight: 1.8, maxWidth: 360, margin: '0 0 40px', fontFamily: FONT.sans }}>
            Our proprietary agent platform gives Polaris clients complete visibility into their career pipeline — transfers, contracts, negotiations and opportunities in one place.
          </p>
          <Link href="/login" className="btn-primary" style={{ ...BTN.primary, width: 'fit-content' }}>
            Access the Platform <ArrowRight size={13} />
          </Link>
        </div>
      </section>

      {/* ━━━ CTA ━━━ */}
      <section style={{ background: '#0A0A0A', padding: 'clamp(72px,9vw,112px) 40px' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif',
            fontSize: 'clamp(36px,5vw,60px)', fontWeight: 700,
            lineHeight: 0.92, letterSpacing: '-0.035em', textTransform: 'uppercase',
            color: '#fff', margin: '0 0 8px',
          }}>
            Ready to take
          </h2>
          <h2 style={{
            fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif',
            fontSize: 'clamp(36px,5vw,60px)', fontWeight: 700,
            lineHeight: 0.92, letterSpacing: '-0.035em', textTransform: 'uppercase',
            color: C.blue, margin: '0 0 28px',
          }}>
            the next step?
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', lineHeight: 1.75, margin: '0 auto 44px', maxWidth: 340, fontFamily: FONT.sans }}>
            Get in touch and let us show you what full-service representation truly means.
          </p>
          <Link href="/contact" className="btn-primary" style={{ ...BTN.primary }}>
            Contact Us <ArrowRight size={13} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
