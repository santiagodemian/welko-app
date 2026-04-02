'use client'

import Link from 'next/link'
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown, Bot, Clock } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { WelkoLogo } from '@/components/ui/WelkoLogo'
import { useLang } from '@/contexts/LangContext'

const SOLUTIONS = [
  {
    slug: 'ai-receptionist',
    label: { es: 'AI Receptionist', en: 'AI Receptionist' },
    desc:  { es: 'Recepcionista IA 24/7 para tu clínica', en: '24/7 AI Receptionist for your clinic' },
    href:  '/soluciones/ai-receptionist',
    icon:  Bot,
    soon:  false,
  },
  {
    slug: 'voice-ai',
    label: { es: 'Voice AI', en: 'Voice AI' },
    desc:  { es: 'Llamadas automatizadas con IA de voz', en: 'Automated calls with voice AI' },
    href:  '#',
    icon:  Clock,
    soon:  true,
  },
  {
    slug: 'crm',
    label: { es: 'CRM Médico', en: 'Medical CRM' },
    desc:  { es: 'Gestión de pacientes integrada', en: 'Integrated patient management' },
    href:  '#',
    icon:  Clock,
    soon:  true,
  },
]

export function Navbar() {
  const [drawerOpen, setDrawerOpen]   = useState(false)
  const [solutionsOpen, setSolutionsOpen] = useState(false)
  const solutionsRef = useRef<HTMLDivElement>(null)
  const { lang, t, toggle } = useLang()

  const NAV_LINKS = [
    { label: t.nav.product,    href: '/como-funciona' },
    { label: t.nav.industries, href: '/industrias' },
    { label: lang === 'es' ? 'Por qué Welko' : 'Why Welko', href: '/por-que' },
    { label: t.nav.pricing,    href: '/precios' },
    { label: t.nav.partners,   href: '/partners' },
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

            {/* Logo */}
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

              {/* Solutions dropdown */}
              <div
                ref={solutionsRef}
                className="relative"
                onMouseEnter={() => setSolutionsOpen(true)}
                onMouseLeave={() => setSolutionsOpen(false)}
              >
                <button
                  className="flex items-center gap-1 text-sm font-medium transition-colors duration-150"
                  style={{ color: solutionsOpen ? 'var(--text-primary)' : 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {lang === 'es' ? 'Soluciones' : 'Solutions'}
                  <ChevronDown
                    size={14}
                    style={{
                      transform: solutionsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                    }}
                  />
                </button>

                <AnimatePresence>
                  {solutionsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-64"
                      style={{ zIndex: 100 }}
                    >
                      <div
                        className="flex flex-col gap-1 p-2 rounded-2xl"
                        style={{
                          background: 'var(--surface)',
                          border: '1px solid var(--border)',
                          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                        }}
                      >
                        {SOLUTIONS.map((sol) => {
                          const label = lang === 'es' ? sol.label.es : sol.label.en
                          const desc  = lang === 'es' ? sol.desc.es  : sol.desc.en
                          return (
                            <Link
                              key={sol.slug}
                              href={sol.href}
                              onClick={sol.soon ? (e) => e.preventDefault() : undefined}
                              className="flex items-start gap-3 px-3 py-2.5 rounded-xl transition-colors duration-150"
                              style={{
                                cursor: sol.soon ? 'default' : 'pointer',
                                opacity: sol.soon ? 0.55 : 1,
                              }}
                              onMouseEnter={(e) => {
                                if (!sol.soon)
                                  (e.currentTarget as HTMLAnchorElement).style.background = 'var(--surface-hover)'
                              }}
                              onMouseLeave={(e) => {
                                (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'
                              }}
                            >
                              <div
                                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                                style={{ background: 'var(--bg-secondary)' }}
                              >
                                <sol.icon size={14} color="var(--accent)" />
                              </div>
                              <div className="flex flex-col gap-0.5 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                                    {label}
                                  </span>
                                  {sol.soon && (
                                    <span
                                      className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                                      style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}
                                    >
                                      {lang === 'es' ? 'Próx.' : 'Soon'}
                                    </span>
                                  )}
                                </div>
                                <span className="text-[11px] leading-snug" style={{ color: 'var(--text-secondary)' }}>
                                  {desc}
                                </span>
                              </div>
                            </Link>
                          )
                        })}
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
                href="/login"
                className="hidden md:inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150"
                style={{ background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
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
                href="/registro"
                className="hidden md:inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150"
                style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.background = 'var(--accent-hover)')
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.background = 'var(--accent)')
                }
              >
                {lang === 'es' ? 'Crear cuenta' : 'Get started'}
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

              <nav className="flex flex-col gap-1 px-4 py-5 flex-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={(e) => { handleScrollLink(e, link.scrollTo); if (!link.scrollTo) setDrawerOpen(false) }}
                    className="flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-colors duration-150"
                    style={{ color: 'var(--text-primary)' }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = 'var(--surface-hover)')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = 'transparent')}
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Solutions in mobile */}
                <div className="px-3 pt-1 pb-0.5">
                  <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                    {lang === 'es' ? 'Soluciones' : 'Solutions'}
                  </span>
                </div>
                {SOLUTIONS.map((sol) => {
                  const label = lang === 'es' ? sol.label.es : sol.label.en
                  return (
                    <Link
                      key={sol.slug}
                      href={sol.href}
                      onClick={sol.soon ? (e) => e.preventDefault() : () => setDrawerOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150"
                      style={{ color: 'var(--text-primary)', opacity: sol.soon ? 0.45 : 1 }}
                      onMouseEnter={(e) => { if (!sol.soon) (e.currentTarget as HTMLAnchorElement).style.background = 'var(--surface-hover)' }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent' }}
                    >
                      <sol.icon size={15} color="var(--text-secondary)" />
                      {label}
                      {sol.soon && <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{lang === 'es' ? '· Pronto' : '· Soon'}</span>}
                    </Link>
                  )
                })}
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
                  href="/login"
                  onClick={() => setDrawerOpen(false)}
                  className="w-full flex items-center justify-center py-3 rounded-xl text-sm font-medium transition-colors duration-150"
                  style={{ border: '1px solid var(--border)', color: 'var(--text-primary)', background: 'transparent' }}
                >
                  {t.nav.signIn}
                </Link>
                <Link
                  href="/registro"
                  onClick={() => setDrawerOpen(false)}
                  className="w-full flex items-center justify-center py-3 rounded-xl text-sm font-semibold transition-colors duration-150"
                  style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
                >
                  {lang === 'es' ? 'Crear cuenta' : 'Get started'}
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
