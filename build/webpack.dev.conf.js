var config = require('../config') //配置文件
var webpack = require('webpack') // webpack工具
var merge = require('webpack-merge') // webpack配置合并插件
var utils = require('./utils') //常用函数集合
var baseWebpackConfig = require('./webpack.base.conf') //webpack基础配置
var HtmlWebpackPlugin = require('html-webpack-plugin') //html插件

//热重载
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

module.exports = merge(baseWebpackConfig, {
  module: {
    loaders: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
 
  devtool: '#eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),

    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),

    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    })
  ]
})
