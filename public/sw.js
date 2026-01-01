const CACHE_NAME = 'bible-challenge-v7';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/logo192.png',
  '/logo512.png',
  '/favicon.ico',
  '/bible-challenge-icon.svg'
];

// Install service worker
self.addEventListener('install', (event) => {
  console.log('Service worker installing');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service worker caching files');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Service worker cache failed:', error);
      })
  );
  self.skipWaiting();
});

// Activate service worker
self.addEventListener('activate', (event) => {
  console.log('Service worker activating');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch from cache or network
self.addEventListener('fetch', (event) => {
  // Only cache GET requests
  if (event.request.method !== 'GET') return;

  // For JS/CSS files, use network-first strategy
  if (event.request.url.includes('/static/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone and cache the new version
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(event.request);
        })
    );
    return;
  }

  // For other requests, use cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }

        return fetch(event.request).then((response) => {
          // Don't cache if not a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
      .catch(() => {
        // Return offline fallback if needed
        console.log('Fetch failed, returning offline response');
      })
  );
});