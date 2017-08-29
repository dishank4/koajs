var UsersModel = require('../model/').Users;

exports.saveUser = async function(ctx){
    var post = ctx.request.body;

    if(!post.name){
        ctx.throw('Invalid request',400)
    }
    user = new UsersModel();
    //user = post;
    user.name = post.name;
    user.phoneNo = post.phoneNo; 
    var user = await user.save()
    if(!user){
        ctx.throw('Something went wrong while saveing user!!');
    }
    
    ctx.body = user;

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

    user.name = post.name;
    user.phoneNo = post.phoneNo;

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