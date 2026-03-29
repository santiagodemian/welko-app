'use client'

import { useState } from 'react'
import {
  Phone, MessageCircle, AtSign, Share2, Globe,
  Sparkles, Brain, Bell, Zap, Users, TrendingUp,
} from 'lucide-react'

/* ── Design tokens (CSS vars — responds to light/dark mode) ── */
const SURF   = 'var(--surface)'
const SURF2  = 'var(--surface-hover)'
const BORD   = 'var(--border)'
const TEXT   = 'var(--text-primary)'
const MUTED  = 'var(--text-secondary)'
const GREEN  = '#22C55E'
const BLUE   = '#3B82F6'
const AMBER  = '#F59E0B'
const PURPLE = '#A78BFA'
const RED    = '#EF4444'
const TEAL   = '#10B981'

/* ── Types ── */
type LeadStatus  = 'NUEVO' | 'EN_SEGUIMIENTO_IA' | 'CITA_CONFIRMADA' | 'REVENUE_CERRADO' | 'PERDIDO'
type LeadChannel = 'WHATSAPP' | 'INSTAGRAM' | 'FACEBOOK' | 'LLAMADA' | 'WEB'

interface Lead {
  id: string
  status: LeadStatus
  name: string
  initial: string
  channel: LeadChannel
  time: string
  value?: number
  aiNote?: string
}

interface AiTask {
  Icon: React.ElementType
  color: string
  type: string
  name: string
  detail: string
  urgent: boolean
}

/* ── Pipeline columns ── */
const PIPELINE: { key: LeadStatus; label: string; color: string; sublabel: string }[] = [
  { key: 'NUEVO',             label: 'Nuevos',          color: BLUE,   sublabel: 'Contacto inicial' },
  { key: 'EN_SEGUIMIENTO_IA', label: 'Seguimiento IA',  color: PURPLE, sublabel: 'Nutriendo lead' },
  { key: 'CITA_CONFIRMADA',   label: 'Cita confirmada', color: GREEN,  sublabel: 'Oportunidad caliente' },
  { key: 'REVENUE_CERRADO',   label: 'Cerrado',         color: TEAL,   sublabel: 'Venta realizada' },
  { key: 'PERDIDO',           label: 'Perdido',         color: RED,    sublabel: 'Sin respuesta' },
]

/* ── Mock data (misma forma que Prisma Lead) ── */
const LEADS: Lead[] = [
  { id:'1',  status:'NUEVO',             name:'Valentina Cruz',   initial:'V', channel:'WHATSAPP',  time:'12 min',      aiNote:'Interesada en blanqueamiento' },
  { id:'2',  status:'NUEVO',             name:'Roberto Herrera',  initial:'R', channel:'INSTAGRAM', time:'45 min' },
  { id:'3',  status:'NUEVO',             name:'Fernanda López',   initial:'F', channel:'LLAMADA',   time:'2h',          aiNote:'Preguntó por implantes' },
  { id:'4',  status:'EN_SEGUIMIENTO_IA', name:'Miguel Sánchez',   initial:'M', channel:'WHATSAPP',  time:'1d',          aiNote:'Follow-up programado: 10am' },
  { id:'5',  status:'EN_SEGUIMIENTO_IA', name:'Ana Martínez',     initial:'A', channel:'FACEBOOK',  time:'2d',          aiNote:'Alto interés, pendiente precio' },
  { id:'6',  status:'EN_SEGUIMIENTO_IA', name:'Carlos Ruiz',      initial:'C', channel:'WEB',       time:'3d' },
  { id:'7',  status:'CITA_CONFIRMADA',   name:'Isabel Torres',    initial:'I', channel:'WHATSAPP',  time:'Mañana 9am',  value:1800 },
  { id:'8',  status:'CITA_CONFIRMADA',   name:'Diego Morales',    initial:'D', channel:'LLAMADA',   time:'Mañana 11am', value:3500 },
  { id:'9',  status:'CITA_CONFIRMADA',   name:'Patricia Vega',    initial:'P', channel:'INSTAGRAM', time:'Mañana 2pm',  value:2200 },
  { id:'10', status:'REVENUE_CERRADO',   name:'Luis Hernández',   initial:'L', channel:'WHATSAPP',  time:'2d',          value:4500 },
  { id:'11', status:'REVENUE_CERRADO',   name:'Sofía Ramírez',    initial:'S', channel:'LLAMADA',   time:'3d',          value:8000 },
  { id:'12', status:'REVENUE_CERRADO',   name:'Marco Jiménez',    initial:'M', channel:'WEB',       time:'5d',          value:2800 },
  { id:'13', status:'PERDIDO',           name:'Jorge Pérez',      initial:'J', channel:'WEB',       time:'5d',          aiNote:'Sin respuesta en 7 días' },
  { id:'14', status:'PERDIDO',           name:'Laura Castillo',   initial:'L', channel:'INSTAGRAM', time:'8d',          aiNote:'Canceló por precio' },
]

const AI_TASKS: AiTask[] = [
  { Icon:Phone, color:AMBER,  type:'Follow-up',    name:'Miguel Sánchez',      detail:'Contactó hace 3 días y no agendó. Welko enviará mensaje automático a las 10am.', urgent:true },
  { Icon:Phone, color:AMBER,  type:'Follow-up',    name:'Carlos Ruiz',         detail:'Sin respuesta en 72h. IA reactivará conversación vía WhatsApp.', urgent:true },
  { Icon:Bell,  color:GREEN,  type:'Recordatorio', name:'Isabel Torres',       detail:'Cita mañana 9am. Recordatorio enviado y confirmado por WhatsApp ✓', urgent:false },
  { Icon:Bell,  color:GREEN,  type:'Recordatorio', name:'Diego Morales',       detail:'Cita mañana 11am. Recordatorio enviado ✓', urgent:false },
  { Icon:Bell,  color:GREEN,  type:'Recordatorio', name:'Patricia Vega',       detail:'Cita mañana 2pm. Pendiente de confirmación del paciente.', urgent:false },
  { Icon:Zap,   color:BLUE,   type:'Reactivación', name:'12 pacientes inactivos', detail:'Última visita hace +60 días. Campaña de reenganche iniciará mañana a las 9am.', urgent:false },
]

const CHANNEL_META: Record<LeadChannel, { Icon: React.ElementType; color: string }> = {
  WHATSAPP:  { Icon: MessageCircle, color: '#25D366' },
  INSTAGRAM: { Icon: AtSign,        color: '#E1306C' },
  FACEBOOK:  { Icon: Share2,        color: '#1877F2' },
  LLAMADA:   { Icon: Phone,         color: '#A78BFA' },
  WEB:       { Icon: Globe,         color: '#60A5FA' },
}

/* ── Helpers ── */
function hexToRgb(hex: string) {
  return `${parseInt(hex.slice(1,3),16)},${parseInt(hex.slice(3,5),16)},${parseInt(hex.slice(5,7),16)}`
}
function fmt(n: number) { return n.toLocaleString('es-MX') }

/* ── Page ── */
export default function CRMPage() {
  const [tab, setTab] = useState<'pipeline' | 'autonomo'>('pipeline')

  const totalPipeline = LEADS.filter(l => l.status !== 'PERDIDO').reduce((s,l) => s + (l.value ?? 0), 0)
  const confirmed = LEADS.filter(l => l.status === 'CITA_CONFIRMADA').length
  const total = LEADS.filter(l => l.status !== 'PERDIDO').length

  const KPI = [
    { label:'Pipeline total',     value:`$${fmt(totalPipeline)}`, sub:'MXN en juego',         color:GREEN,  Icon:TrendingUp },
    { label:'Tasa de conversión', value:`${Math.round(confirmed/total*100)}%`, sub:'leads → cita',  color:BLUE,   Icon:Users },
    { label:'Tareas autónomas',   value:'6',                       sub:'ejecutadas hoy por IA', color:AMBER,  Icon:Zap },
  ]

  return (
    <div style={{ padding:'28px 32px', minHeight:'100vh', background:'var(--bg)' }}>

      {/* ── Header ── */}
      <div style={{ marginBottom:24 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
          <Brain size={20} color={GREEN} />
          <h1 style={{ color:TEXT, fontSize:20, fontWeight:700, margin:0 }}>CRM Médico · Cerebro IA</h1>
        </div>
        <p style={{ color:MUTED, fontSize:13, margin:0 }}>
          Pipeline de conversión + seguimientos autónomos ejecutados por Welko sin intervención humana
        </p>
      </div>

      {/* ── KPIs ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:24 }}>
        {KPI.map((k) => (
          <div key={k.label} style={{
            background:SURF, border:`1px solid ${BORD}`, borderRadius:14,
            padding:'16px 18px', display:'flex', alignItems:'center', gap:14,
          }}>
            <div style={{
              width:40, height:40, borderRadius:11, flexShrink:0,
              background:`rgba(${hexToRgb(k.color)},0.12)`,
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <k.Icon size={17} color={k.color} />
            </div>
            <div>
              <p style={{ color:TEXT, fontSize:22, fontWeight:800, margin:0, lineHeight:1 }}>{k.value}</p>
              <p style={{ color:MUTED, fontSize:11, margin:'3px 0 1px' }}>{k.label}</p>
              <p style={{ color:k.color, fontSize:10, margin:0, fontWeight:600 }}>{k.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div style={{
        display:'flex', gap:4, marginBottom:20,
        background:SURF2, borderRadius:10, padding:4, width:'fit-content',
      }}>
        {([['pipeline','Pipeline de Ventas'],['autonomo','Cerebro IA Autónomo']] as const).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            padding:'7px 20px', borderRadius:8, fontSize:13, fontWeight:600,
            border:'none', cursor:'pointer', transition:'all 0.15s',
            background: tab === key ? SURF : 'transparent',
            color: tab === key ? TEXT : MUTED,
            boxShadow: tab === key ? '0 1px 4px rgba(0,0,0,0.3)' : 'none',
          }}>
            {label}
          </button>
        ))}
      </div>

      {/* ════════════════════════
          TAB: PIPELINE KANBAN
      ════════════════════════ */}
      {tab === 'pipeline' && (
        <div style={{ overflowX:'auto', paddingBottom:16 }}>
          <div style={{ display:'flex', gap:14, minWidth:960 }}>
            {PIPELINE.map((col) => {
              const leads = LEADS.filter(l => l.status === col.key)
              const colTotal = leads.reduce((s, l) => s + (l.value ?? 0), 0)
              return (
                <div key={col.key} style={{ flex:1, minWidth:175 }}>

                  {/* Column header */}
                  <div style={{ marginBottom:10 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:2 }}>
                      <div style={{ width:8, height:8, borderRadius:'50%', background:col.color, flexShrink:0 }} />
                      <span style={{ color:TEXT, fontSize:12, fontWeight:700 }}>{col.label}</span>
                      <span style={{
                        marginLeft:'auto', background:SURF2, color:MUTED,
                        fontSize:10, fontWeight:700, padding:'1px 8px', borderRadius:99,
                      }}>
                        {leads.length}
                      </span>
                    </div>
                    <p style={{ color:MUTED, fontSize:10, margin:'0 0 2px', paddingLeft:15 }}>{col.sublabel}</p>
                    {colTotal > 0 && (
                      <p style={{ color:col.color, fontSize:10, margin:0, paddingLeft:15, fontWeight:700 }}>
                        ${fmt(colTotal)} MXN
                      </p>
                    )}
                  </div>

                  {/* Divider */}
                  <div style={{ height:2, borderRadius:99, background:`rgba(${hexToRgb(col.color)},0.25)`, marginBottom:10 }} />

                  {/* Lead cards */}
                  <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                    {leads.map((lead) => {
                      const ch = CHANNEL_META[lead.channel]
                      return (
                        <div key={lead.id} style={{
                          background:SURF, border:`1px solid ${BORD}`,
                          borderRadius:10, padding:'10px 12px',
                          borderLeft:`3px solid ${col.color}`,
                          cursor:'pointer',
                        }}>
                          {/* Name row */}
                          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:7 }}>
                            <div style={{
                              width:24, height:24, borderRadius:'50%', flexShrink:0,
                              background:`rgba(${hexToRgb(col.color)},0.15)`,
                              display:'flex', alignItems:'center', justifyContent:'center',
                            }}>
                              <span style={{ color:col.color, fontSize:9, fontWeight:800 }}>{lead.initial}</span>
                            </div>
                            <span style={{
                              color:TEXT, fontSize:11, fontWeight:600,
                              flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
                            }}>
                              {lead.name}
                            </span>
                          </div>

                          {/* Channel + time */}
                          <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                            <ch.Icon size={10} color={ch.color} />
                            <span style={{ color:MUTED, fontSize:9 }}>{lead.channel}</span>
                            <span style={{ marginLeft:'auto', color:MUTED, fontSize:9 }}>{lead.time}</span>
                          </div>

                          {/* Value */}
                          {lead.value && (
                            <div style={{ marginTop:6, color:GREEN, fontSize:11, fontWeight:700 }}>
                              ${fmt(lead.value)} MXN
                            </div>
                          )}

                          {/* AI note */}
                          {lead.aiNote && (
                            <div style={{ marginTop:6, display:'flex', alignItems:'flex-start', gap:5 }}>
                              <Sparkles size={9} color={PURPLE} style={{ flexShrink:0, marginTop:1 }} />
                              <span style={{ color:'rgba(167,139,250,0.75)', fontSize:9, lineHeight:1.5 }}>
                                {lead.aiNote}
                              </span>
                            </div>
                          )}
                        </div>
                      )
                    })}

                    {/* Empty state */}
                    {leads.length === 0 && (
                      <div style={{
                        border:`1px dashed rgba(${hexToRgb(col.color)},0.2)`,
                        borderRadius:10, padding:'16px 12px',
                        textAlign:'center', color:MUTED, fontSize:10,
                      }}>
                        Sin leads
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ════════════════════════
          TAB: CEREBRO IA
      ════════════════════════ */}
      {tab === 'autonomo' && (
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>

          {/* Status banner */}
          <div style={{
            background:'rgba(34,197,94,0.06)', border:'1px solid rgba(34,197,94,0.18)',
            borderRadius:14, padding:'14px 20px',
            display:'flex', alignItems:'center', gap:14,
          }}>
            <div style={{
              width:36, height:36, borderRadius:10,
              background:'rgba(34,197,94,0.12)',
              display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
            }}>
              <Sparkles size={16} color={GREEN} />
            </div>
            <div style={{ flex:1 }}>
              <p style={{ color:TEXT, fontSize:13, fontWeight:700, margin:0 }}>
                Welko ejecutó 6 tareas autónomas hoy
              </p>
              <p style={{ color:MUTED, fontSize:11, margin:'3px 0 0' }}>
                2 follow-ups enviados · 3 recordatorios de cita · 1 campaña de reactivación — sin intervención humana
              </p>
            </div>
            <div style={{
              display:'flex', alignItems:'center', gap:6, flexShrink:0,
              color:GREEN, fontSize:11, fontWeight:700,
            }}>
              <span style={{ width:7, height:7, borderRadius:'50%', background:GREEN, display:'inline-block' }} />
              IA Activa
            </div>
          </div>

          {/* Section: urgent first */}
          <p style={{ color:MUTED, fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.06em', margin:0 }}>
            Tareas programadas
          </p>

          {AI_TASKS.map((task, i) => (
            <div key={i} style={{
              background:SURF,
              border:`1px solid ${task.urgent ? 'rgba(245,158,11,0.3)' : BORD}`,
              borderRadius:12, padding:'14px 18px',
              display:'flex', alignItems:'flex-start', gap:14,
            }}>
              <div style={{
                width:38, height:38, borderRadius:10, flexShrink:0,
                background:`rgba(${hexToRgb(task.color)},0.12)`,
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <task.Icon size={16} color={task.color} />
              </div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:5, flexWrap:'wrap' }}>
                  <span style={{
                    color:task.color, fontSize:10, fontWeight:700,
                    background:`rgba(${hexToRgb(task.color)},0.12)`,
                    padding:'2px 9px', borderRadius:99,
                  }}>
                    {task.type.toUpperCase()}
                  </span>
                  <span style={{ color:TEXT, fontSize:13, fontWeight:600 }}>{task.name}</span>
                  {task.urgent && (
                    <span style={{
                      color:AMBER, fontSize:10, fontWeight:700,
                      background:'rgba(245,158,11,0.12)', padding:'1px 8px', borderRadius:99,
                    }}>
                      URGENTE
                    </span>
                  )}
                </div>
                <p style={{ color:MUTED, fontSize:12, margin:0, lineHeight:1.65 }}>{task.detail}</p>
              </div>
            </div>
          ))}

          {/* Learning section */}
          <div style={{
            background:SURF, border:`1px solid ${BORD}`,
            borderRadius:14, padding:'18px 22px', marginTop:6,
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:16 }}>
              <Brain size={16} color={BLUE} />
              <span style={{ color:TEXT, fontSize:14, fontWeight:700 }}>
                Lo que Welko aprendió esta semana
              </span>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {[
                { insight:'Los martes de 10–12am son tu hora pico de consultas. Welko priorizó respuesta inmediata en ese bloque.', color:GREEN },
                { insight:'"Blanqueamiento dental" fue el servicio más consultado: 43% de los leads esta semana. Considera destacarlo en campañas.', color:BLUE },
                { insight:'3 pacientes cancelaron mencionando precio. Welko sugiere ofrecer plan de pagos en el siguiente seguimiento.', color:AMBER },
                { insight:'Tasa de conversión WhatsApp (71%) supera a Instagram (38%). Welko priorizará ese canal para reactivaciones.', color:PURPLE },
              ].map((item, i) => (
                <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:10 }}>
                  <div style={{ width:6, height:6, borderRadius:'50%', background:item.color, marginTop:5, flexShrink:0 }} />
                  <p style={{ color:MUTED, fontSize:12, margin:0, lineHeight:1.65 }}>{item.insight}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  )
}
