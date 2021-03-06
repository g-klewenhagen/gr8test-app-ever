//Display current time
function formatTime(timestamp) {
  let date = new Date(timestamp),
    formattedTimestamp = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  return formattedTimestamp;
}
//Display current date
function formatDate(timestamp) {
  let date = new Date(timestamp);
  let weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let weekday = weekdays[date.getDay()];
  let day = date.getDate();
  let month = months[date.getMonth()];
  let fullDate = `${weekday}, ${month} ${day}`;
  return fullDate;
}

//Format Days (Forecast)
function formatDayShort(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  return days[day];
}

//Display Icons from Erik Flowers

function setIcon(timestamp, iconId) {
  let iconElement = document.querySelector("#main-icon");
  let now = new Date(timestamp);
  let hours = now.getHours();
  let daytime = "";

  if (hours >= 5 && hours < 18) {
    daytime = "day";
  } else {
    daytime = "night";
  }

  iconElement.setAttribute("class", `wi wi-owm-${daytime}-${iconId}`);
}

//Display Forecast of searched city

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast-info");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if ((index < 7) & (index > 0)) {
      forecastHTML =
        forecastHTML +
        `
      <div class="col-2">
        <div class="forecast-weekday">${formatDayShort(forecastDay.dt)}</div>
        <i class = "forecast-icon wi wi-owm-${forecastDay.weather[0].id}" /></i>
        <div class="forecast-temperatures">
          <span class="forecast-temp-max"> ${Math.round(
            forecastDay.temp.max
          )}?? </span>
          <span class="forecast-temp-min"> ${Math.round(
            forecastDay.temp.min
          )}?? </span>
        </div>
      </div>
  `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "9d10ae99dce72210fc268d3c5d70c5df";
  let apiForecastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  console.log(apiForecastUrl);
  axios.get(apiForecastUrl).then(displayForecast);
}

//Display weather
function showWeather(response) {
  console.log(response);
  let dateElement = document.querySelector("#current-date-header");
  let cityNameElement = document.querySelector("h1");
  let timestampElement = document.querySelector("#timestamp-api");
  let temperatureElement = document.querySelector("#numerical-temp");
  let descriptionElement = document.querySelector("#temp-description");
  let minMaxElement = document.querySelector("#min-max-temp");
  let humidityElement = document.querySelector(".humidity");
  let windspeedElement = document.querySelector(".windspeed");
  let iconElement = document.querySelector("#main-icon");
  let sunriseElement = document.querySelector("#sunrise");
  let sunsetElement = document.querySelector("#sunset");

  celsiusTemperature = response.data.main.temp;
  maxTempCelsius = response.data.main.temp_max;
  minTempCelsius = response.data.main.temp_min;
  windspeed = response.data.wind.speed;

  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  cityNameElement.innerHTML = `${response.data.name}, ${response.data.sys.country} `;
  descriptionElement.innerHTML = response.data.weather[0].description;
  minMaxElement.innerHTML = `H: ${Math.round(
    maxTempCelsius
  )}?? | L: ${Math.round(minTempCelsius)}??`;
  humidityElement.innerHTML = `${Math.round(response.data.main.humidity)} %`;
  windspeedElement.innerHTML = `${Math.round(response.data.wind.speed)} km/h`;
  //iconElement.setAttribute(
  //  "src",
  //  `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  //);
  //iconElement.setAttribute("alt", response.data.weather[0].description);
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  timestampElement.innerHTML = `Last updated: ${formatTime(
    response.data.dt * 1000
  )}`;
  sunriseElement.innerHTML = `${formatTime(response.data.sys.sunrise * 1000)}`;
  sunsetElement.innerHTML = `${formatTime(response.data.sys.sunset * 1000)}`;

  let iconId = response.data.weather[0].id;
  setIcon(response.data.dt * 1000, iconId);

  getForecast(response.data.coord);
}

//function to retrieve position

function retrievePosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "9d10ae99dce72210fc268d3c5d70c5df";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather?";
  let units = "metric";
  let apiUrl = `${apiEndpoint}lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(showWeather);
}
function changeToCurrentLocationInfo(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(retrievePosition);
}

let locate = document.querySelector("#current-location-button");
locate.addEventListener("click", changeToCurrentLocationInfo);

let celsiusTemperature = null;
let minTempCelsius = null;
let maxTempCelsius = null;
let windspeed = null;

//Search Function

function search(city) {
  let apiKey = "9d10ae99dce72210fc268d3c5d70c5df";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showWeather);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#search-city");
  search(cityInputElement.value);
}

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

//display data when loading page
search("Stuttgart");
