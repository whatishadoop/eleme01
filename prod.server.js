// 该文件用于启动基于express方式的node.js服务其
var express = require('express');
var config = require('./config/index');  

var port = process.env.PORT || config.build.port;  // 默认使用环境变量中的端口号，若没有取 index.js 文件中的port: 9000

var app = express();  // 启动express

var router = express.Router();

router.get('/', function (req, res, next) {  // 访问根路径默认会请求 /index.html
	req.url = '/index.html';
	next();
});

app.use(router);

var appData = require('./data.json');
var seller = appData.seller;
var goods = appData.goods;
var ratings = appData.ratings;

var apiRoutes = express.Router();

apiRoutes.get('/seller', function (req, res) {
	res.json({
		errno: 0,
		data: seller
	});
});

apiRoutes.get('/goods', function (req, res) {
	res.json({
		errno: 0,
		data: goods
	});
});

apiRoutes.get('/ratings', function (req, res) {
	res.json({
		errno: 0,
		data: ratings
	});
});

app.use('/api', apiRoutes);

app.use(express.static('./dist'));  // 设置服务静态目录在/dist下

// 导出app 进行启动express 服务  执行 命令node prod.server.js 开启服务  ，端口在9000 
module.exports = app.listen(port, function (err) {
	if (err) {
		console.log(err);
		return
	}
	console.log('Listening at http://localhost:' + port + '\n')
});