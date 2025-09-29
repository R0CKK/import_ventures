import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { useCart } from '../context/CartContext';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/products/${id}`);
        setProduct(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      navigate('/cart');
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product, quantity);
      navigate('/checkout');
    }
  };

  if (loading) return <div className="text-center mt-6">Loading product...</div>;
  if (error) return <div className="text-center mt-6 text-red-500">Error: {error}</div>;
  if (!product) return <div className="text-center mt-6">Product not found</div>;

  return (
    <div className="product-detail-page">
      <div className="container">
        <div className="product-detail-container">
          <div className="product-images-section">
            <div className="main-image">
              {product.images && product.images.length > 0 ? (
                <img src={product.images[0]} alt={product.name} className="w-full rounded-lg" />
              ) : (
                <div className="image-placeholder">
                  <i data-lucide="image" className="text-4xl text-muted"></i>
                  <p>No image available</p>
                </div>
              )}
            </div>
          </div>

          <div className="product-info-section">
            <div className="product-header">
              <h1 className="product-title">{product.name}</h1>
              <div className="product-meta">
                <div className="product-category text-secondary">
                  {product.category.replace('-', ' ').toUpperCase()}
                </div>
                <div className="product-ratings flex items-center">
                  <i data-lucide="star" className="text-yellow-400 mr-1"></i>
                  <span>{product.ratings?.average || 'N/A'} ({product.ratings?.count || 0} reviews)</span>
                </div>
              </div>
            </div>

            <div className="product-price mt-4">
              <span className="text-2xl font-bold text-secondary">₹{product.price.toLocaleString()}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="ml-2 text-muted line-through">₹{product.originalPrice.toLocaleString()}</span>
              )}
            </div>

            <div className="product-seller mt-4">
              <h3 className="text-lg font-semibold">Sold by</h3>
              <div className="seller-info flex items-center mt-2">
                <div className="seller-avatar w-10 h-10 rounded-full bg-muted flex items-center justify-center mr-3">
                  <span className="font-semibold">{product.seller.name.charAt(0)}</span>
                </div>
                <div>
                  <div className="font-medium">{product.seller.name}</div>
                  <div className="text-sm text-muted">{product.seller.company?.name || 'Service Provider'}</div>
                </div>
              </div>
            </div>

            <div className="product-location mt-4">
              <h3 className="text-lg font-semibold">Location</h3>
              <div className="flex items-center mt-2 text-muted">
                <i data-lucide="map-pin" className="mr-2"></i>
                <span>
                  {product.location?.port || 'N/A'}, {product.location?.city || 'India'}
                </span>
              </div>
            </div>

            <div className="product-description mt-6">
              <h3 className="text-lg font-semibold">Description</h3>
              <p className="mt-2 text-muted">{product.description}</p>
            </div>

            <div className="product-specifications mt-6">
              <h3 className="text-lg font-semibold">Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                {Object.entries(product.specifications || {}).map(([key, value]) => (
                  <div key={key} className="flex">
                    <div className="w-1/3 font-medium text-muted capitalize">{key}:</div>
                    <div className="w-2/3">{value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="product-actions mt-8">
              <div className="quantity-selector mb-4">
                <label className="block mb-2">Quantity</label>
                <div className="flex items-center">
                  <button 
                    className="quantity-btn" 
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  >
                    <i data-lucide="minus"></i>
                  </button>
                  <span className="mx-4 text-lg">{quantity}</span>
                  <button 
                    className="quantity-btn" 
                    onClick={() => setQuantity(prev => prev + 1)}
                  >
                    <i data-lucide="plus"></i>
                  </button>
                </div>
              </div>

              <div className="action-buttons">
                <button 
                  className="btn btn-primary w-full mb-3" 
                  onClick={handleBuyNow}
                >
                  Buy Now
                </button>
                <button 
                  className="btn btn-outline w-full" 
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
              </div>

              <div className="stock-info mt-4 text-center">
                {product.stock > 5 ? (
                  <span className="text-green-500">In Stock ({product.stock} available)</span>
                ) : product.stock > 0 ? (
                  <span className="text-yellow-500">Only {product.stock} left in stock</span>
                ) : (
                  <span className="text-red-500">Out of Stock</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;