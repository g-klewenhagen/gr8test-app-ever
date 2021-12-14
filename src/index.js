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
  let date = new Date(timestamp),
    formattedDateTimestamp = date.toLocaleDateString([], {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  return formattedDateTimestamp;
}

//Format Days (Forecast)
function formatDayShort(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  return days[day];
}

//Display Forecast of searched city

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast-info");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if ((index < 6) & (index > 0)) {
      forecastHTML =
        forecastHTML +
        `
      <div class="col-2">
        <div class="forecast-weekday">${formatDayShort(forecastDay.dt)}</div>
        <img
          src="http://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
          }@2x.png"
          alt=""
          width="42"
        />
        <div class="forecast-temperatures">
          <span class="forecast-temp-max"> ${Math.round(
            forecastDay.temp.max
          )}° </span>
          <span class="forecast-temp-min"> ${Math.round(
            forecastDay.temp.min
          )}° </span>
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

//Display weather of searched city
function showWeather(response) {
  console.log(response);
  let dateElement = document.querySelector("#current-date-header");
  let cityNameElement = document.querySelector("h1");
  let timestampElement = document.querySelector("h5");
  let temperatureElement = document.querySelector("#numerical-temp");
  let descriptionElement = document.querySelector("#temp-description");
  let minMaxElement = document.querySelector("#min-max-temp-main");
  let humidityElement = document.querySelector(".humidity");
  let windspeedElement = document.querySelector(".windspeed");
  let iconElement = document.querySelector("#main-icon");

  celsiusTemperature = response.data.main.temp;
  maxTempCelsius = response.data.main.temp_max;
  minTempCelsius = response.data.main.temp_min;
  windspeed = response.data.wind.speed;

  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  cityNameElement.innerHTML = `${response.data.name}, ${response.data.sys.country} `;
  descriptionElement.innerHTML = response.data.weather[0].description;
  minMaxElement.innerHTML = `Min: ${Math.round(
    minTempCelsius
  )} Max:${Math.round(maxTempCelsius)}`;
  humidityElement.innerHTML = `Humidity: ${Math.round(
    response.data.main.humidity
  )} %`;
  windspeedElement.innerHTML = `Wind speed: ${Math.round(
    response.data.wind.speed
  )} km/h`;
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  timestampElement.innerHTML = `Last updated: ${formatTime(
    response.data.dt * 1000
  )}`;

  getForecast(response.data.coord);
}

function searchEvent(event) {
  event.preventDefault();
  let apiKey = "9d10ae99dce72210fc268d3c5d70c5df";
  let city = document.querySelector("#search-city").value;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showWeather);
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", searchEvent);

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

//Change between F and C
function displayFahrenheitTemperature(event) {
  event.preventDefault();
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  let minTempFahrenheit = (minTempCelsius * 9) / 5 + 32;
  let maxTempFahrenheit = (maxTempCelsius * 9) / 5 + 32;
  let windspeedImperial = windspeed / 1.609;
  let temperatureElement = document.querySelector("#numerical-temp");
  let minMaxElement = document.querySelector("#min-max-temp-main");
  let windspeedElement = document.querySelector(".windspeed");
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
  minMaxElement.innerHTML = `Min: ${Math.round(
    minTempFahrenheit
  )} Max:${Math.round(maxTempFahrenheit)}`;
  windspeedElement.innerHTML = `${Math.round(windspeedImperial)} mph`;
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#numerical-temp");
  let minMaxElement = document.querySelector("#min-max-temp-main");
  let windspeedElement = document.querySelector(".windspeed");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  minMaxElement.innerHTML = `Min: ${Math.round(
    minTempCelsius
  )} Max:${Math.round(maxTempCelsius)}`;
  windspeedElement.innerHTML = `${Math.round(windspeed)} km/h`;
  fahrenheitLink.classList.remove("active");
  celsiusLink.classList.add("active");
}

let celsiusTemperature = null;
let minTempCelsius = null;
let maxTempCelsius = null;
let windspeed = null;

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

navigator.geolocation.getCurrentPosition(retrievePosition);
