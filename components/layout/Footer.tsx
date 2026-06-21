import Link from 'next/link'
import { C, T, SECTION } from '@/lib/ds'

const COLS = [
  {
    heading: 'Polaris',
    links: [
      { label: 'Intelligence', href: '/intelligence' },
      { label: 'Solutions',    href: '/solutions'    },
      { label: 'Network',      href: '/network'      },
      { label: 'Contact',      href: '/contact'      },
    ],
  },
  {
    heading: 'Platform',
    links: [
      { label: 'Login',        href: '/login'        },
      { label: 'Dashboard',    href: '/dashboard'    },
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

export function Footer() {
  return (
    <footer style={{ background: C.dark, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <style>{`
        .footer-link { transition: color 0.15s ease; }
        .footer-link:hover { color: rgba(255,255,255,0.65) !important; }
      `}</style>

      <div style={{
        maxWidth: SECTION.maxW, margin: '0 auto',
        padding: `${SECTION.padV} ${SECTION.padH} 0`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        flexWrap: 'wrap', gap: 48,
      }}>
        {/* Brand */}
        <div style={{ maxWidth: 260 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/polariswhitelogo.jpeg"
            alt="Polaris Football"
            style={{ height: 36, objectFit: 'contain', marginBottom: 20, display: 'block' }}
          />
          <p style={{ ...T.small, color: 'rgba(255,255,255,0.28)', margin: '0 0 16px', lineHeight: 1.8 }}>
            Football intelligence platform for clubs, agents, and professionals who take decisions seriously.
          </p>
          <p style={{ ...T.label, color: 'rgba(255,255,255,0.13)', margin: 0 }}>
            Part of the Absolut Football Network
          </p>
        </div>

        {/* Link columns */}
        <div style={{ display: 'flex', gap: 56, flexWrap: 'wrap' }}>
          {COLS.map(col => (
            <div key={col.heading}>
              <p style={{ ...T.label, color: 'rgba(255,255,255,0.2)', margin: '0 0 18px' }}>
                {col.heading}
              </p>
              {col.links.map(l => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="footer-link"
                  style={{ ...T.small, display: 'block', color: 'rgba(255,255,255,0.35)', textDecoration: 'none', marginBottom: 12 }}
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
        padding: `28px ${SECTION.padH}`,
        borderTop: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12,
      }}>
        <p style={{ ...T.caption, color: 'rgba(255,255,255,0.18)', margin: 0 }}>
          © {new Date().getFullYear()} Polaris Football. All rights reserved.
        </p>
        <p style={{ ...T.label, color: 'rgba(255,255,255,0.1)', margin: 0, fontSize: 9 }}>
          Polaris Intelligence Platform
        </p>
      </div>
    </footer>
  )
}
