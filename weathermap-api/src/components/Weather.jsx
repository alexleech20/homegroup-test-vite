import React, { useEffect, useState, useRef } from 'react'
import './Weather.css'
import search_icon from '../assets/search.png'
import clear_icon from '../assets/clear.png'
import cloud_icon from '../assets/cloud.png'
import drizzle_icon from '../assets/drizzle.png'
import humidity_icon from '../assets/humidity.png'
import rain_icon from '../assets/rain.png'
import snow_icon from '../assets/snow.png'
import wind_icon from '../assets/wind.png'

const Weather = () => {

  const inputRef = useRef();
  const [ weatherData, setWeatherData ] = useState(false);

  // NTH: Have more accurate icons for weather conditions, dependant on how heavy the rain is change the icon to match
  const weatherIcons = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "02n": cloud_icon,
    "03d": cloud_icon,
    "03n": cloud_icon,
    "09d": drizzle_icon,
    "09n": drizzle_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "13d": snow_icon,
    "13n": snow_icon,
  }



  const search = async (city) => {
    if (city === ""){
      alert("Please enter a valid city")
      return;
    }

    try {
      // ${import.meta.env.VITE_WEATHERMAP_API_KEY}
      // had to add metric units due to the response from the api not being in degrees celcius 
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_WEATHERMAP_API_KEY}`;
      
      const response = await fetch(url);
      const data = await response.json();

      console.log('Data from api: ', data);

      const icon = weatherIcons[data.weather[0].icon] || clear_icon;

      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: icon,
      })
    } catch (err) {
      setWeatherData(false);
      console.error("Error whilst fetching data");
    }
  }
  
  // Temporarily removed as was preventing fallback testing upon incorrect searches 
  // useEffect(() => {
  //   search("Newcastle");
  // }, [])

  return (
    <div className='weather'>
      <div className='search-input'>
        <input ref={inputRef} type="text" placeholder='Find my weather' />
        <img src={search_icon} alt="Search Icon" onClick={() => search(inputRef.current.value)} />
      </div>
      {/* Check below, if no data returned dont show empty data fields */}
      {weatherData? <>
        <img src={weatherData.icon} alt="Clear Icon" className="weather-icon" />
          <p className="temperature">{weatherData.temperature}</p>
          <p className="location">{weatherData.location}</p>
          <div className="weather-data-section">
            <div className="col pr3">
              <img src={humidity_icon} alt="Humidity icon" />
              <div>
                <p className="humidity_value">{weatherData.humidity}</p>
                {/* <p>{weatherData.humidity}</p> */}
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src={wind_icon} alt="Wind icon" />
              <div>
                <p>{weatherData.windSpeed}</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div> 
        </> : <></>}
    </div>
  )
}

export default Weather