import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { MapPin, Phone, Star } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Nuestras Clínicas | Welko',
  description: 'Clínicas de salud y estética que ya confían en Welko para automatizar su recepción.',
}

const CLINICS = [
  {
    name: 'Vident',
    city: 'Monterrey, N.L.',
    address: 'Av. Vasconcelos 123, San Pedro Garza García',
    phone: '81 1234 5678',
    specialty: 'Clínica Dental',
    rating: 5,
    quote: 'Desde que instalamos Welko, no perdemos ni una llamada fuera de horario. Nuestras citas aumentaron un 35% en el primer mes.',
    author: 'Dr. Alejandro Garza, Director Médico',
    badge: 'Cliente Beta',
  },
]

export default function ClinicasPage() {
  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20 px-4">
        <div className="max-w-5xl mx-auto flex flex-col gap-12">

          {/* Header */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="text-sm font-medium w-fit" style={{ color: '#1A2A56' }}>
              ← Volver al inicio
            </Link>
            <span className="text-xs font-semibold uppercase tracking-widest mt-2" style={{ color: '#1A2A56' }}>
              Casos de Éxito
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Clínicas que ya confían en Welko
            </h1>
            <p className="max-w-xl text-base" style={{ color: 'var(--text-secondary)' }}>
              Descubre cómo clínicas de salud y estética en México están transformando
              su recepción con inteligencia artificial.
            </p>
          </div>

          {/* Clinic cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CLINICS.map((c) => (
              <div
                key={c.name}
                className="flex flex-col gap-5 p-7 rounded-2xl"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-black" style={{ color: '#1A2A56' }}>
                        {c.name}
                      </span>
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: '#E5E9F4', color: '#1A2A56' }}
                      >
                        {c.badge}
                      </span>
                    </div>
                    <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                      {c.specialty}
                    </span>
                  </div>
                  {/* Stars */}
                  <div className="flex gap-0.5">
                    {Array.from({ length: c.rating }).map((_, i) => (
                      <Star key={i} size={14} fill="#1A2A56" color="#1A2A56" />
                    ))}
                  </div>
                </div>

                {/* Contact info */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-start gap-2">
                    <MapPin size={14} color="#9CA3AF" className="mt-0.5 flex-shrink-0" />
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {c.address} · {c.city}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={14} color="#9CA3AF" className="flex-shrink-0" />
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {c.phone}
                    </span>
                  </div>
                </div>

                {/* Quote */}
                <blockquote
                  className="border-l-2 pl-4 text-sm leading-relaxed italic"
                  style={{ borderColor: '#1A2A56', color: 'var(--text-secondary)' }}
                >
                  "{c.quote}"
                  <footer className="mt-2 not-italic text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                    — {c.author}
                  </footer>
                </blockquote>
              </div>
            ))}

            {/* Coming soon card */}
            <div
              className="flex flex-col items-center justify-center gap-3 p-7 rounded-2xl text-center"
              style={{
                background: 'var(--bg-secondary)',
                border: '1.5px dashed var(--border)',
              }}
            >
              <span className="text-2xl">🏥</span>
              <p className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                Tu clínica aquí
              </p>
              <p className="text-sm max-w-xs" style={{ color: 'var(--text-secondary)' }}>
                Únete a las clínicas que ya están automatizando su recepción con Welko.
              </p>
              <Link
                href="/contacto"
                className="mt-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: '#1A2A56', color: '#FFFFFF' }}
              >
                Agendar demo
              </Link>
            </div>
          </div>

        </div>
      </main>

      <footer className="py-6 px-4 text-center text-xs" style={{ color: '#9CA3AF', borderTop: '1px solid #E5E7EB' }}>
        © {new Date().getFullYear()} Welko — El recepcionista IA lider.
      </footer>
    </>
  )
}
