var requestPromise = require('request-promise');
var apiCall = require('../utility/apiCall');
// {
// 	"body":{"name":"1,brij,shah,adult",
// 		"card_cvc":"123",
// 		"card_expiration":"07/23",
// 		"card_holder_name":"Brij Shah",
// 		"card_number":"4111111111111111",
// 		"card_type":"Visa",
// 		"email":"shahbrij@gmail.com",
// 		"phone_number":"+919426144846"
// 	},
// 	"authorization":"Basic VmliZVhUR1Rlc3Q6NUxBZVg3UllLbmFGc3dqeg==",
// 	"checkin":"2019-12-21",
// 	"checkout":"2019-12-22",
// 	"pax":"2",
// 	"client_nationality":"es",
// 	"currency":"usd",
// 	"hotel_code":"14209a",
// 	"destination_code":"11260",
// 	"lat":"23.0225",
// 	"lon":"72.5714",
// 	"radius":"10000"
// }

exports.getHotelsData = async function(ctx){

    var post = ctx.request.body;

    var checkIn = post.checkin;
    var checkOut = post.checkout;
    var pax = post.pax;
    var client_nationality = post.client_nationality;
    var currency = post.currency;
    var hotel_code = post.hotel_code;
    var destination_code = post.destination_code;

    var lat = post.lat;
    var lon = post.lon;
    var radius = post.radius;

    var URL;
    if(hotel_code){
    
        URL = `https://api-test.hotelspro.com/api/v2/search/?checkin=${checkIn}&checkout=${checkOut}&pax=${pax}&client_nationality=${client_nationality}&currency=${currency}&hotel_code=${hotel_code}`;
    }
    else if(destination_code){
        URL = `https://api-test.hotelspro.com/api/v2/search/?checkin=${checkIn}&checkout=${checkOut}&pax=${pax}&client_nationality=${client_nationality}&currency=${currency}&destination_code=${destination_code}`;
    }
    else{
        URL = `https://api-test.hotelspro.com/api/v2/search/?checkin=${checkIn}&checkout=${checkOut}&pax=${pax}&client_nationality=${client_nationality}&currency=${currency}&lat=${lat}&lon=${lon}&radius=${radius}`;
    }

    options_search = {
        method:'GET',
        uri: URL,
        headers: {
            'Authorization': post.authorization,
            'Content-Type':'application/json'
        },
        json: true 
    };

    var result_search = await apiCall.get(options_search.uri , options_search.headers);
    result_search = JSON.parse(result_search);
   
//////////  Availibility ////////////////

URL = `https://api-test.hotelspro.com/api/v2/hotel-availability/?search_code=${result_search.code}&hotel_code=${result_search.results[0].hotel_code}&max_product=3`

options_avail = {
    method:'GET',
    uri: URL,
    headers: {
        'Authorization': post.authorization,
        'Content-Type':'application/json'
    },
    json: true 
};

var result_availibility_search = await apiCall.get(options_avail.uri , options_avail.headers);
result_availibility_search = JSON.parse(result_availibility_search);
//////////  Provision ////////////////
    var Hotel = result_search.results[0]; 
    var Product = Hotel.products[0];
    var ProductCode = Product.code;

    const pcode = result_availibility_search.results[0].code
   

    URL = `https://api-test.hotelspro.com/api/v2/provision/${pcode}`;//`https://api-test.hotelspro.com/api/v2/provision/${ProductCode}`

    options_Provision = {
        method:'POST',
        uri: URL,
        headers: {
            'Authorization': post.authorization,
            'Content-Type':'application/json'
        },
        json: true 
    };

    var result_Provision = await apiCall.post(options_Provision.uri , options_Provision.headers);
    result_Provision = JSON.parse(result_Provision);
//////////  Booking ////////////////

var Provision_code = result_Provision.code;
    var expected_Price = result_Provision.price;

    post.body["expected_price"] = expected_Price;

    URL = `https://api-test.hotelspro.com/api/v2/book/${Provision_code}`

    options_Book = {
        method:'POST',
        uri: URL,
        headers: {
            'Authorization': post.authorization,
            'Content-Type':'application/x-www-form-urlencoded'
        },
        body:post.body,
        json: true 
    }; 

    var result_Book = await apiCall.post(options_Book.uri , options_Book.headers, null,post.body);
    result_Book = JSON.parse(result_Book);
    SuccessResult(ctx,'Get Data Successfully...',200,result_Book)
}

function SuccessResult(ctx, msg, code, data){
    const result = new Object();

    result.message = msg;
    result.code = code;
    result.data = data;
    result.success = true;

    ctx.body = result;
}