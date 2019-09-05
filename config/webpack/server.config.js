// Ensure env
process.env.NODE_ENV = process.env.NODE_ENV || 'development'
process.env.BABEL_ENV = process.env.NODE_ENV

const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const LOADERS = require('./loaders')
const config = require('../index')

const { ENV, PATHS } = config

const webpackConfig = {
  mode: ENV.isProdLike ? 'production' : 'development',
  target: 'node',
  devtool: false,
  cache: ENV.isDevelopment,
  context: PATHS.SRC,

  entry: [`${PATHS.SRC_SERVER}/app.js`],
  output: {
    path: PATHS.BUILD,
    filename: 'server.bundle.js',
    libraryTarget: 'commonjs2',
    devtoolModuleFilenameTemplate: info => {
      return path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')
    }
  },

  resolve: {
    modules: [
      'node_modules',
      PATHS.NODE_MODULES,
      PATHS.SRC_CLIENT,
      PATHS.SRC_SERVER
    ],
    extensions: ['.web.js', '.js', '.json', '.web.jsx', '.jsx'],
    plugins: [
      // Prevents importing files outside src
      new ModuleScopePlugin(PATHS.SRC_CLIENT)
    ]
  },

  externals: [nodeExternals()],

  module: {
    strictExportPresence: true,
    rules: [
      LOADERS.ESLINT_LOADER(),
      LOADERS.FILE_LOADER(),
      LOADERS.URL_LOADER(),
      LOADERS.JS_LOADER(),
      // LOADERS.STYLUS_LOADER(true),
      LOADERS.SASS_LOADER(true),
      LOADERS.CSS_LOADER(true)
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      __SERVER__: true,
      ...config.get('webpackGlobals')
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new MiniCssExtractPlugin({
      filename: 'server.bundle.css'
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.optimize\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorOptions: { discardComments: { removeAll: true } },
      canPrint: true
    })
  ],

  performance: {
    hints: ENV.isProdLike ? 'warning' : false
  },
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false
  }
}

module.exports = webpackConfig
