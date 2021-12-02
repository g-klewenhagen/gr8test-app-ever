//Display current date

let now = new Date();
function formatDate(Date) {
  let months = [
    "January",
    "February",
    "'March",
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
  let year = now.getFullYear();
  let month = months[now.getMonth()];
  let date = now.getDate();
  let formattedDate = `${month} ${date}, ${year}`;

  return formattedDate;
}

let currentDateHeader = document.querySelector("#current-date-header");
currentDateHeader.innerHTML = formatDate();

//Display current time

function formatWeekdayTime() {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[now.getDay()];
  let formattedTime = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  let formattedWeekdayTime = `${day}, ${formattedTime}`;
  return formattedWeekdayTime;
}

let currentWeekdayTime = document.querySelector("#weekday-time");
currentWeekdayTime.innerHTML = formatWeekdayTime();

//Display city name on the page after the user submits the search form.

function showCitySearch(event) {
  event.preventDefault();
  let input = document.querySelector("#search-city");
  let cityTitle = document.querySelector("h1");
  cityTitle.innerHTML = `${input.value}`;
}
let form = document.querySelector("#search-form");
form.addEventListener("submit", showCitySearch);

//Display weather of searched city
function showWeather(response) {
  console.log(response);
  document.querySelector("h1").innerHTML = response.data.name;
  document.querySelector("#temp-description").innerHTML =
    response.data.weather[0].main;
  document.querySelector("#numerical-temp").innerHTML = `${Math.round(
    response.data.main.temp
  )}°`;
  document.querySelector("#min-max-temp").innerHTML = `Min:${Math.round(
    response.data.main.temp_max
  )} Max:${Math.round(response.data.main.temp_min)}`;
  document.querySelector(".windspeed").innerHTML = `Wind speed: ${Math.round(
    response.data.wind.speed
  )} km/h`;
  document.querySelector(".humidity").innerHTML = `Humidity: ${Math.round(
    response.data.main.humidity
  )} %`;
  document.querySelector("#timestamp-api").innerHTML = formatTimestamp(response.data.dt * 1000);

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
  newMainCityTempDisplayed.innerHTML = `${Math.round(newMainCityTemp)} °`;
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
}
navigator.geolocation.getCurrentPosition(retrievePosition);

function changeToCurrentLocationInfo(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(retrievePosition);
}

let locate = document.querySelector("#current-location-button");
locate.addEventListener("click", changeToCurrentLocationInfo);
