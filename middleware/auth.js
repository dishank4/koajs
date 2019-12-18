 var jwt = require('../utility/jwt')

module.exports = async function stripCreatedBy(ctx , next){
    if(!ctx.header.authorization){
        ctx.throw("you can not access this api",403);
    }
    const userInfo = await jwt.VerifyToken(ctx);
    ctx.request.body['user'] = userInfo;
    await next();
 }

 