import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/admin.css';

const AdminLayout = ({ children }) => {
  const { logout, user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Wait for auth to finish loading before deciding navigation
  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      navigate('/admin/login', { replace: true });
    }
  }, [loading, user, navigate]);

  if (loading || !user || user.role !== 'admin') {
    return <div className="admin-loading container">Loading admin...</div>;
  }

  return (
    <div className="admin-layout">
      <nav className="admin-nav">
        <div className="admin-nav-brand">
          <h2>Admin Panel</h2>
        </div>
        <ul className="admin-nav-menu">
          <li>
            <Link 
              to="/admin/dashboard" 
              className={location.pathname === '/admin/dashboard' ? 'active' : ''}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/users" 
              className={location.pathname === '/admin/users' ? 'active' : ''}
            >
              User Management
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/products" 
              className={location.pathname === '/admin/products' ? 'active' : ''}
            >
              Product Management
            </Link>
          </li>
          <li>
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </li>
        </ul>
      </nav>
      
      <main className="admin-content container">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;