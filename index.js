var koa = require('koa');
var app = new koa();
var Router = require('koa-router')
var mount = require('koa-mount')
var compose = require('koa-compose')

var reqMid = require('./middleware/requestLog.js');
var publicRouter = require('./router/public.js').public;
var privateRouter = require('./router/private.js').private;

app.use(reqMid)
// app.use(async function(ctx){
//     return new Promise(function(resolve,reject){
//          setTimeout( function(){
//             console.log('middleware called');
//             //ctx.body = 'Hello world!';
            
//             resolve();
//         },2000)
//     })
// });

var root = new Router()
root.get('/',function(){
    ctx.body = "root called"
})

var publicRouterCompose = compose([
    publicRouter.routes(),
    publicRouter.allowedMethods()
])

var privateRouterCompose = compose ([
    privateRouter.routes(),
    privateRouter.allowedMethods()
])
app.use(compose([root.routes(),root.allowedMethods(),mount('/pub',publicRouterCompose),mount('/pri',privateRouterCompose)]));




app.listen(3000, function(){
    console.log('Server running on https://localhost:3000')
})