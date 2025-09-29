import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../utils/axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and get user data
      const getUser = async () => {
        try {
          const response = await axios.get('/users/profile');
          setUser(response.data.data);
        } catch (error) {
          console.error('Error fetching user data:', error);
          localStorage.removeItem('token');
        } finally {
          setLoading(false);
        }
      };

      getUser();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/users/login', { email, password });
      const { data } = response.data;
      
      localStorage.setItem('token', data.token);
      setUser(data);
      
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (name, email, password, role = 'buyer') => {
    try {
      const response = await axios.post('/users/register', { name, email, password, role });
      const { data } = response.data;
      
      localStorage.setItem('token', data.token);
      setUser(data);
      
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateProfileInContext = (updatedData) => {
    if (user) {
      setUser(prevUser => {
        const nextUser = { ...prevUser, ...updatedData };
        if (updatedData && updatedData.profile) {
          nextUser.profile = {
            ...(prevUser?.profile || {}),
            ...updatedData.profile,
            company: {
              ...(prevUser?.profile?.company || {}),
              ...(updatedData.profile.company || {})
            },
            address: {
              ...(prevUser?.profile?.address || {}),
              ...(updatedData.profile.address || {})
            },
            taxInfo: {
              ...(prevUser?.profile?.taxInfo || {}),
              ...(updatedData.profile.taxInfo || {})
            }
          };
        }
        return nextUser;
      });
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateProfileInContext,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};