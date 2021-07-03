/**
 * Controllers used in bootstrapping the server
 * All of the following can be plugged into `server/configure.js` like this
 * @example
 * import {serveServiceWorker} from 'controllers/startup'
 * ...
 * app.use(serveServiceWorker())
 * ...
 */

import path from 'path'
import Router from 'express'
import { CachedFileResponse } from 'helpers/common'

const debug = require('debug')('app:controllers:startup')

const SW_FILE_PATH = path.join(__dirname, './public/sw.js')
const WORKBOX_FILE_PATH = path.join(
  __dirname,
  '../node_modules/workbox-sw/build/workbox-sw.js'
)

const serveCachedFile =
  (filePath, mimeType = 'text/plain') =>
  (req, res, next) => {
    debug('Serving cached file: ', filePath, mimeType)
    CachedFileResponse(filePath)
      .then((text) => {
        res.type(mimeType)
        res.send(text)
      })
      .catch((err) => next(err))
  }

export const serveServiceWorker = () => {
  const router = Router()

  // Serve service worker
  router.get('/sw.js', serveCachedFile(SW_FILE_PATH, 'text/javascript'))
  router.get(
    '/workbox-sw.js',
    serveCachedFile(WORKBOX_FILE_PATH, 'text/javascript')
  )
  router.get('/workbox-sw.js.map', serveCachedFile(WORKBOX_FILE_PATH + '.map'))

  return router
}
