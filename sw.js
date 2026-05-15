// Gridea Pro PWA Service Worker
var CACHE_NAME = 'gridea-v1778830601';
var OFFLINE_URL = '/offline.html';

// 安装：预缓存离线页面
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.add(OFFLINE_URL);
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

// 激活：清理旧缓存并接管所有客户端
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(
        names.filter(function(name) {
          return name !== CACHE_NAME;
        }).map(function(name) {
          return caches.delete(name);
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// 请求拦截
self.addEventListener('fetch', function(event) {
  var request = event.request;

  if (request.method !== 'GET') return;
  if (!request.url.startsWith(self.location.origin)) return;

  // 导航请求（HTML）：network-first，失败时返回离线页面
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).then(function(response) {
        if (response.ok) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(request, clone);
          });
        }
        return response;
      }).catch(function() {
        return caches.match(request).then(function(cached) {
          return cached || caches.match(OFFLINE_URL);
        });
      })
    );
    return;
  }

  // 静态资源：cache-first
  if (isStaticAsset(request.url)) {
    event.respondWith(
      caches.match(request).then(function(cached) {
        if (cached) return cached;
        return fetch(request).then(function(response) {
          if (response.ok) {
            var clone = response.clone();
            caches.open(CACHE_NAME).then(function(cache) {
              cache.put(request, clone);
            });
          }
          return response;
        });
      })
    );
    return;
  }
});

function isStaticAsset(url) {
  return /\.(css|js|png|jpg|jpeg|gif|svg|webp|ico|woff|woff2|ttf|eot|json)(\?.*)?$/i.test(url);
}
