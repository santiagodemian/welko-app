import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'

export const metadata: Metadata = {
  title: 'Política de Reembolsos | Welko',
  description: 'Garantía de satisfacción de 7 días. Si Welko no es lo que esperabas, te devolvemos tu dinero sin preguntas.',
}

export default function ReembolsosPage() {
  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20 px-4">
        <div className="max-w-3xl mx-auto flex flex-col gap-8">

          {/* Header */}
          <div className="flex flex-col gap-2">
            <Link
              href="/"
              className="text-sm font-medium w-fit"
              style={{ color: '#1A2A56' }}
            >
              ← Volver al inicio
            </Link>
            <h1
              className="text-3xl font-bold tracking-tight mt-4"
              style={{ color: '#111827' }}
            >
              Política de Reembolsos
            </h1>
            <p className="text-sm" style={{ color: '#6B7280' }}>
              Última actualización: Marzo 2026
            </p>
          </div>

          {/* Guarantee banner */}
          <div
            className="p-6 rounded-2xl flex items-start gap-4"
            style={{ background: '#E5E9F4', border: '1px solid #C5CEEA' }}
          >
            <span className="text-2xl flex-shrink-0">🛡️</span>
            <div className="flex flex-col gap-1">
              <p className="font-semibold" style={{ color: '#1A2A56' }}>
                Garantía de Satisfacción de 7 Días
              </p>
              <p className="text-sm" style={{ color: '#374151' }}>
                Prueba Welko sin riesgo. Si en los primeros 7 días no estás convencido,
                te devolvemos el 100% de tu pago sin preguntas ni trámites complicados.
              </p>
            </div>
          </div>

          <div className="w-full h-px" style={{ background: '#E5E7EB' }} />

          <div className="flex flex-col gap-8 text-base leading-relaxed" style={{ color: '#374151' }}>

            <Section title="1. Garantía de los Primeros 7 Días">
              <p>
                Welko ofrece una garantía de satisfacción total durante los primeros{' '}
                <strong style={{ color: '#111827' }}>7 días calendario</strong> desde la
                activación de la suscripción. Si por cualquier motivo el servicio no cumple
                tus expectativas, realizamos el reembolso completo del monto pagado, sin
                necesidad de justificación.
              </p>
              <p className="mt-3">
                Para solicitar el reembolso dentro de este periodo, contacta a nuestro equipo
                por{' '}
                <a
                  href="https://wa.me/525628443738"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#1A2A56', fontWeight: 600 }}
                >
                  WhatsApp
                </a>{' '}
                indicando tu nombre y el correo de registro. Procesaremos la solicitud en un
                plazo máximo de 5 días hábiles.
              </p>
            </Section>

            <Section title="2. Cancelaciones después del Período de Garantía">
              <p>
                Pasados los 7 días iniciales, el usuario puede cancelar su suscripción en
                cualquier momento. La cancelación detiene los cobros futuros de forma
                inmediata. No se realizan reembolsos proporcionales por el tiempo restante
                del ciclo de facturación en curso.
              </p>
            </Section>

            <Section title="3. Cargos No Autorizados">
              <p>
                Si detectas un cargo que no reconoces, contáctanos de inmediato. Investigaremos
                el caso y, si se confirma el error, realizaremos el reembolso completo en el
                plazo más breve posible.
              </p>
            </Section>

            <Section title="4. Proceso de Reembolso">
              <p>
                Los reembolsos se procesan al mismo método de pago original utilizado en la
                compra (tarjeta de crédito o débito vía Stripe). El tiempo de acreditación
                depende del banco emisor, generalmente entre 5 y 10 días hábiles.
              </p>
            </Section>

            <Section title="5. Contacto">
              <p>
                Para cualquier solicitud de reembolso o duda sobre facturación, contáctanos
                a través de nuestra{' '}
                <Link href="/contacto" style={{ color: '#1A2A56', fontWeight: 600 }}>
                  página de soporte
                </Link>
                .
              </p>
            </Section>

          </div>
        </div>
      </main>

      <footer
        className="py-6 px-4 text-center text-xs"
        style={{ color: '#9CA3AF', borderTop: '1px solid #E5E7EB' }}
      >
        © {new Date().getFullYear()} Welko — El recepcionista IA líder para Clínicas de Salud y Estética.
      </footer>
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold" style={{ color: '#111827' }}>
        {title}
      </h2>
      <div style={{ color: '#374151' }}>{children}</div>
    </section>
  )
}
