import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes ,Route} from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import SigninPage from "./pages/SigninPage"

function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<LandingPage/>} />
      <Route path="/login" element={<SigninPage/>} />
    </Routes>
    </>
  )
}

export default App
