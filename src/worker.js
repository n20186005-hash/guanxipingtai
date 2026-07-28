import { handleWeather } from './weather.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 取代原 _redirects：www → apex（301）
    if (url.hostname.startsWith('www.')) {
      url.hostname = url.hostname.slice(4);
      return Response.redirect(url.toString(), 301);
    }

    // API 路由（原 functions/api/weather.js）
    if (url.pathname === '/api/weather') {
      return handleWeather(request, ctx);
    }

    // 静态资源（Astro 构建产物 dist/）
    const response = await env.ASSETS.fetch(request);

    // 取代原 _headers：安全响应头 + _astro 资源长期缓存
    const headers = new Headers(response.headers);
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    headers.set('X-Frame-Options', 'SAMEORIGIN');
    if (url.pathname.startsWith('/_astro/')) {
      headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    }

    return new Response(response.body, { status: response.status, headers });
  }
};
