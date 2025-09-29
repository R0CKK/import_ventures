import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';
import './SellerDashboard.css';

const SellerDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch seller stats
        const productsResponse = await axios.get('/products/mine');
        const ordersResponse = await axios.get('/orders/mysellerorders');
        
        // Calculate stats
        const totalProducts = productsResponse.data.data.count || 0;
        const totalOrders = ordersResponse.data.data.length || 0;
        const pendingOrders = ordersResponse.data.data.filter(order => order.status === 'pending').length;
        const totalRevenue = ordersResponse.data.data.reduce((sum, order) => sum + order.totalPrice, 0);
        
        setStats({
          totalProducts,
          totalOrders,
          totalRevenue,
          pendingOrders
        });
        
        // Get recent orders (last 5)
        setRecentOrders(ordersResponse.data.data.slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="text-center mt-6">Loading dashboard...</div>;

  return (
    <div className="seller-dashboard">
      <div className="container">
        <h1 className="section-title text-center mb-6">Seller Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="stat-card bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center">
              <div className="stat-icon bg-primary-500 bg-opacity-10 p-3 rounded-full mr-4">
                <i data-lucide="package" className="text-primary text-xl"></i>
              </div>
              <div>
                <p className="text-muted text-sm">Total Products</p>
                <p className="text-2xl font-bold">{stats.totalProducts}</p>
              </div>
            </div>
          </div>
          
          <div className="stat-card bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center">
              <div className="stat-icon bg-secondary-500 bg-opacity-10 p-3 rounded-full mr-4">
                <i data-lucide="shopping-cart" className="text-secondary text-xl"></i>
              </div>
              <div>
                <p className="text-muted text-sm">Total Orders</p>
                <p className="text-2xl font-bold">{stats.totalOrders}</p>
              </div>
            </div>
          </div>
          
          <div className="stat-card bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center">
              <div className="stat-icon bg-green-500 bg-opacity-10 p-3 rounded-full mr-4">
                <i data-lucide="trending-up" className="text-green-500 text-xl"></i>
              </div>
              <div>
                <p className="text-muted text-sm">Total Revenue</p>
                <p className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="stat-card bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center">
              <div className="stat-icon bg-yellow-500 bg-opacity-10 p-3 rounded-full mr-4">
                <i data-lucide="clock" className="text-yellow-500 text-xl"></i>
              </div>
              <div>
                <p className="text-muted text-sm">Pending Orders</p>
                <p className="text-2xl font-bold">{stats.pendingOrders}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-card p-6 rounded-lg border border-border">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link to="/seller/products" className="d-flex justify-between items-center p-3 border border-border rounded hover:bg-muted transition">
                  <span>View Products</span>
                  <i data-lucide="arrow-right"></i>
                </Link>
                
                <Link to="/seller/products/add" className="d-flex justify-between items-center p-3 border border-border rounded hover:bg-muted transition">
                  <span>Add New Product</span>
                  <i data-lucide="arrow-right"></i>
                </Link>
                
                <Link to="/seller/orders" className="d-flex justify-between items-center p-3 border border-border rounded hover:bg-muted transition">
                  <span>Manage Orders</span>
                  <i data-lucide="arrow-right"></i>
                </Link>
                
                <Link to="/profile" className="d-flex justify-between items-center p-3 border border-border rounded hover:bg-muted transition">
                  <span>Update Profile</span>
                  <i data-lucide="arrow-right"></i>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="d-flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Recent Orders</h2>
                <Link to="/seller/orders" className="text-secondary hover:underline">View All</Link>
              </div>
              
              {recentOrders.length === 0 ? (
                <div className="text-center py-6 text-muted">
                  No recent orders
                </div>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map(order => (
                    <div key={order._id} className="flex justify-between items-center py-3 border-b border-border last:border-b-0">
                      <div>
                        <div className="font-medium">Order #{order._id.substring(0, 8).toUpperCase()}</div>
                        <div className="text-sm text-muted">
                          {new Date(order.createdAt).toLocaleDateString()} • {order.orderItems.length} items
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">₹{order.totalPrice.toLocaleString()}</div>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                          order.status === 'delivered' ? 'bg-green-500 text-white' :
                          order.status === 'shipped' ? 'bg-blue-500 text-white' :
                          order.status === 'processing' ? 'bg-yellow-500 text-white' :
                          'bg-gray-500 text-white'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;