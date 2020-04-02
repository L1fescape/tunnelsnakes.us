const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const root = path.resolve(__dirname)
const src = path.resolve(root, 'src')
const web = path.resolve(src, 'web')
const dist = path.resolve(root, 'build')

const isDev = process.env.NODE_ENV === 'development'

module.exports = [{
  mode: isDev ? 'development' : 'production',
  entry: {
    index: path.resolve(web, 'index.tsx'),
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(dist, 'web'),
  },
  devtool: false,
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  devServer: {
    contentBase: web,
    historyApiFallback: true,
    hot: true,
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 3000,
    writeToDisk: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(web, 'index.ejs'),
    }),
    new MiniCssExtractPlugin({
      filename: isDev ? '[id].[contenthash].css' : '[id].css',
      chunkFilename: isDev ? '[name].[contenthash].css' : '[name].css',
    }),
    ...(isDev
      ? [
          new webpack.SourceMapDevToolPlugin({
            filename: '[file].map[query]',
            exclude: ['vendor/*.js'],
          }),
        ]
      : []),
  ],
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'ts-loader' },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: isDev,
            },
          },
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: 'file-loader?name=[name].[ext]',
      },
      { test: /\.md$/, use: [{ loader: 'html-loader' }] },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  node: {
    __filename: true,
    __dirname: true,
  },
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
  },
  stats: {
    entrypoints: false,
    children: false,
    modules: false,
  },
}, {
  mode: isDev ? 'development' : 'production',
  target: 'node',
  externals: [ nodeExternals() ],
  entry: path.resolve(src, 'index.ts'),
  output: {
    filename: 'app.js',
    path: path.resolve(dist),
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'ts-loader' },
    ],
  },
  node: {
    __filename: true,
    __dirname: true,
  },
}]
