import { ensureSchema } from './schema.js';
import { renderDashboard, renderWorkoutPage } from './renderer.js';

const CORS = ['https://d.dreambody.club', 'https://dreambody.club', 'https://www.dreambody.club', 'https://wl.dreambody.club'];

function corsHeaders(req) {
  const origin = req.headers.get('Origin') || '';
  const allowed = CORS.includes(origin) ? origin : CORS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function json(data, req, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(req) }
  });
}

function html(body, status = 200) {
  return new Response(body, { status, headers: { 'Content-Type': 'text/html;charset=utf-8' } });
}

export default {
  async fetch(req, env) {
    if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders(req) });

    await ensureSchema(env.DB_CONTENT);

    const url = new URL(req.url);
    const path = url.pathname;

    // Health
    if (path === '/health') {
      const { results } = await env.DB_CONTENT.prepare('SELECT COUNT(*) as n FROM workout_library').all();
      return json({ ok: true, rows: results[0].n }, req);
    }

    // API: recommend a workout (called by aicoach or dashboard)
    if (path === '/api/recommend') {
      const category = url.searchParams.get('category') || null;
      const seed = url.searchParams.get('seed') || String(Date.now());
      let q = 'SELECT * FROM workout_library WHERE status = ?';
      const params = ['active'];
      if (category) { q += ' AND category = ?'; params.push(category); }
      q += ' ORDER BY RANDOM() LIMIT 1';
      // Use seed for deterministic selection
      const { results } = await env.DB_CONTENT.prepare(
        'SELECT * FROM workout_library WHERE status = ? ' +
        (category ? 'AND category = ? ' : '') +
        'ORDER BY ABS(CAST(kajabi_post_id AS INTEGER) - ?) LIMIT 20'
      ).bind(...params, parseInt(seed, 10) || 0).all();
      const row = results.length ? results[parseInt(seed, 36) % results.length || 0] : null;
      return json({ workout: row }, req);
    }

    // API: all workouts as JSON
    if (path === '/api/workouts') {
      const category = url.searchParams.get('category') || null;
      const limit = Math.min(parseInt(url.searchParams.get('limit') || '100'), 500);
      const offset = parseInt(url.searchParams.get('offset') || '0');
      let q = 'SELECT kajabi_post_id, title, category, image_url, wistia_id, duration_min, kajabi_url, filter_tags FROM workout_library WHERE status = ?';
      const params = ['active'];
      if (category) { q += ' AND category = ?'; params.push(category); }
      q += ' ORDER BY category, position LIMIT ? OFFSET ?';
      params.push(limit, offset);
      const { results } = await env.DB_CONTENT.prepare(q).bind(...params).all();
      return json({ workouts: results, count: results.length }, req);
    }

    // API: single workout JSON
    if (path.startsWith('/api/workout/')) {
      const postId = path.slice('/api/workout/'.length);
      const row = await env.DB_CONTENT.prepare('SELECT * FROM workout_library WHERE kajabi_post_id = ?').bind(postId).first();
      if (!row) return json({ error: 'not found' }, req, 404);
      return json(row, req);
    }

    // Dashboard: individual workout page
    if (path.startsWith('/workout/')) {
      const postId = path.slice('/workout/'.length);
      const row = await env.DB_CONTENT.prepare('SELECT * FROM workout_library WHERE kajabi_post_id = ?').bind(postId).first();
      if (!row) return html('<h1>Not found</h1>', 404);
      return html(renderWorkoutPage(row));
    }

    // Dashboard: workout index (/ or /workouts)
    if (path === '/' || path === '/workouts') {
      const { results: workouts } = await env.DB_CONTENT.prepare(
        'SELECT kajabi_post_id, title, category, image_url, wistia_id, duration_min, kajabi_url FROM workout_library WHERE status = ? ORDER BY category, position'
      ).bind('active').all();
      const categories = [...new Set(workouts.map(w => w.category))].filter(Boolean);
      return html(renderDashboard(workouts, categories));
    }

    return html('<h1>Not found</h1>', 404);
  }
};
