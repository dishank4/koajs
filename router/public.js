var router = require('koa-router');

//module.exports = function () {
    var public = new router();

    public.get('/pub1', async function (ctx) {
        ctx.body = "pub1 called";
    })

//};

module.exports.public = public;
