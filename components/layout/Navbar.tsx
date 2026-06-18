'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, ArrowRight } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Home',     href: '/'         },
  { label: 'About',    href: '/about'    },
  { label: 'Services', href: '/services' },
  { label: 'Players',  href: '/players'  },
  { label: 'Blog',     href: '/blog'     },
  { label: 'Contact',  href: '/contact'  },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <style>{`
        .nav-link {
          position: relative;
          font-size: 12px;
          font-weight: 600;
          color: #6B7280;
          text-decoration: none;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-family: var(--font-montserrat), sans-serif;
          transition: color 0.15s;
          padding-bottom: 4px;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 1.5px;
          background: #0A0A0A;
          transform: scaleX(0);
          transform-origin: left center;
          transition: transform 0.2s ease;
        }
        .nav-link:hover { color: #0A0A0A; }
        .nav-link:hover::after { transform: scaleX(1); }
        .nav-link.active { color: #0A0A0A; }
        .nav-link.active::after { transform: scaleX(1); background: #2563EB; }

        .login-btn {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 12px; font-weight: 600;
          color: #fff; text-decoration: none;
          padding: 8px 20px; background: #2563EB;
          border-radius: 8px;
          font-family: var(--font-montserrat), sans-serif;
          letter-spacing: 0.06em; text-transform: uppercase;
          transition: background 0.15s;
        }
        .login-btn:hover { background: #1D4ED8; }

        .mobile-link {
          padding: 12px 16px; border-radius: 8px;
          font-size: 14px; font-weight: 500;
          color: #0A0A0A; text-decoration: none;
          font-family: var(--font-montserrat), sans-serif;
          transition: background 0.1s;
        }
        .mobile-link:hover { background: #F9FAFB; }

        @media (max-width: 900px) {
          .nav-desktop    { display: none !important; }
          .nav-mobile-btn { display: flex !important; }
        }
        @media (min-width: 901px) {
          .nav-desktop    { display: flex !important; }
          .nav-mobile-btn { display: none !important; }
        }
      `}</style>

      <header style={{
        background: 'rgba(255,255,255,0.97)',
        position: 'sticky', top: 0, zIndex: 50,
        borderBottom: '1px solid #E5E7EB',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px', height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/polarispnglogo.jpeg" alt="Polaris Football" style={{ height: 34, objectFit: 'contain' }} />
          </Link>

          {/* Desktop nav */}
          <nav className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
            {NAV_LINKS.map(l => {
              const isActive = l.href === '/' ? pathname === '/' : pathname.startsWith(l.href)
              return (
                <Link key={l.href} href={l.href} className={`nav-link${isActive ? ' active' : ''}`}>
                  {l.label}
                </Link>
              )
            })}
          </nav>

          {/* CTA */}
          <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center' }}>
            <Link href="/login" className="login-btn">
              Client Login <ArrowRight size={12} />
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(true)}
            className="nav-mobile-btn"
            style={{ display: 'none', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 8, background: '#F3F4F6', border: 'none', cursor: 'pointer', color: '#0A0A0A' }}
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.4)' }} />
          <div style={{
            position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 51,
            width: 280, background: '#fff', borderLeft: '1px solid #E5E7EB',
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', height: 72, borderBottom: '1px solid #E5E7EB', flexShrink: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/polarispnglogo.jpeg" alt="Polaris Football" style={{ height: 32, objectFit: 'contain' }} />
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', display: 'flex' }}>
                <X size={18} />
              </button>
            </div>
            <nav style={{ display: 'flex', flexDirection: 'column', padding: '16px 12px', gap: 2, flex: 1 }}>
              {NAV_LINKS.map(l => (
                <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="mobile-link">
                  {l.label}
                </Link>
              ))}
            </nav>
            <div style={{ padding: '16px', borderTop: '1px solid #E5E7EB' }}>
              <Link href="/login" onClick={() => setOpen(false)} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '12px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                background: '#2563EB', color: '#fff', textDecoration: 'none',
                fontFamily: 'var(--font-montserrat), sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase',
              }}>
                Client Login <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  )
}
