const fs = require('fs')
const dotenv = require('dotenv')
const debug = require('debug')('app:config')

/**
 * dotenv never overwrites keys
 * keys listed in this array will be assumed
 * safe to override
 */
const OVERRIDE_KEYS = [
  // add keys to override here
]


/**
 * Safely injects a .env config file
 * Warns when values are being overwritten
 * @param {String} filePath path to .env file
 */
function checkAndInject(filePath) {
  const parsed = dotenv.parse(filePath)

  Object.keys(parsed).forEach(key => {
    // safe to add
    if (!process.env[key]) {
      process.env[key] = parsed[key]
    } else if (process.env[key] && OVERRIDE_KEYS.includes(key)) {
      debug(`[WARN]: Force-Overwriting '${key}' from '${filePath}' because it exists in OVERRIDE_KEYS list`)
      process.env[key] = parsed[key]
    } else {
      debug(`[WARN]: Skipping '${key}' because already present in process.env`)
    }
  })
}


// Throw an uncaught error if config can't be read
// This safely exits node.js process
// Using process.exit terminates everything immediately
// even logs going to process.stdout
function readConfig(filePath, config) {
  debug(`Reading: ${filePath}`)

  try {
    fs.accessSync(filePath, fs.constants.R_OK)
    checkAndInject(filePath)
  } catch (err) {
    debug(`  Cannot read: ${filePath}`)
    debug(`
      Server should not start without reading config files
      If you've recently created a new environment
      create a blank file: .env.${process.env.TRACK}
    `)
    if (config.ENV.isProdLike) {
      throw new Error('Should not run without config file')
    } else {
      debug(`
        Not throwing error because not on prod/volmir tracks
        But if you need some env variables for build process
        Please add a file .env.${process.env.TRACK} to project root
      `)
    }
  }
}


module.exports = (config) => {
  if (config.ENV.isProdLike) {
    readConfig(`${config.PATHS.ROOT}/.env.common`, config)
    readConfig(`${config.PATHS.ROOT}/.env`, config)
  } else {
    readConfig(`${config.PATHS.CONFIG_DIR}/.env`, config)
  }
}
