var UsersModel = require('../model/').Users;
var crypto = require('crypto');
const jwt = require('../utility/jwt');

exports.saveUser = async function saveUser(ctx){
    var post = ctx.request.body;

    if(!(post.userName || post.firstName || post.email || post.password)){
        ctx.throw('Invalid request',400)
    }
    user = new UsersModel();
    //user = post;
    user.userName = post.userName;
    user.firstName = post.firstName; 
    user.email = post.email; 
    user.setPassword(post.password); 
    var userObj = await user.save();
    if(!userObj){
        ctx.throw('Something went wrong while saveing user!!');
    }
    delete userObj._doc.hash;
    
    delete userObj._doc.salt;

    ctx.body = userObj._doc;
}

exports.getUsers = async function(ctx){
    ctx.body = await UsersModel.find().exec();
}

exports.getUsersById = async function(ctx){
    var id = ctx.params.id;

    var user = await checkUserExist(id);
    if(!user){
        ctx.throw('No such user found in db',404)
    }

    ctx.body = user
}

exports.updateUsers = async function(ctx){    
    var id = ctx.params.id;
    var post = ctx.request.body;

    var user = await checkUserExist(id);
    if(!user){
        ctx.throw('No such user found in db',404)
    }
    
    user.userName = post.userName ? post.userName : user.name;
    user.phoneNo = post.email;
    var updateUser = await user.save();

    if(!updateUser){
        ctx.throw('Something went wrong in updateing user!!');
    }

    ctx.body = updateUser;
}

exports.deleteUser = async function(ctx){
    var id = ctx.params.id;

    var user = await checkUserExist(id);
    if(!user){
        ctx.throw('No such user found in db',404)
    }

   ctx.body = await user.remove();
}

exports.login = async function(ctx){
    var post = ctx.request.body;
    var user = await UsersModel.findOne({userName : post.userName }).exec();
    if(!user){
        ctx.throw("Invalid credentials",401);
    }
    var passwordCheck = await user.validPassword(post.password);
    if(!passwordCheck){
        ctx.throw("Invalid credentials",401);
    }
    
    delete user._doc.hash;
    delete user._doc.salt;
    
    user._doc['token'] = await jwt.generateToken({"_id":user._id.toString() , "userName":user.userName , "email":user.email});
    ctx.body = user._doc;
}

async function checkUserExist(id){
    var user = await UsersModel.findOne({"_id":id}).exec();
    return user;
}