var mongoose = require('mongoose')
, Types = require('mongoose').Types
, SchemaTypes = require('mongoose').SchemaTypes
, Schema = require('mongoose').Schema


var userSchema = module.exports = Schema({
name          : { type: String, required: true },
phoneNo       : {type :Number }    
})

