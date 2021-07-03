import fs from 'fs'
import path from 'path'
import express from 'express'
import http from 'http'
import https from 'https'

import config from './config'
import configure from './configure'
import { readWebpackAssets } from './helpers/webpack-assets'

const debug = require('debug')('app:server')

const app = express()

const port = config.get('PORT') || process.env.PORT

// Reads webpack asset-manifest to add prefetch headers
readWebpackAssets(app)

// Add server configuration
configure(app)

const httpsOptions = {
  certPath: path.resolve(config.get('HTTPS_CERT')),
  certKeyPath: path.resolve(config.get('HTTPS_CERT_KEY')),
}

// Start server
const server = http.createServer(app)
server.listen(port)
server.on('error', onServerError)
server.on('listening', onListening)

if (config.get('ENABLE_HTTPS')) {
  const httpsServer = https.createServer(
    {
      key: fs.readFileSync(httpsOptions.certKeyPath),
      cert: fs.readFileSync(httpsOptions.certPath),
    },
    app
  )
  httpsServer.listen(443)
  httpsServer.on('error', onServerError)
  httpsServer.on('listening', onListening)
}

function onServerError(error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
    default:
      throw error
  }
}

function onListening() {
  var addr = server.address()
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
  debug('Listening on ' + bind)
}

export function getServer() {
  return app
}
export function getRunningServer() {
  return server
}
