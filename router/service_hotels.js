var router = require('koa-router');

var service_hotels = new router();

service_hotels.post('/hotel',require('../utility/restAPI').serviceCall);
service_hotels.post('/hoteldata',require('../controller/gethoteldata').getHotelsData);

module.exports.serviceHotels = service_hotels;