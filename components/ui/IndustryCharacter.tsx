'use client'

import { INDUSTRIES } from '@/lib/industries'

interface IndustryCharacterProps {
  slug: string
  className?: string
}

/* ── Badge icons — simple SVG paths centered ~at (100,198) ── */
const BADGE: Record<string, React.ReactNode> = {
  dental: (
    <>
      {/* tooth */}
      <path d="M93 189 Q96 184 100 186 Q104 184 107 189 Q111 194 109 201 L107 208 Q103 212 100 212 Q97 212 93 208 L91 201 Q89 194 93 189 Z"
        fill="none" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
    </>
  ),
  psicologia: (
    <>
      {/* brain (two lobes) */}
      <path d="M100 190 Q107 187 110 192 Q115 194 112 200 Q114 205 109 207 L100 210 L91 207 Q86 205 88 200 Q85 194 90 192 Q93 187 100 190 Z"
        fill="none" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
      <line x1="100" y1="190" x2="100" y2="210" stroke="white" strokeWidth="1" opacity="0.6" />
    </>
  ),
  estetica: (
    <>
      {/* 4-point sparkle */}
      <path d="M100 187 L101.8 194.2 L109 196 L101.8 197.8 L100 205 L98.2 197.8 L91 196 L98.2 194.2 Z"
        fill="white" opacity="0.9" />
    </>
  ),
  nutricion: (
    <>
      {/* leaf */}
      <path d="M100 188 Q110 191 109 200 Q108 208 100 210 Q92 208 91 200 Q90 191 100 188 Z"
        fill="none" stroke="white" strokeWidth="1.5" />
      <line x1="100" y1="188" x2="100" y2="210" stroke="white" strokeWidth="1" opacity="0.7" />
    </>
  ),
  medicina: (
    <>
      {/* cross/plus */}
      <rect x="97" y="188" width="6" height="20" rx="2" fill="white" opacity="0.9" />
      <rect x="90" y="195" width="20" height="6" rx="2" fill="white" opacity="0.9" />
    </>
  ),
  pediatria: (
    <>
      {/* heart */}
      <path d="M100 207 Q89 200 90 193 Q90 187 95 187 Q98 186 100 190 Q102 186 105 187 Q110 187 110 193 Q111 200 100 207 Z"
        fill="white" opacity="0.9" />
    </>
  ),
  veterinaria: (
    <>
      {/* paw */}
      <circle cx="100" cy="201" r="6" fill="white" opacity="0.85" />
      <circle cx="92" cy="193" r="3.5" fill="white" opacity="0.85" />
      <circle cx="100" cy="190" r="3.5" fill="white" opacity="0.85" />
      <circle cx="108" cy="193" r="3.5" fill="white" opacity="0.85" />
    </>
  ),
  fisioterapia: (
    <>
      {/* lightning bolt */}
      <path d="M103 187 L96 199 L102 199 L97 211 L108 196 L102 196 Z"
        fill="white" opacity="0.9" />
    </>
  ),
  dermatologia: (
    <>
      {/* water drop */}
      <path d="M100 187 Q108 194 108 201 Q108 209 100 210 Q92 209 92 201 Q92 194 100 187 Z"
        fill="none" stroke="white" strokeWidth="1.5" />
      <circle cx="96" cy="202" r="2" fill="white" opacity="0.5" />
    </>
  ),
}

export function IndustryCharacter({ slug, className }: IndustryCharacterProps) {
  const industry = INDUSTRIES.find((i) => i.slug === slug)
  const color = industry?.color ?? '#3B82F6'
  const lightColor = industry?.lightColor ?? '#EFF6FF'

  const SKIN = '#F2D5B5'
  const HAIR = '#1C1C2E'

  return (
    <svg
      viewBox="0 0 200 270"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: '100%', height: 'auto' }}
      aria-hidden="true"
    >
      {/* Background glow */}
      <circle cx="100" cy="135" r="105" fill={lightColor} opacity="0.25" />

      {/* ── Lab coat body ── */}
      <path
        d="M32 162 C32 152 65 146 100 146 C135 146 168 152 168 162 L168 258 C168 262 164 264 160 264 L40 264 C36 264 32 262 32 258 Z"
        fill="white" stroke="#E5E7EB" strokeWidth="1.5"
      />

      {/* Coat lapels (V-neck) */}
      <path d="M100 146 L86 168 L74 164 Z" fill={lightColor} opacity="0.5" />
      <path d="M100 146 L114 168 L126 164 Z" fill={lightColor} opacity="0.5" />

      {/* Center line (coat button seam) */}
      <line x1="100" y1="170" x2="100" y2="260" stroke="#E5E7EB" strokeWidth="1" />

      {/* Chest badge */}
      <circle cx="100" cy="198" r="18" fill={color} />
      {BADGE[slug] ?? <circle cx="100" cy="198" r="6" fill="white" opacity="0.8" />}

      {/* Pocket (left side) */}
      <rect x="56" y="180" width="22" height="16" rx="4" fill="none" stroke="#E5E7EB" strokeWidth="1.2" />

      {/* Neck */}
      <rect x="91" y="138" width="18" height="12" rx="5" fill={SKIN} />

      {/* Head */}
      <circle cx="100" cy="104" r="48" fill={SKIN} />

      {/* Hair */}
      <path
        d="M54 96 Q54 52 100 52 Q146 52 146 96 Q140 66 100 64 Q60 66 54 96 Z"
        fill={HAIR}
      />

      {/* Ear details */}
      <ellipse cx="52" cy="108" rx="7" ry="9" fill={SKIN} />
      <ellipse cx="148" cy="108" rx="7" ry="9" fill={SKIN} />
      <ellipse cx="52" cy="108" rx="4" ry="6" fill="#E8C4A0" />
      <ellipse cx="148" cy="108" rx="4" ry="6" fill="#E8C4A0" />

      {/* Eyes */}
      <ellipse cx="87" cy="106" rx="7" ry="7" fill="#1A2A56" />
      <ellipse cx="113" cy="106" rx="7" ry="7" fill="#1A2A56" />
      <circle cx="89.5" cy="103.5" r="2.2" fill="white" />
      <circle cx="115.5" cy="103.5" r="2.2" fill="white" />

      {/* Smile */}
      <path d="M87 120 Q100 132 113 120" stroke="#8B6355" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* Subtle nose */}
      <path d="M97 114 Q100 118 103 114" stroke="#C4956A" strokeWidth="1.2" fill="none" strokeLinecap="round" />

      {/* ── Headphones ── */}
      {/* Arc */}
      <path
        d="M48 104 Q48 48 100 48 Q152 48 152 104"
        stroke={color} strokeWidth="9" fill="none" strokeLinecap="round"
      />

      {/* Left ear pad */}
      <rect x="38" y="94" width="18" height="30" rx="9" fill={color} />
      <rect x="42" y="99" width="10" height="20" rx="5" fill="white" opacity="0.25" />

      {/* Right ear pad */}
      <rect x="144" y="94" width="18" height="30" rx="9" fill={color} />
      <rect x="148" y="99" width="10" height="20" rx="5" fill="white" opacity="0.25" />

      {/* Mic arm */}
      <path d="M44 116 Q30 116 28 130" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="27" cy="133" r="5" fill={color} />
      <circle cx="27" cy="133" r="3" fill="white" opacity="0.3" />
    </svg>
  )
}
