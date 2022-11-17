const cityEl = document.getElementById("city-name");
const searchEl = document.getElementById("search-button");
let citySearchInput;
let latLonApiUrl;
let tempK;
let tempF;
let citySearchHistory = [];
const clearEl = document.getElementById("clear-history");
const nameEl = document.getElementById("city-name");
let currentPicEl = document.getElementById("current-pic");
let weatherTodayIconSource;
let weatherTodayDescription;
const currentTempEl = document.getElementById("temperature");
const currentHumidityEl = document.getElementById("humidity");
const currentWindEl = document.getElementById("wind-speed");
const currentUVEl = document.getElementById("UV-index");
let currentUVIndex;
const historyEl = document.getElementById("history");
var fivedayEl = document.getElementById("fiveday-header");
var todayweatherEl = document.getElementById("today-weather");
let searchHistory = JSON.parse(localStorage.getItem("search")) || [];
let today = new Date();
let date = (today.getMonth()+1)+'/'+today.getDate()+'/'+today.getFullYear();

const apiKey = "84b79da5e5d7c92085660485702f4ce8";



let searchButtonHandler = function (event) {
  event.preventDefault();
  citySearchInput = cityEl.value.trim(); 
  if (citySearchInput) {
    getLatLon(citySearchInput);
    createSearchHistory(citySearchInput);
  } else {
    alert('Please enter a City');
  }
};
    
searchEl.addEventListener('click', searchButtonHandler);

function createSearchHistory(citySearchInput) {
  citySearchHistory.unshift(citySearchInput);
  localStorage.setItem('searchHistory', JSON.stringify(citySearchHistory));
  renderHistory();
};

function renderHistory() {
  historyEl.innerHTML = "";
  for (let i = 0; i < searchHistory.length; i++) {
      const historyItem = document.createElement("input");
      historyItem.setAttribute("type", "text");
      historyItem.setAttribute("readonly", true);
      historyItem.setAttribute("class", "form-control d-block bg-white");
      historyItem.setAttribute("value", searchHistory[i]);
      historyItem.addEventListener("click", function () {
          getWeather(historyItem.value);
      })
      historyEl.append(historyItem);
  }
};

renderHistory();
if (searchHistory.length > 0) {
  getWeather(searchHistory[searchHistory.length - 1]);
}



function getLatLon (searchEl) {
    var latLonApiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + searchEl + '&appid=' + apiKey;
    
    fetch(latLonApiUrl).then(function (response) {
      if (response.ok) {
         response.json().then(function (data) {
            lat = data.coord.lat;
            lon = data.coord.lon;
        }) .then(getWeatherData);
      } else {
        alert('Error: ' + response.statusText);
      }
    });
  };

function getWeatherData (citySearchInput) {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=minutely,hourly,alerts&appid=' + apiKey;
    fetch(apiUrl).then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
                // Current City and Date
          nameEl.textContent = (cityEl.value.trim() + ' (' + date + ')');

          // Current Weather Icon
          currentPicEl = data.current.weather[0].icon;
          weatherTodayIconSource = ('https://openweathermap.org/img/wn/' + todayweatherEl + '@2x.png')
          weatherTodayDescription = data.current.weather[0].description;
          currentPicEl.src = weatherTodayIconSource;
          currentPicEl.alt = weatherTodayDescription;

          // Current Temperature
          tempK = data.current.temp;
          tempF = k2f(tempK) + " &#176F";
          currentTempEl.innerHTML = tempF;

          // Current Humidity
          currentHumidityEl.innerHTML = (data.current.humidity + "%");

          // Current Wind Speed
          currentWindEl.innerHTML = (data.current.wind_speed + " MPH");

          // Current UV Index
          currentUVIndex = (data.current.uvi);
          currentUVEl.innerHTML = currentUVIndex;
          if (currentUVIndex < 2.99) {
            currentUVEl.classList.add('custom-favorable');
            currentUVEl.classList.remove('custom-moderate');
            currentUVEl.classList.remove('custom-severe');
          } else if (currentUVIndex > 3 && currentUVIndex < 5.99) {
            currentUVEl.classList.add('custom-moderate');
            currentUVEl.classList.remove('custom-favorable');
            currentUVEl.classList.remove('custom-severe');
          } else {
            currentUVEl.classList.add('custom-severe');
            currentUVEl.classList.remove('custom-favorable');
            currentUVEl.classList.remove('custom-moderate');
          };
        });
      };
    });
  };
                
        
function k2f(K) {
    return Math.floor((K - 273.15) * 1.8 + 32);
}

  