// ── WHIMS GAMES TRACKER — Supabase edition ──
const _SUPA_URL = 'https://rjrnqiklifurcqzvavtt.supabase.co';
const _SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqcm5xaWtsaWZ1cmNxenZhdnR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0OTQ5OTEsImV4cCI6MjA4ODA3MDk5MX0.4DXwtSUQ7yA2aH-N2bEnobSi2gRbFw0BANdfgSfROx0';

// Unique per tab (sessionStorage resets when tab closes)
const _TAB_ID = sessionStorage.getItem('wg_tab') || (() => {
  const id = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  sessionStorage.setItem('wg_tab', id); return id;
})();

const HEARTBEAT_MS = 5000;
let _currentPage = 'home';

async function _supaFetch(method, body) {
  try {
    await fetch(`${_SUPA_URL}/rest/v1/players`, {
      method,
      headers: {
        'apikey': _SUPA_KEY,
        'Authorization': `Bearer ${_SUPA_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': method === 'POST' ? 'resolution=merge-duplicates' : ''
      },
      body: body ? JSON.stringify(body) : undefined
    });
  } catch {}
}

async function _heartbeat() {
  await _supaFetch('POST', {
    session_id: _TAB_ID,
    page: _currentPage,
    updated_at: new Date().toISOString()
  });
}

async function _removeSession() {
  try {
    await fetch(`${_SUPA_URL}/rest/v1/players?session_id=eq.${_TAB_ID}`, {
      method: 'DELETE',
      headers: { 'apikey': _SUPA_KEY, 'Authorization': `Bearer ${_SUPA_KEY}` }
    });
  } catch {}
}

async function _fetchPlayers() {
  try {
    const res = await fetch(`${_SUPA_URL}/rest/v1/players?select=page`, {
      headers: { 'apikey': _SUPA_KEY, 'Authorization': `Bearer ${_SUPA_KEY}` }
    });
    return await res.json();
  } catch { return []; }
}

function trackPage(page) {
  _currentPage = page;
  _heartbeat();
  setInterval(_heartbeat, HEARTBEAT_MS);
  window.addEventListener('beforeunload', _removeSession);
  window.addEventListener('focus', _heartbeat);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) _heartbeat(); });
}

async function getTotalCount() {
  const rows = await _fetchPlayers();
  return rows.length;
}

async function getPageCount(page) {
  const rows = await _fetchPlayers();
  return rows.filter(r => r.page === page).length;
}

// ── LIVE COUNT HELPERS ──
// Call these to auto-update an element with total or page count
function startTotalCounter(elementId) {
  async function update() {
    const el = document.getElementById(elementId);
    if (!el) return;
    const count = await getTotalCount();
    el.textContent = `${count} ${count === 1 ? 'person' : 'people'} playing`;
  }
  update();
  setInterval(update, HEARTBEAT_MS);
}

function startPageCounter(page, elementId) {
  async function update() {
    const el = document.getElementById(elementId);
    if (!el) return;
    const c = await getPageCount(page);
    el.textContent = c > 0 ? `· ${c} playing` : '';
  }
  update();
  setInterval(update, HEARTBEAT_MS);
}

// ── KEYBIND HELPER ──
function getKB(key) {
  try { return JSON.parse(localStorage.getItem('wg_kb_' + key)); } catch { return null; }
}
function kbLabel(kb) {
  const p = [];
  if (kb.meta) p.push('⌘');
  if (kb.ctrl) p.push('Ctrl');
  if (kb.shift) p.push('Shift');
  p.push(kb.key.toUpperCase());
  return p.join('+');
}

function initGlobalKeybinds(onTools, onGames) {
  function checkKeys(e) {
    const toTools = getKB('toTools') || { key: 'k', ctrl: true, meta: false, shift: false };
    const toGames = getKB('toGames') || { key: 'k', ctrl: true, meta: false, shift: false };
    const match = (kb) => e.key.toLowerCase() === kb.key.toLowerCase()
      && !!e.ctrlKey === !!kb.ctrl && !!e.metaKey === !!kb.meta && !!e.shiftKey === !!kb.shift;
    if (onTools && match(toTools)) { e.preventDefault(); onTools(); }
    else if (onGames && match(toGames)) { e.preventDefault(); onGames(); }
  }
  window.addEventListener('keydown', checkKeys);
  // Inject into iframes too
  setInterval(() => {
    document.querySelectorAll('iframe').forEach(fr => {
      try {
        if (fr._wgKbBound) return;
        fr._wgKbBound = true;
        fr.contentWindow.addEventListener('keydown', checkKeys);
      } catch {}
    });
  }, 500);
}

// ── FUNNY MODE (1/10 chance) ──
function checkFunnyMode() {
  if (localStorage.getItem('wg_funny') !== 'true') return;
  if (Math.random() < 0.1) {
    const div = document.createElement('div');
    div.style.cssText = 'position:fixed;inset:0;background:#fff;z-index:9999999;opacity:0;transition:opacity 0.04s;pointer-events:all;';
    document.body.appendChild(div);
    requestAnimationFrame(() => {
      div.style.opacity = '1';
      setTimeout(() => {
        div.style.transition = 'opacity 1.8s ease-out';
        div.style.opacity = '0';
        setTimeout(() => div.remove(), 1900);
      }, 80);
    });
  }
}

// ── FLOATING SETTINGS BUTTON ──
function injectSettingsBtn() {
  const btn = document.createElement('a');
  btn.href = 'settings.html';
  btn.title = 'Settings';
  btn.style.cssText = `position:fixed;bottom:20px;right:20px;z-index:9000;width:40px;height:40px;border-radius:10px;background:#111;border:1px solid #222;display:flex;align-items:center;justify-content:center;font-size:1rem;text-decoration:none;transition:border-color 0.2s,transform 0.2s;box-shadow:0 4px 20px rgba(0,0,0,0.5);`;
  btn.textContent = '⚙';
  btn.addEventListener('mouseenter', () => { btn.style.borderColor = 'rgba(61,220,132,0.5)'; btn.style.transform = 'scale(1.1)'; });
  btn.addEventListener('mouseleave', () => { btn.style.borderColor = '#222'; btn.style.transform = 'scale(1)'; });
  document.body.appendChild(btn);
}