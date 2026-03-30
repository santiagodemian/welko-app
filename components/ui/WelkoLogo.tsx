'use client'

import Image from 'next/image'

interface WelkoLogoProps {
  /**
   * true  = logo sits on a dark/navy background → turns white
   * false = logo sits on a light background    → shows navy (default)
   */
  darkBg?: boolean
  size?: number
  className?: string
}

export function WelkoLogo({ darkBg = false, size = 20, className }: WelkoLogoProps) {
  return (
    <Image
      src="/welkoapplogo.png"
      alt="Welko"
      width={size}
      height={size}
      priority
      className={`${darkBg ? 'welko-logo-dark' : 'welko-logo-light'} ${className ?? ''}`}
      style={{ objectFit: 'contain' }}
    />
  )
}
