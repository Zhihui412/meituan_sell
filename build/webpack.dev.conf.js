'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

const express = require('express')  // nodejs开发框架express，用来简化操作
const app = express()    // 创建node.js的express开发框架的实例
// 1.读取json数据
var goods = require('../data/01-商品页(点菜).json');  //加载本地数据文件
var ratings = require('../data/02-商品页(评价).json');  //加载本地数据文件
var seller = require('../data/03-商品页(商家).json');  //加载本地数据文件

// // 2.路由
// var routes = express.Router()

// // 3.编写接口
// routes.get('/goods',(req,res) => {
//   // 返回数据给客户端，返回json数据
//   res.json(goods);
// });
// routes.get('/ratings',(req,res) => {
//   // 返回数据给客户端，返回json数据
//   res.json(ratings);
// });
// routes.get('/seller',(req,res) => {
//   // 返回数据给客户端，返回json数据
//   res.json(seller);
// });
// app.use('/api', routes) // 所有通过接口相关的api都会通过api这个路由导向到具体的路由



const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
         proxy : config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    },
    // 配置路由
    before (app) {
       app.get('/api/seller', function (req, res) {
        // 服务端收到请求后返回给客户端一个json数据
        res.json({
         // 当我们数据正常时，我们通过传递errno字符为0表示数据正常
         errno: 0,
         // 返回json中的卖家数据
         data: seller
        })
       }),
       app.get('/api/ratings', function (req, res) {
        // 服务端收到请求后返回给客户端一个json数据
        res.json({
         // 当我们数据正常时，我们通过传递errno字符为0表示数据正常
         errno: 0,
         // 返回json中的卖家数据
         data: ratings
        })
       }),
       app.get('/api/goods', function (req, res) {
        // 服务端收到请求后返回给客户端一个json数据
        res.json({
         // 当我们数据正常时，我们通过传递errno字符为0表示数据正常
         errno: 0,
         // 返回json中的卖家数据
         data: goods
        })
       })     
      }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
