'use client'

import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import en from '@/lib/i18n/en.json'
import es from '@/lib/i18n/es.json'

export type Lang     = 'es' | 'en'
export type Currency = 'MXN' | 'USD'
type Translations = typeof es

// Countries where we show MXN + Spanish by default
const MXN_COUNTRIES = new Set(['MX'])
// Countries where English is default (all others default to EN + USD)
const LATAM_COUNTRIES = new Set([
  'MX','GT','BZ','SV','HN','NI','CR','PA',
  'CU','DO','PR','CO','VE','EC','PE','BO','CL','AR','UY','PY',
])

interface LangContextValue {
  lang:     Lang
  currency: Currency
  t:        Translations
  toggle:   () => void
  detected: boolean  // true once geolocation call completed
}

const LangContext = createContext<LangContextValue>({
  lang:     'en',
  currency: 'USD',
  t:        en,
  toggle:   () => {},
  detected: false,
})

function getStoredLang(): Lang | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('welko_lang') as Lang | null
}

function storeLang(lang: Lang) {
  if (typeof window !== 'undefined') localStorage.setItem('welko_lang', lang)
}

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang]         = useState<Lang>('en')
  const [currency, setCurrency] = useState<Currency>('USD')
  const [detected, setDetected] = useState(false)

  // On mount: check localStorage override, then IP detect
  useEffect(() => {
    const stored = getStoredLang()
    if (stored) {
      setLang(stored)
      setCurrency(stored === 'es' ? 'MXN' : 'USD')
      setDetected(true)
      return
    }

    // IP geolocation — ipapi.co free tier (1000 req/day, no key needed)
    fetch('https://ipapi.co/json/')
      .then((r) => r.json())
      .then((data: { country_code?: string }) => {
        const code = data?.country_code ?? ''
        if (MXN_COUNTRIES.has(code)) {
          setLang('es')
          setCurrency('MXN')
        } else if (LATAM_COUNTRIES.has(code)) {
          setLang('es')
          setCurrency('USD') // Latam outside MX sees USD
        } else {
          setLang('en')
          setCurrency('USD')
        }
      })
      .catch(() => {
        // Default to English/USD if geolocation fails
        setLang('en')
        setCurrency('USD')
      })
      .finally(() => setDetected(true))
  }, [])

  const toggle = useCallback(() => {
    setLang((l) => {
      const next: Lang = l === 'es' ? 'en' : 'es'
      // Keep currency MXN if toggling to ES and originally from MX,
      // otherwise USD. Use simple rule: ES → MXN, EN → USD
      setCurrency(next === 'es' ? 'MXN' : 'USD')
      storeLang(next)
      return next
    })
  }, [])

  const t = lang === 'es' ? es : en

  return (
    <LangContext.Provider value={{ lang, currency, t, toggle, detected }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
