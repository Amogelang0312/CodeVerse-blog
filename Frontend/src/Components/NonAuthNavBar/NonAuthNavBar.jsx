import React from 'react'
import { Link } from 'react-router-dom'
import './NonAuthNavBar.css'

function NonAuthNavBar() {
  return (
    <nav>
        <div className="logo-nav-container">
            <h2>CodeVerse</h2>
        </div>
        <div className="main-nav-container">
            <ul>
                <li>
                    <Link to={'/home'}>Home</Link>
                </li>
                <li>
                    <Link to={'/articles'}>Articles</Link>
                </li>
                <li>
                    <Link to={'/community'}>Community</Link>
                </li>
                <li>
                    <Link to={'/login'}>Login</Link>
                </li>
                <li>
                    <Link to={'/signup'}>Signup</Link>
                </li>
            </ul>
        </div>
    </nav>
  )
}

export default NonAuthNavBar