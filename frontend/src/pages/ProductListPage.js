import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from '../utils/axios';
import { useCart } from '../context/CartContext';
import './ProductListPage.css';

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [priceRange, setPriceRange] = useState('');
  const { addToCart } = useCart();

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'port-services', label: 'Port Services' },
    { value: 'customs-clearance', label: 'Customs Clearance' },
    { value: 'container-handling', label: 'Container Handling' },
    { value: 'freight-forwarding', label: 'Freight Forwarding' },
    { value: 'warehousing', label: 'Warehousing' },
    { value: 'logistics', label: 'Logistics' },
    { value: 'documentation', label: 'Documentation' },
    { value: 'insurance', label: 'Insurance' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        
        if (category) params.append('category', category);
        if (keyword) params.append('keyword', keyword);
        if (priceRange) {
          const [min, max] = priceRange.split('-');
          if (min) params.append('minPrice', min.replace('+',''));
          if (max && !max.includes('+')) params.append('maxPrice', max);
        }
        
        const response = await axios.get(`/products?${params.toString()}`);
        setProducts(response.data.data.products);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, keyword]);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  if (loading) return <div className="text-center mt-6">Loading products...</div>;
  if (error) return <div className="text-center mt-6 text-red-500">Error: {error}</div>;

  return (
    <div className="product-list-page">
      <div className="container">
        <div className="section-header text-center mb-6">
          <h1 className="section-title">Port Services Marketplace</h1>
          <p className="section-description">
            Browse and book port services from verified providers across India
          </p>
        </div>

        {/* Filters */}
        <div className="filters mb-6">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select 
                className="form-input" 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Search</label>
              <input
                type="text"
                className="form-input"
                placeholder="Search services..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Price Range</label>
              <select 
                className="form-input" 
                value={priceRange} 
                onChange={(e) => setPriceRange(e.target.value)}
              >
                <option value="">All Prices</option>
                <option value="0-1000">₹0 - ₹1,000</option>
                <option value="1000-5000">₹1,000 - ₹5,000</option>
                <option value="5000-10000">₹5,000 - ₹10,000</option>
                <option value="10000+">₹10,000+</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="products-grid grid grid-cols-1 grid-cols-2-md grid-cols-3-lg gap-6">
          {products.map(product => (
            <div key={product._id} className="product-card slide-in-up">
              {product.images && product.images.length > 0 ? (
                <img src={product.images[0]} alt={product.name} className="product-card-image" />
              ) : (
                <div className="product-card-image placeholder">
                  <i data-lucide="package"></i>
                </div>
              )}
              <div className="product-card-content">
                <h3 className="product-card-title">{product.name}</h3>
                <p className="product-card-description">
                  {product.description.length > 100 
                    ? `${product.description.substring(0, 100)}...` 
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
                
                <div className="product-card-price">₹{Number(product.price).toLocaleString()}</div>
                
                <div className="product-seller-info flex items-center mt-2">
                  <div className="seller-avatar w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-2">
                    <span className="text-xs font-semibold">{product.seller.name.charAt(0)}</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="font-medium text-xs flex items-center">
                      {product.seller.name}
                      {product.seller.verification?.isVerified && (
                        <span className="verified-badge ml-1 text-xs" title="Verified Seller">
                          <i data-lucide="check-circle" className="w-3 h-3 mr-0.5"></i> Verified
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted">{product.seller.company?.name || 'Provider'}</div>
                  </div>
                </div>
                
                <div className="product-card-footer">
                  <Link to={`/product/${product._id}`} className="btn btn-outline btn-sm">
                    View Details
                  </Link>
                  <button 
                    className="btn btn-primary btn-sm" 
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="empty-state">
            <div className="empty-illustration">
              <i data-lucide="search"></i>
            </div>
            <h3>No services found</h3>
            <p>Try changing filters or browse all categories.</p>
            <button className="btn" onClick={() => { setCategory(''); setKeyword(''); setPriceRange(''); }}>
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductListPage;