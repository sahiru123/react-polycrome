import React from 'react';
import { useNavigate } from 'react-router-dom';
import polycromeLogo from '../assets/Polycrome_Logo_202x80@72x.png';
import secondLogo from '../assets/polycrome second logo.jpg';
import './LandingPage.css';


const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <header>
        <img src={polycromeLogo} alt="Polycrome Logo" className="logo" />
        <img src={secondLogo} alt="Polycrome Second Logo" className="logo" />
      </header>
      <main>
        <h1>Polycrome Electrician Loyalty Management System</h1>
        <div className="button-container">
          <button onClick={() => navigate('/login')}>Sign In</button>
          <button onClick={() => navigate('/register')}>Register</button>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;