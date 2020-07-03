$(window).on('load', function(){
    currentLocation();
    checkLocalStorage();
});

var APIKey = "9aa6646709d477eb75a40a8f81c37e66";
var GetCity = "";
var now = moment();
var currentDate = now.format("dddd[,] MMMM Do gggg");
var currentDay = now.format("DD");

$("#dateMain").text(currentDate);

$(".search").on("click", function(){
    if (GetCity = "Muir Woods") {
        getBigfoot();
    }
    else {
    GetCity = $(".city").val();
    getWeather(GetCity); 
    createRecentSearchBtn(GetCity);
    saveToLocalStorage(GetCity);
    }
});
function getBigfoot() {
    $("#Bigfoot").text("Bigfoot's Home");
    $("#BF").append('<img src="bigfoot.gif">');

    
}


$(".clear").on("click", function(){
    window.localStorage.clear();
    location.reload();


});

function createRecentSearchBtn(GetCity) {
    $(".recent-cities-container");
    var newBtn =  $('<button>');
    newBtn.addClass("button is-small recentSearch");
    newBtn.text(GetCity);
    $(".recent-cities").append(newBtn);
    $(".recentSearch").on("click", function(){
        var newQ=$(this).text();
        getWeather(newQ); 
    });
};

function getWeather(GetCity) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + GetCity + "&units=imperial&appid=" + APIKey;
    $.ajax({ // gets the current weather info
        url: queryURL,
        method: "GET"
        })
        .then(function(response) {
            $("#cityMain").text(response.name+ ", " + response.sys.country);
            $("#degreeMain").text(response.main.temp);
            $("#humidityMain").text(response.main.humidity);
            $("#windMain").text(response.wind.speed);
            $("#iconMain").attr("src","https://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png");
            var uvIndexcoord = "&lat="+response.coord.lat+"&lon="+response.coord.lon;
            var cityId = response.id;
            displayUVindex(uvIndexcoord);
            displayForecast(cityId);
    });  
};

function displayUVindex(uv) {
    $.ajax({ // gets the UV index info
        url: "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + uv,
        method: "GET"
        })
        .then(function(response) {
        $("#uvIndexMain").text(response.value);
    });
};

function displayForecast(c) {
    $.ajax({ // gets the 5 day forecast
        url: "https://api.openweathermap.org/data/2.5/forecast?id=" + c + "&units=imperial&APPID=" + APIKey,
        method: "GET"
        })
        .then(function(response) {
            var counter = 0;
            for (var i=0; i < 5; i++) {
                var date = response.list[counter].dt_txt;
                var croppedDate = date.substr(5, 5);
                var newDate = croppedDate.replace("-","/");
                $("h3[data-index='"+ i +"']").text(newDate);
                $(".temp"+i).text(response.list[counter].main.temp+" °F");
                $(".humid"+i).text(response.list[counter].main.humidity);
                $(".img"+i).attr("src","https://openweathermap.org/img/wn/" + response.list[counter].weather[0].icon + "@2x.png");
                counter= counter+8;
            }
    });
};

function currentLocation() {
    $.ajax({ 
        url: "https://freegeoip.app/json/",
        method: "GET"
        })
        .then(function(response) {
            GetCity = response.city || 'sandy';
            console.log(GetCity);
            getWeather(GetCity);
    });  
};


function checkLocalStorage() {
    var storedData = localStorage.getItem('queries');
    var dataArray = [];
    if(!storedData) {
        console.log("no data stored")
    } else {
        storedData.trim();
        dataArray = storedData.split(",");
        for (var i=0; i<dataArray.length; i++) {
            createRecentSearchBtn(dataArray[i]);
        }
    };
};

function saveToLocalStorage(GetCity) {
    var data = localStorage.getItem('queries');
    if(data) {
        data = data + ","+ GetCity;
        localStorage.setItem('queries', data);
    } else {
        data = GetCity;
        localStorage.setItem('queries', data);
    };
};

