'use client'

import { motion } from 'framer-motion'

const CHAT = [
  { from: 'patient', text: 'Hola, me gustaría agendar una cita.' },
  { from: 'welko',   text: '¡Hola! Con gusto. ¿Qué día y hora te gustaría?' },
  { from: 'patient', text: 'Sábado a las 10am.' },
  { from: 'welko',   text: '¡Excelente! Cita confirmada para el sábado a las 10am. Te esperamos. 📅' },
]

export function TabletMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className="flex items-center justify-center w-full"
    >
      {/* Floating wrapper */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ filter: 'drop-shadow(0 32px 48px rgba(19,36,74,0.22)) drop-shadow(0 8px 16px rgba(0,0,0,0.14))' }}
      >
        {/* Tablet outer frame — Space Gray */}
        <div
          className="relative flex items-center justify-center"
          style={{
            width: 300,
            height: 420,
            background: 'linear-gradient(145deg, #4A4A4A 0%, #2C2C2C 50%, #1E1E1E 100%)',
            borderRadius: 28,
            padding: 10,
            boxSizing: 'border-box',
          }}
        >
          {/* Camera dot */}
          <div
            className="absolute top-[18px] left-1/2 -translate-x-1/2 rounded-full"
            style={{ width: 7, height: 7, background: '#111' }}
          />

          {/* Screen */}
          <div
            className="relative w-full h-full overflow-hidden flex flex-col"
            style={{
              borderRadius: 20,
              background: '#ECE5DD',
            }}
          >
            {/* WhatsApp-style header */}
            <div
              className="flex items-center gap-2.5 px-3 py-2.5 flex-shrink-0"
              style={{ background: '#1A2A56' }}
            >
              {/* Avatar */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: '#FFFFFF' }}
              >
                <span className="text-xs font-black" style={{ color: '#1A2A56' }}>W</span>
              </div>
              {/* Name + status */}
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold leading-none" style={{ color: '#FFFFFF' }}>
                  Welko
                </span>
                <div className="flex items-center gap-1">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: '#25D366' }}
                  />
                  <span className="text-[9px]" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    en línea
                  </span>
                </div>
              </div>
              {/* Dots menu */}
              <div className="ml-auto flex gap-0.5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1 h-1 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.5)' }}
                  />
                ))}
              </div>
            </div>

            {/* Chat messages */}
            <div className="flex flex-col gap-2 p-3 overflow-hidden flex-1">
              {/* Date stamp */}
              <div className="flex justify-center">
                <span
                  className="text-[9px] px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.6)', color: '#6B7280' }}
                >
                  Hoy
                </span>
              </div>

              {CHAT.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.15, duration: 0.3 }}
                  className={`flex ${msg.from === 'welko' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className="max-w-[78%] px-2.5 py-1.5 text-[10px] leading-relaxed"
                    style={{
                      borderRadius:
                        msg.from === 'welko'
                          ? '12px 12px 2px 12px'
                          : '12px 12px 12px 2px',
                      background: msg.from === 'welko' ? '#1A2A56' : '#FFFFFF',
                      color: msg.from === 'welko' ? '#FFFFFF' : '#111827',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                    }}
                  >
                    {msg.text}
                    {/* Timestamp */}
                    <span
                      className="block text-right mt-0.5 text-[8px]"
                      style={{
                        color: msg.from === 'welko' ? 'rgba(255,255,255,0.55)' : '#9CA3AF',
                      }}
                    >
                      {['9:41', '9:41', '9:42', '9:42'][i]} ✓✓
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input bar */}
            <div
              className="flex items-center gap-2 px-2 py-2 flex-shrink-0"
              style={{ background: '#F0F2F5' }}
            >
              <div
                className="flex-1 h-7 rounded-full px-3 flex items-center"
                style={{ background: '#FFFFFF' }}
              >
                <span className="text-[9px]" style={{ color: '#9CA3AF' }}>
                  Escribe un mensaje
                </span>
              </div>
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: '#1A2A56' }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Side button detail */}
          <div
            className="absolute right-[-3px] top-16"
            style={{
              width: 3,
              height: 32,
              background: '#1A1A1A',
              borderRadius: '0 2px 2px 0',
            }}
          />
          <div
            className="absolute left-[-3px] top-12"
            style={{
              width: 3,
              height: 22,
              background: '#1A1A1A',
              borderRadius: '2px 0 0 2px',
            }}
          />
          <div
            className="absolute left-[-3px] top-[68px]"
            style={{
              width: 3,
              height: 22,
              background: '#1A1A1A',
              borderRadius: '2px 0 0 2px',
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}
