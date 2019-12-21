var requestPromise = require('request-promise');
var apiCall = require('../utility/apiCall');
var appconstant = require('../utility/const').constant;

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
	// "header":{
    // "Authorization": "Basic VmliZVhUR1Rlc3Q6NUxBZVg3UllLbmFGc3dqeg==",
    // "Content-Type":"application/json" // 'application/x-www-form-urlencoded'
    // },
// 	"checkin":"2019-12-21",
// 	"checkout":"2019-12-22",
// 	"pax":"1",
// 	"client_nationality":"es",
// 	"currency":"usd",
// 	"hotel_code":"14209a",
// 	"destination_code":"11260",
// 	"lat":"23.0225",
// 	"lon":"72.5714",
// 	"radius":"10000",
//  "from_date":"2019-02-01",
//  "to_date":"2020-02-01"
// }

var searchHotelData = async function(URL, header){

    var result_search = await apiCall.get(URL, header);
    return result_search = JSON.parse(result_search);
}

var availabelHotel = async function(URL, header){

    var result_availibility_search = await apiCall.get(URL , header);
    return result_availibility_search = JSON.parse(result_availibility_search);    
}

var provisionHotel = async function(URL, header){

    var result_Provision = await apiCall.post(URL , header);
    return result_Provision = JSON.parse(result_Provision);    
}

var bookHotel = async function(URL, header, body){
    
    var result_Book = await apiCall.post(URL , header, null, body);
    return result_Book = JSON.parse(result_Book);
}

var getBookings = async function(URL, header){
    
    var result_Bookings = await apiCall.get(URL , header);;
    return result_Bookings = JSON.parse(result_Bookings);
}

function ThrowFunction(message){
    ctx.thtow(404,message)
    return;
}

exports.getHotelsData = async function(ctx){

    var post = new Object();
    post = ctx.request.body;

    const key_checkin = Object.keys(post).find(k=>post[k]===post.checkin);
    const key_checkout = Object.keys(post).find(k=>post[k]===post.checkout);
    const key_pax = Object.keys(post).find(k=>post[k]===post.pax);
    const key_client_nationality = Object.keys(post).find(k=>post[k]===post.client_nationality);
    const key_currency = Object.keys(post).find(k=>post[k]===post.currency);

    const key_hotel_code = Object.keys(post).find(k=>post[k]===post.hotel_code);
    const key_destination_code = Object.keys(post).find(k=>post[k]===post.destination_code);
    const key_lat = Object.keys(post).find(k=>post[k]===post.lat);
    const key_lon = Object.keys(post).find(k=>post[k]===post.lon);
    const key_radius = Object.keys(post).find(k=>post[k]===post.radius);

    var URL;
    if(post.hotel_code){
        URL = `${appconstant.ApiBaseURL}${appconstant.Api_URL_Search}${key_checkin}=${post.checkin}&${key_checkout}=${post.checkout}&${key_pax}=${post.pax}&${key_client_nationality}=${post.client_nationality}&${key_currency}=${post.currency}&${key_hotel_code}=${post.hotel_code}`;
    }
    else if(post.destination_code){
        URL = `${appconstant.ApiBaseURL}${appconstant.Api_URL_Search}${key_checkin}=${post.checkIn}&${key_checkout}=${post.checkout}&${key_pax}=${post.pax}&${key_client_nationality}=${post.client_nationality}&${key_currency}=${post.currency}&${key_destination_code}=${post.destination_code}`;
    }
    else{
        URL = `${appconstant.ApiBaseURL}${appconstant.Api_URL_Search}${key_checkin}=${post.checkIn}&${key_checkout}=${post.checkout}&${key_pax}=${post.pax}&${key_client_nationality}=${post.client_nationality}&${key_currency}=${post.currency}&${key_lat}=${post.lat}&${key_lon}=${post.lon}&${key_radius}=${post.radius}`;
    }

    result_search = await searchHotelData(URL,post.header);
   
    if(!result_search){
        ThrowFunction(appconstant.Records_Not_Found)
    }

    //////////  Availibility ////////////////
    URL = `${appconstant.ApiBaseURL}${appconstant.Api_URL_Availability}${appconstant.Api_URL_Availability_searchcode}=${result_search.code}&${key_hotel_code}=${result_search.results[0].hotel_code}&${appconstant.Api_URL_Availability_Max_product}`
    result_availibility_search = await availabelHotel(URL,post.header);

    if(!result_availibility_search){
        ThrowFunction(appconstant.Hotel_Not_Availabel)
    }

    //////////  Provision ////////////////
    const pcode = result_availibility_search.results[0].code
   
    URL = `${appconstant.ApiBaseURL}${appconstant.Api_URL_Provision}${pcode}`;
    result_Provision = await provisionHotel(URL, post.header);

    if(!result_Provision){
        ThrowFunction(appconstant.Provision_Fail)
    }

    //////////  Booking ////////////////
    var Provision_code = result_Provision.code;
    var expected_Price = result_Provision.price;

    post.body[appconstant.Api_URL_Book_expected_price] = expected_Price;

    URL = `${appconstant.ApiBaseURL}${appconstant.Api_URL_Book}${Provision_code}`
    result_Book = await bookHotel(URL,post.header,post.body);

    if(!result_Book){
        ThrowFunction(appconstant.Booking_Fail);
    }
    
    //////////  Booking Listing ////////////////

    const key_from_date = Object.keys(post).find(k=>post[k]===post.from_date);
    const key_to_date = Object.keys(post).find(k=>post[k]===post.to_date);

    URL = `${appconstant.ApiBaseURL}${appconstant.Api_URL_Bookings}&${key_from_date}=${post.from_date}&${key_to_date}=${post.to_date}`;
    result_Bookings = await getBookings(URL, post.header)

    SuccessResult(ctx,appconstant.Success_Data ,200,result_Bookings)
}

function SuccessResult(ctx, msg, code, data){
    const result = new Object();

    result.message = msg;
    result.code = code;
    result.data = data;
    result.success = true;

    ctx.body = result;
}