import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { getDashboard, logout, processItemCode } from '../services/api';
import './Dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins } from '@fortawesome/free-solid-svg-icons';
import polycromeLogo from '../assets/Polycrome_Logo_202x80@72x.png';
import secondLogo from '../assets/polycrome second logo.jpg';

const Dashboard = ({ setIsAuthenticated }) => {
  const [userData, setUserData] = useState(null);
  const [statusMessage, setStatusMessage] = useState({ type: null, text: '' });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const serialNumber = searchParams.get('serialnumber');
  const processedRef = useRef(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await getDashboard();
        setUserData(response.data);

        if (serialNumber && !processedRef.current) {
          processedRef.current = true;
          await handleItemCode(serialNumber);
        }
      } catch (error) {
        setStatusMessage({
          type: 'error',
          text: error.response?.data?.message || 'Failed to fetch dashboard data'
        });
        if (error.response?.status === 401) {
          setIsAuthenticated(false);
          navigate('/');
        }
      }
    };
    fetchDashboard();
  }, [navigate, setIsAuthenticated, serialNumber]);

  const handleItemCode = async (code) => {
    try {
      const response = await processItemCode(code);
      setStatusMessage({ type: 'success', text: response.data.message });
      const updatedDashboard = await getDashboard();
      setUserData(updatedDashboard.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setStatusMessage({ type: 'error', text: 'Invalid serial number. Please try again.' });
      } else if (error.response && error.response.status === 400) {
        setStatusMessage({ type: 'error', text: 'This product has already been scanned.' });
      } else {
        setStatusMessage({
          type: 'error',
          text: error.response?.data?.message || 'Failed to process item code'
        });
      }
    } finally {
      navigate('/dashboard', { replace: true });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsAuthenticated(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const clearStatusMessage = () => {
    setStatusMessage({ type: null, text: '' });
  };

  if (!userData) return <div className="dashboard-container"><div className="dashboard-card">Loading...</div></div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <div className="dashboard-header">
          <div className="logo-container">
            <img src={polycromeLogo} alt="Polycrome Logo" className="main-logo" />
            <img src={secondLogo} alt="Polycrome Second Logo" className="second-logo" />
          </div>
          <h1 className="dashboard-title">Dashboard</h1>
          <div className="user-info">
            <p>Welcome, {userData.fullName}</p>
            <p>NIC: {userData.nicNumber}</p>
          </div>
        </div>

        {statusMessage.text && (
          <div className={`status-message ${statusMessage.type}`}>
            {statusMessage.text}
            <button onClick={clearStatusMessage} className="close-button">&times;</button>
          </div>
        )}

        <p className="qr-instructions">To receive loyalty points, simply use your mobile's QR Scan Feature in Camera to scan the Product QRs.</p>

        <div className="loyalty-points-card">
          <div className="loyalty-points-icon">
            <FontAwesomeIcon icon={faCoins} />
          </div>
          <div className="loyalty-points-content">
            <h2>Total Loyalty Points</h2>
            <p className="total-points">{userData.totalPoints}</p>
          </div>
        </div>

        <div className="action-buttons">
          <Link to="/scan" className="action-button">Scan QR Code</Link>
          {userData.totalPoints >= 1000 && <Link to="/payout" className="action-button">Request Payout</Link>}
          {userData.isAdmin && <Link to="/admin" className="action-button">Admin Dashboard</Link>}
          <button onClick={handleLogout} className="action-button logout-button">Logout</button>
        </div>


        <div className="scanned-products">
          <h2>Scanned Products</h2>
          {userData.scannedProducts && userData.scannedProducts.length > 0 ? (
            <div className="table-container">
              <table className="product-table">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Product Code</th>
                    <th>Serial Number</th>
                    <th>Points</th>
                    <th>Scanned At</th>
                  </tr>
                </thead>
                <tbody>
                  {userData.scannedProducts.map((product, index) => (
                    <tr key={index}>
                      <td data-label="Product Name">{product.product_name}</td>
                      <td data-label="Item Code">{product.item_code}</td>
                      <td data-label="Serial Number">{product.serial_number}</td>
                      <td data-label="Points">{product.points}</td>
                      <td data-label="Scanned At">{new Date(product.scanned_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-products">No scanned products yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;