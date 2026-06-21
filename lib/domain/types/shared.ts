// ─── Primitives ───────────────────────────────────────────────────────────────

export type ID = string

export type DateString = string   // ISO 8601 "2026-06-21" or display "June 2026"

export type CurrencyCode = 'EUR' | 'USD' | 'GBP' | 'ARS' | 'MAD' | 'CHF' | 'DKK' | 'SEK' | 'NOK' | 'BRL'

export interface Money {
  amount: number
  currency: CurrencyCode
}

export type Continent = 'Europe' | 'Africa' | 'South America' | 'North America' | 'Asia' | 'Oceania'

export type Foot = 'Left' | 'Right' | 'Both'

export type ActiveStatus = 'active' | 'inactive' | 'archived'
