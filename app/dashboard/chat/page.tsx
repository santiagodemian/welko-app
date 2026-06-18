'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2, RotateCcw } from 'lucide-react'

const N = '#0A0A0A'
const G = '#2563EB'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const SUGGESTED = [
  'What is the FIFA agent fee cap?',
  'Explain what a sell-on clause means.',
  'What is a release clause vs a buy-out clause?',
  'How does a loan-to-buy deal work?',
  'What does "Bosman ruling" mean for agents?',
  'What are solidarity contributions in a transfer?',
  'What should I check before advising a player to sign?',
  'What is the maximum length of a representation agreement?',
]

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)
  const bottomRef               = useRef<HTMLDivElement>(null)
  const inputRef                = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function sendMessage(text?: string) {
    const content = (text ?? input).trim()
    if (!content || loading) return

    const userMsg: Message = { role: 'user', content }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/dashboard/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })
      const data = await res.json()
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${data.error ?? 'Unknown error'}` }])
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please try again.' }])
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: 'var(--font-montserrat), sans-serif', maxWidth: 800, margin: '0 auto', padding: 'clamp(20px,4vw,32px) clamp(14px,4vw,40px) 0' }}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        @media (max-width: 540px) {
          .chat-suggestions { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexShrink: 0 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `${G}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={18} color={G} />
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: N, margin: 0, letterSpacing: '-0.03em' }}>Polaris Assistant</h1>
          </div>
          <p style={{ color: '#9CA3AF', margin: 0, fontSize: 13 }}>
            Ask about FIFA regulations, contract terms, transfer rules, and agent best practices.
          </p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={() => setMessages([])}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'white', border: '1px solid #E5E7EB', borderRadius: 9, padding: '7px 13px', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: '#6B7280', fontFamily: 'inherit' }}
          >
            <RotateCcw size={12} /> New chat
          </button>
        )}
      </div>

      {/* Messages area */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 16 }}>

        {/* Empty state with suggestions */}
        {messages.length === 0 && (
          <div style={{ paddingTop: 8 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#9CA3AF', margin: '0 0 14px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Suggested questions
            </p>
            <div className="chat-suggestions" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {SUGGESTED.map(s => (
                <button key={s} onClick={() => sendMessage(s)}
                  style={{ textAlign: 'left', padding: '12px 16px', background: 'white', border: '1px solid #E5E7EB', borderRadius: 12, cursor: 'pointer', fontSize: 13, color: N, fontWeight: 500, fontFamily: 'inherit', lineHeight: 1.4, transition: 'border-color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = G)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = '#E5E7EB')}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message thread */}
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, maxWidth: '85%', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
              {/* Avatar */}
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: msg.role === 'user' ? N : `${G}15`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
                {msg.role === 'user'
                  ? <User size={14} color="white" />
                  : <Bot size={14} color={G} />}
              </div>
              {/* Bubble */}
              <div style={{
                padding: '12px 16px',
                borderRadius: msg.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                background: msg.role === 'user' ? N : 'white',
                border: msg.role === 'user' ? 'none' : '1px solid #E5E7EB',
                fontSize: 13,
                color: msg.role === 'user' ? 'white' : N,
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
              }}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: `${G}15`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={14} color={G} />
            </div>
            <div style={{ padding: '12px 16px', borderRadius: '4px 16px 16px 16px', background: 'white', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Loader2 size={13} color={G} style={{ animation: 'spin 1s linear infinite' }} />
              <span style={{ fontSize: 13, color: '#9CA3AF' }}>Thinking…</span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div style={{ paddingBottom: 32, paddingTop: 12, flexShrink: 0 }}>
        <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', background: 'white', border: '1px solid #E5E7EB', borderRadius: 14, padding: '8px 8px 8px 16px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask about contracts, FIFA rules, transfer terminology…"
            disabled={loading}
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14, fontFamily: 'inherit', color: N, background: 'transparent' }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            style={{ width: 38, height: 38, borderRadius: 10, background: !input.trim() ? '#F3F4F6' : N, border: 'none', cursor: !input.trim() ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.15s' }}
          >
            <Send size={15} color={!input.trim() ? '#9CA3AF' : 'white'} />
          </button>
        </div>
        <p style={{ fontSize: 11, color: '#D1D5DB', textAlign: 'center', marginTop: 8 }}>
          AI assistant · Not legal advice — consult a qualified sports lawyer for binding decisions.
        </p>
      </div>
    </div>
  )
}
