// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ isAuth, children }) => {
  const location = useLocation();
  
  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location, message: "You need to log in to access this page." }} replace />;
  }
  
  return children;
};

export default ProtectedRoute;