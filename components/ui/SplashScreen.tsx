'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { WelkoLogo } from '@/components/ui/WelkoLogo'

export function SplashScreen() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 1500)
    return () => clearTimeout(t)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: '#1A2A56',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.07, 1], opacity: [0.75, 1, 0.75] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}
          >
            <WelkoLogo color="#FFFFFF" size={52} />
            <span style={{
              color: '#FFFFFF',
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: '-0.02em',
            }}>
              Welko
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
