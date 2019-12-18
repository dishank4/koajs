var koa = require('koa');
var app = new koa();
var Router = require('koa-router')
var mount = require('koa-mount')
var compose = require('koa-compose')
var koaBody = require('koa-body')
var serve = require('koa-static');
var cors = require('koa2-cors');


var error = require('./middleware/error.js');
var requestLogTime = require('./middleware/requestLog.js');
var publicRouter = require('./router/public.js').pubRoute;
var privateRouter = require('./router/private.js').private;
var ServiceHotelsRouter = require('./router/service_hotels').serviceHotels;
var dbConnection = require('./db_connection');
var authMiddlewate = require('./middleware/auth');
app.proxy = true

app.use(error(app));
app.use(cors(
{
  origin: function(ctx) {
    return '*';
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE','OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));
app.use(koaBody(
    {
      multipart: true,
      formidable: {}
    }
  ));
app.use(mount('/files',serve('./files')));

dbConnection.connect();

app.use(requestLogTime);

var publicRouterCompose = compose([
    publicRouter.routes(),
    publicRouter.allowedMethods()
])

var privateRouterCompose = compose ([
    privateRouter.routes(),
    privateRouter.allowedMethods()
])

var serviceHotelsCompose = compose([
  ServiceHotelsRouter.routes(),
  ServiceHotelsRouter.allowedMethods()
])

app.use(mount('/pub',publicRouterCompose))
// app.use(authMiddlewate)
app.use(mount('/hot',serviceHotelsCompose))
app.use(mount('/pri',privateRouterCompose))

//app.use(function(ctx){ctx.throw('no such route found',404)})




app.listen(3000, function(){
    console.log('Server running on http://localhost:3000')
})