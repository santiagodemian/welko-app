'use client'

import { useEffect } from 'react'

function hexToRgb(hex: string) {
  const clean = hex.replace('#', '')
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  }
}

function darken(hex: string, amount = 0.14): string {
  const { r, g, b } = hexToRgb(hex)
  const f = 1 - amount
  const d = (n: number) => Math.round(n * f).toString(16).padStart(2, '0')
  return `#${d(r)}${d(g)}${d(b)}`
}

export function applyBrandColor(hex: string) {
  const root = document.documentElement
  root.style.setProperty('--accent',        hex)
  root.style.setProperty('--accent-hover',  darken(hex))
  root.style.setProperty('--accent-subtle', hexToRgba(hex, 0.10))
  root.style.setProperty('--accent-ghost',  hexToRgba(hex, 0.05))
  root.style.setProperty('--accent-label',  hex)
}

function hexToRgba(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex)
  return `rgba(${r},${g},${b},${alpha})`
}

export function BrandColorApplier({ dbColor }: { dbColor?: string | null }) {
  useEffect(() => {
    // DB color takes precedence; localStorage is a fallback for unsaved sessions
    const color = dbColor ?? localStorage.getItem('polaris_brand_color')
    if (color) {
      applyBrandColor(color)
      localStorage.setItem('polaris_brand_color', color)
    }

    function onColorChange(e: Event) {
      const c = (e as CustomEvent<{ color: string }>).detail?.color
      if (c) applyBrandColor(c)
    }
    window.addEventListener('polaris-brand-color', onColorChange)
    return () => window.removeEventListener('polaris-brand-color', onColorChange)
  }, [dbColor])

  return null
}
