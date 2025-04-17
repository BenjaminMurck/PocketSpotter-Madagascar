const CACHE_NAME = 'pocketspot-cache-v1';
const STATIC_CACHE = 'static-cache-v1';
const API_CACHE = 'api-cache-v1';

// Helper functie om het juiste pad te bepalen
const getPath = (path) => {
  if (self.location.hostname === 'localhost') {
    return path.replace('/PocketSpotter-Madagascar', '');
  }
  return path;
};

// Statische assets die offline beschikbaar moeten zijn
const STATIC_ASSETS = [
  '/PocketSpotter-Madagascar/',
  '/PocketSpotter-Madagascar/index.html',
  '/PocketSpotter-Madagascar/manifest.json',
  '/PocketSpotter-Madagascar/service-worker.js',
  '/PocketSpotter-Madagascar/images/pocketspot-logo-192.png',
  '/PocketSpotter-Madagascar/images/pocketspot-logo-512.png',
  '/PocketSpotter-Madagascar/images/pocketspot-logo.png',
  '/PocketSpotter-Madagascar/images/animals/placeholder.webp'
].map(getPath);

// API endpoints die offline beschikbaar moeten zijn
const API_ENDPOINTS = [
  '/PocketSpotter-Madagascar/data/animals.json'
].map(getPath);

// Install event - Cache alle assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS)),
      caches.open(API_CACHE).then((cache) => cache.addAll(API_ENDPOINTS))
    ])
  );
  self.skipWaiting();
});

// Activate event - Cleanup oude caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== STATIC_CACHE && name !== API_CACHE)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - Verschillende strategieën voor verschillende content types
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const requestPath = getPath(url.pathname);
  
  // Voor API endpoints: Network-first met cache fallback
  if (API_ENDPOINTS.some(endpoint => requestPath.endsWith(endpoint))) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(API_CACHE).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
  }
  // Voor statische assets: Cache-first met background update
  else if (STATIC_ASSETS.some(asset => requestPath.endsWith(asset))) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          // Update cache in de achtergrond
          fetch(event.request).then((networkResponse) => {
            const responseClone = networkResponse.clone();
            caches.open(STATIC_CACHE).then((cache) => {
              cache.put(event.request, responseClone);
            });
          });
          return response;
        }
        return fetch(event.request);
      })
    );
  }
  // Voor andere requests: Network-first
  else {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request);
      })
    );
  }
}); 