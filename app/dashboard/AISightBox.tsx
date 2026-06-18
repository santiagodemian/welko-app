'use client'

import { useState, useEffect } from 'react'
import { Sparkles, Loader2, RefreshCw, AlertCircle } from 'lucide-react'

const N = '#0A0A0A'
const G = '#2563EB'
const SESSION_KEY = 'polaris_briefing_cache'

interface Cache { briefing: string; ts: number }
const CACHE_TTL = 4 * 60 * 60 * 1000 // 4 hours

export function AISightBox() {
  const [briefing, setBriefing] = useState<string | null>(null)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(false)

  async function generate(bust = false) {
    setLoading(true)
    setError(false)

    if (!bust) {
      try {
        const raw = sessionStorage.getItem(SESSION_KEY)
        if (raw) {
          const cache: Cache = JSON.parse(raw)
          if (Date.now() - cache.ts < CACHE_TTL) {
            setBriefing(cache.briefing)
            setLoading(false)
            return
          }
        }
      } catch { /* ignore */ }
    }

    try {
      const res  = await fetch('/api/dashboard/briefing')
      const data = await res.json()
      if (data.briefing) {
        setBriefing(data.briefing)
        try { sessionStorage.setItem(SESSION_KEY, JSON.stringify({ briefing: data.briefing, ts: Date.now() })) } catch { /* ignore */ }
      } else {
        setError(true)
      }
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { generate() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{
      background: `linear-gradient(135deg, ${N} 0%, #13244A 100%)`,
      borderRadius: 16, padding: 24,
      fontFamily: 'var(--font-montserrat), sans-serif',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <Sparkles size={14} color={G} />
          <span style={{ fontSize: 11, fontWeight: 800, color: G, textTransform: 'uppercase', letterSpacing: '0.09em' }}>
            AI Scouting Insight
          </span>
        </div>
        {!loading && (
          <button
            onClick={() => generate(true)}
            title="Refresh briefing"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.35)', padding: 0, display: 'flex' }}
          >
            <RefreshCw size={13} />
          </button>
        )}
      </div>

      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0' }}>
          <Loader2 size={14} color="rgba(255,255,255,0.4)" style={{ animation: 'spin 1s linear infinite' }} />
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>
            Generating morning briefing…
          </span>
          <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
        </div>
      )}

      {error && !loading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
          <AlertCircle size={14} color="#EF4444" />
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
            Briefing unavailable — check your OpenAI key.
          </span>
        </div>
      )}

      {briefing && !loading && !error && (
        <p style={{
          fontSize: 13, color: 'rgba(255,255,255,0.82)',
          lineHeight: 1.7, margin: 0,
        }}>
          {briefing}
        </p>
      )}

      {!loading && (
        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', margin: '12px 0 0' }}>
          Based on your live agency data · cached 4h
        </p>
      )}
    </div>
  )
}
