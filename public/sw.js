/* PTSD service worker — offline support for the static game bundle.
 * Bump CACHE_VERSION when the app shell changes significantly. */
const CACHE_VERSION = 'ptsd-v2';
const FONT_CACHE = 'ptsd-fonts-v1';
const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

// Precache the app shell plus every hashed asset referenced by index.html,
// so the game works offline from the second visit without any online fetch.
self.addEventListener('install', (event) => {
  event.waitUntil(
    fetch('./index.html')
      .then((response) => response.text())
      .then((html) => {
        const assets = [...html.matchAll(/"\.\/(assets\/[^"]+)"/g)].map((m) => `./${m[1]}`);
        return caches
          .open(CACHE_VERSION)
          .then((cache) => cache.addAll(['./', './index.html', ...assets]));
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_VERSION && key !== FONT_CACHE).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  // Google Fonts: cache-first with runtime fill, so the UI keeps its type
  // offline after the first online visit.
  if (FONT_HOSTS.includes(url.hostname)) {
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ||
          fetch(request).then((response) => {
            if (response.ok) {
              const copy = response.clone();
              caches.open(FONT_CACHE).then((cache) => cache.put(request, copy));
            }
            return response;
          })
      )
    );
    return;
  }

  if (url.origin !== self.location.origin) return;

  // Navigations: network-first so updates land, cache fallback for offline.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put('./index.html', copy));
          }
          return response;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Hashed assets and other same-origin GETs: cache-first (immutable once named).
  event.respondWith(
    caches.match(request).then(
      (hit) =>
        hit ||
        fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
          }
          return response;
        })
    )
  );
});
