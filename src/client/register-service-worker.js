// checks if current window is controlled by a service worker or not
// if it's not, then it means service worker will be activated immediately
// function windowIsNotControlled() {
//   return !navigator.serviceWorker.controller
// }

const debug = require('debug')('app:register-sw')

function onServiceWorkerUpdate(registration) {
  console.log('service worker found update')
}

function fetchAndInstallSW() {
  return navigator.serviceWorker
    .register('./sw.js')
    .then(registration => {
      debug('Registered Successfully', registration)

      // This gets fired up, when latest service worker has different files in precache
      registration.onupdatefound = () => onServiceWorkerUpdate(registration)
    })
    .catch(err => {
      debug('Cannot register SW', err)
      console.error(err)
    })
}

export default function registerServiceWorker() {
  // Don't do anything if service worker is not supported
  if (!navigator.serviceWorker) {
    return
  }

  // Install the service worker after document has loaded
  // so it doesn't interefere with app loading
  window.addEventListener('load', fetchAndInstallSW)
}
