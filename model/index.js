var mongoose = require('mongoose');
var model = mongoose.model.bind(mongoose)

module.exports.Users = model('Users', require('./user'))
