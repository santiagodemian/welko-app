'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export function RefTracker() {
  const params = useSearchParams()

  useEffect(() => {
    const ref = params.get('ref')
    if (ref) {
      try { localStorage.setItem('wlk_ref', ref) } catch { /* ignore */ }
    }
  }, [params])

  return null
}
