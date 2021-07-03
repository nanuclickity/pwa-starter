const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const ENV = require('../../env')
const PATHS = require('../../paths')

const { _CSS_LOADER, _POSTCSS_LOADER } = require('./css-loader')

const _SASS_LOADER = (isServer = false) => ({
  loader: require.resolve('sass-loader'),
  options: {
    sourceMap: !isServer && ENV.isDevelopment,
    sassOptions: {
      includePaths: [PATHS.SCSS_BASE],
    },
  },
})

// const _STYLUS_LOADER = (isServer = false)=> ({
// 	loader: require.resolve('stylus-loader'),
// 	options: {
// 		sourceMap: !isServer && process.env.NODE_ENV !== "production",
// 		use: [nib(), axis(), rupture()],
// 		import: PATHS.STYLUS_BASE,
// 		error: true,
// 		compress: process.env.NODE_ENV === "production",
// 		'include css': true
// 	}
// })

const LOADER_DEV = (isServer) => ({
  test: /\.(sass|scss)$/,
  use: [
    require.resolve('style-loader'),
    _CSS_LOADER(isServer),
    _POSTCSS_LOADER(isServer),
    _SASS_LOADER(isServer),
  ],
})

const LOADER_PROD = (isServer) => ({
  test: /\.(sass|scss)$/,
  use: [
    MiniCssExtractPlugin.loader,
    _CSS_LOADER(isServer),
    _POSTCSS_LOADER(isServer),
    _SASS_LOADER(isServer),
  ],
})

// To use pre-rendering on server
const LOADER_SERVER = LOADER_PROD

module.exports = function CreateSassLoader(isServer = false) {
  if (isServer)
    //eslint-disable-line
    return LOADER_SERVER(isServer)
  return ENV.isProdLike ? LOADER_PROD(isServer) : LOADER_DEV(isServer)
}
