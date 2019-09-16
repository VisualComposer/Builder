import path from 'path'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import webpack from 'webpack'
import TerserPlugin from 'terser-webpack-plugin'

module.exports = {
  mode: 'production',
  entry: {
    fontawesome: ['./src/css/font-awesome-5.10.2/less/fontawesome.less'],
    lineicons: ['./src/css/vcv-linecons/font.less'],
    entypo: ['./src/css/vcv-entypo/font.less'],
    monosocial: ['./src/css/vcv-monosocial-1.10/style.less'],
    typicons: ['./src/css/vcv-typicons-2.0.7/font.less'],
    openiconic: ['./src/css/vcv-openiconic-1.1.1/font.less'],
    material: ['./src/css/vcv-material-3.0.1/font.less'],
    batch: ['./src/css/vcv-batch-1.3/font.less'],
    mfglabs: ['./src/css/vcv-mfglabs/font.less'],
    metrize: ['./src/css/vcv-metrize-1.0/font.less'],
    dripicons: ['./src/css/vcv-dripicons-2.0/font.less'],
    feather: ['./src/css/vcv-feather/font.less'],
    linearicons: ['./src/css/vcv-linearicons/font.less'],
    socials: ['./src/css/vcv-socials/font.less'],
    cart: ['./src/css/vcv-cart/font.less']
  },
  output: {
    path: path.resolve(__dirname, 'dist/'), // Assets dist path
    publicPath: '.', // Used to generate URL's
    filename: '[name].bundle.css', // Main bundle file
    chunkFilename: '[id].js'
  },
  node: {
    'fs': 'empty'
  },
  optimization: {
    minimize: true,
    runtimeChunk: false,
    namedChunks: true, // MUST BE true even for production
    namedModules: true, // MUST BE true even for production
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          safari10: true
        }
      })
    ]
  },
  plugins: [
    new ExtractTextPlugin('[name].bundle.css'),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ],
  module: {
    rules: [
      { parser: { amd: false } },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
      },
      // {
      //   test: /\.js$/,
      //   use: { loader: 'babel-loader' },
      //   exclude: /node_modules/
      //   // exclude: new RegExp('node_modules\\' + path.sep + '(?!postcss-prefix-url)'),
      //   // query: {
      //   //   // https://github.com/babel/babel-loader#options
      //   //   cacheDirectory: true
      //   // }
      // },
      // {
      //   test: /\.js$/,
      //   include: /node_modules/,
      //   loader: StringReplacePlugin.replace({ // from the 'string-replace-webpack-plugin'
      //     replacements: [ {
      //       pattern: /define\.amd/ig,
      //       replacement: function () {
      //         return false
      //       }
      //     } ]
      //   })
      // },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [ 'css-loader', {
            loader: 'postcss-loader',
            options: {
              plugins: () => [ require('autoprefixer')() ]
            }
          }, 'less-loader' ]
        })
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [ 'css-loader', {
            loader: 'postcss-loader',
            options: {
              plugins: () => [ require('autoprefixer')() ]
            }
          }, 'less-loader' ]
        })
      },
      // use ! to chain loaders./
      { test: /\.(png|jpe?g|gif)$/, use: 'url-loader?limit=10000&name=/images/[name].[ext]?[hash]' }, // inline base64 URLs for <=8k images, direct URLs for the rest.
      { test: /\.woff(2)?(\?.+)?$/, use: 'url-loader?limit=10000&mimetype=application/font-woff&name=/fonts/[name].[ext]?[hash]' },
      { test: /\.(ttf|eot|svg)(\?.+)?$/, use: 'file-loader?name=/fonts/[name].[ext]?[hash]' },
      { test: /\.raw(\?v=\d+\.\d+\.\d+)?$/, use: 'raw-loader' }
      // { test: /bootstrap\/js\//, loader: 'imports?jQuery=jquery&$=jquery' }
    ]
  }
}
