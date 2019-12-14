var mongoose = require('mongoose')
, Types = mongoose.Types
, SchemaTypes = mongoose.SchemaTypes
, Schema = mongoose.Schema

var crypto = require('crypto');


var userSchema = module.exports = Schema({
userName    : { type: String, required: true ,  index : true , unique : true },
firstName   : { type: String, required: true },
email       : { type: String, required: true },
hash        : { type: String, required: true },
salt        : { type: String, required: true },
});

userSchema.methods.setPassword = function(password) { 
     
    // Creating a unique salt for a particular user 
    this.salt = crypto.randomBytes(16).toString('hex'); 
    
    // Hashing user's salt and password with 1000 iterations, 
    // 64 length and sha512 digest 
    this.hash = crypto.pbkdf2Sync(password, this.salt,  
    1000, 64, `sha512`).toString(`hex`); 
}; 


userSchema.methods.validPassword = function(password) { 
    var hash = crypto.pbkdf2Sync(password,  
    this.salt, 1000, 64, `sha512`).toString(`hex`); 

    return this.hash === hash; 
}; 

userSchema.methods.ToJsonRes = function(){
    delete this.hash;
    delete this.salt;
    return this;
}
