'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Phone, MessageCircle, Clock, BookOpen, Zap } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { useLang } from '@/contexts/LangContext'
import { WelkoLogo } from '@/components/ui/WelkoLogo'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]
const NAVY = '#13244A'

export default function SoportePage() {
  const { lang } = useLang()
  const isEN = lang === 'en'
  const year = new Date().getFullYear()

  const channels = isEN ? [
    { icon: MessageCircle, color: '#22C55E', title: 'WhatsApp', desc: 'Chat with our team directly. Usually responds in under 2 hours on business days.', action: 'Open WhatsApp', href: 'https://wa.me/525628443738?text=Hi%2C%20I%20need%20support%20with%20Welko' },
    { icon: Mail, color: '#3B82F6', title: 'Email', desc: 'Write to us at hello@welko.org. We respond within 24 hours on business days.', action: 'Send email', href: 'mailto:hello@welko.org' },
    { icon: Phone, color: '#8B5CF6', title: 'Phone', desc: 'Call us at +52 56 2844 3738. Available Mon–Fri 9am–7pm (Mexico City time).', action: 'Call now', href: 'tel:+525628443738' },
  ] : [
    { icon: MessageCircle, color: '#22C55E', title: 'WhatsApp', desc: 'Escríbenos directamente. Solemos responder en menos de 2 horas en días hábiles.', action: 'Abrir WhatsApp', href: 'https://wa.me/525628443738?text=Hola%2C%20necesito%20soporte%20con%20Welko' },
    { icon: Mail, color: '#3B82F6', title: 'Correo', desc: 'Escríbenos a hello@welko.org. Respondemos en menos de 24 horas en días hábiles.', action: 'Enviar correo', href: 'mailto:hello@welko.org' },
    { icon: Phone, color: '#8B5CF6', title: 'Teléfono', desc: 'Llámanos al +52 56 2844 3738. Disponible lun–vie 9am–7pm (hora CDMX).', action: 'Llamar ahora', href: 'tel:+525628443738' },
  ]

  const faqs = isEN ? [
    { q: 'How do I set up Welko?', a: 'After signing up, the onboarding wizard walks you through connecting your WhatsApp Business number, configuring business hours, and training the AI. Setup takes under 24 hours.' },
    { q: 'What happens if I need to change my AI\'s responses?', a: 'You can edit your AI\'s knowledge base at any time from your dashboard under "AI Knowledge." Changes take effect immediately.' },
    { q: 'Can I connect multiple channels?', a: 'Yes. Depending on your plan, you can connect WhatsApp, Instagram DMs, Facebook Messenger, and a web widget — all from the same dashboard.' },
    { q: 'Is there a free trial?', a: 'We don\'t offer a free trial at the moment, but you can try the interactive simulator on our homepage to see how the AI responds. We also offer a 7-day refund guarantee.' },
    { q: 'How do I cancel my subscription?', a: 'Go to your dashboard → Account → Billing → Cancel plan. Cancellation is immediate; your service continues until the end of the current billing period.' },
    { q: 'What is the WhatsApp Business API?', a: 'It\'s WhatsApp\'s official API for businesses. Unlike the regular app, it allows automated responses, multi-agent access, and integration with external tools like Welko.' },
  ] : [
    { q: '¿Cómo configuro Welko?', a: 'Tras registrarte, el asistente de configuración te guía para conectar tu número de WhatsApp Business, establecer horarios y entrenar la IA. Todo en menos de 24 horas.' },
    { q: '¿Puedo cambiar las respuestas de la IA?', a: 'Sí. Desde tu dashboard en "Conocimiento de la IA" puedes editar toda la información en cualquier momento. Los cambios aplican de inmediato.' },
    { q: '¿Puedo conectar varios canales?', a: 'Sí. Según tu plan, puedes conectar WhatsApp, Instagram DMs, Facebook Messenger y un widget web — todos desde el mismo panel.' },
    { q: '¿Hay periodo de prueba?', a: 'Por el momento no ofrecemos prueba gratuita, pero puedes probar el simulador interactivo en la página principal. Además contamos con garantía de reembolso de 7 días.' },
    { q: '¿Cómo cancelo mi suscripción?', a: 'Ve a tu dashboard → Cuenta → Facturación → Cancelar plan. La cancelación es inmediata; tu servicio continúa hasta el fin del período de facturación actual.' },
    { q: '¿Qué es la API de WhatsApp Business?', a: 'Es la API oficial de WhatsApp para empresas. A diferencia de la app regular, permite respuestas automatizadas, acceso multiagente e integración con herramientas externas como Welko.' },
  ]

  return (
    <>
      <Navbar />
      <main className="flex flex-col flex-1 pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex flex-col gap-14">

          {/* Hero */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }}
            className="flex flex-col items-center text-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--accent-label)' }}>
              {isEN ? 'Support' : 'Soporte'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              {isEN ? 'How can we help you?' : '¿En qué podemos ayudarte?'}
            </h1>
            <p className="text-base max-w-lg" style={{ color: 'var(--text-secondary)' }}>
              {isEN
                ? 'Our team is here Monday–Friday 9am–7pm (Mexico City). We usually respond in under 2 hours.'
                : 'Nuestro equipo está disponible lunes a viernes de 9am–7pm (CDMX). Solemos responder en menos de 2 horas.'}
            </p>
          </motion.div>

          {/* Contact channels */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {channels.map((ch, i) => (
              <motion.a key={i} href={ch.href} target={ch.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, ease: EASE, delay: i * 0.08 }}
                className="flex flex-col gap-4 p-6 rounded-2xl transition-all duration-200"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', textDecoration: 'none' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = ch.color + '55'; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = `0 8px 24px ${ch.color}15` }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = 'var(--border)'; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: ch.color + '15' }}>
                  <ch.icon size={18} color={ch.color} />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{ch.title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{ch.desc}</p>
                </div>
                <span className="text-xs font-semibold mt-auto" style={{ color: ch.color }}>{ch.action} →</span>
              </motion.a>
            ))}
          </div>

          {/* Response time badge */}
          <div className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
            <Clock size={16} color="#3B82F6" className="flex-shrink-0" />
            <p className="text-sm" style={{ color: '#1E40AF' }}>
              {isEN
                ? 'Average response time: under 2 hours on business days. For urgent issues, WhatsApp is fastest.'
                : 'Tiempo promedio de respuesta: menos de 2 horas en días hábiles. Para urgencias, WhatsApp es el canal más rápido.'}
            </p>
          </div>

          {/* FAQ */}
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-3">
              <BookOpen size={18} color={NAVY} />
              <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                {isEN ? 'Frequently Asked Questions' : 'Preguntas Frecuentes'}
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              {faqs.map((faq, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.4, ease: EASE, delay: i * 0.06 }}
                  className="flex flex-col gap-2 p-5 rounded-2xl"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <div className="flex items-start gap-3">
                    <Zap size={14} color={NAVY} className="flex-shrink-0 mt-0.5" />
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{faq.q}</p>
                  </div>
                  <p className="text-sm leading-relaxed pl-5" style={{ color: 'var(--text-secondary)' }}>{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Still need help */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE }}
            className="flex flex-col items-center text-center gap-4 p-10 rounded-3xl"
            style={{ background: '#E5E9F4', border: `1.5px solid ${NAVY}22` }}>
            <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              {isEN ? 'Still need help?' : '¿Aún necesitas ayuda?'}
            </h2>
            <p className="text-sm max-w-sm" style={{ color: 'var(--text-secondary)' }}>
              {isEN
                ? 'Send us a message and a real person from our team will get back to you.'
                : 'Envíanos un mensaje y una persona real de nuestro equipo te responderá.'}
            </p>
            <a href="https://wa.me/525628443738" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold"
              style={{ background: NAVY, color: '#FFFFFF' }}>
              <MessageCircle size={15} />
              {isEN ? 'Chat on WhatsApp' : 'Escribir por WhatsApp'}
            </a>
          </motion.div>

        </div>
      </main>

      <footer className="py-8 px-4 sm:px-6" style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2"><WelkoLogo size={18} /><p className="text-xs" style={{ color: 'var(--text-muted)' }}>© {year} Demian Santiago Mendoza Ledesma — Welko</p></div>
          <Link href="/" className="text-xs" style={{ color: 'var(--text-muted)' }}>← {isEN ? 'Back to home' : 'Volver al inicio'}</Link>
        </div>
      </footer>
    </>
  )
}
