'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

const N = '#0A1628'
const G = '#1E6FEB'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html>
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', maxWidth: 480, padding: '0 24px' }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: 'rgba(239,68,68,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <AlertTriangle size={28} color="#EF4444" />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: N, margin: '0 0 8px', letterSpacing: '-0.02em' }}>Something went wrong</h1>
          <p style={{ fontSize: 14, color: '#6B7280', margin: '0 0 28px', lineHeight: 1.6 }}>
            An unexpected error occurred. If this keeps happening, please contact support.
          </p>
          {error.digest && (
            <p style={{ fontSize: 11, color: '#D1D5DB', margin: '0 0 20px', fontFamily: 'monospace' }}>Error ID: {error.digest}</p>
          )}
          <button
            onClick={reset}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: N, color: 'white', border: 'none', padding: '12px 24px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
          >
            <RefreshCw size={14} /> Try again
          </button>
          <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 20 }}>
            <a href="/" style={{ color: G, textDecoration: 'none', fontWeight: 600 }}>← Back to home</a>
          </p>
        </div>
      </body>
    </html>
  )
}
