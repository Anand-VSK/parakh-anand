// પરખ – આણંદ : service worker (version bead69933ca1)
const CACHE = 'parakh-bead69933ca1';
const SHELL = ["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png","icon-maskable-512.png"];
self.addEventListener('install', e => {
  // સાચવવામાં ભૂલ આવે તો પણ worker ચાલુ થાય (પેજ નેટ પરથી ખૂલે જ).
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).catch(() => {}).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .catch(() => {}).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  if (req.mode === 'navigate' || req.url.endsWith('/index.html')) {
    e.respondWith(fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put('index.html', copy)).catch(() => {});
      return res;
    }).catch(() => caches.match('index.html')));
    return;
  }
  e.respondWith(caches.match(req).catch(() => null).then(hit => hit || fetch(req)));
});
