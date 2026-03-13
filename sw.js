const CACHE = 'disseansim-v7';
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
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  // API calls: network first, no cache
  if (url.pathname.startsWith('/api/')) return;
  // Pages: network first, fall back to cache
  e.respondWith(
    fetch(e.request)
      .then(r => { const rc = r.clone(); caches.open(CACHE).then(c => c.put(e.request, rc)); return r; })
      .catch(() => caches.match(e.request))
  );
});
