const form = document.querySelector('form');
const cityInput = document.querySelector('#city');
const WeatherDetails = document.querySelector('.info');
const SearchHistory = document.querySelector('#HistoryBtn');
const consoleBox = document.querySelector('#consoleBox');

const API_KEY = '0133cc5316757ac730cc46ae342334e4';

let cityhistory = JSON.parse(localStorage.getItem('cityhistory')) || [];

displayHistory();

form.addEventListener('submit', async function (event) {
    event.preventDefault();

    consoleBox.innerHTML = "";
    log("▶ Sync Start");

    const searchCity = cityInput.value.trim();

    if (!searchCity) {
        WeatherDetails.innerHTML = `<p>Please enter a city name.</p>`;
        return;
    }

    log("[ASYNC] Start fetching");

    try {
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${API_KEY}&units=metric`
        );

        const data = await res.json();

        if (data.cod === 200) {

            WeatherDetails.innerHTML = `
                <h3>Weather Info</h3>
                <div class="weather-row"><span>City</span><span>${data.name}, ${data.sys.country}</span></div>
                <div class="weather-row"><span>Temp</span><span>${data.main.temp} °C</span></div>
                <div class="weather-row"><span>Weather</span><span>${data.weather[0].main}</span></div>
                <div class="weather-row"><span>Humidity</span><span>${data.main.humidity}%</span></div>
                <div class="weather-row"><span>Wind</span><span>${data.wind.speed} m/s</span></div>
            `;

            cityhistory.push(searchCity);
            cityhistory = [...new Set(cityhistory)];

            localStorage.setItem('cityhistory', JSON.stringify(cityhistory));
            displayHistory();

            log("[ASYNC] Data received");

        } else {
            WeatherDetails.innerHTML = `<div class="error">
                        <p>City not found.</p>
                    </div>`
;
        }

    } catch (error) {
        WeatherDetails.innerHTML = `<p class="error"> Error fetching weather.</p>`;
    }

    log("▶ Sync End");

    cityInput.value = "";
});


function displayHistory() {
    SearchHistory.innerHTML = "";

    cityhistory.forEach(city => {
        const btn = document.createElement("button");
        btn.innerText = city;

        btn.addEventListener("click", () => {
            cityInput.value = city;
            form.dispatchEvent(new Event("submit"));
        });

        SearchHistory.appendChild(btn);
    });
}

function log(message) {
    const p = document.createElement("p");
    p.textContent = message;
    consoleBox.appendChild(p);
}
