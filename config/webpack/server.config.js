// Ensure env
process.env.NODE_ENV = process.env.NODE_ENV || 'development'
process.env.BABEL_ENV = process.env.NODE_ENV

const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const LOADERS = require('./loaders')
const config = require('../index')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

const { ENV, PATHS } = config

const webpackConfig = {
  mode: ENV.isProdLike ? 'production' : 'development',
  target: 'node',
  devtool: ENV.isDevelopment ? 'cheap-module-source-map' : 'source-map',
  cache: ENV.isDevelopment,
  context: PATHS.SRC,

  entry: [`${PATHS.SRC_SERVER}/app.js`],
  output: {
    path: PATHS.BUILD,
    filename: 'server.bundle.js',
    libraryTarget: 'commonjs2',
    devtoolModuleFilenameTemplate: (info) => {
      return path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')
    },
  },

  resolve: {
    modules: [
      'node_modules',
      PATHS.NODE_MODULES,
      PATHS.SRC_CLIENT,
      PATHS.SRC_SERVER,
    ],
    extensions: ['.web.js', '.js', '.json', '.web.jsx', '.jsx', '.scss'],
    plugins: [
      // Prevents importing files outside src
      // new ModuleScopePlugin(PATHS.SRC_CLIENT, PATHS.NODE_MODULES),
    ],
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
      LOADERS.CSS_LOADER(true),
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      __SERVER__: true,
      ...config.get('webpackGlobals'),
    }),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new MiniCssExtractPlugin({
      filename: 'server.bundle.css',
    }),
  ],

  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin({
        test: /\.css$/g,
        minimizerOptions: { discardComments: { removeAll: true } },
      }),
    ],
  },

  performance: {
    hints: ENV.isProdLike ? 'warning' : false,
  },
  node: {
    global: false,
    __filename: false,
    __dirname: false,
  },
}

module.exports = webpackConfig
