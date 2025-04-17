const CACHE_NAME = 'pocketspot-cache-v3';
const CACHE_VERSION = '3.0.0';

// Alle assets die offline beschikbaar moeten zijn
const OFFLINE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/service-worker.js',
  // Logo's en iconen
  '/images/pocketspot-logo-192.png',
  '/images/pocketspot-logo-512.png',
  '/images/pocketspot-logo.png',
  '/images/animal-placeholder.jpg',
  // Dierafbeeldingen
  '/images/animals/hypsipetes-madagascariensis.webp',
  '/images/animals/dicrurus-forficatus.webp',
  '/images/animals/corythornis-vintsioides.webp',
  '/images/animals/copsychus-albospecularis.webp',
  '/images/animals/terpsiphone-mutata.webp',
  '/images/animals/foudia-madagascariensis.webp',
  '/images/animals/potamochoerus-larvatus.webp',
  '/images/animals/pteropus-rufus.webp',
  '/images/animals/mungotictis-decemlineata.webp',
  '/images/animals/fossa-fossana.webp',
  '/images/animals/galidia-elegans.webp',
  '/images/animals/setifer-setosus.webp',
  '/images/animals/echinops-telfairi.webp',
  '/images/animals/tenrec-ecaudatus.webp',
  '/images/animals/hemicentetes-semispinosus.webp',
  '/images/animals/cryptoprocta-ferox.webp',
  '/images/animals/varecia-rubra.webp',
  '/images/animals/varecia-variegata.webp',
  '/images/animals/hapalemur-griseus.webp',
  '/images/animals/cheirogaleus-medius.webp',
  '/images/animals/microcebus-murinus.webp',
  '/images/animals/daubentonia-madagascariensis.webp',
  '/images/animals/indri-indri.webp',
  '/images/animals/propithecus-diadema.webp',
  '/images/animals/propithecus-coquereli.webp',
  '/images/animals/propithecus-verreauxi.webp',
  '/images/animals/eulemur-coronatus.webp',
  '/images/animals/eulemur-macaco.webp',
  '/images/animals/eulemur-rubriventer.webp',
  '/images/animals/eulemur-rufifrons.webp',
  '/images/animals/eulemur-fulvus.webp',
  '/images/animals/lemur-catta.webp',
  // Data
  '/data/animals.json'
];

// Install event - Cache alle assets en preload
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        // Cache alle assets
        return cache.addAll(OFFLINE_ASSETS)
          .then(() => {
            // Voeg cache versie toe
            return cache.put(
              new Request('/cache-version'),
              new Response(CACHE_VERSION)
            );
          });
      })
  );
  // Forceer activatie van nieuwe service worker
  self.skipWaiting();
});

// Activate event - Cleanup en versie controle
self.addEventListener('activate', function(event) {
  event.waitUntil(
    Promise.all([
      // Cleanup oude caches
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.filter(function(cacheName) {
            return cacheName !== CACHE_NAME;
          }).map(function(cacheName) {
            return caches.delete(cacheName);
          })
        );
      }),
      // Controleer cache versie
      caches.open(CACHE_NAME).then(cache => {
        return cache.match('/cache-version')
          .then(response => {
            if (!response || response.text() !== CACHE_VERSION) {
              // Cache is verouderd, herlaad alle assets
              return cache.addAll(OFFLINE_ASSETS)
                .then(() => {
                  return cache.put(
                    new Request('/cache-version'),
                    new Response(CACHE_VERSION)
                  );
                });
            }
          });
      })
    ])
  );
  // Neem controle over alle clients
  self.clients.claim();
});

// Fetch event - Cache-first strategie met versie controle
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          // Controleer of het een data request is
          if (event.request.url.includes('/data/')) {
            // Voor data, probeer eerst netwerk
            return fetch(event.request)
              .then(networkResponse => {
                if (networkResponse && networkResponse.status === 200) {
                  // Update cache met nieuwe data
                  const responseToCache = networkResponse.clone();
                  caches.open(CACHE_NAME)
                    .then(cache => cache.put(event.request, responseToCache));
                  return networkResponse;
                }
                return response;
              })
              .catch(() => response);
          }
          return response;
        }
        // Cache miss - fetch from network
        return fetch(event.request)
          .then(function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            // Clone the response
            const responseToCache = response.clone();
            // Cache the new response
            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });
            return response;
          });
      })
  );
});

// Periodieke cache update
self.addEventListener('sync', function(event) {
  if (event.tag === 'update-cache') {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(cache => {
          return Promise.all(
            OFFLINE_ASSETS.map(url => {
              return fetch(url)
                .then(response => {
                  if (response && response.status === 200) {
                    return cache.put(url, response);
                  }
                })
                .catch(() => {
                  // Negeer fouten bij updates
                });
            })
          );
        })
    );
  }
}); 