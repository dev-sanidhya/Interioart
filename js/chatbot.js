(function () {
  const CHANNEL_NAME = 'interioarty-leads';
  const bc = 'BroadcastChannel' in window ? new BroadcastChannel(CHANNEL_NAME) : null;

  const state = {
    open: false,
    messages: [
      {
        role: 'assistant',
        content:
          "Hi, I'm Arty 👋 — InterioArty's design assistant. Ask me about VR walkthroughs, pricing, timelines, or anything about your space.",
      },
    ],
    leadCaptured: false,
  };

  function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  const launcher = el(
    'button',
    'chat-launcher',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>'
  );

  const panel = el('div', 'chat-panel');
  panel.innerHTML = `
    <div class="chat-head">
      <div class="chat-avatar serif">A</div>
      <div class="chat-head-info">
        <b>Arty · InterioArty</b>
        <span>Usually replies instantly</span>
      </div>
    </div>
    <div class="chat-messages" id="chatMessages"></div>
    <div class="chat-suggestions" id="chatSuggestions">
      <button class="chip" data-q="How much does interior design cost?">Pricing</button>
      <button class="chip" data-q="Tell me about the VR walkthrough">VR Demo</button>
      <button class="chip" data-q="How long does a full home project take?">Timeline</button>
    </div>
    <div class="chat-input-row">
      <input type="text" id="chatInput" placeholder="Type your message..." autocomplete="off" />
      <button class="chat-send" id="chatSend">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4 20-7z"/></svg>
      </button>
    </div>
  `;

  document.body.appendChild(launcher);
  document.body.appendChild(panel);

  const messagesEl = panel.querySelector('#chatMessages');
  const inputEl = panel.querySelector('#chatInput');
  const sendBtn = panel.querySelector('#chatSend');
  const suggestionsEl = panel.querySelector('#chatSuggestions');

  function renderMessages() {
    messagesEl.innerHTML = '';
    state.messages.forEach((m) => {
      const bubble = el('div', `msg ${m.role === 'user' ? 'user' : 'bot'}`, escapeHtml(m.content));
      messagesEl.appendChild(bubble);
    });
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function escapeHtml(str) {
    const d = document.createElement('div');
    d.innerText = str;
    return d.innerHTML;
  }

  function showTyping() {
    const t = el('div', 'msg bot typing', '<span></span><span></span><span></span>');
    t.id = 'typingIndicator';
    messagesEl.appendChild(t);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function hideTyping() {
    const t = document.getElementById('typingIndicator');
    if (t) t.remove();
  }

  function openPanel() {
    state.open = true;
    panel.classList.add('open');
    renderMessages();
    setTimeout(() => inputEl.focus(), 300);
  }

  function togglePanel() {
    state.open ? closePanel() : openPanel();
  }

  function closePanel() {
    state.open = false;
    panel.classList.remove('open');
  }

  launcher.addEventListener('click', togglePanel);

  async function sendMessage(text) {
    if (!text.trim()) return;
    state.messages.push({ role: 'user', content: text });
    renderMessages();
    inputEl.value = '';
    suggestionsEl.style.display = 'none';
    showTyping();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: state.messages }),
      });
      const data = await res.json();
      hideTyping();
      state.messages.push({ role: 'assistant', content: data.reply });
      renderMessages();

      if (data.lead && (data.lead.phone || data.lead.email || data.lead.name || data.lead.qualified) && !state.leadCaptured) {
        state.leadCaptured = true;
        broadcastLead(data.lead);
      }
    } catch (err) {
      hideTyping();
      state.messages.push({
        role: 'assistant',
        content: "Sorry, I'm having trouble connecting right now. Please call us at +91 78386 53501.",
      });
      renderMessages();
    }
  }

  function broadcastLead(lead) {
    const record = {
      id: Date.now(),
      name: lead.name || '',
      phone: lead.phone || '',
      email: lead.email || '',
      source: 'Website Chatbot',
      time: new Date().toISOString(),
      transcript: state.messages.slice(-6),
    };
    const existing = JSON.parse(localStorage.getItem('interioarty_leads') || '[]');
    existing.unshift(record);
    localStorage.setItem('interioarty_leads', JSON.stringify(existing));
    if (bc) bc.postMessage(record);
  }

  sendBtn.addEventListener('click', () => sendMessage(inputEl.value));
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage(inputEl.value);
  });
  suggestionsEl.querySelectorAll('.chip').forEach((chip) => {
    chip.addEventListener('click', () => sendMessage(chip.dataset.q));
  });

  window.ArtyChat = {
    open: (prefill) => {
      openPanel();
      if (prefill) {
        inputEl.value = prefill;
      }
    },
  };
})();
