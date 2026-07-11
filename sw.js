const CACHE_NAME = 'e-leave-shell-v1';
const APP_SHELL = [
    'manifest.json',
    'img/icon-192.png',
    'img/icon-512.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
        )
    );
    self.clients.claim();
});

// Only serve the static app shell (icons/manifest) from cache; everything
// else (HTML pages, Firestore data) always goes to the network so the app
// never shows stale leave data.
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request).then((cached) => cached || fetch(event.request))
    );
});
