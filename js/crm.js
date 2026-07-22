(function () {
  const CHANNEL_NAME = 'interioarty-leads';
  const bc = 'BroadcastChannel' in window ? new BroadcastChannel(CHANNEL_NAME) : null;
  const listEl = document.getElementById('leadList');
  const toastEl = document.getElementById('toast');
  const statTotal = document.getElementById('statTotal');
  const statToday = document.getElementById('statToday');
  const openIds = new Set();

  function getLeads() {
    return JSON.parse(localStorage.getItem('interioarty_leads') || '[]');
  }

  function timeAgo(iso) {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    return `${Math.floor(mins / 60)}h ago`;
  }

  function escapeHtml(str) {
    const d = document.createElement('div');
    d.innerText = str || '';
    return d.innerHTML;
  }

  function specRow(lead) {
    const parts = [];
    if (lead.projectType) parts.push(lead.projectType);
    if (lead.bhk) parts.push(lead.bhk);
    if (lead.budget) parts.push(lead.budget);
    if (lead.timeline) parts.push(lead.timeline);
    if (!parts.length) return '';
    return `<div class="detail-specs">${parts.map((p) => `<span class="dim">${escapeHtml(p)}</span>`).join('')}</div>`;
  }

  function transcriptHtml(lead) {
    return (lead.transcript || [])
      .map(
        (m) => `
      <div class="t-msg ${m.role === 'user' ? 'user' : 'bot'}">
        <span class="t-role">${m.role === 'user' ? 'Visitor' : 'Arty'}</span>
        ${escapeHtml(m.content)}
      </div>`
      )
      .join('');
  }

  function render() {
    const leads = getLeads();
    statTotal.textContent = leads.length;
    const todayCount = leads.filter((l) => new Date(l.time).toDateString() === new Date().toDateString()).length;
    statToday.textContent = todayCount;

    if (!leads.length) {
      listEl.innerHTML = `<div class="empty-state"><b>No leads yet</b>Open the website chatbot and have a quick conversation — qualified leads will appear here instantly, with an AI summary attached.</div>`;
      return;
    }

    listEl.innerHTML = leads
      .map((l) => {
        const isOpen = openIds.has(l.id);
        return `
      <div class="lead-card ${isOpen ? 'open' : ''}" data-id="${l.id}">
        <div class="lead-row" data-toggle="${l.id}">
          <div class="lead-field"><label>Name</label><span>${escapeHtml(l.name) || '—'}</span></div>
          <div class="lead-field"><label>Contact</label><span>${escapeHtml(l.phone || l.email) || '—'}</span></div>
          <div class="lead-field"><label>Project</label><span>${escapeHtml(l.projectType) || '—'}</span></div>
          <div class="lead-field"><label>Captured</label><span>${timeAgo(l.time)}</span></div>
          <div class="lead-badge ${l.summarizing ? 'pending' : ''}">${l.summarizing ? 'Summarizing…' : 'AI Summarized'}</div>
          <div class="lead-chevron">→</div>
        </div>
        <div class="lead-detail">
          <div class="lead-detail-inner">
            <div class="detail-block">
              <label>AI Summary</label>
              <p class="summary-text">${escapeHtml(l.summary) || (l.summarizing ? 'Analyzing conversation…' : 'No summary available.')}</p>
              ${specRow(l)}
            </div>
            <div class="detail-block">
              <label>Transcript</label>
              <div class="transcript">${transcriptHtml(l)}</div>
            </div>
          </div>
        </div>
      </div>`;
      })
      .join('');

    listEl.querySelectorAll('[data-toggle]').forEach((row) => {
      row.addEventListener('click', () => {
        const id = Number(row.dataset.toggle);
        if (openIds.has(id)) openIds.delete(id);
        else openIds.add(id);
        render();
      });
    });
  }

  function showToast() {
    toastEl.classList.add('show');
    setTimeout(() => toastEl.classList.remove('show'), 3000);
  }

  if (bc) {
    bc.onmessage = (e) => {
      const wasNew = e.data && e.data.summarizing === true;
      render();
      if (wasNew) showToast();
    };
  }

  window.addEventListener('storage', (e) => {
    if (e.key === 'interioarty_leads') render();
  });

  render();
  setInterval(render, 5000);
})();
