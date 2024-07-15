import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jsQR from 'jsqr';
import './QRScanner.css';

const QRScanner = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [scanning, setScanning] = useState(true);
  const [result, setResult] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let stream = null;

    const startScanner = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Use the 'loadedmetadata' event to ensure the video is ready
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play().catch(error => console.error("Error playing video:", error));
            requestAnimationFrame(tick);
          };
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
      }
    };

    startScanner();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (result) {
      handleUrl(result);
    }
  }, [result]);

  const tick = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        
        if (code) {
          setResult(code.data);
          setScanning(false);
        } else if (scanning) {
          requestAnimationFrame(tick);
        }
      } else if (scanning) {
        requestAnimationFrame(tick);
      }
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
      <div className="scanner-body">
        <div className="scanner-overlay">
          <div className="scan-region-highlight"></div>
          <div className="scanner-animation"></div>
        </div>
        <video ref={videoRef} className="qr-video" playsInline />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
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