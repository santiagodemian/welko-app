'use client'

import React from 'react'

interface WelkoLogoProps {
  /** Stroke/icon color */
  color?: string
  /**
   * Fill color for each hexagon's interior.
   * Set to the background color behind the logo to get the
   * proper interlocking effect (each hex "cuts through" the next).
   * Defaults to 'transparent' (flat overlap, no interlocking).
   */
  bgColor?: string
  size?: number
  className?: string
  style?: React.CSSProperties
}

/**
 * Official Welko logo — three flat-top hexagons forming a W,
 * with a checkmark diagonal inside the rightmost hex.
 *
 * Draw order: right → middle → left.
 * With bgColor matching the surface behind, each hex's fill masks
 * the earlier hex's strokes, producing the interlocking chain effect.
 *
 * viewBox: 0 0 166 104   aspect ≈ 1.60 : 1
 *
 * Hex geometry (flat-top, r=34, h=29.4):
 *   Left   center (41, 53): 7,53  24,23.6  58,23.6  75,53  58,82.4  24,82.4
 *   Middle center (83, 62): 49,62 66,32.6 100,32.6 117,62 100,91.4  66,91.4
 *   Right  center (125,53): 91,53 108,23.6 142,23.6 159,53 142,82.4 108,82.4
 */
export function WelkoLogo({
  color = '#13244A',
  bgColor = 'transparent',
  size = 20,
  className,
  style,
}: WelkoLogoProps) {
  const w = Math.round((size * 166) / 104)

  return (
    <svg
      width={w}
      height={size}
      viewBox="0 0 166 104"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      {/*
        RIGHT hexagon — drawn first (bottommost layer).
        Middle and left hexagons' fills will mask it at junctions.
      */}
      <polygon
        points="159,53 142,23.6 108,23.6 91,53 108,82.4 142,82.4"
        fill={bgColor}
        stroke={color}
        strokeWidth="13"
        strokeLinejoin="round"
      />

      {/* Checkmark inside right hexagon: lower-left → knee → upper-right */}
      <polyline
        points="99,61 115,76 140,33"
        stroke={color}
        strokeWidth="13"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/*
        MIDDLE hexagon — drawn second.
        Its fill masks the right hex's strokes at the middle-right junction
        (middle appears in front of right).
        Left hex's fill will mask it at the left-middle junction.
      */}
      <polygon
        points="117,62 100,32.6 66,32.6 49,62 66,91.4 100,91.4"
        fill={bgColor}
        stroke={color}
        strokeWidth="13"
        strokeLinejoin="round"
      />

      {/*
        LEFT hexagon — drawn last (topmost layer).
        Its fill masks the middle hex's strokes at the left-middle junction
        (left appears in front of middle).
      */}
      <polygon
        points="75,53 58,23.6 24,23.6 7,53 24,82.4 58,82.4"
        fill={bgColor}
        stroke={color}
        strokeWidth="13"
        strokeLinejoin="round"
      />
    </svg>
  )
}
