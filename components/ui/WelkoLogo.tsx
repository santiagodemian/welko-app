'use client'

import Image from 'next/image'
import React from 'react'

interface WelkoLogoProps {
  /**
   * true  → logo is on a dark background (white PNG shown as-is)
   * false → logo adapts to the theme via CSS var(--logo-filter)
   *         (dark filter in light mode, none in dark mode)
   */
  darkBg?: boolean
  size?: number
  className?: string
  style?: React.CSSProperties
}

export function WelkoLogo({ darkBg = false, size = 20, className, style }: WelkoLogoProps) {
  const w = Math.round(size * 1.65) // approximate aspect ratio of the logo PNG

  return (
    <Image
      src="/welko_logo_purewhite.png"
      alt="Welko"
      width={w}
      height={size}
      priority
      style={{
        objectFit: 'contain',
        filter: darkBg ? 'none' : 'var(--logo-filter)',
        ...style,
      }}
      className={className}
    />
  )
}
