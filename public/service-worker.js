// Cache name and version
const CACHE_NAME = 'tresit-cache-v1';

// Assets to precache
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/favicon.ico'
  // More assets will be automatically added by workbox
];

// Install event - precaching
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Precaching assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
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
    }).then(() => self.clients.claim())
  );
});

// Fetch event - network-first strategy for API requests, cache-first for assets
self.addEventListener('fetch', (event) => {
  // Skip for browser extension requests and non-GET requests
  if (
    event.request.url.startsWith('chrome-extension://') || 
    event.request.method !== 'GET'
  ) {
    return;
  }

  // API requests - network first, fallback to cache
  if (event.request.url.includes('/api/') || event.request.url.includes('restcountries.com')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache the response if it's valid
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          console.log('Falling back to cache for:', event.request.url);
          return caches.match(event.request);
        })
    );
  } 
  // Static assets - cache first, fallback to network
  else {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            return response;
          }

          // Cache miss - fetch from network
          return fetch(event.request).then((networkResponse) => {
            if (!networkResponse || networkResponse.status !== 200) {
              return networkResponse;
            }
            
            // Cache the new response
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
            
            return networkResponse;
          });
        })
    );
  }
}); 