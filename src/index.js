//Display current time
function formatTime(timestamp) {
  let date = new Date(timestamp),
    formattedTimestamp = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    formattedDateTimestamp = date.toLocaleDateString([], {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
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
//Display city name on the page after the user submits the search form.

function showCitySearch(event) {
  event.preventDefault();
  let input = document.querySelector("#search-city");
  let cityTitle = document.querySelector("h1");
  cityTitle.innerHTML = `${input.value}`;
}
let form = document.querySelector("#search-form");
form.addEventListener("submit", showCitySearch);

//Simplify function for weather display

//Display weather of searched city
function showWeather(response) {
  console.log(response);
  let dateElement = document.querySelector("#current-date-header");
  let cityNameElement = document.querySelector("h1");
  let timestampElement = document.querySelector("small");
  let temperatureElement = document.querySelector("#numerical-temp");
  let descriptionElement = document.querySelector("#temp-description");
  let minMaxElement = document.querySelector("#min-max-temp");
  let humidityElement = document.querySelector(".humidity");
  let windspeedElement = document.querySelector(".windspeed");
  let iconElement = document.querySelector("#main-icon");

  celsiusTemperature = response.data.main.temp;
  let maxTemp = Math.round(response.data.main.temp_max);
  let minTemp = Math.round(response.data.main.temp_min);

  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  cityNameElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = response.data.weather[0].description;
  minMaxElement = `Min: ${minTemp} Max:${maxTemp}`;
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

//display defaultcity based in geolocation

function showCityName(response) {
  console.log(response.data.name);
}

function displayCurrentLocationTemp(response) {
  let newMainCityTemp = response.data.main.temp;
  let newMainCityTempDisplayed = document.querySelector("#numerical-temp");
  newMainCityTempDisplayed.innerHTML = `${Math.round(newMainCityTemp)}`;
}
function displayCurrentLocationWeatherDescription(response) {
  let currentLocationDescription = response.data.weather[0].main;
  let currentLocationDescriptionDisplayed =
    document.querySelector("#temp-description");
  currentLocationDescriptionDisplayed.innerHTML = `${currentLocationDescription}`;
}
function displayCurrentLocationMinMaxTemp(response) {
  let maxTemp = Math.round(response.data.main.temp_max);
  let minTemp = Math.round(response.data.main.temp_min);
  let newMinMaxTempDisplayed = document.querySelector("#min-max-temp");
  newMinMaxTempDisplayed.innerHTML = `Min:${minTemp} Max:${maxTemp}`;
}
function displayCurrentLocationName(response) {
  let currentLocationName = response.data.name;
  let currentLocationNameDisplayed = document.querySelector("h1");
  currentLocationNameDisplayed.innerHTML = `${currentLocationName}`;
}
function displayCurrentLocationWind(response) {
  let currentLocationWind = response.data.wind.speed;
  let currentLocationWindDisplayed = document.querySelector(".windspeed");
  currentLocationWindDisplayed.innerHTML = `Wind speed: ${Math.round(
    currentLocationWind
  )}km/h`;
}
function displayCurrentLocationHumidity(response) {
  let currentLocationHumidity = response.data.main.humidity;
  let currentLocationHumidityDisplayed = document.querySelector(".humidity");
  currentLocationHumidityDisplayed.innerHTML = `Humidity: ${currentLocationHumidity}%`;
}
function displayCurrentLocationIcon(response) {
  let currentLocationIcon = response.data.weather[0].icon;
  document
    .querySelector("#main-icon")
    .setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${currentLocationIcon}@2x.png`
    );
  document
    .querySelector("#main-icon")
    .setAttribute("alt", `${response.data.weather[0].description}`);
}
function retrievePosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "9d10ae99dce72210fc268d3c5d70c5df";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather?";
  let units = "metric";
  let apiUrl = `${apiEndpoint}lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(displayCurrentLocationName);
  axios.get(apiUrl).then(displayCurrentLocationTemp);
  axios.get(apiUrl).then(displayCurrentLocationWeatherDescription);
  axios.get(apiUrl).then(displayCurrentLocationMinMaxTemp);
  axios.get(apiUrl).then(displayCurrentLocationWind);
  axios.get(apiUrl).then(displayCurrentLocationHumidity);
  axios.get(apiUrl).then(displayCurrentLocationIcon);
}
navigator.geolocation.getCurrentPosition(retrievePosition);

function changeToCurrentLocationInfo(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(retrievePosition);
}

let locate = document.querySelector("#current-location-button");
locate.addEventListener("click", changeToCurrentLocationInfo);

//Change between F and C
function displayFahrenheitTemperature(event) {
  event.preventDefault();
  let fahrenheitTemperature = (14 * 9) / 5 + 32;
  let temperatureElement = document.querySelector("#numerical-temp");
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

let celsiusTemperature = null;

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);
