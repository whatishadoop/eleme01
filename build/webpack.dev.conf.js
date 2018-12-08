//开发环境下的webpack配置，通过merge方法合并webpack.base.conf.js基础配置
var config = require('../config')  // js配置文件 index.js
var webpack = require('webpack')  // 插件引入方法
var merge = require('webpack-merge')  // 插件引入方法
var utils = require('./utils')  // js工具类
var baseWebpackConfig = require('./webpack.base.conf') //js配置文件
var HtmlWebpackPlugin = require('html-webpack-plugin') //插件引入方法

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

module.exports = merge(baseWebpackConfig, {
  module: {
    // 通过传入一些配置来获取rules配置，此处传入了sourceMap: false,表示不生成sourceMap
    loaders: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // eval-source-map is faster for development
  devtool: '#eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    })
  ]
})
