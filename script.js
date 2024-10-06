const apiConfig = {
  apiKey: 'fcc8de7015bbb202209bbf0261babf4c',
  baseUrl: 'https://api.openweathermap.org/data/2.5/',
};

const searchBtn = document.getElementById('search-btn');
const geoBtn = document.getElementById('geo-btn');
const cityInput = document.getElementById('city-input');
const weatherInfo = document.getElementById('weather-info');
const forecastInfo = document.getElementById('forecast-info');
const forecastCards = document.getElementById('forecast-cards');
const errorMessage = document.getElementById('error-message');
const celsiusBtn = document.getElementById('celsius');
const fahrenheitBtn = document.getElementById('fahrenheit');
const loadingSpinner = document.getElementById('loading');
const dateDay = document.getElementById('date-day');

let isCelsius = true;

// Event Listeners
searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) {
    clearWeatherData();
    showLoading();
    fetchWeatherData(city);
  }
});

geoBtn.addEventListener('click', () => {
  if (navigator.geolocation) {
    clearWeatherData();
    showLoading();
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      fetchWeatherDataByGeo(latitude, longitude);
    });
  } else {
    showErrorMessage('Geolocation is not supported by this browser.');
  }
});

celsiusBtn.addEventListener('click', () => {
  if (!isCelsius) {
    isCelsius = true;
    celsiusBtn.classList.add('active');
    fahrenheitBtn.classList.remove('active');
    refreshWeather();
  }
});

fahrenheitBtn.addEventListener('click', () => {
  if (isCelsius) {
    isCelsius = false;
    fahrenheitBtn.classList.add('active');
    celsiusBtn.classList.remove('active');
    refreshWeather();
  }
});

// Fetch Weather Data
function fetchWeatherData(city) {
  const url = `${apiConfig.baseUrl}weather?q=${city}&units=metric&appid=${apiConfig.apiKey}`;
  fetch(url)
    .then(response => response.json())
    .then(data => displayWeatherData(data))
    .catch(() => showErrorMessage('City not found!'));
}

// Fetch 5-Day Forecast Data
function fetchForecastData(lat, lon) {
  const url = `${apiConfig.baseUrl}forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiConfig.apiKey}`;
  fetch(url)
    .then(response => response.json())
    .then(data => displayForecastData(data))
    .catch(() => showErrorMessage('Unable to fetch forecast data!'));
}

// Display Weather Data
function displayWeatherData(data) {
  const { name, main: { temp, humidity }, weather, wind } = data;

  document.getElementById('city-name').textContent = name;
  document.getElementById('temp').textContent = `${Math.round(temp)}°C`;
  document.getElementById('description').textContent = weather[0].description;
  document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
  document.getElementById('wind').textContent = `Wind: ${wind.speed} m/s`;
  document.getElementById('humidity').textContent = `Humidity: ${humidity}%`;

  // Fetch forecast data after getting current weather
  fetchForecastData(data.coord.lat, data.coord.lon);

  hideLoading();
  weatherInfo.style.display = 'block';
}

// Display 5-Day Forecast Data
function displayForecastData(data) {
  const forecastDays = data.list.filter(item => item.dt_txt.includes('12:00:00'));

  forecastCards.innerHTML = ''; // Clear existing cards
  forecastDays.forEach(day => {
    const card = document.createElement('div');
    card.classList.add('forecast-card');
    card.innerHTML = `
      <div class="forecast-day">${new Date(day.dt_txt).toLocaleDateString()}</div>
      <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="Weather Icon">
      <div class="forecast-temp">${Math.round(day.main.temp)}°C</div>
    `;
    forecastCards.appendChild(card);
  });

  forecastInfo.style.display = 'block';
}

// Show Loading Spinner
function showLoading() {
  loadingSpinner.style.display = 'block';
}

// Hide Loading Spinner
function hideLoading() {
  loadingSpinner.style.display = 'none';
}

// Clear Weather Data
function clearWeatherData() {
  weatherInfo.style.display = 'none';
  forecastInfo.style.display = 'none';
  errorMessage.style.display = 'none';
  forecastCards.innerHTML = '';
}

// Show Error Message
function showErrorMessage(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';
  hideLoading();
}

// Set current date and time
function setCurrentDate() {
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  dateDay.textContent = now.toLocaleDateString(undefined, options);
}

setCurrentDate();
