'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { useLang } from '@/contexts/LangContext'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const TESTIMONIALS = {
  es: [
    {
      name: 'Dra. Andrea Moreno',
      role: 'Directora · Clínica Dental Moreno',
      avatar: 'AM', color: '#3B82F6',
      quote: 'Antes perdíamos 8–12 mensajes al día. Con Welko el 100% se contestan solos. Recuperamos $34,000 MXN en citas el primer mes.',
      metric: '+$34k MXN', metricLabel: 'recuperados en 30 días',
    },
    {
      name: 'Lic. Roberto Sánchez',
      role: 'Fundador · Centro de Psicología',
      avatar: 'RS', color: '#8B5CF6',
      quote: 'Mis pacientes escriben a las 11pm y la IA responde al instante. Ahorro 9 horas semanales que antes dedicaba solo a confirmar citas.',
      metric: '9 h/sem', metricLabel: 'de administración ahorradas',
    },
    {
      name: 'Dra. Camila Torres',
      role: 'CEO · Centro Estético Torres',
      avatar: 'CT', color: '#EC4899',
      quote: 'Los no-shows bajaron un 35% desde que activamos los recordatorios automáticos. El equipo se enfoca en lo que importa.',
      metric: '−35%', metricLabel: 'en no-shows desde el día 1',
    },
  ],
  en: [
    {
      name: 'Dr. Andrea Moreno',
      role: 'Director · Moreno Dental Clinic',
      avatar: 'AM', color: '#3B82F6',
      quote: 'We were losing 8–12 messages a day. With Welko 100% get answered automatically. We recovered $34,000 MXN in appointments the first month.',
      metric: '+$34k MXN', metricLabel: 'recovered in 30 days',
    },
    {
      name: 'Roberto Sánchez',
      role: 'Founder · Psychology Center',
      avatar: 'RS', color: '#8B5CF6',
      quote: 'Patients write at 11pm and the AI responds instantly. I save 9 hours a week I used to spend just confirming appointments.',
      metric: '9 h/wk', metricLabel: 'of admin time saved',
    },
    {
      name: 'Dr. Camila Torres',
      role: 'CEO · Torres Aesthetic Center',
      avatar: 'CT', color: '#EC4899',
      quote: 'No-shows dropped 35% since we activated automatic reminders. The team can focus on what actually matters.',
      metric: '−35%', metricLabel: 'in no-shows from day 1',
    },
  ],
}

const variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
  center: { opacity: 1, x: 0 },
  exit:  (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
}

export function TestimonialsSection() {
  const { lang } = useLang()
  const items = TESTIMONIALS[lang as 'es' | 'en'] ?? TESTIMONIALS.es
  const [idx, setIdx] = useState(0)
  const [dir, setDir] = useState(1)

  const prev = useCallback(() => {
    setDir(-1)
    setIdx((i) => (i - 1 + items.length) % items.length)
  }, [items.length])

  const next = useCallback(() => {
    setDir(1)
    setIdx((i) => (i + 1) % items.length)
  }, [items.length])

  // Auto-advance every 5 s
  useEffect(() => {
    const t = setTimeout(() => { setDir(1); setIdx((i) => (i + 1) % items.length) }, 5000)
    return () => clearTimeout(t)
  }, [idx, items.length])

  const t = items[idx]

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
      <div className="max-w-3xl mx-auto flex flex-col items-center gap-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE }}
          className="flex flex-col items-center text-center gap-2"
        >
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--accent-label)' }}>
            {lang === 'es' ? 'Resultados del sector' : 'Industry results'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            {lang === 'es' ? 'Lo que las clínicas logran al automatizar' : 'What clinics achieve when they automate'}
          </h2>
          <p className="text-sm max-w-md" style={{ color: 'var(--text-muted)' }}>
            {lang === 'es' ? 'Resultados ilustrativos basados en clínicas del sector salud y estética en México.' : 'Illustrative results based on health and aesthetic clinics in Mexico.'}
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="w-full relative">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={idx}
              custom={dir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: EASE }}
              className="flex flex-col items-center text-center gap-6 px-2 sm:px-12"
            >
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} size={18} fill="#F59E0B" color="#F59E0B" />
                ))}
              </div>

              {/* Quote */}
              <p
                className="text-xl sm:text-2xl font-light leading-relaxed"
                style={{ color: 'var(--text-primary)', fontStyle: 'italic', maxWidth: 620 }}
              >
                "{t.quote}"
              </p>

              {/* Metric badge */}
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-xl"
                style={{ background: t.color + '14', border: `1px solid ${t.color}28` }}
              >
                <span className="font-extrabold text-sm" style={{ color: t.color }}>{t.metric}</span>
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{t.metricLabel}</span>
              </div>

              {/* Avatar + name */}
              <div className="flex items-center gap-3 pt-2">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                  style={{ background: t.color, color: '#fff', fontSize: 13 }}
                >
                  {t.avatar}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{t.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Arrows */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-150"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)'; (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-hover)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'; (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface)' }}
            aria-label="Anterior"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-150"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)'; (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-hover)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'; (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface)' }}
            aria-label="Siguiente"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Dot indicators */}
        <div className="flex items-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDir(i > idx ? 1 : -1); setIdx(i) }}
              className="rounded-full transition-all duration-200"
              style={{
                width: i === idx ? 24 : 8,
                height: 8,
                background: i === idx ? 'var(--text-primary)' : 'var(--border)',
              }}
              aria-label={`Ir al testimonio ${i + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
