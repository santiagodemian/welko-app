import { BarChart2, MessageCircle, Clock, Star, TrendingUp, RefreshCw } from 'lucide-react'
import { AppointmentsChart } from '@/components/dashboard/AppointmentsChart'

const BG = '#0D1117'
const S  = '#161B27'
const B  = 'rgba(255,255,255,0.07)'

const MONTHLY = [
  { month: 'Oct 2025', citas: 31, asistidas: 27, conversion: '61%' },
  { month: 'Nov 2025', citas: 35, asistidas: 31, conversion: '63%' },
  { month: 'Dic 2025', citas: 28, asistidas: 25, conversion: '58%' },
  { month: 'Ene 2026', citas: 40, asistidas: 36, conversion: '68%' },
  { month: 'Feb 2026', citas: 43, asistidas: 38, conversion: '70%' },
  { month: 'Mar 2026', citas: 47, asistidas: 42, conversion: '67%' },
]

export default function ReportesPage() {
  return (
    <div className="p-6 lg:p-8 flex flex-col gap-8" style={{ background: BG, minHeight: '100%' }}>
      <div>
        <h1 className="text-2xl font-bold" style={{ color: '#F9FAFB' }}>
          Reportes de Rendimiento
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
          Métricas de tu recepcionista IA · Últimos 6 meses
        </p>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: 'Mensajes contestados', value: '100%',    sub: 'Sin intervención humana',     Icon: MessageCircle, color: '#1A2A56' },
          { label: 'Tiempo de respuesta',  value: '2.3 min', sub: 'Promedio mensual',            Icon: Clock,         color: '#3B82F6' },
          { label: 'Conversión a cita',    value: '67%',     sub: 'De consulta a cita agendada', Icon: TrendingUp,    color: '#8B5CF6' },
          { label: 'Tasa de retención',    value: '94%',     sub: 'Pacientes que regresan',      Icon: RefreshCw,     color: '#F59E0B' },
          { label: 'NPS promedio',         value: '4.8 / 5', sub: 'Satisfacción del paciente',   Icon: Star,          color: '#EC4899' },
          { label: 'Citas este mes',       value: '47',      sub: '+9% vs mes anterior',         Icon: BarChart2,     color: '#14B8A6' },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="p-5 rounded-2xl flex flex-col gap-3"
            style={{ background: S, border: `1px solid ${B}` }}
          >
            <div className="flex items-start justify-between">
              <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.3)' }}>
                {kpi.label}
              </p>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${kpi.color}1A` }}
              >
                <kpi.Icon size={16} color={kpi.color} />
              </div>
            </div>
            <div>
              <p className="text-2xl font-black tracking-tight" style={{ color: '#F9FAFB' }}>
                {kpi.value}
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                {kpi.sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div
        className="rounded-2xl p-6 flex flex-col gap-4"
        style={{ background: S, border: `1px solid ${B}` }}
      >
        <div>
          <h2 className="text-base font-semibold" style={{ color: '#F9FAFB' }}>
            Citas agendadas vs asistidas
          </h2>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Evolución mensual · Oct 2025 – Mar 2026
          </p>
        </div>
        <AppointmentsChart />
      </div>

      {/* Monthly table */}
      <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${B}` }}>
        <div
          className="px-6 py-4"
          style={{ background: S, borderBottom: `1px solid ${B}` }}
        >
          <h2 className="text-base font-semibold" style={{ color: '#F9FAFB' }}>
            Detalle mensual
          </h2>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Agendadas, asistidas y tasa de asistencia
          </p>
        </div>
        <div className="overflow-x-auto" style={{ background: S }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 400 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${B}` }}>
                {['Mes', 'Agendadas', 'Asistidas', 'Asistencia', 'Conversión'].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: '12px 24px',
                      textAlign: 'left',
                      fontSize: 11,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: 'rgba(255,255,255,0.3)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MONTHLY.map((row, i) => {
                const rate = Math.round((row.asistidas / row.citas) * 100)
                const isLast = i === MONTHLY.length - 1
                return (
                  <tr
                    key={row.month}
                    style={{
                      borderBottom: !isLast ? `1px solid ${B}` : 'none',
                      background: isLast ? 'rgba(26,42,86,0.04)' : 'transparent',
                    }}
                  >
                    <td style={{ padding: '14px 24px', fontSize: 14, fontWeight: 500, color: '#F9FAFB', whiteSpace: 'nowrap' }}>
                      {row.month}
                      {isLast && (
                        <span
                          style={{
                            marginLeft: 8,
                            fontSize: 10,
                            padding: '2px 6px',
                            borderRadius: 4,
                            fontWeight: 700,
                            background: 'rgba(26,42,86,0.15)',
                            color: '#1A2A56',
                          }}
                        >
                          Actual
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '14px 24px', fontSize: 14, fontWeight: 600, color: '#3B82F6' }}>
                      {row.citas}
                    </td>
                    <td style={{ padding: '14px 24px', fontSize: 14, fontWeight: 600, color: '#1A2A56' }}>
                      {row.asistidas}
                    </td>
                    <td style={{ padding: '14px 24px', fontSize: 14, color: '#F9FAFB' }}>
                      {rate}%
                    </td>
                    <td style={{ padding: '14px 24px', fontSize: 14, color: 'rgba(255,255,255,0.55)' }}>
                      {row.conversion}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
