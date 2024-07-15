import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts, addProduct, deleteProduct, getUsers, getDashboard } from '../services/api';
import './AdminDashboard.css';

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
          fetchUsers();
          fetchProducts();
        }
      } catch (error) {
        console.error('Error fetching dashboard:', error);
        setError('Failed to verify admin status');
        navigate('/dashboard');
      }
    };
    checkAdminStatus();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.data);
    } catch (error) {
      setError('Failed to fetch users');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data);
    } catch (error) {
      setError('Failed to fetch products');
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

  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      
      <h2>Users</h2>
      <div className="table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>NIC Number</th>
              <th>City</th>
              <th>Contact No</th>
              <th>Total Points</th>
              <th>Admin</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.first_name}</td>
                <td>{user.last_name}</td>
                <td>{user.nic_number}</td>
                <td>{user.city}</td>
                <td>{user.contact_no}</td>
                <td>{user.total_points}</td>
                <td>{user.is_admin ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Products</h2>
      <form onSubmit={handleAddProduct} className="product-form">
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
      <div className="table-container">
        <table className="product-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Serial Number</th>
              <th>Points</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.serial_number}</td>
                <td>{product.points}</td>
                <td>
                  <button onClick={() => handleDeleteProduct(product.id)} className="delete-btn">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;