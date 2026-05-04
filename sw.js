const CACHE = 'ezizov-v39';
const PRECACHE = [
  '/',
  '/articles.html',
  '/contact.html',
  '/css/global.css?v=26',
  '/js/shared.js?v=26',
  '/js/articles.js?v=28',
  '/logo.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  // Don't intercept Firebase / Formspree / CDN requests
  if (!url.origin.includes('elishaizizov.com') && !url.hostname.endsWith('github.io')) return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
