'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import Image from 'next/image'

interface WelkoLogoProps {
  size?: number
  variant?: 'auto' | 'light' | 'dark'
  className?: string
}

export function WelkoLogo({ size = 28, variant = 'auto', className }: WelkoLogoProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const isDark =
    variant === 'dark' ||
    (variant === 'auto' && mounted && resolvedTheme === 'dark')

  const radius = Math.round(size * 0.22)

  // Both images always rendered — crossfade via opacity transition
  return (
    <div
      style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}
      className={className}
    >
      {/* Light version (navy W on white) */}
      <Image
        src="/welko-light.png"
        alt="Welko"
        width={size}
        height={size}
        priority
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: radius,
          objectFit: 'cover',
          opacity: isDark ? 0 : 1,
          transition: 'opacity 0.4s ease',
        }}
      />
      {/* Dark version (white W on navy) */}
      <Image
        src="/welko-dark.png"
        alt=""
        aria-hidden
        width={size}
        height={size}
        priority
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: radius,
          objectFit: 'cover',
          opacity: isDark ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
      />
    </div>
  )
}
