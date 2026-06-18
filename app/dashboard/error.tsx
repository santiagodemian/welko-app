'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

const N = '#0A0A0A'
const G = '#2563EB'

export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', fontFamily: 'var(--font-montserrat), sans-serif', padding: 40 }}>
      <div style={{ textAlign: 'center', maxWidth: 440 }}>
        <div style={{ width: 56, height: 56, borderRadius: 14, background: 'rgba(239,68,68,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <AlertTriangle size={24} color="#EF4444" />
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: N, margin: '0 0 8px', letterSpacing: '-0.02em' }}>Page error</h2>
        <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 24px', lineHeight: 1.6 }}>
          This page ran into a problem. Try refreshing or go back to the dashboard.
        </p>
        {error.digest && (
          <p style={{ fontSize: 11, color: '#D1D5DB', margin: '0 0 16px', fontFamily: 'monospace' }}>Ref: {error.digest}</p>
        )}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={reset}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: N, color: 'white', border: 'none', padding: '10px 20px', borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            <RefreshCw size={13} /> Try again
          </button>
          <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'white', color: N, border: '1px solid #E5E7EB', padding: '10px 20px', borderRadius: 9, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
            <Home size={13} color={G} /> Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
