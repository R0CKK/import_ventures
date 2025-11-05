import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import axios from '../utils/axios';

const AdminContext = createContext();

const initialState = {
  dashboardStats: null,
  users: { data: null, error: null },
  products: { data: null, error: null },
  loading: false,
  error: null
};

const adminReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case 'SET_DASHBOARD_STATS':
      return {
        ...state,
        dashboardStats: action.payload,
        loading: false
      };
    case 'SET_USERS':
      return {
        ...state,
        users: {
          data: action.payload,
          error: null
        },
        loading: false
      };
    case 'SET_PRODUCTS':
      return {
        ...state,
        products: {
          data: action.payload,
          error: null
        },
        loading: false
      };
    case 'UPDATE_USER':
      return {
        ...state,
        users: {
          ...state.users,
          data: {
            ...state.users.data,
            users: state.users.data?.users?.map(user => 
              user._id === action.payload._id ? action.payload : user
            ) || []
          }
        }
      };
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: {
          ...state.products,
          data: {
            ...state.products.data,
            products: state.products.data?.products?.map(product => 
              product._id === action.payload._id ? action.payload : product
            ) || []
          }
        }
      };
    case 'DELETE_USER':
      return {
        ...state,
        users: {
          ...state.users,
          data: {
            ...state.users.data,
            users: state.users.data?.users?.filter(user => user._id !== action.payload) || []
          }
        }
      };
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: {
          ...state.products,
          data: {
            ...state.products.data,
            products: state.products.data?.products?.filter(product => product._id !== action.payload) || []
          }
        }
      };
    default:
      return state;
  }
};

export const AdminProvider = ({ children }) => {
  const [state, dispatch] = useReducer(adminReducer, initialState);

  const getDashboardStats = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await axios.get('/admin/dashboard');
      if (response.data.success) {
        dispatch({ type: 'SET_DASHBOARD_STATS', payload: response.data.data });
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.data.message });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Error fetching dashboard stats' });
    }
  }, []);

  const getAllUsers = useCallback(async (page = 1, limit = 10, filters = {}) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const params = new URLSearchParams({
        page,
        limit,
        ...filters
      });
      const response = await axios.get(`/admin/users?${params}`);
      if (response.data.success) {
        dispatch({ type: 'SET_USERS', payload: response.data.data });
      } else {
        dispatch({ type: 'SET_USERS', payload: { data: null, error: response.data.message } });
      }
    } catch (error) {
      dispatch({ 
        type: 'SET_USERS', 
        payload: { data: null, error: error.response?.data?.message || 'Error fetching users' } 
      });
    }
  }, []);

  const getAllProducts = useCallback(async (page = 1, limit = 10, filters = {}) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const params = new URLSearchParams({
        page,
        limit,
        ...filters
      });
      const response = await axios.get(`/admin/products?${params}`);
      if (response.data.success) {
        dispatch({ type: 'SET_PRODUCTS', payload: response.data.data });
      } else {
        dispatch({ type: 'SET_PRODUCTS', payload: { data: null, error: response.data.message } });
      }
    } catch (error) {
      dispatch({ 
        type: 'SET_PRODUCTS', 
        payload: { data: null, error: error.response?.data?.message || 'Error fetching products' } 
      });
    }
  }, []);

  const updateUser = useCallback(async (userId, userData) => {
    try {
      const response = await axios.put(`/admin/users/${userId}`, userData);
      if (response.data.success) {
        dispatch({ type: 'UPDATE_USER', payload: response.data.data });
        return response.data;
      } else {
        return response.data;
      }
    } catch (error) {
      return error.response?.data || { success: false, message: 'Error updating user' };
    }
  }, []);

  const deleteUser = useCallback(async (userId) => {
    try {
      const response = await axios.delete(`/admin/users/${userId}`);
      if (response.data.success) {
        dispatch({ type: 'DELETE_USER', payload: userId });
        return response.data;
      } else {
        return response.data;
      }
    } catch (error) {
      return error.response?.data || { success: false, message: 'Error deleting user' };
    }
  }, []);

  const updateUserVerification = useCallback(async (userId, verify) => {
    try {
      const response = await axios.put(`/admin/users/${userId}/${verify ? 'verify' : 'unverify'}`);
      if (response.data.success) {
        dispatch({ type: 'UPDATE_USER', payload: response.data.data });
        return response.data;
      } else {
        return response.data;
      }
    } catch (error) {
      return error.response?.data || { success: false, message: `Error ${verify ? 'verifying' : 'unverifying'} user` };
    }
  }, []);

  const updateProduct = useCallback(async (productId, productData) => {
    try {
      const response = await axios.put(`/admin/products/${productId}`, productData);
      if (response.data.success) {
        dispatch({ type: 'UPDATE_PRODUCT', payload: response.data.data });
        return response.data;
      } else {
        return response.data;
      }
    } catch (error) {
      return error.response?.data || { success: false, message: 'Error updating product' };
    }
  }, []);

  const deleteProduct = useCallback(async (productId) => {
    try {
      const response = await axios.delete(`/admin/products/${productId}`);
      if (response.data.success) {
        dispatch({ type: 'DELETE_PRODUCT', payload: productId });
        return response.data;
      } else {
        return response.data;
      }
    } catch (error) {
      return error.response?.data || { success: false, message: 'Error deleting product' };
    }
  }, []);

  const updateProductVerification = useCallback(async (productId, verify) => {
    try {
      const response = await axios.put(`/admin/products/${productId}/${verify ? 'verify' : 'unverify'}`);
      if (response.data.success) {
        dispatch({ type: 'UPDATE_PRODUCT', payload: response.data.data });
        return response.data;
      } else {
        return response.data;
      }
    } catch (error) {
      return error.response?.data || { success: false, message: `Error ${verify ? 'verifying' : 'unverifying'} product` };
    }
  }, []);

  const contextValue = useMemo(() => ({
    ...state,
    getDashboardStats,
    getAllUsers,
    getAllProducts,
    updateUser,
    deleteUser,
    updateUserVerification,
    updateProduct,
    deleteProduct,
    updateProductVerification
  }), [state, getDashboardStats, getAllUsers, getAllProducts, updateUser, deleteUser, updateUserVerification, updateProduct, deleteProduct, updateProductVerification]);

  return (
    <AdminContext.Provider value={contextValue}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};