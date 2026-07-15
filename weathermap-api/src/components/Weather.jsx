import React from 'react'
import './Weather.css'

const Weather = () => {
  return (
    <div className='weather'>
      <div className='search-input'>
        <input type="text" placeholder='Find my weather' />
        <img src="" alt="Search Icon" />
      </div>
    </div>
  )
}

export default Weather