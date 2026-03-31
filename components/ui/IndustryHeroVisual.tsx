'use client'

import { IndustryCharacter } from '@/components/ui/IndustryCharacter'
import { INDUSTRIES } from '@/lib/industries'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  slug: string
}

export function IndustryHeroVisual({ slug }: Props) {
  const industry = INDUSTRIES.find((i) => i.slug === slug)
  const color = industry?.color ?? '#13244A'
  const lightColor = industry?.lightColor ?? '#EEF2FF'

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={slug}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full rounded-3xl overflow-hidden"
        style={{
          background: lightColor,
          border: `1.5px solid ${color}22`,
          padding: '32px 24px 0',
          minHeight: 320,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        {/* Glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 20%, ${color}18 0%, transparent 70%)`,
          }}
        />

        {/* Industry label badge */}
        <div
          className="absolute top-5 left-5 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
          style={{ background: color, color: '#FFFFFF' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white opacity-80" />
          {industry ? (industry.es.name) : 'IA'}
        </div>

        {/* Placeholder image slot — drop ia-{slug}.jpg into /public/images/ */}
        <div className="w-full max-w-[260px] mx-auto relative z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/images/ia-${slug}.jpg`}
            alt={industry?.es.name ?? slug}
            className="w-full object-cover rounded-t-2xl"
            style={{ display: 'block', minHeight: 200 }}
            onError={(e) => {
              // If image doesn't exist yet, hide and show SVG character
              (e.currentTarget as HTMLImageElement).style.display = 'none'
              const fallback = e.currentTarget.nextElementSibling as HTMLElement
              if (fallback) fallback.style.display = 'block'
            }}
          />
          {/* SVG fallback — hidden if real image loads */}
          <div style={{ display: 'none' }}>
            <IndustryCharacter slug={slug} />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
