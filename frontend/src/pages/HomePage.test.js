import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import HomePage from './HomePage';

describe('HomePage', () => {
  test('renders hero section with title and subtitle', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    const heroTitle = screen.getByRole('heading', { name: /Your Gateway to/i });
    expect(heroTitle).toBeInTheDocument();
    
    const heroSubtitle = screen.getByText(/Discover and book port services from verified providers/i);
    expect(heroSubtitle).toBeInTheDocument();
  });

  test('renders features section', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    const featuresTitle = screen.getByRole('heading', { name: /Why Choose Our Marketplace/i });
    expect(featuresTitle).toBeInTheDocument();
    
    // Use more specific selectors to target the feature titles
    const verifiedProviders = screen.getByRole('heading', { name: /Verified Providers/i, level: 3 });
    expect(verifiedProviders).toBeInTheDocument();
    
    const instantBooking = screen.getByRole('heading', { name: /Instant Booking/i, level: 3 });
    expect(instantBooking).toBeInTheDocument();
    
    const transparentPricing = screen.getByRole('heading', { name: /Transparent Pricing/i, level: 3 });
    expect(transparentPricing).toBeInTheDocument();
  });

  test('renders services section', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    const servicesTitle = screen.getByRole('heading', { name: /Popular Services/i });
    expect(servicesTitle).toBeInTheDocument();
    
    const portBerthBooking = screen.getByRole('heading', { name: /Port Berth Booking/i, level: 3 });
    expect(portBerthBooking).toBeInTheDocument();
    
    const customsClearance = screen.getByRole('heading', { name: /Customs Clearance/i, level: 3 });
    expect(customsClearance).toBeInTheDocument();
    
    const containerHandling = screen.getByRole('heading', { name: /Container Handling/i, level: 3 });
    expect(containerHandling).toBeInTheDocument();
  });

  test('renders CTA buttons', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    const browseServicesBtn = screen.getByRole('link', { name: /Browse Services/i });
    expect(browseServicesBtn).toBeInTheDocument();
    
    const becomeSellerBtn = screen.getByRole('link', { name: /Become a Seller/i });
    expect(becomeSellerBtn).toBeInTheDocument();
  });
});