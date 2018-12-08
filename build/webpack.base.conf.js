var path = require('path')
var config = require('../config')
var utils = require('./utils')
var projectRoot = path.resolve(__dirname, '../')  // 一定当前的项目根目录位置 eleme作为根

module.exports = {
	entry: {
		app: './src/main.js'  //主程序入口配置，以上面的projectRoot作为根路径定位该目录
	},
	output: {  
		path: config.build.assetsRoot,  //文件输出配置，在config/index.js 中assetsRoot属性
		publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
		filename: '[name].js'  //输出为上面的entry中定义的key值 app.js ，自动导入到index.html中
	},
	resolve: {
		extensions: ['', '.js', '.vue'],  //import时可以不写 后缀.js 以及.vue文件，自动添加
		fallback: [path.join(__dirname, '../node_modules')],  //若import 导入的文件不存在则从node_modules模块的引入，名字在package.json中name定义名字
		alias: {
			'src': path.resolve(__dirname, '../src'),
			'common': path.resolve(__dirname, '../src/common'),  //放置公用的css,js,js,字体资源
			'components': path.resolve(__dirname, '../src/components') //类似spring 视图功能，设置资源虚拟路径
		}
	},
	resolveLoader: {
		fallback: [path.join(__dirname, '../node_modules')]
	},
	module: { //设置webpack 的各种文件 loader配置，设置哪些文件，目录要加载，哪些不用
		preLoaders: [
		    /*
			{
				test: /\.vue$/,
				loader: 'eslint',
				include: projectRoot,
				exclude: /node_modules/
			},
			{
				test: /\.js$/,
				loader: 'eslint',
				include: projectRoot,
				exclude: /node_modules/
			}
			*/
		],
		loaders: [
			{
				test: /\.vue$/,
				loader: 'vue'
			},
			{
				test: /\.js$/,
				loader: 'babel',
				include: projectRoot,
				exclude: /node_modules/
			},
			{
				test: /\.json$/,
				loader: 'json'
			},
			{
				test: /\.html$/,
				loader: 'vue-html'
			},
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				loader: 'url',
				query: { // query是对loader做额外的选项配置
					limit: 10000, // 图片小于10000字节时以base64的方式引用
					name: utils.assetsPath('img/[name].[hash:7].[ext]')
				}
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				loader: 'url',
				query: {
					limit: 10000,
					name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
				}
			}
		]
	},
	eslint: { // 代码格式检查
		formatter: require('eslint-friendly-formatter')
	},
	vue: {  // cssloader 文件解析
		loaders: utils.cssLoaders()
	}
}
