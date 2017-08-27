var router = require('koa-router');

//module.exports = function () {
    var private = new router();

    private.get('/pri1', async function (ctx) {
        ctx.body = "pri1 called";
    })

//};

module.exports.private = private;
