import { CalendarCheck, Clock, XCircle } from 'lucide-react'
import { CitasTable } from '@/components/dashboard/CitasTable'

export default function CitasPage() {
  return (
    <div className="p-6 lg:p-8 flex flex-col gap-8" style={{ background: 'var(--bg)', minHeight: '100%' }}>
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Citas Agendadas
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
          Agendadas automáticamente por Welko
        </p>
      </div>

      {/* Mini KPIs */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total hoy',   value: 5, color: '#3B82F6', Icon: CalendarCheck },
          { label: 'Confirmadas', value: 3, color: '#22C55E', Icon: Clock },
          { label: 'Canceladas',  value: 1, color: '#EF4444', Icon: XCircle },
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

      {/* Table wrapper */}
      <div
        className="rounded-2xl p-5 flex flex-col gap-4"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <div>
          <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
            Todas las citas
          </h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Usa los filtros para navegar por período
          </p>
        </div>
        <CitasTable />
      </div>
    </div>
  )
}
