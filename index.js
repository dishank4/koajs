var koa = require('koa');
var app = new koa();

app.use(async function(ctx){
    ctx.body = 'Hello world!';
});

app.listen(3000, function(){
    console.log('Server running on https://localhost:3000')
})