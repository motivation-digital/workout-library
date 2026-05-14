function esc(s) {
  return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

const NAV_ITEMS = [
  { key: 'dashboard',  label: 'ДАШБОРД',    icon: 'fa-solid fa-house',       url: 'https://www.dreambody.club/portal' },
  { type: 'section',   label: 'Услуги' },
  { key: 'programmes', label: 'ПРОГРАММЫ',  icon: 'fa-regular fa-calendar',  url: 'https://www.dreambody.club/portal-library' },
  { key: 'workouts',   label: 'ТРЕНИРОВКИ', icon: 'fa-solid fa-dumbbell',    url: 'https://wl.dreambody.club' },
  { key: 'recipes',    label: 'РЕЦЕПТЫ',    icon: 'fa-solid fa-utensils',    url: 'https://rl.dreambody.club' },
  { type: 'section',   label: 'Общение' },
  { key: 'community',  label: 'СООБЩЕСТВО', icon: 'fa-solid fa-users',       url: 'https://www.dreambody.club/products/communities/v2/community3865443/home' },
];

const OLIVE = '#97976A';

function buildSidebarNav(activeKey) {
  const items = NAV_ITEMS.map(item => {
    if (item.type === 'section') {
      return '<div style="padding:14px 16px 4px;font-size:9px;font-weight:700;color:#A0A090;letter-spacing:0.8px;text-transform:uppercase">' + esc(item.label) + '</div>';
    }
    const active = item.key === activeKey;
    const iconColor = active ? OLIVE : '#8A8A82';
    const labelColor = active ? '#3A3A34' : '#6A6A62';
    const bg = active ? '#F7F4EC' : 'transparent';
    const bl = active ? '3px solid ' + OLIVE : '3px solid transparent';
    return '<a href="' + esc(item.url) + '" style="display:flex;align-items:center;gap:10px;padding:8px 16px;text-decoration:none;background:' + bg + ';border-left:' + bl + '">'
      + '<i class="' + item.icon + '" style="width:14px;text-align:center;color:' + iconColor + ';font-size:13px;flex-shrink:0"></i>'
      + '<span style="font-size:15px;font-weight:' + (active ? '600' : '400') + ';color:' + labelColor + ';letter-spacing:0.4px">' + esc(item.label) + '</span>'
      + '</a>';
  }).join('');
  return '<nav id="dbc-sidebar" style="width:240px;min-width:240px;background:#ffffff;border-right:1px solid #DDD9D0;display:flex;flex-direction:column;position:fixed;left:0;top:0;bottom:0;z-index:100;overflow-y:auto;transition:transform 0.3s ease">'
    + '<div style="height:52px;padding:0 16px;display:flex;align-items:center;border-bottom:1px solid #EDEBE4">'
    + '<img src="https://imagedelivery.net/8taA81TQ4UD-fca9BHMP5A/1ce95ac2-a78a-41f1-83d4-768846b3f300/public" alt="DreamBodyClub" style="width:auto;max-width:185px;max-height:44px;display:block">'
    + '</div>'
    + '<div style="display:flex;flex-direction:column;padding:8px 0;flex:1">' + items + '</div>'
    + '</nav>';
}

const PAGE_SHELL_CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{width:100%;max-width:none!important}
body{font-family:'Inter',system-ui,sans-serif;background:#FAFAF5;-webkit-font-smoothing:antialiased}
#dbc-topbar{position:fixed;top:0;left:250px;right:0;height:52px;background:#ffffff;border-bottom:1px solid #DDD9D0;display:flex;align-items:center;padding:0 20px;gap:12px;z-index:99;box-shadow:0 1px 4px rgba(0,0,0,0.04)}
#wl-search-wrap{flex:1;max-width:360px;position:relative}
#wl-search{width:100%;height:36px;padding:0 12px 0 36px;border:1px solid #DDD9D0;border-radius:18px;font-family:inherit;font-size:13px;background:#fff;color:#3A3A34;outline:none;transition:border-color .15s}
#wl-search:focus{border-color:#97976A}
#wl-search-wrap .srch-icon{position:absolute;left:12px;top:50%;transform:translateY(-50%);font-size:13px;color:#8A8A82;pointer-events:none}
#wl-count{font-size:13px;font-weight:600;color:#97976A;white-space:nowrap}
#tb-profile{position:relative;margin-left:auto;flex-shrink:0}
#tb-profile-btn{display:flex;align-items:center;gap:8px;background:none;border:none;cursor:pointer;padding:4px 8px;border-radius:6px;font-family:inherit}
#tb-profile-btn:hover{background:#F7F4EC}
#tb-avatar{width:30px;height:30px;border-radius:50%;background:#97976A;display:flex;align-items:center;justify-content:center;color:#fff;font-size:14px;flex-shrink:0}
#tb-dd{display:none;position:absolute;right:0;top:46px;background:#fff;border:1px solid #DDD9D0;border-radius:6px;min-width:160px;box-shadow:0 4px 12px rgba(0,0,0,0.08);z-index:200}
#tb-dd a{display:block;padding:10px 16px;font-size:13px;color:#3A3A34;text-decoration:none}
#tb-dd a:hover{background:#F7F4EC}
#tb-dd a+a{border-top:1px solid #E8E5DD;color:#6A6A62}
#dbc-main{position:fixed;top:52px;left:250px;right:0;bottom:0;overflow:hidden;display:flex}
#fp-bar{display:none}
#wl-filters{width:220px;min-width:220px;flex-shrink:0;overflow-y:auto;border-right:1px solid #DDD9D0;background:#fff;padding:16px}
.fp-group{margin-bottom:18px}
.fp-label{font-size:11px;font-weight:700;color:#3A3A34;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;display:flex;align-items:center;justify-content:space-between;user-select:none}
details.fp-group>summary.fp-label{list-style:none;cursor:pointer}
details.fp-group>summary.fp-label::-webkit-details-marker{display:none}
details.fp-group>summary.fp-label::after{content:'';display:inline-block;width:7px;height:7px;border-right:1.5px solid #8A8A82;border-bottom:1.5px solid #8A8A82;transform:rotate(45deg);margin-bottom:2px;flex-shrink:0}
details.fp-group[open]>summary.fp-label::after{transform:rotate(-135deg);margin-bottom:-4px}
.fp-pills{display:flex;flex-wrap:nowrap;gap:4px;margin-top:2px}
.fp-pill{flex:1;padding:5px 4px;border-radius:16px;border:1px solid #DDD9D0;background:#F7F4EC;color:#3A3A34;font-size:12px;font-weight:500;cursor:pointer;font-family:inherit;line-height:1.4;text-align:center;transition:all .15s;white-space:nowrap}
.fp-pill:hover{border-color:#97976A;color:#97976A}
.fp-pill.fp-active{background:#97976A;color:#fff;border-color:#97976A}
.fp-checks{display:flex;flex-direction:column;gap:2px;margin-top:4px}
.fp-row{display:flex;align-items:center;gap:8px;padding:5px 4px;cursor:pointer;border-radius:4px}
.fp-row:hover{background:#F7F4EC}
.fp-cb{display:none}
.fp-check{width:16px;height:16px;border:1.5px solid #DDD9D0;border-radius:3px;flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:all .15s}
.fp-cb:checked+.fp-check{background:#97976A;border-color:#97976A}
.fp-cb:checked+.fp-check::after{content:'\\2713';color:#fff;font-size:10px;font-weight:700;line-height:1}
.fp-text{font-size:13px;color:#3A3A34;line-height:1.4}
.fp-reset{display:block;margin-bottom:12px;text-align:center;font-size:12px;color:#97976A;cursor:pointer;text-decoration:none;font-weight:600;padding:6px}
.fp-reset:hover{text-decoration:underline}
#wl-content{flex:1;overflow-y:auto;padding:20px}
#wl-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;align-content:start}
.wc{display:flex;flex-direction:column;background:#fff;border:1px solid #DDD9D0;border-radius:12px;overflow:hidden;text-decoration:none;color:inherit;transition:transform .2s,box-shadow .2s}
.wc:hover{transform:translateY(-2px);box-shadow:0 4px 16px rgba(0,0,0,0.10)}
.wc-img{margin:8px 14px 0;border-radius:8px;border:1px solid #DDD9D0;overflow:hidden;aspect-ratio:16/10;background:#DDD9D0;flex-shrink:0;position:relative}
.wc-img img{width:100%;height:100%;object-fit:cover;display:block}
.wc-play{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .2s}
.wc:hover .wc-play{opacity:1}
.wc-play-btn{width:40px;height:40px;background:rgba(232,228,208,0.90);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:15px;color:#3A3A34}
.wc-body{padding:8px 14px 12px;display:flex;flex-direction:column;flex:1}
.wc-cat{font-size:11px;font-weight:600;color:#97976A;text-transform:uppercase;letter-spacing:0.4px;margin-bottom:4px}
.wc-title{font-size:12px;font-weight:600;color:#3A3A34;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;line-height:1.4;margin-bottom:4px;flex:1}
.wc-stats{display:flex;align-items:center;gap:10px;margin-top:auto;padding-top:6px}
.wc-stat{display:flex;align-items:center;gap:4px;font-size:11px;color:#6A6A62}
.wc-stat i{color:#97976A;font-size:11px}
@media(max-width:1300px){#wl-grid{grid-template-columns:repeat(3,1fr)}}
@media(max-width:900px){#wl-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:600px){#wl-grid{grid-template-columns:1fr}}
@media(max-width:1440px){
  #dbc-sidebar{transform:translateX(-240px)}
  #dbc-chk:checked~#dbc-sidebar{transform:translateX(0)}
  #dbc-topbar{left:0!important;padding-left:60px}
  #dbc-main{left:0!important}
  #dbc-ham{display:flex!important}
  #dbc-chk:checked~#dbc-ham{left:248px!important}
  #dbc-chk:checked~#dbc-overlay{display:block!important}
}
@media(max-width:700px){
  #dbc-main{flex-direction:column;overflow:hidden}
  #fp-bar{display:flex;align-items:center;justify-content:space-between;padding:10px 16px;border-bottom:1px solid #DDD9D0;background:#fff;flex-shrink:0}
  #fp-toggle{display:flex;align-items:center;gap:6px;padding:6px 14px;border:1px solid #DDD9D0;border-radius:16px;background:#F7F4EC;color:#3A3A34;font-family:inherit;font-size:13px;font-weight:500;cursor:pointer}
  #fp-toggle i{color:#97976A}
  #wl-filters{display:none;width:100%;border-right:none;border-bottom:1px solid #DDD9D0;max-height:55vh;flex-shrink:0}
  #wl-filters.fp-open{display:block}
  #wl-content{flex:1;overflow-y:auto;min-height:0}
  #wl-count{display:none}
}
`;

const PAGE_SHELL_HEAD = (title) => `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${esc(title)}</title>
<link rel="icon" href="https://imagedelivery.net/8taA81TQ4UD-fca9BHMP5A/1ce95ac2-a78a-41f1-83d4-768846b3f300/public">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<script src="https://kit.fontawesome.com/bfec434db1.js" crossorigin="anonymous"><\/script>
<style>${PAGE_SHELL_CSS}</style>
</head>`;

export function renderDashboard(workouts, categories) {
  const sidebar = buildSidebarNav('workouts');

  // Duration filter pills
  const durPills = [
    { id: 'dur1', label: '< 30 мин', min: 0, max: 29 },
    { id: 'dur2', label: '30–60 мин', min: 30, max: 60 },
    { id: 'dur3', label: '> 60 мин', min: 61, max: 9999 },
  ].map(d =>
    '<button class="fp-pill" data-dur-min="' + d.min + '" data-dur-max="' + d.max + '" onclick="toggleDurPill(this)">' + d.label + '</button>'
  ).join('');

  // Category filter checkboxes (dynamic from DB)
  const catChecks = categories.map(cat =>
    '<label class="fp-row"><input class="fp-cb" type="checkbox" data-cat="' + esc(cat) + '" onchange="applyFilters()"><span class="fp-check"></span><span class="fp-text">' + esc(cat) + '</span></label>'
  ).join('');

  const filterHtml = `
    <div class="fp-group"><div class="fp-label">Время</div><div class="fp-pills">${durPills}</div></div>
    <details class="fp-group" open><summary class="fp-label">Категория</summary><div class="fp-checks">${catChecks}</div></details>
  `;

  // Cards
  const cardsHtml = workouts.map(w => {
    const dur = w.duration_min ? `<span class="wc-stat"><i class="fa-regular fa-clock"></i>${w.duration_min} мин</span>` : '';
    const hasVideo = w.wistia_id ? `<span class="wc-stat"><i class="fa-solid fa-play"></i>Видео</span>` : '';
    const img = w.image_url
      ? `<img src="${esc(w.image_url)}" alt="${esc(w.title)}" loading="lazy">`
      : `<div style="width:100%;height:100%;background:linear-gradient(135deg,#e8e2d4,#d4cebc)"></div>`;
    const playOverlay = `<div class="wc-play"><div class="wc-play-btn"><i class="fa-solid fa-play" style="margin-left:2px"></i></div></div>`;
    const durVal = w.duration_min ? String(w.duration_min) : '0';
    return `<a class="wc" href="/${esc(w.kajabi_post_id)}" data-title="${esc(w.title.toLowerCase())}" data-cat="${esc(w.category || '')}" data-dur="${durVal}">
  <div class="wc-img">${img}${playOverlay}</div>
  <div class="wc-body">
    <div class="wc-cat">${esc(w.category || '')}</div>
    <div class="wc-title">${esc(w.title)}</div>
    <div class="wc-stats">${dur}${hasVideo}</div>
  </div>
</a>`;
  }).join('\n');

  return `${PAGE_SHELL_HEAD('DreamBodyClub — Тренировки')}
<body>
<input type="checkbox" id="dbc-chk" style="position:fixed;opacity:0;pointer-events:none;z-index:-1">
<label for="dbc-chk" id="dbc-ham" style="display:none;position:fixed;top:10px;left:10px;z-index:102;align-items:center;justify-content:center;cursor:pointer;padding:6px;border-radius:4px"><i class="fa-solid fa-bars" style="font-size:32px;color:#3A3A34"></i></label>
${sidebar}
<div id="dbc-topbar">
  <div id="wl-search-wrap">
    <i class="fa-solid fa-magnifying-glass srch-icon"></i>
    <input id="wl-search" type="text" placeholder="Поиск тренировок" oninput="applyFilters()">
  </div>
  <span id="wl-count">${workouts.length} тренировок</span>
  <div id="tb-profile">
    <button id="tb-profile-btn" onclick="var d=document.getElementById('tb-dd');d.style.display=d.style.display==='block'?'none':'block'">
      <div id="tb-avatar"><i class="fa-solid fa-user"></i></div>
      <i class="fa-solid fa-chevron-down" style="font-size:10px;color:#8A8A82;margin-left:2px"></i>
    </button>
    <div id="tb-dd">
      <a href="https://www.dreambody.club/profile">Профиль</a>
      <a href="https://www.dreambody.club/logout">Выйти</a>
    </div>
  </div>
</div>
<label for="dbc-chk" id="dbc-overlay" style="display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.4);z-index:98"></label>
<main id="dbc-main">
  <div id="fp-bar">
    <button id="fp-toggle" onclick="document.getElementById('wl-filters').classList.toggle('fp-open')"><i class="fa-solid fa-sliders"></i> Фильтры</button>
    <span id="mob-count" style="font-size:13px;font-weight:600;color:#97976A">${workouts.length} тренировок</span>
  </div>
  <div id="wl-filters">
    <a href="#" class="fp-reset" onclick="resetFilters();return false">Сбросить фильтры</a>
    ${filterHtml}
  </div>
  <div id="wl-content">
    <div id="wl-grid">${cardsHtml}</div>
  </div>
</main>
<script>
var _durMin=null,_durMax=null;
var _cards,_cnt,_mcnt,_srch;
function _init(){
  _cards=document.querySelectorAll('.wc');
  _cnt=document.getElementById('wl-count');
  _mcnt=document.getElementById('mob-count');
  _srch=document.getElementById('wl-search');
}
function toggleDurPill(btn){
  var active=btn.classList.contains('fp-active');
  document.querySelectorAll('.fp-pill').forEach(function(p){p.classList.remove('fp-active')});
  if(!active){
    btn.classList.add('fp-active');
    _durMin=parseInt(btn.dataset.durMin);
    _durMax=parseInt(btn.dataset.durMax);
  } else {_durMin=null;_durMax=null;}
  applyFilters();
}
function applyFilters(){
  if(!_cards)_init();
  var q=(_srch.value||'').toLowerCase().trim();
  var cats=new Set();
  document.querySelectorAll('.fp-cb:checked[data-cat]').forEach(function(cb){cats.add(cb.dataset.cat)});
  var vis=0;
  _cards.forEach(function(c){
    var ok=true;
    if(q && !c.dataset.title.includes(q)) ok=false;
    if(ok && cats.size && !cats.has(c.dataset.cat)) ok=false;
    if(ok && _durMin!==null){
      var d=parseInt(c.dataset.dur||'0');
      if(d<_durMin||d>_durMax) ok=false;
    }
    c.style.display=ok?'':'none';
    if(ok)vis++;
  });
  var t=vis+' тренировок';
  if(_cnt)_cnt.textContent=t;
  if(_mcnt)_mcnt.textContent=t;
}
function resetFilters(){
  if(!_cards)_init();
  _durMin=null;_durMax=null;
  document.querySelectorAll('.fp-pill').forEach(function(p){p.classList.remove('fp-active')});
  document.querySelectorAll('.fp-cb').forEach(function(cb){cb.checked=false});
  if(_srch)_srch.value='';
  _cards.forEach(function(c){c.style.display=''});
  var t='${workouts.length} тренировок';
  if(_cnt)_cnt.textContent=t;
  if(_mcnt)_mcnt.textContent=t;
}
document.addEventListener('click',function(e){
  var dd=document.getElementById('tb-dd');
  if(dd&&!e.target.closest('#tb-profile'))dd.style.display='none';
});
</script>
</body></html>`;
}

export function renderWorkoutPage(w) {
  const sidebar = buildSidebarNav('workouts');
  const videoEmbed = w.wistia_id
    ? `<div style="aspect-ratio:16/9;border-radius:12px;overflow:hidden;margin-bottom:24px;background:#000">
        <iframe src="https://fast.wistia.net/embed/iframe/${esc(w.wistia_id)}?videoFoam=true" allowtransparency="true" frameborder="0" scrolling="no" allowfullscreen style="width:100%;height:100%;display:block"></iframe>
      </div>`
    : w.image_url
      ? `<div style="aspect-ratio:16/9;border-radius:12px;overflow:hidden;margin-bottom:24px;position:relative">
          <img src="${esc(w.image_url)}" alt="${esc(w.title)}" style="width:100%;height:100%;object-fit:cover;display:block">
          ${w.kajabi_url ? `<a href="${esc(w.kajabi_url)}" target="_blank" rel="noopener" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.35);text-decoration:none"><div style="width:60px;height:60px;background:rgba(232,228,208,0.90);border-radius:50%;display:flex;align-items:center;justify-content:center"><i class="fa-solid fa-play" style="font-size:20px;color:#3A3A34;margin-left:4px"></i></div></a>` : ''}
        </div>`
      : '';

  const metaItems = [
    w.category ? `<span style="display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border:1px solid #DDD9D0;border-radius:20px;font-size:13px;color:#3A3A34;background:#fff"><i class="fa-solid fa-layer-group" style="color:#97976A;font-size:12px"></i>${esc(w.category)}</span>` : '',
    w.duration_min ? `<span style="display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border:1px solid #DDD9D0;border-radius:20px;font-size:13px;color:#3A3A34;background:#fff"><i class="fa-regular fa-clock" style="color:#97976A;font-size:12px"></i>${w.duration_min} мин</span>` : '',
    w.wistia_id ? `<span style="display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border:1px solid #DDD9D0;border-radius:20px;font-size:13px;color:#3A3A34;background:#fff"><i class="fa-solid fa-video" style="color:#97976A;font-size:12px"></i>Видео</span>` : '',
  ].filter(Boolean).join('');

  const kajabiFallback = !w.wistia_id && w.kajabi_url
    ? `<a href="${esc(w.kajabi_url)}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:8px;margin-top:20px;padding:10px 20px;background:#97976A;color:#fff;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600"><i class="fa-solid fa-arrow-up-right-from-square"></i> Открыть в Kajabi</a>`
    : '';

  const pageCss = `
    #wp-main{position:fixed;top:52px;left:250px;right:0;bottom:0;overflow-y:auto}
    #wp-content{max-width:760px;margin:0 auto;padding:32px 24px 60px}
    @media(max-width:1440px){
      #dbc-sidebar{transform:translateX(-240px)}
      #dbc-chk:checked~#dbc-sidebar{transform:translateX(0)}
      #dbc-topbar{left:0!important;padding-left:60px}
      #wp-main{left:0!important}
      #dbc-ham{display:flex!important}
      #dbc-chk:checked~#dbc-ham{left:248px!important}
      #dbc-chk:checked~#dbc-overlay{display:block!important}
    }
  `;

  return `${PAGE_SHELL_HEAD(w.title + ' — Библиотека тренировок')}
<style>${pageCss}</style>
<body>
<input type="checkbox" id="dbc-chk" style="position:fixed;opacity:0;pointer-events:none;z-index:-1">
<label for="dbc-chk" id="dbc-ham" style="display:none;position:fixed;top:10px;left:10px;z-index:102;align-items:center;justify-content:center;cursor:pointer;padding:6px;border-radius:4px"><i class="fa-solid fa-bars" style="font-size:32px;color:#3A3A34"></i></label>
${sidebar}
<div id="dbc-topbar" style="left:250px">
  <a href="/" style="display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:600;color:#97976A;text-decoration:none">
    <i class="fa-solid fa-arrow-left" style="font-size:11px"></i> Все тренировки
  </a>
  <div id="tb-profile" style="margin-left:auto">
    <button id="tb-profile-btn" onclick="var d=document.getElementById('tb-dd');d.style.display=d.style.display==='block'?'none':'block'">
      <div id="tb-avatar"><i class="fa-solid fa-user"></i></div>
      <i class="fa-solid fa-chevron-down" style="font-size:10px;color:#8A8A82;margin-left:2px"></i>
    </button>
    <div id="tb-dd">
      <a href="https://www.dreambody.club/profile">Профиль</a>
      <a href="https://www.dreambody.club/logout">Выйти</a>
    </div>
  </div>
</div>
<label for="dbc-chk" id="dbc-overlay" style="display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.4);z-index:98"></label>
<main id="wp-main">
  <div id="wp-content">
    <div style="font-size:12px;color:#97976A;text-transform:uppercase;letter-spacing:0.5px;font-weight:700;margin-bottom:10px">${esc(w.category || 'Тренировка')}</div>
    <h1 style="font-size:24px;font-weight:700;color:#252420;line-height:1.25;margin-bottom:16px">${esc(w.title)}</h1>
    ${metaItems ? `<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:24px">${metaItems}</div>` : ''}
    ${videoEmbed}
    ${w.description ? `<div style="font-size:15px;line-height:1.7;color:#3A3A34;border-top:1px solid #E8E5DD;padding-top:24px">${esc(w.description)}</div>` : ''}
    ${kajabiFallback}
  </div>
</main>
<script>
document.addEventListener('click',function(e){
  var dd=document.getElementById('tb-dd');
  if(dd&&!e.target.closest('#tb-profile'))dd.style.display='none';
});
</script>
</body></html>`;
}
