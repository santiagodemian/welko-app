import { Users, UserPlus, Heart } from 'lucide-react'

const PATIENTS = [
  { id: 1,  name: 'María González',   phone: '+52 81 1234 5678', email: 'maria.g@gmail.com',    lastVisit: '26/03/2026', visits: 12, treatment: 'Ortodoncia',      status: 'active'   },
  { id: 2,  name: 'Carlos Ramírez',   phone: '+52 81 2345 6789', email: 'cramirez@hotmail.com',  lastVisit: '20/03/2026', visits: 5,  treatment: 'Blanqueamiento',  status: 'active'   },
  { id: 3,  name: 'Ana Martínez',     phone: '+52 81 3456 7890', email: 'ana.mtz@gmail.com',     lastVisit: '15/03/2026', visits: 8,  treatment: 'Mantenimiento',   status: 'active'   },
  { id: 4,  name: 'Jorge Hernández',  phone: '+52 81 4567 8901', email: 'jhernandez@gmail.com',  lastVisit: '10/03/2026', visits: 20, treatment: 'Ortodoncia',      status: 'active'   },
  { id: 5,  name: 'Sofía López',      phone: '+52 81 5678 9012', email: 'sofia.l@icloud.com',    lastVisit: '26/03/2026', visits: 3,  treatment: 'Post-extracción', status: 'active'   },
  { id: 6,  name: 'Roberto Vega',     phone: '+52 81 6789 0123', email: 'rvega@gmail.com',       lastVisit: '01/03/2026', visits: 7,  treatment: 'Carillas',        status: 'active'   },
  { id: 7,  name: 'Elena Morales',    phone: '+52 81 7890 1234', email: 'emorales@yahoo.com',    lastVisit: '10/02/2026', visits: 2,  treatment: 'Consulta',        status: 'new'      },
  { id: 8,  name: 'Luis García',      phone: '+52 81 8901 2345', email: 'lgarcia@outlook.com',   lastVisit: '05/02/2026', visits: 15, treatment: 'Mantenimiento',   status: 'inactive' },
  { id: 9,  name: 'Patricia Ruiz',    phone: '+52 81 9012 3456', email: 'pruiz@gmail.com',       lastVisit: '28/01/2026', visits: 6,  treatment: 'Blanqueamiento',  status: 'active'   },
  { id: 10, name: 'Miguel Torres',    phone: '+52 81 0123 4567', email: 'mtorres@gmail.com',     lastVisit: '15/01/2026', visits: 9,  treatment: 'Ortodoncia',      status: 'active'   },
]

const STATUS_STYLE: Record<string, React.CSSProperties> = {
  active:   { background: '#DCFCE7', color: '#15803D' },
  new:      { background: '#EDE9FE', color: '#7C3AED' },
  inactive: { background: '#F3F4F6', color: '#6B7280' },
}
const STATUS_LABEL: Record<string, string> = {
  active: 'Activo', new: 'Nuevo', inactive: 'Inactivo',
}

export default function ClientesPage() {
  const active   = PATIENTS.filter((p) => p.status === 'active').length
  const newCount = PATIENTS.filter((p) => p.status === 'new').length

  return (
    <div className="p-6 lg:p-8 flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Datos de Clientes
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
          Base de pacientes registrados por Welko
        </p>
      </div>

      {/* Mini KPIs */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total pacientes', value: PATIENTS.length, Icon: Users,     color: '#3B82F6' },
          { label: 'Activos',         value: active,           Icon: Heart,     color: '#1A2A56' },
          { label: 'Nuevos este mes', value: newCount,         Icon: UserPlus,  color: '#8B5CF6' },
        ].map((k) => (
          <div
            key={k.label}
            className="p-4 rounded-xl flex items-center gap-3"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: `${k.color}1A` }}
            >
              <k.Icon size={16} color={k.color} />
            </div>
            <div>
              <p className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>
                {k.value}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{k.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        <div
          className="px-6 py-4"
          style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}
        >
          <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
            Directorio de Pacientes
          </h2>
        </div>
        <div className="overflow-x-auto" style={{ background: 'var(--surface)' }}>
          <table className="w-full min-w-[700px]">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Nombre', 'Teléfono', 'Email', 'Última visita', 'Visitas', 'Tratamiento', 'Estado'].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PATIENTS.map((p, i) => (
                <tr
                  key={p.id}
                  style={{
                    borderBottom: i < PATIENTS.length - 1 ? '1px solid var(--border)' : 'none',
                  }}
                >
                  <td className="px-5 py-3.5 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {p.name}
                  </td>
                  <td className="px-5 py-3.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {p.phone}
                  </td>
                  <td className="px-5 py-3.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {p.email}
                  </td>
                  <td className="px-5 py-3.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {p.lastVisit}
                  </td>
                  <td className="px-5 py-3.5 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {p.visits}
                  </td>
                  <td className="px-5 py-3.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {p.treatment}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
                      style={STATUS_STYLE[p.status]}
                    >
                      {STATUS_LABEL[p.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
