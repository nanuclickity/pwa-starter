const PATHS = require('../../paths')
const ENV = require('../../env')

module.exports = function CreateJSLoader() {
  const envOptions = {
    cacheDirectory: ENV.isDevelopment,
    compact: ENV.isProdLike
  }

  return {
    test: /\.(js|jsx)$/,
    include: PATHS.SRC,
    loader: require.resolve('babel-loader'),
    options: envOptions
  }
}
