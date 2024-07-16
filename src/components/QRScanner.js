import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scanner } from '@yudiel/react-qr-scanner';
import './QRScanner.css';

const QRScanner = () => {
  const [result, setResult] = useState('');
  const [scanning, setScanning] = useState(true);
  const [detected, setDetected] = useState(false);
  const navigate = useNavigate();
  const scannerRef = useRef(null);

  useEffect(() => {
    if (result) {
      handleUrl(result);
    }
  }, [result]);

  const handleDecode = (result) => {
    if (result) {
      console.log("QR Code detected:", result);
      setResult(result);
      setScanning(false);
      setDetected(true);
    }
  };

  const handleUrl = (url) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      window.location.href = url;
    } else {
      navigate(`/product/${url}`);
    }
  };

  return (
    <div className="qr-scanner-container">
      <div className="scanner-header">
        <h1>Scan QR Code</h1>
        <p>Position the QR code within the frame to scan</p>
      </div>
      <div className="scanner-body" ref={scannerRef}>
        <div className={`scanner-overlay ${detected ? 'detected' : ''}`}>
          <div className="scan-region-highlight"></div>
          <div className="scanner-animation"></div>
        </div>
        <Scanner
          onResult={(result) => {
            if (result) {
              handleDecode(result.text);
            }
          }}
          onError={(error) => console.error(error)}
          constraints={{ facingMode: 'environment' }}
          scanDelay={300}
          style={{ width: '100%', height: '100%' }}
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