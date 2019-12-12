var mongoose = require('mongoose');

var mongodbUri = "mongodb://localhost:27017/koajs";
exports.connect = function() {
mongoose.connect(mongodbUri).connection
  .once('open', function callback () {
    console.log('mongodb up and running at '+ mongodbUri)
  })
  .on('error', function (err) {
    console.log('cannot connect to mongodb:'+ err.message)
    process.exit(1)
  })
  .on('close', function () {
    console.log('lost connection to mongodb: %s\n')
    process.exit(1)
  })
}