 var jwt = require('../utility/jwt')
// module.exports = async function auth(ctx , next){
//     if(!ctx.header.authorization){
//         ctx.throw("this is errrrrr",400);
//     }
//     var userInfo = jwt.VerifyToken(ctx.header.authorization);
//     if(!userInfo.result){
//         ctx.thow("user is not autorize",401);
//     }

//     ctx.request.body['user'] = userInfo;
//     await next()
//  }

module.exports = async function stripCreatedBy(ctx , next){
    if(!ctx.header.authorization){
        ctx.throw("you can not access this api",403);
    }
    const userInfo = await jwt.VerifyToken(ctx);
    ctx.request.body['user'] = userInfo;
    await next();
 }

 