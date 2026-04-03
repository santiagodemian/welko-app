'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { DollarSign, BookOpen, HeadphonesIcon, BarChart2, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { useLang } from '@/contexts/LangContext'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export default function PartnersPage() {
  const { lang } = useLang()

  const benefits = lang === 'es'
    ? [
        { Icon: DollarSign,       title: '15% de comisión recurrente',          desc: 'Gana el 15% mensual por cada clínica que incorpores, mientras sigan siendo clientes activos.' },
        { Icon: BookOpen,         title: 'Capacitación y materiales incluidos',  desc: 'Acceso a guías de venta, presentaciones, casos de éxito y entrenamiento sobre el producto.' },
        { Icon: HeadphonesIcon,   title: 'Soporte técnico para tus clientes',    desc: 'Nuestro equipo respalda a cada clínica que incorpores. Tú recomiendas, nosotros entregamos.' },
        { Icon: BarChart2,        title: 'Dashboard de comisiones en tiempo real', desc: 'Visualiza tus referidos activos, ingresos acumulados y pagos pendientes desde un solo panel.' },
      ]
    : [
        { Icon: DollarSign,       title: '15% recurring commission',             desc: 'Earn 15% monthly for every clinic you bring on, as long as they remain active clients.' },
        { Icon: BookOpen,         title: 'Training and materials included',       desc: 'Access sales guides, presentations, success stories, and product training.' },
        { Icon: HeadphonesIcon,   title: 'Technical support for your clients',    desc: 'Our team supports every clinic you bring in. You recommend, we deliver.' },
        { Icon: BarChart2,        title: 'Real-time commission dashboard',        desc: 'View your active referrals, accumulated income, and pending payments from one panel.' },
      ]

  const steps = lang === 'es'
    ? [
        'Postula como partner y aprobamos tu perfil en 48 h.',
        'Recibes acceso al kit de ventas y capacitación inicial.',
        'Recomiendas Welko a clínicas de tu red.',
        'Recibes el 15% mensual por cada cliente activo.',
      ]
    : [
        'Apply as a partner and we approve your profile within 48 h.',
        'You get access to the sales kit and initial training.',
        'Recommend Welko to clinics in your network.',
        'Earn 15% monthly for every active client.',
      ]

  return (
    <>
      <Navbar />

      <main className="flex flex-col flex-1 pt-24">

        {/* ── Hero ── */}
        <section className="px-4 sm:px-6 pt-10 pb-14 sm:pt-14 sm:pb-20">
          <div className="max-w-3xl mx-auto flex flex-col gap-6">
            <motion.span
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="text-xs font-semibold uppercase tracking-widest w-fit"
              style={{ color: 'var(--accent)' }}
            >
              {lang === 'es' ? 'Partner Program' : 'Partner Program'}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.08 }}
              className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              {lang === 'es'
                ? <>Gana comisiones recurrentes distribuyendo <span style={{ color: 'var(--accent)' }}>la infraestructura de atención inteligente líder en LATAM</span></>
                : <>Earn recurring commissions distributing <span style={{ color: 'var(--accent)' }}>the leading intelligent engagement infrastructure in LATAM</span></>}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE, delay: 0.15 }}
              className="text-sm sm:text-base leading-relaxed max-w-2xl"
              style={{ color: 'var(--text-secondary)' }}
            >
              {lang === 'es'
                ? 'Únete a nuestra red de partners y lleva automatización de élite a empresas de alta demanda en toda Latinoamérica. Sin inventario, sin riesgo, con comisiones mensuales recurrentes.'
                : 'Join our partner network and bring elite automation to high-demand businesses across Latin America. No inventory, no risk, with monthly recurring commissions.'}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE, delay: 0.22 }}
            >
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-opacity duration-150"
                style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = '0.88')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = '1')}
              >
                {lang === 'es' ? 'Postularme como partner' : 'Apply as a partner'}
                <ArrowRight size={15} />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ── Benefits ── */}
        <section className="py-14 sm:py-20 px-4 sm:px-6" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
          <div className="max-w-4xl mx-auto flex flex-col gap-8">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              {lang === 'es' ? '¿Qué incluye el programa?' : 'What does the program include?'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {benefits.map((b, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.45, ease: EASE, delay: i * 0.08 }}
                  className="flex flex-col gap-4 p-5 rounded-2xl"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#E5E9F4' }}>
                    <b.Icon size={18} color="#13244A" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{b.title}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{b.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section className="py-14 sm:py-20 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto flex flex-col gap-8">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              {lang === 'es' ? 'Cómo funciona' : 'How it works'}
            </h2>
            <ol className="flex flex-col gap-4">
              {steps.map((step, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.4, ease: EASE, delay: i * 0.08 }}
                  className="flex items-start gap-4"
                >
                  <span
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-sm leading-relaxed pt-0.5" style={{ color: 'var(--text-primary)' }}>
                    {step}
                  </span>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-14 sm:py-20 px-4 sm:px-6" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE }}
            className="max-w-3xl mx-auto flex flex-col items-center text-center gap-5 p-10 rounded-3xl"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <CheckCircle2 size={32} style={{ color: 'var(--accent)' }} />
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              {lang === 'es' ? '¿Listo para empezar?' : 'Ready to start?'}
            </h2>
            <p className="text-sm leading-relaxed max-w-md" style={{ color: 'var(--text-secondary)' }}>
              {lang === 'es'
                ? 'Envíanos tu información y en menos de 48 horas te contactamos para darte acceso al programa.'
                : 'Send us your information and within 48 hours we will contact you to give you access to the program.'}
            </p>
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-opacity duration-150"
              style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = '0.88')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = '1')}
            >
              {lang === 'es' ? 'Postularme como partner' : 'Apply as a partner'}
              <ArrowRight size={15} />
            </Link>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {lang === 'es'
                ? 'Sin costo de afiliación · Comisiones mensuales · Soporte dedicado'
                : 'No affiliation fee · Monthly commissions · Dedicated support'}
            </p>
          </motion.div>
        </section>

      </main>

      <footer className="py-8 px-4 sm:px-6" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} Welko —{' '}
            {lang === 'es'
              ? 'La infraestructura de atención inteligente líder en Latinoamérica.'
              : 'The leading intelligent engagement infrastructure in Latin America.'}
          </p>
        </div>
      </footer>
    </>
  )
}
