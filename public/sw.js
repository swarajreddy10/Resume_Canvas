// Retired service worker. ResumeCanvas has no offline mode and no longer registers a worker.
// Browsers that installed an earlier version keep checking this URL for updates on
// navigation; this byte-different no-op replaces the old worker at the same URL, has no
// fetch handler (requests go straight to the network), deletes the caches the old worker
// made, and unregisters itself.
// Guidance: https://developer.chrome.com/docs/workbox/remove-buggy-service-workers
//           https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/unregister
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((key) => key.startsWith('resumecanvas-')).map((key) => caches.delete(key))
      );
      await self.registration.unregister();
    })()
  );
});
