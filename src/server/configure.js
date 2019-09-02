import express from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import compression from 'compression'

import getRouter from './routes/index'
import config from './config'
// const debug = require('debug')('app:configure')

export default function configure(app) {
  app.set('views', config.PATHS.SRC_SERVER_VIEWS)
  app.set('view engine', 'pug')

  // Enables templates to decide env related behaviour
  app.locals.is_prod = config.ENV.isProdLike

  // Enables pretty printing of pugjs templates in dev mode
  app.locals.pretty = config.ENV.isDevelopment

  // Logger
  // 'combined' is standard apache log format
  app.use(morgan(config.ENV.isProdLike ? 'combined' : 'dev'))

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  // Use compression
  app.use(compression())

  const staticOptions = {}
  if (config.ENV.isProdLike) {
    staticOptions.maxAge = '30 days'
  }

  // Static assets should be served without cookies
  // and ideally through a cdn
  app.use('/public', express.static(config.PATHS.BUILD_PUBLIC, staticOptions))

  // Enable cookies after static routes
  app.use(cookieParser())

  // Add routes
  app.use('/', getRouter(app))

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found')
    err.status = 404
    next(err)
  })

  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.error_message = err.message
    res.locals.error = config.ENV.isDevelopment ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error')
  })
}
