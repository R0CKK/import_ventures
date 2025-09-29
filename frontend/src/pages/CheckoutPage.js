import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from '../utils/axios';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'India',
    port: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Calculate totals
  const tax = cartTotal * 0.1;
  const shipping = cartTotal > 0 ? 100 : 0;
  const total = cartTotal + tax + shipping;

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Prepare order data
      const orderData = {
        orderItems: cartItems.map(item => ({
          product: item.product,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
          seller: item.seller
        })),
        shippingAddress,
        paymentMethod,
        itemsPrice: cartTotal,
        taxPrice: tax,
        shippingPrice: shipping,
        totalPrice: total
      };

      // Create order
      const response = await axios.post('/orders', orderData);
      
      // Clear cart after successful order
      clearCart();
      
      // Navigate to order confirmation page
      navigate(`/order/${response.data.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container text-center py-10">
        <i data-lucide="shopping-cart" className="text-4xl text-muted mx-auto"></i>
        <h3 className="text-xl mt-4">Your cart is empty</h3>
        <p className="text-muted mt-2">Add some items to your cart before checkout</p>
        <button 
          className="btn btn-primary mt-4"
          onClick={() => navigate('/products')}
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="section-title text-center mb-6">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="checkout-form">
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
            
            {error && (
              <div className="bg-red-500 text-white p-3 rounded mb-4">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={shippingAddress.fullName}
                    onChange={(e) => setShippingAddress({...shippingAddress, fullName: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Port</label>
                  <input
                    type="text"
                    className="form-input"
                    value={shippingAddress.port}
                    onChange={(e) => setShippingAddress({...shippingAddress, port: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group mb-4">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  className="form-input"
                  value={shippingAddress.address}
                  onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    className="form-input"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Postal Code</label>
                  <input
                    type="text"
                    className="form-input"
                    value={shippingAddress.postalCode}
                    onChange={(e) => setShippingAddress({...shippingAddress, postalCode: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Country</label>
                  <input
                    type="text"
                    className="form-input"
                    value={shippingAddress.country}
                    onChange={(e) => setShippingAddress({...shippingAddress, country: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <div className="space-y-2 mb-6">
                {['CARD', 'NET_BANKING', 'UPI', 'WALLET'].map(method => (
                  <label key={method} className="flex items-center space-x-3 p-3 border rounded cursor-pointer hover:bg-muted">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method}
                      checked={paymentMethod === method}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-primary"
                    />
                    <span className="capitalize">{method.replace('_', ' ')}</span>
                  </label>
                ))}
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading ? 'Processing...' : `Place Order - ₹${total.toLocaleString()}`}
              </button>
            </form>
          </div>
          
          <div className="checkout-summary">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="bg-card p-6 rounded-lg border border-border">
              {cartItems.map(item => (
                <div key={item.product} className="flex justify-between mb-3 pb-3 border-b border-border">
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted">Qty: {item.quantity} × ₹{item.price.toLocaleString()}</div>
                  </div>
                  <div className="text-right">₹{(item.price * item.quantity).toLocaleString()}</div>
                </div>
              ))}
              
              <div className="space-y-3 mt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>₹{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₹{shipping.toLocaleString()}</span>
                </div>
                <div className="border-t border-border pt-3 mt-3 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;