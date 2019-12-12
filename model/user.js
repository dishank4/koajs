var mongoose = require('mongoose')
, Types = mongoose.Types
, SchemaTypes = mongoose.SchemaTypes
, Schema = mongoose.Schema


var userSchema = module.exports = Schema({
userName    : { type: String, required: true ,  index : true , unique : true },
firstName   : { type: String, required: true },
email       : { type: String, required: true },
password    : { type: String, required: true },
})

