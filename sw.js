const CACHE_NAME = 'mapa-cras-v1';
const urlsToCache = [
  './',
  './index.html',
  './assets/index-CQnkXNZJ.js',
  './assets/index-DQZ2lMXW.css'
];

// Instalar o Service Worker e cachear arquivos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache).catch(err => {
        console.log('Erro ao cachear alguns arquivos:', err);
        return Promise.resolve();
      });
    })
  );
  self.skipWaiting();
});

// Ativar o Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Estratégia: Cache First, Fall back to Network
self.addEventListener('fetch', event => {
  // Ignorar requisições que não são GET
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      // Se encontrar no cache, retorna
      if (response) {
        return response;
      }

      // Caso contrário, tenta buscar da rede
      return fetch(event.request).then(response => {
        // Verifica se é uma resposta válida
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        // Clona a resposta para poder cachear
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });

        return response;
      }).catch(() => {
        // Se falhar, tenta retornar do cache
        return caches.match(event.request).then(response => {
          if (response) {
            return response;
          }
          // Retorna uma página offline se disponível
          return caches.match('./index.html');
        });
      });
    })
  );
});
