import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './CartPage.css';

const CartPage = () => {
  const { cartItems, cartTotal, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to checkout');
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="section-title text-center mb-6">Your Shopping Cart</h1>
        
        {cartItems.length === 0 ? (
          <div className="text-center py-10">
            <i data-lucide="shopping-cart" className="text-4xl text-muted mx-auto"></i>
            <h3 className="text-xl mt-4">Your cart is empty</h3>
            <p className="text-muted mt-2">Add some port services to your cart</p>
            <Link to="/products" className="btn btn-primary mt-4">
              Browse Services
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="cart-items">
                {cartItems.map(item => (
                  <div key={item.product} className="cart-item">
                    <div className="cart-item-image">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />
                      ) : (
                        <div className="image-placeholder bg-muted flex items-center justify-center rounded">
                          <i data-lucide="package" className="text-2xl text-foreground"></i>
                        </div>
                      )}
                    </div>
                    
                    <div className="cart-item-details flex-1">
                      <h3 className="cart-item-title">{item.name}</h3>
                      <div className="cart-item-price">₹{item.price.toLocaleString()}</div>
                      
                      <div className="cart-item-quantity">
                        <span>Quantity: </span>
                        <div className="flex items-center">
                          <button 
                            className="quantity-btn" 
                            onClick={() => updateQuantity(item.product, item.quantity - 1)}
                          >
                            <i data-lucide="minus"></i>
                          </button>
                          <span className="mx-3">{item.quantity}</span>
                          <button 
                            className="quantity-btn" 
                            onClick={() => updateQuantity(item.product, item.quantity + 1)}
                          >
                            <i data-lucide="plus"></i>
                          </button>
                        </div>
                      </div>
                      
                      <button 
                        className="btn btn-outline btn-sm mt-2"
                        onClick={() => removeFromCart(item.product)}
                      >
                        Remove
                      </button>
                    </div>
                    
                    <div className="cart-item-total text-right">
                      <div className="font-semibold">₹{(item.price * item.quantity).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="cart-summary">
              <div className="bg-card p-6 rounded-lg border border-border">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>₹{(cartTotal * 0.1).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>₹{(cartTotal > 0 ? 100 : 0).toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="border-t border-border pt-3 mt-3 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{(cartTotal + (cartTotal * 0.1) + (cartTotal > 0 ? 100 : 0)).toLocaleString()}</span>
                </div>
                
                <button 
                  className="btn btn-primary w-full mt-4"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </button>
                
                <Link to="/products" className="btn btn-outline w-full mt-2">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;