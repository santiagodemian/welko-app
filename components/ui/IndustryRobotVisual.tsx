'use client'

import { INDUSTRIES } from '@/lib/industries'

interface Props {
  slug: string
  size?: 'sm' | 'md' | 'lg'
}

const NAVY = '#1A2A56'

const ACCENT: Record<string, string> = {
  dental:        '#3B82F6',
  psicologia:    '#8B5CF6',
  estetica:      '#EC4899',
  nutricion:     '#16A34A',
  ginecologia:   '#F472B6',
  oftalmologia:  '#6366F1',
  medica:        '#0EA5E9',
  fisioterapia:  '#0EA5E9',
  spa:           '#A78BFA',
  quiropractica: '#10B981',
}

function Accessory({ slug, a }: { slug: string; a: string }) {
  if (slug === 'dental') return (
    <g>
      <rect x="155" y="168" width="4" height="26" rx="2" fill={a}/>
      <circle cx="157" cy="165" r="7" fill="none" stroke={a} strokeWidth="2.5"/>
      <circle cx="157" cy="165" r="4" fill={a} opacity="0.3"/>
      <path d="M36 180 Q38 168 43 170 Q48 168 48 175 Q48 183 43 186 Q38 183 36 180Z" fill="white" stroke={a} strokeWidth="1.5"/>
    </g>
  )
  if (slug === 'psicologia') return (
    <g>
      <rect x="150" y="164" width="22" height="28" rx="3" fill="white" stroke={a} strokeWidth="1.5"/>
      <rect x="154" y="172" width="14" height="2" rx="1" fill={a} opacity="0.5"/>
      <rect x="154" y="177" width="14" height="2" rx="1" fill={a} opacity="0.4"/>
      <rect x="154" y="182" width="9" height="2" rx="1" fill={a} opacity="0.3"/>
      <rect x="157" y="161" width="8" height="6" rx="2" fill={a}/>
      <path d="M32 178 Q34 170 39 172 Q41 168 46 170 Q50 168 50 174 Q52 179 48 183 Q44 186 40 184 Q35 186 33 182Z" fill="none" stroke={a} strokeWidth="1.5"/>
    </g>
  )
  if (slug === 'estetica') return (
    <g>
      <rect x="153" y="162" width="3" height="28" rx="1.5" fill={a} transform="rotate(20 154 176)"/>
      <circle cx="163" cy="174" r="2" fill={a}/>
      <circle cx="168" cy="167" r="1.5" fill={a} opacity="0.6"/>
      <ellipse cx="38" cy="178" rx="9" ry="11" fill="none" stroke={a} strokeWidth="2"/>
      <ellipse cx="38" cy="178" rx="6" ry="8" fill={a} opacity="0.12"/>
      <rect x="36" y="189" width="4" height="8" rx="2" fill={a}/>
    </g>
  )
  if (slug === 'nutricion') return (
    <g>
      <path d="M40 175 Q37 168 39 163 Q43 158 47 162 Q51 158 54 163 Q57 168 54 175 Q51 183 47 184 Q43 183 40 175Z" fill={a} opacity="0.8"/>
      <path d="M47 162 Q49 156 51 154" stroke={a} strokeWidth="2" fill="none" strokeLinecap="round"/>
      <rect x="152" y="168" width="18" height="12" rx="4" fill={a} opacity="0.7"/>
      <rect x="154" y="171" width="14" height="2" rx="1" fill="white" opacity="0.5"/>
    </g>
  )
  if (slug === 'ginecologia') return (
    <g>
      <rect x="150" y="162" width="24" height="30" rx="4" fill="white" stroke={a} strokeWidth="1.5"/>
      <path d="M153 178 L157 172 L161 180 L164 175 L168 178" stroke={a} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="157" y="159" width="10" height="6" rx="2" fill={a}/>
      <path d="M35 177 Q35 168 39 168 Q43 168 43 172 Q43 168 48 168 Q52 168 52 177 Q52 183 43.5 189 Q35 183 35 177Z" fill={a} opacity="0.7"/>
    </g>
  )
  if (slug === 'oftalmologia') return (
    <g>
      <rect x="150" y="160" width="22" height="32" rx="3" fill="white" stroke={a} strokeWidth="1.5"/>
      <text x="161" y="171" textAnchor="middle" fontSize="7" fontWeight="bold" fill={a}>E</text>
      <text x="161" y="179" textAnchor="middle" fontSize="5.5" fontWeight="bold" fill={a}>FP</text>
      <text x="161" y="186" textAnchor="middle" fontSize="4.5" fill={a}>TOZ</text>
      <circle cx="40" cy="175" r="12" fill="none" stroke={a} strokeWidth="2"/>
      <circle cx="40" cy="175" r="7" fill={a} opacity="0.15"/>
      <line x1="28" y1="175" x2="52" y2="175" stroke={a} strokeWidth="1" opacity="0.4"/>
      <line x1="40" y1="163" x2="40" y2="187" stroke={a} strokeWidth="1" opacity="0.4"/>
    </g>
  )
  if (slug === 'medica') return (
    <g>
      <circle cx="43" cy="183" r="9" fill="none" stroke={a} strokeWidth="2.5"/>
      <circle cx="43" cy="183" r="5" fill={a} opacity="0.2"/>
      <path d="M43 174 Q43 164 49 159 Q57 154 61 159 Q65 164 61 169" fill="none" stroke={a} strokeWidth="3" strokeLinecap="round"/>
      <circle cx="61" cy="169" r="4" fill={a}/>
      <line x1="61" y1="165" x2="67" y2="161" stroke={a} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="61" y1="165" x2="55" y2="161" stroke={a} strokeWidth="2.5" strokeLinecap="round"/>
      <rect x="152" y="163" width="20" height="26" rx="3" fill="white" stroke={a} strokeWidth="1.5"/>
      <rect x="155" y="158" width="14" height="8" rx="3" fill={a} opacity="0.7"/>
      <rect x="155" y="170" width="14" height="2" rx="1" fill={a} opacity="0.4"/>
      <rect x="155" y="175" width="14" height="2" rx="1" fill={a} opacity="0.3"/>
    </g>
  )
  if (slug === 'fisioterapia') return (
    <g>
      <path d="M27 185 Q37 174 48 185" fill="none" stroke={a} strokeWidth="3" strokeLinecap="round"/>
      <path d="M27 185 Q37 196 48 185" fill="none" stroke={a} strokeWidth="3" strokeLinecap="round" opacity="0.4"/>
      <rect x="152" y="163" width="20" height="24" rx="3" fill="white" stroke={a} strokeWidth="1.5"/>
      <polyline points="154,183 158,178 162,174 166,170 170,165" fill="none" stroke={a} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
  )
  if (slug === 'spa') return (
    <g>
      <ellipse cx="44" cy="178" rx="8" ry="12" fill={a} opacity="0.2" transform="rotate(-22 44 178)"/>
      <ellipse cx="44" cy="178" rx="8" ry="12" fill={a} opacity="0.2" transform="rotate(22 44 178)"/>
      <ellipse cx="44" cy="178" rx="6" ry="10" fill={a} opacity="0.45"/>
      <circle cx="44" cy="178" r="4" fill={a}/>
      <rect x="157" y="172" width="8" height="20" rx="2" fill={a} opacity="0.3" stroke={a} strokeWidth="1.5"/>
      <path d="M161 168 Q163 163 162 161 Q160 163 161 168Z" fill="#FCD34D"/>
    </g>
  )
  if (slug === 'quiropractica') return (
    <g>
      <rect x="39" y="160" width="10" height="8" rx="3" fill={a} opacity="0.8"/>
      <rect x="39" y="171" width="10" height="8" rx="3" fill={a} opacity="0.7"/>
      <rect x="39" y="182" width="10" height="8" rx="3" fill={a} opacity="0.6"/>
      <line x1="44" y1="168" x2="44" y2="171" stroke={a} strokeWidth="2"/>
      <line x1="44" y1="179" x2="44" y2="182" stroke={a} strokeWidth="2"/>
      <line x1="36" y1="164" x2="30" y2="162" stroke={a} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="36" y1="175" x2="30" y2="175" stroke={a} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="52" y1="164" x2="58" y2="162" stroke={a} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="52" y1="175" x2="58" y2="175" stroke={a} strokeWidth="1.5" strokeLinecap="round"/>
    </g>
  )
  return null
}

export function IndustryRobotVisual({ slug, size = 'md' }: Props) {
  const industry = INDUSTRIES.find((i) => i.slug === slug)
  const accent   = ACCENT[slug] ?? NAVY
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
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 welko-pulse-glow"
        style={{
          width: '60%', height: '40%',
          background: `radial-gradient(ellipse, ${accent}28 0%, transparent 70%)`,
          borderRadius: '50%', pointerEvents: 'none',
        }}
      />
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
      <svg
        viewBox="0 0 200 260"
        xmlns="http://www.w3.org/2000/svg"
        className="welko-float relative z-10 w-full"
        style={{ display: 'none', maxHeight: viewSize * 0.85 }}
        aria-hidden="true"
      >
        <ellipse cx="100" cy="252" rx="45" ry="6" fill={NAVY} opacity="0.12"/>
        <rect x="55" y="148" width="90" height="96" rx="14" fill={NAVY}/>
        <path d="M100 155 L88 168 L100 172 L112 168 Z" fill={accent} opacity="0.3"/>
        <rect x="63" y="161" width="22" height="18" rx="4" fill={NAVY} stroke={accent} strokeWidth="1.2"/>
        <text x="74" y="172" textAnchor="middle" fontSize="7" fontWeight="900" fill="white" letterSpacing="0.5">W</text>
        <rect x="65" y="175" width="18" height="1.5" rx="0.75" fill={accent} opacity="0.6"/>
        <rect x="91" y="163" width="37" height="28" rx="7" fill={accent} opacity="0.16"/>
        <circle cx="103" cy="175" r="3.5" fill={accent} opacity="0.95"/>
        <circle cx="112" cy="175" r="3.5" fill={accent} opacity="0.6"/>
        <circle cx="121" cy="175" r="3.5" fill={accent} opacity="0.3"/>
        <rect x="94" y="183" width="31" height="2" rx="1" fill={accent} opacity="0.3"/>
        <rect x="94" y="187" width="22" height="1.5" rx="0.75" fill={accent} opacity="0.2"/>
        <rect x="29" y="152" width="24" height="72" rx="12" fill={NAVY}/>
        <rect x="29" y="152" width="24" height="10" rx="6" fill={accent} opacity="0.18"/>
        <rect x="33" y="216" width="16" height="18" rx="8" fill={accent} opacity="0.65"/>
        <rect x="147" y="152" width="24" height="72" rx="12" fill={NAVY}/>
        <rect x="147" y="152" width="24" height="10" rx="6" fill={accent} opacity="0.18"/>
        <rect x="151" y="216" width="16" height="18" rx="8" fill={accent} opacity="0.65"/>
        <rect x="88" y="134" width="24" height="18" rx="6" fill={accent} opacity="0.45"/>
        <rect x="92" y="138" width="16" height="10" rx="4" fill="white" opacity="0.25"/>
        <rect x="46" y="62" width="108" height="76" rx="22" fill={NAVY}/>
        <rect x="52" y="66" width="96" height="26" rx="14" fill="white" opacity="0.05"/>
        <rect x="58" y="76" width="84" height="44" rx="12" fill="#040D1E"/>
        <rect x="60" y="78" width="80" height="40" rx="10" fill={accent} opacity="0.06"/>
        <rect x="67"  y="88" width="28" height="15" rx="7.5" fill={accent}/>
        <rect x="105" y="88" width="28" height="15" rx="7.5" fill={accent}/>
        <rect x="71"  y="90" width="10" height="5.5" rx="2.75" fill="white" opacity="0.5"/>
        <rect x="109" y="90" width="10" height="5.5" rx="2.75" fill="white" opacity="0.5"/>
        <circle cx="83"  cy="95.5" r="4" fill={accent} opacity="0.35"/>
        <circle cx="121" cy="95.5" r="4" fill={accent} opacity="0.35"/>
        <path d="M76 110 Q100 119 124 110" stroke={accent} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.65"/>
        <rect x="97" y="44" width="6" height="20" rx="3" fill={accent} opacity="0.6"/>
        <circle cx="100" cy="41" r="7" fill={accent} className="welko-pulse-glow"/>
        <circle cx="100" cy="41" r="3.5" fill="white" opacity="0.75"/>
        <path d="M39 97 Q39 39 100 39 Q161 39 161 97" stroke={NAVY} strokeWidth="10" fill="none" strokeLinecap="round"/>
        <path d="M39 97 Q39 39 100 39 Q161 39 161 97" stroke={accent} strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.45"/>
        <rect x="27" y="85" width="18" height="32" rx="9" fill={NAVY}/>
        <rect x="27" y="85" width="18" height="32" rx="9" fill={accent} opacity="0.28"/>
        <rect x="31" y="90" width="10" height="22" rx="5" fill="white" opacity="0.08"/>
        <rect x="155" y="85" width="18" height="32" rx="9" fill={NAVY}/>
        <rect x="155" y="85" width="18" height="32" rx="9" fill={accent} opacity="0.28"/>
        <rect x="159" y="90" width="10" height="22" rx="5" fill="white" opacity="0.08"/>
        <path d="M35 109 Q19 112 17 129" stroke={accent} strokeWidth="3.5" fill="none" strokeLinecap="round"/>
        <circle cx="16" cy="132" r="6" fill={accent}/>
        <circle cx="16" cy="132" r="3" fill="white" opacity="0.4"/>
        <Accessory slug={slug} a={accent}/>
      </svg>
    </div>
  )
}
