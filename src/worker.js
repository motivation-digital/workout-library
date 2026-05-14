import { renderDashboard, renderWorkoutPage } from './renderer.js';
import { ensureSchema } from './schema.js';

const ALLOWED_ORIGINS = [
  'https://d.dreambody.club',
  'https://dreambody.club',
  'https://www.dreambody.club',
  'https://wl.dreambody.club',
];

function getCorsOrigin(request) {
  const origin = request?.headers?.get('Origin') || '';
  return ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
}

function jsonResponse(data, status = 200, request = null) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': getCorsOrigin(request),
    },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': getCorsOrigin(request),
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    try {
      await ensureSchema(env.DB_CONTENT);

      // GET /health
      if (path === '/health') {
        const row = await env.DB_CONTENT.prepare(
          "SELECT COUNT(*) as count FROM academy_content WHERE status = 'active'"
        ).first();
        return jsonResponse({ status: 'ok', count: row?.count || 0 }, 200, request);
      }

      // GET /api/recommend — for launchpad-aicoach: returns workouts with image_url
      // Optional query params: level=, limit=
      if (path === '/api/recommend' && request.method === 'GET') {
        const level = url.searchParams.get('level') || null;
        const limit = Math.min(parseInt(url.searchParams.get('limit') || '10', 10), 50);
        let query, params;
        if (level) {
          query = "SELECT post_id, title, image_url, wistia_id, duration_min, level, source_url FROM academy_content WHERE status = 'active' AND level = ? ORDER BY chapter_order LIMIT ?";
          params = [level, limit];
        } else {
          query = "SELECT post_id, title, image_url, wistia_id, duration_min, level, source_url FROM academy_content WHERE status = 'active' ORDER BY chapter_order LIMIT ?";
          params = [limit];
        }
        const stmt = env.DB_CONTENT.prepare(query);
        const { results } = await stmt.bind(...params).all();
        return jsonResponse({ workouts: results || [] }, 200, request);
      }

      // GET / or /workouts — dashboard
      if ((path === '/' || path === '/workouts') && request.method === 'GET') {
        const { results } = await env.DB_CONTENT.prepare(
          "SELECT post_id, title, image_url, wistia_id, duration_min, level, chapter_order FROM academy_content WHERE status = 'active' ORDER BY level, chapter_order ASC"
        ).all();
        const html = renderDashboard(results || []);
        return new Response(html, {
          headers: { 'Content-Type': 'text/html;charset=UTF-8' },
        });
      }

      // GET /api/:post_id — raw JSON
      const apiMatch = path.match(/^\/api\/([^/]+)$/);
      if (apiMatch && request.method === 'GET') {
        const workout = await env.DB_CONTENT.prepare(
          "SELECT * FROM academy_content WHERE post_id = ? AND status = 'active'"
        ).bind(decodeURIComponent(apiMatch[1])).first();
        if (!workout) return jsonResponse({ error: 'Workout not found' }, 404, request);
        return jsonResponse(workout, 200, request);
      }

      // GET /:post_id — individual workout page
      const slugMatch = path.match(/^\/([^/]+)$/);
      if (slugMatch && request.method === 'GET') {
        const workout = await env.DB_CONTENT.prepare(
          "SELECT * FROM academy_content WHERE post_id = ? AND status = 'active'"
        ).bind(decodeURIComponent(slugMatch[1])).first();
        if (!workout) return jsonResponse({ error: 'Workout not found' }, 404, request);
        const html = renderWorkoutPage(workout);
        return new Response(html, {
          headers: { 'Content-Type': 'text/html;charset=UTF-8' },
        });
      }

      return jsonResponse({ error: 'Not found' }, 404, request);
    } catch (e) {
      return jsonResponse({ error: 'Internal server error', detail: e.message }, 500, request);
    }
  },
};
