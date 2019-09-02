import './before-app'
import express from 'express'
import http from 'http'

import config from './config'
import configure from './configure'

const debug = require('debug')('app:server')

const app = express()

const port = config.get('PORT') || process.env.PORT
debug(`Using port ${port}`)

// Add server configuration
configure(app)

// Start server
const server = http.createServer(app)
server.listen(port)
server.on('error', onServerError)
server.on('listening', onListening)

function onServerError (error) {
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

function onListening () {
  var addr = server.address()
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
  debug('Listening on ' + bind)
}

export default app
export function getServerInstance () {
  return server
}
