'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Send } from 'lucide-react'

const WA_NUMBER = '525628443738'

interface FormData {
  nombre: string
  email: string
  clinica: string
  mensaje: string
}

export default function ContactoPage() {
  const [form, setForm] = useState<FormData>({
    nombre: '',
    email: '',
    clinica: '',
    mensaje: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const text = `Hola, me interesa agendar una demo de Welko.\n\n*Nombre:* ${form.nombre}\n*Email:* ${form.email}\n*Clínica:* ${form.clinica}\n\n*Mensaje:* ${form.mensaje}`
    window.open(
      `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener,noreferrer'
    )
  }

  const isValid = form.nombre && form.email && form.clinica && form.mensaje

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20 px-4">
        <div className="max-w-xl mx-auto flex flex-col gap-8">

          {/* Back */}
          <Link href="/" className="text-sm font-medium w-fit" style={{ color: '#1A2A56' }}>
            ← Volver al inicio
          </Link>

          {/* Header */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#1A2A56' }}>
              Contacto
            </span>
            <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Agenda tu demo gratuita
            </h1>
            <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
              Cuéntanos sobre tu clínica y te mostramos cómo Welko puede transformar
              tu recepción en menos de 24 horas.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <Field label="Nombre completo" required>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Dr. Juan García"
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors duration-150"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#1A2A56')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
              />
            </Field>

            <Field label="Correo electrónico" required>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="doctor@miclinica.com"
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors duration-150"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#1A2A56')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
              />
            </Field>

            <Field label="Nombre de tu clínica" required>
              <input
                type="text"
                name="clinica"
                value={form.clinica}
                onChange={handleChange}
                placeholder="Clínica Dental Vident"
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors duration-150"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#1A2A56')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
              />
            </Field>

            <Field label="Mensaje">
              <textarea
                name="mensaje"
                value={form.mensaje}
                onChange={handleChange}
                placeholder="Tengo una clínica dental con 3 consultorios. Me gustaría automatizar la recepción de WhatsApp..."
                rows={4}
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none transition-colors duration-150"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#1A2A56')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
              />
            </Field>

            <button
              type="submit"
              disabled={!isValid}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-semibold transition-all duration-150 mt-2"
              style={{
                background: isValid ? '#1A2A56' : 'var(--border)',
                color: isValid ? '#FFFFFF' : 'var(--text-muted)',
                cursor: isValid ? 'pointer' : 'not-allowed',
              }}
            >
              <Send size={16} />
              Enviar por WhatsApp
            </button>

            <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
              Al enviar, se abrirá WhatsApp con tu mensaje. Respondemos en menos de 2 horas.
            </p>
          </form>

          {/* Trust */}
          <div
            className="flex items-center justify-center gap-6 pt-2 flex-wrap"
          >
            {['Instalación en 24 h', 'Garantía 7 días', 'Soporte bilingüe'].map((t) => (
              <span key={t} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                <span className="w-1 h-1 rounded-full" style={{ background: '#1A2A56' }} />
                {t}
              </span>
            ))}
          </div>

        </div>
      </main>

      <footer className="py-6 px-4 text-center text-xs" style={{ color: '#9CA3AF', borderTop: '1px solid #E5E7EB' }}>
        © {new Date().getFullYear()} Welko — El recepcionista IA lider.
      </footer>
    </>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
        {label}
        {required && <span style={{ color: '#1A2A56' }}> *</span>}
      </label>
      {children}
    </div>
  )
}
