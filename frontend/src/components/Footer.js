import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Footer Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="logo-icon">
                <i data-lucide="ship"></i>
              </div>
              <div className="logo-text">
                <h3 className="footer-logo-title">IMPORT VENTURES</h3>
                <p className="footer-logo-subtitle">Marketplace</p>
              </div>
            </div>
            <p className="footer-description">
              Your trusted partner for comprehensive port solutions across India. 
              Streamlining maritime logistics with innovation and expertise.
            </p>
          </div>

          {/* Footer Links */}
          <div className="footer-links">
            <div className="footer-section">
              <h4 className="footer-title">Marketplace</h4>
              <ul className="footer-list">
                <li><a href="/products" className="footer-link">All Products</a></li>
                <li><a href="/products?category=port-services" className="footer-link">Port Services</a></li>
                <li><a href="/products?category=customs-clearance" className="footer-link">Customs Clearance</a></li>
                <li><a href="/products?category=container-handling" className="footer-link">Container Handling</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4 className="footer-title">For Buyers</h4>
              <ul className="footer-list">
                <li><a href="/cart" className="footer-link">Shopping Cart</a></li>
                <li><a href="/orders" className="footer-link">My Orders</a></li>
                <li><a href="/wishlist" className="footer-link">Wishlist</a></li>
                <li><a href="/support" className="footer-link">Buyer Support</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4 className="footer-title">For Sellers</h4>
              <ul className="footer-list">
                <li><a href="/seller/dashboard" className="footer-link">Dashboard</a></li>
                <li><a href="/seller/products" className="footer-link">My Products</a></li>
                <li><a href="/seller/orders" className="footer-link">My Orders</a></li>
                <li><a href="/seller/analytics" className="footer-link">Analytics</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4 className="footer-title">Support</h4>
              <ul className="footer-list">
                <li><a href="/help" className="footer-link">Help Center</a></li>
                <li><a href="/contact" className="footer-link">Contact Us</a></li>
                <li><a href="/terms" className="footer-link">Terms of Service</a></li>
                <li><a href="/privacy" className="footer-link">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">&copy; 2024 Import Ventures Marketplace. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;