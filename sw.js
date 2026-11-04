// Pozwala aplikacji działać bez internetu (po pierwszym otwarciu).
const CACHE = 'mantra-box-v2-3';
const FILES = [
  './', 'index.html', 'app.js', 'manifest.webmanifest', 'dzwieki/lista.js',
  'ikony/ikona.svg', 'ikony/ikona-180.png', 'ikony/ikona-192.png', 'ikony/ikona-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Najpierw internet (żeby mieć najnowszą wersję), a gdy go nie ma — kopia zapisana w telefonie
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        if (res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
