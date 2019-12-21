var jwt = require('jsonwebtoken');
var jwtKey = require('./const').constant.JWK_KEY
exports.generateToken = async function(object) {
    var token = jwt.sign(object, jwtKey, { algorithm: 'HS256'});
    return token;
}

exports.VerifyToken = function(ctx){
    try {
        return jwt.verify(ctx.header.authorization, jwtKey);
      } catch(err) {
        ctx.throw(err.message,401);
      }
}

