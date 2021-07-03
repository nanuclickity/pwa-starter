const path = require('path')

const ROOT = path.normalize(path.join(__dirname, '../')).replace(/\/$/, '')

const BUILD_DIR = process.env.DIST_MODE === '1' ? 'dist' : 'build'

const paths = {
  ROOT: ROOT,

  CONFIG_DIR: `${ROOT}/config`,

  SRC: `${ROOT}/src`,
  SRC_CLIENT: `${ROOT}/src/client`,
  SRC_PUBLIC: `${ROOT}/src/public`,
  SRC_SERVER: `${ROOT}/src/server`,
  SRC_SERVER_VIEWS: `${ROOT}/src/server/views`,

  BUILD: `${ROOT}/${BUILD_DIR}`,
  BUILD_PUBLIC: `${ROOT}/${BUILD_DIR}/public`,
  BUILD_SERVER_VIEWS: `${ROOT}/${BUILD_DIR}/views`,

  NODE_MODULES: `${ROOT}/node_modules`,

  SCSS_BASE: `${ROOT}/src/client/scss`,
}

Object.keys(paths).forEach((key) => {
  paths[key] = path.normalize(paths[key])
})

module.exports = paths
