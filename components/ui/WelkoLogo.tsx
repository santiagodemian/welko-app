'use client'

import React from 'react'

interface WelkoLogoProps {
  color?: string
  size?: number
  className?: string
  style?: React.CSSProperties
}

/**
 * Official Welko logo: 3 interlocking hexagons forming a W,
 * with a checkmark inside the rightmost hexagon.
 * Fully transparent background — use `color` prop to tint.
 */
export function WelkoLogo({ color = '#13244A', size = 20, className, style }: WelkoLogoProps) {
  const w = Math.round((size * 100) / 68)

  return (
    <svg
      width={w}
      height={size}
      viewBox="0 0 100 68"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      {/* Left hexagon */}
      <polygon
        points="3,38 13,20.7 33,20.7 43,38 33,55.3 13,55.3"
        stroke={color}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      {/* Middle hexagon — shifted down to form the W valley */}
      <polygon
        points="30,46 40,28.7 60,28.7 70,46 60,63.3 40,63.3"
        stroke={color}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      {/* Right hexagon */}
      <polygon
        points="57,38 67,20.7 87,20.7 97,38 87,55.3 67,55.3"
        stroke={color}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      {/* Checkmark inside right hexagon */}
      <polyline
        points="63,40 73,51 91,25"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
