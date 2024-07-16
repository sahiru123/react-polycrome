import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import jsQR from 'jsqr';
import './QRScanner.css';

const QRScanner = () => {
  const [scanning, setScanning] = useState(true);
  const [result, setResult] = useState('');
  const webcamRef = useRef(null);
  const navigate = useNavigate();

  const handleScan = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, image.width, image.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
          setResult(code.data);
          setScanning(false);
          handleUrl(code.data);
        }
      };
    }
  }, []);

  const handleUrl = (url) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      window.location.href = url;
    } else {
      navigate(`/product/${url}`);
    }
  };

  React.useEffect(() => {
    if (scanning) {
      const interval = setInterval(() => {
        handleScan();
      }, 500);
      return () => clearInterval(interval);
    }
  }, [scanning, handleScan]);

  return (
    <div className="qr-scanner-container">
      <div className="scanner-header">
        <h1>Scan QR Code</h1>
        <p>Position the QR code within the frame to scan</p>
      </div>
      <div className="scanner-body">
        <div className={`scanner-overlay ${!scanning ? 'detected' : ''}`}>
          <div className="scan-region-highlight"><span></span></div>
          <div className="scanner-animation"></div>
        </div>
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            facingMode: 'environment'
          }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      </div>
      <div className="scanner-footer">
        {scanning ? (
          <p className="scanning-status">Scanning...</p>
        ) : (
          <p className="scanning-result">QR Code detected: {result}</p>
        )}
      </div>
    </div>
  );
};

export default QRScanner;