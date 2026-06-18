import Link from 'next/link'
import { ArrowRight, Shield, FileText, Users, Star } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { C } from '@/lib/ds'

const N = C.dark
const G = C.blue

const SERVICES = [
  {
    id: 'career-management',
    label: 'Career Management',
    icon: Shield,
    tag: 'Service 01',
    headline: 'Career',
    headlineBlue: 'Management',
    sub: 'We guide players at every stage of their career with strategic planning, personal development and the right opportunities to reach their full potential.',
    photo: '/diseño3.jpeg',
    features: [
      { title: 'Strategic Planning',    desc: 'Long-term career roadmap tailored to each player.' },
      { title: 'Development',           desc: 'Maximizing performance on and off the pitch.' },
      { title: 'Opportunities',         desc: 'Connecting players with clubs, trials and career opportunities.' },
      { title: 'Continuous Support',    desc: "We're with our players every step of the way." },
    ],
  },
  {
    id: 'contract-negotiation',
    label: 'Contract Negotiation',
    icon: FileText,
    tag: 'Service 02',
    headline: 'Contract',
    headlineBlue: 'Negotiation',
    sub: "We handle every detail to secure the best possible terms and protect our players' interests at every step.",
    photo: '/diseño5.jpeg',
    features: [
      { title: 'Best Terms',            desc: 'We negotiate the best possible terms for your career and future.' },
      { title: 'Contract Review',       desc: 'Our experts review every clause to protect your rights.' },
      { title: 'Club Liaison',          desc: 'Direct communication with clubs to reach successful agreements.' },
      { title: 'Secure & Transparent',  desc: 'We ensure a secure, transparent and professional negotiation process.' },
    ],
    reverse: true,
  },
  {
    id: 'club-connections',
    label: 'Club Connections',
    icon: Users,
    tag: 'Service 03',
    headline: 'Club',
    headlineBlue: 'Connections',
    sub: 'We build strong relationships with clubs worldwide to create opportunities and drive successful partnerships.',
    photo: '/diseño6.jpeg',
    features: [
      { title: 'Global Network',        desc: 'Access to a worldwide network of top clubs and decision makers.' },
      { title: 'Strong Relationships',  desc: 'Long-term partnerships built on trust and results.' },
      { title: 'Mutual Growth',         desc: 'Creating value for players and clubs through strategic collaborations.' },
      { title: 'Exclusive Opportunities', desc: 'Opening doors to opportunities not available to everyone.' },
    ],
  },
  {
    id: 'personal-branding',
    label: 'Personal Branding',
    icon: Star,
    tag: 'Service 04',
    headline: 'Building Your Identity',
    headlineBlue: 'On and Off The Pitch.',
    sub: 'We help players grow their personal brand, increase their visibility and maximize opportunities worldwide.',
    photo: '/diseño4.jpeg',
    features: [
      { title: 'Media & Content',       desc: 'Professional shoots, videos and content that elevate your image.' },
      { title: 'Social Media Strategy', desc: 'Strategic positioning across all digital platforms.' },
      { title: 'Global Visibility',     desc: 'Connect with brands, clubs and new opportunities.' },
      { title: 'Partnerships',          desc: 'Access premium endorsement and sponsorship deals.' },
    ],
    reverse: true,
  },
]

export default function ServicesPage() {
  return (
    <div style={{ fontFamily: 'var(--font-montserrat), sans-serif', background: '#fff', minHeight: '100vh' }}>
      <style>{`
        .svc-split { display: grid; min-height: 560px; }
        .svc-split.normal  { grid-template-columns: 42fr 58fr; }
        .svc-split.reverse { grid-template-columns: 58fr 42fr; }
        @media (max-width: 900px) {
          .svc-split.normal  { display: flex !important; flex-direction: column !important; }
          .svc-split.reverse { display: flex !important; flex-direction: column-reverse !important; }
          .svc-photo { min-height: 380px !important; }
        }
        @media (max-width: 600px) {
          .svc-photo { min-height: 260px !important; }
        }

        /* ── Platform band ── */
        .platform-band { display: grid; grid-template-columns: 50fr 50fr; min-height: 440px; }
        @media (max-width: 900px) {
          .platform-band { display: flex !important; flex-direction: column !important; }
          .platform-band-photo { min-height: 320px !important; }
        }

        /* ── Tab hover ── */
        .svc-tab { transition: color 0.15s, border-color 0.15s; }
        .svc-tab:hover { color: ${N} !important; border-color: rgba(37,99,235,0.35) !important; }

        /* ── CTA get started link ── */
        .get-started-link { transition: gap 0.15s; }
        .get-started-link:hover { gap: 10px !important; }
      `}</style>

      <Navbar />

      {/* ── HERO HEADER ── */}
      <section style={{ background: N, padding: 'clamp(72px,8vw,96px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
            <div style={{ width: 24, height: 1.5, background: G }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: G, letterSpacing: '0.16em', textTransform: 'uppercase' }}>What We Do</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: 'clamp(36px, 5.5vw, 68px)', fontWeight: 700, color: '#fff', margin: '0 0 24px', letterSpacing: '-0.03em', textTransform: 'uppercase', lineHeight: 1.02 }}>
            Full-Service<br /><span style={{ color: G }}>Representation</span>
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)', lineHeight: 1.75, maxWidth: 480, margin: 0 }}>
            From career planning to contract negotiation, we are with our players every step of the way.
          </p>
        </div>
      </section>

      {/* ── SERVICE TABS ── */}
      <section style={{ background: '#FAFAFA', borderBottom: '1px solid #E5E7EB', padding: '0 clamp(24px,5vw,80px)', overflowX: 'auto' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 0 }}>
          {SERVICES.map(s => (
            <a key={s.id} href={`#${s.id}`} className="svc-tab" style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '16px 20px', borderBottom: '2px solid transparent',
              fontSize: 12, fontWeight: 600, color: '#9CA3AF',
              textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}>
              <s.icon size={13} />
              {s.label}
            </a>
          ))}
        </div>
      </section>

      {/* ── SERVICE SECTIONS ── */}
      {SERVICES.map(s => (
        <section key={s.id} id={s.id} className={`svc-split ${s.reverse ? 'reverse' : 'normal'}`} style={{ borderBottom: '1px solid #E5E7EB' }}>
          {/* Content panel */}
          <div style={{
            padding: 'clamp(56px,7vw,96px) clamp(28px,5vw,72px)',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            order: s.reverse ? 2 : 1,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ width: 24, height: 1.5, background: G }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: G, letterSpacing: '0.14em', textTransform: 'uppercase' }}>{s.tag}</span>
            </div>

            <h2 style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 700, color: N, margin: '0 0 16px', letterSpacing: '-0.025em', textTransform: 'uppercase', lineHeight: 1.05 }}>
              {s.headline}<br /><span style={{ color: G }}>{s.headlineBlue}</span>
            </h2>

            <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.75, margin: '0 0 32px', maxWidth: 380 }}>
              {s.sub}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 36 }}>
              {s.features.map(f => (
                <div key={f.title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: G, flexShrink: 0, marginTop: 7 }} />
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 700, color: N, margin: '0 0 3px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                      {f.title}
                    </p>
                    <p style={{ fontSize: 13, color: '#6B7280', margin: 0, lineHeight: 1.6 }}>
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/contact" className="get-started-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: N, textDecoration: 'none', letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: '1.5px solid #0A0A0A', paddingBottom: 2, width: 'fit-content' }}>
              Get Started <ArrowRight size={12} />
            </Link>
          </div>

          {/* Photo panel */}
          <div className="svc-photo" style={{
            position: 'relative', overflow: 'hidden',
            background: '#0A0A0A', minHeight: 480,
            order: s.reverse ? 1 : 2,
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={s.photo}
              alt=""
              aria-hidden="true"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: s.reverse
                ? 'linear-gradient(to left, rgba(0,0,0,0.08), transparent 60%)'
                : 'linear-gradient(to right, rgba(0,0,0,0.12), transparent 60%)',
            }} />
          </div>
        </section>
      ))}

      {/* ── DIGITAL PRESENCE BAND ── */}
      <section className="platform-band" style={{ borderBottom: '1px solid #E5E7EB' }}>
        {/* Left — photo */}
        <div className="platform-band-photo" style={{ position: 'relative', overflow: 'hidden', background: '#F3F4F6', minHeight: 380 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/polariswebdesign.jpeg"
            alt=""
            aria-hidden="true"
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center top',
            }}
          />
          {/* Light vignette — this is a UI screenshot so keep it bright */}
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '25%', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.8))' }} />
        </div>

        {/* Right — content */}
        <div style={{
          padding: 'clamp(48px,6vw,80px) clamp(32px,5vw,72px)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          background: '#fff',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ width: 24, height: 1.5, background: G }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: G, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Our Platform</span>
          </div>
          <h2 style={{
            fontFamily: 'var(--font-space-grotesk), sans-serif',
            fontSize: 'clamp(26px, 3vw, 38px)', fontWeight: 700,
            color: N, margin: '0 0 16px',
            letterSpacing: '-0.025em', textTransform: 'uppercase', lineHeight: 1.08,
          }}>
            Your career.<br /><span style={{ color: G }}>Managed end-to-end.</span>
          </h2>
          <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.8, margin: '0 0 32px', maxWidth: 360 }}>
            Our proprietary agent platform gives Polaris clients complete visibility into their career pipeline — transfers, contracts, negotiations, and opportunities, all in one place.
          </p>
          <Link href="/login" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: G, color: '#fff', padding: '12px 24px',
            borderRadius: 8, fontWeight: 600, fontSize: 11,
            textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase',
            width: 'fit-content',
          }}>
            Access the Platform <ArrowRight size={12} />
          </Link>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: N, padding: 'clamp(64px,8vw,96px) 40px' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, color: '#fff', margin: '0 0 20px', letterSpacing: '-0.025em', textTransform: 'uppercase', lineHeight: 1.05 }}>
            Ready to take<br /><span style={{ color: G }}>the next step?</span>
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, margin: '0 auto 40px', maxWidth: 340 }}>
            Get in touch and let us show you what full-service representation truly means.
          </p>
          <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: G, color: '#fff', padding: '13px 28px', borderRadius: 8, fontWeight: 600, fontSize: 12, textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Contact Us <ArrowRight size={13} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
