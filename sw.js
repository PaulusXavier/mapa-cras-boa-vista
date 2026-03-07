const CACHE_NAME = 'mapa-cras-v1.1'; // Mude a versão sempre que atualizar o app
const urlsToCache = [
  './',
  './index.html',
  './index-CQnkXNZJ.js',
  './index-DQZ2lMXW.css',
  './robots.txt'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => key !== CACHE_NAME ? caches.delete(key) : null)
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request).then(networkResponse => {
        // Cacheia novas requisições (como mapas ou ícones externos)
        if (networkResponse.ok) {
          const cacheCopy = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, cacheCopy));
        }
        return networkResponse;
      }).catch(() => {
        // Se estiver offline e a rota não estiver no cache, entrega a Home
        return caches.match('./index.html');
      });
    })
  );
});
