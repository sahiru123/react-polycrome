import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestPayout } from '../services/api';

const PayoutRequest = () => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handlePayout = async () => {
    try {
      await requestPayout();
      setMessage('Payout request submitted successfully!');
      setTimeout(() => navigate('/dashboard'), 3000);
    } catch (error) {
      console.error('Failed to request payout:', error);
      setMessage('Failed to submit payout request. Please try again.');
    }
  };

  return (
    <div>
      <h2>Request Payout</h2>
      <button onClick={handlePayout}>Confirm Payout Request</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default PayoutRequest;