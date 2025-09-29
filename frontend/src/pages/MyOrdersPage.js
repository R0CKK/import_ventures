import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';
import './MyOrdersPage.css';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/orders/myorders');
        setOrders(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-500';
      case 'shipped':
        return 'bg-blue-500';
      case 'processing':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) return <div className="text-center mt-6">Loading your orders...</div>;
  if (error) return <div className="text-center mt-6 text-red-500">Error: {error}</div>;

  return (
    <div className="my-orders-page">
      <div className="container">
        <h1 className="section-title text-center mb-6">My Order History</h1>
        
        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-illustration">
              <i data-lucide="package"></i>
            </div>
            <h3>No Orders Yet</h3>
            <p>Start shopping to see your order history here.</p>
            <Link to="/products" className="btn btn-primary">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="orders-grid">
            {orders.map(order => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-id">Order # {order._id?.substring(0, 8).toUpperCase()}</div>
                  <span className={`order-status ${getStatusColor(order.status)} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                
                <div className="order-details">
                  <div className="order-date">
                    <strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                  
                  <div className="order-items">
                    <strong>Items:</strong> {order.orderItems?.length} item(s)
                  </div>
                  
                  <div className="order-total">
                    <strong>Total:</strong> ₹{order.totalPrice?.toLocaleString()}
                  </div>
                </div>
                
                <div className="order-status-info">
                  <div className="status-item">
                    <span className="status-label">Payment:</span>
                    <span className={order.isPaid ? 'status-paid' : 'status-pending'}>
                      {order.isPaid ? 'Paid' : 'Pending'}
                    </span>
                  </div>
                  
                  <div className="status-item">
                    <span className="status-label">Delivery:</span>
                    <span className={order.isDelivered ? 'status-delivered' : 'status-pending'}>
                      {order.isDelivered ? 'Delivered' : 'Not Delivered'}
                    </span>
                  </div>
                </div>
                
                <div className="order-actions">
                  <Link to={`/order/${order._id}`} className="btn btn-outline btn-sm">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;