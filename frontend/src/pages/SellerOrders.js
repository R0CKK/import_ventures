import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';
import './SellerOrders.css';

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/orders/mysellerorders');
        setOrders(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const updateOrderStatus = async (orderId, status) => {
    try {
      if (status === 'delivered') {
        await axios.put(`/orders/${orderId}/deliver`);
      }
      // For other status updates, we'd need specific endpoints
      // For now, just refetch orders
      const response = await axios.get('/orders/mysellerorders');
      setOrders(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update order status');
    }
  };

  if (loading) return <div className="text-center mt-6">Loading orders...</div>;
  if (error) return <div className="text-center mt-6 text-red-500">Error: {error}</div>;

  return (
    <div className="seller-orders">
      <div className="container">
        <div className="d-flex justify-between items-center mb-6">
          <h1 className="section-title">My Orders</h1>
          <div>
            <select 
              className="form-input" 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        
        {filteredOrders.length === 0 ? (
          <div className="text-center py-10">
            <i data-lucide="shopping-cart" className="text-4xl text-muted mx-auto"></i>
            <h3 className="text-xl mt-4">No orders found</h3>
            <p className="text-muted mt-2">You don't have any orders yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map(order => (
              <div key={order._id} className="bg-card p-6 rounded-lg border border-border">
                <div className="d-flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Order #{order._id.substring(0, 8).toUpperCase()}</h3>
                    <div className="text-sm text-muted">
                      {new Date(order.createdAt).toLocaleDateString()} • 
                      {order.orderItems.length} item{order.orderItems.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">₹{order.totalPrice.toLocaleString()}</div>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 ${
                      order.status === 'delivered' ? 'bg-green-500 text-white' :
                      order.status === 'shipped' ? 'bg-blue-500 text-white' :
                      order.status === 'processing' ? 'bg-yellow-500 text-white' :
                      order.status === 'cancelled' ? 'bg-red-500 text-white' :
                      'bg-gray-500 text-white'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                  <div>
                    <h4 className="font-semibold mb-2">Buyer</h4>
                    <div>{order.user.name}</div>
                    <div className="text-sm text-muted">{order.user.email}</div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Shipping Address</h4>
                    <div>{order.shippingAddress.fullName}</div>
                    <div className="text-sm">{order.shippingAddress.address}</div>
                    <div className="text-sm">{order.shippingAddress.city} - {order.shippingAddress.postalCode}</div>
                    <div className="text-sm text-muted">Port: {order.shippingAddress.port}</div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Payment</h4>
                    <div className="capitalize">{order.paymentMethod.replace('_', ' ')}</div>
                    <div className={`text-sm ${order.isPaid ? 'text-green-500' : 'text-red-500'}`}>
                      {order.isPaid ? 'Paid' : 'Pending'}
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Order Items</h4>
                  <div className="space-y-2">
                    {order.orderItems.map((item, index) => (
                      <div key={index} className="d-flex justify-between">
                        <div>{item.name}</div>
                        <div>Qty: {item.quantity} × ₹{item.price.toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="d-flex justify-between items-center">
                  <Link to={`/order/${order._id}`} className="btn btn-outline">
                    View Details
                  </Link>
                  
                  <div className="d-flex space-x-2">
                    {order.status === 'pending' && (
                      <button 
                        className="btn btn-primary"
                        onClick={() => updateOrderStatus(order._id, 'processing')}
                      >
                        Mark as Processing
                      </button>
                    )}
                    
                    {order.status === 'processing' && (
                      <button 
                        className="btn btn-primary"
                        onClick={() => updateOrderStatus(order._id, 'shipped')}
                      >
                        Mark as Shipped
                      </button>
                    )}
                    
                    {order.status === 'shipped' && !order.isDelivered && (
                      <button 
                        className="btn btn-primary"
                        onClick={() => updateOrderStatus(order._id, 'delivered')}
                      >
                        Mark as Delivered
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerOrders;