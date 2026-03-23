const CACHE_NAME = 'universidades-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/universidades.html',
  '/script.js',
  // Agrega aquí otros recursos como CSS, imágenes, etc.
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response; // Devuelve el recurso desde la caché
        }
        return fetch(event.request); // Si no está en caché, lo busca en la red
      })
  );
});
