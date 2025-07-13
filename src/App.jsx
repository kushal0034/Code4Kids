import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/StudentDashboardPage';
import TeacherDashboardPage from './pages/TeacherDashboardPage';
import ParentDashboard from './pages/ParentDashboardPage';
import WorldsPage from './pages/WorldsPage';
import LevelOnePage from './pages/LevelOnePage';
import LevelTwoGame from "./pages/LevelTwoGame";
import LevelThreeGame from './pages/LevelThreeGame';
import LevelFourGame from "./pages/LevelFourGame";
import LevelFiveGame from "./pages/LevelFiveGame";
import LevelSixGame from './pages/LevelSixGame';
import LevelSevenGame from './pages/LevelSevenGame';
import LevelEightGame from './pages/LevelEightGame';
import LevelNineGame from './pages/LevelNineGame';
import ProtectedRoute from "./components/ProtectedRoute";


function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes - Student Only */}
      <Route
        path='/student-dashboard'
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/worlds"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <WorldsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/level-1"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <LevelOnePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/level-2"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <LevelTwoGame />
          </ProtectedRoute>
        }
      />
      <Route
        path="/level-3"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <LevelThreeGame />
          </ProtectedRoute>
        }
      />
      <Route
        path="/level-4"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <LevelFourGame />
          </ProtectedRoute>
        }
      />
      <Route
        path="/level-5"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <LevelFiveGame />
          </ProtectedRoute>
        }
      />
      <Route
        path="/level-6"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <LevelSixGame />
          </ProtectedRoute>
        }
      />
      <Route
        path="/level-7"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <LevelSevenGame />
          </ProtectedRoute>
        }
      />
      <Route
        path='/level-8'
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <LevelEightGame />
          </ProtectedRoute>
        }
      />
      <Route
        path="/level-9"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <LevelNineGame />
          </ProtectedRoute>
        }
      />

      {/* Protected Routes - Teacher Only */}
      <Route
        path="/teacher-dashboard"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherDashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Protected Routes - Parent Only */}
      <Route
        path='/parent-dashboard'
        element={
          <ProtectedRoute allowedRoles={['parent']}>
            <ParentDashboard />
          </ProtectedRoute>
        }
      />


    </Routes>
  );
}

export default App;
