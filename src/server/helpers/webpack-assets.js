import fs from 'fs'
import path from 'path'
import config from '../config'

const debug = require('debug')('app:helpers')

export const readWebpackAssets = (app) => {
  const manifestPath = path.join(
    config.PATHS.BUILD_PUBLIC,
    'asset-manifest.json'
  )
  try {
    const str = fs.readFileSync(manifestPath, 'utf-8')
    const assets = JSON.parse(str)

    debug(`Loaded webpack assets from ${manifestPath}`)

    // Make available to templates
    app.locals.webpack_assets = assets
  } catch (err) {
    console.log('Unable to read webpack assets from ' + manifestPath)
  }
}
