import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrReader } from 'react-qr-reader';
import './QRScanner.css'; // Make sure to create this CSS file

const QRScanner = () => {
  const [result, setResult] = useState('');
  const [scanning, setScanning] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (result) {
      handleUrl(result);
    }
  }, [result]);

  const handleScan = (data) => {
    if (data) {
      setResult(data);
      setScanning(false);
    }
  };

  const handleUrl = (url) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      window.location.href = url;
    } else {
      navigate(`/product/${url}`);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  return (
    <div className="qr-scanner-container">
      <div className="scanner-header">
        <h1>Scan QR Code</h1>
        <p>Position the QR code within the frame to scan</p>
      </div>
      <div className="scanner-body">
        <div className="scanner-overlay">
          <div className="scan-region-highlight"></div>
          <div className="scanner-animation"></div>
        </div>
        <QrReader
          constraints={{ facingMode: 'environment' }}
          delay={300}
          onError={handleError}
          onResult={(result, error) => {
            if (result) {
              handleScan(result?.text);
            }
            if (error) {
              handleError(error);
            }
          }}
          className="qr-reader"
        />
      </div>
      <div className="scanner-footer">
        {scanning ? (
          <p className="scanning-status">Scanning...</p>
        ) : (
          <p className="scanning-result">QR Code detected!</p>
        )}
      </div>
    </div>
  );
};

export default QRScanner;