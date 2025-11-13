import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import NonAuthNavBar from './Components/NonAuthNavBar/NonAuthNavBar'
import HomePage from './Pages/Home/homePage'
import SignupPage from './Pages/Signup/SignupPage'
import LoginPage from './Pages/Login/LoginPage'
import CommunityPage from './Pages/Community/CommunityPage'
import ArticlesPage from './Pages/Articles/ArticlesPage'
import NonAuthFooter from './Components/NonAuthFooter/NonAuthFooter'
import ProtectedRoute from './Components/ProtectedRoute/protectedroute'

function App() {
  return (
    <div className="container">
    <BrowserRouter>
    <NonAuthNavBar/>
      <Routes>
        <Route path='/home' element={<HomePage/>}/>
        <Route path='/signup' element={<SignupPage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/articles' element={<ArticlesPage/>}/>

         <Route path='/community' element={
          <ProtectedRoute>
            <CommunityPage />
            </ProtectedRoute>}
          />
      </Routes>
    </BrowserRouter>
    <NonAuthFooter/>
    </div>
  )
}

export default App
