import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import QRScanner from './components/QRScanner';
import PayoutRequest from './components/PayoutRequest';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './components/LandingPage';
import { checkAuth } from './services/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const { isAuthenticated } = await checkAuth();
        console.log('Auth check result:', isAuthenticated);
        setIsAuthenticated(isAuthenticated);
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    verifyAuth();
  }, []);

  useEffect(() => {
    console.log('Authentication state changed:', isAuthenticated);
  }, [isAuthenticated]);

  const handleSetIsAuthenticated = (value) => {
    console.log('Setting isAuthenticated to:', value);
    setIsAuthenticated(value);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />} />
        <Route path="/login" element={<Login setIsAuthenticated={handleSetIsAuthenticated} />} />
        <Route path="/register" element={<Register setIsAuthenticated={handleSetIsAuthenticated} />} />
        <Route path="/dashboard" element={
          <ProtectedRoute isAuth={isAuthenticated}>
            <Dashboard setIsAuthenticated={handleSetIsAuthenticated} />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute isAuth={isAuthenticated}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/scan" element={
          <ProtectedRoute isAuth={isAuthenticated}>
            <QRScanner />
          </ProtectedRoute>
        } />
        <Route path="/payout" element={
          <ProtectedRoute isAuth={isAuthenticated}>
            <PayoutRequest />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;