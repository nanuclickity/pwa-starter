const ENV = require('../../env')
const autoprefixer = require('autoprefixer')

/*
modules: 'global'
this ensures that only the classnames inside `:local()` syntax
are hashed, any other classnames are used as-is

e.g
:local(.foo) {
  .bar { color: blue; }
}
.baz { color: black; }

will yield
.foo_1adf .bar { color: blue; }
.baz { color: black; }

this gives far greater flexibity and cleanliness in architecture
and is perfectly safe for actual css modules spec

non hashed classnames are easlier to target with
complex css rules, javascript and code editor completions
*/

const _CSS_LOADER = (isServer = false) => ({
  loader: 'css-loader',
  options: {
    sourceMap: ENV.isDevelopment && !isServer,
    modules: {
      mode: 'global',
      localIdentName: ENV.isProdLike
        ? '[hash:base64:4]'
        : '[name]_[local]_[hash:base64:3]',
    },
  },
})

const _POSTCSS_LOADER = (isServer = false) => ({
  loader: require.resolve('postcss-loader'),
  options: {
    postcssOptions: {
      plugins: () => [
        require('postcss-flexbugs-fixes'),
        autoprefixer({
          //browsers: ['> 3%', 'last 4 versions', 'iOS 7'],
          flexbox: 'no-2009',
        }),
      ],
      sourceMap: ENV.isDevelopment && !isServer,
    },
  },
})

function CreateCSSLoader(isServer = false) {
  const config = {
    test: /\.css$/,
    use: [require.resolve('style-loader'), _CSS_LOADER(isServer)],
  }

  if (!isServer) {
    config.use.push(_POSTCSS_LOADER(isServer))
  }

  return config
}

module.exports = {
  CreateCSSLoader: CreateCSSLoader,
  _POSTCSS_LOADER: _POSTCSS_LOADER,
  _CSS_LOADER: _CSS_LOADER,
}
