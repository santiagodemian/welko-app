'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Pencil, Trash2, MessageCircle, Mail, Phone, X, BookUser } from 'lucide-react'

const N = '#0A1628'
const G = '#1E6FEB'

interface Contact {
  id: string
  clubName: string
  country: string | null
  fullName: string
  role: string | null
  email: string | null
  phone: string | null
  whatsapp: string | null
  notes: string | null
  createdAt: string
}

const EMPTY_FORM = {
  clubName: '', country: '', fullName: '', role: '',
  email: '', phone: '', whatsapp: '', notes: '',
}

const ROLES = ['Sporting Director', 'Head Scout', 'Technical Director', 'CEO', 'President', 'Scout', 'Coach', 'Other']

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [form, setForm]         = useState(EMPTY_FORM)
  const [editId, setEditId]     = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving]     = useState(false)

  function fetchContacts() {
    setLoading(true)
    fetch('/api/dashboard/contacts')
      .then(r => r.json())
      .then(d => setContacts(d.contacts ?? []))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchContacts() }, [])

  function openAdd() {
    setForm(EMPTY_FORM)
    setEditId(null)
    setShowForm(true)
  }

  function openEdit(c: Contact) {
    setForm({
      clubName: c.clubName, country: c.country ?? '', fullName: c.fullName, role: c.role ?? '',
      email: c.email ?? '', phone: c.phone ?? '', whatsapp: c.whatsapp ?? '', notes: c.notes ?? '',
    })
    setEditId(c.id)
    setShowForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      if (editId) {
        await fetch(`/api/dashboard/contacts/${editId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
      } else {
        await fetch('/api/dashboard/contacts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
      }
      setShowForm(false)
      setEditId(null)
      fetchContacts()
    } finally {
      setSaving(false)
    }
  }

  async function deleteContact(id: string) {
    if (!confirm('Delete this contact?')) return
    await fetch(`/api/dashboard/contacts/${id}`, { method: 'DELETE' })
    fetchContacts()
  }

  const filtered = contacts.filter(c =>
    !search ||
    c.fullName.toLowerCase().includes(search.toLowerCase()) ||
    c.clubName.toLowerCase().includes(search.toLowerCase()) ||
    (c.role ?? '').toLowerCase().includes(search.toLowerCase())
  )

  // Group by club name
  const grouped = filtered.reduce<Record<string, Contact[]>>((acc, c) => {
    if (!acc[c.clubName]) acc[c.clubName] = []
    acc[c.clubName].push(c)
    return acc
  }, {})

  const f = (key: keyof typeof EMPTY_FORM) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(v => ({ ...v, [key]: e.target.value }))

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #E5E7EB',
    fontSize: 13, boxSizing: 'border-box', fontFamily: 'inherit', outline: 'none',
  }
  const labelStyle: React.CSSProperties = {
    fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase',
    letterSpacing: '0.06em', display: 'block', marginBottom: 4,
  }

  return (
    <div style={{ padding: 'clamp(20px,4vw,40px) clamp(16px,4vw,40px) 80px', fontFamily: 'var(--font-montserrat), sans-serif', maxWidth: 1000 }}>
      <style>{`
        @media (max-width: 640px) {
          .ct-form4 { grid-template-columns: 1fr 1fr !important; }
          .ct-form3 { grid-template-columns: 1fr 1fr !important; }
          .ct-row    { flex-wrap: wrap !important; }
          .ct-notes  { display: none !important; }
        }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: N, margin: '0 0 4px', letterSpacing: '-0.03em' }}>Club Contact Book</h1>
          <p style={{ color: '#9CA3AF', margin: 0, fontSize: 14 }}>Sporting directors, scouts, and club decision-makers.</p>
        </div>
        <button onClick={openAdd}
          style={{ display: 'flex', alignItems: 'center', gap: 7, background: N, color: 'white', padding: '10px 18px', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13, fontFamily: 'inherit' }}
        >
          <Plus size={15} /> Add Contact
        </button>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 20 }}>
        <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, club, or role…"
          style={{ ...inputStyle, paddingLeft: 38 }} />
      </div>

      {/* Form */}
      {showForm && (
        <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 14, padding: 24, marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: N, margin: 0 }}>
              {editId ? 'Edit Contact' : 'New Contact'}
            </h3>
            <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
              <X size={16} color="#9CA3AF" />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="ct-form4" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label style={labelStyle}>Club Name *</label>
                <input value={form.clubName} onChange={f('clubName')} required placeholder="e.g. Real Madrid" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Country</label>
                <input value={form.country} onChange={f('country')} placeholder="e.g. Spain" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Contact Name *</label>
                <input value={form.fullName} onChange={f('fullName')} required placeholder="e.g. Carlos García" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Role</label>
                <select value={form.role} onChange={f('role')} style={{ ...inputStyle, cursor: 'pointer', color: form.role ? N : '#9CA3AF' }}>
                  <option value="">Any role</option>
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div className="ct-form3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label style={labelStyle}>Email</label>
                <input type="email" value={form.email} onChange={f('email')} placeholder="director@club.com" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Phone</label>
                <input value={form.phone} onChange={f('phone')} placeholder="+34 600 000 000" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>WhatsApp</label>
                <input value={form.whatsapp} onChange={f('whatsapp')} placeholder="+34 600 000 000" style={inputStyle} />
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Notes</label>
              <textarea value={form.notes} onChange={f('notes')} placeholder="Any relevant notes about this contact…"
                rows={2}
                style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button type="button" onClick={() => setShowForm(false)}
                style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #E5E7EB', background: 'white', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', fontWeight: 600, color: '#6B7280' }}>
                Cancel
              </button>
              <button type="submit" disabled={saving}
                style={{ padding: '8px 20px', borderRadius: 8, background: G, color: 'white', border: 'none', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', fontWeight: 700 }}>
                {saving ? 'Saving…' : editId ? 'Save Changes' : 'Add Contact'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Contact list */}
      {loading ? (
        <div style={{ padding: 48, textAlign: 'center', color: '#9CA3AF', fontSize: 14 }}>Loading contacts…</div>
      ) : Object.keys(grouped).length === 0 ? (
        <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 14, padding: 64, textAlign: 'center' }}>
          <BookUser size={40} color="#E5E7EB" style={{ margin: '0 auto 12px', display: 'block' }} />
          <p style={{ fontSize: 15, fontWeight: 700, color: N, margin: '0 0 6px' }}>No contacts yet</p>
          <p style={{ fontSize: 13, color: '#9CA3AF', margin: 0 }}>Add your first sporting director or scout above.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {Object.entries(grouped).map(([clubName, clubContacts]) => (
            <div key={clubName} style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <div style={{ padding: '12px 20px', background: '#F9FAFB', borderBottom: '1px solid #F3F4F6' }}>
                <p style={{ fontSize: 13, fontWeight: 800, color: N, margin: 0 }}>
                  {clubName}
                  {clubContacts[0].country && <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 500, marginLeft: 6 }}>· {clubContacts[0].country}</span>}
                  <span style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 500, marginLeft: 8 }}>{clubContacts.length} contact{clubContacts.length !== 1 ? 's' : ''}</span>
                </p>
              </div>
              {clubContacts.map(c => (
                <div key={c.id} className="ct-row" style={{ padding: '14px 20px', borderBottom: '1px solid #F9FAFB', display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${G}12`, color: G, fontWeight: 800, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {c.fullName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: N, margin: '0 0 2px' }}>{c.fullName}</p>
                    {c.role && <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0 }}>{c.role}</p>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {c.email && (
                      <a href={`mailto:${c.email}`} title={c.email}
                        style={{ width: 30, height: 30, borderRadius: 7, background: 'rgba(30,111,235,0.08)', border: '1px solid rgba(30,111,235,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Mail size={13} color={G} />
                      </a>
                    )}
                    {c.phone && (
                      <a href={`tel:${c.phone}`} title={c.phone}
                        style={{ width: 30, height: 30, borderRadius: 7, background: '#F3F4F6', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Phone size={13} color="#6B7280" />
                      </a>
                    )}
                    {c.whatsapp && (
                      <a href={`https://wa.me/${c.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" title={`WhatsApp ${c.whatsapp}`}
                        style={{ width: 30, height: 30, borderRadius: 7, background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <MessageCircle size={13} color="#25D366" />
                      </a>
                    )}
                    <button onClick={() => openEdit(c)}
                      style={{ width: 30, height: 30, borderRadius: 7, background: '#F9FAFB', border: '1px solid #E5E7EB', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Pencil size={12} color="#6B7280" />
                    </button>
                    <button onClick={() => deleteContact(c.id)}
                      style={{ width: 30, height: 30, borderRadius: 7, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Trash2 size={12} color="#EF4444" />
                    </button>
                  </div>
                  {c.notes && (
                    <p className="ct-notes" style={{ fontSize: 11, color: '#9CA3AF', margin: 0, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={c.notes}>
                      {c.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
