import Link from 'next/link'
import { C, T, FONT, SECTION } from '@/lib/ds'

const COLS = [
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

const MONO = 'var(--font-geist-mono), monospace'

export function Footer() {
  return (
    <footer style={{ background: C.dark, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
      <style>{`
        .footer-link { transition: color 0.15s ease; }
        .footer-link:hover { color: rgba(255,255,255,0.88) !important; }
      `}</style>

      {/* Main content */}
      <div style={{
        maxWidth: SECTION.maxW, margin: '0 auto',
        padding: `${SECTION.padV} ${SECTION.padH} 0`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        flexWrap: 'wrap', gap: 48,
      }}>

        {/* Brand column */}
        <div style={{ maxWidth: 240 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/polariswhitelogo.jpeg"
            alt="Polaris Football"
            style={{ height: 34, objectFit: 'contain', marginBottom: 18, display: 'block' }}
          />
          <p style={{ ...T.small, color: 'rgba(255,255,255,0.38)', margin: '0 0 20px', lineHeight: 1.8, fontSize: 12 }}>
            Football intelligence platform for clubs, agents, and professionals who take decisions seriously.
          </p>
          <p style={{ fontFamily: MONO, fontSize: 9, color: 'rgba(255,255,255,0.2)', margin: 0, letterSpacing: '0.08em', textTransform: 'uppercase', lineHeight: 1.8 }}>
            Part of the<br />Absolut Football Network
          </p>
        </div>

        {/* Link columns */}
        <div style={{ display: 'flex', gap: 'clamp(36px, 4vw, 64px)', flexWrap: 'wrap' }}>
          {COLS.map(col => (
            <div key={col.heading}>
              <p style={{ fontFamily: FONT.sans, fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.80)', margin: '0 0 16px' }}>
                {col.heading}
              </p>
              {col.links.map(l => (
                <Link
                  key={l.href + l.label}
                  href={l.href}
                  className="footer-link"
                  style={{ fontFamily: FONT.sans, fontSize: 13, fontWeight: 400, display: 'block', color: 'rgba(255,255,255,0.52)', textDecoration: 'none', marginBottom: 11, lineHeight: 1.5 }}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        maxWidth: SECTION.maxW, margin: '48px auto 0',
        padding: `24px ${SECTION.padH}`,
        borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12,
      }}>
        <p style={{ fontFamily: FONT.sans, fontSize: 11, fontWeight: 400, color: 'rgba(255,255,255,0.22)', margin: 0, letterSpacing: '0.02em' }}>
          © {new Date().getFullYear()} Polaris Football. All rights reserved.
        </p>
        <p style={{ fontFamily: MONO, fontSize: 9, color: 'rgba(255,255,255,0.14)', margin: 0, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Intelligence · Consulting · OS
        </p>
      </div>
    </footer>
  )
}
