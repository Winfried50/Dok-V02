// sw.js
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('my-app-cache').then(function(cache) {
      return cache.addAll([
        // alle Resourcen(Dateien) auf die zugegriffen werden soll
        'img/Buch-192x192.ico',
        'img/Buch-512x512.ico',
        'backup-restore.js',
        'Filter1-Selekt.js',
        'Filter2-Radio.js',
        'Filter3-Radio.js',
        'Filter-Edit.js',
        'index.html',
        'indexeddb_manager.js',
        'manifest.json',
        'sw.js',
        'Verarbeitung.js'
        // weitere Ressourcen
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});