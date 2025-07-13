import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();
  const userString = sessionStorage.getItem('user');

  if (!userString) {
    // User is not authenticated, redirect to the login page
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const user = JSON.parse(userString);

  // Check if user has the required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // User doesn't have the required role, redirect to their dashboard or home
    switch (user.role) {
      case 'student':
        return <Navigate to="/student-dashboard" replace />;
      case 'teacher':
        return <Navigate to="/teacher-dashboard" replace />;
      case 'parent':
        return <Navigate to="/parent-dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  // User is authorized, render the protected component
  return children;
};

export default ProtectedRoute;
