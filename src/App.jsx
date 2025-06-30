import { useState } from 'react'
import './App.css'
import { Routes ,Route} from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import StudentDashboard from './pages/StudentDashboardPage'
import TeacherDashboardPage from './pages/TeacherDashboardPage'
import ParentDashboard from './pages/ParentDashboardPage'
import WorldsPage from './pages/WorldsPage'
import LevelOnePage from './pages/LevelOnePage'
import LevelTwoGame from "./pages/LevelTwoGame"

function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<LandingPage/>} />
      <Route path="/login" element={<LoginPage/>} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path='/student-dashboard' element={<StudentDashboard />} />
      <Route path="/teacher-dashboard" element={<TeacherDashboardPage />} />
      <Route path='/parent-dashboard' element={<ParentDashboard />} />
      <Route path="/worlds" element={<WorldsPage />} />
      <Route path="/level-1" element={<LevelOnePage />} />
      <Route path="/level-2" element={<LevelTwoGame />} />
    </Routes>
    </>
  )
}

export default App
