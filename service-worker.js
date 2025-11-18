const CACHE_NAME = 'lyric-teleprompter-v9'; // Version bumped to trigger update
const urlsToCache = [
  '/',
  'index.html',
  'manifest.json',
  'icon-192.svg',
  'icon-512.svg',
  'screenshot-desktop.svg',
  'screenshot-mobile.svg',
  // App source files
  'index.tsx',
  'App.tsx',
  'types.ts',
  'components/LyricsEditor.tsx',
  'components/LyricsDisplay.tsx',
  'components/SongLibrary.tsx',
  'components/Modal.tsx',
  'components/icons.tsx'
];

// Install the service worker and cache the app shell and core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching app shell');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event: serve from cache if available, otherwise fetch from network and cache the result
self.addEventListener('fetch', event => {
  // We only want to handle GET requests.
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Cache hit - return response
        if (cachedResponse) {
          return cachedResponse;
        }

        // Not in cache - fetch from network
        return fetch(event.request).then(
          networkResponse => {
            // Check if we received a valid response.
            // This includes successful responses from CDNs (type: 'cors')
            if(!networkResponse || networkResponse.status !== 200) {
              return networkResponse;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          }
        ).catch(() => {
            // Fetch failed, probably offline.
            // If it's a navigation request, serve the cached index page.
            if (event.request.mode === 'navigate') {
                return caches.match('/index.html');
            }
        });
      })
  );
});