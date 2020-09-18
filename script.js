function findLatLon(city) {
    var query1URL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=05b151abf8878f4a65f1f748137f62da";
    
    $.ajax({
        url: query1URL,
        method: "GET"
    }).then(function (response) {
        let lat = response.coord.lat
        let lon = response.coord.lon
        currentWeather(lat,lon)
    });
    

}

function currentWeather(lat,lon) {
var query2URL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=692496d9b9647012326807b41694aa6b";
    $.ajax({
        url: query2URL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
    });
}

var d = new Date(1600414810)

console.log(d)

// function forecastWeather(city) {
//     var queryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=05b151abf8878f4a65f1f748137f62da";
//     $.ajax({
//         url: queryURL,
//         method: "GET"
//     }).then(function (response) {
//         console.log(response)
        
//     });
// }

findLatLon("Seattle");
// forecastWeather("Seattle");

// http://api.openweathermap.org/data/2.5/forecast/daily?q=seattle&cnt=5&appid=05b151abf8878f4a65f1f748137f62da