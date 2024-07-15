import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { login } from '../services/api';
import './Login.css';
import polycromeLogo from '../assets/Polycrome_Logo_202x80@72x.png';
import secondLogo from '../assets/polycrome second logo.jpg';
import dualLogo from '../assets/polycrome dual logo.png';


function Login({ setIsAuthenticated }) {
  const [nicNumber, setNicNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for any error message passed through navigation state
    if (location.state?.error) {
      setError(location.state.error);
      // Clear the error from navigation state
      navigate(location.pathname, { replace: true, state: {} });
    }

    // Check for any pending item code
    const pendingItemCode = sessionStorage.getItem('pendingItemCode');
    if (pendingItemCode) {
      console.log('Pending item code found:', pendingItemCode);
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await login(nicNumber, password);
      if (response.error) {
        throw new Error(response.error);
      }
      localStorage.setItem('token', response.data.token);
      setIsAuthenticated(true);
      
      const pendingItemCode = sessionStorage.getItem('pendingItemCode');
      if (pendingItemCode) {
        sessionStorage.removeItem('pendingItemCode');
        navigate(`/dashboard?itemcode=${pendingItemCode}`);
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      setError(error.message);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
      <div className="logo-container">
          <img src={dualLogo} alt="Polycrome Dual Logo" className="logo dual-logo" />
        </div>
        <h2 className="login-title">Login</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="nicNumber">NIC Number</label>
            <input
              type="text"
              id="nicNumber"
              value={nicNumber}
              onChange={(e) => setNicNumber(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="register-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;