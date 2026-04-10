'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot } from 'lucide-react'
import { useLang } from '@/contexts/LangContext'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

interface Msg { role: 'user' | 'bot'; text: string }

const FAQ_ES: [RegExp, string][] = [
  [/precio|costo|plan|cuánto/i,     '📦 Tenemos 4 planes: Starter $299, Essential $799, Pro $1,499 y Business $2,999 MXN/mes. Todos incluyen WhatsApp + IA 24/7. ¿Quieres que te explique qué incluye cada uno?'],
  [/instalar|setup|configurar|empezar|comenzar/i, '⚡ El proceso tarda menos de 24 horas. Te pedimos el número de WhatsApp Business, info de tu negocio y listo. Sin código ni técnicos.'],
  [/whatsapp|canal|instagram|facebook/i, '📱 Welko se conecta a WhatsApp Business API, Instagram DMs, Facebook Messenger y un widget web. Todos en un solo panel.'],
  [/prueba|demo|gratis/i,           '🎁 Puedes probar el simulador de chat aquí mismo en la página. Para una demo personalizada escríbenos a hola@welko.org.'],
  [/cancelar|contrato|permanencia/i,'✅ Sin contratos ni permanencia. Cancelas cuando quieras desde tu cuenta, sin llamadas ni formularios.'],
  [/seguro|datos|privacidad/i,       '🔒 Todos los datos están cifrados. Cumplimos con la Ley Federal de Protección de Datos Personales de México y GDPR.'],
  [/no.?show|recordatorio|cita/i,   '🔔 Sí — Welko envía recordatorios automáticos 24h antes de cada cita, lo que reduce los no-shows entre un 35% y 38%.'],
  [/industria|restaurante|gym|hotel|bar|spa|legal/i, '🏪 Welko funciona para clínicas, restaurantes, barberías, spas, hoteles, gimnasios y despachos legales. Cada industria tiene su CRM personalizado.'],
  [/crm|dashboard|reporte/i,        '📊 El CRM incluye pipeline Kanban, calendario de citas, predictor de no-shows, métricas por canal y un Cerebro IA con insights semanales.'],
  [/pago|stripe|factura|fiscal/i,   '💳 Pagos seguros vía Stripe. Aceptamos tarjetas de crédito y débito. Podemos emitir factura fiscal (CFDI).'],
]

const FAQ_EN: [RegExp, string][] = [
  [/price|cost|plan|how much/i,     '📦 We have 4 plans: Starter $49, Essential $99, Pro $199 and Business $399 USD/month. All include WhatsApp + 24/7 AI. Want details on each?'],
  [/install|setup|configure|start/i,'⚡ Setup takes under 24 hours. We need your WhatsApp Business number and business info. No code or developers needed.'],
  [/whatsapp|channel|instagram|facebook/i, '📱 Welko connects to WhatsApp Business API, Instagram DMs, Facebook Messenger and a web widget — all in one dashboard.'],
  [/trial|demo|free/i,              '🎁 You can try the chat simulator right here on the page. For a personalized demo, email us at hola@welko.org.'],
  [/cancel|contract|commitment/i,   '✅ No contracts or lock-in. Cancel anytime from your account — no calls or forms required.'],
  [/secure|data|privacy/i,           '🔒 All data is encrypted. We comply with Mexico\'s Federal Data Protection Law and GDPR.'],
  [/no.?show|reminder|appointment/i,'🔔 Yes — Welko sends automatic reminders 24h before each appointment, reducing no-shows by 35–38%.'],
  [/industry|restaurant|gym|hotel|barbershop|spa|legal/i, '🏪 Welko works for clinics, restaurants, barbershops, spas, hotels, gyms and law firms. Each industry has its own custom CRM.'],
  [/crm|dashboard|report/i,         '📊 The CRM includes a Kanban pipeline, appointment calendar, no-show predictor, per-channel metrics and weekly AI insights.'],
  [/payment|stripe|invoice|billing/i,'💳 Secure payments via Stripe. We accept credit and debit cards. International invoicing available.'],
]

function getBotReply(input: string, isEN: boolean): string {
  const faq = isEN ? FAQ_EN : FAQ_ES
  for (const [pattern, reply] of faq) {
    if (pattern.test(input)) return reply
  }
  return isEN
    ? "I'm not sure about that specific question. 😊 For detailed support, write to hola@welko.org or call +52 56 2844 3738. We usually respond in under 2 hours."
    : 'No tengo respuesta exacta para eso 😊. Para soporte detallado escríbenos a hola@welko.org o llámanos al +52 56 2844 3738. Respondemos en menos de 2 horas.'
}

export function SupportChatbot() {
  const { lang } = useLang()
  const isEN = lang === 'en'

  const [open,    setOpen]    = useState(false)
  const [msgs,    setMsgs]    = useState<Msg[]>([])
  const [input,   setInput]   = useState('')
  const [typing,  setTyping]  = useState(false)
  const bottomRef             = useRef<HTMLDivElement>(null)

  const welcome = isEN
    ? "👋 Hi! I'm Welko's support bot. Ask me anything about plans, setup, features, or integrations."
    : '👋 ¡Hola! Soy el bot de soporte de Welko. Pregúntame sobre planes, configuración, funciones o integraciones.'

  useEffect(() => {
    if (open && msgs.length === 0) {
      setMsgs([{ role: 'bot', text: welcome }])
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs, typing])

  function send() {
    const text = input.trim()
    if (!text) return
    setInput('')
    setMsgs(prev => [...prev, { role: 'user', text }])
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMsgs(prev => [...prev, { role: 'bot', text: getBotReply(text, isEN) }])
    }, 900)
  }

  const suggestions = isEN
    ? ['How much does it cost?', 'Which industries?', 'How to set up?', 'Cancel anytime?']
    : ['¿Cuánto cuesta?', '¿Qué industrias?', '¿Cómo me configuro?', '¿Sin contrato?']

  return (
    <>
      {/* Floating button */}
      <motion.button
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ delay: 2, type: 'spring', stiffness: 260, damping: 20 }}
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-200"
        style={{ background: '#13244A', color: '#fff', boxShadow: '0 8px 32px rgba(19,36,74,0.35)' }}
        aria-label="Soporte Welko"
      >
        {open ? <X size={20} /> : <MessageCircle size={22} />}
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-white" />
        )}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="fixed bottom-24 right-6 z-50 w-[340px] max-w-[calc(100vw-2rem)] flex flex-col rounded-2xl overflow-hidden"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: '0 20px 60px rgba(0,0,0,0.18)', height: 460 }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3" style={{ background: '#13244A' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.15)' }}>
                <Bot size={16} color="#fff" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white leading-none">Welko Support</p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  {isEN ? 'Usually replies instantly' : 'Responde al instante'}
                </p>
              </div>
              <div className="w-2 h-2 rounded-full bg-green-400" />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto flex flex-col gap-2 px-3 py-3" style={{ background: '#F9FAFB' }}>
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className="max-w-[260px] px-3 py-2 rounded-2xl text-xs leading-relaxed"
                    style={m.role === 'user'
                      ? { background: '#13244A', color: '#fff', borderBottomRightRadius: 4 }
                      : { background: '#fff', color: '#111', borderBottomLeftRadius: 4, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                    {m.text}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1 px-3 py-2 rounded-2xl rounded-bl-sm" style={{ background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                    {[0,1,2].map(i => (
                      <span key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: '#9CA3AF', animation: `bounce 1.2s ease-in-out ${i*0.2}s infinite` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggestions */}
            {msgs.length <= 1 && (
              <div className="flex flex-wrap gap-1.5 px-3 pb-2 pt-1" style={{ background: '#F9FAFB' }}>
                {suggestions.map(s => (
                  <button key={s} onClick={() => { setInput(s); setTimeout(send, 50) }}
                    className="text-xs px-3 py-1.5 rounded-full transition-all duration-150"
                    style={{ background: '#EEF2FF', color: '#13244A', border: '1px solid #C7D2FE' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#E0E7FF')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#EEF2FF')}>
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="flex items-center gap-2 px-3 py-2.5" style={{ borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder={isEN ? 'Ask a question...' : 'Escribe tu pregunta...'}
                className="flex-1 text-xs px-3 py-2 rounded-xl outline-none"
                style={{ background: '#F3F4F6', border: '1px solid var(--border)', color: '#111' }}
              />
              <button onClick={send}
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
                style={{ background: '#13244A', color: '#fff' }}
                onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.opacity = '0.85')}
                onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.opacity = '1')}>
                <Send size={13} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@keyframes bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}`}</style>
    </>
  )
}
