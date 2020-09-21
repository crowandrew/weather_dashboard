let citySearches = checkCitySearches();
currentLocation()
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
        currentWeather(cityName, lat, lon);
        addNewSearchedCity(cityName, lat, lon);
        renderSearchedCities();
    });
}

// Check to see if city searches local storage is blank if it is create blank array
function checkCitySearches() {
    let localArr = JSON.parse(localStorage.getItem("CitySearches"))
    if (localArr === null) {
        localArr = []
    } else {
        localArr = JSON.parse(localStorage.getItem("CitySearches"))
    }
    return localArr
}

// Render current weather
function renderCurrentWeather(cityName, currentDate, currentTemp, currentHumidity, currentWind, currentUV, currentIcon, currentIconDescription) {
    let weatherIconSrc = "http://openweathermap.org/img/wn/" + currentIcon + "@2x.png";
    let weatherIcon = $("<img>").attr("src", weatherIconSrc).attr("alt", currentIconDescription);
    $("#current-city").text(cityName + " (" + currentDate + ")").append(weatherIcon);
    $("#current-temp").text("Temperature: " + currentTemp.toFixed(0) + " \u2109");
    $("#current-humidity").text("Humidity: " + currentHumidity + " %");
    $("#current-wind").text("Wind Speed: " + currentWind + " MPH");
    $("#current-UV").html("UV Index: <button class='btn' id='uv-btn'>" + currentUV + "</button")
    checkUVIndex(currentUV);
}

// Render 5 Day Forecast
function renderFiveDayForecast(response) {
    $("#daily-row").html("")
    for (let i = 1; i < 6; i++) {
        const daily = response.daily[i];
        let dailyDate = convertDate(daily.dt);
        let dailyIcon = daily.weather[0].icon;
        let dailyIconDescription = daily.weather[0].description;
        let dailyIconSrc = "http://openweathermap.org/img/wn/" + dailyIcon + "@2x.png";
        let dailyTempMin = daily.temp.min.toFixed(0);
        let dailyTempMax = daily.temp.max.toFixed(0);
        let dailyHumidity = daily.humidity;
        let divCard = $("<div>").addClass("card col-sm ml-3 bg-primary text-light");
        let divCardBody = $("<div>").addClass("card-body");
        let dailyH5 = $("<h5>").addClass("card-title").attr("id", "daily-date-" + i).text(dailyDate);
        let dailyImg = $("<img>").attr("src", dailyIconSrc).attr("alt", dailyIconDescription);
        let dailyPTemp = $("<p>").addClass("card-text").text("Temp: " + dailyTempMin + " / " + dailyTempMax + " \u2109");
        let dailyPHumidity = $("</p>").addClass("card-text").text("Humidity: " + dailyHumidity + " %");
        divCardBody.append(dailyH5, dailyImg, dailyPTemp, dailyPHumidity);
        divCard.append(divCardBody);
        $("#daily-row").append(divCard);
    }
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
    else if (citySearches.length === 11) {
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
        let newCityRow = $("<li>").addClass("list-group-item").attr("id", citySearch.city).text(citySearch.city)
        $("#search-list").append(newCityRow);
    });
}

// Grabs latitude and longitude and responds with current weather and 7 day forecast
function currentWeather(cityName, lat, lon) {
    var query2URL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=692496d9b9647012326807b41694aa6b&units=imperial";
    $.ajax({
        url: query2URL,
        method: "GET"
    }).then(function (response) {
        let currentDate = convertDate(response.current.dt);
        let currentTemp = response.current.temp;
        let currentHumidity = response.current.humidity;
        let currentWind = response.current.wind_speed;
        let currentUV = response.current.uvi;
        let currentIcon = response.current.weather[0].icon;
        let currentIconDescription = response.current.weather[0].description;
        renderCurrentWeather(cityName, currentDate, currentTemp, currentHumidity, currentWind, currentUV, currentIcon, currentIconDescription)
        renderFiveDayForecast(response)
    });
}

// Highlight UV Index
function checkUVIndex(currentUV) {
    if (currentUV <= 2) {
        $("#uv-btn").addClass("btn-success")
    } else if (currentUV <= 7) {
        $("#uv-btn").addClass("btn-warning")
    } else {
        $("#uv-btn").addClass("btn-danger")
    }
};

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
        currentWeather(response.city, response.lat, response.lon)
    });
}

//Event listener for search
$("#search-form").on("submit", function (event) {
    event.preventDefault();
    city = $("#search-input").val().trim()
    findLatLon(city);
});

// Event Listener for Search buttons
$("#search-list").on("click", function (event) {
    event.preventDefault();
    city = event.target.id;
    findLatLon(city);
})

