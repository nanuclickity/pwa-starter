const debug = require('debug')('app:config')
const pkg = require('../package.json')

// console.log('setting node env', process.env.NODE_ENV)

var config = {
  version: pkg.version,

  ENV: require('./env'),
  PATHS: require('./paths'),

  set(key, value) {
    if (this[key]) {
      debug(`Overriding config ${key} to ${value}`)
    }

    if (typeof key === 'object' && !Array.isArray(key)) {
      Object.keys(key).forEach((k) => {
        this.set(k, key[k])
      })
    } else {
      this[key] = value
    }
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
      .filter((k) => typeof k !== 'function')
      .reduce((acc, k) => {
        acc[k] = this[k]
        return acc
      }, {})
  },
}

// Ensure 'this'
config.get = config.get.bind(config)
config.set = config.set.bind(config)
config.toJSON = config.toJSON.bind(config)

// Setting this here because it will be used in
// both server and client configs
config.webpackGlobals = {
  'process.env': {
    NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    BABEL_ENV: JSON.stringify(process.env.BABEL_ENV),
    DEBUG: JSON.stringify(process.env.DEBUG),
  },
  __DEV__: config.ENV.isDevelopment,
  __PROD__: config.ENV.isProdLike,
  __TRACK__: config.ENV.TRACK,
}
config.webpackPublicPath = '/public/'

// Add env specific config
Object.assign(config, require('./dotenv')(config))

function injectOriginalEnv() {
  return Object.keys(process.env).reduce((acc, k) => {
    const v = process.env[k]
    if (typeof v === 'string') {
      acc[k] = JSON.stringify(v)
    } else if (typeof v === 'number') {
      acc[k] = v.toString()
    } else if (typeof v === 'boolean') {
      acc[k] = v.toString()
    } else if (v === null) {
      acc[k] = 'null'
    }

    return acc
  }, {})
}

module.exports = config
