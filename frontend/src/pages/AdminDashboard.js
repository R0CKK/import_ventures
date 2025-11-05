import React, { useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { dashboardStats, getDashboardStats, loading, error } = useAdmin();
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.role === 'admin') {
      getDashboardStats();
    }
  }, [user, getDashboardStats]);

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      
      {dashboardStats ? (
        <div className="dashboard-stats">
          <div className="stats-grid">
            <Card>
              <CardHeader>
                <CardTitle>Users</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Total: {dashboardStats.users.total}</p>
                <p>Buyers: {dashboardStats.users.buyers}</p>
                <p>Sellers: {dashboardStats.users.sellers}</p>
                <p>Admins: {dashboardStats.users.admins}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Seller Verification</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Verified: {dashboardStats.users.verifiedSellers}</p>
                <p>Unverified: {dashboardStats.users.unverifiedSellers}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Products</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Total: {dashboardStats.products.total}</p>
                <p>Verified: {dashboardStats.products.verified}</p>
                <p>Unverified: {dashboardStats.products.unverified}</p>
                <p>Active: {dashboardStats.products.active}</p>
                <p>Inactive: {dashboardStats.products.inactive}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Total Orders: {dashboardStats.orders.total}</p>
                <p>Total Revenue: ₹{dashboardStats.orders.totalRevenue.toFixed(2)}</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="recent-activities">
            <h2>Recent User Registrations</h2>
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Verification Status</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardStats.recentUsers.map(user => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>
                        {user.role === 'seller' ? (
                          <span className={`status ${user.verification?.isVerified ? 'verified' : 'unverified'}`}>
                            {user.verification?.isVerified ? 'Verified' : 'Unverified'}
                          </span>
                        ) : 'N/A'}
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <Card>
          <CardContent>
            <p className="text-muted">No data yet. Add users, products, or orders to see stats.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminDashboard;