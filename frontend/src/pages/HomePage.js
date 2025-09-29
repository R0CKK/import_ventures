import React from 'react';
import { Link } from 'react-router-dom';
import { Anchor, TrendingUp, Shield, ArrowRight, Zap } from 'lucide-react';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      {/* Hero Section (modern, matches static index.html theme) */}
      <section className="hero">
        {/* Background visuals */}
        <div className="hero-bg">
          <img
            src="https://images.unsplash.com/photo-1719721763705-ef100c403712?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzaGlwcGluZyUyMHBvcnQlMjBjb250YWluZXJzfGVufDF8fHx8MTc1ODI3MzE1Nnww&ixlib=rb-4.1.0&q=80&w=1600"
            alt="Modern shipping port with containers"
            className="hero-image"
          />
          <div className="hero-overlay"></div>
          <div className="hero-overlay-gradient"></div>
        </div>

        {/* Animated accents */}
        <div className="hero-animation" aria-hidden>
          <div className="hero-circle-1"></div>
          <div className="hero-circle-2"></div>
        </div>

        <div className="container hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <Anchor size={16} />
              <span>India's Premier Port Solutions</span>
            </div>

            <h1 className="hero-title">
              <span className="hero-title-line1">Your Gateway to</span>
              <span className="hero-title-line2">Indian Ports</span>
            </h1>

            <p className="hero-subtitle">
              Streamline your import operations with our comprehensive marketplace. 
              Access real-time information, secure bookings, and expert guidance for major Indian ports.
            </p>

            {/* Stats */}
            <div className="hero-stats">
              <div className="stat-card stat-secondary">
                <div className="stat-icon"><Anchor size={24} /></div>
                <div className="stat-content">
                  <p className="stat-value">50+</p>
                  <p className="stat-label">Indian Ports</p>
                </div>
              </div>
              <div className="stat-card stat-primary">
                <div className="stat-icon"><TrendingUp size={24} /></div>
                <div className="stat-content">
                  <p className="stat-value">10K+</p>
                  <p className="stat-label">Successful Bookings</p>
                </div>
              </div>
              <div className="stat-card stat-secondary">
                <div className="stat-icon"><Shield size={24} /></div>
                <div className="stat-content">
                  <p className="stat-value">24/7</p>
                  <p className="stat-label">Support</p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="hero-cta">
              <Link to="/products" className="btn btn-primary btn-lg">
                Explore Ports
                <ArrowRight size={18} />
              </Link>
              <Link to="/register" className="btn btn-outline btn-lg">Become a Seller</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section features-section">
        <div className="container">
          <div className="section-header text-center mb-6">
            <h2 className="section-title">
              <span className="title-line1">Why Choose Our </span>
              <span className="title-line2" style={{background: 'linear-gradient(to right, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>Marketplace</span>
            </h2>
            <p className="section-description">
              We provide the most comprehensive platform for connecting port service providers with importers and logistics companies.
            </p>
          </div>

          <div className="grid grid-cols-1 grid-cols-2-md grid-cols-3-lg gap-6">
            <div className="feature-card">
              <div className="feature-icon primary">
                <Shield size={24} />
              </div>
              <h3 className="feature-title">Verified Providers</h3>
              <p className="feature-description">
                All service providers are thoroughly verified for quality and reliability.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon secondary">
                <Zap size={24} />
              </div>
              <h3 className="feature-title">Instant Booking</h3>
              <p className="feature-description">
                Book port services instantly with real-time availability and pricing.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon primary">
                <TrendingUp size={24} />
              </div>
              <h3 className="feature-title">Transparent Pricing</h3>
              <p className="feature-description">
                No hidden fees - all costs are clearly displayed upfront.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Services Section */}
      <section className="section services-section">
        <div className="container">
          <div className="section-header text-center mb-6">
            <h2 className="section-title">
              <span className="title-line1">Popular </span>
              <span className="title-line2" style={{background: 'linear-gradient(to right, var(--secondary), var(--primary))', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>Services</span>
            </h2>
            <p className="section-description">
              Explore our most popular port services from trusted providers.
            </p>
          </div>

          <div className="grid grid-cols-1 grid-cols-2-md grid-cols-3-lg gap-6">
            {/* Example service cards - these would be dynamically loaded in a real app */}
            <div className="product-card">
              <div className="product-card-content">
                <h3 className="product-card-title">Port Berth Booking</h3>
                <p className="product-card-description">
                  Secure berth allocation for your vessels at major Indian ports.
                </p>
                <div className="product-card-price">₹15,000</div>
                <div className="product-card-footer">
                  <span className="text-muted">Mumbai Port</span>
                  <Link to="/products/1" className="btn btn-outline btn-sm">View Details</Link>
                </div>
              </div>
            </div>

            <div className="product-card">
              <div className="product-card-content">
                <h3 className="product-card-title">Customs Clearance</h3>
                <p className="product-card-description">
                  Efficient customs clearance services for your cargo.
                </p>
                <div className="product-card-price">₹8,500</div>
                <div className="product-card-footer">
                  <span className="text-muted">Chennai Port</span>
                  <Link to="/products/2" className="btn btn-outline btn-sm">View Details</Link>
                </div>
              </div>
            </div>

            <div className="product-card">
              <div className="product-card-content">
                <h3 className="product-card-title">Container Handling</h3>
                <p className="product-card-description">
                  Professional container loading/unloading and storage services.
                </p>
                <div className="product-card-price">₹12,000</div>
                <div className="product-card-footer">
                  <span className="text-muted">JNPT</span>
                  <Link to="/products/3" className="btn btn-outline btn-sm">View Details</Link>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-6">
            <Link to="/products" className="btn btn-primary">
              View All Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;