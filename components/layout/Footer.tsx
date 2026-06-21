import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { C, FONT, SECTION } from '@/lib/ds'

const NAV_COLS = [
  {
    heading: 'Polaris',
    links: [
      { label: 'Home',         href: '/'             },
      { label: 'Intelligence', href: '/intelligence' },
      { label: 'Solutions',    href: '/solutions'    },
      { label: 'Network',      href: '/network'      },
      { label: 'Contact',      href: '/contact'      },
    ],
  },
  {
    heading: 'Intelligence',
    links: [
      { label: 'Scouting Reports',  href: '/intelligence' },
      { label: 'Transfer Analysis', href: '/intelligence' },
      { label: 'Player Profiles',   href: '/intelligence' },
      { label: 'Market Intel.',     href: '/intelligence' },
    ],
  },
  {
    heading: 'Solutions',
    links: [
      { label: 'For Clubs',   href: '/solutions' },
      { label: 'For Agents',  href: '/solutions' },
      { label: 'For Players', href: '/solutions' },
    ],
  },
  {
    heading: 'Platform',
    links: [
      { label: 'Login',           href: '/login'     },
      { label: 'Dashboard',       href: '/dashboard' },
      { label: 'Request Access',  href: '/contact'   },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy',  href: '/privacidad' },
      { label: 'Terms',    href: '/terminos'   },
      { label: 'Refunds',  href: '/reembolsos' },
    ],
  },
]

const MONO = FONT.mono

export function Footer() {
  return (
    <footer style={{ background: '#FFFFFF', borderTop: `1px solid ${C.border}` }}>
      <style>{`
        .ft-link {
          display: block; text-decoration: none;
          font-family: ${FONT.sans}; font-size: 13px;
          color: ${C.textSecondary}; margin-bottom: 10px;
          transition: color 0.15s ease; line-height: 1.5;
        }
        .ft-link:hover { color: #111827; }
        .ft-col-head {
          font-family: ${FONT.sans}; font-size: 11px;
          font-weight: 600; letter-spacing: 0.06em;
          text-transform: uppercase; color: #111827;
          margin: 0 0 14px;
        }
      `}</style>

      {/* Main columns */}
      <div style={{
        maxWidth: SECTION.maxW, margin: '0 auto',
        padding: `clamp(44px, 5.5vw, 64px) ${SECTION.padH} 0`,
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-start', flexWrap: 'wrap', gap: 40,
      }}>

        {/* Brand */}
        <div style={{ maxWidth: 220, flexShrink: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/polarispnglogo.jpeg"
            alt="Polaris Football"
            style={{ height: 28, objectFit: 'contain', marginBottom: 14, display: 'block' }}
          />
          <p style={{ fontFamily: FONT.sans, fontSize: 12, color: C.textSecondary, margin: '0 0 14px', lineHeight: 1.8 }}>
            Football intelligence platform for clubs, agents, and professionals who take decisions seriously.
          </p>
          <p style={{ fontFamily: MONO, fontSize: 8, color: C.textMuted, margin: 0, letterSpacing: '0.07em', textTransform: 'uppercase', lineHeight: 1.8 }}>
            Part of the<br />Absolut Football Network
          </p>
        </div>

        {/* Link columns */}
        <div style={{ display: 'flex', gap: 'clamp(28px, 3.5vw, 52px)', flexWrap: 'wrap', flex: 1, justifyContent: 'flex-end' }}>
          {NAV_COLS.map(col => (
            <div key={col.heading} style={{ minWidth: 100 }}>
              <p className="ft-col-head">{col.heading}</p>
              {col.links.map(l => (
                <Link key={l.label + l.href} href={l.href} className="ft-link">
                  {l.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter — coming soon */}
      <div style={{
        maxWidth: SECTION.maxW, margin: '40px auto 0',
        padding: `clamp(20px, 2.5vw, 28px) ${SECTION.padH}`,
        borderTop: `1px solid ${C.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 16,
      }}>
        <div>
          <p style={{ fontFamily: FONT.sans, fontSize: 11, fontWeight: 600, color: '#111827', margin: '0 0 3px', letterSpacing: '0.04em' }}>
            Polaris Intelligence — Newsletter
          </p>
          <p style={{ fontFamily: MONO, fontSize: 9, color: C.textMuted, margin: 0, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Scouting reports, transfer analysis &amp; market intelligence · Coming Q4 2026
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: 0.45, cursor: 'not-allowed' }}>
          <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden', height: 36 }}>
            <input
              disabled
              placeholder="your@email.com"
              style={{ padding: '0 12px', fontSize: 12, fontFamily: FONT.sans, color: C.textSecondary, border: 'none', outline: 'none', width: 180, background: C.bgLight, height: '100%', cursor: 'not-allowed' }}
            />
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: C.blue, color: '#fff', padding: '9px 16px', borderRadius: 8, fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: FONT.sans, userSelect: 'none' }}>
            Subscribe <ArrowRight size={10} />
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        maxWidth: SECTION.maxW, margin: '0 auto',
        padding: `20px ${SECTION.padH}`,
        borderTop: `1px solid ${C.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12,
      }}>
        <p style={{ fontFamily: FONT.sans, fontSize: 11, color: C.textMuted, margin: 0 }}>
          © {new Date().getFullYear()} Polaris Football. All rights reserved.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{ fontFamily: MONO, fontSize: 9, color: C.textMuted, textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase', transition: 'color 0.15s' }}
            className="ft-link" data-noblock
          >
            LinkedIn ↗
          </Link>
          <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ fontFamily: MONO, fontSize: 9, color: C.textMuted, textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase', transition: 'color 0.15s' }}
            className="ft-link" data-noblock
          >
            X / Twitter ↗
          </Link>
          <span style={{ fontFamily: MONO, fontSize: 9, color: C.border, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Intelligence · Consulting · OS
          </span>
        </div>
      </div>
    </footer>
  )
}
