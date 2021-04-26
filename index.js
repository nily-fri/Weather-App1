let now = new Date();

function formatDate() {
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let weekDay = days[now.getDay()];
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let month = months[now.getMonth()];
  let day = now.getDate();

  let showDate = `${weekDay}, ${month} ${day}`;

  return showDate;
}
let todayDate = document.querySelector("#today-date");
todayDate.innerHTML = formatDate();

function showTemprature(response) {
  let temprature = Math.round(response.data.main.temp);
  let tempOfCurrent = document.querySelector(".exact-temp");
  tempOfCurrent.innerHTML = `${temprature}°`;
}

function handlePosition(position) {
  console.log(position);
  let apiKey = "2f414cfeda6c23227c61d396f90f0949";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let customUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

  axios.get(customUrl).then(showTemp);
}

function getYourLocation() {
  navigator.geolocation.getCurrentPosition(handlePosition);
}

let pin = document.querySelector(".pin-icon");
pin.addEventListener("click", getYourLocation);

function unitContentF(event) {
  event.preventDefault();
  let heading = document.querySelector("#city");
  currentCityName = heading.innerHTML;
  tempInFahrenheit = getCityTemp(currentCityName, (unit = "imperial"));

  let unitF = document.querySelector(".exact-temp");
  unitF.innerHTML = tempInFahrenheit;
}

function unitContentC(event) {
  event.preventDefault();
  let heading = document.querySelector("#city");
  currentCityName = heading.innerHTML;
  tempInCelsius = getCityTemp(currentCityName);

  let unitC = document.querySelector(".exact-temp");
  unitC.innerHTML = tempInCelsius;
}

function search(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#city-name").value;
  if (!searchInput) {
    return;
  }
  getCityTemp(searchInput);
}

function showTemp(response) {
  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector(".exact-temp").innerHTML = `${Math.round(
    response.data.main.temp
  )}°`;
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#description").innerHTML =
    response.data.weather[0].main;
  document.querySelector("#feels_like").innerHTML = `${Math.round(
    response.data.main.feels_like
  )}`;
  document.querySelector("#higher-temp").innerHTML = `${Math.round(
    response.data.main.temp_max
  )}°`;
  document.querySelector("#lower-temp").innerHTML = `${Math.round(
    response.data.main.temp_min
  )}°`;
}

function getCityTemp(cityName, unit = "metric") {
  let apiKey = "2f414cfeda6c23227c61d396f90f0949";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=${unit}`;
  axios.get(`${apiUrl}&appid=${apiKey}`).then(showTemp);
}

let form = document.querySelector(".search-city");
form.addEventListener("submit", search);

let changeUnitF = document.querySelector("#fahrenheit");

changeUnitF.addEventListener("click", unitContentF);

let changeUnitC = document.querySelector("#celsius");

changeUnitC.addEventListener("click", unitContentC);
