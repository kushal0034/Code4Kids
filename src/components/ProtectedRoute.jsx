// ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const userString = sessionStorage.getItem('user');
  
  if (!userString) {
    return <Navigate to="/" replace />;
  }
  
  const user = JSON.parse(userString);
  
  // Check if user has the required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // User doesn't have the required role, redirect to their dashboard
    switch(user.role) {
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
  
  return children;
};

export default ProtectedRoute;