module.exports = async function stripCreatedBy(ctx , next){
    console.log("Request Time :- " + new Date().toLocaleString());
    await next()
    console.log("Response time :- " + new Date().toLocaleString());
 }