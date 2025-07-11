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
import LevelThreeGame from './pages/LevelThreeGame'
import LevelFourGame from "./pages/LevelFourGame"
import LevelFiveGame from "./pages/LevelFiveGame"
import LevelSixGame from './pages/LevelSixGame'
import LevelSevenGame from './pages/LevelSevenGame'
import LevelEightGame from './pages/LevelEightGame'
import LevelNineGame from './pages/LevelNineGame'

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
      <Route path="/level-3" element={<LevelThreeGame />} />
      <Route path="/level-4" element={<LevelFourGame />} />
      <Route path="/level-5" element={<LevelFiveGame />} />
      <Route path="/level-6" element={<LevelSixGame />} />
      <Route path="/level-7" element={<LevelSevenGame />} />
      <Route path='/level-8' element={<LevelEightGame />} />
      <Route path="/level-9" element={<LevelNineGame />} />
    </Routes>
    </>
  )
}

export default App;
