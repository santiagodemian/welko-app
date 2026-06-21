'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, User, Shield, Handshake, Mail } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { C } from '@/lib/ds'

const N = C.dark
const G = C.blue

const CONTACT_TYPES = [
  { icon: User,      label: 'Players',           desc: 'Start your journey with us.' },
  { icon: Shield,    label: 'Clubs',              desc: 'Build winning partnerships.' },
  { icon: Handshake, label: 'Partnerships',       desc: 'Create opportunities together.' },
  { icon: Mail,      label: 'General Inquiries',  desc: "We're here to help." },
]

interface FormData { name: string; email: string; type: string; message: string }

export default function ContactPage() {
  const [form, setForm] = useState<FormData>({ name: '', email: '', type: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  function set(k: keyof FormData) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(prev => ({ ...prev, [k]: e.target.value }))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 700))
    setSubmitted(true)
    setLoading(false)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px', border: '1.5px solid #E5E7EB',
    borderRadius: 8, fontSize: 13, color: N, background: '#fff',
    fontFamily: 'var(--font-montserrat), sans-serif', boxSizing: 'border-box',
    outline: 'none', transition: 'border-color 0.15s',
  }

  return (
    <div style={{ fontFamily: 'var(--font-montserrat), sans-serif', background: '#fff', minHeight: '100vh' }}>
      <style>{`
        .contact-split { display: grid; grid-template-columns: 58fr 42fr; min-height: 88vh; }
        @media (max-width: 900px) {
          .contact-split { display: flex !important; flex-direction: column-reverse !important; }
          .contact-photo { min-height: 380px !important; }
          .contact-form-panel { padding: 56px 28px !important; }
        }
        @media (max-width: 600px) {
          .contact-photo { min-height: 260px !important; }
          .contact-form-panel { padding: 48px 20px !important; }
        }
        .type-card { border: 1.5px solid #E5E7EB; border-radius: 8px; padding: 12px 14px; cursor: pointer; transition: border-color 0.15s, background 0.15s; display: flex; align-items: center; gap: 10; }
        .type-card:hover { border-color: ${G}; background: ${G}06; }
        .type-card.selected { border-color: ${G}; background: ${G}08; }
        input:focus, select:focus, textarea:focus { border-color: ${G} !important; }
      `}</style>

      <Navbar />

      <section className="contact-split">
        {/* Left — form + content */}
        <div className="contact-form-panel" style={{ padding: 'clamp(56px,7vw,96px) clamp(32px,5vw,80px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
            <div style={{ width: 24, height: 1.5, background: G }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: G, letterSpacing: '0.16em', textTransform: 'uppercase' }}>Get in Touch</span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 700, color: N, margin: '0 0 12px', letterSpacing: '-0.025em', textTransform: 'uppercase', lineHeight: 1.04 }}>
            {"Let's Build"}<br /><span style={{ color: G }}>Your Future.</span><br />Together.
          </h1>

          <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.75, margin: '0 0 32px', maxWidth: 400 }}>
            Whether you are a player, club or partner, we are here to connect and create extraordinary opportunities.
          </p>

          {/* Contact type cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 32 }}>
            {CONTACT_TYPES.map(t => (
              <button
                key={t.label}
                type="button"
                onClick={() => setForm(f => ({ ...f, type: t.label }))}
                className={`type-card${form.type === t.label ? ' selected' : ''}`}
                style={{}}
              >
                <t.icon size={14} color={form.type === t.label ? G : '#9CA3AF'} />
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: form.type === t.label ? G : N, margin: 0, letterSpacing: '0.03em' }}>
                    {t.label}
                  </p>
                  <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0, lineHeight: 1.3 }}>
                    {t.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {submitted ? (
            <div style={{ border: '1.5px solid #E5E7EB', borderRadius: 12, padding: '40px 32px', textAlign: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: `${G}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <ArrowRight size={20} color={G} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: 20, fontWeight: 700, color: N, margin: '0 0 10px' }}>Message Sent</h3>
              <p style={{ fontSize: 14, color: '#6B7280', margin: '0 0 24px', lineHeight: 1.7 }}>
                {"Thank you for reaching out. We'll be in touch within 24 hours."}
              </p>
              <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: G, textDecoration: 'none', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Back to Home <ArrowRight size={12} />
              </Link>
            </div>
          ) : (
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: N, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>Name</label>
                  <input required value={form.name} onChange={set('name')} placeholder="Your full name" style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: N, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>Email</label>
                  <input required type="email" value={form.email} onChange={set('email')} placeholder="you@email.com" style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: N, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>Message</label>
                <textarea required value={form.message} onChange={set('message')} placeholder="How can we help you?" rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  background: G, color: '#fff', padding: '13px 28px',
                  borderRadius: 8, fontWeight: 600, fontSize: 12, border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                  opacity: loading ? 0.7 : 1, fontFamily: 'var(--font-montserrat), sans-serif',
                  transition: 'background 0.15s',
                }}
              >
                {loading ? 'Sending…' : <><span>Send Message</span> <ArrowRight size={13} /></>}
              </button>
            </form>
          )}
        </div>

        {/* Right — photo placeholder */}
        <div className="contact-photo" style={{ position: 'relative', overflow: 'hidden', background: '#0A0A0A', minHeight: 520 }} />
      </section>

      <Footer />
    </div>
  )
}
