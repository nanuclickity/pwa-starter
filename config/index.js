const debug = require('debug')('app:config')
const pkg = require('../package.json')

var config = {
  version: pkg.version,

  ENV: require('./env'),
  PATHS: require('./paths'),

  set(key, value){
    if (this[key]) {
      debug(`Overriding config ${key} to ${value}`)
    }
    this[key] = value
  },
  get(key) {
    const v = this[key]
    if (v === null || v === undefined) {
      debug(`Requested config ${key} not found`)
    }
    return v
  },
  toJSON() {
    return Object.keys(this)
      .filter(k => typeof k !== 'function')
      .reduce((acc, k) => {
        acc[k] = this[k]
        return acc
      }, {})
  }
}


// Ensure 'this'
config.get = config.get.bind(config)
config.set = config.set.bind(config)
config.toJSON = config.toJSON.bind(config)


// Setting this here because it will be used in
// both server and client configs
config.webpackGlobals = {
  'process.env.NODE_ENV': config.ENV.NODE_ENV,
  __DEV__: config.ENV.isDevelopment,
  __PROD__: config.ENV.__PROD__,
  __TRACK__: config.ENV.__TRACK__
}
config.webpackPublicPath = '/public'


// Ensure env for babel
process.env.BABEL_ENV = config.ENV.NODE_ENV


// Add env specific config
Object.assign(
  config,
  require('./dotenv')(config)
)


module.exports = config
