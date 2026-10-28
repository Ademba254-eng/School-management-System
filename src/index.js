export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/health') {
      if (request.method !== 'GET') {
        return new Response('Method not allowed', {
          status: 405,
          headers: { Allow: 'GET' },
        });
      }

      try {
        const result = await env.DB.prepare('SELECT 1 AS connected').first();
        return Response.json({ database: result?.connected === 1 ? 'connected' : 'error' });
      } catch (error) {
        console.error('D1 health check failed:', error);
        return Response.json({ error: 'D1 health check failed' }, { status: 503 });
      }
    }

    return env.ASSETS.fetch(request);
  },
};
