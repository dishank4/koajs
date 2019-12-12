var koa = require('koa');
var app = new koa();
var Router = require('koa-router')
var mount = require('koa-mount')
var compose = require('koa-compose')
var koaBody = require('koa-body')
var serve = require('koa-static');


var error = require('./middleware/error.js');
var reqMid = require('./middleware/requestLog.js');
var publicRouter = require('./router/public.js').pubRoute;
var privateRouter = require('./router/private.js').private;
var dbConnection = require('./db_connection');

app.proxy = true

app.use(error(app))
app.use(koaBody(
    {
      multipart: true,
      formidable: {}
    }
  ));
app.use(mount('/files',serve('./files')));

dbConnection.connect();

app.use(reqMid);
var publicRouterCompose = compose([
    publicRouter.routes(),
    publicRouter.allowedMethods()
])

var privateRouterCompose = compose ([
    privateRouter.routes(),
    privateRouter.allowedMethods()
])

app.use(
  compose(
    [
      mount('/pub',publicRouterCompose),
      mount('/pri',privateRouterCompose)
    ]
  )
);
//app.use(function(ctx){ctx.throw('no such route found',404)})




app.listen(3000, function(){
    console.log('Server running on https://localhost:3000')
})