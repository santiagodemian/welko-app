'use client'

import { useState } from 'react'
import {
  CheckCircle2,
  XCircle,
  RefreshCw,
  Eye,
  EyeOff,
  Copy,
  Zap,
  Settings2,
  Plug,
  Unplug,
} from 'lucide-react'

/* ─── Theme constants (CSS vars — light + dark mode) ─── */
const S    = 'var(--surface)'
const S2   = 'var(--surface-hover)'
const B    = 'var(--border)'
const T    = 'var(--text-primary)'
const TM   = 'var(--text-secondary)'
const TMU  = 'var(--text-muted)'

/* ─── EHR Systems ─── */
const SYSTEMS = [
  { id: 'dentrix',    name: 'Dentrix',           vendor: 'Henry Schein One',     logo: 'DX', color: '#3B82F6', connected: true,  lastSync: 'Hace 5 min', records: 234  },
  { id: 'opendental', name: 'OpenDental',         vendor: 'Open Dental Software', logo: 'OD', color: '#8B5CF6', connected: false, lastSync: null,         records: null },
  { id: 'carestream', name: 'Carestream Dental',  vendor: 'Carestream Health',    logo: 'CS', color: '#0EA5E9', connected: true,  lastSync: 'Hace 2 h',   records: 189  },
  { id: 'cliniccloud', name: 'ClinicCloud',        vendor: 'Clinic Cloud S.L.',   logo: 'CC', color: '#F59E0B', connected: false, lastSync: null,         records: null },
  { id: 'medisoft',   name: 'Medisoft',            vendor: 'Netsmart Technologies',logo: 'MS', color: '#22C55E', connected: false, lastSync: null,         records: null },
  { id: 'easydent',   name: 'EasyDent',            vendor: 'Molar Software',      logo: 'ED', color: '#EC4899', connected: false, lastSync: null,         records: null },
]

const SYNC_OPTIONS = [
  { value: 'manual',  label: 'Manual' },
  { value: '15min',   label: 'Cada 15 minutos' },
  { value: '30min',   label: 'Cada 30 minutos' },
  { value: '1h',      label: 'Cada hora' },
  { value: 'daily',   label: 'Diario (00:00)' },
]

type TestState = 'idle' | 'testing' | 'success' | 'error'

export function EHRConfig() {
  const [selected, setSelected]     = useState<string | null>(null)
  const [showKey,  setShowKey]       = useState(false)
  const [copied,   setCopied]        = useState(false)
  const [testState, setTestState]    = useState<TestState>('idle')
  const [form, setForm]              = useState({
    apiUrl:       'https://api.dentrix.com/v2',
    apiKey:       'sk_live_••••••••••••••••••••••',
    syncFreq:     '30min',
    syncPatients: true,
    syncAppts:    true,
  })

  const connectedSystems = SYSTEMS.filter((s) => s.connected)
  const selectedSystem   = SYSTEMS.find((s) => s.id === selected)

  function handleCopy() {
    navigator.clipboard.writeText('https://api.welko.mx/webhooks/ehr/v1')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleTest() {
    setTestState('testing')
    setTimeout(() => setTestState('success'), 1800)
    setTimeout(() => setTestState('idle'), 5000)
  }

  return (
    <div className="flex flex-col gap-8">

      {/* ── Active connections ── */}
      {connectedSystems.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 style={{ color: TMU, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Sistemas Conectados
          </h2>
          <div className="flex flex-col gap-3">
            {connectedSystems.map((sys) => (
              <div
                key={sys.id}
                style={{ background: S, border: `1px solid ${B}`, borderRadius: 14, padding: '16px 20px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  {/* Logo */}
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, background: `${sys.color}1A`,
                    border: `1px solid ${sys.color}33`, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 12, fontWeight: 700, color: sys.color, flexShrink: 0,
                  }}>
                    {sys.logo}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: T, fontSize: 14, fontWeight: 600 }}>{sys.name}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E', display: 'inline-block' }} />
                        <span style={{ color: '#22C55E', fontSize: 11, fontWeight: 600 }}>Conectado</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 16, marginTop: 3 }}>
                      <span style={{ color: TMU, fontSize: 12 }}>Sync: {sys.lastSync}</span>
                      <span style={{ color: TMU, fontSize: 12 }}>{sys.records} registros</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <button
                      onClick={() => setSelected(sys.id === selected ? null : sys.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px',
                        background: S2, border: `1px solid ${B}`, borderRadius: 8,
                        color: TM, fontSize: 12, fontWeight: 500, cursor: 'pointer',
                      }}
                    >
                      <Settings2 size={13} />
                      Configurar
                    </button>
                    <button
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px',
                        background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                        borderRadius: 8, color: '#EF4444', fontSize: 12, fontWeight: 500, cursor: 'pointer',
                      }}
                    >
                      <Unplug size={13} />
                      Desconectar
                    </button>
                  </div>
                </div>

                {/* Inline config panel */}
                {selected === sys.id && (
                  <div
                    style={{
                      marginTop: 16, paddingTop: 16,
                      borderTop: `1px solid ${B}`,
                    }}
                  >
                    <ConfigForm
                      form={form}
                      setForm={setForm}
                      showKey={showKey}
                      setShowKey={setShowKey}
                      copied={copied}
                      handleCopy={handleCopy}
                      testState={testState}
                      handleTest={handleTest}
                      systemName={sys.name}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Available systems ── */}
      <section className="flex flex-col gap-3">
        <h2 style={{ color: TMU, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Agregar Integración
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
          {SYSTEMS.filter((s) => !s.connected).map((sys) => (
            <button
              key={sys.id}
              onClick={() => setSelected(sys.id === selected ? null : sys.id)}
              style={{
                background: selected === sys.id ? `${sys.color}0F` : S,
                border: selected === sys.id ? `1.5px solid ${sys.color}44` : `1px solid ${B}`,
                borderRadius: 12, padding: '14px 16px', textAlign: 'left', cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 10, background: `${sys.color}1A`,
                border: `1px solid ${sys.color}33`, display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 11, fontWeight: 700, color: sys.color, marginBottom: 10,
              }}>
                {sys.logo}
              </div>
              <p style={{ color: T, fontSize: 13, fontWeight: 600 }}>{sys.name}</p>
              <p style={{ color: TMU, fontSize: 11, marginTop: 2 }}>{sys.vendor}</p>
            </button>
          ))}
        </div>

        {/* Config form for new system */}
        {selected && !SYSTEMS.find((s) => s.id === selected)?.connected && selectedSystem && (
          <div style={{ background: S, border: `1px solid ${B}`, borderRadius: 14, padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <Plug size={16} color={selectedSystem.color} />
              <span style={{ color: T, fontSize: 14, fontWeight: 600 }}>
                Conectar {selectedSystem.name}
              </span>
            </div>
            <ConfigForm
              form={form}
              setForm={setForm}
              showKey={showKey}
              setShowKey={setShowKey}
              copied={copied}
              handleCopy={handleCopy}
              testState={testState}
              handleTest={handleTest}
              systemName={selectedSystem.name}
            />
          </div>
        )}
      </section>

    </div>
  )
}

/* ─── Shared config form ─── */
interface ConfigFormProps {
  form: { apiUrl: string; apiKey: string; syncFreq: string; syncPatients: boolean; syncAppts: boolean }
  setForm: React.Dispatch<React.SetStateAction<ConfigFormProps['form']>>
  showKey: boolean
  setShowKey: (v: boolean) => void
  copied: boolean
  handleCopy: () => void
  testState: TestState
  handleTest: () => void
  systemName: string
}

function ConfigForm({
  form, setForm, showKey, setShowKey, copied, handleCopy, testState, handleTest, systemName,
}: ConfigFormProps) {
  const WEBHOOK_URL = 'https://api.welko.mx/webhooks/ehr/v1'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {/* API URL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            URL base de API
          </label>
          <input
            type="text"
            value={form.apiUrl}
            onChange={(e) => setForm((p) => ({ ...p, apiUrl: e.target.value }))}
            style={{
              background: 'var(--bg)', border: '1px solid var(--border)',
              borderRadius: 8, padding: '9px 12px', color: 'var(--text-primary)', fontSize: 13, outline: 'none',
            }}
            placeholder="https://api.sistema.com/v2"
          />
        </div>

        {/* API Key */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Clave de API
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showKey ? 'text' : 'password'}
              value={form.apiKey}
              onChange={(e) => setForm((p) => ({ ...p, apiKey: e.target.value }))}
              style={{
                width: '100%', background: 'var(--bg)', border: '1px solid var(--border)',
                borderRadius: 8, padding: '9px 36px 9px 12px', color: 'var(--text-primary)', fontSize: 13,
                outline: 'none', boxSizing: 'border-box',
              }}
              placeholder="sk_live_••••••••••"
            />
            <button
              onClick={() => setShowKey(!showKey)}
              style={{
                position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              }}
            >
              {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>
      </div>

      {/* Sync frequency */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Frecuencia de sincronización
        </label>
        <select
          value={form.syncFreq}
          onChange={(e) => setForm((p) => ({ ...p, syncFreq: e.target.value }))}
          style={{
            background: 'var(--bg)', border: '1px solid var(--border)',
            borderRadius: 8, padding: '9px 12px', color: 'var(--text-primary)', fontSize: 13, outline: 'none',
          }}
        >
          {SYNC_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* Toggles */}
      <div style={{ display: 'flex', gap: 24 }}>
        {[
          { key: 'syncPatients', label: 'Sincronizar pacientes' },
          { key: 'syncAppts',    label: 'Sincronizar citas'     },
        ].map(({ key, label }) => {
          const val = form[key as keyof typeof form] as boolean
          return (
            <button
              key={key}
              onClick={() => setForm((p) => ({ ...p, [key]: !val }))}
              style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              <div style={{
                width: 36, height: 20, borderRadius: 10,
                background: val ? '#22C55E' : 'var(--border)',
                position: 'relative', transition: 'background 0.2s',
              }}>
                <div style={{
                  position: 'absolute', top: 2, left: val ? 18 : 2,
                  width: 16, height: 16, borderRadius: '50%', background: '#fff',
                  transition: 'left 0.2s',
                }} />
              </div>
              <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{label}</span>
            </button>
          )
        })}
      </div>

      {/* Webhook URL (read-only) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          URL de Webhook (configura en {systemName})
        </label>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{
            flex: 1, background: 'var(--bg)', border: '1px solid var(--border)',
            borderRadius: 8, padding: '9px 12px', color: 'var(--text-muted)', fontSize: 12,
            fontFamily: 'monospace',
          }}>
            {WEBHOOK_URL}
          </div>
          <button
            onClick={handleCopy}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '9px 12px',
              background: copied ? 'rgba(34,197,94,0.12)' : 'var(--bg)',
              border: `1px solid ${copied ? '#22C55E33' : 'var(--border)'}`,
              borderRadius: 8, color: copied ? '#22C55E' : 'var(--text-secondary)',
              fontSize: 12, cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap',
            }}
          >
            {copied ? <CheckCircle2 size={13} /> : <Copy size={13} />}
            {copied ? 'Copiado' : 'Copiar'}
          </button>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
        <button
          onClick={handleTest}
          disabled={testState === 'testing'}
          style={{
            display: 'flex', alignItems: 'center', gap: 7, padding: '10px 16px',
            background: 'var(--surface-hover)', border: '1px solid var(--border)', borderRadius: 8,
            color: 'var(--text-secondary)', fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s',
          }}
        >
          {testState === 'testing' ? (
            <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} />
          ) : testState === 'success' ? (
            <CheckCircle2 size={14} color="#22C55E" />
          ) : testState === 'error' ? (
            <XCircle size={14} color="#EF4444" />
          ) : (
            <Zap size={14} />
          )}
          {testState === 'testing' ? 'Probando…' : testState === 'success' ? 'Conexión exitosa' : testState === 'error' ? 'Error al conectar' : 'Probar conexión'}
        </button>

        <button
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            padding: '10px 20px', background: '#22C55E', borderRadius: 8,
            color: '#000000', fontSize: 13, fontWeight: 700, cursor: 'pointer', border: 'none',
          }}
        >
          <Plug size={14} />
          Guardar y conectar
        </button>
      </div>
    </div>
  )
}
