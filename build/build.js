// https://github.com/shelljs/shelljs
require('shelljs/global')
env.NODE_ENV = 'production'  // 设置为生产环境

var path = require('path')
var config = require('../config')
var ora = require('ora')  // 用于异常执行时给出 打包信息提示如转圈的文案，提示信息等
var webpack = require('webpack')
var webpackConfig = require('./webpack.prod.conf')

console.log(
  '  Tip:\n' +
  '  Built files are meant to be served over an HTTP server.\n' +
  '  Opening index.html over file:// won\'t work.\n'
)

//打包时使用ora进行文案提示
var spinner = ora('building for production...')
spinner.start()

var assetsPath = path.join(config.build.assetsRoot, config.build.assetsSubDirectory)
rm('-rf', assetsPath)
mkdir('-p', assetsPath)
cp('-R', 'static/', assetsPath)  // 拷贝static 目录下资源文件到 dist/static目录下

// 正式运行webpack 传入上面的配置对象webpackConfig
webpack(webpackConfig, function (err, stats) {
  spinner.stop()  // 结束ora 打包啊提示
  if (err) throw err
  process.stdout.write(stats.toString({  // 输出打包信息
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n')
})
