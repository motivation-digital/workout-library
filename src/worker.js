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
    headers: { 'Content-Type': 'application/json', ...corsHeaders(req) },
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
      const row = await env.DB_CONTENT.prepare('SELECT COUNT(*) as n FROM workout_library WHERE status = ?').bind('active').first();
      return json({ ok: true, rows: row?.n ?? 0 }, req);
    }

    // API: recommend a workout (used by aicoach and dashboard)
    if (path === '/api/recommend') {
      const category = url.searchParams.get('category') || null;
      let q = 'SELECT * FROM workout_library WHERE status = ?';
      const params = ['active'];
      if (category) { q += ' AND category = ?'; params.push(category); }
      q += ' AND wistia_id IS NOT NULL ORDER BY RANDOM() LIMIT 1';
      const row = await env.DB_CONTENT.prepare(q).bind(...params).first();
      return json({ workout: row ?? null }, req);
    }

    // API: list workouts as JSON
    if (path === '/api/workouts') {
      const category = url.searchParams.get('category') || null;
      const limit = Math.min(parseInt(url.searchParams.get('limit') || '200'), 500);
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
      const row = await env.DB_CONTENT.prepare('SELECT * FROM workout_library WHERE kajabi_post_id = ? AND status = ?').bind(postId, 'active').first();
      if (!row) return json({ error: 'not found' }, req, 404);
      return json(row, req);
    }

    // Individual workout page: /:kajabi_post_id (numeric)
    const numericPath = path.match(/^\/(\d+)$/);
    if (numericPath) {
      const postId = numericPath[1];
      const row = await env.DB_CONTENT.prepare('SELECT * FROM workout_library WHERE kajabi_post_id = ? AND status = ?').bind(postId, 'active').first();
      if (!row) return html('<h1>Not found</h1>', 404);
      return html(renderWorkoutPage(row));
    }

    // Index
    if (path === '/' || path === '/workouts') {
      const { results: workouts } = await env.DB_CONTENT.prepare(
        'SELECT kajabi_post_id, title, category, image_url, wistia_id, duration_min, kajabi_url, filter_tags FROM workout_library WHERE status = ? ORDER BY category, position'
      ).bind('active').all();
      const categories = [...new Set(workouts.map(w => w.category).filter(Boolean))].sort();
      return html(renderDashboard(workouts, categories));
    }

    return html('<h1>Not found</h1>', 404);
  },
};
