'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { WelkoLogo } from '@/components/ui/WelkoLogo'
import { useLang } from '@/contexts/LangContext'

export function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { lang, t, toggle } = useLang()

  const NAV_LINKS = [
    { label: t.nav.product,   href: '/', scrollTo: 'producto' },
    { label: t.nav.pricing,   href: '/precios' },
    { label: t.nav.clinics,   href: '/clinicas' },
    { label: t.nav.sellWelko, href: '/vende-welko' },
  ]

  function handleScrollLink(e: React.MouseEvent, scrollTo?: string) {
    if (!scrollTo) return
    e.preventDefault()
    const el = document.getElementById(scrollTo)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    setDrawerOpen(false)
  }

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50"
        data-no-transition
      >
        <div
          className="mx-3 sm:mx-6 lg:mx-auto lg:max-w-6xl mt-3 rounded-2xl px-4 sm:px-6"
          style={{
            background: 'var(--navbar-bg)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid var(--border)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          }}
        >
          <div className="flex items-center justify-between h-14">

            {/* Logo — inline SVG, no background, floats on any surface */}
            <Link href="/" className="flex items-center gap-2.5" aria-label="Welko inicio">
              <WelkoLogo size={22} />
              <span className="text-base font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Welko
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-6" aria-label="Navegación principal">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium transition-colors duration-150"
                  style={{ color: 'var(--text-secondary)' }}
                  onClick={link.scrollTo ? (e) => handleScrollLink(e, link.scrollTo) : undefined}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-primary)')
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-secondary)')
                  }
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right: lang + theme + auth buttons */}
            <div className="flex items-center gap-2">

              {/* Lang toggle */}
              <button
                onClick={toggle}
                className="hidden sm:flex items-center px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors duration-150"
                style={{
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border)',
                  background: 'transparent',
                  letterSpacing: '0.04em',
                }}
              >
                {lang === 'es' ? 'EN' : 'ES'}
              </button>

              <ThemeToggle />

              <Link
                href="/login"
                className="hidden md:inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150"
                style={{
                  background: 'transparent',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border)',
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.background = 'var(--surface-hover)')
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.background = 'transparent')
                }
              >
                {t.nav.signIn}
              </Link>

              <Link
                href="/contacto"
                className="hidden md:inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150"
                style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.background = 'var(--accent-hover)')
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.background = 'var(--accent)')
                }
              >
                {t.nav.bookDemo}
              </Link>

              {/* Hamburger — mobile only */}
              <button
                onClick={() => setDrawerOpen(true)}
                className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg transition-colors duration-150"
                style={{ color: 'var(--text-primary)', background: 'var(--surface-hover)' }}
                aria-label="Abrir menú"
              >
                <Menu size={18} />
              </button>
            </div>

          </div>
        </div>
      </motion.header>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/50"
              onClick={() => setDrawerOpen(false)}
            />

            {/* Drawer panel */}
            <motion.div
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 flex flex-col"
              style={{
                background: 'var(--surface)',
                borderLeft: '1px solid var(--border)',
                boxShadow: '-4px 0 24px rgba(0,0,0,0.12)',
              }}
            >
              {/* Drawer header */}
              <div
                className="flex items-center justify-between px-5 h-16 flex-shrink-0"
                style={{ borderBottom: '1px solid var(--border)' }}
              >
                <div className="flex items-center gap-2.5">
                  <WelkoLogo size={22} />
                  <span className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>Welko</span>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ color: 'var(--text-secondary)', background: 'var(--surface-hover)' }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex flex-col gap-1 px-4 py-5 flex-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={(e) => {
                      handleScrollLink(e, link.scrollTo)
                      if (!link.scrollTo) setDrawerOpen(false)
                    }}
                    className="flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-colors duration-150"
                    style={{ color: 'var(--text-primary)' }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.background = 'var(--surface-hover)')
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.background = 'transparent')
                    }
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Bottom CTAs */}
              <div className="px-4 pb-6 flex flex-col gap-3" style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
                {/* Lang + Theme row */}
                <div className="flex items-center gap-2 mb-1">
                  <button
                    onClick={toggle}
                    className="flex-1 py-2 rounded-xl text-xs font-bold transition-colors duration-150"
                    style={{
                      border: '1px solid var(--border)',
                      color: 'var(--text-secondary)',
                      background: 'var(--surface-hover)',
                    }}
                  >
                    {lang === 'es' ? '🌐 English' : '🌐 Español'}
                  </button>
                  <ThemeToggle />
                </div>

                <Link
                  href="/login"
                  onClick={() => setDrawerOpen(false)}
                  className="w-full flex items-center justify-center py-3 rounded-xl text-sm font-medium transition-colors duration-150"
                  style={{
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    background: 'transparent',
                  }}
                >
                  {t.nav.signIn}
                </Link>
                <Link
                  href="/contacto"
                  onClick={() => setDrawerOpen(false)}
                  className="w-full flex items-center justify-center py-3 rounded-xl text-sm font-semibold transition-colors duration-150"
                  style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
                >
                  {t.nav.bookDemo}
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
