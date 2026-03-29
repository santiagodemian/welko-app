import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { DollarSign, BookOpen, HeadphonesIcon, BarChart2, ArrowRight, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Vende Welko | Partner Program',
  description: 'Únete al programa de partners de Welko y genera ingresos recurrentes distribuyendo el recepcionista IA #1 para clínicas en México.',
}

const BENEFITS = [
  {
    Icon: DollarSign,
    title: '15% de comisión recurrente',
    desc: 'Gana el 15% mensual por cada clínica que incorpores, mientras sigan siendo clientes activos.',
  },
  {
    Icon: BookOpen,
    title: 'Capacitación y materiales incluidos',
    desc: 'Acceso a guías de venta, presentaciones, casos de éxito y entrenamiento sobre el producto.',
  },
  {
    Icon: HeadphonesIcon,
    title: 'Soporte técnico para tus clientes',
    desc: 'Nuestro equipo respalda a cada clínica que incorpores. Tú vendes, nosotros entregamos.',
  },
  {
    Icon: BarChart2,
    title: 'Dashboard de comisiones en tiempo real',
    desc: 'Visualiza tus referidos activos, ingresos acumulados y pagos pendientes desde un solo panel.',
  },
]

const STEPS = [
  'Postula como partner y aprobamos tu perfil en 48 h.',
  'Recibes acceso al kit de ventas y capacitación inicial.',
  'Presentas Welko a clínicas de tu red.',
  'Recibes el 15% mensual por cada cliente activo.',
]

export default function VendeWelkoPage() {
  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20 px-4">
        <div className="max-w-5xl mx-auto flex flex-col gap-16">

          {/* Back */}
          <Link href="/" className="text-sm font-medium w-fit" style={{ color: 'var(--accent)' }}>
            ← Volver al inicio
          </Link>

          {/* Hero */}
          <div className="flex flex-col gap-5 max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
              Partner Program
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight" style={{ color: 'var(--text-primary)' }}>
              Vende Welko y genera{' '}
              <span style={{ color: 'var(--accent)' }}>ingresos recurrentes</span>
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Únete a nuestra red de partners y distribuye el recepcionista IA líder para clínicas
              en México. Sin inventario, sin riesgo, con comisiones mensuales mientras tus clientes
              sigan activos.
            </p>
            <div className="pt-2">
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-colors duration-150"
                style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
              >
                Postularme como distribuidor
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Benefits grid */}
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              ¿Qué incluye el programa?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {BENEFITS.map((b) => (
                <div
                  key={b.title}
                  className="flex flex-col gap-4 p-6 rounded-2xl"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'var(--bg-secondary)' }}
                  >
                    <b.Icon size={20} style={{ color: 'var(--accent)' }} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {b.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {b.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How it works */}
          <div
            className="flex flex-col gap-6 p-8 rounded-2xl"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
          >
            <h2 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Cómo funciona
            </h2>
            <ol className="flex flex-col gap-4">
              {STEPS.map((step, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-sm leading-relaxed pt-0.5" style={{ color: 'var(--text-primary)' }}>
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* CTA block */}
          <div
            className="flex flex-col items-center gap-5 text-center p-10 rounded-2xl"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <CheckCircle2 size={36} style={{ color: 'var(--accent)' }} />
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              ¿Listo para empezar?
            </h2>
            <p className="max-w-md text-base" style={{ color: 'var(--text-secondary)' }}>
              Envíanos tu información y en menos de 48 horas te contactamos para darte acceso
              al programa y comenzar a generar comisiones.
            </p>
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-colors duration-150"
              style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
            >
              Postularme como distribuidor
              <ArrowRight size={16} />
            </Link>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Sin costo de afiliación · Comisiones mensuales · Soporte dedicado
            </p>
          </div>

        </div>
      </main>

      <footer className="py-6 px-4 text-center text-xs" style={{ color: '#9CA3AF', borderTop: '1px solid var(--border)' }}>
        © {new Date().getFullYear()} Welko — El recepcionista IA líder para Clínicas de Salud y Estética.
      </footer>
    </>
  )
}
