// yarn add apply-loader autoprefixer babel-core babel-loader babel-preset-env copy-webpack-plugin css-loader extract-text-webpack-plugin globule node-sass postcss postcss-loader pug pug-loader sass-loader style-loader webpack webpack-dev-server

// develop : webpack-dev-server --open
// build   : NODE_ENV=production webpack

const webpack = require('webpack')
const path = require('path')
const globule = require('globule')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

// ディレクトリの設定
const opts = {
  srcDir: path.join(__dirname, 'src'),
  destDir: path.join(__dirname, 'public')
}

// keyの拡張子のファイルが、valueの拡張子のファイルに変換される
const convertExtensions = {
  pug: 'html',
  sass: 'css',
  js: 'js'
}

// トランスパイルするファイルを列挙する
// _から始まるファイルは、他からimportされるためのファイルとして扱い、個別のファイルには出力しない
const files = {}
Object.keys(convertExtensions).forEach(from => {
  const to = convertExtensions[from]
  globule.find([`**/*.${from}`, `!**/_*.${from}`], {cwd: opts.srcDir}).forEach(filename => {
    files[filename.replace(new RegExp(`.${from}$`, 'i'), `.${to}`)] = path.join(opts.srcDir, filename)
  })
})

// pugでトランスパイルする
const pugLoader = [
  'apply-loader',
  'pug-loader'
]

// Sassをトランスパイルし、autoprefixerをかけるようにする
const sassLoader = [
  {
    loader: 'css-loader',
    options: {
      minimize: true
    }
  },
  {
    loader: 'postcss-loader',
    options: {
      ident: 'postcss',
      plugins: (loader) => [require('autoprefixer')()]
    }
  },
  'sass-loader'
]

// Babelでトランスパイルする
const jsLoader = {
  loader: 'babel-loader',
  query: {
    presets: ['env']
  }
}

const config = {
  context: opts.srcDir,
  entry: files,
  output: {
    filename: '[name]',
    path: opts.destDir
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        use: ExtractTextPlugin.extract(pugLoader)
      },
      {
        test: /\.sass$/,
        oneOf: [
          {
            // pugから `require('./hoge.sass?inline')` のように呼ばれた時は、ExtractTextPluginをかけない
            resourceQuery: /inline/,
            use: sassLoader
          },
          {
            // それ以外の時は、単純にファイルを生成する
            use: ExtractTextPlugin.extract(sassLoader)
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules(?!\/webpack-dev-server)/,
        use: jsLoader
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('[name]'),
    // convertExtensionsに含まれていないファイルは、単純にコピーする
    new CopyWebpackPlugin(
      [{from: {glob: '**/*', dot: true}}],
      {ignore: Object.keys(convertExtensions).map((ext) => `*.${ext}`)}
    ),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ],
  devServer: {
    contentBase: opts.destDir,
    watchContentBase: true
  }
}

if (process.env.NODE_ENV === 'production') {
  config.plugins = config.plugins.concat([
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin()
  ])
}

module.exports = config
