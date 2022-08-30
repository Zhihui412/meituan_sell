var express = require('express');
var port = 80;
var app = express();
// console.log(app);

var router = express.Router();
router.get('/',function(req,res,next){
  req.url = '/index.html';
  next();
});
app.use(router);

// 接口数据
// 1、读取json数据
var goods = require('./data/01-商品页(点菜).json');
var ratings = require('./data/02-商品页(评价).json');
var seller = require('./data/03-商品页(商家).json');

// 2、路由
var routes = express.Router();

// 3、编写接口
routes.get('/goods', (req,res) => {
	// 返回数据给客户端，返回json数据
	res.json({
         // 当我们数据正常时，我们通过传递errno字符为0表示数据正常
         errno: 0,
         // 返回json中的卖家数据
         data: goods
        });
});
routes.get('/ratings', (req,res) => {
	// 返回数据给客户端，返回json数据
	res.json({
         // 当我们数据正常时，我们通过传递errno字符为0表示数据正常
         errno: 0,
         // 返回json中的卖家数据
         data: ratings
        });
});

routes.get('/seller', (req,res) => {
	// 返回数据给客户端，返回json数据
	res.json({
         // 当我们数据正常时，我们通过传递errno字符为0表示数据正常
         errno: 0,
         // 返回json中的卖家数据
         data: seller
        });
});

// 4、中间件
app.use('/api',routes);
// 定义static目录，指向./dist目录
app.use(express.static('./dist'));

//启动express
module.express = app.listen(port,function(err){
  if(err){
    console.log(err);
    return;
  }
  console.log('http://localhost:' + port + '\n');
});
