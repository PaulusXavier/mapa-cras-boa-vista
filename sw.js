const CACHE_NAME = 'cras-bv-v1';
const ASSETS = [
  '/mapa-cras-boa-vista/',
  '/mapa-cras-boa-vista/index.html',
  '/mapa-cras-boa-vista/manifest.json',
  '/mapa-cras-boa-vista/icon.png',
  '/mapa-cras-boa-vista/index-CQnkXNZJ.js',
  '/mapa-cras-boa-vista/index-DQZ2lMXW.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});