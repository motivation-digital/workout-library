const BG      = '#F5F0E8';
const CARD_BG  = '#FFFFFF';
const ACCENT   = '#97976a';
const DARK     = '#3A3A34';
const MID      = '#6A6A62';
const BORDER   = '#DDD9D0';
const ROSE     = '#DF949D';

function esc(s) {
  return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

export function renderDashboard(workouts, categories) {
  const catList = ['', ...categories];
  const catButtons = catList.map(c =>
    `<button onclick="filter(this,'${esc(c)}')" data-cat="${esc(c)}" style="padding:6px 14px;border:1px solid ${BORDER};border-radius:20px;background:#fff;color:${DARK};font-size:13px;cursor:pointer;transition:all .15s">${c || 'Все'}</button>`
  ).join(' ');

  const cards = workouts.map(w => {
    const imgArea = w.image_url
      ? `<div style="aspect-ratio:16/10;overflow:hidden;border-radius:10px 10px 0 0"><img src="${esc(w.image_url)}" alt="${esc(w.title)}" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block"></div>`
      : `<div style="aspect-ratio:16/10;background:linear-gradient(135deg,#e8e2d4,#d4cebc);border-radius:10px 10px 0 0;display:flex;align-items:center;justify-content:center"><div style="width:40px;height:40px;background:rgba(232,228,208,.8);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:18px;color:${DARK}">▶</div></div>`;
    const dur = w.duration_min ? `${w.duration_min} мин` : '';
    return `<a href="${esc(w.kajabi_url)}" target="_blank" rel="noopener" data-cat="${esc(w.category)}"
      style="text-decoration:none;display:block;background:${CARD_BG};border-radius:10px;border:1px solid ${BORDER};overflow:hidden;transition:box-shadow .15s">
      ${imgArea}
      <div style="padding:12px">
        <div style="font-size:11px;color:${ACCENT};text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">${esc(w.category)}${dur ? ' · ' + dur : ''}</div>
        <div style="font-size:14px;color:${DARK};font-weight:500;line-height:1.3">${esc(w.title)}</div>
      </div>
    </a>`;
  }).join('');

  return `<!DOCTYPE html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Библиотека тренировок</title>
<style>*{box-sizing:border-box}body{margin:0;font-family:Inter,sans-serif;background:${BG};color:${DARK}}
a[data-cat]:hover{box-shadow:0 4px 16px rgba(0,0,0,.08)}
button.active{background:${ACCENT}!important;color:#fff!important;border-color:${ACCENT}!important}
</style></head><body>
<div style="max-width:1100px;margin:0 auto;padding:24px 16px">
  <h1 style="font-size:22px;font-weight:600;margin:0 0 4px">Библиотека тренировок</h1>
  <p style="color:${MID};margin:0 0 20px;font-size:14px">${workouts.length} тренировок</p>
  <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:24px">${catButtons}</div>
  <div id="grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px">${cards}</div>
</div>
<script>
function filter(btn, cat) {
  document.querySelectorAll('button[data-cat]').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('#grid a[data-cat]').forEach(card => {
    card.style.display = (!cat || card.dataset.cat === cat) ? 'block' : 'none';
  });
}
document.querySelector('button[data-cat=""]').classList.add('active');
</script></body></html>`;
}

export function renderWorkoutPage(w) {
  const video = w.wistia_id
    ? `<div style="aspect-ratio:16/9;max-width:720px;margin:0 auto 24px"><iframe src="https://fast.wistia.net/embed/iframe/${esc(w.wistia_id)}?videoFoam=true" allowtransparency="true" frameborder="0" scrolling="no" allowfullscreen style="width:100%;height:100%;border-radius:10px"></iframe></div>`
    : w.kajabi_url
      ? `<div style="padding:32px;background:#fff;border:1px solid ${BORDER};border-radius:10px;text-align:center;margin-bottom:24px"><p style="margin:0 0 12px;color:${MID}">Видео доступно в Kajabi</p><a href="${esc(w.kajabi_url)}" target="_blank" rel="noopener" style="display:inline-block;padding:10px 24px;background:${ACCENT};color:#fff;border-radius:8px;text-decoration:none;font-size:14px">Смотреть тренировку</a></div>`
      : '';
  const heroImg = w.image_url
    ? `<img src="${esc(w.image_url)}" alt="${esc(w.title)}" style="width:100%;max-height:300px;object-fit:cover;border-radius:10px;margin-bottom:24px">`
    : '';

  return `<!DOCTYPE html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(w.title)} — Библиотека тренировок</title>
<style>*{box-sizing:border-box}body{margin:0;font-family:Inter,sans-serif;background:${BG};color:${DARK}}</style>
</head><body>
<div style="max-width:760px;margin:0 auto;padding:24px 16px">
  <a href="/" style="color:${ACCENT};text-decoration:none;font-size:13px;display:inline-block;margin-bottom:16px">← Все тренировки</a>
  <div style="font-size:12px;color:${ACCENT};text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px">${esc(w.category)}${w.duration_min ? ' · ' + w.duration_min + ' мин' : ''}</div>
  <h1 style="font-size:24px;font-weight:600;margin:0 0 20px;line-height:1.25">${esc(w.title)}</h1>
  ${heroImg}
  ${video}
  ${w.description ? `<div style="font-size:15px;line-height:1.6;color:${MID}">${w.description}</div>` : ''}
</div></body></html>`;
}
