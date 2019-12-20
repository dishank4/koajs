var UsersModel = require('../model/').Users;
var crypto = require('crypto');
const jwt = require('../utility/jwt');
var rp = require('request-promise');

exports.saveUser = async function saveUser(ctx){
    var post = ctx.request.body;

    if(!post.userName || !post.firstName || !post.email || !post.password){
        ctx.throw('Invalid request',400)
    }

    var user = await checkUserExistByUsername(post.userName);
    if(user){
        ctx.throw('User already found in db',409)
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

    SuccessResult(ctx,'User Successfully Saved...',201,userObj._doc)
}

exports.getUsers = async function(ctx){
    var result = await UsersModel.find().exec();
    SuccessResult(ctx,'User Get Successfully...',200,result);
}

exports.getUsersById = async function(ctx){
    var id = ctx.params.id;

    var user = await checkUserExist(id);
    if(!user){
        ctx.throw('No such user found in db',404)
    }

    // ctx.body = user
    SuccessResult(ctx,'User Get Successfully...',200,user)
}

exports.updateUsers = async function(ctx){    
    var id = ctx.params.id;
    var post = ctx.request.body;

    var user = await checkUserExist(id);
    if(!user){
        ctx.throw('No such user found in db',404)
    }
    
    if(post.userName && user.userName !== post.userName){
        user.userName = post.userName;
    }
    
    user.email = post.email ? post.email: user.email;
    user.firstName = post.firstName ? post.firstName: user.firstName;

    var updateUser = await user.save();

    if(!updateUser){
        ctx.throw('Something went wrong in updateing user!!');
    }

    SuccessResult(ctx,'User Update Successfully...',200,updateUser)
    // ctx.body = updateUser;
}

exports.deleteUser = async function(ctx){
    var id = ctx.params.id;

    var user = await checkUserExist(id);
    if(!user){
        ctx.throw('No such user found in db',404)
    }

   var result = await user.remove();
   SuccessResult(ctx,'User Delete Successfully...',200,result)
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

    SuccessResult(ctx,'User Login Successfully...',200,user._doc)
}

async function checkUserExist(id){
    var user = await UsersModel.findOne({"_id":id}).exec();
    return user;
}

async function checkUserExistByUsername(userName){
    var user = await UsersModel.findOne({"userName":userName}).exec();
    return user;
}

function SuccessResult(ctx, msg, code, data){
    const result = new Object();

    result.message = msg;
    result.code = code;
    result.data = data;
    result.success = true;

    ctx.body = result;
}