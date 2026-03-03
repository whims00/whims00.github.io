// ── WHIMS GAMES SHARED TRACKER ──
const _WG_SID = localStorage.getItem('wg_sid') || (() => {
  const id = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  localStorage.setItem('wg_sid', id); return id;
})();
const SESSION_KEY = 'wg_sess_' + _WG_SID;
const HEARTBEAT_MS = 3000;
const EXPIRE_MS = 10000;
let _currentPage = 'home';

function trackPage(page) {
  _currentPage = page;
  _heartbeat();
  setInterval(_heartbeat, HEARTBEAT_MS);
  window.addEventListener('beforeunload', _removeSession);
  // Re-heartbeat when iframe loses focus back to us
  window.addEventListener('focus', _heartbeat);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) _heartbeat(); });
}

function _heartbeat() {
  try {
    const all = JSON.parse(localStorage.getItem('wg_players') || '{}');
    const now = Date.now();
    all[SESSION_KEY] = { t: now, page: _currentPage };
    for (const k of Object.keys(all)) { if (now - all[k].t > EXPIRE_MS) delete all[k]; }
    localStorage.setItem('wg_players', JSON.stringify(all));
  } catch {}
}

function _removeSession() {
  try {
    const all = JSON.parse(localStorage.getItem('wg_players') || '{}');
    delete all[SESSION_KEY];
    localStorage.setItem('wg_players', JSON.stringify(all));
  } catch {}
}

function getActivePlayers() {
  try {
    const all = JSON.parse(localStorage.getItem('wg_players') || '{}');
    const now = Date.now();
    const active = {};
    for (const [k, v] of Object.entries(all)) { if (now - v.t < EXPIRE_MS) active[k] = v; }
    return active;
  } catch { return {}; }
}

function getTotalCount() { return Object.keys(getActivePlayers()).length; }
function getPageCount(page) { return Object.values(getActivePlayers()).filter(v => v.page === page).length; }

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

// ── GLOBAL KEYBIND LISTENER (works even when iframe is focused via blur/focus polling) ──
// We use a BroadcastChannel trick + repeated interval to detect keypresses
// The real fix: listen on the window AND use a visibility/focus trick
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

  // Iframe focus workaround: blur the iframe when keybind is pressed
  // We check every 200ms if an iframe has focus and set up a listener on it
  setInterval(() => {
    try {
      const frames = document.querySelectorAll('iframe');
      frames.forEach(fr => {
        try {
          if (fr._wgKbBound) return;
          fr._wgKbBound = true;
          fr.contentWindow.addEventListener('keydown', checkKeys);
        } catch {}
      });
    } catch {}
  }, 500);
}

// ── FUNNY MODE ──
function checkFunnyMode() {
  if (localStorage.getItem('wg_funny') !== 'true') return;
  if (Math.random() < 0.1) { // 1/10
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

// ── SETTINGS BUTTON INJECTOR ──
// Call this to auto-inject a floating settings button on any page
function injectSettingsBtn() {
  const btn = document.createElement('a');
  btn.href = 'settings.html';
  btn.title = 'Settings';
  btn.style.cssText = `
    position: fixed; bottom: 20px; right: 20px; z-index: 9000;
    width: 40px; height: 40px; border-radius: 10px;
    background: #111; border: 1px solid #222;
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem; text-decoration: none;
    transition: border-color 0.2s, transform 0.2s;
    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
  `;
  btn.textContent = '⚙';
  btn.addEventListener('mouseenter', () => { btn.style.borderColor = 'rgba(61,220,132,0.5)'; btn.style.transform = 'scale(1.1)'; });
  btn.addEventListener('mouseleave', () => { btn.style.borderColor = '#222'; btn.style.transform = 'scale(1)'; });
  document.body.appendChild(btn);
}