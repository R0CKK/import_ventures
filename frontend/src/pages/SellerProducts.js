import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';
import './SellerProducts.css';

const SellerProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/products/mine');
        setProducts(response.data.data.products);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const deleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/products/${id}`);
        setProducts(products.filter(product => product._id !== id));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete product');
      }
    }
  };

  if (loading) return <div className="text-center mt-6">Loading products...</div>;
  if (error) return <div className="text-center mt-6 text-red-500">Error: {error}</div>;

  return (
    <div className="seller-products">
      <div className="container">
        <div className="d-flex justify-between items-center mb-6">
          <h1 className="section-title">My Products</h1>
          <Link to="/seller/products/add" className="btn btn-primary">
            Add New Product
          </Link>
        </div>
        
        {products.length === 0 ? (
          <div className="text-center py-10">
            <i data-lucide="package" className="text-4xl text-muted mx-auto"></i>
            <h3 className="text-xl mt-4">No products yet</h3>
            <p className="text-muted mt-2">Start by adding your first product to the marketplace</p>
            <Link to="/seller/products/add" className="btn btn-primary mt-4">
              Add Product
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <div key={product._id} className="product-card">
                <div className="product-card-content">
                  <h3 className="product-card-title">{product.name}</h3>
                  <p className="product-card-description">
                    {product.description.length > 80 
                      ? `${product.description.substring(0, 80)}...` 
                      : product.description}
                  </p>
                  
                  <div className="product-meta mb-3">
                    <div className="product-category text-secondary text-sm mb-1">
                      {product.category.replace('-', ' ').toUpperCase()}
                    </div>
                    
                    <div className="product-location text-muted text-sm mb-1">
                      <i data-lucide="map-pin" className="mr-1"></i>
                      {product.location?.port || 'India'}
                    </div>
                    
                    <div className="product-ratings flex items-center text-sm">
                      <i data-lucide="star" className="text-yellow-400 mr-1"></i>
                      <span>{product.ratings?.average || 'N/A'} ({product.ratings?.count || 0} reviews)</span>
                    </div>
                  </div>
                  
                  <div className="product-card-price">₹{product.price.toLocaleString()}</div>
                  
                  <div className="product-stats mb-3 text-sm text-muted">
                    <div>Stock: {product.stock}</div>
                    <div>Status: {product.isActive ? 'Active' : 'Inactive'}</div>
                    <div>Verified: {product.isVerified ? 'Yes' : 'No'}</div>
                  </div>
                  
                  <div className="product-card-footer">
                    <Link to={`/product/${product._id}`} className="btn btn-outline btn-sm">
                      View
                    </Link>
                    <Link to={`/seller/products/edit/${product._id}`} className="btn btn-primary btn-sm">
                      Edit
                    </Link>
                    <button 
                      className="btn btn-outline btn-sm text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                      onClick={() => deleteProduct(product._id)}
                    >
                      Delete
                    </button>
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

export default SellerProducts;