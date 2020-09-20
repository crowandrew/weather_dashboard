let citySearches = checkCitySearches();

renderSearchedCities()
// Converts city name into latitude and longitude and inputs that into currentWeather
function findLatLon(city) {
    var query1URL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=05b151abf8878f4a65f1f748137f62da";
    $.ajax({
        url: query1URL,
        method: "GET"
    }).then(function (response) {
        let lat = response.coord.lat
        let lon = response.coord.lon
        let cityName = response.name
        currentWeather(lat, lon);
        console.log(cityName);
        addNewSearchedCity(cityName, lat, lon);
        renderSearchedCities();
    });
}
// Check if city searches array is blank
function checkCitySearches() {
    let localArr = JSON.parse(localStorage.getItem("CitySearches"))
    if (localArr === null) {
        localArr = []
    } else {
        localArr = JSON.parse(localStorage.getItem("CitySearches"))
    }
    return localArr
}


//Add City to citySearches Array
function addNewSearchedCity(cityName, lat, lon) {
    let newCity = {
        city: cityName,
        latitude: lat,
        longitude: lon
    }
    if (citySearches === null) {
        citySearches.unshift(newCity);
        localStorage.setItem("CitySearches", JSON.stringify(citySearches))
    } else if (citySearches.some(function (el) { return el.city === cityName })) {
        return
    }
    else if (citySearches.length === 9) {
        citySearches.pop();
    }
    citySearches.unshift(newCity);
    localStorage.setItem("CitySearches", JSON.stringify(citySearches))
}

//Render Searched Cities
function renderSearchedCities() {
    $("#search-list").html("")
    if (citySearches === null) {
        return
    }
    citySearches.forEach(citySearch => {
        let newCityRow = $("<li>").addClass("list-group-item").text(citySearch.city)
        $("#search-list").append(newCityRow);
    });
}

// Grabs latitude and longitude and responds with current weather and 7 day forecast
function currentWeather(lat, lon) {
    var query2URL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=692496d9b9647012326807b41694aa6b";
    $.ajax({
        url: query2URL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
    });
}

// Converts Unix TimeStamp to MM/DD/YYYY
function convertDate(unixTimeStamp) {
    let date = new Date(unixTimeStamp * 1000);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return month + "/" + day + "/" + year
}

// Grabs users IP and gives Latitude and Longitude
function currentLocation() {
    $.ajax({
        url: "http://ip-api.com/json/",
        method: "GET"
    }).then(function (response) {
        console.log(response.lat);
        console.log(response.lon);
        console.log(response.city);
        currentWeather(response.lat, response.lon)
    });
}

//Event listener for search
$("#search-button").on("click", function (event) {
    event.preventDefault();
    city = $("#search-input").val().trim()
    findLatLon(city);
});