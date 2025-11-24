

const searchButton = document.querySelector(".search");
const time = document.querySelectorAll(".forecast-time");
const forecastTemp = document.querySelectorAll(".forecast-temp");
const forecastFeelsLike = document.querySelectorAll(".forecast-feels-like");
const forecastIcon = document.querySelectorAll(".forecast-icon");
const favouriteArea = document.querySelector(".favourite-area");
const like = document.querySelector(".to-favourite");
const city = document.querySelector(".city");
const temperature = document.querySelector(".temperature");
const feelsLike = document.querySelector(".feels-like");
const img = document.querySelector(".icon");
const wind = document.querySelector(".wind");
const humidity = document.querySelector(".humidity");
const favouriteCity = document.querySelectorAll(".favourite-city");

searchButton.addEventListener("click", function () {
  let searchArea = document.querySelector(".enter-city");
  getWeather(searchArea.value);
  searchArea.value = "";
});

async function getWeather(town) {
  try {
    if (!town) {
      throw new Error("Вы не ввели город");
    }

    let response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${town}&appid=${TOKEN}&units=metric&lang=ru`
    );

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    let responseToJson = await response.json();
    displayWeather(responseToJson);

    let forecast = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${town}&appid=${TOKEN}&units=metric&lang=ru`
    );

    if (!forecast.ok) {
      throw new Error(`Ошибка HTTP прогноза: ${forecast.status}`);
    }

    let responseForecast = await forecast.json();
    displayForecast(responseForecast);

  } catch (error) {
    console.error('Ошибка получения погоды:', error);
    alert(`Ошибка: ${error.message}`);
  }
}

function displayWeather(responceWeather) {
  const todayWeather = {
    name: responceWeather.name,
    temp: Math.floor(responceWeather.main.temp),
    feelsLike: Math.floor(responceWeather.main.temp),
    humidity: responceWeather.main.humidity,
    wind: Math.floor(responceWeather.wind.speed),
    windDirection: responceWeather.wind.deg,
    icon: responceWeather.weather[0].icon,
  };

  city.innerHTML = todayWeather.name;
  img.innerHTML = `<img src="https://openweathermap.org/img/wn/${todayWeather.icon}@2x.png" alt=""/>`;
  temperature.innerHTML = `${todayWeather.temp}° С`;
  feelsLike.innerHTML = `Ощущается как ${todayWeather.feelsLike}° С`;
  wind.innerHTML = `Ветер: ${todayWeather.wind} м/с.`;
  humidity.innerHTML = `Влажность: ${todayWeather.humidity}%`;
}

function displayForecast(responceForecast) {
  responseList = responceForecast.list.slice(1, 4);

  let forecastArray = [];

  for (const [index, element] of responseList.entries()) {
    let weatherForecast = {
      date: element.dt_txt.slice(11, 16),
      temp: Math.floor(element.main.temp),
      feelsLike: Math.floor(element.main.feels_like),
      icon: element.weather[0].icon,
    };

    forecastArray.push(weatherForecast);
  }
  for (const [index, element] of forecastArray.entries()) {
    time[index].innerHTML = element.date;
    forecastTemp[index].innerHTML = `Температура: ${element.temp}° С`;
    forecastFeelsLike[
      index
    ].innerHTML = `Ощущается как ${element.feelsLike}° С`;
    forecastIcon[
      index
    ].innerHTML = `<img src="https://openweathermap.org/img/wn/${element.icon}@2x.png" alt=""/>`;
  }
}

like.onclick = function () {
  let city = document.querySelector(".city").innerHTML;

  if (city !== "") {
    const div = document.createElement("div");
    div.classList.add("favourite-city");

    const cityName = document.createElement("div");
    cityName.classList.add("city-name");
    cityName.innerHTML = city;

    const span = document.createElement("span");
    span.innerHTML = "X";

    div.appendChild(cityName);
    div.appendChild(span);
    favouriteArea.appendChild(div);
  }
};

favouriteArea.addEventListener("click", function (event) {
  if (event.target.classList.contains("city-name")) {
    getWeather(event.target.innerHTML);
  } else if (event.target.tagName === "SPAN") {
    event.target.parentElement.remove();
  }
});


