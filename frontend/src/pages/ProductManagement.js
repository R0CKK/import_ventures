import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';

const ProductManagement = () => {
  const { products: productsState, getAllProducts, updateProductVerification, deleteProduct, loading } = useAdmin();
  const products = productsState.data;
  const productsError = productsState.error;
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filters, setFilters] = useState({});
  const { user: currentUser } = useAuth();

  useEffect(() => {
    if (currentUser && currentUser.role === 'admin') {
      getAllProducts(page, limit, filters);
    }
  }, [page, limit, filters, getAllProducts, currentUser]);

  const handleVerifyProduct = async (productId) => {
    const result = await updateProductVerification(productId, true);
    if (result.success) {
      // Successfully verified
      getAllProducts(page, limit, filters); // Refresh the list
    } else {
      alert(result.message || 'Error verifying product');
    }
  };

  const handleUnverifyProduct = async (productId) => {
    const result = await updateProductVerification(productId, false);
    if (result.success) {
      // Successfully unverified
      getAllProducts(page, limit, filters); // Refresh the list
    } else {
      alert(result.message || 'Error unverifying product');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      const result = await deleteProduct(productId);
      if (result.success) {
        // Successfully deleted
        getAllProducts(page, limit, filters); // Refresh the list
      } else {
        alert(result.message || 'Error deleting product');
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

  if (loading) return <div className="loading">Loading products...</div>;
  
  if (productsError) {
    return <div className="error">Error: {productsError}</div>;
  }

  return (
    <div className="product-management">
      <h1>Product Management</h1>
      
      <div className="filters">
        <div className="filter-group">
          <label htmlFor="category">Category:</label>
          <select 
            name="category" 
            id="category"
            value={filters.category || ''}
            onChange={handleFilterChange}
          >
            <option value="">All Categories</option>
            <option value="port-services">Port Services</option>
            <option value="customs-clearance">Customs Clearance</option>
            <option value="container-handling">Container Handling</option>
            <option value="freight-forwarding">Freight Forwarding</option>
            <option value="warehousing">Warehousing</option>
            <option value="logistics">Logistics</option>
            <option value="documentation">Documentation</option>
            <option value="insurance">Insurance</option>
            <option value="other">Other</option>
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
          <label htmlFor="status">Status:</label>
          <select 
            name="status" 
            id="status"
            value={filters.status || ''}
            onChange={handleFilterChange}
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="keyword">Search:</label>
          <input 
            type="text" 
            name="keyword"
            id="keyword"
            placeholder="Name or description"
            value={filters.keyword || ''}
            onChange={handleFilterChange}
          />
        </div>
        
        <Button variant="secondary" onClick={resetFilters}>Reset Filters</Button>
      </div>
      
      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Category</th>
              <th>Seller</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Verification</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(products?.products || []).map(product => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.seller?.name || 'Unknown'}</td>
                <td>₹{product.price.toFixed(2)}</td>
                <td>{product.stock}</td>
                <td>
                  <span className={`status ${product.isVerified ? 'verified' : 'unverified'}`}>
                    {product.isVerified ? 'Verified' : 'Unverified'}
                  </span>
                </td>
                <td>
                  <span className={`status ${product.isActive ? 'active' : 'inactive'}`}>
                    {product.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>{new Date(product.createdAt).toLocaleDateString()}</td>
                <td className="actions">
                  {product.isVerified ? (
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      onClick={() => handleUnverifyProduct(product._id)}
                    >
                      Unverify
                    </Button>
                  ) : (
                    <Button 
                      variant="success" 
                      size="sm" 
                      onClick={() => handleVerifyProduct(product._id)}
                    >
                      Verify
                    </Button>
                  )}
                  <Button 
                    variant="danger" 
                    size="sm" 
                    onClick={() => handleDeleteProduct(product._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {products?.pagination && (
        <div className="pagination">
          <p>Page {products.pagination.page} of {products.pagination.pages}</p>
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
              onClick={() => setPage(prev => Math.min(products.pagination.pages, prev + 1))}
              disabled={page >= products.pagination.pages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;