'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { WelkoLogo } from '@/components/ui/WelkoLogo'

export function SplashScreen() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 1600)
    return () => clearTimeout(t)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: 'easeInOut' }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: '#05101F',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <motion.div
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}
          >
            <WelkoLogo size={56} variant="dark" />
            <span style={{
              color: 'rgba(240,244,252,0.75)',
              fontSize: 20,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              fontFamily: 'var(--font-montserrat), sans-serif',
            }}>
              Welko
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
