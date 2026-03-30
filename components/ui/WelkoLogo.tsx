'use client'

interface WelkoLogoProps {
  size?: number
  className?: string
}

export function WelkoLogo({ size = 20, className }: WelkoLogoProps) {
  const w = Math.round(size * 1.45)

  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src="/welkoapplogo.png"
      alt="Welko"
      width={w}
      height={size}
      style={{ display: 'block' }}
      className={className ?? ''}
    />
  )
}
