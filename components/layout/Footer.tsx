import Link from 'next/link'
import { C, T, SECTION } from '@/lib/ds'

const COLS = [
  {
    heading: 'Agency',
    links: [
      { label: 'About',    href: '/about'    },
      { label: 'Services', href: '/services' },
      { label: 'Players',  href: '/players'  },
      { label: 'Blog',     href: '/blog'     },
      { label: 'Contact',  href: '/contact'  },
    ],
  },
  {
    heading: 'Platform',
    links: [
      { label: 'Client Login', href: '/login'     },
      { label: 'Agent CRM',    href: '/dashboard' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy', href: '/privacidad' },
      { label: 'Terms',   href: '/terminos'   },
      { label: 'Refunds', href: '/reembolsos' },
    ],
  },
]

/**
 * Shared full footer — used on every public page.
 * Consistent 4-column layout: about text + 3 link columns.
 */
export function Footer() {
  return (
    <footer style={{ background: C.dark, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <style>{`
        .footer-link { transition: color 0.15s ease; }
        .footer-link:hover { color: rgba(255,255,255,0.65) !important; }
      `}</style>

      {/* Main columns */}
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
            style={{ height: 40, objectFit: 'contain', marginBottom: 18, display: 'block' }}
          />
          <p style={{ ...T.small, color: 'rgba(255,255,255,0.28)', margin: '0 0 20px', lineHeight: 1.75 }}>
            Elite football representation connecting talent with opportunity across five continents.
          </p>
          <p style={{ ...T.label, color: 'rgba(255,255,255,0.15)', margin: 0 }}>
            Talent. Opportunity. Worldwide.
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
        maxWidth: SECTION.maxW, margin: '0 auto',
        padding: `32px ${SECTION.padH}`,
        borderTop: '1px solid rgba(255,255,255,0.05)',
        marginTop: 48,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12,
      }}>
        <p style={{ ...T.caption, color: 'rgba(255,255,255,0.18)', margin: 0 }}>
          © {new Date().getFullYear()} Polaris Football. All rights reserved.
        </p>
        <p style={{ ...T.label, color: 'rgba(255,255,255,0.1)', margin: 0, fontSize: 9 }}>
          Design System v1.0
        </p>
      </div>
    </footer>
  )
}
