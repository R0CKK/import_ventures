import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { AuthProvider } from '../context/AuthContext';
import Header from './Header';

// Mock the AuthContext
const MockAuthProvider = ({ children, user = null }) => {
  return (
    <AuthProvider value={{ user, login: jest.fn(), logout: jest.fn(), register: jest.fn() }}>
      {children}
    </AuthProvider>
  );
};

// Mock the useAuth hook
jest.mock('../context/AuthContext', () => ({
  ...jest.requireActual('../context/AuthContext'),
  useAuth: jest.fn(),
}));

describe('Header', () => {
  beforeEach(() => {
    // Reset the mock before each test
    require('../context/AuthContext').useAuth.mockReturnValue({
      user: null,
      logout: jest.fn(),
    });
  });

  test('renders logo and navigation links when not authenticated', () => {
    render(
      <MemoryRouter>
        <MockAuthProvider>
          <Header />
        </MockAuthProvider>
      </MemoryRouter>
    );

    const logoTitle = screen.getByRole('link', { name: /IMPORT VENTURES/i });
    expect(logoTitle).toBeInTheDocument();

    const homeLink = screen.getByRole('link', { name: /Home/i });
    expect(homeLink).toBeInTheDocument();

    const productsLink = screen.getByRole('link', { name: /Products/i });
    expect(productsLink).toBeInTheDocument();

    const loginBtn = screen.getByRole('link', { name: /Login/i });
    expect(loginBtn).toBeInTheDocument();

    const registerBtn = screen.getByRole('link', { name: /Register/i });
    expect(registerBtn).toBeInTheDocument();
  });

  test('renders logout button when authenticated', () => {
    require('../context/AuthContext').useAuth.mockReturnValue({
      user: { name: 'John Doe', role: 'buyer', email: 'john@example.com' },
      logout: jest.fn(),
    });

    render(
      <MemoryRouter>
        <MockAuthProvider user={{ name: 'John Doe', role: 'buyer', email: 'john@example.com' }}>
          <Header />
        </MockAuthProvider>
      </MemoryRouter>
    );

    const logoutBtn = screen.getByRole('button', { name: /Logout/i });
    expect(logoutBtn).toBeInTheDocument();

    const loginBtn = screen.queryByRole('link', { name: /Login/i });
    expect(loginBtn).not.toBeInTheDocument();

    const registerBtn = screen.queryByRole('link', { name: /Register/i });
    expect(registerBtn).not.toBeInTheDocument();
  });

  test('renders seller dashboard link when user is a seller', () => {
    require('../context/AuthContext').useAuth.mockReturnValue({
      user: { name: 'Jane Doe', role: 'seller', email: 'jane@example.com' },
      logout: jest.fn(),
    });

    render(
      <MemoryRouter>
        <MockAuthProvider user={{ name: 'Jane Doe', role: 'seller', email: 'jane@example.com' }}>
          <Header />
        </MockAuthProvider>
      </MemoryRouter>
    );

    const sellerDashboardLink = screen.getByRole('link', { name: /Seller Dashboard/i });
    expect(sellerDashboardLink).toBeInTheDocument();
  });

  test('does not render seller dashboard link when user is a buyer', () => {
    require('../context/AuthContext').useAuth.mockReturnValue({
      user: { name: 'John Doe', role: 'buyer', email: 'john@example.com' },
      logout: jest.fn(),
    });

    render(
      <MemoryRouter>
        <MockAuthProvider user={{ name: 'John Doe', role: 'buyer', email: 'john@example.com' }}>
          <Header />
        </MockAuthProvider>
      </MemoryRouter>
    );

    const sellerDashboardLink = screen.queryByRole('link', { name: /Seller Dashboard/i });
    expect(sellerDashboardLink).not.toBeInTheDocument();
  });
});