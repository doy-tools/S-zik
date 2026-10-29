const $ = s => document.querySelector(s);
const toast = m => { const t=$('#toast'); t.textContent=m; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),2500); };
const showLoading = (txt, dur, cb) => { $('#loader-text').textContent=txt; $('#loading-overlay').classList.add('show'); setTimeout(()=>{ $('#loading-overlay').classList.remove('show'); if(cb)cb(); }, dur); };
const openSheet = h => { $('#sheet-body').innerHTML=h; $('#sheet').classList.add('show'); $('#backdrop').classList.add('show'); };
const closeSheet = () => { $('#sheet').classList.remove('show'); $('#backdrop').classList.remove('show'); };
const openSidebar = () => { $('#sidebar').classList.add('open'); $('#sidebar-backdrop').classList.add('open'); };
const closeSidebar = () => { $('#sidebar').classList.remove('open'); $('#sidebar-backdrop').classList.remove('open'); };
const doLogout = () => { localStorage.removeItem('szix_session'); location.reload(); };
const openWA = (phone, text, isLink) => window.open(isLink?phone:`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
const showAppInfo = () => openSheet(`<h3 style="text-align:center;">ℹ️ Info S ZIX</h3><div style="text-align:center;padding:20px 0;"><div class="logo-s" style="margin:0 auto 16px;">Ｓ</div><div style="font-size:20px;font-weight:900;color:#fff;">S ZIX Panel</div><div style="font-size:12px;color:var(--text-dim);margin-top:4px;">Versi 1.0.0</div></div><button class="btn" onclick="closeSheet()">Tutup</button>`);

let CURRENT_USER = null;
const getUsers = () => JSON.parse(localStorage.getItem('szix_users') || '{"doyz dev":{"pw":"doyz dev","role":"developer"},"doyz dev2":{"pw":"doyz dev2","role":"developer"}}');
const switchAuth = (type) => {
  const isLogin = type === 'login';
  $('#auth-indicator').classList.toggle('right', !isLogin);
  $('#tab-login').classList.toggle('active', isLogin); $('#tab-register').classList.toggle('active', !isLogin);
  $('#form-login').style.display = isLogin ? 'flex' : 'none'; $('#form-register').style.display = isLogin ? 'none' : 'flex';
};
const doLogin = () => {
  const u=$('#login-usr').value.trim().toLowerCase(), p=$('#login-pwd').value, users=getUsers();
  if(users[u] && users[u].pw===p) {
    CURRENT_USER={usr:u,role:users[u].role}; localStorage.setItem('szix_session',JSON.stringify(CURRENT_USER));
    $('#user-badge').textContent=users[u].role==='developer'?'ＤＥＶ':'ＵＳＥＲ';
    $('#prof-name').innerHTML=`${u} <span>⭐</span>`; $('#prof-initial').textContent=u[0].toUpperCase(); $('#prof-role').textContent=users[u].role==='developer'?'ＤＥＶＥＬＯＰＥＲ':'ＵＳＥＲ';
    $('#auth-screen').classList.add('hide'); $('#main').classList.add('show'); render('home'); updateChatPreview(); toast(`Ｈａｌｏ, ${u}`);
  } else { $('#login-err').textContent='Ｓａｌａｈ'; }
};
const doRegister = () => {
  const u=$('#reg-usr').value.trim().toLowerCase(), p=$('#reg-pwd').value, p2=$('#reg-pwd2').value, e=$('#reg-err'), users=getUsers();
  if(u.length<3) return e.textContent='Ｍｉｎ 3';
  if(p.length<5) return e.textContent='Ｐｗ ｍｉｎ 5';
  if(p!==p2) return e.textContent='Ｔｉｄａｋ ｓａｍａ';
  if(users[u]) return e.textContent='Ｄｉｐａｋａｉ';
  users[u]={pw:p,role:'user'}; localStorage.setItem('szix_users',JSON.stringify(users)); toast('Ｂｅｒｈａｓｉｌ!'); switchAuth('login'); $('#login-usr').value=u;
};
const updateWIB = () => {
  const n=new Date(), w=new Date(n.getTime()+(n.getTimezoneOffset()*60000)+(7*3600000));
  $('#clock').textContent=`${w.getHours().toString().padStart(2,'0')}:${w.getMinutes().toString().padStart(2,'0')}`;
  const s = w.getHours()<11?'Ｐａｇｉ':w.getHours()<15?'Ｓｉａｎｇ':w.getHours()<18?'Ｓｏｒｅ':'Ｍａｌａｍ';
  $('#sapaan').textContent=`ＷＩＢ · ${s}`;
  $('#day-name').textContent=['ＭＩＮ','ＳＥＮ','ＳＥＬ','ＲＡＢ','ＫＡＭ','ＪＵＭ','ＳＡＢ'][w.getDay()];
  $('#day-num').textContent=w.getDate().toString().padStart(2,'0');
  $('#month-year').textContent=`${['ＪＡＮ','ＦＥＢ','ＭＡＲ','ＡＰＲ','ＭＥＩ','ＪＵＮ','ＪＵＬ','ＡＧＵ','ＳＥＰ','ＯＫＴ','ＮＯＶ','ＤＥＳ'][w.getMonth()]} ${w.getFullYear()}`;
};
const updateChatPreview = () => {
  const c=$('#chat-preview-container'), chats=[{n:'doyz dev',m:'Bug baru!',t:'10:45'},{n:'Bot',m:'Spam OTP sukses.',t:'09:12'}];
  c.innerHTML=chats.map(x=>`<div class="chat-item" onclick="openChatRoom()"><div class="chat-avatar">${x.n[0].toUpperCase()}</div><div class="chat-info"><div style="display:flex;justify-content:space-between;"><div class="chat-name">${x.n}</div><div style="font-size:10px;color:var(--text-dim);">${x.t}</div></div><div class="chat-msg">${x.m}</div></div></div>`).join('');
};
const openChatRoom = () => {
  const d=document.createElement('div'); d.id='chat-room'; d.style.cssText='position:fixed;inset:0;background:var(--bg-gradient);z-index:950;display:flex;flex-direction:column;transform:translateY(100%);transition:transform .4s var(--spring);';
  d.innerHTML=`<div style="padding:16px 20px;display:flex;align-items:center;gap:12px;background:var(--bg-main);border-bottom:1px solid rgba(255,255,255,0.05);"><button onclick="closeChatRoom()" style="background:none;border:none;color:#fff;font-size:20px;">←</button><div style="font-size:16px;font-weight:900;color:#fff;">Chat Global</div></div><div id="chat-msgs" style="flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;gap:12px;"><div style="align-self:flex-start;background:rgba(255,255,255,0.1);padding:10px 14px;border-radius:12px 12px 12px 0;font-size:13px;color:#fff;">Halo!</div></div><div style="padding:16px 20px;background:var(--bg-main);display:flex;gap:10px;"><input id="chat-inp" type="text" placeholder="Ketik..." style="margin:0;flex:1;background:rgba(255,255,255,0.1);color:#fff;" onkeypress="if(event.key==='Enter')sendChat()"><button class="btn" style="width:auto;padding:0 20px;margin:0;" onclick="sendChat()">Ｋｉｒｉｍ</button></div>`;
  document.body.appendChild(d); setTimeout(()=>d.style.transform='translateY(0)',10);
};
const closeChatRoom = () => { const d=$('#chat-room'); if(d){d.style.transform='translateY(100%)';setTimeout(()=>d.remove(),400);} };
const sendChat = () => { const i=$('#chat-inp'), m=i.value.trim(); if(!m)return; $('#chat-msgs').innerHTML+=`<div style="align-self:flex-end;background:var(--accent);color:#fff;padding:10px 14px;border-radius:12px 12px 0 12px;font-size:13px;">${m}</div>`; i.value=''; $('#chat-msgs').scrollTop=$('#chat-msgs').scrollHeight; };

const render = (tab) => {
  document.querySelectorAll('.tabbar .t').forEach(b=>b.classList.toggle('on',b.dataset.tab===tab));
  const h=tab==='home'; $('#home-view').style.display=h?'block':'none'; const c=$('#content'); c.style.display=h?'none':'block';
  if(!h){ c.innerHTML=''; setTimeout(()=>{ 
    if(tab==='menu')c.innerHTML=renderMenu(); 
    else if(tab==='rat')c.innerHTML=renderRatBuilder(); 
    else if(tab==='tools')c.innerHTML=renderTools(); 
    else if(tab==='bug')c.innerHTML=renderBugPage(); 
    else if(tab==='pairing')c.innerHTML=renderPairingPage(); 
    else if(tab==='spamotp')c.innerHTML=renderSpamOTP();
    $('#view-container').scrollTo({top:0,behavior:'smooth'}); 
  },50); }
};

const renderMenu = () => `<h1>ＭＥＮＵ</h1><div class="card"><div class="row" onclick="render('bug')"><div><b>Ｂｕｇ Ｓｅｎｄｅｒ</b><br><small>Ｋｉｒｉｍ</small></div><span class="pill biru">ＢＵＫＡ</span></div><div class="row" onclick="render('rat')"><div><b>ＲＡＴ ＡＰＫ</b><br><small>Ｂｕｉｌｄｅｒ</small></div><span class="pill biru">ＢＵＫＡ</span></div></div>`;

// RAT BUILDER
let ratFeatures = JSON.parse(localStorage.getItem('szix_rat_features') || '{"camera":true,"mic":true,"location":true,"html":true,"flash":true,"spam":true}');
let deviceModel = localStorage.getItem('szix_rat_device') || null;

const toggleRatFeature = (feature) => {
  if(!deviceModel) return toast('Build APK dulu!');
  ratFeatures[feature] = !ratFeatures[feature]; localStorage.setItem('szix_rat_features', JSON.stringify(ratFeatures));
  const el = $(`#toggle-${feature}`); if (el) el.classList.toggle('on', ratFeatures[feature]);
  toast(`${feature.toUpperCase()} (${ratFeatures[feature]?'ON':'OFF'})`);
}

const renderRatBuilder = () => {
  return `<h1>ＲＡＴ Ｃｏｎｔｒｏｌ</h1>
  ${!deviceModel ? `
  <div class="card" style="border: 2px solid var(--accent);">
    <h3>Ｂｕｉｌｄ ＡＰＫ</h3>
    <label>Ｎａｍａ ＡＰＫ</label><input id="apk-name" placeholder="System Update" value="System Update">
    <label>Ｉｋｏｎ ＡＰＫ</label>
    <div class="upload-icon-box" onclick="$('#file-input').click()"><img id="icon-preview" src=""><span id="icon-plus">📷</span><p id="icon-text">Pilih</p></div>
    <input type="file" id="file-input" accept="image/*" style="display:none" onchange="previewIcon(event)">
    <button class="btn" onclick="buildAPK()">Ｂｕａｔ ＡＰＫ 🚀</button>
  </div>
  ` : `
  <div class="card" style="border: 2px solid var(--ok); background: rgba(46,213,115,0.05);">
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <div style="display:flex; align-items:center; gap:10px; color:var(--ok);"><div style="width:12px;height:12px;border-radius:50%;background:var(--ok);"></div><div><b>Target: ${deviceModel}</b></div></div>
      <button style="background:none; border:none; color:var(--danger); font-size:12px; font-weight:800;" onclick="resetTarget()">Hapus</button>
    </div>
  </div>
  <div class="card">
    <h3>Ｆｉｔｕｒ ＲＡＴ</h3>
    <div class="row"><div><b>📷 Kamera</b></div><div class="toggle-switch ${ratFeatures.camera ? 'on' : ''}" id="toggle-camera" onclick="toggleRatFeature('camera')"></div></div>
    <div class="row"><div><b>🎤 Suara</b></div><div class="toggle-switch ${ratFeatures.mic ? 'on' : ''}" id="toggle-mic" onclick="toggleRatFeature('mic')"></div></div>
    <div class="row"><div><b>📍 Lokasi</b></div><div class="toggle-switch ${ratFeatures.location ? 'on' : ''}" id="toggle-location" onclick="toggleRatFeature('location')"></div></div>
    <div class="row"><div><b>🔦 Flash</b></div><div class="toggle-switch ${ratFeatures.flash ? 'on' : ''}" id="toggle-flash" onclick="toggleRatFeature('flash')"></div></div>
    <div class="row"><div><b>💥 Spam</b></div><div class="toggle-switch ${ratFeatures.spam ? 'on' : ''}" id="toggle-spam" onclick="toggleRatFeature('spam')"></div></div>
    <div class="row"><div><b>⚠️ HTML Injection</b></div><div class="toggle-switch ${ratFeatures.html ? 'on' : ''}" id="toggle-html" onclick="toggleRatFeature('html')"></div></div>
  </div>
  `}`;
};

const previewIcon = (e) => {
  const file = e.target.files[0];
  if(file) { const reader = new FileReader(); reader.onload = function(evt) { $('#icon-preview').src = evt.target.result; $('#icon-preview').style.display = 'block'; $('#icon-plus').style.display = 'none'; $('#icon-text').style.display = 'none'; }; reader.readAsDataURL(file); }
}

const buildAPK = () => {
  const n = $('#apk-name').value || 'System Update';
  showLoading('BUILDING...', 2500, () => { openSheet(`<h3 style="text-align:center; color:var(--ok);">SUKSES!</h3><div style="text-align:center; padding:20px 0;"><div style="font-size:60px; margin-bottom:10px;">📦</div><div style="font-size:18px; font-weight:900; color:#fff;">${n}.apk</div></div><button class="btn" onclick="installSim()">Ｉｎｓｔａｌｌ ✅</button>`); });
};

const installSim = () => {
  closeSheet(); showLoading('MENDETEKSI HP...', 3000, () => {
    const models = ["Samsung S23", "Xiaomi 13", "iPhone 14", "Oppo Reno", "Vivo V27", "Realme GT"];
    const randomModel = models[Math.floor(Math.random() * models.length)];
    deviceModel = randomModel; localStorage.setItem('szix_rat_device', randomModel);
    toast(`Terhubung: ${randomModel}`); render('rat');
  });
};
const resetTarget = () => { deviceModel = null; localStorage.removeItem('szix_rat_device'); render('rat'); };

const renderTools = () => `<h1>ＴＯＯＬＳ</h1><div class="card" style="text-align:center;padding:30px;"><h3 style="justify-content:center;">Tools</h3><button class="btn" onclick="render('spamotp')">Ｓｐａｍ ＯＴＰ</button></div>`;
const renderSpamOTP = () => `<h1>ＳＰＡＭ</h1><div class="row" onclick="render('tools')" style="border:none;cursor:pointer;padding-bottom:15px;"><span style="color:#fff;background:rgba(255,255,255,0.1);padding:8px 16px;border-radius:100px;">← Ｋｅｍｂａｌｉ</span></div><div class="card"><label>Ｔａｒｇｅｔ</label><input id="otp-target" placeholder="628..."><button class="btn" onclick="startSpam()">Ｋｉｒｉｍ</button></div>`;
const startSpam = () => { const t=$('#otp-target').value; if(!t)return toast('Isi target!'); showLoading('MENGIRIM...',2000,()=>toast('Sukses!')); };

const renderBugPage = () => {
  const paired=localStorage.getItem('szix_paired_number');
  return `<h1>Ｂｕｇ Ｓｅｎｄｅｒ</h1><div class="row" onclick="render('home')" style="border:none;cursor:pointer;padding-bottom:15px;"><span style="color:#fff;background:rgba(255,255,255,0.1);padding:8px 16px;border-radius:100px;">← Ｋｅｍｂａｌｉ</span></div>
  ${paired?`<div style="background:rgba(46,213,115,0.1);border:1px solid rgba(46,213,115,0.3);border-radius:16px;padding:14px;margin-bottom:16px;color:var(--ok);font-weight:900;">${paired} <span style="font-size:10px;opacity:0.7;">(Aktif)</span></div>`:''}
  <div class="sender-options" style="margin-bottom:20px;">
    <div class="sender-btn active" id="btn-sender-privat" onclick="setBugMode('privat')" style="padding:20px 10px;"><b style="font-size:15px;">Ｐｒｉｖａｔ</b><small>Ｎｏｍｏｒ Ｌｏ</small></div>
    <div class="sender-btn" id="btn-sender-global" onclick="setBugMode('global')" style="padding:20px 10px;"><b style="font-size:15px;">Ｇｌｏｂａｌ</b><small>Ｓｅｒｖｅｒ</small></div>
  </div>
  <div id="view-privat" style="display:block;">
    ${paired ? `<div class="card"><h3>Ｆｏｒｍ Ｂｕｇ</h3><label>Ｎｏｍｏｒ</label><input id="bug-target" placeholder="628..."><label>Ｊｅｎｉｓ</label><div class="custom-select" onclick="openBugSelect('privat')"><span id="label-bug-type">Crash</span><svg viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg></div><input type="hidden" id="bug-type" value="Crash"><button class="btn danger" onclick="sendBug('privat')">Ｋｉｒｉｍ</button></div>` : `<div class="card" style="text-align:center; padding:30px 20px;"><div style="font-size:40px; margin-bottom:10px;">📱</div><h3 style="justify-content:center; margin-bottom:8px;">Ｐａｉｒｉｎｇ</h3><button class="btn" onclick="render('pairing')">Ｂｕｋａ Ｐａｉｒｉｎｇ</button></div>`}
  </div>
  <div id="view-global" style="display:none;">
    <div class="card"><h3>Ｆｏｒｍ Ｂｕｇ</h3><label>Ｎｏｍｏｒ</label><input id="bug-target-global" placeholder="628..."><label>Ｊｅｎｉｓ</label><div class="custom-select" onclick="openBugSelect('global')"><span id="label-gs-type">Crash</span><svg viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg></div><input type="hidden" id="gs-type" value="Crash"><button class="btn danger" onclick="sendGlobalBug()">Ｋｉｒｉｍ</button></div>
  </div>`;
};
const setBugMode = (mode) => {
  document.getElementById('btn-sender-privat').classList.toggle('active', mode === 'privat'); document.getElementById('btn-sender-global').classList.toggle('active', mode === 'global');
  document.getElementById('view-privat').style.display = mode === 'privat' ? 'block' : 'none'; document.getElementById('view-global').style.display = mode === 'global' ? 'block' : 'none';
};
const openBugSelect = (mode) => {
  const id = mode === 'privat' ? 'bug-type' : 'gs-type';
  const opts = [{v:'Crash', t:'Crash'},{v:'Delay', t:'Delay'},{v:'Force Close', t:'Force Close'},{v:'Black Screen', t:'Black Screen'},{v:'Delay Hard', t:'Delay Hard'}];
  let html = `<h3 style="text-align:center; color:#fff; margin-bottom:20px;">Pilih Bug</h3>`; const currentVal = $(`#${id}`).value;
  opts.forEach(o => { html += `<div class="select-option ${currentVal === o.v ? 'active' : ''}" onclick="pickBugOption('${id}', '${o.v}', '${o.t}', '${mode}')"><span style="color:#fff;">${o.t}</span> <span class="check">✓</span></div>`; }); openSheet(html);
};
const pickBugOption = (id, val, text, mode) => { $(`#${id}`).value = val; if(mode === 'global') $('#label-gs-type').textContent = text; else $('#label-bug-type').textContent = text; closeSheet(); };
const sendBug = (mode) => {
  const t = $('#bug-target').value, b = $('#bug-type').value; if(!t) return toast('Isi target!');
  showLoading(`MENGIRIM ${b}...`, 2000, () => { toast(`Bug ${b} terkirim!`); });
};
const sendGlobalBug = () => {
  const t = $('#bug-target-global').value, b = $('#gs-type').value; if(!t) return toast('Isi target!');
  showLoading(`MENGIRIM ${b}...`, 2000, () => { toast(`Bug ${b} terkirim!`); });
};
const renderPairingPage = () => {
  const code=Math.floor(10000000+Math.random()*90000000), nAktif="628999999999", nPair="62812"+Math.floor(10000000+Math.random()*90000000);
  return `<h1>Ｐａｉｒｉｎｇ</h1><div class="row" onclick="render('bug')" style="border:none;cursor:pointer;padding-bottom:15px;"><span style="color:#fff;background:rgba(255,255,255,0.1);padding:8px 16px;border-radius:100px;">← Ｋｅｍｂａｌｉ</span></div>
  <div style="background:rgba(46,213,115,0.1);border:1px solid rgba(46,213,115,0.3);border-radius:16px;padding:16px;margin-bottom:20px;display:flex;flex-direction:column;gap:8px;"><div style="display:flex;justify-content:space-between;"><span style="font-size:12px;color:#6a8296;">Aktif</span><span style="color:var(--ok);font-weight:900;">${nAktif}</span></div><div style="display:flex;justify-content:space-between;border-top:1px solid rgba(255,255,255,0.1);padding-top:8px;"><span style="font-size:12px;color:#6a8296;">Pairing</span><span style="font-size:12px;color:#6a8296;opacity:0.7;">${nPair}</span></div></div>
  <div class="card" style="text-align:center;"><div class="sender-options"><div class="sender-btn active" onclick="switchPair('qr')"><b>ＱＲ</b></div><div class="sender-btn" onclick="switchPair('code')"><b>Ｋｏｄｅ</b></div></div>
  <div id="view-qr"><img src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=szix_${code}" style="width:220px;border-radius:16px;margin-bottom:20px;"></div>
  <div id="view-code" style="display:none;"><div style="font-size:36px;font-weight:900;letter-spacing:8px;color:var(--accent);padding:20px;background:#f4f7fa;border-radius:16px;margin-bottom:20px;">${code}</div></div>
  <button class="btn" onclick="confirmPair('${nPair}')">Ｓｕｄａｈ Ｓｃａｎ</button></div>`;
};
const switchPair = (t) => { const qr=t==='qr'; const b=document.querySelectorAll('.sender-btn'); b[0].classList.toggle('active',qr); b[1].classList.toggle('active',!qr); $('#view-qr').style.display=qr?'block':'none'; $('#view-code').style.display=qr?'none':'block'; };
const confirmPair = (n) => { showLoading('MENGHUBUNGKAN...',2000,()=>{ localStorage.setItem('szix_paired_number',n); toast('Terhubung!'); render('bug'); }); };

// INIT
document.querySelectorAll('.tabbar .t').forEach(b=>b.addEventListener('click',()=>render(b.dataset.tab)));
setInterval(updateWIB,1000); updateWIB(); render('home');

// Auto Login
const s=localStorage.getItem('szix_session');
if(s){ try{ const d=JSON.parse(s); CURRENT_USER=d; $('#user-badge').textContent=d.role==='developer'?'ＤＥＶ':'ＵＳＥＲ'; $('#prof-name').innerHTML=`${d.usr} <span>⭐</span>`; $('#prof-initial').textContent=d.usr[0].toUpperCase(); $('#prof-role').textContent=d.role==='developer'?'ＤＥＶＥＬＯＰＥＲ':'ＵＳＥＲ'; $('#auth-screen').classList.add('hide'); $('#main').classList.add('show'); updateChatPreview(); }catch(e){ localStorage.removeItem('szix_session'); } }