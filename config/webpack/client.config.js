const path = require('path')
const webpack = require('webpack')
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const config = require('../index')

const LOADERS = require('./loaders')

const { ENV, PATHS } = config


const hash = ENV.isProdLike ? 'contenthash:8' : 'hash'

const webpackConfig = {
  bail: ENV.isProdLike,
  mode: ENV.isProdLike ? 'production' : 'development',
  cache: ENV.isDevelopment,
  devtool: ENV.isDevelopment ? 'cheap-module-source-map' : 'source-map',
  target: 'web',

  context: PATHS.SRC,
  entry: {
    main: [`${PATHS.SRC_CLIENT}/index.js`]
  },
  output: {
    chunkFilename: `[name].[${hash}].chunk.js`,
    filename: ENV.isProdLike ? `[name].[${hash}].bundle.js` : `[name].bundle.js`,
    path: PATHS.BUILD_PUBLIC,
    pathinfo: true,
    publicPath: config.get('webpackPublicPath'),
    devtoolModuleFilenameTemplate: info => {
      return path.resolve(info.absoluteResourcePath).replace(process.cwd(), '')
    }
  },

  resolve: {
    modules: ['node_modules', PATHS.NODE_MODULES, PATHS.SRC_CLIENT],
    extensions: ['.web.js', '.js', '.json', '.web.jsx', '.jsx', '.styl'],
    plugins: [
      new ModuleScopePlugin(PATHS.SRC_CLIENT)
    ]
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
      LOADERS.CSS_LOADER()
    ]
  },


  plugins: [
    new webpack.DefinePlugin({
      __IS_SERVER__: false,
      ...config.get('webpackGlobals')
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new ManifestPlugin({
      fileName: 'asset-manifest.json',
      publicPath: config.get('webpackPublicPath')
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        context: PATHS.SRC
      },
      minimize: ENV.isProdLike,
      debug: ENV.isDevelopment
    })
  ]

}

webpackConfig.optimization = {
  runtimeChunk: false,
  splitChunks: {
    name: true,
    cacheGroups: {
      vendors: {
        test: /\/node_modules\//,
        name: 'vendors',
        minChunks: 3
      }
    }
  }
}


webpackConfig.performance = {
  hints: ENV.isProdLike ? 'warning' : false
}


if (ENV.isProdLike) {
  webpackConfig.optimization.splitChunks.cacheGroups.styles = {
    name: 'styles',
    test: /\.css$/,
    chunks: 'all',
    enforce: true
  }
  webpackConfig.entry.vendors = ['react', 'react-dom']
  webpackConfig.plugins = [
    new webpack.NormalModuleReplacementPlugin(
      /\.\/getStaticRoutes/,
      './getDynamicRoutes'
    ),
    new MiniCssExtractPlugin({
      filename: `[name].[${hash}].bundle.css`,
      chunkFilename: `[name].[${hash}].chunk.[id].css`
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.optimize\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorOptions: { discardComments: { removeAll: true } },
      canPrint: true
    }),
    ...webpackConfig.plugins
  ]
} else {
  webpackConfig.plugins = [
    new webpack.HotModuleReplacementPlugin(),
    ...webpackConfig.plugins
  ]

  webpackConfig.entry.main = [
    require.resolve('react-hot-loader/patch'),
    // require.resolve('webpack-hot-middleware/client'),
    require.resolve('react-dev-utils/webpackHotDevClient'),
    require.resolve('react-error-overlay'),
    ...webpackConfig.entry.main
  ]
}


// Dev server specific config
webpackConfig.devServer = {
  publicPath: config.output.publicPath,
  stats: { modules: false },
  index: '',
  compress: true,
  contentBase: false,
  hot: true,
  overlay: true,
  watchOptions: {
    ignored: /node_modules/
  },
  port: config.get('DEV_SERVER_PORT'),
  host: '0.0.0.0',
  disableHostCheck: true,
  proxy: {
    '**': `http://0.0.0.0:${config.get('PORT')}`
  }
}


module.exports = webpackConfig
