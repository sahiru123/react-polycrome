import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrReader } from 'react-qr-reader';
import { scanQR } from '../services/api';

const QRScanner = () => {
  const [result, setResult] = useState('');
  const navigate = useNavigate();

  const handleScan = async (data) => {
    if (data) {
      setResult(data);
      try {
        await scanQR(data);
        if (data.startsWith('http://') || data.startsWith('https://')) {
          window.open(data, '_blank'); // Open the URL in a new tab
        } else {
          navigate(`/product/${data}`);
        }
      } catch (error) {
        console.error('Failed to scan QR:', error);
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  return (
    <div>
      <QrReader
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: '100%' }}
      />
      <p>{result}</p>
    </div>
  );
};

export default QRScanner;