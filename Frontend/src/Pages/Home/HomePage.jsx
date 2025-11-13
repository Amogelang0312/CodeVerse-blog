import React from 'react'
import './HomePage.css'
import { Link } from 'react-router-dom'
import homeicon from './Images/pexels-shahadat-hossain-2156108532-34317747.jpg'

function homePage() {
  return (
    <div className='homeicon'>
      <img src='homeicon' alt='' className='home-image'></img>
    <div className='home-container'>
        <h2>Where developers share what's next.</h2>
        <p>Discover insights, tutorials and tools from people shaping the future of code.
            <button>
               <Link to={'/signup'}>Enter the Verse</Link> 
            </button>
        </p>
        <br/>
    </div>
    </div>
  )
}

export default homePage