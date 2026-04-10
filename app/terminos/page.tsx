'use client'

import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { useLang } from '@/contexts/LangContext'
import { WelkoLogo } from '@/components/ui/WelkoLogo'

export default function TerminosPage() {
  const { lang } = useLang()
  const isEN = lang === 'en'
  const year = new Date().getFullYear()

  const sections = isEN ? [
    { title: '1. Service Description', body: 'Welko is a SaaS platform that provides an AI-powered receptionist for businesses across all industries. The service includes automated appointment scheduling, client communication via WhatsApp, Instagram, Facebook Messenger, and other channels, CRM features, and AI-driven insights.' },
    { title: '2. Subscription & Payment', body: 'Welko offers monthly and annual subscription plans. Payments are processed securely via Stripe. Prices are in MXN for Mexico and USD internationally, exclusive of applicable taxes. Subscriptions auto-renew unless cancelled before renewal.' },
    { title: '3. Cancellation', body: 'You may cancel your subscription at any time from your account dashboard. Cancellation takes effect at the end of the current billing period. No partial refunds for unused time, except as covered by our Refund Policy.' },
    { title: '4. Acceptable Use', body: 'You may not use Welko to send spam, harass users, violate applicable laws, scrape data, or reverse-engineer the platform. Welko may suspend accounts that violate these terms.' },
    { title: '5. Intellectual Property', body: 'All content, features and functionality of Welko — including software, logos and text — are the exclusive property of Demian Santiago Mendoza Ledesma and protected by intellectual property laws.' },
    { title: '6. Limitation of Liability', body: 'Welko is provided "as is." We do not guarantee uninterrupted service. To the maximum extent permitted by law, Welko is not liable for indirect or consequential damages from use of the Service.' },
    { title: '7. Governing Law', body: 'These Terms are governed by the laws of Mexico. Disputes shall be resolved in the courts of Mexico City, Mexico.' },
    { title: '8. Changes', body: 'We may update these Terms at any time. Continued use after changes constitutes acceptance. Material changes will be notified by email with at least 15 days notice.' },
    { title: '9. Contact', body: 'For questions, email hola@welko.org or call +52 56 2844 3738.' },
  ] : [
    { title: '1. Descripción del Servicio', body: 'Welko es una plataforma SaaS que proporciona un recepcionista con inteligencia artificial para negocios de todas las industrias. El servicio incluye agendamiento automático, comunicación con clientes por WhatsApp, Instagram, Facebook Messenger y otros canales, funciones de CRM e insights generados por IA.' },
    { title: '2. Suscripción y Pago', body: 'Welko ofrece planes de suscripción mensual y anual. Los pagos se procesan de forma segura a través de Stripe. Los precios están en MXN para México y en USD para uso internacional, sin IVA incluido. Las suscripciones se renuevan automáticamente salvo cancelación previa.' },
    { title: '3. Cancelación', body: 'Puedes cancelar tu suscripción en cualquier momento desde tu panel de cuenta. La cancelación tiene efecto al final del ciclo de facturación vigente. No se emiten reembolsos parciales por tiempo no utilizado, salvo lo cubierto por nuestra Política de Reembolso.' },
    { title: '4. Uso Aceptable', body: 'No puedes usar Welko para enviar spam, hostigar usuarios, violar leyes aplicables, extraer datos de forma automatizada ni realizar ingeniería inversa. Welko puede suspender cuentas que incumplan estos términos.' },
    { title: '5. Propiedad Intelectual', body: 'Todo el contenido, funcionalidades y características de Welko — incluyendo software, logotipos y textos — son propiedad exclusiva de Demian Santiago Mendoza Ledesma y están protegidos por las leyes de propiedad intelectual.' },
    { title: '6. Limitación de Responsabilidad', body: 'Welko se proporciona "tal como es". No garantizamos disponibilidad ininterrumpida. En la máxima medida permitida por la ley, Welko no es responsable de daños indirectos o consecuentes derivados del uso del Servicio.' },
    { title: '7. Ley Aplicable', body: 'Estos Términos se rigen por las leyes de México. Las disputas se resolverán en los tribunales de la Ciudad de México, México.' },
    { title: '8. Cambios', body: 'Podemos actualizar estos Términos en cualquier momento. El uso continuado del Servicio tras los cambios constituye aceptación. Los cambios materiales serán notificados por correo electrónico con al menos 15 días de anticipación.' },
    { title: '9. Contacto', body: 'Para preguntas, escríbenos a hola@welko.org o llámanos al +52 56 2844 3738.' },
  ]

  return (
    <>
      <Navbar />
      <main className="flex flex-col flex-1 pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--accent-label)' }}>Legal</span>
            <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              {isEN ? 'Terms & Conditions' : 'Términos y Condiciones'}
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {isEN ? `Last updated: April ${year}` : `Última actualización: Abril ${year}`}
            </p>
          </div>
          <hr style={{ borderColor: 'var(--border)' }} />
          <div className="flex flex-col gap-7">
            {sections.map((s, i) => (
              <div key={i} className="flex flex-col gap-2">
                <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>{s.title}</h2>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <footer className="py-8 px-4 sm:px-6" style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2"><WelkoLogo size={18} /><p className="text-xs" style={{ color: 'var(--text-muted)' }}>© {year}{' '}Demian Santiago Mendoza Ledesma — Welko</p></div>
          <Link href="/" className="text-xs" style={{ color: 'var(--text-muted)' }}>← {isEN ? 'Back to home' : 'Volver al inicio'}</Link>
        </div>
      </footer>
    </>
  )
}
