import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Header.css';

// Lucide icons
import { ShoppingCart, X, Package, Trash2, Menu, Ship } from 'lucide-react';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartRef = React.useRef(null);
  const { user, logout } = useAuth();
  const { cartItems, cartItemCount, cartTotal, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close cart dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setIsCartOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <Link to="/" className="logo" onClick={closeMobileMenu}>
            <div className="logo-icon">
              <Ship size={24} />
              <div className="logo-pulse"></div>
            </div>
            <div className="logo-text">
              <h1 className="logo-title">IMPORT VENTURES</h1>
              <p className="logo-subtitle">Marketplace</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="nav-desktop">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/products" className="nav-link">Products</Link>
            {user && user.role === 'seller' && (
              <Link to="/seller/dashboard" className="nav-link">Seller Dashboard</Link>
            )}
            {user && user.role === 'buyer' && (
              <Link to="/myorders" className="nav-link">My Orders</Link>
            )}
            {user && (
              <Link to="/profile" className="nav-link">Profile</Link>
            )}
          </nav>

          {/* CTA Buttons */}
          <div className="header-cta">
            {/* Cart Icon with Dropdown */}
            <div className="cart-dropdown-container" ref={cartRef}>
              <button 
                className="cart-icon-btn"
                onClick={() => setIsCartOpen(!isCartOpen)}
                aria-expanded={isCartOpen}
                aria-label="Shopping cart"
              >
                <ShoppingCart className="cart-icon" size={20} />
                {cartItemCount > 0 && (
                  <span className="cart-badge">{cartItemCount}</span>
                )}
              </button>
              
              {isCartOpen && (
                <div className="cart-dropdown">
                  <div className="cart-dropdown-header">
                    <h3>Your Cart ({cartItemCount} {cartItemCount === 1 ? 'item' : 'items'})</h3>
                    <button 
                      className="close-cart-btn"
                      onClick={() => setIsCartOpen(false)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                  
                  {cartItems.length === 0 ? (
                    <div className="cart-dropdown-empty">
                      <p>Your cart is empty</p>
                      <Link to="/products" className="btn btn-primary btn-sm" onClick={() => setIsCartOpen(false)}>
                        Browse Products
                      </Link>
                    </div>
                  ) : (
                    <>
                      <div className="cart-dropdown-items">
                        {cartItems.map(item => (
                          <div key={item.product} className="cart-dropdown-item">
                            <div className="cart-item-image">
                              {item.image ? (
                                <img src={item.image} alt={item.name} />
                              ) : (
                                <div className="image-placeholder">
                                  <Package size={20} />
                                </div>
                              )}
                            </div>
                            <div className="cart-item-details">
                              <h4 className="cart-item-name">{item.name}</h4>
                              <div className="cart-item-price">₹{item.price?.toLocaleString()}</div>
                              <div className="cart-item-quantity">
                                <span>Qty: {item.quantity}</span>
                              </div>
                            </div>
                            <div className="cart-item-actions">
                              <button 
                                className="remove-item-btn"
                                onClick={() => removeFromCart(item.product)}
                                aria-label="Remove item"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="cart-dropdown-footer">
                        <div className="cart-dropdown-total">
                          <span>Total: </span>
                          <span className="total-amount">₹{cartTotal?.toLocaleString()}</span>
                        </div>
                        <div className="cart-dropdown-buttons">
                          <Link 
                            to="/cart" 
                            className="btn btn-outline btn-block"
                            onClick={() => setIsCartOpen(false)}
                          >
                            View Cart
                          </Link>
                          <Link 
                            to="/checkout" 
                            className="btn btn-primary btn-block"
                            onClick={() => {
                              // Check if user is logged in
                              const token = localStorage.getItem('token');
                              if (!token) {
                                alert('Please login to checkout');
                                navigate('/login');
                                setIsCartOpen(false);
                                return;
                              }
                              setIsCartOpen(false);
                            }}
                          >
                            Checkout
                          </Link>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
            
            {!user ? (
              <>
                <Link to="/login" className="btn btn-outline">Login</Link>
                <Link to="/register" className="btn btn-primary">Register</Link>
              </>
            ) : (
              <button onClick={handleLogout} className="btn btn-outline">Logout</button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? (
              <X size={24} className="close-icon" />
            ) : (
              <Menu size={24} className="menu-icon" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="nav-mobile">
            <nav className="nav-mobile-content">
              <Link to="/" className="nav-link-mobile" onClick={closeMobileMenu}>Home</Link>
              <Link to="/products" className="nav-link-mobile" onClick={closeMobileMenu}>Products</Link>
              {!user ? (
                <>
                  <Link to="/login" className="nav-link-mobile" onClick={closeMobileMenu}>Login</Link>
                  <Link to="/register" className="nav-link-mobile" onClick={closeMobileMenu}>Register</Link>
                </>
              ) : (
                <>
                  <Link to="/cart" className="nav-link-mobile" onClick={closeMobileMenu}>
                    Cart 
                    {cartItemCount > 0 && <span className="mobile-cart-badge">({cartItemCount})</span>}
                  </Link>
                  {user.role === 'seller' && (
                    <Link to="/seller/dashboard" className="nav-link-mobile" onClick={closeMobileMenu}>Seller Dashboard</Link>
                  )}
                  {user.role === 'buyer' && (
                    <Link to="/myorders" className="nav-link-mobile" onClick={closeMobileMenu}>My Orders</Link>
                  )}
                  <Link to="/profile" className="nav-link-mobile" onClick={closeMobileMenu}>Profile</Link>
                  <button onClick={() => { handleLogout(); closeMobileMenu(); }} className="btn btn-outline">Logout</button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;