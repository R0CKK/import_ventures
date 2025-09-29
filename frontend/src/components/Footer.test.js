import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Footer from './Footer';

describe('Footer', () => {
  test('renders footer brand information', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    // Use more specific selectors to avoid multiple matches
    const footerBrand = screen.getByRole('heading', { name: /IMPORT VENTURES/i, level: 3 });
    expect(footerBrand).toBeInTheDocument();

    const brandSubtitle = screen.getByText('Marketplace', { selector: '.footer-logo-subtitle' });
    expect(brandSubtitle).toBeInTheDocument();
  });

  test('renders marketplace links', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    const marketplaceTitle = screen.getByRole('heading', { name: 'Marketplace', level: 4 });
    expect(marketplaceTitle).toBeInTheDocument();

    const allProducts = screen.getByText(/All Products/i);
    expect(allProducts).toBeInTheDocument();

    const portServices = screen.getByText(/Port Services/i);
    expect(portServices).toBeInTheDocument();

    const customsClearance = screen.getByText(/Customs Clearance/i);
    expect(customsClearance).toBeInTheDocument();

    const containerHandling = screen.getByText(/Container Handling/i);
    expect(containerHandling).toBeInTheDocument();
  });

  test('renders for buyers links', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    const buyersTitle = screen.getByRole('heading', { name: /For Buyers/i });
    expect(buyersTitle).toBeInTheDocument();

    const shoppingCart = screen.getByText(/Shopping Cart/i);
    expect(shoppingCart).toBeInTheDocument();

    // Use a more specific selector for My Orders to avoid matching seller's My Orders
    const myOrders = screen.getByText((content, element) => {
      return content.includes('My Orders') && element.getAttribute('href') === '/orders';
    });
    expect(myOrders).toBeInTheDocument();
  });

  test('renders for sellers links', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    const sellersTitle = screen.getByRole('heading', { name: /For Sellers/i });
    expect(sellersTitle).toBeInTheDocument();

    const dashboardLink = screen.getByText(/Dashboard/i);
    expect(dashboardLink).toBeInTheDocument();

    const myProducts = screen.getByText(/My Products/i);
    expect(myProducts).toBeInTheDocument();
  });

  test('renders support links', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    const supportTitle = screen.getByRole('heading', { name: /Support/i });
    expect(supportTitle).toBeInTheDocument();

    const helpCenter = screen.getByText(/Help Center/i);
    expect(helpCenter).toBeInTheDocument();

    const contactUs = screen.getByText(/Contact Us/i);
    expect(contactUs).toBeInTheDocument();
  });

  test('renders copyright information', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    const copyright = screen.getByText(/© 2024 Import Ventures Marketplace. All rights reserved./i);
    expect(copyright).toBeInTheDocument();
  });
});