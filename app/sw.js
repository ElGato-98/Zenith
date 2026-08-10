const CACHE = 'zenith-v5-eclipse';

const LOCAL_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './manifest.json',
  './icon.svg',
  './data.jsx',
  './data-stars.jsx',
  './astronomy-helpers.jsx',
  './components-shared.jsx',
  './components-location.jsx',
  './components-sky.jsx',
  './components-detail.jsx',
  './components-tonight-atlas.jsx',
  './components-eclipse.jsx',
  './components-solar-system.jsx',
  './app.jsx',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(LOCAL_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const { request } = e;
  const url = new URL(request.url);

  // Local files — cache-first, update in background
  if (url.origin === self.location.origin) {
    e.respondWith(
      caches.match(request).then(cached => {
        const network = fetch(request).then(res => {
          if (res.ok) caches.open(CACHE).then(c => c.put(request, res.clone()));
          return res;
        });
        return cached || network;
      })
    );
    return;
  }

  // CDN resources — network-first, cache as fallback for offline
  e.respondWith(
    fetch(request)
      .then(res => {
        if (res.ok) caches.open(CACHE).then(c => c.put(request, res.clone()));
        return res;
      })
      .catch(() => caches.match(request))
  );
});
