import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestPayout } from '../services/api';
import './PayoutRequest.css';

const PayoutRequest = () => {
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handlePayout = async () => {
    try {
      await requestPayout();
      setIsSuccess(true);
      setMessage('Payout request submitted successfully!');
      setTimeout(() => navigate('/dashboard'), 3000);
    } catch (error) {
      console.error('Failed to request payout:', error);
      setIsSuccess(false);
      setMessage('Failed to submit payout request. Please try again.');
    }
  };

  return (
    <div className="payout-request-container">
      <h2 className="payout-request-title">Request Payout</h2>
      <button className="payout-request-button" onClick={handlePayout}>
        Confirm Payout Request
      </button>
      {message && (
        <p className={`payout-request-message ${isSuccess ? 'payout-request-success' : 'payout-request-error'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default PayoutRequest;