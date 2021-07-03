/* eslint-disable no-restricted-globals */
/* globals importScripts, self, workbox */

// Checks if event's request is a navigation request
function isNavigationEvent(event) {
  return (
    event.request.mode === 'navigate' ||
    (event.request.method === 'GET' &&
      event.request.headers.get('accept').includes('text/html'))
  )
}

const Strategies = {
  fonts: workbox.strategies.staleWhileRevalidate({
    cacheName: 'fonts',
    plugins: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  }),
}

// Precache
workbox.precaching.precacheAndRoute(self.__precacheManifest || [])
// Add a default application shell
workbox.precaching.precache([{ url: '/app-shell.html', revision: '1.0' }])

// Runtime Cache
workbox.routing.registerRoute(
  /https:\/\/fonts.(googleapis|gstatic).com/,
  Strategies.fonts
)

// Event Listeners
self.addEventListener('install', function onInstallComplete(event) {
  const promises = [
    // Stuff to do when install completes
  ]
  event.waitUntil(Promise.all(promises))
})

self.addEventListener('activate', function onActivate(event) {
  const promises = [
    // Stuff to do when sw activates
  ]
  event.waitUntil(Promise.all(promises))
})

self.addEventListener('message', function onMessage(event) {
  // Do something when sw receives a message
})

self.addEventListener('fetch', function onFetch(event) {
  // If request is navigation request
  if (isNavigationEvent(event)) {
    event.respondWith(caches.match('/app-shell.html'))
  }

  // Add additional fetch handlers here
})
