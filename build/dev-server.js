require('./check-versions')() //版本检测
var config = require('../config') //配置文件
if (!process.env.NODE_ENV) process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV) //环境变量
var path = require('path') //path模块
var express = require('express') // express框架
var webpack = require('webpack') // webpack工具
var opn = require('opn')
var proxyMiddleware = require('http-proxy-middleware') //反向代理中间件
var webpackConfig = require('./webpack.dev.conf') //webpack开发配置

var port = process.env.PORT || config.dev.port //开发模式端口
var proxyTable = config.dev.proxyTable //反向代理配置

var app = express()
var compiler = webpack(webpackConfig)

//webpack服务器中间件
var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  stats: {
    colors: true,
    chunks: false
  }
})

//webpack热重载中间件  https://github.com/glenjamin/webpack-hot-middleware
var hotMiddleware = require('webpack-hot-middleware')(compiler)
//重载html模板
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// api反向代理地址解析
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(context, options))
})

// 无刷新跳转
app.use(require('connect-history-api-fallback')())

app.use(devMiddleware)

app.use(hotMiddleware)

//静态资源配置
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  var uri = 'http://localhost:' + port
  console.log('Listening at ' + uri + '\n')

  // test下，不打开页面
  if (process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
})
