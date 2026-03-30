'use client'

import Image from 'next/image'

interface WelkoLogoProps {
  /**
   * true  = logo on dark/navy background
   *         → mix-blend-mode:screen removes the white PNG background
   *           and leaves the logo shapes white on the dark surface
   * false = logo on light/white background (default)
   *         → filter:invert(1) adapts automatically via CSS variable
   */
  darkBg?: boolean
  size?: number
  className?: string
}

export function WelkoLogo({ darkBg = false, size = 20, className }: WelkoLogoProps) {
  return (
    <Image
      src="/welko_logo_purewhite.png"
      alt="Welko"
      width={size}
      height={size}
      priority
      className={`${darkBg ? 'welko-logo-dark' : 'welko-logo-light'} ${className ?? ''}`}
    />
  )
}
