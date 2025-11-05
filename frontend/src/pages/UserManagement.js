import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';

const UserManagement = () => {
  const { users: usersState, getAllUsers, updateUserVerification, deleteUser, loading } = useAdmin();
  const users = usersState.data;
  const usersError = usersState.error;
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filters, setFilters] = useState({});
  const { user: currentUser } = useAuth();

  useEffect(() => {
    if (currentUser && currentUser.role === 'admin') {
      getAllUsers(page, limit, filters);
    }
  }, [page, limit, filters, getAllUsers, currentUser]);

  const handleVerifySeller = async (userId) => {
    const result = await updateUserVerification(userId, true);
    if (result.success) {
      // Successfully verified
      getAllUsers(page, limit, filters); // Refresh the list
    } else {
      alert(result.message || 'Error verifying user');
    }
  };

  const handleUnverifySeller = async (userId) => {
    const result = await updateUserVerification(userId, false);
    if (result.success) {
      // Successfully unverified
      getAllUsers(page, limit, filters); // Refresh the list
    } else {
      alert(result.message || 'Error unverifying user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      const result = await deleteUser(userId);
      if (result.success) {
        // Successfully deleted
        getAllUsers(page, limit, filters); // Refresh the list
      } else {
        alert(result.message || 'Error deleting user');
      }
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetFilters = () => {
    setFilters({});
    setPage(1);
  };

  if (loading) return <div className="loading">Loading users...</div>;
  
  if (usersError) {
    return <div className="error">Error: {usersError}</div>;
  }

  return (
    <div className="user-management">
      <h1>User Management</h1>
      
      <div className="filters">
        <div className="filter-group">
          <label htmlFor="role">Role:</label>
          <select 
            name="role" 
            id="role"
            value={filters.role || ''}
            onChange={handleFilterChange}
          >
            <option value="">All Roles</option>
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="verificationStatus">Verification:</label>
          <select 
            name="verificationStatus" 
            id="verificationStatus"
            value={filters.verificationStatus || ''}
            onChange={handleFilterChange}
          >
            <option value="">All Statuses</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="search">Search:</label>
          <input 
            type="text" 
            name="search"
            id="search"
            placeholder="Name or email"
            value={filters.search || ''}
            onChange={handleFilterChange}
          />
        </div>
        
        <Button variant="secondary" onClick={resetFilters}>Reset Filters</Button>
      </div>
      
      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Verification</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(users?.users || []).map(user => (
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
                <td>
                  <span className={`status ${user.isActive ? 'active' : 'inactive'}`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="actions">
                  {user.role === 'seller' && (
                    <>
                      {user.verification?.isVerified ? (
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          onClick={() => handleUnverifySeller(user._id)}
                          disabled={user._id === currentUser?._id} // Don't allow admin to unverify themselves
                        >
                          Unverify
                        </Button>
                      ) : (
                        <Button 
                          variant="success" 
                          size="sm" 
                          onClick={() => handleVerifySeller(user._id)}
                        >
                          Verify
                        </Button>
                      )}
                    </>
                  )}
                  <Button 
                    variant="danger" 
                    size="sm" 
                    onClick={() => handleDeleteUser(user._id)}
                    disabled={user._id === currentUser?._id} // Don't allow admin to delete themselves
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {users?.pagination && (
        <div className="pagination">
          <p>Page {users.pagination.page} of {users.pagination.pages}</p>
          <div className="pagination-buttons">
            <Button 
              variant="outline" 
              onClick={() => setPage(prev => Math.max(1, prev - 1))}
              disabled={page <= 1}
            >
              Previous
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setPage(prev => Math.min(users.pagination.pages, prev + 1))}
              disabled={page >= users.pagination.pages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;