const CACHE_NAME = "to-do-pwa-cache-v1";
const FILES_TO_CACHE = [
  "/WebTrendClass1/",  // Replace with your repository name
  "/WebTrendClass1/index.html",  // Replace with your repository name
  "/WebTrendClass1/style.css",  // Replace with your repository name
  "/WebTrendClass1/app.js",  // Replace with your repository name
  "/WebTrendClass1/manifest.json",  // Replace with your repository name
  "/WebTrendClass1/icons/icon-128.png",  // Replace with your repository name
  "/WebTrendClass1/icons/icon-512.png",  // Replace with your repository name
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
