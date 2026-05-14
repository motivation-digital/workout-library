function safeJson(str, fallback) {
  try { return JSON.parse(str); } catch { return fallback; }
}
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

const FILTER_GROUPS = [
  { id: 'wf1', label: 'Время', type: 'pills', tags: [
    { id: 'wf1t1', label: '15 мин' },
    { id: 'wf1t2', label: '30 мин' },
    { id: 'wf1t3', label: '45 мин' },
    { id: 'wf1t4', label: '60 мин' },
  ]},
  { id: 'wf2', label: 'Интенсивность', type: 'accordion', open: true, tags: [
    { id: 'wf2t1', label: 'Низкая' },
    { id: 'wf2t2', label: 'Средняя' },
    { id: 'wf2t3', label: 'Высокая' },
  ]},
  { id: 'wf3', label: 'Ваш уровень', type: 'accordion', open: true, tags: [
    { id: 'wf3t1', label: 'Начинающий' },
    { id: 'wf3t2', label: 'Средний' },
    { id: 'wf3t3', label: 'Продвинутый' },
  ]},
  { id: 'wf4', label: 'Часть тела', type: 'accordion', open: true, tags: [
    { id: 'wf4t1', label: 'Всё тело' },
    { id: 'wf4t2', label: 'Руки' },
    { id: 'wf4t3', label: 'Грудь' },
    { id: 'wf4t4', label: 'Спина' },
    { id: 'wf4t5', label: 'Пресс' },
    { id: 'wf4t6', label: 'Ягодицы' },
    { id: 'wf4t7', label: 'Ноги' },
    { id: 'wf4t8', label: 'Тазовое дно' },
  ]},
  { id: 'wf5', label: 'Тип тренировки', type: 'accordion', open: false, tags: [
    { id: 'wf5t1',  label: 'Силовая' },
    { id: 'wf5t2',  label: 'Кардио-сила' },
    { id: 'wf5t3',  label: 'Кардио' },
    { id: 'wf5t4',  label: 'Растяжка' },
    { id: 'wf5t5',  label: 'Мобильность' },
    { id: 'wf5t6',  label: 'Разминка' },
    { id: 'wf5t7',  label: 'Заминка' },
    { id: 'wf5t8',  label: 'Координация' },
    { id: 'wf5t9',  label: 'Пилатес' },
    { id: 'wf5t10', label: 'Фит-тест' },
    { id: 'wf5t11', label: 'Восстановление' },
  ]},
  { id: 'wf6', label: 'Программы', type: 'accordion', open: false, tags: [
    { id: 'wf6t1',  label: 'Основы (для начинающих)' },
    { id: 'wf6t2',  label: 'Похудение' },
    { id: 'wf6t3',  label: 'Тонус' },
    { id: 'wf6t4',  label: 'Вызов 21' },
    { id: 'wf6t5',  label: 'Пятиминутки' },
    { id: 'wf6t6',  label: 'Осанка' },
    { id: 'wf6t7',  label: 'Йога-фит' },
    { id: 'wf6t8',  label: 'Шпагаты' },
    { id: 'wf6t9',  label: 'Про-живот' },
    { id: 'wf6t10', label: 'Гибкая спина' },
    { id: 'wf6t11', label: 'Летний кач' },
  ]},
  { id: 'wf7', label: 'Инвентарь', type: 'accordion', open: false, tags: [
    { id: 'wf7t1',  label: 'Без инвентаря' },
    { id: 'wf7t2',  label: 'Гантели' },
    { id: 'wf7t3',  label: 'Резинка' },
    { id: 'wf7t4',  label: 'Блоки' },
    { id: 'wf7t5',  label: 'Палка' },
    { id: 'wf7t6',  label: 'Ремень' },
    { id: 'wf7t7',  label: 'Фоам-роллер' },
    { id: 'wf7t8',  label: 'Мяч' },
    { id: 'wf7t9',  label: 'Стул' },
    { id: 'wf7t10', label: 'Утяжелители' },
    { id: 'wf7t11', label: 'Фитбол' },
    { id: 'wf7t12', label: 'Слайдеры' },
  ]},
];

// Kajabi filter_tags string values → tag IDs
const TAG_MAP = {
  '15 мин': 'wf1t1', '30 мин': 'wf1t2', '45 мин': 'wf1t3', '60 мин': 'wf1t4',
  'низкая': 'wf2t1', 'средняя': 'wf2t2', 'высокая': 'wf2t3',
  'начинающий': 'wf3t1', 'средний': 'wf3t2', 'продвинутый': 'wf3t3',
  'всё тело': 'wf4t1', 'руки': 'wf4t2', 'грудь': 'wf4t3', 'спина': 'wf4t4',
  'пресс': 'wf4t5', 'ягодицы': 'wf4t6', 'ноги': 'wf4t7', 'тазовое дно': 'wf4t8',
  'силовая': 'wf5t1', 'кардио-сила': 'wf5t2', 'кардио': 'wf5t3', 'растяжка': 'wf5t4',
  'мобильность': 'wf5t5', 'разминка': 'wf5t6', 'заминка': 'wf5t7', 'координация': 'wf5t8',
  'пилатес': 'wf5t9', 'фит-тест': 'wf5t10', 'восстановление': 'wf5t11',
  'основы (для начинающих)': 'wf6t1', 'похудение': 'wf6t2', 'тонус': 'wf6t3',
  'вызов 21': 'wf6t4', 'пятиминутки': 'wf6t5', 'осанка': 'wf6t6', 'йога-фит': 'wf6t7',
  'шпагаты': 'wf6t8', 'про-живот': 'wf6t9', 'гибкая спина': 'wf6t10', 'летний кач': 'wf6t11',
  'без инвентаря': 'wf7t1', 'гантели': 'wf7t2', 'резинка': 'wf7t3', 'блоки': 'wf7t4',
  'палка': 'wf7t5', 'ремень': 'wf7t6', 'фоам-роллер': 'wf7t7', 'мяч': 'wf7t8',
  'стул': 'wf7t9', 'утяжелители': 'wf7t10', 'фитбол': 'wf7t11', 'слайдеры': 'wf7t12',
};

function getTagIds(workout) {
  const raw = safeJson(workout.filter_tags, []);
  const ids = Array.isArray(raw)
    ? raw.map(t => TAG_MAP[String(t).toLowerCase().trim()]).filter(Boolean)
    : [];
  // Infer time bucket from duration_min when filter_tags has no time tag
  if (!ids.some(t => t.startsWith('wf1')) && workout.duration_min) {
    const d = Number(workout.duration_min);
    if (d <= 20) ids.push('wf1t1');
    else if (d <= 35) ids.push('wf1t2');
    else if (d <= 52) ids.push('wf1t3');
    else ids.push('wf1t4');
  }
  return ids;
}

// ── DBC nav sidebar (index page) ─────────────────────────────────────────────
function buildSidebarNav() {
  const olive = '#97976A';
  const items = NAV_ITEMS.map(item => {
    if (item.type === 'section') {
      return '<div style="padding:14px 16px 4px;font-size:9px;font-weight:700;color:#A0A090;letter-spacing:0.8px;text-transform:uppercase">' + esc(item.label) + '</div>';
    }
    const active = item.key === 'workouts';
    const iconColor = active ? olive : '#8A8A82';
    const labelColor = active ? '#3A3A34' : '#6A6A62';
    const bg = active ? '#F7F4EC' : 'transparent';
    const bl = active ? '3px solid ' + olive : '3px solid transparent';
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

// ── Filter sidebar (post page — replaces DBC nav) ─────────────────────────────
function buildWorkoutFilterSidebar(activeTagSet) {
  const logo = '<div style="height:52px;padding:0 16px;display:flex;align-items:center;border-bottom:1px solid #EDEBE4;flex-shrink:0">'
    + '<img src="https://imagedelivery.net/8taA81TQ4UD-fca9BHMP5A/1ce95ac2-a78a-41f1-83d4-768846b3f300/public" alt="DreamBodyClub" style="width:auto;max-width:185px;max-height:44px;display:block">'
    + '</div>';

  let filters = '<div style="padding:16px;flex:1;overflow-y:auto">';
  filters += '<a href="/" style="display:flex;align-items:center;gap:5px;margin-bottom:16px;font-size:12px;font-weight:600;color:#97976A;text-decoration:none;padding:4px 2px">'
    + '<i class="fa-solid fa-arrow-left" style="font-size:10px"></i> Все тренировки</a>';

  FILTER_GROUPS.forEach(grp => {
    if (grp.type === 'pills') {
      filters += '<div class="fp-group"><div class="fp-label">' + esc(grp.label) + '</div><div class="fp-pills">';
      grp.tags.forEach(t => {
        const on = activeTagSet.has(t.id) ? ' fp-active' : '';
        filters += '<a href="/?f=' + t.id + '" class="fp-pill' + on + '" style="text-decoration:none">' + esc(t.label) + '</a>';
      });
      filters += '</div></div>';
    } else {
      filters += '<details class="fp-group" open><summary class="fp-label">' + esc(grp.label) + '</summary><div class="fp-checks">';
      grp.tags.forEach(t => {
        const on = activeTagSet.has(t.id);
        filters += '<a href="/?f=' + t.id + '" class="fp-row" style="text-decoration:none">'
          + '<span class="fp-check' + (on ? ' fp-ck-on' : '') + '">' + (on ? '✓' : '') + '</span>'
          + '<span class="fp-text">' + esc(t.label) + '</span>'
          + '</a>';
      });
      filters += '</div></details>';
    }
  });

  filters += '</div>';
  return '<nav id="dbc-sidebar" style="width:240px;min-width:240px;background:#ffffff;border-right:1px solid #DDD9D0;display:flex;flex-direction:column;position:fixed;left:0;top:0;bottom:0;z-index:100;transition:transform 0.3s ease">'
    + logo + filters + '</nav>';
}

// ── Shared CSS ────────────────────────────────────────────────────────────────
const SHELL_CSS = `
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
#wl-filters{width:240px;min-width:240px;flex-shrink:0;overflow-y:auto;border-right:1px solid #DDD9D0;background:#fff;padding:16px}
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
.fp-ck-on{background:#97976A;border-color:#97976A;color:#fff;font-size:10px;font-weight:700}
.fp-text{font-size:13px;color:#3A3A34;line-height:1.4}
.fp-reset{display:block;margin-bottom:8px;text-align:center;font-size:12px;color:#97976A;cursor:pointer;text-decoration:none;font-weight:600;padding:6px}
.fp-reset:hover{text-decoration:underline}
#wl-content{flex:1;overflow-y:auto;padding:20px}
#wl-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;align-content:start}
.wc{display:flex;flex-direction:column;background:#fff;border:1px solid #DDD9D0;border-radius:12px;overflow:hidden;text-decoration:none;color:inherit;transition:transform .2s,box-shadow .2s}
.wc:hover{transform:translateY(-2px);box-shadow:0 4px 16px rgba(0,0,0,0.10)}
.wc-img{margin:8px 14px 0;border-radius:8px;border:1px solid #DDD9D0;overflow:hidden;aspect-ratio:16/10;background:#DDD9D0;flex-shrink:0}
.wc-img img{width:100%;height:100%;object-fit:cover;display:block}
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

const SHELL_HEAD = (title) => `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${esc(title)}</title>
<link rel="icon" href="https://imagedelivery.net/8taA81TQ4UD-fca9BHMP5A/1ce95ac2-a78a-41f1-83d4-768846b3f300/public">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<script src="https://kit.fontawesome.com/bfec434db1.js" crossorigin="anonymous"><\/script>
<style>${SHELL_CSS}</style>
</head>`;

export function renderDashboard(workouts, categories) {
  const sidebar = buildSidebarNav();

  // ── Filter panel HTML ───────────────────────────────────────────────────────
  const filterHtml = FILTER_GROUPS.map(grp => {
    if (grp.type === 'pills') {
      const pills = grp.tags.map(t =>
        '<button class="fp-pill" data-grp="' + grp.id + '" data-tag="' + t.id + '" onclick="togglePill(this,\'' + grp.id + '\',\'' + t.id + '\')">' + esc(t.label) + '</button>'
      ).join('');
      return '<div class="fp-group"><div class="fp-label">' + esc(grp.label) + '</div><div class="fp-pills">' + pills + '</div></div>';
    }
    const checks = grp.tags.map(t =>
      '<label class="fp-row"><input class="fp-cb" type="checkbox" data-grp="' + grp.id + '" data-tag="' + t.id + '" onchange="toggleCheck(this,\'' + grp.id + '\',\'' + t.id + '\')"><span class="fp-check"></span><span class="fp-text">' + esc(t.label) + '</span></label>'
    ).join('');
    const openAttr = grp.open !== false ? ' open' : '';
    return '<details class="fp-group"' + openAttr + '><summary class="fp-label">' + esc(grp.label) + '</summary><div class="fp-checks">' + checks + '</div></details>';
  }).join('');

  // ── Cards ───────────────────────────────────────────────────────────────────
  const cardsHtml = workouts.map(w => {
    const tags = getTagIds(w);
    const tagsAttr = JSON.stringify(tags).replace(/"/g, '&quot;');
    const dur = w.duration_min ? `<span class="wc-stat"><i class="fa-regular fa-clock"></i>${w.duration_min} мин</span>` : '';
    const vid = w.wistia_id ? `<span class="wc-stat"><i class="fa-solid fa-play"></i>Видео</span>` : '';
    const img = w.image_url
      ? `<img src="${esc(w.image_url)}" alt="${esc(w.title)}" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block">`
      : `<div style="width:100%;height:100%;background:#DDD9D0"></div>`;
    return `<a class="wc" href="/${esc(w.kajabi_post_id)}" data-slug="${esc(w.kajabi_post_id)}" data-title="${esc(w.title.toLowerCase())}" data-tags="${tagsAttr}">
  <div class="wc-img">${img}</div>
  <div class="wc-body">
    <div class="wc-cat">${esc(w.category || '')}</div>
    <div class="wc-title">${esc(w.title)}</div>
    <div class="wc-stats">${dur}${vid}</div>
  </div>
</a>`;
  }).join('\n');

  const grpKeys = FILTER_GROUPS.map(g => g.id);
  const afInit = '{' + grpKeys.map(k => k + ':new Set()').join(',') + '}';

  return `${SHELL_HEAD('DreamBodyClub — Тренировки')}
<body>
<input type="checkbox" id="dbc-chk" style="position:fixed;opacity:0;pointer-events:none;z-index:-1">
<label for="dbc-chk" id="dbc-ham" style="display:none;position:fixed;top:10px;left:10px;z-index:102;align-items:center;justify-content:center;cursor:pointer;padding:6px;border-radius:4px"><i class="fa-solid fa-bars" style="font-size:32px;color:#3A3A34"></i></label>
${sidebar}
<div id="dbc-topbar">
  <div id="wl-search-wrap">
    <i class="fa-solid fa-magnifying-glass srch-icon"></i>
    <input id="wl-search" type="text" placeholder="Быстрый поиск">
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
var _af=${afInit};
var _grpKeys=${JSON.stringify(grpKeys)};
var _cards,_cnt,_mcnt,_srch;
function _init(){
  _cards=document.querySelectorAll('.wc');
  _cnt=document.getElementById('wl-count');
  _mcnt=document.getElementById('mob-count');
  _srch=document.getElementById('wl-search');
}
function applyFilters(){
  if(!_cards)_init();
  var q=(_srch?_srch.value:'').toLowerCase().trim();
  var vis=0;
  _cards.forEach(function(c){
    var tags=JSON.parse(c.dataset.tags||'[]');
    var tm=!q||c.dataset.title.indexOf(q)!==-1;
    var fm=true;
    for(var i=0;i<_grpKeys.length;i++){
      var sel=_af[_grpKeys[i]];
      if(!sel.size)continue;
      var hit=false;
      sel.forEach(function(t){if(tags.indexOf(t)!==-1)hit=true;});
      if(!hit){fm=false;break;}
    }
    var show=tm&&fm;
    c.style.display=show?'':'none';
    if(show)vis++;
  });
  var label=vis+' тренировок';
  if(_cnt)_cnt.textContent=label;
  if(_mcnt)_mcnt.textContent=label;
}
function togglePill(btn,grp,tag){
  var sel=_af[grp];
  if(sel.has(tag)){
    sel.delete(tag);btn.classList.remove('fp-active');
  } else {
    sel.clear();
    document.querySelectorAll('.fp-pill[data-grp="'+grp+'"]').forEach(function(b){b.classList.remove('fp-active');});
    sel.add(tag);btn.classList.add('fp-active');
  }
  applyFilters();
}
function toggleCheck(cb,grp,tag){
  if(cb.checked)_af[grp].add(tag);else _af[grp].delete(tag);
  applyFilters();
}
function resetFilters(){
  _grpKeys.forEach(function(k){_af[k].clear();});
  document.querySelectorAll('.fp-pill').forEach(function(b){b.classList.remove('fp-active');});
  document.querySelectorAll('.fp-cb').forEach(function(cb){cb.checked=false;});
  if(_srch)_srch.value='';
  applyFilters();
}
document.addEventListener('DOMContentLoaded',function(){
  _init();
  _srch.addEventListener('input',applyFilters);
  document.addEventListener('click',function(e){
    var dd=document.getElementById('tb-dd');
    if(dd&&!document.getElementById('tb-profile').contains(e.target))dd.style.display='none';
  });
  var params=new URLSearchParams(window.location.search);
  var f=params.get('f');
  if(f){
    var pill=document.querySelector('.fp-pill[data-tag="'+f+'"]');
    if(pill){_af[pill.dataset.grp].add(f);pill.classList.add('fp-active');}
    else{
      var cb=document.querySelector('.fp-cb[data-tag="'+f+'"]');
      if(cb){cb.checked=true;_af[cb.dataset.grp].add(f);var dt=cb.closest('details.fp-group');if(dt)dt.open=true;}
    }
    applyFilters();
  }
  var qp=params.get('q');
  if(qp){_srch.value=qp;applyFilters();}
});
<\/script>
</body></html>`;
}

export function renderWorkoutPage(w) {
  const activeTags = new Set(getTagIds(w));
  const sidebar = buildWorkoutFilterSidebar(activeTags);

  const pageCss = `
#wp-topbar{position:fixed;top:0;left:250px;right:0;height:52px;background:#ffffff;border-bottom:1px solid #DDD9D0;display:flex;align-items:center;padding:0 20px;z-index:99;box-shadow:0 1px 4px rgba(0,0,0,0.04)}
#wp-main{margin-left:250px;margin-top:52px}
#wp-content{max-width:800px;margin:0 auto;padding:32px 24px 80px}
.wp-tag{display:inline-flex;align-items:center;gap:6px;padding:5px 14px;border:1px solid #DDD9D0;border-radius:20px;font-size:13px;color:#3A3A34;background:#fff}
.wp-tag i{color:#97976A;font-size:12px}
@media(max-width:1440px){
  #dbc-sidebar{transform:translateX(-240px)}
  #dbc-chk:checked~#dbc-sidebar{transform:translateX(0)}
  #wp-topbar{left:0!important;padding-left:60px}
  #wp-main{margin-left:0}
  #dbc-ham{display:flex!important}
  #dbc-chk:checked~#dbc-ham{left:248px!important}
  #dbc-chk:checked~#dbc-overlay{display:block!important}
}
@media(max-width:600px){#wp-content{padding:20px 16px 60px}}
`;

  const videoSection = w.wistia_id
    ? `<div style="aspect-ratio:16/9;border-radius:12px;overflow:hidden;margin-bottom:28px;background:#1a1a1a;box-shadow:0 4px 24px rgba(0,0,0,0.12)">
        <iframe src="https://fast.wistia.net/embed/iframe/${esc(w.wistia_id)}?videoFoam=true" allowtransparency="true" frameborder="0" scrolling="no" allowfullscreen style="width:100%;height:100%;display:block"></iframe>
      </div>`
    : w.image_url
      ? `<div style="aspect-ratio:16/9;border-radius:12px;overflow:hidden;margin-bottom:28px;position:relative;box-shadow:0 4px 24px rgba(0,0,0,0.10)">
          <img src="${esc(w.image_url)}" alt="${esc(w.title)}" style="width:100%;height:100%;object-fit:cover;display:block">
          ${w.kajabi_url ? `<a href="${esc(w.kajabi_url)}" target="_blank" rel="noopener" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.28);text-decoration:none"><div style="width:60px;height:60px;background:rgba(250,250,245,0.92);border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 12px rgba(0,0,0,0.15)"><i class="fa-solid fa-play" style="font-size:20px;color:#3A3A34;margin-left:4px"></i></div></a>` : ''}
        </div>`
      : '';

  const metaTags = [
    w.category ? `<span class="wp-tag"><i class="fa-solid fa-layer-group"></i>${esc(w.category)}</span>` : '',
    w.duration_min ? `<span class="wp-tag"><i class="fa-regular fa-clock"></i>${w.duration_min} мин</span>` : '',
    w.wistia_id ? `<span class="wp-tag"><i class="fa-solid fa-video"></i>Видео</span>` : '',
  ].filter(Boolean).join('');

  const kajabiFallback = !w.wistia_id && w.kajabi_url
    ? `<div style="margin-top:28px"><a href="${esc(w.kajabi_url)}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:8px;padding:12px 24px;background:#97976A;color:#fff;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600"><i class="fa-solid fa-arrow-up-right-from-square"></i> Открыть тренировку</a></div>`
    : '';

  return `${SHELL_HEAD(w.title + ' — Тренировки')}
<style>${pageCss}</style>
<body>
<input type="checkbox" id="dbc-chk" style="position:fixed;opacity:0;pointer-events:none;z-index:-1">
<label for="dbc-chk" id="dbc-ham" style="display:none;position:fixed;top:10px;left:10px;z-index:102;align-items:center;justify-content:center;cursor:pointer;padding:6px;border-radius:4px"><i class="fa-solid fa-bars" style="font-size:32px;color:#3A3A34"></i></label>
${sidebar}
<div id="wp-topbar">
  <div id="tb-profile" style="margin-left:auto">
    <button id="tb-profile-btn" style="display:flex;align-items:center;gap:8px;background:none;border:none;cursor:pointer;padding:4px 8px;border-radius:6px;font-family:inherit" onclick="var d=document.getElementById('tb-dd');d.style.display=d.style.display==='block'?'none':'block'">
      <div id="tb-avatar" style="width:30px;height:30px;border-radius:50%;background:#97976A;display:flex;align-items:center;justify-content:center;color:#fff;font-size:14px"><i class="fa-solid fa-user"></i></div>
      <i class="fa-solid fa-chevron-down" style="font-size:10px;color:#8A8A82;margin-left:2px"></i>
    </button>
    <div id="tb-dd" style="display:none;position:absolute;right:20px;top:46px;background:#fff;border:1px solid #DDD9D0;border-radius:6px;min-width:160px;box-shadow:0 4px 12px rgba(0,0,0,0.08);z-index:200">
      <a href="https://www.dreambody.club/profile" style="display:block;padding:10px 16px;font-size:13px;color:#3A3A34;text-decoration:none">Профиль</a>
      <a href="https://www.dreambody.club/logout" style="display:block;padding:10px 16px;font-size:13px;color:#6A6A62;text-decoration:none;border-top:1px solid #E8E5DD">Выйти</a>
    </div>
  </div>
</div>
<label for="dbc-chk" id="dbc-overlay" style="display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.4);z-index:98"></label>
<main id="wp-main">
  <div id="wp-content">
    ${w.category ? `<div style="font-size:11px;font-weight:700;color:#97976A;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:10px">${esc(w.category)}</div>` : ''}
    <h1 style="font-size:26px;font-weight:700;color:#252420;line-height:1.25;margin-bottom:16px">${esc(w.title)}</h1>
    ${metaTags ? `<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:24px">${metaTags}</div>` : ''}
    ${videoSection}
    ${w.description ? `<div style="background:#fff;border:1px solid #DDD9D0;border-radius:12px;padding:24px;font-size:15px;line-height:1.75;color:#3A3A34">${esc(w.description)}</div>` : ''}
    ${kajabiFallback}
  </div>
</main>
<script>
document.addEventListener('click',function(e){
  var dd=document.getElementById('tb-dd');
  if(dd&&!document.getElementById('tb-profile').contains(e.target))dd.style.display='none';
});
<\/script>
</body></html>`;
}
