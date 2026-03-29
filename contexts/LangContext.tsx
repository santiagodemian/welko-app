'use client'

import { createContext, useContext, useState, useCallback } from 'react'
import en from '@/lib/i18n/en.json'
import es from '@/lib/i18n/es.json'

type Lang = 'es' | 'en'
type Translations = typeof es

interface LangContextValue {
  lang: Lang
  t: Translations
  toggle: () => void
}

const LangContext = createContext<LangContextValue>({
  lang: 'es',
  t: es,
  toggle: () => {},
})

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('es')

  const toggle = useCallback(() => {
    setLang((l) => (l === 'es' ? 'en' : 'es'))
  }, [])

  const t = lang === 'es' ? es : en

  return (
    <LangContext.Provider value={{ lang, t, toggle }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
