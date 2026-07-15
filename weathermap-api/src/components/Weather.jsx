import React from 'react'
import './Weather.css'
import search_icon from '../assets/search.png'

const Weather = () => {
  return (
    <div className='weather'>
      <div className='search-input'>
        <input type="text" placeholder='Find my weather' />
        <img src={search_icon} alt="Search Icon" />
      </div>
    </div>
  )
}

export default Weather