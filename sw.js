// 하루리듬 서비스워커 — 설치 가능하게 만들고, 방문했던 페이지를 오프라인에서도 열리게 해줌.
// 내용을 수정한 뒤에는 아래 CACHE 이름의 숫자를 바꿔주세요. 그래야 방문자 폰에 남은 옛 버전이
// 새 버전으로 교체돼요 (예: harudream-v1 -> harudream-v2).
const CACHE = 'harudream-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// 네트워크를 먼저 시도하고, 안 되면(오프라인) 캐시에서 꺼내줌
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
