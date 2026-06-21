'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, ArrowRight } from 'lucide-react'
import { C, R, FONT } from '@/lib/ds'

const NAV_LINKS = [
  { label: 'Home',          href: '/'              },
  { label: 'Intelligence',  href: '/intelligence'  },
  { label: 'Solutions',     href: '/solutions'     },
  { label: 'Network',       href: '/network'       },
  { label: 'Contact',       href: '/contact'       },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <style>{`
        .nav-link {
          position: relative;
          font-size: 12px; font-weight: 600;
          color: ${C.textMuted};
          text-decoration: none;
          letter-spacing: 0.08em; text-transform: uppercase;
          font-family: ${FONT.sans};
          transition: color 0.15s ease;
          padding-bottom: 4px;
          white-space: nowrap;
        }
        .nav-link::after {
          content: '';
          position: absolute; bottom: -2px; left: 0; right: 0;
          height: 1.5px; background: ${C.textPrimary};
          transform: scaleX(0); transform-origin: left center;
          transition: transform 0.2s ease;
        }
        .nav-link:hover { color: ${C.textPrimary}; }
        .nav-link:hover::after { transform: scaleX(1); }
        .nav-link.active { color: ${C.textPrimary}; }
        .nav-link.active::after { transform: scaleX(1); background: ${C.blue}; }

        .nav-platform-btn {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 11px; font-weight: 700; font-family: ${FONT.sans};
          color: ${C.blueFg}; text-decoration: none;
          padding: 8px 18px; background: ${C.blue};
          border-radius: ${R.button}px;
          letter-spacing: 0.08em; text-transform: uppercase;
          transition: background 0.15s ease;
          white-space: nowrap;
        }
        .nav-platform-btn:hover { background: ${C.blueHover}; }

        .mobile-nav-link {
          display: block; padding: 12px 16px; border-radius: ${R.button}px;
          font-size: 15px; font-weight: 500; color: ${C.textPrimary};
          text-decoration: none; font-family: ${FONT.sans};
          transition: background 0.12s ease;
        }
        .mobile-nav-link:hover { background: ${C.bgSecondary}; }

        @media (max-width: 920px) {
          .nav-desktop    { display: none !important; }
          .nav-mobile-btn { display: flex !important; }
        }
        @media (min-width: 921px) {
          .nav-desktop    { display: flex !important; }
          .nav-mobile-btn { display: none !important; }
        }
      `}</style>

      <header style={{
        background:           'rgba(255,255,255,0.97)',
        position:             'sticky', top: 0, zIndex: 50,
        borderBottom:         `1px solid ${C.border}`,
        backdropFilter:       'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        height:               'var(--navbar-h)',
      }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto',
          padding: '0 clamp(20px, 4vw, 48px)',
          height: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 32,
        }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/polarispnglogo.jpeg" alt="Polaris Football" style={{ height: 30, objectFit: 'contain' }} />
          </Link>

          {/* Desktop nav */}
          <nav className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: 32, flex: 1, justifyContent: 'center' }}>
            {NAV_LINKS.map(l => {
              const isActive = l.href === '/' ? pathname === '/' : pathname.startsWith(l.href)
              return (
                <Link key={l.href} href={l.href} className={`nav-link${isActive ? ' active' : ''}`}>
                  {l.label}
                </Link>
              )
            })}
          </nav>

          {/* Platform CTA */}
          <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <Link href="/login" className="nav-platform-btn">
              Platform <ArrowRight size={11} />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(true)}
            className="nav-mobile-btn"
            style={{
              display: 'none', alignItems: 'center', justifyContent: 'center',
              width: 36, height: 36, borderRadius: R.button,
              background: C.bgTertiary, border: 'none', cursor: 'pointer',
              color: C.textPrimary, flexShrink: 0,
            }}
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.35)' }}
          />
          <div style={{
            position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 51,
            width: 280, background: C.bgPrimary,
            borderLeft: `1px solid ${C.border}`,
            display: 'flex', flexDirection: 'column',
            animation: 'drawer-in 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0 20px', height: 'var(--navbar-h)',
              borderBottom: `1px solid ${C.border}`, flexShrink: 0,
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/polarispnglogo.jpeg" alt="Polaris Football" style={{ height: 30, objectFit: 'contain' }} />
              <button
                onClick={() => setOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.textSecondary, display: 'flex', padding: 4 }}
              >
                <X size={18} />
              </button>
            </div>

            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '12px 8px', gap: 2 }}>
              {NAV_LINKS.map(l => {
                const isActive = l.href === '/' ? pathname === '/' : pathname.startsWith(l.href)
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="mobile-nav-link"
                    style={{ fontWeight: isActive ? 600 : 500, color: isActive ? C.blue : C.textPrimary }}
                  >
                    {l.label}
                  </Link>
                )
              })}
            </nav>

            <div style={{ padding: 16, borderTop: `1px solid ${C.border}` }}>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  padding: '12px 16px', borderRadius: R.button,
                  fontSize: 12, fontWeight: 700, fontFamily: FONT.sans,
                  background: C.blue, color: C.blueFg, textDecoration: 'none',
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                }}
              >
                Platform <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  )
}
