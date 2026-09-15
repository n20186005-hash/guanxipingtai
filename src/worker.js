import { handleWeather } from './weather.js';

const STATIC_CACHE_RULES = [
  { prefix: '/_astro/', value: 'public, max-age=31536000, immutable' },
  { prefix: '/icons/', value: 'public, max-age=2592000' },
  { prefix: '/favicon.svg', value: 'public, max-age=2592000' },
  { prefix: '/guanxipingtai-social-cover-1.jpg', value: 'public, max-age=2592000' },
  { prefix: '/site.webmanifest', value: 'public, max-age=86400' },
  { prefix: '/sw.js', value: 'no-cache' }
];

function staticCacheControl(pathname) {
  const rule = STATIC_CACHE_RULES.find((entry) => pathname.startsWith(entry.prefix));
  return rule ? rule.value : null;
}

// 只對正式網域做轉址，避免影響 workers.dev 預覽與本機開發
const PRODUCTION_HOSTS = new Set(['guanxipingtai.com', 'www.guanxipingtai.com']);

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 取代原 _redirects：www → apex、http → https（統一為 301 單次跳轉）
    if (PRODUCTION_HOSTS.has(url.hostname)) {
      let needsRedirect = false;

      if (url.hostname.startsWith('www.')) {
        url.hostname = url.hostname.slice(4);
        needsRedirect = true;
      }

      if (url.protocol === 'http:') {
        url.protocol = 'https:';
        needsRedirect = true;
      }

      if (needsRedirect) return Response.redirect(url.toString(), 301);
    }

    // API 路由（原 functions/api/weather.js）
    if (url.pathname === '/api/weather') {
      return handleWeather(request, ctx);
    }

    // 静态资源（Astro 构建产物 dist/）
    const response = await env.ASSETS.fetch(request);

    // 取代原 _headers：安全响应头 + 静态资源缓存策略
    const headers = new Headers(response.headers);
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    headers.set('X-Frame-Options', 'SAMEORIGIN');

    const cacheControl = staticCacheControl(url.pathname);
    if (cacheControl) headers.set('Cache-Control', cacheControl);

    return new Response(response.body, { status: response.status, headers });
  }
};
