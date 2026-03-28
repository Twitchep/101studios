const IMAGE_CACHE = "image-cache-v1";
const CACHE_LIMIT = 250;

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key.startsWith("image-cache-") && key !== IMAGE_CACHE)
          .map((key) => caches.delete(key))
      );
      await self.clients.claim();
    })()
  );
});

function isImageRequest(request) {
  if (request.destination === "image") return true;
  try {
    const url = new URL(request.url);
    return /\.(png|jpe?g|gif|webp|avif|svg|jfif)$/i.test(url.pathname);
  } catch {
    return false;
  }
}

async function trimCache(cache) {
  const keys = await cache.keys();
  if (keys.length <= CACHE_LIMIT) return;
  const removals = keys.slice(0, keys.length - CACHE_LIMIT);
  await Promise.all(removals.map((key) => cache.delete(key)));
}

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET" || !isImageRequest(request)) {
    return;
  }

  event.respondWith(
    (async () => {
      const cache = await caches.open(IMAGE_CACHE);
      const cached = await cache.match(request);
      if (cached) {
        return cached;
      }

      try {
        const networkResponse = await fetch(request);
        if (networkResponse && networkResponse.ok) {
          cache.put(request, networkResponse.clone());
          trimCache(cache);
        }
        return networkResponse;
      } catch (error) {
        if (cached) return cached;
        throw error;
      }
    })()
  );
});
