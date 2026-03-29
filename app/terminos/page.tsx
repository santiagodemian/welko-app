import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'

export const metadata: Metadata = {
  title: 'Términos y Condiciones | Welko',
  description: 'Términos y condiciones del servicio Welko — recepcionista IA para clínicas.',
}

export default function TerminosPage() {
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
              Términos y Condiciones
            </h1>
            <p className="text-sm" style={{ color: '#6B7280' }}>
              Última actualización: Marzo 2026
            </p>
          </div>

          <div
            className="w-full h-px"
            style={{ background: '#E5E7EB' }}
          />

          {/* Content */}
          <div className="flex flex-col gap-8 text-base leading-relaxed" style={{ color: '#374151' }}>

            <Section title="1. Descripción del Servicio">
              <p>
                Welko es una plataforma de software como servicio (SaaS) que proporciona un
                recepcionista virtual con inteligencia artificial diseñado para clínicas de
                salud y estética. El servicio incluye agendamiento automático de citas,
                respuesta a consultas por canales digitales y envío de recordatorios a pacientes.
              </p>
            </Section>

            <Section title="2. Modalidad de Suscripción">
              <p>
                Welko opera bajo un modelo de suscripción mensual o anual. Al contratar el
                servicio, el usuario autoriza el cobro recurrente del plan seleccionado a través
                del procesador de pagos Stripe. No existen plazos forzosos: el usuario puede
                cancelar su suscripción en cualquier momento desde su panel de control, sin
                cargos adicionales por cancelación.
              </p>
              <p className="mt-3">
                Los cargos son prepagados. Una vez procesado el pago de un periodo, no se
                realizan reembolsos por el tiempo restante del ciclo en curso.
              </p>
            </Section>

            <Section title="3. Responsabilidad sobre Datos de Pacientes">
              <p>
                El usuario (clínica o profesional de salud) es el único responsable legal de
                los datos personales y médicos de sus pacientes que ingrese, comparta o procese
                a través de la plataforma Welko. El usuario declara contar con el consentimiento
                de sus pacientes para el tratamiento automatizado de sus datos de contacto con
                fines de agendamiento y comunicación.
              </p>
              <p className="mt-3">
                Welko actúa como procesador de datos en los términos que establece la legislación
                aplicable, y no asume responsabilidad por el uso indebido de la información
                ingresada por el usuario.
              </p>
            </Section>

            <Section title="4. Uso Aceptable">
              <p>
                El usuario se compromete a utilizar Welko exclusivamente para la gestión legítima
                de su clínica. Queda prohibido usar el servicio para enviar comunicaciones no
                solicitadas (spam), actividades fraudulentas o cualquier uso que infrinja leyes
                locales o federales aplicables en México.
              </p>
            </Section>

            <Section title="5. Disponibilidad del Servicio">
              <p>
                Welko realiza sus mejores esfuerzos para garantizar una disponibilidad del
                servicio del 99.5% mensual. Sin embargo, no garantiza disponibilidad
                ininterrumpida y no se hace responsable por pérdidas derivadas de
                interrupciones temporales del servicio.
              </p>
            </Section>

            <Section title="6. Propiedad Intelectual">
              <p>
                Todos los derechos de propiedad intelectual sobre la plataforma, el software,
                los modelos de inteligencia artificial y los materiales relacionados son
                propiedad exclusiva de Welko. El usuario recibe una licencia de uso limitada,
                no exclusiva e intransferible durante la vigencia de su suscripción.
              </p>
            </Section>

            <Section title="7. Modificaciones">
              <p>
                Welko se reserva el derecho de modificar estos Términos en cualquier momento.
                Los cambios serán notificados al usuario con al menos 15 días de anticipación
                por correo electrónico. El uso continuado del servicio tras la notificación
                implica la aceptación de los nuevos términos.
              </p>
            </Section>

            <Section title="8. Contacto">
              <p>
                Para dudas sobre estos Términos, puedes contactarnos a través de{' '}
                <a
                  href="https://wa.me/525628443738"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#1A2A56', fontWeight: 600 }}
                >
                  WhatsApp
                </a>{' '}
                o visitar nuestra{' '}
                <Link href="/contacto" style={{ color: '#1A2A56', fontWeight: 600 }}>
                  página de contacto
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
