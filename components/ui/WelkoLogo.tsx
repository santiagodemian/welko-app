'use client'

import Image from 'next/image'

interface WelkoLogoProps {
  /**
   * true  = logo on dark/navy surface → filter converts navy shapes to white
   * false = logo on light surface     → navy shapes shown as-is (default)
   */
  darkBg?: boolean
  /** Height in px. Width is auto-calculated at 1.4:1 ratio. */
  size?: number
  className?: string
}

export function WelkoLogo({ darkBg = false, size = 20, className }: WelkoLogoProps) {
  const w = Math.round(size * 1.4)

  return (
    <Image
      src="/welkoapplogo.png"
      alt="Welko"
      width={w}
      height={size}
      priority
      unoptimized           // serve original PNG — preserves transparency
      className={`${darkBg ? 'welko-logo-dark' : 'welko-logo-light'} ${className ?? ''}`}
    />
  )
}
