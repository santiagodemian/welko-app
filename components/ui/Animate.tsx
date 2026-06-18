'use client'

import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'

type AnimateType = 'fadeIn' | 'slideUp' | 'slideLeft' | 'scale'

interface AnimateProps {
  children:  ReactNode
  type?:     AnimateType
  delay?:    number   // ms
  duration?: number   // ms
  threshold?:number   // 0–1 intersection ratio
  style?:    CSSProperties
  className?: string
}

const HIDDEN: Record<AnimateType, CSSProperties> = {
  fadeIn:    { opacity: 0 },
  slideUp:   { opacity: 0, transform: 'translateY(20px)' },
  slideLeft: { opacity: 0, transform: 'translateX(-12px)' },
  scale:     { opacity: 0, transform: 'scale(0.96)' },
}

const VISIBLE: CSSProperties = { opacity: 1, transform: 'none' }

/**
 * Scroll-triggered animation wrapper.
 * Fires once when the element enters the viewport.
 * Uses IntersectionObserver — zero JS in the critical path.
 *
 * @example
 * <Animate type="slideUp" delay={100}>
 *   <MyCard />
 * </Animate>
 */
export function Animate({
  children,
  type      = 'slideUp',
  delay     = 0,
  duration  = 500,
  threshold = 0.1,
  style,
  className,
}: AnimateProps) {
  const ref     = useRef<HTMLDivElement>(null)
  const [vis, setVis] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVis(true)
          observer.disconnect()
        }
      },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        transition: `opacity ${duration}ms ease ${delay}ms, transform ${duration}ms ease ${delay}ms`,
        willChange: 'opacity, transform',
        ...(vis ? VISIBLE : HIDDEN[type]),
      }}
    >
      {children}
    </div>
  )
}

/**
 * Staggered children — wraps each child in Animate with incremental delay.
 */
interface StaggerProps {
  children:   ReactNode[]
  type?:      AnimateType
  baseDelay?: number
  step?:      number
  style?:     CSSProperties
  className?: string
}

export function Stagger({
  children,
  type      = 'slideUp',
  baseDelay = 0,
  step      = 80,
  style,
  className,
}: StaggerProps) {
  return (
    <>
      {children.map((child, i) => (
        <Animate key={i} type={type} delay={baseDelay + i * step} style={style} className={className}>
          {child}
        </Animate>
      ))}
    </>
  )
}
