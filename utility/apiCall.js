 var requestPromise = require('request-promise');
 var apiMethods = require('./const').constant.ApiMethod;

exports.get = async function(url,headers,authorization = null){
    const options = {
            method:apiMethods.GET,
            uri: url,
            headers: headers,
            auth: authorization
        };
    return await callApi(options);
}

exports.post = async function(url, headers, data = null, form = null){
    const options = {
            method:apiMethods.POST,
            uri: url,
            headers: headers,
        };

    data ? options['body'] = JSON.stringify(data) : "";
    form ? options['form'] = form : "";
    return await callApi(options);
}

exports.put = async function(url,headers,data){
    const options = {
            method:apiMethods.PUT,
            uri: url,
            headers: headers,
            body : data
        };
    const res =  await callApi(options);
    return res;
}

exports.delete = async function(url,headers){

    const options = {
            method:apiMethods.DELETE,
            uri: url,
            headers: headers
        };
    return await callApi(options);
}

var callApi = async function(options){
    return await requestPromise(options);
}