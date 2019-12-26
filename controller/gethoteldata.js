var requestPromise = require('request-promise');
var apiCall = require('../utility/apiCall');
var appconstant = require('../utility/const').constant;
var moment = require('moment');

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

    var URL;
    if(post.hotel_code){
        URL = `${appconstant.ApiBaseURL}${appconstant.Api_URL_Search}${appconstant.key_checkin}=${post.checkin}&${appconstant.key_checkout}=${post.checkout}&${appconstant.key_pax}=${post.pax}&${appconstant.key_client_nationality}=${post.client_nationality}&${appconstant.key_currency}=${post.currency}&${appconstant.key_hotel_code}=${post.hotel_code}`;
    }
    else if(post.destination_code){
        URL = `${appconstant.ApiBaseURL}${appconstant.Api_URL_Search}${appconstant.key_checkin}=${post.checkIn}&${appconstant.key_checkout}=${post.checkout}&${appconstant.key_pax}=${post.pax}&${appconstant.key_client_nationality}=${post.client_nationality}&${appconstant.key_currency}=${post.currency}&${appconstant.key_destination_code}=${post.destination_code}`;
    }
    else{
        URL = `${appconstant.ApiBaseURL}${appconstant.Api_URL_Search}${appconstant.key_checkin}=${post.checkIn}&${appconstant.key_checkout}=${post.checkout}&${appconstant.key_pax}=${post.pax}&${appconstant.key_client_nationality}=${post.client_nationality}&${appconstant.key_currency}=${post.currency}&${appconstant.key_lat}=${post.lat}&${appconstant.key_lon}=${post.lon}&${appconstant.key_radius}=${post.radius}`;
    }

    result_search = await searchHotelData(URL,post.header);
   
    if(!result_search){
        ThrowFunction(appconstant.Records_Not_Found)
    }

    //////////  Availibility ////////////////
    URL = `${appconstant.ApiBaseURL}${appconstant.Api_URL_Availability}${appconstant.Api_URL_Availability_searchcode}=${result_search.code}&${appconstant.key_hotel_code}=${result_search.results[0].hotel_code}&${appconstant.Api_URL_Availability_Max_product}`
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

    URL = `${appconstant.ApiBaseURL}${appconstant.Api_URL_Bookings}&${appconstant.key_from_date}=${post.from_date}&${appconstant.key_to_date}=${post.to_date}`;
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

exports.getHotelListings = async function(ctx){

    var fromDate = ctx.request.query.from_date;
    var toDate = ctx.request.query.to_date;

    var time1 = moment(fromDate).format('YYYY-MM-DD');
    var time2 = moment(toDate).format('YYYY-MM-DD');
    
    if(time2 < time1){
        ctx.throw(400, 'to_date can not less then from_date');
    }

    var result_Listing = await getBookingListing(fromDate, toDate);
  
    if(!result_Listing || !result_Listing.length){
        SuccessResult(ctx, appconstant.Success_Fail, 200,result_Listing);
    }else{
        SuccessResult(ctx, appconstant.Success_Data , 200,result_Listing);
    }  
}

var getBookingListing = async function(fromDate, toDate){
    
    var URL;
    if(fromDate && toDate){
        URL = `${appconstant.ApiBaseURL}${appconstant.Api_URL_Bookings}&${appconstant.key_from_date}=${fromDate}&${appconstant.key_to_date}=${toDate}`;
    }
    else if(fromDate && !toDate){
        URL = `${appconstant.ApiBaseURL}${appconstant.Api_URL_Bookings}&${appconstant.key_from_date}=${fromDate}`;
    }
    else if(!fromDate && toDate){
        URL = `${appconstant.ApiBaseURL}${appconstant.Api_URL_Bookings}&${appconstant.key_to_date}=${toDate}`;
    }
    else{
        var today = new Date();
        var toDayDate = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        URL = `${appconstant.ApiBaseURL}${appconstant.Api_URL_Bookings}&${appconstant.key_from_date}=${toDayDate}`;
    }

    var authorization = appconstant.HotelPro;
    var result_BookingListing = await apiCall.get(URL , null, authorization);;
    return result_BookingListing = JSON.parse(result_BookingListing);
}