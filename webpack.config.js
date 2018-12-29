const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const cleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const glob = require('glob');
const PAGE_PATH = path.resolve(__dirname, './src/pages');
const entryFiles = glob.sync(PAGE_PATH + '/*.js');

const DEV = process.env.NODE_ENV === 'development';

function mapEntryFile() {
  let configEntry = {};
  let htmlTemplateArr = [];
  entryFiles.forEach((filePath) => {
    let filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))
    configEntry[filename] = filePath;
    htmlTemplateArr.push(new HtmlWebpackPlugin({
      filename: `${filename}.html`,
      template: path.resolve(__dirname, './index.html'),
      inject: true,
      // hash: true, //为静态资源生成hash值
      chunks: [filename],
      minify: { //压缩HTML文件
          removeAttributeQuotes: true, // 移除属性的引号
          removeComments: true, //移除HTML中的注释
          collapseWhitespace: true //删除空白符与换行符
      }
    }))
  })
  return { entry: configEntry, outPut: htmlTemplateArr };
};

let config = {
  entry: mapEntryFile().entry,
  output: {
    path: path.join(__dirname, './dist'),
    filename: '[name].js',
    publicPath: '/'
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            css: ExtractTextPlugin.extract({ use: ['css-loader'], fallback: 'vue-style-loader' }),
            less: ExtractTextPlugin.extract({ use: ['css-loader', 'less-loader'], fallback: 'vue-style-loader' })
          }
        }
      },
      {
        test: /\.(css|less)$/,
        use: ['vue-style-loader','css-loader', 'less-loader']
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: [['env', { module: false }], 'stage-0']
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/[name].[ext]?[hash]'
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/[name].[ext]?[hash]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/[name].[ext]?[hash]'
        }
      }
    ]
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      components: path.join(__dirname, './src/components')
    },
    extensions: ['.js', '.vue', '.json']
  },
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join('/', 'index.html') },
      ],
    },
    open: true,
    hot: true,
    compress: true,
    port: 2012,
    contentBase: false,
    inline: true,
    stats: {
      children: false,
      modules: false,
    },
  },
  devtool: 'cheap-module-eval-source-map',
  plugins: [
    ...mapEntryFile().outPut,
    new ExtractTextPlugin('css/[name].[chunkhash].css')
  ]
}

if (!DEV) {
  config.output.filename = 'js/[name].[chunkhash].js';
  config.devtool = '#source-map';
  config.mode = 'production';
  config.plugins = config.plugins.concat([
    new cleanWebpackPlugin(['dist']),
    new webpack.DefinePlugin({ 'process.env': { NODE_ENV: '"production"' } }),
    new webpack.LoaderOptionsPlugin({ minimize: true })
  ])
} else {
  config.plugins = config.plugins.concat([
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ])
}

module.exports = config
  