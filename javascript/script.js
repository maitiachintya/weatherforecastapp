document.getElementById('getWeatherBtn').addEventListener('click', async function () {
    const city = document.getElementById('city').value;
    const apiKey = '19e44f500f155cdde7eca4adbf87b0f2';  // Replace with your valid API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    if (city) {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            // Check for errors like city not found
            if (data.cod === '404') {
                alert('City not found');
                return;
            }

            // Logging the response to help with debugging
            console.log(data);

            // Displaying weather information
            document.getElementById('cityName').textContent = `Weather in ${data.name}`;
            document.getElementById('temperature').textContent = `Temperature: ${data.main.temp}°C`;
            document.getElementById('description').textContent = `Condition: ${data.weather[0].description}`;
            document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
            document.getElementById('windSpeed').textContent = `Wind Speed: ${data.wind.speed} m/s`;
            document.getElementById('pressure').textContent = `Pressure: ${data.main.pressure} hPa`;

            // Convert UTC timestamp to local time for sunrise and sunset
            const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
            const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();
            document.getElementById('sunrise').textContent = `Sunrise: ${sunrise}`;
            document.getElementById('sunset').textContent = `Sunset: ${sunset}`;

            // Adding weather icon
            const weatherIcon = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
            document.getElementById('weatherIcon').src = weatherIcon;

            // Display the 5-day forecast
            const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
            const forecastResponse = await fetch(forecastApiUrl);
            const forecastData = await forecastResponse.json();

            let forecastHtml = '<h3>5-Day Forecast:</h3>';
            forecastData.list.forEach((forecast, index) => {
                if (index % 8 === 0) {  // Every 8th item corresponds to a 3-hour forecast interval (usually 24 hours apart)
                    forecastHtml += `
              <div class="forecast-item">
                <p>${new Date(forecast.dt * 1000).toLocaleDateString()}</p>
                <p>${forecast.main.temp}°C</p>
                <p>${forecast.weather[0].description}</p>
              </div>
            `;
                }
            });
            document.getElementById('forecast').innerHTML = forecastHtml;
        } catch (error) {
            console.error('Error:', error);
            alert('Error fetching weather data');
        }
    } else {
        alert('Please enter a city');
    }
});
