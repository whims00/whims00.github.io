// ── AUTH.JS — Whims Games ──
const SUPA_URL = 'https://rjrnqiklifurcqzvavtt.supabase.co';
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqcm5xaWtsaWZ1cmNxenZhdnR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0OTQ5OTEsImV4cCI6MjA4ODA3MDk5MX0.4DXwtSUQ7yA2aH-N2bEnobSi2gRbFw0BANdfgSfROx0';

async function loadSupabase() {
  if (window._supa) return window._supa;
  await new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
    s.onload = res; s.onerror = rej;
    document.head.appendChild(s);
  });
  window._supa = window.supabase.createClient(SUPA_URL, SUPA_KEY);
  return window._supa;
}

async function getSession() {
  const sb = await loadSupabase();
  const { data } = await sb.auth.getSession();
  return data.session;
}

async function getProfile(userId) {
  const sb = await loadSupabase();
  const { data } = await sb.from('profiles').select('*').eq('id', userId).single();
  return data;
}

// ── SHARED STYLES ──
const _S = {
  pill: 'display:flex;align-items:center;gap:8px;background:#181818;border:1px solid #222;padding:5px 12px 5px 5px;border-radius:30px;text-decoration:none;color:#f0f0f0;transition:border-color 0.15s;cursor:pointer;font-family:"DM Sans",sans-serif;',
  btn: (bg, fg) => `display:inline-flex;align-items:center;gap:5px;background:${bg};color:${fg};font-family:"DM Sans",sans-serif;font-size:0.75rem;font-weight:700;padding:6px 14px;border-radius:9px;text-decoration:none;border:none;cursor:pointer;transition:opacity 0.15s;white-space:nowrap;`,
  link: 'display:flex;align-items:center;gap:5px;font-family:"DM Sans",sans-serif;font-size:0.75rem;font-weight:600;padding:6px 12px;border-radius:9px;text-decoration:none;transition:all 0.15s;white-space:nowrap;',
};

async function injectAuthNav(headerEl) {
  if (!headerEl) return;
  const sb = await loadSupabase();
  const { data: { session } } = await sb.auth.getSession();

  const nav = document.createElement('div');
  nav.style.cssText = 'display:flex;align-items:center;gap:8px;';

  // ── Casino link ──
  const casino = document.createElement('a');
  casino.href = 'luck.html';
  casino.style.cssText = _S.link + 'background:rgba(245,197,66,0.08);border:1px solid rgba(245,197,66,0.2);color:#f5c542;';
  casino.textContent = '🎰 Casino';
  casino.onmouseenter = () => casino.style.background = 'rgba(245,197,66,0.14)';
  casino.onmouseleave = () => casino.style.background = 'rgba(245,197,66,0.08)';
  nav.appendChild(casino);

  // ── Settings link ──
  const settings = document.createElement('a');
  settings.href = 'settings.html';
  settings.style.cssText = _S.link + 'background:#181818;border:1px solid #222;color:#666;';
  settings.textContent = '⚙';
  settings.title = 'Settings';
  settings.onmouseenter = () => { settings.style.borderColor = 'rgba(61,220,132,0.35)'; settings.style.color = '#f0f0f0'; };
  settings.onmouseleave = () => { settings.style.borderColor = '#222'; settings.style.color = '#666'; };
  nav.appendChild(settings);

  if (session) {
    const user = session.user;
    const emailVerified = user.email_confirmed_at || user.confirmed_at;

    // ── Unverified warning banner ──
    if (!emailVerified) {
      const banner = document.createElement('div');
      banner.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:9999;background:#1a1400;border-bottom:1px solid rgba(245,197,66,0.3);padding:10px 20px;display:flex;align-items:center;justify-content:center;gap:12px;font-family:"DM Sans",sans-serif;font-size:0.8rem;color:#f5c542;';
      banner.innerHTML = `<span>⚠️ Please verify your email to access all features.</span>`;

      const resendBtn = document.createElement('button');
      resendBtn.textContent = 'Resend email';
      resendBtn.style.cssText = _S.btn('rgba(245,197,66,0.15)', '#f5c542') + 'border:1px solid rgba(245,197,66,0.3);font-size:0.72rem;padding:4px 12px;';
      resendBtn.onclick = async () => {
        resendBtn.disabled = true;
        resendBtn.textContent = 'Sending…';
        const { error } = await sb.auth.resend({ type: 'signup', email: user.email });
        resendBtn.textContent = error ? 'Error — try again' : '✓ Sent!';
        if (!error) setTimeout(() => { resendBtn.disabled = false; resendBtn.textContent = 'Resend email'; }, 30000);
      };
      banner.appendChild(resendBtn);

      const signOutBanner = document.createElement('button');
      signOutBanner.textContent = 'Sign out';
      signOutBanner.style.cssText = _S.btn('transparent', '#777') + 'font-size:0.72rem;padding:4px 10px;';
      signOutBanner.onclick = async () => { await sb.auth.signOut(); location.reload(); };
      banner.appendChild(signOutBanner);

      document.body.appendChild(banner);
      // Push page content down so banner doesn't overlap header
      document.body.style.paddingTop = '41px';
    }

    // ── Profile pill ──
    const profile = await getProfile(user.id);
    const pill = document.createElement('a');
    pill.href = 'profile.html';
    pill.style.cssText = _S.pill;
    pill.onmouseenter = () => pill.style.borderColor = 'rgba(61,220,132,0.35)';
    pill.onmouseleave = () => pill.style.borderColor = '#222';

    const avatar = document.createElement('div');
    avatar.style.cssText = 'width:26px;height:26px;border-radius:50%;background:#222;overflow:hidden;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:0.75rem;color:#3ddc84;font-weight:700;';
    if (profile?.avatar_url) {
      avatar.innerHTML = `<img src="${profile.avatar_url}" style="width:100%;height:100%;object-fit:cover;">`;
    } else {
      avatar.textContent = (profile?.display_name || profile?.username || user.email || '?')[0].toUpperCase();
    }

    const nameEl = document.createElement('span');
    nameEl.style.cssText = 'font-size:0.78rem;font-weight:600;max-width:100px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;';
    nameEl.textContent = profile?.display_name || profile?.username || 'Profile';

    // Unverified badge on pill
    if (!emailVerified) {
      const dot = document.createElement('span');
      dot.style.cssText = 'width:7px;height:7px;border-radius:50%;background:#f5c542;flex-shrink:0;';
      dot.title = 'Email not verified';
      pill.appendChild(dot);
    }

    pill.appendChild(avatar);
    pill.appendChild(nameEl);
    nav.appendChild(pill);

    // ── Sign out button ──
    const signOut = document.createElement('button');
    signOut.textContent = 'Sign out';
    signOut.style.cssText = _S.link + 'background:#181818;border:1px solid #222;color:#666;cursor:pointer;';
    signOut.onmouseenter = () => { signOut.style.borderColor = 'rgba(255,80,80,0.35)'; signOut.style.color = '#ff5050'; };
    signOut.onmouseleave = () => { signOut.style.borderColor = '#222'; signOut.style.color = '#666'; };
    signOut.onclick = async () => {
      signOut.textContent = '…';
      await sb.auth.signOut();
      location.reload();
    };
    nav.appendChild(signOut);

  } else {
    // ── Not logged in: Sign Up + Sign In ──
    const signUp = document.createElement('a');
    signUp.href = 'login.html';
    signUp.style.cssText = _S.link + 'background:transparent;border:1px solid #333;color:#aaa;';
    signUp.textContent = 'Sign up';
    signUp.onmouseenter = () => { signUp.style.borderColor = 'rgba(61,220,132,0.4)'; signUp.style.color = '#f0f0f0'; };
    signUp.onmouseleave = () => { signUp.style.borderColor = '#333'; signUp.style.color = '#aaa'; };
    nav.appendChild(signUp);

    const signIn = document.createElement('a');
    signIn.href = 'login.html';
    signIn.style.cssText = _S.btn('#3ddc84', '#000');
    signIn.textContent = 'Sign in';
    signIn.onmouseenter = () => signIn.style.opacity = '0.85';
    signIn.onmouseleave = () => signIn.style.opacity = '1';
    nav.appendChild(signIn);
  }

  headerEl.appendChild(nav);
}