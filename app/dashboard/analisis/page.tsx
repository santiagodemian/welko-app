import { TrendingUp, ArrowRight } from 'lucide-react'

const FUNNEL = [
  { stage: 'Mensajes recibidos',   value: 324, rate: null,   color: '#3B82F6',  description: 'Contactos totales por WhatsApp este mes' },
  { stage: 'Consultas respondidas', value: 298, rate: '92%',  color: '#8B5CF6',  description: 'Respondidos en menos de 3 minutos' },
  { stage: 'Citas agendadas',       value: 201, rate: '67%',  color: '#22C55E',  description: 'De consulta a cita confirmada por Welko' },
  { stage: 'Citas confirmadas',     value: 179, rate: '89%',  color: '#14B8A6',  description: 'Tasa de confirmación con recordatorios' },
  { stage: 'Pacientes activos',     value: 234, rate: '116%', color: '#F59E0B',  description: 'Incluye retención de meses anteriores' },
]

const CHANNELS = [
  { label: 'WhatsApp',  pct: 78, color: '#22C55E' },
  { label: 'Llamada',   pct: 15, color: '#3B82F6'  },
  { label: 'Otro',      pct: 7,  color: '#D1D5DB'  },
]

export default function AnalisisPage() {
  return (
    <div className="p-6 lg:p-8 flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Análisis de Conversión
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
          Embudo de conversión · Marzo 2026
        </p>
      </div>

      {/* Funnel */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: '1px solid var(--border)' }}
      >
        <div
          className="px-6 py-4"
          style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}
        >
          <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
            Embudo de conversión de pacientes
          </h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            De primer contacto a paciente activo
          </p>
        </div>
        <div className="p-6 flex flex-col gap-4" style={{ background: 'var(--surface)' }}>
          {FUNNEL.map((step, i) => (
            <div key={step.stage} className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold"
                    style={{ background: `${step.color}1A`, color: step.color }}
                  >
                    {i + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {step.stage}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {step.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {step.rate && (
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: `${step.color}1A`, color: step.color }}
                    >
                      {step.rate}
                    </span>
                  )}
                  <span className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>
                    {step.value.toLocaleString('es-MX')}
                  </span>
                </div>
              </div>
              {/* Progress bar */}
              <div
                className="h-1.5 rounded-full overflow-hidden"
                style={{ background: 'var(--border)' }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    background: step.color,
                    width: `${Math.min((step.value / FUNNEL[0].value) * 100, 100)}%`,
                  }}
                />
              </div>
              {i < FUNNEL.length - 1 && (
                <div className="flex justify-start pl-3.5">
                  <ArrowRight size={14} color="var(--text-muted)" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Channel breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          className="p-6 rounded-2xl flex flex-col gap-4"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <div className="flex items-center gap-2">
            <TrendingUp size={16} color="var(--accent)" />
            <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
              Canal de origen
            </h3>
          </div>
          <div className="flex flex-col gap-3">
            {CHANNELS.map((ch) => (
              <div key={ch.label} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {ch.label}
                  </span>
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {ch.pct}%
                  </span>
                </div>
                <div
                  className="h-2 rounded-full overflow-hidden"
                  style={{ background: 'var(--border)' }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{ background: ch.color, width: `${ch.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className="p-6 rounded-2xl flex flex-col gap-4"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
            Indicadores clave
          </h3>
          <div className="flex flex-col gap-3">
            {[
              { label: 'Costo por paciente adquirido', value: '$0 MXN', note: 'Welko no cobra por cita' },
              { label: 'Ingresos estimados generados',  value: '$94,700 MXN', note: 'Basado en ticket promedio' },
              { label: 'ROI del plan Welko',             value: '31x',         note: 'vs costo mensual del plan' },
            ].map((ind) => (
              <div
                key={ind.label}
                className="p-3 rounded-lg"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
              >
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{ind.label}</p>
                <p className="text-lg font-black mt-0.5" style={{ color: 'var(--text-primary)' }}>
                  {ind.value}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{ind.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
