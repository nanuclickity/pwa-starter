const PATHS = require('../../paths')
const ENV = require('../../env')

module.exports = function CreateJSLoader(isServer = false) {
  const envOptions = {
    cacheDirectory: ENV.isDevelopment,
    compact: ENV.isProdLike,
  }

  const loader = {
    test: /\.(js|jsx)$/,
    include: PATHS.SRC,
    loader: require.resolve('babel-loader'),
    options: envOptions,
  }

  return loader
}
