'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

const NAV_LINKS: { label: string; href: string; scrollTo?: string }[] = [
  { label: 'Producto', href: '/', scrollTo: 'producto' },
  { label: 'Precios', href: '/precios' },
  { label: 'Clínicas', href: '/clinicas' },
  { label: 'Vende Welko', href: '/vende-welko' },
]

export function Navbar() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50"
      data-no-transition
    >
      {/* Glassmorphism bar */}
      <div
        className="mx-auto max-w-6xl mt-3 mx-3 sm:mx-6 lg:mx-auto rounded-2xl px-4 sm:px-6"
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
          <Link href="/" className="flex items-center gap-2" aria-label="Welko inicio">
            <div style={{
              width: 30, height: 30, borderRadius: 8, background: '#13244A', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Image
                src="/welko_logo_purewhite.png"
                alt="Welko logo"
                width={18}
                height={18}
                className="object-contain"
                priority
              />
            </div>
            <span className="text-base font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Welko
            </span>
          </Link>

          {/* Nav links — desktop */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Navegación principal">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium transition-colors duration-150"
                style={{ color: 'var(--text-secondary)' }}
                onClick={link.scrollTo ? (e) => {
                  e.preventDefault()
                  const el = document.getElementById(link.scrollTo!)
                  if (el) el.scrollIntoView({ behavior: 'smooth' })
                } : undefined}
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

          {/* Right side */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {/* Iniciar Sesión */}
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150"
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
              Iniciar sesión
            </Link>

            {/* Agendar demo */}
            <Link
              href="/contacto"
              className="hidden sm:inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150"
              style={{
                background: 'var(--accent)',
                color: 'var(--accent-fg)',
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.background = 'var(--accent-hover)')
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.background = 'var(--accent)')
              }
            >
              Agendar demo
            </Link>
          </div>

        </div>
      </div>
    </motion.header>
  )
}
