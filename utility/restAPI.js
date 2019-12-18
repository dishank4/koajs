var requestPromise = require('request-promise');

exports.serviceCall = async function(ctx){

    // {
    //     "method":"get/post/put/delete",
    //     "url":"<URL of your request>",
    //     "body":{<request Parameter>},
    //     "authorization":""
    // }

    var post = ctx.request.body;
    
    var options = new Object();

    var Methods = post.method.toUpperCase();

    switch(Methods){

        case 'GET':
        case 'DELETE':
            options = {
                method:post.method,
                uri: post.url,
                headers: {
                    'Authorization': post.authorization
                },
                json: true 
            };
        break;

        case 'POST':
        case 'PUT':
            options = {
                method:post.method,
                uri: post.url,
                headers: {
                    'Authorization': post.authorization
                },
                body:post.body,
                json: true 
            };        
        break;

        default: ctx.throw(406, 'Invalid Method...');
    }

    ctx.body = result = await requestPromise(options);
    // SuccessResult(ctx,'Get Data Successfully...',200,result)
}

function SuccessResult(ctx, msg, code, data){
    const result = new Object();

    result.message = msg;
    result.code = code;
    result.data = data;
    result.success = true;

    ctx.body = result;
}