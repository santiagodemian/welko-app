(function () {
  'use strict';

  var scriptTag = document.currentScript || (function () {
    var scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();

  var clinicId = scriptTag.getAttribute('data-clinic-id');
  if (!clinicId) {
    console.warn('[Welko Widget] Missing data-clinic-id attribute.');
    return;
  }

  var BASE_URL = 'https://welko.agency';
  var messages = [];
  var clinicConfig = null;
  var isOpen = false;
  var isTyping = false;

  /* ── Styles ── */
  var css = `
    #welko-widget-btn {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 999999;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: #6366f1;
      color: #fff;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(99,102,241,0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      font-size: 22px;
    }
    #welko-widget-btn:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 24px rgba(99,102,241,0.55);
    }
    #welko-widget-panel {
      position: fixed;
      bottom: 92px;
      right: 24px;
      z-index: 999998;
      width: 360px;
      max-width: calc(100vw - 32px);
      height: 520px;
      max-height: calc(100vh - 120px);
      background: #ffffff;
      border-radius: 20px;
      box-shadow: 0 8px 40px rgba(0,0,0,0.18);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      transform: scale(0.95) translateY(10px);
      opacity: 0;
      pointer-events: none;
      transition: transform 0.22s ease, opacity 0.22s ease;
    }
    #welko-widget-panel.welko-open {
      transform: scale(1) translateY(0);
      opacity: 1;
      pointer-events: all;
    }
    #welko-widget-header {
      background: #6366f1;
      color: #fff;
      padding: 14px 16px;
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
    }
    #welko-widget-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(255,255,255,0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      flex-shrink: 0;
    }
    #welko-widget-header-info {
      flex: 1;
      min-width: 0;
    }
    #welko-widget-clinic-name {
      font-weight: 600;
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    #welko-widget-status {
      font-size: 11px;
      opacity: 0.85;
      margin-top: 1px;
    }
    #welko-widget-close {
      background: rgba(255,255,255,0.2);
      border: none;
      color: #fff;
      cursor: pointer;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      line-height: 1;
      flex-shrink: 0;
      transition: background 0.15s;
    }
    #welko-widget-close:hover {
      background: rgba(255,255,255,0.35);
    }
    #welko-widget-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      background: #f8f9fb;
    }
    #welko-widget-messages::-webkit-scrollbar {
      width: 4px;
    }
    #welko-widget-messages::-webkit-scrollbar-track {
      background: transparent;
    }
    #welko-widget-messages::-webkit-scrollbar-thumb {
      background: #d1d5db;
      border-radius: 2px;
    }
    .welko-msg {
      max-width: 82%;
      padding: 9px 13px;
      border-radius: 16px;
      font-size: 13.5px;
      line-height: 1.5;
      word-break: break-word;
    }
    .welko-msg-assistant {
      align-self: flex-start;
      background: #ffffff;
      color: #111827;
      border-bottom-left-radius: 4px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }
    .welko-msg-user {
      align-self: flex-end;
      background: #6366f1;
      color: #ffffff;
      border-bottom-right-radius: 4px;
    }
    .welko-typing {
      align-self: flex-start;
      background: #ffffff;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
      padding: 10px 14px;
      border-radius: 16px;
      border-bottom-left-radius: 4px;
      display: flex;
      gap: 4px;
      align-items: center;
    }
    .welko-typing span {
      width: 7px;
      height: 7px;
      background: #9ca3af;
      border-radius: 50%;
      animation: welko-bounce 1.2s infinite;
    }
    .welko-typing span:nth-child(2) { animation-delay: 0.2s; }
    .welko-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes welko-bounce {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-5px); }
    }
    #welko-widget-input-area {
      padding: 10px 12px;
      border-top: 1px solid #e5e7eb;
      background: #ffffff;
      display: flex;
      align-items: flex-end;
      gap: 8px;
      flex-shrink: 0;
    }
    #welko-widget-textarea {
      flex: 1;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 9px 12px;
      font-size: 13.5px;
      font-family: inherit;
      resize: none;
      max-height: 120px;
      min-height: 38px;
      line-height: 1.45;
      outline: none;
      color: #111827;
      background: #f8f9fb;
      transition: border-color 0.15s;
      overflow-y: auto;
    }
    #welko-widget-textarea:focus {
      border-color: #6366f1;
      background: #fff;
    }
    #welko-widget-textarea::placeholder {
      color: #9ca3af;
    }
    #welko-widget-send {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: #6366f1;
      border: none;
      cursor: pointer;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: background 0.15s, transform 0.15s;
    }
    #welko-widget-send:hover {
      background: #4f46e5;
      transform: scale(1.05);
    }
    #welko-widget-send:disabled {
      background: #d1d5db;
      cursor: default;
      transform: none;
    }
    #welko-widget-footer {
      text-align: center;
      font-size: 10.5px;
      color: #9ca3af;
      padding: 6px 12px 8px;
      background: #fff;
    }
    #welko-widget-footer a {
      color: #6366f1;
      text-decoration: none;
    }
    #welko-widget-footer a:hover {
      text-decoration: underline;
    }
  `;

  function injectStyles() {
    var style = document.createElement('style');
    style.id = 'welko-widget-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function createDOM() {
    /* Floating button */
    var btn = document.createElement('button');
    btn.id = 'welko-widget-btn';
    btn.setAttribute('aria-label', 'Abrir chat');
    btn.innerHTML = '💬';
    btn.addEventListener('click', togglePanel);
    document.body.appendChild(btn);

    /* Panel */
    var panel = document.createElement('div');
    panel.id = 'welko-widget-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Chat con recepcionista');

    /* Header */
    var header = document.createElement('div');
    header.id = 'welko-widget-header';
    header.innerHTML = `
      <div id="welko-widget-avatar">🤖</div>
      <div id="welko-widget-header-info">
        <div id="welko-widget-clinic-name">Cargando...</div>
        <div id="welko-widget-status">● En línea ahora</div>
      </div>
      <button id="welko-widget-close" aria-label="Cerrar chat">✕</button>
    `;
    panel.appendChild(header);

    /* Messages */
    var messagesEl = document.createElement('div');
    messagesEl.id = 'welko-widget-messages';
    panel.appendChild(messagesEl);

    /* Input area */
    var inputArea = document.createElement('div');
    inputArea.id = 'welko-widget-input-area';

    var textarea = document.createElement('textarea');
    textarea.id = 'welko-widget-textarea';
    textarea.placeholder = 'Escribe tu mensaje...';
    textarea.rows = 1;
    textarea.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
    textarea.addEventListener('input', autoResize);

    var sendBtn = document.createElement('button');
    sendBtn.id = 'welko-widget-send';
    sendBtn.setAttribute('aria-label', 'Enviar');
    sendBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
    sendBtn.addEventListener('click', sendMessage);

    inputArea.appendChild(textarea);
    inputArea.appendChild(sendBtn);
    panel.appendChild(inputArea);

    /* Footer */
    var footer = document.createElement('div');
    footer.id = 'welko-widget-footer';
    footer.innerHTML = 'Powered by <a href="https://welko.agency" target="_blank" rel="noopener">Welko</a>';
    panel.appendChild(footer);

    document.body.appendChild(panel);

    document.getElementById('welko-widget-close').addEventListener('click', togglePanel);
  }

  function autoResize() {
    var ta = document.getElementById('welko-widget-textarea');
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
  }

  function togglePanel() {
    isOpen = !isOpen;
    var panel = document.getElementById('welko-widget-panel');
    var btn = document.getElementById('welko-widget-btn');
    if (isOpen) {
      panel.classList.add('welko-open');
      btn.innerHTML = '✕';
      btn.setAttribute('aria-label', 'Cerrar chat');
      if (messages.length === 0 && clinicConfig) {
        addWelcomeMessage();
      }
      setTimeout(function () {
        document.getElementById('welko-widget-textarea').focus();
      }, 250);
    } else {
      panel.classList.remove('welko-open');
      btn.innerHTML = '💬';
      btn.setAttribute('aria-label', 'Abrir chat');
    }
  }

  function addWelcomeMessage() {
    var agentName = clinicConfig.agentName || 'Sofía';
    var clinicName = clinicConfig.clinicName || 'la clínica';
    var greeting = '¡Hola! Soy ' + agentName + ', recepcionista virtual de ' + clinicName + '. ¿En qué puedo ayudarte hoy?';
    appendMessage('assistant', greeting);
    messages.push({ role: 'assistant', content: greeting });
  }

  function appendMessage(role, text) {
    var el = document.createElement('div');
    el.className = 'welko-msg welko-msg-' + role;
    el.textContent = text;
    var container = document.getElementById('welko-widget-messages');
    container.appendChild(el);
    container.scrollTop = container.scrollHeight;
    return el;
  }

  function showTyping() {
    var el = document.createElement('div');
    el.className = 'welko-typing';
    el.id = 'welko-typing-indicator';
    el.innerHTML = '<span></span><span></span><span></span>';
    var container = document.getElementById('welko-widget-messages');
    container.appendChild(el);
    container.scrollTop = container.scrollHeight;
  }

  function hideTyping() {
    var el = document.getElementById('welko-typing-indicator');
    if (el) el.remove();
  }

  function setSendDisabled(disabled) {
    var btn = document.getElementById('welko-widget-send');
    if (btn) btn.disabled = disabled;
  }

  function sendMessage() {
    if (isTyping) return;
    var ta = document.getElementById('welko-widget-textarea');
    var text = ta.value.trim();
    if (!text) return;

    ta.value = '';
    ta.style.height = 'auto';

    appendMessage('user', text);
    messages.push({ role: 'user', content: text });

    isTyping = true;
    setSendDisabled(true);
    showTyping();

    fetch(BASE_URL + '/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: messages.slice(-20),
        clinicId: clinicId,
        specialty: clinicConfig ? clinicConfig.specialty : undefined,
      }),
    })
      .then(function (res) {
        if (!res.ok) throw new Error('Error ' + res.status);
        return res.json();
      })
      .then(function (data) {
        hideTyping();
        var reply = (data && data.reply) ? data.reply : 'Lo siento, no pude procesar tu mensaje.';
        appendMessage('assistant', reply);
        messages.push({ role: 'assistant', content: reply });
      })
      .catch(function () {
        hideTyping();
        appendMessage('assistant', 'Lo siento, ocurrió un error. Por favor intenta de nuevo.');
      })
      .finally(function () {
        isTyping = false;
        setSendDisabled(false);
        document.getElementById('welko-widget-textarea').focus();
      });
  }

  function loadConfig() {
    fetch(BASE_URL + '/api/widget/' + encodeURIComponent(clinicId))
      .then(function (res) {
        if (!res.ok) throw new Error('Config not found');
        return res.json();
      })
      .then(function (config) {
        clinicConfig = config;
        var nameEl = document.getElementById('welko-widget-clinic-name');
        if (nameEl) nameEl.textContent = config.agentName || config.clinicName || 'Recepcionista Virtual';
        var accentColor = config.accent;
        if (accentColor) {
          applyAccentColor(accentColor);
        }
      })
      .catch(function () {
        var nameEl = document.getElementById('welko-widget-clinic-name');
        if (nameEl) nameEl.textContent = 'Recepcionista Virtual';
        clinicConfig = {};
      });
  }

  function applyAccentColor(color) {
    var style = document.getElementById('welko-widget-styles');
    if (!style) return;
    style.textContent = style.textContent
      .replace(/#6366f1/g, color)
      .replace(/#4f46e5/g, color);
  }

  function init() {
    injectStyles();
    createDOM();
    loadConfig();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
