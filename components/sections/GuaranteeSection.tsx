import { ShieldCheck } from 'lucide-react'
import Link from 'next/link'

export function GuaranteeSection() {
  return (
    <section className="px-4 pb-16">
      <div className="max-w-3xl mx-auto">
        <div
          className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-6 sm:p-8 rounded-2xl"
          style={{
            background: '#E5E9F4',
            border: '1.5px solid #C5CEEA',
          }}
        >
          {/* Icon */}
          <div
            className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: '#1A2A56' }}
          >
            <ShieldCheck size={24} color="#FFFFFF" />
          </div>

          {/* Text */}
          <div className="flex flex-col gap-1.5 text-center sm:text-left">
            <p className="text-base font-semibold" style={{ color: '#1A2A56' }}>
              Garantía de Satisfacción Welko
            </p>
            <p className="text-sm leading-relaxed" style={{ color: '#374151' }}>
              Prueba el servicio por{' '}
              <strong style={{ color: '#111827' }}>7 días</strong>. Si no estás
              convencido, te devolvemos tu dinero sin preguntas.
            </p>
            <Link
              href="/reembolsos"
              className="text-xs font-medium mt-1 w-fit mx-auto sm:mx-0"
              style={{ color: '#1A2A56', textDecoration: 'underline', textUnderlineOffset: '3px' }}
            >
              Ver política de reembolsos →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
