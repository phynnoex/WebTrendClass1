const CACHE_NAME = "to-do-pwa-cache-v1";
const FILES_TO_CACHE = [
  "/WebTrendClass1/", // Root path (adjust based on your repo name)
  "/WebTrendClass1/index.html", // HTML file
  "/WebTrendClass1/style.css", // CSS file
  "/WebTrendClass1/app.js", // JS file
  "/WebTrendClass1/manifest.json", // Manifest file
  "/WebTrendClass1/icons/icon-128.png", // Icon 128px
  "/WebTrendClass1/icons/icon-512.png", // Icon 512px
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
