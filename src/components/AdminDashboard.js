import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts, addProduct, deleteProduct, getUsers, getDashboard } from '../services/api';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [newProduct, setNewProduct] = useState({ serialNumber: '', points: 0 });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await getDashboard();
        if (!response.data.isAdmin) {
          navigate('/dashboard');
        } else {
          fetchProducts();
          fetchUsers();
        }
      } catch (error) {
        console.error('Error fetching dashboard:', error);
        setError('Failed to verify admin status');
        navigate('/dashboard');
      }
    };
    checkAdminStatus();
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data);
    } catch (error) {
      setError('Failed to fetch products');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.data);
    } catch (error) {
      setError('Failed to fetch users');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await addProduct(newProduct);
      setNewProduct({ serialNumber: '', points: 0 });
      fetchProducts();
    } catch (error) {
      setError('Failed to add product');
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (error) {
      setError('Failed to delete product');
    }
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Admin Dashboard</h1>
      
      <h2>Products</h2>
      <form onSubmit={handleAddProduct}>
        <input
          type="text"
          value={newProduct.serialNumber}
          onChange={(e) => setNewProduct({...newProduct, serialNumber: e.target.value})}
          placeholder="Serial Number"
          required
        />
        <input
          type="number"
          value={newProduct.points}
          onChange={(e) => setNewProduct({...newProduct, points: parseInt(e.target.value)})}
          placeholder="Points"
          required
        />
        <button type="submit">Add Product</button>
      </form>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.serial_number} - Points: {product.points}
            <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <h2>Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.full_name} - NIC: {user.nic_number} - Points: {user.total_points} - Admin: {user.is_admin ? 'Yes' : 'No'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;