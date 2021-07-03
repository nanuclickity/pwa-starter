// Ensure env
process.env.NODE_ENV = process.env.NODE_ENV || 'development'
process.env.BABEL_ENV = process.env.NODE_ENV

const path = require('path')
const webpack = require('webpack')
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin')
const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware')
const evalSourceMapMiddleware = require('react-dev-utils/evalSourceMapMiddleware')

const { WebpackManifestPlugin } = require('webpack-manifest-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

const config = require('../index')

const LOADERS = require('./loaders')

const { ENV, PATHS } = config

const hash = ENV.isProdLike ? 'contenthash:8' : 'hash'

const vendors = [
  'react-dom',
  'react',
  'scheduler',
  'prop-types',
  'classnames',
  'redux',
  'react-redux',
]

function createVendorsRegExp(additional = []) {
  const v = [...vendors, ...additional]
  const re = new RegExp(`node_modules/(${v.join('|')})`)

  return re
}

const webpackConfig = {
  bail: ENV.isProdLike,
  mode: ENV.isProdLike ? 'production' : 'development',
  cache: ENV.isDevelopment,
  devtool: ENV.isDevelopment ? 'cheap-module-source-map' : 'source-map',
  target: 'web',

  context: PATHS.SRC,
  entry: {
    main: [`${PATHS.SRC_CLIENT}/index.js`],
  },
  output: {
    chunkFilename: `[name].[${hash}].chunk.js`,
    filename: ENV.isProdLike
      ? `[name].[${hash}].bundle.js`
      : `[name].bundle.js`,
    path: PATHS.BUILD_PUBLIC,
    pathinfo: true,
    publicPath: config.get('webpackPublicPath'),
    devtoolModuleFilenameTemplate: (info) => {
      return path.resolve(info.absoluteResourcePath).replace(process.cwd(), '')
    },
  },

  resolve: {
    modules: ['node_modules', PATHS.NODE_MODULES, PATHS.SRC_CLIENT],
    fallback: {
      url: false,
    },
    extensions: [
      '.web.js',
      '.js',
      '.json',
      '.web.jsx',
      '.jsx',
      '.styl',
      '.scss',
    ],
    plugins: [
      // new ModuleScopePlugin(PATHS.SRC_CLIENT, PATHS.NODE_MODULES)
    ],
    alias: {
      react: require.resolve('react'),
      'react-dom': require.resolve('react-dom'),
    },
  },

  module: {
    strictExportPresence: true,
    rules: [
      LOADERS.ESLINT_LOADER(),
      LOADERS.FILE_LOADER(),
      LOADERS.URL_LOADER(),
      LOADERS.JS_LOADER(),
      // LOADERS.STYLUS_LOADER(),
      LOADERS.SASS_LOADER(),
      LOADERS.CSS_LOADER(),
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      __SERVER__: false,
      ...config.get('webpackGlobals'),
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new WebpackManifestPlugin({
      fileName: 'asset-manifest.json',
      publicPath: config.get('webpackPublicPath'),
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        context: PATHS.SRC,
      },
      minimize: ENV.isProdLike,
      debug: ENV.isDevelopment,
    }),
  ],
}

webpackConfig.optimization = {
  runtimeChunk: false,
  splitChunks: {
    cacheGroups: {
      vendors: {
        test: createVendorsRegExp(),
        name: 'vendors',
        enforce: true,
      },
    },
  },
}

webpackConfig.performance = {
  hints: ENV.isProdLike ? 'warning' : false,
}

if (ENV.isProdLike) {
  webpackConfig.optimization.splitChunks = {
    ...webpackConfig.optimization.splitChunks,
    chunks: 'all',
    name: false,
    cacheGroups: {
      ...webpackConfig.optimization.splitChunks.cacheGroups,
      styles: {
        name: 'styles',
        test: /\.css$/,
        chunks: 'all',
        enforce: true,
      },
    },
  }

  // webpackConfig.entry.vendors = ['react', 'react-dom']
  webpackConfig.plugins = [
    // new webpack.NormalModuleReplacementPlugin(
    //   /\.\/getStaticRoutes/,
    //   './getDynamicRoutes'
    // ),
    new MiniCssExtractPlugin({
      filename: `[name].[${hash}].bundle.css`,
      chunkFilename: `[name].[${hash}].chunk.[id].css`,
    }),
    new CssMinimizerPlugin({
      test: /\.optimize\.css$/g,
      minimizerOptions: { discardComments: { removeAll: true } },
    }),
    ...webpackConfig.plugins,
  ]
} else {
  // webpackConfig.entry.vendors = vendors
  webpackConfig.entry.main = [
    require.resolve('react-hot-loader/patch'),
    // require.resolve('webpack-dev-server/client'),
    // require.resolve('webpack/hot/dev-server'),
    require.resolve('react-dev-utils/webpackHotDevClient'),
    // require.resolve('react-error-overlay'),
    ...webpackConfig.entry.main,
  ]
  webpackConfig.optimization.splitChunks.cacheGroups.default = {
    reuseExistingChunk: true,
  }
  webpackConfig.resolve.alias['react-dom'] = '@hot-loader/react-dom'
}

// Dev server specific config
webpackConfig.devServer = {
  publicPath: config.get('webpackPublicPath'),
  stats: { modules: false },
  index: '',
  compress: true,
  contentBase: false,
  hot: true,
  overlay: false,
  watchOptions: {
    ignored: /node_modules/,
  },
  before(app, server) {
    // This lets us fetch source contents from webpack for the error overlay
    app.use(evalSourceMapMiddleware(server))
    // This lets us open files from the runtime error overlay.
    app.use(errorOverlayMiddleware())
  },
  port: config.get('DEV_SERVER_PORT'),
  host: '0.0.0.0',
  disableHostCheck: true,
  proxy: {
    '**': `http://0.0.0.0:${config.get('PORT')}`,
  },
}

module.exports = webpackConfig
