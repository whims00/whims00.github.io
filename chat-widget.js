<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Chat — Whims Games</title>
  <link rel="icon" type="image/svg+xml" href="icon.svg"/>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet"/>
  <style>
    :root {
      --black:#080808;--surface:#111;--surface2:#181818;--surface3:#1e1e1e;
      --border:#222;--border2:#2a2a2a;--green:#3ddc84;--green-dim:#2ab86a;
      --green-glow:rgba(61,220,132,0.12);--green-glow2:rgba(61,220,132,0.06);
      --text:#f0f0f0;--muted:#666;--muted2:#444;--sidebar-w:260px;--header-h:52px;
    }
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html,body{height:100%;overflow:hidden}
    body{background:var(--black);color:var(--text);font-family:'DM Sans',sans-serif;font-size:14px;display:flex;flex-direction:column}
    /* NAV */
    .topnav{height:var(--header-h);background:rgba(8,8,8,.97);border-bottom:1px solid var(--border);display:flex;align-items:center;padding:0 18px;gap:16px;flex-shrink:0;z-index:50;backdrop-filter:blur(12px)}
    .topnav-logo{font-family:'Syne',sans-serif;font-weight:800;font-size:1.1rem;letter-spacing:-.5px;text-decoration:none;color:var(--text)}
    .topnav-logo span{color:var(--green)}
    .topnav-sep{width:1px;height:20px;background:var(--border2)}
    .topnav-title{font-weight:600;font-size:.9rem}
    .topnav-actions{margin-left:auto;display:flex;align-items:center;gap:8px}
    .online-count{display:flex;align-items:center;gap:5px;font-size:11px;color:var(--muted)}
    .online-dot{width:6px;height:6px;border-radius:50%;background:var(--green);box-shadow:0 0 5px var(--green)}
    /* LAYOUT */
    .chat-layout{display:flex;flex:1;overflow:hidden}
    /* SIDEBAR */
    .sidebar{width:var(--sidebar-w);background:var(--surface);border-right:1px solid var(--border);display:flex;flex-direction:column;flex-shrink:0;overflow:hidden}
    .sidebar-search{padding:12px;border-bottom:1px solid var(--border)}
    .sidebar-search-wrap{position:relative}
    .sidebar-search-wrap .si{position:absolute;left:9px;top:50%;transform:translateY(-50%);color:var(--muted);font-size:13px;pointer-events:none}
    .sidebar-search input{width:100%;background:var(--surface2);border:1px solid var(--border2);border-radius:8px;padding:7px 12px 7px 30px;color:var(--text);font-size:13px;font-family:inherit;outline:none;transition:border-color .15s}
    .sidebar-search input:focus{border-color:var(--green)}
    .sidebar-search input::placeholder{color:var(--muted)}
    .sidebar-sections{flex:1;overflow-y:auto;padding-bottom:8px}
    .sidebar-sections::-webkit-scrollbar{width:3px}
    .sidebar-sections::-webkit-scrollbar-thumb{background:var(--border2);border-radius:2px}
    .sec-header{display:flex;align-items:center;justify-content:space-between;padding:16px 12px 6px;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:var(--muted)}
    .sec-header button{width:18px;height:18px;background:none;border:none;color:var(--muted);cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;border-radius:4px;transition:all .1s}
    .sec-header button:hover{background:var(--surface3);color:var(--green)}
    .ch-item{display:flex;align-items:center;gap:9px;padding:6px 10px;margin:1px 6px;border-radius:8px;cursor:pointer;transition:background .1s;position:relative}
    .ch-item:hover{background:var(--surface2)}
    .ch-item.active{background:var(--green-glow2)}
    .ch-item.active .ch-name{color:var(--green)}
    .ch-icon{width:30px;height:30px;border-radius:8px;background:var(--surface2);display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;border:1px solid var(--border)}
    .ch-item.active .ch-icon{border-color:rgba(61,220,132,.3);background:var(--green-glow)}
    .ch-info{flex:1;min-width:0}
    .ch-name{font-size:13px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .ch-preview{font-size:11px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:1px}
    .ch-badge{background:var(--green);color:#000;font-size:9px;font-weight:700;padding:1px 5px;border-radius:10px;min-width:16px;text-align:center;display:none}
    .dm-avatar{width:30px;height:30px;border-radius:50%;background:var(--surface3);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;flex-shrink:0;position:relative;border:1px solid var(--border)}
    .dm-status{position:absolute;bottom:-1px;right:-1px;width:9px;height:9px;border-radius:50%;border:2px solid var(--surface);background:var(--green)}
    .sidebar-footer{border-top:1px solid var(--border);padding:10px 12px;display:flex;align-items:center;gap:10px}
    .self-avatar{width:32px;height:32px;border-radius:50%;background:var(--green-glow);border:1px solid rgba(61,220,132,.3);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;color:var(--green);flex-shrink:0;cursor:pointer}
    .self-info{flex:1;min-width:0}
    .self-name{font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .self-status{font-size:11px;color:var(--green)}
    /* MAIN */
    .chat-main{flex:1;display:flex;flex-direction:column;overflow:hidden;background:var(--black)}
    .chat-header{height:var(--header-h);border-bottom:1px solid var(--border);display:flex;align-items:center;padding:0 18px;gap:12px;flex-shrink:0;background:rgba(8,8,8,.9)}
    .chat-header-icon{font-size:18px}
    .chat-header-name{font-family:'Syne',sans-serif;font-weight:700;font-size:.95rem}
    .chat-header-desc{font-size:12px;color:var(--muted);padding-left:12px;border-left:1px solid var(--border2)}
    .chat-header-actions{margin-left:auto;display:flex;gap:8px}
    .hbtn{width:32px;height:32px;border-radius:8px;border:1px solid var(--border);background:var(--surface2);color:var(--muted);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:15px;transition:all .15s}
    .hbtn:hover{background:var(--surface3);color:var(--text)}
    /* MESSAGES */
    .messages-wrap{flex:1;overflow-y:auto;padding:16px 0 8px;display:flex;flex-direction:column;gap:0}
    .messages-wrap::-webkit-scrollbar{width:4px}
    .messages-wrap::-webkit-scrollbar-thumb{background:var(--border2);border-radius:2px}
    .msg-row{display:flex;gap:16px;padding:2px 16px;border-radius:4px;transition:background .08s;position:relative;margin:0}
    .msg-row:hover{background:rgba(255,255,255,.025)}
    .msg-row.mention{background:rgba(61,220,132,.07);border-left:2px solid var(--green);padding-left:14px}
    .msg-row.continued .msg-header{display:none}
    .msg-row.continued .msg-av{visibility:hidden}
    .msg-av{width:40px;height:40px;border-radius:50%;background:var(--surface3);display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;flex-shrink:0;margin-top:2px;cursor:pointer;overflow:hidden;color:var(--green);transition:opacity .15s}
    .msg-av img{width:100%;height:100%;object-fit:cover;border-radius:50%;display:block}
    .msg-av:hover{opacity:.8}
    .msg-content{flex:1;min-width:0;padding-top:1px}
    .msg-header{display:flex;align-items:baseline;gap:8px;margin-bottom:3px}
    .msg-author{font-weight:600;font-size:14px;cursor:pointer;color:var(--text)}
    .msg-author:hover{text-decoration:underline}
    .msg-author.self{color:var(--green)}
    .msg-time{font-size:11px;color:var(--muted);margin-left:4px}
    .msg-text{font-size:13.5px;line-height:1.5;color:#d4d4d4;word-break:break-word}
    .msg-text .mtag{color:var(--green);font-weight:600;cursor:pointer}
    .msg-text .mtag:hover{text-decoration:underline}
    .msg-deleted{color:var(--muted)!important;font-style:italic}
    .msg-edited{font-size:10px;color:var(--muted);font-style:italic}
    .msg-gif{max-width:280px;border-radius:10px;overflow:hidden;margin-top:4px;border:1px solid var(--border)}
    .msg-gif img{width:100%;display:block}
    .msg-reactions{display:flex;flex-wrap:wrap;gap:4px;margin-top:4px}
    .rpill{background:var(--surface2);border:1px solid var(--border2);border-radius:20px;padding:2px 7px;font-size:12px;cursor:pointer;transition:all .1s;display:flex;align-items:center;gap:4px}
    .rpill:hover,.rpill.mine{border-color:rgba(61,220,132,.4);background:var(--green-glow)}
    .rpill-count{font-size:11px;color:var(--muted)}
    .msg-actions{position:absolute;right:10px;top:-14px;background:var(--surface2);border:1px solid var(--border2);border-radius:8px;display:none;gap:2px;padding:3px;z-index:10}
    .msg-row:hover .msg-actions{display:flex}
    .mabtn{width:26px;height:26px;border-radius:5px;border:none;background:none;color:var(--muted);cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center;transition:all .1s}
    .mabtn:hover{background:var(--surface3);color:var(--text)}
    .mabtn.del:hover{color:#ff6b6b}
    .date-divider{display:flex;align-items:center;gap:10px;padding:12px 0 8px;font-size:11px;color:var(--muted);font-weight:600;text-transform:uppercase;letter-spacing:.06em}
    .date-divider::before,.date-divider::after{content:'';flex:1;height:1px;background:var(--border)}
    .typing-indicator{padding:4px 18px 6px;font-size:11px;color:var(--muted);min-height:22px;display:flex;align-items:center;gap:6px}
    .tdots{display:flex;gap:3px}
    .tdots span{width:4px;height:4px;border-radius:50%;background:var(--muted);animation:tb 1.2s infinite}
    .tdots span:nth-child(2){animation-delay:.2s}
    .tdots span:nth-child(3){animation-delay:.4s}
    @keyframes tb{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-4px)}}
    .empty-state{flex:1;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px;color:var(--muted)}
    .empty-state-icon{font-size:48px;opacity:.3}
    /* INPUT */
    .input-area{padding:8px 18px 14px;flex-shrink:0;position:relative}
    .input-box{background:var(--surface2);border:1px solid var(--border2);border-radius:12px;display:flex;flex-direction:column;overflow:hidden;transition:border-color .15s}
    .input-box:focus-within{border-color:rgba(61,220,132,.4)}
    .reply-preview{display:none;padding:8px 12px;border-bottom:1px solid var(--border);background:var(--surface3);font-size:12px;color:var(--muted);align-items:center;gap:8px}
    .reply-preview.show{display:flex}
    .reply-preview-text{flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .reply-preview-text strong{color:var(--green)}
    .reply-close{cursor:pointer;font-size:16px}
    .input-row{display:flex;align-items:flex-end;padding:10px 12px;gap:8px}
    .input-field{flex:1;background:none;border:none;outline:none;color:var(--text);font-family:'DM Sans',sans-serif;font-size:13.5px;resize:none;max-height:140px;line-height:1.5}
    .input-field::placeholder{color:var(--muted)}
    .input-actions{display:flex;align-items:center;gap:4px}
    .ibtn{width:30px;height:30px;border-radius:7px;border:none;background:none;color:var(--muted);cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;transition:all .15s;font-family:inherit;font-weight:700}
    .ibtn:hover{background:var(--surface3);color:var(--text)}
    .ibtn.gif:hover{color:var(--green)}
    .send-btn{width:32px;height:32px;border-radius:8px;border:none;background:var(--green);color:#000;cursor:pointer;font-size:15px;display:flex;align-items:center;justify-content:center;transition:all .15s;flex-shrink:0}
    .send-btn:hover{background:var(--green-dim);transform:scale(1.05)}
    .send-btn:disabled{background:var(--surface3);color:var(--muted);cursor:not-allowed;transform:none}
    /* GIF PICKER */
    .gif-picker{position:absolute;bottom:80px;right:18px;width:360px;max-height:400px;background:var(--surface);border:1px solid var(--border2);border-radius:14px;overflow:hidden;display:none;flex-direction:column;z-index:200;box-shadow:0 20px 60px rgba(0,0,0,.6)}
    .gif-picker.show{display:flex}
    .gif-search{padding:10px;border-bottom:1px solid var(--border)}
    .gif-search input{width:100%;background:var(--surface2);border:1px solid var(--border2);border-radius:8px;padding:6px 10px;color:var(--text);font-family:inherit;font-size:13px;outline:none}
    .gif-search input:focus{border-color:var(--green)}
    .gif-search input::placeholder{color:var(--muted)}
    .gif-grid{flex:1;overflow-y:auto;display:grid;grid-template-columns:1fr 1fr;gap:4px;padding:8px}
    .gif-grid::-webkit-scrollbar{width:3px}
    .gif-grid::-webkit-scrollbar-thumb{background:var(--border2)}
    .gif-item{border-radius:8px;overflow:hidden;cursor:pointer;aspect-ratio:16/9;background:var(--surface2);transition:transform .15s,opacity .15s}
    .gif-item:hover{transform:scale(1.03);opacity:.9}
    .gif-item img{width:100%;height:100%;object-fit:cover;display:block}
    .gif-msg{text-align:center;padding:20px;color:var(--muted);font-size:13px}
    /* MODALS */
    .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:500;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px)}
    .modal-overlay.show{display:flex}
    .modal{background:var(--surface);border:1px solid var(--border2);border-radius:16px;width:420px;max-width:95vw;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,.7)}
    .modal-header{padding:18px 20px 14px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
    .modal-title{font-family:'Syne',sans-serif;font-weight:700;font-size:1rem}
    .modal-close{width:28px;height:28px;border-radius:7px;border:none;background:var(--surface2);color:var(--muted);cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center}
    .modal-close:hover{background:var(--surface3);color:var(--text)}
    .modal-body{padding:16px 20px 20px;display:flex;flex-direction:column;gap:12px}
    .modal-label{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:var(--muted)}
    .modal-input{width:100%;background:var(--surface2);border:1px solid var(--border2);border-radius:9px;padding:10px 12px;color:var(--text);font-family:inherit;font-size:13px;outline:none;transition:border-color .15s}
    .modal-input:focus{border-color:var(--green)}
    .modal-input::placeholder{color:var(--muted)}
    .user-list{display:flex;flex-direction:column;gap:4px;max-height:180px;overflow-y:auto}
    .user-opt{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;cursor:pointer;transition:background .1s}
    .user-opt:hover{background:var(--surface2)}
    .user-opt.selected{background:var(--green-glow)}
    .user-opt-av{width:30px;height:30px;border-radius:50%;background:var(--surface3);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600}
    .user-opt-name{font-size:13px;font-weight:500;flex:1}
    .user-opt-check{color:var(--green);font-size:14px;display:none}
    .user-opt.selected .user-opt-check{display:block}
    .modal-btn{width:100%;padding:11px;background:var(--green);color:#000;border:none;border-radius:9px;font-family:inherit;font-size:13px;font-weight:600;cursor:pointer;transition:all .15s}
    .modal-btn:hover{background:var(--green-dim)}
    .modal-btn:disabled{background:var(--surface3);color:var(--muted);cursor:not-allowed}
    /* PROFILE POPUP */
    .profile-popup{position:fixed;background:var(--surface);border:1px solid var(--border2);border-radius:14px;width:240px;box-shadow:0 16px 50px rgba(0,0,0,.7);z-index:600;overflow:hidden;display:none}
    .profile-popup.show{display:block}
    .pp-banner{height:60px;background:linear-gradient(135deg,var(--green-glow),var(--surface3))}
    .pp-body{padding:0 14px 14px}
    .pp-avatar{width:52px;height:52px;border-radius:50%;background:var(--surface3);border:3px solid var(--surface);display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700;margin-top:-26px;margin-bottom:8px;color:var(--green);overflow:hidden}
    .pp-name{font-family:'Syne',sans-serif;font-weight:700;font-size:.95rem}
    .pp-username{font-size:12px;color:var(--muted);margin-bottom:8px}
    .pp-stats{display:flex;gap:12px;padding:8px 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border);margin-bottom:8px}
    .pp-stat{text-align:center;flex:1}
    .pp-stat-val{font-size:13px;font-weight:700;color:var(--text)}
    .pp-stat-label{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.06em}
    .pp-bio{font-size:12px;color:var(--muted);margin-bottom:10px;line-height:1.4}
    .pp-actions{display:flex;gap:6px}
    .pp-btn{flex:1;padding:7px;border-radius:8px;border:1px solid var(--border2);background:var(--surface2);color:var(--text);font-size:12px;font-weight:600;cursor:pointer;transition:all .15s;font-family:inherit}
    .pp-btn:hover{background:var(--surface3)}
    .pp-btn.primary{background:var(--green);color:#000;border-color:var(--green)}
    .pp-btn.primary:hover{background:var(--green-dim)}
    /* EDIT BOX */
    .edit-box{display:flex;flex-direction:column;gap:6px}
    .edit-input{background:var(--surface3);border:1px solid var(--green);border-radius:7px;padding:6px 10px;color:var(--text);font-family:inherit;font-size:13.5px;outline:none;width:100%}
    .edit-acts{display:flex;gap:6px}
    .edit-save,.edit-cancel{padding:3px 10px;border-radius:6px;border:none;font-family:inherit;font-size:11px;font-weight:600;cursor:pointer}
    .edit-save{background:var(--green);color:#000}
    .edit-cancel{background:var(--surface3);color:var(--muted)}
    /* TOAST */
    .notif-toast{position:fixed;top:64px;right:16px;background:var(--surface);border:1px solid var(--border2);border-left:3px solid var(--green);border-radius:10px;padding:12px 14px;max-width:300px;min-width:240px;box-shadow:0 8px 30px rgba(0,0,0,.5);z-index:1000;transform:translateX(120%);transition:transform .3s cubic-bezier(.34,1.56,.64,1);cursor:pointer}
    .notif-toast.show{transform:translateX(0)}
    .notif-toast-title{font-size:12px;font-weight:600;color:var(--green);margin-bottom:3px}
    .notif-toast-body{font-size:12px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    /* AUTH */
    .auth-overlay{position:fixed;inset:0;background:var(--black);z-index:999;display:flex;align-items:center;justify-content:center}
    .auth-box{background:var(--surface);border:1px solid var(--border2);border-radius:16px;padding:32px;text-align:center;max-width:340px}
    .auth-box h2{font-family:'Syne',sans-serif;font-size:1.2rem;margin-bottom:10px}
    .auth-box p{color:var(--muted);font-size:13px;margin-bottom:20px}
    .auth-box a{display:inline-block;padding:10px 24px;background:var(--green);color:#000;border-radius:9px;font-weight:600;font-size:13px;text-decoration:none}

    /* @ MENTION AUTOCOMPLETE */
    .mention-dropdown{position:absolute;bottom:100%;left:0;right:0;background:var(--surface);border:1px solid var(--border2);border-radius:10px;overflow:hidden;box-shadow:0 -8px 30px rgba(0,0,0,.5);z-index:400;max-height:200px;overflow-y:auto;margin-bottom:4px}
    .mention-item{display:flex;align-items:center;gap:10px;padding:8px 12px;cursor:pointer;transition:background .1s}
    .mention-item:hover,.mention-item.active{background:var(--surface2)}
    .mention-av{width:28px;height:28px;border-radius:50%;background:var(--surface3);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;overflow:hidden;flex-shrink:0;color:var(--green)}
    .mention-av img{width:100%;height:100%;object-fit:cover;border-radius:50%}
    .mention-name{font-size:13px;font-weight:600}
    .mention-user{font-size:11px;color:var(--muted)}
    ::-webkit-scrollbar{width:4px}
    ::-webkit-scrollbar-thumb{background:var(--border2);border-radius:2px}
  </style>
</head>
<body>

<div class="auth-overlay" id="authOverlay" style="display:none">
  <div class="auth-box">
    <div style="font-size:40px;margin-bottom:12px">💬</div>
    <h2>Sign in to Chat</h2>
    <p>You need to be logged in to use chat.</p>
    <a href="login.html">Go to Login</a>
  </div>
</div>

<!-- Profile popup -->
<div class="profile-popup" id="profilePopup">
  <div class="pp-banner" id="ppBanner"></div>
  <div class="pp-body">
    <div class="pp-avatar" id="ppAvatar">?</div>
    <div class="pp-name" id="ppName">Username</div>
    <div class="pp-username" id="ppUsername">@username</div>
    <div class="pp-stats">
      <div class="pp-stat"><div class="pp-stat-val" id="ppElo">—</div><div class="pp-stat-label">ELO</div></div>
      <div class="pp-stat"><div class="pp-stat-val" id="ppWins">—</div><div class="pp-stat-label">Wins</div></div>
      <div class="pp-stat"><div class="pp-stat-val" id="ppGames">—</div><div class="pp-stat-label">Games</div></div>
    </div>
    <div class="pp-bio" id="ppBio"></div>
    <div class="pp-actions">
      <button class="pp-btn primary" id="ppDMBtn">💬 DM</button>
      <button class="pp-btn" onclick="closeProfilePopup()">Close</button>
    </div>
  </div>
</div>

<nav class="topnav">
  <a href="index.html" class="topnav-logo">Whims<span>.</span></a>
  <div class="topnav-sep"></div>
  <span class="topnav-title">Chat</span>
  <div class="topnav-actions">
    <div class="online-count"><div class="online-dot"></div><span id="onlineCount">0 online</span></div>
  </div>
</nav>

<div class="chat-layout">
  <div class="sidebar">
    <div class="sidebar-search">
      <div class="sidebar-search-wrap">
        <span class="si">🔍</span>
        <input type="text" placeholder="Search chats..."/>
      </div>
    </div>
    <div class="sidebar-sections">
      <div class="sec-header">Channels</div>
      <div class="ch-item active" data-channel="global" onclick="openChannel('global')">
        <div class="ch-icon">🌍</div>
        <div class="ch-info"><div class="ch-name"># global</div><div class="ch-preview">Everyone's welcome</div></div>
        <div class="ch-badge" id="globalBadge"></div>
      </div>
      <div class="sec-header">Direct Messages<button onclick="openNewDMModal()">＋</button></div>
      <div id="dmList"></div>
      <div class="sec-header">Group Chats<button onclick="openNewGroupModal()">＋</button></div>
      <div id="groupList"></div>
    </div>
    <div class="sidebar-footer">
      <div class="self-avatar" id="selfAvatar" onclick="openSelfProfile()">?</div>
      <div class="self-info">
        <div class="self-name" id="selfName">Loading...</div>
        <div class="self-status">● Online</div>
      </div>
    </div>
  </div>

  <div class="chat-main">
    <div class="chat-header">
      <span class="chat-header-icon" id="chatHeaderIcon">🌍</span>
      <span class="chat-header-name" id="chatHeaderName"># global</span>
      <span class="chat-header-desc" id="chatHeaderDesc">Everyone's welcome here</span>
      <div class="chat-header-actions">
        <button class="hbtn" title="Members" onclick="toggleMemberList()">👥</button>
      </div>
    </div>

    <div class="messages-wrap" id="messagesWrap">
      <div class="empty-state" id="emptyState">
        <div class="empty-state-icon">💬</div>
        <div style="font-size:14px;font-weight:500">No messages yet</div>
        <div style="font-size:12px">Be the first to say something!</div>
      </div>
    </div>

    <div class="typing-indicator" id="typingIndicator"></div>

    <div class="input-area">
      <div class="gif-picker" id="gifPicker">
        <div class="gif-search"><input type="text" placeholder="Search GIFs..." id="gifSearchInput"/></div>
        <div class="gif-grid" id="gifGrid"><div class="gif-msg">Search for GIFs ✨</div></div>
      </div>

      <div class="input-box">
        <div class="reply-preview" id="replyPreview">
          <span>↩️</span>
          <span class="reply-preview-text" id="replyPreviewText">Replying to...</span>
          <span class="reply-close" onclick="clearReply()">✕</span>
        </div>
        <div class="input-row">
          <textarea class="input-field" id="msgInput" placeholder="Message # global" rows="1"></textarea>
          <div class="input-actions">
            <button class="ibtn gif" id="gifBtn" title="GIF">GIF</button>
            <button class="ibtn" id="emojiBtn" title="Emoji">😄</button>
            <button class="send-btn" id="sendBtn" disabled>➤</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- New DM Modal -->
<div class="modal-overlay" id="newDMModal">
  <div class="modal">
    <div class="modal-header">
      <span class="modal-title">New Direct Message</span>
      <button class="modal-close" onclick="closeModal('newDMModal')">✕</button>
    </div>
    <div class="modal-body">
      <div class="modal-label">Search for a user</div>
      <input class="modal-input" type="text" placeholder="Username..." id="dmSearchInput" oninput="searchUsers(this.value,'dm')"/>
      <div class="user-list" id="dmUserList"></div>
      <button class="modal-btn" id="startDMBtn" onclick="startDM()" disabled>Open DM</button>
    </div>
  </div>
</div>

<!-- New Group Modal -->
<div class="modal-overlay" id="newGroupModal">
  <div class="modal">
    <div class="modal-header">
      <span class="modal-title">New Group Chat</span>
      <button class="modal-close" onclick="closeModal('newGroupModal')">✕</button>
    </div>
    <div class="modal-body">
      <div class="modal-label">Group Name</div>
      <input class="modal-input" type="text" placeholder="e.g. Chess Crew" id="groupNameInput"/>
      <div class="modal-label">Add Members</div>
      <input class="modal-input" type="text" placeholder="Search users..." id="groupSearchInput" oninput="searchUsers(this.value,'group')"/>
      <div class="user-list" id="groupUserList"></div>
      <button class="modal-btn" onclick="createGroup()">Create Group</button>
    </div>
  </div>
</div>

<div class="notif-toast" id="notifToast" onclick="handleNotifClick()">
  <div class="notif-toast-title" id="notifToastTitle"></div>
  <div class="notif-toast-body" id="notifToastBody"></div>
</div>

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script>
const SUPABASE_URL = 'https://rjrnqiklifurcqzvavtt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqcm5xaWtsaWZ1cmNxenZhdnR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0OTQ5OTEsImV4cCI6MjA4ODA3MDk5MX0.4DXwtSUQ7yA2aH-N2bEnobSi2gRbFw0BANdfgSfROx0';
const KLIPY_KEY = '1esoeTaV3xPf6ba26f07lLRLPvRxbD3ZjfGLKhxmE9Y2sHwwqyV9uBNRx15p8LOR';
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let currentUser = null, currentProfile = null;
let activeChannelType = 'global', activeChannelId = null, activeChannel = 'global';
let replyTo = null, editingMsgId = null;
let selectedDMUser = null, selectedGroupUsers = [];
let msgSub = null, typingTimeout = null;
let unreadCounts = {}, notifToastTimeout = null, pendingNotifChannel = null;

// ── INIT ──────────────────────────────────────────────────────────────
async function init() {
  const { data: { session } } = await sb.auth.getSession();
  if (!session) { document.getElementById('authOverlay').style.display = 'flex'; return; }
  currentUser = session.user;

  const { data: prof } = await sb.from('profiles').select('*').eq('id', currentUser.id).single();
  currentProfile = prof;

  const displayName = prof?.display_name || prof?.username || currentUser.email.split('@')[0];
  document.getElementById('selfName').textContent = displayName;
  document.getElementById('selfAvatar').textContent = displayName[0].toUpperCase();

  if (Notification.permission === 'default') Notification.requestPermission();

  await loadDMs();
  await loadGroups();
  await openChannel('global');
  updateOnlineCount();
  setInterval(updateOnlineCount, 30000);
  subscribeAllNotifications();
}

// ── OPEN CHANNEL ──────────────────────────────────────────────────────
async function openChannel(type, id = null, name = null) {
  document.querySelectorAll('.ch-item').forEach(el => el.classList.remove('active'));
  const key = id ? `${type}-${id}` : type;
  const el = document.querySelector(`[data-channel="${key}"]`);
  if (el) el.classList.add('active');

  activeChannelType = type;
  activeChannelId = id;
  activeChannel = key;

  const icons = { global: '🌍', dm: '💬', group: '👥' };
  document.getElementById('chatHeaderIcon').textContent = icons[type];
  document.getElementById('chatHeaderName').textContent = type === 'global' ? '# global' : type === 'dm' ? name || 'DM' : `# ${name || 'group'}`;
  document.getElementById('chatHeaderDesc').textContent = type === 'global' ? 'Everyone is welcome here' : type === 'dm' ? 'Direct Message' : 'Group Chat';
  document.getElementById('msgInput').placeholder = type === 'global' ? 'Message # global' : `Message ${name || 'chat'}...`;

  unreadCounts[activeChannel] = 0;
  updateBadge(activeChannel, 0);

  if (msgSub) { sb.removeChannel(msgSub); msgSub = null; }
  await loadMessages();
  subscribeMessages();
}

// ── LOAD MESSAGES ─────────────────────────────────────────────────────
async function loadMessages() {
  const wrap = document.getElementById('messagesWrap');
  wrap.innerHTML = '';

  let q = sb.from('chat_messages')
    .select('*, profiles!chat_messages_user_id_fkey(username, display_name, avatar_url, elo, wins, games_played, bio)')
    .order('created_at', { ascending: true })
    .limit(100);

  if (activeChannelType === 'global') q = q.eq('channel_type', 'global');
  else if (activeChannelType === 'dm') q = q.eq('channel_type', 'dm').eq('channel_id', activeChannelId);
  else q = q.eq('channel_type', 'group').eq('channel_id', activeChannelId);

  const { data: msgs, error } = await q;
  if (error) { console.error('loadMessages error:', error.message); showEmpty(); return; }
  if (!msgs || !msgs.length) { showEmpty(); return; }

  let prevId = null, prevDate = null;
  msgs.forEach(msg => {
    const d = new Date(msg.created_at).toDateString();
    if (d !== prevDate) {
      const div = document.createElement('div');
      div.className = 'date-divider';
      div.textContent = d === new Date().toDateString() ? 'Today' : d;
      wrap.appendChild(div);
      prevDate = d;
    }
    renderMsg(msg, msg.user_id === prevId);
    prevId = msg.user_id;
  });
  scrollBottom();
}

function showEmpty() {
  const wrap = document.getElementById('messagesWrap');
  wrap.innerHTML = '<div class="empty-state"><div class="empty-state-icon">💬</div><div style="font-size:14px;font-weight:500">No messages yet</div><div style="font-size:12px">Be the first to say something!</div></div>';
}

// ── RENDER MESSAGE ─────────────────────────────────────────────────────
function renderMsg(msg, continued) {
  const wrap = document.getElementById('messagesWrap');
  const isSelf = msg.user_id === currentUser.id;
  const prof = msg.profiles || {};
  const displayName = prof.display_name || prof.username || 'Unknown';
  const username = prof.username || 'unknown';
  const initial = displayName[0].toUpperCase();
  const time = new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const isMention = !isSelf && msg.content?.includes(`@${currentProfile?.username}`);

  const row = document.createElement('div');
  row.className = `msg-row${continued ? ' continued' : ''}${isMention ? ' mention' : ''}`;
  row.dataset.msgId = msg.id;
  row.dataset.userId = msg.user_id;

  let body = '';
  if (msg.deleted) {
    body = '<div class="msg-text msg-deleted">🗑 This message was deleted.</div>';
  } else if (msg.gif_url) {
    body = `<div class="msg-gif"><img src="${msg.gif_url}" loading="lazy"/></div>`;
  } else {
    const esc = escHtml(msg.content || '');
    const linked = esc.replace(/@(\w+)/g, '<span class="mtag">@$1</span>');
    body = `<div class="msg-text" id="mtext-${msg.id}">${linked}${msg.edited ? ' <span class="msg-edited">(edited)</span>' : ''}</div>`;
  }

  let actions = '';
  if (!msg.deleted) {
    actions = `<button class="mabtn" onclick="replyToMsg('${msg.id}','${escHtml(displayName)}')" title="Reply">↩</button>`;
    actions += `<button class="mabtn" onclick="showReactPicker('${msg.id}',this)" title="React">😊</button>`;
    if (isSelf) {
      actions += `<button class="mabtn" onclick="startEdit('${msg.id}')" title="Edit">✏️</button>`;
      actions += `<button class="mabtn del" onclick="deleteMsg('${msg.id}',!event.shiftKey)" title="Shift+click to delete instantly">🗑</button>`;
    }
  }

  const avatarHtml = prof.avatar_url
    ? `<img src="${prof.avatar_url}" alt="${escHtml(displayName)}"/>`
    : initial;

  row.innerHTML = `
    <div class="msg-av" onclick="showProfilePopup('${msg.user_id}',event)">${avatarHtml}</div>
    <div class="msg-content">
      <div class="msg-header">
        <span class="msg-author${isSelf ? ' self' : ''}" onclick="showProfilePopup('${msg.user_id}',event)">${escHtml(displayName)}</span>
        <span class="msg-time">${time}</span>
      </div>
      ${body}
      <div class="msg-reactions" id="reacts-${msg.id}"></div>
    </div>
    <div class="msg-actions">${actions}</div>
  `;
  wrap.appendChild(row);
  if (!msg.deleted) loadReacts(msg.id);
}

// ── SUBSCRIBE ─────────────────────────────────────────────────────────
function subscribeMessages() {
  const filter = activeChannelType === 'global' ? 'channel_type=eq.global' : `channel_id=eq.${activeChannelId}`;
  msgSub = sb.channel(`chat:${activeChannel}`)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter }, payload => {
      const msg = payload.new;
      sb.from('profiles').select('username,display_name,elo,wins,games_played,bio').eq('id', msg.user_id).single().then(({ data: prof }) => {
        msg.profiles = prof;
        const wrap = document.getElementById('messagesWrap');
        const lastRow = wrap.querySelector('.msg-row:last-child');
        const prevId = lastRow?.dataset?.userId;
        renderMsg(msg, prevId === msg.user_id);
        scrollBottom();
        if (msg.user_id !== currentUser.id) {
          const isMention = msg.content?.includes(`@${currentProfile?.username}`);
          if (isMention || activeChannelType === 'dm') {
            const from = prof?.display_name || prof?.username || 'Someone';
            showNotification(from, msg.gif_url ? '📷 sent a GIF' : msg.content, activeChannel);
          }
        }
      });
    })
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'chat_messages', filter }, payload => {
      const msg = payload.new;
      const row = document.querySelector(`[data-msg-id="${msg.id}"]`);
      if (!row) return;
      if (msg.deleted) {
        const t = row.querySelector('.msg-text,.msg-gif');
        if (t) t.outerHTML = '<div class="msg-text msg-deleted">🗑 This message was deleted.</div>';
        const a = row.querySelector('.msg-actions'); if (a) a.innerHTML = '';
      } else if (msg.edited) {
        const t = document.getElementById(`mtext-${msg.id}`);
        if (t) { const linked = escHtml(msg.content||'').replace(/@(\w+)/g,'<span class="mtag">@$1</span>'); t.innerHTML = `${linked} <span class="msg-edited">(edited)</span>`; }
      }
    })
    .subscribe();
}

// ── SEND ──────────────────────────────────────────────────────────────
async function sendMessage(gifUrl) {
  if (editingMsgId) { await saveEdit(editingMsgId); return; }
  const input = document.getElementById('msgInput');
  const content = input.value.trim();
  if (!content && !gifUrl) return;
  input.value = ''; input.style.height = 'auto';
  document.getElementById('sendBtn').disabled = true;
  clearReply();
  const { error } = await sb.from('chat_messages').insert({
    user_id: currentUser.id, channel_type: activeChannelType, channel_id: activeChannelId,
    content: gifUrl ? null : content, gif_url: gifUrl || null, reply_to: replyTo?.id || null
  });
  if (error) console.error('send error:', error.message);
}

// ── INPUT ─────────────────────────────────────────────────────────────
function onInput(e) {
  document.getElementById('sendBtn').disabled = !e.target.value.trim();
  e.target.style.height = 'auto';
  e.target.style.height = Math.min(e.target.scrollHeight, 140) + 'px';
  checkMention(e.target);
}
function onKeyDown(e) {
  if (handleMentionKey(e)) return;
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
}

// ── REPLY ─────────────────────────────────────────────────────────────
function replyToMsg(id, author) {
  replyTo = { id, author };
  document.getElementById('replyPreviewText').innerHTML = `Replying to <strong>@${author}</strong>`;
  document.getElementById('replyPreview').classList.add('show');
  document.getElementById('msgInput').focus();
}
function clearReply() {
  replyTo = null;
  editingMsgId = null;
  document.getElementById('replyPreview').classList.remove('show');
}

// ── EDIT ──────────────────────────────────────────────────────────────
function startEdit(id) {
  const t = document.getElementById(`mtext-${id}`);
  if (!t) return;
  const currentText = t.childNodes[0]?.textContent?.trim() || '';
  editingMsgId = id;
  t.innerHTML = `
    <div class="edit-box">
      <input class="edit-input" id="ei-${id}" value="${escHtml(currentText)}"/>
      <div class="edit-acts">
        <button class="edit-cancel" onclick="cancelEdit('${id}')">Cancel</button>
        <button class="edit-save" onclick="saveEdit('${id}')">Save</button>
      </div>
    </div>`;
  const inp = document.getElementById(`ei-${id}`);
  inp?.focus(); inp?.select();
  inp?.addEventListener('keydown', e => { if(e.key==='Enter') saveEdit(id); if(e.key==='Escape') cancelEdit(id); });
}
async function saveEdit(id) {
  const inp = document.getElementById(`ei-${id}`);
  const newContent = inp?.value?.trim();
  if (!newContent) return;
  await sb.from('chat_messages').update({ content: newContent, edited: true }).eq('id', id).eq('user_id', currentUser.id);
  const t = document.getElementById(`mtext-${id}`);
  if (t) { const linked = escHtml(newContent).replace(/@(\w+)/g,'<span class="mtag">@$1</span>'); t.innerHTML = `${linked} <span class="msg-edited">(edited)</span>`; }
  editingMsgId = null;
}
function cancelEdit(id) { loadMessages(); editingMsgId = null; }

// ── DELETE ────────────────────────────────────────────────────────────
async function deleteMsg(id, withConfirm) {
  if (withConfirm && !confirm('Delete this message?')) return;
  await sb.from('chat_messages').update({ deleted: true, content: null, gif_url: null }).eq('id', id).eq('user_id', currentUser.id);
  const row = document.querySelector(`[data-msg-id="${id}"]`);
  if (row) {
    const t = row.querySelector('.msg-text,.msg-gif');
    if (t) t.outerHTML = '<div class="msg-text msg-deleted">🗑 This message was deleted.</div>';
    const a = row.querySelector('.msg-actions'); if (a) a.innerHTML = '';
  }
}

// ── REACTIONS ─────────────────────────────────────────────────────────
const REACT_EMOJIS = ['👍','❤️','😂','😮','😢','🔥','💯','👀'];
function showReactPicker(msgId, btn) {
  document.getElementById('reactPicker')?.remove();
  const picker = document.createElement('div');
  picker.id = 'reactPicker';
  picker.style.cssText = 'position:fixed;background:var(--surface);border:1px solid var(--border2);border-radius:30px;padding:6px 10px;display:flex;gap:6px;box-shadow:0 8px 30px rgba(0,0,0,.5);z-index:700';
  const rect = btn.getBoundingClientRect();
  picker.style.top = (rect.top - 50) + 'px';
  picker.style.left = rect.left + 'px';
  REACT_EMOJIS.forEach(em => {
    const b = document.createElement('button');
    b.textContent = em;
    b.style.cssText = 'background:none;border:none;cursor:pointer;font-size:20px;padding:2px;border-radius:6px;transition:transform .1s';
    b.onmouseover = () => b.style.transform = 'scale(1.3)';
    b.onmouseout = () => b.style.transform = 'scale(1)';
    b.onclick = () => { picker.remove(); toggleReact(msgId, em); };
    picker.appendChild(b);
  });
  document.body.appendChild(picker);
  setTimeout(() => document.addEventListener('click', function h(e) { if (!picker.contains(e.target)) { picker.remove(); document.removeEventListener('click',h); } }, { once: false }), 10);
}
async function toggleReact(msgId, emoji) {
  const { data: ex } = await sb.from('chat_reactions').select('id').eq('message_id', msgId).eq('user_id', currentUser.id).eq('emoji', emoji).maybeSingle();
  if (ex) await sb.from('chat_reactions').delete().eq('id', ex.id);
  else await sb.from('chat_reactions').insert({ message_id: msgId, user_id: currentUser.id, emoji });
  loadReacts(msgId);
}
async function loadReacts(msgId) {
  const { data } = await sb.from('chat_reactions').select('emoji,user_id').eq('message_id', msgId);
  const div = document.getElementById(`reacts-${msgId}`);
  if (!div || !data) return;
  const counts = {};
  data.forEach(r => { if (!counts[r.emoji]) counts[r.emoji] = []; counts[r.emoji].push(r.user_id); });
  div.innerHTML = '';
  Object.entries(counts).forEach(([em, users]) => {
    const pill = document.createElement('button');
    pill.className = `rpill${users.includes(currentUser.id) ? ' mine' : ''}`;
    pill.innerHTML = `${em} <span class="rpill-count">${users.length}</span>`;
    pill.onclick = () => toggleReact(msgId, em);
    div.appendChild(pill);
  });
}

// ── PROFILE POPUP ─────────────────────────────────────────────────────
async function showProfilePopup(userId, event) {
  event.stopPropagation();
  const { data: prof } = await sb.from('profiles').select('*').eq('id', userId).single();
  if (!prof) return;
  const displayName = prof.display_name || prof.username || 'Unknown';
  const ppAv = document.getElementById('ppAvatar');
  if (prof.avatar_url) { ppAv.innerHTML = `<img src="${prof.avatar_url}" style="width:100%;height:100%;object-fit:cover;border-radius:50%"/>`; }
  else { ppAv.textContent = displayName[0].toUpperCase(); ppAv.innerHTML = ppAv.textContent; }
  document.getElementById('ppName').textContent = displayName;
  document.getElementById('ppUsername').textContent = '@' + (prof.username || '?');
  document.getElementById('ppElo').textContent = prof.elo || '—';
  document.getElementById('ppWins').textContent = prof.wins || 0;
  document.getElementById('ppGames').textContent = prof.games_played || 0;
  document.getElementById('ppBio').textContent = prof.bio || '';
  // DM button
  document.getElementById('ppDMBtn').onclick = () => { closeProfilePopup(); openDMWithUser(prof); };
  if (userId === currentUser.id) document.getElementById('ppDMBtn').style.display = 'none';
  else document.getElementById('ppDMBtn').style.display = '';
  // Position popup
  const popup = document.getElementById('profilePopup');
  popup.classList.add('show');
  const x = Math.min(event.clientX + 10, window.innerWidth - 260);
  const y = Math.min(event.clientY - 20, window.innerHeight - 320);
  popup.style.left = x + 'px';
  popup.style.top = y + 'px';
}
function closeProfilePopup() { document.getElementById('profilePopup').classList.remove('show'); }
function openSelfProfile() { if (currentUser) showProfilePopup(currentUser.id, { clientX: 80, clientY: window.innerHeight - 320, stopPropagation: () => {} }); }
async function openDMWithUser(prof) {
  const { data: existing } = await sb.from('chat_dms').select('id').eq('user_id', currentUser.id).eq('other_user_id', prof.id).maybeSingle();
  let dmId;
  if (existing) { dmId = existing.id; }
  else {
    const { data: newDM } = await sb.from('chat_dms').insert({ user_id: currentUser.id, other_user_id: prof.id }).select().single();
    await sb.from('chat_dms').insert({ user_id: prof.id, other_user_id: currentUser.id });
    dmId = newDM?.id;
  }
  await loadDMs();
  if (dmId) openChannel('dm', dmId, prof.display_name || prof.username, '💬');
}

// ── GIF PICKER ────────────────────────────────────────────────────────
function toggleGifPicker() {
  const p = document.getElementById('gifPicker');
  p.classList.toggle('show');
  if (p.classList.contains('show')) { loadTrendingGifs(); document.getElementById('gifSearchInput').focus(); }
}
let gifTimer = null;
document.getElementById('gifSearchInput').addEventListener('input', e => {
  clearTimeout(gifTimer);
  gifTimer = setTimeout(() => searchGifs(e.target.value), 400);
});
async function loadTrendingGifs() {
  const grid = document.getElementById('gifGrid');
  grid.innerHTML = '<div class="gif-msg">Loading...</div>';
  try {
    const r = await fetch(`https://api.klipy.com/api/v1/${KLIPY_KEY}/gifs/trending?limit=12`);
    const d = await r.json();
    renderGifs(d?.data?.data || d?.data || []);
  } catch { grid.innerHTML = '<div class="gif-msg">Could not load GIFs</div>'; }
}
async function searchGifs(q) {
  if (!q.trim()) { loadTrendingGifs(); return; }
  const grid = document.getElementById('gifGrid');
  grid.innerHTML = '<div class="gif-msg">Searching...</div>';
  try {
    const r = await fetch(`https://api.klipy.com/api/v1/${KLIPY_KEY}/gifs/search?q=${encodeURIComponent(q)}&limit=12`);
    const d = await r.json();
    renderGifs(d?.data?.data || d?.data || []);
  } catch { grid.innerHTML = '<div class="gif-msg">Error</div>'; }
}
function renderGifs(results) {
  const grid = document.getElementById('gifGrid');
  if (!results?.length) { grid.innerHTML = '<div class="gif-msg">No GIFs found</div>'; return; }
  grid.innerHTML = '';
  results.forEach(r => {
    const url = r.files?.gif?.url || r.files?.original?.url || r.files?.tiny?.url || r.url;
    if (!url) return;
    const item = document.createElement('div');
    item.className = 'gif-item';
    item.innerHTML = `<img src="${r.files?.tiny?.url || url}" loading="lazy"/>`;
    item.onclick = () => { sendMessage(url); document.getElementById('gifPicker').classList.remove('show'); };
    grid.appendChild(item);
  });
  if (!grid.children.length) grid.innerHTML = '<div class="gif-msg">No GIFs found</div>';
}

// ── EMOJI ─────────────────────────────────────────────────────────────
const EMOJIS = ['😀','😂','🥹','😍','🤩','😎','🥳','😭','😤','🤔','💀','🔥','💯','❤️','🫶','👍','👎','🎉','✨','🫡','😈','🤯','🥺','😏','😴','🤑','😅','🤣','🫠','👀'];
function toggleEmoji() {
  let p = document.getElementById('emojiPicker');
  if (p) { p.remove(); return; }
  p = document.createElement('div');
  p.id = 'emojiPicker';
  p.style.cssText = 'position:absolute;bottom:70px;right:18px;background:var(--surface2);border:1px solid var(--border2);border-radius:12px;padding:10px;width:260px;display:flex;flex-wrap:wrap;gap:4px;z-index:300;box-shadow:0 10px 40px rgba(0,0,0,.5)';
  EMOJIS.forEach(em => {
    const b = document.createElement('button');
    b.textContent = em; b.style.cssText = 'background:none;border:none;font-size:20px;cursor:pointer;padding:3px;border-radius:6px;';
    b.onmouseenter = () => b.style.background = 'var(--surface3)';
    b.onmouseleave = () => b.style.background = 'none';
    b.onclick = () => {
      const inp = document.getElementById('msgInput');
      const pos = inp.selectionStart;
      inp.value = inp.value.slice(0,pos) + em + inp.value.slice(pos);
      inp.focus(); inp.selectionStart = inp.selectionEnd = pos + em.length;
      document.getElementById('sendBtn').disabled = false;
      p.remove();
    };
    p.appendChild(b);
  });
  document.querySelector('.input-area').appendChild(p);
}

// ── DMs / GROUPS ──────────────────────────────────────────────────────
async function loadDMs() {
  const { data } = await sb.from('chat_dms').select('*, other:profiles!chat_dms_other_user_id_fkey(id,username,display_name)').eq('user_id', currentUser.id).order('updated_at', { ascending: false });
  const list = document.getElementById('dmList');
  list.innerHTML = '';
  (data || []).forEach(dm => {
    const prof = dm.other || {};
    const name = prof.display_name || prof.username || 'Unknown';
    const item = document.createElement('div');
    item.className = 'ch-item'; item.dataset.channel = `dm-${dm.id}`;
    item.onclick = () => openChannel('dm', dm.id, name);
    item.innerHTML = `<div class="dm-avatar">${name[0].toUpperCase()}<div class="dm-status"></div></div><div class="ch-info"><div class="ch-name">${escHtml(name)}</div><div class="ch-preview">Direct message</div></div><div class="ch-badge" id="badge-dm-${dm.id}"></div>`;
    list.appendChild(item);
  });
}
async function loadGroups() {
  const { data } = await sb.from('chat_group_members').select('*, group:chat_groups(id,name)').eq('user_id', currentUser.id);
  const list = document.getElementById('groupList');
  list.innerHTML = '';
  (data || []).forEach(mem => {
    if (!mem.group) return;
    const name = mem.group.name;
    const item = document.createElement('div');
    item.className = 'ch-item'; item.dataset.channel = `group-${mem.group.id}`;
    item.onclick = () => openChannel('group', mem.group.id, name);
    item.innerHTML = `<div class="ch-icon">👥</div><div class="ch-info"><div class="ch-name">${escHtml(name)}</div><div class="ch-preview">Group chat</div></div><div class="ch-badge" id="badge-group-${mem.group.id}"></div>`;
    list.appendChild(item);
  });
}

// ── MODALS ────────────────────────────────────────────────────────────
function openNewDMModal() { selectedDMUser=null; document.getElementById('dmSearchInput').value=''; document.getElementById('dmUserList').innerHTML=''; document.getElementById('startDMBtn').disabled=true; document.getElementById('newDMModal').classList.add('show'); }
function openNewGroupModal() { selectedGroupUsers=[]; document.getElementById('groupNameInput').value=''; document.getElementById('groupSearchInput').value=''; document.getElementById('groupUserList').innerHTML=''; document.getElementById('newGroupModal').classList.add('show'); }
function closeModal(id) { document.getElementById(id).classList.remove('show'); }

async function searchUsers(query, mode) {
  if (!query.trim()) return;
  const { data } = await sb.from('profiles').select('id,username,display_name').ilike('username', `%${query}%`).neq('id', currentUser.id).limit(10);
  const listId = mode === 'dm' ? 'dmUserList' : 'groupUserList';
  const list = document.getElementById(listId);
  list.innerHTML = '';
  (data || []).forEach(user => {
    const displayName = user.display_name || user.username;
    const item = document.createElement('div');
    item.className = 'user-opt' + (mode==='group' && selectedGroupUsers.find(u=>u.id===user.id) ? ' selected' : '');
    item.innerHTML = `<div class="user-opt-av">${displayName[0].toUpperCase()}</div><span class="user-opt-name">${escHtml(displayName)}</span><span class="user-opt-check">✓</span>`;
    item.onclick = () => {
      if (mode === 'dm') { list.querySelectorAll('.user-opt').forEach(el=>el.classList.remove('selected')); item.classList.add('selected'); selectedDMUser=user; document.getElementById('startDMBtn').disabled=false; }
      else { const idx=selectedGroupUsers.findIndex(u=>u.id===user.id); if(idx===-1){selectedGroupUsers.push(user);item.classList.add('selected');}else{selectedGroupUsers.splice(idx,1);item.classList.remove('selected');} }
    };
    list.appendChild(item);
  });
}
async function startDM() {
  if (!selectedDMUser) return;
  const { data: existing } = await sb.from('chat_dms').select('id').eq('user_id', currentUser.id).eq('other_user_id', selectedDMUser.id).maybeSingle();
  let dmId;
  if (existing) { dmId = existing.id; }
  else {
    const { data: newDM } = await sb.from('chat_dms').insert({ user_id: currentUser.id, other_user_id: selectedDMUser.id }).select().single();
    await sb.from('chat_dms').insert({ user_id: selectedDMUser.id, other_user_id: currentUser.id });
    dmId = newDM?.id;
  }
  closeModal('newDMModal');
  await loadDMs();
  if (dmId) openChannel('dm', dmId, selectedDMUser.display_name || selectedDMUser.username);
}
async function createGroup() {
  const name = document.getElementById('groupNameInput').value.trim();
  if (!name) return;
  const { data: group } = await sb.from('chat_groups').insert({ name, created_by: currentUser.id }).select().single();
  if (!group) return;
  const members = [{ group_id: group.id, user_id: currentUser.id }, ...selectedGroupUsers.map(u => ({ group_id: group.id, user_id: u.id }))];
  await sb.from('chat_group_members').insert(members);
  closeModal('newGroupModal');
  await loadGroups();
  openChannel('group', group.id, name);
}

// ── NOTIFICATIONS ─────────────────────────────────────────────────────
function showNotification(from, body, channel) {
  document.getElementById('notifToastTitle').textContent = from;
  document.getElementById('notifToastBody').textContent = body;
  pendingNotifChannel = channel;
  const toast = document.getElementById('notifToast');
  toast.classList.add('show');
  clearTimeout(notifToastTimeout);
  notifToastTimeout = setTimeout(() => toast.classList.remove('show'), 5000);
  if (Notification.permission === 'granted') {
    const n = new Notification(`${from} — Whims Games`, { body, icon: 'icon.svg' });
    n.onclick = () => { window.focus(); handleNotifClick(); };
  }
  unreadCounts[channel] = (unreadCounts[channel] || 0) + 1;
  updateBadge(channel, unreadCounts[channel]);
}
function handleNotifClick() {
  if (pendingNotifChannel) { const p = pendingNotifChannel.split('-'); if(p[0]==='global') openChannel('global'); else if(p[0]==='dm') openChannel('dm',p[1]); else if(p[0]==='group') openChannel('group',p[1]); }
  document.getElementById('notifToast').classList.remove('show');
}
function updateBadge(channel, count) {
  const el = channel === 'global' ? document.getElementById('globalBadge') : document.getElementById(`badge-${channel}`);
  if (!el) return;
  el.textContent = count > 99 ? '99+' : count;
  el.style.display = count > 0 ? 'block' : 'none';
}
function subscribeAllNotifications() {
  sb.channel('notif:global').on('postgres_changes', { event:'INSERT', schema:'public', table:'chat_messages', filter:'channel_type=eq.global' }, payload => {
    const msg = payload.new;
    if (msg.user_id === currentUser.id || activeChannelType === 'global') return;
    if (msg.content?.includes(`@${currentProfile?.username}`)) {
      sb.from('profiles').select('username,display_name').eq('id', msg.user_id).single().then(({data:p}) => {
        showNotification(p?.display_name||p?.username||'Someone', msg.content, 'global');
      });
    }
  }).subscribe();
}

// ── ONLINE COUNT ──────────────────────────────────────────────────────
async function updateOnlineCount() {
  const since = new Date(Date.now() - 5*60*1000).toISOString();
  const { count } = await sb.from('profiles').select('*', { count:'exact', head:true }).gte('last_seen', since);
  document.getElementById('onlineCount').textContent = `${count || 1} online`;
}

function scrollBottom() { const w = document.getElementById('messagesWrap'); w.scrollTop = w.scrollHeight; }
function toggleMemberList() {}

function escHtml(s) {
  if (!s) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}


// ── @ MENTION AUTOCOMPLETE ────────────────────────────────────────────
let mentionUsers = [], mentionIdx = -1, mentionQuery = '';

async function checkMention(input) {
  const val = input.value;
  const pos = input.selectionStart;
  const before = val.slice(0, pos);
  const match = before.match(/@(\w*)$/);
  if (!match) { closeMentionDropdown(); return; }
  mentionQuery = match[1];
  const { data } = await sb.from('profiles').select('id,username,display_name,avatar_url').ilike('username', `%${mentionQuery}%`).limit(8);
  mentionUsers = data || [];
  renderMentionDropdown(input);
}

function renderMentionDropdown(input) {
  closeMentionDropdown();
  if (!mentionUsers.length) return;
  const box = document.querySelector('.input-area');
  const drop = document.createElement('div');
  drop.className = 'mention-dropdown'; drop.id = 'mentionDrop';
  mentionUsers.forEach((u, i) => {
    const displayName = u.display_name || u.username;
    const item = document.createElement('div');
    item.className = 'mention-item' + (i === mentionIdx ? ' active' : '');
    item.innerHTML = `<div class="mention-av">${u.avatar_url ? `<img src="${u.avatar_url}"/>` : displayName[0].toUpperCase()}</div><div><div class="mention-name">${escHtml(displayName)}</div><div class="mention-user">@${escHtml(u.username)}</div></div>`;
    item.onclick = () => insertMention(u, input);
    drop.appendChild(item);
  });
  box.insertBefore(drop, box.querySelector('.input-box'));
}

function insertMention(user, input) {
  const val = input.value;
  const pos = input.selectionStart;
  const before = val.slice(0, pos).replace(/@\w*$/, '');
  const after = val.slice(pos);
  input.value = before + '@' + user.username + ' ' + after;
  input.focus();
  const newPos = before.length + user.username.length + 2;
  input.selectionStart = input.selectionEnd = newPos;
  document.getElementById('sendBtn').disabled = false;
  closeMentionDropdown();
}

function closeMentionDropdown() {
  document.getElementById('mentionDrop')?.remove();
  mentionIdx = -1;
}

function handleMentionKey(e) {
  const drop = document.getElementById('mentionDrop');
  if (!drop) return false;
  if (e.key === 'ArrowDown') { e.preventDefault(); mentionIdx = Math.min(mentionIdx + 1, mentionUsers.length - 1); renderMentionDropdown(e.target); return true; }
  if (e.key === 'ArrowUp') { e.preventDefault(); mentionIdx = Math.max(mentionIdx - 1, 0); renderMentionDropdown(e.target); return true; }
  if (e.key === 'Enter' || e.key === 'Tab') { if (mentionIdx >= 0) { e.preventDefault(); insertMention(mentionUsers[mentionIdx], e.target); return true; } }
  if (e.key === 'Escape') { closeMentionDropdown(); return true; }
  return false;
}

// ── EVENTS ────────────────────────────────────────────────────────────
document.getElementById('msgInput').addEventListener('input', onInput);
document.getElementById('msgInput').addEventListener('keydown', onKeyDown);
document.getElementById('sendBtn').addEventListener('click', () => sendMessage());
document.getElementById('gifBtn').addEventListener('click', toggleGifPicker);
document.getElementById('emojiBtn').addEventListener('click', toggleEmoji);
document.addEventListener('click', e => {
  const gifPicker = document.getElementById('gifPicker');
  if (gifPicker.classList.contains('show') && !gifPicker.contains(e.target) && e.target.id !== 'gifBtn') gifPicker.classList.remove('show');
  if (e.target.classList.contains('modal-overlay')) e.target.classList.remove('show');
  const pp = document.getElementById('profilePopup');
  if (pp.classList.contains('show') && !pp.contains(e.target) && !e.target.closest('.msg-av') && !e.target.closest('.msg-author')) closeProfilePopup();
});

// ── Also need chat_reactions table ─────────────────────────────────────
// Run in Supabase: 
// create table if not exists chat_reactions (id uuid primary key default gen_random_uuid(), message_id uuid references chat_messages(id) on delete cascade, user_id uuid references profiles(id) on delete cascade, emoji text not null, unique(message_id,user_id,emoji));
// alter table chat_reactions enable row level security;
// create policy "Read reactions" on chat_reactions for select using (auth.role()='authenticated');
// create policy "Add reactions" on chat_reactions for insert with check (auth.uid()=user_id);
// create policy "Remove reactions" on chat_reactions for delete using (auth.uid()=user_id);

init();
</script>
</body>
</html>