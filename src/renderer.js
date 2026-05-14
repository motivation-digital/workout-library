function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function safeJson(str, fallback) {
  try { return JSON.parse(str); } catch { return fallback; }
}

const LEVEL_LABELS = {
  'beginner': 'Начинающий',
  'intermediate': 'Средний',
  'advanced': 'Продвинутый',
};

function levelLabel(level) {
  return LEVEL_LABELS[level] || esc(level);
}

export function renderDashboard(workouts) {
  const levels = [...new Set(workouts.map(w => w.level).filter(Boolean))].sort();

  const cards = workouts.map(w => {
    const imgArea = w.image_url
      ? `<img src="${esc(w.image_url)}" alt="${esc(w.title)}" style="width:100%;height:100%;object-fit:cover;display:block">`
      : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#e8e2d4,#d4cebc);font-size:2rem">💪</div>`;
    const hasvideo = w.wistia_id ? `<span style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none"><span style="width:44px;height:44px;border-radius:50%;background:rgba(0,0,0,0.55);display:flex;align-items:center;justify-content:center;color:#fff;font-size:1.2rem">▶</span></span>` : '';
    const dur = w.duration_min ? `<span class="pill">⏱ ${w.duration_min} мин</span>` : '';
    const lvl = w.level ? `<span class="pill pill-lvl">${levelLabel(w.level)}</span>` : '';
    const slug = encodeURIComponent(w.post_id);
    return `<a class="card" href="/${slug}" data-level="${esc(w.level || '')}">
  <div class="card-img" style="position:relative;aspect-ratio:16/10;overflow:hidden;border-radius:10px 10px 0 0">${imgArea}${hasvideo}</div>
  <div class="card-body">
    <div class="card-title">${esc(w.title)}</div>
    <div class="card-pills">${lvl}${dur}</div>
  </div>
</a>`;
  }).join('\n');

  const filterBtns = ['', ...levels].map(l =>
    `<button class="filter-btn${l === '' ? ' active' : ''}" data-filter="${esc(l)}">${l ? levelLabel(l) : 'Все'}</button>`
  ).join('');

  return `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>DreamBody — Тренировки</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Inter',sans-serif;background:#F5F0E8;color:#252420;line-height:1.6;-webkit-font-smoothing:antialiased}
.wrap{max-width:1200px;margin:0 auto;padding:0 20px}
.header{padding:32px 0 8px}
.header h1{font-size:2rem;font-weight:700;color:#252420}
.header p{color:#6A6A62;font-size:.95rem;margin-top:4px}
.filters{display:flex;gap:8px;flex-wrap:wrap;padding:20px 0 16px}
.filter-btn{padding:8px 18px;border-radius:20px;border:1.5px solid #d4cebc;background:#fff;color:#6A6A62;font-family:inherit;font-size:.85rem;font-weight:500;cursor:pointer;transition:all .2s}
.filter-btn:hover{border-color:#97976a;color:#97976a}
.filter-btn.active{background:#97976a;border-color:#97976a;color:#fff}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px;padding-bottom:48px}
.card{text-decoration:none;color:inherit;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.06);transition:all .2s;display:block}
.card:hover{box-shadow:0 6px 24px rgba(0,0,0,.12);transform:translateY(-2px)}
.card.hidden{display:none}
.card-body{padding:14px 16px 16px}
.card-title{font-size:.95rem;font-weight:600;color:#252420;line-height:1.4;margin-bottom:8px}
.card-pills{display:flex;flex-wrap:wrap;gap:6px}
.pill{font-size:.75rem;font-weight:500;color:#6A6A62;background:#F5F0E8;border-radius:12px;padding:3px 10px}
.pill-lvl{background:#e3bbbd;color:#5a3030}
.empty{text-align:center;padding:64px 0;color:#97976a;font-size:1.1rem;display:none}
.footer{text-align:center;padding:24px 0 32px;font-size:.8rem;color:#6A6A62}
@media(max-width:600px){.grid{grid-template-columns:1fr}.header h1{font-size:1.5rem}}
</style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <h1>Тренировки</h1>
    <p>${workouts.length} тренировок в библиотеке</p>
  </div>
  <div class="filters">${filterBtns}</div>
  <div class="grid" id="grid">${cards}</div>
  <p class="empty" id="empty">Тренировок не найдено</p>
  <div class="footer">DreamBody Club — Workout Library</div>
</div>
<script>
var btns=document.querySelectorAll('.filter-btn'),cards=document.querySelectorAll('.card'),empty=document.getElementById('empty');
btns.forEach(function(b){b.addEventListener('click',function(){btns.forEach(function(x){x.classList.remove('active');});b.classList.add('active');var f=b.dataset.filter;var shown=0;cards.forEach(function(c){var show=!f||c.dataset.level===f;c.classList.toggle('hidden',!show);if(show)shown++;});empty.style.display=shown?'none':'block';});});
</script>
</body>
</html>`;
}

export function renderWorkoutPage(w) {
  const body = safeJson(w.body, []);
  const bodyHtml = Array.isArray(body) && body.length
    ? body.map(p => typeof p === 'string'
        ? `<p class="body-p">${esc(p)}</p>`
        : `<p class="body-p">${esc(JSON.stringify(p))}</p>`
      ).join('')
    : '';

  const videoSection = w.wistia_id
    ? `<div class="video-wrap">
        <div style="padding:56.25% 0 0 0;position:relative">
          <iframe src="https://fast.wistia.net/embed/iframe/${esc(w.wistia_id)}?autoPlay=false"
            title="${esc(w.title)}" allowtransparency="true" frameborder="0"
            scrolling="no" allowfullscreen
            style="position:absolute;top:0;left:0;width:100%;height:100%"></iframe>
        </div>
      </div>`
    : (w.source_url
        ? `<div class="no-video"><a href="${esc(w.source_url)}" target="_blank" rel="noopener" class="kajabi-link">▶ Смотреть тренировку →</a></div>`
        : '');

  const imgHero = w.image_url
    ? `<div class="hero"><img src="${esc(w.image_url)}" alt="${esc(w.title)}"></div>`
    : '';

  const dur = w.duration_min ? `<span class="meta-pill">⏱ ${esc(String(w.duration_min))} мин</span>` : '';
  const lvl = w.level ? `<span class="meta-pill meta-lvl">${levelLabel(w.level)}</span>` : '';

  return `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${esc(w.title)} — DreamBody</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Inter',sans-serif;background:#F5F0E8;color:#252420;line-height:1.6;-webkit-font-smoothing:antialiased}
.wrap{max-width:800px;margin:0 auto;padding:0 20px 48px}
.back{display:inline-flex;align-items:center;gap:6px;color:#97976a;text-decoration:none;font-size:.85rem;padding:16px 0 8px}
.back:hover{color:#252420}
.hero{border-radius:12px;overflow:hidden;margin-bottom:20px;box-shadow:0 4px 16px rgba(0,0,0,.1)}
.hero img{width:100%;max-height:400px;object-fit:cover;display:block}
h1{font-size:1.7rem;font-weight:700;line-height:1.3;margin-bottom:12px}
.meta-pills{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px}
.meta-pill{font-size:.8rem;font-weight:500;color:#6A6A62;background:#fff;border-radius:12px;padding:4px 12px;box-shadow:0 1px 3px rgba(0,0,0,.06)}
.meta-lvl{background:#e3bbbd;color:#5a3030}
.video-wrap{background:#000;border-radius:12px;overflow:hidden;margin-bottom:24px;box-shadow:0 4px 16px rgba(0,0,0,.15)}
.no-video{margin-bottom:20px}
.kajabi-link{display:inline-flex;align-items:center;gap:8px;background:#97976a;color:#fff;text-decoration:none;padding:12px 24px;border-radius:24px;font-weight:600;font-size:.95rem;transition:background .2s}
.kajabi-link:hover{background:#7a7a55}
.body-p{color:#6A6A62;line-height:1.8;margin-bottom:12px;font-size:.95rem}
.footer{text-align:center;padding:32px 0;font-size:.8rem;color:#6A6A62}
@media(max-width:600px){h1{font-size:1.3rem}}
</style>
</head>
<body>
<div class="wrap">
  <a class="back" href="/">← Все тренировки</a>
  ${imgHero}
  <h1>${esc(w.title)}</h1>
  <div class="meta-pills">${lvl}${dur}</div>
  ${videoSection}
  ${bodyHtml}
  <div class="footer">DreamBody Club — Workout Library</div>
</div>
</body>
</html>`;
}
