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

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  return days[day];
}

let todayDate = document.querySelector("#today-date");
todayDate.innerHTML = formatDate();

function showTemprature(response) {
  let temprature = Math.round(response.data.main.temp);
  let tempOfCurrent = document.querySelector(".exact-temp");
  tempOfCurrent.innerHTML = `${temprature}°`;
}

function handlePosition(position) {
  // console.log(position);
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
  getCityTemp(currentCityName, (unit = "imperial"));
  getCityForcast(currentCityName, (unit = "imperial"));
  document.querySelector("#speed-unit").innerHTML = `mph`;

  //   let smallMax = document.querySelector("#small-max").innerHTML;
  //   console.log(smallMax);

  //   let smallMaxTemp = (smallMax * 9) / 5 + 32;
  //   console.log(smallMaxTemp);
  //   smallMax.innerHTML = Math.round(smallMaxTemp);
}

function unitContentC(event) {
  event.preventDefault();
  let heading = document.querySelector("#city");
  currentCityName = heading.innerHTML;
  getCityTemp(currentCityName);
  getCityForcast(currentCityName, "metric");
  document.querySelector("#speed-unit").innerHTML = `km/h`;
}

function search(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#city-name").value;
  if (!searchInput) {
    return;
  }
  getCityTemp(searchInput);
}

function getForecast(coordinates, unit = "metric") {
  let apiKey = "2f414cfeda6c23227c61d396f90f0949";

  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${unit}`;

  axios.get(apiUrl).then(displayForecast);
}

function showTemp(response) {
  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector(".exact-temp").innerHTML = `${Math.round(
    response.data.main.temp
  )}°`;
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = `${Math.round(
    response.data.wind.speed
  )}`;
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
  let iconElement = document.querySelector(".big-icon");
  iconElement.setAttribute("src", `png/${response.data.weather[0].icon}.png`);

  getForecast(response.data.coord);
}

function getCityTemp(cityName, unit = "metric") {
  let apiKey = "2f414cfeda6c23227c61d396f90f0949";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=${unit}`;
  axios.get(`${apiUrl}&appid=${apiKey}`).then(showTemp);
}

function getCityForcast(cityName, unit = "metric") {
  // getting city coordinates through the first API
  let apiKey = "2f414cfeda6c23227c61d396f90f0949";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}`;
  if (unit === "metric") {
    axios.get(`${apiUrl}&appid=${apiKey}`).then(getForecastByCityMetric);
  } else {
    axios.get(`${apiUrl}&appid=${apiKey}`).then(getForecastByCityImperial);
  }
}
function getForecastByCityMetric(response) {
  coords = response.data.coord;
  // console.log(coords);
  getForecast(coords, "metric");
}
function getForecastByCityImperial(response) {
  coords = response.data.coord;
  // console.log(coords);
  getForecast(coords, "imperial");
}

function displayForecast(response) {
  // console.log(response.data.daily);

  let forecastElement = document.querySelector("#week-forecast");

  let days = response.data.daily;

  let forecastHTML = `<div`;
  days.forEach(function (day, index) {
    if (index < 6 && index > 0) {
      forecastHTML =
        forecastHTML +
        `
      <div class="col-2 card">
         <div>${formatDay(day.dt)}</div>
            <div>
              <img
                src="png/${response.data.daily[index].weather[0].icon}.png"
                alt="sun-icon"
                class="small-icon"
                width="20px"
              />
            </div>
            <div class="row">
              <span class="higher-temp" id="small-max">${Math.round(
                day.temp.max
              )}°</span> <br />
              <span class="lower-temp" id="small-min">${Math.round(
                day.temp.min
              )}°</span>
            </div>
          </div>
        `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

let form = document.querySelector(".search-city");
form.addEventListener("submit", search);

let changeUnitF = document.querySelector("#fahrenheit");

changeUnitF.addEventListener("click", unitContentF);

let changeUnitC = document.querySelector("#celsius");

changeUnitC.addEventListener("click", unitContentC);

getCityTemp("Tel Aviv", "metric");
