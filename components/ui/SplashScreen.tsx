'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function SplashScreen() {
  const [visible, setVisible] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const step = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(step); return 100 }
        return p + Math.random() * 18 + 6
      })
    }, 80)

    const hide = setTimeout(() => setVisible(false), 1600)
    return () => { clearInterval(step); clearTimeout(hide) }
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: '#050505',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none',
            overflow: 'hidden',
          }}
        >
          {/* Stadium light rays */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse 60% 40% at 20% 0%, rgba(37,99,235,0.08) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 0%, rgba(37,99,235,0.06) 0%, transparent 70%)',
          }} />
          {/* Ground glow */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '35%',
            background: 'linear-gradient(to top, rgba(37,99,235,0.04) 0%, transparent 100%)',
          }} />
          {/* Pitch line */}
          <div style={{
            position: 'absolute', bottom: '18%', left: '50%',
            transform: 'translateX(-50%)',
            width: '60%', height: 1,
            background: 'rgba(255,255,255,0.04)',
          }} />

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, position: 'relative', zIndex: 1 }}
          >
            {/* Logo */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/polariswhitelogo.jpeg"
              alt="Polaris Football"
              style={{ height: 72, objectFit: 'contain', marginBottom: 32 }}
            />

            {/* Loading label */}
            <p style={{
              color: 'rgba(255,255,255,0.25)',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-montserrat), sans-serif',
              margin: '0 0 10px',
            }}>
              Loading
            </p>

            {/* Progress bar */}
            <div style={{
              width: 200, height: 2,
              background: 'rgba(255,255,255,0.08)',
              borderRadius: 2,
              overflow: 'hidden',
            }}>
              <motion.div
                style={{
                  height: '100%',
                  background: '#2563EB',
                  borderRadius: 2,
                  originX: 0,
                }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ ease: 'easeOut', duration: 0.1 }}
              />
            </div>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{
              position: 'absolute', bottom: 36,
              fontSize: 10, fontWeight: 700,
              letterSpacing: '0.22em', textTransform: 'uppercase',
              fontFamily: 'var(--font-montserrat), sans-serif',
              margin: 0, color: 'rgba(255,255,255,0.18)',
            }}
          >
            Prepare.{' '}
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>Perform.</span>{' '}
            <span style={{ color: '#2563EB' }}>Achieve.</span>
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
