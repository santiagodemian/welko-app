'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, AlignJustify } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useLang } from '@/contexts/LangContext'

export function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const moreRef = useRef<HTMLDivElement>(null)
  const { lang, t, toggle } = useLang()

  const NAV_LINKS: { label: string; href: string }[] = [
    { label: t.nav.product,  href: '/como-funciona' },
    { label: t.nav.pricing,  href: '/precios' },
    { label: lang === 'es' ? 'Demo' : 'Demo', href: '/demo' },
  ]

  type MoreLink = { label: string; href: string; group?: string }
  const MORE_LINKS: MoreLink[] = [
    // Industries by category
    { label: lang === 'es' ? '🦷 Clínicas de Salud'     : '🦷 Health Clinics',    href: '/industrias/dental',       group: lang === 'es' ? 'Industrias' : 'Industries' },
    { label: lang === 'es' ? '🍽️ Restaurantes & Cafés'  : '🍽️ Restaurants',      href: '/industrias/restaurante',  group: lang === 'es' ? 'Industrias' : 'Industries' },
    { label: lang === 'es' ? '✂️ Barberías & Spas'      : '✂️ Barbershops & Spas', href: '/industrias/barberia',     group: lang === 'es' ? 'Industrias' : 'Industries' },
    { label: lang === 'es' ? '💪 Fitness & Wellness'    : '💪 Fitness & Wellness', href: '/industrias/fitness',      group: lang === 'es' ? 'Industrias' : 'Industries' },
    { label: lang === 'es' ? '🏨 Hospitalidad'          : '🏨 Hospitality',        href: '/industrias/hotel',        group: lang === 'es' ? 'Industrias' : 'Industries' },
    { label: lang === 'es' ? '→ Ver todas las industrias' : '→ All industries',    href: '/industrias' },
    // Pages
    { label: lang === 'es' ? 'Soluciones'    : 'Solutions',   href: '/soluciones/ai-receptionist' },
    { label: lang === 'es' ? 'Por qué Welko' : 'Why Welko',   href: '/por-que' },
    { label: 'Partners',                                        href: '/partners' },
  ]

  // Close "more" dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false)
      }
    }
    if (moreOpen) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [moreOpen])

  return (
    <>
      {/* ── CO₂ Top Bar ── */}
      <div
        className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-center gap-2 px-4"
        style={{ height: 30, background: 'linear-gradient(90deg, #022c22 0%, #064e3b 50%, #022c22 100%)' }}
      >
        <span style={{ fontSize: 11, color: '#6ee7b7', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {lang === 'es'
            ? '🌱 Welko Carbon Initiative: 1% de cada suscripción elimina CO₂ de la atmósfera'
            : '🌱 Welko Carbon Initiative: 1% of every subscription removes CO₂ from the atmosphere'}
        </span>
      </div>

      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="fixed top-[30px] left-0 right-0 z-50"
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
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" aria-label="Welko inicio">
              <span
                style={{
                  color: 'var(--text-primary)',
                  fontSize: 22,
                  fontWeight: 800,
                  letterSpacing: '-0.04em',
                  fontFamily: 'var(--font-montserrat), sans-serif',
                  lineHeight: 1,
                  transition: 'color 0.4s ease',
                }}
              >
                Welko
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-7" aria-label="Navegación principal">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm transition-colors duration-150"
                  style={{
                    color: 'var(--text-secondary)',
                    fontWeight: 500,
                    letterSpacing: '0.01em',
                    fontFamily: 'var(--font-montserrat), sans-serif',
                  }}
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

              {/* ── Tres rayitas — secondary menu ── */}
              <div ref={moreRef} className="relative">
                <button
                  onClick={() => setMoreOpen((v) => !v)}
                  className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-150"
                  aria-label="Más páginas"
                  style={{
                    color: moreOpen ? 'var(--text-primary)' : 'var(--text-secondary)',
                    background: moreOpen ? 'var(--surface-hover)' : 'transparent',
                    border: '1px solid var(--border)',
                  }}
                >
                  <AlignJustify size={15} />
                </button>

                <AnimatePresence>
                  {moreOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.16, ease: 'easeOut' }}
                      className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-52"
                      style={{ zIndex: 100 }}
                    >
                      <div
                        className="flex flex-col gap-0.5 p-2 rounded-2xl"
                        style={{
                          background: 'var(--surface)',
                          border: '1px solid var(--border)',
                          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                        }}
                      >
                        {/* Industries group */}
                        <p className="px-3 pt-1.5 pb-0.5 text-[10px] font-bold uppercase tracking-widest"
                          style={{ color: 'var(--text-muted)' }}>
                          {lang === 'es' ? 'Industrias' : 'Industries'}
                        </p>
                        {MORE_LINKS.filter(l => l.group).map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMoreOpen(false)}
                            className="flex items-center px-3 py-1.5 rounded-xl text-sm transition-colors duration-150"
                            style={{ color: 'var(--text-secondary)', fontWeight: 500 }}
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
                        {/* "Ver todas" + divider */}
                        {(() => {
                          const allLink = MORE_LINKS.find(l => !l.group && l.href === '/industrias')
                          if (!allLink) return null
                          return (
                            <Link
                              href={allLink.href}
                              onClick={() => setMoreOpen(false)}
                              className="flex items-center px-3 py-1.5 rounded-xl text-xs transition-colors duration-150"
                              style={{ color: 'var(--accent)', fontWeight: 600 }}
                              onMouseEnter={(e) =>
                                ((e.currentTarget as HTMLAnchorElement).style.background = 'var(--surface-hover)')
                              }
                              onMouseLeave={(e) =>
                                ((e.currentTarget as HTMLAnchorElement).style.background = 'transparent')
                              }
                            >
                              {allLink.label}
                            </Link>
                          )
                        })()}
                        <div style={{ height: 1, background: 'var(--border)', margin: '4px 8px' }} />
                        {MORE_LINKS.filter(l => !l.group && l.href !== '/industrias').map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMoreOpen(false)}
                            className="flex items-center px-3 py-2.5 rounded-xl text-sm transition-colors duration-150"
                            style={{ color: 'var(--text-primary)', fontWeight: 500 }}
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
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
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
                href="/registro"
                className="hidden md:inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150"
                style={{ background: 'var(--surface)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'var(--surface-hover)'; (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-primary)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'var(--surface)'; (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-secondary)' }}
              >
                {lang === 'es' ? 'Crear cuenta' : 'Sign up'}
              </Link>
              <Link
                href="/login"
                className="hidden md:inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150"
                style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.background = 'var(--accent-hover)')
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.background = 'var(--accent)')
                }
              >
                {t.nav.signIn}
              </Link>

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
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/50"
              onClick={() => setDrawerOpen(false)}
            />

            <motion.div
              key="drawer"
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 flex flex-col"
              style={{ background: 'var(--surface)', borderLeft: '1px solid var(--border)', boxShadow: '-4px 0 24px rgba(0,0,0,0.12)' }}
            >
              <div className="flex items-center justify-between px-5 h-16 flex-shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontWeight: 800, fontSize: 20, letterSpacing: '-0.04em', color: 'var(--text-primary)', fontFamily: 'var(--font-montserrat), sans-serif', transition: 'color 0.4s ease' }}>Welko</span>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ color: 'var(--text-secondary)', background: 'var(--surface-hover)' }}
                >
                  <X size={16} />
                </button>
              </div>

              <nav className="flex flex-col gap-1 px-4 py-5 flex-1 overflow-y-auto">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-colors duration-150"
                    style={{ color: 'var(--text-primary)' }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = 'var(--surface-hover)')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = 'transparent')}
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Divider + secondary links */}
                <div className="px-3 pt-4 pb-1">
                  <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                    {lang === 'es' ? 'Más' : 'More'}
                  </span>
                </div>
                {MORE_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150"
                    style={{ color: 'var(--text-secondary)' }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = 'var(--surface-hover)')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = 'transparent')}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="px-4 pb-6 flex flex-col gap-3" style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
                <div className="flex items-center gap-2 mb-1">
                  <button
                    onClick={toggle}
                    className="flex-1 py-2 rounded-xl text-xs font-bold transition-colors duration-150"
                    style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)', background: 'var(--surface-hover)' }}
                  >
                    {lang === 'es' ? '🌐 English' : '🌐 Español'}
                  </button>
                  <ThemeToggle />
                </div>
                <Link
                  href="/registro"
                  onClick={() => setDrawerOpen(false)}
                  className="w-full flex items-center justify-center py-3 rounded-xl text-sm font-semibold transition-colors duration-150"
                  style={{ background: 'var(--surface-hover)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
                >
                  {lang === 'es' ? 'Crear cuenta' : 'Sign up'}
                </Link>
                <Link
                  href="/login"
                  onClick={() => setDrawerOpen(false)}
                  className="w-full flex items-center justify-center py-3 rounded-xl text-sm font-semibold transition-colors duration-150"
                  style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
                >
                  {t.nav.signIn}
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
