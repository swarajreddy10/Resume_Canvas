// v3: pages are no longer cached; bumping the name makes activate delete the v2 cache,
// which held cache-first copies of pages such as the landing page.
const CACHE_NAME = 'resumecanvas-v3';

// Only pre-cache truly static assets
const PRECACHE_URLS = ['/manifest.json'];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin GET requests
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  // Never intercept: page navigations (a cache-first page never shows a redeploy), Next.js
  // internals, Vercel analytics, API routes, auth, or dynamic app routes
  const skip =
    request.mode === 'navigate' ||
    url.pathname.startsWith('/_vercel/') ||
    url.pathname.startsWith('/_next/') ||
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/auth/') ||
    url.pathname.startsWith('/builder/') ||
    url.pathname.startsWith('/dashboard') ||
    url.pathname.startsWith('/profile') ||
    url.pathname.startsWith('/analytics') ||
    url.pathname.startsWith('/applications') ||
    url.pathname.startsWith('/cover-letters');

  if (skip) return;

  // For everything else (static files, manifest) — cache-first
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const toCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, toCache));
        return response;
      }).catch(() => cached || new Response('', { status: 503 }));
    })
  );
});
