import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { AuthProvider } from '../context/AuthContext';
import LoginPage from './LoginPage';

// Mock axios
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() }
    },
    post: jest.fn()
  })),
  post: jest.fn()
}));

// Create a wrapper component that includes the AuthProvider
const Wrapper = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>
      {children}
    </AuthProvider>
  </BrowserRouter>
);

describe('LoginPage', () => {
  test('renders login form with email and password fields', () => {
    render(
      <Wrapper>
        <LoginPage />
      </Wrapper>
    );

    const title = screen.getByRole('heading', { name: /Login to Your Account/i });
    expect(title).toBeInTheDocument();

    const emailLabel = screen.getByText(/Email Address/i);
    expect(emailLabel).toBeInTheDocument();

    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    expect(emailInput).toBeInTheDocument();

    const passwordLabel = screen.getByText(/Password/i);
    expect(passwordLabel).toBeInTheDocument();

    const passwordInput = screen.getByPlaceholderText(/Enter your password/i);
    expect(passwordInput).toBeInTheDocument();

    const loginButton = screen.getByRole('button', { name: /Login/i });
    expect(loginButton).toBeInTheDocument();
  });

  test('renders register link', () => {
    render(
      <Wrapper>
        <LoginPage />
      </Wrapper>
    );

    const registerLink = screen.getByRole('link', { name: /Register/i });
    expect(registerLink).toBeInTheDocument();
  });
});