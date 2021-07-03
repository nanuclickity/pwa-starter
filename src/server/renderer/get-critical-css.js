import fs from 'fs'
import url from 'url'
import path from 'path'
import crypto from 'crypto'

import { PurgeCSS } from 'purgecss'

import config from '../config'

const debug = require('debug')('app:renderer:critical-css')
const debugCSSCache = require('debug')('app:renderer:css-cache')

const cssBundlePath = path.join(__dirname + '/server.bundle.css')

// Read all of css bundle into memory.
const allCss = fs.existsSync(cssBundlePath)
  ? fs.readFileSync(cssBundlePath, 'utf-8')
  : ''

// Hold css cache here
const CSS_CACHE = {}

/**
 * Creates an md5 hash from express request object.
 * @param {*} req
 */
const createKeyFromReq = (req) => {
  const pathname = url.parse(req.originalUrl).pathname
  return crypto.createHash('md5').update(pathname).digest('hex')
}

/**
 * Get size of string in KBs
 * @param {String} str
 */
const getKBSizeFromStringLength = (str) => {
  return Buffer.byteLength(str, 'utf8') / 1024
}

/**
 * Reports stats on runtime css cache
 */
const reportCSSCacheStatistics = () => {
  const sizes = Object.keys(CSS_CACHE).reduce((result, keyname) => {
    result.push(
      `${keyname} :  ${getKBSizeFromStringLength(CSS_CACHE[keyname])}KB`
    )
    return result
  }, [])
  debugCSSCache(`Cache Length: ${Object.keys(CSS_CACHE).length}`)
  debugCSSCache(`Sizes:`)
  debugCSSCache(sizes.join('\n\t'))
}

/**
 * Generates critical css for given html
 * @param {String} html result of `renderToString`
 */
export const generateCriticalCSS = (html) => {
  const options = { minify: config.get('MINIFY_CRITICAL_CSS') }

  debug('Purging CSS...')
  try {
    const results = new PurgeCSS().purge({ content: [html], css: [allCss] })
    debug('Purged')
    return results.shift().css
  } catch (err) {
    debug('Failed to purge: ', err)
  }

  // return new Promise((resolve, reject) => {
  //   debug('Purifying')
  //   purify(html, allCss, options, function (purifiedCss) {
  //     debug('Purified css')
  //     if (typeof purifiedCss === 'string') {
  //       return resolve(purifiedCss)
  //     }
  //     return reject(purifiedCss)
  //   })
  // })
}

const collectStream = (stream) =>
  new Promise((resolve, reject) => {
    var data = ''
    stream.on('data', (chunk) => {
      data += chunk
    })
    stream.on('error', (err) => {
      reject(err)
    })
    stream.on('end', () => {
      resolve(data)
    })
  })

export const generateCriticalCSSFromStream = (stream) => {
  return collectStream(stream).then(generateCriticalCSS)
}

/**
 * Get critical css from render context
 * This is usually used in server rendering chain
 * @param {*} context
 */
export default function getCriticalCSS(context, options = {}) {
  const key = createKeyFromReq(context.req)
  const css = CSS_CACHE[key]

  // const { generate = true } = options

  if (options.generate === undefined) {
    options.generate = true
  }

  const shouldGenerate = options.generate && config.get('ENABLE_CRITICAL_CSS')
  var resultPromise = Promise.resolve('')

  // If a cache is found, resolve immediately
  if (css) {
    debug('Found in cache')
    resultPromise = Promise.resolve(css)
  }

  if (shouldGenerate) {
    debug('Generating fresh...')
    resultPromise = context.streamingRender
      ? generateCriticalCSSFromStream(context.renderStream)
      : generateCriticalCSS(context.html)
  }

  return resultPromise
    .then((criticalCSS) => {
      // Insert the new css in cache
      if (shouldGenerate) {
        CSS_CACHE[key] = criticalCSS
        debug('Generated critical css')
      }

      // Attach css to context
      context.criticalCSS = criticalCSS
      return context
    })
    .tap(() => reportCSSCacheStatistics())
}
