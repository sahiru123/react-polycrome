import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { scanQR } from '../services/api';

const ProductDisplay = () => {
  const [product, setProduct] = useState(null);
  const { serialNumber } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await scanQR(serialNumber);
        setProduct(response.data);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      }
    };
    fetchProduct();
  }, [serialNumber]);

  if (!product) return <div>Loading...</div>;

  return (
    <div>
      <h2>Product Details</h2>
      <p>Serial Number: {product.serialNumber}</p>
      <p>Points Awarded: {product.pointsAwarded}</p>
      <p>Total Points: {product.totalPoints}</p>
    </div>
  );
};

export default ProductDisplay;