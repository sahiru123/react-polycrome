import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const RootHandler = ({ isAuthenticated }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const serialNumber = searchParams.get('serialnumber');

  useEffect(() => {
    if (isAuthenticated) {
      if (serialNumber) {
        navigate(`/dashboard?serialnumber=${serialNumber}`);
      } else {
        navigate('/dashboard');
      }
    } else {
      if (serialNumber) {
        sessionStorage.setItem('pendingSerialNumber', serialNumber);
      }
      navigate('/login');
    }
  }, [serialNumber, isAuthenticated, navigate]);

  return <div>Redirecting...</div>;
};

export default RootHandler;