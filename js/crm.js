(function () {
  const CHANNEL_NAME = 'interioarty-leads';
  const bc = 'BroadcastChannel' in window ? new BroadcastChannel(CHANNEL_NAME) : null;
  const listEl = document.getElementById('leadList');
  const toastEl = document.getElementById('toast');
  const statTotal = document.getElementById('statTotal');
  const statToday = document.getElementById('statToday');

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

  function render() {
    const leads = getLeads();
    statTotal.textContent = leads.length;
    const todayCount = leads.filter((l) => new Date(l.time).toDateString() === new Date().toDateString()).length;
    statToday.textContent = todayCount;

    if (!leads.length) {
      listEl.innerHTML = `<div class="empty-state"><b>No leads yet</b>Open the website chatbot and have a quick conversation — qualified leads will appear here instantly.</div>`;
      return;
    }

    listEl.innerHTML = leads
      .map(
        (l) => `
      <div class="lead-row">
        <div class="lead-field"><label>Contact</label><span>${l.phone || l.email || 'Unknown'}</span></div>
        <div class="lead-field"><label>Source</label><span>${l.source}</span></div>
        <div class="lead-field"><label>Captured</label><span>${timeAgo(l.time)}</span></div>
        <div class="lead-badge">New Lead</div>
      </div>`
      )
      .join('');
  }

  function showToast() {
    toastEl.classList.add('show');
    setTimeout(() => toastEl.classList.remove('show'), 3000);
  }

  if (bc) {
    bc.onmessage = () => {
      render();
      showToast();
    };
  }

  window.addEventListener('storage', (e) => {
    if (e.key === 'interioarty_leads') render();
  });

  render();
  setInterval(render, 5000);
})();
