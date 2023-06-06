//Date and time
let now = new Date();

function formatDate() {
  let weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let weekDay = weekDays[now.getDay()];
  let hour = now.getHours();

  let minute = now.getMinutes();
  if (minute < 10) {
    minute = `0${minute}`;
  }
  let h4 = document.querySelector("#time");
  h4.innerHTML = `${weekDay} ${hour}:${minute}`;
}

formatDate();

//Forecast
function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `<div class="col-2">
            <div class="weather-forecast-date">${formatDay(
              forecastDay.dt
            )}</div>
            <img
              src="https://openweathermap.org/img/wn/${
                forecastDay.weather[0].icon
              }@2x.png"
              id="weather-icon"
              width="42px"
            />
            <div class="weather-forecast-temperature">
              <span class="weather-forecast-temperature-max">${Math.round(
                forecastDay.temp.max
              )}°</span>
              <span class="weather-forecast-temperature-min"> ${Math.round(
                forecastDay.temp.min
              )}°</span>
            </div>
          </div>`;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  console.log(coordinates);
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayForecast);
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();

  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

//Search and current weather with API
let apiKey = "c03face7caa58a9b7ffa9f52b7238a93";

//City in search and update text
function cityUpdate(city) {
  let apiKey = "c03face7caa58a9b7ffa9f52b7238a93";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric`;

  axios.get(`${apiUrl}&appid=${apiKey}`).then(showTemperature);
}
cityUpdate("Munich");

//Temperature
function showTemperature(response) {
  console.log(response.data);

  let city = document.querySelector("#city");
  city.innerHTML = response.data.name;

  let temperature = Math.round(response.data.main.temp);
  let cityTemp = document.querySelector("#temperature");
  cityTemp.innerHTML = temperature;

  celsiusTemp = response.data.main.temp;

  let humidity = document.querySelector("#humidity");
  humidity.innerHTML = response.data.main.humidity;

  let windspeed = document.querySelector("#wind");
  windspeed.innerHTML = Math.round(response.data.wind.speed);

  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );

  getForecast(response.data.coord);
}

let citySearch = document.querySelector("#city-search");
citySearch.addEventListener("click", () => {
  var cityName = document.querySelector("#city-input").value;

  cityUpdate(cityName);
});

//Current city
let currentCity = document.querySelector("#current-city");
currentCity.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition((position) => {
    const coordinates = position.coords;
    let apiGeo = `http://api.openweathermap.org/geo/1.0/reverse?lat=${coordinates.latitude}&lon=${coordinates.longitude}&limit=1`;

    axios.get(`${apiGeo}&appid=${apiKey}`).then((response) => {
      let cityName = response.data[0].name;
      let apiWeather = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric`;

      axios.get(`${apiWeather}&appid=${apiKey}`).then(showTemperature);
    });
  });
});

//Temperature unit conversion C to F
let celsiusTemp = null;

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  //remove the active class for celsius link
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemp = (celsiusTemp * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemp);
}

//Temperature unit conversion F to C
let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

function displayCelsiusTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemp);
}

// window.addEventListener("load", () => {
//   cityUpdate(document.querySelector("#city").innerText);
// });
