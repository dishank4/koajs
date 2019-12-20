var router = require('koa-router');

//module.exports = function () {
    var public = new router();


    public.post('/user',require('../controller/user').saveUser);
    public.get('/users',require('../controller/user').getUsers);
    public.get('/user/:id',require('../controller/user').getUsersById);
    public.put('/user/:id',require('../controller/user').updateUsers);
    public.del('/user/:id',require('../controller/user').deleteUser);
    public.post('/login',require('../controller/user').login);
//};

module.exports.pubRoute = public;
