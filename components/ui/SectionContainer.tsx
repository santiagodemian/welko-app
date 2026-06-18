import type { CSSProperties, ReactNode } from 'react'
import { SECTION } from '@/lib/ds'

interface SectionContainerProps {
  children: ReactNode
  /** Additional outer section styles (background, borderTop, etc.) */
  style?: CSSProperties
  /** Additional inner div styles */
  innerStyle?: CSSProperties
  /** Vertical padding preset */
  spacing?: 'standard' | 'hero' | 'compact' | 'none'
  /** Disable horizontal padding */
  flush?: boolean
  id?: string
}

const V_PAD: Record<string, string | number> = {
  standard: SECTION.padV,
  hero:     SECTION.padVHero,
  compact:  SECTION.padVCompact,
  none:     0,
}

/**
 * Consistent section wrapper: max-width + standard padding.
 * Use as the outer shell for every page section.
 */
export function SectionContainer({
  children,
  style,
  innerStyle,
  spacing = 'standard',
  flush   = false,
  id,
}: SectionContainerProps) {
  return (
    <section
      id={id}
      style={{
        padding: flush ? `${V_PAD[spacing]} 0` : `${V_PAD[spacing]} ${SECTION.padH}`,
        ...style,
      }}
    >
      <div style={{ maxWidth: SECTION.maxW, margin: '0 auto', ...innerStyle }}>
        {children}
      </div>
    </section>
  )
}
