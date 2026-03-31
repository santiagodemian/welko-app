'use client'

import { INDUSTRIES } from '@/lib/industries'

interface Props {
  slug: string
  size?: 'sm' | 'md' | 'lg'
}

/* ── Per-industry robot outfit color accent ── */
const ROBOT_ACCENT: Record<string, string> = {
  dental:       '#3B82F6',
  psicologia:   '#8B5CF6',
  estetica:     '#EC4899',
  nutricion:    '#22C55E',
  ginecologia:  '#F472B6',
  oftalmologia: '#6366F1',
  medicina:     '#EF4444',
  pediatria:    '#F59E0B',
  veterinaria:  '#14B8A6',
  fisioterapia: '#0EA5E9',
  dermatologia: '#A78BFA',
}

/* ── Coat / outfit color per industry ── */
const COAT_COLOR: Record<string, string> = {
  dental:       '#FFFFFF',
  psicologia:   '#EDE9FE',
  estetica:     '#FCE7F3',
  nutricion:    '#DCFCE7',
  ginecologia:  '#FCE7F3',
  oftalmologia: '#EEF2FF',
  medicina:     '#DBEAFE',
  pediatria:    '#DBEAFE',
  veterinaria:  '#CCFBF1',
  fisioterapia: '#E0F2FE',
  dermatologia: '#EDE9FE',
}

export function IndustryRobotVisual({ slug, size = 'md' }: Props) {
  const industry = INDUSTRIES.find((i) => i.slug === slug)
  const accent   = ROBOT_ACCENT[slug] ?? '#13244A'
  const coat     = COAT_COLOR[slug] ?? '#FFFFFF'
  const lightBg  = industry?.lightColor ?? '#EFF6FF'

  const viewSize = size === 'sm' ? 160 : size === 'lg' ? 320 : 240

  return (
    <div
      className="relative w-full flex flex-col items-center justify-end overflow-hidden rounded-2xl"
      style={{
        background: `linear-gradient(160deg, ${lightBg} 0%, #FFFFFF 100%)`,
        minHeight: viewSize,
        padding: '24px 16px 0',
      }}
    >
      {/* Subtle glow behind robot */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 welko-pulse-glow"
        style={{
          width: '60%',
          height: '40%',
          background: `radial-gradient(ellipse, ${accent}28 0%, transparent 70%)`,
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />

      {/* Try real image first */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/images/ia-${slug}.jpg`}
        alt={industry?.es.name ?? slug}
        className="welko-float relative z-10 w-full object-contain rounded-t-xl"
        style={{ maxHeight: viewSize * 0.85, display: 'block' }}
        onError={(e) => {
          const img = e.currentTarget as HTMLImageElement
          img.style.display = 'none'
          const svg = img.nextElementSibling as HTMLElement
          if (svg) svg.style.display = 'block'
        }}
      />

      {/* SVG Robot fallback — shown only when no real image */}
      <svg
        viewBox="0 0 200 260"
        xmlns="http://www.w3.org/2000/svg"
        className="welko-float relative z-10 w-full"
        style={{ display: 'none', maxHeight: viewSize * 0.85 }}
        aria-hidden="true"
      >
        {/* ── Shadow base ── */}
        <ellipse cx="100" cy="252" rx="45" ry="6" fill={accent} opacity="0.12" />

        {/* ── Body ── */}
        {/* Torso */}
        <rect x="55" y="148" width="90" height="96" rx="14" fill={coat} stroke={accent} strokeWidth="1.5" />

        {/* Chest panel */}
        <rect x="72" y="162" width="56" height="36" rx="8" fill={accent} opacity="0.12" />
        {/* Chest indicator lights */}
        <circle cx="86"  cy="178" r="4" fill={accent} opacity="0.9" />
        <circle cx="100" cy="178" r="4" fill={accent} opacity="0.6" />
        <circle cx="114" cy="178" r="4" fill={accent} opacity="0.3" />
        {/* Chest line */}
        <rect x="80" y="186" width="40" height="2" rx="1" fill={accent} opacity="0.3" />
        <rect x="80" y="191" width="28" height="2" rx="1" fill={accent} opacity="0.2" />

        {/* ── Arms ── */}
        {/* Left arm */}
        <rect x="29" y="152" width="24" height="72" rx="12" fill={coat} stroke={accent} strokeWidth="1.5" />
        <rect x="33" y="216" width="16" height="18" rx="8" fill={accent} opacity="0.7" />
        {/* Right arm */}
        <rect x="147" y="152" width="24" height="72" rx="12" fill={coat} stroke={accent} strokeWidth="1.5" />
        <rect x="151" y="216" width="16" height="18" rx="8" fill={accent} opacity="0.7" />

        {/* ── Neck ── */}
        <rect x="88" y="134" width="24" height="18" rx="6" fill={accent} opacity="0.6" />
        <rect x="92" y="138" width="16" height="10" rx="4" fill="white" opacity="0.4" />

        {/* ── Head ── */}
        <rect x="46" y="62" width="108" height="76" rx="22" fill={accent} opacity="0.85" />
        {/* Head highlight */}
        <rect x="52" y="66" width="96" height="30" rx="16" fill="white" opacity="0.08" />

        {/* Face screen / visor */}
        <rect x="58" y="76" width="84" height="44" rx="12" fill="#0A152A" opacity="0.9" />
        {/* Screen glow */}
        <rect x="60" y="78" width="80" height="40" rx="10" fill={accent} opacity="0.08" />

        {/* Eyes — LED style */}
        <rect x="70"  y="90" width="22" height="14" rx="7" fill={accent} opacity="0.95" />
        <rect x="108" y="90" width="22" height="14" rx="7" fill={accent} opacity="0.95" />
        {/* Eye reflection */}
        <rect x="73"  y="92" width="8" height="5" rx="2.5" fill="white" opacity="0.5" />
        <rect x="111" y="92" width="8" height="5" rx="2.5" fill="white" opacity="0.5" />

        {/* Mouth — thin LED bar */}
        <rect x="80" y="110" width="40" height="3" rx="1.5" fill={accent} opacity="0.6" />

        {/* Head top antenna */}
        <rect x="97" y="46" width="6" height="18" rx="3" fill={accent} opacity="0.7" />
        <circle cx="100" cy="43" r="6" fill={accent} className="welko-pulse-glow" />
        <circle cx="100" cy="43" r="3" fill="white" opacity="0.7" />

        {/* ── Headphones ── */}
        {/* Arc */}
        <path
          d="M42 100 Q42 44 100 44 Q158 44 158 100"
          stroke={accent} strokeWidth="8" fill="none" strokeLinecap="round"
        />
        {/* Left cup */}
        <rect x="32" y="88" width="16" height="30" rx="8" fill={accent} />
        <rect x="36" y="93" width="8" height="20" rx="4" fill="white" opacity="0.2" />
        {/* Right cup */}
        <rect x="152" y="88" width="16" height="30" rx="8" fill={accent} />
        <rect x="156" y="93" width="8" height="20" rx="4" fill="white" opacity="0.2" />
        {/* Mic arm */}
        <path d="M38 110 Q24 112 22 126" stroke={accent} strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="21" cy="129" r="5" fill={accent} />
        <circle cx="21" cy="129" r="2.5" fill="white" opacity="0.4" />
      </svg>
    </div>
  )
}
