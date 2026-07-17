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
import sunrise_icon from '../assets/sunrise.png'
import sunset_icon from '../assets/sunset.png'


const Weather = () => {

  const inputRef = useRef();
  const [ weatherData, setWeatherData ] = useState(false);
  const [ lookupError, setLookupError ] = useState(false);

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
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${import.meta.env.VITE_WEATHER_API_KEY}&units=metric`;
      
      const response = await fetch(url);
      const data = await response.json();

      console.log('Data from api: ', data);

      const icon = weatherIcons[data.weather[0].icon] || clear_icon;

      // format from api isnt readable so having to convert it
      const sunrise = new Date(data.sys.sunrise * 1000);
      const sunset = new Date(data.sys.sunset * 1000);

      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: icon,
        sunrise: sunrise,
        sunset: sunset,
      })
      setLookupError(false);
    } catch (err) {
      setWeatherData(false);
      setLookupError(true);
      console.error("Error whilst fetching data", err);
      // NTH: Could add a trigger here to display an error component, using a ternary operator to say if error display error block
    }
  }
  
  // Temporarily removed as was preventing fallback testing upon incorrect searches 
  // useEffect(() => {
  //   search("Newcastle");
  // }, [])

  return (
    <div className='weather'>
      <div className='search-input'>
        <input 
          aria-required={true}
          aria-label='Find my weather forecast'
          ref={inputRef} 
          type="text" 
          placeholder='Find my weather' 
        />
        {/* <img src={search_icon} alt="Search Icon" onClick={() => search(inputRef.current.value)} /> */}
        <button 
          type='submit' 
          onClick={() => search(inputRef.current.value)} 
          alt="Search button"
          className="search-button"
          aria-label="Forecast search button"
        >
          <img aria-hidden="true" src={search_icon} />
        </button>
      </div>

      {lookupError === true && (
        <>
          <span className="errorMessage" aria-label='There was an error with your search criteria, please try again.'>
            There was an error with your search criteria, please try again.
          </span>
        </>
      ) }
      {/* Check below, if no data returned dont show empty data fields */}
      {weatherData? <>
        <img src={weatherData.icon} alt="Clear Icon" className="weather-icon" />
          <p className="temperature">{weatherData.temperature}</p>
          <p className="location">{weatherData.location}</p>
          { 
            // add condition for weather condition here, 
            // check what data the api provides in order to do checks and display valid user friendly data.
            // ternary here to check against weather conditions, wear a jacket, take sun screen, 
          }

          <div className="weather-data-section">
            <div className="col pr3">
              <img src={sunrise_icon} alt="Sunrise icon"  aria-label="Sunrise image" />
              <div aria-label="Sunrise data section">
                Sunrise:{" "}
                {/* Due to being local time zone this doesnt work too well for looking up Boston, Tokyo, NY etc.
                This would be an improvement needed to be made in the future, as i dont think the sunrises in Tokyo at 
                20:37 */}
                {weatherData.sunrise.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
            <div className="col"  aria-label="Sunset data section">
              <img src={sunset_icon} alt="Sunset icon" aria-label="Sunset icon"/>
              <div>
                Sunset:{" "}
                {weatherData.sunset.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div> 

          <div className="weather-data-section">
            <div className="col pr3">
              <img src={humidity_icon} alt="Humidity icon"  aria-label="Humiditiy icon"/>
              <div>
                <p aria-label="Humidity value">{weatherData.humidity}</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src={wind_icon} alt="Wind icon" aria-label="Wind speed icon"/>
              <div>
                <p aria-label="Humidity value">{weatherData.windSpeed}</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div> 
          
        </> : <></>}
    </div>
  )
}

export default Weather