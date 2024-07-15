import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';
import './Register.css';
import polycromeLogo from '../assets/Polycrome_Logo_202x80@72x.png';
import secondLogo from '../assets/polycrome second logo.jpg';
import dualLogo from '../assets/polycrome dual logo.png';


const Register = ({ setIsAuthenticated }) => {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    city: '', 
    nicNumber: '',
    contactNo: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const validateNIC = (nic) => {
    const oldNICRegex = /^[0-9]{9}[vVxX]$/;
    const newNICRegex = /^[0-9]{12}$/;
    return oldNICRegex.test(nic) || newNICRegex.test(nic);
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[0-9]{9,10}$/;
    return phoneRegex.test(phone);
  };

  // In Register.js
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateNIC(userData.nicNumber)) {
      setError('Invalid NIC number. Please enter a valid NIC.');
      return;
    }
    if (!validatePhoneNumber(userData.contactNo)) {
      setError('Invalid phone number. Please enter 9 or 10 digits.');
      return;
    }

    try {
      console.log('Sending registration data:', userData);
      const response = await register(userData);
      console.log('Registration response:', response);

      if (response.data && response.data.token) {
        console.log('Token received:', response.data.token);
        localStorage.setItem('token', response.data.token);
        setIsAuthenticated(true);
        console.log('Is authenticated set to true');
        navigate('/dashboard');
      } else {
        console.log('No token in response:', response.data);
        setError('Registration successful, but unable to log in automatically. Please try logging in.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
      <div className="logo-container">
          <img src={dualLogo} alt="Polycrome Dual Logo" className="logo dual-logo" />
        </div>
        <h2 className="register-title">Register</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-section">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input type="text" id="firstName" name="firstName" value={userData.firstName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input type="text" id="lastName" name="lastName" value={userData.lastName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input type="text" id="city" name="city" value={userData.city} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="nicNumber">National Identity Card Number</label>
              <input type="text" id="nicNumber" name="nicNumber" value={userData.nicNumber} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="contactNo">Contact No</label>
              <input type="tel" id="contactNo" name="contactNo" value={userData.contactNo} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" value={userData.password} onChange={handleChange} required />
            </div>
          </div>
          <button type="submit" className="submit-btn">Register</button>
        </form>
        <p className="login-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;