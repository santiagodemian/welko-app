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
        return Math.min(p + Math.random() * 18 + 6, 100)
      })
    }, 80)

    const hide = setTimeout(() => setVisible(false), 1800)
    return () => { clearInterval(step); clearTimeout(hide) }
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: '#050505',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none',
            overflow: 'hidden',
          }}
        >
          {/* Stadium background */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/diseño8.jpeg"
            alt=""
            aria-hidden="true"
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center',
              opacity: 0.45,
            }}
          />

          {/* Vignette overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 20%, rgba(5,5,5,0.7) 80%, rgba(5,5,5,0.95) 100%)',
          }} />

          {/* Bottom ground gradient */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%',
            background: 'linear-gradient(to top, rgba(5,5,5,0.9) 0%, transparent 100%)',
          }} />

          {/* Top gradient */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '30%',
            background: 'linear-gradient(to bottom, rgba(5,5,5,0.6) 0%, transparent 100%)',
          }} />

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              position: 'relative', zIndex: 1,
            }}
          >
            {/* Logo */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/polariswhitelogo.jpeg"
              alt="Polaris Football"
              style={{ height: 80, objectFit: 'contain', marginBottom: 40 }}
            />

            {/* Loading label */}
            <p style={{
              color: 'rgba(255,255,255,0.3)',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-montserrat), sans-serif',
              margin: '0 0 12px',
            }}>
              Loading
            </p>

            {/* Progress bar */}
            <div style={{
              width: 220, height: 2,
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 2,
              overflow: 'hidden',
            }}>
              <motion.div
                style={{
                  height: '100%',
                  background: 'linear-gradient(to right, #2563EB, #60A5FA)',
                  borderRadius: 2,
                  originX: 0,
                }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ ease: 'easeOut', duration: 0.12 }}
              />
            </div>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            style={{
              position: 'absolute', bottom: 40,
              fontSize: 10, fontWeight: 700,
              letterSpacing: '0.28em', textTransform: 'uppercase',
              fontFamily: 'var(--font-montserrat), sans-serif',
              margin: 0, color: 'rgba(255,255,255,0.25)',
            }}
          >
            Prepare.{' '}
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>Perform.</span>{' '}
            <span style={{ color: '#2563EB' }}>Achieve.</span>
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
