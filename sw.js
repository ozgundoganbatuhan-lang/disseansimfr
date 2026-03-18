const CACHE = 'disseansim-v11';
const OFFLINE_URLS = ['/app.html', '/giris.html', '/index.html'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(OFFLINE_URLS).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = e.request.url;

  // ── CRITICAL: Only handle http/https — ignore chrome-extension://, data:, etc.
  if (!url.startsWith('http://') && !url.startsWith('https://')) return;

  if (e.request.method !== 'GET') return;

  const parsed = new URL(url);

  // API calls: always network, never cache
  if (parsed.pathname.startsWith('/api/')) return;

  // External resources (fonts, CDN): network only
  if (parsed.hostname !== self.location.hostname) return;

  // App pages: network first, fall back to cache
  e.respondWith(
    fetch(e.request)
      .then(r => {
        // Only cache valid same-origin responses
        if (r && r.status === 200 && r.type === 'basic') {
          const rc = r.clone();
          caches.open(CACHE).then(c => c.put(e.request, rc)).catch(() => {});
        }
        return r;
      })
      .catch(() => caches.match(e.request))
  );
});
