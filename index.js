var koa = require('koa');
var app = new koa();
var reqMid = require('./middleware/requestLog.js');
app.use(reqMid)
app.use(async function(ctx){
    return new Promise(function(resolve,reject){
         setTimeout( function(){
            console.log('middleware called');
            ctx.body = 'Hello world!';
            
            resolve();
        },2000)
    })
});

app.listen(3000, function(){
    console.log('Server running on https://localhost:3000')
})