;(function () {
  'use strict'

  var BASE_URL = 'https://welko.agency'
  var script   = document.currentScript || (function () {
    var scripts = document.getElementsByTagName('script')
    return scripts[scripts.length - 1]
  })()
  var CLINIC_ID = script.getAttribute('data-clinic-id')
  if (!CLINIC_ID) { console.warn('[Welko] data-clinic-id is required.'); return }

  // ── State ──────────────────────────────────────────────────────────────────
  var config   = { clinicName: 'Clínica', agentName: 'Sofía', accent: '#1A2A56', specialty: 'medica', clinicId: CLINIC_ID }
  var messages = []
  var loading  = false
  var open     = false

  // ── Inject styles ──────────────────────────────────────────────────────────
  var css = [
    '#wlk-btn{position:fixed;bottom:24px;right:24px;z-index:2147483646;width:56px;height:56px;border-radius:50%;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(0,0,0,0.20);transition:transform .2s,box-shadow .2s;background:#1A2A56}',
    '#wlk-btn:hover{transform:scale(1.08);box-shadow:0 6px 28px rgba(0,0,0,0.28)}',
    '#wlk-btn svg{width:24px;height:24px;fill:none;stroke:#fff;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}',
    '#wlk-badge{position:absolute;top:-3px;right:-3px;width:14px;height:14px;border-radius:50%;background:#22c55e;border:2.5px solid #fff;animation:wlk-pulse 2s infinite}',
    '@keyframes wlk-pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.2);opacity:.7}}',
    '#wlk-panel{position:fixed;bottom:90px;right:24px;z-index:2147483647;width:360px;max-width:calc(100vw - 32px);height:520px;max-height:calc(100vh - 110px);border-radius:20px;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 16px 64px rgba(0,0,0,0.18);transform:scale(.92) translateY(12px);opacity:0;pointer-events:none;transition:transform .25s cubic-bezier(.22,1,.36,1),opacity .2s;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}',
    '#wlk-panel.wlk-open{transform:scale(1) translateY(0);opacity:1;pointer-events:all}',
    '#wlk-head{padding:14px 16px;display:flex;align-items:center;gap:10px;flex-shrink:0}',
    '#wlk-avatar{width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.18);display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0}',
    '#wlk-head-info{flex:1;min-width:0}',
    '#wlk-head-name{font-size:13px;font-weight:700;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '#wlk-head-sub{font-size:11px;color:rgba(255,255,255,.65);display:flex;align-items:center;gap:5px}',
    '#wlk-dot{width:7px;height:7px;border-radius:50%;background:#22c55e;animation:wlk-pulse 2s infinite;flex-shrink:0}',
    '#wlk-close{background:rgba(255,255,255,.15);border:none;cursor:pointer;width:28px;height:28px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#fff;font-size:16px;line-height:1;transition:background .15s}',
    '#wlk-close:hover{background:rgba(255,255,255,.25)}',
    '#wlk-msgs{flex:1;overflow-y:auto;padding:14px 12px;display:flex;flex-direction:column;gap:10px;background:#f8f9fc}',
    '#wlk-msgs::-webkit-scrollbar{width:4px}',
    '#wlk-msgs::-webkit-scrollbar-track{background:transparent}',
    '#wlk-msgs::-webkit-scrollbar-thumb{background:#d1d5db;border-radius:99px}',
    '.wlk-row{display:flex;align-items:flex-end;gap:6px}',
    '.wlk-row.wlk-user{justify-content:flex-end}',
    '.wlk-av{width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:800;color:#fff;flex-shrink:0}',
    '.wlk-bubble{max-width:78%;font-size:12.5px;line-height:1.55;padding:9px 13px;border-radius:16px;word-break:break-word}',
    '.wlk-bubble.wlk-bot{background:#fff;color:#1a1a1a;border:1px solid #e5e7eb;border-bottom-left-radius:4px;box-shadow:0 1px 3px rgba(0,0,0,.06)}',
    '.wlk-bubble.wlk-user{color:#fff;border-bottom-right-radius:4px}',
    '.wlk-typing{display:flex;align-items:center;gap:4px;padding:10px 13px}',
    '.wlk-dot-t{width:6px;height:6px;border-radius:50%;background:#9ca3af;animation:wlk-bounce .9s infinite}',
    '.wlk-dot-t:nth-child(2){animation-delay:.18s}',
    '.wlk-dot-t:nth-child(3){animation-delay:.36s}',
    '@keyframes wlk-bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}',
    '#wlk-footer{padding:10px 12px;background:#fff;border-top:1px solid #e5e7eb;display:flex;gap:8px;flex-shrink:0}',
    '#wlk-input{flex:1;border:1.5px solid #e5e7eb;border-radius:10px;padding:8px 12px;font-size:13px;outline:none;color:#1a1a1a;font-family:inherit;resize:none;height:38px;line-height:1.4;transition:border-color .15s}',
    '#wlk-input:focus{border-color:#1A2A56}',
    '#wlk-send{width:38px;height:38px;border-radius:10px;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:opacity .15s}',
    '#wlk-send:disabled{opacity:.4;cursor:not-allowed}',
    '#wlk-send svg{width:16px;height:16px;fill:none;stroke:#fff;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}',
    '#wlk-branding{text-align:center;font-size:10px;color:#9ca3af;padding:4px 0 8px;background:#fff;flex-shrink:0}',
    '#wlk-branding a{color:#1A2A56;text-decoration:none;font-weight:600}',
  ].join('\n')

  var style = document.createElement('style')
  style.textContent = css
  document.head.appendChild(style)

  // ── Build UI ───────────────────────────────────────────────────────────────
  // Button
  var btn = document.createElement('button')
  btn.id = 'wlk-btn'
  btn.setAttribute('aria-label', 'Abrir chat')
  btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg><div id="wlk-badge"></div>'
  document.body.appendChild(btn)

  // Panel
  var panel = document.createElement('div')
  panel.id = 'wlk-panel'
  panel.innerHTML = [
    '<div id="wlk-head">',
      '<div id="wlk-avatar">💬</div>',
      '<div id="wlk-head-info">',
        '<div id="wlk-head-name">Sofía · Recepcionista</div>',
        '<div id="wlk-head-sub"><span id="wlk-dot"></span>En línea ahora</div>',
      '</div>',
      '<button id="wlk-close" aria-label="Cerrar">✕</button>',
    '</div>',
    '<div id="wlk-msgs"></div>',
    '<div id="wlk-footer">',
      '<input id="wlk-input" type="text" placeholder="Escribe tu mensaje..." autocomplete="off"/>',
      '<button id="wlk-send" disabled>',
        '<svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',
      '</button>',
    '</div>',
    '<div id="wlk-branding">Powered by <a href="https://welko.agency" target="_blank">Welko</a></div>',
  ].join('')
  document.body.appendChild(panel)

  var msgsEl  = document.getElementById('wlk-msgs')
  var inputEl = document.getElementById('wlk-input')
  var sendEl  = document.getElementById('wlk-send')

  // ── Helpers ────────────────────────────────────────────────────────────────
  function applyConfig() {
    var head = document.getElementById('wlk-head')
    if (head) head.style.background = config.accent
    btn.style.background = config.accent
    sendEl.style.background = config.accent
    var nameEl = document.getElementById('wlk-head-name')
    if (nameEl) nameEl.textContent = config.agentName + ' · ' + config.clinicName
  }

  function scrollBottom() {
    if (msgsEl) msgsEl.scrollTop = msgsEl.scrollHeight
  }

  function addBubble(role, text) {
    var row = document.createElement('div')
    row.className = 'wlk-row' + (role === 'user' ? ' wlk-user' : '')

    if (role === 'assistant') {
      var av = document.createElement('div')
      av.className = 'wlk-av'
      av.style.background = config.accent
      av.textContent = 'IA'
      row.appendChild(av)
    }

    var bubble = document.createElement('div')
    bubble.className = 'wlk-bubble ' + (role === 'user' ? 'wlk-user' : 'wlk-bot')
    if (role === 'user') bubble.style.background = config.accent
    bubble.textContent = text
    row.appendChild(bubble)
    msgsEl.appendChild(row)
    scrollBottom()
  }

  function showTyping() {
    var row = document.createElement('div')
    row.className = 'wlk-row'
    row.id = 'wlk-typing-row'
    var av = document.createElement('div')
    av.className = 'wlk-av'
    av.style.background = config.accent
    av.textContent = 'IA'
    row.appendChild(av)
    var bubble = document.createElement('div')
    bubble.className = 'wlk-bubble wlk-bot wlk-typing'
    bubble.innerHTML = '<div class="wlk-dot-t"></div><div class="wlk-dot-t"></div><div class="wlk-dot-t"></div>'
    row.appendChild(bubble)
    msgsEl.appendChild(row)
    scrollBottom()
  }

  function hideTyping() {
    var el = document.getElementById('wlk-typing-row')
    if (el) el.parentNode.removeChild(el)
  }

  function openPanel() {
    open = true
    panel.classList.add('wlk-open')
    btn.setAttribute('aria-label', 'Cerrar chat')
    btn.innerHTML = '<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
    if (messages.length === 0) sendGreeting()
    setTimeout(function () { inputEl && inputEl.focus() }, 300)
  }

  function closePanel() {
    open = false
    panel.classList.remove('wlk-open')
    btn.setAttribute('aria-label', 'Abrir chat')
    btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg><div id="wlk-badge"></div>'
  }

  function sendGreeting() {
    var greetings = {
      dental:        'Bienvenido a ' + config.clinicName + '. Soy ' + config.agentName + ', recepcionista virtual. ¿En qué le puedo ayudar hoy?',
      psicologia:    'Bienvenido a ' + config.clinicName + '. Soy ' + config.agentName + ', recepcionista virtual. ¿En qué le puedo ayudar?',
      estetica:      'Bienvenido a ' + config.clinicName + '. Soy ' + config.agentName + '. ¿Le ayudo a agendar una cita o tiene alguna pregunta?',
      nutricion:     'Bienvenido a ' + config.clinicName + '. Soy ' + config.agentName + '. ¿En qué le puedo ayudar hoy?',
      ginecologia:   'Bienvenido a ' + config.clinicName + '. Soy ' + config.agentName + ', recepcionista virtual. ¿En qué le puedo ayudar?',
      oftalmologia:  'Bienvenido a ' + config.clinicName + '. Soy ' + config.agentName + '. ¿En qué le puedo ayudar hoy?',
      medica:        'Bienvenido a ' + config.clinicName + '. Soy ' + config.agentName + ', recepcionista virtual. ¿En qué le puedo ayudar?',
      fisioterapia:  'Bienvenido a ' + config.clinicName + '. Soy ' + config.agentName + '. ¿Le ayudo a agendar su cita?',
      spa:           'Bienvenido a ' + config.clinicName + '. Soy ' + config.agentName + '. ¿Le ayudo a reservar su sesión?',
      quiropractica: 'Bienvenido a ' + config.clinicName + '. Soy ' + config.agentName + '. ¿En qué le puedo ayudar hoy?',
    }
    var greeting = greetings[config.specialty] || greetings.medica
    var msg = { role: 'assistant', content: greeting }
    messages.push(msg)
    addBubble('assistant', greeting)
  }

  async function send() {
    if (loading) return
    var text = inputEl.value.trim()
    if (!text) return
    inputEl.value = ''
    sendEl.disabled = true

    var userMsg = { role: 'user', content: text }
    messages.push(userMsg)
    addBubble('user', text)
    loading = true
    showTyping()

    try {
      var res = await fetch(BASE_URL + '/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clinicId: config.clinicId,
          specialty: config.specialty,
          messages: messages,
        }),
      })
      var data = await res.json()
      hideTyping()
      var reply = data.reply || 'Disculpe, hubo un problema. ¿Podría intentarlo de nuevo?'
      messages.push({ role: 'assistant', content: reply })
      addBubble('assistant', reply)
    } catch (e) {
      hideTyping()
      addBubble('assistant', 'Disculpe, hubo un problema de conexión. ¿Podría intentarlo de nuevo?')
    } finally {
      loading = false
      inputEl.focus()
    }
  }

  // ── Events ─────────────────────────────────────────────────────────────────
  btn.addEventListener('click', function () { open ? closePanel() : openPanel() })
  document.getElementById('wlk-close').addEventListener('click', closePanel)

  inputEl.addEventListener('input', function () {
    sendEl.disabled = !inputEl.value.trim()
  })
  inputEl.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  })
  sendEl.addEventListener('click', send)

  // ── Load config from API ───────────────────────────────────────────────────
  fetch(BASE_URL + '/api/widget/' + CLINIC_ID)
    .then(function (r) { return r.json() })
    .then(function (data) {
      if (data.clinicId) {
        config.clinicName = data.clinicName || config.clinicName
        config.agentName  = data.agentName  || config.agentName
        config.specialty  = data.specialty  || config.specialty
        config.accent     = data.accent     || config.accent
        applyConfig()
      }
    })
    .catch(function () {})

  applyConfig()
})()
