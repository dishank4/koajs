var UsersModel = require('../model/').Users;

exports.saveUser = async function saveUser(ctx){
    var post = ctx.request.body;

    if(!post.userName || post.firstName || post.email || post.password){
        ctx.throw('Invalid request',400)
    }
    user = new UsersModel();
    //user = post;
    user.userName = post.userName;
    user.firstName = post.firstName; 
    user.email = post.email; 
    user.password = post.password; 
    var userObj = await user.save()
    if(!userObj){
        ctx.throw('Something went wrong while saveing user!!');
    }
    
    ctx.body = userObj;

    console.log('this code is also executed..!!');
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

async function checkUserExist(id){
    var user = await UsersModel.findOne({"_id":id}).exec();
    return user;
}